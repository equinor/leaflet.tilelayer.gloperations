import {
  flatMap,
  isEmpty,
} from 'lodash-es';
import REGL from 'regl';

import {
  TextureCoordinates,
  TileCoordinates,
} from './types';
import * as util from './util';

export default class TextureManager {
  // width/height of a tile in pixels
  readonly tileSize: number;
  // dimension of the texture in number of tiles
  readonly tilesAcross: number;
  // dimension of the texture in number of pixels
  readonly pixelsAcross: number;
  // number of tiles that will fit in the texture
  readonly tileCapacity: number;
  // the Regl Texture2D object
  readonly texture: REGL.Texture2D;

  // map of tile coordinates to texture coordinates
  // (key is hash string of tile coordinates: 'x:y:z')
  protected contents: Map<string, TextureCoordinates>;
  // texture coordinates positions that are currently available
  protected available: TextureCoordinates[];

  constructor(
    regl: REGL.Regl,
    tileSize: number,
    maxTextureDimension: number,
    flipY: boolean,
  ) {
    const tilesAcross = Math.floor(maxTextureDimension / tileSize);
    const pixelsAcross = tilesAcross * tileSize;
    const tileCapacity = tilesAcross * tilesAcross;

    const texture = regl.texture({
      width: pixelsAcross,
      height: pixelsAcross,
      flipY: flipY,
      format: 'rgba',
      type: 'uint8',
    });

    const contents = new Map<string, TextureCoordinates>();
    const available = this.allTextureCoordinates(tilesAcross, tileSize);

    Object.assign(this, {
      tileSize,
      tilesAcross,
      pixelsAcross,
      tileCapacity,
      texture,
      contents,
      available,
    });
  }

  addTile(
    tileCoordinates: TileCoordinates,
    data: ArrayBufferView,
  ): [TextureCoordinates, TextureCoordinates] {
    const {
      available,
      contents,
      texture,
      tileSize,
    } = this;

    const hashKey = this.hashTileCoordinates(tileCoordinates);
    if (contents.has(hashKey)) {
      const textureCoordinates = contents.get(hashKey) as TextureCoordinates;
      // We use a least-recently-used eviction policy for the tile cache. Map iterators are
      // convenient for this, because they return entries in insertion order. But for this to work
      // as expected, every time we access a tile, we need to reinsert it so that it moves to the
      // end of that insertion-order list.
      contents.delete(hashKey);
      contents.set(hashKey, textureCoordinates);
      return this.formatOutputTextureCoordinates(textureCoordinates);
    }
    if (isEmpty(available)) {
      // Get the first key inserted. Map.prototype.keys() produces an iterable iterator over the keys
      // in the order of insertion, so we can just use the iterator's first value.
      const firstInsertedKey = contents.keys().next().value;
      this.removeByHashKey(firstInsertedKey);
    }
    // remove from list of available positions
    const textureCoordinates = available.pop() as TextureCoordinates;
    // store mapping of tile to texture coordinates
    contents.set(hashKey, textureCoordinates);

    const { x: textureX, y: textureY } = textureCoordinates;
    texture.subimage({
      data,
      width: tileSize,
      height: tileSize,
    }, textureX, textureY);

    return this.formatOutputTextureCoordinates(textureCoordinates);
  }

  removeTile(tileCoordinates: TileCoordinates) {
    this.removeByHashKey(this.hashTileCoordinates(tileCoordinates));
  }

  clearTiles() {
    for (const hashKey of Array.from(this.contents.keys())) {
      this.removeByHashKey(hashKey);
    }
  }

  destroy() {
    this.texture.destroy();
  }

  protected removeByHashKey(hashKey: string) {
    // This method only removes the key. The pixel data remains in the texture.
    if (this.contents.has(hashKey)) {
      const textureCoordinates = this.contents.get(hashKey) as TextureCoordinates;
      this.contents.delete(hashKey);
      this.available.push(textureCoordinates);
    }
  }

  protected formatOutputTextureCoordinates(
    textureCoordinates: TextureCoordinates,
  ): [TextureCoordinates, TextureCoordinates] {
    const { x, y } = textureCoordinates;
    const { pixelsAcross, tileSize } = this;
    return [
      {
        x: x / pixelsAcross,
        y: y / pixelsAcross,
      },
      {
        x: (x + tileSize) / pixelsAcross,
        y: (y + tileSize) / pixelsAcross,
      },
    ];
  }

  protected hashTileCoordinates({ x, y, z }: TileCoordinates): string {
    return `${x}:${y}:${z}`;
  }

  protected allTextureCoordinates(tilesAcross: number, tileSize: number): TextureCoordinates[] {
    return flatMap(util.range(tilesAcross), x =>
      util.range(tilesAcross).map(y => ({
        x: x * tileSize,
        y: y * tileSize,
      })),
    );
  }
}
