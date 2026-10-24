import axios from "axios";

const BASE_URL = "http://localhost:8080/api/recepciones";

export const getAllRecepciones = () => axios.get(BASE_URL);
export const getRecepcionById  = (id) => axios.get(`${BASE_URL}/${id}`);
export const createRecepcion   = (dto) => axios.post(BASE_URL, dto);
export const updateRecepcion   = (id, dto) => axios.put(`${BASE_URL}/${id}`, dto);
export const deleteRecepcion   = (id) => axios.delete(`${BASE_URL}/${id}`);
