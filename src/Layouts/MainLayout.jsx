import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Components/Layout/Header";
import Footer from "../Components/Layout/Footer";
import { useTheme } from "../context/ThemeContext";

/**
 * MainLayout — Estructura principal del sistema LogistiChain
 * Contiene:
 * - Header (barra de navegación)
 * - Contenido dinámico (<Outlet />)
 * - Footer fijo al final
 * Integra ThemeContext para modo claro/oscuro.
 */

const MainLayout = () => {
    const { isDarkMode } = useTheme();

    return (
        <div
            className={`d-flex flex-column min-vh-100 ${
                isDarkMode ? "bg-dark text-light" : "bg-light text-dark"
            }`}
        >
            {/* 🔹 Header global */}
            <Header />

            {/* 🔹 Contenido dinámico */}
            <main className="flex-fill container py-4">
                <Outlet />
            </main>

            {/* 🔹 Footer global */}
            <Footer />
        </div>
    );
};

export default MainLayout;