import React from "react";
import { Routes, Route } from "react-router-dom";
import ClienteList from "../../Components/Maestros/Cliente/ClienteList.jsx";
import ClienteForm from "../../Components/Maestros/Cliente/ClienteForm.jsx";


const ClientePage = () => (
    <Routes>
        <Route index element={<ClienteList />} />
        <Route path="add" element={<ClienteForm />} />
        <Route path="edit/:id" element={<ClienteForm />} />
    </Routes>
);

export default ClientePage;