import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { createItemPicking, updateItemPicking, getItemPickingById } from "../../../Services/Ventas/ItemPickingService.js";
import { getAllProductos } from "../../../Services/Maestros/ProductoService.js";
import { getAllPickings } from "../../../Services/Ventas/PickingService.js";
import { getAllDetallesPV } from "../../../Services/Ventas/DetallePVService.js";
import { getAllLotes } from "../../../Services/Maestros/LoteService.js";
import { getAllUbicaciones } from "../../../Services/Organizacion/UbicacionService.js";

const empty = {
    pickingId: "",
    detallePvId: "",
    productoId: "",
    loteId: "",
    ubicacionId: "",
    cantidadARecoger: 1,
    cantidadRecogida: 0,
};

const ItemPickingForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState(empty);
    const [productos, setProductos] = useState([]);
    const [pickings, setPickings] = useState([]);
    const [detalles, setDetalles] = useState([]);
    const [lotes, setLotes] = useState([]);
    const [ubicaciones, setUbicaciones] = useState([]);
    const [loading, setLoading] = useState(false);

    const productosSorted = useMemo(
        () => [...productos].sort((a,b) => (a.sku || "").localeCompare(b.sku || "")),
        [productos]
    );

    // loaders
    const loadProductos = async () => {
        try {
            const res = await getAllProductos();
            setProductos(res.data);
        } catch (e) {
            console.error("Error loading productos:", e);
            Swal.fire("Error","No se pudieron cargar los productos","error");
        }
    };
    const loadPickings = async () => {
        try {
            const res = await getAllPickings();
            setPickings(res.data);
        } catch (e) {
            console.error("Error loading pickings:", e);
            Swal.fire("Error","No se pudieron cargar los pickings","error");
        }
    };
    const loadDetalles = async () => {
        try {
            const res = await getAllDetallesPV();
            setDetalles(res.data);
        } catch (e) {
            console.error("Error loading detalles pv:", e);
            Swal.fire("Error","No se pudieron cargar los detalles de PV","error");
        }
    };
    const loadLotes = async () => {
        try {
            const res = await getAllLotes();
            setLotes(res.data);
        } catch (e) {
            console.error("Error loading lotes:", e);
            Swal.fire("Error","No se pudieron cargar los lotes","error");
        }
    };
    const loadUbicaciones = async () => {
        try {
            const res = await getAllUbicaciones();
            setUbicaciones(res.data);
        } catch (e) {
            console.error("Error loading ubicaciones:", e);
            Swal.fire("Error","No se pudieron cargar las ubicaciones","error");
        }
    };

    const loadItem = async () => {
        try {
            const res = await getItemPickingById(id);
            const x = res.data;
            setForm({
                pickingId: x.pickingId || "",
                detallePvId: x.detallePvId || "",
                productoId: x.productoId || "",
                loteId: x.loteId || "",
                ubicacionId: x.ubicacionId || "",
                cantidadARecoger: Number(x.cantidadARecoger ?? 1),
                cantidadRecogida: Number(x.cantidadRecogida ?? 0),
            });
        } catch (e) {
            console.error("Error loading item picking:", e);
            Swal.fire("Error","No se pudo cargar el ítem","error");
        }
    };

    useEffect(() => {
        loadProductos();
        loadPickings();
        loadDetalles();
        loadLotes();
        loadUbicaciones();
        if (id) loadItem();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setForm(prev => ({ ...prev, [name]: type === "number" ? Number(value) : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dto = {
            pickingId: Number(form.pickingId),
            detallePvId: Number(form.detallePvId),
            productoId: Number(form.productoId),
            loteId: Number(form.loteId),
            ubicacionId: Number(form.ubicacionId),
            cantidadARecoger: Number(form.cantidadARecoger),
            cantidadRecogida: Number(form.cantidadRecogida),
        };

        try {
            setLoading(true);
            if (id) {
                await updateItemPicking(id, dto);
                Swal.fire("Actualizado","Ítem actualizado","success");
            } else {
                await createItemPicking(dto);
                Swal.fire("Creado","Ítem creado","success");
            }
            navigate("/items-picking");
        } catch (error) {
            console.error("Error saving item picking:", error);
            const msg = error?.response?.data || "No se pudo guardar el ítem";
            Swal.fire("Error", msg, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <h2>{id ? "Editar Ítem de Picking" : "Nuevo Ítem de Picking"}</h2>
            <form className="row g-3" onSubmit={handleSubmit}>
                {/* Picking */}
                <div className="col-md-4">
                    <label className="form-label">Picking *</label>
                    <select className="form-select" name="pickingId" value={form.pickingId} onChange={handleChange} required>
                        <option value="">-- Seleccionar --</option>
                        {pickings.map(p => <option key={p.id} value={p.id}>{`PK #${p.id} — ${p.estado}`}</option>)}
                    </select>
                </div>

                {/* Detalle PV */}
                <div className="col-md-4">
                    <label className="form-label">Detalle PV *</label>
                    <select className="form-select" name="detallePvId" value={form.detallePvId} onChange={handleChange} required>
                        <option value="">-- Seleccionar --</option>
                        {detalles.map(d => <option key={d.id} value={d.id}>{`DPV #${d.id} — Prod ${d.productoId} — Cant ${d.cantidad}`}</option>)}
                    </select>
                </div>

                {/* Producto */}
                <div className="col-md-4">
                    <label className="form-label">Producto *</label>
                    <select className="form-select" name="productoId" value={form.productoId} onChange={handleChange} required>
                        <option value="">-- Seleccionar --</option>
                        {productosSorted.map(p => (
                            <option key={p.id} value={p.id}>{p.sku} — {p.descripcion ?? p.description}</option>
                        ))}
                    </select>
                </div>

                {/* Lote */}
                <div className="col-md-6">
                    <label className="form-label">Lote *</label>
                    <select className="form-select" name="loteId" value={form.loteId} onChange={handleChange} required>
                        <option value="">-- Seleccionar --</option>
                        {lotes.map(l => (
                            <option key={l.id} value={l.id}>
                                {l.codigoLote || l.codigo || `Lote #${l.id}`}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Ubicación */}
                <div className="col-md-6">
                    <label className="form-label">Ubicación *</label>
                    <select className="form-select" name="ubicacionId" value={form.ubicacionId} onChange={handleChange} required>
                        <option value="">-- Seleccionar --</option>
                        {ubicaciones.map(u => (
                            <option key={u.id} value={u.id}>
                                {u.nombre || `Ubicación #${u.id}`}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Cantidades */}
                <div className="col-md-6">
                    <label className="form-label">Cantidad a Recoger *</label>
                    <input type="number" min="0" className="form-control" name="cantidadARecoger" value={form.cantidadARecoger} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                    <label className="form-label">Cantidad Recogida</label>
                    <input type="number" min="0" className="form-control" name="cantidadRecogida" value={form.cantidadRecogida} onChange={handleChange} />
                </div>

                <div className="col-12 mt-3 d-flex gap-2">
                    <button type="submit" className="btn btn-success" disabled={loading}>
                        {loading ? "Guardando..." : "Guardar"}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate("/items-picking")}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ItemPickingForm;
