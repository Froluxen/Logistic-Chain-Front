import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {deleteDireccio, getAllDirecciones} from "../../../Services/Maestros/DireccionService.js";


const DireccionList = () => {
    const [direcciones, setDirecciones] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadDirecicones();
    }, []);

    const loadDirecicones = async () => {
        try {
            setLoading(true);
            const res = await getAllDirecciones();
            setDirecciones(res.data);
        } catch (error) {
            console.error("Error loading Direccio:", error);
            Swal.fire("Error", "No se pudo cargar la lista de Direccio", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "¿Eliminar Direccion?",
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
                    await deleteDireccio(id);
                    Swal.fire("Eliminado", "El Direccion fue eliminado.", "success");
                    loadDirecicones();
                } catch (error) {
                    console.error("Error deleting Direccion:", error);
                    const msg = error?.response?.data || "No se pudo eliminar el Direccion";
                    Swal.fire("Error", msg, "error");
                }
            }
        });
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Direccion</h2>
                <button
                    className="btn btn-primary"
                    onClick={() => navigate("/direcciones/add")}
                >
                    Agregar Direccion
                </button>
            </div>

            <div className="table-responsive">
                <table className="table table-striped align-middle">
                    <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Calle</th>
                        <th>Ciudad</th>
                        <th>Estado</th>
                        <th>Pais</th>
                        <th>CodigoPostal</th>
                        <th style={{ width: 160 }}>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="5" className="text-center">Cargando...</td>
                        </tr>
                    ) : direcciones && direcciones.length > 0 ? (
                        direcciones.map((a) => (
                            <tr key={a.id}>
                                <td>{a.id}</td>
                                <td>{a.calle}</td>
                                <td>{a.ciudad || "-"}</td>
                                <td>{a.estado || "-"}</td>
                                <td>{a.pais || "-"}</td>
                                <td>{a.codigoPostal || "-"}</td>
                                <td>
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => navigate(`/direcciones/edit/${a.id}`)}
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
                            <td colSpan="7" className="text-center text-muted">
                                No hay Direccion registrados.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DireccionList;
