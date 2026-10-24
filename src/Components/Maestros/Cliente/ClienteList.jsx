import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { deleteCliente, getAllClientes } from "../../../Services/Maestros/ClienteService.js";

// helper para mostrar la dirección como texto
const fmtDireccion = (d) => {
    if (!d) return "-";
    const partes = [d.calle, d.ciudad, d.estado, d.pais].filter(Boolean);
    return partes.length ? partes.join(", ") : "-";
};

const ClienteList = () => {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadClientes();
    }, []);

    const loadClientes = async () => {
        try {
            setLoading(true);
            const res = await getAllClientes();
            setClientes(res.data);
        } catch (error) {
            console.error("Error loading clientes:", error);
            Swal.fire("Error", "No se pudo cargar la lista de clientes", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "¿Eliminar Cliente?",
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
                    await deleteCliente(id);
                    Swal.fire("Eliminado", "El Cliente fue eliminado.", "success");
                    loadClientes();
                } catch (error) {
                    console.error("Error deleting cliente:", error);
                    const raw = error?.response?.data || "No se pudo eliminar el Cliente";
                    const msg = typeof raw === "string" ? raw : JSON.stringify(raw);
                    Swal.fire("Error", msg, "error");
                }
            }
        });
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Clientes</h2>
                <button
                    className="btn btn-primary"
                    onClick={() => navigate("/clientes/add")}
                >
                    Agregar Cliente
                </button>
            </div>

            <div className="table-responsive">
                <table className="table table-striped align-middle">
                    <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>IdentificadorFiscal</th>
                        <th>Direccion</th>
                        <th>Telefono</th>
                        <th>Email</th>
                        <th style={{ width: 160 }}>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="7" className="text-center">Cargando...</td>
                        </tr>
                    ) : clientes && clientes.length > 0 ? (
                        clientes.map((a) => (
                            <tr key={a.id}>
                                <td>{a.id}</td>
                                <td>{a.nombre}</td>
                                <td>{a.identificadorFiscal || "-"}</td>
                                <td>{fmtDireccion(a.direccion)}</td>
                                <td>{a.telefono || "-"}</td>
                                <td>{a.email || "-"}</td>
                                <td>
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => navigate(`/clientes/edit/${a.id}`)}
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
                                No hay Clientes registrados.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ClienteList;
