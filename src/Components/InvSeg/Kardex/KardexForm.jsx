import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { createKardex, updateKardex, getKardexById } from "../../../Services/InvSeg/KardexService.js";
import { getAllProductos } from "../../../Services/Maestros/ProductoService.js";
import { getAllLotes } from "../../../Services/Maestros/LoteService.js";
import { getAllAlmacenes } from "../../../Services/Organizacion/AlmacenService.js";

const TIPOS = [
    "ENTRADA_COMPRA",
    "SALIDA_VENTA",
    "TRANSFERENCIA",
    "AJUSTE_POSITIVO",
    "AJUSTE_NEGATIVO",
];

// ISO ↔ datetime-local helpers
const toLocalDT = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
const toISO = (localDT) => (localDT ? new Date(localDT).toISOString() : null);

const KardexForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        fecha: "",                 // datetime-local
        productoId: "",
        loteId: "",
        almacenId: "",
        tipoMovimiento: "ENTRADA_COMPRA",
        cantidad: 0,
        saldoResultante: 0,
        referenciaDocumento: "",
    });

    const [productos, setProductos] = useState([]);
    const [lotes, setLotes] = useState([]);
    const [almacenes, setAlmacenes] = useState([]);
    const [loading, setLoading] = useState(false);

    // loaders (tu formato)
    const loadProductos = async () => {
        try {
            const res = await getAllProductos();
            setProductos(res.data);
        } catch (e) {
            console.error("Error loading productos:", e);
            Swal.fire("Error","No se pudieron cargar los productos","error");
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
    const loadAlmacenes = async () => {
        try {
            const res = await getAllAlmacenes();
            setAlmacenes(res.data);
        } catch (e) {
            console.error("Error loading almacenes:", e);
            Swal.fire("Error","No se pudieron cargar los almacenes","error");
        }
    };
    const loadKardex = async () => {
        try {
            const res = await getKardexById(id);
            const k = res.data;
            setForm({
                fecha: toLocalDT(k.fecha),
                productoId: k.productoId || "",
                loteId: k.loteId || "",
                almacenId: k.almacenId || "",
                tipoMovimiento: k.tipoMovimiento || "ENTRADA_COMPRA",
                cantidad: Number(k.cantidad ?? 0),
                saldoResultante: Number(k.saldoResultante ?? 0),
                referenciaDocumento: k.referenciaDocumento || "",
            });
        } catch (e) {
            console.error("Error loading kardex:", e);
            Swal.fire("Error","No se pudo cargar el movimiento","error");
        }
    };

    useEffect(() => {
        loadProductos();
        loadLotes();
        loadAlmacenes();
        if (id) loadKardex();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setForm(prev => ({ ...prev, [name]: type === "number" ? Number(value) : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dto = {
            fecha: form.fecha ? toISO(form.fecha) : null,
            productoId: Number(form.productoId),
            loteId: Number(form.loteId),
            almacenId: Number(form.almacenId),
            tipoMovimiento: form.tipoMovimiento,
            cantidad: Number(form.cantidad),
            saldoResultante: Number(form.saldoResultante),
            referenciaDocumento: form.referenciaDocumento,
        };

        try {
            setLoading(true);
            if (id) {
                await updateKardex(id, dto);
                Swal.fire("Actualizado","Movimiento actualizado","success");
            } else {
                await createKardex(dto);
                Swal.fire("Creado","Movimiento creado","success");
            }
            navigate("/kardex");
        } catch (error) {
            console.error("Error saving kardex:", error);
            const msg = error?.response?.data || "No se pudo guardar el movimiento";
            Swal.fire("Error", msg, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <h2>{id ? "Editar Movimiento" : "Nuevo Movimiento"}</h2>
            <form onSubmit={handleSubmit} className="row g-3">
                {/* Fecha */}
                <div className="col-md-4">
                    <label className="form-label">Fecha *</label>
                    <input
                        type="datetime-local"
                        className="form-control"
                        name="fecha"
                        value={form.fecha}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Tipo */}
                <div className="col-md-4">
                    <label className="form-label">Tipo de Movimiento *</label>
                    <select className="form-select" name="tipoMovimiento" value={form.tipoMovimiento} onChange={handleChange} required>
                        {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>

                {/* Cantidad */}
                <div className="col-md-4">
                    <label className="form-label">Cantidad *</label>
                    <input type="number" className="form-control" name="cantidad" value={form.cantidad} onChange={handleChange} required />
                </div>

                {/* Producto */}
                <div className="col-md-6">
                    <label className="form-label">Producto *</label>
                    <select className="form-select" name="productoId" value={form.productoId} onChange={handleChange} required>
                        <option value="">-- Seleccionar --</option>
                        {(productos || []).map(p => (
                            <option key={p.id} value={p.id}>{p.sku} — {p.descripcion ?? p.description}</option>
                        ))}
                    </select>
                </div>

                {/* Lote */}
                <div className="col-md-6">
                    <label className="form-label">Lote *</label>
                    <select className="form-select" name="loteId" value={form.loteId} onChange={handleChange} required>
                        <option value="">-- Seleccionar --</option>
                        {(lotes || []).map(l => (
                            <option key={l.id} value={l.id}>{l.codigoLote || l.codigo || `Lote #${l.id}`}</option>
                        ))}
                    </select>
                </div>

                {/* Almacén */}
                <div className="col-md-6">
                    <label className="form-label">Almacén *</label>
                    <select className="form-select" name="almacenId" value={form.almacenId} onChange={handleChange} required>
                        <option value="">-- Seleccionar --</option>
                        {(almacenes || []).map(a => (
                            <option key={a.id} value={a.id}>{a.nombre || `Almacén #${a.id}`}</option>
                        ))}
                    </select>
                </div>

                {/* Saldo resultante */}
                <div className="col-md-6">
                    <label className="form-label">Saldo Resultante</label>
                    <input type="number" className="form-control" name="saldoResultante" value={form.saldoResultante} onChange={handleChange} />
                </div>

                {/* Referencia */}
                <div className="col-12">
                    <label className="form-label">Referencia de Documento</label>
                    <input type="text" className="form-control" name="referenciaDocumento" value={form.referenciaDocumento} onChange={handleChange} placeholder='Ej: "OC-123", "PV-789"' />
                </div>

                <div className="col-12 mt-3 d-flex gap-2">
                    <button type="submit" className="btn btn-success" disabled={loading}>
                        {loading ? "Guardando..." : "Guardar"}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate("/kardex")}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default KardexForm;
