import REGL from 'regl';

import vertSingle from '../shaders/vertex/single.vs';

import fragSingle from '../shaders/fragment/single.fs';

import {
	Dictionary,
	DrawCommon,
	DrawTile,
} from '../types';

import {
	DEG2RAD,
	SLOPEFACTOR,
} from '../constants';

import * as util from '../util';

/**
 * The resulting Regl DrawCommand is used to draw a single tile. The fragment shader decodes the
 * Float32 value of a pixel and colorizes it with the given color scale (and/or sentinel values).
 */
export function createDrawTileCommand(
	regl: REGL.Regl,
	commonConfig: REGL.DrawConfig<DrawCommon.Uniforms, DrawCommon.Attributes, DrawCommon.Props>,
	fragMacros: Dictionary<any>,
) {
	return regl<DrawTile.Uniforms, DrawTile.Attributes, DrawTile.Props>({
	  ...commonConfig,
	  vert: vertSingle,
	  frag: util.defineMacros(fragSingle, fragMacros),
	  uniforms: {
		...commonConfig.uniforms as DrawCommon.Uniforms,
		scaleLength: regl.prop<DrawTile.Props, 'scaleLength'>('scaleLength'),
		sentinelLength: regl.prop<DrawTile.Props, 'sentinelLength'>('sentinelLength'),
		scaleColormap: regl.prop<DrawTile.Props, 'scaleColormap'>('scaleColormap'),
		sentinelColormap: regl.prop<DrawTile.Props, 'sentinelColormap'>('sentinelColormap'),
		texture: (_, { texture }) => texture,
		enableSimpleHillshade: (_, { enableSimpleHillshade }) => enableSimpleHillshade,
		offset: 0,
		azimuth: 0,
		altitude: 0,
		slopescale: 0,
		deg2rad: DEG2RAD,
		slopeFactor: SLOPEFACTOR,
		tileSize: 0,
		textureSize: 0,
		textureBounds: [0, 0, 0, 0],
	  },
	  attributes: {
		...commonConfig.attributes as DrawCommon.Attributes,
		texCoord: (_, { textureBounds }) => util.getTexCoordVerticesTriangleStripQuad(textureBounds),
	  },
	});
}