import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
    createCliente,
    updateCliente,
    getClienteById,
} from "../../../Services/Maestros/ClienteService.js";

const ClienteForm = () => {
    const [cliente, setCliente] = useState({
        nombre: "",
        identificadorFiscal: "",
        telefono: "",
        email: "",
        direccion: {
            id: null,
            calle: "",
            ciudad: "",
            estado: "",
            codigoPostal: "",
            pais: "",
        },
    });

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) loadCliente();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const loadCliente = async () => {
        try {
            const res = await getClienteById(id);
            const data = res.data;

            const dir = data.direccion || {};

            setCliente({
                nombre: data.nombre || "",
                identificadorFiscal: data.identificadorFiscal || "",
                telefono: data.telefono || "",
                email: data.email || "",
                direccion: {
                    id: dir.id || null,
                    calle: dir.calle || "",
                    ciudad: dir.ciudad || "",
                    estado: dir.estado || "",
                    codigoPostal: dir.codigoPostal || "",
                    pais: dir.pais || "",
                },
            });
        } catch (error) {
            console.error("Error loading Cliente:", error);
            Swal.fire("Error", "No se pudo cargar el Cliente", "error");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Campos anidados: direccion.calle, direccion.ciudad, etc.
        if (name.startsWith("direccion.")) {
            const field = name.split(".")[1];
            setCliente((prev) => ({
                ...prev,
                direccion: {
                    ...prev.direccion,
                    [field]: value,
                },
            }));
        } else {
            setCliente((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            nombre: cliente.nombre,
            identificadorFiscal: cliente.identificadorFiscal,
            telefono: cliente.telefono,
            email: cliente.email,
            direccion: cliente.direccion, // objeto completo
        };

        try {
            if (id) {
                await updateCliente(id, payload);
                Swal.fire("Actualizada", "Cliente actualizada correctamente", "success");
            } else {
                await createCliente(payload);
                Swal.fire("Creada", "Cliente creada correctamente", "success");
            }
            navigate("/clientes");
        } catch (error) {
            console.error("Error saving cliente:", error);
            const raw = error?.response?.data || "No se pudo guardar el Cliente";
            const msg = typeof raw === "string" ? raw : JSON.stringify(raw);
            Swal.fire("Error", msg, "error");
        }
    };

    return (
        <div className="container mt-4">
            <h2>{id ? "Editar Cliente" : "Agregar Cliente"}</h2>
            <form onSubmit={handleSubmit}>
                {/* Nombre */}
                <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input
                        type="text"
                        className="form-control"
                        name="nombre"
                        value={cliente.nombre}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Identificador Fiscal */}
                <div className="mb-3">
                    <label className="form-label">Identificador Fiscal</label>
                    <input
                        type="text"
                        className="form-control"
                        name="identificadorFiscal"
                        value={cliente.identificadorFiscal}
                        onChange={handleChange}
                        required
                    />
                </div>

                <hr className="my-4" />
                <h5>Dirección</h5>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Calle</label>
                        <input
                            type="text"
                            className="form-control"
                            name="direccion.calle"
                            value={cliente.direccion.calle}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label className="form-label">Ciudad</label>
                        <input
                            type="text"
                            className="form-control"
                            name="direccion.ciudad"
                            value={cliente.direccion.ciudad}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="col-md-4 mb-3">
                        <label className="form-label">Estado</label>
                        <input
                            type="text"
                            className="form-control"
                            name="direccion.estado"
                            value={cliente.direccion.estado}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="col-md-4 mb-3">
                        <label className="form-label">Código Postal</label>
                        <input
                            type="text"
                            className="form-control"
                            name="direccion.codigoPostal"
                            value={cliente.direccion.codigoPostal}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-4 mb-3">
                        <label className="form-label">País</label>
                        <input
                            type="text"
                            className="form-control"
                            name="direccion.pais"
                            value={cliente.direccion.pais}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                {/* Teléfono */}
                <div className="mb-3">
                    <label className="form-label">Teléfono</label>
                    <input
                        type="text"
                        className="form-control"
                        name="telefono"
                        value={cliente.telefono}
                        onChange={handleChange}
                    />
                </div>

                {/* Email */}
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={cliente.email}
                        onChange={handleChange}
                    />
                </div>

                {/* Botones */}
                <button type="submit" className="btn btn-success me-2">
                    Guardar
                </button>
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/clientes")}
                >
                    Cancelar
                </button>
            </form>
        </div>
    );
};

export default ClienteForm;
