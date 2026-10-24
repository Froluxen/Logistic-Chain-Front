import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getAllRecepciones, deleteRecepcion } from "../../../Services/Compras/RecepcionService.js";
import { getAllOrdenesCompra } from "../../../Services/Compras/OrdenCompraService.js";
import { getAllUsuarios } from "../../../Services/InvSeg/UsuarioService.js";

const BADGE = {
    EN_PROCESO: "warning",
    COMPLETADA: "success",
};

const fmtDateTime = (iso) => {
    if (!iso) return "-";
    try {
        // muestra YYYY-MM-DD HH:mm
        const d = new Date(iso);
        const pad = (n) => String(n).padStart(2, "0");
        return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch { return String(iso).slice(0,16).replace("T"," "); }
};

const RecepcionList = () => {
    const [rows, setRows] = useState([]);
    const [usersMap, setUsersMap] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => { loadAll(); }, []);

    const loadAll = async () => {
        try {
            setLoading(true);
            const [rr, or, ur] = await Promise.all([
                getAllRecepciones(),

            ]);

            const list = Array.isArray(rr?.data) ? rr.data
                : Array.isArray(rr?.data?.content) ? rr.data.content : [];

            const ocs = Array.isArray(or?.data) ? or.data
                : Array.isArray(or?.data?.content) ? or.data.content : [];
            const users = Array.isArray(ur?.data) ? ur.data
                : Array.isArray(ur?.data?.content) ? ur.data.content : [];

            const oMap = {}; ocs.forEach(o => oMap[o.id] = o);
            const uMap = {}; users.forEach(u => uMap[u.id] = u);

            setUsersMap(uMap);
            setRows(list);
        } catch (e) {
            console.error(e);
            Swal.fire("Error","No se pudo cargar la lista de recepciones","error");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "¿Eliminar Recepción?",
            text: "Esta acción no se puede deshacer.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        }).then(async r => {
            if (r.isConfirmed) {
                try {
                    await deleteRecepcion(id);
                    Swal.fire("Eliminada","La recepción fue eliminada.","success");
                    loadAll();
                } catch (err) {
                    console.error(err);
                    const msg = err?.response?.data || "No se pudo eliminar la recepción";
                    Swal.fire("Error", msg, "error");
                }
            }
        });
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Recepciones</h2>
                <button className="btn btn-primary" onClick={() => navigate("/recepciones/add")}>
                    Nueva Recepción
                </button>
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-hover align-middle">
                    <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>OC</th>
                        <th>Fecha Recepción</th>
                        <th>Guía Despacho</th>
                        <th>Receptor</th>
                        <th>Estado</th>
                        <th style={{ width: 180 }}>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr><td colSpan="7" className="text-center">Cargando...</td></tr>
                    ) : rows.length > 0 ? (
                        rows.map(x => (
                            <tr key={x.id}>
                                <td>{x.id}</td>
                                <td>{x.ordenCompraId ? `OC #${x.ordenCompraId}` : "-"}</td>
                                <td>{fmtDateTime(x.fechaRecepcion)}</td>
                                <td>{x.guiaDespachoProveedor || "-"}</td>
                                <td>{usersMap[x.usuarioReceptorId]?.nombre ?? x.usuarioReceptorId ?? "-"}</td>
                                <td><span className={`badge text-bg-${BADGE[x.estado] || "secondary"}`}>{x.estado}</span></td>
                                <td className="text-end">
                                    <button className="btn btn-warning btn-sm me-2" onClick={() => navigate(`/recepciones/edit/${x.id}`)}>Editar</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(x.id)}>Eliminar</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="7" className="text-center text-muted">No hay recepciones registradas.</td></tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecepcionList;
