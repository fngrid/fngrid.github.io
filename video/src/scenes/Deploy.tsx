import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, mono, sans, tint} from '../theme';
import {GLYPH, Prompt, Reveal, SceneFrame, STATUS_COLOR, Status, Terminal, Tool} from '../ui';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const STAGES = [
  {label: 'request', start: 100, done: 116},
  {label: 'build', start: 116, done: 190},
  {label: 'deploy', start: 190, done: 245},
  {label: 'live', start: 245, done: 246},
];

const Timeline: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <div style={{display: 'flex', alignItems: 'center', margin: '18px 0 6px 17px'}}>
      {STAGES.map((s, i) => {
        const status: Status = f >= s.done ? (s.label === 'live' ? 'live' : 'done') : f >= s.start ? 'running' : 'idle';
        const col = STATUS_COLOR[status];
        const fill = i === 0 ? 0 : interpolate(f, [STAGES[i - 1].done - 6, STAGES[i - 1].done + 4], [0, 1], clamp);
        return (
          <React.Fragment key={s.label}>
            {i > 0 && (
              <div style={{width: 56, height: 1, background: C.lineStrong, position: 'relative'}}>
                <div style={{position: 'absolute', left: 0, top: 0, height: 1, width: `${fill * 100}%`, background: C.signal}} />
              </div>
            )}
            <div
              style={{
                height: 36,
                padding: '0 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                border: `1px solid ${status === 'idle' ? C.lineStrong : col}`,
                background: status === 'idle' ? 'transparent' : tint(col, 0.12),
                borderRadius: 4,
                color: col,
                fontSize: 18,
              }}
            >
              <span>{GLYPH[status]}</span>
              <span>{s.label}</span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export const Deploy: React.FC = () => (
  <SceneFrame
    n={1}
    eyebrow="deploy"
    title="One call to a live URL."
    sub="Your agent builds the app and deploys it. No account to make first, no dashboard to open."
  >
    <Terminal title="agent session" right="recipes" fontSize={24} lineHeight={38}>
      <Prompt text="build a recipe-sharing app and put it online" at={14} />
      <Tool at={92} doneAt={246} name="deploy_app">
        name=recipes · node 24
      </Tool>
      <Reveal at={100}>
        <Timeline />
      </Reveal>
      <Reveal at={256} style={{marginTop: 18}}>
        <span style={{color: C.signal}}>{'● live'}</span>
        <span style={{color: C.text}}>{'   https://recipes.example.com'}</span>
      </Reveal>
      <Reveal
        at={282}
        dur={8}
        style={{
          marginTop: 22,
          padding: '18px 22px',
          background: C.ink800,
          border: `1px solid ${C.lineStrong}`,
          borderRadius: 8,
        }}
      >
        <div style={{fontSize: 14, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.text3, marginBottom: 8}}>
          message_for_human
        </div>
        <div style={{fontFamily: sans, fontSize: 28, lineHeight: '38px', color: C.text}}>
          It's live for 24 hours. Add $20 of credit to keep it.
        </div>
        <div style={{color: C.flow, fontSize: 20, marginTop: 6}}>example.com/claim/k3x9</div>
      </Reveal>
      <Reveal at={352} style={{marginTop: 18, color: C.signal}}>
        {'✓ claimed   $20 credit added · 3 apps included'}
      </Reveal>
    </Terminal>
  </SceneFrame>
);

export const _unused = mono;
