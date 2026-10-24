import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { createRol, updateRol, getRolById } from "../../../Services/InvSeg/RolService.js";

const ENUM_ROLES = [
    "ROLE_ADMIN",
    "ROLE_COMPRAS",
    "ROLE_INVENTARIO",
    "ROLE_VENTAS",
    "ROLE_PICKER",
];

const RolForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({ nombre: "" });
    const [loading, setLoading] = useState(false);

    const loadRol = async () => {
        try {
            const res = await getRolById(id);
            const r = res.data;
            setForm({ nombre: r.nombre || "" });
        } catch (e) {
            console.error("Error loading rol:", e);
            Swal.fire("Error", "No se pudo cargar el rol", "error");
        }
    };

    useEffect(() => {
        if (id) loadRol();
    }, [id]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dto = { nombre: form.nombre };

        try {
            setLoading(true);
            if (id) {
                await updateRol(id, dto);
                Swal.fire("Actualizado", "Rol actualizado correctamente", "success");
            } else {
                await createRol(dto);
                Swal.fire("Creado", "Rol creado correctamente", "success");
            }
            navigate("/roles");
        } catch (error) {
            console.error("Error saving rol:", error);
            const msg = error?.response?.data || "No se pudo guardar el rol";
            Swal.fire("Error", msg, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <h2>{id ? "Editar Rol" : "Nuevo Rol"}</h2>
            <form className="row g-3" onSubmit={handleSubmit}>
                {/* Nombre */}
                <div className="col-md-6">
                    <label className="form-label">Nombre del Rol *</label>
                    <select
                        className="form-select"
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- Seleccionar --</option>
                        {ENUM_ROLES.map((r) => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                </div>

                <div className="col-12 mt-3 d-flex gap-2">
                    <button type="submit" className="btn btn-success" disabled={loading}>
                        {loading ? "Guardando..." : "Guardar"}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate("/roles")}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RolForm;
