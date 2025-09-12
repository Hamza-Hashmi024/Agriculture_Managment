import { createContext, useState, useEffect } from "react";
import { Login, GetProfile, Logout } from "../Api/Api";
import { setTokens } from "../Api/http"; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  });

  // ✅ Auto load profile if token exists
  useEffect(() => {
    if (accessToken && !user) {
      GetProfile()
        .then((profile) => {
          console.log("Profile loaded:", profile);
          setUser(profile);
          localStorage.setItem("user", JSON.stringify(profile));
        })
        .catch(() => logout());
    }
  }, [accessToken]);

  // ✅ Sync user in localStorage
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

      // Save tokens properly
      setTokens(data.accessToken, data.refreshToken);
      setAccessToken(data.accessToken);

      // Profile load
      const profile = await GetProfile();
      setUser(profile);
      localStorage.setItem("user", JSON.stringify(profile));

      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
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

    setTokens(null, null);
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user,
        login,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};