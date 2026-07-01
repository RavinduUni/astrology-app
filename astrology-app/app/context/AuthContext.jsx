import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  validateStoredToken,
  saveToken,
  removeToken,
  authLogout,
  decodeToken,
} from "../../services/auth";
import { setApiLogoutCallback, getHomeDashboard, getReportsDashboard } from "../../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);   // decoded JWT payload or user object from login
  const [loading, setLoading] = useState(true);

  // Dashboard data — fetched once per login session
  const [homeData, setHomeData] = useState(null);
  const [reportsData, setReportsData] = useState(null);
  const [homeDataLoading, setHomeDataLoading] = useState(false);
  const [reportsDataLoading, setReportsDataLoading] = useState(false);

  // Register a logout callback with the API layer so that any 401
  // response automatically clears the session.
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
        // Re-hydrate dashboard data on app re-open
        fetchDashboardData();
      }
    } catch (err) {
      console.warn("AuthContext bootstrap error:", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetches Home and Reports dashboard data with polling.
   * If the backend returns { pending: true }, it means data is generating,
   * so it waits 3 seconds and tries again (up to 15 times).
   */
  const fetchDashboardData = useCallback(() => {
    setHomeDataLoading(true);
    setReportsDataLoading(true);

    const pollWithRetry = async (apiCall, setter, loadingSetter, retries = 15) => {
      try {
        for (let i = 0; i < retries; i++) {
          const res = await apiCall();
          if (res.pending) {
            // Wait 3 seconds and try again
            await new Promise((r) => setTimeout(r, 3000));
            continue;
          }
          setter(res);
          loadingSetter(false);
          return;
        }
        console.warn("fetchDashboardData — polling timed out");
        loadingSetter(false);
      } catch (err) {
        console.warn("fetchDashboardData — error:", err.message || err);
        loadingSetter(false);
      }
    };

    // Fire and forget polling for both
    pollWithRetry(getHomeDashboard, setHomeData, setHomeDataLoading);
    pollWithRetry(getReportsDashboard, setReportsData, setReportsDataLoading);
  }, []);

  /** Internal helper — clears local state without hitting the server. */
  const _clearSession = async () => {
    await removeToken();
    setToken(null);
    setUser(null);
    setHomeData(null);
    setReportsData(null);
  };

  /**
   * Merges updated user fields into context.
   * Call this after a successful profile save so headers update instantly.
   */
  const updateUserData = (updatedFields) => {
    setUser((prev) => (prev ? { ...prev, ...updatedFields } : updatedFields));
  };

  /**
   * Call after a successful login / register.
   * Persists the token, decodes user info, updates auth state,
   * and triggers a single dashboard data fetch.
   */
  const login = async (newToken, userData) => {
    await saveToken(newToken);
    setToken(newToken);
    setUser(userData);
    // Fetch dashboard data in the background — screens show skeletons until ready
    fetchDashboardData();
  };

  /**
   * Clears the token from storage and auth state.
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

  /**
   * Force refresh dashboard data (e.g. user pulls to refresh).
   */
  const refreshDashboardData = useCallback(() => {
    setHomeData(null);
    setReportsData(null);
    return fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        isAuthenticated: !!token,
        login,
        logout,
        updateUserData,
        // Dashboard data
        homeData,
        reportsData,
        homeDataLoading,
        reportsDataLoading,
        refreshDashboardData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// Required by Expo Router — context files must NOT be routes.
export default AuthProvider;