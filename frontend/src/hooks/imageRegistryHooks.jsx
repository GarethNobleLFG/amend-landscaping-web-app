import { useState, useCallback } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export function useGetImages() {
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchImages = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/images`, {
                headers: getAuthHeaders(),
            });
            if (!response.ok) throw new Error('Failed to fetch images');
            const data = await response.json();
            setImages(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { images, fetchImages, isLoading, error };
}

export function useUploadImage() {
    const [isLoading, setIsLoading] = useState(false);

    const uploadImage = async (imageData) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/images`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ image_data: imageData }),
            });
            if (!response.ok) throw new Error('Upload failed');
            return { success: true, data: await response.json() };
        } 
        catch (err) {
            return { success: false, error: err.message };
        } 
        finally {
            setIsLoading(false);
        }
    };

    return { uploadImage, isLoading };
}

export function useDeleteImage() {
    const [isDeleting, setIsDeleting] = useState(false);

    const deleteImage = async (id) => {
        setIsDeleting(true);
        try {
            const response = await fetch(`${API_BASE_URL}/images/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });
            return response.ok;
        } 
        catch (err) {
            console.log(err);
            return false;
        } 
        finally {
            setIsDeleting(false);
        }
    };

    return { deleteImage, isDeleting };
}