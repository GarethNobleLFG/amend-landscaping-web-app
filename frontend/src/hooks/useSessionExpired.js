import { useContext } from 'react';
import { SessionExpiredContext } from './SessionExpiredContext';

export const useSessionExpired = () => {
  return useContext(SessionExpiredContext);
};