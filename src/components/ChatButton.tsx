import { MessageCircle } from 'lucide-react';

interface ChatButtonProps {
  onOpenChat: () => void;
}

export default function ChatButton({ onOpenChat }: ChatButtonProps) {
  return (
    <button
      onClick={onOpenChat}
      className="fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-glow flex items-center justify-center hover:scale-110 transition-transform"
      aria-label="Abrir chat"
    >
      <MessageCircle className="w-7 h-7" />
      <span className="absolute top-1 right-1 w-3 h-3 rounded-full bg-gold-400 border-2 border-rose-500 animate-pulse-dot" />
    </button>
  );
}
