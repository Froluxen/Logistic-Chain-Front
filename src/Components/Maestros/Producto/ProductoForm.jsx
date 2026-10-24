import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
    createProducto,
    updateProducto,
    getProductoById,
} from "../../../Services/Maestros/ProductoService.js";

const empty = {
    sku: "",
    gtin: "",
    descripcion: "",
    marca: "",
    unidadMedida: "",
    costoPromedio: 0,
    precioVentaBase: 0,
    pesoKg: 0,
    manejaLote: false,
    manejaFechaVencimiento: false,
    stockMinimo: 0,
    stockMaximo: 0,
};

const ProductoForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [producto, setProducto] = useState(empty);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            loadProducto();
        }
    }, [id]);

    const loadProducto = async () => {
        try {
            setLoading(true);
            const res = await getProductoById(id);
            setProducto(res.data);
        } catch (error) {
            console.error("Error loading Producto:", error);
            Swal.fire("Error", "No se pudo cargar el producto", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProducto((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? checked
                    : type === "number"
                        ? Number(value)
                        : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                await updateProducto(id, producto);
                Swal.fire("Actualizado", "Producto actualizado correctamente", "success");
            } else {
                await createProducto(producto);
                Swal.fire("Registrado", "Producto creado correctamente", "success");
            }
            navigate("/productos");
        } catch (error) {
            console.error("Error saving Producto:", error);
            const msg = error?.response?.data || "No se pudo guardar el producto";
            Swal.fire("Error", msg, "error");
        }
    };

    return (
        <div className="container mt-4">
            <h2>{id ? "Editar Producto" : "Nuevo Producto"}</h2>
            <hr />
            <form className="row g-3" onSubmit={handleSubmit}>
                {/* SKU / GTIN */}
                <div className="col-md-3">
                    <label className="form-label">SKU *</label>
                    <input
                        type="text"
                        className="form-control"
                        name="sku"
                        value={producto.sku}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="col-md-3">
                    <label className="form-label">GTIN</label>
                    <input
                        type="text"
                        className="form-control"
                        name="gtin"
                        value={producto.gtin}
                        onChange={handleChange}
                    />
                </div>

                {/* Descripción / Marca */}
                <div className="col-md-6">
                    <label className="form-label">Descripción *</label>
                    <input
                        type="text"
                        className="form-control"
                        name="descripcion"
                        value={producto.descripcion}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="col-md-3">
                    <label className="form-label">Marca</label>
                    <input
                        type="text"
                        className="form-control"
                        name="marca"
                        value={producto.marca || ""}
                        onChange={handleChange}
                    />
                </div>

                {/* Unidad / Costos */}
                <div className="col-md-3">
                    <label className="form-label">Unidad de Medida</label>
                    <input
                        type="text"
                        className="form-control"
                        name="unidadMedida"
                        value={producto.unidadMedida}
                        onChange={handleChange}
                        placeholder='Ej: "Unidad", "Caja", "Kg"'
                    />
                </div>
                <div className="col-md-3">
                    <label className="form-label">Costo Promedio</label>
                    <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        name="costoPromedio"
                        value={producto.costoPromedio}
                        onChange={handleChange}
                    />
                </div>
                <div className="col-md-3">
                    <label className="form-label">Precio Venta Base</label>
                    <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        name="precioVentaBase"
                        value={producto.precioVentaBase}
                        onChange={handleChange}
                    />
                </div>

                {/* Peso */}
                <div className="col-md-3">
                    <label className="form-label">Peso (kg)</label>
                    <input
                        type="number"
                        step="0.001"
                        className="form-control"
                        name="pesoKg"
                        value={producto.pesoKg}
                        onChange={handleChange}
                    />
                </div>

                {/* Manejo booleanos */}
                <div className="col-md-3 form-check mt-4">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        name="manejaLote"
                        checked={producto.manejaLote}
                        onChange={handleChange}
                        id="maneja_lote"
                    />
                    <label className="form-check-label" htmlFor="maneja_lote">
                        Maneja Lote
                    </label>
                </div>
                <div className="col-md-4 form-check mt-4">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        name="manejaFechaVencimiento"
                        checked={producto.manejaFechaVencimiento}
                        onChange={handleChange}
                        id="maneja_fecha_vencimiento"
                    />
                    <label className="form-check-label" htmlFor="maneja_fecha_vencimiento">
                        Maneja Fecha de Vencimiento
                    </label>
                </div>

                {/* Stocks */}
                <div className="col-md-3">
                    <label className="form-label">Stock Mínimo</label>
                    <input
                        type="number"
                        className="form-control"
                        name="stockMinimo"
                        value={producto.stockMinimo}
                        onChange={handleChange}
                    />
                </div>
                <div className="col-md-3">
                    <label className="form-label">Stock Máximo</label>
                    <input
                        type="number"
                        className="form-control"
                        name="stockMaximo"
                        value={producto.stockMaximo}
                        onChange={handleChange}
                    />
                </div>

                {/* Botones */}
                <div className="col-12 mt-3 d-flex gap-2">
                    <button className="btn btn-primary" type="submit" disabled={loading}>
                        {loading ? "Guardando..." : "Guardar"}
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate("/productos")}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductoForm;
