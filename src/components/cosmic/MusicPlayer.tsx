'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { cosmic } from '@/themes/cosmicTokens';

const BAR_COUNT = 16;
const POLL_INTERVAL_MS = 60_000;
const SPOTIFY_IFRAME_API_SRC = 'https://open.spotify.com/embed/iframe-api/v1';

interface NowPlaying {
  isPlaying: boolean;
  title: string;
  artist: string;
  album: string;
  albumArt: string | null;
  previewUrl: string | null;
  spotifyUrl: string | null;
  isFallback: boolean;
}

interface SpotifyEmbedController {
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  destroy?: () => void;
  addListener?: (type: string, cb: (e: { data?: { isPaused?: boolean } }) => void) => void;
  loadUri?: (uri: string) => void;
  setVolume?: (percent: number) => void;
}

interface SpotifyIFrameAPI {
  createController: (
    el: HTMLElement,
    options: { uri?: string; width?: string | number; height?: string | number },
    cb: (ctrl: SpotifyEmbedController) => void,
  ) => void;
}

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: SpotifyIFrameAPI) => void;
    __spotifyIframeApi?: SpotifyIFrameAPI | Promise<SpotifyIFrameAPI>;
  }
}

function loadSpotifyIframeApi(): Promise<SpotifyIFrameAPI> {
  if (typeof window === 'undefined') return Promise.reject(new Error('no window'));
  if (window.__spotifyIframeApi && 'createController' in window.__spotifyIframeApi) {
    return Promise.resolve(window.__spotifyIframeApi as SpotifyIFrameAPI);
  }
  if (window.__spotifyIframeApi) return window.__spotifyIframeApi as Promise<SpotifyIFrameAPI>;

  const p = new Promise<SpotifyIFrameAPI>((resolve) => {
    window.onSpotifyIframeApiReady = (api) => {
      window.__spotifyIframeApi = api;
      resolve(api);
    };
    if (!document.querySelector(`script[src="${SPOTIFY_IFRAME_API_SRC}"]`)) {
      const s = document.createElement('script');
      s.src = SPOTIFY_IFRAME_API_SRC;
      s.async = true;
      document.body.appendChild(s);
    }
  });
  window.__spotifyIframeApi = p;
  return p;
}

function extractTrackId(url: string | null): string | null {
  if (!url) return null;
  const m = url.match(/track\/([a-zA-Z0-9]+)/);
  return m ? m[1] : null;
}

interface AmbientEngine {
  ctx: AudioContext;
  gain: GainNode;
  analyser: AnalyserNode;
}

function createAmbientSynth(): AmbientEngine {
  const ctx = new AudioContext();
  const master = ctx.createGain();
  master.gain.value = 0;

  const pad1 = ctx.createOscillator();
  pad1.type = 'sine';
  pad1.frequency.value = 220;
  const pad1Gain = ctx.createGain();
  pad1Gain.gain.value = 0.18;
  pad1.connect(pad1Gain).connect(master);
  pad1.start();

  const pad2 = ctx.createOscillator();
  pad2.type = 'sine';
  pad2.frequency.value = 329.1;
  const pad2Gain = ctx.createGain();
  pad2Gain.gain.value = 0.14;
  pad2.connect(pad2Gain).connect(master);
  pad2.start();

  const pad3 = ctx.createOscillator();
  pad3.type = 'triangle';
  pad3.frequency.value = 440;
  const pad3Gain = ctx.createGain();
  pad3Gain.gain.value = 0.08;
  pad3.connect(pad3Gain).connect(master);
  pad3.start();

  const shimmer = ctx.createOscillator();
  shimmer.type = 'sine';
  shimmer.frequency.value = 880;
  const shimmerGain = ctx.createGain();
  shimmerGain.gain.value = 0.05;
  shimmer.connect(shimmerGain).connect(master);
  shimmer.start();

  const lfo = ctx.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 0.1;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 60;
  lfo.connect(lfoGain).connect(shimmer.frequency);
  lfo.start();

  const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;
  noise.loop = true;
  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = 'bandpass';
  noiseFilter.frequency.value = 1500;
  const noiseGain = ctx.createGain();
  noiseGain.gain.value = 0.04;
  noise.connect(noiseFilter).connect(noiseGain).connect(master);
  noise.start();

  const analyser = ctx.createAnalyser();
  analyser.fftSize = 64;
  master.connect(analyser);
  analyser.connect(ctx.destination);

  return { ctx, gain: master, analyser };
}

function disposeAmbient(e: AmbientEngine) {
  e.ctx.close().catch(() => null);
}

const MusicPlayer = () => {
  const ambientRef = useRef<AmbientEngine | null>(null);
  const embedHostRef = useRef<HTMLDivElement | null>(null);
  const embedCtrlRef = useRef<SpotifyEmbedController | null>(null);
  const animFrameRef = useRef<number>(0);

  const [track, setTrack] = useState<NowPlaying | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [bars, setBars] = useState<number[]>(new Array(BAR_COUNT).fill(0));
  const [showBars, setShowBars] = useState(true);
  const [embedReady, setEmbedReady] = useState(false);
  const [sway, setSway] = useState(0);

  const trackId = extractTrackId(track?.spotifyUrl ?? null);
  const hasRealTrack = Boolean(track && !track.isFallback);
  const canUseSpotify = hasRealTrack && Boolean(trackId);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch('/api/spotify/now-playing');
        if (!res.ok) return;
        const data = (await res.json()) as NowPlaying;
        if (!cancelled) setTrack(data);
      } catch {
        // keep previous state
      }
    };
    load();
    const id = setInterval(load, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      if (ambientRef.current) {
        disposeAmbient(ambientRef.current);
        ambientRef.current = null;
      }
      if (embedCtrlRef.current?.destroy) {
        embedCtrlRef.current.destroy();
        embedCtrlRef.current = null;
      }
    };
  }, []);

  const ensureSpotifyEmbed = useCallback(async () => {
    if (!canUseSpotify || !trackId || !embedHostRef.current) return null;
    if (embedCtrlRef.current) return embedCtrlRef.current;
    try {
      const api = await loadSpotifyIframeApi();
      return await new Promise<SpotifyEmbedController | null>((resolve) => {
        if (!embedHostRef.current) return resolve(null);
        api.createController(
          embedHostRef.current,
          { uri: `spotify:track:${trackId}`, width: '100%', height: 80 },
          (ctrl) => {
            embedCtrlRef.current = ctrl;
            ctrl.addListener?.('playback_update', (e) => {
              if (e?.data && typeof e.data.isPaused === 'boolean') {
                setIsPlaying(!e.data.isPaused);
              }
            });
            ctrl.addListener?.('ready', () => setEmbedReady(true));
            resolve(ctrl);
          },
        );
      });
    } catch {
      return null;
    }
  }, [canUseSpotify, trackId]);

  // Eagerly mount Spotify controller as soon as we have a track,
  // so the play button is responsive on first click.
  useEffect(() => {
    if (!canUseSpotify || !trackId) return;
    if (!embedCtrlRef.current) {
      ensureSpotifyEmbed();
    } else if (embedCtrlRef.current.loadUri) {
      embedCtrlRef.current.loadUri(`spotify:track:${trackId}`);
    }
  }, [canUseSpotify, trackId, ensureSpotifyEmbed]);

  const updateBars = useCallback(() => {
    const e = ambientRef.current;
    if (!e) return;
    const dataArray = new Uint8Array(e.analyser.frequencyBinCount);
    e.analyser.getByteFrequencyData(dataArray);
    const next: number[] = [];
    let avg = 0;
    for (let i = 0; i < BAR_COUNT; i++) {
      const idx = Math.floor((i / BAR_COUNT) * dataArray.length);
      const val = dataArray[idx] / 255;
      next.push(val);
      avg += val;
    }
    avg /= BAR_COUNT;
    setBars(next);
    setSway(Math.sin(Date.now() / 600) * avg * 3);
    animFrameRef.current = requestAnimationFrame(updateBars);
  }, []);

  useEffect(() => {
    if (isPlaying && !canUseSpotify) {
      updateBars();
    } else {
      cancelAnimationFrame(animFrameRef.current);
      setBars(new Array(BAR_COUNT).fill(0));
      setSway(0);
    }
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isPlaying, canUseSpotify, updateBars]);

  const togglePlay = useCallback(async () => {
    if (canUseSpotify) {
      const ctrl = embedCtrlRef.current ?? (await ensureSpotifyEmbed());
      if (!ctrl) return;
      ctrl.togglePlay();
      return;
    }

    if (isPlaying) {
      const e = ambientRef.current;
      if (e) {
        e.gain.gain.linearRampToValueAtTime(0, e.ctx.currentTime + 0.5);
        setTimeout(() => e.ctx.suspend(), 550);
      }
      setIsPlaying(false);
    } else {
      if (!ambientRef.current) ambientRef.current = createAmbientSynth();
      const e = ambientRef.current;
      e.ctx.resume().then(() => {
        e.gain.gain.linearRampToValueAtTime(volume, e.ctx.currentTime + 1);
      });
      setIsPlaying(true);
    }
  }, [canUseSpotify, ensureSpotifyEmbed, isPlaying, volume]);

  const handleVolume = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = parseFloat(e.target.value);
      setVolume(val);
      if (canUseSpotify) {
        embedCtrlRef.current?.setVolume?.(Math.round(val * 100));
        return;
      }
      const engine = ambientRef.current;
      if (engine && isPlaying) {
        engine.gain.gain.linearRampToValueAtTime(val, engine.ctx.currentTime + 0.1);
      }
    },
    [isPlaying, canUseSpotify],
  );

  // Apply stored volume to Spotify embed when it becomes ready
  useEffect(() => {
    if (canUseSpotify && embedReady) {
      embedCtrlRef.current?.setVolume?.(Math.round(volume * 100));
    }
  }, [canUseSpotify, embedReady, volume]);

  const label = !hasRealTrack
    ? 'AMBIENT'
    : track!.isPlaying
      ? 'NOW PLAYING'
      : 'LAST PLAYED';
  const title = hasRealTrack ? track!.title : 'Cosmic Drift';
  const artist = hasRealTrack ? track!.artist : null;
  const albumArt = hasRealTrack ? track!.albumArt : null;
  const titleHref = hasRealTrack ? track!.spotifyUrl : null;
  const titleTooltip = hasRealTrack ? `${track!.title} — ${track!.artist}` : undefined;

  return (
    <div
      className={`music-player-v2 ${isPlaying ? 'mp-playing' : ''}`}
      style={{ transform: isPlaying && !canUseSpotify ? `translateX(${sway}px)` : undefined }}
    >
      {!canUseSpotify && (
        <div className={`mp-visualizer ${showBars ? '' : 'mp-visualizer--hidden'}`}>
          {bars.map((h, i) => (
            <div
              key={i}
              className="mp-bar"
              style={{
                height: isPlaying ? `${Math.max(3, h * 32)}px` : '3px',
                opacity: isPlaying ? 0.4 + h * 0.6 : 0.2,
                background: `linear-gradient(to top, ${cosmic.cyan}, ${cosmic.blue})`,
              }}
            />
          ))}
        </div>
      )}

      <div className="mp-controls">
        {albumArt && <img src={albumArt} alt="" className="mp-album-art" />}

        <button
          className={`mp-play-btn ${isPlaying ? 'mp-play-btn--active' : ''}`}
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
        >
          {isPlaying ? (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="3" y="2" width="4" height="14" rx="1.5" fill={cosmic.cyan} />
              <rect x="11" y="2" width="4" height="14" rx="1.5" fill={cosmic.cyan} />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 2.5v13l11.5-6.5L4 2.5z" fill={cosmic.cyan} />
            </svg>
          )}
        </button>

        <div className="mp-info">
          <span className="mp-label">{label}</span>
          {titleHref ? (
            <a
              className="mp-title mp-title--link"
              href={titleHref}
              target="_blank"
              rel="noopener noreferrer"
              title={titleTooltip}
            >
              {title}
            </a>
          ) : (
            <span className="mp-title" title={titleTooltip}>
              {title}
            </span>
          )}
          {artist && <span className="mp-artist">{artist}</span>}
        </div>

        {!canUseSpotify && (
          <button
            className="mp-toggle-bars"
            onClick={() => setShowBars((prev) => !prev)}
            aria-label={showBars ? 'Hide visualizer' : 'Show visualizer'}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="6" width="2" height="4" rx="1" fill={showBars ? cosmic.cyan : cosmic.textSecondary} />
              <rect x="5" y="3" width="2" height="10" rx="1" fill={showBars ? cosmic.cyan : cosmic.textSecondary} />
              <rect x="9" y="5" width="2" height="6" rx="1" fill={showBars ? cosmic.cyan : cosmic.textSecondary} />
              <rect x="13" y="4" width="2" height="8" rx="1" fill={showBars ? cosmic.cyan : cosmic.textSecondary} />
            </svg>
          </button>
        )}

        <div className="mp-volume-group">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="mp-volume-icon">
            <path
              d="M11 5L6 9H2v6h4l5 4V5z"
              stroke={cosmic.textSecondary}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {volume > 0 && (
              <path
                d="M15.54 8.46a5 5 0 010 7.07"
                stroke={cosmic.textSecondary}
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          </svg>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolume}
            className="mp-volume"
            aria-label="Volume"
          />
        </div>
      </div>

      {canUseSpotify && (
        <div
          ref={embedHostRef}
          className="mp-spotify-embed"
          aria-hidden="true"
          style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none', overflow: 'hidden' }}
        />
      )}
    </div>
  );
};

export default MusicPlayer;
