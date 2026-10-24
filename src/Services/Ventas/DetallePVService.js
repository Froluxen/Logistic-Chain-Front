import axios from "axios";

const BASE_URL = "http://localhost:8080/api/detalles-pv";

export const getAllDetallesPV = () => axios.get(BASE_URL);
export const getDetallePVById = (id) => axios.get(`${BASE_URL}/${id}`);
export const createDetallePV  = (dto) => axios.post(BASE_URL, dto);
export const updateDetallePV  = (id, dto) => axios.put(`${BASE_URL}/${id}`, dto);
export const deleteDetallePV  = (id) => axios.delete(`${BASE_URL}/${id}`);
