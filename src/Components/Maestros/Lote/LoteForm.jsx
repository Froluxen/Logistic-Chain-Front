import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
    createLote,
    updateLote,
    getLoteById,
} from "../../../Services/Maestros/LoteService.js";
import { getAllProductos } from "../../../Services/Maestros/ProductoService.js";

const empty = {
    productoId: "",
    codigoLote: "",
    fechaVencimiento: "",
    fechaRecepcion: "",
    stockActual: 0,
};

const LoteForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [model, setModel] = useState(empty);
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadProductos();
        if (id) loadLote();
    }, [id]);

    const loadProductos = async () => {
        try {
            const res = await getAllProductos();
            const data = Array.isArray(res?.data)
                ? res.data
                : Array.isArray(res?.data?.content)
                    ? res.data.content
                    : [];
            setProductos(data);
        } catch {
            Swal.fire("Error", "No se pudieron cargar los productos", "error");
        }
    };

    const loadLote = async () => {
        try {
            setLoading(true);
            const res = await getLoteById(id);
            setModel(res.data);
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "No se pudo cargar el lote", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setModel((prev) => ({
            ...prev,
            [name]: type === "number" ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dto = {
            productoId: Number(model.productoId),
            codigoLote: model.codigoLote,
            fechaVencimiento: model.fechaVencimiento || null,
            fechaRecepcion: model.fechaRecepcion || null,
            stockActual: Number(model.stockActual ?? 0),
        };
        try {
            setLoading(true);
            if (id) {
                await updateLote(id, dto);
                Swal.fire("Actualizado", "Lote actualizado correctamente", "success");
            } else {
                await createLote(dto);
                Swal.fire("Registrado", "Lote creado correctamente", "success");
            }
            navigate("/lotes");
        } catch (error) {
            console.error(error);
            const msg = error?.response?.data || "No se pudo guardar el lote";
            Swal.fire("Error", msg, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <h2>{id ? "Editar Lote" : "Nuevo Lote"}</h2>
            <hr />
            <form className="row g-3" onSubmit={handleSubmit}>
                {/* Producto */}
                <div className="col-md-6">
                    <label className="form-label">Producto *</label>
                    <select
                        name="productoId"
                        className="form-select"
                        value={model.productoId || ""}
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- Seleccionar --</option>
                        {productos.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.sku} — {p.descripcion}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Código Lote */}
                <div className="col-md-6">
                    <label className="form-label">Código de Lote *</label>
                    <input
                        type="text"
                        className="form-control"
                        name="codigoLote"
                        value={model.codigoLote}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Fechas */}
                <div className="col-md-3">
                    <label className="form-label">Fecha de Recepción *</label>
                    <input
                        type="date"
                        className="form-control"
                        name="fechaRecepcion"
                        value={model.fechaRecepcion || ""}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="col-md-3">
                    <label className="form-label">Fecha de Vencimiento</label>
                    <input
                        type="date"
                        className="form-control"
                        name="fechaVencimiento"
                        value={model.fechaVencimiento || ""}
                        onChange={handleChange}
                    />
                </div>

                {/* Stock Actual */}
                <div className="col-md-3">
                    <label className="form-label">Stock Actual *</label>
                    <input
                        type="number"
                        className="form-control"
                        name="stockActual"
                        value={model.stockActual}
                        onChange={handleChange}
                        required
                        min="0"
                    />
                </div>

                {/* Botones */}
                <div className="col-12 mt-3 d-flex gap-2">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? "Guardando..." : "Guardar"}
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate("/lotes")}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LoteForm;
