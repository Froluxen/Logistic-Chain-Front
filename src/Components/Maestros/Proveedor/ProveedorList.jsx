import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getAllProveedores, deleteProveedor } from "../../../Services/Maestros/ProveedorService.js";

const ProveedorList = () => {
    const [proveedores, setProveedores] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadProveedores();
    }, []);

    const loadProveedores = async () => {
        try {
            setLoading(true);
            const res = await getAllProveedores();
            const data = Array.isArray(res?.data)
                ? res.data
                : Array.isArray(res?.data?.content)
                    ? res.data.content
                    : [];
            setProveedores(data);
        } catch (err) {
            console.error("Error cargando proveedores:", err);
            Swal.fire("Error", "No se pudo cargar la lista de proveedores", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "¿Eliminar Proveedor?",
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
                    await deleteProveedor(id);
                    Swal.fire("Eliminado", "El proveedor fue eliminado.", "success");
                    loadProveedores();
                } catch (error) {
                    console.error("Error eliminando proveedor:", error);
                    const msg = error?.response?.data || "No se pudo eliminar el proveedor";
                    Swal.fire("Error", msg, "error");
                }
            }
        });
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Proveedores</h2>
                <button className="btn btn-primary" onClick={() => navigate("/proveedores/add")}>
                    Nuevo Proveedor
                </button>
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-hover align-middle">
                    <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Identificador Fiscal</th>
                        <th>Dirección</th>
                        <th>Teléfono</th>
                        <th>Email Contacto</th>
                        <th style={{ width: 160 }}>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="7" className="text-center">Cargando...</td>
                        </tr>
                    ) : proveedores.length > 0 ? (
                        proveedores.map((p) => (
                            <tr key={p.id}>
                                <td>{p.id}</td>
                                <td>{p.nombre}</td>
                                <td>{p.identificadorFiscal || "-"}</td>
                                <td>{p.direccion || "-"}</td>
                                <td>{p.telefono || "-"}</td>
                                <td>{p.emailContacto || "-"}</td>
                                <td className="text-end">
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => navigate(`/proveedores/edit/${p.id}`)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDelete(p.id)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center text-muted">
                                No hay proveedores registrados.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProveedorList;
