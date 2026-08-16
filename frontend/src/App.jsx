import AdminDashboardPage from './pages/AdminDashboardPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import EmployerDashboardPage from './pages/EmployerDashboardPage';
import JobsPage from './pages/JobsPage';

export default function App() {
  return (
    <>
      <AuthPage />
      <JobsPage />
      <DashboardPage />
      <EmployerDashboardPage />
      <AdminDashboardPage />
    </>
  );
}
