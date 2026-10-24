import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
    createEmpresa,
    updateEmpresa,
    getEmpresaById,
} from "../../../Services/Organizacion/EmpresaService.js";

/**
 * EmpresaForm — Crear/Editar Empresa
 * - Mismo patrón del profe (inputs controlados, Swal, navigate)
 * - Maneja fechaCreacion como datetime-local ↔ ISO (Instant en backend)
 */
const EmpresaForm = () => {
    const [empresa, setEmpresa] = useState({
        nombre: "",
        identificadorFiscal: "",
        direccionPrincipal: "",
        telefono: "",
        email: "",
        fechaCreacion: "", // input datetime-local
    });

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) loadEmpresa();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const loadEmpresa = async () => {
        try {
            const res = await getEmpresaById(id);
            const data = res.data;

            // Convertir ISO → datetime-local (YYYY-MM-DDTHH:mm)
            const toLocalDT = (iso) => {
                if (!iso) return "";
                const d = new Date(iso);
                const pad = (n) => String(n).padStart(2, "0");
                const yyyy = d.getFullYear();
                const mm = pad(d.getMonth() + 1);
                const dd = pad(d.getDate());
                const hh = pad(d.getHours());
                const mi = pad(d.getMinutes());
                return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
            };

            setEmpresa({
                nombre: data.nombre || "",
                identificadorFiscal: data.identificadorFiscal || "",
                direccionPrincipal: data.direccionPrincipal || "",
                telefono: data.telefono || "",
                email: data.email || "",
                fechaCreacion: toLocalDT(data.fechaCreacion),
            });
        } catch (error) {
            console.error("Error loading empresa:", error);
            Swal.fire("Error", "No se pudo cargar la empresa", "error");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmpresa({ ...empresa, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // datetime-local → ISO para Instant
        const toISO = (localDT) => {
            if (!localDT) return null;
            // localDT viene sin zona: asume hora local del navegador
            const iso = new Date(localDT).toISOString();
            return iso;
        };

        const payload = {
            nombre: empresa.nombre,
            identificadorFiscal: empresa.identificadorFiscal,
            direccionPrincipal: empresa.direccionPrincipal,
            telefono: empresa.telefono,
            email: empresa.email,
            fechaCreacion: empresa.fechaCreacion ? toISO(empresa.fechaCreacion) : null,
        };

        try {
            if (id) {
                await updateEmpresa(id, payload);
                Swal.fire("Actualizada", "Empresa actualizada correctamente", "success");
            } else {
                await createEmpresa(payload);
                Swal.fire("Creada", "Empresa creada correctamente", "success");
            }
            navigate("/empresas");
        } catch (error) {
            console.error("Error saving empresa:", error);
            const msg = error?.response?.data || "No se pudo guardar la empresa";
            Swal.fire("Error", msg, "error");
        }
    };

    return (
        <div className="container mt-4">
            <h2>{id ? "Editar Empresa" : "Agregar Empresa"}</h2>
            <form onSubmit={handleSubmit}>
                {/* Nombre */}
                <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input
                        type="text"
                        className="form-control"
                        name="nombre"
                        value={empresa.nombre}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Identificador Fiscal */}
                <div className="mb-3">
                    <label className="form-label">Identificador Fiscal</label>
                    <input
                        type="text"
                        className="form-control"
                        name="identificadorFiscal"
                        value={empresa.identificadorFiscal}
                        onChange={handleChange}
                        required
                        placeholder="NIT/CUIT etc."
                    />
                </div>

                {/* Dirección Principal */}
                <div className="mb-3">
                    <label className="form-label">Dirección Principal</label>
                    <input
                        type="text"
                        className="form-control"
                        name="direccionPrincipal"
                        value={empresa.direccionPrincipal}
                        onChange={handleChange}
                    />
                </div>

                {/* Teléfono */}
                <div className="mb-3">
                    <label className="form-label">Teléfono</label>
                    <input
                        type="text"
                        className="form-control"
                        name="telefono"
                        value={empresa.telefono}
                        onChange={handleChange}
                    />
                </div>

                {/* Email */}
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={empresa.email}
                        onChange={handleChange}
                    />
                </div>

                {/* Fecha de Creación */}
                <div className="mb-3">
                    <label className="form-label">Fecha de Creación</label>
                    <input
                        type="datetime-local"
                        className="form-control"
                        name="fechaCreacion"
                        value={empresa.fechaCreacion}
                        onChange={handleChange}
                    />
                    <small className="text-muted">
                        Si lo dejas vacío, se enviará <i>null</i>.
                    </small>
                </div>

                {/* Botones */}
                <button type="submit" className="btn btn-success me-2">
                    Guardar
                </button>
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/empresas")}
                >
                    Cancelar
                </button>
            </form>
        </div>
    );
};

export default EmpresaForm;
