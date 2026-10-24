import React from "react";
import { Routes, Route } from "react-router-dom";
import PedidoVentaList from "../../Components/Ventas/PedidoVenta/PedidoVentaList";
import PedidoVentaForm from "../../Components/Ventas/PedidoVenta/PedidoVentaForm";

const PedidoVentaPage = () => (
    <Routes>
        <Route index element={<PedidoVentaList />} />
        <Route path="add" element={<PedidoVentaForm />} />
        <Route path="edit/:id" element={<PedidoVentaForm />} />
    </Routes>
);

export default PedidoVentaPage;
