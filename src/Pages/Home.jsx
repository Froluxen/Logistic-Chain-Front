import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import logo from "../assets/react.svg";
import { Building2, Building, Boxes, MapPin } from "lucide-react";
import "./Home.css";

const Home = () => {
    const { isDarkMode } = useTheme();
    const navigate = useNavigate();

    const modules = [
        {
            title: "Companies",
            description: "Manage companies and corporate master data.",
            icon: <Building2 size={32} />,
            path: "/empresas",
            color: "primary",
        },
        {
            title: "Branches",
            description: "Define company branches and contact details.",
            icon: <Building size={32} />,
            path: "/sucursales",
            color: "success",
        },
        {
            title: "Warehouses",
            description: "Configure warehouses and their types.",
            icon: <Boxes size={32} />,
            path: "/almacenes",
            color: "info",
        },
        {
            title: "Locations",
            description: "Organize storage locations inside a warehouse.",
            icon: <MapPin size={32} />,
            path: "/ubicaciones",
            color: "warning",
        },

    ];

    return (
        <div
            className={`container text-center py-5 theme-transition ${
                isDarkMode ? "text-light" : "text-dark"
            }`}
        >
            {/* Logo animado */}
            <div className="logo-container">
                <div className="logo-bg">
                    <img
                        src={logo}
                        alt="LogistiChain Logo"
                        className="logo-animated"
                        style={{ maxWidth: 180 }}
                    />
                </div>
            </div>

            {/* Título */}
            <h1 className="fw-bold mb-3 mt-4">Welcome to LogistiChain</h1>
            <p className="lead mb-5">
                Streamline organizational structure: companies, branches, warehouses and locations.
            </p>

            {/* Tarjetas de módulos */}
            <div className="row g-4 justify-content-center">
                {modules.map((mod, i) => (
                    <div key={i} className="col-12 col-sm-6 col-md-4 col-lg-3">
                        <div
                            className={`card border-${mod.color} shadow-sm h-100`}
                            style={{
                                cursor: "pointer",
                                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                            }}
                            onClick={() => navigate(mod.path)}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                        >
                            <div className={`card-body text-${mod.color}`}>
                                <div className="mb-3">{mod.icon}</div>
                                <h5 className="card-title fw-semibold">{mod.title}</h5>
                                <p className="card-text text-secondary">{mod.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pie inferior */}
            <div className="mt-5">
                <p className="text-muted small">
                    Built for Programación Aplicada — Estructura Organizacional.
                </p>
            </div>
        </div>
    );
};

export default Home;
