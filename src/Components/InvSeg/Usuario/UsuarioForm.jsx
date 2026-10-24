import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { createUsuario, updateUsuario, getUsuarioById } from "../../../Services/InvSeg/UsuarioService.js";

const UsuarioForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        nombreUsuario: "",
        contrasena: "",
        nombreCompleto: "",
        email: "",
        activo: true,
    });

    const [loading, setLoading] = useState(false);

    const loadUsuario = async () => {
        try {
            const res = await getUsuarioById(id);
            const u = res.data;
            setForm({
                nombreUsuario: u.nombreUsuario || "",
                contrasena: "",
                nombreCompleto: u.nombreCompleto || "",
                email: u.email || "",
                activo: Boolean(u.activo),
            });
        } catch (e) {
            console.error("Error loading usuario:", e);
            Swal.fire("Error", "No se pudo cargar el usuario", "error");
        }
    };

    useEffect(() => {
        if (id) loadUsuario();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dto = {
            nombreUsuario: form.nombreUsuario,
            contrasena: form.contrasena || null, // si se deja vacío, backend debe ignorar
            nombreCompleto: form.nombreCompleto,
            email: form.email,
            activo: form.activo,
        };

        try {
            setLoading(true);
            if (id) {
                await updateUsuario(id, dto);
                Swal.fire("Actualizado", "Usuario actualizado correctamente", "success");
            } else {
                await createUsuario(dto);
                Swal.fire("Creado", "Usuario creado correctamente", "success");
            }
            navigate("/usuarios");
        } catch (error) {
            console.error("Error saving usuario:", error);
            const msg = error?.response?.data || "No se pudo guardar el usuario";
            Swal.fire("Error", msg, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <h2>{id ? "Editar Usuario" : "Nuevo Usuario"}</h2>
            <form className="row g-3" onSubmit={handleSubmit}>
                {/* Nombre Usuario */}
                <div className="col-md-6">
                    <label className="form-label">Nombre de Usuario *</label>
                    <input
                        type="text"
                        className="form-control"
                        name="nombreUsuario"
                        value={form.nombreUsuario}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Contraseña */}
                <div className="col-md-6">
                    <label className="form-label">Contraseña {id ? "(dejar vacío para no cambiar)" : "*"}</label>
                    <input
                        type="password"
                        className="form-control"
                        name="contrasena"
                        value={form.contrasena}
                        onChange={handleChange}
                        placeholder={id ? "••••••••" : ""}
                        {...(!id && { required: true })}
                    />
                </div>

                {/* Nombre Completo */}
                <div className="col-md-6">
                    <label className="form-label">Nombre Completo *</label>
                    <input
                        type="text"
                        className="form-control"
                        name="nombreCompleto"
                        value={form.nombreCompleto}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Email */}
                <div className="col-md-6">
                    <label className="form-label">Email *</label>
                    <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Activo */}
                <div className="col-12">
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            name="activo"
                            checked={form.activo}
                            onChange={handleChange}
                            id="activo"
                        />
                        <label className="form-check-label" htmlFor="activo">
                            Usuario Activo
                        </label>
                    </div>
                </div>

                <div className="col-12 mt-3 d-flex gap-2">
                    <button type="submit" className="btn btn-success" disabled={loading}>
                        {loading ? "Guardando..." : "Guardar"}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate("/usuarios")}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UsuarioForm;