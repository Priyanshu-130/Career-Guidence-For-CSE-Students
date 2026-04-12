import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem('cse_student');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (userData) => {
    setUser(userData);
    sessionStorage.setItem('cse_student', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('cse_student');
    sessionStorage.removeItem('quiz_results');
  };

  const continuesAsGuest = () => {
    const guestUser = { name: 'Guest Student', email: 'guest@pathfinder.edu', branch: 'General', year: 'N/A', isGuest: true };
    setUser(guestUser);
    sessionStorage.setItem('cse_student', JSON.stringify(guestUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, continuesAsGuest }}>
      {children}
    </AuthContext.Provider>
  );
};
