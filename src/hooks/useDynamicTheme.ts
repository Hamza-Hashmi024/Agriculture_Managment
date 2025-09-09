import { useEffect } from "react";
type Theme = Record<string, string> & {
  mode?: "light" | "dark";
};

/**
 * Apply theme colors and mode dynamically
 */
export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const body = document.body;

  // Apply all CSS variables except 'mode'
  Object.entries(theme).forEach(([key, value]) => {
    if (key === "mode") return;
    if (value) root.style.setProperty(`--${key}`, value);
  });

  // Apply background color directly to body
  if (theme.background) {
    body.style.backgroundColor = `hsl(${theme.background})`;
  }

  // Apply foreground color (for body text)
  if (theme.foreground) {
    body.style.color = `hsl(${theme.foreground})`;
  }

  // Apply dark/light mode class for Tailwind
  if (theme.mode === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}