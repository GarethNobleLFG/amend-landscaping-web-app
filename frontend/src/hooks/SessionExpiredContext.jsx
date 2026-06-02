import { createContext, useContext, useState } from 'react';

const SessionExpiredContext = createContext();

export const SessionExpiredProvider = ({ children }) => {
  const [isSessionExpiredOpen, setIsSessionExpiredOpen] = useState(false);

  const showSessionExpired = () => {
   setIsSessionExpiredOpen(prev => {
    if (prev) return prev;
    console.log("OPENING SESSION MODAL");
    return true;
  });
  };

  const closeSessionExpired = () => {
     console.log('CLOSING SESSION MODAL');
    setIsSessionExpiredOpen(false);
  };

  return (
    <SessionExpiredContext.Provider
      value={{
        isSessionExpiredOpen,
        showSessionExpired,
        closeSessionExpired,
      }}
    >
      {children}
    </SessionExpiredContext.Provider>
  );
};

export const useSessionExpired = () => {
  return useContext(SessionExpiredContext);
};