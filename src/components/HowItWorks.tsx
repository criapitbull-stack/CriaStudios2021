import { MessageCircle, ClipboardCheck, Rocket } from 'lucide-react';
import RotatingCta from '@/components/RotatingCta';

interface HowItWorksProps {
  onOpenChat: () => void;
}

export default function HowItWorks({ onOpenChat }: HowItWorksProps) {
  const steps = [
    {
      icon: MessageCircle,
      number: '01',
      title: 'Converse com a gente',
      description:
        'Abra o chat no nosso site e fale com o admin da Cria Studios. Não precisa se cadastrar em nada — é só conversar, como no WhatsApp.',
    },
    {
      icon: ClipboardCheck,
      number: '02',
      title: 'Envie seus dados',
      description:
        'Precisamos apenas do seu nome, idade e número de WhatsApp. Confirmamos os requisitos e iniciamos seu cadastro.',
    },
    {
      icon: Rocket,
      number: '03',
      title: 'Receba as plataformas',
      description:
        'Concluído o cadastro, liberamos as plataformas no seu painel. Você já pode iniciar as transmissões e ganhar.',
    },
  ];

  return (
    <section id="como-funciona" className="py-20 bg-ink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-rose-600 font-semibold text-sm uppercase tracking-wider">
            Como funciona
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-ink-900 mt-2 mb-4 text-balance">
            Do chat à primeira transmissão em 3 passos
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-20 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-rose-200 via-gold-200 to-rose-200" />
          {steps.map((step) => (
            <div key={step.number} className="relative text-center">
              <div className="relative inline-flex w-20 h-20 rounded-full bg-white shadow-lg items-center justify-center mb-6 z-10">
                <step.icon className="w-9 h-9 text-rose-500" />
                <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-rose-600 text-white text-xs font-bold flex items-center justify-center shadow-glow">
                  {step.number}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-ink-900 mb-3">
                {step.title}
              </h3>
              <p className="text-ink-500 max-w-xs mx-auto">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-14">
          <RotatingCta
            icon={MessageCircle}
            onClick={onOpenChat}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold hover:from-rose-600 hover:to-rose-700 transition-all shadow-glow hover:scale-105"
          />
        </div>
      </div>
    </section>
  );
}
