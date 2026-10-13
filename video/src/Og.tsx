import React from 'react';
import {C, mono, sans, tint} from './theme';
import {GridBackdrop, Mark, Wordmark} from './ui';

export const Og: React.FC = () => (
  <div style={{position: 'absolute', inset: 0, background: C.ink950}}>
    <GridBackdrop />
    <div style={{position: 'absolute', left: 64, top: 56, display: 'flex', alignItems: 'center', gap: 12}}>
      <Mark size={36} />
      <Wordmark height={36} />
    </div>
    <div style={{position: 'absolute', left: 64, top: 200, width: 900}}>
      <div style={{fontFamily: sans, fontSize: 96, lineHeight: '96px', fontWeight: 600, letterSpacing: '-0.04em', color: C.text}}>
        Your agent ships it. And fixes it.
      </div>
      <div style={{fontFamily: mono, fontSize: 24, color: C.text2, marginTop: 36}}>concept demo · tell us what you'd need</div>
    </div>
    <div
      style={{
        position: 'absolute',
        right: 64,
        bottom: 64,
        width: 64,
        height: 64,
        borderRadius: 4,
        border: `1px solid ${C.signal}`,
        background: tint(C.signal, 0.12),
      }}
    />
  </div>
);
