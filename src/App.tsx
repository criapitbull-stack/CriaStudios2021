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
import AdminLogin from '@/components/admin/AdminLogin';
import AdminDashboard from '@/components/admin/AdminDashboard';
import ContractPage from '@/components/ContractPage';
import { useAdminAuth } from '@/hooks/useAdminAuth';

function App() {
  const [route, setRoute] = useState(window.location.hash);
  const [contractId, setContractId] = useState<string | null>(null);
  const { session, loading, isAdmin } = useAdminAuth();

  useEffect(() => {
    // Verificar se é rota de contrato pelo pathname
    const pathname = window.location.pathname;
    if (pathname.startsWith('/contrato/')) {
      const id = pathname.replace('/contrato/', '');
      setContractId(id);
      setRoute('#contrato');
    } else if (pathname === '/contrato') {
      setContractId(null);
      setRoute('#contrato');
    } else {
      setContractId(null);
      setRoute(window.location.hash);
    }
  }, []);

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const isAdminRoute = route.startsWith('#admin');
  const isContractRoute = route.startsWith('#contrato');

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

  if (isContractRoute) {
    return <ContractPage contractId={contractId} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <About />
        <HowItWorks />
        <Earnings />
        <Requirements />
        <Platforms />
        <Testimonials />
        <FAQ />
        <SeoContent />
      </main>
      <Footer />
      <ChatButton />
    </div>
  );
}

export default App;
