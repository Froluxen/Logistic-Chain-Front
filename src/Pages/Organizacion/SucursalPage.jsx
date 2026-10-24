import React from "react";
import { Routes, Route } from "react-router-dom";
import SucursalList from "../../Components/Organizacion/Sucursal/SucursalList.jsx";
import SucursalForm from "../../Components/Organizacion/Sucursal/SucursalForm.jsx";

/**
 * BranchPage — Gestiona rutas internas:
 * /branches, /branches/add, /branches/edit/:id
 */
const SucursalPage = () => {
    return (
        <Routes>
            <Route index element={<SucursalList />} />
            <Route path="add" element={<SucursalForm />} />
            <Route path="edit/:id" element={<SucursalForm />} />
        </Routes>
    );
};

export default SucursalPage;
