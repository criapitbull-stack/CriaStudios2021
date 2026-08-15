import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import HowItWorks from '@/components/HowItWorks';
import Earnings from '@/components/Earnings';
import Requirements from '@/components/Requirements';
import Platforms from '@/components/Platforms';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
import SeoContent from '@/components/SeoContent';
import Footer from '@/components/Footer';
import ChatButton from '@/components/ChatButton';
import ChatWidget from '@/components/ChatWidget';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { useAdminAuth } from '@/hooks/useAdminAuth';

function App() {
  const [chatOpen, setChatOpen] = useState(false);
  const [route, setRoute] = useState(window.location.hash);
  const { session, loading, isAdmin } = useAdminAuth();

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const isAdminRoute = route.startsWith('#admin');

  if (loading) {
    return (
      <div className="min-h-screen bg-ink-950 flex items-center justify-center">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-gold-400 flex items-center justify-center font-display font-bold text-white text-xl animate-pulse">
          C
        </div>
      </div>
    );
  }

  if (isAdminRoute) {
    if (isAdmin && session) {
      return <AdminDashboard onLogout={() => window.location.reload()} />;
    }
    return (
      <AdminLogin
        onSuccess={() => window.location.reload()}
        onBack={() => {
          window.location.hash = '';
          setRoute('');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header onOpenChat={() => setChatOpen(true)} />
      <main>
        <Hero onOpenChat={() => setChatOpen(true)} />
        <About />
        <HowItWorks onOpenChat={() => setChatOpen(true)} />
        <Earnings onOpenChat={() => setChatOpen(true)} />
        <Requirements onOpenChat={() => setChatOpen(true)} />
        <Platforms />
        <Testimonials />
        <FAQ onOpenChat={() => setChatOpen(true)} />
        <SeoContent />
      </main>
      <Footer onOpenChat={() => setChatOpen(true)} />
      <ChatButton onOpenChat={() => setChatOpen(true)} />
      <ChatWidget open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}

export default App;
