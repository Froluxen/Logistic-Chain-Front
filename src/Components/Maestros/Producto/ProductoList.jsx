import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
    getAllProductos,
    deleteProducto,
} from "../../../Services/Maestros/ProductoService.js";

const ProductoList = () => {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadProductos();
    }, []);

    const loadProductos = async () => {
        try {
            setLoading(true);
            const res = await getAllProductos();
            // Soporta array directo o Page { content: [...] }
            const data = res?.data;
            const list = Array.isArray(data)
                ? data
                : Array.isArray(data?.content)
                    ? data.content
                    : Array.isArray(data?.items)
                        ? data.items
                        : [];
            setRows(list);
        } catch (err) {
            console.error("Error loading productos:", err);
            Swal.fire("Error", "No se pudo cargar la lista de productos", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "¿Eliminar Producto?",
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
                    await deleteProducto(id);
                    Swal.fire("Eliminado", "El producto fue eliminado.", "success");
                    loadProductos();
                } catch (err) {
                    console.error("Error deleting producto:", err);
                    const msg = err?.response?.data || "No se pudo eliminar el producto";
                    Swal.fire("Error", msg, "error");
                }
            }
        });
    };

    const yesNo = (v) => (v ? "Sí" : "No");
    const num = (v, d = 2) =>
        v === null || v === undefined || v === "" ? "-" : Number(v).toFixed(d);

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Productos</h2>
                <button className="btn btn-primary" onClick={() => navigate("/productos/add")}>
                    Nuevo Producto
                </button>
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-hover align-middle">
                    <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>SKU</th>
                        <th>GTIN</th>
                        <th>Descripción</th>
                        <th>Marca</th>
                        <th>Unidad</th>
                        <th>Costo Prom.</th>
                        <th>Precio Base</th>
                        <th>Peso (kg)</th>
                        <th>Maneja Lote</th>
                        <th>Control Venc.</th>
                        <th>Stock Mín.</th>
                        <th>Stock Máx.</th>
                        <th style={{ width: 160 }}>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="14" className="text-center">
                                Cargando...
                            </td>
                        </tr>
                    ) : rows && rows.length > 0 ? (
                        rows.map((p) => (
                            <tr key={p.id}>
                                <td>{p.id}</td>
                                <td>{p.sku}</td>
                                <td>{p.gtin || "-"}</td>
                                <td>{p.descripcion}</td>
                                <td>{p.marca || "-"}</td>
                                <td>{p.unidadMedida || "-"}</td>
                                <td>{num(p.costoPromedio)}</td>
                                <td>{num(p.precioVentaBase)}</td>
                                <td>{num(p.pesoKg, 3)}</td>
                                <td>{yesNo(p.manejaLote)}</td>
                                <td>{yesNo(p.manejaFechaVencimiento)}</td>
                                <td>{num(p.stockMinimo, 0)}</td>
                                <td>{num(p.stockMaximo, 0)}</td>
                                <td className="text-end">
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => navigate(`/productos/edit/${p.id}`)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDelete(p.id)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="14" className="text-center text-muted">
                                No hay productos registrados.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductoList;
