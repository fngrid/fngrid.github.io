import React from 'react';
import {C, mono, tint} from '../theme';
import {Chip, Status} from '../ui';

export type CellView = {
  name: string;
  /** null renders an empty slot */
  status: Status | null;
  note: string;
  /** 0..1 opacity for fade transitions */
  opacity?: number;
};

const LABEL: Record<Status, string> = {
  running: 'building',
  done: 'live',
  live: 'live',
  warn: 'warning',
  failed: 'failed',
  idle: 'idle',
};

export const AppCell: React.FC<{cell: CellView; h?: number}> = ({cell, h = 132}) => {
  const empty = cell.status === null;
  const col = empty ? C.lineStrong : cell.status === 'live' || cell.status === 'done' ? C.signal : cell.status === 'running' ? C.flow : cell.status === 'failed' ? C.error : C.warn;
  return (
    <div
      style={{
        boxSizing: 'border-box',
        height: h,
        padding: 16,
        borderRadius: 8,
        border: empty ? `1px dashed ${C.lineStrong}` : `1px solid ${col}`,
        background: empty ? 'transparent' : tint(col, cell.status === 'live' ? 0.12 : 0.06),
        opacity: cell.opacity ?? 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {empty ? null : (
        <>
          <div style={{fontFamily: mono, fontSize: 20, color: C.text}}>{cell.name}</div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start'}}>
            <Chip status={cell.status as Status} label={LABEL[cell.status as Status]} size={14} />
            <div style={{fontFamily: mono, fontSize: 14, color: cell.status === 'failed' ? C.error : C.text3}}>{cell.note}</div>
          </div>
        </>
      )}
    </div>
  );
};

export const AppGrid: React.FC<{cells: CellView[]; h?: number}> = ({cells, h}) => (
  <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16}}>
    {cells.map((c, i) => (
      <AppCell key={i} cell={c} h={h} />
    ))}
  </div>
);

export const Meter: React.FC<{apps: number}> = ({apps}) => {
  const price = 5 + apps * 0.5;
  const money = (n: number) => (Number.isInteger(n) ? `$${n}` : `$${n.toFixed(2)}`);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 64,
        padding: '0 24px',
        boxSizing: 'border-box',
        border: `1px solid ${C.line}`,
        background: C.ink900,
        borderRadius: 8,
        fontFamily: mono,
        fontSize: 20,
        color: C.text2,
      }}
    >
      <span style={{color: C.text}}>{apps} live apps</span>
      <span>{apps} × $0.50</span>
      <span>$5 base</span>
      <span style={{color: C.text}}>{money(price)}/mo + usage</span>
    </div>
  );
};
