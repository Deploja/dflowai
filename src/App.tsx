
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/AuthProvider";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Organisation from "./pages/Organisation";
import Consultants from "./pages/Consultants";
import CandidatesList from "./pages/CandidatesList";
import Matches from "./pages/Matches";
import Messages from "./pages/Messages";
import Projects from "./pages/Projects";
import JobSearch from "./pages/JobSearch";
import Revenue from "./pages/Revenue";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import CVEmployees from "./pages/CVEmployees";
import CVCandidates from "./pages/CVCandidates";
import CVSubConsultants from "./pages/CVSubConsultants";
import NotFound from "./pages/NotFound";

// Create QueryClient outside of component to prevent recreation on re-renders
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="dflow-ui-theme">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/organisation" element={<Organisation />} />
                <Route path="/consultants" element={<Consultants />} />
                <Route path="/candidates-list" element={<CandidatesList />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/:consultantId" element={<Profile />} />
                <Route path="/matches" element={<Matches />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/job-search" element={<JobSearch />} />
                <Route path="/revenue" element={<Revenue />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/cv/employees" element={<CVEmployees />} />
                <Route path="/cv/candidates" element={<CVCandidates />} />
                <Route path="/cv/sub-consultants" element={<CVSubConsultants />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
