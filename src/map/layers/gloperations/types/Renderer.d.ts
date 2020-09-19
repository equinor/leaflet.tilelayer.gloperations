import REGL from 'regl';
import TextureManager from './TextureManager';
import { Color, SentinelValue, DrawTile, DrawTileHsSimple, DrawTileHsPregen, DrawTileInterpolateColor, DrawTileInterpolateColorOnly, DrawTileInterpolateValue, CalcTileMultiAnalyze1, CalcTileMultiAnalyze2, CalcTileMultiAnalyze3, CalcTileMultiAnalyze4, CalcTileMultiAnalyze5, CalcTileMultiAnalyze6, CalcTileDiff, ConvertDem, DrawTileResult, ConvolutionSmooth, Pair, calcResult, TileCoordinates, TileDatum, HillshadeOptions, HsAdvMergeAndScaleTiles, HsAdvCalcNormals, HsAdvDirectLightning, HsAdvSoftShadows, HsAdvAmbientShadows, HsAdvFinalColorscale, HsAdvFinalBaselayer } from './types';
import { vec3 } from "gl-matrix";
export default class Renderer {
    gloperations: any;
    canvas: HTMLCanvasElement;
    regl: REGL.Regl;
    nodataValue: number;
    textureManager: TextureManager;
    textureManagerA: TextureManager;
    textureManagerB: TextureManager;
    textureManagerC: TextureManager;
    textureManagerD: TextureManager;
    textureManagerE: TextureManager;
    textureManagerF: TextureManager;
    textureManagerHillshade: TextureManager;
    tileSize: number;
    scaleColormap: REGL.Texture2D;
    scaleColormapPrevious: REGL.Texture2D;
    sentinelColormap: REGL.Texture2D;
    sentinelColormapPrevious: REGL.Texture2D;
    scaleInput: Color[];
    scaleInputPrevious: Color[];
    sentinelInput: SentinelValue[];
    sentinelInputPrevious: SentinelValue[];
    maxTextureDimension: number;
    sunDirections: vec3[];
    ambientDirections: vec3[];
    drawTile: REGL.DrawCommand<REGL.DefaultContext, DrawTile.Props>;
    drawTileHsSimple: REGL.DrawCommand<REGL.DefaultContext, DrawTileHsSimple.Props>;
    drawTileHsPregen: REGL.DrawCommand<REGL.DefaultContext, DrawTileHsPregen.Props>;
    drawTileInterpolateColor: REGL.DrawCommand<REGL.DefaultContext, DrawTileInterpolateColor.Props>;
    drawTileInterpolateColorOnly: REGL.DrawCommand<REGL.DefaultContext, DrawTileInterpolateColorOnly.Props>;
    drawTileInterpolateValue: REGL.DrawCommand<REGL.DefaultContext, DrawTileInterpolateValue.Props>;
    calcTileDiff: REGL.DrawCommand<REGL.DefaultContext, CalcTileDiff.Props>;
    convertDem: REGL.DrawCommand<REGL.DefaultContext, ConvertDem.Props>;
    drawTileResult: REGL.DrawCommand<REGL.DefaultContext, DrawTileResult.Props>;
    calcTileMultiAnalyze1: REGL.DrawCommand<REGL.DefaultContext, CalcTileMultiAnalyze1.Props>;
    calcTileMultiAnalyze2: REGL.DrawCommand<REGL.DefaultContext, CalcTileMultiAnalyze2.Props>;
    calcTileMultiAnalyze3: REGL.DrawCommand<REGL.DefaultContext, CalcTileMultiAnalyze3.Props>;
    calcTileMultiAnalyze4: REGL.DrawCommand<REGL.DefaultContext, CalcTileMultiAnalyze4.Props>;
    calcTileMultiAnalyze5: REGL.DrawCommand<REGL.DefaultContext, CalcTileMultiAnalyze5.Props>;
    calcTileMultiAnalyze6: REGL.DrawCommand<REGL.DefaultContext, CalcTileMultiAnalyze6.Props>;
    convolutionSmooth: REGL.DrawCommand<REGL.DefaultContext, ConvolutionSmooth.Props>;
    HsAdvMergeAndScaleTiles: REGL.DrawCommand<REGL.DefaultContext, HsAdvMergeAndScaleTiles.Props>;
    HsAdvCalcNormals: REGL.DrawCommand<REGL.DefaultContext, HsAdvCalcNormals.Props>;
    HsAdvDirectLightning: REGL.DrawCommand<REGL.DefaultContext, HsAdvDirectLightning.Props>;
    HsAdvSoftShadows: REGL.DrawCommand<REGL.DefaultContext, HsAdvSoftShadows.Props>;
    HsAdvAmbientShadows: REGL.DrawCommand<REGL.DefaultContext, HsAdvAmbientShadows.Props>;
    HsAdvFinalColorscale: REGL.DrawCommand<REGL.DefaultContext, HsAdvFinalColorscale.Props>;
    HsAdvFinalBaselayer: REGL.DrawCommand<REGL.DefaultContext, HsAdvFinalBaselayer.Props>;
    constructor(gloperations: any, tileSize: number, nodataValue: number, scaleInput: Color[], sentinelInput: SentinelValue[], colorscaleMaxLength: number, sentinelMaxLength: number);
    findMaxTextureDimension(): number;
    setMaxTextureDimension(newMaxTextureDimension: number): void;
    updateColorscale(scaleInput: Color[]): void;
    updateSentinels(sentinelInput: SentinelValue[]): void;
    renderTile({ coords, pixelData }: TileDatum, _hillshadeOptions: HillshadeOptions, zoom: number): Pair<number>;
    renderTileHsPregen(tileDatum: TileDatum, tileDatumHs: TileDatum): Pair<number>;
    flipReadPixelsUint(width: number, height: number, pixels: Uint8Array): Uint8Array;
    renderTileDiff(tileDatumA: TileDatum, tileDatumB: TileDatum): calcResult;
    renderConvertDem(pixelData: Uint8Array): Uint8Array;
    renderConvolutionSmooth(inputData: Uint8Array, width: number, height: number, kernelSize: number): Float32Array;
    renderTileHsAdvanced(_hillshadeOptions: HillshadeOptions, zoom: number, textureCoords: number[][], pixelScale: number, baselayerTexCoords: number[][]): Pair<number>;
    renderTileMulti1(tileDatumA: TileDatum, filterLowA: number, filterHighA: number, multiplierA: number): calcResult;
    renderTileMulti2(tileDatumA: TileDatum, tileDatumB: TileDatum, filterLowA: number, filterHighA: number, filterLowB: number, filterHighB: number, multiplierA: number, multiplierB: number): calcResult;
    renderTileMulti3(tileDatumA: TileDatum, tileDatumB: TileDatum, tileDatumC: TileDatum, filterLowA: number, filterHighA: number, filterLowB: number, filterHighB: number, filterLowC: number, filterHighC: number, multiplierA: number, multiplierB: number, multiplierC: number): calcResult;
    renderTileMulti4(tileDatumA: TileDatum, tileDatumB: TileDatum, tileDatumC: TileDatum, tileDatumD: TileDatum, filterLowA: number, filterHighA: number, filterLowB: number, filterHighB: number, filterLowC: number, filterHighC: number, filterLowD: number, filterHighD: number, multiplierA: number, multiplierB: number, multiplierC: number, multiplierD: number): calcResult;
    renderTileMulti5(tileDatumA: TileDatum, tileDatumB: TileDatum, tileDatumC: TileDatum, tileDatumD: TileDatum, tileDatumE: TileDatum, filterLowA: number, filterHighA: number, filterLowB: number, filterHighB: number, filterLowC: number, filterHighC: number, filterLowD: number, filterHighD: number, filterLowE: number, filterHighE: number, multiplierA: number, multiplierB: number, multiplierC: number, multiplierD: number, multiplierE: number): calcResult;
    renderTileMulti6(tileDatumA: TileDatum, tileDatumB: TileDatum, tileDatumC: TileDatum, tileDatumD: TileDatum, tileDatumE: TileDatum, tileDatumF: TileDatum, filterLowA: number, filterHighA: number, filterLowB: number, filterHighB: number, filterLowC: number, filterHighC: number, filterLowD: number, filterHighD: number, filterLowE: number, filterHighE: number, filterLowF: number, filterHighF: number, multiplierA: number, multiplierB: number, multiplierC: number, multiplierD: number, multiplierE: number, multiplierF: number): calcResult;
    renderTiles(tiles: TileDatum[], _hillshadeOptions: HillshadeOptions, zoom: number): Array<Pair<number>>;
    renderTilesHsPregen(tiles: TileDatum[], tilesHs: TileDatum[]): Array<Pair<number>>;
    renderTilesHsAdvanced(tiles: TileDatum[], _hillshadeOptions: HillshadeOptions, url: string, zoom: number, pixelScale: number): Array<Pair<number>>;
    renderTilesWithDiff(tilesA: TileDatum[], tilesB: TileDatum[], onFrameRendered: (canvasCoordinates: Array<Pair<number>>) => void): Uint8Array[];
    renderTilesWithMultiAnalyze1(tilesA: TileDatum[], filterLowA: number, filterHighA: number, multiplierA: number, onFrameRendered: (canvasCoordinates: Array<Pair<number>>) => void): Uint8Array[];
    renderTilesWithMultiAnalyze2(tilesA: TileDatum[], tilesB: TileDatum[], filterLowA: number, filterHighA: number, filterLowB: number, filterHighB: number, multiplierA: number, multiplierB: number, onFrameRendered: (canvasCoordinates: Array<Pair<number>>) => void): Uint8Array[];
    renderTilesWithMultiAnalyze3(tilesA: TileDatum[], tilesB: TileDatum[], tilesC: TileDatum[], filterLowA: number, filterHighA: number, filterLowB: number, filterHighB: number, filterLowC: number, filterHighC: number, multiplierA: number, multiplierB: number, multiplierC: number, onFrameRendered: (canvasCoordinates: Array<Pair<number>>) => void): Uint8Array[];
    renderTilesWithMultiAnalyze4(tilesA: TileDatum[], tilesB: TileDatum[], tilesC: TileDatum[], tilesD: TileDatum[], filterLowA: number, filterHighA: number, filterLowB: number, filterHighB: number, filterLowC: number, filterHighC: number, filterLowD: number, filterHighD: number, multiplierA: number, multiplierB: number, multiplierC: number, multiplierD: number, onFrameRendered: (canvasCoordinates: Array<Pair<number>>) => void): Uint8Array[];
    renderTilesWithMultiAnalyze5(tilesA: TileDatum[], tilesB: TileDatum[], tilesC: TileDatum[], tilesD: TileDatum[], tilesE: TileDatum[], filterLowA: number, filterHighA: number, filterLowB: number, filterHighB: number, filterLowC: number, filterHighC: number, filterLowD: number, filterHighD: number, filterLowE: number, filterHighE: number, multiplierA: number, multiplierB: number, multiplierC: number, multiplierD: number, multiplierE: number, onFrameRendered: (canvasCoordinates: Array<Pair<number>>) => void): Uint8Array[];
    renderTilesWithMultiAnalyze6(tilesA: TileDatum[], tilesB: TileDatum[], tilesC: TileDatum[], tilesD: TileDatum[], tilesE: TileDatum[], tilesF: TileDatum[], filterLowA: number, filterHighA: number, filterLowB: number, filterHighB: number, filterLowC: number, filterHighC: number, filterLowD: number, filterHighD: number, filterLowE: number, filterHighE: number, filterLowF: number, filterHighF: number, multiplierA: number, multiplierB: number, multiplierC: number, multiplierD: number, multiplierE: number, multiplierF: number, onFrameRendered: (canvasCoordinates: Array<Pair<number>>) => void): Uint8Array[];
    renderTilesWithTransition(oldTiles: TileDatum[], newTiles: TileDatum[], transitionDurationMs: number, onFrameRendered: (canvasCoordinates: Array<Pair<number>>) => void): Promise<void>;
    renderTilesWithTransitionAndNewColorScale(oldTiles: TileDatum[], newTiles: TileDatum[], transitionDurationMs: number, onFrameRendered: (canvasCoordinates: Array<Pair<number>>) => void): Promise<void>;
    renderTilesWithTransitionAndNewColorScaleOnly(tiles: TileDatum[], transitionDurationMs: number, onFrameRendered: (canvasCoordinates: Array<Pair<number>>) => void): Promise<void>;
    generateSunDirections(iterations: number, sunRadiusMultiplier: number): void;
    generateAmbientDirections(iterations: number): void;
    removeTile(tileCoordinates: TileCoordinates): void;
    protected setCanvasSize(width: number, height: number): void;
    protected computeRequiredCanvasDimensions(numTiles: number): Pair<number>;
    protected getCanvasCoordinates(canvasWidth: number, canvasHeight: number, numTiles: number): Array<Pair<number>>;
}
