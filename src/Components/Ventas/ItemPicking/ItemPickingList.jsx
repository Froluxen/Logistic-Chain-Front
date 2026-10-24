import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getAllItemPickings, deleteItemPicking } from "../../../Services/Ventas/ItemPickingService.js";
import { getAllProductos } from "../../../Services/Maestros/ProductoService.js";
import { getAllPickings } from "../../../Services/Ventas/PickingService.js";
import { getAllDetallesPV } from "../../../Services/Ventas/DetallePVService.js";
import { getAllLotes } from "../../../Services/Maestros/LoteService.js";         // si no lo tienes, créalo igual al resto
import { getAllUbicaciones } from "../../../Services/Organizacion/UbicacionService.js"; // idem

const num = (v) => (v == null ? "-" : Number(v));

const ItemPickingList = () => {
    const [rows, setRows] = useState([]);
    const [productosMap, setProductosMap] = useState({});
    const [pickingsMap, setPickingsMap] = useState({});
    const [detallesMap, setDetallesMap] = useState({});
    const [lotesMap, setLotesMap] = useState({});
    const [ubicMap, setUbicMap] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadItems();
        loadProductos();
        loadPickings();
        loadDetalles();
        loadLotes();
        loadUbicaciones();
    }, []);

    // loaders con tu formato
    const loadItems = async () => {
        try {
            setLoading(true);
            const res = await getAllItemPickings();
            setRows(res.data || []);
        } catch (e) {
            console.error("Error loading item pickings:", e);
            Swal.fire("Error","No se pudo cargar la lista de ItemPicking","error");
        } finally {
            setLoading(false);
        }
    };

    const loadProductos = async () => {
        try {
            const res = await getAllProductos();
            const map = {}; (res.data || []).forEach(p => map[p.id] = p);
            setProductosMap(map);
        } catch (e) {
            console.error("Error loading productos:", e);
        }
    };

    const loadPickings = async () => {
        try {
            const res = await getAllPickings();
            const map = {}; (res.data || []).forEach(p => map[p.id] = p);
            setPickingsMap(map);
        } catch (e) {
            console.error("Error loading pickings:", e);
        }
    };

    const loadDetalles = async () => {
        try {
            const res = await getAllDetallesPV();
            const map = {}; (res.data || []).forEach(d => map[d.id] = d);
            setDetallesMap(map);
        } catch (e) {
            console.error("Error loading detalles pv:", e);
        }
    };

    const loadLotes = async () => {
        try {
            const res = await getAllLotes();
            const map = {}; (res.data || []).forEach(l => map[l.id] = l);
            setLotesMap(map);
        } catch (e) {
            console.error("Error loading lotes:", e);
        }
    };

    const loadUbicaciones = async () => {
        try {
            const res = await getAllUbicaciones();
            const map = {}; (res.data || []).forEach(u => map[u.id] = u);
            setUbicMap(map);
        } catch (e) {
            console.error("Error loading ubicaciones:", e);
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "¿Eliminar ItemPicking?",
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
                    await deleteItemPicking(id);
                    Swal.fire("Eliminado","El ítem fue eliminado.","success");
                    loadItems();
                } catch (err) {
                    console.error(err);
                    const msg = err?.response?.data || "No se pudo eliminar el ítem";
                    Swal.fire("Error", msg, "error");
                }
            }
        });
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Ítems de Picking</h2>
                <button className="btn btn-primary" onClick={() => navigate("/items-picking/add")}>
                    Nuevo Ítem
                </button>
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-hover align-middle">
                    <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Picking</th>
                        <th>Detalle PV</th>
                        <th>Producto</th>
                        <th>Lote</th>
                        <th>Ubicación</th>
                        <th>A Recoger</th>
                        <th>Recogida</th>
                        <th style={{ width: 160 }}>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr><td colSpan="9" className="text-center">Cargando...</td></tr>
                    ) : rows.length > 0 ? (
                        rows.map((x) => {
                            const prod = productosMap[x.productoId];
                            const lote = lotesMap[x.loteId];
                            const ubic = ubicMap[x.ubicacionId];
                            const det  = detallesMap[x.detallePvId];
                            return (
                                <tr key={x.id}>
                                    <td>{x.id}</td>
                                    <td>{pickingsMap[x.pickingId] ? `PK #${x.pickingId}` : x.pickingId}</td>
                                    <td>{det ? `DPV #${det.id}` : x.detallePvId}</td>
                                    <td>{prod ? `${prod.sku} — ${prod.descripcion ?? prod.description ?? "-"}` : x.productoId}</td>
                                    <td>{lote ? (lote.codigoLote || lote.codigo || lote.id) : x.loteId}</td>
                                    <td>{ubic ? (ubic.nombre || `${ubic.id}`) : x.ubicacionId}</td>
                                    <td>{num(x.cantidadARecoger)}</td>
                                    <td>{num(x.cantidadRecogida)}</td>
                                    <td className="text-end">
                                        <button className="btn btn-warning btn-sm me-2" onClick={() => navigate(`/items-picking/edit/${x.id}`)}>
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
                        <tr><td colSpan="9" className="text-center text-muted">No hay ítems registrados.</td></tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ItemPickingList;
