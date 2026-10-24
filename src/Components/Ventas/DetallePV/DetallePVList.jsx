import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getAllDetallesPV, deleteDetallePV } from "../../../Services/Ventas/DetallePVService.js";
import { getAllProductos } from "../../../Services/Maestros/ProductoService.js";
import { getAllPedidosVenta } from "../../../Services/Ventas/PedidoVentaService.js";

const num = (v, d=2) => v == null ? "-" : Number(v).toFixed(d);

const DetallePVList = () => {
    const [rows, setRows] = useState([]);
    const [productosMap, setProductosMap] = useState({});
    const [pedidosMap, setPedidosMap] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadDetalles();
        loadProductos();
        loadPedidos();
    }, []);

    // Loaders con tu formato
    const loadDetalles = async () => {
        try {
            setLoading(true);
            const res = await getAllDetallesPV();
            const list = res.data || [];
            const mapped = list.map(x => ({
                ...x,
                subtotal: Number(x.cantidad ?? 0) * Number(x.precioUnitarioVenta ?? 0),
            }));
            setRows(mapped);
        } catch (e) {
            console.error("Error loading detalles PV:", e);
            Swal.fire("Error","No se pudo cargar la lista de detalles de PV","error");
        } finally {
            setLoading(false);
        }
    };

    const loadProductos = async () => {
        try {
            const res = await getAllProductos();
            const map = {};
            (res.data || []).forEach(p => map[p.id] = p);
            setProductosMap(map);
        } catch (e) {
            console.error("Error loading productos:", e);
            Swal.fire("Error","No se pudieron cargar los productos","error");
        }
    };

    const loadPedidos = async () => {
        try {
            const res = await getAllPedidosVenta();
            const map = {};
            (res.data || []).forEach(p => map[p.id] = p);
            setPedidosMap(map);
        } catch (e) {
            console.error("Error loading pedidos:", e);
            Swal.fire("Error","No se pudieron cargar los pedidos de venta","error");
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
                    await deleteDetallePV(id);
                    Swal.fire("Eliminado","El detalle fue eliminado.","success");
                    loadDetalles();
                } catch (err) {
                    console.error(err);
                    const msg = err?.response?.data || "No se pudo eliminar el detalle";
                    Swal.fire("Error", msg, "error");
                }
            }
        });
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Detalles de Pedido de Venta</h2>
                <button className="btn btn-primary" onClick={() => navigate("/detalles-pv/add")}>
                    Nuevo Detalle
                </button>
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-hover align-middle">
                    <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Pedido</th>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Precio Unitario</th>
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
                            const pv = pedidosMap[x.pedidoVentaId];
                            return (
                                <tr key={x.id}>
                                    <td>{x.id}</td>
                                    <td>{pv ? `PV #${pv.id}` : x.pedidoVentaId}</td>
                                    <td>{p ? `${p.sku} — ${p.descripcion ?? p.description ?? "-"}` : x.productoId}</td>
                                    <td>{x.cantidad}</td>
                                    <td>{num(x.precioUnitarioVenta)}</td>
                                    <td>{num(x.subtotal)}</td>
                                    <td className="text-end">
                                        <button className="btn btn-warning btn-sm me-2" onClick={() => navigate(`/detalles-pv/edit/${x.id}`)}>
                                            Editar
                                        </button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(x.id)}>
                                            Eliminar
                                        </button>
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

export default DetallePVList;
