import axios from 'axios';
import { Property, CreatePropertyDto } from '@/types/property';

// Use Vercel proxy in production, localhost in development
const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api'  // This will be proxied to Render by Vercel
  : 'http://localhost:5000/api';

console.log('API_URL:', API_URL, 'NODE_ENV:', process.env.NODE_ENV);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const propertyApi = {
  // Get all properties
  getProperties: async (): Promise<Property[]> => {
    const response = await api.get('/properties');
    return response.data;
  },

  // Add a new property
  createProperty: async (propertyData: CreatePropertyDto | FormData): Promise<Property> => {
    if (propertyData instanceof FormData) {
      // Create a new axios instance without default JSON Content-Type
      const formDataApi = axios.create({ baseURL: API_URL });
      const response = await formDataApi.post('/properties', propertyData);
      return response.data;
    }

    // Fallback for JSON
    const response = await api.post('/properties', propertyData as CreatePropertyDto);
    return response.data;
  },
};
