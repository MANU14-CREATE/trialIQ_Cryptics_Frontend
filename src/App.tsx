import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Organizations from "./pages/Organizations";
import OrganizationDashboard from "./pages/OrganizationDashboard";
import Sponsors from "./pages/Sponsors";
import Sites from "./pages/Sites";
import Trials from "./pages/Trials";
import Patients from "./pages/Patients";
import Providers from "./pages/Providers";
import NotFound from "./pages/NotFound";
import ResetPassword from "./pages/ResetPassword";
import UserManagement from "./pages/UserManagement";
import Trials1 from "./pages/trials1";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
          <Route path="/organizations" element={<ProtectedRoute><Organizations /></ProtectedRoute>} />
          <Route path="/organizations/dashboard" element={<ProtectedRoute><OrganizationDashboard /></ProtectedRoute>} />
          <Route path="/sponsors" element={<ProtectedRoute><Sponsors /></ProtectedRoute>} />
          <Route path="/sites" element={<ProtectedRoute><Sites /></ProtectedRoute>} />
          <Route path="/trials" element={<ProtectedRoute><Trials /></ProtectedRoute>} />
          <Route path="/patients" element={<ProtectedRoute><Patients /></ProtectedRoute>} />
          <Route path="/providers" element={<ProtectedRoute><Providers /></ProtectedRoute>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
