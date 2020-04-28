import REGL from 'regl';

import { WebGLColorStop } from './types';

export const SCALE_MAX_LENGTH = 50;
export const SENTINEL_MAX_LENGTH = 50;
export const CLEAR_COLOR: REGL.Vec4 = [0, 0, 0, 0];
export const DEFAULT_COLOR_STOP: WebGLColorStop = {
  color: CLEAR_COLOR,
  offset: 0,
};
export const MAX_TEXTURE_DIMENSION = 1024;
