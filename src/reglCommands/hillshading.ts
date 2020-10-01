import REGL from 'regl';

import vertSingle from '../shaders/vertex/single.vs';
import vertDouble from '../shaders/vertex/double.vs';
import vertSingleNotTransformed from '../shaders/vertex/singleNotTransformed.vs';

import fragSingle from '../shaders/fragment/single.fs';
import fragHsPregen from '../shaders/fragment/hillshading/hsPregen.fs';
import fragHsAdvMergeAndScaleTiles from '../shaders/fragment/hillshading/hsAdvMergeAndScaleTiles.fs';
import fragHsAdvNormals from '../shaders/fragment/hillshading/hsAdvNormals.fs';
import fragHsAdvDirectLight from '../shaders/fragment/hillshading/hsAdvDirect.fs';
import fragHsAdvSoftShadows from '../shaders/fragment/hillshading/hsAdvSoftShadows.fs';
import fragHsAdvAmbientShadows from '../shaders/fragment/hillshading/hsAdvAmbientShadows.fs';
import fragHsAdvFinalColorscale from '../shaders/fragment/hillshading/hsAdvFinalColorscale.fs';
import fragHsAdvFinalBaselayer from '../shaders/fragment/hillshading/hsAdvFinalBaselayer.fs';

import {
  Dictionary,
  DrawCommon,
  DrawTileHsSimple,
  DrawTileHsPregen,
  HsAdvMergeAndScaleTiles,
  HsAdvCalcNormals,
  HsAdvDirectLightning,
  HsAdvSoftShadows,
  HsAdvAmbientShadows,
  HsAdvFinalColorscale,
  HsAdvFinalBaselayer,
} from '../types';

import {
	DEG2RAD,
	SLOPEFACTOR,
} from '../constants';

import * as util from '../util';

const littleEndian = util.machineIsLittleEndian();

/**
 * The resulting Regl DrawCommand is used to draw a single tile. The fragment shader decodes the
 * Float32 value of a pixel and colorizes it with the given color scale (and/or sentinel values).
 * Hillshading is applied with a simple and fast algorithm
 */
export function createDrawTileHsSimpleCommand(
  regl: REGL.Regl,
  commonConfig: REGL.DrawConfig<DrawCommon.Uniforms, DrawCommon.Attributes, DrawCommon.Props>,
  fragMacros: Dictionary<any>,
) {
  return regl<DrawTileHsSimple.Uniforms, DrawTileHsSimple.Attributes, DrawTileHsSimple.Props>({
    ...commonConfig,
    vert: vertSingle,
    frag: util.defineMacros(fragSingle, fragMacros),
    uniforms: {
      ...commonConfig.uniforms as DrawCommon.Uniforms,
      scaleLength: regl.prop<DrawTileHsSimple.Props, 'scaleLength'>('scaleLength'),
      sentinelLength: regl.prop<DrawTileHsSimple.Props, 'sentinelLength'>('sentinelLength'),
      scaleColormap: regl.prop<DrawTileHsSimple.Props, 'scaleColormap'>('scaleColormap'),
      sentinelColormap: regl.prop<DrawTileHsSimple.Props, 'sentinelColormap'>('sentinelColormap'),
      texture: (_, { texture }) => texture,
      enableSimpleHillshade: (_, { enableSimpleHillshade }) => enableSimpleHillshade,
      azimuth: (_, { azimuth }) => azimuth,
      altitude: (_, { altitude }) => altitude,
      slopescale: (_, { slopescale }) => slopescale,
      deg2rad: DEG2RAD,
      slopeFactor: SLOPEFACTOR,
      offset: (_, { offset }) => offset,
      textureBounds: (_, { textureBounds }) => {
        return [
          [textureBounds[0].x],
          [textureBounds[0].y],
          [textureBounds[1].x],
          [textureBounds[1].y]
        ];
      },
      textureSize: (_, { textureSize }) => textureSize,
      tileSize: (_, { tileSize }) => tileSize,
    },
    attributes: {
      ...commonConfig.attributes as DrawCommon.Attributes,
      texCoord: (_, { textureBounds }) => util.getTexCoordVerticesTriangleStripQuad(textureBounds),
    },
  });
}

/**
 * The resulting Regl DrawCommand is used to draw a single tile. The fragment shader decodes the
 * Float32 value of a pixel and colorizes it with the given color scale (and/or sentinel values).
 * Hillshading is applied from a pre-generated texture
 */
export function createDrawTileHsPregenCommand(
  regl: REGL.Regl,
  commonConfig: REGL.DrawConfig<DrawCommon.Uniforms, DrawCommon.Attributes, DrawCommon.Props>,
  fragMacros: Dictionary<any>,
) {
  return regl<DrawTileHsPregen.Uniforms, DrawTileHsPregen.Attributes, DrawTileHsPregen.Props>({
    ...commonConfig,
    vert: vertDouble,
    frag: util.defineMacros(fragHsPregen, fragMacros),
    uniforms: {
      ...commonConfig.uniforms as DrawCommon.Uniforms,
      scaleLength: regl.prop<DrawTileHsPregen.Props, 'scaleLength'>('scaleLength'),
      sentinelLength: regl.prop<DrawTileHsPregen.Props, 'sentinelLength'>('sentinelLength'),
      scaleColormap: regl.prop<DrawTileHsPregen.Props, 'scaleColormap'>('scaleColormap'),
      sentinelColormap: regl.prop<DrawTileHsPregen.Props, 'sentinelColormap'>('sentinelColormap'),
      texture: (_, { texture }) => texture,
      hillshadePregenTexture: (_, { hillshadePregenTexture }) => hillshadePregenTexture,
    },
    attributes: {
      ...commonConfig.attributes as DrawCommon.Attributes,
      texCoordA: (_, { textureBounds }) => util.getTexCoordVerticesTriangleStripQuad(textureBounds),
      texCoordB: (_, { textureBoundsHs }) => util.getTexCoordVerticesTriangleStripQuad(textureBoundsHs),
    },
  });
}


/**
 * The resulting Regl DrawCommand is used to get the float values from the 3x3
 * adjacent tiles. The float values can be scaled to adjust the hillshading.
 * It will be saved to a framebuffer and is used as an input to advanced hillshading
 */
export function createHsAdvMergeAndScaleTiles(
  regl: REGL.Regl,
) {
  return regl<HsAdvMergeAndScaleTiles.Uniforms, HsAdvMergeAndScaleTiles.Attributes, HsAdvMergeAndScaleTiles.Props>({
    vert: vertSingleNotTransformed,
    frag: fragHsAdvMergeAndScaleTiles,
    uniforms: {
      littleEndian: littleEndian,
      nodataValue: regl.prop<HsAdvMergeAndScaleTiles.Props, 'nodataValue'>("nodataValue"),
      texture: regl.prop<HsAdvMergeAndScaleTiles.Props, 'texture'>("texture"),
      floatScale: regl.prop<HsAdvMergeAndScaleTiles.Props, 'floatScale'>("floatScale"),
    },
    attributes: {
      // 18 triangles = 9 tiles
      position: [
        [-1, 1], [-1/3, 1], [-1, 1/3], [-1/3, 1/3], [-1/3, 1], [-1, 1/3],
        [-1, 1/3], [-1/3, 1/3], [-1, -1/3], [-1/3, -1/3], [-1/3, 1/3], [-1, -1/3],
        [-1, -1/3], [-1/3, -1/3], [-1, -1], [-1/3, -1], [-1/3, -1/3], [-1, -1],
        [-1/3, 1], [1/3, 1], [-1/3, 1/3], [1/3, 1/3], [1/3, 1], [-1/3, 1/3],
        [-1/3, 1/3], [1/3, 1/3], [-1/3, -1/3], [1/3, -1/3], [1/3, 1/3], [-1/3, -1/3],
        [-1/3, -1/3], [1/3, -1/3], [-1/3, -1], [1/3, -1], [1/3, -1/3], [-1/3, -1],
        [1/3, 1], [1, 1], [1/3, 1/3], [1, 1/3], [1, 1], [1/3, 1/3],
        [1/3, 1/3], [1, 1/3], [1/3, -1/3], [1, -1/3], [1, 1/3], [1/3, -1/3],
        [1/3, -1/3], [1, -1/3], [1/3, -1], [1, -1], [1, -1/3], [1/3, -1]
      ],
      texCoord: regl.prop<HsAdvMergeAndScaleTiles.Props, 'texCoord'>("texCoord"),
    },
    depth: { enable: false },
    primitive: 'triangles',
    count: 54,
    viewport: (_, { canvasSize: [width, height] }) => ({ width, height }),
    framebuffer: regl.prop<HsAdvMergeAndScaleTiles.Props, 'fbo'>("fbo"),
  });
}

/**
 * The resulting Regl DrawCommand is used to calculate the normals.
 * It is used as an input to advanced hillshading
 */
export function createHsAdvCalcNormals(
  regl: REGL.Regl,
  commonConfig: REGL.DrawConfig<DrawCommon.Uniforms, DrawCommon.Attributes, DrawCommon.Props>,
) {
  return regl<HsAdvCalcNormals.Uniforms, HsAdvCalcNormals.Attributes, HsAdvCalcNormals.Props>({
    ...commonConfig,
    vert: vertSingleNotTransformed,
    frag: fragHsAdvNormals,
    uniforms: {
      ...commonConfig.uniforms as DrawCommon.Uniforms,
      tInput: regl.prop<HsAdvCalcNormals.Props, 'tInput'>("tInput"),
      pixelScale: regl.prop<HsAdvCalcNormals.Props, 'pixelScale'>("pixelScale"),
      onePixel: regl.prop<HsAdvCalcNormals.Props, 'onePixel'>("onePixel"),
    },
    attributes: {
      position: [[-1, 1], [1, 1], [-1, -1], [1, -1]],
      texCoord: [[0, 1], [1, 1], [0, 0], [1, 0]],
    },
    framebuffer: regl.prop<HsAdvCalcNormals.Props, 'fbo'>("fbo"),
  });
}

/**
 * The resulting Regl DrawCommand is used to show hillshading without shadows.
 * Not currently used
 */
export function createHsAdvDirectLightning(
  regl: REGL.Regl,
  commonConfig: REGL.DrawConfig<DrawCommon.Uniforms, DrawCommon.Attributes, DrawCommon.Props>,
) {
  return regl<HsAdvDirectLightning.Uniforms, HsAdvDirectLightning.Attributes, HsAdvDirectLightning.Props>({
    ...commonConfig,
    vert: vertSingleNotTransformed,
    frag: fragHsAdvDirectLight,
    uniforms: {
      ...commonConfig.uniforms as DrawCommon.Uniforms,
      scaleLength: regl.prop<HsAdvDirectLightning.Props, 'scaleLength'>('scaleLength'),
      sentinelLength: regl.prop<HsAdvDirectLightning.Props, 'sentinelLength'>('sentinelLength'),
      scaleColormap: regl.prop<HsAdvDirectLightning.Props, 'scaleColormap'>('scaleColormap'),
      sentinelColormap: regl.prop<HsAdvDirectLightning.Props, 'sentinelColormap'>('sentinelColormap'),
      tInput: regl.prop<HsAdvDirectLightning.Props, 'tInput'>("tInput"),
      tNormal: regl.prop<HsAdvDirectLightning.Props, 'tNormal'>("tNormal"),
      floatScale: regl.prop<HsAdvDirectLightning.Props, 'floatScale'>("floatScale"),
      sunDirection: regl.prop<HsAdvDirectLightning.Props, 'sunDirection'>("sunDirection"),
    },
    attributes: {
      position: [[-1, 1], [1, 1], [-1, -1], [1, -1]],
      texCoord: [[0, 1], [1, 1], [0, 0], [1, 0]],
    },
  });
}

/**
 * The resulting Regl DrawCommand is used to calculate soft shadows.
 */
export function createHsAdvSoftShadows(
  regl: REGL.Regl,
  commonConfig: REGL.DrawConfig<DrawCommon.Uniforms, DrawCommon.Attributes, DrawCommon.Props>,
) {
  return regl<HsAdvSoftShadows.Uniforms, HsAdvSoftShadows.Attributes, HsAdvSoftShadows.Props>({
    ...commonConfig,
    vert: vertSingleNotTransformed,
    frag: fragHsAdvSoftShadows,
    uniforms: {
      ...commonConfig.uniforms as DrawCommon.Uniforms,
      tInput: regl.prop<HsAdvSoftShadows.Props, 'tInput'>("tInput"),
      tNormal: regl.prop<HsAdvSoftShadows.Props, 'tNormal'>("tNormal"),
      tSrc: regl.prop<HsAdvSoftShadows.Props, 'tSrc'>("tSrc"),
      softIterations: regl.prop<HsAdvSoftShadows.Props, 'softIterations'>("softIterations"),
      pixelScale: regl.prop<HsAdvSoftShadows.Props, 'pixelScale'>("pixelScale"),
      resolution: regl.prop<HsAdvSoftShadows.Props, 'resolution'>("resolution"),
      sunDirection: regl.prop<HsAdvSoftShadows.Props, 'sunDirection'>("sunDirection"),
    },
    attributes: {
      position: [[-1, 1], [1, 1], [-1, -1], [1, -1]],
      texCoord: [[1/3, 2/3], [2/3, 2/3], [1/3, 1/3], [2/3, 1/3]],
    },
    framebuffer: regl.prop<HsAdvSoftShadows.Props, 'fbo'>("fbo"),
  });
}

/**
 * The resulting Regl DrawCommand is used to calculate ambient lighting.
 */
export function createHsAdvAmbientShadows(
  regl: REGL.Regl,
  commonConfig: REGL.DrawConfig<DrawCommon.Uniforms, DrawCommon.Attributes, DrawCommon.Props>,
) {
  return regl<HsAdvAmbientShadows.Uniforms, HsAdvAmbientShadows.Attributes, HsAdvAmbientShadows.Props>({
    ...commonConfig,
    vert: vertSingleNotTransformed,
    frag: fragHsAdvAmbientShadows,
    uniforms: {
      ...commonConfig.uniforms as DrawCommon.Uniforms,
      tInput: regl.prop<HsAdvAmbientShadows.Props, 'tInput'>("tInput"),
      tNormal: regl.prop<HsAdvAmbientShadows.Props, 'tNormal'>("tNormal"),
      tSrc: regl.prop<HsAdvAmbientShadows.Props, 'tSrc'>("tSrc"),
      ambientIterations: regl.prop<HsAdvAmbientShadows.Props, 'ambientIterations'>("ambientIterations"),
      pixelScale: regl.prop<HsAdvAmbientShadows.Props, 'pixelScale'>("pixelScale"),
      resolution: regl.prop<HsAdvAmbientShadows.Props, 'resolution'>("resolution"),
      direction: regl.prop<HsAdvAmbientShadows.Props, 'direction'>("direction"),
    },
    attributes: {
      position: [[-1, 1], [1, 1], [-1, -1], [1, -1]],
      texCoord: [[1/3, 2/3], [2/3, 2/3], [1/3, 1/3], [2/3, 1/3]],
    },
    framebuffer: regl.prop<HsAdvAmbientShadows.Props, 'fbo'>("fbo"),
  });
}

/**
 * The resulting Regl DrawCommand is used to combine soft and ambient shading,
 * use the colormap on the input floats and apply the hillshading.
 */
export function createHsAdvFinalColorscale(
  regl: REGL.Regl,
  commonConfig: REGL.DrawConfig<DrawCommon.Uniforms, DrawCommon.Attributes, DrawCommon.Props>,
) {
  return regl<HsAdvFinalColorscale.Uniforms, HsAdvFinalColorscale.Attributes, HsAdvFinalColorscale.Props>({
    ...commonConfig,
    vert: vertDouble,
    frag: fragHsAdvFinalColorscale,
    uniforms: {
      ...commonConfig.uniforms as DrawCommon.Uniforms,
      scaleLength: regl.prop<HsAdvFinalColorscale.Props, 'scaleLength'>('scaleLength'),
      sentinelLength: regl.prop<HsAdvFinalColorscale.Props, 'sentinelLength'>('sentinelLength'),
      scaleColormap: regl.prop<HsAdvFinalColorscale.Props, 'scaleColormap'>('scaleColormap'),
      sentinelColormap: regl.prop<HsAdvFinalColorscale.Props, 'sentinelColormap'>('sentinelColormap'),
      tInput: regl.prop<HsAdvFinalColorscale.Props, 'tInput'>("tInput"),
      tSoftShadow: regl.prop<HsAdvFinalColorscale.Props, 'tSoftShadow'>("tSoftShadow"),
      tAmbient: regl.prop<HsAdvFinalColorscale.Props, 'tAmbient'>("tAmbient"),
      floatScale: regl.prop<HsAdvFinalColorscale.Props, 'floatScale'>("floatScale"),
      finalSoftMultiplier: regl.prop<HsAdvFinalColorscale.Props, 'finalSoftMultiplier'>("finalSoftMultiplier"),
      finalAmbientMultiplier: regl.prop<HsAdvFinalColorscale.Props, 'finalAmbientMultiplier'>("finalAmbientMultiplier"),
    },
    attributes: {
      ...commonConfig.attributes as DrawCommon.Attributes,
      texCoordA: [[1/3, 2/3], [2/3, 2/3], [1/3, 1/3], [2/3, 1/3]],
      texCoordB: [[0, 1], [1, 1], [0, 0], [1, 0]],
    },
  });
}

/**
 * The resulting Regl DrawCommand is used to combine soft and ambient shading,
 * use the baselayer tile and apply the hillshading.
 */
export function createHsAdvFinalBaselayer(
  regl: REGL.Regl,
  commonConfig: REGL.DrawConfig<DrawCommon.Uniforms, DrawCommon.Attributes, DrawCommon.Props>,
) {
  return regl<HsAdvFinalBaselayer.Uniforms, HsAdvFinalBaselayer.Attributes, HsAdvFinalBaselayer.Props>({
    ...commonConfig,
    vert: vertDouble,
    frag: fragHsAdvFinalBaselayer,
    uniforms: {
      ...commonConfig.uniforms as DrawCommon.Uniforms,
      tBase: regl.prop<HsAdvFinalBaselayer.Props, 'tBase'>("tBase"),
      tSoftShadow: regl.prop<HsAdvFinalBaselayer.Props, 'tSoftShadow'>("tSoftShadow"),
      tAmbient: regl.prop<HsAdvFinalBaselayer.Props, 'tAmbient'>("tAmbient"),
      finalSoftMultiplier: regl.prop<HsAdvFinalBaselayer.Props, 'finalSoftMultiplier'>("finalSoftMultiplier"),
      finalAmbientMultiplier: regl.prop<HsAdvFinalBaselayer.Props, 'finalAmbientMultiplier'>("finalAmbientMultiplier"),
    },
    attributes: {
      ...commonConfig.attributes as DrawCommon.Attributes,
      texCoordA: regl.prop<HsAdvFinalBaselayer.Props, 'baseTexCoords'>("baseTexCoords"),
      texCoordB: [[0, 1], [1, 1], [0, 0], [1, 0]],
    },
  });
}
