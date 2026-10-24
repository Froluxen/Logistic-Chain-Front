import React from "react";
import { Routes, Route } from "react-router-dom";
import ProductoForm from "../../Components/Maestros/Producto/ProductoForm.jsx";
import ProductoList from "../../Components/Maestros/Producto/ProductoList.jsx";


const ClientePage = () => (
    <Routes>
        <Route index element={<ProductoList/>} />
        <Route path="add" element={<ProductoForm />} />
        <Route path="edit/:id" element={<ProductoForm />} />
    </Routes>
);

export default ClientePage;