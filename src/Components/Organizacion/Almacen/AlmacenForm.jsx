import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { createAlmacen, updateAlmacen, getAlmacenById } from "../../../Services/Organizacion/AlmacenService.js";
import { getAllSucursales } from "../../../Services/Organizacion/SucursalService.js";

/**
 * AlmacenForm — Crear/Editar Almacén
 * Campos: nombre, tipo, sucursalId (select) — estilo profe
 */
const AlmacenForm = () => {
    const [form, setForm] = useState({
        nombre: "",
        tipo: "",
        sucursalId: "",
    });
    const [sucursales, setSucursales] = useState([]);

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        loadSucursales();
        if (id) loadAlmacen();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const loadSucursales = async () => {
        try {
            const res = await getAllSucursales();
            setSucursales(res.data || []);
        } catch (e) {
            console.error("Error loading sucursales:", e);
            Swal.fire("Error", "No se pudieron cargar las sucursales", "error");
        }
    };

    const loadAlmacen = async () => {
        try {
            const res = await getAlmacenById(id);
            const a = res.data;
            setForm({
                nombre: a.nombre || "",
                tipo: a.tipo || "",
                sucursalId: a.sucursalId ? String(a.sucursalId) : "",
            });
        } catch (e) {
            console.error("Error loading almacen:", e);
            Swal.fire("Error", "No se pudo cargar el almacén", "error");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            nombre: form.nombre,
            tipo: form.tipo,
            sucursalId: form.sucursalId ? Number(form.sucursalId) : null,
        };

        if (!payload.sucursalId) {
            Swal.fire("Atención", "Selecciona una sucursal.", "info");
            return;
        }
        if (!payload.nombre || !payload.nombre.trim()) {
            Swal.fire("Atención", "El nombre es obligatorio.", "info");
            return;
        }

        try {
            if (id) {
                await updateAlmacen(id, payload);
                Swal.fire("Actualizado", "Almacén actualizado correctamente", "success");
            } else {
                await createAlmacen(payload);
                Swal.fire("Creado", "Almacén creado correctamente", "success");
            }
            navigate("/almacenes");
        } catch (e) {
            console.error("Error saving almacen:", e);
            const msg = e?.response?.data || "No se pudo guardar el almacén";
            Swal.fire("Error", msg, "error");
        }
    };

    return (
        <div className="container mt-4">
            <h2>{id ? "Editar Almacén" : "Agregar Almacén"}</h2>
            <form onSubmit={handleSubmit}>
                {/* Nombre */}
                <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input
                        type="text"
                        className="form-control"
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Tipo */}
                <div className="mb-3">
                    <label className="form-label">Tipo</label>
                    <input
                        type="text"
                        className="form-control"
                        name="tipo"
                        value={form.tipo}
                        onChange={handleChange}
                        placeholder="Ej: Seco, Refrigerado, Congelado, Materia Prima, etc."
                    />
                </div>

                {/* Sucursal */}
                <div className="mb-3">
                    <label className="form-label">Sucursal</label>
                    <select
                        className="form-select"
                        name="sucursalId"
                        value={form.sucursalId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- Selecciona una sucursal --</option>
                        {sucursales.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Botones */}
                <button type="submit" className="btn btn-success me-2">
                    Guardar
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => navigate("/almacenes")}>
                    Cancelar
                </button>
            </form>
        </div>
    );
};

export default AlmacenForm;
