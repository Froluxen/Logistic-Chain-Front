import React from "react";
import { Routes, Route } from "react-router-dom";
import EmpresaList from "../../Components/Organizacion/Empresa/EmpresaList.jsx";
import EmpresaForm from "../../Components/Organizacion/Empresa/EmpresaForm.jsx";

/**
 * CompaniesPage — Gestiona rutas internas:
 * /companies, /companies/add, /companies/edit/:id
 */
const EmpresaPage = () => {
    return (
        <Routes>
            <Route index element={<EmpresaList />} />
            <Route path="add" element={<EmpresaForm />} />
            <Route path="edit/:id" element={<EmpresaForm />} />
        </Routes>
    );
};

export default EmpresaPage;