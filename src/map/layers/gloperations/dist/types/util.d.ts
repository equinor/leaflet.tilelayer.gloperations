import REGL from 'regl';
import { Color, Dictionary, TextureBounds, TileCoordinates, WebGLColorStop } from './types';
export declare function convertColorScale(colorScale: Color[]): WebGLColorStop[];
export declare function colorStringToWebGLFloats(rgb: string): REGL.Vec4;
export declare function bindStructArray<Struct extends Dictionary<any>, Props extends Dictionary<any[]> = {}>(structPropertyNames: Array<keyof Struct>, defaultValue: Struct, maxArrayLength: number, glslIdentifier: string, propName?: keyof Props): Dictionary<any>;
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
