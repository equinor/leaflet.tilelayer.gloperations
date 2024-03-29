import * as L from 'leaflet';
import {
  chunk,
  flatMap,
  zipWith,
} from 'lodash-es';
import REGL, { Framebuffer2D } from 'regl';

import {
  CLEAR_COLOR,
  MAX_TEXTURE_DIMENSION,
  EARTH_SUN_DISTANCE,
  SUN_RADIUS,
} from './constants';

import * as reglCommands from './reglCommands';
import TextureManager from './TextureManager';
import {
  Color,
  SentinelValue,
  DrawTile,
  DrawTileHsSimple,
  DrawTileHsPregen,
  DrawTileInterpolateColor,
  DrawTileInterpolateColorOnly,
  DrawTileInterpolateValue,
  CalcTileMultiAnalyze1,
  CalcTileMultiAnalyze2,
  CalcTileMultiAnalyze3,
  CalcTileMultiAnalyze4,
  CalcTileMultiAnalyze5,
  CalcTileMultiAnalyze6,
  CalcTileDiff,
  ConvertDem,
  DrawTileResult,
  ConvolutionSmooth,
  Pair,
  calcResult,
  TileCoordinates,
  TileDatum,
  HillshadeOptions,
  HsAdvMergeAndScaleTiles,
  HsAdvCalcNormals,
  HsAdvDirectLightning,
  HsAdvSoftShadows,
  HsAdvAmbientShadows,
  HsAdvFinalColorscale,
  HsAdvFinalBaselayer,
  HsAdvSmooth,
} from './types';

import * as util from './util';

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
  normalTextureDimension: number;
  maxTextureDimension: number;
  sunDirections: vec3[];
  ambientDirections: vec3[];

  // Regl draw commands.
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
  HsAdvSmooth: REGL.DrawCommand<REGL.DefaultContext, HsAdvSmooth.Props>;

  constructor(
    gloperations: any,
    tileSize: number,
    nodataValue: number,
    scaleInput: Color[],
    sentinelInput: SentinelValue[],
    colorscaleMaxLength: number,
    sentinelMaxLength: number
  ) {
    const canvas = L.DomUtil.create("canvas") as HTMLCanvasElement;
    let maxTextureDimension = MAX_TEXTURE_DIMENSION;
    let normalTextureDimension = 1024;

    const regl = REGL({
      canvas: canvas,
      // profile: true,
      // extension only used for advanced hillshading
      // TODO: add fallback to rgba if writing to float fails
      optionalExtensions: ["OES_texture_float", "WEBGL_color_buffer_float"],
      onDone: function (err: Error, regl: REGL.Regl) {
        if (err) {
          console.log(err);
          return;
        } else {
          // cannot use this directly as it seems to cause some issues
          // maxTextureDimension = regl.limits.maxTextureSize;
          if (regl.limits.maxTextureSize > 2048) {
            maxTextureDimension = 2048;
          }
          if (regl.limits.maxTextureSize > 4096) {
            maxTextureDimension = 4096;
          }
          if (regl.limits.maxTextureSize > 8192) {
            maxTextureDimension = 8192;
          }

          // TODO: use lower normal dimension where relevant
          // Currently set to same due to a bug
          normalTextureDimension = maxTextureDimension;
        }
        // TODO: Improve software rendering detection
        if (regl.limits.maxFragmentUniforms === 261) {
          console.warn("Software rendering detected. Many features of this plugin will fail.\
          If you have a GPU, check if drivers are installed ok?");
        }
      }
    });

    const commonDrawConfig = reglCommands.getCommonDrawConfiguration(tileSize, nodataValue);
    const fragMacros = {
      SCALE_MAX_LENGTH: colorscaleMaxLength,
      SENTINEL_MAX_LENGTH: sentinelMaxLength,
    };

    // Assign object "instance" properties.
    Object.assign(this, {
      gloperations: gloperations,
      canvas: canvas,
      regl: regl,
      tileSize: tileSize,
      nodataValue: nodataValue,
      maxTextureDimension: maxTextureDimension,
      normalTextureDimension: normalTextureDimension,
      scaleInput: scaleInput,
      sentinelInput: sentinelInput,
      scaleColormap: util.createColormapTexture(scaleInput, regl),
      sentinelColormap: util.createColormapTexture(sentinelInput, regl),
      textureManager: new TextureManager(regl, tileSize, normalTextureDimension, false),
      textureManagerA: new TextureManager(regl, tileSize, normalTextureDimension, false),
      textureManagerB: new TextureManager(regl, tileSize, normalTextureDimension, false),
      textureManagerC: new TextureManager(regl, tileSize, normalTextureDimension, false),
      textureManagerD: new TextureManager(regl, tileSize, normalTextureDimension, false),
      textureManagerE: new TextureManager(regl, tileSize, normalTextureDimension, false),
      textureManagerF: new TextureManager(regl, tileSize, normalTextureDimension, false),
      textureManagerHillshade: new TextureManager(regl, tileSize, maxTextureDimension, false),
      drawTile: reglCommands.createDrawTileCommand(regl, commonDrawConfig, fragMacros),
      drawTileHsSimple: reglCommands.createDrawTileHsSimpleCommand(regl, commonDrawConfig, fragMacros),
      drawTileHsPregen: reglCommands.createDrawTileHsPregenCommand(regl, commonDrawConfig, fragMacros),
      drawTileInterpolateColor: reglCommands.createDrawTileInterpolateColorCommand(regl, commonDrawConfig, fragMacros),
      drawTileInterpolateColorOnly: reglCommands.createDrawTileInterpolateColorOnlyCommand(regl, commonDrawConfig, fragMacros),
      drawTileInterpolateValue: reglCommands.createDrawTileInterpolateValueCommand(regl, commonDrawConfig, fragMacros),
      calcTileMultiAnalyze1: reglCommands.createCalcTileMultiAnalyze1Command(regl, commonDrawConfig),
      calcTileMultiAnalyze2: reglCommands.createCalcTileMultiAnalyze2Command(regl, commonDrawConfig),
      calcTileMultiAnalyze3: reglCommands.createCalcTileMultiAnalyze3Command(regl, commonDrawConfig),
      calcTileMultiAnalyze4: reglCommands.createCalcTileMultiAnalyze4Command(regl, commonDrawConfig),
      calcTileMultiAnalyze5: reglCommands.createCalcTileMultiAnalyze5Command(regl, commonDrawConfig),
      calcTileMultiAnalyze6: reglCommands.createCalcTileMultiAnalyze6Command(regl, commonDrawConfig),
      drawTileResult: reglCommands.createDrawResultCommand(regl, commonDrawConfig, fragMacros),
      calcTileDiff: reglCommands.createCalcTileDiffCommand(regl, commonDrawConfig),
      convertDem: reglCommands.createConvertDemCommand(regl, commonDrawConfig),
      convolutionSmooth: reglCommands.createConvolutionSmoothCommand(regl, commonDrawConfig),
      HsAdvMergeAndScaleTiles: reglCommands.createHsAdvMergeAndScaleTiles(regl),
      HsAdvCalcNormals: reglCommands.createHsAdvCalcNormals(regl, commonDrawConfig),
      HsAdvDirectLightning: reglCommands.createHsAdvDirectLightning(regl, commonDrawConfig),
      HsAdvSoftShadows: reglCommands.createHsAdvSoftShadows(regl, commonDrawConfig),
      HsAdvAmbientShadows: reglCommands.createHsAdvAmbientShadows(regl, commonDrawConfig),
      HsAdvFinalColorscale: reglCommands.createHsAdvFinalColorscale(regl, commonDrawConfig),
      HsAdvFinalBaselayer: reglCommands.createHsAdvFinalBaselayer(regl, commonDrawConfig),
      HsAdvSmooth: reglCommands.createHsAdvSmoothCommand(regl, commonDrawConfig),
    });
  }

  findMaxTextureDimension() {
    // TODO: fix maxTextureSize logic
    // cannot use this directly as it seems to cause some issues
    // maxTextureDimension = regl.limits.maxTextureSize;
    let maxTextureDimension = 1024;
    if (this.regl.limits.maxTextureSize > 2048) {
      maxTextureDimension = 2048;
    }
    if (this.regl.limits.maxTextureSize > 4096) {
      maxTextureDimension = 4096;
    }
    if (this.regl.limits.maxTextureSize > 8192) {
      maxTextureDimension = 8192;
    }
    return maxTextureDimension;
  }

  setMaxTextureDimension(newMaxTextureDimension: number) {
    const {
      textureManager,
      tileSize,
      regl,
    } = this;

    textureManager.destroy();

    Object.assign(this, {
      maxTextureDimension: newMaxTextureDimension,
      textureManager: new TextureManager(regl, tileSize, newMaxTextureDimension, false),
    });
  }

  updateColorscale(scaleInput: Color[]) {
    this.scaleInputPrevious = this.scaleInput;
    this.scaleInput = scaleInput;
    this.scaleColormapPrevious = this.scaleColormap;
    this.scaleColormap = util.createColormapTexture(scaleInput, this.regl);
  }
  updateSentinels(sentinelInput: SentinelValue[]) {
    this.sentinelInputPrevious = this.sentinelInput;
    this.sentinelInput = sentinelInput;
    this.sentinelColormapPrevious = this.sentinelColormap;
    this.sentinelColormap = util.createColormapTexture(sentinelInput, this.regl);
  }

  renderTile(
    { coords, pixelData }: TileDatum,
    _hillshadeOptions: HillshadeOptions,
    zoom: number,
  ): Pair<number> {
    const {
      regl,
      textureManager,
      tileSize,
    } = this;
    this.setCanvasSize(tileSize, tileSize);
    // Add image to the texture and retrieve its texture coordinates.
    const textureBounds = textureManager.addTile(coords, pixelData);

    regl.clear({ color: CLEAR_COLOR });

    const zoomdelta = _hillshadeOptions.hsSimpleZoomdelta || 0;

    const offset_pixels = Math.max(0.5, 2 ** (zoom + zoomdelta) / 2048);
    const offset_texcoords = offset_pixels / textureManager.texture.width;

    if (_hillshadeOptions.hillshadeType === "none") {
      this.drawTile({
        canvasSize: [tileSize, tileSize],
        canvasCoordinates: [0, 0],
        textureBounds,
        texture: textureManager.texture,
        scaleLength: this.scaleInput.length,
        sentinelLength: this.sentinelInput.length,
        scaleColormap: this.scaleColormap,
        sentinelColormap: this.sentinelColormap,
        enableSimpleHillshade: false,
      });
    } else if (_hillshadeOptions.hillshadeType === "simple") {
      this.drawTileHsSimple({
        scaleLength: this.scaleInput.length,
        sentinelLength: this.sentinelInput.length,
        scaleColormap: this.scaleColormap,
        sentinelColormap: this.sentinelColormap,
        canvasSize: [tileSize, tileSize],
        canvasCoordinates: [0, 0],
        textureBounds: textureBounds,
        texture: textureManager.texture,
        textureSize: textureManager.texture.width,
        tileSize: tileSize,
        offset: offset_texcoords,
        enableSimpleHillshade: true,
        // elevationScale: _hillshadeOptions.hsElevationScale,
        azimuth: _hillshadeOptions.hsSimpleAzimuth,
        altitude: _hillshadeOptions.hsSimpleAltitude,
        slopescale: _hillshadeOptions.hsSimpleSlopescale,
      });
    }

    // Since the tile will fill the whole canvas, the offset is simply [0, 0].
    return [0, 0];
  }

  renderTileHsPregen(
    tileDatum: TileDatum,
    tileDatumHs: TileDatum,
  ): Pair<number> {
    const {
      regl,
      textureManager,
      textureManagerHillshade,
      tileSize,
    } = this;
    this.setCanvasSize(tileSize, tileSize);
    // Add image to the texture and retrieve its texture coordinates.
    const textureBounds = textureManager.addTile(tileDatum.coords, tileDatum.pixelData);
    const textureBoundsHs = textureManagerHillshade.addTile(tileDatumHs.coords, tileDatumHs.pixelData);

    regl.clear({ color: CLEAR_COLOR });

    this.drawTileHsPregen({
      scaleLength: this.scaleInput.length,
      sentinelLength: this.sentinelInput.length,
      scaleColormap: this.scaleColormap,
      sentinelColormap: this.sentinelColormap,
      canvasSize: [tileSize, tileSize],
      canvasCoordinates: [0, 0],
      textureBounds: textureBounds,
      textureBoundsHs: textureBoundsHs,
      texture: textureManager.texture,
      hillshadePregenTexture: textureManagerHillshade.texture,
    });

    // Since the tile will fill the whole canvas, the offset is simply [0, 0].
    return [0, 0];
  }

  // TODO: Render to a fbo using a texture with flipY and this should not be necessary?
  /**
   * WebGL uses [0,0] coordinate at top, not bottom. Use this function to flip readPixel results.
   */
  flipReadPixelsUint(
    width: number,
    height: number,
    pixels: Uint8Array,
  ) {
    const halfHeight = height / 2 | 0;  // the | 0 keeps the result an int
    const bytesPerRow = width * 4;

    // make a temp buffer to hold one row
    const temp = new Uint8Array(width * 4);
    for (let y = 0; y < halfHeight; ++y) {
      const topOffset = y * bytesPerRow;
      const bottomOffset = (height - y - 1) * bytesPerRow;
      // make copy of a row on the top half
      temp.set(pixels.subarray(topOffset, topOffset + bytesPerRow));
      // copy a row from the bottom half to the top
      pixels.copyWithin(topOffset, bottomOffset, bottomOffset + bytesPerRow);
      // copy the copy of the top half row to the bottom half
      pixels.set(temp, bottomOffset);
    }
    return pixels;
  }

  renderTileDiff(
    tileDatumA: TileDatum,
    tileDatumB: TileDatum,
  ): calcResult {
    const {
      regl,
      textureManagerA,
      textureManagerB,
      tileSize,
    } = this;
    this.setCanvasSize(tileSize, tileSize);

    // Add image to the texture and retrieve its texture coordinates.
    const textureBoundsA = textureManagerA.addTile(tileDatumA.coords, tileDatumA.pixelData);
    const textureBoundsB = textureManagerB.addTile(tileDatumB.coords, tileDatumB.pixelData);

    const fboTile: Framebuffer2D = regl.framebuffer({
      width: tileSize,
      height: tileSize,
      depth: false,
      colorFormat: "rgba",
      colorType: "uint8",
    });

    let resultEncodedPixels = new Uint8Array(tileSize * tileSize * 4);

    this.calcTileDiff({
      canvasSize: [tileSize, tileSize],
      canvasCoordinates: [0, 0],
      textureA: textureManagerA.texture,
      textureB: textureManagerB.texture,
      textureBoundsA: textureBoundsA,
      textureBoundsB: textureBoundsB,
      fbo:fboTile,
    });

    this.drawTileResult({
      scaleLength: this.scaleInput.length,
      sentinelLength: this.sentinelInput.length,
      scaleColormap: this.scaleColormap,
      sentinelColormap: this.sentinelColormap,
      canvasSize: [tileSize, tileSize],
      canvasCoordinates: [0, 0],
      texture: fboTile,
    });

    fboTile.use(() => {
      // Get encoded floatValues to use for mouseEvents
      regl.read({data: resultEncodedPixels});
    });
    resultEncodedPixels = this.flipReadPixelsUint(tileSize, tileSize, resultEncodedPixels);
    fboTile.destroy();

    // Since the tile will fill the whole canvas, the offset is simply [0, 0].
    return [0, 0, resultEncodedPixels];
  }

  renderConvertDem(
    pixelData: Uint8Array
  ): Uint8Array {
    const {
      regl,
      tileSize,
    } = this;

    const tDem = regl.texture({
      width: tileSize,
      height: tileSize,
      data: pixelData,
      format: "rgba",
      type: "uint8",
      flipY: false,
    });

    const fboTile: Framebuffer2D = regl.framebuffer({
      width: tileSize,
      height: tileSize,
      depth: false,
      colorFormat: "rgba",
      colorType: "uint8",
    });

    const resultEncodedPixels = new Uint8Array(tileSize * tileSize * 4);

    this.convertDem({
      canvasSize: [tileSize, tileSize],
      canvasCoordinates: [0, 0],
      texture: tDem,
      fbo:fboTile,
    });

    fboTile.use(() => {
      // Get encoded floats in rgba format
      regl.read({data: resultEncodedPixels});
    });
    tDem.destroy();
    fboTile.destroy();

    return resultEncodedPixels;
  }

  renderConvolutionSmooth(
    inputData: Uint8Array,
    width: number,
    height: number,
    kernelSize: number,
  ): Float32Array {
    const { regl } = this;
    this.setCanvasSize(width, height);

    const texture = regl.texture({
      data: inputData,
      width: width,
      height: height,
      flipY: false,
    });

    const fboSmoothed = regl.framebuffer({
      width: width,
      height: height,
      depth: false,
      colorFormat: "rgba",
      colorType: "uint8"
    });

    let resultEncodedPixels: Uint8Array | Float32Array = new Uint8Array(width * height * 4);

    fboSmoothed.use(() => {
      this.convolutionSmooth({
        texture: texture,
        // TODO: case with width != height?
        textureSize: width,
        kernelSize: kernelSize,
      });
      regl.read({data: resultEncodedPixels});
    });

    resultEncodedPixels = new Float32Array(resultEncodedPixels.buffer);

    fboSmoothed.destroy();

    return resultEncodedPixels;
  }

  renderTileHsAdvanced(
    _hillshadeOptions: HillshadeOptions,
    zoom: number,
    textureCoords: number[][],
    pixelScale: number,
    baselayerTexCoords: number[][],
  ): Pair<number> {
    const {
      regl,
      textureManager,
      tileSize,
    } = this;
    this.setCanvasSize(tileSize, tileSize);

    const fboFloats = regl.framebuffer({
      width: tileSize * 3,
      height: tileSize * 3,
      depth: false,
      colorType: "float",
    });

    let fboSmoothed = regl.framebuffer({
      width: tileSize * 3,
      height: tileSize * 3,
      depth: false,
      colorType: "float",
    });

    const fboNormals = regl.framebuffer({
      width: tileSize * 3,
      height: tileSize * 3,
      depth: false,
      colorType: "float",
    });

    const fboSoftShadowPP = util.PingPong(regl, {
      width: tileSize,
      height: tileSize,
      colorType: "float",
    });

    const fboAmbientShadowPP = util.PingPong(regl, {
      width: tileSize,
      height: tileSize,
      colorType: "float",
    });

    let hsValueScale = 1.0;
    if (typeof _hillshadeOptions.hsAdvValueScale === "number") {
      hsValueScale = _hillshadeOptions.hsAdvValueScale;
    } else if (_hillshadeOptions.hsAdvValueScale!.constructor === Object) {
      hsValueScale = _hillshadeOptions.hsAdvValueScale![zoom];
    }

    this.HsAdvMergeAndScaleTiles({
      canvasSize: [tileSize * 3, tileSize * 3],
      texture: textureManager.texture,
      fbo: fboFloats,
      floatScale: hsValueScale,
      texCoord: textureCoords,
      nodataValue: this.nodataValue,
    });

    if (_hillshadeOptions.hsAdvSmoothInput && _hillshadeOptions.hsAdvSmoothInputKernel > 0) {
      this.HsAdvSmooth({
        canvasSize: [tileSize * 3, tileSize * 3],
        canvasCoordinates: [0, 0],
        tInput: fboFloats,
        textureSize: tileSize * 3,
        kernelSize: _hillshadeOptions.hsAdvSmoothInputKernel,
        fbo: fboSmoothed,
      });
    } else {
      fboSmoothed = fboFloats;
    }

    this.HsAdvCalcNormals({
      canvasSize: [tileSize * 3, tileSize * 3],
      canvasCoordinates: [0, 0],
      tInput: fboSmoothed,
      pixelScale: pixelScale,
      onePixel: 1 / (tileSize * 3),
      fbo: fboNormals,
    });

    // this.HsAdvDirectLightning({
    //   scaleLength: this.scaleInput.length,
    //   sentinelLength: this.sentinelInput.length,
    //   scaleColormap: this.scaleColormap,
    //   sentinelColormap: this.sentinelColormap,
    //   canvasSize: [tileSize, tileSize],
    //   canvasCoordinates: [0, 0],
    //   tInput: fboFloats,
    //   tNormal: fboNormals,
    //   textureBounds: textureBounds,
    //   floatScale: elevationScales[zoom],
    //   sunDirection: vec3.normalize(vec3.create(), [1, 1, 1]),
    // });

    // Soft Shadows
    for (let i = 0; i < _hillshadeOptions.hsAdvSoftIterations!; i++) {
      this.HsAdvSoftShadows({
        canvasSize: [tileSize, tileSize],
        canvasCoordinates: [0, 0],
        tInput: fboSmoothed,
        tNormal: fboNormals,
        tSrc: fboSoftShadowPP.ping(),
        softIterations: _hillshadeOptions.hsAdvSoftIterations,
        resolution: [tileSize, tileSize],
        pixelScale: pixelScale,
        sunDirection: this.sunDirections[i],
        // fbo: i === _hillshadeOptions.hsAdvSoftIterations! - 1 ? undefined : fboSoftShadowPP.pong() // to show shadows
        fbo: fboSoftShadowPP.pong(),
      });
      fboSoftShadowPP.swap();
    }

    for (let i = 0; i < _hillshadeOptions.hsAdvAmbientIterations!; i++) {
      this.HsAdvAmbientShadows({
        canvasSize: [tileSize, tileSize],
        canvasCoordinates: [0, 0],
        tInput: fboSmoothed,
        tNormal: fboNormals,
        tSrc: fboAmbientShadowPP.ping(),
        ambientIterations: _hillshadeOptions.hsAdvAmbientIterations,
        direction: this.ambientDirections[i],
        resolution: [tileSize, tileSize],
        pixelScale: pixelScale,
        // fbo: i === _hillshadeOptions.hsAdvAmbientIterations! - 1 ? undefined : fboAmbientShadowPP.pong() // to show shadows
        fbo: fboAmbientShadowPP.pong(),
      });
      fboAmbientShadowPP.swap();
    }

    if (_hillshadeOptions.hsAdvBaselayerUrl) {
      // if url to baselayer is used, merge hs with this tile
      this.HsAdvFinalBaselayer({
        canvasSize: [tileSize, tileSize],
        canvasCoordinates: [0, 0],
        tBase: this.textureManagerHillshade.texture,
        baseTexCoords: baselayerTexCoords,
        tSoftShadow: fboSoftShadowPP.ping(),
        tAmbient: fboAmbientShadowPP.ping(),
        finalSoftMultiplier: _hillshadeOptions.hsAdvFinalSoftMultiplier,
        finalAmbientMultiplier: _hillshadeOptions.hsAdvFinalAmbientMultiplier,
      });
    } else {
      // if no url to baselayer, use colorscale to calculate colors to merge with hs.
      this.HsAdvFinalColorscale({
        scaleLength: this.scaleInput.length,
        sentinelLength: this.sentinelInput.length,
        scaleColormap: this.scaleColormap,
        sentinelColormap: this.sentinelColormap,
        canvasSize: [tileSize, tileSize],
        canvasCoordinates: [0, 0],
        tInput: fboFloats,
        tSoftShadow: fboSoftShadowPP.ping(),
        tAmbient: fboAmbientShadowPP.ping(),
        floatScale: hsValueScale,
        finalSoftMultiplier: _hillshadeOptions.hsAdvFinalSoftMultiplier,
        finalAmbientMultiplier: _hillshadeOptions.hsAdvFinalAmbientMultiplier,
      });
    }

    fboFloats.destroy();
    fboNormals.destroy();
    fboSoftShadowPP.destroy();
    fboAmbientShadowPP.destroy();

    // Since the tile will fill the whole canvas, the offset is simply [0, 0].
    return [0, 0];
  }

  renderTileMulti1(
    tileDatumA: TileDatum,
    filterLowA: number,
    filterHighA: number,
    multiplierA: number,
  ): calcResult {
    const {
      regl,
      textureManagerA,
      tileSize,
    } = this;

    this.setCanvasSize(tileSize, tileSize);

    // Add image to the texture and retrieve its texture coordinates.
    const textureBoundsA = textureManagerA.addTile(tileDatumA.coords, tileDatumA.pixelData);

    const fboTile = regl.framebuffer({
      width: tileSize,
      height: tileSize,
      depth: false,
      colorFormat: "rgba",
      colorType: "uint8",
    });

    let resultEncodedPixels = new Uint8Array(tileSize * tileSize * 4);

    this.calcTileMultiAnalyze1({
      canvasSize: [tileSize, tileSize],
      canvasCoordinates: [0, 0],
      textureA: textureManagerA.texture,
      textureBoundsA: textureBoundsA,
      filterLowA: filterLowA,
      filterHighA: filterHighA,
      multiplierA: multiplierA,
      fbo:fboTile,
    });

    this.drawTileResult({
      scaleLength: this.scaleInput.length,
      sentinelLength: this.sentinelInput.length,
      scaleColormap: this.scaleColormap,
      sentinelColormap: this.sentinelColormap,
      canvasSize: [tileSize, tileSize],
      canvasCoordinates: [0, 0],
      texture: fboTile,
    });

    fboTile.use(() => {
      // Get encoded floatValues to use for mouseEvents
      regl.read({data: resultEncodedPixels});
    });
    resultEncodedPixels = this.flipReadPixelsUint(tileSize, tileSize, resultEncodedPixels);
    fboTile.destroy();

    // Since the tile will fill the whole canvas, the offset is simply [0, 0].
    return [0, 0, resultEncodedPixels];
  }

  renderTileMulti2(
    tileDatumA: TileDatum,
    tileDatumB: TileDatum,
    filterLowA: number,
    filterHighA: number,
    filterLowB: number,
    filterHighB: number,
    multiplierA: number,
    multiplierB: number,
  ): calcResult {
    const {
      regl,
      textureManagerA,
      textureManagerB,
      tileSize,
    } = this;

    this.setCanvasSize(tileSize, tileSize);

    // Add image to the texture and retrieve its texture coordinates.
    const textureBoundsA = textureManagerA.addTile(tileDatumA.coords, tileDatumA.pixelData);
    const textureBoundsB = textureManagerB.addTile(tileDatumB.coords, tileDatumB.pixelData);

    const fboTile = regl.framebuffer({
      width: tileSize,
      height: tileSize,
      depth: false,
      colorFormat: "rgba",
      colorType: "uint8",
    });

    let resultEncodedPixels = new Uint8Array(tileSize * tileSize * 4);

    this.calcTileMultiAnalyze2({
      canvasSize: [tileSize, tileSize],
      canvasCoordinates: [0, 0],
      textureA: textureManagerA.texture,
      textureB: textureManagerB.texture,
      textureBoundsA: textureBoundsA,
      textureBoundsB: textureBoundsB,
      filterLowA: filterLowA,
      filterHighA: filterHighA,
      filterLowB: filterLowB,
      filterHighB: filterHighB,
      multiplierA: multiplierA,
      multiplierB: multiplierB,
      fbo:fboTile,
    });

    this.drawTileResult({
      scaleLength: this.scaleInput.length,
      sentinelLength: this.sentinelInput.length,
      scaleColormap: this.scaleColormap,
      sentinelColormap: this.sentinelColormap,
      canvasSize: [tileSize, tileSize],
      canvasCoordinates: [0, 0],
      texture: fboTile,
    });

    fboTile.use(() => {
      // Get encoded floatValues to use for mouseEvents
      regl.read({data: resultEncodedPixels});
    });
    resultEncodedPixels = this.flipReadPixelsUint(tileSize, tileSize, resultEncodedPixels);
    fboTile.destroy();

    // Since the tile will fill the whole canvas, the offset is simply [0, 0].
    return [0, 0, resultEncodedPixels];
  }

  renderTileMulti3(
    tileDatumA: TileDatum,
    tileDatumB: TileDatum,
    tileDatumC: TileDatum,
    filterLowA: number,
    filterHighA: number,
    filterLowB: number,
    filterHighB: number,
    filterLowC: number,
    filterHighC: number,
    multiplierA: number,
    multiplierB: number,
    multiplierC: number,
  ): calcResult {
    const {
      regl,
      textureManagerA,
      textureManagerB,
      textureManagerC,
      tileSize,
    } = this;

    this.setCanvasSize(tileSize, tileSize);

    // Add image to the texture and retrieve its texture coordinates.
    const textureBoundsA = textureManagerA.addTile(tileDatumA.coords, tileDatumA.pixelData);
    const textureBoundsB = textureManagerB.addTile(tileDatumB.coords, tileDatumB.pixelData);
    const textureBoundsC = textureManagerC.addTile(tileDatumC.coords, tileDatumC.pixelData);

    const fboTile = regl.framebuffer({
      width: tileSize,
      height: tileSize,
      depth: false,
      colorFormat: "rgba",
      colorType: "uint8",
    });

    let resultEncodedPixels = new Uint8Array(tileSize * tileSize * 4);

    this.calcTileMultiAnalyze3({
      canvasSize: [tileSize, tileSize],
      canvasCoordinates: [0, 0],
      textureA: textureManagerA.texture,
      textureB: textureManagerB.texture,
      textureC: textureManagerC.texture,
      textureBoundsA: textureBoundsA,
      textureBoundsB: textureBoundsB,
      textureBoundsC: textureBoundsC,
      filterLowA: filterLowA,
      filterHighA: filterHighA,
      filterLowB: filterLowB,
      filterHighB: filterHighB,
      filterLowC: filterLowC,
      filterHighC: filterHighC,
      multiplierA: multiplierA,
      multiplierB: multiplierB,
      multiplierC: multiplierC,
      fbo:fboTile,
    });

    this.drawTileResult({
      scaleLength: this.scaleInput.length,
      sentinelLength: this.sentinelInput.length,
      scaleColormap: this.scaleColormap,
      sentinelColormap: this.sentinelColormap,
      canvasSize: [tileSize, tileSize],
      canvasCoordinates: [0, 0],
      texture: fboTile,
    });

    fboTile.use(() => {
      // Get encoded floatValues to use for mouseEvents
      regl.read({data: resultEncodedPixels});
    });
    resultEncodedPixels = this.flipReadPixelsUint(tileSize, tileSize, resultEncodedPixels);
    fboTile.destroy();

    // Since the tile will fill the whole canvas, the offset is simply [0, 0].
    return [0, 0, resultEncodedPixels];
  }

  renderTileMulti4(
    tileDatumA: TileDatum,
    tileDatumB: TileDatum,
    tileDatumC: TileDatum,
    tileDatumD: TileDatum,
    filterLowA: number,
    filterHighA: number,
    filterLowB: number,
    filterHighB: number,
    filterLowC: number,
    filterHighC: number,
    filterLowD: number,
    filterHighD: number,
    multiplierA: number,
    multiplierB: number,
    multiplierC: number,
    multiplierD: number,
  ): calcResult {
    const {
      regl,
      textureManagerA,
      textureManagerB,
      textureManagerC,
      textureManagerD,
      tileSize,
    } = this;
    this.setCanvasSize(tileSize, tileSize);

    // Add image to the texture and retrieve its texture coordinates.
    const textureBoundsA = textureManagerA.addTile(tileDatumA.coords, tileDatumA.pixelData);
    const textureBoundsB = textureManagerB.addTile(tileDatumB.coords, tileDatumB.pixelData);
    const textureBoundsC = textureManagerC.addTile(tileDatumC.coords, tileDatumC.pixelData);
    const textureBoundsD = textureManagerD.addTile(tileDatumD.coords, tileDatumD.pixelData);

    const fboTile = regl.framebuffer({
      width: tileSize,
      height: tileSize,
      depth: false,
      colorFormat: "rgba",
      colorType: "uint8",
    });

    let resultEncodedPixels = new Uint8Array(tileSize * tileSize * 4);

    this.calcTileMultiAnalyze4({
      canvasSize: [tileSize, tileSize],
      canvasCoordinates: [0, 0],
      textureA: textureManagerA.texture,
      textureB: textureManagerB.texture,
      textureC: textureManagerC.texture,
      textureD: textureManagerD.texture,
      textureBoundsA: textureBoundsA,
      textureBoundsB: textureBoundsB,
      textureBoundsC: textureBoundsC,
      textureBoundsD: textureBoundsD,
      filterLowA: filterLowA,
      filterHighA: filterHighA,
      filterLowB: filterLowB,
      filterHighB: filterHighB,
      filterLowC: filterLowC,
      filterHighC: filterHighC,
      filterLowD: filterLowD,
      filterHighD: filterHighD,
      multiplierA: multiplierA,
      multiplierB: multiplierB,
      multiplierC: multiplierC,
      multiplierD: multiplierD,
      fbo:fboTile,
    });

    this.drawTileResult({
      scaleLength: this.scaleInput.length,
      sentinelLength: this.sentinelInput.length,
      scaleColormap: this.scaleColormap,
      sentinelColormap: this.sentinelColormap,
      canvasSize: [tileSize, tileSize],
      canvasCoordinates: [0, 0],
      texture: fboTile,
    });

    fboTile.use(() => {
      // Get encoded floatValues to use for mouseEvents
      regl.read({data: resultEncodedPixels});
    });
    resultEncodedPixels = this.flipReadPixelsUint(tileSize, tileSize, resultEncodedPixels);
    fboTile.destroy();

    // Since the tile will fill the whole canvas, the offset is simply [0, 0].
    return [0, 0, resultEncodedPixels];
  }

  renderTileMulti5(
    tileDatumA: TileDatum,
    tileDatumB: TileDatum,
    tileDatumC: TileDatum,
    tileDatumD: TileDatum,
    tileDatumE: TileDatum,
    filterLowA: number,
    filterHighA: number,
    filterLowB: number,
    filterHighB: number,
    filterLowC: number,
    filterHighC: number,
    filterLowD: number,
    filterHighD: number,
    filterLowE: number,
    filterHighE: number,
    multiplierA: number,
    multiplierB: number,
    multiplierC: number,
    multiplierD: number,
    multiplierE: number,
  ): calcResult {
    const {
      regl,
      textureManagerA,
      textureManagerB,
      textureManagerC,
      textureManagerD,
      textureManagerE,
      tileSize,
    } = this;

    this.setCanvasSize(tileSize, tileSize);

    // Add image to the texture and retrieve its texture coordinates.
    const textureBoundsA = textureManagerA.addTile(tileDatumA.coords, tileDatumA.pixelData);
    const textureBoundsB = textureManagerB.addTile(tileDatumB.coords, tileDatumB.pixelData);
    const textureBoundsC = textureManagerC.addTile(tileDatumC.coords, tileDatumC.pixelData);
    const textureBoundsD = textureManagerD.addTile(tileDatumD.coords, tileDatumD.pixelData);
    const textureBoundsE = textureManagerE.addTile(tileDatumE.coords, tileDatumE.pixelData);

    const fboTile = regl.framebuffer({
      width: tileSize,
      height: tileSize,
      depth: false,
      colorFormat: "rgba",
      colorType: "uint8",
    });

    let resultEncodedPixels = new Uint8Array(tileSize * tileSize * 4);

    this.calcTileMultiAnalyze5({
      canvasSize: [tileSize, tileSize],
      canvasCoordinates: [0, 0],
      textureA: textureManagerA.texture,
      textureB: textureManagerB.texture,
      textureC: textureManagerC.texture,
      textureD: textureManagerD.texture,
      textureE: textureManagerE.texture,
      textureBoundsA: textureBoundsA,
      textureBoundsB: textureBoundsB,
      textureBoundsC: textureBoundsC,
      textureBoundsD: textureBoundsD,
      textureBoundsE: textureBoundsE,
      filterLowA: filterLowA,
      filterHighA: filterHighA,
      filterLowB: filterLowB,
      filterHighB: filterHighB,
      filterLowC: filterLowC,
      filterHighC: filterHighC,
      filterLowD: filterLowD,
      filterHighD: filterHighD,
      filterLowE: filterLowE,
      filterHighE: filterHighE,
      multiplierA: multiplierA,
      multiplierB: multiplierB,
      multiplierC: multiplierC,
      multiplierD: multiplierD,
      multiplierE: multiplierE,
      fbo:fboTile,
    });

    this.drawTileResult({
      scaleLength: this.scaleInput.length,
      sentinelLength: this.sentinelInput.length,
      scaleColormap: this.scaleColormap,
      sentinelColormap: this.sentinelColormap,
      canvasSize: [tileSize, tileSize],
      canvasCoordinates: [0, 0],
      texture: fboTile,
    });

    fboTile.use(() => {
      // Get encoded floatValues to use for mouseEvents
      regl.read({data: resultEncodedPixels});
    });
    resultEncodedPixels = this.flipReadPixelsUint(tileSize, tileSize, resultEncodedPixels);
    fboTile.destroy();

    // Since the tile will fill the whole canvas, the offset is simply [0, 0].
    return [0, 0, resultEncodedPixels];
  }

  renderTileMulti6(
    tileDatumA: TileDatum,
    tileDatumB: TileDatum,
    tileDatumC: TileDatum,
    tileDatumD: TileDatum,
    tileDatumE: TileDatum,
    tileDatumF: TileDatum,
    filterLowA: number,
    filterHighA: number,
    filterLowB: number,
    filterHighB: number,
    filterLowC: number,
    filterHighC: number,
    filterLowD: number,
    filterHighD: number,
    filterLowE: number,
    filterHighE: number,
    filterLowF: number,
    filterHighF: number,
    multiplierA: number,
    multiplierB: number,
    multiplierC: number,
    multiplierD: number,
    multiplierE: number,
    multiplierF: number,
  ): calcResult {
    const {
      regl,
      textureManagerA,
      textureManagerB,
      textureManagerC,
      textureManagerD,
      textureManagerE,
      textureManagerF,
      tileSize,
    } = this;

    this.setCanvasSize(tileSize, tileSize);

    // Add image to the texture and retrieve its texture coordinates.
    const textureBoundsA = textureManagerA.addTile(tileDatumA.coords, tileDatumA.pixelData);
    const textureBoundsB = textureManagerB.addTile(tileDatumB.coords, tileDatumB.pixelData);
    const textureBoundsC = textureManagerC.addTile(tileDatumC.coords, tileDatumC.pixelData);
    const textureBoundsD = textureManagerD.addTile(tileDatumD.coords, tileDatumD.pixelData);
    const textureBoundsE = textureManagerE.addTile(tileDatumE.coords, tileDatumE.pixelData);
    const textureBoundsF = textureManagerE.addTile(tileDatumF.coords, tileDatumF.pixelData);

    const fboTile = regl.framebuffer({
      width: tileSize,
      height: tileSize,
      depth: false,
      colorFormat: "rgba",
      colorType: "uint8",
    });

    let resultEncodedPixels = new Uint8Array(tileSize * tileSize * 4);

    this.calcTileMultiAnalyze6({
      canvasSize: [tileSize, tileSize],
      canvasCoordinates: [0, 0],
      textureA: textureManagerA.texture,
      textureB: textureManagerB.texture,
      textureC: textureManagerC.texture,
      textureD: textureManagerD.texture,
      textureE: textureManagerE.texture,
      textureF: textureManagerF.texture,
      textureBoundsA: textureBoundsA,
      textureBoundsB: textureBoundsB,
      textureBoundsC: textureBoundsC,
      textureBoundsD: textureBoundsD,
      textureBoundsE: textureBoundsE,
      textureBoundsF: textureBoundsF,
      filterLowA: filterLowA,
      filterHighA: filterHighA,
      filterLowB: filterLowB,
      filterHighB: filterHighB,
      filterLowC: filterLowC,
      filterHighC: filterHighC,
      filterLowD: filterLowD,
      filterHighD: filterHighD,
      filterLowE: filterLowE,
      filterHighE: filterHighE,
      filterLowF: filterLowF,
      filterHighF: filterHighF,
      multiplierA: multiplierA,
      multiplierB: multiplierB,
      multiplierC: multiplierC,
      multiplierD: multiplierD,
      multiplierE: multiplierE,
      multiplierF: multiplierF,
      fbo:fboTile,
    });

    this.drawTileResult({
      scaleLength: this.scaleInput.length,
      sentinelLength: this.sentinelInput.length,
      scaleColormap: this.scaleColormap,
      sentinelColormap: this.sentinelColormap,
      canvasSize: [tileSize, tileSize],
      canvasCoordinates: [0, 0],
      texture: fboTile,
    });

    fboTile.use(() => {
      // Get encoded floatValues to use for mouseEvents
      regl.read({data: resultEncodedPixels});
    });
    resultEncodedPixels = this.flipReadPixelsUint(tileSize, tileSize, resultEncodedPixels);
    fboTile.destroy();

    // Since the tile will fill the whole canvas, the offset is simply [0, 0].
    return [0, 0, resultEncodedPixels];
  }

  renderTiles(
    tiles: TileDatum[],
    _hillshadeOptions: HillshadeOptions,
    zoom: number,
  ): Array<Pair<number>> {
    const {
      regl,
      textureManager,
      tileSize,
    } = this;

    // Compute required canvas dimensions, then resize the canvas.
    const [canvasWidth, canvasHeight] = this.computeRequiredCanvasDimensions(tiles.length);
    this.setCanvasSize(canvasWidth, canvasHeight);

    // Compute the coordinates at which each tile will be rendered in the canvas.
    const canvasCoordinates = this.getCanvasCoordinates(canvasWidth, canvasHeight, tiles.length);

    type TileWithCanvasCoords = TileDatum & { canvasCoords: Pair<number> };

    // Form an array combining each tile datum with the coordinates at which it will be rendered.
    const tilesWithCanvasCoordinates = zipWith<TileDatum | Pair<number>, TileWithCanvasCoords>(
      tiles,
      canvasCoordinates,
      (tile: TileDatum, canvasCoords: Pair<number>) => ({
        ...tile,
        canvasCoords,
      })
    );

    const canvasSize = [canvasWidth, canvasHeight] as Pair<number>;

    // Clear existing tiles from cache.
    textureManager.clearTiles();
    // Clear the canvas.
    regl.clear({ color: CLEAR_COLOR });

    // Split the tiles array into chunks the size of the texture capacity. If we need to render more
    // tiles than will fit in the texture, we have to render in batches.
    const chunks = chunk(tilesWithCanvasCoordinates, textureManager.tileCapacity);

    const zoomdelta = _hillshadeOptions.hsSimpleZoomdelta || 0;

    // Render chunk by chunk.
    for (const chunk of chunks) {
      // Add tiles.
      const textureBounds = chunk.map(
        ({ coords, pixelData }) => textureManager.addTile(coords, pixelData),
      );

      const offset_pixels = Math.max(0.5, 2 ** (zoom + zoomdelta) / 2048);
      const offset_texcoords = offset_pixels / textureManager.texture.width;

      if (_hillshadeOptions.hillshadeType === "none") {
        this.drawTile(
          chunk.map(({ canvasCoords }, index) => ({
            canvasSize,
            canvasCoordinates: canvasCoords,
            textureBounds: textureBounds[index],
            texture: textureManager.texture,
            scaleLength: this.scaleInput.length,
            sentinelLength: this.sentinelInput.length,
            scaleColormap: this.scaleColormap,
            sentinelColormap: this.sentinelColormap,
            enableSimpleHillshade: false,
          }))
        );
      } else if (_hillshadeOptions.hillshadeType === "simple") {
        this.drawTileHsSimple(
          chunk.map(({ canvasCoords }, index) => ({
            scaleLength: this.scaleInput.length,
            sentinelLength: this.sentinelInput.length,
            scaleColormap: this.scaleColormap,
            sentinelColormap: this.sentinelColormap,
            canvasSize,
            canvasCoordinates: canvasCoords,
            textureBounds: textureBounds[index],
            textureSize: textureManager.texture.width,
            texture: textureManager.texture,
            tileSize: tileSize,
            offset: offset_texcoords,
            enableSimpleHillshade: true,
            azimuth: _hillshadeOptions.hsSimpleAzimuth,
            altitude: _hillshadeOptions.hsSimpleAltitude,
            slopescale: _hillshadeOptions.hsSimpleSlopescale,
          }))
        );
      }
    }

    return canvasCoordinates;
  }

  renderTilesHsPregen(
    tiles: TileDatum[],
    tilesHs: TileDatum[],
  ): Array<Pair<number>> {
    const {
      regl,
      textureManager,
      textureManagerHillshade,
    } = this;

    // Compute required canvas dimensions, then resize the canvas.
    const [canvasWidth, canvasHeight] = this.computeRequiredCanvasDimensions(tiles.length);
    this.setCanvasSize(canvasWidth, canvasHeight);

    // Compute the coordinates at which each tile will be rendered in the canvas.
    const canvasCoordinates = this.getCanvasCoordinates(canvasWidth, canvasHeight, tiles.length);

    interface TilesWithCanvasCoords {
      canvasCoords: Pair<number>;
      coords: TileCoordinates;
      tilesPixelData: Uint8Array;
      tilesHsPixelData: Uint8Array;
    }

    // Form an array combining each tile datum with the coordinates at which it will be rendered.
    const tilesWithCanvasCoordinates = zipWith<TileDatum | Pair<number>, TilesWithCanvasCoords>(
      tiles,
      tilesHs,
      canvasCoordinates,
      (tiles: TileDatum, tilesHs: TileDatum, canvasCoords: Pair<number>) => ({
        coords: tiles.coords,
        tilesPixelData: tiles.pixelData,
        tilesHsPixelData: tilesHs.pixelData,
        canvasCoords,
      }),
    );

    const canvasSize = [canvasWidth, canvasHeight] as Pair<number>;

    // Clear existing tiles from cache.
    textureManager.clearTiles();
    textureManagerHillshade.clearTiles();

    // Clear the canvas.
    regl.clear({ color: CLEAR_COLOR });

    // Split the tiles array into chunks the size of the texture capacity. If we need to render more
    // tiles than will fit in the texture, we have to render in batches.
    const chunks = chunk(tilesWithCanvasCoordinates, textureManager.tileCapacity);

    // Render chunk by chunk.
    for (const chunk of chunks) {
      // Add tiles.
      const textureBounds = chunk.map(
        ({ coords, tilesPixelData }) => textureManager.addTile(coords, tilesPixelData),
      );
      const textureBoundsHs = chunk.map(
        ({ coords, tilesHsPixelData }) => textureManagerHillshade.addTile(coords, tilesHsPixelData),
      );

      this.drawTileHsPregen(
        chunk.map(({ canvasCoords }, index) => ({
          scaleLength: this.scaleInput.length,
          sentinelLength: this.sentinelInput.length,
          scaleColormap: this.scaleColormap,
          sentinelColormap: this.sentinelColormap,
          canvasSize,
          canvasCoordinates: canvasCoords,
          textureBounds: textureBounds[index],
          textureBoundsHs: textureBoundsHs[index],
          texture: textureManager.texture,
          hillshadePregenTexture: textureManagerHillshade.texture,
        }))
      );
    }

    return canvasCoordinates;
  }

  async renderTilesHsAdvanced(
    tiles: TileDatum[],
    _hillshadeOptions: HillshadeOptions,
    url: string,
    zoom: number,
    pixelScale: number,
  ) {
    const {
      regl,
      textureManager,
      tileSize,
      nodataValue
    } = this;

    // Compute required canvas dimensions, then resize the canvas.
    const [canvasWidth, canvasHeight] = this.computeRequiredCanvasDimensions(tiles.length);
    this.setCanvasSize(canvasWidth, canvasHeight);

    // Compute the coordinates at which each tile will be rendered in the canvas.
    const canvasCoordinates = this.getCanvasCoordinates(canvasWidth, canvasHeight, tiles.length);

    type TileWithCanvasCoords = TileDatum & { canvasCoords: Pair<number> };

    // Form an array combining each tile datum with the coordinates at which it will be rendered.
    const tilesWithCanvasCoordinates = zipWith<TileDatum | Pair<number>, TileWithCanvasCoords>(
      tiles,
      canvasCoordinates,
      (tile: TileDatum, canvasCoords: Pair<number>) => ({
        ...tile,
        canvasCoords,
      })
    );

    const canvasSize = [canvasWidth, canvasHeight] as Pair<number>;

    // Clear existing tiles from cache.
    textureManager.clearTiles();

    // Clear the canvas.
    regl.clear({ color: CLEAR_COLOR });

    // Split the tiles array into chunks the size of the texture capacity. If we need to render more
    // tiles than will fit in the texture, we have to render in batches.
    const chunks = chunk(tilesWithCanvasCoordinates, textureManager.tileCapacity);
    const nodataTile = util.createNoDataTile(nodataValue, tileSize);

    let hsValueScale = 1.0;
    if (typeof _hillshadeOptions.hsAdvValueScale === "number") {
      hsValueScale = _hillshadeOptions.hsAdvValueScale;
    } else if (_hillshadeOptions.hsAdvValueScale!.constructor === Object) {
      hsValueScale = _hillshadeOptions.hsAdvValueScale![zoom];
    }

    // Render chunk by chunk.
    for (const chunk of chunks) {
      for (const tile of chunk) {
        const {
          coords,
          pixelData,
          canvasCoords,
        } = tile;

        textureManager.addTile(coords, pixelData);
        // if tile is just noData, don't do anything
        if (util.typedArraysAreEqual(pixelData, nodataTile)) {
          // console.log("nodata tile. exiting");
        } else {
          let textureCoords: number[][] = [];
          textureCoords = await util.getAdjacentTilesTexCoords(
            this.gloperations,
            this.textureManager,
            coords,
            url
          );

          let baselayerTexCoords: number[][] = [];
          // download baselayer tile if url specified
          if (_hillshadeOptions.hsAdvBaselayerUrl) {
            // TODO: Cache tiles and check if url has changed before fetching
            const basePixelData = await this.gloperations._fetchTileData(
              coords,
              _hillshadeOptions.hsAdvBaselayerUrl,
              "image",
            );
            const textureBounds = this.textureManagerHillshade.addTile(coords, basePixelData);
            baselayerTexCoords = util.getTexCoordVerticesTriangleStripQuad(textureBounds);
          }

          const fboFloats = regl.framebuffer({
            width: tileSize * 3,
            height: tileSize * 3,
            depth: false,
            colorType: "float",
          });

          let fboSmoothed = regl.framebuffer({
            width: tileSize * 3,
            height: tileSize * 3,
            depth: false,
            colorType: "float",
          });

          const fboNormals = regl.framebuffer({
            width: tileSize * 3,
            height: tileSize * 3,
            depth: false,
            colorType: "float",
          });

          const fboSoftShadowPP = util.PingPong(regl, {
            width: tileSize,
            height: tileSize,
            colorType: "float",
          });

          const fboAmbientShadowPP = util.PingPong(regl, {
            width: tileSize,
            height: tileSize,
            colorType: "float",
          });

          this.HsAdvMergeAndScaleTiles({
            canvasSize: [tileSize * 3, tileSize * 3],
            texture: textureManager.texture,
            fbo: fboFloats,
            floatScale: hsValueScale,
            texCoord: textureCoords,
            nodataValue: nodataValue,
          });

          if (_hillshadeOptions.hsAdvSmoothInput && _hillshadeOptions.hsAdvSmoothInputKernel > 0) {
            this.HsAdvSmooth({
              canvasSize: [tileSize * 3, tileSize * 3],
              canvasCoordinates: [0, 0],
              tInput: fboFloats,
              textureSize: tileSize * 3,
              kernelSize: _hillshadeOptions.hsAdvSmoothInputKernel,
              fbo: fboSmoothed,
            });
          } else {
            fboSmoothed = fboFloats;
          }

          this.HsAdvCalcNormals({
            canvasSize: [tileSize * 3, tileSize * 3],
            canvasCoordinates: [0, 0],
            tInput: fboSmoothed,
            pixelScale: pixelScale,
            onePixel: 1 / (tileSize * 3),
            fbo: fboNormals,
          });

          // Soft Shadows
          for (let i = 0; i < _hillshadeOptions.hsAdvSoftIterations!; i++) {
            this.HsAdvSoftShadows({
              canvasSize: [tileSize, tileSize],
              canvasCoordinates: [0, 0],
              tInput: fboSmoothed,
              tNormal: fboNormals,
              tSrc: fboSoftShadowPP.ping(),
              softIterations: _hillshadeOptions.hsAdvSoftIterations,
              resolution: [tileSize, tileSize],
              pixelScale: pixelScale,
              sunDirection: this.sunDirections[i],
              // fbo: i === _hillshadeOptions.hsAdvSoftIterations! - 1 ? undefined : fboSoftShadowPP.pong() // to show shadows
              fbo: fboSoftShadowPP.pong(),
            });
            fboSoftShadowPP.swap();
          }

          for (let i = 0; i < _hillshadeOptions.hsAdvAmbientIterations!; i++) {
            this.HsAdvAmbientShadows({
              canvasSize: [tileSize, tileSize],
              canvasCoordinates: [0, 0],
              tInput: fboSmoothed,
              tNormal: fboNormals,
              tSrc: fboAmbientShadowPP.ping(),
              ambientIterations: _hillshadeOptions.hsAdvAmbientIterations,
              direction: this.ambientDirections[i],
              resolution: [tileSize, tileSize],
              pixelScale: pixelScale,
              // fbo: i === _hillshadeOptions.hsAdvAmbientIterations! - 1 ? undefined : fboAmbientShadowPP.pong() // to show shadows
              fbo: fboAmbientShadowPP.pong(),
            });
            fboAmbientShadowPP.swap();
          }

          if (_hillshadeOptions.hsAdvBaselayerUrl) {
            // if url to baselayer is used, merge hs with this tile
            this.HsAdvFinalBaselayer({
              canvasSize: canvasSize,
              canvasCoordinates: canvasCoords,
              tBase: this.textureManagerHillshade.texture,
              baseTexCoords: baselayerTexCoords,
              tSoftShadow: fboSoftShadowPP.ping(),
              tAmbient: fboAmbientShadowPP.ping(),
              finalSoftMultiplier: _hillshadeOptions.hsAdvFinalSoftMultiplier,
              finalAmbientMultiplier: _hillshadeOptions.hsAdvFinalAmbientMultiplier,
            });
          } else {
            // if no url to baselayer, use colorscale to calculate colors to merge with hs.
            this.HsAdvFinalColorscale({
              scaleLength: this.scaleInput.length,
              sentinelLength: this.sentinelInput.length,
              scaleColormap: this.scaleColormap,
              sentinelColormap: this.sentinelColormap,
              canvasSize: canvasSize,
              canvasCoordinates: canvasCoords,
              tInput: fboFloats,
              tSoftShadow: fboSoftShadowPP.ping(),
              tAmbient: fboAmbientShadowPP.ping(),
              floatScale: hsValueScale,
              finalSoftMultiplier: _hillshadeOptions.hsAdvFinalSoftMultiplier,
              finalAmbientMultiplier: _hillshadeOptions.hsAdvFinalAmbientMultiplier,
            });
          }

          fboFloats.destroy();
          fboNormals.destroy();
          fboSoftShadowPP.destroy();
          fboAmbientShadowPP.destroy();
        }
      }
    }
  return canvasCoordinates;
  }

  renderTilesWithDiff(
    tilesA: TileDatum[],
    tilesB: TileDatum[],
    onFrameRendered: (canvasCoordinates: Array<Pair<number>>) => void,
  ) {
    const {
      regl,
      textureManagerA,
      textureManagerB,
      tileSize,
    } = this;

    // Compute required canvas dimensions, then resize the canvas.
    const canvasSize = this.computeRequiredCanvasDimensions(tilesA.length);
    const [canvasWidth, canvasHeight] = canvasSize;
    this.setCanvasSize(canvasWidth, canvasHeight);

    // Compute the coordinates at which each tile will be rendered in the canvas.
    const canvasCoordinates = this.getCanvasCoordinates(canvasWidth, canvasHeight, tilesA.length);

    interface TilesWithCanvasCoords {
      canvasCoords: Pair<number>;
      coords: TileCoordinates;
      tilesAPixelData: Uint8Array;
      tilesBPixelData: Uint8Array;
    }

    // Form an array combining each tile datum with the coordinates at which it will be rendered.
    const tilesWithCanvasCoordinates = zipWith<TileDatum | Pair<number>, TilesWithCanvasCoords>(
      tilesA,
      tilesB,
      canvasCoordinates,
      (tilesA: TileDatum, tilesB: TileDatum, canvasCoords: Pair<number>) => ({
        coords: tilesA.coords,
        tilesAPixelData: tilesA.pixelData,
        tilesBPixelData: tilesB.pixelData,
        canvasCoords,
      })
    );

    const resultEncodedPixels: Uint8Array[] = [];

    const renderFrame = () => {
      // Split the tiles array into chunks the size of the texture capacity. If we need to render more
      // tiles than will fit in the texture, we have to render in batches.
      const chunks = chunk(tilesWithCanvasCoordinates, textureManagerA.tileCapacity);

      // Clear the canvas.
      regl.clear({ color: CLEAR_COLOR });

      let tileIndex = 0;

      // Render chunk by chunk.
      for (const chunk of chunks) {
        // Add tiles.
        const tilesABounds = chunk.map(
          ({ coords, tilesAPixelData }) => textureManagerA.addTile(coords, tilesAPixelData),
        );
        const tilesBBounds = chunk.map(
          ({ coords, tilesBPixelData }) => textureManagerB.addTile(coords, tilesBPixelData),
        );

        chunk.forEach(({ canvasCoords }, index) => {
          const fboTile = regl.framebuffer({
            width: tileSize,
            height: tileSize,
            depth: false,
            colorFormat: "rgba",
            colorType: "uint8",
          });

          let resultEncodedPixelsTile = new Uint8Array(tileSize * tileSize * 4);

          this.calcTileDiff({
            canvasSize: [tileSize, tileSize],
            canvasCoordinates: [0, 0],
            textureA: textureManagerA.texture,
            textureB: textureManagerB.texture,
            textureBoundsA: tilesABounds[index],
            textureBoundsB: tilesBBounds[index],
            fbo:fboTile,
          });

          this.drawTileResult({
            scaleLength: this.scaleInput.length,
            sentinelLength: this.sentinelInput.length,
            scaleColormap: this.scaleColormap,
            sentinelColormap: this.sentinelColormap,
            canvasSize,
            canvasCoordinates: canvasCoords,
            texture: fboTile,
          });

          fboTile.use(() => {
            // Get encoded floatValues to use for mouseEvents
            regl.read({data: resultEncodedPixelsTile});
          });
          resultEncodedPixelsTile = this.flipReadPixelsUint(tileSize, tileSize, resultEncodedPixelsTile);
          // Add tile result to array
          resultEncodedPixels[tileIndex] = resultEncodedPixelsTile;
          tileIndex += 1;

          fboTile.destroy();
        });
      }

      // Invoke the callback with the canvas coordinates of the rendered tiles.
      onFrameRendered(canvasCoordinates);
    };

    renderFrame();

    // clean up TextureManagers
    this.textureManagerA.destroy();
    this.textureManagerB.destroy();
    this.textureManagerA = new TextureManager(regl, tileSize, MAX_TEXTURE_DIMENSION, false);
    this.textureManagerB = new TextureManager(regl, tileSize, MAX_TEXTURE_DIMENSION, false);

    return resultEncodedPixels;
  }

  renderTilesWithMultiAnalyze1(
    tilesA: TileDatum[],
    filterLowA : number,
    filterHighA : number,
    multiplierA: number,
    onFrameRendered: (canvasCoordinates: Array<Pair<number>>) => void,
  ) {
    const {
      regl,
      textureManagerA,
      tileSize,
    } = this;

    // Compute required canvas dimensions, then resize the canvas.
    const canvasSize = this.computeRequiredCanvasDimensions(tilesA.length);
    const [canvasWidth, canvasHeight] = canvasSize;
    this.setCanvasSize(canvasWidth, canvasHeight);

    // Compute the coordinates at which each tile will be rendered in the canvas.
    const canvasCoordinates = this.getCanvasCoordinates(canvasWidth, canvasHeight, tilesA.length);

    interface TilesWithCanvasCoords {
      canvasCoords: Pair<number>;
      coords: TileCoordinates;
      tilesAPixelData: Uint8Array;
    }

    // Form an array combining each tile datum with the coordinates at which it will be rendered.
    const tilesWithCanvasCoordinates = zipWith<TileDatum | Pair<number>, TilesWithCanvasCoords>(
      tilesA,
      canvasCoordinates,
      (tilesA: TileDatum, canvasCoords: Pair<number>) => ({
        coords: tilesA.coords,
        tilesAPixelData: tilesA.pixelData,
        canvasCoords,
      })
    );

    const resultEncodedPixels: Uint8Array[] = [];

    const renderFrame = () => {
      // Split the tiles array into chunks the size of the texture capacity. If we need to render more
      // tiles than will fit in the texture, we have to render in batches.
      const chunks = chunk(tilesWithCanvasCoordinates, textureManagerA.tileCapacity);

      // Clear the canvas.
      regl.clear({ color: CLEAR_COLOR });

      let tileIndex = 0;

      // Render chunk by chunk.
      for (const chunk of chunks) {
        // Add tiles.
        const tilesABounds = chunk.map(
          ({ coords, tilesAPixelData }) => textureManagerA.addTile(coords, tilesAPixelData),
        );

        chunk.forEach(({ canvasCoords }, index) => {
          const fboTile = regl.framebuffer({
            width: tileSize,
            height: tileSize,
            depth: false,
            colorFormat: "rgba",
            colorType: "uint8",
          });

          let resultEncodedPixelsTile = new Uint8Array(tileSize * tileSize * 4);

          this.calcTileMultiAnalyze1({
            canvasSize: [tileSize, tileSize],
            canvasCoordinates: [0, 0],
            textureA: textureManagerA.texture,
            textureBoundsA: tilesABounds[index],
            filterLowA: filterLowA,
            filterHighA: filterHighA,
            multiplierA: multiplierA,
            fbo:fboTile,
          });

          this.drawTileResult({
            scaleLength: this.scaleInput.length,
            sentinelLength: this.sentinelInput.length,
            scaleColormap: this.scaleColormap,
            sentinelColormap: this.sentinelColormap,
            canvasSize,
            canvasCoordinates: canvasCoords,
            texture: fboTile,
          });

          fboTile.use(() => {
            // Get encoded floatValues to use for mouseEvents
            regl.read({data: resultEncodedPixelsTile});
          });
          resultEncodedPixelsTile = this.flipReadPixelsUint(tileSize, tileSize, resultEncodedPixelsTile);
          // Add tile result to array
          resultEncodedPixels[tileIndex] = resultEncodedPixelsTile;
          tileIndex += 1;
          fboTile.destroy();
        });
      }

      // Invoke the callback with the canvas coordinates of the rendered tiles.
      onFrameRendered(canvasCoordinates);
    };

    renderFrame();

    // clean up TextureManagers
    this.textureManagerA.destroy();
    this.textureManagerA = new TextureManager(regl, tileSize, MAX_TEXTURE_DIMENSION, false);

    return resultEncodedPixels;
  }

  renderTilesWithMultiAnalyze2(
    tilesA: TileDatum[],
    tilesB: TileDatum[],
    filterLowA: number,
    filterHighA: number,
    filterLowB: number,
    filterHighB: number,
    multiplierA: number,
    multiplierB: number,
    onFrameRendered: (canvasCoordinates: Array<Pair<number>>) => void,
  ) {
    const {
      regl,
      textureManagerA,
      textureManagerB,
      tileSize,
    } = this;

    // Compute required canvas dimensions, then resize the canvas.
    const canvasSize = this.computeRequiredCanvasDimensions(tilesA.length);
    const [canvasWidth, canvasHeight] = canvasSize;
    this.setCanvasSize(canvasWidth, canvasHeight);

    // Compute the coordinates at which each tile will be rendered in the canvas.
    const canvasCoordinates = this.getCanvasCoordinates(canvasWidth, canvasHeight, tilesA.length);

    interface TilesWithCanvasCoords {
      canvasCoords: Pair<number>;
      coords: TileCoordinates;
      tilesAPixelData: Uint8Array;
      tilesBPixelData: Uint8Array;
    }

    // Form an array combining each tile datum with the coordinates at which it will be rendered.
    const tilesWithCanvasCoordinates = zipWith<TileDatum | Pair<number>, TilesWithCanvasCoords>(
      tilesA,
      tilesB,
      canvasCoordinates,
      (tilesA: TileDatum, tilesB: TileDatum, canvasCoords: Pair<number>) => ({
        coords: tilesA.coords,
        tilesAPixelData: tilesA.pixelData,
        tilesBPixelData: tilesB.pixelData,
        canvasCoords,
      })
    );

    const resultEncodedPixels: Uint8Array[] = [];

    const renderFrame = () => {
      // Split the tiles array into chunks the size of the texture capacity. If we need to render more
      // tiles than will fit in the texture, we have to render in batches.
      const chunks = chunk(tilesWithCanvasCoordinates, textureManagerA.tileCapacity);

      // Clear the canvas.
      regl.clear({ color: CLEAR_COLOR });

      let tileIndex = 0;

      // Render chunk by chunk.
      for (const chunk of chunks) {
        // Add tiles.
        const tilesABounds = chunk.map(
          ({ coords, tilesAPixelData }) => textureManagerA.addTile(coords, tilesAPixelData),
        );
        const tilesBBounds = chunk.map(
          ({ coords, tilesBPixelData }) => textureManagerB.addTile(coords, tilesBPixelData),
        );

        chunk.forEach(({ canvasCoords }, index) => {
          const fboTile = regl.framebuffer({
            width: tileSize,
            height: tileSize,
            depth: false,
            colorFormat: "rgba",
            colorType: "uint8",
          });

          let resultEncodedPixelsTile = new Uint8Array(tileSize * tileSize * 4);

          this.calcTileMultiAnalyze2({
            canvasSize: [tileSize, tileSize],
            canvasCoordinates: [0, 0],
            textureA: textureManagerA.texture,
            textureB: textureManagerB.texture,
            textureBoundsA: tilesABounds[index],
            textureBoundsB: tilesBBounds[index],
            filterLowA: filterLowA,
            filterHighA: filterHighA,
            filterLowB: filterLowB,
            filterHighB: filterHighB,
            multiplierA: multiplierA,
            multiplierB: multiplierB,
            fbo:fboTile,
          });

          this.drawTileResult({
            scaleLength: this.scaleInput.length,
            sentinelLength: this.sentinelInput.length,
            scaleColormap: this.scaleColormap,
            sentinelColormap: this.sentinelColormap,
            canvasSize,
            canvasCoordinates: canvasCoords,
            texture: fboTile,
          });

          fboTile.use(() => {
            // Get encoded floatValues to use for mouseEvents
            regl.read({data: resultEncodedPixelsTile});
          });
          resultEncodedPixelsTile = this.flipReadPixelsUint(tileSize, tileSize, resultEncodedPixelsTile);
          // Add tile result to array
          resultEncodedPixels[tileIndex] = resultEncodedPixelsTile;
          tileIndex += 1;
          fboTile.destroy();
        });
      }

      // Invoke the callback with the canvas coordinates of the rendered tiles.
      onFrameRendered(canvasCoordinates);
    };

    renderFrame();

    // clean up TextureManagers
    this.textureManagerA.destroy();
    this.textureManagerB.destroy();
    this.textureManagerA = new TextureManager(regl, tileSize, MAX_TEXTURE_DIMENSION, false);
    this.textureManagerB = new TextureManager(regl, tileSize, MAX_TEXTURE_DIMENSION, false);

    return resultEncodedPixels;
  }

  renderTilesWithMultiAnalyze3(
    tilesA: TileDatum[],
    tilesB: TileDatum[],
    tilesC: TileDatum[],
    filterLowA: number,
    filterHighA: number,
    filterLowB: number,
    filterHighB: number,
    filterLowC: number,
    filterHighC: number,
    multiplierA: number,
    multiplierB: number,
    multiplierC: number,
    onFrameRendered: (canvasCoordinates: Array<Pair<number>>) => void,
  ) {
    const {
      regl,
      textureManagerA,
      textureManagerB,
      textureManagerC,
      tileSize,
    } = this;

    // Compute required canvas dimensions, then resize the canvas.
    const canvasSize = this.computeRequiredCanvasDimensions(tilesA.length);
    const [canvasWidth, canvasHeight] = canvasSize;
    this.setCanvasSize(canvasWidth, canvasHeight);

    // Compute the coordinates at which each tile will be rendered in the canvas.
    const canvasCoordinates = this.getCanvasCoordinates(canvasWidth, canvasHeight, tilesA.length);

    interface TilesWithCanvasCoords {
      canvasCoords: Pair<number>;
      coords: TileCoordinates;
      tilesAPixelData: Uint8Array;
      tilesBPixelData: Uint8Array;
      tilesCPixelData: Uint8Array;
    }

    // Form an array combining each tile datum with the coordinates at which it will be rendered.
    const tilesWithCanvasCoordinates = zipWith<TileDatum | Pair<number>, TilesWithCanvasCoords>(
      tilesA,
      tilesB,
      tilesC,
      canvasCoordinates,
      (tilesA: TileDatum, tilesB: TileDatum, tilesC: TileDatum, canvasCoords: Pair<number>) => ({
        coords: tilesA.coords,
        tilesAPixelData: tilesA.pixelData,
        tilesBPixelData: tilesB.pixelData,
        tilesCPixelData: tilesC.pixelData,
        canvasCoords,
      })
    );

    const resultEncodedPixels: Uint8Array[] = [];

    const renderFrame = () => {
      // Split the tiles array into chunks the size of the texture capacity. If we need to render more
      // tiles than will fit in the texture, we have to render in batches.
      const chunks = chunk(tilesWithCanvasCoordinates, textureManagerA.tileCapacity);

      // Clear the canvas.
      regl.clear({ color: CLEAR_COLOR });

      let tileIndex = 0;

      // Render chunk by chunk.
      for (const chunk of chunks) {
        // Add tiles.
        const tilesABounds = chunk.map(
          ({ coords, tilesAPixelData }) => textureManagerA.addTile(coords, tilesAPixelData),
        );
        const tilesBBounds = chunk.map(
          ({ coords, tilesBPixelData }) => textureManagerB.addTile(coords, tilesBPixelData),
        );
        const tilesCBounds = chunk.map(
          ({ coords, tilesCPixelData }) => textureManagerC.addTile(coords, tilesCPixelData),
        );

        chunk.forEach(({ canvasCoords }, index) => {
          const fboTile = regl.framebuffer({
            width: tileSize,
            height: tileSize,
            depth: false,
            colorFormat: "rgba",
            colorType: "uint8",
          });

          let resultEncodedPixelsTile = new Uint8Array(tileSize * tileSize * 4);

          this.calcTileMultiAnalyze3({
            canvasSize: [tileSize, tileSize],
            canvasCoordinates: [0, 0],
            textureA: textureManagerA.texture,
            textureB: textureManagerB.texture,
            textureC: textureManagerC.texture,
            textureBoundsA: tilesABounds[index],
            textureBoundsB: tilesBBounds[index],
            textureBoundsC: tilesCBounds[index],
            filterLowA: filterLowA,
            filterHighA: filterHighA,
            filterLowB: filterLowB,
            filterHighB: filterHighB,
            filterLowC: filterLowC,
            filterHighC: filterHighC,
            multiplierA: multiplierA,
            multiplierB: multiplierB,
            multiplierC: multiplierC,
            fbo:fboTile,
          });

          this.drawTileResult({
            scaleLength: this.scaleInput.length,
            sentinelLength: this.sentinelInput.length,
            scaleColormap: this.scaleColormap,
            sentinelColormap: this.sentinelColormap,
            canvasSize,
            canvasCoordinates: canvasCoords,
            texture: fboTile,
          });

          fboTile.use(() => {
            // Get encoded floatValues to use for mouseEvents
            regl.read({data: resultEncodedPixelsTile});
          });
          resultEncodedPixelsTile = this.flipReadPixelsUint(tileSize, tileSize, resultEncodedPixelsTile);
          // Add tile result to array
          resultEncodedPixels[tileIndex] = resultEncodedPixelsTile;
          tileIndex += 1;
          fboTile.destroy();
        });
      }

      // Invoke the callback with the canvas coordinates of the rendered tiles.
      onFrameRendered(canvasCoordinates);
    };

    renderFrame();

    // clean up TextureManagers
    this.textureManagerA.destroy();
    this.textureManagerB.destroy();
    this.textureManagerC.destroy();
    this.textureManagerA = new TextureManager(regl, tileSize, MAX_TEXTURE_DIMENSION, false);
    this.textureManagerB = new TextureManager(regl, tileSize, MAX_TEXTURE_DIMENSION, false);
    this.textureManagerC = new TextureManager(regl, tileSize, MAX_TEXTURE_DIMENSION, false);

    return resultEncodedPixels;
  }

  renderTilesWithMultiAnalyze4(
    tilesA: TileDatum[],
    tilesB: TileDatum[],
    tilesC: TileDatum[],
    tilesD: TileDatum[],
    filterLowA: number,
    filterHighA: number,
    filterLowB: number,
    filterHighB: number,
    filterLowC: number,
    filterHighC: number,
    filterLowD: number,
    filterHighD: number,
    multiplierA: number,
    multiplierB: number,
    multiplierC: number,
    multiplierD: number,
    onFrameRendered: (canvasCoordinates: Array<Pair<number>>) => void,
  ) {
    const {
      regl,
      textureManagerA,
      textureManagerB,
      textureManagerC,
      textureManagerD,
      tileSize,
    } = this;

    // Compute required canvas dimensions, then resize the canvas.
    const canvasSize = this.computeRequiredCanvasDimensions(tilesA.length);
    const [canvasWidth, canvasHeight] = canvasSize;
    this.setCanvasSize(canvasWidth, canvasHeight);

    // Compute the coordinates at which each tile will be rendered in the canvas.
    const canvasCoordinates = this.getCanvasCoordinates(canvasWidth, canvasHeight, tilesA.length);

    interface TilesWithCanvasCoords {
      canvasCoords: Pair<number>;
      coords: TileCoordinates;
      tilesAPixelData: Uint8Array;
      tilesBPixelData: Uint8Array;
      tilesCPixelData: Uint8Array;
      tilesDPixelData: Uint8Array;
    }

    // Form an array combining each tile datum with the coordinates at which it will be rendered.
    const tilesWithCanvasCoordinates = zipWith<TileDatum | Pair<number>, TilesWithCanvasCoords>(
      tilesA,
      tilesB,
      tilesC,
      tilesD,
      canvasCoordinates,
      (tilesA: TileDatum, tilesB: TileDatum, tilesC: TileDatum, tilesD: TileDatum, canvasCoords: Pair<number>) => ({
        coords: tilesA.coords,
        tilesAPixelData: tilesA.pixelData,
        tilesBPixelData: tilesB.pixelData,
        tilesCPixelData: tilesC.pixelData,
        tilesDPixelData: tilesD.pixelData,
        canvasCoords,
      })
    );

    const resultEncodedPixels: Uint8Array[] = [];

    const renderFrame = () => {
      // Split the tiles array into chunks the size of the texture capacity. If we need to render more
      // tiles than will fit in the texture, we have to render in batches.
      const chunks = chunk(tilesWithCanvasCoordinates, textureManagerA.tileCapacity);

      // Clear the canvas.
      regl.clear({ color: CLEAR_COLOR });

      let tileIndex = 0;

      // Render chunk by chunk.
      for (const chunk of chunks) {
        // Add tiles.
        const tilesABounds = chunk.map(
          ({ coords, tilesAPixelData }) => textureManagerA.addTile(coords, tilesAPixelData),
        );
        const tilesBBounds = chunk.map(
          ({ coords, tilesBPixelData }) => textureManagerB.addTile(coords, tilesBPixelData),
        );
        const tilesCBounds = chunk.map(
          ({ coords, tilesCPixelData }) => textureManagerC.addTile(coords, tilesCPixelData),
        );
        const tilesDBounds = chunk.map(
          ({ coords, tilesDPixelData }) => textureManagerD.addTile(coords, tilesDPixelData),
        );

        chunk.forEach(({ canvasCoords }, index) => {
          const fboTile = regl.framebuffer({
            width: tileSize,
            height: tileSize,
            depth: false,
            colorFormat: "rgba",
            colorType: "uint8",
          });

          let resultEncodedPixelsTile = new Uint8Array(tileSize * tileSize * 4);

          this.calcTileMultiAnalyze4({
            canvasSize: [tileSize, tileSize],
            canvasCoordinates: [0, 0],
            textureA: textureManagerA.texture,
            textureB: textureManagerB.texture,
            textureC: textureManagerC.texture,
            textureD: textureManagerD.texture,
            textureBoundsA: tilesABounds[index],
            textureBoundsB: tilesBBounds[index],
            textureBoundsC: tilesCBounds[index],
            textureBoundsD: tilesDBounds[index],
            filterLowA: filterLowA,
            filterHighA: filterHighA,
            filterLowB: filterLowB,
            filterHighB: filterHighB,
            filterLowC: filterLowC,
            filterHighC: filterHighC,
            filterLowD: filterLowD,
            filterHighD: filterHighD,
            multiplierA: multiplierA,
            multiplierB: multiplierB,
            multiplierC: multiplierC,
            multiplierD: multiplierD,
            fbo:fboTile,
          });

          this.drawTileResult({
            scaleLength: this.scaleInput.length,
            sentinelLength: this.sentinelInput.length,
            scaleColormap: this.scaleColormap,
            sentinelColormap: this.sentinelColormap,
            canvasSize,
            canvasCoordinates: canvasCoords,
            texture: fboTile,
          });

          fboTile.use(() => {
            // Get encoded floatValues to use for mouseEvents
            regl.read({data: resultEncodedPixelsTile});
          });
          resultEncodedPixelsTile = this.flipReadPixelsUint(tileSize, tileSize, resultEncodedPixelsTile);
          // Add tile result to array
          resultEncodedPixels[tileIndex] = resultEncodedPixelsTile;
          tileIndex += 1;
          fboTile.destroy();
        });
      }

      // Invoke the callback with the canvas coordinates of the rendered tiles.
      onFrameRendered(canvasCoordinates);
    };

    renderFrame();

    // clean up TextureManagers
    this.textureManagerA.destroy();
    this.textureManagerB.destroy();
    this.textureManagerC.destroy();
    this.textureManagerD.destroy();
    this.textureManagerA = new TextureManager(regl, tileSize, MAX_TEXTURE_DIMENSION, false);
    this.textureManagerB = new TextureManager(regl, tileSize, MAX_TEXTURE_DIMENSION, false);
    this.textureManagerC = new TextureManager(regl, tileSize, MAX_TEXTURE_DIMENSION, false);
    this.textureManagerD = new TextureManager(regl, tileSize, MAX_TEXTURE_DIMENSION, false);

    return resultEncodedPixels;
  }

  renderTilesWithMultiAnalyze5(
    tilesA: TileDatum[],
    tilesB: TileDatum[],
    tilesC: TileDatum[],
    tilesD: TileDatum[],
    tilesE: TileDatum[],
    filterLowA: number,
    filterHighA: number,
    filterLowB: number,
    filterHighB: number,
    filterLowC: number,
    filterHighC: number,
    filterLowD: number,
    filterHighD: number,
    filterLowE: number,
    filterHighE: number,
    multiplierA: number,
    multiplierB: number,
    multiplierC: number,
    multiplierD: number,
    multiplierE: number,
    onFrameRendered: (canvasCoordinates: Array<Pair<number>>) => void,
  ) {
    const {
      regl,
      textureManagerA,
      textureManagerB,
      textureManagerC,
      textureManagerD,
      textureManagerE,
      tileSize,
    } = this;

    // Compute required canvas dimensions, then resize the canvas.
    const canvasSize = this.computeRequiredCanvasDimensions(tilesA.length);
    const [canvasWidth, canvasHeight] = canvasSize;
    this.setCanvasSize(canvasWidth, canvasHeight);

    // Compute the coordinates at which each tile will be rendered in the canvas.
    const canvasCoordinates = this.getCanvasCoordinates(canvasWidth, canvasHeight, tilesA.length);

    interface TilesWithCanvasCoords {
      canvasCoords: Pair<number>;
      coords: TileCoordinates;
      tilesAPixelData: Uint8Array;
      tilesBPixelData: Uint8Array;
      tilesCPixelData: Uint8Array;
      tilesDPixelData: Uint8Array;
      tilesEPixelData: Uint8Array;
    }

    // Form an array combining each tile datum with the coordinates at which it will be rendered.
    const tilesWithCanvasCoordinates = zipWith<TileDatum | Pair<number>, TilesWithCanvasCoords>(
      tilesA,
      tilesB,
      tilesC,
      tilesD,
      tilesE,
      canvasCoordinates,
      (tilesA: TileDatum, tilesB: TileDatum, tilesC: TileDatum, tilesD: TileDatum, tilesE: TileDatum, canvasCoords: Pair<number>) => ({
        coords: tilesA.coords,
        tilesAPixelData: tilesA.pixelData,
        tilesBPixelData: tilesB.pixelData,
        tilesCPixelData: tilesC.pixelData,
        tilesDPixelData: tilesD.pixelData,
        tilesEPixelData: tilesE.pixelData,
        canvasCoords,
      })
    );

    const resultEncodedPixels: Uint8Array[] = [];

    const renderFrame = () => {
      // Split the tiles array into chunks the size of the texture capacity. If we need to render more
      // tiles than will fit in the texture, we have to render in batches.
      const chunks = chunk(tilesWithCanvasCoordinates, textureManagerA.tileCapacity);

      // Clear the canvas.
      regl.clear({ color: CLEAR_COLOR });

      let tileIndex = 0;

      // Render chunk by chunk.
      for (const chunk of chunks) {
        // Add tiles.
        const tilesABounds = chunk.map(
          ({ coords, tilesAPixelData }) => textureManagerA.addTile(coords, tilesAPixelData),
        );
        const tilesBBounds = chunk.map(
          ({ coords, tilesBPixelData }) => textureManagerB.addTile(coords, tilesBPixelData),
        );
        const tilesCBounds = chunk.map(
          ({ coords, tilesCPixelData }) => textureManagerC.addTile(coords, tilesCPixelData),
        );
        const tilesDBounds = chunk.map(
          ({ coords, tilesDPixelData }) => textureManagerD.addTile(coords, tilesDPixelData),
        );
        const tilesEBounds = chunk.map(
          ({ coords, tilesEPixelData }) => textureManagerE.addTile(coords, tilesEPixelData),
        );

        chunk.forEach(({ canvasCoords }, index) => {
          const fboTile = regl.framebuffer({
            width: tileSize,
            height: tileSize,
            depth: false,
            colorFormat: "rgba",
            colorType: "uint8",
          });

          let resultEncodedPixelsTile = new Uint8Array(tileSize * tileSize * 4);

          this.calcTileMultiAnalyze5({
            canvasSize: [tileSize, tileSize],
            canvasCoordinates: [0, 0],
            textureA: textureManagerA.texture,
            textureB: textureManagerB.texture,
            textureC: textureManagerC.texture,
            textureD: textureManagerD.texture,
            textureE: textureManagerE.texture,
            textureBoundsA: tilesABounds[index],
            textureBoundsB: tilesBBounds[index],
            textureBoundsC: tilesCBounds[index],
            textureBoundsD: tilesDBounds[index],
            textureBoundsE: tilesEBounds[index],
            filterLowA: filterLowA,
            filterHighA: filterHighA,
            filterLowB: filterLowB,
            filterHighB: filterHighB,
            filterLowC: filterLowC,
            filterHighC: filterHighC,
            filterLowD: filterLowD,
            filterHighD: filterHighD,
            filterLowE: filterLowE,
            filterHighE: filterHighE,
            multiplierA: multiplierA,
            multiplierB: multiplierB,
            multiplierC: multiplierC,
            multiplierD: multiplierD,
            multiplierE: multiplierE,
            fbo:fboTile,
          });

          this.drawTileResult({
            scaleLength: this.scaleInput.length,
            sentinelLength: this.sentinelInput.length,
            scaleColormap: this.scaleColormap,
            sentinelColormap: this.sentinelColormap,
            canvasSize,
            canvasCoordinates: canvasCoords,
            texture: fboTile,
          });

          fboTile.use(() => {
            // Get encoded floatValues to use for mouseEvents
            regl.read({data: resultEncodedPixelsTile});
          });
          resultEncodedPixelsTile = this.flipReadPixelsUint(tileSize, tileSize, resultEncodedPixelsTile);
          // Add tile result to array
          resultEncodedPixels[tileIndex] = resultEncodedPixelsTile;
          tileIndex += 1;
          fboTile.destroy();
        });
      }

      // Invoke the callback with the canvas coordinates of the rendered tiles.
      onFrameRendered(canvasCoordinates);
    };

    renderFrame();

    // clean up TextureManagers
    this.textureManagerA.destroy();
    this.textureManagerB.destroy();
    this.textureManagerC.destroy();
    this.textureManagerD.destroy();
    this.textureManagerE.destroy();
    this.textureManagerA = new TextureManager(regl, tileSize, MAX_TEXTURE_DIMENSION, false);
    this.textureManagerB = new TextureManager(regl, tileSize, MAX_TEXTURE_DIMENSION, false);
    this.textureManagerC = new TextureManager(regl, tileSize, MAX_TEXTURE_DIMENSION, false);
    this.textureManagerD = new TextureManager(regl, tileSize, MAX_TEXTURE_DIMENSION, false);
    this.textureManagerE = new TextureManager(regl, tileSize, MAX_TEXTURE_DIMENSION, false);

    return resultEncodedPixels;
  }

  renderTilesWithMultiAnalyze6(
    tilesA: TileDatum[],
    tilesB: TileDatum[],
    tilesC: TileDatum[],
    tilesD: TileDatum[],
    tilesE: TileDatum[],
    tilesF: TileDatum[],
    filterLowA: number,
    filterHighA: number,
    filterLowB: number,
    filterHighB: number,
    filterLowC: number,
    filterHighC: number,
    filterLowD: number,
    filterHighD: number,
    filterLowE: number,
    filterHighE: number,
    filterLowF: number,
    filterHighF: number,
    multiplierA: number,
    multiplierB: number,
    multiplierC: number,
    multiplierD: number,
    multiplierE: number,
    multiplierF: number,
    onFrameRendered: (canvasCoordinates: Array<Pair<number>>) => void,
  ) {
    const {
      regl,
      textureManagerA,
      textureManagerB,
      textureManagerC,
      textureManagerD,
      textureManagerE,
      textureManagerF,
      tileSize,
    } = this;

    // Compute required canvas dimensions, then resize the canvas.
    const canvasSize = this.computeRequiredCanvasDimensions(tilesA.length);
    const [canvasWidth, canvasHeight] = canvasSize;
    this.setCanvasSize(canvasWidth, canvasHeight);

    // Compute the coordinates at which each tile will be rendered in the canvas.
    const canvasCoordinates = this.getCanvasCoordinates(canvasWidth, canvasHeight, tilesA.length);

    interface TilesWithCanvasCoords {
      canvasCoords: Pair<number>;
      coords: TileCoordinates;
      tilesAPixelData: Uint8Array;
      tilesBPixelData: Uint8Array;
      tilesCPixelData: Uint8Array;
      tilesDPixelData: Uint8Array;
      tilesEPixelData: Uint8Array;
      tilesFPixelData: Uint8Array;
    }

    // Form an array combining each tile datum with the coordinates at which it will be rendered.
    const tilesWithCanvasCoordinates = zipWith<TileDatum | Pair<number>, TilesWithCanvasCoords>(
      tilesA,
      tilesB,
      tilesC,
      tilesD,
      tilesE,
      tilesF,
      canvasCoordinates,
      (tilesA: TileDatum, tilesB: TileDatum, tilesC: TileDatum, tilesD: TileDatum, tilesE: TileDatum, tilesF: TileDatum, canvasCoords: Pair<number>) => ({
        coords: tilesA.coords,
        tilesAPixelData: tilesA.pixelData,
        tilesBPixelData: tilesB.pixelData,
        tilesCPixelData: tilesC.pixelData,
        tilesDPixelData: tilesD.pixelData,
        tilesEPixelData: tilesE.pixelData,
        tilesFPixelData: tilesF.pixelData,
        canvasCoords,
      }),
    );

    const resultEncodedPixels: Uint8Array[] = [];

    const renderFrame = () => {
      // Split the tiles array into chunks the size of the texture capacity. If we need to render more
      // tiles than will fit in the texture, we have to render in batches.
      const chunks = chunk(tilesWithCanvasCoordinates, textureManagerA.tileCapacity);

      // Clear the canvas.
      regl.clear({ color: CLEAR_COLOR });

      let tileIndex = 0;

      // Render chunk by chunk.
      for (const chunk of chunks) {
        // Add tiles.
        const tilesABounds = chunk.map(
          ({ coords, tilesAPixelData }) => textureManagerA.addTile(coords, tilesAPixelData),
        );
        const tilesBBounds = chunk.map(
          ({ coords, tilesBPixelData }) => textureManagerB.addTile(coords, tilesBPixelData),
        );
        const tilesCBounds = chunk.map(
          ({ coords, tilesCPixelData }) => textureManagerC.addTile(coords, tilesCPixelData),
        );
        const tilesDBounds = chunk.map(
          ({ coords, tilesDPixelData }) => textureManagerD.addTile(coords, tilesDPixelData),
        );
        const tilesEBounds = chunk.map(
          ({ coords, tilesEPixelData }) => textureManagerE.addTile(coords, tilesEPixelData),
        );
        const tilesFBounds = chunk.map(
          ({ coords, tilesFPixelData }) => textureManagerF.addTile(coords, tilesFPixelData),
        );

        chunk.forEach(({ canvasCoords }, index) => {
          const fboTile = regl.framebuffer({
            width: tileSize,
            height: tileSize,
            depth: false,
            colorFormat: "rgba",
            colorType: "uint8",
          });

          let resultEncodedPixelsTile = new Uint8Array(tileSize * tileSize * 4);

          this.calcTileMultiAnalyze6({
            canvasSize: [tileSize, tileSize],
            canvasCoordinates: [0, 0],
            textureA: textureManagerA.texture,
            textureB: textureManagerB.texture,
            textureC: textureManagerC.texture,
            textureD: textureManagerD.texture,
            textureE: textureManagerE.texture,
            textureF: textureManagerF.texture,
            textureBoundsA: tilesABounds[index],
            textureBoundsB: tilesBBounds[index],
            textureBoundsC: tilesCBounds[index],
            textureBoundsD: tilesDBounds[index],
            textureBoundsE: tilesEBounds[index],
            textureBoundsF: tilesFBounds[index],
            filterLowA: filterLowA,
            filterHighA: filterHighA,
            filterLowB: filterLowB,
            filterHighB: filterHighB,
            filterLowC: filterLowC,
            filterHighC: filterHighC,
            filterLowD: filterLowD,
            filterHighD: filterHighD,
            filterLowE: filterLowE,
            filterHighE: filterHighE,
            filterLowF: filterLowF,
            filterHighF: filterHighF,
            multiplierA: multiplierA,
            multiplierB: multiplierB,
            multiplierC: multiplierC,
            multiplierD: multiplierD,
            multiplierE: multiplierE,
            multiplierF: multiplierF,
            fbo:fboTile,
          });

          this.drawTileResult({
            scaleLength: this.scaleInput.length,
            sentinelLength: this.sentinelInput.length,
            scaleColormap: this.scaleColormap,
            sentinelColormap: this.sentinelColormap,
            canvasSize,
            canvasCoordinates: canvasCoords,
            texture: fboTile,
          });

          fboTile.use(() => {
            // Get encoded floatValues to use for mouseEvents
            regl.read({data: resultEncodedPixelsTile});
          });
          resultEncodedPixelsTile = this.flipReadPixelsUint(tileSize, tileSize, resultEncodedPixelsTile);
          // Add tile result to array
          resultEncodedPixels[tileIndex] = resultEncodedPixelsTile;
          tileIndex += 1;
          fboTile.destroy();
        });
      }

      // Invoke the callback with the canvas coordinates of the rendered tiles.
      onFrameRendered(canvasCoordinates);
    };

    renderFrame();

    // clean up TextureManagers
    this.textureManagerA.destroy();
    this.textureManagerB.destroy();
    this.textureManagerC.destroy();
    this.textureManagerD.destroy();
    this.textureManagerE.destroy();
    this.textureManagerF.destroy();
    this.textureManagerA = new TextureManager(regl, tileSize, MAX_TEXTURE_DIMENSION, false);
    this.textureManagerB = new TextureManager(regl, tileSize, MAX_TEXTURE_DIMENSION, false);
    this.textureManagerC = new TextureManager(regl, tileSize, MAX_TEXTURE_DIMENSION, false);
    this.textureManagerD = new TextureManager(regl, tileSize, MAX_TEXTURE_DIMENSION, false);
    this.textureManagerE = new TextureManager(regl, tileSize, MAX_TEXTURE_DIMENSION, false);
    this.textureManagerF = new TextureManager(regl, tileSize, MAX_TEXTURE_DIMENSION, false);

    return resultEncodedPixels;
  }

  async renderTilesWithTransition(
    oldTiles: TileDatum[],
    newTiles: TileDatum[],
    transitionDurationMs: number,
    onFrameRendered: (canvasCoordinates: Array<Pair<number>>) => void,
  ) {
    const {
      regl,
      textureManager,
      tileSize,
      normalTextureDimension,
    } = this;

    // Compute required canvas dimensions, then resize the canvas.
    const canvasSize = this.computeRequiredCanvasDimensions(oldTiles.length);
    const [canvasWidth, canvasHeight] = canvasSize;
    this.setCanvasSize(canvasWidth, canvasHeight);

    // Compute the coordinates at which each tile will be rendered in the canvas.
    const canvasCoordinates = this.getCanvasCoordinates(canvasWidth, canvasHeight, oldTiles.length);

    interface TilesWithCanvasCoords {
      canvasCoords: Pair<number>;
      coords: TileCoordinates;
      oldPixelData: Uint8Array;
      newPixelData: Uint8Array;
    }

    // Form an array combining each tile datum with the coordinates at which it will be rendered.
    const tilesWithCanvasCoordinates = zipWith<TileDatum | Pair<number>, TilesWithCanvasCoords>(
      oldTiles,
      newTiles,
      canvasCoordinates,
      (oldTile: TileDatum, newTile: TileDatum, canvasCoords: Pair<number>) => ({
        coords: oldTile.coords,
        oldPixelData: oldTile.pixelData,
        newPixelData: newTile.pixelData,
        canvasCoords,
      })
    );

    // Create a new TextureManager to hold the new data. After the transition, this will replace the
    // Renderer's stored TextureManager.
    const newTextureManager = new TextureManager(regl, tileSize, normalTextureDimension, false);

    // Record the starting time.
    const transitionStart = regl.now();

    const renderFrame = (interpolationFraction: number) => {
      // Split the tiles array into chunks the size of the texture capacity. If we need to render more
      // tiles than will fit in the texture, we have to render in batches.
      const chunks = chunk(tilesWithCanvasCoordinates, textureManager.tileCapacity);

      // Clear the canvas.
      regl.clear({ color: CLEAR_COLOR });

      // Render chunk by chunk.
      for (const chunk of chunks) {
        // Add tiles.
        const oldTextureBounds = chunk.map(
          ({ coords, oldPixelData }) => textureManager.addTile(coords, oldPixelData),
        );
        const newTextureBounds = chunk.map(
          ({ coords, newPixelData }) => newTextureManager.addTile(coords, newPixelData),
        );

        // Render each tile.
        this.drawTileInterpolateValue(chunk.map(({ canvasCoords }, index) => ({
          scaleLength: this.scaleInput.length,
          sentinelLength: this.sentinelInput.length,
          scaleColormap: this.scaleColormap,
          sentinelColormap: this.sentinelColormap,
          canvasSize,
          canvasCoordinates: canvasCoords,
          textureA: textureManager.texture,
          textureB: newTextureManager.texture,
          textureBoundsA: oldTextureBounds[index],
          textureBoundsB: newTextureBounds[index],
          interpolationFraction,
        })));
      }

      // Invoke the callback with the canvas coordinates of the rendered tiles.
      onFrameRendered(canvasCoordinates);
    };

    const animationHandle = regl.frame(({ time }) => {
      const elapsedTimeMs = (time - transitionStart) * 1000;
      const interpolationFraction = elapsedTimeMs / transitionDurationMs;
      renderFrame(interpolationFraction);
    });

    await util.Timer(transitionDurationMs);
    animationHandle.cancel();

    // Render again, in case previous frames didn't make it all the way to interpolationFraction 1.0.
    renderFrame(1);

    // Clean up the old TextureManager and replace it with the new one.
    this.textureManager.destroy();
    this.textureManager = newTextureManager;
  }

  async renderTilesWithTransitionAndNewColorScale(
    oldTiles: TileDatum[],
    newTiles: TileDatum[],
    transitionDurationMs: number,
    onFrameRendered: (canvasCoordinates: Array<Pair<number>>) => void,
  ) {
    const {
      regl,
      textureManager,
      tileSize,
      normalTextureDimension,
    } = this;

    // Compute required canvas dimensions, then resize the canvas.
    const canvasSize = this.computeRequiredCanvasDimensions(oldTiles.length);
    const [canvasWidth, canvasHeight] = canvasSize;
    this.setCanvasSize(canvasWidth, canvasHeight);

    // Compute the coordinates at which each tile will be rendered in the canvas.
    const canvasCoordinates = this.getCanvasCoordinates(canvasWidth, canvasHeight, oldTiles.length);

    interface TilesWithCanvasCoords {
      canvasCoords: Pair<number>;
      coords: TileCoordinates;
      oldPixelData: Uint8Array;
      newPixelData: Uint8Array;
    }

    // Form an array combining each tile datum with the coordinates at which it will be rendered.
    const tilesWithCanvasCoordinates = zipWith<TileDatum | Pair<number>, TilesWithCanvasCoords>(
      oldTiles,
      newTiles,
      canvasCoordinates,
      (oldTile: TileDatum, newTile: TileDatum, canvasCoords: Pair<number>) => ({
        coords: oldTile.coords,
        oldPixelData: oldTile.pixelData,
        newPixelData: newTile.pixelData,
        canvasCoords,
      }),
    );

    // Create a new TextureManager to hold the new data. After the transition, this will replace the
    // Renderer's stored TextureManager.
    const newTextureManager = new TextureManager(regl, tileSize, normalTextureDimension, false);

    // Record the starting time.
    const transitionStart = regl.now();

    const renderFrame = (interpolationFraction: number) => {
      // Split the tiles array into chunks the size of the texture capacity. If we need to render more
      // tiles than will fit in the texture, we have to render in batches.
      const chunks = chunk(tilesWithCanvasCoordinates, textureManager.tileCapacity);

      // Clear the canvas.
      regl.clear({ color: CLEAR_COLOR });

      // Render chunk by chunk.
      for (const chunk of chunks) {
        // Add tiles.
        const oldTextureBounds = chunk.map(
          ({ coords, oldPixelData }) => textureManager.addTile(coords, oldPixelData),
        );
        const newTextureBounds = chunk.map(
          ({ coords, newPixelData }) => newTextureManager.addTile(coords, newPixelData),
        );

        // Render each tile.
        this.drawTileInterpolateColor(
          chunk.map(({ canvasCoords }, index) => ({
            scaleLengthA: this.scaleInputPrevious.length,
            sentinelLengthA: this.sentinelInputPrevious.length,
            scaleColormapA: this.scaleColormapPrevious,
            sentinelColormapA: this.sentinelColormapPrevious,
            scaleLengthB: this.scaleInput.length,
            sentinelLengthB: this.sentinelInput.length,
            scaleColormapB: this.scaleColormap,
            sentinelColormapB: this.sentinelColormap,
            canvasSize,
            canvasCoordinates: canvasCoords,
            textureA: textureManager.texture,
            textureB: newTextureManager.texture,
            textureBoundsA: oldTextureBounds[index],
            textureBoundsB: newTextureBounds[index],
            interpolationFraction,
          }))
        );
      }

      // Invoke the callback with the canvas coordinates of the rendered tiles.
      onFrameRendered(canvasCoordinates);
    };

    const animationHandle = regl.frame(({ time }) => {
      const elapsedTimeMs = (time - transitionStart) * 1000;
      const interpolationFraction = elapsedTimeMs / transitionDurationMs;
      renderFrame(interpolationFraction);
    });

    await util.Timer(transitionDurationMs);
    animationHandle.cancel();

    // Render again, in case previous frames didn't make it all the way to interpolationFraction 1.0.
    renderFrame(1);

    // Clean up the old TextureManager and replace it with the new one.
    this.textureManager.destroy();
    this.textureManager = newTextureManager;
  }

  async renderTilesWithTransitionAndNewColorScaleOnly(
    tiles: TileDatum[],
    transitionDurationMs: number,
    onFrameRendered: (canvasCoordinates: Array<Pair<number>>) => void,
  ) {
    const {
      regl,
      textureManager,
      tileSize,
      normalTextureDimension,
    } = this;

    // Compute required canvas dimensions, then resize the canvas.
    const canvasSize = this.computeRequiredCanvasDimensions(tiles.length);
    const [canvasWidth, canvasHeight] = canvasSize;
    this.setCanvasSize(canvasWidth, canvasHeight);

    // Compute the coordinates at which each tile will be rendered in the canvas.
    const canvasCoordinates = this.getCanvasCoordinates(canvasWidth, canvasHeight, tiles.length);

    type TileWithCanvasCoords = TileDatum & { canvasCoords: Pair<number> };

    // Form an array combining each tile datum with the coordinates at which it will be rendered.
    const tilesWithCanvasCoordinates = zipWith<TileDatum | Pair<number>, TileWithCanvasCoords>(
      tiles,
      canvasCoordinates,
      (tile: TileDatum, canvasCoords: Pair<number>) => ({
        ...tile,
        canvasCoords,
      })
    );

    // Create a new TextureManager to hold the new data. After the transition, this will replace the
    // Renderer's stored TextureManager.
    const newTextureManager = new TextureManager(regl, tileSize, normalTextureDimension, false);

    // Record the starting time.
    const transitionStart = regl.now();

    const renderFrame = (interpolationFraction: number) => {
      // Split the tiles array into chunks the size of the texture capacity. If we need to render more
      // tiles than will fit in the texture, we have to render in batches.
      const chunks = chunk(tilesWithCanvasCoordinates, textureManager.tileCapacity);

      // Clear the canvas.
      regl.clear({ color: CLEAR_COLOR });

      // Render chunk by chunk.
      for (const chunk of chunks) {
        // Add tiles.
        const textureBounds = chunk.map(
          ({ coords, pixelData }) => textureManager.addTile(coords, pixelData),
        );

        // Render each tile.
        this.drawTileInterpolateColorOnly(
          chunk.map(({ canvasCoords }, index) => ({
            scaleLengthA: this.scaleInputPrevious.length,
            sentinelLengthA: this.sentinelInputPrevious.length,
            scaleColormapA: this.scaleColormapPrevious,
            sentinelColormapA: this.sentinelColormapPrevious,
            scaleLengthB: this.scaleInput.length,
            sentinelLengthB: this.sentinelInput.length,
            scaleColormapB: this.scaleColormap,
            sentinelColormapB: this.sentinelColormap,
            canvasSize,
            canvasCoordinates: canvasCoords,
            texture: textureManager.texture,
            textureBounds: textureBounds[index],
            interpolationFraction,
          }))
        );
      }

      // Invoke the callback with the canvas coordinates of the rendered tiles.
      onFrameRendered(canvasCoordinates);
    };

    const animationHandle = regl.frame(({ time }) => {
      const elapsedTimeMs = (time - transitionStart) * 1000;
      const interpolationFraction = elapsedTimeMs / transitionDurationMs;
      renderFrame(interpolationFraction);
    });

    await util.Timer(transitionDurationMs);
    animationHandle.cancel();

    // Render again, in case previous frames didn't make it all the way to interpolationFraction 1.0.
    renderFrame(1);

    // Clean up the old TextureManager and replace it with the new one.
    this.textureManager.destroy();
    this.textureManager = newTextureManager;
  }

  generateSunDirections(iterations: number, sunRadiusMultiplier: number): void {
    const sunDirections = [];
    for (let i = 0; i < iterations; i++) {
      const direction = vec3.normalize(
        vec3.create(),
        vec3.add(
          vec3.create(),
          vec3.scale(
            vec3.create(),
            vec3.normalize(vec3.create(), [1, 1, 1]),
            EARTH_SUN_DISTANCE
          ),
          vec3.random(vec3.create(), SUN_RADIUS * sunRadiusMultiplier)
        )
      );
      sunDirections.push(direction);
    }
    this.sunDirections = sunDirections;
  }

  generateAmbientDirections(iterations: number): void {
    const ambientDirections = [];
    for (let i = 0; i < iterations; i++) {
      const direction = vec3.random(vec3.create(), Math.random());
      ambientDirections.push(direction);
    }
    this.ambientDirections = ambientDirections;
  }

  removeTile(tileCoordinates: TileCoordinates): void {
    this.textureManager.removeTile(tileCoordinates);
  }

  protected setCanvasSize(width: number, height: number): void {
    Object.assign(this.canvas, { width, height });
  }

  protected computeRequiredCanvasDimensions(numTiles: number): Pair<number> {
    const { tileSize } = this;
    const tilesAcross = Math.ceil(Math.sqrt(numTiles));
    const tilesDown = Math.ceil(numTiles / tilesAcross);
    return [tilesAcross * tileSize, tilesDown * tileSize];
  }

  protected getCanvasCoordinates(canvasWidth: number, canvasHeight: number, numTiles: number): Array<Pair<number>> {
    const { tileSize } = this;
    return flatMap(util.range(0, canvasHeight, tileSize), y =>
      util.range(0, canvasWidth, tileSize).map(x => [x, y] as Pair<number>),
    ).slice(0, numTiles);
  }
}
