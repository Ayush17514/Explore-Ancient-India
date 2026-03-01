import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import KnowledgePage from "./pages/KnowledgePage";
import ManuscriptPage from "./pages/ManuscriptPage";
import ArchitecturePage from "./pages/ArchitecturePage";
import ResearchPage from "./pages/ResearchPage";
import ContributePage from "./pages/ContributePage";
import AboutPage from "./pages/AboutPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/knowledge" element={<KnowledgePage />} />
          <Route path="/manuscripts" element={<ManuscriptPage />} />
          <Route path="/architecture" element={<ArchitecturePage />} />
          <Route path="/research" element={<ResearchPage />} />
          <Route path="/contribute" element={<ContributePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
