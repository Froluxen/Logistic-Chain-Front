import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { createPedidoVenta, updatePedidoVenta, getPedidoVentaById } from "../../../Services/Ventas/PedidoVentaService.js";
import { getAllClientes } from "../../../Services/Maestros/ClienteService.js";
import { getAllUsuarios } from "../../../Services/InvSeg/UsuarioService.js";

// estados según tu enum
const ESTADOS = ["BORRADOR","CONFIRMADO","EN_PICKING","DESPACHADO","ENTREGADO","CANCELADO"];

// ISO ↔ datetime-local helpers
const toLocalDT = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
const toISO = (localDT) => (localDT ? new Date(localDT).toISOString() : null);

const PedidoVentaForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        clienteId: "",
        fechaEmision: "",          // datetime-local
        estado: "BORRADOR",
        precioTotal: 0,
        direccionDespacho: "",
        vendedorId: "",
    });

    const [clientes, setClientes] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(false);

    // loaders (tu formato)
    const loadClientes = async () => {
        try {
            const res = await getAllClientes();
            setClientes(res.data);
        } catch (e) {
            console.error("Error loading clientes:", e);
            Swal.fire("Error", "No se pudieron cargar los clientes", "error");
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

    const loadPedido = async () => {
        try {
            const res = await getPedidoVentaById(id);
            const p = res.data;
            setForm({
                clienteId: p.clienteId || "",
                fechaEmision: toLocalDT(p.fechaEmision),
                estado: p.estado || "BORRADOR",
                precioTotal: Number(p.precioTotal ?? 0),
                direccionDespacho: p.direccionDespacho || "",
                vendedorId: p.vendedorId || "",
            });
        } catch (e) {
            console.error("Error loading pedido:", e);
            Swal.fire("Error", "No se pudo cargar el pedido de venta", "error");
        }
    };

    useEffect(() => {
        loadClientes();
        loadUsuarios();
        if (id) loadPedido();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setForm((prev) => ({ ...prev, [name]: type === "number" ? Number(value) : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dto = {
            clienteId: Number(form.clienteId),
            fechaEmision: form.fechaEmision ? toISO(form.fechaEmision) : null,
            estado: form.estado,
            precioTotal: Number(form.precioTotal ?? 0),
            direccionDespacho: form.direccionDespacho,
            vendedorId: Number(form.vendedorId),
        };

        try {
            setLoading(true);
            if (id) {
                await updatePedidoVenta(id, dto);
                Swal.fire("Actualizado", "Pedido de venta actualizado", "success");
            } else {
                await createPedidoVenta(dto);
                Swal.fire("Creado", "Pedido de venta creado", "success");
            }
            navigate("/pedidos-venta");
        } catch (error) {
            console.error("Error saving pedido:", error);
            const msg = error?.response?.data || "No se pudo guardar el pedido";
            Swal.fire("Error", msg, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <h2>{id ? "Editar Pedido de Venta" : "Nuevo Pedido de Venta"}</h2>
            <form onSubmit={handleSubmit} className="row g-3">
                {/* Cliente */}
                <div className="col-md-6">
                    <label className="form-label">Cliente *</label>
                    <select className="form-select" name="clienteId" value={form.clienteId} onChange={handleChange} required>
                        <option value="">-- Seleccionar --</option>
                        {(clientes || []).map((c) => (
                            <option key={c.id} value={c.id}>{c.nombre}</option>
                        ))}
                    </select>
                </div>

                {/* Vendedor */}
                <div className="col-md-6">
                    <label className="form-label">Vendedor *</label>
                    <select className="form-select" name="vendedorId" value={form.vendedorId} onChange={handleChange} required>
                        <option value="">-- Seleccionar --</option>
                        {(usuarios || []).map((u) => (
                            <option key={u.id} value={u.id}>{u.nombre || u.username || u.email}</option>
                        ))}
                    </select>
                </div>

                {/* Fecha Emisión */}
                <div className="col-md-4">
                    <label className="form-label">Fecha de Emisión *</label>
                    <input
                        type="datetime-local"
                        className="form-control"
                        name="fechaEmision"
                        value={form.fechaEmision}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Estado */}
                <div className="col-md-4">
                    <label className="form-label">Estado *</label>
                    <select className="form-select" name="estado" value={form.estado} onChange={handleChange} required>
                        {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
                    </select>
                </div>

                {/* Precio Total */}
                <div className="col-md-4">
                    <label className="form-label">Precio Total</label>
                    <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        name="precioTotal"
                        value={form.precioTotal}
                        onChange={handleChange}
                    />
                </div>

                {/* Dirección de Despacho */}
                <div className="col-md-12">
                    <label className="form-label">Dirección de Despacho</label>
                    <input
                        type="text"
                        className="form-control"
                        name="direccionDespacho"
                        value={form.direccionDespacho}
                        onChange={handleChange}
                        placeholder="Calle, número, ciudad..."
                    />
                </div>

                <div className="col-12 mt-3 d-flex gap-2">
                    <button type="submit" className="btn btn-success" disabled={loading}>
                        {loading ? "Guardando..." : "Guardar"}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate("/pedidos-venta")}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PedidoVentaForm;
