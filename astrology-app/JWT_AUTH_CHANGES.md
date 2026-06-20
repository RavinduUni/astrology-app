# JWT Authentication — Changes & How It Works

## Overview of the Token Flow

```
1. User submits login/register form
2. Server returns a signed JWT (e.g. { token: "eyJ..." })
3. login(token) → saveToken() stores it in SecureStore (encrypted, OS-level secure storage)
4. AuthContext updates token + user state → app re-renders as authenticated
5. Every API request reads the token from SecureStore and attaches it as:
      Authorization: Bearer <token>
6. If the server returns 401, the logout callback fires automatically
7. On app restart, bootstrap() checks SecureStore:
      - No token → show login screen
      - Token found but expired → delete it, show login screen
      - Token valid → restore session silently
```

---

## Files Changed

### `services/api.js`

**Problem 1 — `get`, `post`, `put` were not exported**
`auth.js` imports `{ post }` from `./api`, but those functions were declared with `const` (no `export`), causing a silent `undefined` import and making every auth call fail.

**Fix:** Added `export` keyword to all three:
```js
export const get  = (path)       => request('GET',  path);
export const post = (path, body) => request('POST', path, body);
export const put  = (path, body) => request('PUT',  path, body);
```

**Problem 2 — No 401 auto-logout**
When a token expired server-side mid-session, API calls would throw a generic HTTP error and the user would be stuck — the stale token was never cleared.

**Fix:** Added a `_logoutCallback` slot and a `setApiLogoutCallback(cb)` export. Any 401 response now calls that callback before throwing:
```js
if (res.status === 401) {
  if (_logoutCallback) _logoutCallback();
  throw new Error('Session expired. Please log in again.');
}
```
`AuthContext` registers its `_clearSession` function into this slot on mount, so the session cleanup is guaranteed without coupling every screen to auth logic.

---

### `services/auth.js`

**Change — Added `decodeToken()` helper**
`AuthContext` now exposes a `user` object (the decoded JWT payload) so screens can read `user.id`, `user.name`, etc. without an extra API call.

```js
export const decodeToken = (token) => {
  try {
    if (!token) return null;
    return jwtDecode(token);   // from the 'jwt-decode' package
  } catch {
    return null;
  }
};
```
This is safe — it only base64-decodes the payload; it never trusts the result for security decisions (expiry is still checked by `isTokenExpired`).

---

### `app/context/AuthContext.jsx`

**Problem 1 — Duplicate imports**
`authLogout` was imported on a separate `import` line from the same `../../services/auth` module. This is harmless but messy and confusing.

**Fix:** Merged into a single import statement.

**Change 1 — Wires up the 401 auto-logout**
```js
useEffect(() => {
  setApiLogoutCallback(_clearSession);
}, []);
```
This runs once on mount and tells the API layer "when you see a 401, call _clearSession for me." It means every authenticated screen gets automatic session expiry handling for free.

**Change 2 — Exposes `user` from the context**
```js
const [user, setUser] = useState(null);
// set on login / bootstrap:
setUser(decodeToken(newToken));
```
Consumers can now do:
```js
const { user } = useAuth();
console.log(user.id, user.name, user.email);
```

**Change 3 — Extracted `_clearSession` helper**
The token-clearing logic (delete from SecureStore + reset state) is now a reusable internal function used by both `logout()` and the 401 callback, avoiding duplication.

---

### `app/screens/ChatScreen.jsx`

**Problem — `useChat()` called with no `userId`**
The hook signature is `useChat(userId, conversationId)`. Without a userId, every chat message sent to the API had `userId: undefined`, meaning the server could not associate the conversation with the logged-in user.

**Fix:** Import `useAuth` and pass the decoded user ID:
```js
const { user } = useAuth();
// ...
} = useChat(user?.id);
```
`user?.id` is `undefined` safely while the auth state is still loading, and becomes the real user ID once authentication is confirmed.

---

## How the Token Is Stored

| What                  | Where                                     |
|-----------------------|-------------------------------------------|
| Raw JWT string        | `expo-secure-store` key `"token"`         |
| Storage encryption    | OS keychain (iOS) / Android Keystore      |
| Decoded payload       | React state (`AuthContext.user`)          |
| Authorization header  | Attached per-request in `api.js`          |

**Why SecureStore?**  
`AsyncStorage` is unencrypted — any other app with file access on a rooted device could read it. `expo-secure-store` uses the platform's hardware-backed secure enclave, making it the correct choice for JWTs.

---

## Token Lifecycle

```
App starts
  └─ bootstrap()
       ├─ getToken() from SecureStore
       ├─ isTokenExpired(token)?
       │     YES → removeToken(), redirect to /auth/login
       │     NO  → setToken + setUser, redirect to /(tabs)
       └─ loading = false

User logs in
  └─ authLogin({ email, password })  →  POST /api/auth/login
       └─ returns { token }
            └─ login(token)
                 ├─ saveToken(token)     → SecureStore
                 ├─ setToken(token)      → React state
                 └─ setUser(decodeToken) → React state

Any API call
  └─ reads token from SecureStore
       ├─ 200 OK → return data
       ├─ 4xx/5xx (not 401) → throw Error(message)
       └─ 401 Unauthorized
            └─ _logoutCallback() → _clearSession()
                 ├─ removeToken() → SecureStore
                 ├─ setToken(null)
                 └─ setUser(null)  → router redirects to /auth/login

User logs out
  └─ logout()
       ├─ authLogout()   → POST /api/auth/logout (best-effort)
       └─ _clearSession() → removes token, clears state
```
