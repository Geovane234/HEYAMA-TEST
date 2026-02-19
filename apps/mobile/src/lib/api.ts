import axios from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

const getBaseUrl = () => {
    // If we're on a physical device, we MUST use the LAN IP of the computer
    // expo-constants provides this via debuggerHost
    const debuggerHost = Constants.expoConfig?.hostUri;
    const localhost = debuggerHost ? debuggerHost.split(':')[0] : 'localhost';

    // Log the detected host for debugging
    console.log(`[API] Detected Host: ${localhost}`);

    return `http://${localhost}:3000`;
};

const BASE_URL = getBaseUrl();
const api = axios.create({
    baseURL: BASE_URL,
});

export const objectsApi = {
    getAll: async () => {
        const { data } = await api.get('/objects');
        return data;
    },
    create: async (formData: any) => {
        const { data } = await api.post('/objects', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data;
    },
    delete: async (id: string) => {
        await api.delete(`/objects/${id}`);
    },
};

export const getSocketUrl = () => BASE_URL;

export const formatImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    
    // Ensure we don't have double slashes
    const cleanUrl = url.startsWith('/') ? url : `/${url}`;
    return `${BASE_URL}${cleanUrl}`;
};
