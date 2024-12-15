import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true",
  );
  const [authToken, setAuthToken] = useState(
    localStorage.getItem("token") || null,
  );
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("user")) || null,
  );

  const logIn = (token, user) => {
    const userData = {
      name: user.name,
      email: user.email,
      bio: user.bio || "The user dont have a bio",
      avatar: user.avatar?.url || "https://via.placeholder.com/150",
      banner: user.banner?.ulr || "https://via.placeholder.com/600x200",
    };

    setIsLoggedIn(true);
    setAuthToken(token);
    setUserInfo(userData);

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("token", token);
    localStorage.setItem("userData", JSON.stringify(userData));
  };

  const logOut = () => {
    setIsLoggedIn(false);
    setAuthToken(null);
    setUserInfo(null);

    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, logIn, logOut, authToken, userInfo }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using AuthContext
export const useAuth = () => useContext(AuthContext);
