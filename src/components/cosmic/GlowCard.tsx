import { cosmic } from '@/themes/cosmicTokens';

interface GlowCardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  gradient?: boolean;
}

export default function GlowCard({ children, style, gradient = false }: GlowCardProps) {
  if (gradient) {
    return (
      <div
        style={{
          position: 'relative',
          borderRadius: '20px',
          padding: '1px',
          background: cosmic.gradientBorder,
        }}
      >
        <div className="glow-card glow-card--gradient" style={style}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="glow-card" style={style}>
      {children}
    </div>
  );
}
