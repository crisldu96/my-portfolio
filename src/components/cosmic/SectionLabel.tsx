import { cosmic } from '@/themes/cosmicTokens';

interface SectionLabelProps {
  number: string;
  label: string;
}

export default function SectionLabel({ number, label }: SectionLabelProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
      <div
        style={{
          width: 40,
          height: '1px',
          background: cosmic.cyan,
          opacity: 0.6,
        }}
      />
      <span
        style={{
          fontFamily: 'var(--font-jetbrains-mono), monospace',
          color: cosmic.cyan,
          fontSize: '0.8125rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          fontWeight: 500,
        }}
      >
        {number} / {label}
      </span>
    </div>
  );
}
