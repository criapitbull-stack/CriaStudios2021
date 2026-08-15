import { Check, Smartphone, Clock, Camera, Shield } from 'lucide-react';
import RotatingCta from '@/components/RotatingCta';

interface RequirementsProps {
  onOpenChat: () => void;
}

export default function Requirements({ onOpenChat }: RequirementsProps) {
  const requirements = [
    {
      icon: Shield,
      title: '18 anos ou mais',
      description: 'Idade mínima obrigatória. Verificada nas plataformas.',
    },
    {
      icon: Smartphone,
      title: 'Celular ou notebook com câmera',
      description: 'Boa qualidade de imagem é o suficiente para começar.',
    },
    {
      icon: Clock,
      title: 'Tempo livre',
      description: 'Algumas horas por dia já são o suficiente para começar a ganhar.',
    },
  ];

  return (
    <section id="requisitos" className="py-20 bg-ink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-rose-600 font-semibold text-sm uppercase tracking-wider">
            O que você precisa
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-ink-900 mt-2 mb-4 text-balance">
            Requisitos simples para começar
          </h2>
          <p className="text-ink-500 text-lg max-w-2xl mx-auto">
            Não é preciso experiência, investimento ou equipamento profissional.
            Confira o que você precisa:
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {requirements.map((req) => (
            <div
              key={req.title}
              className="bg-white rounded-3xl p-8 shadow-sm border border-ink-100 hover:shadow-lg hover:border-rose-200 transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-50 to-rose-100 flex items-center justify-center mb-5">
                <req.icon className="w-7 h-7 text-rose-500" />
              </div>
              <h3 className="text-xl font-semibold text-ink-900 mb-2">
                {req.title}
              </h3>
              <p className="text-ink-500">{req.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-ink-900 to-ink-800 rounded-3xl p-8 sm:p-12 text-center">
          <h3 className="text-2xl font-bold text-white mb-3">
            Tem tudo isso? Então você já pode começar.
          </h3>
          <p className="text-ink-300 mb-6 max-w-xl mx-auto">
            O cadastro é gratuito e feito pelo nosso chat. Em poucos dias você
            já pode estar transmitindo.
          </p>
          <RotatingCta
            onClick={onOpenChat}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold hover:from-rose-600 hover:to-rose-700 transition-all shadow-glow hover:scale-105"
          />
        </div>
      </div>
    </section>
  );
}
