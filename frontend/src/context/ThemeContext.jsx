import React, { createContext, useState, useContext, useEffect } from "react";

const ThemeContext = createContext();

export const ToggleThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check if the user's device prefers dark mode
    const prefersDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setDarkMode(prefersDarkMode);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => setDarkMode(e.matches);
    mediaQuery.addListener(handleChange);

    return () => mediaQuery.removeListener(handleChange);
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
