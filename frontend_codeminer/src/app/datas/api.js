// codeminer/frontend_codeminer/src/app/datas/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'https://cm42-medical-dashboard.herokuapp.com/',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getPatients = async () => {
    try {
        const response = await api.get('/patients');
        return response.data;
    } catch (error) {
        console.error('Error fetching patients:', error);
        throw error;
    }
};

export const getPatientsId = async (patientId) => {
    try {
        const response = await api.get(`/patients/${patientId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching info for patient ${patientId}:`, error);
        throw error;
    }
};

export const getAppointments = async () => {
    try {
        const response = await api.get('/appointments');
        return response.data;
    } catch (error) {
        console.error('Error fetching appointments:', error);
        throw error;
    }
};

export const getAppointmentId = async (appointmentId) => {
    try {
        const response = await api.get(`/appointments/${appointmentId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching details for appointment ${appointmentId}:`, error);
        throw error;
    }
};

export default api;
