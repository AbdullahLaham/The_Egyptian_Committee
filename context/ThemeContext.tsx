import React, { createContext, useContext } from "react";
import { useColorScheme } from "nativewind";

interface ThemeContextType {
  colorScheme: "light" | "dark";
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  colorScheme: "dark",
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { colorScheme, setColorScheme } = useColorScheme();

  const toggleTheme = () => {
    const nextTheme = colorScheme === "dark" ? "light" : "dark";
    setColorScheme(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ colorScheme: colorScheme || "dark", toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);