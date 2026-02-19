import axios from 'axios';
import Constants from 'expo-constants';

const getBaseUrl = () => {
    // If we're on a physical device, we MUST use the LAN IP of the computer
    const debuggerHost = Constants.expoConfig?.hostUri;
    const localhost = debuggerHost ? debuggerHost.split(':')[0] : 'localhost';

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
    
    // If it's already an absolute URL (legacy or external), return it
    if (url.startsWith('http')) {
        // Handle potential localhost leakage from creator's side
        if (url.includes('localhost') && BASE_URL.includes('192.168')) {
            return url.replace('http://localhost:3000', BASE_URL);
        }
        return url;
    }
    
    // Prepend BASE_URL to relative paths
    const cleanUrl = url.startsWith('/') ? url : `/${url}`;
    return `${BASE_URL}${cleanUrl}`;
};
