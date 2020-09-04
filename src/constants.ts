import REGL from 'regl';

export const CLEAR_COLOR: REGL.Vec4 = [0, 0, 0, 0];
export const MAX_TEXTURE_DIMENSION = 1024;
export const EARTH_SUN_DISTANCE = 149600000000;
export const SUN_RADIUS = 695508000;
export const DEG2RAD = 0.017453292519943295;
export const SLOPEFACTOR = 0.0333334;
export const RGB_REGEX = /^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/;
export const HEX_REGEX = /(?:#)[0-9a-f]{8}|(?:#)[0-9a-f]{6}|(?:#)[0-9a-f]{4}|(?:#)[0-9a-f]{3}/ig;
