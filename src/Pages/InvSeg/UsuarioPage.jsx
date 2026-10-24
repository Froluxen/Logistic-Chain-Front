import React from "react";
import { Routes, Route } from "react-router-dom";
import UsuarioList from "../../Components/InvSeg/Usuario/UsuarioList";
import UsuarioForm from "../../Components/InvSeg/Usuario/UsuarioForm";

const UsuarioPage = () => (
    <Routes>
        <Route index element={<UsuarioList />} />
        <Route path="add" element={<UsuarioForm />} />
        <Route path="edit/:id" element={<UsuarioForm />} />
    </Routes>
);

export default UsuarioPage;
