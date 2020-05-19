import * as L from 'leaflet';
import {
  chunk,
  flatMap,
  zipWith,
} from 'lodash-es';
import REGL, { Framebuffer2D } from 'regl';

import { CLEAR_COLOR, MAX_TEXTURE_DIMENSION } from './constants';
import * as commands from './regl-commands';
import TextureManager from './TextureManager';
import {
  DrawTile,
  DrawTileHsSimple,
  DrawTileHsPregen,
  DrawTileInterpolateColor,
  DrawTileInterpolateColorOnly,
  DrawTileInterpolateValue,
  CalcTileMultiAnalyze1,
  DrawTileMultiAnalyze1,
  CalcTileMultiAnalyze2,
  DrawTileMultiAnalyze2,
  CalcTileMultiAnalyze3,
  DrawTileMultiAnalyze3,
  CalcTileMultiAnalyze4,
  DrawTileMultiAnalyze4,
  CalcTileMultiAnalyze5,
  DrawTileMultiAnalyze5,
  CalcTileMultiAnalyze6,
  DrawTileMultiAnalyze6,
  DrawTileDiff,
  CalcTileDiff,
  ConvolutionSmooth,
  Pair,
  calcResult,
  TileCoordinates,
  TileDatum,
  HillshadeOptions,
} from './types';
import * as util from './util';

import {
  Color,
  SentinelValue,
} from './types';

export default class Renderer {
  canvas: HTMLCanvasElement;
  regl: REGL.Regl;
  textureManager: TextureManager;
  textureManagerA: TextureManager;
  textureManagerB: TextureManager;
  textureManagerC: TextureManager;
  textureManagerD: TextureManager;
  textureManagerE: TextureManager;
  textureManagerF: TextureManager;
  textureManagerHillshade: TextureManager;
  tileSize: number;
  fboTile: Framebuffer2D;
  maxTextureDimension: number;

  // Regl draw commands.
  drawTile: REGL.DrawCommand<REGL.DefaultContext, DrawTile.Props>;
  drawTileHsSimple: REGL.DrawCommand<REGL.DefaultContext, DrawTileHsSimple.Props>;
  drawTileHsPregen: REGL.DrawCommand<REGL.DefaultContext, DrawTileHsPregen.Props>;
  drawTileInterpolateColor: REGL.DrawCommand<REGL.DefaultContext, DrawTileInterpolateColor.Props>;
  drawTileInterpolateColorOnly: REGL.DrawCommand<REGL.DefaultContext, DrawTileInterpolateColorOnly.Props>;
  drawTileInterpolateValue: REGL.DrawCommand<REGL.DefaultContext, DrawTileInterpolateValue.Props>;
  calcTileDiff: REGL.DrawCommand<REGL.DefaultContext, CalcTileDiff.Props>;
  drawTileDiff: REGL.DrawCommand<REGL.DefaultContext, DrawTileDiff.Props>;
  calcTileMultiAnalyze1: REGL.DrawCommand<REGL.DefaultContext, CalcTileMultiAnalyze1.Props>;
  drawTileMultiAnalyze1: REGL.DrawCommand<REGL.DefaultContext, DrawTileMultiAnalyze1.Props>;
  calcTileMultiAnalyze2: REGL.DrawCommand<REGL.DefaultContext, CalcTileMultiAnalyze2.Props>;
  drawTileMultiAnalyze2: REGL.DrawCommand<REGL.DefaultContext, DrawTileMultiAnalyze2.Props>;
  calcTileMultiAnalyze3: REGL.DrawCommand<REGL.DefaultContext, CalcTileMultiAnalyze3.Props>;
  drawTileMultiAnalyze3: REGL.DrawCommand<REGL.DefaultContext, DrawTileMultiAnalyze3.Props>;
  calcTileMultiAnalyze4: REGL.DrawCommand<REGL.DefaultContext, CalcTileMultiAnalyze4.Props>;
  drawTileMultiAnalyze4: REGL.DrawCommand<REGL.DefaultContext, DrawTileMultiAnalyze4.Props>;
  calcTileMultiAnalyze5: REGL.DrawCommand<REGL.DefaultContext, CalcTileMultiAnalyze5.Props>;
  drawTileMultiAnalyze5: REGL.DrawCommand<REGL.DefaultContext, DrawTileMultiAnalyze5.Props>;
  calcTileMultiAnalyze6: REGL.DrawCommand<REGL.DefaultContext, CalcTileMultiAnalyze6.Props>;
  drawTileMultiAnalyze6: REGL.DrawCommand<REGL.DefaultContext, DrawTileMultiAnalyze6.Props>;
  convolutionSmooth: REGL.DrawCommand<REGL.DefaultContext, ConvolutionSmooth.Props>;

  constructor(tileSize: number, nodataValue: number) {
    const canvas = L.DomUtil.create('canvas') as HTMLCanvasElement;
    let maxTextureDimension = MAX_TEXTURE_DIMENSION;

    const regl = REGL({
      canvas: canvas,
      onDone: function (err: Error, regl: REGL.Regl) {
        if (err) {
          console.log(err)
          return
        } else {
          // maxTextureDimension = this.findMaxTextureDimension()
          //TODO: fix maxTextureSize logic
          if (regl.limits.maxTextureSize > 2048) {
            maxTextureDimension = 2048;
          } else if (regl.limits.maxTextureSize > 4096) {
            maxTextureDimension = 4096;
          };
        }
        // TODO: Improve software rendering detection
        if (regl.limits.maxFragmentUniforms === 261) {
          console.log("Software rendering detected and not supported with GLOperations plugin. If you have a GPU, check if drivers are installed ok?");
        }
      }
    });

    const commonDrawConfig = commands.getCommonDrawConfiguration(tileSize, nodataValue);

    // Assign object "instance" properties.
    Object.assign(this, {
      canvas,
      regl,
      tileSize,
      maxTextureDimension: maxTextureDimension,
      textureManager: new TextureManager(regl, tileSize, maxTextureDimension, false),
      textureManagerA: new TextureManager(regl, tileSize, maxTextureDimension, false),
      textureManagerB: new TextureManager(regl, tileSize, maxTextureDimension, false),
      textureManagerC: new TextureManager(regl, tileSize, maxTextureDimension, false),
      textureManagerD: new TextureManager(regl, tileSize, maxTextureDimension, false),
      textureManagerE: new TextureManager(regl, tileSize, maxTextureDimension, false),
      textureManagerF: new TextureManager(regl, tileSize, maxTextureDimension, false),
      textureManagerHillshade: new TextureManager(regl, tileSize, maxTextureDimension, false),
      drawTile: commands.createDrawTileCommand(regl, commonDrawConfig),
      drawTileHsSimple: commands.createDrawTileHsSimpleCommand(regl, commonDrawConfig),
      drawTileHsPregen: commands.createDrawTileHsPregenCommand(regl, commonDrawConfig),
      drawTileInterpolateColor: commands.createDrawTileInterpolateColorCommand(regl, commonDrawConfig),
      drawTileInterpolateColorOnly: commands.createDrawTileInterpolateColorOnlyCommand(regl, commonDrawConfig),
      drawTileInterpolateValue: commands.createDrawTileInterpolateValueCommand(regl, commonDrawConfig),
      calcTileMultiAnalyze1: commands.createCalcTileMultiAnalyze1Command(regl, commonDrawConfig),
      drawTileMultiAnalyze1: commands.createDrawTileMultiAnalyze1Command(regl, commonDrawConfig),
      calcTileMultiAnalyze2: commands.createCalcTileMultiAnalyze2Command(regl, commonDrawConfig),
      drawTileMultiAnalyze2: commands.createDrawTileMultiAnalyze2Command(regl, commonDrawConfig),
      calcTileMultiAnalyze3: commands.createCalcTileMultiAnalyze3Command(regl, commonDrawConfig),
      drawTileMultiAnalyze3: commands.createDrawTileMultiAnalyze3Command(regl, commonDrawConfig),
      calcTileMultiAnalyze4: commands.createCalcTileMultiAnalyze4Command(regl, commonDrawConfig),
      drawTileMultiAnalyze4: commands.createDrawTileMultiAnalyze4Command(regl, commonDrawConfig),
      calcTileMultiAnalyze5: commands.createCalcTileMultiAnalyze5Command(regl, commonDrawConfig),
      drawTileMultiAnalyze5: commands.createDrawTileMultiAnalyze5Command(regl, commonDrawConfig),
      calcTileMultiAnalyze6: commands.createCalcTileMultiAnalyze6Command(regl, commonDrawConfig),
      drawTileMultiAnalyze6: commands.createDrawTileMultiAnalyze6Command(regl, commonDrawConfig),
      drawTileDiff: commands.createDrawTileDiffCommand(regl, commonDrawConfig),
      calcTileDiff: commands.createCalcTileDiffCommand(regl, commonDrawConfig),
      convolutionSmooth: commands.createConvolutionSmoothCommand(regl, commonDrawConfig),
    });
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

  findMaxTextureDimension() {
    // TODO: fix maxTextureSize logic
    const {
      regl,
    } = this;

    let maxTextureDimension = MAX_TEXTURE_DIMENSION;

    if (regl.limits.maxTextureSize > 2048) {
      maxTextureDimension = 2048;
    } else if (regl.limits.maxTextureSize > 4096) {
      maxTextureDimension = 4096;
    };

    return maxTextureDimension
  }

  renderTile(
    { coords, pixelData }: TileDatum,
    colorScale: Color[],
    sentinelValues: SentinelValue[],
    _hillshadeOptions: HillshadeOptions,
    zoom: number = 0,
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

    let zoomdelta = _hillshadeOptions.hsSimpleZoomdelta || 0;

    let offset_pixels = Math.max(0.5, 2 ** (zoom + zoomdelta) / 2048);
    let offset_texcoords = offset_pixels / textureManager.texture.width;

    if (_hillshadeOptions.hillshadeType === 'none') {
      this.drawTile({
        colorScale: util.convertColorScale(colorScale),
        sentinelValues: util.convertColorScale(sentinelValues),
        canvasSize: [tileSize, tileSize],
        canvasCoordinates: [0, 0],
        textureBounds,
        texture: textureManager.texture,
        enableSimpleHillshade: false,
      });
    } else if (_hillshadeOptions.hillshadeType === 'simple') {
      this.drawTileHsSimple({
        colorScale: util.convertColorScale(colorScale),
        sentinelValues: util.convertColorScale(sentinelValues),
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
    colorScale: Color[],
    sentinelValues: SentinelValue[],
    _hillshadeOptions: HillshadeOptions,
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
      colorScale: util.convertColorScale(colorScale),
      sentinelValues: util.convertColorScale(sentinelValues),
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
  flipReadPixelsFloat(
    width: number,
    height: number,
    // pixels: Float32Array | Uint8Array,
    pixels: Float32Array,
  ) {
    let halfHeight = height / 2 | 0;  // the | 0 keeps the result an int
    let bytesPerRow = width * 4;

    // make a temp buffer to hold one row
    var temp = new Float32Array(width * 4);
    for (var y = 0; y < halfHeight; ++y) {
      var topOffset = y * bytesPerRow;
      var bottomOffset = (height - y - 1) * bytesPerRow;
      // make copy of a row on the top half
      temp.set(pixels.subarray(topOffset, topOffset + bytesPerRow));
      // copy a row from the bottom half to the top
      pixels.copyWithin(topOffset, bottomOffset, bottomOffset + bytesPerRow);
      // copy the copy of the top half row to the bottom half
      pixels.set(temp, bottomOffset);
    }
    return pixels
  }

  /**
   * WebGL uses [0,0] coordinate at top, not bottom. Use this function to flip readPixel results.
   */
  flipReadPixelsUint(
    width: number,
    height: number,
    pixels: Uint8Array,
  ) {
    let halfHeight = height / 2 | 0;  // the | 0 keeps the result an int
    let bytesPerRow = width * 4;

    // make a temp buffer to hold one row
    var temp = new Uint8Array(width * 4);
    for (var y = 0; y < halfHeight; ++y) {
      var topOffset = y * bytesPerRow;
      var bottomOffset = (height - y - 1) * bytesPerRow;
      // make copy of a row on the top half
      temp.set(pixels.subarray(topOffset, topOffset + bytesPerRow));
      // copy a row from the bottom half to the top
      pixels.copyWithin(topOffset, bottomOffset, bottomOffset + bytesPerRow);
      // copy the copy of the top half row to the bottom half
      pixels.set(temp, bottomOffset);
    }
    return pixels
  }

  renderTileDiff(
    tileDatumA: TileDatum,
    tileDatumB: TileDatum,
    colorScale: Color[],
    sentinelValues: SentinelValue[],
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

    let fboTile = regl.framebuffer({
      width: tileSize,
      height: tileSize,
      depth: false,
      colorFormat: 'rgba',
      colorType: 'uint8',
    });

    let resultEncodedPixels = new Uint8Array(tileSize * tileSize * 4);

    fboTile.use(() => {
      this.calcTileDiff({
        canvasSize: [tileSize, tileSize],
        canvasCoordinates: [0, 0],
        textureA: textureManagerA.texture,
        textureB: textureManagerB.texture,
        textureBoundsA: textureBoundsA,
        textureBoundsB: textureBoundsB,
      });

      // Get encoded floatValues to use for mouseEvents
      regl.read({data: resultEncodedPixels});
    });

    // Flip readPixels result
    resultEncodedPixels = this.flipReadPixelsUint(tileSize, tileSize, resultEncodedPixels);

    this.drawTileDiff({
      colorScale: util.convertColorScale(colorScale),
      sentinelValues: util.convertColorScale(sentinelValues),
      canvasSize: [tileSize, tileSize],
      canvasCoordinates: [0, 0],
      textureA: textureManagerA.texture,
      textureB: textureManagerB.texture,
      textureBoundsA: textureBoundsA,
      textureBoundsB: textureBoundsB,
    });

    fboTile.destroy();

    // Since the tile will fill the whole canvas, the offset is simply [0, 0].
    return [0, 0, resultEncodedPixels];
  }

  renderConvolutionSmooth(
    inputData: Uint8Array,
    width: number,
    height: number,
    kernelSize: number,
  ): Float32Array {
    const {
      regl,
    } = this;
    this.setCanvasSize(width, height);

    const texture = regl.texture({
      data: inputData,
      width: width,
      height: height,
      flipY: false,
    });

    let fboSmoothed = regl.framebuffer({
      width: width,
      height: height,
      depth: false,
      colorFormat: 'rgba',
      colorType: 'uint8'
    });

    let resultEncodedPixels: Uint8Array | Float32Array = new Uint8Array(width * height * 4);

    fboSmoothed.use(() => {
      this.convolutionSmooth({
        texture: texture,
        //TODO: case with width != height?
        textureSize: width,
        kernelSize: kernelSize,
      });
      regl.read({data: resultEncodedPixels});
    });

    resultEncodedPixels = new Float32Array(resultEncodedPixels.buffer);

    fboSmoothed.destroy();

    return resultEncodedPixels;
  }

  renderTileMulti1(
    tileDatumA: TileDatum,
    colorScale: Color[],
    sentinelValues: SentinelValue[],
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

    let fboTile = regl.framebuffer({
      width: tileSize,
      height: tileSize,
      depth: false,
      colorFormat: 'rgba',
      colorType: 'uint8'
    });

    let resultEncodedPixels = new Uint8Array(tileSize * tileSize * 4);

    fboTile.use(() => {
      this.calcTileMultiAnalyze1({
        canvasSize: [tileSize, tileSize],
        canvasCoordinates: [0, 0],
        textureA: textureManagerA.texture,
        textureBoundsA: textureBoundsA,
        filterLowA : filterLowA,
        filterHighA : filterHighA,
        multiplierA: multiplierA,
      });

      // Get encoded floatValues to use for mouseEvents
      regl.read({data: resultEncodedPixels});
    });

    // Flip readPixels result
    resultEncodedPixels = this.flipReadPixelsUint(tileSize, tileSize, resultEncodedPixels);

    // draw result.
    this.drawTileMultiAnalyze1({
      colorScale: util.convertColorScale(colorScale),
      sentinelValues: util.convertColorScale(sentinelValues),
      canvasSize: [tileSize, tileSize],
      canvasCoordinates: [0, 0],
      textureA: textureManagerA.texture,
      textureBoundsA: textureBoundsA,
      filterLowA : filterLowA,
      filterHighA : filterHighA,
      multiplierA: multiplierA,
    });

    fboTile.destroy();

    // Since the tile will fill the whole canvas, the offset is simply [0, 0].
    return [0, 0, resultEncodedPixels];
  }

  renderTileMulti2(
    tileDatumA: TileDatum,
    tileDatumB: TileDatum,
    colorScale: Color[],
    sentinelValues: SentinelValue[],
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

    let fboTile = regl.framebuffer({
      width: tileSize,
      height: tileSize,
      depth: false,
      colorFormat: 'rgba',
      colorType: 'uint8'
    });

    let resultEncodedPixels = new Uint8Array(tileSize * tileSize * 4);

    fboTile.use(() => {
      this.calcTileMultiAnalyze2({
        canvasSize: [tileSize, tileSize],
        canvasCoordinates: [0, 0],
        textureA: textureManagerA.texture,
        textureB: textureManagerB.texture,
        textureBoundsA: textureBoundsA,
        textureBoundsB: textureBoundsB,
        filterLowA : filterLowA,
        filterHighA : filterHighA,
        filterLowB : filterLowB,
        filterHighB : filterHighB,
        multiplierA: multiplierA,
        multiplierB: multiplierB,
      });

      // Get encoded floatValues to use for mouseEvents
      regl.read({data: resultEncodedPixels});
    });

    // Flip readPixels result
    resultEncodedPixels = this.flipReadPixelsUint(tileSize, tileSize, resultEncodedPixels);

    // draw result.
    this.drawTileMultiAnalyze2({
      colorScale: util.convertColorScale(colorScale),
      sentinelValues: util.convertColorScale(sentinelValues),
      canvasSize: [tileSize, tileSize],
      canvasCoordinates: [0, 0],
      textureA: textureManagerA.texture,
      textureB: textureManagerB.texture,
      textureBoundsA: textureBoundsA,
      textureBoundsB: textureBoundsB,
      filterLowA : filterLowA,
      filterHighA : filterHighA,
      filterLowB : filterLowB,
      filterHighB : filterHighB,
      multiplierA: multiplierA,
      multiplierB: multiplierB,
    });

    fboTile.destroy();

    // Since the tile will fill the whole canvas, the offset is simply [0, 0].
    return [0, 0, resultEncodedPixels];
  }


  renderTileMulti3(
    tileDatumA: TileDatum,
    tileDatumB: TileDatum,
    tileDatumC: TileDatum,
    colorScale: Color[],
    sentinelValues: SentinelValue[],
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

    let fboTile = regl.framebuffer({
      width: tileSize,
      height: tileSize,
      depth: false,
      colorFormat: 'rgba',
      colorType: 'uint8'
    });

    let resultEncodedPixels = new Uint8Array(tileSize * tileSize * 4);

    fboTile.use(() => {
      this.calcTileMultiAnalyze3({
        canvasSize: [tileSize, tileSize],
        canvasCoordinates: [0, 0],
        textureA: textureManagerA.texture,
        textureB: textureManagerB.texture,
        textureC: textureManagerC.texture,
        textureBoundsA: textureBoundsA,
        textureBoundsB: textureBoundsB,
        textureBoundsC: textureBoundsC,
        filterLowA : filterLowA,
        filterHighA : filterHighA,
        filterLowB : filterLowB,
        filterHighB : filterHighB,
        filterLowC : filterLowC,
        filterHighC : filterHighC,
        multiplierA: multiplierA,
        multiplierB: multiplierB,
        multiplierC: multiplierC,
      });

      // Get encoded floatValues to use for mouseEvents
      regl.read({data: resultEncodedPixels});
    });

    // Flip readPixels result
    resultEncodedPixels = this.flipReadPixelsUint(tileSize, tileSize, resultEncodedPixels);

    // draw result.
    this.drawTileMultiAnalyze3({
      colorScale: util.convertColorScale(colorScale),
      sentinelValues: util.convertColorScale(sentinelValues),
      canvasSize: [tileSize, tileSize],
      canvasCoordinates: [0, 0],
      textureA: textureManagerA.texture,
      textureB: textureManagerB.texture,
      textureC: textureManagerC.texture,
      textureBoundsA: textureBoundsA,
      textureBoundsB: textureBoundsB,
      textureBoundsC: textureBoundsC,
      filterLowA : filterLowA,
      filterHighA : filterHighA,
      filterLowB : filterLowB,
      filterHighB : filterHighB,
      filterLowC : filterLowC,
      filterHighC : filterHighC,
      multiplierA: multiplierA,
      multiplierB: multiplierB,
      multiplierC: multiplierC,
    });

    fboTile.destroy();

    // Since the tile will fill the whole canvas, the offset is simply [0, 0].
    return [0, 0, resultEncodedPixels];
  }

  renderTileMulti4(
    tileDatumA: TileDatum,
    tileDatumB: TileDatum,
    tileDatumC: TileDatum,
    tileDatumD: TileDatum,
    colorScale: Color[],
    sentinelValues: SentinelValue[],
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
    // Set canvas size.
    this.setCanvasSize(tileSize, tileSize);

    // Add image to the texture and retrieve its texture coordinates.
    const textureBoundsA = textureManagerA.addTile(tileDatumA.coords, tileDatumA.pixelData);
    const textureBoundsB = textureManagerB.addTile(tileDatumB.coords, tileDatumB.pixelData);
    const textureBoundsC = textureManagerC.addTile(tileDatumC.coords, tileDatumC.pixelData);
    const textureBoundsD = textureManagerD.addTile(tileDatumD.coords, tileDatumD.pixelData);

    let fboTile = regl.framebuffer({
      width: tileSize,
      height: tileSize,
      depth: false,
      colorFormat: 'rgba',
      colorType: 'uint8'
    });

    let resultEncodedPixels = new Uint8Array(tileSize * tileSize * 4);

    fboTile.use(() => {
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
        filterLowA : filterLowA,
        filterHighA : filterHighA,
        filterLowB : filterLowB,
        filterHighB : filterHighB,
        filterLowC : filterLowC,
        filterHighC : filterHighC,
        filterLowD : filterLowD,
        filterHighD : filterHighD,
        multiplierA: multiplierA,
        multiplierB: multiplierB,
        multiplierC: multiplierC,
        multiplierD: multiplierD,
      });

      // Get encoded floatValues to use for mouseEvents
      regl.read({data: resultEncodedPixels});
    });

    // Flip readPixels result
    resultEncodedPixels = this.flipReadPixelsUint(tileSize, tileSize, resultEncodedPixels);

    // draw result.
    this.drawTileMultiAnalyze4({
      colorScale: util.convertColorScale(colorScale),
      sentinelValues: util.convertColorScale(sentinelValues),
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
      filterLowA : filterLowA,
      filterHighA : filterHighA,
      filterLowB : filterLowB,
      filterHighB : filterHighB,
      filterLowC : filterLowC,
      filterHighC : filterHighC,
      filterLowD : filterLowD,
      filterHighD : filterHighD,
      multiplierA: multiplierA,
      multiplierB: multiplierB,
      multiplierC: multiplierC,
      multiplierD: multiplierD,
    });

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
    colorScale: Color[],
    sentinelValues: SentinelValue[],
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

    let fboTile = regl.framebuffer({
      width: tileSize,
      height: tileSize,
      depth: false,
      colorFormat: 'rgba',
      colorType: 'uint8'
    });

    let resultEncodedPixels = new Uint8Array(tileSize * tileSize * 4);

    fboTile.use(() => {
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
      });

      // Get encoded floatValues to use for mouseEvents
      regl.read({data: resultEncodedPixels});
    });

    // Flip readPixels result
    resultEncodedPixels = this.flipReadPixelsUint(tileSize, tileSize, resultEncodedPixels);

    this.drawTileMultiAnalyze5({
      colorScale: util.convertColorScale(colorScale),
      sentinelValues: util.convertColorScale(sentinelValues),
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
    });

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
    colorScale: Color[],
    sentinelValues: SentinelValue[],
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

    let fboTile = regl.framebuffer({
      width: tileSize,
      height: tileSize,
      depth: false,
      colorFormat: 'rgba',
      colorType: 'uint8'
    });

    let resultEncodedPixels = new Uint8Array(tileSize * tileSize * 4);

    fboTile.use(() => {
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
      });

      // Get encoded floatValues to use for mouseEvents
      regl.read({data: resultEncodedPixels});
    });

    // Flip readPixels result
    resultEncodedPixels = this.flipReadPixelsUint(tileSize, tileSize, resultEncodedPixels);

    this.drawTileMultiAnalyze6({
      colorScale: util.convertColorScale(colorScale),
      sentinelValues: util.convertColorScale(sentinelValues),
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
    });

    fboTile.destroy();

    // Since the tile will fill the whole canvas, the offset is simply [0, 0].
    return [0, 0, resultEncodedPixels];
  }


  renderTiles(
    tiles: TileDatum[],
    colorScale: Color[],
    sentinelValues: SentinelValue[],
    _hillshadeOptions: HillshadeOptions,
    zoom: number = 0,
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
      }),
    );

    // Convert the color scale and sentinel values to the form expected by WebGL.
    const webGLColorScale = util.convertColorScale(colorScale);
    const webGLSentinelValues = util.convertColorScale(sentinelValues);

    const canvasSize = [canvasWidth, canvasHeight] as Pair<number>;

    // Clear existing tiles from cache.
    textureManager.clearTiles();
    // Clear the canvas.
    regl.clear({ color: CLEAR_COLOR });

    // Split the tiles array into chunks the size of the texture capacity. If we need to render more
    // tiles than will fit in the texture, we have to render in batches.
    const chunks = chunk(tilesWithCanvasCoordinates, textureManager.tileCapacity);

    let zoomdelta = _hillshadeOptions.hsSimpleZoomdelta || 0;

    // Render chunk by chunk.
    for (const chunk of chunks) {
      // Add tiles.
      const textureBounds = chunk.map(
        ({ coords, pixelData }) => textureManager.addTile(coords, pixelData),
      );

      let offset_pixels = Math.max(0.5, 2 ** (zoom + zoomdelta) / 2048);
      let offset_texcoords = offset_pixels / textureManager.texture.width;

      if (_hillshadeOptions.hillshadeType === 'none') {
        this.drawTile(chunk.map(({ canvasCoords }, index) => ({
          colorScale: webGLColorScale,
          sentinelValues: webGLSentinelValues,
          canvasSize,
          canvasCoordinates: canvasCoords,
          textureBounds: textureBounds[index],
          texture: textureManager.texture,
          enableSimpleHillshade: false,
        })));
      } else if (_hillshadeOptions.hillshadeType === 'simple') {
        this.drawTileHsSimple(chunk.map(({ canvasCoords }, index) => ({
          colorScale: webGLColorScale,
          sentinelValues: webGLSentinelValues,
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
        })));
      }
    }

    return canvasCoordinates;
  }

  renderTilesHsPregen(
    tiles: TileDatum[],
    tilesHs: TileDatum[],
    colorScale: Color[],
    sentinelValues: SentinelValue[],
    _hillshadeOptions: HillshadeOptions,
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

    // Convert the color scale and sentinel values to the form expected by WebGL.
    const webGLColorScale = util.convertColorScale(colorScale);
    const webGLSentinelValues = util.convertColorScale(sentinelValues);

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

      this.drawTileHsPregen(chunk.map(({ canvasCoords }, index) => ({
        colorScale: webGLColorScale,
        sentinelValues: webGLSentinelValues,
        canvasSize,
        canvasCoordinates: canvasCoords,
        textureBounds: textureBounds[index],
        textureBoundsHs: textureBoundsHs[index],
        texture: textureManager.texture,
        hillshadePregenTexture: textureManagerHillshade.texture,
      })));
    }

    return canvasCoordinates;
  }

  renderTilesWithDiff(
    tilesA: TileDatum[],
    tilesB: TileDatum[],
    colorScale: Color[],
    sentinelValues: SentinelValue[],
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
      }),
    );

    // Convert the color scale and sentinel values to the form expected by WebGL.
    const webGLColorScale = util.convertColorScale(colorScale);
    const webGLSentinelValues = util.convertColorScale(sentinelValues);

    // let resultEncodedPixels: Float32Array[] = [];
    let resultEncodedPixels: Uint8Array[] = [];

    const renderFrame = () => {
      // Split the tiles array into chunks the size of the texture capacity. If we need to render more
      // tiles than will fit in the texture, we have to render in batches.
      const chunks = chunk(tilesWithCanvasCoordinates, textureManagerA.tileCapacity);

      // Clear the canvas.
      regl.clear({ color: CLEAR_COLOR });

      let tileIndex: number = 0;

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
          let fboTile = regl.framebuffer({
            width: tileSize,
            height: tileSize,
            depth: false,
            colorFormat: 'rgba',
            colorType: 'uint8',
          });

          let resultEncodedPixelsTile = new Uint8Array(tileSize * tileSize * 4);

          fboTile.use(() => {
            this.calcTileDiff({
              canvasSize: [tileSize, tileSize],
              canvasCoordinates: [0, 0],
              textureA: textureManagerA.texture,
              textureB: textureManagerB.texture,
              textureBoundsA: tilesABounds[index],
              textureBoundsB: tilesBBounds[index],
            });
            regl.read({data: resultEncodedPixelsTile});
          });

          // Flip readPixels result
          resultEncodedPixelsTile = this.flipReadPixelsUint(tileSize, tileSize, resultEncodedPixelsTile);
          // Add tile result to array
          resultEncodedPixels[tileIndex] = resultEncodedPixelsTile;
          tileIndex += 1;

          this.drawTileDiff({
            colorScale: webGLColorScale,
            sentinelValues: webGLSentinelValues,
            canvasSize,
            canvasCoordinates: canvasCoords,
            textureA: textureManagerA.texture,
            textureB: textureManagerB.texture,
            textureBoundsA: tilesABounds[index],
            textureBoundsB: tilesBBounds[index],
          });

          fboTile.destroy();
        });
      };

      // Invoke the callback with the canvas coordinates of the rendered tiles.
      onFrameRendered(canvasCoordinates);
    };

    renderFrame();

    //clean up TextureManagers
    this.textureManagerA.destroy();
    this.textureManagerB.destroy();
    this.textureManagerA = new TextureManager(regl, tileSize, MAX_TEXTURE_DIMENSION, false);
    this.textureManagerB = new TextureManager(regl, tileSize, MAX_TEXTURE_DIMENSION, false);

    return resultEncodedPixels;
  }

  renderTilesWithMultiAnalyze1(
    tilesA: TileDatum[],
    colorScale: Color[],
    sentinelValues: SentinelValue[],
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
      }),
    );

    // Convert the color scale and sentinel values to the form expected by WebGL.
    const webGLColorScale = util.convertColorScale(colorScale);
    const webGLSentinelValues = util.convertColorScale(sentinelValues);

    let resultEncodedPixels: Uint8Array[] = [];

    const renderFrame = () => {
      // Split the tiles array into chunks the size of the texture capacity. If we need to render more
      // tiles than will fit in the texture, we have to render in batches.
      const chunks = chunk(tilesWithCanvasCoordinates, textureManagerA.tileCapacity);

      // Clear the canvas.
      regl.clear({ color: CLEAR_COLOR });

      let tileIndex: number = 0;

      // Render chunk by chunk.
      for (const chunk of chunks) {
        // Add tiles.
        const tilesABounds = chunk.map(
          ({ coords, tilesAPixelData }) => textureManagerA.addTile(coords, tilesAPixelData),
        );

        chunk.forEach(({ canvasCoords }, index) => {
          let fboTile = regl.framebuffer({
            width: tileSize,
            height: tileSize,
            depth: false,
            colorFormat: 'rgba',
            colorType: 'uint8'
          });

          let resultEncodedPixelsTile = new Uint8Array(tileSize * tileSize * 4);

          fboTile.use(() => {
            this.calcTileMultiAnalyze1({
              canvasSize: [tileSize, tileSize],
              canvasCoordinates: [0, 0],
              textureA: textureManagerA.texture,
              textureBoundsA: tilesABounds[index],
              filterLowA: filterLowA,
              filterHighA: filterHighA,
              multiplierA: multiplierA,
            });

            // Get encoded floatValues to use for mouseEvents
            regl.read({data: resultEncodedPixelsTile});
          });


          // Flip readPixels result
          resultEncodedPixelsTile = this.flipReadPixelsUint(tileSize, tileSize, resultEncodedPixelsTile);
          // Add tile result to array
          resultEncodedPixels[tileIndex] = resultEncodedPixelsTile;
          tileIndex += 1;

          this.drawTileMultiAnalyze1({
            colorScale: webGLColorScale,
            sentinelValues: webGLSentinelValues,
            canvasSize,
            canvasCoordinates: canvasCoords,
            textureA: textureManagerA.texture,
            textureBoundsA: tilesABounds[index],
            filterLowA : filterLowA,
            filterHighA : filterHighA,
            multiplierA: multiplierA,
          });

          fboTile.destroy();
        });
      }

      // Invoke the callback with the canvas coordinates of the rendered tiles.
      onFrameRendered(canvasCoordinates);
    };

    renderFrame();

    //clean up TextureManagers
    this.textureManagerA.destroy();
    this.textureManagerA = new TextureManager(regl, tileSize, MAX_TEXTURE_DIMENSION, false);

    return resultEncodedPixels;
  }

  renderTilesWithMultiAnalyze2(
    tilesA: TileDatum[],
    tilesB: TileDatum[],
    colorScale: Color[],
    sentinelValues: SentinelValue[],
    filterLowA : number,
    filterHighA : number,
    filterLowB : number,
    filterHighB : number,
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
      }),
    );

    // Convert the color scale and sentinel values to the form expected by WebGL.
    const webGLColorScale = util.convertColorScale(colorScale);
    const webGLSentinelValues = util.convertColorScale(sentinelValues);

    let resultEncodedPixels: Uint8Array[] = [];

    const renderFrame = () => {
      // Split the tiles array into chunks the size of the texture capacity. If we need to render more
      // tiles than will fit in the texture, we have to render in batches.
      const chunks = chunk(tilesWithCanvasCoordinates, textureManagerA.tileCapacity);

      // Clear the canvas.
      regl.clear({ color: CLEAR_COLOR });

      let tileIndex: number = 0;

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
          let fboTile = regl.framebuffer({
            width: tileSize,
            height: tileSize,
            depth: false,
            colorFormat: 'rgba',
            colorType: 'uint8'
          });

          let resultEncodedPixelsTile = new Uint8Array(tileSize * tileSize * 4);

          fboTile.use(() => {
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
            });

            // Get encoded floatValues to use for mouseEvents
            regl.read({data: resultEncodedPixelsTile});
          });


          // Flip readPixels result
          resultEncodedPixelsTile = this.flipReadPixelsUint(tileSize, tileSize, resultEncodedPixelsTile);
          // Add tile result to array
          resultEncodedPixels[tileIndex] = resultEncodedPixelsTile;
          tileIndex += 1;

          this.drawTileMultiAnalyze2({
            colorScale: webGLColorScale,
            sentinelValues: webGLSentinelValues,
            canvasSize,
            canvasCoordinates: canvasCoords,
            textureA: textureManagerA.texture,
            textureB: textureManagerB.texture,
            textureBoundsA: tilesABounds[index],
            textureBoundsB: tilesBBounds[index],
            filterLowA : filterLowA,
            filterHighA : filterHighA,
            filterLowB : filterLowB,
            filterHighB : filterHighB,
            multiplierA: multiplierA,
            multiplierB: multiplierB,
          });

          fboTile.destroy();
        });
      }

      // Invoke the callback with the canvas coordinates of the rendered tiles.
      onFrameRendered(canvasCoordinates);
    };

    renderFrame();

    //clean up TextureManagers
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
    colorScale: Color[],
    sentinelValues: SentinelValue[],
    filterLowA : number,
    filterHighA : number,
    filterLowB : number,
    filterHighB : number,
    filterLowC : number,
    filterHighC : number,
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
      }),
    );

    // Convert the color scale and sentinel values to the form expected by WebGL.
    const webGLColorScale = util.convertColorScale(colorScale);
    const webGLSentinelValues = util.convertColorScale(sentinelValues);

    let resultEncodedPixels: Uint8Array[] = [];

    const renderFrame = () => {
      // Split the tiles array into chunks the size of the texture capacity. If we need to render more
      // tiles than will fit in the texture, we have to render in batches.
      const chunks = chunk(tilesWithCanvasCoordinates, textureManagerA.tileCapacity);

      // Clear the canvas.
      regl.clear({ color: CLEAR_COLOR });

      let tileIndex: number = 0;

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
          let fboTile = regl.framebuffer({
            width: tileSize,
            height: tileSize,
            depth: false,
            colorFormat: 'rgba',
            colorType: 'uint8'
          });

          let resultEncodedPixelsTile = new Uint8Array(tileSize * tileSize * 4);

          fboTile.use(() => {
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
            });

            // Get encoded floatValues to use for mouseEvents
            regl.read({data: resultEncodedPixelsTile});
          });


          // Flip readPixels result
          resultEncodedPixelsTile = this.flipReadPixelsUint(tileSize, tileSize, resultEncodedPixelsTile);
          // Add tile result to array
          resultEncodedPixels[tileIndex] = resultEncodedPixelsTile;
          tileIndex += 1;

          this.drawTileMultiAnalyze3({
            colorScale: webGLColorScale,
            sentinelValues: webGLSentinelValues,
            canvasSize,
            canvasCoordinates: canvasCoords,
            textureA: textureManagerA.texture,
            textureB: textureManagerB.texture,
            textureC: textureManagerC.texture,
            textureBoundsA: tilesABounds[index],
            textureBoundsB: tilesBBounds[index],
            textureBoundsC: tilesCBounds[index],
            filterLowA : filterLowA,
            filterHighA : filterHighA,
            filterLowB : filterLowB,
            filterHighB : filterHighB,
            filterLowC : filterLowC,
            filterHighC : filterHighC,
            multiplierA: multiplierA,
            multiplierB: multiplierB,
            multiplierC: multiplierC,
          });

          fboTile.destroy();
        });
      }

      // Invoke the callback with the canvas coordinates of the rendered tiles.
      onFrameRendered(canvasCoordinates);
    };

    renderFrame();

    //clean up TextureManagers
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
    colorScale: Color[],
    sentinelValues: SentinelValue[],
    filterLowA : number,
    filterHighA : number,
    filterLowB : number,
    filterHighB : number,
    filterLowC : number,
    filterHighC : number,
    filterLowD : number,
    filterHighD : number,
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
      }),
    );

    // Convert the color scale and sentinel values to the form expected by WebGL.
    const webGLColorScale = util.convertColorScale(colorScale);
    const webGLSentinelValues = util.convertColorScale(sentinelValues);

    let resultEncodedPixels: Uint8Array[] = [];

    const renderFrame = () => {
      // Split the tiles array into chunks the size of the texture capacity. If we need to render more
      // tiles than will fit in the texture, we have to render in batches.
      const chunks = chunk(tilesWithCanvasCoordinates, textureManagerA.tileCapacity);

      // Clear the canvas.
      regl.clear({ color: CLEAR_COLOR });

      let tileIndex: number = 0;

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
          let fboTile = regl.framebuffer({
            width: tileSize,
            height: tileSize,
            depth: false,
            colorFormat: 'rgba',
            colorType: 'uint8'
          });

          let resultEncodedPixelsTile = new Uint8Array(tileSize * tileSize * 4);

          fboTile.use(() => {
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
            });

            // Get encoded floatValues to use for mouseEvents
            regl.read({data: resultEncodedPixelsTile});
          });

          // Flip readPixels result
          resultEncodedPixelsTile = this.flipReadPixelsUint(tileSize, tileSize, resultEncodedPixelsTile);
          // Add tile result to array
          resultEncodedPixels[tileIndex] = resultEncodedPixelsTile;
          tileIndex += 1;

          this.drawTileMultiAnalyze4({
            colorScale: webGLColorScale,
            sentinelValues: webGLSentinelValues,
            canvasSize,
            canvasCoordinates: canvasCoords,
            textureA: textureManagerA.texture,
            textureB: textureManagerB.texture,
            textureC: textureManagerC.texture,
            textureD: textureManagerD.texture,
            textureBoundsA: tilesABounds[index],
            textureBoundsB: tilesBBounds[index],
            textureBoundsC: tilesCBounds[index],
            textureBoundsD: tilesDBounds[index],
            filterLowA : filterLowA,
            filterHighA : filterHighA,
            filterLowB : filterLowB,
            filterHighB : filterHighB,
            filterLowC : filterLowC,
            filterHighC : filterHighC,
            filterLowD : filterLowD,
            filterHighD : filterHighD,
            multiplierA: multiplierA,
            multiplierB: multiplierB,
            multiplierC: multiplierC,
            multiplierD: multiplierD,
          });

          fboTile.destroy();
        });
      }

      // Invoke the callback with the canvas coordinates of the rendered tiles.
      onFrameRendered(canvasCoordinates);
    };

    renderFrame();

    //clean up TextureManagers
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
    colorScale: Color[],
    sentinelValues: SentinelValue[],
    filterLowA : number,
    filterHighA : number,
    filterLowB : number,
    filterHighB : number,
    filterLowC : number,
    filterHighC : number,
    filterLowD : number,
    filterHighD : number,
    filterLowE : number,
    filterHighE : number,
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
      }),
    );

    // Convert the color scale and sentinel values to the form expected by WebGL.
    const webGLColorScale = util.convertColorScale(colorScale);
    const webGLSentinelValues = util.convertColorScale(sentinelValues);

    let resultEncodedPixels: Uint8Array[] = [];

    const renderFrame = () => {
      // Split the tiles array into chunks the size of the texture capacity. If we need to render more
      // tiles than will fit in the texture, we have to render in batches.
      const chunks = chunk(tilesWithCanvasCoordinates, textureManagerA.tileCapacity);

      // Clear the canvas.
      regl.clear({ color: CLEAR_COLOR });

      let tileIndex: number = 0;

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
          let fboTile = regl.framebuffer({
            width: tileSize,
            height: tileSize,
            depth: false,
            colorFormat: 'rgba',
            colorType: 'uint8'
          });

          let resultEncodedPixelsTile = new Uint8Array(tileSize * tileSize * 4);

          fboTile.use(() => {
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
            });

            // Get encoded floatValues to use for mouseEvents
            regl.read({data: resultEncodedPixelsTile});
          });

          // Flip readPixels result
          resultEncodedPixelsTile = this.flipReadPixelsUint(tileSize, tileSize, resultEncodedPixelsTile);
          // Add tile result to array
          resultEncodedPixels[tileIndex] = resultEncodedPixelsTile;
          tileIndex += 1;

          this.drawTileMultiAnalyze5({
            colorScale: webGLColorScale,
            sentinelValues: webGLSentinelValues,
            canvasSize,
            canvasCoordinates: canvasCoords,
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
            filterLowA : filterLowA,
            filterHighA : filterHighA,
            filterLowB : filterLowB,
            filterHighB : filterHighB,
            filterLowC : filterLowC,
            filterHighC : filterHighC,
            filterLowD : filterLowD,
            filterHighD : filterHighD,
            filterLowE : filterLowE,
            filterHighE : filterHighE,
            multiplierA: multiplierA,
            multiplierB: multiplierB,
            multiplierC: multiplierC,
            multiplierD: multiplierD,
            multiplierE: multiplierE,
          });

          fboTile.destroy();
        });
      }

      // Invoke the callback with the canvas coordinates of the rendered tiles.
      onFrameRendered(canvasCoordinates);
    };

    renderFrame();

    //clean up TextureManagers
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
    colorScale: Color[],
    sentinelValues: SentinelValue[],
    filterLowA : number,
    filterHighA : number,
    filterLowB : number,
    filterHighB : number,
    filterLowC : number,
    filterHighC : number,
    filterLowD : number,
    filterHighD : number,
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

    // Convert the color scale and sentinel values to the form expected by WebGL.
    const webGLColorScale = util.convertColorScale(colorScale);
    const webGLSentinelValues = util.convertColorScale(sentinelValues);

    let resultEncodedPixels: Uint8Array[] = [];

    const renderFrame = () => {
      // Split the tiles array into chunks the size of the texture capacity. If we need to render more
      // tiles than will fit in the texture, we have to render in batches.
      const chunks = chunk(tilesWithCanvasCoordinates, textureManagerA.tileCapacity);

      // Clear the canvas.
      regl.clear({ color: CLEAR_COLOR });

      let tileIndex: number = 0;

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
          let fboTile = regl.framebuffer({
            width: tileSize,
            height: tileSize,
            depth: false,
            colorFormat: 'rgba',
            colorType: 'uint8'
          });

          let resultEncodedPixelsTile = new Uint8Array(tileSize * tileSize * 4);

          fboTile.use(() => {
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
            });

            // Get encoded floatValues to use for mouseEvents
            regl.read({data: resultEncodedPixelsTile});
          });

          // Flip readPixels result
          resultEncodedPixelsTile = this.flipReadPixelsUint(tileSize, tileSize, resultEncodedPixelsTile);
          // Add tile result to array
          resultEncodedPixels[tileIndex] = resultEncodedPixelsTile;
          tileIndex += 1;

          this.drawTileMultiAnalyze6({
            colorScale: webGLColorScale,
            sentinelValues: webGLSentinelValues,
            canvasSize,
            canvasCoordinates: canvasCoords,
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
          });

          fboTile.destroy();
        });
      }

      // Invoke the callback with the canvas coordinates of the rendered tiles.
      onFrameRendered(canvasCoordinates);
    };

    renderFrame();

    //clean up TextureManagers
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
    colorScale: Color[],
    sentinelValues: SentinelValue[],
    transitionDurationMs: number,
    onFrameRendered: (canvasCoordinates: Array<Pair<number>>) => void,
  ) {
    const {
      regl,
      textureManager,
      tileSize,
      maxTextureDimension,
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
    const newTextureManager = new TextureManager(regl, tileSize, maxTextureDimension, false);

    // Convert the color scale and sentinel values to the form expected by WebGL.
    const webGLColorScale = util.convertColorScale(colorScale);
    const webGLSentinelValues = util.convertColorScale(sentinelValues);

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
          colorScale: webGLColorScale,
          sentinelValues: webGLSentinelValues,
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
    oldColorScale: Color[],
    newColorScale: Color[],
    oldSentinelValues: SentinelValue[],
    newSentinelValues: SentinelValue[],
    transitionDurationMs: number,
    onFrameRendered: (canvasCoordinates: Array<Pair<number>>) => void,
  ) {
    const {
      regl,
      textureManager,
      tileSize,
      maxTextureDimension,
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
    const newTextureManager = new TextureManager(regl, tileSize, maxTextureDimension, false);

    // Convert the color scales and sentinel values to the form expected by WebGL.
    const colorScaleA = util.convertColorScale(oldColorScale);
    const colorScaleB = util.convertColorScale(newColorScale);
    const sentinelValuesA = util.convertColorScale(oldSentinelValues);
    const sentinelValuesB = util.convertColorScale(newSentinelValues);

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
        this.drawTileInterpolateColor(chunk.map(({ canvasCoords }, index) => ({
          colorScaleA,
          colorScaleB,
          sentinelValuesA,
          sentinelValuesB,
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

  async renderTilesWithTransitionAndNewColorScaleOnly(
    tiles: TileDatum[],
    oldColorScale: Color[],
    newColorScale: Color[],
    oldSentinelValues: SentinelValue[],
    newSentinelValues: SentinelValue[],
    transitionDurationMs: number,
    onFrameRendered: (canvasCoordinates: Array<Pair<number>>) => void,
  ) {
    const {
      regl,
      textureManager,
      tileSize,
      maxTextureDimension,
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
      }),
    );

    // Create a new TextureManager to hold the new data. After the transition, this will replace the
    // Renderer's stored TextureManager.
    const newTextureManager = new TextureManager(regl, tileSize, maxTextureDimension, false);

    // Convert the color scales and sentinel values to the form expected by WebGL.
    const colorScaleA = util.convertColorScale(oldColorScale);
    const colorScaleB = util.convertColorScale(newColorScale);
    const sentinelValuesA = util.convertColorScale(oldSentinelValues);
    const sentinelValuesB = util.convertColorScale(newSentinelValues);

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
        this.drawTileInterpolateColorOnly(chunk.map(({ canvasCoords }, index) => ({
          colorScaleA,
          colorScaleB,
          sentinelValuesA,
          sentinelValuesB,
          canvasSize,
          canvasCoordinates: canvasCoords,
          texture: textureManager.texture,
          textureBounds: textureBounds[index],
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
