import { CompleteItinerary } from '@/redux/completedTourSlice';
import axios from 'axios';
export const baseUrl = 'http://localhost:5000';


export const addSummary=async(summary:CompleteItinerary)=>{
    const response=await axios.post(`${baseUrl}/summary`,summary);
    return response.data;
}
export const getSummary=async(id:string)=>{
    const response=await axios.get(`${baseUrl}/summary?userId=${id}`);
    return response.data;
}
export const deleteSummary=async(id:string)=>{
    const response=await axios.delete(`${baseUrl}/summary/${id}`);
    return response.data;
}
export const updateSummary=async(id:string,summary:CompleteItinerary)=>{
    const response=await axios.put(`${baseUrl}/summary/${id}`,summary);
    return response.data;
}