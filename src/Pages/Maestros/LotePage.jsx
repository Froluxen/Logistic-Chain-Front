import React from "react";
import { Routes, Route } from "react-router-dom";
import LoteList from "../../Components/Maestros/Lote/LoteList.jsx";
import LoteForm from "../../Components/Maestros/Lote/LoteForm.jsx";

const LotePage = () => (
    <Routes>
        <Route index element={<LoteList />} />
        <Route path="add" element={<LoteForm />} />
        <Route path="edit/:id" element={<LoteForm />} />
    </Routes>
);

export default LotePage;
