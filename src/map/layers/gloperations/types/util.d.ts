import REGL from 'regl';
import { Color, SentinelValue, TextureBounds, TileCoordinates } from './types';
export declare function machineIsLittleEndian(): boolean;
export declare function range(...args: number[]): number[];
export declare function fetchPNGData(url: string, nodataValue: number, tileDimension: number): Promise<Uint8Array>;
export declare function getTransformMatrix(drawingBufferWidth: number, drawingBufferHeight: number): REGL.Mat4;
export declare function getTexCoordVertices(textureBounds: TextureBounds): REGL.Vec2[];
export declare function Timer(duration: number): Promise<void>;
export declare function compareTileCoordinates(a: TileCoordinates, b: TileCoordinates): number;
export declare function sameTiles(a: TileCoordinates[], b: TileCoordinates[]): boolean;
export declare const createNoDataTile: any;
export declare function staticCast<T>(val: any): T;
export declare function defineMacros(src: string, macros: {
    [key: string]: any;
}): string;
export declare function PingPong(regl: REGL.Regl, opts: REGL.FramebufferOptions): {
    ping: () => REGL.Framebuffer2D;
    pong: () => REGL.Framebuffer2D;
    swap: () => void;
};
export declare const hexToRGB: (hex: string) => number[];
export declare function colorStringToInts(colorstring: string): number[];
export declare const colormapToFlatArray: (colormap: Color[]) => number[];
export declare function createColormapTexture(colormapInput: Color[] | SentinelValue[], regl: REGL.Regl): REGL.Texture2D;
