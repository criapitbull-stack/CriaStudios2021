import { TrendingUp, DollarSign, Clock } from 'lucide-react';
import { EARNINGS_TIERS } from '@/data/content';
import RotatingCta from '@/components/RotatingCta';

interface EarningsProps {
  onOpenChat: () => void;
}

export default function Earnings({ onOpenChat }: EarningsProps) {
  return (
    <section id="ganhos" className="py-20 bg-ink-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950 via-ink-900 to-ink-950" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-gold-400 font-semibold text-sm uppercase tracking-wider">
            Quanto posso ganhar
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2 mb-4 text-balance">
            Sua renda cresce com sua dedicação
          </h2>
          <p className="text-ink-300 text-lg max-w-2xl mx-auto">
            Não há teto. Quanto mais você transmite, mais você ganha. Veja os
            níveis de ganho dos nossos modelos:
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-14">
          {EARNINGS_TIERS.map((tier, i) => (
            <div
              key={tier.level}
              className="relative group rounded-3xl bg-ink-800/50 backdrop-blur-sm border border-ink-700 p-8 hover:border-rose-500/50 transition-all hover:scale-105"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div
                className={`absolute inset-x-0 top-0 h-1 rounded-t-3xl bg-gradient-to-r ${tier.color}`}
              />
              <div className="text-sm font-semibold text-ink-300 uppercase tracking-wider mb-2">
                {tier.level}
              </div>
              <div
                className={`text-3xl font-bold bg-gradient-to-r ${tier.color} bg-clip-text text-transparent mb-4`}
              >
                {tier.range}
              </div>
              <p className="text-ink-400 text-sm leading-relaxed">
                {tier.description}
              </p>
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          <div className="flex items-start gap-4 p-6 rounded-2xl bg-ink-800/30 border border-ink-700">
            <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-6 h-6 text-rose-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Pagamento real</h3>
              <p className="text-ink-400 text-sm">
                Receba em moedas convertíveis em reais, diretamente das
                plataformas.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 rounded-2xl bg-ink-800/30 border border-ink-700">
            <div className="w-12 h-12 rounded-xl bg-gold-500/20 flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6 text-gold-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Horário flexível</h3>
              <p className="text-ink-400 text-sm">
                Você escolhe quando transmitir. Sem meta, sem patrão, sem ponto.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 rounded-2xl bg-ink-800/30 border border-ink-700">
            <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-rose-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Crescimento real</h3>
              <p className="text-ink-400 text-sm">
                Quanto mais plataformas e transmissões, maior a sua renda
                mensal.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <RotatingCta
            onClick={onOpenChat}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold hover:from-rose-600 hover:to-rose-700 transition-all shadow-glow hover:scale-105"
          />
        </div>
      </div>
    </section>
  );
}
