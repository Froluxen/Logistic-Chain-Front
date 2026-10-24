import axios from "axios";

const BASE_URL = "http://localhost:8080/api/usuarios";

export const getAllUsuarios = () => axios.get(BASE_URL);
export const getUsuarioById = (id) => axios.get(`${BASE_URL}/${id}`);
export const createUsuario  = (dto) => axios.post(BASE_URL, dto);
export const updateUsuario  = (id, dto) => axios.put(`${BASE_URL}/${id}`, dto);
export const deleteUsuario  = (id) => axios.delete(`${BASE_URL}/${id}`);
