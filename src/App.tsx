import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import Index from "./pages/Index";
import { useDynamicTheme } from "./hooks/useDynamicTheme";
import { useEffect, useState } from "react";
import { FetchTheme } from "@/Api/Api"; 
import { SaveTheme } from "@/Api/Api";

const queryClient = new QueryClient();

const App = () => {
const [theme, setTheme] = useState<any>(null);
const userId = 1;

useEffect(() => {
  async function loadTheme() {
    try {
      const userTheme = await FetchTheme(userId);

      // ✅ Backend keys ko frontend keys me map karo
      setTheme({
        primary: userTheme.primary || userTheme.primaryColor || "210 73% 42%",
        background: userTheme.background || userTheme.backgroundColor || "210 20% 98%",
        foreground: userTheme.foreground || userTheme.foregroundColor || "222 84% 4.9%",
      });
    } catch {
      // Agar theme nahi mili to default save karwao
      const defaultTheme = {
        primary: "210 73% 42%",
        background: "210 20% 98%",
        foreground: "222 84% 4.9%",
      };
      const saved = await SaveTheme(userId, defaultTheme);

      setTheme({
        primary: saved.primary || saved.primaryColor || defaultTheme.primary,
        background: saved.background || saved.backgroundColor || defaultTheme.background,
        foreground: saved.foreground || saved.foregroundColor || defaultTheme.foreground,
      });
    }
  }
  loadTheme();
}, [userId]);
// Ye hook laga do
useDynamicTheme(theme || {});
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Index />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;