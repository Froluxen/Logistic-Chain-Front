import React from "react";
import { Routes, Route } from "react-router-dom";
import ProveedorList from "../../Components/Maestros/Proveedor/ProveedorList.jsx";
import ProveedorForm from "../../Components/Maestros/Proveedor/ProveedorForm.jsx";


const ProveedorPage = () => (
    <Routes>
        <Route index element={<ProveedorList />} />
        <Route path="add" element={<ProveedorForm />} />
        <Route path="edit/:id" element={<ProveedorForm/>} />
    </Routes>
);

export default ProveedorPage;
