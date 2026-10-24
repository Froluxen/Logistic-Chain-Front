import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { createDetallePV, updateDetallePV, getDetallePVById } from "../../../Services/Ventas/DetallePVService.js";
import { getAllProductos } from "../../../Services/Maestros/ProductoService.js";
import { getAllPedidosVenta } from "../../../Services/Ventas/PedidoVentaService.js";

const empty = {
    pedidoVentaId: "",
    productoId: "",
    cantidad: 1,
    precioUnitarioVenta: 0,
};

const DetallePVForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState(empty);
    const [productos, setProductos] = useState([]);
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(false);

    const productosSorted = useMemo(
        () => [...productos].sort((a,b) => (a.sku || "").localeCompare(b.sku || "")),
        [productos]
    );

    // Loaders con tu formato
    const loadProductos = async () => {
        try {
            const res = await getAllProductos();
            setProductos(res.data);
        } catch (e) {
            console.error("Error loading productos:", e);
            Swal.fire("Error","No se pudieron cargar los productos","error");
        }
    };

    const loadPedidos = async () => {
        try {
            const res = await getAllPedidosVenta();
            setPedidos(res.data);
        } catch (e) {
            console.error("Error loading pedidos:", e);
            Swal.fire("Error","No se pudieron cargar los pedidos de venta","error");
        }
    };

    const loadDetalle = async () => {
        try {
            const res = await getDetallePVById(id);
            const d = res.data;
            setForm({
                pedidoVentaId: d.pedidoVentaId || "",
                productoId: d.productoId || "",
                cantidad: Number(d.cantidad ?? 1),
                precioUnitarioVenta: Number(d.precioUnitarioVenta ?? 0),
            });
        } catch (e) {
            console.error("Error loading detalle pv:", e);
            Swal.fire("Error","No se pudo cargar el detalle","error");
        }
    };

    useEffect(() => {
        loadProductos();
        loadPedidos();
        if (id) loadDetalle();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setForm(prev => ({ ...prev, [name]: type === "number" ? Number(value) : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dto = {
            pedidoVentaId: Number(form.pedidoVentaId),
            productoId: Number(form.productoId),
            cantidad: Number(form.cantidad),
            precioUnitarioVenta: Number(form.precioUnitarioVenta),
        };

        try {
            setLoading(true);
            if (id) {
                await updateDetallePV(id, dto);
                Swal.fire("Actualizado","Detalle actualizado","success");
            } else {
                await createDetallePV(dto);
                Swal.fire("Creado","Detalle creado","success");
            }
            navigate("/detalles-pv");
        } catch (error) {
            console.error("Error saving detalle pv:", error);
            const msg = error?.response?.data || "No se pudo guardar el detalle";
            Swal.fire("Error", msg, "error");
        } finally {
            setLoading(false);
        }
    };

    const subtotal = Number(form.cantidad ?? 0) * Number(form.precioUnitarioVenta ?? 0);

    return (
        <div className="container mt-4">
            <h2>{id ? "Editar Detalle de Pedido" : "Nuevo Detalle de Pedido"}</h2>
            <form className="row g-3" onSubmit={handleSubmit}>
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
                        {pedidos.map(p => (
                            <option key={p.id} value={p.id}>{`PV #${p.id} — ${p.estado}`}</option>
                        ))}
                    </select>
                </div>

                {/* Producto */}
                <div className="col-md-6">
                    <label className="form-label">Producto *</label>
                    <select
                        className="form-select"
                        name="productoId"
                        value={form.productoId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- Seleccionar --</option>
                        {productosSorted.map(p => (
                            <option key={p.id} value={p.id}>
                                {p.sku} — {p.descripcion ?? p.description}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Cantidad */}
                <div className="col-md-4">
                    <label className="form-label">Cantidad *</label>
                    <input
                        type="number"
                        className="form-control"
                        name="cantidad"
                        min="1"
                        value={form.cantidad}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Precio Unitario Venta */}
                <div className="col-md-4">
                    <label className="form-label">Precio Unitario *</label>
                    <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        name="precioUnitarioVenta"
                        value={form.precioUnitarioVenta}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Subtotal (solo lectura) */}
                <div className="col-md-4">
                    <label className="form-label">Subtotal</label>
                    <input className="form-control" value={Number.isFinite(subtotal) ? subtotal.toFixed(2) : "0.00"} disabled />
                </div>

                <div className="col-12 mt-3 d-flex gap-2">
                    <button type="submit" className="btn btn-success" disabled={loading}>
                        {loading ? "Guardando..." : "Guardar"}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate("/detalles-pv")}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DetallePVForm;
