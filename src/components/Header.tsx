import { useEffect, useState } from 'react';
import { Menu, X, MessageCircle } from 'lucide-react';
import RotatingCta from '@/components/RotatingCta';

interface HeaderProps {
  onOpenChat: () => void;
}

export default function Header({ onOpenChat }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Como funciona', href: '#como-funciona' },
    { label: 'Ganhos', href: '#ganhos' },
    { label: 'Requisitos', href: '#requisitos' },
    { label: 'Plataformas', href: '#plataformas' },
    { label: 'Depoimentos', href: '#depoimentos' },
    { label: 'Dúvidas', href: '#duvidas' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-ink-950/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <a href="#top" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-gold-400 flex items-center justify-center font-display font-bold text-white text-lg shadow-glow">
              C
            </div>
            <span className="font-display font-bold text-xl text-white tracking-tight">
              Cria Studios
            </span>
          </a>

          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-ink-200 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <RotatingCta
              icon={MessageCircle}
              iconClass="w-4 h-4"
              onClick={onOpenChat}
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 text-white text-sm font-semibold hover:from-rose-600 hover:to-rose-700 transition-all shadow-glow"
            />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden text-white p-2"
              aria-label="Menu"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="lg:hidden pb-4 pt-2 flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 rounded-lg text-ink-200 hover:bg-white/10 hover:text-white transition-colors text-sm font-medium"
              >
                {link.label}
              </a>
            ))}
            <RotatingCta
              icon={MessageCircle}
              iconClass="w-4 h-4"
              onClick={() => {
                setMenuOpen(false);
                onOpenChat();
              }}
              className="sm:hidden mt-2 flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 text-white text-sm font-semibold"
            />
          </nav>
        )}
      </div>
    </header>
  );
}
