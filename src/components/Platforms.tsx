import { ExternalLink } from 'lucide-react';
import { PLATFORMS } from '@/data/platforms';

export default function Platforms() {
  return (
    <section id="plataformas" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-rose-600 font-semibold text-sm uppercase tracking-wider">
            Onde você vai transmitir
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-ink-900 mt-2 mb-4 text-balance">
            Plataformas de webcam
          </h2>
          <p className="text-ink-500 text-lg max-w-2xl mx-auto">
            Trabalhamos com as principais plataformas do mercado. Quando
            o cadastro é concluído, liberamos o acesso no seu painel.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {PLATFORMS.map((platform) => (
            <div
              key={platform.key}
              className="group relative rounded-2xl bg-ink-50 border border-ink-100 p-6 text-center hover:shadow-lg hover:scale-105 transition-all"
            >
              <div
                className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${platform.color}15` }}
              >
                <platform.icon
                  className="w-8 h-8"
                  style={{ color: platform.color }}
                />
              </div>
              <h3 className="font-semibold text-ink-900 mb-1">
                {platform.name}
              </h3>
              <p className="text-xs text-ink-400">Plataforma de webcam</p>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 rounded-2xl bg-gold-50 border border-gold-200">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-gold-200 flex items-center justify-center flex-shrink-0">
              <ExternalLink className="w-5 h-5 text-gold-700" />
            </div>
            <div>
              <p className="text-ink-700 text-sm">
                <strong className="text-ink-900">Na imprensa:</strong> a rotina e
                os ganhos de camgirls têm sido destaque na mídia. Veja, por
                exemplo, a reportagem da Band:
              </p>
            </div>
          </div>
          
          <a
            href="https://www.band.com.br/entretenimento/melhor-da-noite/noticias/conheca-a-rotina-de-uma-cam-girl-que-se-apresenta-com-o-marido-e-quanto-ela-ganha-202507262103"
            target="_blank"
            rel="noopener noreferrer"
            className="block group relative rounded-xl overflow-hidden hover:shadow-lg transition-all"
          >
            <img
              src="https://images.pexels.com/photos/12433027/pexels-photo-12433027.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Thumbnail da reportagem da Band sobre camgirls"
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded">
                  BAND
                </div>
                <span className="text-white/80 text-xs">Reportagem exclusiva</span>
              </div>
              <p className="text-white font-semibold text-sm group-hover:text-rose-300 transition-colors">
                Conheça a rotina de uma cam-girl e quanto ela ganha — Band.com.br
              </p>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
