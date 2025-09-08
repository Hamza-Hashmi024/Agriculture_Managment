import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import Index from "./pages/Index";
import { useDynamicTheme } from "./hooks/useDynamicTheme";
import { useEffect, useState } from "react";
import { FetchTheme, SaveTheme } from "@/Api/Api";
import { AuthProvider } from "./Context/AuthContext";


const queryClient = new QueryClient();

const App = () => {
  const [theme, setTheme] = useState<{ primary: string; background: string; foreground: string } | null>(null);
  const userId = 1; // TODO: later replace with user.id from AuthContext

  useEffect(() => {
    async function loadTheme() {
      try {
        const userTheme = await FetchTheme(userId);

        setTheme({
          primary: userTheme.primary || userTheme.primaryColor || "210 73% 42%",
          background: userTheme.background || userTheme.backgroundColor || "210 20% 98%",
          foreground: userTheme.foreground || userTheme.foregroundColor || "222 84% 4.9%",
        });
      } catch {
        // Default theme save
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

  // Apply dynamic theme
  useDynamicTheme(
    theme || { primary: "210 73% 42%", background: "210 20% 98%", foreground: "222 84% 4.9%" }
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <Index />
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;