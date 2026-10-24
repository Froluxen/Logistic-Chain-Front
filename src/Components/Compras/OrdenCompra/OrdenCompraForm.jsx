import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { createOrdenCompra, updateOrdenCompra, getOrdenCompraById} from "../../../Services/Compras/OrdenCompraService.js";
import { getAllProveedores} from "../../../Services/Maestros/ProveedorService.js";
import { getAllUsuarios } from "../../../Services/InvSeg/UsuarioService.js";

const ESTADOS = ["PENDIENTE", "RECIBIDA_PARCIAL", "RECIBIDA_COMPLETA", "CANCELADA"];

const empty = {
    proveedorId: "",
    fechaEmision: "",
    fechaEntregaEsperada: "",
    estado: "PENDIENTE",
    costoTotal: 0,
    usuarioCreadorId: "",
};

const OrdenCompraForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [model, setModel] = useState(empty);
    const [proveedores, setProveedores] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(false);

    const provsSorted = useMemo(
        () => [...proveedores].sort((a,b) => (a.nombre||"").localeCompare(b.nombre||"")),
        [proveedores]
    );

    useEffect(() => {
        (async () => {
            try {
                const [pr, ur] = await Promise.all([getAllProveedores(), getAllUsuarios()]);
                const p = Array.isArray(pr?.data) ? pr.data : Array.isArray(pr?.data?.content) ? pr.data.content : [];
                const u = Array.isArray(ur?.data) ? ur.data : Array.isArray(ur?.data?.content) ? ur.data.content : [];
                setProveedores(p);
                setUsuarios(u);
            } catch {
                Swal.fire("Error", "No se pudieron cargar proveedores/usuarios", "error");
            }
        })();
    }, []);

    useEffect(() => {
        if (id) loadOC();
        else setModel(empty);
    }, [id]);

    const loadOC = async () => {
        try {
            setLoading(true);
            const res = await getOrdenCompraById(id);
            const d = res.data || {};
            setModel({
                proveedorId: d.proveedorId ?? "",
                fechaEmision: d.fechaEmision ?? "",
                fechaEntregaEsperada: d.fechaEntregaEsperada ?? "",
                estado: d.estado ?? "PENDIENTE",
                costoTotal: Number(d.costoTotal ?? 0),
                usuarioCreadorId: d.usuarioCreadorId ?? "",
            });
        } catch (e) {
            console.error(e);
            Swal.fire("Error", "No se pudo cargar la orden de compra", "error");
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
            proveedorId: Number(model.proveedorId),
            fechaEmision: model.fechaEmision || null,
            fechaEntregaEsperada: model.fechaEntregaEsperada || null,
            estado: model.estado,
            costoTotal: Number(model.costoTotal ?? 0),
            usuarioCreadorId: Number(model.usuarioCreadorId),
        };

        try {
            setLoading(true);
            if (id) {
                await updateOrdenCompra(id, dto);
                Swal.fire("Actualizada", "Orden de compra actualizada", "success");
            } else {
                await createOrdenCompra(dto);
                Swal.fire("Registrada", "Orden de compra creada", "success");
            }
            navigate("/ordenes-compra");
        } catch (error) {
            console.error(error);
            const msg = error?.response?.data || "No se pudo guardar la orden";
            Swal.fire("Error", msg, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <h2>{id ? "Editar Orden de Compra" : "Nueva Orden de Compra"}</h2>
            <hr />

            <form className="row g-3" onSubmit={handleSubmit}>
                {/* Proveedor */}
                <div className="col-md-6">
                    <label className="form-label">Proveedor *</label>
                    <select
                        className="form-select"
                        name="proveedorId"
                        value={model.proveedorId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- Seleccionar --</option>
                        {provsSorted.map((p) => (
                            <option key={p.id} value={p.id}>{p.nombre}</option>
                        ))}
                    </select>
                </div>

                {/* Usuario creador */}
                <div className="col-md-6">
                    <label className="form-label">Usuario Creador *</label>
                    <select
                        className="form-select"
                        name="usuarioCreadorId"
                        value={model.usuarioCreadorId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- Seleccionar --</option>
                        {usuarios.map((u) => (
                            <option key={u.id} value={u.id}>{u.nombreCompleto || u.nombreUsuario || u.email}</option>
                        ))}
                    </select>
                </div>

                {/* Fechas */}
                <div className="col-md-3">
                    <label className="form-label">Fecha Emisión *</label>
                    <input
                        type="date"
                        className="form-control"
                        name="fechaEmision"
                        value={model.fechaEmision || ""}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="col-md-3">
                    <label className="form-label">Fecha Entrega Esperada</label>
                    <input
                        type="date"
                        className="form-control"
                        name="fechaEntregaEsperada"
                        value={model.fechaEntregaEsperada || ""}
                        onChange={handleChange}
                    />
                </div>

                {/* Estado */}
                <div className="col-md-3">
                    <label className="form-label">Estado *</label>
                    <select
                        className="form-select"
                        name="estado"
                        value={model.estado}
                        onChange={handleChange}
                        required
                    >
                        {ESTADOS.map((e) => (
                            <option key={e} value={e}>{e}</option>
                        ))}
                    </select>
                </div>

                {/* Costo Total */}
                <div className="col-md-3">
                    <label className="form-label">Costo Total</label>
                    <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        name="costoTotal"
                        value={model.costoTotal}
                        onChange={handleChange}
                    />
                </div>

                {/* Botones */}
                <div className="col-12 mt-3 d-flex gap-2">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? "Guardando..." : "Guardar"}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate("/ordenes-compra")}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default OrdenCompraForm;
