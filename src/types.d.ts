import REGL from 'regl';
import { ContourMultiPolygon } from 'd3-contour';
import { vec3 } from "gl-matrix";

export interface Color {
  color: string;
  offset: number;
  label?: string;
}

export interface SentinelValue extends Color {
  label: string;
}

export interface Dictionary<T> {
  [index: string]: T;
}

export type Pair<T> = [T, T];

export type calcResult = [number, number, Uint8Array | Float32Array];

export interface TileCoordinates {
  x: number;
  y: number;
  z: number;
}

export interface TextureCoordinates {
  x: number;
  y: number;
}

export interface HillshadeOptions {
  hillshadeType: string;
  hsValueScale?: number|Dictionary<number>;
  hsPixelScale?: number;
  hsSimpleZoomdelta?: number;
  hsSimpleSlopescale?: number;
  hsSimpleAzimuth?: number;
  hsSimpleAltitude?: number;
  hsAdvSoftIterations?: number;
  hsAdvAmbientIterations?: number;
  hsAdvSunRadiusMultiplier?: number;
  hsAdvFinalSoftMultiplier?: number;
  hsAdvFinalAmbientMultiplier?: number;
  hsPregenUrl?: string;
}

// [topLeft, bottomRight]
export type TextureBounds = [TextureCoordinates, TextureCoordinates];

export interface WebGLColorStop {
  color: REGL.Vec4;
  offset: number;
}

export interface TileElement extends HTMLCanvasElement {
  pixelData?: Uint8Array;
  pixelDataA?: Uint8Array;
  pixelDataB?: Uint8Array;
  pixelDataC?: Uint8Array;
  pixelDataD?: Uint8Array;
  pixelDataE?: Uint8Array;
  pixelDataF?: Uint8Array;
  pixelDataHsPregen?: Uint8Array;
}

export interface PixelValues {
  pixelValue?: number | SentinelValue | undefined;
  pixelValueA?: number | SentinelValue | undefined;
  pixelValueB?: number | SentinelValue | undefined;
  pixelValueC?: number | SentinelValue | undefined;
  pixelValueD?: number | SentinelValue | undefined;
  pixelValueE?: number | SentinelValue | undefined;
  pixelValueF?: number | SentinelValue | undefined;
}

export interface TileEvent {
  tile: HTMLImageElement;
  coords: TileCoordinates;
}

export interface ContourData {
  mergedTileArray?: number[];
  smoothedTileArray?: number[];
  width?: number;
  height?: number;
  contoursGeoData?: ContourMultiPolygon[];
}

export interface ActiveTilesBounds {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  xTiles: number;
  yTiles: number;
}

export interface ContourLabel {
  threshold: number;
  xy: number[];
  angle: number;
  text: string;
}

// the data structure represented by Leaflet.GridLayer's `_tiles` property
export interface TileCache {
  [key: string]: GridLayerTile;
}

// data structure used by the tile layer for preloading tiles
export interface PreloadTileCache {
  url: string;
  tiles: TileDatum[];
}

export interface GridLayerTile {
  active?: boolean;
  current: boolean;
  loaded?: Date;
  retain?: boolean;
  coords: TileCoordinates;
  el: TileElement;
}

export interface TileDatum {
  coords: TileCoordinates;
  pixelData: Uint8Array;
}

export interface DrawCommonColors {
  colorScaleUniforms: Dictionary<any>;
  sentinelValuesUniforms: Dictionary<any>;
}

export namespace DrawCommon {
  export interface Props {
    canvasSize: Pair<number>;
    canvasCoordinates: REGL.Vec2;
  }
  export interface Uniforms {
    nodataValue: number;
    littleEndian: boolean;
    transformMatrix: REGL.Mat4;
  }
  export interface Attributes {
    position: REGL.Vec2[];
  }
}

export namespace DrawTile {
  export interface Props extends DrawCommon.Props {
    scaleColormap: REGL.Texture2D;
    sentinelColormap: REGL.Texture2D;
    scaleLength: number;
    sentinelLength: number;
    texture: REGL.Texture2D;
    textureBounds: TextureBounds;
    enableSimpleHillshade: boolean;
  }
  export interface Uniforms extends DrawCommon.Uniforms {
    scaleColormap: REGL.Texture2D;
    sentinelColormap: REGL.Texture2D;
    scaleLength: number;
    sentinelLength: number;
    textureBounds: REGL.Vec4;
    texture: REGL.Texture2D;
    enableSimpleHillshade: boolean;
    offset: number;
    azimuth: number;
    altitude: number;
    slopescale: number;
    textureSize: number;
    tileSize: number;
    slopeFactor: number;
    deg2rad: number;
  }
  export interface Attributes extends DrawCommon.Attributes {
    texCoord: REGL.Vec2[];
  }
}

export namespace DrawTileHsSimple {
  export interface Props extends DrawCommon.Props {
    scaleColormap: REGL.Texture2D;
    sentinelColormap: REGL.Texture2D;
    scaleLength: number;
    sentinelLength: number;
    texture: REGL.Texture2D;
    textureSize: number;
    tileSize: number;
    textureBounds: TextureBounds;
    enableSimpleHillshade: boolean;
    offset: number;
    azimuth: number;
    altitude: number;
    slopescale: number;
  }
  export interface Uniforms extends DrawCommon.Uniforms {
    scaleLength: number;
    sentinelLength: number;
    scaleColormap: REGL.Texture2D;
    sentinelColormap: REGL.Texture2D;
    textureBounds: REGL.Vec4|number[][];
    texture: REGL.Texture2D;
    enableSimpleHillshade: boolean;
    offset: number;
    azimuth: number;
    altitude: number;
    slopescale: number;
    textureSize: number;
    tileSize: number;
    slopeFactor: number;
    deg2rad: number;
  }
  export interface Attributes extends DrawCommon.Attributes {
    texCoord: REGL.Vec2[];
  }
}

export namespace DrawTileHsPregen {
  export interface Props extends DrawCommon.Props {
    scaleColormap: REGL.Texture2D;
    sentinelColormap: REGL.Texture2D;
    scaleLength: number;
    sentinelLength: number;
    texture: REGL.Texture2D;
    textureBounds: TextureBounds;
    textureBoundsHs: TextureBounds;
    textureSize: REGL.Vec2[];
    hillshadePregenTexture: REGL.Texture2D;
  }
  export interface Uniforms extends DrawCommon.Uniforms {
    scaleLength: number;
    sentinelLength: number;
    scaleColormap: REGL.Texture2D;
    sentinelColormap: REGL.Texture2D;
    texture: REGL.Texture2D;
    hillshadePregenTexture: REGL.Texture2D;
  }
  export interface Attributes extends DrawCommon.Attributes {
    texCoordA: REGL.Vec2[];
    texCoordB: REGL.Vec2[];
  }
}

export namespace HsAdvScaleFloats {
  export interface Props extends DrawCommon.Props {
    texture: REGL.Texture2D | REGL.Framebuffer2D;
    // canvasSize: Pair<number>;
    // fbo: REGL.Framebuffer2D;
    // resolution: number;
    // textureBounds: TextureBounds;
    // pixelScale: number;
    // onePixel: number;
    // floatScale: number;
  }
  export interface Uniforms {
    // textureBounds: REGL.Vec4;
    texture: REGL.Texture2D | REGL.Framebuffer2D;
    // pixelScale: number;
    // resolution: number;
    // onePixel: number;
    // floatScale: number;
  }
  export interface Attributes {
    texCoord: REGL.Vec2[];
    position: number[] | number[][];
  }
}

export namespace HsAdvMergeAndScaleTiles {
  export interface Props {
    canvasSize: Pair<number>;
    texture: REGL.Texture2D;
    fbo: REGL.Framebuffer2D;
    floatScale: number;
    nodataValue: number;
    texCoord: number[][];
  }
  export interface Uniforms {
    texture: REGL.Texture2D;
    floatScale: number;
    nodataValue: number;
    littleEndian: boolean;
  }
  export interface Attributes {
    texCoord: number[];
    position: number[] | number[][];
  }
}

export namespace HsAdvCalcNormals {
  export interface Props extends DrawCommon.Props {
    tInput: REGL.Texture2D | REGL.Framebuffer2D;
    fbo?: REGL.Framebuffer2D;
    // resolution: number;
    // textureBounds: TextureBounds;
    pixelScale: number;
    onePixel: number;
    // elevationScale: number;
  }
  export interface Uniforms extends DrawCommon.Uniforms {
    // textureBounds: REGL.Vec4;
    tInput: REGL.Texture2D | REGL.Framebuffer2D;
    pixelScale: number;
    // resolution: number;
    onePixel: number;
    // elevationScale: number;
  }
  export interface Attributes {
    texCoord: REGL.Vec2[] | number[];
    position: REGL.Vec2[] | number[];
  }
}

export namespace HsAdvDirectLightning {
  export interface Props extends DrawCommon.Props {
    scaleColormap: REGL.Texture2D;
    sentinelColormap: REGL.Texture2D;
    scaleLength: number;
    sentinelLength: number;
    tInput: REGL.Texture2D | REGL.Framebuffer2D;
    tNormal: REGL.Texture2D | REGL.Framebuffer2D;
    // fbo: REGL.Framebuffer2D;
    // resolution: number;
    textureBounds: TextureBounds;
    floatScale: number;
    // pixelScale: number;
    sunDirection: number[] | Float32Array | vec3;
  }
  export interface Uniforms extends DrawCommon.Uniforms {
    scaleColormap: REGL.Texture2D;
    sentinelColormap: REGL.Texture2D;
    scaleLength: number;
    sentinelLength: number;
    // textureBounds: REGL.Vec4;
    tInput: REGL.Texture2D | REGL.Framebuffer2D;
    tNormal: REGL.Texture2D | REGL.Framebuffer2D;
    floatScale: number;
    // pixelScale: number;
    sunDirection: number[] | Float32Array | vec3;
    // resolution: number;
  }
  export interface Attributes {
    texCoord: REGL.Vec2[] | number[];
    position: REGL.Vec2[] | number[];
  }
}

export namespace HsAdvSoftShadows {
  export interface Props extends DrawCommon.Props {
    tInput: REGL.Texture2D | REGL.Framebuffer2D;
    tNormal: REGL.Texture2D | REGL.Framebuffer2D;
    tSrc: REGL.Framebuffer2D;
    fbo: REGL.Framebuffer2D;
    softIterations: number;
    resolution:  number[] | REGL.Vec2;
    textureBounds: TextureBounds;
    pixelScale: number;
    sunDirection: number[] | Float32Array | vec3;
  }
  export interface Uniforms extends DrawCommon.Uniforms {
    tInput: REGL.Texture2D | REGL.Framebuffer2D;
    tNormal: REGL.Texture2D | REGL.Framebuffer2D;
    tSrc: REGL.Framebuffer2D;
    softIterations: number;
    pixelScale: number;
    sunDirection: number[] | Float32Array | vec3;
    resolution: number[] | REGL.Vec2;
  }
  export interface Attributes {
    texCoord: REGL.Vec2[] | number[];
    position: REGL.Vec2[] | number[];
  }
}

export namespace HsAdvAmbientShadows {
  export interface Props extends DrawCommon.Props {
    tInput: REGL.Texture2D | REGL.Framebuffer2D;
    tNormal: REGL.Texture2D | REGL.Framebuffer2D;
    tSrc: REGL.Framebuffer2D;
    fbo: REGL.Framebuffer2D;
    ambientIterations: number;
    resolution:  number[] | REGL.Vec2;
    textureBounds: TextureBounds;
    pixelScale: number;
    direction: number[] | Float32Array | vec3;
  }
  export interface Uniforms extends DrawCommon.Uniforms {
    tInput: REGL.Texture2D | REGL.Framebuffer2D;
    tNormal: REGL.Texture2D | REGL.Framebuffer2D;
    tSrc: REGL.Framebuffer2D;
    ambientIterations: number;
    pixelScale: number;
    direction: number[] | Float32Array | vec3;
    resolution: number[] | REGL.Vec2;
  }
  export interface Attributes {
    texCoord: REGL.Vec2[] | number[];
    position: REGL.Vec2[] | number[];
  }
}

export namespace HsAdvFinal {
  export interface Props extends DrawCommon.Props {
    tInput: REGL.Texture2D | REGL.Framebuffer2D;
    tSoftShadow: REGL.Texture2D | REGL.Framebuffer2D;
    tAmbient: REGL.Texture2D | REGL.Framebuffer2D;
    floatScale: number;
    finalSoftMultiplier: number;
    finalAmbientMultiplier: number;
    textureBounds: TextureBounds;
    scaleColormap: REGL.Texture2D;
    sentinelColormap: REGL.Texture2D;
    scaleLength: number;
    sentinelLength: number;
  }
  export interface Uniforms extends DrawCommon.Uniforms {
    tInput: REGL.Texture2D | REGL.Framebuffer2D;
    tSoftShadow: REGL.Texture2D | REGL.Framebuffer2D;
    tAmbient: REGL.Texture2D | REGL.Framebuffer2D;
    floatScale: number;
    finalSoftMultiplier: number;
    finalAmbientMultiplier: number;
    scaleColormap: REGL.Texture2D;
    sentinelColormap: REGL.Texture2D;
    scaleLength: number;
    sentinelLength: number;
  }
  export interface Attributes extends DrawCommon.Attributes {
    texCoordA: REGL.Vec2[] | number[];
    texCoordB: REGL.Vec2[] | number[];
    // position: REGL.Vec2[] | number[];
  }
}

export namespace DrawTileInterpolateValue {
  export interface Props extends DrawCommon.Props {
    scaleColormap: REGL.Texture2D;
    sentinelColormap: REGL.Texture2D;
    scaleLength: number;
    sentinelLength: number;
    textureA: REGL.Texture2D;
    textureB: REGL.Texture2D;
    textureBoundsA: TextureBounds;
    textureBoundsB: TextureBounds;
    interpolationFraction: number;
  }
  export interface Uniforms extends DrawCommon.Uniforms {
    scaleLength: number;
    sentinelLength: number;
    scaleColormap: REGL.Texture2D;
    sentinelColormap: REGL.Texture2D;
    textureA: REGL.Texture2D;
    textureB: REGL.Texture2D;
    interpolationFraction: number;
  }
  export interface Attributes extends DrawCommon.Attributes {
    texCoordA: REGL.Vec2[];
    texCoordB: REGL.Vec2[];
  }
}

export namespace DrawTileMultiAnalyze1 {
  export interface Props extends DrawCommon.Props {
    scaleColormap: REGL.Texture2D;
    sentinelColormap: REGL.Texture2D;
    scaleLength: number;
    sentinelLength: number;
    textureA: REGL.Texture2D;
    textureBoundsA: TextureBounds;
    filterLowA: number;
    filterHighA: number;
    multiplierA: number;
  }
  export interface Uniforms extends DrawCommon.Uniforms {
    scaleLength: number;
    sentinelLength: number;
    scaleColormap: REGL.Texture2D;
    sentinelColormap: REGL.Texture2D;
    textureA: REGL.Texture2D;
    filterLowA : number;
    filterHighA : number;
    multiplierA: number;
  }
  export interface Attributes extends DrawCommon.Attributes {
    texCoord: REGL.Vec2[];
  }
}

export namespace CalcTileMultiAnalyze1 {
  export interface Props extends DrawCommon.Props {
    textureA: REGL.Texture2D;
    textureBoundsA: TextureBounds;
    filterLowA: number;
    filterHighA: number;
    multiplierA: number;
  }
  export interface Uniforms extends DrawCommon.Uniforms {
    textureA: REGL.Texture2D;
    filterLowA : number;
    filterHighA : number;
    multiplierA: number;
  }
  export interface Attributes extends DrawCommon.Attributes {
    texCoord: REGL.Vec2[];
  }
}

export namespace DrawTileMultiAnalyze2 {
  export interface Props extends DrawCommon.Props {
    scaleColormap: REGL.Texture2D;
    sentinelColormap: REGL.Texture2D;
    scaleLength: number;
    sentinelLength: number;
    textureA: REGL.Texture2D;
    textureB: REGL.Texture2D;
    textureBoundsA: TextureBounds;
    textureBoundsB: TextureBounds;
    filterLowA: number;
    filterHighA: number;
    filterLowB: number;
    filterHighB: number;
    multiplierA: number;
    multiplierB: number;
  }
  export interface Uniforms extends DrawCommon.Uniforms {
    scaleColormap: REGL.Texture2D;
    sentinelColormap: REGL.Texture2D;
    scaleLength: number;
    sentinelLength: number;
    textureA: REGL.Texture2D;
    textureB: REGL.Texture2D;
    filterLowA : number;
    filterHighA : number;
    filterLowB : number;
    filterHighB : number;
    multiplierA: number;
    multiplierB: number;
  }
  export interface Attributes extends DrawCommon.Attributes {
    texCoordA: REGL.Vec2[];
    texCoordB: REGL.Vec2[];
  }
}

export namespace CalcTileMultiAnalyze2 {
  export interface Props extends DrawCommon.Props {
    textureA: REGL.Texture2D;
    textureB: REGL.Texture2D;
    textureBoundsA: TextureBounds;
    textureBoundsB: TextureBounds;
    filterLowA: number;
    filterHighA: number;
    filterLowB: number;
    filterHighB: number;
    multiplierA: number;
    multiplierB: number;
  }
  export interface Uniforms extends DrawCommon.Uniforms {
    textureA: REGL.Texture2D;
    textureB: REGL.Texture2D;
    filterLowA : number;
    filterHighA : number;
    filterLowB : number;
    filterHighB : number;
    multiplierA: number;
    multiplierB: number;
  }
  export interface Attributes extends DrawCommon.Attributes {
    texCoordA: REGL.Vec2[];
    texCoordB: REGL.Vec2[];
  }
}

export namespace DrawTileMultiAnalyze3 {
  export interface Props extends DrawCommon.Props {
    scaleColormap: REGL.Texture2D;
    sentinelColormap: REGL.Texture2D;
    scaleLength: number;
    sentinelLength: number;
    textureA: REGL.Texture2D;
    textureB: REGL.Texture2D;
    textureC: REGL.Texture2D;
    textureBoundsA: TextureBounds;
    textureBoundsB: TextureBounds;
    textureBoundsC: TextureBounds;
    filterLowA: number;
    filterHighA: number;
    filterLowB: number;
    filterHighB: number;
    filterLowC: number;
    filterHighC: number;
    multiplierA: number;
    multiplierB: number;
    multiplierC: number;
  }
  export interface Uniforms extends DrawCommon.Uniforms {
    scaleColormap: REGL.Texture2D;
    sentinelColormap: REGL.Texture2D;
    scaleLength: number;
    sentinelLength: number;
    textureA: REGL.Texture2D;
    textureB: REGL.Texture2D;
    textureC: REGL.Texture2D;
    filterLowA : number;
    filterHighA : number;
    filterLowB : number;
    filterHighB : number;
    filterLowC : number;
    filterHighC : number;
    multiplierA: number;
    multiplierB: number;
    multiplierC: number;
  }
  export interface Attributes extends DrawCommon.Attributes {
    texCoordA: REGL.Vec2[];
    texCoordB: REGL.Vec2[];
    texCoordC: REGL.Vec2[];
  }
}

export namespace CalcTileMultiAnalyze3 {
  export interface Props extends DrawCommon.Props {
    textureA: REGL.Texture2D;
    textureB: REGL.Texture2D;
    textureC: REGL.Texture2D;
    textureBoundsA: TextureBounds;
    textureBoundsB: TextureBounds;
    textureBoundsC: TextureBounds;
    filterLowA: number;
    filterHighA: number;
    filterLowB: number;
    filterHighB: number;
    filterLowC: number;
    filterHighC: number;
    multiplierA: number;
    multiplierB: number;
    multiplierC: number;
  }
  export interface Uniforms extends DrawCommon.Uniforms {
    textureA: REGL.Texture2D;
    textureB: REGL.Texture2D;
    textureC: REGL.Texture2D;
    filterLowA : number;
    filterHighA : number;
    filterLowB : number;
    filterHighB : number;
    filterLowC : number;
    filterHighC : number;
    multiplierA: number;
    multiplierB: number;
    multiplierC: number;
  }
  export interface Attributes extends DrawCommon.Attributes {
    texCoordA: REGL.Vec2[];
    texCoordB: REGL.Vec2[];
    texCoordC: REGL.Vec2[];
  }
}

export namespace DrawTileMultiAnalyze4 {
  export interface Props extends DrawCommon.Props {
    scaleColormap: REGL.Texture2D;
    sentinelColormap: REGL.Texture2D;
    scaleLength: number;
    sentinelLength: number;
    textureA: REGL.Texture2D;
    textureB: REGL.Texture2D;
    textureC: REGL.Texture2D;
    textureD: REGL.Texture2D;
    textureBoundsA: TextureBounds;
    textureBoundsB: TextureBounds;
    textureBoundsC: TextureBounds;
    textureBoundsD: TextureBounds;
    filterLowA: number;
    filterHighA: number;
    filterLowB: number;
    filterHighB: number;
    filterLowC: number;
    filterHighC: number;
    filterLowD: number;
    filterHighD: number;
    multiplierA: number;
    multiplierB: number;
    multiplierC: number;
    multiplierD: number;
  }
  export interface Uniforms extends DrawCommon.Uniforms {
    scaleColormap: REGL.Texture2D;
    sentinelColormap: REGL.Texture2D;
    scaleLength: number;
    sentinelLength: number;
    textureA: REGL.Texture2D;
    textureB: REGL.Texture2D;
    textureC: REGL.Texture2D;
    textureD: REGL.Texture2D;
    filterLowA : number;
    filterHighA : number;
    filterLowB : number;
    filterHighB : number;
    filterLowC : number;
    filterHighC : number;
    filterLowD : number;
    filterHighD : number;
    multiplierA: number;
    multiplierB: number;
    multiplierC: number;
    multiplierD: number;
  }
  export interface Attributes extends DrawCommon.Attributes {
    texCoordA: REGL.Vec2[];
    texCoordB: REGL.Vec2[];
    texCoordC: REGL.Vec2[];
    texCoordD: REGL.Vec2[];
  }
}

export namespace CalcTileMultiAnalyze4 {
  export interface Props extends DrawCommon.Props {
    textureA: REGL.Texture2D;
    textureB: REGL.Texture2D;
    textureC: REGL.Texture2D;
    textureD: REGL.Texture2D;
    textureBoundsA: TextureBounds;
    textureBoundsB: TextureBounds;
    textureBoundsC: TextureBounds;
    textureBoundsD: TextureBounds;
    filterLowA: number;
    filterHighA: number;
    filterLowB: number;
    filterHighB: number;
    filterLowC: number;
    filterHighC: number;
    filterLowD: number;
    filterHighD: number;
    multiplierA: number;
    multiplierB: number;
    multiplierC: number;
    multiplierD: number;
  }
  export interface Uniforms extends DrawCommon.Uniforms {
    textureA: REGL.Texture2D;
    textureB: REGL.Texture2D;
    textureC: REGL.Texture2D;
    textureD: REGL.Texture2D;
    filterLowA : number;
    filterHighA : number;
    filterLowB : number;
    filterHighB : number;
    filterLowC : number;
    filterHighC : number;
    filterLowD : number;
    filterHighD : number;
    multiplierA: number;
    multiplierB: number;
    multiplierC: number;
    multiplierD: number;
  }
  export interface Attributes extends DrawCommon.Attributes {
    texCoordA: REGL.Vec2[];
    texCoordB: REGL.Vec2[];
    texCoordC: REGL.Vec2[];
    texCoordD: REGL.Vec2[];
  }
}


export namespace DrawTileMultiAnalyze5 {
  export interface Props extends DrawCommon.Props {
    scaleColormap: REGL.Texture2D;
    sentinelColormap: REGL.Texture2D;
    scaleLength: number;
    sentinelLength: number;
    textureA: REGL.Texture2D;
    textureB: REGL.Texture2D;
    textureC: REGL.Texture2D;
    textureD: REGL.Texture2D;
    textureE: REGL.Texture2D;
    textureBoundsA: TextureBounds;
    textureBoundsB: TextureBounds;
    textureBoundsC: TextureBounds;
    textureBoundsD: TextureBounds;
    textureBoundsE: TextureBounds;
    filterLowA: number;
    filterHighA: number;
    filterLowB: number;
    filterHighB: number;
    filterLowC: number;
    filterHighC: number;
    filterLowD: number;
    filterHighD: number;
    filterLowE: number;
    filterHighE: number;
    multiplierA: number;
    multiplierB: number;
    multiplierC: number;
    multiplierD: number;
    multiplierE: number;
  }
  export interface Uniforms extends DrawCommon.Uniforms {
    scaleColormap: REGL.Texture2D;
    sentinelColormap: REGL.Texture2D;
    scaleLength: number;
    sentinelLength: number;
    textureA: REGL.Texture2D;
    textureB: REGL.Texture2D;
    textureC: REGL.Texture2D;
    textureD: REGL.Texture2D;
    textureE: REGL.Texture2D;
    filterLowA : number;
    filterHighA : number;
    filterLowB : number;
    filterHighB : number;
    filterLowC : number;
    filterHighC : number;
    filterLowD : number;
    filterHighD : number;
    filterLowE: number;
    filterHighE: number;
    multiplierA: number;
    multiplierB: number;
    multiplierC: number;
    multiplierD: number;
    multiplierE: number;
  }
  export interface Attributes extends DrawCommon.Attributes {
    texCoordA: REGL.Vec2[];
    texCoordB: REGL.Vec2[];
    texCoordC: REGL.Vec2[];
    texCoordD: REGL.Vec2[];
    texCoordE: REGL.Vec2[];
  }
}

export namespace CalcTileMultiAnalyze5 {
  export interface Props extends DrawCommon.Props {
    textureA: REGL.Texture2D;
    textureB: REGL.Texture2D;
    textureC: REGL.Texture2D;
    textureD: REGL.Texture2D;
    textureE: REGL.Texture2D;
    textureBoundsA: TextureBounds;
    textureBoundsB: TextureBounds;
    textureBoundsC: TextureBounds;
    textureBoundsD: TextureBounds;
    textureBoundsE: TextureBounds;
    filterLowA: number;
    filterHighA: number;
    filterLowB: number;
    filterHighB: number;
    filterLowC: number;
    filterHighC: number;
    filterLowD: number;
    filterHighD: number;
    filterLowE: number;
    filterHighE: number;
    multiplierA: number;
    multiplierB: number;
    multiplierC: number;
    multiplierD: number;
    multiplierE: number;
  }
  export interface Uniforms extends DrawCommon.Uniforms {
    textureA: REGL.Texture2D;
    textureB: REGL.Texture2D;
    textureC: REGL.Texture2D;
    textureD: REGL.Texture2D;
    textureE: REGL.Texture2D;
    filterLowA : number;
    filterHighA : number;
    filterLowB : number;
    filterHighB : number;
    filterLowC : number;
    filterHighC : number;
    filterLowD : number;
    filterHighD : number;
    filterLowE: number;
    filterHighE: number;
    multiplierA: number;
    multiplierB: number;
    multiplierC: number;
    multiplierD: number;
    multiplierE: number;
  }
  export interface Attributes extends DrawCommon.Attributes {
    texCoordA: REGL.Vec2[];
    texCoordB: REGL.Vec2[];
    texCoordC: REGL.Vec2[];
    texCoordD: REGL.Vec2[];
    texCoordE: REGL.Vec2[];
  }
}

export namespace DrawTileMultiAnalyze6 {
  export interface Props extends DrawCommon.Props {
    scaleColormap: REGL.Texture2D;
    sentinelColormap: REGL.Texture2D;
    scaleLength: number;
    sentinelLength: number;
    textureA: REGL.Texture2D;
    textureB: REGL.Texture2D;
    textureC: REGL.Texture2D;
    textureD: REGL.Texture2D;
    textureE: REGL.Texture2D;
    textureF: REGL.Texture2D;
    textureBoundsA: TextureBounds;
    textureBoundsB: TextureBounds;
    textureBoundsC: TextureBounds;
    textureBoundsD: TextureBounds;
    textureBoundsE: TextureBounds;
    textureBoundsF: TextureBounds;
    filterLowA: number;
    filterHighA: number;
    filterLowB: number;
    filterHighB: number;
    filterLowC: number;
    filterHighC: number;
    filterLowD: number;
    filterHighD: number;
    filterLowE: number;
    filterHighE: number;
    filterLowF: number;
    filterHighF: number;
    multiplierA: number;
    multiplierB: number;
    multiplierC: number;
    multiplierD: number;
    multiplierE: number;
    multiplierF: number;
  }
  export interface Uniforms extends DrawCommon.Uniforms {
    scaleColormap: REGL.Texture2D;
    sentinelColormap: REGL.Texture2D;
    scaleLength: number;
    sentinelLength: number;
    textureA: REGL.Texture2D;
    textureB: REGL.Texture2D;
    textureC: REGL.Texture2D;
    textureD: REGL.Texture2D;
    textureE: REGL.Texture2D;
    textureF: REGL.Texture2D;
    filterLowA : number;
    filterHighA : number;
    filterLowB : number;
    filterHighB : number;
    filterLowC : number;
    filterHighC : number;
    filterLowD : number;
    filterHighD : number;
    filterLowE: number;
    filterHighE: number;
    filterLowF: number;
    filterHighF: number;
    multiplierA: number;
    multiplierB: number;
    multiplierC: number;
    multiplierD: number;
    multiplierE: number;
    multiplierF: number;
  }
  export interface Attributes extends DrawCommon.Attributes {
    texCoordA: REGL.Vec2[];
    texCoordB: REGL.Vec2[];
    texCoordC: REGL.Vec2[];
    texCoordD: REGL.Vec2[];
    texCoordE: REGL.Vec2[];
    texCoordF: REGL.Vec2[];
  }
}

export namespace CalcTileMultiAnalyze6 {
  export interface Props extends DrawCommon.Props {
    textureA: REGL.Texture2D;
    textureB: REGL.Texture2D;
    textureC: REGL.Texture2D;
    textureD: REGL.Texture2D;
    textureE: REGL.Texture2D;
    textureF: REGL.Texture2D;
    textureBoundsA: TextureBounds;
    textureBoundsB: TextureBounds;
    textureBoundsC: TextureBounds;
    textureBoundsD: TextureBounds;
    textureBoundsE: TextureBounds;
    textureBoundsF: TextureBounds;
    filterLowA: number;
    filterHighA: number;
    filterLowB: number;
    filterHighB: number;
    filterLowC: number;
    filterHighC: number;
    filterLowD: number;
    filterHighD: number;
    filterLowE: number;
    filterHighE: number;
    filterLowF: number;
    filterHighF: number;
    multiplierA: number;
    multiplierB: number;
    multiplierC: number;
    multiplierD: number;
    multiplierE: number;
    multiplierF: number;
  }
  export interface Uniforms extends DrawCommon.Uniforms {
    textureA: REGL.Texture2D;
    textureB: REGL.Texture2D;
    textureC: REGL.Texture2D;
    textureD: REGL.Texture2D;
    textureE: REGL.Texture2D;
    textureF: REGL.Texture2D;
    filterLowA : number;
    filterHighA : number;
    filterLowB : number;
    filterHighB : number;
    filterLowC : number;
    filterHighC : number;
    filterLowD : number;
    filterHighD : number;
    filterLowE: number;
    filterHighE: number;
    filterLowF: number;
    filterHighF: number;
    multiplierA: number;
    multiplierB: number;
    multiplierC: number;
    multiplierD: number;
    multiplierE: number;
    multiplierF: number;
  }
  export interface Attributes extends DrawCommon.Attributes {
    texCoordA: REGL.Vec2[];
    texCoordB: REGL.Vec2[];
    texCoordC: REGL.Vec2[];
    texCoordD: REGL.Vec2[];
    texCoordE: REGL.Vec2[];
    texCoordF: REGL.Vec2[];
  }
}

export namespace CalcTileDiff {
  export interface Props extends DrawCommon.Props {
    textureA: REGL.Texture2D;
    textureB: REGL.Texture2D;
    textureBoundsA: TextureBounds;
    textureBoundsB: TextureBounds;
    // framebuffer: REGL.Framebuffer2D,
    // fboRgbaTile: WebGLBuffer,
  }
  export interface Uniforms extends DrawCommon.Uniforms {
    textureA: REGL.Texture2D;
    textureB: REGL.Texture2D;
  }
  export interface Attributes extends DrawCommon.Attributes {
    texCoordA: REGL.Vec2[];
    texCoordB: REGL.Vec2[];
  }
}

export namespace DrawTileDiff {
  export interface Props extends DrawCommon.Props {
    scaleColormap: REGL.Texture2D;
    sentinelColormap: REGL.Texture2D;
    scaleLength: number;
    sentinelLength: number;
    // texture: REGL.Framebuffer2D | REGL.Texture2D;
    // textureBounds: TextureBounds;
    textureA: REGL.Texture2D;
    textureB: REGL.Texture2D;
    textureBoundsA: TextureBounds;
    textureBoundsB: TextureBounds;
  }
  export interface Uniforms extends DrawCommon.Uniforms {
    scaleColormap: REGL.Texture2D;
    sentinelColormap: REGL.Texture2D;
    scaleLength: number;
    sentinelLength: number;
    textureA: REGL.Framebuffer2D;
    textureB: REGL.Framebuffer2D;
  }
  export interface Attributes extends DrawCommon.Attributes {
    texCoordA: REGL.Vec2[];
    texCoordB: REGL.Vec2[];
  }
}

export namespace ConvolutionSmooth {
  export interface Props {
    texture: REGL.Texture2D;
    textureSize: number;
    kernelSize: number;
    nodataValue: number;
    littleEndian: boolean;
  }
  export interface Uniforms extends DrawCommon.Uniforms {
    texture: REGL.Texture2D;
    textureSize: number;
    kernelSize: number;
  }
  export interface Attributes {
    texCoord: number[];
    position: number[];
  }
}

export namespace DrawTileInterpolateColor {
  export interface Props extends DrawCommon.Props {
    scaleColormapA: REGL.Texture2D;
    sentinelColormapA: REGL.Texture2D;
    scaleLengthA: number;
    sentinelLengthA: number;
    scaleColormapB: REGL.Texture2D;
    sentinelColormapB: REGL.Texture2D;
    scaleLengthB: number;
    sentinelLengthB: number;
    textureA: REGL.Texture2D;
    textureB: REGL.Texture2D;
    textureBoundsA: TextureBounds;
    textureBoundsB: TextureBounds;
    interpolationFraction: number;
  }
  export interface Uniforms extends DrawCommon.Uniforms {
    scaleColormapA: REGL.Texture2D;
    sentinelColormapA: REGL.Texture2D;
    scaleLengthA: number;
    sentinelLengthA: number;
    scaleColormapB: REGL.Texture2D;
    sentinelColormapB: REGL.Texture2D;
    scaleLengthB: number;
    sentinelLengthB: number;
    textureA: REGL.Texture2D;
    textureB: REGL.Texture2D;
    interpolationFraction: number;
  }
  export interface Attributes extends DrawCommon.Attributes {
    texCoordA: REGL.Vec2[];
    texCoordB: REGL.Vec2[];
  }
}

export namespace DrawTileInterpolateColorOnly {
  export interface Props extends DrawCommon.Props {
    scaleColormapA: REGL.Texture2D;
    sentinelColormapA: REGL.Texture2D;
    scaleLengthA: number;
    sentinelLengthA: number;
    scaleColormapB: REGL.Texture2D;
    sentinelColormapB: REGL.Texture2D;
    scaleLengthB: number;
    sentinelLengthB: number;
    texture: REGL.Texture2D;
    textureBounds: TextureBounds;
    interpolationFraction: number;
  }
  export interface Uniforms extends DrawCommon.Uniforms {
    scaleColormapA: REGL.Texture2D;
    sentinelColormapA: REGL.Texture2D;
    scaleLengthA: number;
    sentinelLengthA: number;
    scaleColormapB: REGL.Texture2D;
    sentinelColormapB: REGL.Texture2D;
    scaleLengthB: number;
    sentinelLengthB: number;
    texture: REGL.Texture2D;
    interpolationFraction: number;
  }
  export interface Attributes extends DrawCommon.Attributes {
    texCoord: REGL.Vec2[];
  }
}
