export type ConversationStatus = 'novo' | 'em_atendimento' | 'cadastro_concluido';

export type PlatformKey = 'stripchat' | 'cam4' | 'cameraprive' | 'chaturbate' | 'skyprivate';

export interface ChatMessage {
  id: string;
  sender: 'visitor' | 'admin';
  content: string;
  created_at: string;
}

export interface ConversationState {
  id: string;
  protocol: string;
  name: string | null;
  age: number | null;
  whatsapp: string | null;
  status: ConversationStatus;
  created_at: string;
  messages: ChatMessage[];
  platforms: PlatformKey[];
}

export interface AdminConversationRow {
  id: string;
  protocol: string;
  name: string | null;
  age: number | null;
  whatsapp: string | null;
  status: ConversationStatus;
  created_at: string;
  updated_at: string;
}
