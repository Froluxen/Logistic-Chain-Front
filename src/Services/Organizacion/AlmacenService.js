import axios from "axios";

// Ajusta el puerto si corresponde
const API_URL = "http://localhost:8080/api/almacenes";

export const getAllAlmacenes = () => axios.get(API_URL);
export const getAlmacenById = (id) => axios.get(`${API_URL}/${id}`);
export const createAlmacen = (almacen) => axios.post(API_URL, almacen);
export const updateAlmacen = (id, almacen) => axios.put(`${API_URL}/${id}`, almacen);
export const deleteAlmacen = (id) => axios.delete(`${API_URL}/${id}`);
