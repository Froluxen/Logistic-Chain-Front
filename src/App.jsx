// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./Routes/PrivateRoute";
import MainLayout from "./Layouts/MainLayout";
import ErrorBoundary from "./components/ErrorBoundary";

import LoginPage from "./components/Auth/LoginPage";
import Home from "./Pages/Home";

// Páginas de cada módulo
import EmpresaPage from "./Pages/Organizacion/EmpresaPage.jsx";
import SucursalPage from "./Pages/Organizacion/SucursalPage.jsx";
import AlmacenPage from "./Pages/Organizacion/AlmacenPage.jsx";
import UbicacionPage from "./Pages/Organizacion/UbicacionPage.jsx";
import ClientePage from "./Pages/Maestros/ClientePage.jsx";
import ProductoPage from "./Pages/Maestros/ProductoPage.jsx";
import LotePage from "./Pages/Maestros/LotePage.jsx";
import ProveedorPage from "./Pages/Maestros/ProveedorPage.jsx";
import OrdenCompraPage from "./Pages/Compras/OrdenCompraPage.jsx";
import DetalleOCPage from "./Pages/Compras/DetalleOCPage.jsx";
import RecepcionPage from "./Pages/Compras/RecepcionPage.jsx";
import PedidoVentaPage from "./Pages/Ventas/PedidoVentaPage.jsx";
import DetallePVPage from "./Pages/Ventas/DetallePVPage.jsx";
import PickingPage from "./Pages/Ventas/PickingPage.jsx";
import ItemPickingPage from "./Pages/Ventas/ItemPickingPage.jsx";
import KardexPage from "./Pages/InvSeg/KardexPage.jsx";
import UsuarioPage from "./Pages/InvSeg/UsuarioPage.jsx";
import RolPage from "./Pages/InvSeg/RolPage.jsx";
import DireccionPage from "./Pages/Maestros/DireccionPage.jsx";

/**
 * App.jsx — estructura tipo profe
 * - /login público
 * - Resto privado dentro de MainLayout + PrivateRoute
 * - ErrorBoundary para evitar pantallas blancas
 */
function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <ErrorBoundary>
                    <Router>
                        <Routes>
                            {/* 🔓 Ruta pública */}
                            <Route path="/login" element={<LoginPage />} />

                            {/* 🔐 Rutas privadas dentro del layout principal */}
                            <Route element={<MainLayout />}>
                                <Route path="/" element={<PrivateRoute><Home/></PrivateRoute>} />

                                {/* Empresas */}
                                <Route path="empresas/*" element={<PrivateRoute><EmpresaPage/></PrivateRoute>} />
                                <Route path="sucursales/*" element={<PrivateRoute><SucursalPage/></PrivateRoute>} />
                                <Route path="almacenes/*" element={<PrivateRoute><AlmacenPage/></PrivateRoute>} />
                                <Route path="ubicaciones/*" element={<PrivateRoute><UbicacionPage/></PrivateRoute>} />
                                {/* Maestros*/}
                                <Route path="clientes/*" element={<PrivateRoute><ClientePage/></PrivateRoute>} />
                                <Route path="productos/*" element={<PrivateRoute><ProductoPage/></PrivateRoute>} />
                                <Route path="lotes/*" element={<PrivateRoute><LotePage/></PrivateRoute>} />
                                <Route path="proveedores/*" element={<PrivateRoute><ProveedorPage/></PrivateRoute>} />
                                <Route path="direcciones/*" element={<PrivateRoute><DireccionPage/></PrivateRoute>} />
                                {/* Compra*/}
                                <Route path="ordenes-compra/*" element={<PrivateRoute><OrdenCompraPage/></PrivateRoute>} />
                                <Route path="detalles-oc/*" element={<PrivateRoute><DetalleOCPage/></PrivateRoute>} />
                                <Route path="recepciones/*" element={<PrivateRoute><RecepcionPage/></PrivateRoute>} />
                                {/* Venta */}
                                <Route path="pedidos-venta/*" element={<PrivateRoute><PedidoVentaPage/></PrivateRoute>} />
                                <Route path="detalles-pv/*" element={<PrivateRoute><DetallePVPage/></PrivateRoute>} />
                                <Route path="pickings/*" element={<PrivateRoute><PickingPage/></PrivateRoute>} />
                                <Route path="items-picking/*" element={<PrivateRoute><ItemPickingPage/></PrivateRoute>} />
                                {/*Inventario y Seguridad*/}
                                <Route path="kardex/*" element={<PrivateRoute><KardexPage/></PrivateRoute>} />
                                <Route path="usuarios/*" element={<PrivateRoute><UsuarioPage/></PrivateRoute>} />
                                <Route path="roles/*" element={<PrivateRoute><RolPage/></PrivateRoute>} />

                                {/* Redirección de rutas desconocidas */}
                                <Route path="*" element={<Navigate to="/" replace />} />
                            </Route>
                        </Routes>
                    </Router>
                </ErrorBoundary>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
