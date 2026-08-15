import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQS } from '@/data/content';
import RotatingCta from '@/components/RotatingCta';

interface FAQProps {
  onOpenChat: () => void;
}

export default function FAQ({ onOpenChat }: FAQProps) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="duvidas" className="py-20 bg-ink-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-rose-600 font-semibold text-sm uppercase tracking-wider">
            Dúvidas frequentes
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-ink-900 mt-2 mb-4 text-balance">
            Perguntas e respostas
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-ink-100 overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left"
              >
                <span className="font-semibold text-ink-900">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-rose-500 flex-shrink-0 transition-transform ${
                    open === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-ink-600 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <p className="text-ink-500 mb-4">Ainda tem dúvidas? Fale com a gente.</p>
          <RotatingCta
            onClick={onOpenChat}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold hover:from-rose-600 hover:to-rose-700 transition-all shadow-glow"
          />
        </div>
      </div>
    </section>
  );
}
