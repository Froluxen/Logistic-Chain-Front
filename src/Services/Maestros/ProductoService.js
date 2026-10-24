import axios from "axios";

// Ajusta el puerto si corresponde
const API_URL = "http://localhost:8080/api/productos";

export const getAllProductos = () => axios.get(API_URL);
export const getProductoById = (id) => axios.get(`${API_URL}/${id}`);
export const createProducto = (cliente) => axios.post(API_URL, cliente);
export const updateProducto = (id, cliente) => axios.put(`${API_URL}/${id}`, cliente);
export const deleteProducto = (id) => axios.delete(`${API_URL}/${id}`);
