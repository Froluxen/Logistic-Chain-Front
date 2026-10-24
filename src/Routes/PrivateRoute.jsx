import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * PrivateRoute — Protege rutas internas del sistema LogistiChain.
 * Si el usuario no está autenticado, redirige automáticamente a /login.
 *
 * En el futuro (JWT real):
 * - Validará el token en localStorage o su expiración.
 * - Podrá verificar roles/permiso si el backend los envía.
 */

const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    // Verificar token temporal (mientras no haya JWT real)
    const token = localStorage.getItem("token");
    const isLoggedIn = isAuthenticated || !!token;

    // Si no hay sesión activa → redirigir al login
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    // Si hay sesión → renderizar el componente hijo
    return children;
};

export default PrivateRoute;