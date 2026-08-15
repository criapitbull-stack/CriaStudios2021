import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, MessageCircle, Shield, TrendingUp } from 'lucide-react';
import { SLIDES, ROTATING_CTAS } from '@/data/content';

interface HeroProps {
  onOpenChat: () => void;
}

export default function Hero({ onOpenChat }: HeroProps) {
  const [current, setCurrent] = useState(0);
  const [ctaIndex, setCtaIndex] = useState(0);

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(slideTimer);
  }, []);

  useEffect(() => {
    const ctaTimer = setInterval(() => {
      setCtaIndex((prev) => (prev + 1) % ROTATING_CTAS.length);
    }, 2500);
    return () => clearInterval(ctaTimer);
  }, []);

  const goTo = (index: number) => setCurrent((index + SLIDES.length) % SLIDES.length);

  return (
    <section id="top" className="relative h-screen min-h-[640px] overflow-hidden">
      {SLIDES.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-950/90 via-ink-950/70 to-ink-950/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent" />
        </div>
      ))}

      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/20 border border-rose-400/30 backdrop-blur-sm mb-6 animate-fade-in-up">
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse-dot" />
              <span className="text-rose-100 text-sm font-medium">
                Estúdio de modelos desde 2021 — Atuação internacional
              </span>
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight text-balance mb-4 animate-fade-in-up"
              style={{ animationDelay: '0.1s' }}
            >
              {SLIDES[current].title}
            </h1>
            <p
              className="text-lg sm:text-xl text-ink-200 mb-8 max-w-xl animate-fade-in-up"
              style={{ animationDelay: '0.2s' }}
            >
              {SLIDES[current].subtitle}
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 mb-8 animate-fade-in-up"
              style={{ animationDelay: '0.3s' }}
            >
              <button
                onClick={onOpenChat}
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold text-base hover:from-rose-600 hover:to-rose-700 transition-all shadow-glow hover:scale-105 min-w-[260px]"
              >
                <MessageCircle className="w-5 h-5" />
                <span key={ctaIndex} className="animate-fade-in-up">
                  {ROTATING_CTAS[ctaIndex]}
                </span>
              </button>
              <a
                href="#ganhos"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold text-base hover:bg-white/20 transition-all"
              >
                Ver quanto posso ganhar
              </a>
            </div>

            <div
              className="flex flex-wrap gap-6 animate-fade-in-up"
              style={{ animationDelay: '0.4s' }}
            >
              <div className="flex items-center gap-2 text-ink-200">
                <Shield className="w-5 h-5 text-gold-400" />
                <span className="text-sm">Maior de 18 anos</span>
              </div>
              <div className="flex items-center gap-2 text-ink-200">
                <TrendingUp className="w-5 h-5 text-gold-400" />
                <span className="text-sm">Até R$ 30.000/mês</span>
              </div>
              <div className="flex items-center gap-2 text-ink-200">
                <MessageCircle className="w-5 h-5 text-gold-400" />
                <span className="text-sm">Cadastro grátis pelo chat</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => goTo(current - 1)}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all hidden md:flex"
        aria-label="Anterior"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => goTo(current + 1)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all hidden md:flex"
        aria-label="Próximo"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all ${
              i === current ? 'w-8 bg-rose-500' : 'w-2 bg-white/40'
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
