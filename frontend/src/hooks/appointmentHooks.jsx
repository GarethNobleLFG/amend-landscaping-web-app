import { useState, useCallback } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

// 1. Create Appointment (POST)
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

// 2. Get All Appointments (GET) - Useful for an Admin Dashboard
export function useGetAppointments() {
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
    }, []);

    return { appointments, fetchAppointments, isLoading, error };
}

// 3. Get Single Appointment by ID (GET)
export function useGetAppointmentById() {
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
    }, []);

    return { appointment, fetchAppointment, isLoading, error };
}

// 4. Update Appointment (PUT) - Useful for editing/approving
export function useUpdateAppointment() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateAppointment = async (id, updateData) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(updateData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to update appointment');
            }

            const updatedAppointment = await response.json();
            return { success: true, data: updatedAppointment };
        }
        catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        }
        finally {
            setIsLoading(false);
        }
    };

    return { updateAppointment, isLoading, error };
}

// 5. Delete Appointment (DELETE)
export function useDeleteAppointment() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteAppointment = async (id) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
                method: 'DELETE',
                // DELETE requests generally don't need a Content-Type body, but keeping it in the helper is fine
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to delete appointment');
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

    return { deleteAppointment, isLoading, error };
}