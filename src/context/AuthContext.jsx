import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true",
  );

  const logIn = () => {
    localStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true);
  };

  const logOut = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userProfile");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
