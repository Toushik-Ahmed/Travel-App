import { Itinerary } from '@/redux/itineraryslice';
import axios from 'axios';
export const baseUrl = 'http://localhost:5000';
export const addItenerary = async (itinerary: Itinerary) => {
  const response = await axios.post(`${baseUrl}/itineraries`, itinerary);
  return response.data;
};
export const getItineraries = async (id:string) => {
  const response = await axios.get(`${baseUrl}/itineraries?userId=${id}`);
  return response.data;
};
export const deleteItinerary = async (id: string) => {
  const response = await axios.delete(`${baseUrl}/itineraries/${id}`);
  return response.data;
};

export const updateItinerary = async (id: string, itinerary: Itinerary) => {
  const response = await axios.put(`${baseUrl}/itineraries/${id}`, itinerary);
  return response.data;
};
