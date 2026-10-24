import axios from "axios";

const BASE_URL = "http://localhost:8080/api/roles";

export const getAllRoles = () => axios.get(BASE_URL);
export const getRolById = (id) => axios.get(`${BASE_URL}/${id}`);
export const createRol  = (dto) => axios.post(BASE_URL, dto);
export const updateRol  = (id, dto) => axios.put(`${BASE_URL}/${id}`, dto);
export const deleteRol  = (id) => axios.delete(`${BASE_URL}/${id}`);
