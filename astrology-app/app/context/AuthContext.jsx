import { createContext, useContext, useEffect, useState } from "react";
import {
  validateStoredToken,
  saveToken,
  removeToken,
  authLogout,
  decodeToken,
} from "../../services/auth";
import { setApiLogoutCallback } from "../../services/api";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken]   = useState(null);
  const [user, setUser]     = useState(null);   // decoded JWT payload
  const [loading, setLoading] = useState(true);

  // Register a logout callback with the API layer so that any 401
  // response automatically clears the session without needing to
  // thread the logout function through every screen.
  useEffect(() => {
    setApiLogoutCallback(_clearSession);
  }, []);

  useEffect(() => {
    bootstrap();
  }, []);

  const bootstrap = async () => {
    try {
      const storedToken = await validateStoredToken();
      if (storedToken) {
        setToken(storedToken);
        setUser(decodeToken(storedToken));
      }
    } catch (err) {
      console.warn('AuthContext bootstrap error:', err);
    } finally {
      setLoading(false);
    }
  };

  /** Internal helper — clears local state without hitting the server. */
  const _clearSession = async () => {
    await removeToken();
    setToken(null);
    setUser(null);
  };

  /**
   * Call after a successful login / register.
   * Persists the token, decodes user info, and updates auth state.
   */
  const login = async (newToken) => {
    await saveToken(newToken);
    setToken(newToken);
    setUser(decodeToken(newToken));
  };

  /**
   * Clears the token from storage and auth state.
   * Attempts a best-effort server-side logout first.
   */
  const logout = async () => {
    try {
      await authLogout();
    } catch (_) {
      // best-effort server-side invalidation — ignore errors
    } finally {
      await _clearSession();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// Required by Expo Router — context files must NOT be routes,
// but expo-router scans every file in `app/`. Exporting a no-op
// default prevents the "missing default export" warning while
// keeping this file from rendering as a screen.
export default AuthProvider;