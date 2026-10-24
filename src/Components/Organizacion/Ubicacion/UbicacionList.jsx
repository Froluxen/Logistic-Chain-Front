import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getAllUbicaciones, deleteUbicacion } from "../../../Services/Organizacion/UbicacionService.js";

/**
 * UbicacionList — Lista de ubicaciones
 * Tabla + acciones (Editar / Eliminar), estilo del profe
 */
const UbicacionList = () => {
    const [ubicaciones, setUbicaciones] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadUbicaciones();
    }, []);

    const loadUbicaciones = async () => {
        try {
            setLoading(true);
            const res = await getAllUbicaciones();
            setUbicaciones(res.data || []);
        } catch (e) {
            console.error("Error loading ubicaciones:", e);
            Swal.fire("Error", "No se pudo cargar la lista de ubicaciones", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "¿Eliminar ubicación?",
            text: "Esta acción no se puede deshacer.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteUbicacion(id);
                    Swal.fire("Eliminada", "La ubicación fue eliminada.", "success");
                    loadUbicaciones();
                } catch (e) {
                    console.error("Error deleting ubicacion:", e);
                    const msg = e?.response?.data || "No se pudo eliminar la ubicación";
                    Swal.fire("Error", msg, "error");
                }
            }
        });
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Ubicaciones</h2>
                <button
                    className="btn btn-primary"
                    onClick={() => navigate("/ubicaciones/add")}
                >
                    Agregar Ubicación
                </button>
            </div>

            <div className="table-responsive">
                <table className="table table-striped align-middle">
                    <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Código</th>
                        <th>Pasillo</th>
                        <th>Estante</th>
                        <th>Nivel</th>
                        <th>Almacén</th>
                        <th style={{ width: 160 }}>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="7" className="text-center">Cargando...</td>
                        </tr>
                    ) : ubicaciones && ubicaciones.length > 0 ? (
                        ubicaciones.map((u) => (
                            <tr key={u.id}>
                                <td>{u.id}</td>
                                <td>{u.codigo}</td>
                                <td>{u.pasillo || "-"}</td>
                                <td>{u.estante || "-"}</td>
                                <td>{u.nivel || "-"}</td>
                                <td>{u.almacenNombre || "-"}</td>
                                <td>
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => navigate(`/ubicaciones/edit/${u.id}`)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDelete(u.id)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center text-muted">
                                No hay ubicaciones registradas.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UbicacionList;
