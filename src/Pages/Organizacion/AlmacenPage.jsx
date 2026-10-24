import React from "react";
import { Routes, Route } from "react-router-dom";
import AlmacenList from "../../Components/Organizacion/Almacen/AlmacenList.jsx";
import AlmacenForm from "../../Components/Organizacion/Almacen/AlmacenForm.jsx";

/** /almacenes, /almacenes/add, /almacenes/edit/:id */
const AlmacenPage = () => (
    <Routes>
        <Route index element={<AlmacenList />} />
        <Route path="add" element={<AlmacenForm />} />
        <Route path="edit/:id" element={<AlmacenForm />} />
    </Routes>
);

export default AlmacenPage;


