import axios from "axios";

const API_URL = "http://localhost:8080/api/ubicaciones";

export const getAllUbicaciones = () => axios.get(API_URL);
export const getUbicacionById = (id) => axios.get(`${API_URL}/${id}`);
export const createUbicacion = (ubicacion) => axios.post(API_URL, ubicacion);
export const updateUbicacion = (id, ubicacion) => axios.put(`${API_URL}/${id}`, ubicacion);
export const deleteUbicacion = (id) => axios.delete(`${API_URL}/${id}`);
