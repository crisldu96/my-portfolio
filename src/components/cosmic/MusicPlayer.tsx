'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { cosmic } from '@/themes/cosmicTokens';

const BAR_COUNT = 16;
const POLL_INTERVAL_MS = 60_000;

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

interface AmbientEngine {
  kind: 'ambient';
  ctx: AudioContext;
  gain: GainNode;
  analyser: AnalyserNode;
}

interface PreviewEngine {
  kind: 'preview';
  ctx: AudioContext;
  gain: GainNode;
  analyser: AnalyserNode;
  audio: HTMLAudioElement;
}

type Engine = AmbientEngine | PreviewEngine;

function createAmbientSynth(): AmbientEngine {
  const ctx = new AudioContext();
  const master = ctx.createGain();
  master.gain.value = 0;

  const pad1 = ctx.createOscillator();
  pad1.type = 'sine';
  pad1.frequency.value = 55;
  const pad1Gain = ctx.createGain();
  pad1Gain.gain.value = 0.3;
  pad1.connect(pad1Gain).connect(master);
  pad1.start();

  const pad2 = ctx.createOscillator();
  pad2.type = 'sine';
  pad2.frequency.value = 82.41;
  const pad2Gain = ctx.createGain();
  pad2Gain.gain.value = 0.2;
  pad2.connect(pad2Gain).connect(master);
  pad2.start();

  const shimmer = ctx.createOscillator();
  shimmer.type = 'sine';
  shimmer.frequency.value = 440;
  const shimmerGain = ctx.createGain();
  shimmerGain.gain.value = 0.03;
  shimmer.connect(shimmerGain).connect(master);
  shimmer.start();

  const lfo = ctx.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 0.08;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 30;
  lfo.connect(lfoGain).connect(shimmer.frequency);
  lfo.start();

  const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;
  noise.loop = true;
  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = 'lowpass';
  noiseFilter.frequency.value = 200;
  const noiseGain = ctx.createGain();
  noiseGain.gain.value = 0.06;
  noise.connect(noiseFilter).connect(noiseGain).connect(master);
  noise.start();

  const analyser = ctx.createAnalyser();
  analyser.fftSize = 64;
  master.connect(analyser);
  analyser.connect(ctx.destination);

  return { kind: 'ambient', ctx, gain: master, analyser };
}

function createPreviewEngine(previewUrl: string): PreviewEngine {
  const ctx = new AudioContext();
  const audio = new Audio(previewUrl);
  audio.crossOrigin = 'anonymous';
  audio.loop = true;

  const source = ctx.createMediaElementSource(audio);
  const master = ctx.createGain();
  master.gain.value = 0;
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 64;

  source.connect(master);
  master.connect(analyser);
  analyser.connect(ctx.destination);

  return { kind: 'preview', ctx, gain: master, analyser, audio };
}

function disposeEngine(e: Engine) {
  if (e.kind === 'preview') {
    e.audio.pause();
    e.audio.src = '';
  }
  e.ctx.close().catch(() => null);
}

const MusicPlayer = () => {
  const engineRef = useRef<Engine | null>(null);
  const animFrameRef = useRef<number>(0);
  const hasAutoPlayed = useRef(false);
  const trackRef = useRef<NowPlaying | null>(null);

  const [track, setTrack] = useState<NowPlaying | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [bars, setBars] = useState<number[]>(new Array(BAR_COUNT).fill(0));
  const [showBars, setShowBars] = useState(true);
  const [sway, setSway] = useState(0);

  useEffect(() => {
    trackRef.current = track;
  }, [track]);

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
      if (engineRef.current) {
        disposeEngine(engineRef.current);
        engineRef.current = null;
      }
    };
  }, []);

  const buildEngine = useCallback((): Engine => {
    const preview = trackRef.current?.previewUrl;
    return preview ? createPreviewEngine(preview) : createAmbientSynth();
  }, []);

  // Autoplay on first user interaction
  useEffect(() => {
    if (hasAutoPlayed.current) return;

    const startAudio = () => {
      if (hasAutoPlayed.current) return;
      hasAutoPlayed.current = true;

      const engine = buildEngine();
      engineRef.current = engine;
      engine.ctx.resume().then(() => {
        if (engine.kind === 'preview') engine.audio.play().catch(() => null);
        engine.gain.gain.linearRampToValueAtTime(0.4, engine.ctx.currentTime + 2);
        setIsPlaying(true);
      });

      window.removeEventListener('click', startAudio);
      window.removeEventListener('scroll', startAudio);
      window.removeEventListener('keydown', startAudio);
      window.removeEventListener('touchstart', startAudio);
    };

    window.addEventListener('click', startAudio, { once: true });
    window.addEventListener('scroll', startAudio, { once: true });
    window.addEventListener('keydown', startAudio, { once: true });
    window.addEventListener('touchstart', startAudio, { once: true });

    return () => {
      window.removeEventListener('click', startAudio);
      window.removeEventListener('scroll', startAudio);
      window.removeEventListener('keydown', startAudio);
      window.removeEventListener('touchstart', startAudio);
    };
  }, [buildEngine]);

  // Visualizer + sway update loop
  const updateBars = useCallback(() => {
    const e = engineRef.current;
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

  // Start/stop visualizer when play state changes
  useEffect(() => {
    if (isPlaying) {
      updateBars();
    } else {
      cancelAnimationFrame(animFrameRef.current);
      setBars(new Array(BAR_COUNT).fill(0));
      setSway(0);
    }
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isPlaying, updateBars]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      const e = engineRef.current;
      if (e) {
        e.gain.gain.linearRampToValueAtTime(0, e.ctx.currentTime + 0.5);
        setTimeout(() => {
          if (e.kind === 'preview') e.audio.pause();
          e.ctx.suspend();
        }, 550);
      }
      setIsPlaying(false);
    } else {
      if (!engineRef.current) {
        engineRef.current = buildEngine();
      }
      const e = engineRef.current;
      e.ctx.resume().then(() => {
        if (e.kind === 'preview') e.audio.play().catch(() => null);
        e.gain.gain.linearRampToValueAtTime(volume, e.ctx.currentTime + 1);
      });
      setIsPlaying(true);
    }
  }, [isPlaying, volume, buildEngine]);

  const handleVolume = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = parseFloat(e.target.value);
      setVolume(val);
      const engine = engineRef.current;
      if (engine && isPlaying) {
        engine.gain.gain.linearRampToValueAtTime(val, engine.ctx.currentTime + 0.1);
      }
    },
    [isPlaying],
  );

  const hasTrack = Boolean(track && !track.isFallback);
  const label = !hasTrack
    ? 'AMBIENT'
    : track!.isPlaying
      ? 'NOW PLAYING'
      : 'LAST PLAYED';
  const title = hasTrack ? track!.title : 'Cosmic Drift';
  const titleHref = hasTrack ? track!.spotifyUrl : null;
  const titleTooltip = hasTrack ? `${track!.title} — ${track!.artist}` : undefined;

  return (
    <div
      className={`music-player-v2 ${isPlaying ? 'mp-playing' : ''}`}
      style={{ transform: isPlaying ? `translateX(${sway}px)` : undefined }}
    >
      {/* Collapsible visualizer */}
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

      <div className="mp-controls">
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
        </div>

        {/* Toggle visualizer button */}
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
    </div>
  );
};

export default MusicPlayer;
