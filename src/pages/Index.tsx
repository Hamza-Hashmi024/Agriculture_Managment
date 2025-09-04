import { useContext } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MainContent } from "@/components/MainContent";
import { AuthContext } from "@/Context/AuthContext";
import LoginForm from "@/components/Auth/LoginForm";

const Index = () => {
  const { user } = useContext(AuthContext);

  // Agar login nahi hai → sirf LoginForm
  if (!user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        <LoginForm />
      </div>
    );
  }

  // Agar login hai → Sidebar + MainContent
  return (
  
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <AppSidebar />
          <MainContent />
        </div>
      </SidebarProvider>
    
  );
};

export default Index;