import { useEffect, useState } from "react";
import { SaveTheme, FetchTheme } from "@/Api/Api"; // tumhare API functions
import { useDynamicTheme } from "@/hooks/useDynamicTheme";

const ThemeSettings = () => {
  const userId = 1; // simulate logged-in user

  const [theme, setTheme] = useState<any>({
    primary: "210 73% 42%",
    background: "210 20% 98%",
    foreground: "222 84% 4.9%",
  });

  // hook to apply theme instantly
  useDynamicTheme(theme);

  

  function hslToHex(hsl: string): string {
  const [h, s, l] = hsl.split(" ").map((v, i) => (i === 0 ? parseFloat(v) : parseFloat(v) / 100));
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// Convert HEX (#1666b0) → HSL ("210 73% 42%")
function hexToHsl(hex: string): string {
  hex = hex.replace(/^#/, "");
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}
  
  // Load theme from backend on mount
  useEffect(() => {
    async function loadTheme() {
      try {
        const data = await FetchTheme(userId);
        setTheme(data);
      } catch (err) {
        console.log("No theme found, using default");
      }
    }
    loadTheme();
  }, [userId]);

  // Handle color change
  const handleChange = (key: string, value: string) => {
    setTheme((prev: any) => ({ ...prev, [key]: value }));
  };

  // Save to DB
  const handleSave = async () => {
    try {
      const saved = await SaveTheme(userId, theme);
      setTheme(saved);
      alert("Theme saved successfully ✅");
    } catch (err) {
      console.error(err);
      alert("Error saving theme ❌");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-card rounded-2xl shadow-md space-y-6">
      <h2 className="text-2xl font-semibold">Theme Settings</h2>

      <div className="space-y-4">
        {/* Primary Color */}
        <div>
          <label className="block text-sm font-medium mb-1">Primary</label>
          <input
            type="color"
            value={hslToHex(theme.primary)}
            onChange={(e) => handleChange("primary", hexToHsl(e.target.value))}
            className="w-16 h-10 rounded cursor-pointer border"
          />
        </div>

        {/* Background Color */}
        <div>
          <label className="block text-sm font-medium mb-1">Background</label>
          <input
            type="color"
            value={hslToHex(theme.background)}
            onChange={(e) => handleChange("background", hexToHsl(e.target.value))}
            className="w-16 h-10 rounded cursor-pointer border"
          />
        </div>

        {/* Foreground Color */}
        <div>
          <label className="block text-sm font-medium mb-1">Foreground</label>
          <input
            type="color"
            value={hslToHex(theme.foreground)}
            onChange={(e) => handleChange("foreground", hexToHsl(e.target.value))}
            className="w-16 h-10 rounded cursor-pointer border"
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg shadow hover:bg-primary/80"
      >
        Save Theme
      </button>
    </div>
  );
};

export default ThemeSettings;