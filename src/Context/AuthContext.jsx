import React, {createContext, useContext, useState, useEffect, useMemo,} from "react";

/**
 * AuthContext — Controla la autenticación global del sistema LogistiChain.
 * - Compatible con Vite + React
 * - Simula login con credenciales fijas
 * - Listo para migrar a JWT (API real)
 */

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    // 🔹 Verificar token en localStorage al iniciar la app
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsAuthenticated(true);
            setUser({ username: "demoUser" }); // placeholder temporal
        }
    }, []);

    // 🔐 Simulación de login (reemplazar con llamada a backend cuando haya JWT)
    const login = async (username, password) => {
        if (username === "admin" && password === "admin") {
            const fakeToken = "demo-token-logistichain";
            localStorage.setItem("token", fakeToken);
            setIsAuthenticated(true);
            setUser({ username });
            return true;
        }
        return false;
    };

    // 🚪 Cerrar sesión
    const logout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setUser(null);
    };

    // 🧠 useMemo evita recrear funciones en cada render
    const value = useMemo(
        () => ({ isAuthenticated, user, login, logout }),
        [isAuthenticated, user]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
