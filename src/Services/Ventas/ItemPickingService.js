import axios from "axios";

const BASE_URL = "http://localhost:8080/api/items-picking";

export const getAllItemPickings = () => axios.get(BASE_URL);
export const getItemPickingById = (id) => axios.get(`${BASE_URL}/${id}`);
export const createItemPicking  = (dto) => axios.post(BASE_URL, dto);
export const updateItemPicking  = (id, dto) => axios.put(`${BASE_URL}/${id}`, dto);
export const deleteItemPicking  = (id) => axios.delete(`${BASE_URL}/${id}`);
