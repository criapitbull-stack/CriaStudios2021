import { Quote, MapPin } from 'lucide-react';
import { TESTIMONIALS } from '@/data/content';

export default function Testimonials() {
  return (
    <section id="depoimentos" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-rose-600 font-semibold text-sm uppercase tracking-wider">
            Relatos de modelos
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-ink-900 mt-2 mb-4 text-balance">
            Mulheres reais, ganhos reais
          </h2>
          <p className="text-ink-500 text-lg max-w-2xl mx-auto">
            Conheça alguns dos modelos que mudaram de vida com a Cria Studios.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="relative bg-ink-50 rounded-3xl p-8 border border-ink-100 hover:shadow-lg transition-all"
            >
              <Quote className="w-10 h-10 text-rose-200 mb-4" />
              <p className="text-ink-600 leading-relaxed mb-6 italic">
                "{t.text}"
              </p>
              <div className="flex items-center gap-4">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-ink-900">{t.name}</div>
                  <div className="flex items-center gap-1 text-xs text-ink-400">
                    <MapPin className="w-3 h-3" />
                    {t.location}
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-ink-200">
                <span className="text-sm text-ink-400">Ganha atualmente: </span>
                <span className="font-bold text-rose-600">{t.earnings}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
