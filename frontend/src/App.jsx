import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import JobsPage from './pages/JobsPage';
import JobDetailPage from './pages/JobDetailPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import EmployerDashboardPage from './pages/EmployerDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import CompaniesPage from './pages/CompaniesPage';
import CompanyDetailPage from './pages/CompanyDetailPage';
import PricingPage from './pages/PricingPage';
import PaymentResultPage from './pages/PaymentResultPage';
import Footer from './components/Footer';
import useAuthStore from './store/authStore';

function QueryInvalidator() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const qc = useQueryClient();
  useEffect(() => {
    // Đổi tài khoản → bỏ cache cũ, fetch lại profile/company ngay — hết avatar cũ
    qc.invalidateQueries({ queryKey: ['profile'] });
    qc.invalidateQueries({ queryKey: ['myCompany'] });
    qc.invalidateQueries({ queryKey: ['myPostings'] });
    qc.invalidateQueries({ queryKey: ['receivedApplications'] });
    if (!token) qc.clear();
  }, [user?.id, user?.email, token, qc]);
  return null;
}

function AppShell() {
  const { pathname } = useLocation();
  const hideFooter = pathname.startsWith('/auth');
  return (
    <div className="app-shell bg-[#f6fbf9] min-h-screen flex flex-col">
      <QueryInvalidator />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:slug" element={<JobDetailPage />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/companies/:slug" element={<CompanyDetailPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/candidate/profile" element={<ProtectedRoute allowedRoles={['candidate']}><ProfilePage /></ProtectedRoute>} />
          <Route path="/candidate/applications" element={<ProtectedRoute allowedRoles={['candidate']}><DashboardPage /></ProtectedRoute>} />
          <Route path="/employer/dashboard" element={<ProtectedRoute allowedRoles={['employer']}><EmployerDashboardPage /></ProtectedRoute>} />
          <Route path="/employer/payment-result" element={<ProtectedRoute allowedRoles={['employer']}><PaymentResultPage /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboardPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      {!hideFooter && <Footer />}
    </div>
  );
}

// Cache 5 phút — riêng profile/myCompany sẽ bị invalidate khi đổi user nên không dính cũ
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Route Protection Component
function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
