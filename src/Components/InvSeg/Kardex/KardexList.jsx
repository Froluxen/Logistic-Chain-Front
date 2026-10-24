import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getAllKardex, deleteKardex } from "../../../Services/InvSeg/KardexService.js";
import { getAllProductos } from "../../../Services/Maestros/ProductoService.js";
import { getAllLotes } from "../../../Services/Maestros/LoteService.js";
import { getAllAlmacenes } from "../../../Services/Organizacion/AlmacenService.js";

const BADGE = {
    ENTRADA_COMPRA: "success",
    AJUSTE_POSITIVO: "success",
    SALIDA_VENTA: "danger",
    TRANSFERENCIA: "info",
    AJUSTE_NEGATIVO: "warning",
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

const num = (v) => (v == null ? "-" : Number(v));

const KardexList = () => {
    const [rows, setRows] = useState([]);
    const [prodMap, setProdMap] = useState({});
    const [loteMap, setLoteMap] = useState({});
    const [almMap, setAlmMap] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadKardex();
        loadProductos();
        loadLotes();
        loadAlmacenes();
    }, []);

    // loaders con tu formato
    const loadKardex = async () => {
        try {
            setLoading(true);
            const res = await getAllKardex();
            const list = res.data || [];
            const mapped = list.map(k => ({ ...k, fechaStr: fmtDateTime(k.fecha) }));
            setRows(mapped);
        } catch (e) {
            console.error("Error loading kardex:", e);
            Swal.fire("Error","No se pudo cargar el Kardex","error");
        } finally {
            setLoading(false);
        }
    };

    const loadProductos = async () => {
        try {
            const res = await getAllProductos();
            const map = {}; (res.data || []).forEach(p => map[p.id] = p);
            setProdMap(map);
        } catch { /* noop */ }
    };
    const loadLotes = async () => {
        try {
            const res = await getAllLotes();
            const map = {}; (res.data || []).forEach(l => map[l.id] = l);
            setLoteMap(map);
        } catch { /* noop */ }
    };
    const loadAlmacenes = async () => {
        try {
            const res = await getAllAlmacenes();
            const map = {}; (res.data || []).forEach(a => map[a.id] = a);
            setAlmMap(map);
        } catch { /* noop */ }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "¿Eliminar movimiento?",
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
                    await deleteKardex(id);
                    Swal.fire("Eliminado","Movimiento eliminado.","success");
                    loadKardex();
                } catch (err) {
                    const msg = err?.response?.data || "No se pudo eliminar el movimiento";
                    Swal.fire("Error", msg, "error");
                }
            }
        });
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Kardex</h2>
                <button className="btn btn-primary" onClick={() => navigate("/kardex/add")}>
                    Nuevo Movimiento
                </button>
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-hover align-middle">
                    <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Fecha</th>
                        <th>Producto</th>
                        <th>Lote</th>
                        <th>Almacén</th>
                        <th>Tipo</th>
                        <th>Cantidad</th>
                        <th>Saldo Resultante</th>
                        <th>Referencia</th>
                        <th style={{ width: 160 }}>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr><td colSpan="10" className="text-center">Cargando...</td></tr>
                    ) : rows.length > 0 ? (
                        rows.map((x) => {
                            const prod = prodMap[x.productoId];
                            const lote = loteMap[x.loteId];
                            const alm  = almMap[x.almacenId];
                            return (
                                <tr key={x.id}>
                                    <td>{x.id}</td>
                                    <td>{x.fechaStr}</td>
                                    <td>{prod ? `${prod.sku} — ${prod.descripcion ?? prod.description ?? "-"}` : x.productoId}</td>
                                    <td>{lote ? (lote.codigoLote || lote.codigo || `Lote #${lote.id}`) : x.loteId}</td>
                                    <td>{alm ? (alm.nombre || `Almacén #${alm.id}`) : x.almacenId}</td>
                                    <td><span className={`badge text-bg-${BADGE[x.tipoMovimiento] || "secondary"}`}>{x.tipoMovimiento}</span></td>
                                    <td>{num(x.cantidad)}</td>
                                    <td>{num(x.saldoResultante)}</td>
                                    <td>{x.referenciaDocumento || "-"}</td>
                                    <td className="text-end">
                                        <button className="btn btn-warning btn-sm me-2" onClick={() => navigate(`/kardex/edit/${x.id}`)}>Editar</button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(x.id)}>Eliminar</button>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr><td colSpan="10" className="text-center text-muted">No hay movimientos.</td></tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default KardexList;
