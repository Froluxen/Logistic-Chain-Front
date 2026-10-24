import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
    getProveedorById,
    createProveedor,
    updateProveedor,
} from "../../../Services/Maestros/ProveedorService.js";

const empty = {
    nombre: "",
    identificadorFiscal: "",
    direccion: "",
    telefono: "",
    emailContacto: "",
};

const ProveedorForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [proveedor, setProveedor] = useState(empty);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) loadProveedor();
    }, [id]);

    const loadProveedor = async () => {
        try {
            setLoading(true);
            const res = await getProveedorById(id);
            setProveedor(res.data);
        } catch (err) {
            console.error("Error cargando proveedor:", err);
            Swal.fire("Error", "No se pudo cargar el proveedor", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProveedor((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                await updateProveedor(id, proveedor);
                Swal.fire("Actualizado", "Proveedor actualizado correctamente", "success");
            } else {
                await createProveedor(proveedor);
                Swal.fire("Registrado", "Proveedor creado correctamente", "success");
            }
            navigate("/proveedores");
        } catch (error) {
            console.error("Error guardando proveedor:", error);
            const msg = error?.response?.data || "No se pudo guardar el proveedor";
            Swal.fire("Error", msg, "error");
        }
    };

    return (
        <div className="container mt-4">
            <h2>{id ? "Editar Proveedor" : "Nuevo Proveedor"}</h2>
            <hr />
            <form className="row g-3" onSubmit={handleSubmit}>
                {/* Nombre */}
                <div className="col-md-6">
                    <label className="form-label">Nombre *</label>
                    <input
                        type="text"
                        className="form-control"
                        name="nombre"
                        value={proveedor.nombre}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Identificador Fiscal */}
                <div className="col-md-6">
                    <label className="form-label">Identificador Fiscal</label>
                    <input
                        type="text"
                        className="form-control"
                        name="identificadorFiscal"
                        value={proveedor.identificadorFiscal}
                        onChange={handleChange}
                    />
                </div>

                {/* Dirección */}
                <div className="col-md-6">
                    <label className="form-label">Dirección</label>
                    <input
                        type="text"
                        className="form-control"
                        name="direccion"
                        value={proveedor.direccion}
                        onChange={handleChange}
                    />
                </div>

                {/* Teléfono */}
                <div className="col-md-3">
                    <label className="form-label">Teléfono</label>
                    <input
                        type="text"
                        className="form-control"
                        name="telefono"
                        value={proveedor.telefono}
                        onChange={handleChange}
                    />
                </div>

                {/* Email */}
                <div className="col-md-3">
                    <label className="form-label">Email de Contacto</label>
                    <input
                        type="email"
                        className="form-control"
                        name="emailContacto"
                        value={proveedor.emailContacto}
                        onChange={handleChange}
                    />
                </div>

                {/* Botones */}
                <div className="col-12 mt-3 d-flex gap-2">
                    <button className="btn btn-primary" type="submit" disabled={loading}>
                        {loading ? "Guardando..." : "Guardar"}
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate("/proveedores")}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProveedorForm;
