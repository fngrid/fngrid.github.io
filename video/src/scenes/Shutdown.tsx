import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, mono, sans} from '../theme';
import {Prompt, Reveal, SceneFrame, Terminal, Tool} from '../ui';
import {APPS} from './Scale';
import {AppGrid, CellView, Meter} from './AppGrid';

const KEEP = new Set(['recipes', 'docs-site', 'blog']);
const APPROVE_AT = 112;
const DELETE_START = 124;

const Approval: React.FC = () => {
  const f = useCurrentFrame();
  const approved = f >= APPROVE_AT;
  const pressed = f >= APPROVE_AT - 6 && f < APPROVE_AT;
  return (
    <Reveal
      at={66}
      dur={8}
      style={{
        boxSizing: 'border-box',
        marginTop: 20,
        padding: '18px 24px',
        background: C.ink800,
        border: `1px solid ${C.lineStrong}`,
        borderRadius: 8,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 24,
      }}
    >
      <div>
        <div style={{fontFamily: mono, fontSize: 14, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.warn}}>
          {'▲ needs your approval'}
        </div>
        <div style={{fontFamily: mono, fontSize: 21, color: C.text, marginTop: 6}}>delete_app × 5</div>
        <div style={{fontFamily: sans, fontSize: 18, color: C.text2, marginTop: 4}}>
          waitlist, status, crm-lite, invoices, webhook-relay · saves $2.50/mo
        </div>
      </div>
      {approved ? (
        <div style={{fontFamily: mono, fontSize: 18, color: C.signal}}>{'✓ approved'}</div>
      ) : (
        <div style={{display: 'flex', gap: 12}}>
          <div
            style={{
              height: 40,
              padding: '0 20px',
              display: 'flex',
              alignItems: 'center',
              borderRadius: 8,
              background: C.signal,
              color: C.ink950,
              fontFamily: sans,
              fontWeight: 500,
              fontSize: 18,
              filter: pressed ? 'brightness(0.85)' : 'none',
            }}
          >
            approve
          </div>
          <div
            style={{
              height: 40,
              padding: '0 20px',
              display: 'flex',
              alignItems: 'center',
              borderRadius: 8,
              border: `1px solid ${C.lineStrong}`,
              color: C.text,
              fontFamily: sans,
              fontWeight: 500,
              fontSize: 18,
            }}
          >
            deny
          </div>
        </div>
      )}
    </Reveal>
  );
};

export const Shutdown: React.FC = () => {
  const f = useCurrentFrame();
  const cells: CellView[] = [];
  let remaining = 0;
  let order = 0;
  for (let i = 0; i < 12; i++) {
    if (i >= APPS.length) {
      cells.push({name: '', status: null, note: ''});
      continue;
    }
    const a = APPS[i];
    if (KEEP.has(a.name)) {
      remaining++;
      cells.push({name: a.name, status: 'live', note: a.note});
      continue;
    }
    const at = DELETE_START + order * 8;
    order++;
    const p = interpolate(f, [at, at + 8], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    if (p <= 0) {
      cells.push({name: '', status: null, note: ''});
    } else {
      remaining++;
      cells.push({name: a.name, status: 'live', note: a.note, opacity: p});
    }
  }
  const apps = remaining;
  return (
    <SceneFrame
      n={4}
      eyebrow="shut down"
      title="Gone in one approval."
      sub="Keep what matters, delete the rest. Your agent asks first, and the bill follows."
    >
      <Terminal title="agent session" right="8 apps" fontSize={21} lineHeight={32}>
        <Prompt text="keep recipes, docs-site and blog. shut the rest down" at={8} />
        <Tool at={52} doneAt={66} name="list_apps">
          8 apps · 5 not in your keep list
        </Tool>
        <Tool at={DELETE_START} doneAt={DELETE_START + 52} name="delete_app ×5">
          {f >= DELETE_START + 52 ? 'removed' : 'removing'}
        </Tool>
      </Terminal>
      <Approval />
      <div style={{marginTop: 20}}>
        <AppGrid cells={cells} h={100} />
      </div>
      <div style={{marginTop: 18}}>
        <Meter apps={apps} />
      </div>
    </SceneFrame>
  );
};
