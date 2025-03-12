
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import { useAuthStore } from "./stores/authStore";
import PageLoader from "./components/common/PageLoader";

// Lazy-loaded pages for better performance
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const DashboardPage = lazy(() => import("./pages/dashboard/DashboardPage"));
const CustomersPage = lazy(() => import("./pages/customers/CustomersPage"));
const CustomerDetailsPage = lazy(() => import("./pages/customers/CustomerDetailsPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Auth routes */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={
                  !isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" replace />
                } />
              </Route>
              
              {/* App routes - protected */}
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={
                  isAuthenticated ? <DashboardPage /> : <Navigate to="/login" replace />
                } />
                <Route path="/customers" element={
                  isAuthenticated ? <CustomersPage /> : <Navigate to="/login" replace />
                } />
                <Route path="/customers/:id" element={
                  isAuthenticated ? <CustomerDetailsPage /> : <Navigate to="/login" replace />
                } />
              </Route>
              
              {/* Redirect root to dashboard or login */}
              <Route path="/" element={
                isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
              } />
              
              {/* 404 Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
