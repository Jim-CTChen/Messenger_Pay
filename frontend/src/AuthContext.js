import React, { useState, useEffect, createContext } from "react";
import agent from "./agent";

const AuthContext = createContext(null);

export { AuthContext };

export default ({ children }) => {
  const [currentUser, setCurrentUser] = useState({
    name: null,
    username: null,
    password: null,
    isLogin: false
  });

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
