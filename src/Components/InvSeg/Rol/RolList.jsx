import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getAllRoles, deleteRol } from "../../../Services/InvSeg/RolService.js";

const RolList = () => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const loadRoles = async () => {
        try {
            setLoading(true);
            const res = await getAllRoles();
            setRoles(res.data);
        } catch (e) {
            console.error("Error loading roles:", e);
            Swal.fire("Error", "No se pudo cargar la lista de roles", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "¿Eliminar Rol?",
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
                    await deleteRol(id);
                    Swal.fire("Eliminado", "Rol eliminado correctamente", "success");
                    loadRoles();
                } catch (err) {
                    const msg = err?.response?.data || "No se pudo eliminar el rol";
                    Swal.fire("Error", msg, "error");
                }
            }
        });
    };

    useEffect(() => { loadRoles(); }, []);

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Roles</h2>
                <button className="btn btn-primary" onClick={() => navigate("/roles/add")}>
                    Nuevo Rol
                </button>
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-hover align-middle">
                    <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th style={{ width: 160 }}>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr><td colSpan="3" className="text-center">Cargando...</td></tr>
                    ) : roles.length > 0 ? (
                        roles.map((r) => (
                            <tr key={r.id}>
                                <td>{r.id}</td>
                                <td>{r.nombre}</td>
                                <td className="text-end">
                                    <button className="btn btn-warning btn-sm me-2" onClick={() => navigate(`/roles/edit/${r.id}`)}>
                                        Editar
                                    </button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r.id)}>
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="3" className="text-center text-muted">No hay roles registrados.</td></tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RolList;
