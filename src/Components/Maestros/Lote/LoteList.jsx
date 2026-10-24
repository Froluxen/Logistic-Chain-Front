import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getAllLotes, deleteLote } from "../../../Services/Maestros/LoteService.js";
import { getAllProductos } from "../../../Services/Maestros/ProductoService.js";

const LoteList = () => {
    const [lotes, setLotes] = useState([]);
    const [productosMap, setProductosMap] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [lr, pr] = await Promise.all([getAllLotes(), getAllProductos()]);
            const list = Array.isArray(lr?.data)
                ? lr.data
                : Array.isArray(lr?.data?.content)
                    ? lr.data.content
                    : [];
            const productos = Array.isArray(pr?.data)
                ? pr.data
                : Array.isArray(pr?.data?.content)
                    ? pr.data.content
                    : [];
            const map = {};
            productos.forEach((p) => (map[p.id] = p));
            setProductosMap(map);
            setLotes(list);
        } catch (err) {
            console.error("Error loading lotes:", err);
            Swal.fire("Error", "No se pudo cargar la lista de lotes", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "¿Eliminar Lote?",
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
                    await deleteLote(id);
                    Swal.fire("Eliminado", "El lote fue eliminado.", "success");
                    loadData();
                } catch (error) {
                    console.error("Error deleting lote:", error);
                    const msg = error?.response?.data || "No se pudo eliminar el lote";
                    Swal.fire("Error", msg, "error");
                }
            }
        });
    };

    const fmtDate = (d) => (d ? String(d).slice(0, 10) : "-");

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Lotes</h2>
                <button className="btn btn-primary" onClick={() => navigate("/lotes/add")}>
                    Nuevo Lote
                </button>
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-hover align-middle">
                    <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Producto</th>
                        <th>Código Lote</th>
                        <th>Fecha Recepción</th>
                        <th>Fecha Vencimiento</th>
                        <th>Stock Actual</th>
                        <th style={{ width: 160 }}>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr><td colSpan="7" className="text-center">Cargando...</td></tr>
                    ) : lotes.length > 0 ? (
                        lotes.map((x) => (
                            <tr key={x.id}>
                                <td>{x.id}</td>
                                <td>
                                    {productosMap[x.productoId]
                                        ? `${productosMap[x.productoId].sku} — ${productosMap[x.productoId].descripcion}`
                                        : x.productoId}
                                </td>
                                <td>{x.codigoLote || "-"}</td>
                                <td>{fmtDate(x.fechaRecepcion)}</td>
                                <td>{fmtDate(x.fechaVencimiento)}</td>
                                <td>{x.stockActual ?? 0}</td>
                                <td className="text-end">
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => navigate(`/lotes/edit/${x.id}`)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDelete(x.id)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="7" className="text-center text-muted">No hay lotes registrados.</td></tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LoteList;
