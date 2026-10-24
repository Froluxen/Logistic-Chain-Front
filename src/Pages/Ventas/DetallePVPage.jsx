import React from "react";
import { Routes, Route } from "react-router-dom";
import DetallePVList from "../../Components/Ventas/DetallePV/DetallePVList";
import DetallePVForm from "../../Components/Ventas/DetallePV/DetallePVForm";

const DetallePVPage = () => (
    <Routes>
        <Route index element={<DetallePVList />} />
        <Route path="add" element={<DetallePVForm />} />
        <Route path="edit/:id" element={<DetallePVForm />} />
    </Routes>
);

export default DetallePVPage;
