import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from "jwt-decode";
import { post } from "./api";

// ── Auth ──────────────────────────────────────────────────────────────────────

/**
 * Register a new user.
 * @param {{ email, password, name, birthDate, birthCity, lagna, gender }} data
 * @returns {{ token: string, user: UserProfile }}
 */
export const authRegister = async (data) => post('/api/auth/register', data);

/**
 * Login with email + password.
 * @param {{ email: string, password: string }} credentials
 * @returns {{ token: string, user: UserProfile }}
 */
export const authLogin = async (credentials) => post('/api/auth/login', credentials);

/**
 * Logout — invalidates the JWT on the server.
 * @returns {{ message: string }}
 */
export const authLogout = async () => {
    await removeToken();
    return { message: 'Logged out successfully' };
};


export const saveToken = async (token) => {
    await SecureStore.setItemAsync('token', token);
};


export const getToken = async () => {
    return await SecureStore.getItemAsync('token');
};


export const removeToken = async () => {
    await SecureStore.deleteItemAsync('token');
};

export const isTokenExpired = (token) => {
    try {
        if (!token) return true;
        const decoded = jwtDecode(token);
        return decoded.exp * 1000 < Date.now();
    } catch (error) {
        console.warn('Error decoding token:', error);
        return true;
    }
};

/**
 * Safely decode a JWT and return its payload.
 * Returns null if the token is missing or malformed.
 * Does NOT validate expiry — use isTokenExpired() for that.
 */
export const decodeToken = (token) => {
    try {
        if (!token) return null;
        return jwtDecode(token);
    } catch {
        return null;
    }
};

export const validateStoredToken = async () => {
    const token = await getToken();
    if (!token) return null;
    if (isTokenExpired(token)) {
        await removeToken();
        return null;
    }
    return token;
};