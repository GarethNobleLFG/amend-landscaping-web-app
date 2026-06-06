import { useState } from 'react';
import { SessionExpiredContext } from './SessionExpiredContext';

export const SessionExpiredProvider = ({ children }) => {
  const [isSessionExpiredOpen, setIsSessionExpiredOpen] = useState(false);

  const showSessionExpired = () => setIsSessionExpiredOpen(true);
  const closeSessionExpired = () => setIsSessionExpiredOpen(false);

  return (
    <SessionExpiredContext.Provider
      value={{ isSessionExpiredOpen, showSessionExpired, closeSessionExpired }}
    >
      {children}
    </SessionExpiredContext.Provider>
  );
};