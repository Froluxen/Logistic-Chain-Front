import axios from "axios";

const BASE_URL = "http://localhost:8080/api/pedidos-venta";

export const getAllPedidosVenta = () => axios.get(BASE_URL);
export const getPedidoVentaById = (id) => axios.get(`${BASE_URL}/${id}`);
export const createPedidoVenta  = (dto) => axios.post(BASE_URL, dto);
export const updatePedidoVenta  = (id, dto) => axios.put(`${BASE_URL}/${id}`, dto);
export const deletePedidoVenta  = (id) => axios.delete(`${BASE_URL}/${id}`);
