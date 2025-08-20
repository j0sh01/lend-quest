import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Applications from "./pages/Applications";
import Loans from "./pages/Loans";
import Borrowers from "./pages/Borrowers";
import Disbursements from "./pages/Disbursements";
import Repayments from "./pages/Repayments";
import Securities from "./pages/Securities";
import Reports from "./pages/Reports";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/applications" element={
              <ProtectedRoute>
                <Applications />
              </ProtectedRoute>
            } />
            <Route path="/loans" element={
              <ProtectedRoute>
                <Loans />
              </ProtectedRoute>
            } />
            <Route path="/loans/:id" element={
              <ProtectedRoute>
                <Loans />
              </ProtectedRoute>
            } />
            <Route path="/loans/:id/edit" element={
              <ProtectedRoute>
                <Loans />
              </ProtectedRoute>
            } />
            <Route path="/borrowers" element={
              <ProtectedRoute>
                <Borrowers />
              </ProtectedRoute>
            } />
            <Route path="/borrowers/:id" element={
              <ProtectedRoute>
                <Borrowers />
              </ProtectedRoute>
            } />
            <Route path="/borrowers/:id/edit" element={
              <ProtectedRoute>
                <Borrowers />
              </ProtectedRoute>
            } />
            <Route path="/borrowers/new" element={
              <ProtectedRoute>
                <Borrowers />
              </ProtectedRoute>
            } />
            <Route path="/disbursements" element={
              <ProtectedRoute>
                <Disbursements />
              </ProtectedRoute>
            } />
            <Route path="/disbursements/:id" element={
              <ProtectedRoute>
                <Disbursements />
              </ProtectedRoute>
            } />
            <Route path="/disbursements/:id/edit" element={
              <ProtectedRoute>
                <Disbursements />
              </ProtectedRoute>
            } />
            <Route path="/disbursements/new" element={
              <ProtectedRoute>
                <Disbursements />
              </ProtectedRoute>
            } />
            <Route path="/repayments" element={
              <ProtectedRoute>
                <Repayments />
              </ProtectedRoute>
            } />
            <Route path="/repayments/:id" element={
              <ProtectedRoute>
                <Repayments />
              </ProtectedRoute>
            } />
            <Route path="/repayments/:id/edit" element={
              <ProtectedRoute>
                <Repayments />
              </ProtectedRoute>
            } />
            <Route path="/repayments/new" element={
              <ProtectedRoute>
                <Repayments />
              </ProtectedRoute>
            } />
            <Route path="/securities" element={
              <ProtectedRoute>
                <Securities />
              </ProtectedRoute>
            } />
            <Route path="/securities/:id" element={
              <ProtectedRoute>
                <Securities />
              </ProtectedRoute>
            } />
            <Route path="/securities/new" element={
              <ProtectedRoute>
                <Securities />
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute requiredRoles={['Administrator', 'System Manager']}>
                <Dashboard />
              </ProtectedRoute>
            } />

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
