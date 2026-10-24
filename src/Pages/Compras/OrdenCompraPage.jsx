import React from "react";
import { Routes, Route } from "react-router-dom";
import OrdenCompraList from "../../Components/Compras/OrdenCompra/OrdenCompraList.jsx";
import OrdenCompraForm from "../../Components/Compras/OrdenCompra/OrdenCompraForm.jsx";

const OrdenCompraPage = () => (
    <Routes>
        <Route index element={<OrdenCompraList />} />
        <Route path="add" element={<OrdenCompraForm />} />
        <Route path="edit/:id" element={<OrdenCompraForm />} />
    </Routes>
);

export default OrdenCompraPage;
