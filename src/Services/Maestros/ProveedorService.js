import axios from "axios";

const BASE_URL = "http://localhost:8080/api/proveedores";

export const getAllProveedores = () => axios.get(BASE_URL);
export const getProveedorById = (id) => axios.get(`${BASE_URL}/${id}`);
export const createProveedor = (dto) => axios.post(BASE_URL, dto);
export const updateProveedor = (id, dto) => axios.put(`${BASE_URL}/${id}`, dto);
export const deleteProveedor = (id) => axios.delete(`${BASE_URL}/${id}`);
