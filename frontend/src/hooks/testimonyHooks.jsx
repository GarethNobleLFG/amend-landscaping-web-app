import { useState, useCallback } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export function useTestimonies() {
    const [testimonies, setTestimonies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchTestimonies = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/testimonies`);
            if (!response.ok) throw new Error('Failed to fetch testimonies');
            const data = await response.json();
            setTestimonies(data);
        } 
        catch (err) {
            setError(err.message);
        } 
        finally {
            setIsLoading(false);
        }
    }, []);

    const addTestimony = async (testimonyData) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/testimonies`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(testimonyData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to add testimony');
            }

            const newTestimony = await response.json();
            setTestimonies(prev => [newTestimony, ...prev]);
            return { success: true, data: newTestimony };
        } 
        catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } 
        finally {
            setIsLoading(false);
        }
    };

    const deleteTestimony = async (id) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/testimonies/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });

            if (!response.ok) throw new Error('Failed to delete testimony');

            setTestimonies(prev => prev.filter(t => t.id !== id));
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

    return { 
        testimonies, 
        isLoading, 
        error, 
        fetchTestimonies, 
        addTestimony, 
        deleteTestimony 
    };
}