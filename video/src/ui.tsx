import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, easeOut, mono, sans, tint} from './theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export type Status = 'running' | 'done' | 'live' | 'warn' | 'failed' | 'idle';

export const GLYPH: Record<Status, string> = {
  running: '◌',
  done: '✓',
  live: '●',
  warn: '▲',
  failed: '✗',
  idle: '○',
};

export const STATUS_COLOR: Record<Status, string> = {
  running: C.flow,
  done: C.signal,
  live: C.signal,
  warn: C.warn,
  failed: C.error,
  idle: C.text3,
};

/** Fades in over 4 frames (about 120 ms) with a 4 px rise. Renders nothing before `at`. */
export const Reveal: React.FC<{
  at: number;
  dur?: number;
  rise?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({at, dur = 4, rise = 4, style, children}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const p = interpolate(f, [at, at + dur], [0, 1], {...clamp, easing: easeOut});
  return <div style={{opacity: p, transform: `translateY(${(1 - p) * rise}px)`, ...style}}>{children}</div>;
};

export const Blink: React.FC<{color?: string}> = ({color = C.text}) => {
  const f = useCurrentFrame();
  return (
    <span
      style={{
        display: 'inline-block',
        width: '0.6em',
        height: '1.05em',
        marginLeft: 2,
        verticalAlign: 'text-bottom',
        background: color,
        opacity: Math.floor(f / 15) % 2 === 0 ? 0.9 : 0,
      }}
    />
  );
};

export const Typed: React.FC<{text: string; at: number; cps?: number; cursor?: boolean}> = ({
  text,
  at,
  cps = 28,
  cursor = false,
}) => {
  const f = useCurrentFrame();
  const n = Math.max(0, Math.min(text.length, Math.floor(((f - at) * cps) / 30)));
  const typing = n < text.length;
  return (
    <>
      {text.slice(0, n)}
      {cursor && (typing || f - at < 200) ? <Blink /> : null}
    </>
  );
};

/** Duration in frames that Typed needs for `text`. */
export const typedFrames = (text: string, cps = 28) => Math.ceil((text.length * 30) / cps);

export const Prompt: React.FC<{text: string; at: number; cps?: number; glyph?: string}> = ({
  text,
  at,
  cps,
  glyph = '>',
}) => (
  <Reveal at={at} style={{color: C.text}}>
    <span style={{color: C.text3}}>{glyph} </span>
    <Typed text={text} at={at} cps={cps} cursor />
  </Reveal>
);

/** One agent tool call: glyph, tool name in a fixed column, short argument summary. */
export const Tool: React.FC<{
  at: number;
  doneAt?: number;
  name: string;
  nameWidth?: number;
  failed?: boolean;
  children?: React.ReactNode;
  gap?: number;
}> = ({at, doneAt, name, nameWidth = 230, failed = false, children, gap = 4}) => {
  const f = useCurrentFrame();
  const status: Status = failed ? 'failed' : doneAt !== undefined && f >= doneAt ? 'done' : 'running';
  return (
    <Reveal
      at={at}
      style={{
        display: 'flex',
        gap: 14,
        paddingLeft: 14,
        marginTop: gap,
        borderLeft: `3px solid ${C.flow}`,
      }}
    >
      <span style={{color: STATUS_COLOR[status], width: 20, flex: 'none'}}>{GLYPH[status]}</span>
      <span style={{color: C.text, width: nameWidth, flex: 'none'}}>{name}</span>
      <span style={{color: failed ? C.error : C.text2}}>{children}</span>
    </Reveal>
  );
};

export const Terminal: React.FC<{
  title: string;
  right?: string;
  fontSize?: number;
  lineHeight?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({title, right, fontSize = 22, lineHeight = 34, style, children}) => (
  <div
    style={{
      background: C.ink900,
      border: `1px solid ${C.lineStrong}`,
      borderRadius: 12,
      overflow: 'hidden',
      boxShadow: `0 0 160px ${tint(C.signal, 0.05)}`,
      ...style,
    }}
  >
    <div
      style={{
        height: 48,
        boxSizing: 'border-box',
        padding: '0 24px',
        borderBottom: `1px solid ${C.line}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontFamily: mono,
        fontSize: 16,
        color: C.text3,
      }}
    >
      <span>{title}</span>
      <span>{right}</span>
    </div>
    <div style={{padding: '24px 28px', fontFamily: mono, fontSize, lineHeight: `${lineHeight}px`, color: C.text2}}>
      {children}
    </div>
  </div>
);

export const Chip: React.FC<{status: Status; label: string; size?: number}> = ({status, label, size = 16}) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      height: size * 1.9,
      padding: `0 ${size * 0.7}px`,
      boxSizing: 'border-box',
      border: `1px solid ${STATUS_COLOR[status]}`,
      background: tint(STATUS_COLOR[status], 0.12),
      borderRadius: 4,
      fontFamily: mono,
      fontSize: size,
      color: STATUS_COLOR[status],
      whiteSpace: 'nowrap',
    }}
  >
    <span>{GLYPH[status]}</span>
    <span>{label}</span>
  </span>
);

export const Mark: React.FC<{size?: number; lit?: boolean}> = ({size = 36, lit = true}) => {
  const cells = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const on = lit && r === 2 && c === 2;
      cells.push(<rect key={`${r}${c}`} x={c * 30} y={r * 30} width={20} height={20} rx={4} fill={on ? C.signal : '#3A4250'} />);
    }
  }
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-hidden="true">
      {cells}
    </svg>
  );
};

export const Wordmark: React.FC<{height?: number}> = ({height = 36}) => (
  <svg width={(height * 348) / 100} height={height} viewBox="0 0 348 100" role="img" aria-label="fngrid">
    <text x="0" y="78" fontFamily={mono} fontWeight={500} fontSize={100} letterSpacing={-2} fill={C.text}>
      {'fngrıd'}
    </text>
    <rect x="254.5" y="6" width="15" height="15" rx="3" fill={C.signal} />
  </svg>
);

/** 64 px grid, 1 px lines at 60%, fading to nothing at the edges. */
export const GridBackdrop: React.FC<{glow?: boolean}> = ({glow = true}) => (
  <div style={{position: 'absolute', inset: 0, background: C.ink950}}>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.6,
        backgroundImage: `linear-gradient(${C.line} 1px, transparent 1px), linear-gradient(90deg, ${C.line} 1px, transparent 1px)`,
        backgroundSize: '64px 64px',
        backgroundPosition: '0 0',
        WebkitMaskImage: 'radial-gradient(ellipse at 50% 45%, #000 20%, transparent 78%)',
        maskImage: 'radial-gradient(ellipse at 50% 45%, #000 20%, transparent 78%)',
      }}
    />
    {glow ? (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at 72% 50%, ${tint(C.signal, 0.04)} 0%, transparent 55%)`,
        }}
      />
    ) : null}
  </div>
);

/** Left caption column plus right content area. */
export const SceneFrame: React.FC<{
  n: number;
  eyebrow: string;
  title: string;
  sub: string;
  children: React.ReactNode;
}> = ({n, eyebrow, title, sub, children}) => (
  <div style={{position: 'absolute', inset: 0}}>
    <Reveal at={0} dur={8} rise={8} style={{position: 'absolute', left: 96, top: 230, width: 600}}>
      <div
        style={{
          fontFamily: mono,
          fontSize: 16,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: C.text3,
          marginBottom: 20,
        }}
      >
        {String(n).padStart(2, '0')} / {eyebrow}
      </div>
      <div style={{fontFamily: sans, fontSize: 64, lineHeight: '68px', fontWeight: 600, letterSpacing: '-0.04em', color: C.text}}>
        {title}
      </div>
      <div style={{fontFamily: sans, fontSize: 26, lineHeight: '38px', color: C.text2, marginTop: 24}}>{sub}</div>
    </Reveal>
    <div style={{position: 'absolute', left: 760, top: 128, width: 1064, height: 800}}>{children}</div>
  </div>
);
