import { useEffect } from "react";

type Theme = Record<string, string>; 

export function applyTheme(theme: Theme) {
  const root = document.documentElement;

  Object.entries(theme).forEach(([key, value]) => {
    if (value) root.style.setProperty(`--${key}`, value);
  });
}

export function useDynamicTheme(theme?: Theme | null) {
  useEffect(() => {
    if (theme && Object.keys(theme).length > 0) {
      applyTheme(theme);
    }
  }, [theme]);
}