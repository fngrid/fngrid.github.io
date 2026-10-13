import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {Prompt, Reveal, SceneFrame, Terminal, Tool} from '../ui';
import {AppGrid, CellView, Meter} from './AppGrid';

export type AppDef = {name: string; note: string};

export const APPS: AppDef[] = [
  {name: 'recipes', note: 'deployed by agent'},
  {name: 'docs-site', note: 'deployed by agent'},
  {name: 'blog', note: 'deployed by agent'},
  {name: 'waitlist', note: 'deployed by agent'},
  {name: 'status', note: 'deployed by agent'},
  {name: 'crm-lite', note: 'deployed by agent'},
  {name: 'invoices', note: 'deployed by agent'},
  {name: 'webhook-relay', note: 'deployed by agent'},
];

// frame each new app appears (outline), when it goes live
const APPEAR = [-1, -1, -1, 52, 62, 72, 82, 92];
const LIVE_AT = [0, 0, 0, 120, 130, 142, 250, 158];
const INVOICE_FAIL = 138; // invoices fails here, env fixed, then goes live at 250

export const Scale: React.FC = () => {
  const f = useCurrentFrame();
  const cells: CellView[] = [];
  let count = 0;
  for (let i = 0; i < 12; i++) {
    if (i >= APPS.length || (APPEAR[i] >= 0 && f < APPEAR[i])) {
      cells.push({name: '', status: null, note: ''});
      continue;
    }
    count++;
    const a = APPS[i];
    let status: 'running' | 'live' | 'failed' = f >= LIVE_AT[i] ? 'live' : 'running';
    let note = status === 'live' ? a.note : 'installing dependencies';
    if (i === 6 && f >= INVOICE_FAIL && f < LIVE_AT[6]) {
      status = f >= 200 ? 'running' : 'failed';
      note = f >= 200 ? 'rebuilding' : 'missing DATABASE_URL';
    }
    const p = APPEAR[i] < 0 ? 1 : interpolate(f, [APPEAR[i], APPEAR[i] + 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    cells.push({name: a.name, status, note, opacity: p});
  }
  return (
    <SceneFrame
      n={3}
      eyebrow="scale"
      title="Spin up a bunch."
      sub="Try as many ideas as you have. Each one is an app with its own URL, and the bill is a line you can read."
    >
      <Terminal title="agent session" right="8 apps" fontSize={21} lineHeight={32}>
        <Prompt text="spin up the five apps from my backlog" at={8} />
        <Tool at={44} doneAt={160} name="deploy_app ×5">
          waitlist, status, crm-lite, invoices, webhook-relay
        </Tool>
        <Reveal at={INVOICE_FAIL}>
          <Tool at={0} failed name="deploy_app">
            invoices · missing DATABASE_URL
          </Tool>
        </Reveal>
        <Tool at={176} doneAt={196} name="set_env invoices">
          DATABASE_URL set · ····a91f
        </Tool>
      </Terminal>
      <div style={{marginTop: 22}}>
        <AppGrid cells={cells} />
      </div>
      <div style={{marginTop: 18}}>
        <Meter apps={Math.max(3, count)} />
      </div>
      <div style={{height: 0, color: C.text}} />
    </SceneFrame>
  );
};
