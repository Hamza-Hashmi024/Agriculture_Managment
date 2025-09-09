import { useEffect } from "react";
import { SaveTheme } from "@/Api/Api";
import { applyTheme } from "@/hooks/useDynamicTheme";
import { useTheme } from "@/Context/ThemeContext";
import { Palette, Droplet, Type, Save, RotateCcw, Sun, Moon } from "lucide-react";

const ThemeSettings = () => {
  const userId = 1;

  const defaultTheme = {
    primary: "210 73% 42%",
    background: "210 20% 98%",
    foreground: "222 84% 4.9%",
    mode: "light" as "light" | "dark",
  };

  const { theme, setTheme } = useTheme();

  // Apply theme globally whenever it changes
  useEffect(() => {
    applyTheme(theme || defaultTheme);
  }, [theme]);

  // HSL → HEX
  const hslToHex = (hsl?: string): string => {
    if (!hsl) return "#000000";
    const [h, s, l] = hsl
      .split(" ")
      .map((v, i) => (i === 0 ? parseFloat(v) : parseFloat(v) / 100));
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  // HEX → HSL
  const hexToHsl = (hex: string): string => {
    hex = hex.replace(/^#/, "");
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h = 0,
      s = 0,
      l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h *= 60;
    }
    return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };

  // Mode toggle
  const handleModeToggle = (value: "light" | "dark") => {
    setTheme((prev) => ({
      ...prev,
      mode: value,
      background: value === "dark" ? "222 84% 4.9%" : "210 20% 98%",
      foreground: value === "dark" ? "210 20% 98%" : "222 84% 4.9%",
    }));
    console.log("Mode switched to:", value);
  };

  // Change handler for pickers
  const handleChange = (key: string, value: string) => {
    setTheme((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Save to API
  const handleSave = async () => {
    try {
      if (!theme) return;
      const saved = await SaveTheme(userId, theme);
      setTheme({
        primary: saved.primary || theme.primary,
        background: saved.background || theme.background,
        foreground: saved.foreground || theme.foreground,
        mode: saved.mode || theme.mode,
      });
      alert("Theme saved successfully ✅");
    } catch {
      alert("Error saving theme ❌");
    }
  };

  // Reset to default
  const handleReset = async () => {
    const confirmReset = window.confirm(
      "⚠️ Are you sure you want to reset theme to default?"
    );
    if (!confirmReset) return;
    try {
      setTheme(defaultTheme);
      await SaveTheme(userId, defaultTheme);
      alert("Theme reset to default ✅");
    } catch {
      alert("Error resetting theme ❌");
    }
  };

  if (!theme) return <div className="text-center p-6">Loading theme...</div>;

  return (
    <div className="p-8 bg-white dark:bg-neutral-900 shadow-md rounded-2xl border border-gray-200 dark:border-neutral-800 space-y-8 h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 border-b pb-4">
        <Palette className="w-6 h-6 text-indigo-500" />
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Theme Settings
        </h2>
      </div>

      {/* Explanation */}
      <div className="p-4 bg-gray-50 dark:bg-neutral-800 rounded-xl text-sm leading-relaxed text-gray-600 dark:text-gray-300">
        <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">
          💡 How it works:
        </p>
        <ul className="grid sm:grid-cols-3 gap-2">
          <li>
            <span className="font-semibold">Primary:</span> Buttons, links &
            highlights.
          </li>
          <li>
            <span className="font-semibold">Background:</span> Main app
            background.
          </li>
          <li>
            <span className="font-semibold">Foreground:</span> Text & icons
            color.
          </li>
          <li>
            <span className="font-semibold">Mode:</span> Light or Dark theme
            toggle.
          </li>
        </ul>
      </div>

      {/* Pickers + Mode */}
      <div className="grid sm:grid-cols-4 gap-6">
        {/* Primary */}
        <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 dark:bg-neutral-800 rounded-xl">
          <Droplet className="w-5 h-5 text-indigo-500" />
          <label className="text-sm font-medium">Primary</label>
          <input
            type="color"
            value={hslToHex(theme.primary)}
            onChange={(e) => handleChange("primary", hexToHsl(e.target.value))}
            className="w-14 h-14 rounded-full border cursor-pointer shadow-inner"
          />
        </div>

        {/* Background */}
        <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 dark:bg-neutral-800 rounded-xl">
          <Droplet className="w-5 h-5 text-green-500" />
          <label className="text-sm font-medium">Background</label>
          <input
            type="color"
            value={hslToHex(theme.background)}
            onChange={(e) =>
              handleChange("background", hexToHsl(e.target.value))
            }
            className="w-14 h-14 rounded-full border cursor-pointer shadow-inner"
          />
        </div>

        {/* Foreground */}
        <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 dark:bg-neutral-800 rounded-xl">
          <Type className="w-5 h-5 text-gray-600 dark:text-gray-200" />
          <label className="text-sm font-medium">Foreground</label>
          <input
            type="color"
            value={hslToHex(theme.foreground)}
            onChange={(e) =>
              handleChange("foreground", hexToHsl(e.target.value))
            }
            className="w-14 h-14 rounded-full border cursor-pointer shadow-inner"
          />
        </div>

        {/* Mode Toggle */}
        <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 dark:bg-neutral-800 rounded-xl">
          <label className="text-sm font-medium">Mode</label>
          <button
            onClick={() =>
              handleModeToggle(theme.mode === "dark" ? "light" : "dark")
            }
            className="px-4 py-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-neutral-700 flex items-center gap-2"
          >
            {theme.mode === "dark" ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
            {theme.mode === "dark" ? "Dark" : "Light"}
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          <Save className="w-4 h-4" /> Save Theme
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-5 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
        >
          <RotateCcw className="w-4 h-4" /> Reset Default
        </button>
      </div>
    </div>
  );
};

export default ThemeSettings;
