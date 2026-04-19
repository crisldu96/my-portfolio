interface SectionDividerProps {
  fromColor?: string;
  toColor?: string;
  height?: number;
}

export default function SectionDivider({
  fromColor = '#080C1A',
  toColor = '#0D1530',
  height = 100,
}: SectionDividerProps) {
  return (
    <div
      style={{
        width: '100%',
        height,
        background: `linear-gradient(to bottom, ${fromColor}, ${toColor})`,
        position: 'relative',
        zIndex: 1,
      }}
    />
  );
}
