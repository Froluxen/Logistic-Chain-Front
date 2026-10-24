import axios from "axios";

const BASE_URL = "http://localhost:8080/api/kardex";

export const getAllKardex = () => axios.get(BASE_URL);
export const getKardexById = (id) => axios.get(`${BASE_URL}/${id}`);
export const createKardex  = (dto) => axios.post(BASE_URL, dto);
export const updateKardex  = (id, dto) => axios.put(`${BASE_URL}/${id}`, dto);
export const deleteKardex  = (id) => axios.delete(`${BASE_URL}/${id}`);
