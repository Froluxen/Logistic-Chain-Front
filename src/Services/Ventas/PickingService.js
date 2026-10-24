import axios from "axios";

const BASE_URL = "http://localhost:8080/api/pickings";

export const getAllPickings = () => axios.get(BASE_URL);
export const getPickingById = (id) => axios.get(`${BASE_URL}/${id}`);
export const createPicking  = (dto) => axios.post(BASE_URL, dto);
export const updatePicking  = (id, dto) => axios.put(`${BASE_URL}/${id}`, dto);
export const deletePicking  = (id) => axios.delete(`${BASE_URL}/${id}`);
