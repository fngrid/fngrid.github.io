import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, easeInOut, mono, sans, tint} from '../theme';
import {GridBackdrop, Mark, Reveal, Wordmark} from '../ui';

export const End: React.FC = () => {
  const f = useCurrentFrame();
  const lit = interpolate(f, [16, 26], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeInOut});
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <GridBackdrop />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 36,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            boxSizing: 'border-box',
            borderRadius: 4,
            border: `1px ${lit > 0.5 ? 'solid' : 'dashed'} ${lit > 0.5 ? C.signal : C.lineStrong}`,
            background: tint(C.signal, 0.12 * lit),
          }}
        />
        <Reveal at={22} dur={8} rise={8}>
          <div style={{fontFamily: sans, fontSize: 104, lineHeight: '104px', fontWeight: 600, letterSpacing: '-0.04em', color: C.text, width: 1300}}>
            Your agent ships it. And fixes it.
          </div>
        </Reveal>
        <Reveal at={44} dur={8}>
          <div style={{fontFamily: mono, fontSize: 26, color: C.text2}}>Tell us what you'd need · fngrid.github.io</div>
        </Reveal>
        <Reveal at={60} dur={8}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14, opacity: 0.9}}>
            <Mark size={36} />
            <Wordmark height={36} />
          </div>
        </Reveal>
      </div>
    </div>
  );
};
