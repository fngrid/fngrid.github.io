import React from 'react';
import {Composition} from 'remotion';
import {Demo, TOTAL} from './Demo';
import {Og} from './Og';
import {FPS} from './theme';

export const Root: React.FC = () => (
  <>
    <Composition id="Demo" component={Demo} durationInFrames={TOTAL} fps={FPS} width={1920} height={1080} />
    <Composition id="OG" component={Og} durationInFrames={1} fps={FPS} width={1200} height={630} />
  </>
);
