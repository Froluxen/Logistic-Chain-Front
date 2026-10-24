import React from "react";
import { Routes, Route } from "react-router-dom";
import KardexList from "../../Components/InvSeg/Kardex/KardexList";
import KardexForm from "../../Components/InvSeg/Kardex/KardexForm";

const KardexPage = () => (
    <Routes>
        <Route index element={<KardexList />} />
        <Route path="add" element={<KardexForm />} />
        <Route path="edit/:id" element={<KardexForm />} />
    </Routes>
);

export default KardexPage;
