import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getAllPickings, deletePicking } from "../../../Services/Ventas/PickingService.js";
import { getAllPedidosVenta } from "../../../Services/Ventas/PedidoVentaService.js";
import { getAllUsuarios } from "../../../Services/InvSeg/UsuarioService.js";

const BADGE = {
    PENDIENTE: "secondary",
    EN_PROCESO: "warning",
    COMPLETADO: "success",
};

// ISO → "YYYY-MM-DD HH:mm"
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

const PickingList = () => {
    const [rows, setRows] = useState([]);
    const [pedidosMap, setPedidosMap] = useState({});
    const [usuariosMap, setUsuariosMap] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadPickings();
        loadPedidos();
        loadUsuarios();
    }, []);

    // loaders con tu formato
    const loadPickings = async () => {
        try {
            setLoading(true);
            const res = await getAllPickings();
            const list = res.data || [];
            const mapped = list.map(x => ({ ...x, fechaAsignacionStr: fmtDateTime(x.fechaAsignacion) }));
            setRows(mapped);
        } catch (e) {
            console.error("Error loading pickings:", e);
            Swal.fire("Error", "No se pudo cargar la lista de pickings", "error");
        } finally {
            setLoading(false);
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
            Swal.fire("Error", "No se pudieron cargar los pedidos de venta", "error");
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
            title: "¿Eliminar Picking?",
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
                    await deletePicking(id);
                    Swal.fire("Eliminado", "El picking fue eliminado.", "success");
                    loadPickings();
                } catch (err) {
                    console.error(err);
                    const msg = err?.response?.data || "No se pudo eliminar el picking";
                    Swal.fire("Error", msg, "error");
                }
            }
        });
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Pickings</h2>
                <button className="btn btn-primary" onClick={() => navigate("/pickings/add")}>
                    Nuevo Picking
                </button>
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-hover align-middle">
                    <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Pedido</th>
                        <th>Fecha Asignación</th>
                        <th>Estado</th>
                        <th>Picker Asignado</th>
                        <th style={{ width: 180 }}>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr><td colSpan="6" className="text-center">Cargando...</td></tr>
                    ) : rows.length > 0 ? (
                        rows.map((x) => (
                            <tr key={x.id}>
                                <td>{x.id}</td>
                                <td>{pedidosMap[x.pedidoVentaId] ? `PV #${pedidosMap[x.pedidoVentaId].id}` : x.pedidoVentaId}</td>
                                <td>{x.fechaAsignacionStr}</td>
                                <td><span className={`badge text-bg-${BADGE[x.estado] || "secondary"}`}>{x.estado}</span></td>
                                <td>{usuariosMap[x.pickerAsignadoId]?.nombre ?? x.pickerAsignadoId ?? "-"}</td>
                                <td className="text-end">
                                    <button className="btn btn-warning btn-sm me-2" onClick={() => navigate(`/pickings/edit/${x.id}`)}>Editar</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(x.id)}>Eliminar</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="6" className="text-center text-muted">No hay pickings registrados.</td></tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PickingList;
