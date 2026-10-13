import {loadFont as loadGeist} from '@remotion/google-fonts/Geist';
import {loadFont as loadGeistMono} from '@remotion/google-fonts/GeistMono';
import {Easing} from 'remotion';

const geist = loadGeist('normal', {weights: ['400', '500', '600'], subsets: ['latin']});
const geistMono = loadGeistMono('normal', {weights: ['400', '500'], subsets: ['latin']});

export const sans = `${geist.fontFamily}, ui-sans-serif, system-ui, sans-serif`;
export const mono = `${geistMono.fontFamily}, ui-monospace, SFMono-Regular, Menlo, monospace`;

export const C = {
  ink950: '#07080A',
  ink900: '#0C0E11',
  ink800: '#12151A',
  line: '#232830',
  lineStrong: '#323945',
  text: '#E6EAF0',
  text2: '#9AA4B2',
  text3: '#7A8595',
  signal: '#C8FF3D',
  flow: '#3DD9FF',
  warn: '#FFB020',
  error: '#FF5C5C',
};

export const tint = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

// brand ease-out and ease-in-out
export const easeOut = Easing.bezier(0.2, 0, 0, 1);
export const easeInOut = Easing.bezier(0.4, 0, 0.2, 1);

export const FPS = 30;
