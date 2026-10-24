import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * Header — LogistiChain
 * - Diseño azul/blanco minimalista
 * - Navegación principal del sistema logístico
 * - Incluye logout simulado (hasta que se integre JWT)
 */

const Header = () => {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm border-bottom">
            <div className="container-fluid px-4">
                {/* 🔹 Brand / Logo */}
                <Link to="/" className="navbar-brand fw-bold text-primary">
                    LogistiChain
                </Link>

                {/* 🔹 Toggle button (para móviles) */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* 🔹 Navigation Links */}
                <div className="collapse navbar-collapse" id="navbarNav">
                    {isAuthenticated && (
                        <ul className="navbar-nav ms-auto">

                            {/* Organización */}
                            <li className="nav-item dropdown">
                                <button className="nav-link dropdown-toggle btn btn-link" data-bs-toggle="dropdown">
                                    Organización
                                </button>
                                <ul className="dropdown-menu">
                                    <li><Link className="dropdown-item" to="/empresas">Empresas</Link></li>
                                    <li><Link className="dropdown-item" to="/sucursales">Sucursales</Link></li>
                                    <li><Link className="dropdown-item" to="/almacenes">Almacenes</Link></li>
                                    <li><Link className="dropdown-item" to="/ubicaciones">Ubicaciones</Link></li>
                                </ul>
                            </li>

                            {/* Maestros */}
                            <li className="nav-item dropdown">
                                <button className="nav-link dropdown-toggle btn btn-link" data-bs-toggle="dropdown">
                                    Maestros
                                </button>
                                <ul className="dropdown-menu">
                                    <li><Link className="dropdown-item" to="/productos">Productos</Link></li>
                                    <li><Link className="dropdown-item" to="/lotes">Lotes</Link></li>
                                    <li><Link className="dropdown-item" to="/proveedores">Proveedores</Link></li>
                                    <li><Link className="dropdown-item" to="/clientes">Clientes</Link></li>
                                    <li><Link className="dropdown-item" to="/direcciones">Direcciones</Link></li>
                                </ul>
                            </li>

                            {/* Compras */}
                            <li className="nav-item dropdown">
                                <button className="nav-link dropdown-toggle btn btn-link" data-bs-toggle="dropdown">
                                    Compras
                                </button>
                                <ul className="dropdown-menu">
                                    <li><Link className="dropdown-item" to="/ordenes-compra">Órdenes de compra</Link></li>
                                    <li><Link className="dropdown-item" to="/detalles-oc">Detalles OC</Link></li>
                                    <li><Link className="dropdown-item" to="/recepciones">Recepciones</Link></li>
                                </ul>
                            </li>

                            {/* Ventas & Picking */}
                            <li className="nav-item dropdown">
                                <button className="nav-link dropdown-toggle btn btn-link" data-bs-toggle="dropdown">
                                    Ventas & Picking
                                </button>
                                <ul className="dropdown-menu">
                                    <li><Link className="dropdown-item" to="/pedidos-venta">Pedidos de venta</Link></li>
                                    <li><Link className="dropdown-item" to="/detalles-pv">Detalles PV</Link></li>
                                    <li><Link className="dropdown-item" to="/pickings">Picking</Link></li>
                                    <li><Link className="dropdown-item" to="/items-picking">Items Picking</Link></li>
                                </ul>
                            </li>

                            {/* Seguridad & Inventario */}
                            <li className="nav-item dropdown">
                                <button className="nav-link dropdown-toggle btn btn-link" data-bs-toggle="dropdown">
                                    Seguridad & Inventario
                                </button>
                                <ul className="dropdown-menu">
                                    <li><Link className="dropdown-item" to="/usuarios">Usuarios</Link></li>
                                    <li><Link className="dropdown-item" to="/roles">Roles</Link></li>
                                    <li><Link className="dropdown-item" to="/kardex">Kardex</Link></li>
                                </ul>
                            </li>

                            {/* Logout */}
                            <li className="nav-item">
                                <button className="btn btn-outline-primary ms-3" onClick={handleLogout}>Logout</button>
                            </li>
                        </ul>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Header;
