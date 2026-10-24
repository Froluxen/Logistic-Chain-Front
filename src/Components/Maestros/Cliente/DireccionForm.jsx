import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";


import {createDireccio, getDireccioById, updateDireccio} from "../../../Services/Maestros/DireccionService.js";


const DireccionForm = () => {
    const [form, setForm] = useState({
        calle: "",
        ciudad: "",
        estado: "",
        pais: "",
        codigoPostal: "",
    });

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) loadDireccion();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const loadDireccion = async () => {
        try {
            const res = await getDireccioById(id);
            const a = res.data;
            setForm({
                calle: a.calle || "",
                ciudad: a.ciudad || "",
                estado: a.estado || "",
                pais: a.pais || "",
                codigoPostal: a.codigoPostal || "",
            });
        } catch (e) {
            console.error("Error loading Direccion:", e);
            Swal.fire("Error", "No se pudo cargar el Direccion", "error");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            calle: form.calle,
            ciudad: form.ciudad,
            estado: form.estado,
            pais: form.pais,
            codigoPostal: form.codigoPostal,
        };


        try {
            if (id) {
                await updateDireccio(id, payload);
                Swal.fire("Actualizado", "Direccion actualizado correctamente", "success");
            } else {
                await createDireccio(payload);
                Swal.fire("Creado", "Direccion creado correctamente", "success");
            }
            navigate("/direcciones");
        } catch (e) {
            console.error("Error saving Direccion:", e);
            const msg = e?.response?.data || "No se pudo guardar  Direccion";
            Swal.fire("Error", msg, "error");
        }
    };

    return (
        <div className="container mt-4">
            <h2>{id ? "Editar Direccion" : "Agregar Direccion"}</h2>
            <form onSubmit={handleSubmit}>
                {/* Nombre */}
                <div className="mb-3">
                    <label className="form-label">Calle</label>
                    <input
                        type="text"
                        className="form-control"
                        name="calle"
                        value={form.calle}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* IdentificadorFiscal */}
                <div className="mb-3">
                    <label className="form-label">Ciudad</label>
                    <input
                        type="text"
                        className="form-control"
                        name="ciudad"
                        value={form.ciudad}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Direccion */}
                <div className="mb-3">
                    <label className="form-label">Estado</label>
                    <input
                        type="text"
                        className="form-control"
                        name="estado"
                        value={form.estado}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Telefono */}
                <div className="mb-3">
                    <label className="form-label">pais</label>
                    <input
                        type="text"
                        className="form-control"
                        name="pais"
                        value={form.pais}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Email */}
                <div className="mb-3">
                    <label className="form-label">codigoPostal</label>
                    <input
                        type="text"
                        className="form-control"
                        name="codigoPostal"
                        value={form.codigoPostal}
                        onChange={handleChange}

                    />
                </div>

                {/* Botones */}
                <button type="submit" className="btn btn-success me-2">
                    Guardar
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => navigate("/direcciones")}>
                    Cancelar
                </button>
            </form>
        </div>
    );
};

export default DireccionForm;
