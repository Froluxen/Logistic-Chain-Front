import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
    createSucursal,
    updateSucursal,
    getSucursalById,
} from "../../../Services/Organizacion/SucursalService.js";
import { getAllEmpresas } from "../../../Services/Organizacion/EmpresaService.js";

/**
 * SucursalForm — Crear/Editar Sucursal
 * Campos: nombre, direccion, telefono, empresaId (select)
 * Usa el patrón del profe: inputs controlados + Swal + navigate
 */
const SucursalForm = () => {
    const [form, setForm] = useState({
        nombre: "",
        direccion: "",
        telefono: "",
        empresaId: "",
    });

    const [empresas, setEmpresas] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        loadEmpresas();
        if (id) loadSucursal();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const loadEmpresas = async () => {
        try {
            const res = await getAllEmpresas();
            setEmpresas(res.data || []);
        } catch (error) {
            console.error("Error loading empresas:", error);
            Swal.fire("Error", "No se pudieron cargar las empresas", "error");
        }
    };

    const loadSucursal = async () => {
        try {
            const res = await getSucursalById(id);
            const s = res.data;
            setForm({
                nombre: s.nombre || "",
                direccion: s.direccion || "",
                telefono: s.telefono || "",
                empresaId: s.empresaId ? String(s.empresaId) : "",
            });
        } catch (error) {
            console.error("Error loading sucursal:", error);
            Swal.fire("Error", "No se pudo cargar la sucursal", "error");
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
            direccion: form.direccion,
            telefono: form.telefono,
            empresaId: form.empresaId ? Number(form.empresaId) : null, // requerido por backend
        };

        if (!payload.empresaId) {
            Swal.fire("Atención", "Selecciona una empresa.", "info");
            return;
        }

        try {
            if (id) {
                await updateSucursal(id, payload);
                Swal.fire("Actualizada", "Sucursal actualizada correctamente", "success");
            } else {
                await createSucursal(payload);
                Swal.fire("Creada", "Sucursal creada correctamente", "success");
            }
            navigate("/sucursales");
        } catch (error) {
            console.error("Error saving sucursal:", error);
            const msg = error?.response?.data || "No se pudo guardar la sucursal";
            Swal.fire("Error", msg, "error");
        }
    };

    return (
        <div className="container mt-4">
            <h2>{id ? "Editar Sucursal" : "Agregar Sucursal"}</h2>
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

                {/* Dirección */}
                <div className="mb-3">
                    <label className="form-label">Dirección</label>
                    <input
                        type="text"
                        className="form-control"
                        name="direccion"
                        value={form.direccion}
                        onChange={handleChange}
                    />
                </div>

                {/* Teléfono */}
                <div className="mb-3">
                    <label className="form-label">Teléfono</label>
                    <input
                        type="text"
                        className="form-control"
                        name="telefono"
                        value={form.telefono}
                        onChange={handleChange}
                    />
                </div>

                {/* Empresa (select) */}
                <div className="mb-3">
                    <label className="form-label">Empresa</label>
                    <select
                        className="form-select"
                        name="empresaId"
                        value={form.empresaId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- Selecciona una empresa --</option>
                        {empresas.map((e) => (
                            <option key={e.id} value={e.id}>
                                {e.nombre}
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
                    onClick={() => navigate("/sucursales")}
                >
                    Cancelar
                </button>
            </form>
        </div>
    );
};

export default SucursalForm;
