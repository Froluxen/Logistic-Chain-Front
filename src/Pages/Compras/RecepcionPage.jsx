import React from "react";
import { Routes, Route } from "react-router-dom";
import RecepcionList from "../../Components/Compras/Recepcion/RecepcionList";
import RecepcionForm from "../../Components/Compras/Recepcion/RecepcionForm";

const RecepcionPage = () => (
    <Routes>
        <Route index element={<RecepcionList />} />
        <Route path="add" element={<RecepcionForm />} />
        <Route path="edit/:id" element={<RecepcionForm />} />
    </Routes>
);

export default RecepcionPage;
