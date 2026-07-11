import { createContext, useState, useEffect } from "react";
import { lightTheme, darkTheme } from "../styles/theme";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved) {
      const val = JSON.parse(saved);
      setDarkMode(val);
      document.documentElement.setAttribute("data-theme", val ? "dark" : "light");
    }
  }, []);

  const toggleTheme = () => {
    const value = !darkMode;
    setDarkMode(value);
    localStorage.setItem("darkMode", JSON.stringify(value));
    document.documentElement.setAttribute("data-theme", value ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme, theme: darkMode ? darkTheme : lightTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
