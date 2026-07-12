import { createContext, useState } from "react";

export const AuthContext = createContext();

// Returns the stored token only if it is a real JWT string.
// Rejects null, undefined, and the literal string "undefined" / "null"
// that localStorage produces when those values are stored accidentally.
export function getStoredToken() {
  const raw = localStorage.getItem("token");
  if (!raw || raw === "undefined" || raw === "null") return null;
  return raw;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")) || null; }
    catch { return null; }
  });

  const [token, setToken] = useState(() => getStoredToken());

  const login = (userData, userToken) => {
    // Never persist a missing or invalid token
    if (!userToken || userToken === "undefined" || userToken === "null") {
      console.error("login() called with invalid token — aborting storage", userToken);
      return;
    }
    setUser(userData);
    setToken(userToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}