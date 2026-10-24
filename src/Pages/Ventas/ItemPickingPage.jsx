import React from "react";
import { Routes, Route } from "react-router-dom";
import ItemPickingList from "../../Components/Ventas/ItemPicking/ItemPickingList";
import ItemPickingForm from "../../Components/Ventas/ItemPicking/ItemPickingForm";

const ItemPickingPage = () => (
    <Routes>
        <Route index element={<ItemPickingList />} />
        <Route path="add" element={<ItemPickingForm />} />
        <Route path="edit/:id" element={<ItemPickingForm />} />
    </Routes>
);

export default ItemPickingPage;
