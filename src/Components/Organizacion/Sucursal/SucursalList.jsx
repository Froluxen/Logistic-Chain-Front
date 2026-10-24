import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
    getAllSucursales,
    deleteSucursal,
} from "../../../Services/Organizacion/SucursalService.js";

/**
 * SucursalList — Lista de sucursales
 * /sucursales, /sucursales/add, /sucursales/edit/:id
 * Estilo idéntico al ejemplo del profe (tabla + botones + Swal)
 */
const SucursalList = () => {
    const [sucursales, setSucursales] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadSucursales();
    }, []);

    const loadSucursales = async () => {
        try {
            setLoading(true);
            const res = await getAllSucursales();
            setSucursales(res.data);
        } catch (error) {
            console.error("Error loading sucursales:", error);
            Swal.fire("Error", "No se pudo cargar la lista de sucursales", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "¿Eliminar sucursal?",
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
                    await deleteSucursal(id);
                    Swal.fire("Eliminada", "La sucursal fue eliminada.", "success");
                    loadSucursales();
                } catch (error) {
                    console.error("Error deleting sucursal:", error);
                    const msg = error?.response?.data || "No se pudo eliminar la sucursal";
                    Swal.fire("Error", msg, "error");
                }
            }
        });
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Sucursales</h2>
                <button
                    className="btn btn-primary"
                    onClick={() => navigate("/sucursales/add")}
                >
                    Agregar Sucursal
                </button>
            </div>

            <div className="table-responsive">
                <table className="table table-striped align-middle">
                    <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Dirección</th>
                        <th>Teléfono</th>
                        <th>Empresa</th>
                        <th style={{ width: 160 }}>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="6" className="text-center">
                                Cargando...
                            </td>
                        </tr>
                    ) : sucursales && sucursales.length > 0 ? (
                        sucursales.map((s) => (
                            <tr key={s.id}>
                                <td>{s.id}</td>
                                <td>{s.nombre}</td>
                                <td>{s.direccion || "-"}</td>
                                <td>{s.telefono || "-"}</td>
                                <td>{s.empresaNombre || "-"}</td>
                                <td>
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => navigate(`/sucursales/edit/${s.id}`)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDelete(s.id)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center text-muted">
                                No hay sucursales registradas.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SucursalList;
