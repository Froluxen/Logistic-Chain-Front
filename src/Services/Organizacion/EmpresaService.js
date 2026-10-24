import axios from "axios";

// ⚠️ Ajusta el puerto si tu backend no corre en 9090
const API_URL = "http://localhost:8080/api/empresas";

export const getAllEmpresas = () => axios.get(API_URL);
export const getEmpresaById = (id) => axios.get(`${API_URL}/${id}`);
export const createEmpresa = (empresa) => axios.post(API_URL, empresa);
export const updateEmpresa = (id, empresa) => axios.put(`${API_URL}/${id}`, empresa);
export const deleteEmpresa = (id) => axios.delete(`${API_URL}/${id}`);
