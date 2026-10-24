import React, { createContext, useContext, useEffect, useState } from "react";

/**
 * ThemeContext — Control de tema global (claro / oscuro)
 * LogistiChain — detecta preferencia del sistema y permite alternar manualmente.
 */

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    // 🌙 Detectar preferencia del sistema
    useEffect(() => {
        const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
        setIsDarkMode(darkQuery.matches);

        const handleChange = (e) => setIsDarkMode(e.matches);
        darkQuery.addEventListener("change", handleChange);

        return () => darkQuery.removeEventListener("change", handleChange);
    }, []);

    // 🎨 Aplicar clase global al <body>
    useEffect(() => {
        document.body.className = isDarkMode
            ? "bg-dark text-light"
            : "bg-light text-dark";
    }, [isDarkMode]);

    // 🧭 Alternar manualmente
    const toggleTheme = () => setIsDarkMode((prev) => !prev);

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Hook personalizado para acceder al contexto fácilmente
export const useTheme = () => useContext(ThemeContext);
