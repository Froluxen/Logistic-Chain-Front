import axios from "axios";

// Ajusta el puerto si tu backend no corre en 9090
const API_URL = "http://localhost:8080/api/sucursales";

export const getAllSucursales = () => axios.get(API_URL);
export const getSucursalById = (id) => axios.get(`${API_URL}/${id}`);
export const createSucursal = (sucursal) => axios.post(API_URL, sucursal);
export const updateSucursal = (id, sucursal) => axios.put(`${API_URL}/${id}`, sucursal);
export const deleteSucursal = (id) => axios.delete(`${API_URL}/${id}`);
