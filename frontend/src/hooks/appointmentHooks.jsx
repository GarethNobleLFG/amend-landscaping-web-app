import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionExpired } from './useSessionExpired';

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
    if (showSessionExpired) {
    showSessionExpired();
    }
    
};

const isAuthError = (status) => status === 401 || status === 403;

export function useCreateAppointment() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const createAppointment = async (appointmentData) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/appointments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(appointmentData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to create appointment');
            }

            const newAppointment = await response.json();
            return { success: true, data: newAppointment };
        }
        catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        }
        finally {
            setIsLoading(false);
        }
    };

    return { createAppointment, isLoading, error };
}

export function useGetAppointments() {
    const navigate = useNavigate();
    const { showSessionExpired } = useSessionExpired();
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAppointments = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/appointments`, {
                method: 'GET',
                headers: getAuthHeaders(),
            });

            if (isAuthError(response.status)) {
                handleAuthError(navigate, showSessionExpired);
                return { success: false, error: 'Session expired' };
            }

            if (!response.ok) {
                throw new Error('Failed to fetch appointments');
            }
            const data = await response.json();
            setAppointments(data);
            return { success: true, data };
        }
        catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        }
        finally {
            setIsLoading(false);
        }
    }, [navigate, showSessionExpired]);

    return { appointments, fetchAppointments, isLoading, error };
}

export function useGetAppointmentById() {
    const navigate = useNavigate();
    const { showSessionExpired } = useSessionExpired();
    const [appointment, setAppointment] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAppointment = useCallback(async (id) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
                method: 'GET',
                headers: getAuthHeaders(),
            });

            if (isAuthError(response.status)) {
                handleAuthError(navigate, showSessionExpired);
                return { success: false, error: 'Session expired' };
            }

            if (!response.ok) {
                throw new Error('Failed to fetch appointment details');
            }
            const data = await response.json();
            setAppointment(data);
            return { success: true, data };
        }
        catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        }
        finally {
            setIsLoading(false);
        }
    }, [navigate, showSessionExpired]);

    return { appointment, fetchAppointment, isLoading, error };
}

export function useApproveAppointment() {
    const navigate = useNavigate();
    const { showSessionExpired } = useSessionExpired();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const approveAppointment = async (id, message = '') => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/appointments/${id}/approve`, {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify({ message })
            });

            if (isAuthError(response.status)) {
                handleAuthError(navigate, showSessionExpired);
                return { success: false, error: 'Session expired' };
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to approve appointment');
            }

            const result = await response.json();
            return { success: true, data: result.appointment };
        }
        catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        }
        finally {
            setIsLoading(false);
        }
    };

    return { approveAppointment, isLoading, error };
}

export function useDenyAppointment() {
    const navigate = useNavigate();
    const { showSessionExpired } = useSessionExpired();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const denyAppointment = async (id, message = '') => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/appointments/${id}/deny`, {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify({ message })
            });

            if (isAuthError(response.status)) {
                handleAuthError(navigate, showSessionExpired);
                return { success: false, error: 'Session expired' };
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to deny appointment');
            }

            return { success: true };
        }
        catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        }
        finally {
            setIsLoading(false);
        }
    };

    return { denyAppointment, isLoading, error };
}

export function useCancelAppointment() {
    const navigate = useNavigate();
    const { showSessionExpired } = useSessionExpired();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const cancelAppointment = async (id, message = '') => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/appointments/${id}/cancel`, {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify({ message })
            });

            if (isAuthError(response.status)) {
                handleAuthError(navigate, showSessionExpired);
                return { success: false, error: 'Session expired' };
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to cancel appointment');
            }

            return { success: true };
        }
        catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        }
        finally {
            setIsLoading(false);
        }
    };

    return { cancelAppointment, isLoading, error };
}
