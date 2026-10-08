import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import FeedPage from './pages/FeedPage';
import ProfilePage from './pages/ProfilePage';
import CommunitiesPage from './pages/CommunitiesPage';
import MessagesPage from './pages/MessagesPage';
import NotificationsPage from './pages/NotificationsPage';
import EventsPage from './pages/EventsPage';
import PrayerPage from './pages/PrayerPage';
import ParishesPage from './pages/ParishesPage';
import SearchPage from './pages/SearchPage';
import SettingsPage from './pages/SettingsPage';
import { isSupabaseConfigured } from './lib/supabase';

function AppContent() {
  const { isAuthenticated, currentPage } = useApp();

  // Verificar se o Supabase está configurado
  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen bg-ivory-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-warm-100 p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-navy-600 to-navy-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-serif font-bold text-navy-900 mb-2">Configuração Necessária</h1>
            <p className="text-warm-600 mb-6">
              A Communio precisa ser configurada para funcionar.
            </p>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-left">
              <p className="text-sm text-red-800 font-semibold mb-2">Variáveis de ambiente não configuradas:</p>
              <ul className="text-xs text-red-700 space-y-1">
                <li>• VITE_SUPABASE_URL</li>
                <li>• VITE_SUPABASE_ANON_KEY</li>
              </ul>
              <p className="text-xs text-red-700 mt-3">
                Configure estas variáveis na plataforma de deploy (Vercel) e faça um novo deploy.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'feed': return <FeedPage />;
      case 'profile': return <ProfilePage />;
      case 'communities': return <CommunitiesPage />;
      case 'messages': return <MessagesPage />;
      case 'notifications': return <NotificationsPage />;
      case 'events': return <EventsPage />;
      case 'prayer': return <PrayerPage />;
      case 'parishes': return <ParishesPage />;
      case 'search': return <SearchPage />;
      case 'settings': return <SettingsPage />;
      default: return <FeedPage />;
    }
  };

  return (
    <Layout>
      {renderPage()}
    </Layout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
