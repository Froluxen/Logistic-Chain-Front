import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
    createRecepcion,
    updateRecepcion,
    getRecepcionById,
} from "../../../Services/Compras/RecepcionService.js";
import { getAllOrdenesCompra } from "../../../Services/Compras/OrdenCompraService.js";
import { getAllUsuarios } from "../../../Services/InvSeg/UsuarioService.js";

/**
 * RecepcionForm — Crear/Editar Recepción
 * - Mismo patrón que EmpresaForm
 * - Maneja fechaRecepcion como datetime-local ↔ ISO (Instant/Timestamp en backend)
 */
const RecepcionForm = () => {
    const [form, setForm] = useState({
        ordenCompraId: "",            // opcional
        fechaRecepcion: "",           // input datetime-local
        guiaDespachoProveedor: "",
        usuarioReceptorId: "",
        estado: "EN_PROCESO",
    });

    const [ordenes, setOrdenes] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();

    // ISO → datetime-local (YYYY-MM-DDTHH:mm)
    const toLocalDT = (iso) => {
        if (!iso) return "";
        const d = new Date(iso);
        const pad = (n) => String(n).padStart(2, "0");
        const yyyy = d.getFullYear();
        const mm   = pad(d.getMonth() + 1);
        const dd   = pad(d.getDate());
        const hh   = pad(d.getHours());
        const mi   = pad(d.getMinutes());
        return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
    };

    // datetime-local → ISO
    const toISO = (localDT) => {
        if (!localDT) return null;
        // localDT viene sin zona; asumimos zona local del navegador
        return new Date(localDT).toISOString();
    };

    useEffect(() => {
        loadOrdenes();
        loadUsuarios();
        if (id) loadRecepcion();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);


    const loadOrdenes = async () => {
        try {
            const res = await getAllOrdenesCompra();
            setOrdenes(res.data);
        } catch (e) {
            console.error("Error loading OrdenesCompra:", e);
            Swal.fire("Error", "No se pudieron cargar las órdenes de compra", "error");
        }
    };

    const loadUsuarios = async () => {
        try {
            const res = await getAllUsuarios();
            setUsuarios(res.data);
        } catch (e) {
            console.error("Error loading Usuarios:", e);
            Swal.fire("Error", "No se pudieron cargar los usuarios", "error");
        }
    };

    const loadRecepcion = async () => {
        try {
            const res = await getRecepcionById(id);
            const r = res.data;
            setForm({
                ordenCompraId: r.ordenCompraId || "",
                fechaRecepcion: toLocalDT(r.fechaRecepcion),
                guiaDespachoProveedor: r.guiaDespachoProveedor || "",
                usuarioReceptorId: r.usuarioReceptorId || "",
                estado: r.estado || "EN_PROCESO",
            });
        } catch (e) {
            console.error("Error loading Recepcion:", e);
            Swal.fire("Error", "No se pudo cargar la recepción", "error");
        }
    };

    // ===== handlers =====
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            ordenCompraId: form.ordenCompraId ? Number(form.ordenCompraId) : null,
            fechaRecepcion: form.fechaRecepcion ? toISO(form.fechaRecepcion) : null,
            guiaDespachoProveedor: form.guiaDespachoProveedor,
            usuarioReceptorId: Number(form.usuarioReceptorId),
            estado: form.estado,
        };

        try {
            if (id) {
                await updateRecepcion(id, payload);
                Swal.fire("Actualizada", "Recepción actualizada correctamente", "success");
            } else {
                await createRecepcion(payload);
                Swal.fire("Registrada", "Recepción creada correctamente", "success");
            }
            navigate("/recepciones");
        } catch (error) {
            console.error("Error saving recepcion:", error);
            const msg = error?.response?.data || "No se pudo guardar la recepción";
            Swal.fire("Error", msg, "error");
        }
    };

    return (
        <div className="container mt-4">
            <h2>{id ? "Editar Recepción" : "Nueva Recepción"}</h2>
            <form onSubmit={handleSubmit} className="row g-3">
                {/* Orden de Compra (opcional) */}
                <div className="col-md-6">
                    <label className="form-label">Orden de Compra (opcional)</label>
                    <select
                        className="form-select"
                        name="ordenCompraId"
                        value={form.ordenCompraId}
                        onChange={handleChange}
                    >
                        <option value="">— Sin orden —</option>
                        {(ordenes || []).map((o) => (
                            <option key={o.id} value={o.id}>
                                {`OC #${o.id} — ${o.estado}`}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Usuario Receptor */}
                <div className="col-md-6">
                    <label className="form-label">Usuario Receptor *</label>
                    <select
                        className="form-select"
                        name="usuarioReceptorId"
                        value={form.usuarioReceptorId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- Seleccionar --</option>
                        {(usuarios || []).map((u) => (
                            <option key={u.id} value={u.id}>
                                {u.nombre || u.username || u.email}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Fecha Recepción */}
                <div className="col-md-6">
                    <label className="form-label">Fecha de Recepción *</label>
                    <input
                        type="datetime-local"
                        className="form-control"
                        name="fechaRecepcion"
                        value={form.fechaRecepcion}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Guía Despacho */}
                <div className="col-md-6">
                    <label className="form-label">Guía Despacho Proveedor</label>
                    <input
                        type="text"
                        className="form-control"
                        name="guiaDespachoProveedor"
                        value={form.guiaDespachoProveedor}
                        onChange={handleChange}
                        placeholder="Ej: G-000123"
                    />
                </div>

                {/* Estado */}
                <div className="col-md-4">
                    <label className="form-label">Estado *</label>
                    <select
                        className="form-select"
                        name="estado"
                        value={form.estado}
                        onChange={handleChange}
                        required
                    >
                        <option value="EN_PROCESO">EN_PROCESO</option>
                        <option value="COMPLETADA">COMPLETADA</option>
                    </select>
                </div>

                {/* Botones */}
                <div className="col-12 mt-3 d-flex gap-2">
                    <button type="submit" className="btn btn-success">Guardar</button>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate("/recepciones")}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RecepcionForm;
