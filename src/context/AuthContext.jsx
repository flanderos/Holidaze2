import React, { createContext, useContext, useState } from "react";
import { API_URL, API_KEY } from "../config";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true",
  );
  const [authToken, setAuthToken] = useState(
    localStorage.getItem("token") || null,
  );
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("userData")) || null,
  );

  const [isVenueManager, setIsVenueManager] = useState(
    localStorage.getItem("isVenueManager") === "true",
  );

  const logIn = async (token, userName) => {
    try {
      setAuthToken(token);
      localStorage.setItem("token", token);

      // Fetch profile data using userName
      const response = await fetch(`${API_URL}/profiles/${userName.name}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const data = await response.json();

      const userData = {
        name: data.data.name,
        email: data.data.email,
        bio: data.data.bio || "No bio available",
        avatar: data.data.avatar?.url || "https://via.placeholder.com/150",
        banner: data.data.banner?.url || "https://via.placeholder.com/600x200",
        venueManager: data.data.venueManager,
      };

      setUserInfo(userData);
      setIsLoggedIn(true);
      setIsVenueManager(data.data.venueManager);

      // Save data to localStorage
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userData", JSON.stringify(userData));
      localStorage.setItem("isVenueManager", String(data.data.venueManager));
    } catch (error) {
      console.error("Failed to get user profiles:", error);
      console.log("Username:", userName.name);
      logOut();
      throw error;
    }
  };

  const logOut = () => {
    setIsLoggedIn(false);
    setAuthToken(null);
    setUserInfo(null);
    setIsVenueManager(false);

    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    localStorage.removeItem("isVenueManager");
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        logIn,
        logOut,
        authToken,
        userInfo,
        isVenueManager,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
