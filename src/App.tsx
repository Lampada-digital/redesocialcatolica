import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import SetupPage from './pages/SetupPage';
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
import { getSupabase } from './lib/supabase';

function AppContent() {
  const { isAuthenticated, currentPage } = useApp();

  // Verificar se o Supabase está configurado dinamicamente
  const supabase = getSupabase();
  if (!supabase) {
    return <SetupPage />;
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
