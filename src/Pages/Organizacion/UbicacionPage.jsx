import React from "react";
import { Routes, Route } from "react-router-dom";
import UbicacionList from "../../Components/Organizacion/Ubicacion/UbicacionList.jsx";
import UbicacionForm from "../../Components/Organizacion/Ubicacion/UbicacionForm.jsx";

/**
 * LocationsPage — Gestiona rutas internas:
 * /locations, /locations/add, /locations/edit/:id
 */
const UbicacionPage = () => {
    return (
        <Routes>
            <Route index element={<UbicacionList />} />
            <Route path="add" element={<UbicacionForm />} />
            <Route path="edit/:id" element={<UbicacionForm />} />
        </Routes>
    );
};

export default UbicacionPage;
