import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getAllOrdenesCompra, deleteOrdenCompra} from "../../../Services/Compras/OrdenCompraService.js";
import { getAllProveedores} from "../../../Services/Maestros/ProveedorService.js";
// Si tienes servicio de usuarios:
import { getAllUsuarios } from "../../../Services/InvSeg/UsuarioService.js";

const ESTADO_BADGE = {
    PENDIENTE: "secondary",
    RECIBIDA_PARCIAL: "warning",
    RECIBIDA_COMPLETA: "success",
    CANCELADA: "dark",
};

const OrdenCompraList = () => {
    const [rows, setRows] = useState([]);
    const [proveedoresMap, setProveedoresMap] = useState({});
    const [usuariosMap, setUsuariosMap] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => { loadAll(); }, []);

    const loadAll = async () => {
        try {
            setLoading(true);
            const [ocRes, provRes, usrRes] = await Promise.all([
                getAllOrdenesCompra(),
                getAllProveedores(),
                getAllUsuarios?.() ?? Promise.resolve({ data: [] }),
            ]);

            const list = Array.isArray(ocRes?.data) ? ocRes.data
                : Array.isArray(ocRes?.data?.content) ? ocRes.data.content : [];

            const provs = Array.isArray(provRes?.data) ? provRes.data
                : Array.isArray(provRes?.data?.content) ? provRes.data.content : [];
            const provMap = {}; provs.forEach(p => provMap[p.id] = p);

            const usrs = Array.isArray(usrRes?.data) ? usrRes.data
                : Array.isArray(usrRes?.data?.content) ? usrRes.data.content : [];
            const usrMap = {}; usrs.forEach(u => usrMap[u.id] = u);

            setRows(list);
            setProveedoresMap(provMap);
            setUsuariosMap(usrMap);
        } catch (e) {
            console.error(e);
            Swal.fire("Error", "No se pudo cargar la lista de órdenes de compra", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "¿Eliminar Orden de Compra?",
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
                    await deleteOrdenCompra(id);
                    Swal.fire("Eliminada", "La orden de compra fue eliminada.", "success");
                    loadAll();
                } catch (err) {
                    console.error(err);
                    const msg = err?.response?.data || "No se pudo eliminar la orden";
                    Swal.fire("Error", msg, "error");
                }
            }
        });
    };

    const fmtDate = (d) => (d ? String(d).slice(0,10) : "-");
    const badge = (estado) => ESTADO_BADGE[estado] || "secondary";

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Órdenes de Compra</h2>
                <button className="btn btn-primary" onClick={() => navigate("/ordenes-compra/add")}>
                    Nueva Orden
                </button>
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-hover align-middle">
                    <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Proveedor</th>
                        <th>Fecha Emisión</th>
                        <th>Fecha Entrega</th>
                        <th>Estado</th>
                        <th>Costo Total</th>
                        <th>Creada por</th>
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
                                <td>{proveedoresMap[x.proveedorId]?.nombre ?? x.proveedorId}</td>
                                <td>{fmtDate(x.fechaEmision)}</td>
                                <td>{fmtDate(x.fechaEntregaEsperada)}</td>
                                <td>
                                    <span className={`badge text-bg-${badge(x.estado)}`}>{x.estado}</span>
                                </td>
                                <td>{Number(x.costoTotal ?? 0).toFixed(2)}</td>
                                <td>{usuariosMap[x.usuarioCreadorId]?.nombreCompleto ?? x.usuarioCreadorId ?? "-"}</td>
                                <td className="text-end">
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => navigate(`/ordenes-compra/edit/${x.id}`)}
                                    >Editar</button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDelete(x.id)}
                                    >Eliminar</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="8" className="text-center text-muted">No hay órdenes registradas.</td></tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrdenCompraList;
