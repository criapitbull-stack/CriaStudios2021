import { useEffect, useRef, useState } from 'react';
import { X, Send, Check, CheckCheck, User, Phone, Calendar, ChevronLeft, Shield, MessageCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getVisitorToken } from '@/hooks/useVisitorToken';
import { getPlatform } from '@/data/platforms';
import type { ConversationState, PlatformKey } from '@/types';

interface ChatWidgetProps {
  open: boolean;
  onClose: () => void;
}

type View = 'chat' | 'register' | 'status';

export default function ChatWidget({ open, onClose }: ChatWidgetProps) {
  const [view, setView] = useState<View>('chat');
  const [conversation, setConversation] = useState<ConversationState | null>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // registration form
  const [regName, setRegName] = useState('');
  const [regAge, setRegAge] = useState('');
  const [regWhats, setRegWhats] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const token = getVisitorToken();

  const loadConversation = async () => {
    const { data, error } = await supabase.rpc('get_my_conversation', {
      p_visitor_token: token,
    });
    if (!error && data) {
      setConversation(data as ConversationState);
    }
  };

  const startIfNeeded = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc('start_conversation', {
      p_visitor_token: token,
    });
    setLoading(false);
    if (error) {
      setError('Não foi possível conectar. Tente novamente.');
      return;
    }
    setConversation(data as ConversationState);
  };

  useEffect(() => {
    if (open && !conversation) {
      startIfNeeded();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (open && conversation) {
      pollRef.current = setInterval(loadConversation, 4000);
      return () => {
        if (pollRef.current) clearInterval(pollRef.current);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, conversation?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages?.length]);

  if (!open) return null;

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    setLoading(true);
    const { data, error } = await supabase.rpc('send_visitor_message', {
      p_visitor_token: token,
      p_content: text,
    });
    setLoading(false);
    if (error) {
      setError('Não foi possível enviar. Tente novamente.');
      return;
    }
    setConversation(data as ConversationState);
  };

  const submitRegistration = async () => {
    setError(null);
    if (!regName.trim() || !regAge || !regWhats.trim()) {
      setError('Preencha todos os campos.');
      return;
    }
    const age = parseInt(regAge, 10);
    if (isNaN(age) || age < 18) {
      setError('Você precisa ter 18 anos ou mais.');
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.rpc('submit_registration', {
      p_visitor_token: token,
      p_name: regName,
      p_age: age,
      p_whatsapp: regWhats,
    });
    setLoading(false);
    if (error) {
      setError('Não foi possível enviar o cadastro. Verifique os dados e tente novamente.');
      return;
    }
    setConversation(data as ConversationState);
    setView('chat');
    setRegName('');
    setRegAge('');
    setRegWhats('');
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const messages = conversation?.messages ?? [];
  const platforms = conversation?.platforms ?? [];
  const isRegistered = !!(conversation?.name && conversation?.age && conversation?.whatsapp);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full sm:max-w-md h-[100dvh] sm:h-[85vh] sm:rounded-3xl overflow-hidden bg-white shadow-2xl flex flex-col animate-slide-up sm:animate-fade-in-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-ink-900 to-ink-800 px-4 py-3 flex items-center gap-3 flex-shrink-0">
          {view !== 'chat' && (
            <button
              onClick={() => setView('chat')}
              className="text-white p-1"
              aria-label="Voltar"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-gold-400 flex items-center justify-center font-display font-bold text-white">
              C
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-400 border-2 border-ink-900" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-white text-sm">Cria Studios</div>
            <div className="text-xs text-green-300 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              online agora
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white p-1" aria-label="Fechar">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Views */}
        {view === 'chat' && (
          <>
            <div className="chat-bg flex-1 overflow-y-auto scrollbar-thin px-3 py-4 space-y-2">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="inline-block bg-white/90 rounded-2xl px-4 py-3 shadow-sm max-w-[85%]">
                    <p className="text-sm text-ink-700">
                      Olá! Bem-vinda à Cria Studios. Para começar seu cadastro
                      como modelo, envie uma mensagem ou preencha o formulário
                      de cadastro. Tire suas dúvidas — estamos aqui para ajudar!
                    </p>
                  </div>
                </div>
              )}

              {messages.map((msg) => {
                const isVisitor = msg.sender === 'visitor';
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isVisitor ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-3 py-2 shadow-sm ${
                        isVisitor
                          ? 'bg-[#dcf8c6] rounded-tr-sm'
                          : 'bg-white rounded-tl-sm'
                      }`}
                    >
                      <p className="text-sm text-ink-800 whitespace-pre-wrap break-words">
                        {msg.content}
                      </p>
                      <div className="flex items-center justify-end gap-1 mt-0.5">
                        <span className="text-[10px] text-ink-400">
                          {formatTime(msg.created_at)}
                        </span>
                        {isVisitor && (
                          <CheckCheck className="w-3.5 h-3.5 text-ink-400" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {conversation?.status === 'cadastro_concluido' && platforms.length > 0 && (
                <div className="bg-white rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-semibold text-ink-900">
                      Cadastro concluído!
                    </span>
                  </div>
                  <p className="text-xs text-ink-500 mb-3">
                    Você já pode iniciar transmissões nas seguintes plataformas:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {platforms.map((p) => {
                      const info = getPlatform(p as PlatformKey);
                      return (
                        <div
                          key={p}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-ink-50 border border-ink-100"
                        >
                          <info.icon
                            className="w-4 h-4"
                            style={{ color: info.color }}
                          />
                          <span className="text-sm font-medium text-ink-800">
                            {info.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Action buttons */}
            <div className="bg-ink-50 border-t border-ink-100 px-3 py-2 flex gap-2 flex-shrink-0 flex-wrap">
              {!isRegistered && (
                <button
                  onClick={() => setView('register')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-rose-500 text-white text-xs font-semibold hover:bg-rose-600 transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  Cadastrar
                </button>
              )}
              <a
                href="https://wa.me/5571993559126?text=Ol%C3%A1%20vim%20do%20site%20quero%20ser%20modelo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-green-500 text-white text-xs font-semibold hover:bg-green-600 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                WhatsApp
              </a>
              <button
                onClick={() => setView('status')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white border border-ink-200 text-ink-700 text-xs font-semibold hover:bg-ink-100 transition-colors"
              >
                <Shield className="w-3.5 h-3.5" />
                {conversation?.protocol ? `Protocolo ${conversation.protocol}` : 'Status'}
              </button>
            </div>

            {/* Input */}
            <div className="bg-white border-t border-ink-100 px-3 py-3 flex items-center gap-2 flex-shrink-0">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Mensagem"
                className="flex-1 px-4 py-2.5 rounded-full bg-ink-50 border border-ink-200 text-sm focus:outline-none focus:border-rose-300"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-rose-600 text-white flex items-center justify-center disabled:opacity-40 hover:scale-105 transition-transform flex-shrink-0"
                aria-label="Enviar"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </>
        )}

        {/* Register view */}
        {view === 'register' && (
          <div className="flex-1 overflow-y-auto scrollbar-thin p-6 bg-white">
            <h3 className="text-xl font-bold text-ink-900 mb-2">Cadastro rápido</h3>
            <p className="text-ink-500 text-sm mb-6">
              Precisamos de apenas 3 informações para iniciar seu cadastro nas
              plataformas.
            </p>

            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-ink-700 mb-1.5">
                  <User className="w-4 h-4" /> Nome
                </label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full px-4 py-3 rounded-xl border border-ink-200 text-sm focus:outline-none focus:border-rose-400"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-ink-700 mb-1.5">
                  <Calendar className="w-4 h-4" /> Idade
                </label>
                <input
                  type="number"
                  value={regAge}
                  onChange={(e) => setRegAge(e.target.value)}
                  placeholder="18"
                  min={18}
                  max={90}
                  className="w-full px-4 py-3 rounded-xl border border-ink-200 text-sm focus:outline-none focus:border-rose-400"
                />
                <p className="text-xs text-ink-400 mt-1">Mínimo 18 anos</p>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-ink-700 mb-1.5">
                  <Phone className="w-4 h-4" /> WhatsApp
                </label>
                <input
                  type="tel"
                  value={regWhats}
                  onChange={(e) => setRegWhats(e.target.value)}
                  placeholder="(00) 00000-0000"
                  className="w-full px-4 py-3 rounded-xl border border-ink-200 text-sm focus:outline-none focus:border-rose-400"
                />
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
                {error}
              </div>
            )}

            <div className="mt-6 p-4 rounded-xl bg-ink-50 text-xs text-ink-500">
              <p className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-ink-400 flex-shrink-0 mt-0.5" />
                Seus dados são protegidos e usados apenas para o cadastro nas
                plataformas. Não compartilhamos com terceiros.
              </p>
            </div>

            <button
              onClick={submitRegistration}
              disabled={loading}
              className="w-full mt-6 py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold disabled:opacity-50 hover:from-rose-600 hover:to-rose-700 transition-all"
            >
              {loading ? 'Enviando...' : 'Enviar cadastro'}
            </button>
          </div>
        )}

        {/* Status view */}
        {view === 'status' && (
          <div className="flex-1 overflow-y-auto scrollbar-thin p-6 bg-ink-50">
            <h3 className="text-xl font-bold text-ink-900 mb-4">Seu protocolo</h3>

            {conversation?.protocol && (
              <div className="bg-white rounded-2xl p-5 border border-ink-100 mb-4">
                <div className="text-xs text-ink-400 mb-1">Número de protocolo</div>
                <div className="text-2xl font-bold text-rose-600 font-display">
                  {conversation.protocol}
                </div>
                <p className="text-xs text-ink-400 mt-2">
                  Guarde este número. Ele é seu histórico de atendimento.
                </p>
              </div>
            )}

            <div className="bg-white rounded-2xl p-5 border border-ink-100 mb-4">
              <div className="text-xs text-ink-400 mb-3">Status do cadastro</div>
              <div className="space-y-3">
                <StatusStep
                  label="Conversa iniciada"
                  done={!!conversation}
                />
                <StatusStep
                  label="Dados enviados"
                  done={isRegistered}
                />
                <StatusStep
                  label="Cadastro concluído"
                  done={conversation?.status === 'cadastro_concluido'}
                />
                <StatusStep
                  label="Plataformas liberadas"
                  done={platforms.length > 0}
                  count={platforms.length}
                />
              </div>
            </div>

            {conversation?.name && (
              <div className="bg-white rounded-2xl p-5 border border-ink-100">
                <div className="text-xs text-ink-400 mb-2">Seus dados</div>
                <div className="text-sm text-ink-700 space-y-1">
                  <p>Nome: <strong>{conversation.name}</strong></p>
                  <p>Idade: <strong>{conversation.age} anos</strong></p>
                  <p>WhatsApp: <strong>{conversation.whatsapp}</strong></p>
                </div>
              </div>
            )}

            {platforms.length > 0 && (
              <div className="bg-white rounded-2xl p-5 border border-ink-100 mt-4">
                <div className="text-xs text-ink-400 mb-3">Plataformas liberadas</div>
                <div className="flex flex-wrap gap-2">
                  {platforms.map((p) => {
                    const info = getPlatform(p as PlatformKey);
                    return (
                      <div
                        key={p}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-ink-50"
                      >
                        <info.icon
                          className="w-4 h-4"
                          style={{ color: info.color }}
                        />
                        <span className="text-sm font-medium text-ink-800">
                          {info.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusStep({
  label,
  done,
  count,
}: {
  label: string;
  done: boolean;
  count?: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
          done ? 'bg-green-500 text-white' : 'bg-ink-200 text-ink-400'
        }`}
      >
        {done ? <Check className="w-3.5 h-3.5" /> : <span className="text-xs">•</span>}
      </div>
      <span className={`text-sm ${done ? 'text-ink-900 font-medium' : 'text-ink-400'}`}>
        {label}
        {count !== undefined && count > 0 && ` (${count})`}
      </span>
    </div>
  );
}
