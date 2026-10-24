import axios from "axios";

const BASE_URL = "http://localhost:8080/api/lotes";

export const getAllLotes   = () => axios.get(BASE_URL);
export const getLoteById   = (id) => axios.get(`${BASE_URL}/${id}`);
export const createLote    = (dto) => axios.post(BASE_URL, dto);
export const updateLote    = (id, dto) => axios.put(`${BASE_URL}/${id}`, dto);
export const deleteLote    = (id) => axios.delete(`${BASE_URL}/${id}`);
