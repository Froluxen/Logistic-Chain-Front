import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getAllDetallesOC, deleteDetalleOC } from "../../../Services/Compras/DetalleOCService.js";
import { getAllProductos } from "../../../Services/Maestros/ProductoService.js";
import { getAllOrdenesCompra } from "../../../Services/Compras/OrdenCompraService.js";

const DetalleOCList = () => {
    const [rows, setRows] = useState([]);
    const [productosMap, setProductosMap] = useState({});
    const [ordenesMap, setOrdenesMap] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => { loadAll(); }, []);

    const loadAll = async () => {
        try {
            setLoading(true);
            const [dr, pr, or] = await Promise.all([
                getAllDetallesOC(),
                getAllProductos(),
                getAllOrdenesCompra(),
            ]);

            const detalles = Array.isArray(dr?.data)
                ? dr.data
                : Array.isArray(dr?.data?.content)
                    ? dr.data.content
                    : [];

            const productos = Array.isArray(pr?.data)
                ? pr.data
                : Array.isArray(pr?.data?.content)
                    ? pr.data.content
                    : [];

            const ordenes = Array.isArray(or?.data)
                ? or.data
                : Array.isArray(or?.data?.content)
                    ? or.data.content
                    : [];

            const pMap = {}; productos.forEach(p => pMap[p.id] = p);
            const oMap = {}; ordenes.forEach(o => oMap[o.id] = o);

            setProductosMap(pMap);
            setOrdenesMap(oMap);
            setRows(detalles);
        } catch (e) {
            console.error(e);
            Swal.fire("Error", "No se pudo cargar la lista de Detalles de OC", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "¿Eliminar Detalle?",
            text: "Esta acción no se puede deshacer.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        }).then(async (r) => {
            if (r.isConfirmed) {
                try {
                    await deleteDetalleOC(id);
                    Swal.fire("Eliminado", "El detalle fue eliminado.", "success");
                    loadAll();
                } catch (err) {
                    console.error(err);
                    const msg = err?.response?.data || "No se pudo eliminar el detalle";
                    Swal.fire("Error", msg, "error");
                }
            }
        });
    };

    const num = (v, d=2) => v == null ? "-" : Number(v).toFixed(d);

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Detalles de Orden de Compra</h2>
                <button className="btn btn-primary" onClick={() => navigate("/detalles-oc/add")}>
                    Nuevo Detalle
                </button>
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-hover align-middle">
                    <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>OC</th>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Costo Unitario</th>
                        <th>Subtotal</th>
                        <th style={{ width: 160 }}>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr><td colSpan="7" className="text-center">Cargando...</td></tr>
                    ) : rows.length > 0 ? (
                        rows.map((x) => {
                            const p = productosMap[x.productoId];
                            const oc = ordenesMap[x.ordenCompraId];
                            const subtotal = Number(x.cantidad ?? 0) * Number(x.costoUnitario ?? 0);
                            return (
                                <tr key={x.id}>
                                    <td>{x.id}</td>
                                    <td>{oc ? `OC #${oc.id}` : x.ordenCompraId}</td>
                                    <td>{p ? `${p.sku} — ${p.descripcion ?? p.description ?? "-"}` : x.productoId}</td>
                                    <td>{x.cantidad}</td>
                                    <td>{num(x.costoUnitario)}</td>
                                    <td>{num(subtotal)}</td>
                                    <td className="text-end">
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => navigate(`/detalles-oc/edit/${x.id}`)}
                                        >Editar</button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(x.id)}
                                        >Eliminar</button>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr><td colSpan="7" className="text-center text-muted">No hay detalles registrados.</td></tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DetalleOCList;
