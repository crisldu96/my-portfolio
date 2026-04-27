import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #3B82F6 0%, #7C3AED 100%)',
          borderRadius: 38,
          color: '#F0F4FF',
          fontFamily: 'sans-serif',
          fontSize: 88,
          fontWeight: 700,
          letterSpacing: 2,
        }}
      >
        CP
      </div>
    ),
    { ...size }
  );
}
