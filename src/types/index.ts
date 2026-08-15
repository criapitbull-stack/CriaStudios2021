export type ConversationStatus = 'novo' | 'em_atendimento' | 'cadastro_concluido';

export type PlatformKey = 'platform1' | 'platform2' | 'platform3' | 'platform4' | 'platform5';

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
