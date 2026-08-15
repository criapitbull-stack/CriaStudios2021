import { MapPin, Calendar, Globe } from 'lucide-react';

export default function About() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <span className="text-rose-600 font-semibold text-sm uppercase tracking-wider">
              Quem somos
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-ink-900 mt-2 mb-6 text-balance">
              Somos a Cria Studios — estúdio de modelos desde 2021
            </h2>
            <p className="text-ink-600 text-lg leading-relaxed mb-4">
              A Cria Studios é um estúdio especializado em recrutar, cadastrar e
              orientar mulheres que querem trabalhar como camgirls e modelos de
              webcam adulta. Atuamos internacionalmente, atendendo modelos em
              todo o mundo de forma 100% online.
            </p>
            <p className="text-ink-600 text-lg leading-relaxed mb-8">
              Nosso papel é simples: conversamos com você pelo chat, entendemos
              seu perfil, cadastramos você nas melhores plataformas de webcam e
              damos todo o suporte para que você maximize seus ganhos — sem
              custo, sem burocracia, sem compromisso.
            </p>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-2xl bg-ink-50">
                <Calendar className="w-7 h-7 text-rose-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-ink-900">2021</div>
                <div className="text-xs text-ink-500 mt-1">Desde</div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-ink-50">
                <Globe className="w-7 h-7 text-rose-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-ink-900">Global</div>
                <div className="text-xs text-ink-500 mt-1">Atuação</div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-ink-50">
                <MapPin className="w-7 h-7 text-rose-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-ink-900">+500</div>
                <div className="text-xs text-ink-500 mt-1">Modelos</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.pexels.com/photos/14726381/pexels-photo-14726381.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Modelo de lingerie trabalhando em casa"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl p-6 shadow-glow max-w-[200px]">
              <div className="text-3xl font-bold text-white">+18</div>
              <div className="text-rose-100 text-sm mt-1">
                Idade mínima para cadastro
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
