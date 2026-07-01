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
   * Fetches Home and Reports dashboard data in parallel.
   * Called once after login (or on bootstrap if token exists).
   * Subsequent calls within the same day are instant (server cache).
   */
  const fetchDashboardData = useCallback(async () => {
    setHomeDataLoading(true);
    setReportsDataLoading(true);

    // Fetch both dashboards in parallel
    const [homeResult, reportsResult] = await Promise.allSettled([
      getHomeDashboard(),
      getReportsDashboard(),
    ]);

    if (homeResult.status === "fulfilled") {
      setHomeData(homeResult.value);
    } else {
      console.warn("fetchDashboardData — home error:", homeResult.reason);
    }
    setHomeDataLoading(false);

    if (reportsResult.status === "fulfilled") {
      setReportsData(reportsResult.value);
    } else {
      console.warn("fetchDashboardData — reports error:", reportsResult.reason);
    }
    setReportsDataLoading(false);
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