import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getAllPedidosVenta, deletePedidoVenta } from "../../../Services/Ventas/PedidoVentaService.js";
import { getAllClientes } from "../../../Services/Maestros/ClienteService.js";
import { getAllUsuarios } from "../../../Services/InvSeg/UsuarioService.js";

const BADGE = {
    BORRADOR: "secondary",
    CONFIRMADO: "primary",
    EN_PICKING: "warning",
    DESPACHADO: "info",
    ENTREGADO: "success",
    CANCELADO: "dark",
};

const fmtDateTime = (iso) => {
    if (!iso) return "-";
    try {
        const d = new Date(iso);
        const pad = (n) => String(n).padStart(2, "0");
        return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch {
        return String(iso).slice(0,16).replace("T"," ");
    }
};

const PedidoVentaList = () => {
    const [rows, setRows] = useState([]);
    const [clientesMap, setClientesMap] = useState({});
    const [usuariosMap, setUsuariosMap] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadPedidos();
        loadClientes();
        loadUsuarios();
    }, []);

    // loaders con tu formato
    const loadPedidos = async () => {
        try {
            setLoading(true);
            const res = await getAllPedidosVenta();
            const list = res.data || [];
            const mapped = list.map(p => ({ ...p, fechaEmisionStr: fmtDateTime(p.fechaEmision) }));
            setRows(mapped);
        } catch (e) {
            console.error("Error loading pedidos:", e);
            Swal.fire("Error", "No se pudo cargar la lista de pedidos de venta", "error");
        } finally {
            setLoading(false);
        }
    };

    const loadClientes = async () => {
        try {
            const res = await getAllClientes();
            const map = {};
            (res.data || []).forEach(c => map[c.id] = c);
            setClientesMap(map);
        } catch (e) {
            console.error("Error loading clientes:", e);
            Swal.fire("Error", "No se pudieron cargar los clientes", "error");
        }
    };

    const loadUsuarios = async () => {
        try {
            const res = await getAllUsuarios();
            const map = {};
            (res.data || []).forEach(u => map[u.id] = u);
            setUsuariosMap(map);
        } catch (e) {
            console.error("Error loading usuarios:", e);
            Swal.fire("Error", "No se pudieron cargar los usuarios", "error");
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "¿Eliminar Pedido de Venta?",
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
                    await deletePedidoVenta(id);
                    Swal.fire("Eliminado", "El pedido de venta fue eliminado.", "success");
                    loadPedidos();
                } catch (err) {
                    console.error(err);
                    const msg = err?.response?.data || "No se pudo eliminar el pedido";
                    Swal.fire("Error", msg, "error");
                }
            }
        });
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Pedidos de Venta</h2>
                <button className="btn btn-primary" onClick={() => navigate("/pedidos-venta/add")}>
                    Nuevo Pedido
                </button>
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-hover align-middle">
                    <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Fecha Emisión</th>
                        <th>Estado</th>
                        <th>Precio Total</th>
                        <th>Vendedor</th>
                        <th>Dirección Despacho</th>
                        <th style={{ width: 180 }}>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr><td colSpan="8" className="text-center">Cargando...</td></tr>
                    ) : rows.length > 0 ? (
                        rows.map((x) => (
                            <tr key={x.id}>
                                <td>{x.id}</td>
                                <td>{clientesMap[x.clienteId]?.nombre ?? x.clienteId}</td>
                                <td>{x.fechaEmisionStr}</td>
                                <td><span className={`badge text-bg-${BADGE[x.estado] || "secondary"}`}>{x.estado}</span></td>
                                <td>{Number(x.precioTotal ?? 0).toFixed(2)}</td>
                                <td>{usuariosMap[x.vendedorId]?.nombre ?? x.vendedorId ?? "-"}</td>
                                <td>{x.direccionDespacho || "-"}</td>
                                <td className="text-end">
                                    <button className="btn btn-warning btn-sm me-2" onClick={() => navigate(`/pedidos-venta/edit/${x.id}`)}>Editar</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(x.id)}>Eliminar</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="8" className="text-center text-muted">No hay pedidos registrados.</td></tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PedidoVentaList;
