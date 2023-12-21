"use client"
import { createContext, useContext, useState, useEffect } from 'react';

const SessionContext = createContext();

export default SessionContext;

export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(() => {
    if (typeof window !== 'undefined') {
      // Try to get the user from local storage
      const storedSession = sessionStorage.getItem('sessionData');
      return storedSession ? JSON.parse(storedSession) : null;
    }
    return null;
  });

  useEffect(() => {
    // Whenever the user state changes, update local storage
    if (session && typeof window !== 'undefined') {
      sessionStorage.setItem('sessionData', JSON.stringify(session));
    } else if (typeof window !== 'undefined') {
      sessionStorage.removeItem('sessionData');
    }
  }, [session]);

  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
};