import { Shield, Lock, MapPin } from 'lucide-react';

interface FooterProps {
  onOpenChat: () => void;
}

export default function Footer({ onOpenChat }: FooterProps) {
  return (
    <footer className="bg-ink-950 text-ink-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-gold-400 flex items-center justify-center font-display font-bold text-white text-lg">
                C
              </div>
              <span className="font-display font-bold text-xl text-white">
                Cria Studios
              </span>
            </div>
            <p className="text-ink-400 max-w-md leading-relaxed">
              Estúdio de modelos e camgirls desde 2021. Cadastro e suporte para
              trabalho com webcam em casa. Renda extra e vagas home office para
              maiores de 18 anos.
            </p>
            <div className="flex items-center gap-2 mt-4 text-ink-400">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">Atuação internacional</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Navegação</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#como-funciona" className="hover:text-white transition-colors">
                  Como funciona
                </a>
              </li>
              <li>
                <a href="#ganhos" className="hover:text-white transition-colors">
                  Ganhos
                </a>
              </li>
              <li>
                <a href="#requisitos" className="hover:text-white transition-colors">
                  Requisitos
                </a>
              </li>
              <li>
                <a href="#plataformas" className="hover:text-white transition-colors">
                  Plataformas
                </a>
              </li>
              <li>
                <a href="#duvidas" className="hover:text-white transition-colors">
                  Dúvidas
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Contato</h4>
            <button
              onClick={onOpenChat}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold text-sm hover:from-rose-600 hover:to-rose-700 transition-all"
            >
              Abrir chat
            </button>
            <div className="flex items-center gap-2 mt-4 text-ink-400 text-sm">
              <Lock className="w-4 h-4" />
              <span>Seus dados são protegidos</span>
            </div>
          </div>
        </div>

        <div className="border-t border-ink-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-ink-500 text-sm">
              &copy; {new Date().getFullYear()} Cria Studios. Todos os direitos
              reservados. Conteúdo destinado a maiores de 18 anos.
            </p>
            <div className="flex items-center gap-2 text-ink-500 text-sm">
              <Shield className="w-4 h-4" />
              <span>Trabalho permitido para maiores de 18 anos</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
