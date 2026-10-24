import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getAllUsuarios, deleteUsuario } from "../../../Services/InvSeg/UsuarioService.js";

const UsuarioList = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const loadUsuarios = async () => {
        try {
            setLoading(true);
            const res = await getAllUsuarios();
            setUsuarios(res.data);
        } catch (e) {
            console.error("Error loading usuarios:", e);
            Swal.fire("Error", "No se pudo cargar la lista de usuarios", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "¿Eliminar Usuario?",
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
                    await deleteUsuario(id);
                    Swal.fire("Eliminado", "Usuario eliminado correctamente", "success");
                    loadUsuarios();
                } catch (err) {
                    const msg = err?.response?.data || "No se pudo eliminar el usuario";
                    Swal.fire("Error", msg, "error");
                }
            }
        });
    };

    useEffect(() => { loadUsuarios(); }, []);

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Usuarios</h2>
                <button className="btn btn-primary" onClick={() => navigate("/usuarios/add")}>
                    Nuevo Usuario
                </button>
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-hover align-middle">
                    <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Nombre Usuario</th>
                        <th>Nombre Completo</th>
                        <th>Email</th>
                        <th>Activo</th>
                        <th style={{ width: 160 }}>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr><td colSpan="6" className="text-center">Cargando...</td></tr>
                    ) : usuarios.length > 0 ? (
                        usuarios.map((u) => (
                            <tr key={u.id}>
                                <td>{u.id}</td>
                                <td>{u.nombreUsuario}</td>
                                <td>{u.nombreCompleto}</td>
                                <td>{u.email}</td>
                                <td>
                    <span className={`badge text-bg-${u.activo ? "success" : "secondary"}`}>
                      {u.activo ? "Sí" : "No"}
                    </span>
                                </td>
                                <td className="text-end">
                                    <button className="btn btn-warning btn-sm me-2" onClick={() => navigate(`/usuarios/edit/${u.id}`)}>
                                        Editar
                                    </button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u.id)}>
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="6" className="text-center text-muted">No hay usuarios registrados.</td></tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsuarioList;
