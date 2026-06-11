import { useState, useCallback } from 'react';
import { useSessionExpired } from './useSessionExpired';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export function useContacts() {
    const [contacts, setContacts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { showSessionExpired } = useSessionExpired();

    const fetchContacts = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/contacts`, { headers: getAuthHeaders() });
            if (response.status === 401 || response.status === 403) return showSessionExpired();
            const data = await response.json();
            setContacts(data);
        } catch (error) {
            console.error('Error fetching contacts:', error);
        } finally {
            setIsLoading(false);
        }
    }, [showSessionExpired]);

    const addContact = async (data) => {
        const response = await fetch(`${API_BASE_URL}/contacts`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        if (response.ok) fetchContacts();
        return response.ok;
    };

    const updateContact = async (id, data) => {
        const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        if (response.ok) fetchContacts();
        return response.ok;
    };

    const deleteContact = async (id) => {
        const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (response.ok) fetchContacts();
        return response.ok;
    };

    return { contacts, isLoading, fetchContacts, addContact, updateContact, deleteContact };
}