import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, mono, sans, tint} from '../theme';
import {Prompt, Reveal, SceneFrame, Terminal, Tool} from '../ui';

const IssueCard: React.FC = () => {
  const f = useCurrentFrame();
  const watching = f >= 330;
  const col = watching ? C.signal : C.warn;
  return (
    <Reveal
      at={96}
      dur={8}
      style={{
        boxSizing: 'border-box',
        padding: '18px 24px',
        border: `1px solid ${col}`,
        background: tint(col, 0.08),
        borderRadius: 8,
        height: 158,
      }}
    >
      <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: mono, fontSize: 16, color: col}}>
        <span>{watching ? '● iss_41 · watching' : '▲ iss_41 · new issue'}</span>
        <span style={{color: C.text3}}>02:14 · recipes</span>
      </div>
      <div style={{fontFamily: sans, fontSize: 28, lineHeight: '36px', fontWeight: 600, color: C.text, marginTop: 10, letterSpacing: '-0.02em'}}>
        TypeError: cannot read properties of undefined (reading 'email')
      </div>
      <div style={{fontFamily: mono, fontSize: 17, color: C.text2, marginTop: 8}}>
        src/routes/signup.ts:42 · POST /signup · 12 failed requests
      </div>
    </Reveal>
  );
};

export const Operate: React.FC = () => (
  <SceneFrame
    n={2}
    eyebrow="operate"
    title="When it breaks, one issue."
    sub="The cause, the file and the line, not a log dump. Your agent fixes it, proves it on a preview, then promotes it."
  >
    <IssueCard />
    <Terminal title="agent session" right="recipes" style={{marginTop: 22}} fontSize={21} lineHeight={32}>
      <Prompt text="check on my apps" at={8} />
      <Tool at={40} doneAt={56} name="get_health">
        3 apps · 3 live · 0 open issues
      </Tool>
      <div style={{height: 12}} />
      <Prompt text="signups are failing. fix it" at={116} />
      <Tool at={146} doneAt={162} name="get_issue">
        iss_41 at src/routes/signup.ts:42
      </Tool>
      <Reveal at={176} style={{margin: '8px 0 4px 17px', fontSize: 19, lineHeight: '28px'}}>
        <div style={{color: C.error}}>{'- const email = body.user.email'}</div>
        <div style={{color: C.signal}}>{'+ const email = body.user?.email ?? body.email'}</div>
      </Reveal>
      <Tool at={212} doneAt={232} name="deploy_app">
        preview rev 8 · 0% traffic
      </Tool>
      <Tool at={246} doneAt={266} name="replay_request">
        req_7f3 returned 200
      </Tool>
      <Tool at={280} doneAt={298} name="promote_revision">
        rev 8 now takes 100%
      </Tool>
      <Reveal at={318} style={{marginTop: 8}}>
        <span style={{color: C.signal}}>{'● live'}</span>
        <span style={{color: C.text}}>{'   fix deployed, watching iss_41'}</span>
      </Reveal>
      <Reveal at={352} style={{color: C.text3, fontSize: 17}}>
        {'  rolls back on its own if errors rise · planned'}
      </Reveal>
    </Terminal>
  </SceneFrame>
);
