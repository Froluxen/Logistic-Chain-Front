import axios from "axios";

// Ajusta el puerto si corresponde
const API_URL = "http://localhost:8080/api/direccion";

export const getAllDirecciones = () => axios.get(API_URL);
export const getDireccioById = (id) => axios.get(`${API_URL}/${id}`);
export const createDireccio = (direccion) => axios.post(API_URL, direccion);
export const updateDireccio = (id, direccion) => axios.put(`${API_URL}/${id}`, direccion);
export const deleteDireccio = (id) => axios.delete(`${API_URL}/${id}`);
