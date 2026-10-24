import axios from "axios";

// Ajusta el puerto si corresponde
const API_URL = "http://localhost:8080/api/clientes";

export const getAllClientes = () => axios.get(API_URL);
export const getClienteById = (id) => axios.get(`${API_URL}/${id}`);
export const createCliente = (cliente) => axios.post(API_URL, cliente);
export const updateCliente = (id, cliente) => axios.put(`${API_URL}/${id}`, cliente);
export const deleteCliente = (id) => axios.delete(`${API_URL}/${id}`);
