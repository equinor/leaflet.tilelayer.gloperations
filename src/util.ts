import { memoize } from 'lodash-es';
import REGL from 'regl';
import { decode, toRGBA8 } from 'upng-js';

import {
  Color,
  SentinelValue,
  TextureBounds,
  TileCoordinates,
} from './types';

import {
  RGB_REGEX,
  HEX_REGEX,
} from './constants';

import TextureManager from './TextureManager';

export function machineIsLittleEndian() {
  const uint8Array = new Uint8Array([0xAA, 0xBB]);
  const uint16array = new Uint16Array(uint8Array.buffer);
  return uint16array[0] === 0xBBAA;
}

/**
 * Cribbed from Python's built-in `range` function.
 */
export function range(...args: number[]) {
  if (args.length === 1) {
    const [until] = args;
    return new Array(until).fill(undefined).map((_, i) => i);
  } else {
    const [from, until, step = 1] = args;
    if (step === 0) {
      throw new Error('Argument step must be nonzero.');
    }
    const output = [];
    for (let val = from; (step > 0) ? val < until : val > until; val += step) {
      output.push(val);
    }
    return output;
  }
}

/**
 * Fetch a png and decode data. If png does not exist return an array with nodataValue.
 */
export async function fetchPNGData(url: string, nodataValue: number, tileDimension: number): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "arraybuffer";
    xhr.addEventListener('load', () => {
      resolve(xhr.response);
    });
    xhr.addEventListener('error', reject);
    xhr.send(null);
  }).then((data: ArrayBuffer) => {
    const img = decode(data);
    const rgba = toRGBA8(img)[0];
    return new Uint8Array(rgba);
  }).catch(() => <Uint8Array>createNoDataTile(nodataValue, tileDimension));
}

/**
 * Check if two TypedArrays are equal
 */
export function typedArraysAreEqual(a: Uint8Array, b: Uint8Array) {
  if (a.byteLength !== b.byteLength) return false;
  return a.every((val, i) => val === b[i]);
}

/**
 * The matrix output by this function transforms coordinates in pixel space within the drawing
 * buffer (with upper left corner (0, 0) and lower right corner (buffer width, buffer height))
 * to WebGL "clipspace", with upper left corner (-1, 1) and lower right corner (1, -1).
 */
export function getTransformMatrix(
  drawingBufferWidth: number,
  drawingBufferHeight: number,
): REGL.Mat4 {
  // To scale horizontally, divide by width (in pixels) and multiply by 2, because width is 2 in clipspace.
  const sx = 2 / drawingBufferWidth;
  // To scale vertically, divide by height (in pixels) and multiply by -2, because height is 2 in clipspace,
  // and the direction is flipped (positive is up, negative is down).
  const sy = -2 / drawingBufferHeight;
  // We translate by -1 horizontally (so the range 0 to 2 maps to the range -1 to 1).
  const tx = -1;
  // We translate by 1 horizontally (so the range -2 to 0 maps to the range -1 to 1).
  const ty = 1;
  // Matrix must be in column-major order for WebGL.
  return [
    sx, 0,  0, 0,
    0,  sy, 0, 0,
    0,  0,  1, 0,
    tx, ty, 0, 1,
  ];
}

/**
 * From a TextureBounds object, this function generates the four vertices WebGL needs to draw the
 * corresponding rectangle (as two conjoined triangles generated with the triangle strip primitive).
 */
export function getTexCoordVerticesTriangleStripQuad(textureBounds: TextureBounds): REGL.Vec2[] {
  const [{ x: left, y: top }, { x: right, y: bottom }] = textureBounds;
  return [
    [left,  top   ],
    [right, top   ],
    [left,  bottom],
    [right, bottom],
  ];
}

/**
 * From a TextureBounds object, this function generates the six vertices WebGL needs to draw the
 * corresponding rectangle (as two triangles).
 */
export function getTexCoordVerticesTriangleQuad(textureBounds: TextureBounds): REGL.Vec2[] {
  const [{ x: left, y: top }, { x: right, y: bottom }] = textureBounds;
  return [
    [left,  top   ],
    [right, top   ],
    [left,  bottom],
    [right, bottom],
    [right, top   ],
    [left,  bottom],
  ];
}

/**
 * Produces a Promise that resolves when the desired `duration` has expired.
 */
export function Timer(duration: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

/**
 * Useful for sorting TileCoordinates objects.
 */
export function compareTileCoordinates(a: TileCoordinates, b: TileCoordinates): number {
  const z = a.z - b.z;
  const x = a.x - b.x;
  const y = a.y - b.y;
  if (z !== 0) {
    // First compare z values.
    return z;
  } else if (x !== 0) {
    // If z values are the same, compare x values.
    return x;
  } else {
    // If x values are the same, compare y values.
    return y;
  }
}

/**
 * Determines whether two arrays of TileCoordinates are the same.
 */
export function sameTiles(a: TileCoordinates[], b: TileCoordinates[]): boolean {
  return (
    // arrays are of the same length
    a.length === b.length
    // and corresponding elements have the same tile coordinates
    && a.every((tileA, index) => compareTileCoordinates(tileA, b[index]) === 0)
  );
}

export const createNoDataTile: any = memoize((nodataValue: number, tileDimension = 256): Uint8Array => {
  // Create a float 32 array.
  const float32Tile = new Float32Array(tileDimension * tileDimension);
  // Fill the tile array with the no data value
  float32Tile.fill(nodataValue);
  // return the no data tile.
  return new Uint8Array(float32Tile.buffer);
});

/**
 * Force TypeScript to interpret value `val` as type `T`.
 */
export function staticCast<T>(val: any): T {
  return val as T;
}

/**
 * Add one or more macro definitions to a GLSL source string.
 */
export function defineMacros(src: string, macros: { [key: string]: any }): string {
  const defs = Object.keys(macros).map((key) => `#define ${key} ${<string>macros[key]}\n`).join('');
  return `${defs}\n${src}`;
}

/**
 * Ping-pong technique. Render to a destination framebuffer,
 * then use it as a source texture in our next iteration.
 * Then swap them and continue. Used for advanced hillshading.
 */
export function PingPong(regl: REGL.Regl, opts: REGL.FramebufferOptions) {
  const fbos = [regl.framebuffer(opts), regl.framebuffer(opts)];

  let index = 0;

  function ping() {
    return fbos[index];
  }

  function pong() {
    return fbos[1 - index];
  }

  function swap() {
    index = 1 - index;
  }

  function destroy() {
    fbos[0].destroy();
    fbos[1].destroy();
  }

  return {
    ping,
    pong,
    swap,
    destroy
  };
}

/**
 * hexToRGB converts a color from hex format to rgba.
 * const [r, g, b, a] = hexToRGB("#ffeeaaff")
 */
export const hexToRGB = (hex: string) => {
  const hasAlpha = hex.length === 9;
  const start = hasAlpha ? 24 : 16;
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> start) & 255;
  const g = (bigint >> (start - 8)) & 255;
  const b = (bigint >> (start - 16)) & 255;
  const a = hasAlpha ? (bigint >> (start - 24)) & 255 : 255;
  return [r, g, b, a];
};

/**
 * Parses a color string of the form 'rgb({rVal}, {gVal}, {bVal})' and converts the resulting values
 * to an array with ints 0 - 255.
 */
export function colorStringToInts(colorstring: string): number[] {
  if (colorstring === 'transparent') {
    return [0, 0, 0, 0];
  }
  const rgbmatch = colorstring.match(RGB_REGEX);
  const hexmatch = colorstring.match(HEX_REGEX);
  if (rgbmatch !== null) {
    const [, r, g, b] = rgbmatch;
    return [+r, +g, +b, 255];
  } else if (hexmatch !== null) {
    return hexToRGB(colorstring);
  } else {
    throw new Error(`'${colorstring}' is not a valid RGB or hex color expression.`);
  }
}

/**
 * colormapToFlatArray takes the input colormap and returns a flat array to be
 * used as input to a texture. The first row in the array contains the colors.
 * The second row contains the encoded offset values.
 */
export const colormapToFlatArray = (colormap: Color[]) => {
  const offsets: number[] = [];
  let colors: number[] = [];
  for (let i = 0; i < colormap.length; i++) {
    offsets.push(colormap[i].offset);
    const colorsnew = colorStringToInts(colormap[i].color);
    colors = colors.concat(colorsnew);
  }

  const floatOffsets = new Float32Array(offsets);
  const uintOffsets = new Uint8Array(floatOffsets.buffer);
  const normalOffsets = Array.from(uintOffsets);
  const colormapArray: number[] = colors.concat(normalOffsets);

  return colormapArray;
};

/**
 * Creates a texture with colors on first row and offsets on second row
 */
export function createColormapTexture(colormapInput: Color[]|SentinelValue[], regl: REGL.Regl) {
  const colormapFlatArray = colormapToFlatArray(colormapInput);
  let colormapTexture: REGL.Texture2D;
  if (colormapInput.length === 0) {
    // empty texture
    colormapTexture = regl.texture({
      shape: [2, 2]
    });
  } else {
    colormapTexture = regl.texture({
      width: colormapInput.length,
      height: 2,
      data: colormapFlatArray
    });
  }

  return colormapTexture;
}

/**
 * Fetch 8 adjacent tiles, if not already existing in tileManager.
 * Return array with texture coord vertices for all tiles.
 */
export async function getAdjacentTilesTexCoords(
  gloperations: any,
  textureManager: TextureManager,
  coords: TileCoordinates,
  url: string,
  ): Promise<number[][]> {
  // Get existing tiles in TextureManager
  const textureContents = textureManager.contents;

  // use 3x3 tiles for adv. hillshading
  // TODO: add as plugin option?
  const adjacentTiles = 3;
  let textureCoords: number[][] = [];

    for (let i = 0; i < adjacentTiles; i++) {
      const _x = coords['x'] + (i - 1);
      for (let j = 0; j < adjacentTiles; j++) {
        const _y = coords['y'] + (j - 1);
        const coordsAdjacent = {
          x: _x,
          y: _y,
          z: coords['z'],
        };

        // Fetch data for adjacent tile if not already existing in TextureManager
        const hashKey = textureManager.hashTileCoordinates(coordsAdjacent);
        if (!textureContents.has(hashKey)) {
          // Retrieve and add data to TextureManager
          const pixelDataAdjacent = await gloperations._fetchTileData(coordsAdjacent, url);
          const textureBounds = gloperations._renderer.textureManager.addTile(coordsAdjacent, pixelDataAdjacent);
          textureCoords = textureCoords.concat(getTexCoordVerticesTriangleQuad(textureBounds));
        } else {
          const textureBounds = gloperations._renderer.textureManager.getTextureCoordinates(coordsAdjacent);
          textureCoords = textureCoords.concat(getTexCoordVerticesTriangleQuad(textureBounds));
        }
      }
    }
    return textureCoords;
}

export function delay(ms: number) {
  return new Promise(function(resolve) {
      setTimeout(resolve, ms);
  });
}
