import axios from "axios";

const BASE_URL = "http://localhost:8080/api/ordenes-compra";

export const getAllOrdenesCompra = () => axios.get(BASE_URL);
export const getOrdenCompraById  = (id) => axios.get(`${BASE_URL}/${id}`);
export const createOrdenCompra   = (dto) => axios.post(BASE_URL, dto);
export const updateOrdenCompra   = (id, dto) => axios.put(`${BASE_URL}/${id}`, dto);
export const deleteOrdenCompra   = (id) => axios.delete(`${BASE_URL}/${id}`);
