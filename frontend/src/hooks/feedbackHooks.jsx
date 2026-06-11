import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionExpired } from './useSessionExpired';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');

    const headers = {
        'Content-Type': 'application/json'
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
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

export function useCreateFeedback() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const createFeedback = async (feedbackData) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/feedback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(feedbackData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));

                throw new Error(
                    errorData.message || 'Failed to submit feedback'
                );
            }

            const data = await response.json();

            return {
                success: true,
                data
            };
        }
        catch (err) {
            setError(err.message);

            return {
                success: false,
                error: err.message
            };
        }
        finally {
            setIsLoading(false);
        }
    };

    return { createFeedback, isLoading, error };
}

export function useGetFeedback() {
    const navigate = useNavigate();
    const { showSessionExpired } = useSessionExpired();

    const [feedback, setFeedback] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchFeedback = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/feedback`, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (isAuthError(response.status)) {
                handleAuthError(navigate, showSessionExpired);

                return {
                    success: false,
                    error: 'Session expired'
                };
            }

            if (!response.ok) {
                throw new Error('Failed to fetch feedback');
            }

            const data = await response.json();

            setFeedback(data);

            return {
                success: true,
                data
            };
        }
        catch (err) {
            setError(err.message);

            return {
                success: false,
                error: err.message
            };
        }
        finally {
            setIsLoading(false);
        }
    }, [navigate, showSessionExpired]);

    return {
        feedback,
        fetchFeedback,
        isLoading,
        error
    };
}

export function useMarkFeedbackAsRead() {
    const navigate = useNavigate();
    const { showSessionExpired } = useSessionExpired();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const markAsRead = async (id) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/feedback/${id}/read`, {
                method: 'PATCH',
                headers: getAuthHeaders()
            });

            if (isAuthError(response.status)) {
                handleAuthError(navigate, showSessionExpired);
                return { success: false, error: 'Session expired' };
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to update feedback');
            }

            const data = await response.json();
            return { success: true, data };
        }
        catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        }
        finally {
            setIsLoading(false);
        }
    };

    return { markAsRead, isLoading, error };
}

export function useDeleteFeedback() {
    const navigate = useNavigate();
    const { showSessionExpired } = useSessionExpired();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteFeedback = async (id) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/feedback/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            if (isAuthError(response.status)) {
                handleAuthError(navigate, showSessionExpired);

                return {
                    success: false,
                    error: 'Session expired'
                };
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));

                throw new Error(
                    errorData.message || 'Failed to delete feedback'
                );
            }

            return {
                success: true
            };
        }
        catch (err) {
            setError(err.message);

            return {
                success: false,
                error: err.message
            };
        }
        finally {
            setIsLoading(false);
        }
    };

    return {
        deleteFeedback,
        isLoading,
        error
    };
}