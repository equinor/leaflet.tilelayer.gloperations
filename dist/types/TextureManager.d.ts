import REGL from 'regl';
import { TextureCoordinates, TileCoordinates } from './types';
export default class TextureManager {
    readonly tileSize: number;
    readonly tilesAcross: number;
    readonly pixelsAcross: number;
    readonly tileCapacity: number;
    readonly texture: REGL.Texture2D;
    protected contents: Map<string, TextureCoordinates>;
    protected available: TextureCoordinates[];
    constructor(regl: REGL.Regl, tileSize: number, maxTextureDimension: number, flipY: boolean);
    addTile(tileCoordinates: TileCoordinates, data: ArrayBufferView): [TextureCoordinates, TextureCoordinates];
    removeTile(tileCoordinates: TileCoordinates): void;
    clearTiles(): void;
    destroy(): void;
    protected removeByHashKey(hashKey: string): void;
    protected formatOutputTextureCoordinates(textureCoordinates: TextureCoordinates): [TextureCoordinates, TextureCoordinates];
    protected hashTileCoordinates({ x, y, z }: TileCoordinates): string;
    protected allTextureCoordinates(tilesAcross: number, tileSize: number): TextureCoordinates[];
}
