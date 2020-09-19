import REGL from 'regl';
import { TextureCoordinates, TileCoordinates } from './types';
export default class TextureManager {
    readonly tileSize: number;
    readonly tilesAcross: number;
    readonly pixelsAcross: number;
    readonly tileCapacity: number;
    readonly texture: REGL.Texture2D;
    contents: Map<string, TextureCoordinates>;
    protected available: TextureCoordinates[];
    constructor(regl: REGL.Regl, tileSize: number | undefined, maxTextureDimension: number, flipY?: boolean, textureFormat?: REGL.TextureFormatType, textureType?: REGL.TextureDataType);
    addTile(tileCoordinates: TileCoordinates, data: ArrayBufferView): [TextureCoordinates, TextureCoordinates];
    removeTile(tileCoordinates: TileCoordinates): void;
    clearTiles(): void;
    destroy(): void;
    protected removeByHashKey(hashKey: string): void;
    protected formatOutputTextureCoordinates(textureCoordinates: TextureCoordinates): [TextureCoordinates, TextureCoordinates];
    hashTileCoordinates({ x, y, z }: TileCoordinates): string;
    getTextureCoordinates(tileCoordinates: TileCoordinates): [TextureCoordinates, TextureCoordinates];
    protected allTextureCoordinates(tilesAcross: number, tileSize: number): TextureCoordinates[];
}
