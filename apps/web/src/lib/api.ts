import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
});

export const objectsApi = {
    getAll: async () => {
        const { data } = await api.get('/objects');
        return data;
    },
    getOne: async (id: string) => {
        const { data } = await api.get(`/objects/${id}`);
        return data;
    },
    create: async (formData: FormData) => {
        const { data } = await api.post('/objects', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data;
    },
    delete: async (id: string) => {
        await api.delete(`/objects/${id}`);
    },
};
export const formatImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const cleanUrl = url.startsWith('/') ? url : `/${url}`;
    return `${baseUrl}${cleanUrl}`;
};
