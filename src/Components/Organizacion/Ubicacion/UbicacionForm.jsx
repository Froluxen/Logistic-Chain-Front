import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
    createUbicacion,
    updateUbicacion,
    getUbicacionById,
} from "../../../Services/Organizacion/UbicacionService.js";
import { getAllAlmacenes } from "../../../Services/Organizacion/AlmacenService.js";

/**
 * UbicacionForm — Crear/Editar Ubicación
 * Campos: codigo (único), pasillo, estante, nivel, almacenId (select)
 * Mismo patrón del profe (Bootstrap + Swal + navigate)
 */
const UbicacionForm = () => {
    const [form, setForm] = useState({
        codigo: "",
        pasillo: "",
        estante: "",
        nivel: "",
        almacenId: "",
    });

    const [almacenes, setAlmacenes] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        loadAlmacenes();
        if (id) loadUbicacion();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const loadAlmacenes = async () => {
        try {
            const res = await getAllAlmacenes();
            setAlmacenes(res.data || []);
        } catch (e) {
            console.error("Error loading almacenes:", e);
            Swal.fire("Error", "No se pudieron cargar los almacenes", "error");
        }
    };

    const loadUbicacion = async () => {
        try {
            const res = await getUbicacionById(id);
            const u = res.data;
            setForm({
                codigo: u.codigo || "",
                pasillo: u.pasillo || "",
                estante: u.estante || "",
                nivel: u.nivel || "",
                almacenId: u.almacenId ? String(u.almacenId) : "",
            });
        } catch (e) {
            console.error("Error loading ubicacion:", e);
            Swal.fire("Error", "No se pudo cargar la ubicación", "error");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            codigo: form.codigo,
            pasillo: form.pasillo,
            estante: form.estante,
            nivel: form.nivel,
            almacenId: form.almacenId ? Number(form.almacenId) : null,
        };

        if (!payload.almacenId) {
            Swal.fire("Atención", "Selecciona un almacén.", "info");
            return;
        }
        if (!payload.codigo || !payload.codigo.trim()) {
            Swal.fire("Atención", "El código es obligatorio.", "info");
            return;
        }

        try {
            if (id) {
                await updateUbicacion(id, payload);
                Swal.fire("Actualizada", "Ubicación actualizada correctamente", "success");
            } else {
                await createUbicacion(payload);
                Swal.fire("Creada", "Ubicación creada correctamente", "success");
            }
            navigate("/ubicaciones");
        } catch (e) {
            console.error("Error saving ubicacion:", e);
            const msg = e?.response?.data || "No se pudo guardar la ubicación";
            Swal.fire("Error", msg, "error");
        }
    };

    return (
        <div className="container mt-4">
            <h2>{id ? "Editar Ubicación" : "Agregar Ubicación"}</h2>
            <form onSubmit={handleSubmit}>
                {/* Código */}
                <div className="mb-3">
                    <label className="form-label">Código</label>
                    <input
                        type="text"
                        className="form-control"
                        name="codigo"
                        value={form.codigo}
                        onChange={handleChange}
                        required
                        placeholder="Ej: A1-E2-N3"
                    />
                    <small className="text-muted">Debe ser único.</small>
                </div>

                {/* Pasillo */}
                <div className="mb-3">
                    <label className="form-label">Pasillo</label>
                    <input
                        type="text"
                        className="form-control"
                        name="pasillo"
                        value={form.pasillo}
                        onChange={handleChange}
                    />
                </div>

                {/* Estante */}
                <div className="mb-3">
                    <label className="form-label">Estante</label>
                    <input
                        type="text"
                        className="form-control"
                        name="estante"
                        value={form.estante}
                        onChange={handleChange}
                    />
                </div>

                {/* Nivel */}
                <div className="mb-3">
                    <label className="form-label">Nivel</label>
                    <input
                        type="text"
                        className="form-control"
                        name="nivel"
                        value={form.nivel}
                        onChange={handleChange}
                    />
                </div>

                {/* Almacén */}
                <div className="mb-3">
                    <label className="form-label">Almacén</label>
                    <select
                        className="form-select"
                        name="almacenId"
                        value={form.almacenId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- Selecciona un almacén --</option>
                        {almacenes.map((a) => (
                            <option key={a.id} value={a.id}>
                                {a.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Botones */}
                <button type="submit" className="btn btn-success me-2">
                    Guardar
                </button>
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/ubicaciones")}
                >
                    Cancelar
                </button>
            </form>
        </div>
    );
};

export default UbicacionForm;
