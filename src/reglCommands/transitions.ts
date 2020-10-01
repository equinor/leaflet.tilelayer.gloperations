import REGL from 'regl';

import vertSingle from '../shaders/vertex/single.vs';
import vertDouble from '../shaders/vertex/double.vs';

import fragInterpolateColor from '../shaders/fragment/interpolateColor.fs';
import fragInterpolateColorOnly from '../shaders/fragment/interpolateColorOnly.fs';
import fragInterpolateValue from '../shaders/fragment/interpolateValue.fs';

import {
  Dictionary,
  DrawCommon,
  DrawTileInterpolateColor,
  DrawTileInterpolateColorOnly,
  DrawTileInterpolateValue,
} from '../types';

import * as util from '../util';

/**
 * The DrawCommand output by this function interpolates, for each pixel, between two values, one
 * from `textureA` and one from `textureB`. The same color scale / sentinel values are applied to
 * both.
 */
export function createDrawTileInterpolateValueCommand(
  regl: REGL.Regl,
  commonConfig: REGL.DrawConfig<DrawCommon.Uniforms, DrawCommon.Attributes, DrawCommon.Props>,
  fragMacros: Dictionary<any>,
) {
  return regl<
    DrawTileInterpolateValue.Uniforms,
    DrawTileInterpolateValue.Attributes,
    DrawTileInterpolateValue.Props
  >({
    ...commonConfig,
    vert: vertDouble,
    frag: util.defineMacros(fragInterpolateValue, fragMacros),
    uniforms: {
      ...commonConfig.uniforms as DrawCommon.Uniforms,
      scaleLength: regl.prop<DrawTileInterpolateValue.Props, 'scaleLength'>('scaleLength'),
      sentinelLength: regl.prop<DrawTileInterpolateValue.Props, 'sentinelLength'>('sentinelLength'),
      scaleColormap: regl.prop<DrawTileInterpolateValue.Props, 'scaleColormap'>('scaleColormap'),
      sentinelColormap: regl.prop<DrawTileInterpolateValue.Props, 'sentinelColormap'>('sentinelColormap'),
      textureA: (_, { textureA }) => textureA,
      textureB: (_, { textureB }) => textureB,
      interpolationFraction: (_, { interpolationFraction }) => interpolationFraction,
    },
    attributes: {
      ...commonConfig.attributes as DrawCommon.Attributes,
      texCoordA: (_, { textureBoundsA }) => util.getTexCoordVerticesTriangleStripQuad(textureBoundsA),
      texCoordB: (_, { textureBoundsB }) => util.getTexCoordVerticesTriangleStripQuad(textureBoundsB),
    },
  });
}

/**
 * The behavior of this DrawCommand is similar to the one above, except that pixels from `textureA`
 * are colorized with one color scale / set of sentinel values, while pixels from `textureB` use a
 * different color scale / set of sentinel values.
 */
export function createDrawTileInterpolateColorCommand(
  regl: REGL.Regl,
  commonConfig: REGL.DrawConfig<DrawCommon.Uniforms, DrawCommon.Attributes, DrawCommon.Props>,
  fragMacros: Dictionary<any>,
) {
  return regl<
    DrawTileInterpolateColor.Uniforms,
    DrawTileInterpolateColor.Attributes,
    DrawTileInterpolateColor.Props
  >({
    ...commonConfig,
    vert: vertDouble,
    frag: util.defineMacros(fragInterpolateColor, fragMacros),
    uniforms: {
      ...commonConfig.uniforms as DrawCommon.Uniforms,
      scaleLengthA: regl.prop<DrawTileInterpolateColor.Props, 'scaleLengthA'>('scaleLengthA'),
      sentinelLengthA: regl.prop<DrawTileInterpolateColor.Props, 'sentinelLengthA'>('sentinelLengthA'),
      scaleColormapA: regl.prop<DrawTileInterpolateColor.Props, 'scaleColormapA'>('scaleColormapA'),
      sentinelColormapA: regl.prop<DrawTileInterpolateColor.Props, 'sentinelColormapA'>('sentinelColormapA'),
      scaleLengthB: regl.prop<DrawTileInterpolateColor.Props, 'scaleLengthB'>('scaleLengthB'),
      sentinelLengthB: regl.prop<DrawTileInterpolateColor.Props, 'sentinelLengthB'>('sentinelLengthB'),
      scaleColormapB: regl.prop<DrawTileInterpolateColor.Props, 'scaleColormapB'>('scaleColormapB'),
      sentinelColormapB: regl.prop<DrawTileInterpolateColor.Props, 'sentinelColormapB'>('sentinelColormapB'),
      textureA: (_, { textureA }) => textureA,
      textureB: (_, { textureB }) => textureB,
      interpolationFraction: (_, { interpolationFraction }) => interpolationFraction,
    },
    attributes: {
      ...commonConfig.attributes as DrawCommon.Attributes,
      texCoordA: (_, { textureBoundsA }) => util.getTexCoordVerticesTriangleStripQuad(textureBoundsA),
      texCoordB: (_, { textureBoundsB }) => util.getTexCoordVerticesTriangleStripQuad(textureBoundsB),
    },
  });
}

/**
 * The behavior of this DrawCommand is similar to the one above, except that the pixel values
 * are the same. Only the colorscale changes.
 */
export function createDrawTileInterpolateColorOnlyCommand(
  regl: REGL.Regl,
  commonConfig: REGL.DrawConfig<DrawCommon.Uniforms, DrawCommon.Attributes, DrawCommon.Props>,
  fragMacros: Dictionary<any>,
) {
  return regl<
    DrawTileInterpolateColorOnly.Uniforms,
    DrawTileInterpolateColorOnly.Attributes,
    DrawTileInterpolateColorOnly.Props
  >({
    ...commonConfig,
    vert: vertSingle,
    frag: util.defineMacros(fragInterpolateColorOnly, fragMacros),
    uniforms: {
      ...commonConfig.uniforms as DrawCommon.Uniforms,
      scaleLengthA: regl.prop<DrawTileInterpolateColorOnly.Props, 'scaleLengthA'>('scaleLengthA'),
      sentinelLengthA: regl.prop<DrawTileInterpolateColorOnly.Props, 'sentinelLengthA'>('sentinelLengthA'),
      scaleColormapA: regl.prop<DrawTileInterpolateColorOnly.Props, 'scaleColormapA'>('scaleColormapA'),
      sentinelColormapA: regl.prop<DrawTileInterpolateColorOnly.Props, 'sentinelColormapA'>('sentinelColormapA'),
      scaleLengthB: regl.prop<DrawTileInterpolateColorOnly.Props, 'scaleLengthB'>('scaleLengthB'),
      sentinelLengthB: regl.prop<DrawTileInterpolateColorOnly.Props, 'sentinelLengthB'>('sentinelLengthB'),
      scaleColormapB: regl.prop<DrawTileInterpolateColorOnly.Props, 'scaleColormapB'>('scaleColormapB'),
      sentinelColormapB: regl.prop<DrawTileInterpolateColorOnly.Props, 'sentinelColormapB'>('sentinelColormapB'),
      texture: (_, { texture }) => texture,
      interpolationFraction: (_, { interpolationFraction }) => interpolationFraction,
    },
    attributes: {
      ...commonConfig.attributes as DrawCommon.Attributes,
      texCoord: (_, { textureBounds }) => util.getTexCoordVerticesTriangleStripQuad(textureBounds),
    },
  });
}
