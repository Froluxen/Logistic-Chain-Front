import axios from "axios";

const BASE_URL = "http://localhost:8080/api/detalles-oc";

export const getAllDetallesOC = () => axios.get(BASE_URL);
export const getDetalleOCById = (id) => axios.get(`${BASE_URL}/${id}`);
export const createDetalleOC  = (dto) => axios.post(BASE_URL, dto);
export const updateDetalleOC  = (id, dto) => axios.put(`${BASE_URL}/${id}`, dto);
export const deleteDetalleOC  = (id) => axios.delete(`${BASE_URL}/${id}`);
