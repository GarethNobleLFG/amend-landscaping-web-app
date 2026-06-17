import { useState, useMemo, useCallback } from 'react';
import { SessionExpiredContext } from './SessionExpiredContext';

export const SessionExpiredProvider = ({ children }) => {
  const [isSessionExpiredOpen, setIsSessionExpiredOpen] = useState(false);

  const showSessionExpired = useCallback(() => setIsSessionExpiredOpen(true), []);
  const closeSessionExpired = useCallback(() => setIsSessionExpiredOpen(false), []);

  const value = useMemo(() => ({
    isSessionExpiredOpen,
    showSessionExpired,
    closeSessionExpired
  }), [isSessionExpiredOpen, showSessionExpired, closeSessionExpired]);

  return (
    <SessionExpiredContext.Provider value={value}>
      {children}
    </SessionExpiredContext.Provider>
  );
};