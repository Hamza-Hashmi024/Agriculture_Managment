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
      setTheme(userTheme);
    } catch {
      // Agar theme nahi mili to default save karwao
      const defaultTheme = {
        primary: "210 73% 42%",
        background: "210 20% 98%",
        foreground: "222 84% 4.9%",
      };
      const saved = await SaveTheme(userId, defaultTheme);
      setTheme(saved);
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