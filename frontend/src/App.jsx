import { useEffect, useState } from 'react';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';

export default function App() {
  const [view, setView] = useState(() => (window.location.hash === '#auth' ? 'auth' : 'home'));

  useEffect(() => {
    const handleHashChange = () => {
      setView(window.location.hash === '#auth' ? 'auth' : 'home');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (nextView) => {
    window.location.hash = nextView === 'auth' ? '#auth' : '';
  };

  return (
    <div className="app-shell">
      {view === 'auth' ? (
        <AuthPage onNavigateHome={() => navigateTo('home')} />
      ) : (
        <HomePage onNavigateAuth={() => navigateTo('auth')} />
      )}
    </div>
  );
}
