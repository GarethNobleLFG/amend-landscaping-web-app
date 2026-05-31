import { useState, useCallback } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

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
      if (!res.ok) throw new Error('Failed to load services');
      setServices(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { services, fetchAllServices, isLoading, error };
};

export const useCreateService = () => {
  const createService = async (name, description, is_available) => {
    try {
      const res = await fetch(`${API_BASE_URL}/services`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name, description, is_available }),
      });
      const data = await res.json();
      return res.ok ? { success: true, data } : { success: false, error: data.error };
    } catch {
      return { success: false, error: 'Network error' };
    }
  };
  return { createService };
};

export const useUpdateService = () => {
  const updateService = async (id, name, description, is_available) => {
    try {
      const res = await fetch(`${API_BASE_URL}/services/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name, description, is_available }),
      });
      const data = await res.json();
      return res.ok ? { success: true, data } : { success: false, error: data.error };
    } catch {
      return { success: false, error: 'Network error' };
    }
  };
  return { updateService };
};

export const useDeleteService = () => {
  const deleteService = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/services/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return res.ok ? { success: true } : { success: false, error: 'Delete failed' };
    } catch {
      return { success: false, error: 'Network error' };
    }
  };
  return { deleteService };
};