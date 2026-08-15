import { useEffect, useRef, useState } from 'react';
import { LogOut, Send, Check, Users, Clock, CheckCircle, Search } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { PLATFORMS, getPlatform } from '@/data/platforms';
import type { AdminConversationRow, ChatMessage, PlatformKey, ConversationStatus } from '@/types';

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [conversations, setConversations] = useState<AdminConversationRow[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [platforms, setPlatforms] = useState<PlatformKey[]>([]);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<ConversationStatus | 'all'>('all');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadConversations = async () => {
    let query = supabase
      .from('conversations')
      .select('*')
      .order('updated_at', { ascending: false });

    if (filter !== 'all') {
      query = query.eq('status', filter);
    }

    const { data } = await query;
    if (data) setConversations(data as AdminConversationRow[]);
  };

  useEffect(() => {
    loadConversations();
    pollRef.current = setInterval(loadConversations, 5000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  useEffect(() => {
    if (!selectedId) return;

    const loadDetail = async () => {
      const [msgRes, platRes] = await Promise.all([
        supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', selectedId)
          .order('created_at', { ascending: true }),
        supabase
          .from('conversation_platforms')
          .select('platform')
          .eq('conversation_id', selectedId),
      ]);

      if (msgRes.data) setMessages(msgRes.data as ChatMessage[]);
      if (platRes.data) {
        setPlatforms(platRes.data.map((r: { platform: PlatformKey }) => r.platform));
      }
    };

    loadDetail();
    const interval = setInterval(loadDetail, 3000);
    return () => clearInterval(interval);
  }, [selectedId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || !selectedId) return;
    setInput('');
    setSending(true);
    const { data } = await supabase
      .from('messages')
      .insert({
        conversation_id: selectedId,
        sender: 'admin',
        content: text,
      })
      .select('*')
      .single();
    setSending(false);
    if (data) {
      setMessages((prev) => [...prev, data as ChatMessage]);
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', selectedId);
      loadConversations();
    }
  };

  const updateStatus = async (status: ConversationStatus) => {
    if (!selectedId) return;
    await supabase.from('conversations').update({ status }).eq('id', selectedId);
    loadConversations();
  };

  const togglePlatform = async (platform: PlatformKey) => {
    if (!selectedId) return;

    const exists = platforms.includes(platform);
    if (exists) {
      await supabase
        .from('conversation_platforms')
        .delete()
        .eq('conversation_id', selectedId)
        .eq('platform', platform);
      setPlatforms((prev) => prev.filter((p) => p !== platform));
    } else {
      await supabase
        .from('conversation_platforms')
        .insert({ conversation_id: selectedId, platform });
      setPlatforms((prev) => [...prev, platform]);
    }
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const filteredConversations = conversations.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.protocol?.toLowerCase().includes(q) ||
      c.name?.toLowerCase().includes(q) ||
      c.whatsapp?.includes(q)
    );
  });

  const selected = conversations.find((c) => c.id === selectedId);

  const statusBadge = (status: ConversationStatus) => {
    const map: Record<ConversationStatus, { label: string; color: string }> = {
      novo: { label: 'Novo', color: 'bg-blue-100 text-blue-700' },
      em_atendimento: { label: 'Em atendimento', color: 'bg-gold-100 text-gold-700' },
      cadastro_concluido: { label: 'Concluído', color: 'bg-green-100 text-green-700' },
    };
    const s = map[status];
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.color}`}>
        {s.label}
      </span>
    );
  };

  const stats = {
    total: conversations.length,
    novos: conversations.filter((c) => c.status === 'novo').length,
    emAtendimento: conversations.filter((c) => c.status === 'em_atendimento').length,
    concluidos: conversations.filter((c) => c.status === 'cadastro_concluido').length,
  };

  return (
    <div className="h-screen bg-ink-50 flex flex-col">
      {/* Top bar */}
      <div className="bg-ink-950 px-4 sm:px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-gold-400 flex items-center justify-center font-display font-bold text-white">
            C
          </div>
          <div>
            <div className="font-semibold text-white text-sm">Cria Studios — Painel</div>
            <div className="text-xs text-ink-400">Atendimento</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-ink-800 text-ink-300 text-sm hover:bg-ink-700 hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>

      {/* Stats */}
      <div className="bg-white border-b border-ink-100 px-4 sm:px-6 py-3 flex gap-4 sm:gap-6 flex-shrink-0 overflow-x-auto">
        <StatCard icon={Users} label="Total" value={stats.total} color="text-ink-700" />
        <StatCard icon={Clock} label="Novos" value={stats.novos} color="text-blue-600" />
        <StatCard icon={Clock} label="Em atendimento" value={stats.emAtendimento} color="text-gold-600" />
        <StatCard icon={CheckCircle} label="Concluídos" value={stats.concluidos} color="text-green-600" />
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Queue */}
        <div className="w-full sm:w-80 lg:w-96 bg-white border-r border-ink-100 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-ink-100 space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar protocolo, nome, WhatsApp..."
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-ink-50 border border-ink-100 text-sm focus:outline-none focus:border-rose-300"
              />
            </div>
            <div className="flex gap-1">
              {(['all', 'novo', 'em_atendimento', 'cadastro_concluido'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    filter === f
                      ? 'bg-rose-500 text-white'
                      : 'bg-ink-50 text-ink-500 hover:bg-ink-100'
                  }`}
                >
                  {f === 'all' ? 'Todos' : f === 'novo' ? 'Novos' : f === 'em_atendimento' ? 'Atendendo' : 'Concluídos'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin">
            {filteredConversations.length === 0 && (
              <div className="text-center py-12 text-ink-400 text-sm">
                Nenhuma conversa na fila.
              </div>
            )}
            {filteredConversations.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={`w-full text-left px-4 py-3 border-b border-ink-50 hover:bg-ink-50 transition-colors ${
                  selectedId === c.id ? 'bg-rose-50 border-l-4 border-l-rose-500' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-ink-900 text-sm">
                    {c.name || 'Visitante sem nome'}
                  </span>
                  {statusBadge(c.status)}
                </div>
                <div className="flex items-center justify-between text-xs text-ink-400">
                  <span>{c.protocol}</span>
                  <span>{formatTime(c.updated_at)}</span>
                </div>
                {c.whatsapp && (
                  <div className="text-xs text-ink-400 mt-0.5">{c.whatsapp}</div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col overflow-hidden hidden sm:flex">
          {!selected ? (
            <div className="flex-1 flex items-center justify-center text-ink-400">
              <div className="text-center">
                <Users className="w-12 h-12 mx-auto mb-3 text-ink-300" />
                <p>Selecione uma conversa na fila para atender</p>
              </div>
            </div>
          ) : (
            <>
              {/* Conversation header */}
              <div className="bg-white border-b border-ink-100 px-4 py-3 flex items-center justify-between flex-shrink-0">
                <div>
                  <div className="font-semibold text-ink-900">
                    {selected.name || 'Visitante sem nome'}
                  </div>
                  <div className="text-xs text-ink-400">
                    {selected.protocol}
                    {selected.age && ` • ${selected.age} anos`}
                    {selected.whatsapp && ` • ${selected.whatsapp}`}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selected.status !== 'em_atendimento' && (
                    <button
                      onClick={() => updateStatus('em_atendimento')}
                      className="px-3 py-1.5 rounded-lg bg-gold-100 text-gold-700 text-xs font-semibold hover:bg-gold-200"
                    >
                      Em atendimento
                    </button>
                  )}
                  {selected.status !== 'cadastro_concluido' && (
                    <button
                      onClick={() => updateStatus('cadastro_concluido')}
                      className="px-3 py-1.5 rounded-lg bg-green-100 text-green-700 text-xs font-semibold hover:bg-green-200"
                    >
                      Concluir
                    </button>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="chat-bg flex-1 overflow-y-auto scrollbar-thin px-3 py-4 space-y-2">
                {messages.length === 0 && (
                  <div className="text-center text-ink-400 text-sm py-8">
                    Nenhuma mensagem ainda. Envie a primeira.
                  </div>
                )}
                {messages.map((msg) => {
                  const isAdmin = msg.sender === 'admin';
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-3 py-2 shadow-sm ${
                          isAdmin ? 'bg-[#dcf8c6] rounded-tr-sm' : 'bg-white rounded-tl-sm'
                        }`}
                      >
                        <p className="text-sm text-ink-800 whitespace-pre-wrap break-words">
                          {msg.content}
                        </p>
                        <div className="text-[10px] text-ink-400 text-right mt-0.5">
                          {formatTime(msg.created_at)}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Platform toggles */}
              <div className="bg-white border-t border-ink-100 px-4 py-3 flex-shrink-0">
                <div className="text-xs font-medium text-ink-500 mb-2">
                  Liberar plataformas:
                </div>
                <div className="flex flex-wrap gap-2">
                  {PLATFORMS.map((p) => {
                    const active = platforms.includes(p.key);
                    return (
                      <button
                        key={p.key}
                        onClick={() => togglePlatform(p.key)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          active
                            ? 'bg-green-50 border-green-300 text-green-700'
                            : 'bg-ink-50 border-ink-200 text-ink-500 hover:bg-ink-100'
                        }`}
                      >
                        {active && <Check className="w-3 h-3" />}
                        <p.icon className="w-3.5 h-3.5" style={{ color: p.color }} />
                        {p.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Input */}
              <div className="bg-white border-t border-ink-100 px-3 py-3 flex items-center gap-2 flex-shrink-0">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 px-4 py-2.5 rounded-full bg-ink-50 border border-ink-200 text-sm focus:outline-none focus:border-rose-300"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || sending}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-rose-600 text-white flex items-center justify-center disabled:opacity-40 hover:scale-105 transition-transform flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Users;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <Icon className={`w-4 h-4 ${color}`} />
      <span className="text-sm text-ink-500">{label}:</span>
      <span className="text-sm font-bold text-ink-900">{value}</span>
    </div>
  );
}
