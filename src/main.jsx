import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// ✅ Bootstrap (CSS + JS Bundle)
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// ✅ Estilos globales
import "./App.css";
import "./index.css";

// ✅ Render principal
ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
