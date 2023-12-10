"use client"
import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export default UserContext;

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    if (typeof window !== 'undefined') {
      // Try to get the user from local storage
      const storedUser = sessionStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    }
    return null;
  });

  const logout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('user');
    }
    setUser(null);
  };

  useEffect(() => {
    // Whenever the user state changes, update local storage
    if (user && typeof window !== 'undefined') {
      sessionStorage.setItem('user', JSON.stringify(user));
    } else if (typeof window !== 'undefined') {
      sessionStorage.removeItem('user');
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};