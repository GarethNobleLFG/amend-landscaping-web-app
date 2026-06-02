import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionExpired } from './SessionExpiredContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleAuthError = (navigate, showSessionExpired) => {
    localStorage.removeItem('token');
  
    console.log('Session expired, show show popup');
    if (showSessionExpired) {   
    showSessionExpired();
    }

      
  
  
};

const isAuthError = (status) => status === 401 || status === 403;

export const useGetServices = () => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchServices = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/services`);
      if (!res.ok) throw new Error('Failed to load services');
      const data = await res.json();
      setServices(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { services, fetchServices, isLoading, error };
};

export const useGetAllServices = () => {
  const navigate = useNavigate();
  const { showSessionExpired } = useSessionExpired();
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllServices = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/services/all`, {
        headers: getAuthHeaders(),
      });
      if (isAuthError(res.status)) {
        handleAuthError(navigate, showSessionExpired);
        return;
      }
      if (!res.ok) throw new Error('Failed to load services');
      setServices(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [navigate, showSessionExpired]);

  return { services, fetchAllServices, isLoading, error };
};

export const useCreateService = () => {
  const [isLoading, setIsLoading] = useState(false); // Added loading state for consistency

 
    setIsLoading(true);
  const navigate = useNavigate();
  const { showSessionExpired } = useSessionExpired();
  const createService = async (name, description, is_available,image_id) => {

    try {
      const res = await fetch(`${API_BASE_URL}/services`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name, description, is_available, image_id }),
      });
      if (isAuthError(res.status)) {
        handleAuthError(navigate, showSessionExpired);
        return { success: false, error: 'Session expired' };
      }
      const data = await res.json();
      return res.ok ? { success: true, data } : { success: false, error: data.error };
    } catch {
      return { success: false, error: 'Network error' };
    } finally {
      setIsLoading(false);
    }
  };
  return { createService, isLoading };
};

export const useUpdateService = () => {
<<<<<<< HEAD
  const [isLoading, setIsLoading] = useState(false);

  const updateService = async (id, name, description, is_available, image_id) => {
    setIsLoading(true);
=======

  const navigate = useNavigate();
  const { showSessionExpired } = useSessionExpired();
  const updateService = async (id, name, description, is_available,image) => {

>>>>>>> 0937a7c (Handled Token expiration with a popup and redirection)
    try {
      const res = await fetch(`${API_BASE_URL}/services/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name, description, is_available, image_id }),
      });
      if (isAuthError(res.status)) {
        handleAuthError(navigate, showSessionExpired);
        return { success: false, error: 'Session expired' };
      }
      const data = await res.json();
      return res.ok ? { success: true, data } : { success: false, error: data.error };
    } catch {
      return { success: false, error: 'Network error' };
    } finally {
      setIsLoading(false);
    }
  };
  return { updateService, isLoading };
};

export const useDeleteService = () => {
  const navigate = useNavigate();
  const { showSessionExpired } = useSessionExpired();
  const deleteService = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/services/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (isAuthError(res.status)) {
        handleAuthError(navigate, showSessionExpired);
        return { success: false, error: 'Session expired' };
      }
      return res.ok ? { success: true } : { success: false, error: 'Delete failed' };
    } catch {
      return { success: false, error: 'Network error' };
    }
  };
  return { deleteService };
};