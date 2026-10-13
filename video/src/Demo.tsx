import React from 'react';
import {interpolate, Sequence, useCurrentFrame} from 'remotion';
import {C, easeInOut, mono} from './theme';
import {GridBackdrop, Mark, Wordmark} from './ui';
import {Deploy} from './scenes/Deploy';
import {Operate} from './scenes/Operate';
import {Scale} from './scenes/Scale';
import {Shutdown} from './scenes/Shutdown';
import {Graduate} from './scenes/Graduate';
import {End} from './scenes/End';

export const SCENES = [
  {label: 'deploy', from: 0, dur: 420, C: Deploy},
  {label: 'operate', from: 420, dur: 540, C: Operate},
  {label: 'scale', from: 960, dur: 420, C: Scale},
  {label: 'shut down', from: 1380, dur: 300, C: Shutdown},
  {label: 'graduate', from: 1680, dur: 420, C: Graduate},
];
const END_FROM = 2100;
export const TOTAL = END_FROM + 150;

const Rail: React.FC = () => {
  const f = useCurrentFrame();
  const left = 96;
  const width = 1920 - 192;
  const stops = SCENES.map((_, i) => left + (width * (i + 0.5)) / SCENES.length);
  const active = Math.max(0, SCENES.findIndex((s) => f >= s.from && f < s.from + s.dur));
  const prev = Math.max(0, active - 1);
  const t = interpolate(f, [SCENES[active].from, SCENES[active].from + 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeInOut,
  });
  const x = active === 0 ? stops[0] : stops[prev] + (stops[active] - stops[prev]) * t;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 982, height: 64}}>
      <div style={{position: 'absolute', left, width, top: 14, height: 1, background: C.lineStrong}} />
      {SCENES.map((s, i) => (
        <div key={s.label} style={{position: 'absolute', left: stops[i] - 100, width: 200, top: 0, textAlign: 'center'}}>
          <div style={{width: 8, height: 8, margin: '10px auto 0', background: i <= active ? C.text3 : C.lineStrong, borderRadius: 1}} />
          <div
            style={{
              marginTop: 14,
              fontFamily: mono,
              fontSize: 15,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: i === active ? C.text : C.text3,
            }}
          >
            {s.label}
          </div>
        </div>
      ))}
      <div style={{position: 'absolute', left: x - 9, top: 5, width: 18, height: 18, borderRadius: 3, background: C.signal}} />
    </div>
  );
};

const TopBar: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      left: 96,
      right: 96,
      top: 48,
      height: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}
  >
    <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
      <Mark size={32} />
      <Wordmark height={32} />
    </div>
    <div style={{fontFamily: mono, fontSize: 16, color: C.text3}}>concept walkthrough · simulated, nothing here is live yet</div>
  </div>
);

export const Demo: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <div style={{position: 'absolute', inset: 0, background: C.ink950}}>
      <GridBackdrop />
      {f < END_FROM ? (
        <>
          <TopBar />
          <Rail />
        </>
      ) : null}
      {SCENES.map(({label, from, dur, C: Scene}) => (
        <Sequence key={label} from={from} durationInFrames={dur} layout="none">
          <Scene />
        </Sequence>
      ))}
      <Sequence from={END_FROM} durationInFrames={TOTAL - END_FROM} layout="none">
        <End />
      </Sequence>
    </div>
  );
};
