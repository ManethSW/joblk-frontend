"use client"
import { createContext, useContext, useState } from 'react';

// Create a UserContext
const UserContext = createContext();

// Create a custom hook to use the UserContext, this is just for convenience
export const useUser = () => useContext(UserContext);

export default UserContext;

// This is the provider component you wrap your app with
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
