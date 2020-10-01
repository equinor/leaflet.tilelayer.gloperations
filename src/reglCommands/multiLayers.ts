import REGL from 'regl';

import vertSingle from '../shaders/vertex/single.vs';
import vertDouble from '../shaders/vertex/double.vs';
import vertMulti3 from '../shaders/vertex/multi3.vs';
import vertMulti4 from '../shaders/vertex/multi4.vs';
import vertMulti5 from '../shaders/vertex/multi5.vs';
import vertMulti6 from '../shaders/vertex/multi6.vs';

import fragMulti1Calc from '../shaders/fragment/multiAnalyze1Calc.fs';
import fragMulti2Calc from '../shaders/fragment/multiAnalyze2Calc.fs';
import fragMulti3Calc from '../shaders/fragment/multiAnalyze3Calc.fs';
import fragMulti4Calc from '../shaders/fragment/multiAnalyze4Calc.fs';
import fragMulti5Calc from '../shaders/fragment/multiAnalyze5Calc.fs';
import fragMulti6Calc from '../shaders/fragment/multiAnalyze6Calc.fs';
import fragDiffCalc from '../shaders/fragment/diffCalc.fs';
import fragDrawResult from '../shaders/fragment/drawResult.fs';

import {
	Dictionary,
	DrawCommon,
	CalcTileMultiAnalyze1,
	CalcTileMultiAnalyze2,
	CalcTileMultiAnalyze3,
	CalcTileMultiAnalyze4,
	CalcTileMultiAnalyze5,
	CalcTileMultiAnalyze6,
	DrawTileResult,
	CalcTileDiff,
} from '../types';

import * as util from '../util';


export function createCalcTileMultiAnalyze1Command(
  regl: REGL.Regl,
  commonConfig: REGL.DrawConfig<DrawCommon.Uniforms, DrawCommon.Attributes, DrawCommon.Props>,
) {
  return regl<
    CalcTileMultiAnalyze1.Uniforms,
    CalcTileMultiAnalyze1.Attributes,
    CalcTileMultiAnalyze1.Props
  >({
    ...commonConfig,
    vert: vertSingle,
    frag: fragMulti1Calc,
    depth: {
      enable: false
    },
    uniforms: {
      ...commonConfig.uniforms as DrawCommon.Uniforms,
      filterLowA: (_, { filterLowA }) => filterLowA,
      filterHighA: (_, { filterHighA }) => filterHighA,
      multiplierA: (_, { multiplierA }) => multiplierA,
      textureA: (_, { textureA }) => textureA,
    },
    attributes: {
      ...commonConfig.attributes as DrawCommon.Attributes,
      texCoord: (_, { textureBoundsA }) => util.getTexCoordVerticesTriangleStripQuad(textureBoundsA),
    },
    framebuffer: regl.prop<CalcTileMultiAnalyze1.Props, 'fbo'>("fbo"),
  });
}

export function createCalcTileMultiAnalyze2Command(
  regl: REGL.Regl,
  commonConfig: REGL.DrawConfig<DrawCommon.Uniforms, DrawCommon.Attributes, DrawCommon.Props>,
) {
  return regl<
    CalcTileMultiAnalyze2.Uniforms,
    CalcTileMultiAnalyze2.Attributes,
    CalcTileMultiAnalyze2.Props
  >({
    ...commonConfig,
    vert: vertDouble,
    frag: fragMulti2Calc,
    depth:  {
      enable: false
    },
    uniforms: {
      ...commonConfig.uniforms as DrawCommon.Uniforms,
      filterLowA: (_, { filterLowA }) => filterLowA,
      filterHighA: (_, { filterHighA }) => filterHighA,
      filterLowB: (_, { filterLowB }) => filterLowB,
      filterHighB: (_, { filterHighB }) => filterHighB,
      multiplierA: (_, { multiplierA }) => multiplierA,
      multiplierB: (_, { multiplierB }) => multiplierB,
      textureA: (_, { textureA }) => textureA,
      textureB: (_, { textureB }) => textureB,
    },
    attributes: {
      ...commonConfig.attributes as DrawCommon.Attributes,
      texCoordA: (_, { textureBoundsA }) => util.getTexCoordVerticesTriangleStripQuad(textureBoundsA),
      texCoordB: (_, { textureBoundsB }) => util.getTexCoordVerticesTriangleStripQuad(textureBoundsB),
    },
    framebuffer: regl.prop<CalcTileMultiAnalyze2.Props, 'fbo'>("fbo"),
  });
}

export function createCalcTileMultiAnalyze3Command(
  regl: REGL.Regl,
  commonConfig: REGL.DrawConfig<DrawCommon.Uniforms, DrawCommon.Attributes, DrawCommon.Props>,
) {
  return regl<
    CalcTileMultiAnalyze3.Uniforms,
    CalcTileMultiAnalyze3.Attributes,
    CalcTileMultiAnalyze3.Props
  >({
    ...commonConfig,
    vert: vertMulti3,
    frag: fragMulti3Calc,
    depth:  {
      enable: false
    },
    uniforms: {
      ...commonConfig.uniforms as DrawCommon.Uniforms,
      filterLowA: (_, { filterLowA }) => filterLowA,
      filterHighA: (_, { filterHighA }) => filterHighA,
      filterLowB: (_, { filterLowB }) => filterLowB,
      filterHighB: (_, { filterHighB }) => filterHighB,
      filterLowC: (_, { filterLowC }) => filterLowC,
      filterHighC: (_, { filterHighC }) => filterHighC,
      multiplierA: (_, { multiplierA }) => multiplierA,
      multiplierB: (_, { multiplierB }) => multiplierB,
      multiplierC: (_, { multiplierC }) => multiplierC,
      textureA: (_, { textureA }) => textureA,
      textureB: (_, { textureB }) => textureB,
      textureC: (_, { textureC }) => textureC,
    },
    attributes: {
      ...commonConfig.attributes as DrawCommon.Attributes,
      texCoordA: (_, { textureBoundsA }) => util.getTexCoordVerticesTriangleStripQuad(textureBoundsA),
      texCoordB: (_, { textureBoundsB }) => util.getTexCoordVerticesTriangleStripQuad(textureBoundsB),
      texCoordC: (_, { textureBoundsC }) => util.getTexCoordVerticesTriangleStripQuad(textureBoundsC),
    },
    framebuffer: regl.prop<CalcTileMultiAnalyze3.Props, 'fbo'>("fbo"),
  });
}

export function createCalcTileMultiAnalyze4Command(
  regl: REGL.Regl,
  commonConfig: REGL.DrawConfig<DrawCommon.Uniforms, DrawCommon.Attributes, DrawCommon.Props>,
) {
  return regl<
    CalcTileMultiAnalyze4.Uniforms,
    CalcTileMultiAnalyze4.Attributes,
    CalcTileMultiAnalyze4.Props
  >({
    ...commonConfig,
    vert: vertMulti4,
    frag: fragMulti4Calc,
    depth: {
      enable: false
    },
    uniforms: {
      ...commonConfig.uniforms as DrawCommon.Uniforms,
      filterLowA: (_, { filterLowA }) => filterLowA,
      filterHighA: (_, { filterHighA }) => filterHighA,
      filterLowB: (_, { filterLowB }) => filterLowB,
      filterHighB: (_, { filterHighB }) => filterHighB,
      filterLowC: (_, { filterLowC }) => filterLowC,
      filterHighC: (_, { filterHighC }) => filterHighC,
      filterLowD: (_, { filterLowD }) => filterLowD,
      filterHighD: (_, { filterHighD }) => filterHighD,
      multiplierA: (_, { multiplierA }) => multiplierA,
      multiplierB: (_, { multiplierB }) => multiplierB,
      multiplierC: (_, { multiplierC }) => multiplierC,
      multiplierD: (_, { multiplierD }) => multiplierD,
      textureA: (_, { textureA }) => textureA,
      textureB: (_, { textureB }) => textureB,
      textureC: (_, { textureC }) => textureC,
      textureD: (_, { textureD }) => textureD,
    },
    attributes: {
      ...commonConfig.attributes as DrawCommon.Attributes,
      texCoordA: (_, { textureBoundsA }) => util.getTexCoordVerticesTriangleStripQuad(textureBoundsA),
      texCoordB: (_, { textureBoundsB }) => util.getTexCoordVerticesTriangleStripQuad(textureBoundsB),
      texCoordC: (_, { textureBoundsC }) => util.getTexCoordVerticesTriangleStripQuad(textureBoundsC),
      texCoordD: (_, { textureBoundsD }) => util.getTexCoordVerticesTriangleStripQuad(textureBoundsD),
    },
    framebuffer: regl.prop<CalcTileMultiAnalyze1.Props, 'fbo'>("fbo"),
  });
}

export function createCalcTileMultiAnalyze5Command(
  regl: REGL.Regl,
  commonConfig: REGL.DrawConfig<DrawCommon.Uniforms, DrawCommon.Attributes, DrawCommon.Props>,
) {
  return regl<
    CalcTileMultiAnalyze5.Uniforms,
    CalcTileMultiAnalyze5.Attributes,
    CalcTileMultiAnalyze5.Props
  >({
    ...commonConfig,
    vert: vertMulti5,
    frag: fragMulti5Calc,
    depth: {
      enable: false
    },
    uniforms: {
      ...commonConfig.uniforms as DrawCommon.Uniforms,
      filterLowA: (_, { filterLowA }) => filterLowA,
      filterHighA: (_, { filterHighA }) => filterHighA,
      filterLowB: (_, { filterLowB }) => filterLowB,
      filterHighB: (_, { filterHighB }) => filterHighB,
      filterLowC: (_, { filterLowC }) => filterLowC,
      filterHighC: (_, { filterHighC }) => filterHighC,
      filterLowD: (_, { filterLowD }) => filterLowD,
      filterHighD: (_, { filterHighD }) => filterHighD,
      filterLowE: (_, { filterLowE }) => filterLowE,
      filterHighE: (_, { filterHighE }) => filterHighE,
      multiplierA: (_, { multiplierA }) => multiplierA,
      multiplierB: (_, { multiplierB }) => multiplierB,
      multiplierC: (_, { multiplierC }) => multiplierC,
      multiplierD: (_, { multiplierD }) => multiplierD,
      multiplierE: (_, { multiplierE }) => multiplierE,
      textureA: (_, { textureA }) => textureA,
      textureB: (_, { textureB }) => textureB,
      textureC: (_, { textureC }) => textureC,
      textureD: (_, { textureD }) => textureD,
      textureE: (_, { textureE }) => textureE,
    },
    attributes: {
      ...commonConfig.attributes as DrawCommon.Attributes,
      texCoordA: (_, { textureBoundsA }) => util.getTexCoordVerticesTriangleStripQuad(textureBoundsA),
      texCoordB: (_, { textureBoundsB }) => util.getTexCoordVerticesTriangleStripQuad(textureBoundsB),
      texCoordC: (_, { textureBoundsC }) => util.getTexCoordVerticesTriangleStripQuad(textureBoundsC),
      texCoordD: (_, { textureBoundsD }) => util.getTexCoordVerticesTriangleStripQuad(textureBoundsD),
      texCoordE: (_, { textureBoundsE }) => util.getTexCoordVerticesTriangleStripQuad(textureBoundsE),
    },
    framebuffer: regl.prop<CalcTileMultiAnalyze5.Props, 'fbo'>("fbo"),
  });
}

export function createCalcTileMultiAnalyze6Command(
  regl: REGL.Regl,
  commonConfig: REGL.DrawConfig<DrawCommon.Uniforms, DrawCommon.Attributes, DrawCommon.Props>,
) {
  return regl<
    CalcTileMultiAnalyze6.Uniforms,
    CalcTileMultiAnalyze6.Attributes,
    CalcTileMultiAnalyze6.Props
  >({
    ...commonConfig,
    vert: vertMulti6,
    frag: fragMulti6Calc,
    depth:  {
      enable: false
    },
    uniforms: {
      ...commonConfig.uniforms as DrawCommon.Uniforms,
      filterLowA: (_, { filterLowA }) => filterLowA,
      filterHighA: (_, { filterHighA }) => filterHighA,
      filterLowB: (_, { filterLowB }) => filterLowB,
      filterHighB: (_, { filterHighB }) => filterHighB,
      filterLowC: (_, { filterLowC }) => filterLowC,
      filterHighC: (_, { filterHighC }) => filterHighC,
      filterLowD: (_, { filterLowD }) => filterLowD,
      filterHighD: (_, { filterHighD }) => filterHighD,
      filterLowE: (_, { filterLowE }) => filterLowE,
      filterHighE: (_, { filterHighE }) => filterHighE,
      filterLowF: (_, { filterLowF }) => filterLowF,
      filterHighF: (_, { filterHighF }) => filterHighF,
      multiplierA: (_, { multiplierA }) => multiplierA,
      multiplierB: (_, { multiplierB }) => multiplierB,
      multiplierC: (_, { multiplierC }) => multiplierC,
      multiplierD: (_, { multiplierD }) => multiplierD,
      multiplierE: (_, { multiplierE }) => multiplierE,
      multiplierF: (_, { multiplierF }) => multiplierF,
      textureA: (_, { textureA }) => textureA,
      textureB: (_, { textureB }) => textureB,
      textureC: (_, { textureC }) => textureC,
      textureD: (_, { textureD }) => textureD,
      textureE: (_, { textureE }) => textureE,
      textureF: (_, { textureF }) => textureF,
    },
    attributes: {
      ...commonConfig.attributes as DrawCommon.Attributes,
      texCoordA: (_, { textureBoundsA }) => util.getTexCoordVerticesTriangleStripQuad(textureBoundsA),
      texCoordB: (_, { textureBoundsB }) => util.getTexCoordVerticesTriangleStripQuad(textureBoundsB),
      texCoordC: (_, { textureBoundsC }) => util.getTexCoordVerticesTriangleStripQuad(textureBoundsC),
      texCoordD: (_, { textureBoundsD }) => util.getTexCoordVerticesTriangleStripQuad(textureBoundsD),
      texCoordE: (_, { textureBoundsE }) => util.getTexCoordVerticesTriangleStripQuad(textureBoundsE),
      texCoordF: (_, { textureBoundsF }) => util.getTexCoordVerticesTriangleStripQuad(textureBoundsF)
    },
    framebuffer: regl.prop<CalcTileMultiAnalyze6.Props, 'fbo'>("fbo"),
  });
}

export function createCalcTileDiffCommand(
  regl: REGL.Regl,
  commonConfig: REGL.DrawConfig<DrawCommon.Uniforms, DrawCommon.Attributes, DrawCommon.Props>,
) {
  return regl<
    CalcTileDiff.Uniforms,
    CalcTileDiff.Attributes,
    CalcTileDiff.Props
  >({
    ...commonConfig,
    vert: vertDouble,
    frag: fragDiffCalc,
    depth:  {
      enable: false
    },
    uniforms: {
      ...commonConfig.uniforms as DrawCommon.Uniforms,
      textureA: (_, { textureA }) => textureA,
      textureB: (_, { textureB }) => textureB,
    },
    attributes: {
      ...commonConfig.attributes as DrawCommon.Attributes,
      texCoordA: (_, { textureBoundsA }) => util.getTexCoordVerticesTriangleStripQuad(textureBoundsA),
      texCoordB: (_, { textureBoundsB }) => util.getTexCoordVerticesTriangleStripQuad(textureBoundsB),
    },
    framebuffer: regl.prop<CalcTileDiff.Props, 'fbo'>("fbo"),
  });
}

export function createDrawResultCommand(
  regl: REGL.Regl,
  commonConfig: REGL.DrawConfig<DrawCommon.Uniforms, DrawCommon.Attributes, DrawCommon.Props>,
  fragMacros: Dictionary<any>,
) {
  return regl<
    DrawTileResult.Uniforms,
    DrawTileResult.Attributes,
    DrawTileResult.Props
  >({
    ...commonConfig,
    vert: vertSingle,
    frag: util.defineMacros(fragDrawResult, fragMacros),
    depth:  {
      enable: false
    },
    uniforms: {
      ...commonConfig.uniforms as DrawCommon.Uniforms,
      scaleLength: regl.prop<DrawTileResult.Props, 'scaleLength'>('scaleLength'),
      sentinelLength: regl.prop<DrawTileResult.Props, 'sentinelLength'>('sentinelLength'),
      scaleColormap: regl.prop<DrawTileResult.Props, 'scaleColormap'>('scaleColormap'),
      sentinelColormap: regl.prop<DrawTileResult.Props, 'sentinelColormap'>('sentinelColormap'),
      texture: regl.prop<DrawTileResult.Props, 'texture'>("texture"),
    },
    attributes: {
      ...commonConfig.attributes as DrawCommon.Attributes,
      texCoord: [[0, 1], [1, 1], [0, 0], [1, 0]],
    },
  });
}
