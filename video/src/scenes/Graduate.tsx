import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, sans} from '../theme';
import {Chip, Prompt, Reveal, SceneFrame, Terminal, Tool, Typed} from '../ui';

const SWAP = 150;

const Domain: React.FC = () => (
  <>
    <Prompt text="put it on app.example.org" at={8} />
    <Tool at={40} doneAt={56} name="domain_add">
      app.example.org
    </Tool>
    <Reveal at={62} style={{margin: '10px 0 6px 17px', color: C.text2}}>
      <div>Create one DNS record:</div>
      <div style={{color: C.text}}>{'CNAME   app   →   recipes.example.com'}</div>
    </Reveal>
    <Tool at={84} doneAt={136} name="domain_status" gap={10}>
      <span style={{display: 'inline-flex', gap: 10}}>
        <Reveal at={84}>
          <Chip status={useCurrentFrame() >= 104 ? 'done' : 'running'} label="dns_pending" size={15} />
        </Reveal>
        <Reveal at={104}>
          <Chip status={useCurrentFrame() >= 124 ? 'done' : 'running'} label="cert_issuing" size={15} />
        </Reveal>
        <Reveal at={124}>
          <Chip status={useCurrentFrame() >= 136 ? 'live' : 'running'} label="live" size={15} />
        </Reveal>
      </span>
    </Tool>
    <Reveal at={138} style={{marginTop: 12}}>
      <span style={{color: C.signal}}>{'● live'}</span>
      <span style={{color: C.text}}>{'   https://app.example.org'}</span>
    </Reveal>
    <Reveal at={142} style={{color: C.text3, fontSize: 17}}>
      {'  custom domains: planned'}
    </Reveal>
  </>
);

const TREE = [
  ['recipes/', ''],
  ['├─ src/', 'your code'],
  ['├─ public/', 'your files'],
  ['├─ Dockerfile', 'generated'],
  ['├─ fngrid.json', 'port, cron schedules'],
  ['├─ env.example', 'key names only, no values'],
  ['└─ EXPORT.md', 'what each fngrid piece maps to'],
];

const Export: React.FC = () => {
  const f = useCurrentFrame();
  const t = f - SWAP;
  return (
    <>
      <Prompt text="export it. i want to run it myself" at={SWAP + 6} />
      <Tool at={SWAP + 40} doneAt={SWAP + 70} name="export_app">
        {t >= 70 ? 'approved' : 'waiting for approval'}
      </Tool>
      <Reveal at={SWAP + 72} style={{marginLeft: 17, color: C.signal}}>
        {'✓ recipes-export.zip'}
      </Reveal>
      <div style={{margin: '8px 0 0 17px', fontSize: 19, lineHeight: '29px'}}>
        {TREE.map(([a, b], i) => (
          <Reveal key={a} at={SWAP + 86 + i * 7} style={{display: 'flex'}}>
            <span style={{width: 230, color: C.text}}>{a}</span>
            <span style={{color: C.text3}}>{b}</span>
          </Reveal>
        ))}
      </div>
      <Reveal at={SWAP + 148} style={{marginTop: 14, color: C.text}}>
        <span style={{color: C.text3}}>$ </span>
        <Typed text="docker build -t recipes . && docker run -p 3000:3000 recipes" at={SWAP + 148} cps={44} />
      </Reveal>
      <Reveal at={SWAP + 214} style={{marginTop: 4}}>
        <span style={{color: C.signal}}>{'● listening'}</span>
        <span style={{color: C.text}}>{'   http://localhost:3000'}</span>
      </Reveal>
      <Reveal at={SWAP + 236} style={{color: C.text3, fontSize: 17, marginTop: 4}}>
        {'  your database stays with your provider'}
      </Reveal>
    </>
  );
};

export const Graduate: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <SceneFrame
      n={5}
      eyebrow="graduate"
      title="Grow it, or take it with you."
      sub="Point your own domain at it. Or export one zip with the source, the files and a Dockerfile, and leave any time."
    >
      <Terminal
        title="agent session"
        right="recipes"
        fontSize={22}
        lineHeight={34}
        style={{minHeight: 560}}
      >
        {f < SWAP ? <Domain /> : <Export />}
      </Terminal>
      <div style={{height: 0, fontFamily: sans}} />
    </SceneFrame>
  );
};
