import { useEffect, useState } from 'react';
import { ROTATING_CTAS } from '@/data/content';

interface RotatingCtaProps {
  icon?: typeof import('lucide-react').MessageCircle;
  className?: string;
  onClick: () => void;
  iconClass?: string;
}

export default function RotatingCta({
  icon: Icon,
  className = '',
  onClick,
  iconClass = 'w-5 h-5',
}: RotatingCtaProps) {
  const [index, setIndex] = useState(() =>
    Math.floor(Math.random() * ROTATING_CTAS.length)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ROTATING_CTAS.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <button onClick={onClick} className={className}>
      {Icon && <Icon className={iconClass} />}
      <span key={index} className="animate-fade-in-up">
        {ROTATING_CTAS[index]}
      </span>
    </button>
  );
}
