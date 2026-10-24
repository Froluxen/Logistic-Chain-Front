import React from "react";
import { Routes, Route } from "react-router-dom";
import DetalleOCList from "../../Components/Compras/DetalleOC/DetalleOCList.jsx";
import DetalleOCForm from "../../Components/Compras/DetalleOC/DetalleOCForm.jsx";


const DetalleOCPage = () => (
    <Routes>
        <Route index element={<DetalleOCList />} />
        <Route path="add" element={<DetalleOCForm />} />
        <Route path="edit/:id" element={<DetalleOCForm />} />
    </Routes>
);

export default DetalleOCPage;
