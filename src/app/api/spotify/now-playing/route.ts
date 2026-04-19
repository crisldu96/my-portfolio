import { NextResponse } from 'next/server';

const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing';
const RECENTLY_PLAYED_ENDPOINT = 'https://api.spotify.com/v1/me/player/recently-played?limit=1';

interface SpotifyImage {
  url: string;
  width?: number;
  height?: number;
}

interface SpotifyTrack {
  name: string;
  preview_url: string | null;
  external_urls: { spotify: string };
  artists: Array<{ name: string }>;
  album: { name: string; images: SpotifyImage[] };
}

interface NowPlayingPayload {
  isPlaying: boolean;
  title: string;
  artist: string;
  album: string;
  albumArt: string | null;
  previewUrl: string | null;
  spotifyUrl: string | null;
  isFallback: boolean;
}

const FALLBACK: NowPlayingPayload = {
  isPlaying: false,
  title: 'Cosmic Ambient',
  artist: 'Offline placeholder',
  album: 'My Portfolio',
  albumArt: null,
  previewUrl: null,
  spotifyUrl: null,
  isFallback: true,
};

const getAccessToken = async (): Promise<string | null> => {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } = process.env;
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) return null;

  const basic = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');
  const res = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: SPOTIFY_REFRESH_TOKEN,
    }),
    cache: 'no-store',
  });

  if (!res.ok) return null;
  const data = (await res.json()) as { access_token?: string };
  return data.access_token ?? null;
};

const normalize = (track: SpotifyTrack, isPlaying: boolean): NowPlayingPayload => ({
  isPlaying,
  title: track.name,
  artist: track.artists.map((a) => a.name).join(', '),
  album: track.album.name,
  albumArt: track.album.images[0]?.url ?? null,
  previewUrl: track.preview_url,
  spotifyUrl: track.external_urls.spotify,
  isFallback: false,
});

export async function GET() {
  const token = await getAccessToken();
  if (!token) return NextResponse.json(FALLBACK);

  try {
    const nowRes = await fetch(NOW_PLAYING_ENDPOINT, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

    if (nowRes.status === 200) {
      const data = (await nowRes.json()) as { is_playing: boolean; item: SpotifyTrack | null };
      if (data.item) {
        return NextResponse.json(normalize(data.item, data.is_playing), {
          headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30' },
        });
      }
    }

    const recentRes = await fetch(RECENTLY_PLAYED_ENDPOINT, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

    if (recentRes.ok) {
      const data = (await recentRes.json()) as { items: Array<{ track: SpotifyTrack }> };
      const last = data.items[0]?.track;
      if (last) {
        return NextResponse.json(normalize(last, false), {
          headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30' },
        });
      }
    }

    return NextResponse.json(FALLBACK);
  } catch {
    return NextResponse.json(FALLBACK);
  }
}
