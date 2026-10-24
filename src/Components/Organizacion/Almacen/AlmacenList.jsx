import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getAllAlmacenes, deleteAlmacen } from "../../../Services/Organizacion/AlmacenService.js";

/**
 * AlmacenList — Lista de almacenes
 * Tabla con acciones al estilo del profe (Bootstrap + SweetAlert2)
 */
const AlmacenList = () => {
    const [almacenes, setAlmacenes] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadAlmacenes();
    }, []);

    const loadAlmacenes = async () => {
        try {
            setLoading(true);
            const res = await getAllAlmacenes();
            setAlmacenes(res.data);
        } catch (error) {
            console.error("Error loading almacenes:", error);
            Swal.fire("Error", "No se pudo cargar la lista de almacenes", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "¿Eliminar almacén?",
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
                    await deleteAlmacen(id);
                    Swal.fire("Eliminado", "El almacén fue eliminado.", "success");
                    loadAlmacenes();
                } catch (error) {
                    console.error("Error deleting almacen:", error);
                    const msg = error?.response?.data || "No se pudo eliminar el almacén";
                    Swal.fire("Error", msg, "error");
                }
            }
        });
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Almacenes</h2>
                <button
                    className="btn btn-primary"
                    onClick={() => navigate("/almacenes/add")}
                >
                    Agregar Almacén
                </button>
            </div>

            <div className="table-responsive">
                <table className="table table-striped align-middle">
                    <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Tipo</th>
                        <th>Sucursal</th>
                        <th style={{ width: 160 }}>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="5" className="text-center">Cargando...</td>
                        </tr>
                    ) : almacenes && almacenes.length > 0 ? (
                        almacenes.map((a) => (
                            <tr key={a.id}>
                                <td>{a.id}</td>
                                <td>{a.nombre}</td>
                                <td>{a.tipo || "-"}</td>
                                <td>{a.sucursalNombre || "-"}</td>
                                <td>
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => navigate(`/almacenes/edit/${a.id}`)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDelete(a.id)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center text-muted">
                                No hay almacenes registrados.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AlmacenList;
