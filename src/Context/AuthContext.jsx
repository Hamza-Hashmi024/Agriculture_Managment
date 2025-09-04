import { createContext, useState, useEffect } from "react";
import { Login, GetProfile, RefreshToken, Logout } from "../Api/Api";
import { setTokens } from "../Api/http"; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  });

  // Auto load profile if token exists
  useEffect(() => {
    if (accessToken && !user) {
      GetProfile()
        .then((profile) => {
          setUser(profile);
          localStorage.setItem("user", JSON.stringify(profile));
        })
        .catch(() => logout());
    }
  }, [accessToken]);

  // Keep user in localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // ✅ Login
  const login = async (email, password) => {
    try {
      const data = await Login(email, password);

      // Tokens
      setAccessToken(data.accessToken);
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      // Profile
      const profile = await GetProfile();
      setUser(profile);
      localStorage.setItem("user", JSON.stringify(profile));

      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  // ✅ Refresh Token
  const handleRefresh = async () => {
    try {
      const rToken = localStorage.getItem("refreshToken");
      if (!rToken) return logout();

      const data = await RefreshToken(rToken);

      setAccessToken(data.accessToken);
      localStorage.setItem("accessToken", data.accessToken , data.refreshToken);

      return data.accessToken; // return new token
    } catch (error) {
      console.error("Token refresh failed:", error);
      logout();
      return null;
    }
  };

  // ✅ Logout
  const logout = async () => {
    try {
      const rToken = localStorage.getItem("refreshToken");
      if (rToken) await Logout(rToken);
    } catch (err) {
      console.warn("Logout API failed:", err);
    }

    setAccessToken(null);
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user,
        login,
        logout,
        handleRefresh,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};