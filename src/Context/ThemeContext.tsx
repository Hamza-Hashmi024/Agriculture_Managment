import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { applyTheme } from "@/hooks/useDynamicTheme";

export type ThemeType = {
  primary: string;
  background: string;
  foreground: string;
  mode: "light" | "dark";
};

type ThemeUpdate = ThemeType | ((prev: ThemeType) => ThemeType);

type ThemeContextType = {
  theme: ThemeType;
  setTheme: (value: ThemeUpdate) => void;
};

const STORAGE_KEY = "app-theme-v1";

const defaultTheme: ThemeType = {
  primary: "210 73% 42%",
  background: "210 20% 98%",
  foreground: "222 84% 4.9%",
  mode: "light",
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeState, setThemeState] = useState<ThemeType>(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ThemeType) : defaultTheme;
  });

  useEffect(() => {
    applyTheme(themeState);
  }, [themeState]); // ✅ ab har refresh pe bhi theme apply hoga

  const setTheme = (value: ThemeUpdate) => {
    setThemeState((prev) => {
      const next = typeof value === "function" ? value(prev) : value;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  return <ThemeContext.Provider value={{ theme: themeState, setTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
