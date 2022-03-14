import * as L from 'leaflet';
import './index.css';
import Renderer from './Renderer';
import { GridLayerTile, PreloadTileCache, TileCoordinates, TileDatum, TileElement, TileEvent, PixelValues, HillshadeOptions, ActiveTilesBounds, Color, SentinelValue, ContourLabel, ContourData, Dictionary } from './types';
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
export interface MouseEvent extends L.LeafletMouseEvent {
    pixelValues?: PixelValues;
}
export interface Options extends L.GridLayerOptions {
    url: string;
    tileFormat: string;
    nodataValue: number;
    colorScale?: Color[];
    sentinelValues?: SentinelValue[];
    extraPixelLayers?: number;
    colorscaleMaxLength?: number;
    sentinelMaxLength?: number;
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
    hillshadeType: string;
    hsAdvValueScale?: number | Dictionary<number>;
    hsSimpleZoomdelta?: number;
    hsSimpleSlopescale?: number;
    hsSimpleAzimuth?: number;
    hsSimpleAltitude?: number;
    hsAdvPixelScale?: number | string;
    hsAdvSoftIterations?: number;
    hsAdvAmbientIterations?: number;
    hsAdvSunRadiusMultiplier?: number;
    hsAdvFinalSoftMultiplier?: number;
    hsAdvFinalAmbientMultiplier?: number;
    hsAdvBaselayerUrl?: string;
    hsAdvSmoothInput: boolean;
    hsAdvSmoothInputKernel: number;
    hsPregenUrl?: string;
    _hillshadeOptions?: HillshadeOptions;
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
    contourLineWeight: number;
    contourLineIndexWeight: number;
    contourIndexLabels: boolean;
    contourLabelFont: string;
    contourLabelDistance: number;
    contourIlluminatedHighlightColor: string;
    contourIlluminatedShadowColor: string;
    contourIlluminatedShadowSize: number;
    contourHypso: boolean;
    contourHypsoDomain: number[];
    contourHypsoColors: string[];
    contourBathy: boolean;
    contourBathyDomain: number[];
    contourBathyColors: string[];
    contourBathyShadowColor: string[];
    contourBathyHighlightColor: string[];
    onload?: (event: {
        url: string;
    }) => void;
    onclick?: (event: MouseEvent) => void;
    ondblclick?: (event: MouseEvent) => void;
    onmousedown?: (event: MouseEvent) => void;
    onmouseup?: (event: MouseEvent) => void;
    onmouseover?: (event: MouseEvent) => void;
    onmouseout?: (event: MouseEvent) => void;
    onmousemove?: (event: MouseEvent) => void;
    oncontextmenu?: (event: MouseEvent) => void;
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
declare const defaultOptions: {
    tileFormat: string;
    colorScale: never[];
    sentinelValues: never[];
    transitions: boolean;
    transitionTimeMs: number;
    debug: boolean;
    extraPixelLayers: number;
    colorscaleMaxLength: number;
    sentinelMaxLength: number;
    minZoom: number;
    maxZoom: number;
    subdomains: string;
    errorTileUrl: string;
    zoomOffset: number;
    tms: boolean;
    zoomReverse: boolean;
    detectRetina: boolean;
    crossOrigin: boolean;
    glOperation: string;
    multiLayers: number;
    operationUrlA: string;
    operationUrlB: string;
    operationUrlC: string;
    operationUrlD: string;
    operationUrlE: string;
    operationUrlF: string;
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
    hillshadeType: string;
    hsSimpleZoomdelta: number;
    hsSimpleSlopescale: number;
    hsSimpleAzimuth: number;
    hsSimpleAltitude: number;
    hsAdvValueScale: number;
    hsAdvPixelScale: string;
    hsAdvSoftIterations: number;
    hsAdvAmbientIterations: number;
    hsAdvSunRadiusMultiplier: number;
    hsAdvFinalSoftMultiplier: number;
    hsAdvFinalAmbientMultiplier: number;
    hsAdvBaselayerUrl: string;
    hsAdvSmoothInput: boolean;
    hsAdvSmoothInputKernel: number;
    hsPregenUrl: string;
    _hillshadeOptions: {
        hillshadeType: string;
    };
    contourType: string;
    contourSmoothLines: boolean;
    contourSmoothInput: boolean;
    contourSmoothInputKernel: number;
    contourScaleFactor: number;
    contourInterval: number;
    contourIndexInterval: number;
    contourLineColor: string;
    contourIlluminatedHighlightColor: string;
    contourIlluminatedShadowColor: string;
    contourIlluminatedShadowSize: number;
    contourLineWeight: number;
    contourLineIndexWeight: number;
    contourIndexLabels: boolean;
    contourLabelFont: string;
    contourLabelDistance: number;
    contourHypso: boolean;
    contourHypsoDomain: number[];
    contourHypsoColors: string[];
    contourBathy: boolean;
    contourBathyDomain: number[];
    contourBathyColors: string[];
    contourBathyShadowColor: string;
    contourBathyHighlightColor: string;
};
export declare type InternalOptions = Options & typeof defaultOptions;
export default class GLOperations extends L.GridLayer {
    static readonly defaultOptions: {
        tileFormat: string;
        colorScale: never[];
        sentinelValues: never[];
        transitions: boolean;
        transitionTimeMs: number;
        debug: boolean;
        extraPixelLayers: number;
        colorscaleMaxLength: number;
        sentinelMaxLength: number;
        minZoom: number;
        maxZoom: number;
        subdomains: string;
        errorTileUrl: string;
        zoomOffset: number;
        tms: boolean;
        zoomReverse: boolean;
        detectRetina: boolean;
        crossOrigin: boolean;
        glOperation: string;
        multiLayers: number;
        operationUrlA: string;
        operationUrlB: string;
        operationUrlC: string;
        operationUrlD: string;
        operationUrlE: string;
        operationUrlF: string;
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
        hillshadeType: string;
        hsSimpleZoomdelta: number;
        hsSimpleSlopescale: number;
        hsSimpleAzimuth: number;
        hsSimpleAltitude: number;
        hsAdvValueScale: number;
        hsAdvPixelScale: string;
        hsAdvSoftIterations: number;
        hsAdvAmbientIterations: number;
        hsAdvSunRadiusMultiplier: number;
        hsAdvFinalSoftMultiplier: number;
        hsAdvFinalAmbientMultiplier: number;
        hsAdvBaselayerUrl: string;
        hsAdvSmoothInput: boolean;
        hsAdvSmoothInputKernel: number;
        hsPregenUrl: string;
        _hillshadeOptions: {
            hillshadeType: string;
        };
        contourType: string;
        contourSmoothLines: boolean;
        contourSmoothInput: boolean;
        contourSmoothInputKernel: number;
        contourScaleFactor: number;
        contourInterval: number;
        contourIndexInterval: number;
        contourLineColor: string;
        contourIlluminatedHighlightColor: string;
        contourIlluminatedShadowColor: string;
        contourIlluminatedShadowSize: number;
        contourLineWeight: number;
        contourLineIndexWeight: number;
        contourIndexLabels: boolean;
        contourLabelFont: string;
        contourLabelDistance: number;
        contourHypso: boolean;
        contourHypsoDomain: number[];
        contourHypsoColors: string[];
        contourBathy: boolean;
        contourBathyDomain: number[];
        contourBathyColors: string[];
        contourBathyShadowColor: string;
        contourBathyHighlightColor: string;
    };
    options: InternalOptions;
    protected _map: L.Map;
    protected _renderer: Renderer;
    protected _preloadTileCache?: PreloadTileCache;
    protected _tiles: L.InternalTiles;
    protected _contourData: ContourData;
    constructor(options: Options);
    updateOptions(options: Partial<Options>): void;
    getEvents(): any;
    getTileUrl(coords: TileCoordinates, url: string): string;
    redraw(): this;
    createTile(coords: TileCoordinates, done: L.DoneCallback): TileElement;
    protected _checkColorScaleAndSentinels(): void;
    protected _getSubdomain(tilePoint: TileCoordinates): string;
    protected _getZoomForUrl(): number;
    protected _onTileRemove({ coords, tile }: TileEvent): void;
    protected _updateTiles(): Promise<void>;
    protected _updateTilesColorscaleOnly(): Promise<void>;
    protected _updateTilesWithTransitions(prevColorScale: Color[], prevSentinelValues: SentinelValue[]): Promise<void>;
    protected _updateColorscaleWithTransitions(prevColorScale: Color[], prevSentinelValues: SentinelValue[]): Promise<void>;
    protected _updateTilesWithDiff(prevGlOperation: string, prevUrlA: string, prevUrlB: string): Promise<void>;
    protected _updateTilesWithMultiAnalyze1(prevGlOperation: string, prevMultiLayers: number, prevUrlA: string, prevFilterLowA: number, prevFilterHighA: number, prevMultiplierA: number): Promise<void>;
    protected _updateTilesWithMultiAnalyze2(prevGlOperation: string, prevMultiLayers: number, prevUrlA: string, prevUrlB: string, prevFilterLowA: number, prevFilterHighA: number, prevFilterLowB: number, prevFilterHighB: number, prevMultiplierA: number, prevMultiplierB: number): Promise<void>;
    protected _updateTilesWithMultiAnalyze3(prevGlOperation: string, prevMultiLayers: number, prevUrlA: string, prevUrlB: string, prevUrlC: string, prevFilterLowA: number, prevFilterHighA: number, prevFilterLowB: number, prevFilterHighB: number, prevFilterLowC: number, prevFilterHighC: number, prevMultiplierA: number, prevMultiplierB: number, prevMultiplierC: number): Promise<void>;
    protected _updateTilesWithMultiAnalyze4(prevGlOperation: string, prevMultiLayers: number, prevUrlA: string, prevUrlB: string, prevUrlC: string, prevUrlD: string, prevFilterLowA: number, prevFilterHighA: number, prevFilterLowB: number, prevFilterHighB: number, prevFilterLowC: number, prevFilterHighC: number, prevFilterLowD: number, prevFilterHighD: number, prevMultiplierA: number, prevMultiplierB: number, prevMultiplierC: number, prevMultiplierD: number): Promise<void>;
    protected _updateTilesWithMultiAnalyze5(prevGlOperation: string, prevMultiLayers: number, prevUrlA: string, prevUrlB: string, prevUrlC: string, prevUrlD: string, prevUrlE: string, prevFilterLowA: number, prevFilterHighA: number, prevFilterLowB: number, prevFilterHighB: number, prevFilterLowC: number, prevFilterHighC: number, prevFilterLowD: number, prevFilterHighD: number, prevFilterLowE: number, prevFilterHighE: number, prevMultiplierA: number, prevMultiplierB: number, prevMultiplierC: number, prevMultiplierD: number, prevMultiplierE: number): Promise<void>;
    protected _updateTilesWithMultiAnalyze6(prevGlOperation: string, prevMultiLayers: number, prevUrlA: string, prevUrlB: string, prevUrlC: string, prevUrlD: string, prevUrlE: string, prevUrlF: string, prevFilterLowA: number, prevFilterHighA: number, prevFilterLowB: number, prevFilterHighB: number, prevFilterLowC: number, prevFilterHighC: number, prevFilterLowD: number, prevFilterHighD: number, prevFilterLowE: number, prevFilterHighE: number, prevFilterLowF: number, prevFilterHighF: number, prevMultiplierA: number, prevMultiplierB: number, prevMultiplierC: number, prevMultiplierD: number, prevMultiplierE: number, prevMultiplierF: number): Promise<void>;
    protected _maybePreload(preloadUrl?: string): void;
    protected _maybeLoadExtraLayers(prevUrlA: string, prevUrlB: string, prevUrlC: string, prevUrlD: string): Promise<void>;
    protected _preloadTiles(url: string): Promise<void>;
    protected _getActiveTiles(): GridLayerTile[];
    protected _getTilesData(tiles: GridLayerTile[], url?: string): Promise<TileDatum[]>;
    protected _fetchTilesData(tiles: GridLayerTile[], url: string): Promise<TileDatum[]>;
    protected _fetchTileData(coords: TileCoordinates, url: string, tileFormat?: string): Promise<Uint8Array>;
    protected _tileSizeAsNumber(): number;
    protected _copyToTileCanvas(tile: TileElement, sourceX: number, sourceY: number): void;
    protected _getActivetilesBounds(): Promise<ActiveTilesBounds>;
    protected setHillshadeOptions(): void;
    protected _mergePixelData(activeTilesBounds: ActiveTilesBounds, tileSize: number): Promise<void>;
    protected _maybeUpdateMergedArrayAndDrawContours(): Promise<void>;
    protected _smoothContourInput(): void;
    protected _calculateAndDrawContours(): Promise<void>;
    protected _addlabel(context: CanvasRenderingContext2D, label: ContourLabel, labelColor: string, labelFont: string): void;
    protected _calculateContours(): void;
    protected _clearContours(): Promise<void>;
    protected _moveContourCanvas(activeTilesBounds: ActiveTilesBounds): Promise<void>;
    protected _drawContours(): Promise<void>;
    protected _wrapMouseEventHandler(handler: (event: MouseEvent) => void): (event: L.LeafletMouseEvent) => void;
    protected _getTileContainingPoint(point: L.Point): GridLayerTile | undefined;
    protected _tileBounds(tile: GridLayerTile): L.Bounds;
    protected _getCoordsInTile(tile: GridLayerTile, pixelCoords: L.Point): L.Point;
    protected _getPixelValue(pixelData: Uint8Array | Float32Array | undefined, byteIndex: number): number | SentinelValue | undefined;
    protected _getPixelScale(): number;
}
export {};
