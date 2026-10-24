import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
    getAllEmpresas,
    deleteEmpresa,
} from "../../../Services/Organizacion/EmpresaService.js";

/**
 * EmpresaList — Lista de empresas
 * - Estilo igual al ejemplo del profe (tabla + botones + Swal)
 * - Rutas esperadas: /empresas, /empresas/add, /empresas/edit/:id
 */
const EmpresaList = () => {
    const [empresas, setEmpresas] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadEmpresas();
    }, []);

    const loadEmpresas = async () => {
        try {
            setLoading(true);
            const res = await getAllEmpresas();
            setEmpresas(res.data);
        } catch (error) {
            console.error("Error loading empresas:", error);
            Swal.fire("Error", "No se pudo cargar la lista de empresas", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "¿Eliminar empresa?",
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
                    await deleteEmpresa(id);
                    Swal.fire("Eliminada", "La empresa fue eliminada.", "success");
                    loadEmpresas();
                } catch (error) {
                    console.error("Error deleting empresa:", error);
                    const msg = error?.response?.data || "No se pudo eliminar la empresa";
                    Swal.fire("Error", msg, "error");
                }
            }
        });
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Empresas</h2>
                <button
                    className="btn btn-primary"
                    onClick={() => navigate("/empresas/add")}
                >
                    Agregar Empresa
                </button>
            </div>

            <div className="table-responsive">
                <table className="table table-striped align-middle">
                    <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Identificador Fiscal</th>
                        <th>Teléfono</th>
                        <th>Email</th>
                        <th>Fecha Creación</th>
                        <th style={{ width: 160 }}>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="7" className="text-center">
                                Cargando...
                            </td>
                        </tr>
                    ) : empresas && empresas.length > 0 ? (
                        empresas.map((e) => (
                            <tr key={e.id}>
                                <td>{e.id}</td>
                                <td>{e.nombre}</td>
                                <td>{e.identificadorFiscal || "-"}</td>
                                <td>{e.telefono || "-"}</td>
                                <td>{e.email || "-"}</td>
                                <td>
                                    {e.fechaCreacion
                                        ? new Date(e.fechaCreacion).toLocaleString()
                                        : "-"}
                                </td>
                                <td>
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => navigate(`/empresas/edit/${e.id}`)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDelete(e.id)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center text-muted">
                                No hay empresas registradas.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EmpresaList;
