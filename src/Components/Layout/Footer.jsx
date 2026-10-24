import React from "react";

/**
 * Footer — LogistiChain
 * Estilo azul/blanco con sombra, fijo al fondo de la página.
 * Inspirado en el diseño del profesor (Tito Zuñiga).
 */

const Footer = () => {
    return (
        <footer className="bg-primary text-white mt-auto py-3 shadow-sm">
            <div className="container text-center small">
        <span>
          © {new Date().getFullYear()} LogistiChain — Proyecto Programación Aplicada
        </span>
            </div>
        </footer>
    );
};

export default Footer;