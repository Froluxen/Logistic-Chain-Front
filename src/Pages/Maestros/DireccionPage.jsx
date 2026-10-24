import React from "react";
import { Routes, Route } from "react-router-dom";
import DireccionList from "../../Components/Maestros/Cliente/DireccionList.jsx";
import DireccionForm from "../../Components/Maestros/Cliente/DireccionForm.jsx";


const DireccionPage = () => (
    <Routes>
        <Route index element={<DireccionList />} />
        <Route path="add" element={<DireccionForm />} />
        <Route path="edit/:id" element={<DireccionForm />} />
    </Routes>
);

export default DireccionPage;
