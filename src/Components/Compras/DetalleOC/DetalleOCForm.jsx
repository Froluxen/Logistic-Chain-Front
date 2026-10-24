import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
    createDetalleOC,
    updateDetalleOC,
    getDetalleOCById,
} from "../../../Services/Compras/DetalleOCService.js";
import { getAllProductos } from "../../../Services/Maestros/ProductoService.js";
import { getAllOrdenesCompra } from "../../../Services/Compras/OrdenCompraService.js";

const empty = {
    ordenCompraId: "",
    productoId: "",
    cantidad: 1,
    costoUnitario: 0,
};

const DetalleOCForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [model, setModel] = useState(empty);
    const [productos, setProductos] = useState([]);
    const [ordenes, setOrdenes] = useState([]);
    const [loading, setLoading] = useState(false);

    const productosSorted = useMemo(
        () => [...productos].sort((a,b) => (a.sku||"").localeCompare(b.sku||"")),
        [productos]
    );

    useEffect(() => {
        (async () => {
            try {
                const [pr, or] = await Promise.all([getAllProductos(), getAllOrdenesCompra()]);
                const p = Array.isArray(pr?.data) ? pr.data : Array.isArray(pr?.data?.content) ? pr.data.content : [];
                const o = Array.isArray(or?.data) ? or.data : Array.isArray(or?.data?.content) ? or.data.content : [];
                setProductos(p);
                setOrdenes(o);
            } catch {
                Swal.fire("Error","No se pudieron cargar productos/órdenes","error");
            }
        })();
    }, []);

    useEffect(() => {
        if (id) loadDetalle();
        else setModel(empty);
    }, [id]);

    const loadDetalle = async () => {
        try {
            setLoading(true);
            const res = await getDetalleOCById(id);
            const d = res.data || {};
            setModel({
                ordenCompraId: d.ordenCompraId ?? "",
                productoId: d.productoId ?? "",
                cantidad: Number(d.cantidad ?? 1),
                costoUnitario: Number(d.costoUnitario ?? 0),
            });
        } catch (e) {
            console.error(e);
            Swal.fire("Error", "No se pudo cargar el detalle", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setModel(prev => ({
            ...prev,
            [name]: type === "number" ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dto = {
            ordenCompraId: Number(model.ordenCompraId),
            productoId: Number(model.productoId),
            cantidad: Number(model.cantidad),
            costoUnitario: Number(model.costoUnitario),
        };

        try {
            setLoading(true);
            if (id) {
                await updateDetalleOC(id, dto);
                Swal.fire("Actualizado", "Detalle actualizado", "success");
            } else {
                await createDetalleOC(dto);
                Swal.fire("Registrado", "Detalle creado", "success");
            }
            navigate("/detalles-oc");
        } catch (error) {
            console.error(error);
            const msg = error?.response?.data || "No se pudo guardar el detalle";
            Swal.fire("Error", msg, "error");
        } finally {
            setLoading(false);
        }
    };

    const subtotal = Number(model.cantidad ?? 0) * Number(model.costoUnitario ?? 0);

    return (
        <div className="container mt-4">
            <h2>{id ? "Editar Detalle OC" : "Nuevo Detalle OC"}</h2>
            <hr />

            <form className="row g-3" onSubmit={handleSubmit}>
                {/* Orden de Compra */}
                <div className="col-md-6">
                    <label className="form-label">Orden de Compra *</label>
                    <select
                        className="form-select"
                        name="ordenCompraId"
                        value={model.ordenCompraId || ""}
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- Seleccionar --</option>
                        {ordenes.map((o) => (
                            <option key={o.id} value={o.id}>
                                {`OC #${o.id} — ${o.estado} — ${o.proveedorId ?? ""}`}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Producto */}
                <div className="col-md-6">
                    <label className="form-label">Producto *</label>
                    <select
                        className="form-select"
                        name="productoId"
                        value={model.productoId || ""}
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- Seleccionar --</option>
                        {productosSorted.map((p) => (
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
                        value={model.cantidad}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Costo Unitario */}
                <div className="col-md-4">
                    <label className="form-label">Costo Unitario *</label>
                    <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        name="costoUnitario"
                        value={model.costoUnitario}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Subtotal (solo lectura) */}
                <div className="col-md-4">
                    <label className="form-label">Subtotal</label>
                    <input className="form-control" value={Number.isFinite(subtotal) ? subtotal.toFixed(2) : "0.00"} disabled />
                </div>

                {/* Botones */}
                <div className="col-12 mt-3 d-flex gap-2">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? "Guardando..." : "Guardar"}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate("/detalles-oc")}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DetalleOCForm;
