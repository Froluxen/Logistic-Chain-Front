import React from "react";
import { Routes, Route } from "react-router-dom";
import RolList from "../../Components/InvSeg/Rol/RolList";
import RolForm from "../../Components/InvSeg/Rol/RolForm";

const RolPage = () => (
    <Routes>
        <Route index element={<RolList />} />
        <Route path="add" element={<RolForm />} />
        <Route path="edit/:id" element={<RolForm />} />
    </Routes>
);

export default RolPage;
