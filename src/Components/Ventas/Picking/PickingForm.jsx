import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { createPicking, updatePicking, getPickingById } from "../../../Services/Ventas/PickingService.js";
import { getAllPedidosVenta } from "../../../Services/Ventas/PedidoVentaService.js";
import { getAllUsuarios } from "../../../Services/InvSeg/UsuarioService.js";

const ESTADOS = ["PENDIENTE", "EN_PROCESO", "COMPLETADO"];

// ISO ↔ datetime-local
const toLocalDT = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
const toISO = (localDT) => (localDT ? new Date(localDT).toISOString() : null);

const PickingForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        pedidoVentaId: "",
        fechaAsignacion: "",
        estado: "PENDIENTE",
        pickerAsignadoId: "",
    });

    const [pedidos, setPedidos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(false);

    // loaders con tu formato
    const loadPedidos = async () => {
        try {
            const res = await getAllPedidosVenta();
            setPedidos(res.data);
        } catch (e) {
            console.error("Error loading pedidos:", e);
            Swal.fire("Error", "No se pudieron cargar los pedidos de venta", "error");
        }
    };

    const loadUsuarios = async () => {
        try {
            const res = await getAllUsuarios();
            setUsuarios(res.data);
        } catch (e) {
            console.error("Error loading usuarios:", e);
            Swal.fire("Error", "No se pudieron cargar los usuarios", "error");
        }
    };

    const loadPicking = async () => {
        try {
            const res = await getPickingById(id);
            const p = res.data;
            setForm({
                pedidoVentaId: p.pedidoVentaId || "",
                fechaAsignacion: toLocalDT(p.fechaAsignacion),
                estado: p.estado || "PENDIENTE",
                pickerAsignadoId: p.pickerAsignadoId || "",
            });
        } catch (e) {
            console.error("Error loading picking:", e);
            Swal.fire("Error", "No se pudo cargar el picking", "error");
        }
    };

    useEffect(() => {
        loadPedidos();
        loadUsuarios();
        if (id) loadPicking();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dto = {
            pedidoVentaId: Number(form.pedidoVentaId),
            fechaAsignacion: form.fechaAsignacion ? toISO(form.fechaAsignacion) : null,
            estado: form.estado,
            pickerAsignadoId: Number(form.pickerAsignadoId),
        };

        try {
            setLoading(true);
            if (id) {
                await updatePicking(id, dto);
                Swal.fire("Actualizado", "Picking actualizado correctamente", "success");
            } else {
                await createPicking(dto);
                Swal.fire("Creado", "Picking creado correctamente", "success");
            }
            navigate("/pickings");
        } catch (error) {
            console.error("Error saving picking:", error);
            const msg = error?.response?.data || "No se pudo guardar el picking";
            Swal.fire("Error", msg, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <h2>{id ? "Editar Picking" : "Nuevo Picking"}</h2>
            <form onSubmit={handleSubmit} className="row g-3">
                {/* Pedido Venta */}
                <div className="col-md-6">
                    <label className="form-label">Pedido de Venta *</label>
                    <select
                        className="form-select"
                        name="pedidoVentaId"
                        value={form.pedidoVentaId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- Seleccionar --</option>
                        {(pedidos || []).map(p => (
                            <option key={p.id} value={p.id}>{`PV #${p.id} — ${p.estado}`}</option>
                        ))}
                    </select>
                </div>

                {/* Picker asignado */}
                <div className="col-md-6">
                    <label className="form-label">Picker Asignado *</label>
                    <select
                        className="form-select"
                        name="pickerAsignadoId"
                        value={form.pickerAsignadoId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- Seleccionar --</option>
                        {(usuarios || []).map(u => (
                            <option key={u.id} value={u.id}>{u.nombre || u.username || u.email}</option>
                        ))}
                    </select>
                </div>

                {/* Fecha asignación */}
                <div className="col-md-6">
                    <label className="form-label">Fecha de Asignación *</label>
                    <input
                        type="datetime-local"
                        className="form-control"
                        name="fechaAsignacion"
                        value={form.fechaAsignacion}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Estado */}
                <div className="col-md-6">
                    <label className="form-label">Estado *</label>
                    <select
                        className="form-select"
                        name="estado"
                        value={form.estado}
                        onChange={handleChange}
                        required
                    >
                        {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
                    </select>
                </div>

                <div className="col-12 mt-3 d-flex gap-2">
                    <button type="submit" className="btn btn-success" disabled={loading}>
                        {loading ? "Guardando..." : "Guardar"}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate("/pickings")}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PickingForm;
