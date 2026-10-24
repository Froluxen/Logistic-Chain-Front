import React from "react";
import { Routes, Route } from "react-router-dom";
import PickingList from "../../Components/Ventas/Picking/PickingList";
import PickingForm from "../../Components/Ventas/Picking/PickingForm";

const PickingPage = () => (
    <Routes>
        <Route index element={<PickingList />} />
        <Route path="add" element={<PickingForm />} />
        <Route path="edit/:id" element={<PickingForm />} />
    </Routes>
);

export default PickingPage;
