import * as L from 'leaflet';
import {
  isUndefined,
  mapValues,
  noop,
  pickBy,
  values,
  zipWith,
} from 'lodash-es';
import { ContourMultiPolygon, contours } from 'd3-contour';
import * as util from './util';
import { select, selectAll } from "d3-selection";
import { scaleLinear } from "d3-scale";
import { geoPath } from "d3-geo";
import { json } from "d3-request";
import { min, max, scan, range } from "d3-array";
import { interpolateHcl } from "d3-interpolate";
const d3 = {
  select,
  selectAll,
  scaleLinear,
  geoPath,
  contours,
  interpolateHcl,
  json,
  min,
  max,
  scan,
  range,
};

import './index.css';

import Renderer from './Renderer';
import {
  GridLayerTile,
  Pair,
  PreloadTileCache,
  TileCache,
  TileCoordinates,
  TileDatum,
  TileElement,
  TileEvent,
  PixelValues,
  HillshadeOptions,
  ActiveTilesBounds,
  Color,
  SentinelValue,
  ContourLabel,
  ContourData,
  Dictionary,
} from './types';

import { EARTH_CIRCUMFERENCE } from './constants';

/**
 * Augment Leaflet GridLayer definition to include some helpful "private" properties.
 *
 * Unfortunately, using properties that aren't part of GridLayer's public API makes this component
 * brittle. If GridLayer's implementation changes significantly, it could break this component.
 * I don't see a way around this limitation, however, without reimplementing much of GridLayer.
 */
declare module 'leaflet' {
  interface GridLayer {
    _globalTileRange: L.Bounds;
    _getTilePos(coords: L.Point): L.Point;
    _keyToTileCoords(key: string): L.Point;
    _pruneTiles(): void;
    _removeAllTiles(): void;
    _update(): void;
    _level: Dictionary<any>;
  }
}

const BYTES_PER_WORD = 4; // four bytes in a 32-bit float
const littleEndian = util.machineIsLittleEndian();

export interface MouseEvent extends L.LeafletMouseEvent {
  pixelValues?: PixelValues;
}

interface EventsObject {
  [name: string]: (event: L.LeafletEvent) => void;
}

export interface Options extends L.GridLayerOptions {
  url: string;
  tileFormat: string;
  nodataValue: number;
  colorScale?: Color[];
  sentinelValues?: SentinelValue[];
  extraPixelLayers?: number;
  colorscaleMaxLength?: number,
  sentinelMaxLength?: number,
  preloadUrl?: string;
  glOperation?: string;
  multiLayers?: number;
  operationUrlA?: string;
  operationUrlB?: string;
  operationUrlC?: string;
  operationUrlD?: string;
  operationUrlE?: string;
  operationUrlF?: string;
  filterLowA?: number;
  filterHighA?: number;
  filterLowB?: number;
  filterHighB?: number;
  filterLowC?: number;
  filterHighC?: number;
  filterLowD?: number;
  filterHighD?: number;
  filterLowE?: number;
  filterHighE?: number;
  filterLowF?: number;
  filterHighF?: number;
  multiplierA?: number;
  multiplierB?: number;
  multiplierC?: number;
  multiplierD?: number;
  multiplierE?: number;
  multiplierF?: number;
  transitions?: boolean;
  transitionTimeMs?: number;
  debug: boolean;

  // Hillshading
  hillshadeType: string;
  hsValueScale?: number | Dictionary<number>;
  hsPixelScale?: number | string;
  hsSimpleZoomdelta?: number;
  hsSimpleSlopescale?: number;
  hsSimpleAzimuth?: number;
  hsSimpleAltitude?: number;
  hsAdvSoftIterations?: number;
  hsAdvAmbientIterations?: number;
  hsAdvSunRadiusMultiplier?: number;
  hsAdvFinalSoftMultiplier?: number;
  hsAdvFinalAmbientMultiplier?: number;
  hsAdvBaselayerUrl?: string;
  hsPregenUrl?: string;
  _hillshadeOptions?: HillshadeOptions;

  // Contours
  contourPane?: HTMLElement;
  contourCanvas?: HTMLCanvasElement;
  contourType?: string;
  contourSmoothLines: boolean;
  contourSmoothInput: boolean;
  contourSmoothInputKernel: number;
  contourScaleFactor: number;
  contourInterval: number;
  contourIndexInterval: number;
  contourLineColor: string;
  contourLineWeight: number; // px
  contourLineIndexWeight: number; // px
  contourIndexLabels: boolean;
  contourLabelFont: string;
  contourLabelDistance: number;
  contourIlluminatedHighlightColor: string;
  contourIlluminatedShadowColor: string;
  contourIlluminatedShadowSize: number; // px
  contourHypso: boolean;
  contourHypsoDomain: number[];
  contourHypsoColors: string[];
  contourBathy: boolean;
  contourBathyDomain: number[];
  contourBathyColors: string[];
  contourBathyShadowColor: string[];
  contourBathyHighlightColor: string[];

  // handler for the 'load' event, fired when all tiles loaded.
  onload?: (event: { url: string }) => void;

  // mouse event handlers
  onclick?: (event: MouseEvent) => void;
  ondblclick?: (event: MouseEvent) => void;
  onmousedown?: (event: MouseEvent) => void;
  onmouseup?: (event: MouseEvent) => void;
  onmouseover?: (event: MouseEvent) => void;
  onmouseout?: (event: MouseEvent) => void;
  onmousemove?: (event: MouseEvent) => void;
  oncontextmenu?: (event: MouseEvent) => void;

  // from TileLayerOptions
  minZoom?: number;
  maxZoom?: number;
  subdomains?: string | string[];
  maxNativeZoom?: number;
  minNativeZoom?: number;
  errorTileUrl?: string;
  zoomOffset?: number;
  tms?: boolean;
  zoomReverse?: boolean;
  detectRetina?: boolean;
  crossOrigin?: boolean;
}

const defaultOptions = {
  tileFormat: 'float32',
  colorScale: [],
  sentinelValues: [],
  transitions: false,
  transitionTimeMs: 800,
  debug: false,
  extraPixelLayers: 0,
  colorscaleMaxLength: 16,
  sentinelMaxLength: 16,

  // default TileLayer options
  minZoom: 0,
  maxZoom: 18,
  subdomains: 'abc',
  errorTileUrl: '',
  zoomOffset: 0,
  tms: false,
  zoomReverse: false,
  detectRetina: false,
  crossOrigin: false,

  // multi-analyze default options
  glOperation: 'none',
  multiLayers: 0,
  operationUrlA: '',
  operationUrlB: '',
  operationUrlC: '',
  operationUrlD: '',
  operationUrlE: '',
  operationUrlF: '',
  filterLowA: 0,
  filterHighA: 100000,
  filterLowB: 0,
  filterHighB: 100000,
  filterLowC: 0,
  filterHighC: 100000,
  filterLowD: 0,
  filterHighD: 100000,
  filterLowE: 0,
  filterHighE: 100000,
  filterLowF: 0,
  filterHighF: 100000,
  multiplierA: 1,
  multiplierB: 1,
  multiplierC: 1,
  multiplierD: 1,
  multiplierE: 1,
  multiplierF: 1,

  // Hillshading default options
  hillshadeType: 'none', // none, simple or pregen
  hsValueScale: 1.0,
  hsPixelScale: 'auto',
  hsSimpleZoomdelta: 0,
  hsSimpleSlopescale: 3.0,
  hsSimpleAzimuth: 315,
  hsSimpleAltitude: 70,
  hsAdvSoftIterations: 10,
  hsAdvAmbientIterations: 10,
  hsAdvSunRadiusMultiplier: 100,
  hsAdvFinalSoftMultiplier: 1.0,
  hsAdvFinalAmbientMultiplier: 0.25,
  hsAdvBaselayerUrl: '',
  hsPregenUrl: '',
  _hillshadeOptions: { hillshadeType: 'none' },

  // Contours default options
  contourType: 'none', // none, lines or illuminated
  contourSmoothLines: false,
  contourSmoothInput: false,
  contourSmoothInputKernel: 7,
  contourScaleFactor: 1,
  contourInterval: 25,
  contourIndexInterval: 100,
  contourLineColor: '#000000',
  contourIlluminatedHighlightColor: 'rgba(177,174,164,.5)',
  contourIlluminatedShadowColor: '#5b5143',
  contourIlluminatedShadowSize: 2, // px
  contourLineWeight: 0.5, // px
  contourLineIndexWeight: 2.0, // px
  contourIndexLabels: false,
  contourLabelFont: '12px Arial',
  contourLabelDistance: 250,
  contourHypso: false,
  contourHypsoDomain: [0, 1000, 2000],
  contourHypsoColors: ["#486341", "#e5d9c9", "#dddddd"],
  contourBathy: false,
  contourBathyDomain: [-2000, 0],
  contourBathyColors: ["#315d9b", "#d5f2ff"],
  contourBathyShadowColor: '#4e5c66',
  contourBathyHighlightColor: 'rgba(224, 242, 255, .5)',
};

/**
 * The options type used internally. Because submitted options are merged with defaults, fewer
 * properties have the potential to be `undefined` compared with `Options`.
 */
export type InternalOptions = Options & typeof defaultOptions;

export default class GLOperations extends L.GridLayer {
  static readonly defaultOptions = defaultOptions;

  options: InternalOptions;

  protected _map: L.Map;
  protected _renderer: Renderer;
  protected _preloadTileCache?: PreloadTileCache;
  // We need to define the `_tiles` cache with the same type as in the base class,
  // though our `_tiles` property is actually of type `TileCache`
  protected _tiles: L.InternalTiles;

  protected _contourData: ContourData = {};
  // protected _mergedTileArray: number[];

  constructor(options: Options) {
    // Merge options with defaults and invoke GridLayer's constructor,
    // which sets the merged options as `this.options`.
    super(Object.assign({}, defaultOptions, options));

    this._checkColorScaleAndSentinels();

    const {
      nodataValue,
      preloadUrl,
    } = this.options;

    const tileSize: number = this._tileSizeAsNumber();
    const renderer = new Renderer(
      this,
      tileSize,
      nodataValue,
      this.options.colorScale,
      this.options.sentinelValues,
      this.options.colorscaleMaxLength,
      this.options.sentinelMaxLength
    );

    // Set instance properties.
    Object.assign(this, {
      _renderer: renderer,
      _preloadTileCache: undefined,
    });

    this._maybePreload(preloadUrl);

    // generate vec3 directions for advanced hillshading with default iterations
    this._renderer.generateAmbientDirections(this.options.hsAdvAmbientIterations);
    this._renderer.generateSunDirections(
      this.options.hsAdvSoftIterations,
      this.options.hsAdvSunRadiusMultiplier
    );

    // Listen for 'tileunload' event to remove the tile from the texture.
    this.on("tileunload", this._onTileRemove.bind(this));

    // Listen for all visible tiles loaded. If using contours then run update
    this.on("load", (_) =>
      setTimeout(() => {
        if (this.options.debug) console.log("all tiles loaded. Updating contours if enabled.");
        this._maybeUpdateMergedArrayAndDrawContours();
        // delay due to: https://github.com/Leaflet/Leaflet/blob/master/src/map/Map.js#L1696
      }, 300)
    );

    // Listen for zoom changes. Necessary when using fractional zoom levels.
    setTimeout(() => {
      this._map.on("zoomend", _ => {
        const promise = util.delay(50);
        promise.then(async () => {
          if (this.options.contourType !== "none") {
            if (this.options.debug) console.log("zoom changed. Moving contour canvas.");
            const activeTilesBounds: ActiveTilesBounds = await this._getActivetilesBounds();
            this._moveContourCanvas(activeTilesBounds);
          }
        });
      });
    }, 300);
  }

  /**
   * The GLTileLayerComponent exposes a declarative interface. Changes should be triggered by
   * calling this method to update the options. Figuring out how to reconcile the layer's current
   * state with the updated options is the responsibility of the component. Unlike many other
   * Leaflet components, no other public methods are provided for imperatively changing the
   * component's state.
   */
  updateOptions(options: Partial<Options>) {
    const {
      url: prevUrl,
      glOperation: prevGlOperation,
      operationUrlA: prevUrlA,
      operationUrlB: prevUrlB,
      operationUrlC: prevUrlC,
      operationUrlD: prevUrlD,
      operationUrlE: prevUrlE,
      operationUrlF: prevUrlF,
      colorScale: prevColorScale,
      sentinelValues: prevSentinelValues,
      filterLowA: prevFilterLowA,
      filterHighA: prevFilterHighA,
      filterLowB: prevFilterLowB,
      filterHighB: prevFilterHighB,
      filterLowC: prevFilterLowC,
      filterHighC: prevFilterHighC,
      filterLowD: prevFilterLowD,
      filterHighD: prevFilterHighD,
      filterLowE: prevFilterLowE,
      filterHighE: prevFilterHighE,
      filterLowF: prevFilterLowF,
      filterHighF: prevFilterHighF,
      multiplierA: prevMultiplierA,
      multiplierB: prevMultiplierB,
      multiplierC: prevMultiplierC,
      multiplierD: prevMultiplierD,
      multiplierE: prevMultiplierE,
      multiplierF: prevMultiplierF,
      multiLayers: prevMultiLayers,
      hsPregenUrl: prevHsPregenUrl,
      hillshadeType: prevHillshadeType,
      hsValueScale: prevHsValueScale,
      hsPixelScale: prevHsPixelScale,
      hsSimpleSlopescale: prevHsSimpleSlopescale,
      hsSimpleAzimuth: prevHsSimpleAzimuth,
      hsSimpleAltitude: prevHsSimpleAltitude,
      hsAdvSoftIterations: prevHsAdvSoftIterations,
      hsAdvAmbientIterations: prevHsAdvAmbientIterations,
      hsAdvSunRadiusMultiplier: prevHsAdvSunRadiusMultiplier,
      hsAdvFinalSoftMultiplier: prevHsAdvFinalSoftMultiplier,
      hsAdvFinalAmbientMultiplier: prevHsAdvFinalAmbientMultiplier,
      hsAdvBaselayerUrl: prevHsAdvBaselayerUrl,
      contourInterval: prevContourInterval,
      contourIndexInterval: prevContourIndexInterval,
      contourLineColor: prevContourLineColor,
      contourLineWeight: prevContourLineWeight,
      contourLineIndexWeight: prevContourLineIndexWeight,
      contourType: prevContourType,
      contourSmoothLines: prevContourSmoothLines,
      contourSmoothInput: prevContourSmoothInput,
      contourSmoothInputKernel: prevContourSmoothInputKernel,
      contourIlluminatedHighlightColor: prevContourIlluminatedHighlightColor,
      contourIlluminatedShadowColor: prevContourIlluminatedShadowColor,
      contourIlluminatedShadowSize: prevContourIlluminatedShadowSize,
      contourHypso: prevContourHypso,
      contourHypsoDomain: prevContourHypsoDomain,
      contourHypsoColors: prevContourHypsoColors,
      contourBathy: prevContourBathy,
      contourBathyDomain: prevContourBathyDomain,
      contourBathyColors: prevContourBathyColors,
      contourBathyShadowColor: prevContourBathyShadowColor,
      contourBathyHighlightColor: prevContourBathyHighlightColor,
      contourIndexLabels: prevContourIndexLabels,
      contourLabelFont: prevContourLabelFont,
      contourLabelDistance: prevContourLabelDistance,
      colorscaleMaxLength: prevScaleMaxLength,
      sentinelMaxLength: prevSentinelMaxLength,
    } = this.options;
    L.Util.setOptions(this, options);
    // create new renderer if max length of sentinels or colorscale changes
    if (this.options.colorscaleMaxLength !== prevScaleMaxLength || this.options.sentinelMaxLength !== prevSentinelMaxLength) {
      if (this.options.debug) console.log("Creating new renderer");
      const tileSize: number = this._tileSizeAsNumber();
      const renderer = new Renderer(
        this,
        tileSize,
        this.options.nodataValue,
        this.options.colorScale,
        this.options.sentinelValues,
        this.options.colorscaleMaxLength,
        this.options.sentinelMaxLength
      );

      this._renderer.regl.destroy();
      // @ts-ignore
      delete this._renderer;

      Object.assign(this, {
        _renderer: renderer
      });
    }
    this._checkColorScaleAndSentinels();
    if (this.options.colorScale !== prevColorScale) {
      this._renderer.updateColorscale(this.options.colorScale);
    }
    if (this.options.sentinelValues !== prevSentinelValues) {
      this._renderer.updateSentinels(this.options.sentinelValues);
    }
    if (this.options.hsAdvAmbientIterations !== prevHsAdvAmbientIterations) {
      this._renderer.generateAmbientDirections(this.options.hsAdvAmbientIterations);
    }
    if (
      this.options.hsAdvSoftIterations !== prevHsAdvSoftIterations ||
      this.options.hsAdvSunRadiusMultiplier !== prevHsAdvSunRadiusMultiplier
      ) {
      this._renderer.generateSunDirections(this.options.hsAdvSoftIterations, this.options.hsAdvSunRadiusMultiplier);
    }
    this._maybePreload(this.options.preloadUrl);
    this.options._hillshadeOptions = {
      hillshadeType: this.options.hillshadeType,
      hsValueScale: this.options.hsValueScale,
      hsPixelScale: this.options.hsPixelScale,
      hsSimpleSlopescale: this.options.hsSimpleSlopescale,
      hsSimpleAzimuth: this.options.hsSimpleAzimuth,
      hsSimpleAltitude: this.options.hsSimpleAltitude,
      hsSimpleZoomdelta: this.options.hsSimpleZoomdelta,
      hsAdvSoftIterations: this.options.hsAdvSoftIterations,
      hsAdvAmbientIterations: this.options.hsAdvAmbientIterations,
      hsAdvSunRadiusMultiplier: this.options.hsAdvSunRadiusMultiplier,
      hsAdvFinalSoftMultiplier: this.options.hsAdvFinalSoftMultiplier,
      hsAdvFinalAmbientMultiplier: this.options.hsAdvFinalAmbientMultiplier,
      hsAdvBaselayerUrl: this.options.hsAdvBaselayerUrl,
      hsPregenUrl: this.options.hsPregenUrl,
    };

    if (this.options.extraPixelLayers > 0 && this.options.glOperation === 'none') {
      this._maybeLoadExtraLayers(prevUrlA, prevUrlB, prevUrlC, prevUrlD);
    }
    // TODO: Fix shader so simple hillshading works ok with larger texture than tileSize
    if (this.options.hillshadeType !== prevHillshadeType) {
      // reduce textureManager size as simple hillshading type currently gets "edges" around the tiles with larger texture.
      if (this.options.hillshadeType === 'simple') {
        this._renderer.setMaxTextureDimension(this._tileSizeAsNumber());
      } else if (prevHillshadeType === 'simple') {
        this._renderer.setMaxTextureDimension(this._renderer.findMaxTextureDimension());
      }
    }

    if (this.options.url !== prevUrl) {
      // need to clear tiles so they are not reused with adv.hs.
      this._renderer.textureManager.clearTiles();
    }

    if (this.options.hsAdvBaselayerUrl !== prevHsAdvBaselayerUrl) {
      // need to clear tiles so they are not reused
      // TODO: Check why necessary
      this._renderer.textureManagerHillshade.clearTiles();
    }

    if (this.options.glOperation === 'none') {
      if (this.options.transitions) {
        if (this.options.url !== prevUrl) {
          this._updateTilesWithTransitions(prevColorScale, prevSentinelValues);
          if (this.options.debug) console.log("Running GLOperations with transition on tiles");
        } else if (this.options.url === prevUrl) {
          this._updateColorscaleWithTransitions(prevColorScale, prevSentinelValues);
          if (this.options.debug) console.log("Running GLOperations with transition on colorscale only");
        }
      } else {
          if (
            this.options.url !== prevUrl ||
            this.options.hillshadeType !== prevHillshadeType ||
            this.options.hsPregenUrl !== prevHsPregenUrl ||
            this.options.hsSimpleSlopescale !== prevHsSimpleSlopescale ||
            this.options.hsSimpleAzimuth !== prevHsSimpleAzimuth ||
            this.options.hsSimpleAltitude !== prevHsSimpleAltitude ||
            this.options.hsAdvSunRadiusMultiplier !== prevHsAdvSunRadiusMultiplier ||
            this.options.hsAdvFinalSoftMultiplier !== prevHsAdvFinalSoftMultiplier ||
            this.options.hsAdvFinalAmbientMultiplier !== prevHsAdvFinalAmbientMultiplier ||
            this.options.hsAdvSoftIterations !== prevHsAdvSoftIterations ||
            this.options.hsAdvAmbientIterations !== prevHsAdvAmbientIterations ||
            this.options.hsValueScale !== prevHsValueScale ||
            this.options.hsPixelScale !== prevHsPixelScale ||
            this.options.hsAdvBaselayerUrl !== prevHsAdvBaselayerUrl
          ) {
            this._updateTiles();
            if (this.options.debug) console.log("Running GLOperations with new url, no transition and no operation");
          } else {
            if (JSON.stringify(this.options.colorScale) !== JSON.stringify(prevColorScale)) {
              this._updateTilesColorscaleOnly();
              if (this.options.debug) console.log("Running GLOperations with same url, no transition and no operation");
            }
          }
      }
    } else if (this.options.glOperation === 'multi') {
      if (this.options.multiLayers === 1) {
        this._updateTilesWithMultiAnalyze1(prevGlOperation, prevMultiLayers, prevUrlA,
          prevFilterLowA, prevFilterHighA, prevMultiplierA);
      } else if (this.options.multiLayers === 2) {
        this._updateTilesWithMultiAnalyze2(prevGlOperation, prevMultiLayers, prevUrlA, prevUrlB,
          prevFilterLowA, prevFilterHighA, prevFilterLowB, prevFilterHighB,
          prevMultiplierA, prevMultiplierB);
      } else if (this.options.multiLayers === 3) {
          this._updateTilesWithMultiAnalyze3(prevGlOperation, prevMultiLayers, prevUrlA, prevUrlB, prevUrlC,
            prevFilterLowA, prevFilterHighA, prevFilterLowB, prevFilterHighB, prevFilterLowC, prevFilterHighC,
            prevMultiplierA, prevMultiplierB, prevMultiplierC);
      } else if (this.options.multiLayers === 4) {
        this._updateTilesWithMultiAnalyze4(prevGlOperation, prevMultiLayers, prevUrlA, prevUrlB, prevUrlC, prevUrlD,
          prevFilterLowA, prevFilterHighA, prevFilterLowB, prevFilterHighB, prevFilterLowC, prevFilterHighC,
          prevFilterLowD, prevFilterHighD, prevMultiplierA, prevMultiplierB, prevMultiplierC, prevMultiplierD);
      } else if (this.options.multiLayers === 5) {
        this._updateTilesWithMultiAnalyze5(prevGlOperation, prevMultiLayers, prevUrlA, prevUrlB, prevUrlC, prevUrlD, prevUrlE,
          prevFilterLowA, prevFilterHighA, prevFilterLowB, prevFilterHighB, prevFilterLowC, prevFilterHighC,
          prevFilterLowD, prevFilterHighD, prevFilterLowE, prevFilterHighE, prevMultiplierA, prevMultiplierB,
          prevMultiplierC, prevMultiplierD, prevMultiplierE);
      } else if (this.options.multiLayers === 6) {
        this._updateTilesWithMultiAnalyze6(prevGlOperation, prevMultiLayers, prevUrlA, prevUrlB, prevUrlC, prevUrlD, prevUrlE, prevUrlF,
          prevFilterLowA, prevFilterHighA, prevFilterLowB, prevFilterHighB, prevFilterLowC, prevFilterHighC,
          prevFilterLowD, prevFilterHighD, prevFilterLowE, prevFilterHighE, prevFilterLowF, prevFilterHighF,
          prevMultiplierA, prevMultiplierB, prevMultiplierC, prevMultiplierD, prevMultiplierE, prevMultiplierF);
      }
      if (this.options.debug) console.log("Running GLOperations with multiAnalyze");
    } else if (this.options.glOperation === 'diff') {
      this._updateTilesWithDiff(prevGlOperation, prevUrlA, prevUrlB);
      if (this.options.debug) console.log("Running GLOperations with diff");
    }

    // Contour handling
    if (this.options.contourType !== 'none') {
      if (this.options.contourType !== prevContourType && prevContourType === 'none') {
        if(this._contourData.mergedTileArray) {
          setTimeout(() => {
            this._calculateAndDrawContours();
          }, 50);
        } else {
          setTimeout(() => {
            this._maybeUpdateMergedArrayAndDrawContours();
          }, 50);
        }
      } else if (
        this.options.contourSmoothInput && (
          this.options.contourSmoothInput !== prevContourSmoothInput ||
          this.options.contourSmoothInputKernel !== prevContourSmoothInputKernel
        )
      ) {
        const promise = util.delay(50);
        promise.then(async () => {
          this._smoothContourInput();
          this._calculateAndDrawContours();
        });
      } else if (
        this.options.contourInterval !== prevContourInterval ||
        this.options.contourIndexInterval !== prevContourIndexInterval ||
        this.options.contourSmoothLines !== prevContourSmoothLines ||
        this.options.contourSmoothInput !== prevContourSmoothInput
      ) {
        setTimeout(() => {
          this._calculateAndDrawContours();
        }, 50);
      } else if (
        this.options.contourType !== prevContourType ||
        this.options.contourLineColor !== prevContourLineColor ||
        this.options.contourLineWeight !== prevContourLineWeight ||
        this.options.contourLineIndexWeight !== prevContourLineIndexWeight ||
        this.options.contourIlluminatedHighlightColor !== prevContourIlluminatedHighlightColor ||
        this.options.contourIlluminatedShadowColor !== prevContourIlluminatedShadowColor ||
        this.options.contourIlluminatedShadowSize !== prevContourIlluminatedShadowSize ||
        this.options.contourHypso !== prevContourHypso ||
        this.options.contourHypsoDomain !== prevContourHypsoDomain ||
        this.options.contourHypsoColors !== prevContourHypsoColors ||
        this.options.contourBathy !== prevContourBathy ||
        this.options.contourBathyDomain !== prevContourBathyDomain ||
        this.options.contourBathyColors !== prevContourBathyColors ||
        this.options.contourBathyShadowColor !== prevContourBathyShadowColor ||
        this.options.contourBathyHighlightColor !== prevContourBathyHighlightColor ||
        this.options.contourIndexLabels !== prevContourIndexLabels ||
        this.options.contourLabelFont !== prevContourLabelFont ||
        this.options.contourLabelDistance !== prevContourLabelDistance
      ) {
        this._drawContours();
      }
    } else if (this.options.contourType !== prevContourType && this.options.contourType === 'none') {
      this._clearContours();
      this._contourData.mergedTileArray = undefined;
    }
  }


  /**
   * We need to register all mouse event handlers on the Leaflet Map component. `Leaflet.Layer`
   * does this automatically for any handlers returned from the optional method `getEvents`.
   *
   * We enhance the `MouseEvent` object Leaflet provides to these handlers with an additional
   * property containing the value of the pixel(s) under the cursor.
   */
  getEvents() {
    const {
      onclick: click,
      ondblclick: dblclick,
      onmousedown: mousedown,
      onmouseup: mouseup,
      onmouseover: mouseover,
      onmouseout: mouseout,
      onmousemove: mousemove,
      oncontextmenu: contextmenu,
    } = this.options;
    // Only include handlers that aren't undefined.
    const definedHandlers = pickBy({
      click,
      dblclick,
      mousedown,
      mouseup,
      mouseover,
      mouseout,
      mousemove,
      contextmenu,
    }, handler => !isUndefined(handler));
    // Combine events defined on this class with events defined on the parent GridLayer.
    return {
      // Include events from GridLayer.
      ...(L.GridLayer.prototype.getEvents as () => EventsObject).call(this),
      // Wrap each handler to provide property `pixelValue` on the event object.
      ...mapValues(definedHandlers, val => val && this._wrapMouseEventHandler(val)),
    };
  }

  /**
   * adapted from L.TileLayer (v1.2.0):
   * modified to accept a `url` parameter to allow loading from a URL other than `this.options.url`
   */
  getTileUrl(coords: TileCoordinates, url: string) {
    const data: any = {
      r: L.Browser.retina ? '@2x' : '',
      s: this._getSubdomain(coords),
      x: coords.x,
      y: coords.y,
      z: this._getZoomForUrl(),
    };
    if (this._map && !((this._map.options as L.MapOptions).crs as L.CRS).infinite) {
      const invertedY = (this._globalTileRange.max as L.Point).y - coords.y;
      if (this.options.tms) {
        data.y = invertedY;
      }
      data['-y'] = invertedY;
    }

    return L.Util.template(url, L.Util.extend(data, this.options));
  }

  /**
   * Causes the layer to clear all the tiles and request them again
   * Currently no changes from L.GridLayer implementation
   */
  redraw() {
    if (this._map) {
      this._removeAllTiles();
      this._update();
    }
    return this;
  }

  /**
   * This function is called by the underlying Leaflet.GridLayer when it creates a new tile. This
   * occurs (a) when the layer first loads and (b) when panning or zooming the map.
   */
  createTile(coords: TileCoordinates, done: L.DoneCallback): TileElement {
    const {
      extraPixelLayers,
      tileSize,
      url,
      hsPregenUrl,
      operationUrlA,
      operationUrlB,
      operationUrlC,
      operationUrlD,
      operationUrlE,
      operationUrlF,
      filterLowA,
      filterHighA,
      filterLowB,
      filterHighB,
      filterLowC,
      filterHighC,
      filterLowD,
      filterHighD,
      filterLowE,
      filterHighE,
      filterLowF,
      filterHighF,
      multiplierA,
      multiplierB,
      multiplierC,
      multiplierD,
      multiplierE,
      multiplierF,
    } = this.options;

    // Create a <canvas> element to contain the rendered image.
    const tileCanvas = L.DomUtil.create('canvas') as TileElement;
    // Configure the element.
    Object.assign(tileCanvas, {
      className: 'gl-tilelayer-tile',
      width: tileSize,
      height: tileSize,
    });

    if (this.options.glOperation === 'none') {
      // Download an extra layer if required
      if (extraPixelLayers === 1) {
        this._fetchTileData(coords, operationUrlA).then((pixelDataA) => {
          if (this.options.debug) console.log("createTile - extraPixelLayers === 1");
          tileCanvas.pixelDataA = pixelDataA;
        });
      }

      if (this.options._hillshadeOptions.hillshadeType === 'pregen') {
        Promise.all([
          this._fetchTileData(coords, url),
          this._fetchTileData(coords, hsPregenUrl),
        ]).then((pixelDataArray) => {
          // Render in `renderer`'s WebGL context.
          if (this.options.debug) console.log("_fetchTileData with pregen hs");
          const pixelData: Uint8Array = pixelDataArray[0];
          const pixelDataHs: Uint8Array = pixelDataArray[1];

          const [sourceX, sourceY] = this._renderer.renderTileHsPregen(
            { coords: coords, pixelData: pixelData },
            { coords: coords, pixelData: pixelDataHs },
          );

          // Copy pixel data to a property on tile canvas element (for later retrieval).
          tileCanvas.pixelData = pixelData;
          tileCanvas.pixelDataHsPregen = pixelDataHs;

          // Copy contents to tileCanvas.
          this._copyToTileCanvas(tileCanvas, sourceX, sourceY);
          done(undefined, tileCanvas);
        });
      } else if (this.options._hillshadeOptions.hillshadeType === 'advanced') {
        (async () => {
          try {
            // Retrieve and decode Float-32 PNG.
            let pixelData: Uint8Array;
            const hashKey = this._renderer.textureManager.hashTileCoordinates(coords);
            if (this._renderer.textureManager.contents.has(hashKey)) {
              // TODO: Not working properly. Seems to
              try {
                // @ts-ignore
                pixelData = this._tiles[hashKey].el.pixelData;
              } catch(err){
                pixelData = await this._fetchTileData(coords, url);
                this._renderer.textureManager.addTile(coords, pixelData);
              }
            } else {
              pixelData = await this._fetchTileData(coords, url);
              this._renderer.textureManager.addTile(coords, pixelData);
            }

            // if tile is just nodataValue, do not do anything
            const nodataTile = util.createNoDataTile(this.options.nodataValue, this._tileSizeAsNumber());
            if (!util.typedArraysAreEqual(pixelData, nodataTile)) {
              const textureCoords = await util.getAdjacentTilesTexCoords(
                this,
                this._renderer.textureManager,
                coords,
                url
              );

              let baselayerTexCoords: number[][] = [];
              // download baselayer tile if url specified
              if (this.options.hsAdvBaselayerUrl) {
                const basePixelData = await this._fetchTileData(
                  coords,
                  this.options.hsAdvBaselayerUrl,
                  "image",
                );
                const textureBounds = this._renderer.textureManagerHillshade.addTile(coords, basePixelData);
                baselayerTexCoords = util.getTexCoordVerticesTriangleStripQuad(textureBounds);
              }

              // Adjacent tiles as now available in TextureManager. Start rendering
              const [sourceX, sourceY] = this._renderer.renderTileHsAdvanced(
                this.options._hillshadeOptions,
                this._getZoomForUrl(),
                textureCoords,
                this._getPixelScale(),
                baselayerTexCoords,
              );

              // Copy pixel data to a property on tile canvas element (for later retrieval).
              tileCanvas.pixelData = pixelData;

              // Copy contents to tileCanvas.
              this._copyToTileCanvas(tileCanvas, sourceX, sourceY);
            }
            done(undefined, tileCanvas);
          } catch(err){
            console.log(err);
          }
        })();
      } else {
        // Retrieve and decode Float-32 PNG.
        this._fetchTileData(coords, url).then((pixelData) => {
          // Render in `renderer`'s WebGL context.
          if (this.options.debug) console.log("_fetchTileData with no operation");
          const [sourceX, sourceY] = this._renderer.renderTile(
            { coords, pixelData },
            this.options._hillshadeOptions,
            this._getZoomForUrl(),
          );

          // Copy pixel data to a property on tile canvas element (for later retrieval).
          tileCanvas.pixelData = pixelData;

          // Copy contents to tileCanvas.
          this._copyToTileCanvas(tileCanvas, sourceX, sourceY);
          done(undefined, tileCanvas);
        });
      }
    } else if (this.options.glOperation === 'diff') {
      Promise.all([
        this._fetchTileData(coords, operationUrlA),
        this._fetchTileData(coords, operationUrlB),
      ]).then((pixelDataArray) => {
        // Render in `renderer`'s WebGL context.
        if (this.options.debug) console.log("_fetchTileData with diff");
        const pixelDataA: Uint8Array = pixelDataArray[0];
        const pixelDataB: Uint8Array = pixelDataArray[1];
        const [sourceX, sourceY, resultEncodedPixels] = this._renderer.renderTileDiff(
          { coords: coords, pixelData: pixelDataA },
          { coords: coords, pixelData: pixelDataB },
        );

        tileCanvas.pixelData = resultEncodedPixels as Uint8Array;
        tileCanvas.pixelDataA = pixelDataA;
        tileCanvas.pixelDataB = pixelDataB;

        // Copy contents to tileCanvas.
        this._copyToTileCanvas(tileCanvas, sourceX, sourceY);
        done(undefined, tileCanvas);
      });
    } else if (this.options.glOperation === 'multi' && this.options.multiLayers === 1) {
      Promise.all([
        this._fetchTileData(coords, operationUrlA)
      ]).then((pixelDataArray) => {
        // Render in `renderer`'s WebGL context.
        if (this.options.debug) console.log("_fetchTileData with multi");
        const pixelDataA: Uint8Array = pixelDataArray[0];
        const [sourceX, sourceY, resultEncodedPixels] = this._renderer.renderTileMulti1(
          { coords: coords, pixelData: pixelDataA },
          filterLowA,
          filterHighA,
          multiplierA,
        );

        // Copy pixel data to a property on tile canvas element (for later retrieval).
        tileCanvas.pixelData = <Uint8Array>resultEncodedPixels;
        tileCanvas.pixelDataA = pixelDataA;

        // Copy contents to tileCanvas.
        this._copyToTileCanvas(tileCanvas, sourceX, sourceY);
        done(undefined, tileCanvas);
      });
    } else if (this.options.glOperation === 'multi' && this.options.multiLayers === 2) {
      Promise.all([
        this._fetchTileData(coords, operationUrlA),
        this._fetchTileData(coords, operationUrlB),
      ]).then((pixelDataArray) => {
        // Render in `renderer`'s WebGL context.
        if (this.options.debug) console.log("_fetchTileData with multi");
        const pixelDataA: Uint8Array = pixelDataArray[0];
        const pixelDataB: Uint8Array = pixelDataArray[1];
        const [sourceX, sourceY, resultEncodedPixels] = this._renderer.renderTileMulti2(
          { coords: coords, pixelData: pixelDataA },
          { coords: coords, pixelData: pixelDataB },
          filterLowA,
          filterHighA,
          filterLowB,
          filterHighB,
          multiplierA,
          multiplierB,
        );

        // Copy pixel data to a property on tile canvas element (for later retrieval).
        tileCanvas.pixelData = <Uint8Array>resultEncodedPixels;
        tileCanvas.pixelDataA = pixelDataA;
        tileCanvas.pixelDataB = pixelDataB;

        // Copy contents to tileCanvas.
        this._copyToTileCanvas(tileCanvas, sourceX, sourceY);
        done(undefined, tileCanvas);
      });
    } else if (this.options.glOperation === 'multi' && this.options.multiLayers === 3) {
      Promise.all([
        this._fetchTileData(coords, operationUrlA),
        this._fetchTileData(coords, operationUrlB),
        this._fetchTileData(coords, operationUrlC),
      ]).then((pixelDataArray) => {
        // Render in `renderer`'s WebGL context.
        if (this.options.debug) console.log("_fetchTileData with multi");
        const pixelDataA: Uint8Array = pixelDataArray[0];
        const pixelDataB: Uint8Array = pixelDataArray[1];
        const pixelDataC: Uint8Array = pixelDataArray[2];
        const [sourceX, sourceY, resultEncodedPixels] = this._renderer.renderTileMulti3(
          { coords: coords, pixelData: pixelDataA },
          { coords: coords, pixelData: pixelDataB },
          { coords: coords, pixelData: pixelDataC },
          filterLowA,
          filterHighA,
          filterLowB,
          filterHighB,
          filterLowC,
          filterHighC,
          multiplierA,
          multiplierB,
          multiplierC,
        );

        // Copy pixel data to a property on tile canvas element (for later retrieval).
        tileCanvas.pixelData = resultEncodedPixels as Uint8Array;
        tileCanvas.pixelDataA = pixelDataA;
        tileCanvas.pixelDataB = pixelDataB;
        tileCanvas.pixelDataC = pixelDataC;

        // Copy contents to tileCanvas.
        this._copyToTileCanvas(tileCanvas, sourceX, sourceY);
        done(undefined, tileCanvas);
      });
    } else if (this.options.glOperation === 'multi' && this.options.multiLayers === 4) {
      Promise.all([
        this._fetchTileData(coords, operationUrlA),
        this._fetchTileData(coords, operationUrlB),
        this._fetchTileData(coords, operationUrlC),
        this._fetchTileData(coords, operationUrlD),
      ]).then((pixelDataArray) => {
        // Render in `renderer`'s WebGL context.
        if (this.options.debug) console.log("_fetchTileData with multi");
        const pixelDataA: Uint8Array = pixelDataArray[0];
        const pixelDataB: Uint8Array = pixelDataArray[1];
        const pixelDataC: Uint8Array = pixelDataArray[2];
        const pixelDataD: Uint8Array = pixelDataArray[3];
        const [sourceX, sourceY, resultEncodedPixels] = this._renderer.renderTileMulti4(
          { coords: coords, pixelData: pixelDataA },
          { coords: coords, pixelData: pixelDataB },
          { coords: coords, pixelData: pixelDataC },
          { coords: coords, pixelData: pixelDataD },
          filterLowA,
          filterHighA,
          filterLowB,
          filterHighB,
          filterLowC,
          filterHighC,
          filterLowD,
          filterHighD,
          multiplierA,
          multiplierB,
          multiplierC,
          multiplierD,
        );

        // Copy pixel data to a property on tile canvas element (for later retrieval).
        tileCanvas.pixelData = <Uint8Array>resultEncodedPixels;
        tileCanvas.pixelDataA = pixelDataA;
        tileCanvas.pixelDataB = pixelDataB;
        tileCanvas.pixelDataC = pixelDataC;
        tileCanvas.pixelDataD = pixelDataD;

        // Copy contents to tileCanvas.
        this._copyToTileCanvas(tileCanvas, sourceX, sourceY);
        done(undefined, tileCanvas);
      });
    } else if (this.options.glOperation === 'multi' && this.options.multiLayers === 5) {
      Promise.all([
        this._fetchTileData(coords, operationUrlA),
        this._fetchTileData(coords, operationUrlB),
        this._fetchTileData(coords, operationUrlC),
        this._fetchTileData(coords, operationUrlD),
        this._fetchTileData(coords, operationUrlE),
      ]).then((pixelDataArray) => {
        // Render in `renderer`'s WebGL context.
        if (this.options.debug) console.log("_fetchTileData with multi");
        const pixelDataA: Uint8Array = pixelDataArray[0];
        const pixelDataB: Uint8Array = pixelDataArray[1];
        const pixelDataC: Uint8Array = pixelDataArray[2];
        const pixelDataD: Uint8Array = pixelDataArray[3];
        const pixelDataE: Uint8Array = pixelDataArray[4];
        const [sourceX, sourceY, resultEncodedPixels] = this._renderer.renderTileMulti5(
          { coords: coords, pixelData: pixelDataA },
          { coords: coords, pixelData: pixelDataB },
          { coords: coords, pixelData: pixelDataC },
          { coords: coords, pixelData: pixelDataD },
          { coords: coords, pixelData: pixelDataE },
          filterLowA,
          filterHighA,
          filterLowB,
          filterHighB,
          filterLowC,
          filterHighC,
          filterLowD,
          filterHighD,
          filterLowE,
          filterHighE,
          multiplierA,
          multiplierB,
          multiplierC,
          multiplierD,
          multiplierE,
        );

        // Copy pixel data to a property on tile canvas element (for later retrieval).
        tileCanvas.pixelData = <Uint8Array>resultEncodedPixels;
        tileCanvas.pixelDataA = pixelDataA;
        tileCanvas.pixelDataB = pixelDataB;
        tileCanvas.pixelDataC = pixelDataC;
        tileCanvas.pixelDataD = pixelDataD;
        tileCanvas.pixelDataE = pixelDataE;

        // Copy contents to tileCanvas.
        this._copyToTileCanvas(tileCanvas, sourceX, sourceY);
        done(undefined, tileCanvas);
      });
    } else if (this.options.glOperation === 'multi' && this.options.multiLayers === 6) {
      Promise.all([
        this._fetchTileData(coords, operationUrlA),
        this._fetchTileData(coords, operationUrlB),
        this._fetchTileData(coords, operationUrlC),
        this._fetchTileData(coords, operationUrlD),
        this._fetchTileData(coords, operationUrlE),
        this._fetchTileData(coords, operationUrlF),
      ]).then((pixelDataArray) => {
        // Render in `renderer`'s WebGL context.
        if (this.options.debug) console.log("_fetchTileData with multi");
        const pixelDataA: Uint8Array = pixelDataArray[0];
        const pixelDataB: Uint8Array = pixelDataArray[1];
        const pixelDataC: Uint8Array = pixelDataArray[2];
        const pixelDataD: Uint8Array = pixelDataArray[3];
        const pixelDataE: Uint8Array = pixelDataArray[4];
        const pixelDataF: Uint8Array = pixelDataArray[5];
        const [sourceX, sourceY, resultEncodedPixels] = this._renderer.renderTileMulti6(
          { coords: coords, pixelData: pixelDataA },
          { coords: coords, pixelData: pixelDataB },
          { coords: coords, pixelData: pixelDataC },
          { coords: coords, pixelData: pixelDataD },
          { coords: coords, pixelData: pixelDataE },
          { coords: coords, pixelData: pixelDataF },
          filterLowA,
          filterHighA,
          filterLowB,
          filterHighB,
          filterLowC,
          filterHighC,
          filterLowD,
          filterHighD,
          filterLowE,
          filterHighE,
          filterLowF,
          filterHighF,
          multiplierA,
          multiplierB,
          multiplierC,
          multiplierD,
          multiplierE,
          multiplierF,
        );

        // Copy pixel data to a property on tile canvas element (for later retrieval).
        tileCanvas.pixelData = <Uint8Array>resultEncodedPixels;
        tileCanvas.pixelDataA = pixelDataA;
        tileCanvas.pixelDataB = pixelDataB;
        tileCanvas.pixelDataC = pixelDataC;
        tileCanvas.pixelDataD = pixelDataD;
        tileCanvas.pixelDataE = pixelDataE;
        tileCanvas.pixelDataF = pixelDataF;

        // Copy contents to tileCanvas.
        this._copyToTileCanvas(tileCanvas, sourceX, sourceY);
        done(undefined, tileCanvas);
      });
    }

    return tileCanvas;
  }

  /**
   * Check invariant: Either `colorScale` or `sentinelValues` must be of non-zero length.
   */
  protected _checkColorScaleAndSentinels() {
    const {
      colorScale,
      sentinelValues,
      colorscaleMaxLength,
      sentinelMaxLength,
    } = this.options;
    if (colorScale.length === 0 && sentinelValues.length === 0) {
      throw new Error('Either `colorScale` or `sentinelValues` must be of non-zero length.');
    }
    if (colorScale.length > colorscaleMaxLength) {
      throw new Error(
        `Color scale length ${colorScale.length} exceeds the maximum, ${colorscaleMaxLength}.`,
      );
    }
    if (sentinelValues.length > sentinelMaxLength) {
      throw new Error(
        `Sentinel values length ${sentinelValues.length} exceeds the maximum, ${sentinelMaxLength}.`,
      );
    }
  }

  /**
   * adapted from eponymous private method in L.TileLayer (v1.2.0)
   */
  protected _getSubdomain(tilePoint: TileCoordinates): string {
    const index = Math.abs(tilePoint.x + tilePoint.y) % this.options.subdomains.length;
    return this.options.subdomains[index];
  }

  /**
   * adapted from eponymous private method in L.TileLayer (v1.2.0)
   */
  protected _getZoomForUrl(): number {
    const {
      maxZoom,
      zoomReverse,
      zoomOffset,
    } = this.options;
    const tileZoom = this._tileZoom as number;
    const zoom = zoomReverse ? maxZoom - tileZoom : tileZoom;
    return zoom + zoomOffset;
  }

  /**
   * Handler function for Leaflet.GridLayer's 'tileunload' event.
   */
  protected _onTileRemove({ coords, tile }: TileEvent) {
    if (this.options.debug) console.log("_onTileRemove()");
    // for https://github.com/Leaflet/Leaflet/issues/137
    if (!L.Browser.android) {
      tile.onload = noop;
    }
    this._renderer.removeTile(coords);
  }

  /**
   * Redraw all active tiles with new url.
   */
  protected async _updateTiles() {
    const activeTiles: GridLayerTile[] = this._getActiveTiles();

    // Fetch data from the new URL.
    const tilesData: TileDatum[] = await this._getTilesData(activeTiles);
    if (this.options.debug) console.log("_updateTiles() with url "+this.options.url);

    // Render using the new data.
    let canvasCoordinates: Array<Pair<number>>;
    let tilesDataHs: TileDatum[];
    if (this.options._hillshadeOptions.hillshadeType === 'pregen') {
      tilesDataHs = await this._getTilesData(activeTiles, this.options.hsPregenUrl);
      canvasCoordinates = this._renderer.renderTilesHsPregen(
        tilesData,
        tilesDataHs,
      );
    } else if (this.options._hillshadeOptions.hillshadeType === 'advanced') {
      // canvasCoordinates = this._renderer.renderTilesHsAdvanced(
      //   tilesData,
      //   this.options._hillshadeOptions,
      //   this.options.url,
      //   this._getZoomForUrl(),
        // this._getPixelScale(),
      // );
      // TODO: make this work without redraw?
      if (this.options.debug) console.log("_updateTiles() with advanced hs");
      this.redraw();
      return;
    } else {
      canvasCoordinates = this._renderer.renderTiles(
        tilesData,
        this.options._hillshadeOptions,
        this._getZoomForUrl(),
      );
    }

    // Update tiles.
    canvasCoordinates.forEach(([sourceX, sourceY], index) => {
      // Copy rendered pixels to the tile canvas.
      const tile = activeTiles[index];
      this._copyToTileCanvas(tile.el, sourceX, sourceY);

      // Copy new pixel data.
      tile.el.pixelData = tilesData[index].pixelData;
      if (this.options._hillshadeOptions.hillshadeType === 'pregen') {
        tile.el.pixelDataHsPregen = tilesDataHs[index].pixelData;
      }
    });
  }

  /**
   * Redraw all active tiles. Only colorscale changed.
   */
  protected async _updateTilesColorscaleOnly() {
    if (this.options.debug) console.log("_updateTilesColorscaleOnly()");
    const activeTiles: GridLayerTile[] = this._getActiveTiles();

    // Render using the new data.
    if (this.options._hillshadeOptions.hillshadeType === 'pregen') {
      // Fetch data from the existing tiles.
      const tilesData: TileDatum[] = activeTiles.map(({ coords, el }) => ({
        coords: coords,
        pixelData: el.pixelData as Uint8Array,
      }));
      const tilesDataHs: TileDatum[] = activeTiles.map(({ coords, el }) => ({
        coords: coords,
        pixelData: el.pixelDataHsPregen as Uint8Array,
      }));

      const canvasCoordinates = this._renderer.renderTilesHsPregen(
        tilesData,
        tilesDataHs,
      );

      canvasCoordinates.forEach(([sourceX, sourceY], index) => {
        // Copy rendered pixels to the tile canvas.
        const tile = activeTiles[index];
        this._copyToTileCanvas(tile.el, sourceX, sourceY);
      });
    } else if (this.options._hillshadeOptions.hillshadeType === 'advanced') {
      if (this.options.debug) console.log("_updateTilesColorscaleOnly() with advanced hs");
      this.redraw();
      return;
    } else {
      // Fetch data from the existing tiles.
      const tilesData: TileDatum[] = activeTiles.map(({ coords, el }) => ({
        coords: coords,
        pixelData: el.pixelData as Uint8Array,
      }));

      const canvasCoordinates = this._renderer.renderTiles(
        tilesData,
        this.options._hillshadeOptions,
        this._getZoomForUrl(),
      );

      canvasCoordinates.forEach(([sourceX, sourceY], index) => {
        // Copy rendered pixels to the tile canvas.
        const tile = activeTiles[index];
        this._copyToTileCanvas(tile.el, sourceX, sourceY);
      });
    }
  }

  /**
   * Redraw all active tiles with updated tilesUrl, animating the transition over a time interval specified in
   * `options.transitionTimeMs`.
   */
  protected async _updateTilesWithTransitions(
    prevColorScale: Color[],
    prevSentinelValues: SentinelValue[],
  ) {
    if (this.options.debug) console.log("_updateTilesWithTransitions()");
    const activeTiles: GridLayerTile[] = this._getActiveTiles();

    const prevTilesData: TileDatum[] = activeTiles.map(({ coords, el }) => ({
      coords,
      pixelData: el.pixelData as Uint8Array,
    }));

    // Fetch data from the new URL.
    const newTilesData: TileDatum[] = await this._getTilesData(activeTiles);

    // Copy new pixel data to tiles.
    activeTiles.forEach((tile, index) => {
      tile.el.pixelData = newTilesData[index].pixelData;
    });

    const {
      colorScale: newColorScale,
      sentinelValues: newSentinelValues = [],
      transitionTimeMs,
    } = this.options;

    // This function will be passed to the Renderer, which will call it after rendering a frame
    // in its offscreen <canvas>.
    const onFrameRendered = (canvasCoordinates: Array<Pair<number>>) => {
      canvasCoordinates.forEach(([sourceX, sourceY], index) => {
        // Copy rendered pixels to the tile <canvas>.
        const tile = activeTiles[index];
        this._copyToTileCanvas(tile.el, sourceX, sourceY);
      });
    };

    // Renderer hooks the render calls to requestAnimationFrame, calling `onFrameRendered` after each is drawn.
    if (JSON.stringify(newColorScale) === JSON.stringify(prevColorScale) && JSON.stringify(newSentinelValues) === JSON.stringify(prevSentinelValues)) {
      this._renderer.renderTilesWithTransition(
        prevTilesData,
        newTilesData,
        transitionTimeMs,
        onFrameRendered,
      );
    } else {
      this._renderer.renderTilesWithTransitionAndNewColorScale(
        prevTilesData,
        newTilesData,
        transitionTimeMs,
        onFrameRendered,
      );
    }
  }

  /**
   * Redraw tiles with updated colorscale, animating the transition over a time interval specified in
   * `options.transitionTimeMs`.
   */
  protected async _updateColorscaleWithTransitions(
    prevColorScale: Color[],
    prevSentinelValues: SentinelValue[],
  ) {
    if (this.options.debug) console.log("_updateColorscaleWithTransitions()");
    const activeTiles: GridLayerTile[] = this._getActiveTiles();

    const tilesData: TileDatum[] = activeTiles.map(({ coords, el }) => ({
      coords,
      pixelData: el.pixelData as Uint8Array,
    }));

    const {
      colorScale: newColorScale,
      sentinelValues: newSentinelValues = [],
      transitionTimeMs,
    } = this.options;

    // This function will be passed to the Renderer, which will call it after rendering a frame
    // in its offscreen <canvas>.
    const onFrameRendered = (canvasCoordinates: Array<Pair<number>>) => {
      canvasCoordinates.forEach(([sourceX, sourceY], index) => {
        // Copy rendered pixels to the tile <canvas>.
        const tile = activeTiles[index];
        this._copyToTileCanvas(tile.el, sourceX, sourceY);
      });
    };

    // Renderer hooks the render calls to requestAnimationFrame, calling `onFrameRendered` after each is drawn.
    if (JSON.stringify(newColorScale) !== JSON.stringify(prevColorScale) || JSON.stringify(newSentinelValues) !== JSON.stringify(prevSentinelValues)) {
      this._renderer.renderTilesWithTransitionAndNewColorScaleOnly(
        tilesData,
        transitionTimeMs,
        onFrameRendered,
      );
    }
  }

  /**
   * Redraw with diff between two tileLayers
   */
  protected async _updateTilesWithDiff(
    prevGlOperation: string,
    prevUrlA: string,
    prevUrlB: string
  ) {
    if (this.options.debug) console.log("_updateTilesWithDiff()");
    const activeTiles: GridLayerTile[] = this._getActiveTiles();

    let tilesA: TileDatum[] = [];
    let tilesB: TileDatum[] = [];
    if (
      this.options.glOperation === prevGlOperation &&
      this.options.operationUrlA === prevUrlA &&
      this.options.operationUrlB === prevUrlB
    ) {
      if (this.options.debug) console.log("_updateTilesWithDiff: both same url. Getting data from existing result");
        // Fetch data from the existing tiles.
        tilesA = activeTiles.map(({ coords, el }) => ({
          coords,
          pixelData: el.pixelData as Uint8Array,
        }));
    } else {
      // Fetch tilesA data
      if (this.options.operationUrlA !== prevUrlA) {
        if (this.options.debug) console.log("_updateTilesWithDiff: new A url. Downloading new tiles");
        tilesA = await this._getTilesData(activeTiles, this.options.operationUrlA);

        // Copy new pixel data to tiles.
        activeTiles.forEach((tile, index) => {
          tile.el.pixelDataA = tilesA[index].pixelData;
        });
      } else {
        if (this.options.debug) console.log("_updateTilesWithDiff: same A url. Getting data from existing tiles");
        // Fetch data from the existing tiles.
        tilesA = activeTiles.map(({ coords, el }) => ({
          coords,
          pixelData: el.pixelDataA as Uint8Array,
        }));
      }

      // Fetch tilesB data
      if (this.options.operationUrlB !== prevUrlB) {
        if (this.options.debug) console.log("_updateTilesWithDiff: new B url. Downloading new tiles");
        tilesB = await this._getTilesData(activeTiles, this.options.operationUrlB);

        // Copy new pixel data to tiles.
        activeTiles.forEach((tile, index) => {
          tile.el.pixelDataB = tilesB[index].pixelData;
        });
      } else {
        if (this.options.debug) console.log("_updateTilesWithDiff: same B url. Getting data from existing tiles");
        // Fetch data from the existing tiles.
        tilesB = activeTiles.map(({ coords, el }) => ({
          coords,
          pixelData: el.pixelDataB as Uint8Array,
        }));
      }
    }

    if (
      this.options.glOperation === prevGlOperation &&
      this.options.operationUrlA === prevUrlA &&
      this.options.operationUrlB === prevUrlB
    ) {
      if (this.options.debug) console.log("_updateTilesWithDiff: both same urls. Running renderTiles()");
      const canvasCoordinates = this._renderer.renderTiles(
        tilesA,
        this.options._hillshadeOptions,
        this._getZoomForUrl()
      );

      canvasCoordinates.forEach(([sourceX, sourceY], index) => {
        // Copy rendered pixels to the tile canvas.
        const tile = activeTiles[index];
        this._copyToTileCanvas(tile.el, sourceX, sourceY);

      });
    } else {
      if (this.options.debug) console.log("_updateTilesWithDiff: not same urls. Running renderTilesWithDiff()");

      // This function will be passed to the Renderer, which will call it after rendering a frame
      // in its offscreen <canvas>.
      const onFrameRendered = (canvasCoordinates: Array<Pair<number>>) => {
        canvasCoordinates.forEach(([sourceX, sourceY], index) => {
          // Copy rendered pixels to the tile <canvas>.
          const tile = activeTiles[index];
          this._copyToTileCanvas(tile.el, sourceX, sourceY);
        });
      };

      const resultEncodedPixels: Uint8Array[] = this._renderer.renderTilesWithDiff(
        tilesA,
        tilesB,
        onFrameRendered,
      );

      // Copy result pixel data to tiles to use for mouseEvents.
      activeTiles.forEach((tile, index) => {
        tile.el.pixelData = resultEncodedPixels[index];
      });
    }
  }


  /**
   * Redraw tiles with operations on 1 tileLayer
   */
  protected async _updateTilesWithMultiAnalyze1(
    prevGlOperation: string,
    prevMultiLayers: number,
    prevUrlA: string,
    prevFilterLowA: number,
    prevFilterHighA: number,
    prevMultiplierA: number,
  ) {
    if (this.options.debug) console.log("_updateTilesWithMultiAnalyze1()");
    const activeTiles: GridLayerTile[] = this._getActiveTiles();

    if (
      this.options.glOperation === prevGlOperation &&
      this.options.operationUrlA === prevUrlA &&
      this.options.filterLowA === prevFilterLowA &&
      this.options.filterHighA === prevFilterHighA &&
      this.options.multiplierA === prevMultiplierA &&
      this.options.multiLayers === prevMultiLayers
    ) {
      if (this.options.debug) console.log("_updateTilesWithMultiAnalyze1: all same urls. Fetching from existing tiles. Running renderTiles()");
      // Fetch data from the existing tiles.
      const tilesA: TileDatum[] = activeTiles.map(({ coords, el }) => ({
        coords,
        pixelData: el.pixelData as Uint8Array,
      }));

      const canvasCoordinates = this._renderer.renderTiles(
        tilesA,
        this.options._hillshadeOptions,
        this._getZoomForUrl()
      );

      canvasCoordinates.forEach(([sourceX, sourceY], index) => {
        // Copy rendered pixels to the tile canvas.
        const tile = activeTiles[index];
        this._copyToTileCanvas(tile.el, sourceX, sourceY);
      });
    } else {
      let tilesA: TileDatum[] = [];
      // Fetch tilesA data
      if (this.options.operationUrlA !== prevUrlA) {
        tilesA = await this._getTilesData(activeTiles, this.options.operationUrlA);

        // Copy new pixel data to tiles.
        activeTiles.forEach((tile, index) => {
          tile.el.pixelDataA = tilesA[index].pixelData;
        });
      } else {
        // Fetch data from the existing tiles.
        tilesA = activeTiles.map(({ coords, el }) => ({
          coords,
          pixelData: el.pixelDataA as Uint8Array,
        }));
      }

      // This function will be passed to the Renderer, which will call it after rendering a frame
      // in its offscreen <canvas>.
      const onFrameRendered = (canvasCoordinates: Array<Pair<number>>) => {
        canvasCoordinates.forEach(([sourceX, sourceY], index) => {
          // Copy rendered pixels to the tile <canvas>.
          const tile = activeTiles[index];
          this._copyToTileCanvas(tile.el, sourceX, sourceY);
        });
      };

      // Renderer hooks the render calls to requestAnimationFrame, calling `onFrameRendered` after each is drawn.
      const resultEncodedPixels: Uint8Array[] = this._renderer.renderTilesWithMultiAnalyze1(
        tilesA,
        this.options.filterLowA,
        this.options.filterHighA,
        this.options.multiplierA,
        onFrameRendered,
      );

      // Copy result pixel data to tiles to use for mouseEvents.
      activeTiles.forEach((tile, index) => {
        tile.el.pixelData = resultEncodedPixels[index];
      });
    }
  }


  /**
   * Redraw tiles with operations on 2 tileLayers
   */
  protected async _updateTilesWithMultiAnalyze2(
    prevGlOperation: string,
    prevMultiLayers: number,
    prevUrlA: string,
    prevUrlB: string,
    prevFilterLowA: number,
    prevFilterHighA: number,
    prevFilterLowB: number,
    prevFilterHighB: number,
    prevMultiplierA: number,
    prevMultiplierB: number
  ) {
    if (this.options.debug) console.log("_updateTilesWithMultiAnalyze2()");
    const activeTiles: GridLayerTile[] = this._getActiveTiles();

    if (
      this.options.glOperation === prevGlOperation &&
      this.options.operationUrlA === prevUrlA &&
      this.options.operationUrlB === prevUrlB &&
      this.options.filterLowA === prevFilterLowA &&
      this.options.filterHighA === prevFilterHighA &&
      this.options.filterLowB === prevFilterLowB &&
      this.options.filterHighB === prevFilterHighB &&
      this.options.multiplierA === prevMultiplierA &&
      this.options.multiplierB === prevMultiplierB &&
      this.options.multiLayers === prevMultiLayers
    ) {
      if (this.options.debug) console.log("_updateTilesWithMultiAnalyze2: all same urls. Fetching from existing tiles. Running renderTiles()");
      // Fetch data from the existing tiles.
      const tilesA: TileDatum[] = activeTiles.map(({ coords, el }) => ({
        coords,
        pixelData: el.pixelData as Uint8Array,
      }));

      const canvasCoordinates = this._renderer.renderTiles(
        tilesA,
        this.options._hillshadeOptions,
        this._getZoomForUrl()
      );

      canvasCoordinates.forEach(([sourceX, sourceY], index) => {
        // Copy rendered pixels to the tile canvas.
        const tile = activeTiles[index];
        this._copyToTileCanvas(tile.el, sourceX, sourceY);
      });
    } else {
      let tilesA: TileDatum[] = [];
      let tilesB: TileDatum[] = [];
      // Fetch tilesA data
      if (this.options.operationUrlA !== prevUrlA) {
        tilesA = await this._getTilesData(activeTiles, this.options.operationUrlA);

        // Copy new pixel data to tiles.
        activeTiles.forEach((tile, index) => {
          tile.el.pixelDataA = tilesA[index].pixelData;
        });
      } else {
        // Fetch data from the existing tiles.
        tilesA = activeTiles.map(({ coords, el }) => ({
          coords,
          pixelData: el.pixelDataA as Uint8Array,
        }));
      }

      // Fetch tilesB data
      if (this.options.operationUrlB !== prevUrlB) {
        tilesB = await this._getTilesData(activeTiles, this.options.operationUrlB);

        // Copy new pixel data to tiles.
        activeTiles.forEach((tile, index) => {
          tile.el.pixelDataB = tilesB[index].pixelData;
        });
      } else {
        // Fetch data from the existing tiles.
        tilesB = activeTiles.map(({ coords, el }) => ({
          coords,
          pixelData: el.pixelDataB as Uint8Array,
        }));
      }

      // This function will be passed to the Renderer, which will call it after rendering a frame
      // in its offscreen <canvas>.
      const onFrameRendered = (canvasCoordinates: Array<Pair<number>>) => {
        canvasCoordinates.forEach(([sourceX, sourceY], index) => {
          // Copy rendered pixels to the tile <canvas>.
          const tile = activeTiles[index];
          this._copyToTileCanvas(tile.el, sourceX, sourceY);
        });
      };

      // Renderer hooks the render calls to requestAnimationFrame, calling `onFrameRendered` after each is drawn.
      const resultEncodedPixels: Uint8Array[] = this._renderer.renderTilesWithMultiAnalyze2(
        tilesA,
        tilesB,
        this.options.filterLowA,
        this.options.filterHighA,
        this.options.filterLowB,
        this.options.filterHighB,
        this.options.multiplierA,
        this.options.multiplierB,
        onFrameRendered,
      );

      // Copy result pixel data to tiles to use for mouseEvents.
      activeTiles.forEach((tile, index) => {
        tile.el.pixelData = resultEncodedPixels[index];
      });
    }
  }


  /**
   * Redraw tiles with operations on 3 tileLayers
   */
  protected async _updateTilesWithMultiAnalyze3(
    prevGlOperation: string,
    prevMultiLayers: number,
    prevUrlA: string,
    prevUrlB: string,
    prevUrlC: string,
    prevFilterLowA: number,
    prevFilterHighA: number,
    prevFilterLowB: number,
    prevFilterHighB: number,
    prevFilterLowC: number,
    prevFilterHighC: number,
    prevMultiplierA: number,
    prevMultiplierB: number,
    prevMultiplierC: number
  ) {
    if (this.options.debug) console.log("_updateTilesWithMultiAnalyze3()");
    const activeTiles: GridLayerTile[] = this._getActiveTiles();

    if (
      this.options.glOperation === prevGlOperation &&
      this.options.operationUrlA === prevUrlA &&
      this.options.operationUrlB === prevUrlB &&
      this.options.operationUrlC === prevUrlC &&
      this.options.filterLowA === prevFilterLowA &&
      this.options.filterHighA === prevFilterHighA &&
      this.options.filterLowB === prevFilterLowB &&
      this.options.filterHighB === prevFilterHighB &&
      this.options.filterLowC === prevFilterLowC &&
      this.options.filterHighC === prevFilterHighC &&
      this.options.multiplierA === prevMultiplierA &&
      this.options.multiplierB === prevMultiplierB &&
      this.options.multiplierC === prevMultiplierC &&
      this.options.multiLayers === prevMultiLayers
    ) {
      if (this.options.debug) console.log("_updateTilesWithMultiAnalyze3: all same urls. Fetching from existing tiles. Running renderTiles()");
      // Fetch data from the existing tiles.
      const tilesA: TileDatum[] = activeTiles.map(({ coords, el }) => ({
        coords,
        pixelData: el.pixelData as Uint8Array,
      }));

      const canvasCoordinates = this._renderer.renderTiles(
        tilesA,
        this.options._hillshadeOptions,
        this._getZoomForUrl()
      );

      canvasCoordinates.forEach(([sourceX, sourceY], index) => {
        // Copy rendered pixels to the tile canvas.
        const tile = activeTiles[index];
        this._copyToTileCanvas(tile.el, sourceX, sourceY);
      });
    } else {
      let tilesA: TileDatum[] = [];
      let tilesB: TileDatum[] = [];
      let tilesC: TileDatum[] = [];
      // Fetch tilesA data
      if (this.options.operationUrlA !== prevUrlA) {
        tilesA = await this._getTilesData(activeTiles, this.options.operationUrlA);

        // Copy new pixel data to tiles.
        activeTiles.forEach((tile, index) => {
          tile.el.pixelDataA = tilesA[index].pixelData;
        });
      } else {
        // Fetch data from the existing tiles.
        tilesA = activeTiles.map(({ coords, el }) => ({
          coords,
          pixelData: el.pixelDataA as Uint8Array,
        }));
      }

      // Fetch tilesB data
      if (this.options.operationUrlB !== prevUrlB) {
        tilesB = await this._getTilesData(activeTiles, this.options.operationUrlB);

        // Copy new pixel data to tiles.
        activeTiles.forEach((tile, index) => {
          tile.el.pixelDataB = tilesB[index].pixelData;
        });
      } else {
        // Fetch data from the existing tiles.
        tilesB = activeTiles.map(({ coords, el }) => ({
          coords,
          pixelData: el.pixelDataB as Uint8Array,
        }));
      }

      // Fetch tilesC data
      if (this.options.operationUrlC !== prevUrlC) {
        tilesC = await this._getTilesData(activeTiles, this.options.operationUrlC);

        // Copy new pixel data to tiles.
        activeTiles.forEach((tile, index) => {
          tile.el.pixelDataC = tilesC[index].pixelData;
        });
      } else {
        // Fetch data from the existing tiles.
        tilesC = activeTiles.map(({ coords, el }) => ({
          coords,
          pixelData: el.pixelDataC as Uint8Array,
        }));
      }

      // This function will be passed to the Renderer, which will call it after rendering a frame
      // in its offscreen <canvas>.
      const onFrameRendered = (canvasCoordinates: Array<Pair<number>>) => {
        canvasCoordinates.forEach(([sourceX, sourceY], index) => {
          // Copy rendered pixels to the tile <canvas>.
          const tile = activeTiles[index];
          this._copyToTileCanvas(tile.el, sourceX, sourceY);
        });
      };

      // Renderer hooks the render calls to requestAnimationFrame, calling `onFrameRendered` after each is drawn.
      const resultEncodedPixels: Uint8Array[] = this._renderer.renderTilesWithMultiAnalyze3(
        tilesA,
        tilesB,
        tilesC,
        this.options.filterLowA,
        this.options.filterHighA,
        this.options.filterLowB,
        this.options.filterHighB,
        this.options.filterLowC,
        this.options.filterHighC,
        this.options.multiplierA,
        this.options.multiplierB,
        this.options.multiplierC,
        onFrameRendered,
      );

      // Copy result pixel data to tiles to use for mouseEvents.
      activeTiles.forEach((tile, index) => {
        tile.el.pixelData = resultEncodedPixels[index];
      });
    }
  }


  /**
   * Redraw tiles with operations on 4 tileLayers
   */
  protected async _updateTilesWithMultiAnalyze4(
    prevGlOperation: string,
    prevMultiLayers: number,
    prevUrlA: string,
    prevUrlB: string,
    prevUrlC: string,
    prevUrlD: string,
    prevFilterLowA: number,
    prevFilterHighA: number,
    prevFilterLowB: number,
    prevFilterHighB: number,
    prevFilterLowC: number,
    prevFilterHighC: number,
    prevFilterLowD: number,
    prevFilterHighD: number,
    prevMultiplierA: number,
    prevMultiplierB: number,
    prevMultiplierC: number,
    prevMultiplierD: number
  ) {
    if (this.options.debug) console.log("_updateTilesWithMultiAnalyze4()");
    const activeTiles: GridLayerTile[] = this._getActiveTiles();

    if (
      this.options.glOperation === prevGlOperation &&
      this.options.operationUrlA === prevUrlA &&
      this.options.operationUrlB === prevUrlB &&
      this.options.operationUrlC === prevUrlC &&
      this.options.operationUrlD === prevUrlD &&
      this.options.filterLowA === prevFilterLowA &&
      this.options.filterHighA === prevFilterHighA &&
      this.options.filterLowB === prevFilterLowB &&
      this.options.filterHighB === prevFilterHighB &&
      this.options.filterLowC === prevFilterLowC &&
      this.options.filterHighC === prevFilterHighC &&
      this.options.filterLowD === prevFilterLowD &&
      this.options.filterHighD === prevFilterHighD &&
      this.options.multiplierA === prevMultiplierA &&
      this.options.multiplierB === prevMultiplierB &&
      this.options.multiplierC === prevMultiplierC &&
      this.options.multiplierD === prevMultiplierD &&
      this.options.multiLayers === prevMultiLayers
    ) {
      if (this.options.debug) console.log("_updateTilesWithMultiAnalyze4: all same urls. Fetching from existing tiles. Running renderTiles()");
      // Fetch data from the existing tiles.
      const tilesA: TileDatum[] = activeTiles.map(({ coords, el }) => ({
        coords,
        pixelData: el.pixelData as Uint8Array,
      }));

      const canvasCoordinates = this._renderer.renderTiles(
        tilesA,
        this.options._hillshadeOptions,
        this._getZoomForUrl()
      );

      canvasCoordinates.forEach(([sourceX, sourceY], index) => {
        // Copy rendered pixels to the tile canvas.
        const tile = activeTiles[index];
        this._copyToTileCanvas(tile.el, sourceX, sourceY);
      });
    } else {
      let tilesA: TileDatum[] = [];
      let tilesB: TileDatum[] = [];
      let tilesC: TileDatum[] = [];
      let tilesD: TileDatum[] = [];
      // Fetch tilesA data
      if (this.options.operationUrlA !== prevUrlA) {
        tilesA = await this._getTilesData(activeTiles, this.options.operationUrlA);

        // Copy new pixel data to tiles.
        activeTiles.forEach((tile, index) => {
          tile.el.pixelDataA = tilesA[index].pixelData;
        });
      } else {
        // Fetch data from the existing tiles.
        tilesA = activeTiles.map(({ coords, el }) => ({
          coords,
          pixelData: el.pixelDataA as Uint8Array,
        }));
      }

      // Fetch tilesB data
      if (this.options.operationUrlB !== prevUrlB) {
        tilesB = await this._getTilesData(activeTiles, this.options.operationUrlB);

        // Copy new pixel data to tiles.
        activeTiles.forEach((tile, index) => {
          tile.el.pixelDataB = tilesB[index].pixelData;
        });
      } else {
        // Fetch data from the existing tiles.
        tilesB = activeTiles.map(({ coords, el }) => ({
          coords,
          pixelData: el.pixelDataB as Uint8Array,
        }));
      }

      // Fetch tilesC data
      if (this.options.operationUrlC !== prevUrlC) {
        tilesC = await this._getTilesData(activeTiles, this.options.operationUrlC);

        // Copy new pixel data to tiles.
        activeTiles.forEach((tile, index) => {
          tile.el.pixelDataC = tilesC[index].pixelData;
        });
      } else {
        // Fetch data from the existing tiles.
        tilesC = activeTiles.map(({ coords, el }) => ({
          coords,
          pixelData: el.pixelDataC as Uint8Array,
        }));
      }

      // Fetch tilesD data
      if (this.options.operationUrlD !== prevUrlD) {
        tilesD = await this._getTilesData(activeTiles, this.options.operationUrlD);

        // Copy new pixel data to tiles.
        activeTiles.forEach((tile, index) => {
          tile.el.pixelDataD = tilesD[index].pixelData;
        });
      } else {
        // Fetch data from the existing tiles.
        tilesD = activeTiles.map(({ coords, el }) => ({
          coords,
          pixelData: el.pixelDataD as Uint8Array,
        }));
      }
      // This function will be passed to the Renderer, which will call it after rendering a frame
      // in its offscreen <canvas>.
      const onFrameRendered = (canvasCoordinates: Array<Pair<number>>) => {
        canvasCoordinates.forEach(([sourceX, sourceY], index) => {
          // Copy rendered pixels to the tile <canvas>.
          const tile = activeTiles[index];
          this._copyToTileCanvas(tile.el, sourceX, sourceY);
        });
      };

      // Renderer hooks the render calls to requestAnimationFrame, calling `onFrameRendered` after each is drawn.
      // let resultEncodedPixels: Float32Array[] = this._renderer.renderTilesWithMultiAnalyze4(
      const resultEncodedPixels: Uint8Array[] = this._renderer.renderTilesWithMultiAnalyze4(
        tilesA,
        tilesB,
        tilesC,
        tilesD,
        this.options.filterLowA,
        this.options.filterHighA,
        this.options.filterLowB,
        this.options.filterHighB,
        this.options.filterLowC,
        this.options.filterHighC,
        this.options.filterLowD,
        this.options.filterHighD,
        this.options.multiplierA,
        this.options.multiplierB,
        this.options.multiplierC,
        this.options.multiplierD,
        onFrameRendered,
      );

      // Copy result pixel data to tiles to use for mouseEvents.
      activeTiles.forEach((tile, index) => {
        tile.el.pixelData = resultEncodedPixels[index];
      });
    }
  }

  /**
   * Redraw tiles with operations on 5 tileLayers
   */
  protected async _updateTilesWithMultiAnalyze5(
    prevGlOperation: string,
    prevMultiLayers: number,
    prevUrlA: string,
    prevUrlB: string,
    prevUrlC: string,
    prevUrlD: string,
    prevUrlE: string,
    prevFilterLowA: number,
    prevFilterHighA: number,
    prevFilterLowB: number,
    prevFilterHighB: number,
    prevFilterLowC: number,
    prevFilterHighC: number,
    prevFilterLowD: number,
    prevFilterHighD: number,
    prevFilterLowE: number,
    prevFilterHighE: number,
    prevMultiplierA: number,
    prevMultiplierB: number,
    prevMultiplierC: number,
    prevMultiplierD: number,
    prevMultiplierE: number,
  ) {
    if (this.options.debug) console.log("_updateTilesWithMultiAnalyze5()");
    const activeTiles: GridLayerTile[] = this._getActiveTiles();

    if (
      this.options.glOperation === prevGlOperation &&
      this.options.operationUrlA === prevUrlA &&
      this.options.operationUrlB === prevUrlB &&
      this.options.operationUrlC === prevUrlC &&
      this.options.operationUrlD === prevUrlD &&
      this.options.operationUrlE === prevUrlE &&
      this.options.filterLowA === prevFilterLowA &&
      this.options.filterHighA === prevFilterHighA &&
      this.options.filterLowB === prevFilterLowB &&
      this.options.filterHighB === prevFilterHighB &&
      this.options.filterLowC === prevFilterLowC &&
      this.options.filterHighC === prevFilterHighC &&
      this.options.filterLowD === prevFilterLowD &&
      this.options.filterHighD === prevFilterHighD &&
      this.options.filterLowE === prevFilterLowE &&
      this.options.filterHighE === prevFilterHighE &&
      this.options.multiplierA === prevMultiplierA &&
      this.options.multiplierB === prevMultiplierB &&
      this.options.multiplierC === prevMultiplierC &&
      this.options.multiplierD === prevMultiplierD &&
      this.options.multiplierE === prevMultiplierE &&
      this.options.multiLayers === prevMultiLayers
    ) {
      if (this.options.debug) console.log("_updateTilesWithMultiAnalyze5: all same urls. Fetching from existing tiles. Running renderTiles()");
      // Fetch data from the existing tiles.
      const tilesA: TileDatum[] = activeTiles.map(({ coords, el }) => ({
        coords,
        pixelData: el.pixelData as Uint8Array,
      }));

      const canvasCoordinates = this._renderer.renderTiles(
        tilesA,
        this.options._hillshadeOptions,
        this._getZoomForUrl()
      );

      canvasCoordinates.forEach(([sourceX, sourceY], index) => {
        // Copy rendered pixels to the tile canvas.
        const tile = activeTiles[index];
        this._copyToTileCanvas(tile.el, sourceX, sourceY);
      });
    } else {
      let tilesA: TileDatum[] = [];
      let tilesB: TileDatum[] = [];
      let tilesC: TileDatum[] = [];
      let tilesD: TileDatum[] = [];
      let tilesE: TileDatum[] = [];
      // Fetch tilesA data
      if (this.options.operationUrlA !== prevUrlA) {
        tilesA = await this._getTilesData(activeTiles, this.options.operationUrlA);

        // Copy new pixel data to tiles.
        activeTiles.forEach((tile, index) => {
          tile.el.pixelDataA = tilesA[index].pixelData;
        });
      } else {
        // Fetch data from the existing tiles.
        tilesA = activeTiles.map(({ coords, el }) => ({
          coords,
          pixelData: el.pixelDataA as Uint8Array,
        }));
      }

      // Fetch tilesB data
      if (this.options.operationUrlB !== prevUrlB) {
        tilesB = await this._getTilesData(activeTiles, this.options.operationUrlB);

        // Copy new pixel data to tiles.
        activeTiles.forEach((tile, index) => {
          tile.el.pixelDataB = tilesB[index].pixelData;
        });
      } else {
        // Fetch data from the existing tiles.
        tilesB = activeTiles.map(({ coords, el }) => ({
          coords,
          pixelData: el.pixelDataB as Uint8Array,
        }));
      }

      // Fetch tilesC data
      if (this.options.operationUrlC !== prevUrlC) {
        tilesC = await this._getTilesData(activeTiles, this.options.operationUrlC);

        // Copy new pixel data to tiles.
        activeTiles.forEach((tile, index) => {
          tile.el.pixelDataC = tilesC[index].pixelData;
        });
      } else {
        // Fetch data from the existing tiles.
        tilesC = activeTiles.map(({ coords, el }) => ({
          coords,
          pixelData: el.pixelDataC as Uint8Array,
        }));
      }

      // Fetch tilesD data
      if (this.options.operationUrlD !== prevUrlD) {
        tilesD = await this._getTilesData(activeTiles, this.options.operationUrlD);

        // Copy new pixel data to tiles.
        activeTiles.forEach((tile, index) => {
          tile.el.pixelDataD = tilesD[index].pixelData;
        });
      } else {
        // Fetch data from the existing tiles.
        tilesD = activeTiles.map(({ coords, el }) => ({
          coords,
          pixelData: el.pixelDataD as Uint8Array,
        }));
      }

      // Fetch tilesE data
      if (this.options.operationUrlE !== prevUrlE) {
        tilesE = await this._getTilesData(activeTiles, this.options.operationUrlE);

        // Copy new pixel data to tiles.
        activeTiles.forEach((tile, index) => {
          tile.el.pixelDataE = tilesE[index].pixelData;
        });
      } else {
        // Fetch data from the existing tiles.
        tilesE = activeTiles.map(({ coords, el }) => ({
          coords,
          pixelData: el.pixelDataE as Uint8Array,
        }));
      }

      // This function will be passed to the Renderer, which will call it after rendering a frame
      // in its offscreen <canvas>.
      const onFrameRendered = (canvasCoordinates: Array<Pair<number>>) => {
        canvasCoordinates.forEach(([sourceX, sourceY], index) => {
          // Copy rendered pixels to the tile <canvas>.
          const tile = activeTiles[index];
          this._copyToTileCanvas(tile.el, sourceX, sourceY);
        });
      };

      // Renderer hooks the render calls to requestAnimationFrame, calling `onFrameRendered` after each is drawn.
      const resultEncodedPixels: Uint8Array[] = this._renderer.renderTilesWithMultiAnalyze5(
        tilesA,
        tilesB,
        tilesC,
        tilesD,
        tilesE,
        this.options.filterLowA,
        this.options.filterHighA,
        this.options.filterLowB,
        this.options.filterHighB,
        this.options.filterLowC,
        this.options.filterHighC,
        this.options.filterLowD,
        this.options.filterHighD,
        this.options.filterLowE,
        this.options.filterHighE,
        this.options.multiplierA,
        this.options.multiplierB,
        this.options.multiplierC,
        this.options.multiplierD,
        this.options.multiplierE,
        onFrameRendered,
      );

      // Copy result pixel data to tiles to use for mouseEvents.
      activeTiles.forEach((tile, index) => {
        tile.el.pixelData = resultEncodedPixels[index];
      });
    }
  }


  /**
   * Redraw tiles with operations on 6 tileLayers
   */
  protected async _updateTilesWithMultiAnalyze6(
    prevGlOperation: string,
    prevMultiLayers: number,
    prevUrlA: string,
    prevUrlB: string,
    prevUrlC: string,
    prevUrlD: string,
    prevUrlE: string,
    prevUrlF: string,
    prevFilterLowA: number,
    prevFilterHighA: number,
    prevFilterLowB: number,
    prevFilterHighB: number,
    prevFilterLowC: number,
    prevFilterHighC: number,
    prevFilterLowD: number,
    prevFilterHighD: number,
    prevFilterLowE: number,
    prevFilterHighE: number,
    prevFilterLowF: number,
    prevFilterHighF: number,
    prevMultiplierA: number,
    prevMultiplierB: number,
    prevMultiplierC: number,
    prevMultiplierD: number,
    prevMultiplierE: number,
    prevMultiplierF: number,
  ) {
    if (this.options.debug) console.log("_updateTilesWithMultiAnalyze6()");
    const activeTiles: GridLayerTile[] = this._getActiveTiles();

    if (
      this.options.glOperation === prevGlOperation &&
      this.options.operationUrlA === prevUrlA &&
      this.options.operationUrlB === prevUrlB &&
      this.options.operationUrlC === prevUrlC &&
      this.options.operationUrlD === prevUrlD &&
      this.options.operationUrlE === prevUrlE &&
      this.options.operationUrlF === prevUrlF &&
      this.options.filterLowA === prevFilterLowA &&
      this.options.filterHighA === prevFilterHighA &&
      this.options.filterLowB === prevFilterLowB &&
      this.options.filterHighB === prevFilterHighB &&
      this.options.filterLowC === prevFilterLowC &&
      this.options.filterHighC === prevFilterHighC &&
      this.options.filterLowD === prevFilterLowD &&
      this.options.filterHighD === prevFilterHighD &&
      this.options.filterLowE === prevFilterLowE &&
      this.options.filterHighE === prevFilterHighE &&
      this.options.filterLowF === prevFilterLowF &&
      this.options.filterHighF === prevFilterHighF &&
      this.options.multiplierA === prevMultiplierA &&
      this.options.multiplierB === prevMultiplierB &&
      this.options.multiplierC === prevMultiplierC &&
      this.options.multiplierD === prevMultiplierD &&
      this.options.multiplierE === prevMultiplierE &&
      this.options.multiplierF === prevMultiplierF &&
      this.options.multiLayers === prevMultiLayers
    ) {
      if (this.options.debug) console.log("_updateTilesWithMultiAnalyze6: all same urls. Fetching from existing tiles. Running renderTiles()");
      // Fetch data from the existing tiles.
      const tilesA: TileDatum[] = activeTiles.map(({ coords, el }) => ({
        coords,
        pixelData: el.pixelData as Uint8Array,
      }));

      const canvasCoordinates = this._renderer.renderTiles(
        tilesA,
        this.options._hillshadeOptions,
        this._getZoomForUrl()
      );

      canvasCoordinates.forEach(([sourceX, sourceY], index) => {
        // Copy rendered pixels to the tile canvas.
        const tile = activeTiles[index];
        this._copyToTileCanvas(tile.el, sourceX, sourceY);
      });
    } else {
      let tilesA: TileDatum[] = [];
      let tilesB: TileDatum[] = [];
      let tilesC: TileDatum[] = [];
      let tilesD: TileDatum[] = [];
      let tilesE: TileDatum[] = [];
      let tilesF: TileDatum[] = [];

      // Fetch tilesA data
      if (this.options.operationUrlA !== prevUrlA) {
        tilesA = await this._getTilesData(activeTiles, this.options.operationUrlA);

        // Copy new pixel data to tiles.
        activeTiles.forEach((tile, index) => {
          tile.el.pixelDataA = tilesA[index].pixelData;
        });
      } else {
        // Fetch data from the existing tiles.
        tilesA = activeTiles.map(({ coords, el }) => ({
          coords,
          pixelData: el.pixelDataA as Uint8Array,
        }));
      }

      // Fetch tilesB data
      if (this.options.operationUrlB !== prevUrlB) {
        tilesB = await this._getTilesData(activeTiles, this.options.operationUrlB);

        // Copy new pixel data to tiles.
        activeTiles.forEach((tile, index) => {
          tile.el.pixelDataB = tilesB[index].pixelData;
        });
      } else {
        // Fetch data from the existing tiles.
        tilesB = activeTiles.map(({ coords, el }) => ({
          coords,
          pixelData: el.pixelDataB as Uint8Array,
        }));
      }

      // Fetch tilesC data
      if (this.options.operationUrlC !== prevUrlC) {
        tilesC = await this._getTilesData(activeTiles, this.options.operationUrlC);

        // Copy new pixel data to tiles.
        activeTiles.forEach((tile, index) => {
          tile.el.pixelDataC = tilesC[index].pixelData;
        });
      } else {
        // Fetch data from the existing tiles.
        tilesC = activeTiles.map(({ coords, el }) => ({
          coords,
          pixelData: el.pixelDataC as Uint8Array,
        }));
      }

      // Fetch tilesD data
      if (this.options.operationUrlD !== prevUrlD) {
        tilesD = await this._getTilesData(activeTiles, this.options.operationUrlD);

        // Copy new pixel data to tiles.
        activeTiles.forEach((tile, index) => {
          tile.el.pixelDataD = tilesD[index].pixelData;
        });
      } else {
        // Fetch data from the existing tiles.
        tilesD = activeTiles.map(({ coords, el }) => ({
          coords,
          pixelData: el.pixelDataD as Uint8Array,
        }));
      }

      // Fetch tilesE data
      if (this.options.operationUrlE !== prevUrlE) {
        tilesE = await this._getTilesData(activeTiles, this.options.operationUrlE);

        // Copy new pixel data to tiles.
        activeTiles.forEach((tile, index) => {
          tile.el.pixelDataE = tilesE[index].pixelData;
        });
      } else {
        // Fetch data from the existing tiles.
        tilesE = activeTiles.map(({ coords, el }) => ({
          coords,
          pixelData: el.pixelDataE as Uint8Array,
        }));
      }

      // Fetch tilesF data
      if (this.options.operationUrlF !== prevUrlF) {
        tilesF = await this._getTilesData(activeTiles, this.options.operationUrlF);

        // Copy new pixel data to tiles.
        activeTiles.forEach((tile, index) => {
          tile.el.pixelDataF = tilesF[index].pixelData;
        });
      } else {
        // Fetch data from the existing tiles.
        tilesF = activeTiles.map(({ coords, el }) => ({
          coords,
          pixelData: el.pixelDataF as Uint8Array,
        }));
      }

      // This function will be passed to the Renderer, which will call it after rendering a frame
      // in its offscreen <canvas>.
      const onFrameRendered = (canvasCoordinates: Array<Pair<number>>) => {
        canvasCoordinates.forEach(([sourceX, sourceY], index) => {
          // Copy rendered pixels to the tile <canvas>.
          const tile = activeTiles[index];
          this._copyToTileCanvas(tile.el, sourceX, sourceY);
        });
      };

      // Renderer hooks the render calls to requestAnimationFrame, calling `onFrameRendered` after each is drawn.
      const resultEncodedPixels: Uint8Array[] = this._renderer.renderTilesWithMultiAnalyze6(
        tilesA,
        tilesB,
        tilesC,
        tilesD,
        tilesE,
        tilesF,
        this.options.filterLowA,
        this.options.filterHighA,
        this.options.filterLowB,
        this.options.filterHighB,
        this.options.filterLowC,
        this.options.filterHighC,
        this.options.filterLowD,
        this.options.filterHighD,
        this.options.filterLowE,
        this.options.filterHighE,
        this.options.filterLowF,
        this.options.filterHighF,
        this.options.multiplierA,
        this.options.multiplierB,
        this.options.multiplierC,
        this.options.multiplierD,
        this.options.multiplierE,
        this.options.multiplierF,
        onFrameRendered,
      );

      // Copy result pixel data to tiles to use for mouseEvents.
      activeTiles.forEach((tile, index) => {
        tile.el.pixelData = resultEncodedPixels[index];
      });
    }
  }


  /**
   * Preload tiles if it makes sense to do so.
   */
  protected _maybePreload(preloadUrl?: string) {
    if (
      // Preload tiles if a preloadUrl is given and...
      preloadUrl && (
        // either the preload cache is empty
        !this._preloadTileCache
        // or its url is out of date.
        || this._preloadTileCache.url !== preloadUrl
      )
    ) {
      this._preloadTiles(preloadUrl);
    }
  }

  /**
   * Load extra layers if required
   */
  protected async _maybeLoadExtraLayers(prevUrlA: string, prevUrlB: string, prevUrlC: string, prevUrlD: string) {
    let activeTiles: GridLayerTile[] = [];
    if ( this.options.extraPixelLayers >= 1) {
      activeTiles = this._getActiveTiles();

      if (prevUrlA !== this.options.operationUrlA) {
        const tilesA = await this._getTilesData(activeTiles, this.options.operationUrlA);
        // Copy new pixel data to tiles.
        activeTiles.forEach((tile, index) => {
          tile.el.pixelDataA = tilesA[index].pixelData;
        });
      }
    }

    if ( this.options.extraPixelLayers >= 2) {
      if (prevUrlB !== this.options.operationUrlB) {
        const tilesB = await this._getTilesData(activeTiles, this.options.operationUrlB);
        // Copy new pixel data to tiles.
        activeTiles.forEach((tile, index) => {
          tile.el.pixelDataB = tilesB[index].pixelData;
        });
      }
    }

    if ( this.options.extraPixelLayers >= 3) {
      if (prevUrlC !== this.options.operationUrlC) {
        const tilesC = await this._getTilesData(activeTiles, this.options.operationUrlC);
        // Copy new pixel data to tiles.
        activeTiles.forEach((tile, index) => {
          tile.el.pixelDataC = tilesC[index].pixelData;
        });
      }
    }

    if ( this.options.extraPixelLayers >= 4) {
      if (prevUrlD !== this.options.operationUrlD) {
        const tilesD = await this._getTilesData(activeTiles, this.options.operationUrlD);
        // Copy new pixel data to tiles.
        activeTiles.forEach((tile, index) => {
          tile.el.pixelDataD = tilesD[index].pixelData;
        });
      }
    }
  }

  /**
   * Load tiles from the given URL and store them in the preload cache.
   */
  protected async _preloadTiles(url: string) {
    const activeTiles: GridLayerTile[] = this._getActiveTiles();
    const tilesData: TileDatum[] = await this._fetchTilesData(activeTiles, url);
    this._preloadTileCache = {
      url,
      tiles: tilesData,
    };
  }

  /**
   * Use Leaflet.GridLayer's _pruneTiles method to clear out any stale tiles, then return the
   * remaining (active) tiles, sorted by z, x, y.
   */
  protected _getActiveTiles(): GridLayerTile[] {
    if (this.options.debug) console.log("_getActiveTiles()");
    // Remove inactive tiles from the cache.
    this._pruneTiles();
    // Any tiles remaining are active tiles.
    // We sort them by their tile coordinates (by z, then x, then y) to ensure consistent ordering.
    const tiles = util.staticCast<TileCache>(this._tiles);
    return values(tiles).sort((a, b) => util.compareTileCoordinates(a.coords, b.coords));
  }

  /**
   * Retrieve pixel data for the given tiles, either from the preload cache or from the server.
   */
  protected async _getTilesData(tiles: GridLayerTile[], url: string = this.options.url): Promise<TileDatum[]> {
    if (this.options.debug) console.log("_getTilesData() with url: " + url);
    const preloadTileCache: PreloadTileCache | undefined = this._preloadTileCache;
    if (
      preloadTileCache
      && url === preloadTileCache.url
      && util.sameTiles(
        preloadTileCache.tiles.map(({ coords }) => coords),
        tiles.map(({ coords }) => coords),
      )
    ) {
      // Clear the preload cache and return its contents.
      this._preloadTileCache = undefined;
      return Promise.resolve(preloadTileCache.tiles);
    } else {
      return this._fetchTilesData(tiles, url);
    }
  }

  /**
   * Fetch pixel data for the supplied tiles from the supplied URL.
   */
  protected async _fetchTilesData(tiles: GridLayerTile[], url: string): Promise<TileDatum[]> {
    const pixelData = await Promise.all(tiles.map(({ coords }) => this._fetchTileData(coords, url)));

    if (this.options.debug) console.log("_fetchTilesData() with url:" + url);

    // Fire the 'load' event to notify any listeners that the tiles have finished loading.
    this.fire('load', { url });

    return zipWith<GridLayerTile | Uint8Array, TileDatum>(
      tiles,
      pixelData,
      ({ coords }: GridLayerTile, data: Uint8Array) => ({
        coords,
        pixelData: data,
      }),
    );
  }

  /**
   * Fetch pixel data for an individual tile from the given URL.
   */
  protected async _fetchTileData(
    coords: TileCoordinates,
    url: string,
    tileFormat: string = this.options.tileFormat,
  ): Promise<Uint8Array> {
    if (tileFormat === 'float32' || tileFormat === 'image') {
      return util.fetchPNGData(this.getTileUrl(coords, url), this.options.nodataValue, this._tileSizeAsNumber());
    } else if (tileFormat === 'dem') {
      const nodataTile = util.createNoDataTile(this.options.nodataValue, this._tileSizeAsNumber());
      const imageData = await util.fetchPNGData(this.getTileUrl(coords, url), this.options.nodataValue, this._tileSizeAsNumber());
      if (util.typedArraysAreEqual(imageData, nodataTile)) {
        return imageData;
      } else {
        const rgbaData = this._renderer.renderConvertDem(imageData);
        return rgbaData;
      }
    }
    return util.createNoDataTile(this.options.nodataValue, this._tileSizeAsNumber());
  }

  /**
   * L.GridLayer's `tileSize` option can be either a number or a Point object.
   * For this tile layer, we assume tiles will have equal width and height, so to simplify things
   * we normalize `tileSize` as a number.
   */
  protected _tileSizeAsNumber(): number {
    const { tileSize } = this.options;
    return (
      typeof tileSize === 'number'
      ? tileSize
      : (tileSize as L.Point).x
    );
  }

  /**
   * Copy pixels from the Renderer's (offscreen) <canvas> to a tile's (onscreen) canvas.
   */
  protected _copyToTileCanvas(tile: TileElement, sourceX: number, sourceY: number) {
    const tileSize = this._tileSizeAsNumber();
    const tileCanvas2DContext = tile.getContext('2d');
    if (tileCanvas2DContext === null) {
      throw new Error('Tile canvas 2D context is null.');
    }
    // Clear the current contents of the canvas. Otherwise, the new image will be composited with
    // the existing image.
    tileCanvas2DContext.clearRect(0, 0, tileSize, tileSize);
    // Copy the image data from the Renderer's canvas to the tile's canvas.
    tileCanvas2DContext.drawImage(
      this._renderer.canvas,
      sourceX, sourceY, tileSize, tileSize, // source canvas offset (x, y) and size (x, y)
      0, 0, tileSize, tileSize,             // destination canvas offset (x, y) and size (x, y)
    );
  }

  /**
   * Get active tiles boundary information
   */
  protected async _getActivetilesBounds() {
    const activeTiles: GridLayerTile[] = this._getActiveTiles();

    let xMin = activeTiles[0].coords.x;
    let xMax = activeTiles[0].coords.x;
    let yMin = activeTiles[0].coords.y;
    let yMax = activeTiles[0].coords.y;

    activeTiles.forEach((tile) => {
      if (tile.coords.x > xMax) {
        xMax = tile.coords.x;
      }
      if (tile.coords.x < xMin) {
        xMin = tile.coords.x;
      }
      if (tile.coords.y > yMax) {
        yMax = tile.coords.y;
      }
      if (tile.coords.y < yMin) {
        yMin = tile.coords.y;
      }
    });

    const xTiles = xMax - xMin + 1;
    const yTiles = yMax - yMin + 1;

    const activeTilesBounds: ActiveTilesBounds = {
      xMin: xMin,
      xMax: xMax,
      yMin: yMin,
      yMax: yMax,
      xTiles: xTiles,
      yTiles: yTiles
    };

    return activeTilesBounds;
  }

  /**
   * Get pixelData from each tile and merge to a single array
   */
  protected async _mergePixelData(activeTilesBounds: ActiveTilesBounds, tileSize: number) {
    if (this.options.debug) console.log("_mergePixelData()");
    const z = this._tileZoom;
    const canvasMerged = document.createElement("canvas");
    this._contourData.width = activeTilesBounds.xTiles * tileSize;
    this._contourData.height = activeTilesBounds.yTiles * tileSize;
    canvasMerged.width = this._contourData.width;
    canvasMerged.height = this._contourData.height;
    const ctx = canvasMerged.getContext("2d");

    const nodataTile: Uint8Array = util.createNoDataTile(
      this.options.nodataValue,
      tileSize
    );

    // draw pixelData for all active tiles to a single canvas
    for (let i = 0; i <= activeTilesBounds.xTiles; i++) {
      const x = activeTilesBounds.xMin + i;
      for (let j = 0; j <= activeTilesBounds.yTiles; j++) {
        const y = activeTilesBounds.yMin + j;

        let uint8: Uint8Array;
        try {
          const element: TileElement = <TileElement>this._tiles[`${x}:${y}:${z}`].el;
          uint8 = <Uint8Array>element.pixelData;
        } catch(err) {
          uint8 = nodataTile;
        }
        const uac = new Uint8ClampedArray(uint8);
        // TODO: uint8 length = 262400. 4 * tileSize * tileSize = 262144. Why different?
        const uac2 = new Uint8ClampedArray(uac.buffer, 0, 4 * tileSize * tileSize);
        const idata = new ImageData(uac2, tileSize, tileSize);

        ctx!.putImageData(idata, i * tileSize, j * tileSize);
      }
    }

    // extract float values from canvas
    const imageData = ctx!.getImageData(0, 0, activeTilesBounds.xTiles * tileSize, activeTilesBounds.yTiles * tileSize);
    let mergedPixelData = new Float32Array(imageData.data.buffer);

    // replace noDataValues with NaN
    mergedPixelData = mergedPixelData.map(function(item) {
      // TODO: Assuming noDataValue is set to default (-999999). Need to fix.
      if(item < -900000) {
      // if(item === this.options.nodataValue) {
        item = NaN;
      }
      return item;
    }, this);

    const mergedPixelArray: number[] = Array.from(mergedPixelData);

    const arrSum = function(arr: number[]){
      return arr.reduce(function(a,b){
        return (isNaN(a) ? 0 : a) + (isNaN(b) ? 0 : b);
      }, 0);
    };
    if (this.options.debug) {console.log("sum mergedPixelArray"); console.log(arrSum(mergedPixelArray));}

    let contourCanvas: HTMLCanvasElement;
    if (this.options.contourCanvas) {
      contourCanvas = this.options.contourCanvas;
      contourCanvas.width = this._contourData.width;
      contourCanvas.height = this._contourData.height;
    } else {
      console.log("Error: contourCanvas not specified.");
      return;
    }

    this._contourData.mergedTileArray = mergedPixelArray;
    this._contourData.smoothedTileArray = undefined;

    return;
  }

  /**
   * Merge tiles, calculate new contours and draw on seperate canvas
   */
  protected async _maybeUpdateMergedArrayAndDrawContours(): Promise<void> {
    if (this.options.contourType === 'none') return;

    this._map.fire('contourDrawing', {status: true});
    if (this.options.debug) console.log("_maybeUpdateMergedArrayAndDrawContours()");

    await this._clearContours();

    const promise = util.delay(50);
    promise.then(async () => {
      const activeTilesBounds: ActiveTilesBounds = await this._getActivetilesBounds();
      const tileSize = this._tileSizeAsNumber();

      await this._mergePixelData(activeTilesBounds, tileSize);
      if (this.options.contourSmoothInput) {
        this._smoothContourInput();
      }
      await this._calculateAndDrawContours();
      await this._moveContourCanvas(activeTilesBounds);
    });
  }

  /**
   * Calculate new contours and draw on seperate canvas
   */
  protected _smoothContourInput(): void {
    if (this.options.debug) console.log("_smoothContourInput()");
    const valuesNan = <number[]>this._contourData.mergedTileArray;
    const valuesNoNan = valuesNan.map(function(item) {
      // TODO: fix for other noDataValues
      if(isNaN(item)) {
        item = this.options.nodataValue;
      }
      return item;
    }, this);
    const valuesNoNanUint = new Uint8Array(Float32Array.from(valuesNoNan).buffer);

    const resultEncodedPixels = this._renderer.renderConvolutionSmooth(
      valuesNoNanUint,
      <number>this._contourData.width,
      <number>this._contourData.height,
      this.options.contourSmoothInputKernel
    );

    // TODO fix for nodataValue other than default
    // Replace nodata with NaN
    const newArr = [];
    for(let x = 0; x < resultEncodedPixels.length; x += 1) {
      let value = resultEncodedPixels[x];
      if(value === this.options.nodataValue) {
        value = NaN;
      }
      newArr.push(value);
    }
    this._contourData.smoothedTileArray = newArr;
  }

  /**
   * Calculate new contours and draw on seperate canvas
   */
  protected async _calculateAndDrawContours(): Promise<void> {
    if (this.options.contourType === 'none') return;

    this._map.fire('contourDrawing', {status: true});
    if (this.options.debug) console.log("_calculateAndDrawContours()");
    await this._clearContours();
    this._calculateContours();
    setTimeout(() => {
      this._drawContours();
    }, 50);
  }

  /**
   * Add a label to a contour
   */
  protected _addlabel(
      context: CanvasRenderingContext2D,
      label: ContourLabel,
      labelColor: string,
      labelFont: string
    ): void {
    context.save();
    context.translate(label.xy[0], label.xy[1]);
    context.rotate(label.angle + (Math.cos(label.angle) < 0 ? Math.PI : 0));
    context.textAlign = "center";
    context.fillStyle = labelColor;
    context.font = labelFont;
    context.fillText(label.text, -1, 4);
    context.restore();
  }

  /**
   * Calculate contours
   */
  protected _calculateContours(): void {
    if (this.options.debug) console.log("_calculateContours()");

    let values;
    if (this.options.contourSmoothInput) {
      values = <number[]>this._contourData.smoothedTileArray;
    } else {
      values = <number[]>this._contourData.mergedTileArray;
    }

    if (this.options.contourScaleFactor !== 1) {
      values = values.map(x => x * this.options.contourScaleFactor);
    }

    if (this.options.debug) {console.log("valuesArray"); console.log(values);}

    let max = <number>d3.max(values, d => d !== this.options.nodataValue ? d : NaN);
    let min = <number>d3.min(values, d => d !== this.options.nodataValue ? d : NaN);
    max = Math.ceil(max/this.options.contourInterval) * this.options.contourInterval;
    min = Math.floor(min/this.options.contourInterval) * this.options.contourInterval;
    if (this.options.debug) {console.log("Contours: max"); console.log(max);}
    if (this.options.debug) {console.log("Contours: min"); console.log(min);}

    // countour line values
    const thresholds = [];
    for (let i = min; i <= max; i += this.options.contourInterval) {
      thresholds.push(i);
    }
    if (this.options.debug) {console.log("Contour thresholds"); console.log(thresholds);}

    const contour = d3.contours()
      .size([<number>this._contourData.width, <number>this._contourData.height]);

    contour.thresholds(thresholds);
    contour.smooth(this.options.contourSmoothLines);

    const contoursGeoData = contour(values);
    this._contourData.contoursGeoData = contoursGeoData;
    if (this.options.debug) {console.log("contoursGeoData"); console.log(contoursGeoData);}

    return;
  }

  /**
   * Clear contours canvas after turning off contours
   */
  protected async _clearContours() {
    if (this.options.debug) console.log("_clearContours()");

    let contourCanvas: HTMLCanvasElement;
    let contourCtx: CanvasRenderingContext2D;
    if (this.options.contourCanvas) {
      contourCanvas = this.options.contourCanvas;
      contourCtx = <CanvasRenderingContext2D>contourCanvas.getContext('2d');
    } else {
      console.log("Error: contourCanvas not specified.");
      return;
    }

    contourCtx.setTransform(1, 0, 0, 1, 0, 0);
    contourCtx.clearRect(0, 0, <number>this._contourData.width, <number>this._contourData.height);
    contourCtx.beginPath(); // still necessary?
  }

  /**
   * Move contours canvas to fit active tiles
   */
  protected async _moveContourCanvas(activeTilesBounds: ActiveTilesBounds) {
    if (this.options.debug) console.log("_moveContourCanvas()");

    let contourCanvas: HTMLCanvasElement;
    if (this.options.contourCanvas) {
      contourCanvas = this.options.contourCanvas;
    } else {
      console.log("Error: contourCanvas not specified.");
      return;
    }

    let contourPane: HTMLElement;
    if (this.options.contourPane) {
      contourPane = this.options.contourPane;
    } else {
      console.log("Error: contourPane not specified.");
      return;
    }

    const scale = this._map.getZoomScale(this._map.getZoom(), this._level.zoom);
    const pixelOrigin = this._map.getPixelOrigin();
    const transformPane = this._level.origin.multiplyBy(scale)
                        .subtract(pixelOrigin);
    const activeTilesPos = this._getTilePos(this._keyToTileCoords(`${activeTilesBounds.xMin}:${activeTilesBounds.yMin}:${this._level.zoom}`));

    L.DomUtil.setTransform(contourPane, transformPane, scale);
    L.DomUtil.setTransform(contourCanvas, activeTilesPos);
  }

  /**
   * Draw contours on seperate canvas
   */
  protected async _drawContours() {
    if (this.options.debug) console.log("_drawContours()");

    const width = <number>this._contourData.width;
    const height = <number>this._contourData.height;

    let contourCanvas: HTMLCanvasElement;
    let contourCtx: CanvasRenderingContext2D;
    if (this.options.contourCanvas) {
      contourCanvas = this.options.contourCanvas;
      contourCtx = <CanvasRenderingContext2D>contourCanvas.getContext('2d');
    } else {
      console.log("Error: contourCanvas not specified.");
      return;
    }

    const path = d3.geoPath().context(contourCtx);

    const bathyColor = d3.scaleLinear<string>()
      .domain(this.options.contourBathyDomain)
      .range(this.options.contourBathyColors);
      const hypsoColor = d3.scaleLinear<string>()
      .domain(this.options.contourHypsoDomain)
      .range(this.options.contourHypsoColors)
      .interpolate(d3.interpolateHcl);

    const contoursGeoData = <ContourMultiPolygon[]>this._contourData.contoursGeoData;

    const contourIndexInterval = this.options.contourIndexInterval;
    const bathyHigh = this.options.contourBathyDomain[this.options.contourBathyDomain.length - 1];

    contourCtx.clearRect(0, 0, width, height);
    contourCtx.save();

    if (this.options.contourType === 'lines') {
      contourCtx.lineWidth = this.options.contourLineWeight;
      contourCtx.strokeStyle = this.options.contourLineColor;

      if (!this.options.contourHypso && !this.options.contourBathy) {
        contourCtx.beginPath();
        contoursGeoData.forEach(function (c) {
          if (contourIndexInterval === 0 || c.value % contourIndexInterval !== 0) path(c);
        });
        contourCtx.stroke();
      } else {
        contoursGeoData.forEach(function (c) {
          contourCtx.beginPath();
          let fill;
          if (c.value >= bathyHigh || !this.options.contourBathy) {
            if (this.options.contourHypso) fill = hypsoColor(c.value);
          } else {
            if (this.options.contourBathy) fill = bathyColor(c.value);
          }
          path(c);
          if (fill) {
            contourCtx.fillStyle = fill;
            contourCtx.fill();
          }
          contourCtx.stroke();
        }, this);
      }

      // draw thicker index lines, if specified
      if (this.options.contourIndexInterval !== 0) {
        if (!this.options.contourIndexLabels) {
          contourCtx.lineWidth = this.options.contourLineIndexWeight;
          contourCtx.beginPath();
          contoursGeoData.forEach(function (c) {
            if (c.value % contourIndexInterval === 0) path(c);
          });
          contourCtx.stroke();
        } else {
          // calculate label positions and a mask around each
          const labels: ContourLabel[] = [];
          for (const c of contoursGeoData) {
            const threshold = c.value;

            if (c.value % this.options.contourIndexInterval === 0) {
              // TODO: New TS errors occuring. Figure out why
              // Property 'coordinates' does not exist on type 'ContourMultiPolygon'.
              // @ts-ignore
              c.coordinates.forEach(polygon =>
                // @ts-ignore
                polygon.forEach((ring, j) => {
                  const p = ring.slice(1, Infinity);
                  // best number of steps to divide ring.length
                  const possibilities = d3.range(this.options.contourLabelDistance, this.options.contourLabelDistance * 1.4);
                  const scores = possibilities.map(d => -((p.length - 1) % d));
                  const n = possibilities[<number>d3.scan(scores)];
                  // best starting point: bottom for first rings, top for holes
                  const start = 1 + (<number>d3.scan(p.map(xy => (j === 0 ? -1 : 1) * xy[1])) % n);
                  const margin = 10;

                  // @ts-ignore
                  p.forEach((xy, i) => {
                    if (
                      i % n === start &&
                      xy[0] > margin &&
                      xy[0] < width - margin &&
                      xy[1] > margin &&
                      xy[1] < height - margin
                    ) {
                      const a = (i - 2 + p.length) % p.length;
                      const b = (i + 2) % p.length;
                      const dx = p[b][0] - p[a][0];
                      const dy = p[b][1] - p[a][1];
                      if (dx === 0 && dy === 0) return;

                      labels.push({
                        threshold,
                        // @ts-ignore
                        xy: xy.map(d => 1.0 * d),
                        angle: Math.atan2(dy, dx),
                        text: `${c.value}`
                      });
                    }
                  });
                }, this)
              , this);
            }

            // create the mask for this threshold:
            // the full rectangle minus a ring around each label
            contourCtx.save();
            contourCtx.beginPath();
            contourCtx.moveTo(0, 0);
            contourCtx.lineTo(width, 0);
            contourCtx.lineTo(width, height);
            contourCtx.lineTo(0, height);
            contourCtx.lineTo(0, 0);
            for (const label of labels) {
              for (let i = 0; i < 2 * Math.PI; i += 0.2) {
                const pos = [Math.cos(i) * 20, -Math.sin(i) * 10];
                const c = Math.cos(label.angle);
                const s = Math.sin(label.angle);
                  contourCtx[i === 0 ? "moveTo" : "lineTo"](
                  label.xy[0] + pos[0] * c - pos[1] * s,
                  label.xy[1] + pos[1] * c + pos[0] * s
                );
              }
            }
            // contourCtx.stroke(); // uncomment to see the mask
            contourCtx.clip();

            // draw index contour for this threshold
            if (c.value % this.options.contourIndexInterval === 0 ) {
              contourCtx.beginPath();
              contourCtx.strokeStyle = this.options.contourLineColor;
              contourCtx.lineWidth = this.options.contourLineIndexWeight;
              path(c);
              contourCtx.stroke();
            }

            // draw labels for this threshold
            contourCtx.restore();
            for (const label of labels) {
              this._addlabel(
                contourCtx,
                label,
                this.options.contourLineColor,
                this.options.contourLabelFont
              );
            }
          }
        }
      }
    } else if (this.options.contourType === 'illuminated') {
      contourCtx.lineWidth = this.options.contourIlluminatedShadowSize + 1;
      contourCtx.shadowBlur = this.options.contourIlluminatedShadowSize;
      contourCtx.shadowOffsetX = this.options.contourIlluminatedShadowSize;
      contourCtx.shadowOffsetY = this.options.contourIlluminatedShadowSize;

      contoursGeoData.forEach(function (c) {
        contourCtx.beginPath();
        if (c.value >= bathyHigh || !this.options.contourBathy) {
          contourCtx.shadowColor = this.options.contourIlluminatedShadowColor;
          contourCtx.strokeStyle = this.options.contourIlluminatedHighlightColor;
          if (this.options.contourHypso) contourCtx.fillStyle = hypsoColor(c.value);
        } else {
          contourCtx.shadowColor = this.options.contourBathyShadowColor;
          contourCtx.strokeStyle = this.options.contourBathyHighlightColor;
          if (this.options.contourBathy) contourCtx.fillStyle = bathyColor(c.value);
        }
        path(c);  // draw the shape
        // draw the light stroke first, then the fill with drop shadow
        // the effect is a light edge on side and dark on the other, giving the raised/illuminated contour appearance
        contourCtx.stroke();
        if (this.options.contourHypso || this.options.contourBathy) {
          contourCtx.fill();
        }
      }, this);
    }
    contourCtx.restore();
    this._map.fire('contourDrawing', {status: false});
  }

  /**
   * Wraps a handler for a Leaflet MouseEvent, providing an extra property, `pixelValue`, to the
   * event object.
   */
  protected _wrapMouseEventHandler(handler: (event: MouseEvent) => void): (event: L.LeafletMouseEvent) => void {
    return (event) => {
      const { latlng } = event;
      const pixelCoords: L.Point = this._map.project(latlng, this._tileZoom as number).floor();
      // Find the tile containing the point.
      const containingTile: GridLayerTile | undefined = this._getTileContainingPoint(pixelCoords);
      // Find position within tile.
      const coordsInTile: L.Point | undefined = containingTile && this._getCoordsInTile(containingTile, pixelCoords);
      // get byteindex for coordsInTile

      let byteIndex: number | undefined;
      if (coordsInTile !== undefined) {
        byteIndex = (coordsInTile.y * this._tileSizeAsNumber() + coordsInTile.x) * BYTES_PER_WORD;
      }

      const pixelValues: PixelValues = {};
      if (byteIndex === undefined) {
        pixelValues['pixelValue'] = undefined;
      } else {
        // Get pixel value.
        const { pixelData } = containingTile!.el;
        pixelValues['pixelValue'] = coordsInTile && this._getPixelValue(pixelData, byteIndex);
      }

      // Find values from additional layers if specified
      if (byteIndex !== undefined && this.options.extraPixelLayers >= 1) {
        const { pixelDataA } = containingTile!.el;
        pixelValues['pixelValueA'] = coordsInTile && this._getPixelValue(pixelDataA, byteIndex);
      }
      if (byteIndex !== undefined && this.options.extraPixelLayers >= 2) {
        const { pixelDataB } = containingTile!.el;
        pixelValues['pixelValueB'] = coordsInTile && this._getPixelValue(pixelDataB, byteIndex);
      }
      if (byteIndex !== undefined && this.options.extraPixelLayers >= 3) {
        const { pixelDataC } = containingTile!.el;
        pixelValues['pixelValueC'] = coordsInTile && this._getPixelValue(pixelDataC, byteIndex);
      }
      if (byteIndex !== undefined && this.options.extraPixelLayers >= 4) {
        const { pixelDataD } = containingTile!.el;
        pixelValues['pixelValueD'] = coordsInTile && this._getPixelValue(pixelDataD, byteIndex);
      }
      if (byteIndex !== undefined && this.options.extraPixelLayers >= 5) {
        const { pixelDataE } = containingTile!.el;
        pixelValues['pixelValueE'] = coordsInTile && this._getPixelValue(pixelDataE, byteIndex);
      }
      if (byteIndex !== undefined && this.options.extraPixelLayers >= 6) {
        const { pixelDataF } = containingTile!.el;
        pixelValues['pixelValueF'] = coordsInTile && this._getPixelValue(pixelDataF, byteIndex);
      }

      // Call handler with pixel values.
      handler({ ...event, pixelValues });
    };
  }

  /**
   * Get the tile containing the given point (in pixel coordinates) or `undefined` if no tile
   * contains the point.
   */
  protected _getTileContainingPoint(point: L.Point): GridLayerTile | undefined {
    const tiles = util.staticCast<TileCache>(this._tiles);
    return values(tiles).find(tile => {
      return tile.coords.z === this._tileZoom && this._tileBounds(tile).contains(point);
    });
  }

  /**
   * Compute the bounds (in projected pixel coordinates) of the given tile.
   */
  protected _tileBounds(tile: GridLayerTile) {
    const { x, y } = tile.coords;
    const tileSize = this._tileSizeAsNumber();
    const topLeft = L.point(x * tileSize, y * tileSize);
    const bottomRight = L.point(
      topLeft.x + (tileSize - 1),
      topLeft.y + (tileSize - 1),
    );
    return L.bounds(topLeft, bottomRight);
  }

  /**
   * Convert absolute pixel coordinates to pixel coordinates relative to a given tile's upper left
   * corner.
   */
  protected _getCoordsInTile(tile: GridLayerTile, pixelCoords: L.Point): L.Point {
    const { x: tileX, y: tileY } = tile.coords;
    const tileSize = this._tileSizeAsNumber();
    return L.point(
      pixelCoords.x - (tileX * tileSize),
      pixelCoords.y - (tileY * tileSize),
    );
  }

  /**
   * Get the floating-point value of the pixel at the given coordinates in the given tile.
   * Returns `undefined` if the value is equal to `nodataValue`.
   * If the value matches a sentinel value, returns the corresponding `SentinelValue` object.
   */
  protected _getPixelValue(pixelData: Uint8Array | Float32Array | undefined, byteIndex: number): number | SentinelValue | undefined {
    if (!pixelData) {
      return undefined;
    }
    const {
      nodataValue,
      sentinelValues,
    } = this.options;

    const tileDataView = new DataView(pixelData.buffer);
    // To find the byte index:
    // (1) get the index of the start of the row in which the pixel is located
    // (2) add to that the column index
    // (3) multiply by the number of bytes used for each pixel

    // use the byte index and the machine's endianness to obtain the pixel value
    const pixelValue = tileDataView.getFloat32(byteIndex, littleEndian);
    // Check for nodata value.
    if (pixelValue === nodataValue) {
      return undefined;
    }
    // Check for sentinel value.
    const sentinel = sentinelValues && sentinelValues.find(({ offset }) => offset === pixelValue);
    // If pixelValue matches no sentinel, just return pixelValue.
    return sentinel || pixelValue;
  }

  /**
   * Calculate how many map units one pixel represents. Used for hillshading.
   */
  protected _getPixelScale(): number {
    let pixelScale = 1;
    const zoom = this._getZoomForUrl();
    if (this.options.hsPixelScale === 'auto') {
      pixelScale = EARTH_CIRCUMFERENCE * Math.abs(
          Math.cos(this._map.getCenter().lat / 180 * Math.PI
        )) / Math.pow(2, zoom + 8);
    } else if (typeof this.options.hsPixelScale === 'number') {
      pixelScale = this.options.hsPixelScale as unknown as number
                    / (this._tileSizeAsNumber() * (2**zoom));
    }
    return pixelScale;
  }
}
