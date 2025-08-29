import { useEffect } from "react";

type Theme = Record<string, string>; // Flexible: koi bhi key-value string

export function applyTheme(theme: Theme) {
  const root = document.documentElement;

  // Loop through all keys in theme
  Object.entries(theme).forEach(([key, value]) => {
    if (value) root.style.setProperty(`--${key}`, value);
  });
}

export function useDynamicTheme(theme: Theme) {
  useEffect(() => {
    if (theme && Object.keys(theme).length > 0) {
      applyTheme(theme);
    }
  }, [theme]);
}