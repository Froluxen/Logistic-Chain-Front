import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

/**
 * 🔐 LoginPage — Adaptado para LogistiChain
 * - Usa tu AuthContext actual (login simulado o JWT futuro)
 * - Mismo diseño y estructura que el del profe
 */

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // login(username, password) devuelve true/false (según AuthContext)
            const success = await login(username, password);

            if (success) {
                Swal.fire({
                    title: "¡Bienvenido!",
                    text: "Has iniciado sesión correctamente.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                });
                navigate("/");
            } else {
                Swal.fire({
                    title: "Acceso denegado",
                    text: "Credenciales inválidas, intenta nuevamente.",
                    icon: "error",
                });
            }
        } catch (error) {
            Swal.fire("Error", "Ocurrió un error inesperado.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card shadow-sm p-4" style={{ width: "380px" }}>
                <h3 className="text-center mb-3 text-primary fw-bold">
                    LogistiChain — Login
                </h3>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label fw-semibold">
                            Usuario
                        </label>
                        <input
                            type="text"
                            id="username"
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="Ingrese su usuario"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label fw-semibold">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Ingrese su contraseña"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={loading}
                    >
                        {loading ? "Iniciando sesión..." : "Entrar"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
