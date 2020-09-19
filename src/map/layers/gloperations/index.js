'use strict';

var L = require('leaflet');
var lodashEs = require('lodash-es');
var d3Contour = require('d3-contour');
var upngJs = require('upng-js');
var d3Selection = require('d3-selection');
var d3Scale = require('d3-scale');
var d3Geo = require('d3-geo');
var d3Request = require('d3-request');
var d3Array = require('d3-array');
var d3Interpolate = require('d3-interpolate');
var REGL = require('regl');
var glMatrix = require('gl-matrix');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var REGL__default = /*#__PURE__*/_interopDefaultLegacy(REGL);

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var CLEAR_COLOR = [0, 0, 0, 0];
var MAX_TEXTURE_DIMENSION = 1024;
var EARTH_SUN_DISTANCE = 149600000000;
var EARTH_CIRCUMFERENCE = 40075016.686;
var SUN_RADIUS = 695508000;
var DEG2RAD = 0.017453292519943295;
var SLOPEFACTOR = 0.0333334;
var RGB_REGEX = /^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/;
var HEX_REGEX = /(?:#)[0-9a-f]{8}|(?:#)[0-9a-f]{6}|(?:#)[0-9a-f]{4}|(?:#)[0-9a-f]{3}/ig;

function machineIsLittleEndian() {
    var uint8Array = new Uint8Array([0xAA, 0xBB]);
    var uint16array = new Uint16Array(uint8Array.buffer);
    return uint16array[0] === 0xBBAA;
}
function range() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (args.length === 1) {
        var until = args[0];
        return new Array(until).fill(undefined).map(function (_, i) { return i; });
    }
    else {
        var from = args[0], until = args[1], _a = args[2], step = _a === void 0 ? 1 : _a;
        if (step === 0) {
            throw new Error('Argument step must be nonzero.');
        }
        var output = [];
        for (var val = from; (step > 0) ? val < until : val > until; val += step) {
            output.push(val);
        }
        return output;
    }
}
function fetchPNGData(url, nodataValue, tileDimension) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2, new Promise(function (resolve, reject) {
                    var xhr = new XMLHttpRequest();
                    xhr.open("GET", url, true);
                    xhr.responseType = "arraybuffer";
                    xhr.addEventListener('load', function () {
                        resolve(xhr.response);
                    });
                    xhr.addEventListener('error', reject);
                    xhr.send(null);
                }).then(function (data) {
                    var img = upngJs.decode(data);
                    var rgba = upngJs.toRGBA8(img)[0];
                    return new Uint8Array(rgba);
                }).catch(function () { return createNoDataTile(nodataValue, tileDimension); })];
        });
    });
}
function typedArraysAreEqual(a, b) {
    if (a.byteLength !== b.byteLength)
        return false;
    return a.every(function (val, i) { return val === b[i]; });
}
function getTransformMatrix(drawingBufferWidth, drawingBufferHeight) {
    var sx = 2 / drawingBufferWidth;
    var sy = -2 / drawingBufferHeight;
    var tx = -1;
    var ty = 1;
    return [
        sx, 0, 0, 0,
        0, sy, 0, 0,
        0, 0, 1, 0,
        tx, ty, 0, 1,
    ];
}
function getTexCoordVerticesTriangleStripQuad(textureBounds) {
    var _a = textureBounds[0], left = _a.x, top = _a.y, _b = textureBounds[1], right = _b.x, bottom = _b.y;
    return [
        [left, top],
        [right, top],
        [left, bottom],
        [right, bottom],
    ];
}
function getTexCoordVerticesTriangleQuad(textureBounds) {
    var _a = textureBounds[0], left = _a.x, top = _a.y, _b = textureBounds[1], right = _b.x, bottom = _b.y;
    return [
        [left, top],
        [right, top],
        [left, bottom],
        [right, bottom],
        [right, top],
        [left, bottom],
    ];
}
function Timer(duration) {
    return new Promise(function (resolve) { return setTimeout(resolve, duration); });
}
function compareTileCoordinates(a, b) {
    var z = a.z - b.z;
    var x = a.x - b.x;
    var y = a.y - b.y;
    if (z !== 0) {
        return z;
    }
    else if (x !== 0) {
        return x;
    }
    else {
        return y;
    }
}
function sameTiles(a, b) {
    return (a.length === b.length
        && a.every(function (tileA, index) { return compareTileCoordinates(tileA, b[index]) === 0; }));
}
var createNoDataTile = lodashEs.memoize(function (nodataValue, tileDimension) {
    if (tileDimension === void 0) { tileDimension = 256; }
    var float32Tile = new Float32Array(tileDimension * tileDimension);
    float32Tile.fill(nodataValue);
    return new Uint8Array(float32Tile.buffer);
});
function staticCast(val) {
    return val;
}
function defineMacros(src, macros) {
    var defs = Object.keys(macros).map(function (key) { return "#define " + key + " " + macros[key] + "\n"; }).join('');
    return defs + "\n" + src;
}
function PingPong(regl, opts) {
    var fbos = [regl.framebuffer(opts), regl.framebuffer(opts)];
    var index = 0;
    function ping() {
        return fbos[index];
    }
    function pong() {
        return fbos[1 - index];
    }
    function swap() {
        index = 1 - index;
    }
    function destroy() {
        fbos[0].destroy();
        fbos[1].destroy();
    }
    return {
        ping: ping,
        pong: pong,
        swap: swap,
        destroy: destroy
    };
}
var hexToRGB = function (hex) {
    var hasAlpha = hex.length === 9;
    var start = hasAlpha ? 24 : 16;
    var bigint = parseInt(hex.slice(1), 16);
    var r = (bigint >> start) & 255;
    var g = (bigint >> (start - 8)) & 255;
    var b = (bigint >> (start - 16)) & 255;
    var a = hasAlpha ? (bigint >> (start - 24)) & 255 : 255;
    return [r, g, b, a];
};
function colorStringToInts(colorstring) {
    if (colorstring === 'transparent') {
        return [0, 0, 0, 0];
    }
    var rgbmatch = colorstring.match(RGB_REGEX);
    var hexmatch = colorstring.match(HEX_REGEX);
    if (rgbmatch !== null) {
        var r = rgbmatch[1], g = rgbmatch[2], b = rgbmatch[3];
        return [+r, +g, +b, 255];
    }
    else if (hexmatch !== null) {
        return hexToRGB(colorstring);
    }
    else {
        throw new Error("'" + colorstring + "' is not a valid RGB or hex color expression.");
    }
}
var colormapToFlatArray = function (colormap) {
    var offsets = [];
    var colors = [];
    for (var i = 0; i < colormap.length; i++) {
        offsets.push(colormap[i].offset);
        var colorsnew = colorStringToInts(colormap[i].color);
        colors = colors.concat(colorsnew);
    }
    var floatOffsets = new Float32Array(offsets);
    var uintOffsets = new Uint8Array(floatOffsets.buffer);
    var normalOffsets = Array.from(uintOffsets);
    var colormapArray = colors.concat(normalOffsets);
    return colormapArray;
};
function createColormapTexture(colormapInput, regl) {
    var colormapFlatArray = colormapToFlatArray(colormapInput);
    var colormapTexture;
    if (colormapInput.length === 0) {
        colormapTexture = regl.texture({
            shape: [2, 2]
        });
    }
    else {
        colormapTexture = regl.texture({
            width: colormapInput.length,
            height: 2,
            data: colormapFlatArray
        });
    }
    return colormapTexture;
}
function getAdjacentTilesTexCoords(gloperations, textureManager, coords, url) {
    return __awaiter(this, void 0, void 0, function () {
        var textureContents, adjacentTiles, textureCoords, i, _x, j, _y, coordsAdjacent, hashKey, pixelDataAdjacent, textureBounds, textureBounds;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    textureContents = textureManager.contents;
                    adjacentTiles = 3;
                    textureCoords = [];
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < adjacentTiles)) return [3, 7];
                    _x = coords['x'] + (i - 1);
                    j = 0;
                    _a.label = 2;
                case 2:
                    if (!(j < adjacentTiles)) return [3, 6];
                    _y = coords['y'] + (j - 1);
                    coordsAdjacent = {
                        x: _x,
                        y: _y,
                        z: coords['z'],
                    };
                    hashKey = textureManager.hashTileCoordinates(coordsAdjacent);
                    if (!!textureContents.has(hashKey)) return [3, 4];
                    return [4, gloperations._fetchTileData(coordsAdjacent, url)];
                case 3:
                    pixelDataAdjacent = _a.sent();
                    textureBounds = gloperations._renderer.textureManager.addTile(coordsAdjacent, pixelDataAdjacent);
                    textureCoords = textureCoords.concat(getTexCoordVerticesTriangleQuad(textureBounds));
                    return [3, 5];
                case 4:
                    textureBounds = gloperations._renderer.textureManager.getTextureCoordinates(coordsAdjacent);
                    textureCoords = textureCoords.concat(getTexCoordVerticesTriangleQuad(textureBounds));
                    _a.label = 5;
                case 5:
                    j++;
                    return [3, 2];
                case 6:
                    i++;
                    return [3, 1];
                case 7: return [2, textureCoords];
            }
        });
    });
}
function delay(ms) {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms);
    });
}

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = ".gl-tilelayer-tile {\n  -ms-interpolation-mode: nearest-neighbor;\n      image-rendering: -moz-crisp-edges;\n      image-rendering: pixelated;\n  image-rendering: crisp-edges;\n}\n";
styleInject(css_248z);

var vertDouble = "#define GLSLIFY 1\nuniform mat4 transformMatrix;\n\nattribute vec2 position;\nattribute vec2 texCoordA;\nattribute vec2 texCoordB;\n\nvarying vec2 vTexCoordA;\nvarying vec2 vTexCoordB;\n\nvoid main() {\n  vTexCoordA = texCoordA;\n  vTexCoordB = texCoordB;\n  gl_Position = transformMatrix * vec4(position, 0.0, 1.0);\n}\n"; // eslint-disable-line

var vertSingle = "#define GLSLIFY 1\nuniform mat4 transformMatrix;\n\nattribute vec2 position;\nattribute vec2 texCoord;\n\nvarying vec2 vTexCoord;\n\nvoid main() {\n  vTexCoord = texCoord;\n  gl_Position = transformMatrix * vec4(position, 0.0, 1.0);\n}\n"; // eslint-disable-line

var vertMulti3 = "#define GLSLIFY 1\nuniform mat4 transformMatrix;\n\nattribute vec2 position;\nattribute vec2 texCoordA;\nattribute vec2 texCoordB;\nattribute vec2 texCoordC;\n\nvarying vec2 vTexCoordA;\nvarying vec2 vTexCoordB;\nvarying vec2 vTexCoordC;\n\nvoid main() {\n  vTexCoordA = texCoordA;\n  vTexCoordB = texCoordB;\n  vTexCoordC = texCoordC;\n  gl_Position = transformMatrix * vec4(position, 0.0, 1.0);\n}\n"; // eslint-disable-line

var vertMulti4 = "#define GLSLIFY 1\nuniform mat4 transformMatrix;\n\nattribute vec2 position;\nattribute vec2 texCoordA;\nattribute vec2 texCoordB;\nattribute vec2 texCoordC;\nattribute vec2 texCoordD;\n\nvarying vec2 vTexCoordA;\nvarying vec2 vTexCoordB;\nvarying vec2 vTexCoordC;\nvarying vec2 vTexCoordD;\n\nvoid main() {\n  vTexCoordA = texCoordA;\n  vTexCoordB = texCoordB;\n  vTexCoordC = texCoordC;\n  vTexCoordD = texCoordD;\n  gl_Position = transformMatrix * vec4(position, 0.0, 1.0);\n}\n"; // eslint-disable-line

var vertMulti5 = "#define GLSLIFY 1\nuniform mat4 transformMatrix;\n\nattribute vec2 position;\nattribute vec2 texCoordA;\nattribute vec2 texCoordB;\nattribute vec2 texCoordC;\nattribute vec2 texCoordD;\nattribute vec2 texCoordE;\n\nvarying vec2 vTexCoordA;\nvarying vec2 vTexCoordB;\nvarying vec2 vTexCoordC;\nvarying vec2 vTexCoordD;\nvarying vec2 vTexCoordE;\n\nvoid main() {\n  vTexCoordA = texCoordA;\n  vTexCoordB = texCoordB;\n  vTexCoordC = texCoordC;\n  vTexCoordD = texCoordD;\n  vTexCoordE = texCoordE;\n  gl_Position = transformMatrix * vec4(position, 0.0, 1.0);\n}\n"; // eslint-disable-line

var vertMulti6 = "#define GLSLIFY 1\nuniform mat4 transformMatrix;\n\nattribute vec2 position;\nattribute vec2 texCoordA;\nattribute vec2 texCoordB;\nattribute vec2 texCoordC;\nattribute vec2 texCoordD;\nattribute vec2 texCoordE;\nattribute vec2 texCoordF;\n\nvarying vec2 vTexCoordA;\nvarying vec2 vTexCoordB;\nvarying vec2 vTexCoordC;\nvarying vec2 vTexCoordD;\nvarying vec2 vTexCoordE;\nvarying vec2 vTexCoordF;\n\nvoid main() {\n  vTexCoordA = texCoordA;\n  vTexCoordB = texCoordB;\n  vTexCoordC = texCoordC;\n  vTexCoordD = texCoordD;\n  vTexCoordE = texCoordE;\n  vTexCoordE = texCoordF;\n  gl_Position = transformMatrix * vec4(position, 0.0, 1.0);\n}\n"; // eslint-disable-line

var vertSingleNotTransformed = "#define GLSLIFY 1\nattribute vec2 position;\nattribute vec2 texCoord;\n\nvarying vec2 vTexCoord;\n\nvoid main() {\n  vTexCoord = texCoord;\n  gl_Position = vec4(position, 0.0, 1.0);\n}\n"; // eslint-disable-line

var fragInterpolateColor = "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#define GLSLIFY 1\n#endif\n\n#define TRANSPARENT vec4(0.0)\n\n#ifndef RELATIVE_TOLERANCE\n#define RELATIVE_TOLERANCE 0.0001\n#endif\n\nbool isCloseEnough(float a, float b) {\n  return abs(a - b) <= max(abs(a), abs(b)) * RELATIVE_TOLERANCE;\n}\n\n// Denormalize 8-bit color channels to integers in the range 0 to 255.\nivec4 floatsToBytes(vec4 inputFloats, bool littleEndian) {\n  ivec4 bytes = ivec4(inputFloats * 255.0);\n  return (\n    littleEndian\n    ? bytes.abgr\n    : bytes\n  );\n}\n\n// Break the four bytes down into an array of 32 bits.\nvoid bytesToBits(const in ivec4 bytes, out bool bits[32]) {\n  for (int channelIndex = 0; channelIndex < 4; ++channelIndex) {\n    float acc = float(bytes[channelIndex]);\n    for (int indexInByte = 7; indexInByte >= 0; --indexInByte) {\n      float powerOfTwo = exp2(float(indexInByte));\n      bool bit = acc >= powerOfTwo;\n      bits[channelIndex * 8 + (7 - indexInByte)] = bit;\n      acc = mod(acc, powerOfTwo);\n    }\n  }\n}\n\n// Compute the exponent of the 32-bit float.\nfloat getExponent(bool bits[32]) {\n  const int startIndex = 1;\n  const int bitStringLength = 8;\n  const int endBeforeIndex = startIndex + bitStringLength;\n  float acc = 0.0;\n  int pow2 = bitStringLength - 1;\n  for (int bitIndex = startIndex; bitIndex < endBeforeIndex; ++bitIndex) {\n    acc += float(bits[bitIndex]) * exp2(float(pow2--));\n  }\n  return acc;\n}\n\n// Compute the mantissa of the 32-bit float.\nfloat getMantissa(bool bits[32], bool subnormal) {\n  const int startIndex = 9;\n  const int bitStringLength = 23;\n  const int endBeforeIndex = startIndex + bitStringLength;\n  // Leading/implicit/hidden bit convention:\n  // If the number is not subnormal (with exponent 0), we add a leading 1 digit.\n  float acc = float(!subnormal) * exp2(float(bitStringLength));\n  int pow2 = bitStringLength - 1;\n  for (int bitIndex = startIndex; bitIndex < endBeforeIndex; ++bitIndex) {\n    acc += float(bits[bitIndex]) * exp2(float(pow2--));\n  }\n  return acc;\n}\n\n// Parse the float from its 32 bits.\nfloat bitsToFloat(bool bits[32]) {\n  float signBit = float(bits[0]) * -2.0 + 1.0;\n  float exponent = getExponent(bits);\n  bool subnormal = abs(exponent - 0.0) < 0.01;\n  float mantissa = getMantissa(bits, subnormal);\n  float exponentBias = 127.0;\n  return signBit * mantissa * exp2(exponent - exponentBias - 23.0);\n}\n\n// Decode a 32-bit float from the RGBA color channels of a texel.\nfloat rgbaToFloat(vec4 texelRGBA, bool littleEndian) {\n  ivec4 rgbaBytes = floatsToBytes(texelRGBA, littleEndian);\n  bool bits[32];\n  bytesToBits(rgbaBytes, bits);\n  return bitsToFloat(bits);\n}\n\n#ifndef DEFAULT_COLOR\n#define DEFAULT_COLOR vec4(0.0)\n#endif\n\n#ifndef SCALE_MAX_LENGTH\n#define SCALE_MAX_LENGTH 16\n#endif\n\n#ifndef SENTINEL_MAX_LENGTH\n#define SENTINEL_MAX_LENGTH 16\n#endif\n\nvec4 computeColor(\n  float inputVal,\n  sampler2D scaleColormap,\n  sampler2D sentinelColormap,\n  int scaleLength,\n  int sentinelLength,\n  bool littleEndian\n) {\n\n  // vertical texture coordinate to find color and offset\n  float colorRow = 0.25;\n  float offsetRow = 0.75;\n\n  // Compare the value against any sentinel values, if defined.\n  if (sentinelLength > 0) {\n    for (int i = 0; i < SENTINEL_MAX_LENGTH; ++i) {\n      if (i == sentinelLength) {\n        break;\n      }\n\n      float i_f = float(i);\n      float sentinelLengthFloat = float(sentinelLength);\n      // retrieve the offset from the colormap\n      vec4 offsetRgba = texture2D(sentinelColormap, vec2((i_f + 0.5) / sentinelLengthFloat, offsetRow));\n      float sentinelOffset = rgbaToFloat(offsetRgba, littleEndian);\n      if (isCloseEnough(inputVal, sentinelOffset)) {\n        // retrieve the color from the colormap\n        vec2 colormapCoord = vec2((i_f + 0.5) / sentinelLengthFloat, colorRow);\n        return texture2D(sentinelColormap, colormapCoord);\n      }\n    }\n  }\n\n  // Do linear interpolation using the color scale, if defined.\n  if (scaleLength > 0) {\n    // If value below color scale range, clamp to lowest color stop.\n    vec4 scaleOffsetLowestRgba = texture2D(scaleColormap, vec2(0.0, offsetRow));\n    float scaleOffsetLowest = rgbaToFloat(scaleOffsetLowestRgba, littleEndian);\n    vec4 scaleOffsetHighestRgba = texture2D(scaleColormap, vec2(1.0, offsetRow));\n    float scaleOffsetHighest = rgbaToFloat(scaleOffsetHighestRgba, littleEndian);\n    if (inputVal < scaleOffsetLowest) {\n      return texture2D(scaleColormap, vec2(0.0, colorRow));\n    } else if (inputVal > scaleOffsetHighest) {\n      return texture2D(scaleColormap, vec2(1.0, colorRow));\n    } else {\n      for (int i = 0; i < SCALE_MAX_LENGTH; ++i) {\n        float i_f = float(i);\n        float scaleLengthFloat = float(scaleLength);\n\n        // If value above color scale range, clamp to highest color stop.\n        if (i == scaleLength) {\n          return texture2D(sentinelColormap, vec2((scaleLengthFloat - 0.5) / scaleLengthFloat, colorRow));\n        }\n        \n        vec4 scaleOffsetNextRgba = texture2D(scaleColormap, vec2((i_f + 1.0 + 0.5) / scaleLengthFloat, offsetRow));\n        float scaleOffsetNext = rgbaToFloat(scaleOffsetNextRgba, littleEndian);\n\n        if (inputVal <= scaleOffsetNext) {\n          vec4 scaleOffsetRgba = texture2D(scaleColormap, vec2((i_f + 0.5) / scaleLengthFloat, offsetRow));\n          float scaleOffset = rgbaToFloat(scaleOffsetRgba, littleEndian);\n          float percent = (inputVal - scaleOffset)\n            / (scaleOffsetNext - scaleOffset);\n          vec4 colorLow = texture2D(scaleColormap, vec2((i_f + 0.5) / scaleLengthFloat, colorRow));\n          vec4 colorHigh = texture2D(scaleColormap, vec2((i_f + 1.0 + 0.5) / scaleLengthFloat, colorRow));\n          return mix(colorLow, colorHigh, percent);\n        } \n      }\n    }\n  }\n\n  return DEFAULT_COLOR;\n}\n\nuniform sampler2D textureA;\nuniform sampler2D textureB;\n\nuniform int scaleLengthA;\nuniform int sentinelLengthA;\nuniform sampler2D scaleColormapA;\nuniform sampler2D sentinelColormapA;\n\nuniform int scaleLengthB;\nuniform int sentinelLengthB;\nuniform sampler2D scaleColormapB;\nuniform sampler2D sentinelColormapB;\n\nuniform float nodataValue;\nuniform bool littleEndian;\nuniform float interpolationFraction;\n\nvarying vec2 vTexCoordA;\nvarying vec2 vTexCoordB;\n\nvoid main() {\n  if (interpolationFraction <= 0.0) {\n    vec4 texelRgba = texture2D(textureA, vTexCoordA);\n    float texelFloat = rgbaToFloat(texelRgba, littleEndian);\n    if (isCloseEnough(texelFloat, nodataValue)) {\n      discard;\n    }\n    gl_FragColor = computeColor(texelFloat, scaleColormapA, sentinelColormapA, scaleLengthA, sentinelLengthA, littleEndian);\n  } else if (interpolationFraction >= 1.0) {\n    vec4 texelRgba = texture2D(textureB, vTexCoordB);\n    float texelFloat = rgbaToFloat(texelRgba, littleEndian);\n    if (isCloseEnough(texelFloat, nodataValue)) {\n      discard;\n    }\n    gl_FragColor = computeColor(texelFloat, scaleColormapB, sentinelColormapB, scaleLengthB, sentinelLengthB, littleEndian);\n  } else {\n    vec4 texelRgbaA = texture2D(textureA, vTexCoordA);\n    float texelFloatA = rgbaToFloat(texelRgbaA, littleEndian);\n    vec4 texelRgbaB = texture2D(textureB, vTexCoordB);\n    float texelFloatB = rgbaToFloat(texelRgbaB, littleEndian);\n    vec4 colorA = (\n      isCloseEnough(texelFloatA, nodataValue)\n      ? TRANSPARENT\n      : computeColor(texelFloatA, scaleColormapA, sentinelColormapA, scaleLengthA, sentinelLengthA, littleEndian)\n    );\n    vec4 colorB = (\n      isCloseEnough(texelFloatB, nodataValue)\n      ? TRANSPARENT\n      : computeColor(texelFloatB, scaleColormapB, sentinelColormapB, scaleLengthB, sentinelLengthB, littleEndian)\n    );\n    gl_FragColor = mix(colorA, colorB, interpolationFraction);\n  }\n}"; // eslint-disable-line

var fragInterpolateColorOnly = "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#define GLSLIFY 1\n#endif\n\n#ifndef RELATIVE_TOLERANCE\n#define RELATIVE_TOLERANCE 0.0001\n#endif\n\nbool isCloseEnough(float a, float b) {\n  return abs(a - b) <= max(abs(a), abs(b)) * RELATIVE_TOLERANCE;\n}\n\n// Denormalize 8-bit color channels to integers in the range 0 to 255.\nivec4 floatsToBytes(vec4 inputFloats, bool littleEndian) {\n  ivec4 bytes = ivec4(inputFloats * 255.0);\n  return (\n    littleEndian\n    ? bytes.abgr\n    : bytes\n  );\n}\n\n// Break the four bytes down into an array of 32 bits.\nvoid bytesToBits(const in ivec4 bytes, out bool bits[32]) {\n  for (int channelIndex = 0; channelIndex < 4; ++channelIndex) {\n    float acc = float(bytes[channelIndex]);\n    for (int indexInByte = 7; indexInByte >= 0; --indexInByte) {\n      float powerOfTwo = exp2(float(indexInByte));\n      bool bit = acc >= powerOfTwo;\n      bits[channelIndex * 8 + (7 - indexInByte)] = bit;\n      acc = mod(acc, powerOfTwo);\n    }\n  }\n}\n\n// Compute the exponent of the 32-bit float.\nfloat getExponent(bool bits[32]) {\n  const int startIndex = 1;\n  const int bitStringLength = 8;\n  const int endBeforeIndex = startIndex + bitStringLength;\n  float acc = 0.0;\n  int pow2 = bitStringLength - 1;\n  for (int bitIndex = startIndex; bitIndex < endBeforeIndex; ++bitIndex) {\n    acc += float(bits[bitIndex]) * exp2(float(pow2--));\n  }\n  return acc;\n}\n\n// Compute the mantissa of the 32-bit float.\nfloat getMantissa(bool bits[32], bool subnormal) {\n  const int startIndex = 9;\n  const int bitStringLength = 23;\n  const int endBeforeIndex = startIndex + bitStringLength;\n  // Leading/implicit/hidden bit convention:\n  // If the number is not subnormal (with exponent 0), we add a leading 1 digit.\n  float acc = float(!subnormal) * exp2(float(bitStringLength));\n  int pow2 = bitStringLength - 1;\n  for (int bitIndex = startIndex; bitIndex < endBeforeIndex; ++bitIndex) {\n    acc += float(bits[bitIndex]) * exp2(float(pow2--));\n  }\n  return acc;\n}\n\n// Parse the float from its 32 bits.\nfloat bitsToFloat(bool bits[32]) {\n  float signBit = float(bits[0]) * -2.0 + 1.0;\n  float exponent = getExponent(bits);\n  bool subnormal = abs(exponent - 0.0) < 0.01;\n  float mantissa = getMantissa(bits, subnormal);\n  float exponentBias = 127.0;\n  return signBit * mantissa * exp2(exponent - exponentBias - 23.0);\n}\n\n// Decode a 32-bit float from the RGBA color channels of a texel.\nfloat rgbaToFloat(vec4 texelRGBA, bool littleEndian) {\n  ivec4 rgbaBytes = floatsToBytes(texelRGBA, littleEndian);\n  bool bits[32];\n  bytesToBits(rgbaBytes, bits);\n  return bitsToFloat(bits);\n}\n\n#ifndef DEFAULT_COLOR\n#define DEFAULT_COLOR vec4(0.0)\n#endif\n\n#ifndef SCALE_MAX_LENGTH\n#define SCALE_MAX_LENGTH 16\n#endif\n\n#ifndef SENTINEL_MAX_LENGTH\n#define SENTINEL_MAX_LENGTH 16\n#endif\n\nvec4 computeColor(\n  float inputVal,\n  sampler2D scaleColormap,\n  sampler2D sentinelColormap,\n  int scaleLength,\n  int sentinelLength,\n  bool littleEndian\n) {\n\n  // vertical texture coordinate to find color and offset\n  float colorRow = 0.25;\n  float offsetRow = 0.75;\n\n  // Compare the value against any sentinel values, if defined.\n  if (sentinelLength > 0) {\n    for (int i = 0; i < SENTINEL_MAX_LENGTH; ++i) {\n      if (i == sentinelLength) {\n        break;\n      }\n\n      float i_f = float(i);\n      float sentinelLengthFloat = float(sentinelLength);\n      // retrieve the offset from the colormap\n      vec4 offsetRgba = texture2D(sentinelColormap, vec2((i_f + 0.5) / sentinelLengthFloat, offsetRow));\n      float sentinelOffset = rgbaToFloat(offsetRgba, littleEndian);\n      if (isCloseEnough(inputVal, sentinelOffset)) {\n        // retrieve the color from the colormap\n        vec2 colormapCoord = vec2((i_f + 0.5) / sentinelLengthFloat, colorRow);\n        return texture2D(sentinelColormap, colormapCoord);\n      }\n    }\n  }\n\n  // Do linear interpolation using the color scale, if defined.\n  if (scaleLength > 0) {\n    // If value below color scale range, clamp to lowest color stop.\n    vec4 scaleOffsetLowestRgba = texture2D(scaleColormap, vec2(0.0, offsetRow));\n    float scaleOffsetLowest = rgbaToFloat(scaleOffsetLowestRgba, littleEndian);\n    vec4 scaleOffsetHighestRgba = texture2D(scaleColormap, vec2(1.0, offsetRow));\n    float scaleOffsetHighest = rgbaToFloat(scaleOffsetHighestRgba, littleEndian);\n    if (inputVal < scaleOffsetLowest) {\n      return texture2D(scaleColormap, vec2(0.0, colorRow));\n    } else if (inputVal > scaleOffsetHighest) {\n      return texture2D(scaleColormap, vec2(1.0, colorRow));\n    } else {\n      for (int i = 0; i < SCALE_MAX_LENGTH; ++i) {\n        float i_f = float(i);\n        float scaleLengthFloat = float(scaleLength);\n\n        // If value above color scale range, clamp to highest color stop.\n        if (i == scaleLength) {\n          return texture2D(sentinelColormap, vec2((scaleLengthFloat - 0.5) / scaleLengthFloat, colorRow));\n        }\n        \n        vec4 scaleOffsetNextRgba = texture2D(scaleColormap, vec2((i_f + 1.0 + 0.5) / scaleLengthFloat, offsetRow));\n        float scaleOffsetNext = rgbaToFloat(scaleOffsetNextRgba, littleEndian);\n\n        if (inputVal <= scaleOffsetNext) {\n          vec4 scaleOffsetRgba = texture2D(scaleColormap, vec2((i_f + 0.5) / scaleLengthFloat, offsetRow));\n          float scaleOffset = rgbaToFloat(scaleOffsetRgba, littleEndian);\n          float percent = (inputVal - scaleOffset)\n            / (scaleOffsetNext - scaleOffset);\n          vec4 colorLow = texture2D(scaleColormap, vec2((i_f + 0.5) / scaleLengthFloat, colorRow));\n          vec4 colorHigh = texture2D(scaleColormap, vec2((i_f + 1.0 + 0.5) / scaleLengthFloat, colorRow));\n          return mix(colorLow, colorHigh, percent);\n        } \n      }\n    }\n  }\n\n  return DEFAULT_COLOR;\n}\n\nuniform sampler2D texture;\n\nuniform int scaleLengthA;\nuniform int sentinelLengthA;\nuniform sampler2D scaleColormapA;\nuniform sampler2D sentinelColormapA;\n\nuniform int scaleLengthB;\nuniform int sentinelLengthB;\nuniform sampler2D scaleColormapB;\nuniform sampler2D sentinelColormapB;\n\nuniform float nodataValue;\nuniform bool littleEndian;\nuniform float interpolationFraction;\n\nvarying vec2 vTexCoord;\n\nvoid main() {\n  vec4 texelRgba = texture2D(texture, vTexCoord);\n  float texelFloat = rgbaToFloat(texelRgba, littleEndian);\n\n  if (isCloseEnough(texelFloat, nodataValue)) {\n    discard;\n  }\n\n  if (interpolationFraction <= 0.0) {\n    gl_FragColor = computeColor(texelFloat, scaleColormapA, sentinelColormapA, scaleLengthA, sentinelLengthA, littleEndian);\n  } else if (interpolationFraction >= 1.0) {\n    gl_FragColor = computeColor(texelFloat, scaleColormapB, sentinelColormapB, scaleLengthB, sentinelLengthB, littleEndian);\n  } else {\n    vec4 colorA = computeColor(texelFloat, scaleColormapA, sentinelColormapA, scaleLengthA, sentinelLengthA, littleEndian);\n    vec4 colorB = computeColor(texelFloat, scaleColormapB, sentinelColormapB, scaleLengthB, sentinelLengthB, littleEndian);\n    gl_FragColor = mix(colorA, colorB, interpolationFraction);\n  }\n}"; // eslint-disable-line

var fragInterpolateValue = "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#define GLSLIFY 1\n#endif\n\n#define TRANSPARENT vec4(0.0)\n\n#ifndef RELATIVE_TOLERANCE\n#define RELATIVE_TOLERANCE 0.0001\n#endif\n\nbool isCloseEnough(float a, float b) {\n  return abs(a - b) <= max(abs(a), abs(b)) * RELATIVE_TOLERANCE;\n}\n\n// Denormalize 8-bit color channels to integers in the range 0 to 255.\nivec4 floatsToBytes(vec4 inputFloats, bool littleEndian) {\n  ivec4 bytes = ivec4(inputFloats * 255.0);\n  return (\n    littleEndian\n    ? bytes.abgr\n    : bytes\n  );\n}\n\n// Break the four bytes down into an array of 32 bits.\nvoid bytesToBits(const in ivec4 bytes, out bool bits[32]) {\n  for (int channelIndex = 0; channelIndex < 4; ++channelIndex) {\n    float acc = float(bytes[channelIndex]);\n    for (int indexInByte = 7; indexInByte >= 0; --indexInByte) {\n      float powerOfTwo = exp2(float(indexInByte));\n      bool bit = acc >= powerOfTwo;\n      bits[channelIndex * 8 + (7 - indexInByte)] = bit;\n      acc = mod(acc, powerOfTwo);\n    }\n  }\n}\n\n// Compute the exponent of the 32-bit float.\nfloat getExponent(bool bits[32]) {\n  const int startIndex = 1;\n  const int bitStringLength = 8;\n  const int endBeforeIndex = startIndex + bitStringLength;\n  float acc = 0.0;\n  int pow2 = bitStringLength - 1;\n  for (int bitIndex = startIndex; bitIndex < endBeforeIndex; ++bitIndex) {\n    acc += float(bits[bitIndex]) * exp2(float(pow2--));\n  }\n  return acc;\n}\n\n// Compute the mantissa of the 32-bit float.\nfloat getMantissa(bool bits[32], bool subnormal) {\n  const int startIndex = 9;\n  const int bitStringLength = 23;\n  const int endBeforeIndex = startIndex + bitStringLength;\n  // Leading/implicit/hidden bit convention:\n  // If the number is not subnormal (with exponent 0), we add a leading 1 digit.\n  float acc = float(!subnormal) * exp2(float(bitStringLength));\n  int pow2 = bitStringLength - 1;\n  for (int bitIndex = startIndex; bitIndex < endBeforeIndex; ++bitIndex) {\n    acc += float(bits[bitIndex]) * exp2(float(pow2--));\n  }\n  return acc;\n}\n\n// Parse the float from its 32 bits.\nfloat bitsToFloat(bool bits[32]) {\n  float signBit = float(bits[0]) * -2.0 + 1.0;\n  float exponent = getExponent(bits);\n  bool subnormal = abs(exponent - 0.0) < 0.01;\n  float mantissa = getMantissa(bits, subnormal);\n  float exponentBias = 127.0;\n  return signBit * mantissa * exp2(exponent - exponentBias - 23.0);\n}\n\n// Decode a 32-bit float from the RGBA color channels of a texel.\nfloat rgbaToFloat(vec4 texelRGBA, bool littleEndian) {\n  ivec4 rgbaBytes = floatsToBytes(texelRGBA, littleEndian);\n  bool bits[32];\n  bytesToBits(rgbaBytes, bits);\n  return bitsToFloat(bits);\n}\n\n#ifndef DEFAULT_COLOR\n#define DEFAULT_COLOR vec4(0.0)\n#endif\n\n#ifndef SCALE_MAX_LENGTH\n#define SCALE_MAX_LENGTH 16\n#endif\n\n#ifndef SENTINEL_MAX_LENGTH\n#define SENTINEL_MAX_LENGTH 16\n#endif\n\nvec4 computeColor(\n  float inputVal,\n  sampler2D scaleColormap,\n  sampler2D sentinelColormap,\n  int scaleLength,\n  int sentinelLength,\n  bool littleEndian\n) {\n\n  // vertical texture coordinate to find color and offset\n  float colorRow = 0.25;\n  float offsetRow = 0.75;\n\n  // Compare the value against any sentinel values, if defined.\n  if (sentinelLength > 0) {\n    for (int i = 0; i < SENTINEL_MAX_LENGTH; ++i) {\n      if (i == sentinelLength) {\n        break;\n      }\n\n      float i_f = float(i);\n      float sentinelLengthFloat = float(sentinelLength);\n      // retrieve the offset from the colormap\n      vec4 offsetRgba = texture2D(sentinelColormap, vec2((i_f + 0.5) / sentinelLengthFloat, offsetRow));\n      float sentinelOffset = rgbaToFloat(offsetRgba, littleEndian);\n      if (isCloseEnough(inputVal, sentinelOffset)) {\n        // retrieve the color from the colormap\n        vec2 colormapCoord = vec2((i_f + 0.5) / sentinelLengthFloat, colorRow);\n        return texture2D(sentinelColormap, colormapCoord);\n      }\n    }\n  }\n\n  // Do linear interpolation using the color scale, if defined.\n  if (scaleLength > 0) {\n    // If value below color scale range, clamp to lowest color stop.\n    vec4 scaleOffsetLowestRgba = texture2D(scaleColormap, vec2(0.0, offsetRow));\n    float scaleOffsetLowest = rgbaToFloat(scaleOffsetLowestRgba, littleEndian);\n    vec4 scaleOffsetHighestRgba = texture2D(scaleColormap, vec2(1.0, offsetRow));\n    float scaleOffsetHighest = rgbaToFloat(scaleOffsetHighestRgba, littleEndian);\n    if (inputVal < scaleOffsetLowest) {\n      return texture2D(scaleColormap, vec2(0.0, colorRow));\n    } else if (inputVal > scaleOffsetHighest) {\n      return texture2D(scaleColormap, vec2(1.0, colorRow));\n    } else {\n      for (int i = 0; i < SCALE_MAX_LENGTH; ++i) {\n        float i_f = float(i);\n        float scaleLengthFloat = float(scaleLength);\n\n        // If value above color scale range, clamp to highest color stop.\n        if (i == scaleLength) {\n          return texture2D(sentinelColormap, vec2((scaleLengthFloat - 0.5) / scaleLengthFloat, colorRow));\n        }\n        \n        vec4 scaleOffsetNextRgba = texture2D(scaleColormap, vec2((i_f + 1.0 + 0.5) / scaleLengthFloat, offsetRow));\n        float scaleOffsetNext = rgbaToFloat(scaleOffsetNextRgba, littleEndian);\n\n        if (inputVal <= scaleOffsetNext) {\n          vec4 scaleOffsetRgba = texture2D(scaleColormap, vec2((i_f + 0.5) / scaleLengthFloat, offsetRow));\n          float scaleOffset = rgbaToFloat(scaleOffsetRgba, littleEndian);\n          float percent = (inputVal - scaleOffset)\n            / (scaleOffsetNext - scaleOffset);\n          vec4 colorLow = texture2D(scaleColormap, vec2((i_f + 0.5) / scaleLengthFloat, colorRow));\n          vec4 colorHigh = texture2D(scaleColormap, vec2((i_f + 1.0 + 0.5) / scaleLengthFloat, colorRow));\n          return mix(colorLow, colorHigh, percent);\n        } \n      }\n    }\n  }\n\n  return DEFAULT_COLOR;\n}\n\nuniform int scaleLength;\nuniform int sentinelLength;\nuniform sampler2D scaleColormap;\nuniform sampler2D sentinelColormap;\n\nuniform float nodataValue;\nuniform sampler2D textureA;\nuniform sampler2D textureB;\nuniform bool littleEndian;\nuniform float interpolationFraction;\n\nvarying vec2 vTexCoordA;\nvarying vec2 vTexCoordB;\n\nbool isSentinelValue(sampler2D sentinelColormap, int len, float value) {\n  for (int i = 0; i < SENTINEL_MAX_LENGTH; ++i) {\n    if (i == len) {\n      break;\n    }\n    float i_f = float(i);\n    float lenFloat = float(len);\n    vec4 offsetRgba = texture2D(sentinelColormap, vec2((i_f + 0.5) / lenFloat, 0.75));\n    float sentinelOffset = rgbaToFloat(offsetRgba, littleEndian);\n    if (isCloseEnough(sentinelOffset, value)) {\n      return true;\n    }\n  }\n  return false;\n}\n\nvoid main() {\n  if (interpolationFraction <= 0.0) {\n    vec4 texelRgba = texture2D(textureA, vTexCoordA);\n    float texelFloat = rgbaToFloat(texelRgba, littleEndian);\n    if (isCloseEnough(texelFloat, nodataValue)) {\n      discard;\n    }\n    gl_FragColor = computeColor(\n      texelFloat,\n      scaleColormap,\n      sentinelColormap,\n      scaleLength,\n      sentinelLength,\n      littleEndian\n    );\n  } else if (interpolationFraction >= 1.0) {\n    vec4 texelRgba = texture2D(textureB, vTexCoordB);\n    float texelFloat = rgbaToFloat(texelRgba, littleEndian);\n    if (isCloseEnough(texelFloat, nodataValue)) {\n      discard;\n    }\n    gl_FragColor = computeColor(\n      texelFloat,\n      scaleColormap,\n      sentinelColormap,\n      scaleLength,\n      sentinelLength,\n      littleEndian\n    );\n  } else {\n    // retrieve and decode pixel value from both tiles\n    vec4 texelRgbaA = texture2D(textureA, vTexCoordA);\n    float texelFloatA = rgbaToFloat(texelRgbaA, littleEndian);\n    vec4 texelRgbaB = texture2D(textureB, vTexCoordB);\n    float texelFloatB = rgbaToFloat(texelRgbaB, littleEndian);\n    bool aIsNodata = isCloseEnough(texelFloatA, nodataValue);\n    bool bIsNodata = isCloseEnough(texelFloatB, nodataValue);\n    if (aIsNodata && bIsNodata) {\n      discard;\n    } else if (\n      aIsNodata\n      || bIsNodata\n      || scaleLength == 0\n      || isSentinelValue(sentinelColormap, sentinelLength, texelFloatA)\n      || isSentinelValue(sentinelColormap, sentinelLength, texelFloatB)\n    ) {\n      vec4 colorA = (\n        aIsNodata\n        ? TRANSPARENT\n        : computeColor(\n            texelFloatA,\n            scaleColormap,\n            sentinelColormap,\n            scaleLength,\n            sentinelLength,\n            littleEndian\n          )\n      );\n      vec4 colorB = (\n        bIsNodata\n        ? TRANSPARENT\n        : computeColor(\n            texelFloatB,\n            scaleColormap,\n            sentinelColormap,\n            scaleLength,\n            sentinelLength,\n            littleEndian\n          )\n      );\n      gl_FragColor = mix(colorA, colorB, interpolationFraction);\n    } else {\n      float interpolated = mix(texelFloatA, texelFloatB, interpolationFraction);\n      gl_FragColor = computeColor(\n        interpolated,\n        scaleColormap,\n        sentinelColormap,\n        scaleLength,\n        sentinelLength,\n        littleEndian\n      );\n    }\n  }\n}\n"; // eslint-disable-line

var fragSingle = "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#define GLSLIFY 1\n#endif\n\n#ifndef RELATIVE_TOLERANCE\n#define RELATIVE_TOLERANCE 0.0001\n#endif\n\nbool isCloseEnough(float a, float b) {\n  return abs(a - b) <= max(abs(a), abs(b)) * RELATIVE_TOLERANCE;\n}\n\n// Denormalize 8-bit color channels to integers in the range 0 to 255.\nivec4 floatsToBytes(vec4 inputFloats, bool littleEndian) {\n  ivec4 bytes = ivec4(inputFloats * 255.0);\n  return (\n    littleEndian\n    ? bytes.abgr\n    : bytes\n  );\n}\n\n// Break the four bytes down into an array of 32 bits.\nvoid bytesToBits(const in ivec4 bytes, out bool bits[32]) {\n  for (int channelIndex = 0; channelIndex < 4; ++channelIndex) {\n    float acc = float(bytes[channelIndex]);\n    for (int indexInByte = 7; indexInByte >= 0; --indexInByte) {\n      float powerOfTwo = exp2(float(indexInByte));\n      bool bit = acc >= powerOfTwo;\n      bits[channelIndex * 8 + (7 - indexInByte)] = bit;\n      acc = mod(acc, powerOfTwo);\n    }\n  }\n}\n\n// Compute the exponent of the 32-bit float.\nfloat getExponent(bool bits[32]) {\n  const int startIndex = 1;\n  const int bitStringLength = 8;\n  const int endBeforeIndex = startIndex + bitStringLength;\n  float acc = 0.0;\n  int pow2 = bitStringLength - 1;\n  for (int bitIndex = startIndex; bitIndex < endBeforeIndex; ++bitIndex) {\n    acc += float(bits[bitIndex]) * exp2(float(pow2--));\n  }\n  return acc;\n}\n\n// Compute the mantissa of the 32-bit float.\nfloat getMantissa(bool bits[32], bool subnormal) {\n  const int startIndex = 9;\n  const int bitStringLength = 23;\n  const int endBeforeIndex = startIndex + bitStringLength;\n  // Leading/implicit/hidden bit convention:\n  // If the number is not subnormal (with exponent 0), we add a leading 1 digit.\n  float acc = float(!subnormal) * exp2(float(bitStringLength));\n  int pow2 = bitStringLength - 1;\n  for (int bitIndex = startIndex; bitIndex < endBeforeIndex; ++bitIndex) {\n    acc += float(bits[bitIndex]) * exp2(float(pow2--));\n  }\n  return acc;\n}\n\n// Parse the float from its 32 bits.\nfloat bitsToFloat(bool bits[32]) {\n  float signBit = float(bits[0]) * -2.0 + 1.0;\n  float exponent = getExponent(bits);\n  bool subnormal = abs(exponent - 0.0) < 0.01;\n  float mantissa = getMantissa(bits, subnormal);\n  float exponentBias = 127.0;\n  return signBit * mantissa * exp2(exponent - exponentBias - 23.0);\n}\n\n// Decode a 32-bit float from the RGBA color channels of a texel.\nfloat rgbaToFloat(vec4 texelRGBA, bool littleEndian) {\n  ivec4 rgbaBytes = floatsToBytes(texelRGBA, littleEndian);\n  bool bits[32];\n  bytesToBits(rgbaBytes, bits);\n  return bitsToFloat(bits);\n}\n\n#ifndef DEFAULT_COLOR\n#define DEFAULT_COLOR vec4(0.0)\n#endif\n\n#ifndef SCALE_MAX_LENGTH\n#define SCALE_MAX_LENGTH 16\n#endif\n\n#ifndef SENTINEL_MAX_LENGTH\n#define SENTINEL_MAX_LENGTH 16\n#endif\n\nvec4 computeColor(\n  float inputVal,\n  sampler2D scaleColormap,\n  sampler2D sentinelColormap,\n  int scaleLength,\n  int sentinelLength,\n  bool littleEndian\n) {\n\n  // vertical texture coordinate to find color and offset\n  float colorRow = 0.25;\n  float offsetRow = 0.75;\n\n  // Compare the value against any sentinel values, if defined.\n  if (sentinelLength > 0) {\n    for (int i = 0; i < SENTINEL_MAX_LENGTH; ++i) {\n      if (i == sentinelLength) {\n        break;\n      }\n\n      float i_f = float(i);\n      float sentinelLengthFloat = float(sentinelLength);\n      // retrieve the offset from the colormap\n      vec4 offsetRgba = texture2D(sentinelColormap, vec2((i_f + 0.5) / sentinelLengthFloat, offsetRow));\n      float sentinelOffset = rgbaToFloat(offsetRgba, littleEndian);\n      if (isCloseEnough(inputVal, sentinelOffset)) {\n        // retrieve the color from the colormap\n        vec2 colormapCoord = vec2((i_f + 0.5) / sentinelLengthFloat, colorRow);\n        return texture2D(sentinelColormap, colormapCoord);\n      }\n    }\n  }\n\n  // Do linear interpolation using the color scale, if defined.\n  if (scaleLength > 0) {\n    // If value below color scale range, clamp to lowest color stop.\n    vec4 scaleOffsetLowestRgba = texture2D(scaleColormap, vec2(0.0, offsetRow));\n    float scaleOffsetLowest = rgbaToFloat(scaleOffsetLowestRgba, littleEndian);\n    vec4 scaleOffsetHighestRgba = texture2D(scaleColormap, vec2(1.0, offsetRow));\n    float scaleOffsetHighest = rgbaToFloat(scaleOffsetHighestRgba, littleEndian);\n    if (inputVal < scaleOffsetLowest) {\n      return texture2D(scaleColormap, vec2(0.0, colorRow));\n    } else if (inputVal > scaleOffsetHighest) {\n      return texture2D(scaleColormap, vec2(1.0, colorRow));\n    } else {\n      for (int i = 0; i < SCALE_MAX_LENGTH; ++i) {\n        float i_f = float(i);\n        float scaleLengthFloat = float(scaleLength);\n\n        // If value above color scale range, clamp to highest color stop.\n        if (i == scaleLength) {\n          return texture2D(sentinelColormap, vec2((scaleLengthFloat - 0.5) / scaleLengthFloat, colorRow));\n        }\n        \n        vec4 scaleOffsetNextRgba = texture2D(scaleColormap, vec2((i_f + 1.0 + 0.5) / scaleLengthFloat, offsetRow));\n        float scaleOffsetNext = rgbaToFloat(scaleOffsetNextRgba, littleEndian);\n\n        if (inputVal <= scaleOffsetNext) {\n          vec4 scaleOffsetRgba = texture2D(scaleColormap, vec2((i_f + 0.5) / scaleLengthFloat, offsetRow));\n          float scaleOffset = rgbaToFloat(scaleOffsetRgba, littleEndian);\n          float percent = (inputVal - scaleOffset)\n            / (scaleOffsetNext - scaleOffset);\n          vec4 colorLow = texture2D(scaleColormap, vec2((i_f + 0.5) / scaleLengthFloat, colorRow));\n          vec4 colorHigh = texture2D(scaleColormap, vec2((i_f + 1.0 + 0.5) / scaleLengthFloat, colorRow));\n          return mix(colorLow, colorHigh, percent);\n        } \n      }\n    }\n  }\n\n  return DEFAULT_COLOR;\n}\n\nfloat getTexelValue(vec2 pos, sampler2D texture, bool littleEndian) {\n  vec4 texelRgba = texture2D(texture, pos);\n  float texelFloat = rgbaToFloat(texelRgba, littleEndian);\n  return texelFloat;\n}\n\n// #pragma glslify: rgbaToFloat = require(glsl-rgba-to-float)\n\nuniform int scaleLength;\nuniform int sentinelLength;\nuniform sampler2D scaleColormap;\nuniform sampler2D sentinelColormap;\n\nuniform float nodataValue;\nuniform sampler2D texture;\nuniform bool littleEndian;\nuniform bool enableSimpleHillshade;\n\nuniform float textureSize;\nuniform float tileSize;\nuniform vec4 textureBounds;\nvarying vec2 vTexCoord;\n\nuniform float offset;\nuniform float slopescale;\nuniform float slopeFactor;\nuniform float deg2rad;\nuniform float azimuth;\nuniform float altitude;\n\nfloat getRelativeHeight(vec2 pos, float v, vec4 textureBounds) {\n  // if (pos.x < textureBounds[0]) {\n  //   pos = vec2(textureBounds[0], pos.y);\n  // }\n  // if (pos.x > textureBounds[2]) {\n  //   pos = vec2(textureBounds[2], pos.y);\n  // }\n  // if (pos.y < textureBounds[1]) {\n  //   pos = vec2(pos.x, textureBounds[1]);\n  // }\n  // if (pos.y > textureBounds[3]) {\n  //   pos = vec2(pos.x, textureBounds[3]);\n  // }\n  float pixelFloatValue = getTexelValue(pos, texture, littleEndian);\n  float test = step(0.0, pixelFloatValue);\n  float testReturn = ((test * pixelFloatValue) + ((1.0 - test) * v)) * (slopescale*slopeFactor);\n  return testReturn;\n}\n\nfloat hillshade(vec2 pos, float v, float offset, vec4 textureBounds) {\n  float cv = v * (slopescale * slopeFactor);\n  vec4 nv = vec4(\n  getRelativeHeight(vec2(pos.x + offset, pos.y), v, textureBounds),\n  getRelativeHeight(vec2(pos.x - offset, pos.y), v, textureBounds),\n  getRelativeHeight(vec2(pos.x, pos.y + offset), v, textureBounds),\n  getRelativeHeight(vec2(pos.x, pos.y - offset), v, textureBounds)\n  );\n\n  vec2 grad = vec2(\n    (nv[0] - cv) / 2.0 + (cv - nv[1]) / 2.0,\n    (nv[2] - cv) / 2.0 + (cv - nv[3]) / 2.0\n  );\n\n  float slope = max(3.141593 / 2.0 - atan(sqrt(dot(grad, grad))), 0.0);\n  float aspect = atan(-grad.y, grad.x);\n\n  float hs = sin(altitude * deg2rad) * sin(slope) +\n    cos(altitude * deg2rad) * cos(slope) *\n    cos((azimuth * deg2rad) - aspect);\n\n  return clamp(hs, 0.0, 1.0);\n}\n\nvoid main() {\n  float texelFloat = getTexelValue(vTexCoord, texture, littleEndian);\n\n  if (isCloseEnough(texelFloat, nodataValue)) {\n    discard;\n  }\n\n  vec4 clr = computeColor(\n    texelFloat,\n    scaleColormap,\n    sentinelColormap,\n    scaleLength,\n    sentinelLength,\n    littleEndian\n  );\n\n  if (enableSimpleHillshade) {\n    float hs = hillshade(vTexCoord, texelFloat, offset, textureBounds);\n    clr.rgb = clr.rgb * hs;\n  }\n\n  gl_FragColor = clr;\n}\n"; // eslint-disable-line

var fragHsPregen = "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#define GLSLIFY 1\n#endif\n\n#ifndef RELATIVE_TOLERANCE\n#define RELATIVE_TOLERANCE 0.0001\n#endif\n\nbool isCloseEnough(float a, float b) {\n  return abs(a - b) <= max(abs(a), abs(b)) * RELATIVE_TOLERANCE;\n}\n\n// Denormalize 8-bit color channels to integers in the range 0 to 255.\nivec4 floatsToBytes(vec4 inputFloats, bool littleEndian) {\n  ivec4 bytes = ivec4(inputFloats * 255.0);\n  return (\n    littleEndian\n    ? bytes.abgr\n    : bytes\n  );\n}\n\n// Break the four bytes down into an array of 32 bits.\nvoid bytesToBits(const in ivec4 bytes, out bool bits[32]) {\n  for (int channelIndex = 0; channelIndex < 4; ++channelIndex) {\n    float acc = float(bytes[channelIndex]);\n    for (int indexInByte = 7; indexInByte >= 0; --indexInByte) {\n      float powerOfTwo = exp2(float(indexInByte));\n      bool bit = acc >= powerOfTwo;\n      bits[channelIndex * 8 + (7 - indexInByte)] = bit;\n      acc = mod(acc, powerOfTwo);\n    }\n  }\n}\n\n// Compute the exponent of the 32-bit float.\nfloat getExponent(bool bits[32]) {\n  const int startIndex = 1;\n  const int bitStringLength = 8;\n  const int endBeforeIndex = startIndex + bitStringLength;\n  float acc = 0.0;\n  int pow2 = bitStringLength - 1;\n  for (int bitIndex = startIndex; bitIndex < endBeforeIndex; ++bitIndex) {\n    acc += float(bits[bitIndex]) * exp2(float(pow2--));\n  }\n  return acc;\n}\n\n// Compute the mantissa of the 32-bit float.\nfloat getMantissa(bool bits[32], bool subnormal) {\n  const int startIndex = 9;\n  const int bitStringLength = 23;\n  const int endBeforeIndex = startIndex + bitStringLength;\n  // Leading/implicit/hidden bit convention:\n  // If the number is not subnormal (with exponent 0), we add a leading 1 digit.\n  float acc = float(!subnormal) * exp2(float(bitStringLength));\n  int pow2 = bitStringLength - 1;\n  for (int bitIndex = startIndex; bitIndex < endBeforeIndex; ++bitIndex) {\n    acc += float(bits[bitIndex]) * exp2(float(pow2--));\n  }\n  return acc;\n}\n\n// Parse the float from its 32 bits.\nfloat bitsToFloat(bool bits[32]) {\n  float signBit = float(bits[0]) * -2.0 + 1.0;\n  float exponent = getExponent(bits);\n  bool subnormal = abs(exponent - 0.0) < 0.01;\n  float mantissa = getMantissa(bits, subnormal);\n  float exponentBias = 127.0;\n  return signBit * mantissa * exp2(exponent - exponentBias - 23.0);\n}\n\n// Decode a 32-bit float from the RGBA color channels of a texel.\nfloat rgbaToFloat(vec4 texelRGBA, bool littleEndian) {\n  ivec4 rgbaBytes = floatsToBytes(texelRGBA, littleEndian);\n  bool bits[32];\n  bytesToBits(rgbaBytes, bits);\n  return bitsToFloat(bits);\n}\n\n#ifndef DEFAULT_COLOR\n#define DEFAULT_COLOR vec4(0.0)\n#endif\n\n#ifndef SCALE_MAX_LENGTH\n#define SCALE_MAX_LENGTH 16\n#endif\n\n#ifndef SENTINEL_MAX_LENGTH\n#define SENTINEL_MAX_LENGTH 16\n#endif\n\nvec4 computeColor(\n  float inputVal,\n  sampler2D scaleColormap,\n  sampler2D sentinelColormap,\n  int scaleLength,\n  int sentinelLength,\n  bool littleEndian\n) {\n\n  // vertical texture coordinate to find color and offset\n  float colorRow = 0.25;\n  float offsetRow = 0.75;\n\n  // Compare the value against any sentinel values, if defined.\n  if (sentinelLength > 0) {\n    for (int i = 0; i < SENTINEL_MAX_LENGTH; ++i) {\n      if (i == sentinelLength) {\n        break;\n      }\n\n      float i_f = float(i);\n      float sentinelLengthFloat = float(sentinelLength);\n      // retrieve the offset from the colormap\n      vec4 offsetRgba = texture2D(sentinelColormap, vec2((i_f + 0.5) / sentinelLengthFloat, offsetRow));\n      float sentinelOffset = rgbaToFloat(offsetRgba, littleEndian);\n      if (isCloseEnough(inputVal, sentinelOffset)) {\n        // retrieve the color from the colormap\n        vec2 colormapCoord = vec2((i_f + 0.5) / sentinelLengthFloat, colorRow);\n        return texture2D(sentinelColormap, colormapCoord);\n      }\n    }\n  }\n\n  // Do linear interpolation using the color scale, if defined.\n  if (scaleLength > 0) {\n    // If value below color scale range, clamp to lowest color stop.\n    vec4 scaleOffsetLowestRgba = texture2D(scaleColormap, vec2(0.0, offsetRow));\n    float scaleOffsetLowest = rgbaToFloat(scaleOffsetLowestRgba, littleEndian);\n    vec4 scaleOffsetHighestRgba = texture2D(scaleColormap, vec2(1.0, offsetRow));\n    float scaleOffsetHighest = rgbaToFloat(scaleOffsetHighestRgba, littleEndian);\n    if (inputVal < scaleOffsetLowest) {\n      return texture2D(scaleColormap, vec2(0.0, colorRow));\n    } else if (inputVal > scaleOffsetHighest) {\n      return texture2D(scaleColormap, vec2(1.0, colorRow));\n    } else {\n      for (int i = 0; i < SCALE_MAX_LENGTH; ++i) {\n        float i_f = float(i);\n        float scaleLengthFloat = float(scaleLength);\n\n        // If value above color scale range, clamp to highest color stop.\n        if (i == scaleLength) {\n          return texture2D(sentinelColormap, vec2((scaleLengthFloat - 0.5) / scaleLengthFloat, colorRow));\n        }\n        \n        vec4 scaleOffsetNextRgba = texture2D(scaleColormap, vec2((i_f + 1.0 + 0.5) / scaleLengthFloat, offsetRow));\n        float scaleOffsetNext = rgbaToFloat(scaleOffsetNextRgba, littleEndian);\n\n        if (inputVal <= scaleOffsetNext) {\n          vec4 scaleOffsetRgba = texture2D(scaleColormap, vec2((i_f + 0.5) / scaleLengthFloat, offsetRow));\n          float scaleOffset = rgbaToFloat(scaleOffsetRgba, littleEndian);\n          float percent = (inputVal - scaleOffset)\n            / (scaleOffsetNext - scaleOffset);\n          vec4 colorLow = texture2D(scaleColormap, vec2((i_f + 0.5) / scaleLengthFloat, colorRow));\n          vec4 colorHigh = texture2D(scaleColormap, vec2((i_f + 1.0 + 0.5) / scaleLengthFloat, colorRow));\n          return mix(colorLow, colorHigh, percent);\n        } \n      }\n    }\n  }\n\n  return DEFAULT_COLOR;\n}\n\nuniform int scaleLength;\nuniform int sentinelLength;\nuniform sampler2D scaleColormap;\nuniform sampler2D sentinelColormap;\n\nuniform float nodataValue;\nuniform sampler2D texture;\nuniform bool littleEndian;\nuniform sampler2D hillshadePregenTexture;\n\nvarying vec2 vTexCoordA;\nvarying vec2 vTexCoordB;\n\nvoid main() {\n  vec4 texelRgba = texture2D(texture, vTexCoordA);\n  float texelFloat = rgbaToFloat(texelRgba, littleEndian);\n\n  if (isCloseEnough(texelFloat, nodataValue)) {\n    discard;\n  }\n\n  vec4 clr = computeColor(\n    texelFloat,\n    scaleColormap,\n    sentinelColormap,\n    scaleLength,\n    sentinelLength,\n    littleEndian\n  );\n\n  // Hillshade\n  float l = texture2D(hillshadePregenTexture, vTexCoordB).r;\n  clr.rgb = l * pow(clr.rgb, vec3(2.0));\n  clr.rgb = pow(clr.rgb, vec3(1.0/2.2));\n\n  gl_FragColor = clr;\n}\n"; // eslint-disable-line

var fragMulti1Calc = "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\n\nprecision highp sampler2D;\n#define GLSLIFY 1\n\n// Denormalize 8-bit color channels to integers in the range 0 to 255.\nivec4 floatsToBytes(vec4 inputFloats, bool littleEndian) {\n  ivec4 bytes = ivec4(inputFloats * 255.0);\n  return (\n    littleEndian\n    ? bytes.abgr\n    : bytes\n  );\n}\n\n// Break the four bytes down into an array of 32 bits.\nvoid bytesToBits(const in ivec4 bytes, out bool bits[32]) {\n  for (int channelIndex = 0; channelIndex < 4; ++channelIndex) {\n    float acc = float(bytes[channelIndex]);\n    for (int indexInByte = 7; indexInByte >= 0; --indexInByte) {\n      float powerOfTwo = exp2(float(indexInByte));\n      bool bit = acc >= powerOfTwo;\n      bits[channelIndex * 8 + (7 - indexInByte)] = bit;\n      acc = mod(acc, powerOfTwo);\n    }\n  }\n}\n\n// Compute the exponent of the 32-bit float.\nfloat getExponent(bool bits[32]) {\n  const int startIndex = 1;\n  const int bitStringLength = 8;\n  const int endBeforeIndex = startIndex + bitStringLength;\n  float acc = 0.0;\n  int pow2 = bitStringLength - 1;\n  for (int bitIndex = startIndex; bitIndex < endBeforeIndex; ++bitIndex) {\n    acc += float(bits[bitIndex]) * exp2(float(pow2--));\n  }\n  return acc;\n}\n\n// Compute the mantissa of the 32-bit float.\nfloat getMantissa(bool bits[32], bool subnormal) {\n  const int startIndex = 9;\n  const int bitStringLength = 23;\n  const int endBeforeIndex = startIndex + bitStringLength;\n  // Leading/implicit/hidden bit convention:\n  // If the number is not subnormal (with exponent 0), we add a leading 1 digit.\n  float acc = float(!subnormal) * exp2(float(bitStringLength));\n  int pow2 = bitStringLength - 1;\n  for (int bitIndex = startIndex; bitIndex < endBeforeIndex; ++bitIndex) {\n    acc += float(bits[bitIndex]) * exp2(float(pow2--));\n  }\n  return acc;\n}\n\n// Parse the float from its 32 bits.\nfloat bitsToFloat(bool bits[32]) {\n  float signBit = float(bits[0]) * -2.0 + 1.0;\n  float exponent = getExponent(bits);\n  bool subnormal = abs(exponent - 0.0) < 0.01;\n  float mantissa = getMantissa(bits, subnormal);\n  float exponentBias = 127.0;\n  return signBit * mantissa * exp2(exponent - exponentBias - 23.0);\n}\n\n// Decode a 32-bit float from the RGBA color channels of a texel.\nfloat rgbaToFloat(vec4 texelRGBA, bool littleEndian) {\n  ivec4 rgbaBytes = floatsToBytes(texelRGBA, littleEndian);\n  bool bits[32];\n  bytesToBits(rgbaBytes, bits);\n  return bitsToFloat(bits);\n}\n\nfloat shiftRight (float v, float amt) {\n  v = floor(v) + 0.5;\n  return floor(v / exp2(amt));\n}\nfloat shiftLeft (float v, float amt) {\n    return floor(v * exp2(amt) + 0.5);\n}\nfloat maskLast (float v, float bits_0) {\n    return mod(v, shiftLeft(1.0, bits_0));\n}\nfloat extractBits (float num, float from, float to) {\n    from = floor(from + 0.5); to = floor(to + 0.5);\n    return maskLast(shiftRight(num, from), to - from);\n}\nvec4 floatToRgba(float texelFloat, bool littleEndian) {\n    if (texelFloat == 0.0) return vec4(0, 0, 0, 0);\n    float sign = texelFloat > 0.0 ? 0.0 : 1.0;\n    texelFloat = abs(texelFloat);\n    float exponent = floor(log2(texelFloat));\n    float biased_exponent = exponent + 127.0;\n    float fraction = ((texelFloat / exp2(exponent)) - 1.0) * 8388608.0;\n    float t = biased_exponent / 2.0;\n    float last_bit_of_biased_exponent = fract(t) * 2.0;\n    float remaining_bits_of_biased_exponent = floor(t);\n    float byte4 = extractBits(fraction, 0.0, 8.0) / 255.0;\n    float byte3 = extractBits(fraction, 8.0, 16.0) / 255.0;\n    float byte2 = (last_bit_of_biased_exponent * 128.0 + extractBits(fraction, 16.0, 23.0)) / 255.0;\n    float byte1 = (sign * 128.0 + remaining_bits_of_biased_exponent) / 255.0;\n    return (\n      littleEndian\n      ? vec4(byte4, byte3, byte2, byte1)\n      : vec4(byte1, byte2, byte3, byte4)\n    );\n}\n\n#ifndef RELATIVE_TOLERANCE\n#define RELATIVE_TOLERANCE 0.0001\n#endif\n\nbool isCloseEnough(float a, float b) {\n  return abs(a - b) <= max(abs(a), abs(b)) * RELATIVE_TOLERANCE;\n}\n\nuniform sampler2D textureA;\n\nuniform float nodataValue;\nuniform bool littleEndian;\n\nuniform float filterLowA;\nuniform float filterHighA;\nuniform float multiplierA;\n\nvarying vec2 vTexCoord;\n\nvoid main() {\n  vec4 texelRgbaA = texture2D(textureA, vTexCoord);\n  float texelFloatA = rgbaToFloat(texelRgbaA, littleEndian);\n\n  bool aIsNodata = isCloseEnough(texelFloatA, nodataValue);\n\n  if (aIsNodata || texelFloatA < filterLowA || texelFloatA > filterHighA) {\n    gl_FragColor = floatToRgba(nodataValue, littleEndian);\n  } else {\n    float texelFloatFinal = texelFloatA * multiplierA;\n    gl_FragColor = floatToRgba(texelFloatFinal, littleEndian);\n  }\n}\n"; // eslint-disable-line

var fragMulti2Calc = "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\n\nprecision highp sampler2D;\n#define GLSLIFY 1\n\n// Denormalize 8-bit color channels to integers in the range 0 to 255.\nivec4 floatsToBytes(vec4 inputFloats, bool littleEndian) {\n  ivec4 bytes = ivec4(inputFloats * 255.0);\n  return (\n    littleEndian\n    ? bytes.abgr\n    : bytes\n  );\n}\n\n// Break the four bytes down into an array of 32 bits.\nvoid bytesToBits(const in ivec4 bytes, out bool bits[32]) {\n  for (int channelIndex = 0; channelIndex < 4; ++channelIndex) {\n    float acc = float(bytes[channelIndex]);\n    for (int indexInByte = 7; indexInByte >= 0; --indexInByte) {\n      float powerOfTwo = exp2(float(indexInByte));\n      bool bit = acc >= powerOfTwo;\n      bits[channelIndex * 8 + (7 - indexInByte)] = bit;\n      acc = mod(acc, powerOfTwo);\n    }\n  }\n}\n\n// Compute the exponent of the 32-bit float.\nfloat getExponent(bool bits[32]) {\n  const int startIndex = 1;\n  const int bitStringLength = 8;\n  const int endBeforeIndex = startIndex + bitStringLength;\n  float acc = 0.0;\n  int pow2 = bitStringLength - 1;\n  for (int bitIndex = startIndex; bitIndex < endBeforeIndex; ++bitIndex) {\n    acc += float(bits[bitIndex]) * exp2(float(pow2--));\n  }\n  return acc;\n}\n\n// Compute the mantissa of the 32-bit float.\nfloat getMantissa(bool bits[32], bool subnormal) {\n  const int startIndex = 9;\n  const int bitStringLength = 23;\n  const int endBeforeIndex = startIndex + bitStringLength;\n  // Leading/implicit/hidden bit convention:\n  // If the number is not subnormal (with exponent 0), we add a leading 1 digit.\n  float acc = float(!subnormal) * exp2(float(bitStringLength));\n  int pow2 = bitStringLength - 1;\n  for (int bitIndex = startIndex; bitIndex < endBeforeIndex; ++bitIndex) {\n    acc += float(bits[bitIndex]) * exp2(float(pow2--));\n  }\n  return acc;\n}\n\n// Parse the float from its 32 bits.\nfloat bitsToFloat(bool bits[32]) {\n  float signBit = float(bits[0]) * -2.0 + 1.0;\n  float exponent = getExponent(bits);\n  bool subnormal = abs(exponent - 0.0) < 0.01;\n  float mantissa = getMantissa(bits, subnormal);\n  float exponentBias = 127.0;\n  return signBit * mantissa * exp2(exponent - exponentBias - 23.0);\n}\n\n// Decode a 32-bit float from the RGBA color channels of a texel.\nfloat rgbaToFloat(vec4 texelRGBA, bool littleEndian) {\n  ivec4 rgbaBytes = floatsToBytes(texelRGBA, littleEndian);\n  bool bits[32];\n  bytesToBits(rgbaBytes, bits);\n  return bitsToFloat(bits);\n}\n\nfloat shiftRight (float v, float amt) {\n  v = floor(v) + 0.5;\n  return floor(v / exp2(amt));\n}\nfloat shiftLeft (float v, float amt) {\n    return floor(v * exp2(amt) + 0.5);\n}\nfloat maskLast (float v, float bits_0) {\n    return mod(v, shiftLeft(1.0, bits_0));\n}\nfloat extractBits (float num, float from, float to) {\n    from = floor(from + 0.5); to = floor(to + 0.5);\n    return maskLast(shiftRight(num, from), to - from);\n}\nvec4 floatToRgba(float texelFloat, bool littleEndian) {\n    if (texelFloat == 0.0) return vec4(0, 0, 0, 0);\n    float sign = texelFloat > 0.0 ? 0.0 : 1.0;\n    texelFloat = abs(texelFloat);\n    float exponent = floor(log2(texelFloat));\n    float biased_exponent = exponent + 127.0;\n    float fraction = ((texelFloat / exp2(exponent)) - 1.0) * 8388608.0;\n    float t = biased_exponent / 2.0;\n    float last_bit_of_biased_exponent = fract(t) * 2.0;\n    float remaining_bits_of_biased_exponent = floor(t);\n    float byte4 = extractBits(fraction, 0.0, 8.0) / 255.0;\n    float byte3 = extractBits(fraction, 8.0, 16.0) / 255.0;\n    float byte2 = (last_bit_of_biased_exponent * 128.0 + extractBits(fraction, 16.0, 23.0)) / 255.0;\n    float byte1 = (sign * 128.0 + remaining_bits_of_biased_exponent) / 255.0;\n    return (\n      littleEndian\n      ? vec4(byte4, byte3, byte2, byte1)\n      : vec4(byte1, byte2, byte3, byte4)\n    );\n}\n\n#ifndef RELATIVE_TOLERANCE\n#define RELATIVE_TOLERANCE 0.0001\n#endif\n\nbool isCloseEnough(float a, float b) {\n  return abs(a - b) <= max(abs(a), abs(b)) * RELATIVE_TOLERANCE;\n}\n\nuniform sampler2D textureA;\nuniform sampler2D textureB;\n\nuniform float nodataValue;\nuniform bool littleEndian;\n\nuniform float filterLowA;\nuniform float filterHighA;\nuniform float filterLowB;\nuniform float filterHighB;\nuniform float multiplierA;\nuniform float multiplierB;\n\nvarying vec2 vTexCoordA;\nvarying vec2 vTexCoordB;\n\nvoid main() {\n  vec4 texelRgbaA = texture2D(textureA, vTexCoordA);\n  float texelFloatA = rgbaToFloat(texelRgbaA, littleEndian);\n  vec4 texelRgbaB = texture2D(textureB, vTexCoordB);\n  float texelFloatB = rgbaToFloat(texelRgbaB, littleEndian);\n\n  bool aIsNodata = isCloseEnough(texelFloatA, nodataValue);\n  bool bIsNodata = isCloseEnough(texelFloatB, nodataValue);\n\n  if (aIsNodata || bIsNodata ||\n      texelFloatA < filterLowA || texelFloatA > filterHighA ||\n      texelFloatB < filterLowB || texelFloatB > filterHighB\n      ) {\n    gl_FragColor = floatToRgba(nodataValue, littleEndian);\n  } else {\n    float texelFloatFinal = texelFloatA * multiplierA + texelFloatB * multiplierB;\n    gl_FragColor = floatToRgba(texelFloatFinal, littleEndian);\n  }\n}\n"; // eslint-disable-line

var fragMulti3Calc = "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\n\nprecision highp sampler2D;\n#define GLSLIFY 1\n\n// Denormalize 8-bit color channels to integers in the range 0 to 255.\nivec4 floatsToBytes(vec4 inputFloats, bool littleEndian) {\n  ivec4 bytes = ivec4(inputFloats * 255.0);\n  return (\n    littleEndian\n    ? bytes.abgr\n    : bytes\n  );\n}\n\n// Break the four bytes down into an array of 32 bits.\nvoid bytesToBits(const in ivec4 bytes, out bool bits[32]) {\n  for (int channelIndex = 0; channelIndex < 4; ++channelIndex) {\n    float acc = float(bytes[channelIndex]);\n    for (int indexInByte = 7; indexInByte >= 0; --indexInByte) {\n      float powerOfTwo = exp2(float(indexInByte));\n      bool bit = acc >= powerOfTwo;\n      bits[channelIndex * 8 + (7 - indexInByte)] = bit;\n      acc = mod(acc, powerOfTwo);\n    }\n  }\n}\n\n// Compute the exponent of the 32-bit float.\nfloat getExponent(bool bits[32]) {\n  const int startIndex = 1;\n  const int bitStringLength = 8;\n  const int endBeforeIndex = startIndex + bitStringLength;\n  float acc = 0.0;\n  int pow2 = bitStringLength - 1;\n  for (int bitIndex = startIndex; bitIndex < endBeforeIndex; ++bitIndex) {\n    acc += float(bits[bitIndex]) * exp2(float(pow2--));\n  }\n  return acc;\n}\n\n// Compute the mantissa of the 32-bit float.\nfloat getMantissa(bool bits[32], bool subnormal) {\n  const int startIndex = 9;\n  const int bitStringLength = 23;\n  const int endBeforeIndex = startIndex + bitStringLength;\n  // Leading/implicit/hidden bit convention:\n  // If the number is not subnormal (with exponent 0), we add a leading 1 digit.\n  float acc = float(!subnormal) * exp2(float(bitStringLength));\n  int pow2 = bitStringLength - 1;\n  for (int bitIndex = startIndex; bitIndex < endBeforeIndex; ++bitIndex) {\n    acc += float(bits[bitIndex]) * exp2(float(pow2--));\n  }\n  return acc;\n}\n\n// Parse the float from its 32 bits.\nfloat bitsToFloat(bool bits[32]) {\n  float signBit = float(bits[0]) * -2.0 + 1.0;\n  float exponent = getExponent(bits);\n  bool subnormal = abs(exponent - 0.0) < 0.01;\n  float mantissa = getMantissa(bits, subnormal);\n  float exponentBias = 127.0;\n  return signBit * mantissa * exp2(exponent - exponentBias - 23.0);\n}\n\n// Decode a 32-bit float from the RGBA color channels of a texel.\nfloat rgbaToFloat(vec4 texelRGBA, bool littleEndian) {\n  ivec4 rgbaBytes = floatsToBytes(texelRGBA, littleEndian);\n  bool bits[32];\n  bytesToBits(rgbaBytes, bits);\n  return bitsToFloat(bits);\n}\n\nfloat shiftRight (float v, float amt) {\n  v = floor(v) + 0.5;\n  return floor(v / exp2(amt));\n}\nfloat shiftLeft (float v, float amt) {\n    return floor(v * exp2(amt) + 0.5);\n}\nfloat maskLast (float v, float bits_0) {\n    return mod(v, shiftLeft(1.0, bits_0));\n}\nfloat extractBits (float num, float from, float to) {\n    from = floor(from + 0.5); to = floor(to + 0.5);\n    return maskLast(shiftRight(num, from), to - from);\n}\nvec4 floatToRgba(float texelFloat, bool littleEndian) {\n    if (texelFloat == 0.0) return vec4(0, 0, 0, 0);\n    float sign = texelFloat > 0.0 ? 0.0 : 1.0;\n    texelFloat = abs(texelFloat);\n    float exponent = floor(log2(texelFloat));\n    float biased_exponent = exponent + 127.0;\n    float fraction = ((texelFloat / exp2(exponent)) - 1.0) * 8388608.0;\n    float t = biased_exponent / 2.0;\n    float last_bit_of_biased_exponent = fract(t) * 2.0;\n    float remaining_bits_of_biased_exponent = floor(t);\n    float byte4 = extractBits(fraction, 0.0, 8.0) / 255.0;\n    float byte3 = extractBits(fraction, 8.0, 16.0) / 255.0;\n    float byte2 = (last_bit_of_biased_exponent * 128.0 + extractBits(fraction, 16.0, 23.0)) / 255.0;\n    float byte1 = (sign * 128.0 + remaining_bits_of_biased_exponent) / 255.0;\n    return (\n      littleEndian\n      ? vec4(byte4, byte3, byte2, byte1)\n      : vec4(byte1, byte2, byte3, byte4)\n    );\n}\n\n#ifndef RELATIVE_TOLERANCE\n#define RELATIVE_TOLERANCE 0.0001\n#endif\n\nbool isCloseEnough(float a, float b) {\n  return abs(a - b) <= max(abs(a), abs(b)) * RELATIVE_TOLERANCE;\n}\n\nuniform sampler2D textureA;\nuniform sampler2D textureB;\nuniform sampler2D textureC;\n\nuniform float nodataValue;\nuniform bool littleEndian;\n\nuniform float filterLowA;\nuniform float filterHighA;\nuniform float filterLowB;\nuniform float filterHighB;\nuniform float filterLowC;\nuniform float filterHighC;\nuniform float multiplierA;\nuniform float multiplierB;\nuniform float multiplierC;\n\nvarying vec2 vTexCoordA;\nvarying vec2 vTexCoordB;\nvarying vec2 vTexCoordC;\n\nvoid main() {\n  vec4 texelRgbaA = texture2D(textureA, vTexCoordA);\n  float texelFloatA = rgbaToFloat(texelRgbaA, littleEndian);\n  vec4 texelRgbaB = texture2D(textureB, vTexCoordB);\n  float texelFloatB = rgbaToFloat(texelRgbaB, littleEndian);\n  vec4 texelRgbaC = texture2D(textureC, vTexCoordC);\n  float texelFloatC = rgbaToFloat(texelRgbaC, littleEndian);\n\n  bool aIsNodata = isCloseEnough(texelFloatA, nodataValue);\n  bool bIsNodata = isCloseEnough(texelFloatB, nodataValue);\n  bool cIsNodata = isCloseEnough(texelFloatC, nodataValue);\n\n  if (aIsNodata || bIsNodata || cIsNodata ||\n      texelFloatA < filterLowA || texelFloatA > filterHighA ||\n      texelFloatB < filterLowB || texelFloatB > filterHighB ||\n      texelFloatC < filterLowC || texelFloatC > filterHighC\n      ) {\n    gl_FragColor = floatToRgba(nodataValue, littleEndian);\n  } else {\n    float texelFloatFinal = texelFloatA * multiplierA + texelFloatB * multiplierB + texelFloatC * multiplierC;\n    gl_FragColor = floatToRgba(texelFloatFinal, littleEndian);\n  }\n}\n"; // eslint-disable-line

var fragMulti4Calc = "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\n\nprecision highp sampler2D;\n#define GLSLIFY 1\n\n// Denormalize 8-bit color channels to integers in the range 0 to 255.\nivec4 floatsToBytes(vec4 inputFloats, bool littleEndian) {\n  ivec4 bytes = ivec4(inputFloats * 255.0);\n  return (\n    littleEndian\n    ? bytes.abgr\n    : bytes\n  );\n}\n\n// Break the four bytes down into an array of 32 bits.\nvoid bytesToBits(const in ivec4 bytes, out bool bits[32]) {\n  for (int channelIndex = 0; channelIndex < 4; ++channelIndex) {\n    float acc = float(bytes[channelIndex]);\n    for (int indexInByte = 7; indexInByte >= 0; --indexInByte) {\n      float powerOfTwo = exp2(float(indexInByte));\n      bool bit = acc >= powerOfTwo;\n      bits[channelIndex * 8 + (7 - indexInByte)] = bit;\n      acc = mod(acc, powerOfTwo);\n    }\n  }\n}\n\n// Compute the exponent of the 32-bit float.\nfloat getExponent(bool bits[32]) {\n  const int startIndex = 1;\n  const int bitStringLength = 8;\n  const int endBeforeIndex = startIndex + bitStringLength;\n  float acc = 0.0;\n  int pow2 = bitStringLength - 1;\n  for (int bitIndex = startIndex; bitIndex < endBeforeIndex; ++bitIndex) {\n    acc += float(bits[bitIndex]) * exp2(float(pow2--));\n  }\n  return acc;\n}\n\n// Compute the mantissa of the 32-bit float.\nfloat getMantissa(bool bits[32], bool subnormal) {\n  const int startIndex = 9;\n  const int bitStringLength = 23;\n  const int endBeforeIndex = startIndex + bitStringLength;\n  // Leading/implicit/hidden bit convention:\n  // If the number is not subnormal (with exponent 0), we add a leading 1 digit.\n  float acc = float(!subnormal) * exp2(float(bitStringLength));\n  int pow2 = bitStringLength - 1;\n  for (int bitIndex = startIndex; bitIndex < endBeforeIndex; ++bitIndex) {\n    acc += float(bits[bitIndex]) * exp2(float(pow2--));\n  }\n  return acc;\n}\n\n// Parse the float from its 32 bits.\nfloat bitsToFloat(bool bits[32]) {\n  float signBit = float(bits[0]) * -2.0 + 1.0;\n  float exponent = getExponent(bits);\n  bool subnormal = abs(exponent - 0.0) < 0.01;\n  float mantissa = getMantissa(bits, subnormal);\n  float exponentBias = 127.0;\n  return signBit * mantissa * exp2(exponent - exponentBias - 23.0);\n}\n\n// Decode a 32-bit float from the RGBA color channels of a texel.\nfloat rgbaToFloat(vec4 texelRGBA, bool littleEndian) {\n  ivec4 rgbaBytes = floatsToBytes(texelRGBA, littleEndian);\n  bool bits[32];\n  bytesToBits(rgbaBytes, bits);\n  return bitsToFloat(bits);\n}\n\nfloat shiftRight (float v, float amt) {\n  v = floor(v) + 0.5;\n  return floor(v / exp2(amt));\n}\nfloat shiftLeft (float v, float amt) {\n    return floor(v * exp2(amt) + 0.5);\n}\nfloat maskLast (float v, float bits_0) {\n    return mod(v, shiftLeft(1.0, bits_0));\n}\nfloat extractBits (float num, float from, float to) {\n    from = floor(from + 0.5); to = floor(to + 0.5);\n    return maskLast(shiftRight(num, from), to - from);\n}\nvec4 floatToRgba(float texelFloat, bool littleEndian) {\n    if (texelFloat == 0.0) return vec4(0, 0, 0, 0);\n    float sign = texelFloat > 0.0 ? 0.0 : 1.0;\n    texelFloat = abs(texelFloat);\n    float exponent = floor(log2(texelFloat));\n    float biased_exponent = exponent + 127.0;\n    float fraction = ((texelFloat / exp2(exponent)) - 1.0) * 8388608.0;\n    float t = biased_exponent / 2.0;\n    float last_bit_of_biased_exponent = fract(t) * 2.0;\n    float remaining_bits_of_biased_exponent = floor(t);\n    float byte4 = extractBits(fraction, 0.0, 8.0) / 255.0;\n    float byte3 = extractBits(fraction, 8.0, 16.0) / 255.0;\n    float byte2 = (last_bit_of_biased_exponent * 128.0 + extractBits(fraction, 16.0, 23.0)) / 255.0;\n    float byte1 = (sign * 128.0 + remaining_bits_of_biased_exponent) / 255.0;\n    return (\n      littleEndian\n      ? vec4(byte4, byte3, byte2, byte1)\n      : vec4(byte1, byte2, byte3, byte4)\n    );\n}\n\n#ifndef RELATIVE_TOLERANCE\n#define RELATIVE_TOLERANCE 0.0001\n#endif\n\nbool isCloseEnough(float a, float b) {\n  return abs(a - b) <= max(abs(a), abs(b)) * RELATIVE_TOLERANCE;\n}\n\nuniform sampler2D textureA;\nuniform sampler2D textureB;\nuniform sampler2D textureC;\nuniform sampler2D textureD;\n\nuniform float nodataValue;\nuniform bool littleEndian;\n\nuniform float filterLowA;\nuniform float filterHighA;\nuniform float filterLowB;\nuniform float filterHighB;\nuniform float filterLowC;\nuniform float filterHighC;\nuniform float filterLowD;\nuniform float filterHighD;\nuniform float multiplierA;\nuniform float multiplierB;\nuniform float multiplierC;\nuniform float multiplierD;\n\nvarying vec2 vTexCoordA;\nvarying vec2 vTexCoordB;\nvarying vec2 vTexCoordC;\nvarying vec2 vTexCoordD;\n\nvoid main() {\n  vec4 texelRgbaA = texture2D(textureA, vTexCoordA);\n  float texelFloatA = rgbaToFloat(texelRgbaA, littleEndian);\n  vec4 texelRgbaB = texture2D(textureB, vTexCoordB);\n  float texelFloatB = rgbaToFloat(texelRgbaB, littleEndian);\n  vec4 texelRgbaC = texture2D(textureC, vTexCoordC);\n  float texelFloatC = rgbaToFloat(texelRgbaC, littleEndian);\n  vec4 texelRgbaD = texture2D(textureD, vTexCoordD);\n  float texelFloatD = rgbaToFloat(texelRgbaD, littleEndian);\n\n  bool aIsNodata = isCloseEnough(texelFloatA, nodataValue);\n  bool bIsNodata = isCloseEnough(texelFloatB, nodataValue);\n  bool cIsNodata = isCloseEnough(texelFloatC, nodataValue);\n  bool dIsNodata = isCloseEnough(texelFloatD, nodataValue);\n\n  if (aIsNodata || bIsNodata || cIsNodata || dIsNodata ||\n      texelFloatA < filterLowA || texelFloatA > filterHighA ||\n      texelFloatB < filterLowB || texelFloatB > filterHighB ||\n      texelFloatC < filterLowC || texelFloatC > filterHighC ||\n      texelFloatD < filterLowD || texelFloatD > filterHighD\n      ) {\n    gl_FragColor = floatToRgba(nodataValue, littleEndian);\n  } else {\n    float texelFloatFinal = texelFloatA * multiplierA + texelFloatB * multiplierB + texelFloatC * multiplierC + texelFloatD * multiplierD;\n    gl_FragColor = floatToRgba(texelFloatFinal, littleEndian);\n  }\n}\n"; // eslint-disable-line

var fragMulti5Calc = "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\n\nprecision highp sampler2D;\n#define GLSLIFY 1\n\n// Denormalize 8-bit color channels to integers in the range 0 to 255.\nivec4 floatsToBytes(vec4 inputFloats, bool littleEndian) {\n  ivec4 bytes = ivec4(inputFloats * 255.0);\n  return (\n    littleEndian\n    ? bytes.abgr\n    : bytes\n  );\n}\n\n// Break the four bytes down into an array of 32 bits.\nvoid bytesToBits(const in ivec4 bytes, out bool bits[32]) {\n  for (int channelIndex = 0; channelIndex < 4; ++channelIndex) {\n    float acc = float(bytes[channelIndex]);\n    for (int indexInByte = 7; indexInByte >= 0; --indexInByte) {\n      float powerOfTwo = exp2(float(indexInByte));\n      bool bit = acc >= powerOfTwo;\n      bits[channelIndex * 8 + (7 - indexInByte)] = bit;\n      acc = mod(acc, powerOfTwo);\n    }\n  }\n}\n\n// Compute the exponent of the 32-bit float.\nfloat getExponent(bool bits[32]) {\n  const int startIndex = 1;\n  const int bitStringLength = 8;\n  const int endBeforeIndex = startIndex + bitStringLength;\n  float acc = 0.0;\n  int pow2 = bitStringLength - 1;\n  for (int bitIndex = startIndex; bitIndex < endBeforeIndex; ++bitIndex) {\n    acc += float(bits[bitIndex]) * exp2(float(pow2--));\n  }\n  return acc;\n}\n\n// Compute the mantissa of the 32-bit float.\nfloat getMantissa(bool bits[32], bool subnormal) {\n  const int startIndex = 9;\n  const int bitStringLength = 23;\n  const int endBeforeIndex = startIndex + bitStringLength;\n  // Leading/implicit/hidden bit convention:\n  // If the number is not subnormal (with exponent 0), we add a leading 1 digit.\n  float acc = float(!subnormal) * exp2(float(bitStringLength));\n  int pow2 = bitStringLength - 1;\n  for (int bitIndex = startIndex; bitIndex < endBeforeIndex; ++bitIndex) {\n    acc += float(bits[bitIndex]) * exp2(float(pow2--));\n  }\n  return acc;\n}\n\n// Parse the float from its 32 bits.\nfloat bitsToFloat(bool bits[32]) {\n  float signBit = float(bits[0]) * -2.0 + 1.0;\n  float exponent = getExponent(bits);\n  bool subnormal = abs(exponent - 0.0) < 0.01;\n  float mantissa = getMantissa(bits, subnormal);\n  float exponentBias = 127.0;\n  return signBit * mantissa * exp2(exponent - exponentBias - 23.0);\n}\n\n// Decode a 32-bit float from the RGBA color channels of a texel.\nfloat rgbaToFloat(vec4 texelRGBA, bool littleEndian) {\n  ivec4 rgbaBytes = floatsToBytes(texelRGBA, littleEndian);\n  bool bits[32];\n  bytesToBits(rgbaBytes, bits);\n  return bitsToFloat(bits);\n}\n\nfloat shiftRight (float v, float amt) {\n  v = floor(v) + 0.5;\n  return floor(v / exp2(amt));\n}\nfloat shiftLeft (float v, float amt) {\n    return floor(v * exp2(amt) + 0.5);\n}\nfloat maskLast (float v, float bits_0) {\n    return mod(v, shiftLeft(1.0, bits_0));\n}\nfloat extractBits (float num, float from, float to) {\n    from = floor(from + 0.5); to = floor(to + 0.5);\n    return maskLast(shiftRight(num, from), to - from);\n}\nvec4 floatToRgba(float texelFloat, bool littleEndian) {\n    if (texelFloat == 0.0) return vec4(0, 0, 0, 0);\n    float sign = texelFloat > 0.0 ? 0.0 : 1.0;\n    texelFloat = abs(texelFloat);\n    float exponent = floor(log2(texelFloat));\n    float biased_exponent = exponent + 127.0;\n    float fraction = ((texelFloat / exp2(exponent)) - 1.0) * 8388608.0;\n    float t = biased_exponent / 2.0;\n    float last_bit_of_biased_exponent = fract(t) * 2.0;\n    float remaining_bits_of_biased_exponent = floor(t);\n    float byte4 = extractBits(fraction, 0.0, 8.0) / 255.0;\n    float byte3 = extractBits(fraction, 8.0, 16.0) / 255.0;\n    float byte2 = (last_bit_of_biased_exponent * 128.0 + extractBits(fraction, 16.0, 23.0)) / 255.0;\n    float byte1 = (sign * 128.0 + remaining_bits_of_biased_exponent) / 255.0;\n    return (\n      littleEndian\n      ? vec4(byte4, byte3, byte2, byte1)\n      : vec4(byte1, byte2, byte3, byte4)\n    );\n}\n\n#ifndef RELATIVE_TOLERANCE\n#define RELATIVE_TOLERANCE 0.0001\n#endif\n\nbool isCloseEnough(float a, float b) {\n  return abs(a - b) <= max(abs(a), abs(b)) * RELATIVE_TOLERANCE;\n}\n\nuniform sampler2D textureA;\nuniform sampler2D textureB;\nuniform sampler2D textureC;\nuniform sampler2D textureD;\nuniform sampler2D textureE;\n\nuniform float nodataValue;\nuniform bool littleEndian;\n\nuniform float filterLowA;\nuniform float filterHighA;\nuniform float filterLowB;\nuniform float filterHighB;\nuniform float filterLowC;\nuniform float filterHighC;\nuniform float filterLowD;\nuniform float filterHighD;\nuniform float filterLowE;\nuniform float filterHighE;\nuniform float multiplierA;\nuniform float multiplierB;\nuniform float multiplierC;\nuniform float multiplierD;\nuniform float multiplierE;\n\nvarying vec2 vTexCoordA;\nvarying vec2 vTexCoordB;\nvarying vec2 vTexCoordC;\nvarying vec2 vTexCoordD;\nvarying vec2 vTexCoordE;\n\nvoid main() {\n  vec4 texelRgbaA = texture2D(textureA, vTexCoordA);\n  float texelFloatA = rgbaToFloat(texelRgbaA, littleEndian);\n  vec4 texelRgbaB = texture2D(textureB, vTexCoordB);\n  float texelFloatB = rgbaToFloat(texelRgbaB, littleEndian);\n  vec4 texelRgbaC = texture2D(textureC, vTexCoordC);\n  float texelFloatC = rgbaToFloat(texelRgbaC, littleEndian);\n  vec4 texelRgbaD = texture2D(textureD, vTexCoordD);\n  float texelFloatD = rgbaToFloat(texelRgbaD, littleEndian);\n  vec4 texelRgbaE = texture2D(textureE, vTexCoordE);\n  float texelFloatE = rgbaToFloat(texelRgbaE, littleEndian);\n\n  bool aIsNodata = isCloseEnough(texelFloatA, nodataValue);\n  bool bIsNodata = isCloseEnough(texelFloatB, nodataValue);\n  bool cIsNodata = isCloseEnough(texelFloatC, nodataValue);\n  bool dIsNodata = isCloseEnough(texelFloatD, nodataValue);\n  bool eIsNodata = isCloseEnough(texelFloatE, nodataValue);\n\n  if (aIsNodata || bIsNodata || cIsNodata || dIsNodata || eIsNodata ||\n      texelFloatA < filterLowA || texelFloatA > filterHighA ||\n      texelFloatB < filterLowB || texelFloatB > filterHighB ||\n      texelFloatC < filterLowC || texelFloatC > filterHighC ||\n      texelFloatD < filterLowD || texelFloatD > filterHighD ||\n      texelFloatE < filterLowE || texelFloatE > filterHighE\n      ) {\n    gl_FragColor = floatToRgba(nodataValue, littleEndian);\n  } else {\n    float texelFloatFinal = texelFloatA * multiplierA + texelFloatB * multiplierB + texelFloatC * multiplierC + texelFloatD * multiplierD + texelFloatE * multiplierE;\n    gl_FragColor = floatToRgba(texelFloatFinal, littleEndian);\n  }\n}\n"; // eslint-disable-line

var fragMulti6Calc = "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\n\nprecision highp sampler2D;\n#define GLSLIFY 1\n\n// Denormalize 8-bit color channels to integers in the range 0 to 255.\nivec4 floatsToBytes(vec4 inputFloats, bool littleEndian) {\n  ivec4 bytes = ivec4(inputFloats * 255.0);\n  return (\n    littleEndian\n    ? bytes.abgr\n    : bytes\n  );\n}\n\n// Break the four bytes down into an array of 32 bits.\nvoid bytesToBits(const in ivec4 bytes, out bool bits[32]) {\n  for (int channelIndex = 0; channelIndex < 4; ++channelIndex) {\n    float acc = float(bytes[channelIndex]);\n    for (int indexInByte = 7; indexInByte >= 0; --indexInByte) {\n      float powerOfTwo = exp2(float(indexInByte));\n      bool bit = acc >= powerOfTwo;\n      bits[channelIndex * 8 + (7 - indexInByte)] = bit;\n      acc = mod(acc, powerOfTwo);\n    }\n  }\n}\n\n// Compute the exponent of the 32-bit float.\nfloat getExponent(bool bits[32]) {\n  const int startIndex = 1;\n  const int bitStringLength = 8;\n  const int endBeforeIndex = startIndex + bitStringLength;\n  float acc = 0.0;\n  int pow2 = bitStringLength - 1;\n  for (int bitIndex = startIndex; bitIndex < endBeforeIndex; ++bitIndex) {\n    acc += float(bits[bitIndex]) * exp2(float(pow2--));\n  }\n  return acc;\n}\n\n// Compute the mantissa of the 32-bit float.\nfloat getMantissa(bool bits[32], bool subnormal) {\n  const int startIndex = 9;\n  const int bitStringLength = 23;\n  const int endBeforeIndex = startIndex + bitStringLength;\n  // Leading/implicit/hidden bit convention:\n  // If the number is not subnormal (with exponent 0), we add a leading 1 digit.\n  float acc = float(!subnormal) * exp2(float(bitStringLength));\n  int pow2 = bitStringLength - 1;\n  for (int bitIndex = startIndex; bitIndex < endBeforeIndex; ++bitIndex) {\n    acc += float(bits[bitIndex]) * exp2(float(pow2--));\n  }\n  return acc;\n}\n\n// Parse the float from its 32 bits.\nfloat bitsToFloat(bool bits[32]) {\n  float signBit = float(bits[0]) * -2.0 + 1.0;\n  float exponent = getExponent(bits);\n  bool subnormal = abs(exponent - 0.0) < 0.01;\n  float mantissa = getMantissa(bits, subnormal);\n  float exponentBias = 127.0;\n  return signBit * mantissa * exp2(exponent - exponentBias - 23.0);\n}\n\n// Decode a 32-bit float from the RGBA color channels of a texel.\nfloat rgbaToFloat(vec4 texelRGBA, bool littleEndian) {\n  ivec4 rgbaBytes = floatsToBytes(texelRGBA, littleEndian);\n  bool bits[32];\n  bytesToBits(rgbaBytes, bits);\n  return bitsToFloat(bits);\n}\n\nfloat shiftRight (float v, float amt) {\n  v = floor(v) + 0.5;\n  return floor(v / exp2(amt));\n}\nfloat shiftLeft (float v, float amt) {\n    return floor(v * exp2(amt) + 0.5);\n}\nfloat maskLast (float v, float bits_0) {\n    return mod(v, shiftLeft(1.0, bits_0));\n}\nfloat extractBits (float num, float from, float to) {\n    from = floor(from + 0.5); to = floor(to + 0.5);\n    return maskLast(shiftRight(num, from), to - from);\n}\nvec4 floatToRgba(float texelFloat, bool littleEndian) {\n    if (texelFloat == 0.0) return vec4(0, 0, 0, 0);\n    float sign = texelFloat > 0.0 ? 0.0 : 1.0;\n    texelFloat = abs(texelFloat);\n    float exponent = floor(log2(texelFloat));\n    float biased_exponent = exponent + 127.0;\n    float fraction = ((texelFloat / exp2(exponent)) - 1.0) * 8388608.0;\n    float t = biased_exponent / 2.0;\n    float last_bit_of_biased_exponent = fract(t) * 2.0;\n    float remaining_bits_of_biased_exponent = floor(t);\n    float byte4 = extractBits(fraction, 0.0, 8.0) / 255.0;\n    float byte3 = extractBits(fraction, 8.0, 16.0) / 255.0;\n    float byte2 = (last_bit_of_biased_exponent * 128.0 + extractBits(fraction, 16.0, 23.0)) / 255.0;\n    float byte1 = (sign * 128.0 + remaining_bits_of_biased_exponent) / 255.0;\n    return (\n      littleEndian\n      ? vec4(byte4, byte3, byte2, byte1)\n      : vec4(byte1, byte2, byte3, byte4)\n    );\n}\n\n#ifndef RELATIVE_TOLERANCE\n#define RELATIVE_TOLERANCE 0.0001\n#endif\n\nbool isCloseEnough(float a, float b) {\n  return abs(a - b) <= max(abs(a), abs(b)) * RELATIVE_TOLERANCE;\n}\n\nuniform sampler2D textureA;\nuniform sampler2D textureB;\nuniform sampler2D textureC;\nuniform sampler2D textureD;\nuniform sampler2D textureE;\nuniform sampler2D textureF;\n\nuniform float nodataValue;\nuniform bool littleEndian;\n\nuniform float filterLowA;\nuniform float filterHighA;\nuniform float filterLowB;\nuniform float filterHighB;\nuniform float filterLowC;\nuniform float filterHighC;\nuniform float filterLowD;\nuniform float filterHighD;\nuniform float filterLowE;\nuniform float filterHighE;\nuniform float filterLowF;\nuniform float filterHighF;\nuniform float multiplierA;\nuniform float multiplierB;\nuniform float multiplierC;\nuniform float multiplierD;\nuniform float multiplierE;\nuniform float multiplierF;\n\nvarying vec2 vTexCoordA;\nvarying vec2 vTexCoordB;\nvarying vec2 vTexCoordC;\nvarying vec2 vTexCoordD;\nvarying vec2 vTexCoordE;\nvarying vec2 vTexCoordF;\n\nvoid main() {\n  vec4 texelRgbaA = texture2D(textureA, vTexCoordA);\n  float texelFloatA = rgbaToFloat(texelRgbaA, littleEndian);\n  vec4 texelRgbaB = texture2D(textureB, vTexCoordB);\n  float texelFloatB = rgbaToFloat(texelRgbaB, littleEndian);\n  vec4 texelRgbaC = texture2D(textureC, vTexCoordC);\n  float texelFloatC = rgbaToFloat(texelRgbaC, littleEndian);\n  vec4 texelRgbaD = texture2D(textureD, vTexCoordD);\n  float texelFloatD = rgbaToFloat(texelRgbaD, littleEndian);\n  vec4 texelRgbaE = texture2D(textureE, vTexCoordE);\n  float texelFloatE = rgbaToFloat(texelRgbaE, littleEndian);\n  vec4 texelRgbaF = texture2D(textureF, vTexCoordF);\n  float texelFloatF = rgbaToFloat(texelRgbaF, littleEndian);\n\n  bool aIsNodata = isCloseEnough(texelFloatA, nodataValue);\n  bool bIsNodata = isCloseEnough(texelFloatB, nodataValue);\n  bool cIsNodata = isCloseEnough(texelFloatC, nodataValue);\n  bool dIsNodata = isCloseEnough(texelFloatD, nodataValue);\n  bool eIsNodata = isCloseEnough(texelFloatE, nodataValue);\n  bool fIsNodata = isCloseEnough(texelFloatF, nodataValue);\n\n  if (aIsNodata || bIsNodata || cIsNodata || dIsNodata || eIsNodata || fIsNodata ||\n      texelFloatA < filterLowA || texelFloatA > filterHighA ||\n      texelFloatB < filterLowB || texelFloatB > filterHighB ||\n      texelFloatC < filterLowC || texelFloatC > filterHighC ||\n      texelFloatD < filterLowD || texelFloatD > filterHighD ||\n      texelFloatE < filterLowE || texelFloatE > filterHighE ||\n      texelFloatF < filterLowF || texelFloatF > filterHighF\n      ) {\n    gl_FragColor = floatToRgba(nodataValue, littleEndian);\n  } else {\n    float texelFloatFinal = texelFloatA * multiplierA + texelFloatB * multiplierB + texelFloatC * multiplierC + texelFloatD * multiplierD + texelFloatE * multiplierE + texelFloatF * multiplierF;\n    gl_FragColor = floatToRgba(texelFloatFinal, littleEndian);\n  }\n}\n"; // eslint-disable-line

var fragDiffCalc = "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\n\nprecision highp sampler2D;\n#define GLSLIFY 1\n\n// Denormalize 8-bit color channels to integers in the range 0 to 255.\nivec4 floatsToBytes(vec4 inputFloats, bool littleEndian) {\n  ivec4 bytes = ivec4(inputFloats * 255.0);\n  return (\n    littleEndian\n    ? bytes.abgr\n    : bytes\n  );\n}\n\n// Break the four bytes down into an array of 32 bits.\nvoid bytesToBits(const in ivec4 bytes, out bool bits[32]) {\n  for (int channelIndex = 0; channelIndex < 4; ++channelIndex) {\n    float acc = float(bytes[channelIndex]);\n    for (int indexInByte = 7; indexInByte >= 0; --indexInByte) {\n      float powerOfTwo = exp2(float(indexInByte));\n      bool bit = acc >= powerOfTwo;\n      bits[channelIndex * 8 + (7 - indexInByte)] = bit;\n      acc = mod(acc, powerOfTwo);\n    }\n  }\n}\n\n// Compute the exponent of the 32-bit float.\nfloat getExponent(bool bits[32]) {\n  const int startIndex = 1;\n  const int bitStringLength = 8;\n  const int endBeforeIndex = startIndex + bitStringLength;\n  float acc = 0.0;\n  int pow2 = bitStringLength - 1;\n  for (int bitIndex = startIndex; bitIndex < endBeforeIndex; ++bitIndex) {\n    acc += float(bits[bitIndex]) * exp2(float(pow2--));\n  }\n  return acc;\n}\n\n// Compute the mantissa of the 32-bit float.\nfloat getMantissa(bool bits[32], bool subnormal) {\n  const int startIndex = 9;\n  const int bitStringLength = 23;\n  const int endBeforeIndex = startIndex + bitStringLength;\n  // Leading/implicit/hidden bit convention:\n  // If the number is not subnormal (with exponent 0), we add a leading 1 digit.\n  float acc = float(!subnormal) * exp2(float(bitStringLength));\n  int pow2 = bitStringLength - 1;\n  for (int bitIndex = startIndex; bitIndex < endBeforeIndex; ++bitIndex) {\n    acc += float(bits[bitIndex]) * exp2(float(pow2--));\n  }\n  return acc;\n}\n\n// Parse the float from its 32 bits.\nfloat bitsToFloat(bool bits[32]) {\n  float signBit = float(bits[0]) * -2.0 + 1.0;\n  float exponent = getExponent(bits);\n  bool subnormal = abs(exponent - 0.0) < 0.01;\n  float mantissa = getMantissa(bits, subnormal);\n  float exponentBias = 127.0;\n  return signBit * mantissa * exp2(exponent - exponentBias - 23.0);\n}\n\n// Decode a 32-bit float from the RGBA color channels of a texel.\nfloat rgbaToFloat(vec4 texelRGBA, bool littleEndian) {\n  ivec4 rgbaBytes = floatsToBytes(texelRGBA, littleEndian);\n  bool bits[32];\n  bytesToBits(rgbaBytes, bits);\n  return bitsToFloat(bits);\n}\n\nfloat shiftRight (float v, float amt) {\n  v = floor(v) + 0.5;\n  return floor(v / exp2(amt));\n}\nfloat shiftLeft (float v, float amt) {\n    return floor(v * exp2(amt) + 0.5);\n}\nfloat maskLast (float v, float bits_0) {\n    return mod(v, shiftLeft(1.0, bits_0));\n}\nfloat extractBits (float num, float from, float to) {\n    from = floor(from + 0.5); to = floor(to + 0.5);\n    return maskLast(shiftRight(num, from), to - from);\n}\nvec4 floatToRgba(float texelFloat, bool littleEndian) {\n    if (texelFloat == 0.0) return vec4(0, 0, 0, 0);\n    float sign = texelFloat > 0.0 ? 0.0 : 1.0;\n    texelFloat = abs(texelFloat);\n    float exponent = floor(log2(texelFloat));\n    float biased_exponent = exponent + 127.0;\n    float fraction = ((texelFloat / exp2(exponent)) - 1.0) * 8388608.0;\n    float t = biased_exponent / 2.0;\n    float last_bit_of_biased_exponent = fract(t) * 2.0;\n    float remaining_bits_of_biased_exponent = floor(t);\n    float byte4 = extractBits(fraction, 0.0, 8.0) / 255.0;\n    float byte3 = extractBits(fraction, 8.0, 16.0) / 255.0;\n    float byte2 = (last_bit_of_biased_exponent * 128.0 + extractBits(fraction, 16.0, 23.0)) / 255.0;\n    float byte1 = (sign * 128.0 + remaining_bits_of_biased_exponent) / 255.0;\n    return (\n      littleEndian\n      ? vec4(byte4, byte3, byte2, byte1)\n      : vec4(byte1, byte2, byte3, byte4)\n    );\n}\n\n#ifndef RELATIVE_TOLERANCE\n#define RELATIVE_TOLERANCE 0.0001\n#endif\n\nbool isCloseEnough(float a, float b) {\n  return abs(a - b) <= max(abs(a), abs(b)) * RELATIVE_TOLERANCE;\n}\n\nuniform float nodataValue;\nuniform bool littleEndian;\nuniform sampler2D textureA;\nuniform sampler2D textureB;\n\nvarying vec2 vTexCoordA;\nvarying vec2 vTexCoordB;\n\nvoid main() {\n  vec4 texelRgbaA = texture2D(textureA, vTexCoordA);\n  float texelFloatA = rgbaToFloat(texelRgbaA, littleEndian);\n  vec4 texelRgbaB = texture2D(textureB, vTexCoordB);\n  float texelFloatB = rgbaToFloat(texelRgbaB, littleEndian);\n  bool aIsNodata = isCloseEnough(texelFloatA, nodataValue);\n  bool bIsNodata = isCloseEnough(texelFloatB, nodataValue);\n\n  if (aIsNodata || bIsNodata) {\n    gl_FragColor = floatToRgba(nodataValue, littleEndian);\n  } else {\n    float diff = texelFloatB - texelFloatA;\n    gl_FragColor = floatToRgba(diff, littleEndian);\n  }\n}\n"; // eslint-disable-line

var fragConvertDem = "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#define GLSLIFY 1\n#endif\n\nfloat shiftRight (float v, float amt) {\n  v = floor(v) + 0.5;\n  return floor(v / exp2(amt));\n}\nfloat shiftLeft (float v, float amt) {\n    return floor(v * exp2(amt) + 0.5);\n}\nfloat maskLast (float v, float bits) {\n    return mod(v, shiftLeft(1.0, bits));\n}\nfloat extractBits (float num, float from, float to) {\n    from = floor(from + 0.5); to = floor(to + 0.5);\n    return maskLast(shiftRight(num, from), to - from);\n}\nvec4 floatToRgba(float texelFloat, bool littleEndian) {\n    if (texelFloat == 0.0) return vec4(0, 0, 0, 0);\n    float sign = texelFloat > 0.0 ? 0.0 : 1.0;\n    texelFloat = abs(texelFloat);\n    float exponent = floor(log2(texelFloat));\n    float biased_exponent = exponent + 127.0;\n    float fraction = ((texelFloat / exp2(exponent)) - 1.0) * 8388608.0;\n    float t = biased_exponent / 2.0;\n    float last_bit_of_biased_exponent = fract(t) * 2.0;\n    float remaining_bits_of_biased_exponent = floor(t);\n    float byte4 = extractBits(fraction, 0.0, 8.0) / 255.0;\n    float byte3 = extractBits(fraction, 8.0, 16.0) / 255.0;\n    float byte2 = (last_bit_of_biased_exponent * 128.0 + extractBits(fraction, 16.0, 23.0)) / 255.0;\n    float byte1 = (sign * 128.0 + remaining_bits_of_biased_exponent) / 255.0;\n    return (\n      littleEndian\n      ? vec4(byte4, byte3, byte2, byte1)\n      : vec4(byte1, byte2, byte3, byte4)\n    );\n}\n\nuniform float nodataValue;\nuniform bool littleEndian;\nuniform sampler2D texture;\nvarying vec2 vTexCoord;\n\nvoid main() {\n  //sample the texture\n  vec3 rgb = texture2D(texture, vTexCoord).rgb;\n\n  // Convert the red, green, and blue channels into a float\n  float f = -10000.0 + ((rgb.r * 255.0 * 256.0 * 256.0 + rgb.g * 255.0 * 256.0 + rgb.b * 255.0) * 0.1);\n\n  // convert to rgba and write to framebuffer\n  gl_FragColor = floatToRgba(f, littleEndian);\n}\n"; // eslint-disable-line

var fragDrawResult = "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#define GLSLIFY 1\n#endif\n\n#define TRANSPARENT vec4(0.0)\n\n#ifndef RELATIVE_TOLERANCE\n#define RELATIVE_TOLERANCE 0.0001\n#endif\n\nbool isCloseEnough(float a, float b) {\n  return abs(a - b) <= max(abs(a), abs(b)) * RELATIVE_TOLERANCE;\n}\n\n// Denormalize 8-bit color channels to integers in the range 0 to 255.\nivec4 floatsToBytes(vec4 inputFloats, bool littleEndian) {\n  ivec4 bytes = ivec4(inputFloats * 255.0);\n  return (\n    littleEndian\n    ? bytes.abgr\n    : bytes\n  );\n}\n\n// Break the four bytes down into an array of 32 bits.\nvoid bytesToBits(const in ivec4 bytes, out bool bits[32]) {\n  for (int channelIndex = 0; channelIndex < 4; ++channelIndex) {\n    float acc = float(bytes[channelIndex]);\n    for (int indexInByte = 7; indexInByte >= 0; --indexInByte) {\n      float powerOfTwo = exp2(float(indexInByte));\n      bool bit = acc >= powerOfTwo;\n      bits[channelIndex * 8 + (7 - indexInByte)] = bit;\n      acc = mod(acc, powerOfTwo);\n    }\n  }\n}\n\n// Compute the exponent of the 32-bit float.\nfloat getExponent(bool bits[32]) {\n  const int startIndex = 1;\n  const int bitStringLength = 8;\n  const int endBeforeIndex = startIndex + bitStringLength;\n  float acc = 0.0;\n  int pow2 = bitStringLength - 1;\n  for (int bitIndex = startIndex; bitIndex < endBeforeIndex; ++bitIndex) {\n    acc += float(bits[bitIndex]) * exp2(float(pow2--));\n  }\n  return acc;\n}\n\n// Compute the mantissa of the 32-bit float.\nfloat getMantissa(bool bits[32], bool subnormal) {\n  const int startIndex = 9;\n  const int bitStringLength = 23;\n  const int endBeforeIndex = startIndex + bitStringLength;\n  // Leading/implicit/hidden bit convention:\n  // If the number is not subnormal (with exponent 0), we add a leading 1 digit.\n  float acc = float(!subnormal) * exp2(float(bitStringLength));\n  int pow2 = bitStringLength - 1;\n  for (int bitIndex = startIndex; bitIndex < endBeforeIndex; ++bitIndex) {\n    acc += float(bits[bitIndex]) * exp2(float(pow2--));\n  }\n  return acc;\n}\n\n// Parse the float from its 32 bits.\nfloat bitsToFloat(bool bits[32]) {\n  float signBit = float(bits[0]) * -2.0 + 1.0;\n  float exponent = getExponent(bits);\n  bool subnormal = abs(exponent - 0.0) < 0.01;\n  float mantissa = getMantissa(bits, subnormal);\n  float exponentBias = 127.0;\n  return signBit * mantissa * exp2(exponent - exponentBias - 23.0);\n}\n\n// Decode a 32-bit float from the RGBA color channels of a texel.\nfloat rgbaToFloat(vec4 texelRGBA, bool littleEndian) {\n  ivec4 rgbaBytes = floatsToBytes(texelRGBA, littleEndian);\n  bool bits[32];\n  bytesToBits(rgbaBytes, bits);\n  return bitsToFloat(bits);\n}\n\n#ifndef DEFAULT_COLOR\n#define DEFAULT_COLOR vec4(0.0)\n#endif\n\n#ifndef SCALE_MAX_LENGTH\n#define SCALE_MAX_LENGTH 16\n#endif\n\n#ifndef SENTINEL_MAX_LENGTH\n#define SENTINEL_MAX_LENGTH 16\n#endif\n\nvec4 computeColor(\n  float inputVal,\n  sampler2D scaleColormap,\n  sampler2D sentinelColormap,\n  int scaleLength,\n  int sentinelLength,\n  bool littleEndian\n) {\n\n  // vertical texture coordinate to find color and offset\n  float colorRow = 0.25;\n  float offsetRow = 0.75;\n\n  // Compare the value against any sentinel values, if defined.\n  if (sentinelLength > 0) {\n    for (int i = 0; i < SENTINEL_MAX_LENGTH; ++i) {\n      if (i == sentinelLength) {\n        break;\n      }\n\n      float i_f = float(i);\n      float sentinelLengthFloat = float(sentinelLength);\n      // retrieve the offset from the colormap\n      vec4 offsetRgba = texture2D(sentinelColormap, vec2((i_f + 0.5) / sentinelLengthFloat, offsetRow));\n      float sentinelOffset = rgbaToFloat(offsetRgba, littleEndian);\n      if (isCloseEnough(inputVal, sentinelOffset)) {\n        // retrieve the color from the colormap\n        vec2 colormapCoord = vec2((i_f + 0.5) / sentinelLengthFloat, colorRow);\n        return texture2D(sentinelColormap, colormapCoord);\n      }\n    }\n  }\n\n  // Do linear interpolation using the color scale, if defined.\n  if (scaleLength > 0) {\n    // If value below color scale range, clamp to lowest color stop.\n    vec4 scaleOffsetLowestRgba = texture2D(scaleColormap, vec2(0.0, offsetRow));\n    float scaleOffsetLowest = rgbaToFloat(scaleOffsetLowestRgba, littleEndian);\n    vec4 scaleOffsetHighestRgba = texture2D(scaleColormap, vec2(1.0, offsetRow));\n    float scaleOffsetHighest = rgbaToFloat(scaleOffsetHighestRgba, littleEndian);\n    if (inputVal < scaleOffsetLowest) {\n      return texture2D(scaleColormap, vec2(0.0, colorRow));\n    } else if (inputVal > scaleOffsetHighest) {\n      return texture2D(scaleColormap, vec2(1.0, colorRow));\n    } else {\n      for (int i = 0; i < SCALE_MAX_LENGTH; ++i) {\n        float i_f = float(i);\n        float scaleLengthFloat = float(scaleLength);\n\n        // If value above color scale range, clamp to highest color stop.\n        if (i == scaleLength) {\n          return texture2D(sentinelColormap, vec2((scaleLengthFloat - 0.5) / scaleLengthFloat, colorRow));\n        }\n        \n        vec4 scaleOffsetNextRgba = texture2D(scaleColormap, vec2((i_f + 1.0 + 0.5) / scaleLengthFloat, offsetRow));\n        float scaleOffsetNext = rgbaToFloat(scaleOffsetNextRgba, littleEndian);\n\n        if (inputVal <= scaleOffsetNext) {\n          vec4 scaleOffsetRgba = texture2D(scaleColormap, vec2((i_f + 0.5) / scaleLengthFloat, offsetRow));\n          float scaleOffset = rgbaToFloat(scaleOffsetRgba, littleEndian);\n          float percent = (inputVal - scaleOffset)\n            / (scaleOffsetNext - scaleOffset);\n          vec4 colorLow = texture2D(scaleColormap, vec2((i_f + 0.5) / scaleLengthFloat, colorRow));\n          vec4 colorHigh = texture2D(scaleColormap, vec2((i_f + 1.0 + 0.5) / scaleLengthFloat, colorRow));\n          return mix(colorLow, colorHigh, percent);\n        } \n      }\n    }\n  }\n\n  return DEFAULT_COLOR;\n}\n\nfloat getTexelValue(vec2 pos, sampler2D texture, bool littleEndian) {\n  vec4 texelRgba = texture2D(texture, pos);\n  float texelFloat = rgbaToFloat(texelRgba, littleEndian);\n  return texelFloat;\n}\n\nuniform int scaleLength;\nuniform int sentinelLength;\nuniform sampler2D scaleColormap;\nuniform sampler2D sentinelColormap;\n\nuniform float nodataValue;\nuniform sampler2D texture;\nuniform bool littleEndian;\n\nvarying vec2 vTexCoord;\n\nvoid main() {\n  float f = getTexelValue(vTexCoord, texture, littleEndian);\n\n  if (isCloseEnough(f, nodataValue)) {\n    gl_FragColor = TRANSPARENT;\n  } else {\n    gl_FragColor = computeColor(\n      f,\n      scaleColormap,\n      sentinelColormap,\n      scaleLength,\n      sentinelLength,\n      littleEndian\n    );\n  }\n}\n"; // eslint-disable-line

var fragConvolutionSmooth = "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#define GLSLIFY 1\n#define GLSLIFY 1\n#endif\n\n// Denormalize 8-bit color channels to integers in the range 0 to 255.\nivec4 floatsToBytes(vec4 inputFloats, bool littleEndian) {\n  ivec4 bytes = ivec4(inputFloats * 255.0);\n  return (\n    littleEndian\n    ? bytes.abgr\n    : bytes\n  );\n}\n\n// Break the four bytes down into an array of 32 bits.\nvoid bytesToBits(const in ivec4 bytes, out bool bits[32]) {\n  for (int channelIndex = 0; channelIndex < 4; ++channelIndex) {\n    float acc = float(bytes[channelIndex]);\n    for (int indexInByte = 7; indexInByte >= 0; --indexInByte) {\n      float powerOfTwo = exp2(float(indexInByte));\n      bool bit = acc >= powerOfTwo;\n      bits[channelIndex * 8 + (7 - indexInByte)] = bit;\n      acc = mod(acc, powerOfTwo);\n    }\n  }\n}\n\n// Compute the exponent of the 32-bit float.\nfloat getExponent(bool bits[32]) {\n  const int startIndex = 1;\n  const int bitStringLength = 8;\n  const int endBeforeIndex = startIndex + bitStringLength;\n  float acc = 0.0;\n  int pow2 = bitStringLength - 1;\n  for (int bitIndex = startIndex; bitIndex < endBeforeIndex; ++bitIndex) {\n    acc += float(bits[bitIndex]) * exp2(float(pow2--));\n  }\n  return acc;\n}\n\n// Compute the mantissa of the 32-bit float.\nfloat getMantissa(bool bits[32], bool subnormal) {\n  const int startIndex = 9;\n  const int bitStringLength = 23;\n  const int endBeforeIndex = startIndex + bitStringLength;\n  // Leading/implicit/hidden bit convention:\n  // If the number is not subnormal (with exponent 0), we add a leading 1 digit.\n  float acc = float(!subnormal) * exp2(float(bitStringLength));\n  int pow2 = bitStringLength - 1;\n  for (int bitIndex = startIndex; bitIndex < endBeforeIndex; ++bitIndex) {\n    acc += float(bits[bitIndex]) * exp2(float(pow2--));\n  }\n  return acc;\n}\n\n// Parse the float from its 32 bits.\nfloat bitsToFloat(bool bits[32]) {\n  float signBit = float(bits[0]) * -2.0 + 1.0;\n  float exponent = getExponent(bits);\n  bool subnormal = abs(exponent - 0.0) < 0.01;\n  float mantissa = getMantissa(bits, subnormal);\n  float exponentBias = 127.0;\n  return signBit * mantissa * exp2(exponent - exponentBias - 23.0);\n}\n\n// Decode a 32-bit float from the RGBA color channels of a texel.\nfloat rgbaToFloat(vec4 texelRGBA, bool littleEndian) {\n  ivec4 rgbaBytes = floatsToBytes(texelRGBA, littleEndian);\n  bool bits[32];\n  bytesToBits(rgbaBytes, bits);\n  return bitsToFloat(bits);\n}\n\nfloat shiftRight (float v, float amt) {\n  v = floor(v) + 0.5;\n  return floor(v / exp2(amt));\n}\nfloat shiftLeft (float v, float amt) {\n    return floor(v * exp2(amt) + 0.5);\n}\nfloat maskLast (float v, float bits_0) {\n    return mod(v, shiftLeft(1.0, bits_0));\n}\nfloat extractBits (float num, float from, float to) {\n    from = floor(from + 0.5); to = floor(to + 0.5);\n    return maskLast(shiftRight(num, from), to - from);\n}\nvec4 floatToRgba(float texelFloat, bool littleEndian) {\n    if (texelFloat == 0.0) return vec4(0, 0, 0, 0);\n    float sign = texelFloat > 0.0 ? 0.0 : 1.0;\n    texelFloat = abs(texelFloat);\n    float exponent = floor(log2(texelFloat));\n    float biased_exponent = exponent + 127.0;\n    float fraction = ((texelFloat / exp2(exponent)) - 1.0) * 8388608.0;\n    float t = biased_exponent / 2.0;\n    float last_bit_of_biased_exponent = fract(t) * 2.0;\n    float remaining_bits_of_biased_exponent = floor(t);\n    float byte4 = extractBits(fraction, 0.0, 8.0) / 255.0;\n    float byte3 = extractBits(fraction, 8.0, 16.0) / 255.0;\n    float byte2 = (last_bit_of_biased_exponent * 128.0 + extractBits(fraction, 16.0, 23.0)) / 255.0;\n    float byte1 = (sign * 128.0 + remaining_bits_of_biased_exponent) / 255.0;\n    return (\n      littleEndian\n      ? vec4(byte4, byte3, byte2, byte1)\n      : vec4(byte1, byte2, byte3, byte4)\n    );\n}\n\n#ifndef RELATIVE_TOLERANCE\n#define RELATIVE_TOLERANCE 0.0001\n#endif\n\nbool isCloseEnough(float a, float b) {\n  return abs(a - b) <= max(abs(a), abs(b)) * RELATIVE_TOLERANCE;\n}\n\nuniform sampler2D texture;\nuniform float textureSize;\nuniform bool littleEndian;\nuniform float nodataValue;\nvarying vec2 vTexCoord;\nuniform int kernelSize;\n\nint kernelEnd = int(kernelSize/2);\nint kernelStart = kernelEnd * -1;\n\nfloat getTexelValue(vec2 pos) {\n  vec4 texelRgba = texture2D(texture, pos);\n  float texelFloat = rgbaToFloat(texelRgba, littleEndian);\n  return texelFloat;\n}\n\nfloat runConvKernel(vec2 pos, vec2 onePixel) {\n  float convKernelWeight = 0.0;\n  float sum = 0.0;\n\n  for (int i = -20; i < 20; i ++) {\n    if (i < kernelStart) continue;\n    if (i > kernelEnd) break;\n    for (int j = -20; j < 20; j ++) {\n      if (j < kernelStart) continue;\n      if (j > kernelEnd) break;\n      float texelValue = getTexelValue(pos + onePixel * vec2(i, j));\n      if (!isCloseEnough(texelValue, nodataValue)) {\n        sum = sum + texelValue;\n        convKernelWeight = convKernelWeight + 1.0;\n      }\n    }\n  }\n  return (sum / convKernelWeight);\n}\n\nvoid main() {\n  float texelFloat = getTexelValue(vTexCoord);\n  if (isCloseEnough(texelFloat, nodataValue)) {\n    gl_FragColor = floatToRgba(nodataValue, littleEndian);\n  } else {\n    vec2 onePixel = vec2(1.0, 1.0) / textureSize;\n    float texelFloatSmoothed = runConvKernel(vTexCoord, onePixel);\n    gl_FragColor = floatToRgba(texelFloatSmoothed, littleEndian);\n  }\n}\n"; // eslint-disable-line

var fragHsAdvMergeAndScaleTiles = "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#define GLSLIFY 1\n#endif\n\n#ifndef RELATIVE_TOLERANCE\n#define RELATIVE_TOLERANCE 0.0001\n#endif\n\nbool isCloseEnough(float a, float b) {\n  return abs(a - b) <= max(abs(a), abs(b)) * RELATIVE_TOLERANCE;\n}\n\n// Denormalize 8-bit color channels to integers in the range 0 to 255.\nivec4 floatsToBytes(vec4 inputFloats, bool littleEndian) {\n  ivec4 bytes = ivec4(inputFloats * 255.0);\n  return (\n    littleEndian\n    ? bytes.abgr\n    : bytes\n  );\n}\n\n// Break the four bytes down into an array of 32 bits.\nvoid bytesToBits(const in ivec4 bytes, out bool bits[32]) {\n  for (int channelIndex = 0; channelIndex < 4; ++channelIndex) {\n    float acc = float(bytes[channelIndex]);\n    for (int indexInByte = 7; indexInByte >= 0; --indexInByte) {\n      float powerOfTwo = exp2(float(indexInByte));\n      bool bit = acc >= powerOfTwo;\n      bits[channelIndex * 8 + (7 - indexInByte)] = bit;\n      acc = mod(acc, powerOfTwo);\n    }\n  }\n}\n\n// Compute the exponent of the 32-bit float.\nfloat getExponent(bool bits[32]) {\n  const int startIndex = 1;\n  const int bitStringLength = 8;\n  const int endBeforeIndex = startIndex + bitStringLength;\n  float acc = 0.0;\n  int pow2 = bitStringLength - 1;\n  for (int bitIndex = startIndex; bitIndex < endBeforeIndex; ++bitIndex) {\n    acc += float(bits[bitIndex]) * exp2(float(pow2--));\n  }\n  return acc;\n}\n\n// Compute the mantissa of the 32-bit float.\nfloat getMantissa(bool bits[32], bool subnormal) {\n  const int startIndex = 9;\n  const int bitStringLength = 23;\n  const int endBeforeIndex = startIndex + bitStringLength;\n  // Leading/implicit/hidden bit convention:\n  // If the number is not subnormal (with exponent 0), we add a leading 1 digit.\n  float acc = float(!subnormal) * exp2(float(bitStringLength));\n  int pow2 = bitStringLength - 1;\n  for (int bitIndex = startIndex; bitIndex < endBeforeIndex; ++bitIndex) {\n    acc += float(bits[bitIndex]) * exp2(float(pow2--));\n  }\n  return acc;\n}\n\n// Parse the float from its 32 bits.\nfloat bitsToFloat(bool bits[32]) {\n  float signBit = float(bits[0]) * -2.0 + 1.0;\n  float exponent = getExponent(bits);\n  bool subnormal = abs(exponent - 0.0) < 0.01;\n  float mantissa = getMantissa(bits, subnormal);\n  float exponentBias = 127.0;\n  return signBit * mantissa * exp2(exponent - exponentBias - 23.0);\n}\n\n// Decode a 32-bit float from the RGBA color channels of a texel.\nfloat rgbaToFloat(vec4 texelRGBA, bool littleEndian) {\n  ivec4 rgbaBytes = floatsToBytes(texelRGBA, littleEndian);\n  bool bits[32];\n  bytesToBits(rgbaBytes, bits);\n  return bitsToFloat(bits);\n}\n\nfloat getTexelValue(vec2 pos, sampler2D texture, bool littleEndian) {\n  vec4 texelRgba = texture2D(texture, pos);\n  float texelFloat = rgbaToFloat(texelRgba, littleEndian);\n  return texelFloat;\n}\n\nuniform float nodataValue;\nuniform bool littleEndian;\nuniform sampler2D texture;\nuniform float floatScale;\nvarying vec2 vTexCoord;\n\nvoid main() {\n  float f = getTexelValue(vTexCoord, texture, littleEndian);\n\n  if (isCloseEnough(f, nodataValue)) {\n    gl_FragColor = vec4(nodataValue);\n  } else {\n    // Scale the input value and write to framebuffer\n    gl_FragColor = vec4(f * floatScale);\n  }\n}"; // eslint-disable-line

var fragHsAdvNormals = "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#define GLSLIFY 1\n#endif\n\nuniform float nodataValue;\nuniform bool littleEndian;\nuniform sampler2D tInput;\nuniform float pixelScale;\nuniform float onePixel;\nvarying vec2 vTexCoord;\n\nvoid main() {\n  float p0 = texture2D(tInput, vTexCoord).r;\n  float px = texture2D(tInput, vec2(vTexCoord.x + onePixel, vTexCoord.y)).r;\n  float py = texture2D(tInput, vec2(vTexCoord.x, vTexCoord.y  + onePixel)).r;\n  vec3 dx = vec3(pixelScale, 0.0, px - p0);\n  vec3 dy = vec3(0.0, pixelScale, py - p0);\n  vec3 n = normalize(cross(dx, dy));\n\n  gl_FragColor = vec4(n, 1.0);\n  // gl_FragColor = vec4(0.5 * n + 0.5, 1.0); // to show\n}"; // eslint-disable-line

var fragHsAdvDirectLight = "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#define GLSLIFY 1\n#endif\n\n#ifndef RELATIVE_TOLERANCE\n#define RELATIVE_TOLERANCE 0.0001\n#endif\n\nbool isCloseEnough(float a, float b) {\n  return abs(a - b) <= max(abs(a), abs(b)) * RELATIVE_TOLERANCE;\n}\n\n// Denormalize 8-bit color channels to integers in the range 0 to 255.\nivec4 floatsToBytes(vec4 inputFloats, bool littleEndian) {\n  ivec4 bytes = ivec4(inputFloats * 255.0);\n  return (\n    littleEndian\n    ? bytes.abgr\n    : bytes\n  );\n}\n\n// Break the four bytes down into an array of 32 bits.\nvoid bytesToBits(const in ivec4 bytes, out bool bits[32]) {\n  for (int channelIndex = 0; channelIndex < 4; ++channelIndex) {\n    float acc = float(bytes[channelIndex]);\n    for (int indexInByte = 7; indexInByte >= 0; --indexInByte) {\n      float powerOfTwo = exp2(float(indexInByte));\n      bool bit = acc >= powerOfTwo;\n      bits[channelIndex * 8 + (7 - indexInByte)] = bit;\n      acc = mod(acc, powerOfTwo);\n    }\n  }\n}\n\n// Compute the exponent of the 32-bit float.\nfloat getExponent(bool bits[32]) {\n  const int startIndex = 1;\n  const int bitStringLength = 8;\n  const int endBeforeIndex = startIndex + bitStringLength;\n  float acc = 0.0;\n  int pow2 = bitStringLength - 1;\n  for (int bitIndex = startIndex; bitIndex < endBeforeIndex; ++bitIndex) {\n    acc += float(bits[bitIndex]) * exp2(float(pow2--));\n  }\n  return acc;\n}\n\n// Compute the mantissa of the 32-bit float.\nfloat getMantissa(bool bits[32], bool subnormal) {\n  const int startIndex = 9;\n  const int bitStringLength = 23;\n  const int endBeforeIndex = startIndex + bitStringLength;\n  // Leading/implicit/hidden bit convention:\n  // If the number is not subnormal (with exponent 0), we add a leading 1 digit.\n  float acc = float(!subnormal) * exp2(float(bitStringLength));\n  int pow2 = bitStringLength - 1;\n  for (int bitIndex = startIndex; bitIndex < endBeforeIndex; ++bitIndex) {\n    acc += float(bits[bitIndex]) * exp2(float(pow2--));\n  }\n  return acc;\n}\n\n// Parse the float from its 32 bits.\nfloat bitsToFloat(bool bits[32]) {\n  float signBit = float(bits[0]) * -2.0 + 1.0;\n  float exponent = getExponent(bits);\n  bool subnormal = abs(exponent - 0.0) < 0.01;\n  float mantissa = getMantissa(bits, subnormal);\n  float exponentBias = 127.0;\n  return signBit * mantissa * exp2(exponent - exponentBias - 23.0);\n}\n\n// Decode a 32-bit float from the RGBA color channels of a texel.\nfloat rgbaToFloat(vec4 texelRGBA, bool littleEndian) {\n  ivec4 rgbaBytes = floatsToBytes(texelRGBA, littleEndian);\n  bool bits[32];\n  bytesToBits(rgbaBytes, bits);\n  return bitsToFloat(bits);\n}\n\n#ifndef DEFAULT_COLOR\n#define DEFAULT_COLOR vec4(0.0)\n#endif\n\n#ifndef SCALE_MAX_LENGTH\n#define SCALE_MAX_LENGTH 16\n#endif\n\n#ifndef SENTINEL_MAX_LENGTH\n#define SENTINEL_MAX_LENGTH 16\n#endif\n\nvec4 computeColor(\n  float inputVal,\n  sampler2D scaleColormap,\n  sampler2D sentinelColormap,\n  int scaleLength,\n  int sentinelLength,\n  bool littleEndian\n) {\n\n  // vertical texture coordinate to find color and offset\n  float colorRow = 0.25;\n  float offsetRow = 0.75;\n\n  // Compare the value against any sentinel values, if defined.\n  if (sentinelLength > 0) {\n    for (int i = 0; i < SENTINEL_MAX_LENGTH; ++i) {\n      if (i == sentinelLength) {\n        break;\n      }\n\n      float i_f = float(i);\n      float sentinelLengthFloat = float(sentinelLength);\n      // retrieve the offset from the colormap\n      vec4 offsetRgba = texture2D(sentinelColormap, vec2((i_f + 0.5) / sentinelLengthFloat, offsetRow));\n      float sentinelOffset = rgbaToFloat(offsetRgba, littleEndian);\n      if (isCloseEnough(inputVal, sentinelOffset)) {\n        // retrieve the color from the colormap\n        vec2 colormapCoord = vec2((i_f + 0.5) / sentinelLengthFloat, colorRow);\n        return texture2D(sentinelColormap, colormapCoord);\n      }\n    }\n  }\n\n  // Do linear interpolation using the color scale, if defined.\n  if (scaleLength > 0) {\n    // If value below color scale range, clamp to lowest color stop.\n    vec4 scaleOffsetLowestRgba = texture2D(scaleColormap, vec2(0.0, offsetRow));\n    float scaleOffsetLowest = rgbaToFloat(scaleOffsetLowestRgba, littleEndian);\n    vec4 scaleOffsetHighestRgba = texture2D(scaleColormap, vec2(1.0, offsetRow));\n    float scaleOffsetHighest = rgbaToFloat(scaleOffsetHighestRgba, littleEndian);\n    if (inputVal < scaleOffsetLowest) {\n      return texture2D(scaleColormap, vec2(0.0, colorRow));\n    } else if (inputVal > scaleOffsetHighest) {\n      return texture2D(scaleColormap, vec2(1.0, colorRow));\n    } else {\n      for (int i = 0; i < SCALE_MAX_LENGTH; ++i) {\n        float i_f = float(i);\n        float scaleLengthFloat = float(scaleLength);\n\n        // If value above color scale range, clamp to highest color stop.\n        if (i == scaleLength) {\n          return texture2D(sentinelColormap, vec2((scaleLengthFloat - 0.5) / scaleLengthFloat, colorRow));\n        }\n        \n        vec4 scaleOffsetNextRgba = texture2D(scaleColormap, vec2((i_f + 1.0 + 0.5) / scaleLengthFloat, offsetRow));\n        float scaleOffsetNext = rgbaToFloat(scaleOffsetNextRgba, littleEndian);\n\n        if (inputVal <= scaleOffsetNext) {\n          vec4 scaleOffsetRgba = texture2D(scaleColormap, vec2((i_f + 0.5) / scaleLengthFloat, offsetRow));\n          float scaleOffset = rgbaToFloat(scaleOffsetRgba, littleEndian);\n          float percent = (inputVal - scaleOffset)\n            / (scaleOffsetNext - scaleOffset);\n          vec4 colorLow = texture2D(scaleColormap, vec2((i_f + 0.5) / scaleLengthFloat, colorRow));\n          vec4 colorHigh = texture2D(scaleColormap, vec2((i_f + 1.0 + 0.5) / scaleLengthFloat, colorRow));\n          return mix(colorLow, colorHigh, percent);\n        } \n      }\n    }\n  }\n\n  return DEFAULT_COLOR;\n}\n\nuniform sampler2D tInput;\nuniform sampler2D tNormal;\nuniform float floatScale;\nuniform vec3 sunDirection;\nuniform float nodataValue;\nuniform bool littleEndian;\nvarying vec2 vTexCoord;\n\nuniform int scaleLength;\nuniform int sentinelLength;\nuniform sampler2D scaleColormap;\nuniform sampler2D sentinelColormap;\n\nvoid main() {\n  float f = texture2D(tInput, vTexCoord).r;\n\n  if (isCloseEnough(f, nodataValue)) {\n    // discard;\n    gl_FragColor = vec4(0.0);\n  } else {\n    vec4 clr = computeColor(\n      f / floatScale,\n      scaleColormap,\n      sentinelColormap,\n      scaleLength,\n      sentinelLength,\n      littleEndian\n    );\n\n    vec3 n = texture2D(tNormal, vTexCoord).rgb;\n\n    // light intensity that varies on the range  [−1..1]\n    float light = dot(n, sunDirection);\n    // transform the light intensity to the range [0..1]\n    light = 0.5 * light + 0.5;\n\n    // gl_FragColor = vec4(l, l, l, 1.0); // to show light\n\n    vec3 color = light * pow(clr.rgb, vec3(2.0));\n    color = pow(color, vec3(1.0/2.2));\n    gl_FragColor = vec4(color, 1.0);\n  }\n}\n"; // eslint-disable-line

var fragHsAdvSoftShadows = "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#define GLSLIFY 1\n#endif\n\nuniform sampler2D tInput;\nuniform sampler2D tNormal;\nuniform sampler2D tSrc;\nuniform vec3 sunDirection;\nuniform vec2 resolution;\nuniform float pixelScale;\nuniform float softIterations;\nvarying vec2 vTexCoord;\n\nvoid main() {\n  vec2 ires = 1.0 / resolution;\n  vec3 src = texture2D(tSrc, gl_FragCoord.xy * ires).rgb;\n  vec4 e0 = texture2D(tInput, vTexCoord);\n  vec3 n0 = texture2D(tNormal, vTexCoord).rgb;\n\n  // get 2D ray direction\n  vec2 sr = normalize(sunDirection.xy);\n\n  // initialize pixel traversal algorithm\n  vec2 p0 = vTexCoord * resolution;\n  vec2 p = floor(p0); // pixel we are starting in\n  vec2 stp = sign(sr);\n\n  // how far we need to travel in our ray direction to intersect the next pixel\n  // in the x- and y- directions\n  vec2 tMax = step(0.0, sr) * (1.0 - fract(p0)) + (1.0 - step(0.0, sr)) * fract(p0);\n  tMax /= abs(sr);\n  // how far must we travel along our ray to cover the width and height of a pixel\n  vec2 tDelta = 1.0 / abs(sr);\n\n  // pixel traversal routine\n  for (int i = 0; i < 65536; i++) {\n    if (tMax.x < tMax.y) {\n      tMax.x += tDelta.x;\n      p.x += stp.x;\n    } else {\n      tMax.y += tDelta.y;\n      p.y += stp.y;\n    }\n\n    // normalized texture coordinate for the center of the current pixel\n    vec2 ptex = ires * (p + 0.5);\n\n    // If we left the tile: add some illumination to the pixel for this iteration and stop traversing\n    if (ptex.x < 0.0 || ptex.x > 1.0 || ptex.y < 0.0 || ptex.y > 1.0) {\n      // illumination of this single ray\n      vec3 illumination = vec3(1.0/softIterations) * clamp(dot(n0, sunDirection), 0.0, 1.0);\n      // add illumination of this ray to result of previous iteration\n      gl_FragColor = vec4(src + illumination, 1.0);\n      return;\n    }\n\n    // elevation/value at current pixel\n    vec4 e = texture2D(tInput, ptex);\n    // time we have traveled along the 2D ray\n    float time = distance(p + 0.5, p0);\n    // elevation along our original 3D ray at the current point\n    float z = e0.r + time * pixelScale * sunDirection.z;\n\n    // If we did not exit tile, have we hit the terrain?\n    if (e.r > z) {\n      // We hit terrain. Do not add illumination for this iteration\n      gl_FragColor = vec4(src, 1.0);\n      return;\n    }\n  }\n\n  // Should have hit terrain or left the tile by this point, so should never need this\n  // If we finish the loop somehow, let’s pretend it’s been illuminated\n  vec3 illumination = vec3(1.0/softIterations) * clamp(dot(n0, sunDirection), 0.0, 1.0);\n  gl_FragColor = vec4(src + illumination, 1.0);\n}\n"; // eslint-disable-line

var fragHsAdvAmbientShadows = "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#define GLSLIFY 1\n#endif\n\nuniform sampler2D tInput;\nuniform sampler2D tNormal;\nuniform sampler2D tSrc;\nuniform vec3 direction;\nuniform vec2 resolution;\nuniform float pixelScale;\nuniform float ambientIterations;\nvarying vec2 vTexCoord;\n\nvoid main() {\n  vec2 ires = 1.0 / resolution;\n  vec3 src = texture2D(tSrc, gl_FragCoord.xy * ires).rgb;\n  vec4 e0 = texture2D(tInput, vTexCoord);\n  vec3 n0 = texture2D(tNormal, vTexCoord).rgb;\n\n  vec3 sr3d = normalize(n0 + direction); // ray direction\n  vec2 sr = normalize(sr3d.xy); // get 2D ray direction\n\n  // initialize pixel traversal algorithm\n  vec2 p0 = vTexCoord * resolution;\n  vec2 p = floor(p0); // pixel we are starting in\n  vec2 stp = sign(sr);\n\n  // how far we need to travel in our ray direction to intersect the next pixel\n  // in the x- and y- directions\n  vec2 tMax = step(0.0, sr) * (1.0 - fract(p0)) + (1.0 - step(0.0, sr)) * fract(p0);\n  tMax /= abs(sr);\n  // how far must we travel along our ray to cover the width and height of a pixel\n  vec2 tDelta = 1.0 / abs(sr);\n\n  // pixel traversal routine\n  for (int i = 0; i < 65536; i++) {\n    if (tMax.x < tMax.y) {\n      tMax.x += tDelta.x;\n      p.x += stp.x;\n    } else {\n      tMax.y += tDelta.y;\n      p.y += stp.y;\n    }\n\n    // normalized texture coordinate for the center of the current pixel\n    vec2 ptex = ires * (p + 0.5);\n\n    // If we left the tile: add some illumination to the pixel for this iteration and stop traversing\n    if (ptex.x < 0.0 || ptex.x > 1.0 || ptex.y < 0.0 || ptex.y > 1.0) {\n      // illumination of this single ray\n      vec3 illumination = vec3(1.0/ambientIterations);\n      // add illumination of this ray to result of previous iteration\n      gl_FragColor = vec4(src + illumination, 1.0);\n      return;\n    }\n\n    // elevation/value at current pixel\n    vec4 e = texture2D(tInput, ptex);\n    // time we have traveled along the 2D ray\n    float time = distance(p + 0.5, p0);\n    // elevation along our original 3D ray at the current point\n    float z = e0.r + time * pixelScale * sr3d.z;\n    // If we did not exit tile, have we hit the terrain?\n    if (e.r > z) {\n      // We hit terrain. Do not add illumination for this iteration\n      gl_FragColor = vec4(src, 1.0);\n      return;\n    }\n  }\n\n  // Should have hit terrain or left the tile by this point, so should never need this\n  // If we finish the loop somehow, let’s pretend it’s been illuminated\n  vec3 illumination = vec3(1.0/ambientIterations);\n  gl_FragColor = vec4(src + illumination, 1.0);\n}"; // eslint-disable-line

var fragHsAdvFinalColorscale = "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#define GLSLIFY 1\n#endif\n\n#ifndef RELATIVE_TOLERANCE\n#define RELATIVE_TOLERANCE 0.0001\n#endif\n\nbool isCloseEnough(float a, float b) {\n  return abs(a - b) <= max(abs(a), abs(b)) * RELATIVE_TOLERANCE;\n}\n\n// Denormalize 8-bit color channels to integers in the range 0 to 255.\nivec4 floatsToBytes(vec4 inputFloats, bool littleEndian) {\n  ivec4 bytes = ivec4(inputFloats * 255.0);\n  return (\n    littleEndian\n    ? bytes.abgr\n    : bytes\n  );\n}\n\n// Break the four bytes down into an array of 32 bits.\nvoid bytesToBits(const in ivec4 bytes, out bool bits[32]) {\n  for (int channelIndex = 0; channelIndex < 4; ++channelIndex) {\n    float acc = float(bytes[channelIndex]);\n    for (int indexInByte = 7; indexInByte >= 0; --indexInByte) {\n      float powerOfTwo = exp2(float(indexInByte));\n      bool bit = acc >= powerOfTwo;\n      bits[channelIndex * 8 + (7 - indexInByte)] = bit;\n      acc = mod(acc, powerOfTwo);\n    }\n  }\n}\n\n// Compute the exponent of the 32-bit float.\nfloat getExponent(bool bits[32]) {\n  const int startIndex = 1;\n  const int bitStringLength = 8;\n  const int endBeforeIndex = startIndex + bitStringLength;\n  float acc = 0.0;\n  int pow2 = bitStringLength - 1;\n  for (int bitIndex = startIndex; bitIndex < endBeforeIndex; ++bitIndex) {\n    acc += float(bits[bitIndex]) * exp2(float(pow2--));\n  }\n  return acc;\n}\n\n// Compute the mantissa of the 32-bit float.\nfloat getMantissa(bool bits[32], bool subnormal) {\n  const int startIndex = 9;\n  const int bitStringLength = 23;\n  const int endBeforeIndex = startIndex + bitStringLength;\n  // Leading/implicit/hidden bit convention:\n  // If the number is not subnormal (with exponent 0), we add a leading 1 digit.\n  float acc = float(!subnormal) * exp2(float(bitStringLength));\n  int pow2 = bitStringLength - 1;\n  for (int bitIndex = startIndex; bitIndex < endBeforeIndex; ++bitIndex) {\n    acc += float(bits[bitIndex]) * exp2(float(pow2--));\n  }\n  return acc;\n}\n\n// Parse the float from its 32 bits.\nfloat bitsToFloat(bool bits[32]) {\n  float signBit = float(bits[0]) * -2.0 + 1.0;\n  float exponent = getExponent(bits);\n  bool subnormal = abs(exponent - 0.0) < 0.01;\n  float mantissa = getMantissa(bits, subnormal);\n  float exponentBias = 127.0;\n  return signBit * mantissa * exp2(exponent - exponentBias - 23.0);\n}\n\n// Decode a 32-bit float from the RGBA color channels of a texel.\nfloat rgbaToFloat(vec4 texelRGBA, bool littleEndian) {\n  ivec4 rgbaBytes = floatsToBytes(texelRGBA, littleEndian);\n  bool bits[32];\n  bytesToBits(rgbaBytes, bits);\n  return bitsToFloat(bits);\n}\n\n#ifndef DEFAULT_COLOR\n#define DEFAULT_COLOR vec4(0.0)\n#endif\n\n#ifndef SCALE_MAX_LENGTH\n#define SCALE_MAX_LENGTH 16\n#endif\n\n#ifndef SENTINEL_MAX_LENGTH\n#define SENTINEL_MAX_LENGTH 16\n#endif\n\nvec4 computeColor(\n  float inputVal,\n  sampler2D scaleColormap,\n  sampler2D sentinelColormap,\n  int scaleLength,\n  int sentinelLength,\n  bool littleEndian\n) {\n\n  // vertical texture coordinate to find color and offset\n  float colorRow = 0.25;\n  float offsetRow = 0.75;\n\n  // Compare the value against any sentinel values, if defined.\n  if (sentinelLength > 0) {\n    for (int i = 0; i < SENTINEL_MAX_LENGTH; ++i) {\n      if (i == sentinelLength) {\n        break;\n      }\n\n      float i_f = float(i);\n      float sentinelLengthFloat = float(sentinelLength);\n      // retrieve the offset from the colormap\n      vec4 offsetRgba = texture2D(sentinelColormap, vec2((i_f + 0.5) / sentinelLengthFloat, offsetRow));\n      float sentinelOffset = rgbaToFloat(offsetRgba, littleEndian);\n      if (isCloseEnough(inputVal, sentinelOffset)) {\n        // retrieve the color from the colormap\n        vec2 colormapCoord = vec2((i_f + 0.5) / sentinelLengthFloat, colorRow);\n        return texture2D(sentinelColormap, colormapCoord);\n      }\n    }\n  }\n\n  // Do linear interpolation using the color scale, if defined.\n  if (scaleLength > 0) {\n    // If value below color scale range, clamp to lowest color stop.\n    vec4 scaleOffsetLowestRgba = texture2D(scaleColormap, vec2(0.0, offsetRow));\n    float scaleOffsetLowest = rgbaToFloat(scaleOffsetLowestRgba, littleEndian);\n    vec4 scaleOffsetHighestRgba = texture2D(scaleColormap, vec2(1.0, offsetRow));\n    float scaleOffsetHighest = rgbaToFloat(scaleOffsetHighestRgba, littleEndian);\n    if (inputVal < scaleOffsetLowest) {\n      return texture2D(scaleColormap, vec2(0.0, colorRow));\n    } else if (inputVal > scaleOffsetHighest) {\n      return texture2D(scaleColormap, vec2(1.0, colorRow));\n    } else {\n      for (int i = 0; i < SCALE_MAX_LENGTH; ++i) {\n        float i_f = float(i);\n        float scaleLengthFloat = float(scaleLength);\n\n        // If value above color scale range, clamp to highest color stop.\n        if (i == scaleLength) {\n          return texture2D(sentinelColormap, vec2((scaleLengthFloat - 0.5) / scaleLengthFloat, colorRow));\n        }\n        \n        vec4 scaleOffsetNextRgba = texture2D(scaleColormap, vec2((i_f + 1.0 + 0.5) / scaleLengthFloat, offsetRow));\n        float scaleOffsetNext = rgbaToFloat(scaleOffsetNextRgba, littleEndian);\n\n        if (inputVal <= scaleOffsetNext) {\n          vec4 scaleOffsetRgba = texture2D(scaleColormap, vec2((i_f + 0.5) / scaleLengthFloat, offsetRow));\n          float scaleOffset = rgbaToFloat(scaleOffsetRgba, littleEndian);\n          float percent = (inputVal - scaleOffset)\n            / (scaleOffsetNext - scaleOffset);\n          vec4 colorLow = texture2D(scaleColormap, vec2((i_f + 0.5) / scaleLengthFloat, colorRow));\n          vec4 colorHigh = texture2D(scaleColormap, vec2((i_f + 1.0 + 0.5) / scaleLengthFloat, colorRow));\n          return mix(colorLow, colorHigh, percent);\n        } \n      }\n    }\n  }\n\n  return DEFAULT_COLOR;\n}\n\nuniform sampler2D tInput;\nuniform sampler2D tSoftShadow;\nuniform sampler2D tAmbient;\nuniform float floatScale;\nuniform float finalSoftMultiplier;\nuniform float finalAmbientMultiplier;\nuniform float nodataValue;\nuniform bool littleEndian;\nuniform int scaleLength;\nuniform int sentinelLength;\nuniform sampler2D scaleColormap;\nuniform sampler2D sentinelColormap;\nvarying vec2 vTexCoordA;\nvarying vec2 vTexCoordB;\n\nvoid main() {\n  float f = texture2D(tInput, vTexCoordA).r;\n\n  if (isCloseEnough(f, nodataValue)) {\n    gl_FragColor = vec4(0.0);\n  } else {\n    vec4 clr = computeColor(\n      f / floatScale,\n      scaleColormap,\n      sentinelColormap,\n      scaleLength,\n      sentinelLength,\n      littleEndian\n    );\n\n    float softShadow = texture2D(tSoftShadow, vTexCoordB).r;\n    float ambient = texture2D(tAmbient, vTexCoordB).r;\n    // Add up the lighting\n    float light = finalSoftMultiplier * softShadow + finalAmbientMultiplier * ambient;\n    //Deepen the original color a bit by applying a curve, and multiply it by the light\n    vec3 color = light * pow(clr.rgb, vec3(2.0));\n    // apply gamma correction\n    color = pow(color, vec3(1.0/2.2));\n    gl_FragColor = vec4(color, 1.0);\n  }\n}"; // eslint-disable-line

var fragHsAdvFinalBaselayer = "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#define GLSLIFY 1\n#endif\n\nuniform sampler2D tBase;\nuniform sampler2D tSoftShadow;\nuniform sampler2D tAmbient;\nuniform float finalSoftMultiplier;\nuniform float finalAmbientMultiplier;\nuniform float nodataValue;\nuniform bool littleEndian;\nvarying vec2 vTexCoordA;\nvarying vec2 vTexCoordB;\n\nvoid main() {\n  vec3 baselayer = texture2D(tBase, vTexCoordA).rgb;\n\n  float softShadow = texture2D(tSoftShadow, vTexCoordB).r;\n  float ambient = texture2D(tAmbient, vTexCoordB).r;\n  // Add up the lighting\n  float light = finalSoftMultiplier * softShadow + finalAmbientMultiplier * ambient;\n  //Deepen the original color a bit by applying a curve, and multiply it by the light\n  vec3 color = light * pow(baselayer.rgb, vec3(2.0));\n  // apply gamma correction\n  color = pow(color, vec3(1.0/2.2));\n  gl_FragColor = vec4(color, 1.0);\n}"; // eslint-disable-line

var littleEndian = machineIsLittleEndian();
function getCommonDrawConfiguration(tileSize, nodataValue) {
    return {
        uniforms: {
            nodataValue: nodataValue,
            littleEndian: littleEndian,
            transformMatrix: function (_a) {
                var viewportWidth = _a.viewportWidth, viewportHeight = _a.viewportHeight;
                return (getTransformMatrix(viewportWidth, viewportHeight));
            },
        },
        attributes: {
            position: function (_, _a) {
                var canvasCoordinates = _a.canvasCoordinates;
                var left = canvasCoordinates[0], top = canvasCoordinates[1];
                var _b = [left + tileSize, top + tileSize], right = _b[0], bottom = _b[1];
                return [
                    [left, top],
                    [right, top],
                    [left, bottom],
                    [right, bottom],
                ];
            },
        },
        depth: { enable: false },
        primitive: 'triangle strip',
        count: 4,
        viewport: function (_, _a) {
            var _b = _a.canvasSize, width = _b[0], height = _b[1];
            return ({ width: width, height: height });
        },
    };
}
function createDrawTileCommand(regl, commonConfig, fragMacros) {
    return regl(__assign(__assign({}, commonConfig), { vert: vertSingle, frag: defineMacros(fragSingle, fragMacros), uniforms: __assign(__assign({}, commonConfig.uniforms), { scaleLength: regl.prop('scaleLength'), sentinelLength: regl.prop('sentinelLength'), scaleColormap: regl.prop('scaleColormap'), sentinelColormap: regl.prop('sentinelColormap'), texture: function (_, _a) {
                var texture = _a.texture;
                return texture;
            }, enableSimpleHillshade: function (_, _a) {
                var enableSimpleHillshade = _a.enableSimpleHillshade;
                return enableSimpleHillshade;
            }, offset: 0, azimuth: 0, altitude: 0, slopescale: 0, deg2rad: DEG2RAD, slopeFactor: SLOPEFACTOR, tileSize: 0, textureSize: 0, textureBounds: [0, 0, 0, 0] }), attributes: __assign(__assign({}, commonConfig.attributes), { texCoord: function (_, _a) {
                var textureBounds = _a.textureBounds;
                return getTexCoordVerticesTriangleStripQuad(textureBounds);
            } }) }));
}
function createDrawTileHsSimpleCommand(regl, commonConfig, fragMacros) {
    return regl(__assign(__assign({}, commonConfig), { vert: vertSingle, frag: defineMacros(fragSingle, fragMacros), uniforms: __assign(__assign({}, commonConfig.uniforms), { scaleLength: regl.prop('scaleLength'), sentinelLength: regl.prop('sentinelLength'), scaleColormap: regl.prop('scaleColormap'), sentinelColormap: regl.prop('sentinelColormap'), texture: function (_, _a) {
                var texture = _a.texture;
                return texture;
            }, enableSimpleHillshade: function (_, _a) {
                var enableSimpleHillshade = _a.enableSimpleHillshade;
                return enableSimpleHillshade;
            }, azimuth: function (_, _a) {
                var azimuth = _a.azimuth;
                return azimuth;
            }, altitude: function (_, _a) {
                var altitude = _a.altitude;
                return altitude;
            }, slopescale: function (_, _a) {
                var slopescale = _a.slopescale;
                return slopescale;
            }, deg2rad: DEG2RAD, slopeFactor: SLOPEFACTOR, offset: function (_, _a) {
                var offset = _a.offset;
                return offset;
            }, textureBounds: function (_, _a) {
                var textureBounds = _a.textureBounds;
                return [
                    [textureBounds[0].x],
                    [textureBounds[0].y],
                    [textureBounds[1].x],
                    [textureBounds[1].y]
                ];
            }, textureSize: function (_, _a) {
                var textureSize = _a.textureSize;
                return textureSize;
            }, tileSize: function (_, _a) {
                var tileSize = _a.tileSize;
                return tileSize;
            } }), attributes: __assign(__assign({}, commonConfig.attributes), { texCoord: function (_, _a) {
                var textureBounds = _a.textureBounds;
                return getTexCoordVerticesTriangleStripQuad(textureBounds);
            } }) }));
}
function createDrawTileHsPregenCommand(regl, commonConfig, fragMacros) {
    return regl(__assign(__assign({}, commonConfig), { vert: vertDouble, frag: defineMacros(fragHsPregen, fragMacros), uniforms: __assign(__assign({}, commonConfig.uniforms), { scaleLength: regl.prop('scaleLength'), sentinelLength: regl.prop('sentinelLength'), scaleColormap: regl.prop('scaleColormap'), sentinelColormap: regl.prop('sentinelColormap'), texture: function (_, _a) {
                var texture = _a.texture;
                return texture;
            }, hillshadePregenTexture: function (_, _a) {
                var hillshadePregenTexture = _a.hillshadePregenTexture;
                return hillshadePregenTexture;
            } }), attributes: __assign(__assign({}, commonConfig.attributes), { texCoordA: function (_, _a) {
                var textureBounds = _a.textureBounds;
                return getTexCoordVerticesTriangleStripQuad(textureBounds);
            }, texCoordB: function (_, _a) {
                var textureBoundsHs = _a.textureBoundsHs;
                return getTexCoordVerticesTriangleStripQuad(textureBoundsHs);
            } }) }));
}
function createCalcTileMultiAnalyze1Command(regl, commonConfig) {
    return regl(__assign(__assign({}, commonConfig), { vert: vertSingle, frag: fragMulti1Calc, depth: {
            enable: false
        }, uniforms: __assign(__assign({}, commonConfig.uniforms), { filterLowA: function (_, _a) {
                var filterLowA = _a.filterLowA;
                return filterLowA;
            }, filterHighA: function (_, _a) {
                var filterHighA = _a.filterHighA;
                return filterHighA;
            }, multiplierA: function (_, _a) {
                var multiplierA = _a.multiplierA;
                return multiplierA;
            }, textureA: function (_, _a) {
                var textureA = _a.textureA;
                return textureA;
            } }), attributes: __assign(__assign({}, commonConfig.attributes), { texCoord: function (_, _a) {
                var textureBoundsA = _a.textureBoundsA;
                return getTexCoordVerticesTriangleStripQuad(textureBoundsA);
            } }), framebuffer: regl.prop("fbo") }));
}
function createCalcTileMultiAnalyze2Command(regl, commonConfig) {
    return regl(__assign(__assign({}, commonConfig), { vert: vertDouble, frag: fragMulti2Calc, depth: {
            enable: false
        }, uniforms: __assign(__assign({}, commonConfig.uniforms), { filterLowA: function (_, _a) {
                var filterLowA = _a.filterLowA;
                return filterLowA;
            }, filterHighA: function (_, _a) {
                var filterHighA = _a.filterHighA;
                return filterHighA;
            }, filterLowB: function (_, _a) {
                var filterLowB = _a.filterLowB;
                return filterLowB;
            }, filterHighB: function (_, _a) {
                var filterHighB = _a.filterHighB;
                return filterHighB;
            }, multiplierA: function (_, _a) {
                var multiplierA = _a.multiplierA;
                return multiplierA;
            }, multiplierB: function (_, _a) {
                var multiplierB = _a.multiplierB;
                return multiplierB;
            }, textureA: function (_, _a) {
                var textureA = _a.textureA;
                return textureA;
            }, textureB: function (_, _a) {
                var textureB = _a.textureB;
                return textureB;
            } }), attributes: __assign(__assign({}, commonConfig.attributes), { texCoordA: function (_, _a) {
                var textureBoundsA = _a.textureBoundsA;
                return getTexCoordVerticesTriangleStripQuad(textureBoundsA);
            }, texCoordB: function (_, _a) {
                var textureBoundsB = _a.textureBoundsB;
                return getTexCoordVerticesTriangleStripQuad(textureBoundsB);
            } }), framebuffer: regl.prop("fbo") }));
}
function createCalcTileMultiAnalyze3Command(regl, commonConfig) {
    return regl(__assign(__assign({}, commonConfig), { vert: vertMulti3, frag: fragMulti3Calc, depth: {
            enable: false
        }, uniforms: __assign(__assign({}, commonConfig.uniforms), { filterLowA: function (_, _a) {
                var filterLowA = _a.filterLowA;
                return filterLowA;
            }, filterHighA: function (_, _a) {
                var filterHighA = _a.filterHighA;
                return filterHighA;
            }, filterLowB: function (_, _a) {
                var filterLowB = _a.filterLowB;
                return filterLowB;
            }, filterHighB: function (_, _a) {
                var filterHighB = _a.filterHighB;
                return filterHighB;
            }, filterLowC: function (_, _a) {
                var filterLowC = _a.filterLowC;
                return filterLowC;
            }, filterHighC: function (_, _a) {
                var filterHighC = _a.filterHighC;
                return filterHighC;
            }, multiplierA: function (_, _a) {
                var multiplierA = _a.multiplierA;
                return multiplierA;
            }, multiplierB: function (_, _a) {
                var multiplierB = _a.multiplierB;
                return multiplierB;
            }, multiplierC: function (_, _a) {
                var multiplierC = _a.multiplierC;
                return multiplierC;
            }, textureA: function (_, _a) {
                var textureA = _a.textureA;
                return textureA;
            }, textureB: function (_, _a) {
                var textureB = _a.textureB;
                return textureB;
            }, textureC: function (_, _a) {
                var textureC = _a.textureC;
                return textureC;
            } }), attributes: __assign(__assign({}, commonConfig.attributes), { texCoordA: function (_, _a) {
                var textureBoundsA = _a.textureBoundsA;
                return getTexCoordVerticesTriangleStripQuad(textureBoundsA);
            }, texCoordB: function (_, _a) {
                var textureBoundsB = _a.textureBoundsB;
                return getTexCoordVerticesTriangleStripQuad(textureBoundsB);
            }, texCoordC: function (_, _a) {
                var textureBoundsC = _a.textureBoundsC;
                return getTexCoordVerticesTriangleStripQuad(textureBoundsC);
            } }), framebuffer: regl.prop("fbo") }));
}
function createCalcTileMultiAnalyze4Command(regl, commonConfig) {
    return regl(__assign(__assign({}, commonConfig), { vert: vertMulti4, frag: fragMulti4Calc, depth: {
            enable: false
        }, uniforms: __assign(__assign({}, commonConfig.uniforms), { filterLowA: function (_, _a) {
                var filterLowA = _a.filterLowA;
                return filterLowA;
            }, filterHighA: function (_, _a) {
                var filterHighA = _a.filterHighA;
                return filterHighA;
            }, filterLowB: function (_, _a) {
                var filterLowB = _a.filterLowB;
                return filterLowB;
            }, filterHighB: function (_, _a) {
                var filterHighB = _a.filterHighB;
                return filterHighB;
            }, filterLowC: function (_, _a) {
                var filterLowC = _a.filterLowC;
                return filterLowC;
            }, filterHighC: function (_, _a) {
                var filterHighC = _a.filterHighC;
                return filterHighC;
            }, filterLowD: function (_, _a) {
                var filterLowD = _a.filterLowD;
                return filterLowD;
            }, filterHighD: function (_, _a) {
                var filterHighD = _a.filterHighD;
                return filterHighD;
            }, multiplierA: function (_, _a) {
                var multiplierA = _a.multiplierA;
                return multiplierA;
            }, multiplierB: function (_, _a) {
                var multiplierB = _a.multiplierB;
                return multiplierB;
            }, multiplierC: function (_, _a) {
                var multiplierC = _a.multiplierC;
                return multiplierC;
            }, multiplierD: function (_, _a) {
                var multiplierD = _a.multiplierD;
                return multiplierD;
            }, textureA: function (_, _a) {
                var textureA = _a.textureA;
                return textureA;
            }, textureB: function (_, _a) {
                var textureB = _a.textureB;
                return textureB;
            }, textureC: function (_, _a) {
                var textureC = _a.textureC;
                return textureC;
            }, textureD: function (_, _a) {
                var textureD = _a.textureD;
                return textureD;
            } }), attributes: __assign(__assign({}, commonConfig.attributes), { texCoordA: function (_, _a) {
                var textureBoundsA = _a.textureBoundsA;
                return getTexCoordVerticesTriangleStripQuad(textureBoundsA);
            }, texCoordB: function (_, _a) {
                var textureBoundsB = _a.textureBoundsB;
                return getTexCoordVerticesTriangleStripQuad(textureBoundsB);
            }, texCoordC: function (_, _a) {
                var textureBoundsC = _a.textureBoundsC;
                return getTexCoordVerticesTriangleStripQuad(textureBoundsC);
            }, texCoordD: function (_, _a) {
                var textureBoundsD = _a.textureBoundsD;
                return getTexCoordVerticesTriangleStripQuad(textureBoundsD);
            } }), framebuffer: regl.prop("fbo") }));
}
function createCalcTileMultiAnalyze5Command(regl, commonConfig) {
    return regl(__assign(__assign({}, commonConfig), { vert: vertMulti5, frag: fragMulti5Calc, depth: {
            enable: false
        }, uniforms: __assign(__assign({}, commonConfig.uniforms), { filterLowA: function (_, _a) {
                var filterLowA = _a.filterLowA;
                return filterLowA;
            }, filterHighA: function (_, _a) {
                var filterHighA = _a.filterHighA;
                return filterHighA;
            }, filterLowB: function (_, _a) {
                var filterLowB = _a.filterLowB;
                return filterLowB;
            }, filterHighB: function (_, _a) {
                var filterHighB = _a.filterHighB;
                return filterHighB;
            }, filterLowC: function (_, _a) {
                var filterLowC = _a.filterLowC;
                return filterLowC;
            }, filterHighC: function (_, _a) {
                var filterHighC = _a.filterHighC;
                return filterHighC;
            }, filterLowD: function (_, _a) {
                var filterLowD = _a.filterLowD;
                return filterLowD;
            }, filterHighD: function (_, _a) {
                var filterHighD = _a.filterHighD;
                return filterHighD;
            }, filterLowE: function (_, _a) {
                var filterLowE = _a.filterLowE;
                return filterLowE;
            }, filterHighE: function (_, _a) {
                var filterHighE = _a.filterHighE;
                return filterHighE;
            }, multiplierA: function (_, _a) {
                var multiplierA = _a.multiplierA;
                return multiplierA;
            }, multiplierB: function (_, _a) {
                var multiplierB = _a.multiplierB;
                return multiplierB;
            }, multiplierC: function (_, _a) {
                var multiplierC = _a.multiplierC;
                return multiplierC;
            }, multiplierD: function (_, _a) {
                var multiplierD = _a.multiplierD;
                return multiplierD;
            }, multiplierE: function (_, _a) {
                var multiplierE = _a.multiplierE;
                return multiplierE;
            }, textureA: function (_, _a) {
                var textureA = _a.textureA;
                return textureA;
            }, textureB: function (_, _a) {
                var textureB = _a.textureB;
                return textureB;
            }, textureC: function (_, _a) {
                var textureC = _a.textureC;
                return textureC;
            }, textureD: function (_, _a) {
                var textureD = _a.textureD;
                return textureD;
            }, textureE: function (_, _a) {
                var textureE = _a.textureE;
                return textureE;
            } }), attributes: __assign(__assign({}, commonConfig.attributes), { texCoordA: function (_, _a) {
                var textureBoundsA = _a.textureBoundsA;
                return getTexCoordVerticesTriangleStripQuad(textureBoundsA);
            }, texCoordB: function (_, _a) {
                var textureBoundsB = _a.textureBoundsB;
                return getTexCoordVerticesTriangleStripQuad(textureBoundsB);
            }, texCoordC: function (_, _a) {
                var textureBoundsC = _a.textureBoundsC;
                return getTexCoordVerticesTriangleStripQuad(textureBoundsC);
            }, texCoordD: function (_, _a) {
                var textureBoundsD = _a.textureBoundsD;
                return getTexCoordVerticesTriangleStripQuad(textureBoundsD);
            }, texCoordE: function (_, _a) {
                var textureBoundsE = _a.textureBoundsE;
                return getTexCoordVerticesTriangleStripQuad(textureBoundsE);
            } }), framebuffer: regl.prop("fbo") }));
}
function createCalcTileMultiAnalyze6Command(regl, commonConfig) {
    return regl(__assign(__assign({}, commonConfig), { vert: vertMulti6, frag: fragMulti6Calc, depth: {
            enable: false
        }, uniforms: __assign(__assign({}, commonConfig.uniforms), { filterLowA: function (_, _a) {
                var filterLowA = _a.filterLowA;
                return filterLowA;
            }, filterHighA: function (_, _a) {
                var filterHighA = _a.filterHighA;
                return filterHighA;
            }, filterLowB: function (_, _a) {
                var filterLowB = _a.filterLowB;
                return filterLowB;
            }, filterHighB: function (_, _a) {
                var filterHighB = _a.filterHighB;
                return filterHighB;
            }, filterLowC: function (_, _a) {
                var filterLowC = _a.filterLowC;
                return filterLowC;
            }, filterHighC: function (_, _a) {
                var filterHighC = _a.filterHighC;
                return filterHighC;
            }, filterLowD: function (_, _a) {
                var filterLowD = _a.filterLowD;
                return filterLowD;
            }, filterHighD: function (_, _a) {
                var filterHighD = _a.filterHighD;
                return filterHighD;
            }, filterLowE: function (_, _a) {
                var filterLowE = _a.filterLowE;
                return filterLowE;
            }, filterHighE: function (_, _a) {
                var filterHighE = _a.filterHighE;
                return filterHighE;
            }, filterLowF: function (_, _a) {
                var filterLowF = _a.filterLowF;
                return filterLowF;
            }, filterHighF: function (_, _a) {
                var filterHighF = _a.filterHighF;
                return filterHighF;
            }, multiplierA: function (_, _a) {
                var multiplierA = _a.multiplierA;
                return multiplierA;
            }, multiplierB: function (_, _a) {
                var multiplierB = _a.multiplierB;
                return multiplierB;
            }, multiplierC: function (_, _a) {
                var multiplierC = _a.multiplierC;
                return multiplierC;
            }, multiplierD: function (_, _a) {
                var multiplierD = _a.multiplierD;
                return multiplierD;
            }, multiplierE: function (_, _a) {
                var multiplierE = _a.multiplierE;
                return multiplierE;
            }, multiplierF: function (_, _a) {
                var multiplierF = _a.multiplierF;
                return multiplierF;
            }, textureA: function (_, _a) {
                var textureA = _a.textureA;
                return textureA;
            }, textureB: function (_, _a) {
                var textureB = _a.textureB;
                return textureB;
            }, textureC: function (_, _a) {
                var textureC = _a.textureC;
                return textureC;
            }, textureD: function (_, _a) {
                var textureD = _a.textureD;
                return textureD;
            }, textureE: function (_, _a) {
                var textureE = _a.textureE;
                return textureE;
            }, textureF: function (_, _a) {
                var textureF = _a.textureF;
                return textureF;
            } }), attributes: __assign(__assign({}, commonConfig.attributes), { texCoordA: function (_, _a) {
                var textureBoundsA = _a.textureBoundsA;
                return getTexCoordVerticesTriangleStripQuad(textureBoundsA);
            }, texCoordB: function (_, _a) {
                var textureBoundsB = _a.textureBoundsB;
                return getTexCoordVerticesTriangleStripQuad(textureBoundsB);
            }, texCoordC: function (_, _a) {
                var textureBoundsC = _a.textureBoundsC;
                return getTexCoordVerticesTriangleStripQuad(textureBoundsC);
            }, texCoordD: function (_, _a) {
                var textureBoundsD = _a.textureBoundsD;
                return getTexCoordVerticesTriangleStripQuad(textureBoundsD);
            }, texCoordE: function (_, _a) {
                var textureBoundsE = _a.textureBoundsE;
                return getTexCoordVerticesTriangleStripQuad(textureBoundsE);
            }, texCoordF: function (_, _a) {
                var textureBoundsF = _a.textureBoundsF;
                return getTexCoordVerticesTriangleStripQuad(textureBoundsF);
            } }), framebuffer: regl.prop("fbo") }));
}
function createCalcTileDiffCommand(regl, commonConfig) {
    return regl(__assign(__assign({}, commonConfig), { vert: vertDouble, frag: fragDiffCalc, depth: {
            enable: false
        }, uniforms: __assign(__assign({}, commonConfig.uniforms), { textureA: function (_, _a) {
                var textureA = _a.textureA;
                return textureA;
            }, textureB: function (_, _a) {
                var textureB = _a.textureB;
                return textureB;
            } }), attributes: __assign(__assign({}, commonConfig.attributes), { texCoordA: function (_, _a) {
                var textureBoundsA = _a.textureBoundsA;
                return getTexCoordVerticesTriangleStripQuad(textureBoundsA);
            }, texCoordB: function (_, _a) {
                var textureBoundsB = _a.textureBoundsB;
                return getTexCoordVerticesTriangleStripQuad(textureBoundsB);
            } }), framebuffer: regl.prop("fbo") }));
}
function createDrawResultCommand(regl, commonConfig, fragMacros) {
    return regl(__assign(__assign({}, commonConfig), { vert: vertSingle, frag: defineMacros(fragDrawResult, fragMacros), depth: {
            enable: false
        }, uniforms: __assign(__assign({}, commonConfig.uniforms), { scaleLength: regl.prop('scaleLength'), sentinelLength: regl.prop('sentinelLength'), scaleColormap: regl.prop('scaleColormap'), sentinelColormap: regl.prop('sentinelColormap'), texture: regl.prop("texture") }), attributes: __assign(__assign({}, commonConfig.attributes), { texCoord: [[0, 1], [1, 1], [0, 0], [1, 0]] }) }));
}
function createConvertDemCommand(regl, commonConfig) {
    return regl(__assign(__assign({}, commonConfig), { vert: vertSingle, frag: fragConvertDem, depth: {
            enable: false
        }, uniforms: __assign(__assign({}, commonConfig.uniforms), { texture: function (_, _a) {
                var texture = _a.texture;
                return texture;
            } }), attributes: __assign(__assign({}, commonConfig.attributes), { texCoord: [[0, 1], [1, 1], [0, 0], [1, 0]] }), framebuffer: regl.prop("fbo") }));
}
function createDrawTileInterpolateValueCommand(regl, commonConfig, fragMacros) {
    return regl(__assign(__assign({}, commonConfig), { vert: vertDouble, frag: defineMacros(fragInterpolateValue, fragMacros), uniforms: __assign(__assign({}, commonConfig.uniforms), { scaleLength: regl.prop('scaleLength'), sentinelLength: regl.prop('sentinelLength'), scaleColormap: regl.prop('scaleColormap'), sentinelColormap: regl.prop('sentinelColormap'), textureA: function (_, _a) {
                var textureA = _a.textureA;
                return textureA;
            }, textureB: function (_, _a) {
                var textureB = _a.textureB;
                return textureB;
            }, interpolationFraction: function (_, _a) {
                var interpolationFraction = _a.interpolationFraction;
                return interpolationFraction;
            } }), attributes: __assign(__assign({}, commonConfig.attributes), { texCoordA: function (_, _a) {
                var textureBoundsA = _a.textureBoundsA;
                return getTexCoordVerticesTriangleStripQuad(textureBoundsA);
            }, texCoordB: function (_, _a) {
                var textureBoundsB = _a.textureBoundsB;
                return getTexCoordVerticesTriangleStripQuad(textureBoundsB);
            } }) }));
}
function createDrawTileInterpolateColorCommand(regl, commonConfig, fragMacros) {
    return regl(__assign(__assign({}, commonConfig), { vert: vertDouble, frag: defineMacros(fragInterpolateColor, fragMacros), uniforms: __assign(__assign({}, commonConfig.uniforms), { scaleLengthA: regl.prop('scaleLengthA'), sentinelLengthA: regl.prop('sentinelLengthA'), scaleColormapA: regl.prop('scaleColormapA'), sentinelColormapA: regl.prop('sentinelColormapA'), scaleLengthB: regl.prop('scaleLengthB'), sentinelLengthB: regl.prop('sentinelLengthB'), scaleColormapB: regl.prop('scaleColormapB'), sentinelColormapB: regl.prop('sentinelColormapB'), textureA: function (_, _a) {
                var textureA = _a.textureA;
                return textureA;
            }, textureB: function (_, _a) {
                var textureB = _a.textureB;
                return textureB;
            }, interpolationFraction: function (_, _a) {
                var interpolationFraction = _a.interpolationFraction;
                return interpolationFraction;
            } }), attributes: __assign(__assign({}, commonConfig.attributes), { texCoordA: function (_, _a) {
                var textureBoundsA = _a.textureBoundsA;
                return getTexCoordVerticesTriangleStripQuad(textureBoundsA);
            }, texCoordB: function (_, _a) {
                var textureBoundsB = _a.textureBoundsB;
                return getTexCoordVerticesTriangleStripQuad(textureBoundsB);
            } }) }));
}
function createDrawTileInterpolateColorOnlyCommand(regl, commonConfig, fragMacros) {
    return regl(__assign(__assign({}, commonConfig), { vert: vertSingle, frag: defineMacros(fragInterpolateColorOnly, fragMacros), uniforms: __assign(__assign({}, commonConfig.uniforms), { scaleLengthA: regl.prop('scaleLengthA'), sentinelLengthA: regl.prop('sentinelLengthA'), scaleColormapA: regl.prop('scaleColormapA'), sentinelColormapA: regl.prop('sentinelColormapA'), scaleLengthB: regl.prop('scaleLengthB'), sentinelLengthB: regl.prop('sentinelLengthB'), scaleColormapB: regl.prop('scaleColormapB'), sentinelColormapB: regl.prop('sentinelColormapB'), texture: function (_, _a) {
                var texture = _a.texture;
                return texture;
            }, interpolationFraction: function (_, _a) {
                var interpolationFraction = _a.interpolationFraction;
                return interpolationFraction;
            } }), attributes: __assign(__assign({}, commonConfig.attributes), { texCoord: function (_, _a) {
                var textureBounds = _a.textureBounds;
                return getTexCoordVerticesTriangleStripQuad(textureBounds);
            } }) }));
}
function createConvolutionSmoothCommand(regl, commonConfig) {
    return regl({
        vert: vertSingleNotTransformed,
        frag: fragConvolutionSmooth,
        uniforms: __assign(__assign({}, commonConfig.uniforms), { texture: regl.prop("texture"), textureSize: regl.prop("textureSize"), kernelSize: regl.prop("kernelSize") }),
        attributes: {
            texCoord: [0, 1, 1, 1, 0, 0, 1, 0],
            position: [-1, 1, 1, 1, -1, -1, 1, -1],
        },
        depth: { enable: false },
        primitive: 'triangle strip',
        count: 4,
    });
}
function createHsAdvMergeAndScaleTiles(regl) {
    return regl({
        vert: vertSingleNotTransformed,
        frag: fragHsAdvMergeAndScaleTiles,
        uniforms: {
            littleEndian: littleEndian,
            nodataValue: regl.prop("nodataValue"),
            texture: regl.prop("texture"),
            floatScale: regl.prop("floatScale"),
        },
        attributes: {
            position: [
                [-1, 1], [-1 / 3, 1], [-1, 1 / 3], [-1 / 3, 1 / 3], [-1 / 3, 1], [-1, 1 / 3],
                [-1, 1 / 3], [-1 / 3, 1 / 3], [-1, -1 / 3], [-1 / 3, -1 / 3], [-1 / 3, 1 / 3], [-1, -1 / 3],
                [-1, -1 / 3], [-1 / 3, -1 / 3], [-1, -1], [-1 / 3, -1], [-1 / 3, -1 / 3], [-1, -1],
                [-1 / 3, 1], [1 / 3, 1], [-1 / 3, 1 / 3], [1 / 3, 1 / 3], [1 / 3, 1], [-1 / 3, 1 / 3],
                [-1 / 3, 1 / 3], [1 / 3, 1 / 3], [-1 / 3, -1 / 3], [1 / 3, -1 / 3], [1 / 3, 1 / 3], [-1 / 3, -1 / 3],
                [-1 / 3, -1 / 3], [1 / 3, -1 / 3], [-1 / 3, -1], [1 / 3, -1], [1 / 3, -1 / 3], [-1 / 3, -1],
                [1 / 3, 1], [1, 1], [1 / 3, 1 / 3], [1, 1 / 3], [1, 1], [1 / 3, 1 / 3],
                [1 / 3, 1 / 3], [1, 1 / 3], [1 / 3, -1 / 3], [1, -1 / 3], [1, 1 / 3], [1 / 3, -1 / 3],
                [1 / 3, -1 / 3], [1, -1 / 3], [1 / 3, -1], [1, -1], [1, -1 / 3], [1 / 3, -1]
            ],
            texCoord: regl.prop("texCoord"),
        },
        depth: { enable: false },
        primitive: 'triangles',
        count: 54,
        viewport: function (_, _a) {
            var _b = _a.canvasSize, width = _b[0], height = _b[1];
            return ({ width: width, height: height });
        },
        framebuffer: regl.prop("fbo"),
    });
}
function createHsAdvCalcNormals(regl, commonConfig) {
    return regl(__assign(__assign({}, commonConfig), { vert: vertSingleNotTransformed, frag: fragHsAdvNormals, uniforms: __assign(__assign({}, commonConfig.uniforms), { tInput: regl.prop("tInput"), pixelScale: regl.prop("pixelScale"), onePixel: regl.prop("onePixel") }), attributes: {
            position: [[-1, 1], [1, 1], [-1, -1], [1, -1]],
            texCoord: [[0, 1], [1, 1], [0, 0], [1, 0]],
        }, framebuffer: regl.prop("fbo") }));
}
function createHsAdvDirectLightning(regl, commonConfig) {
    return regl(__assign(__assign({}, commonConfig), { vert: vertSingleNotTransformed, frag: fragHsAdvDirectLight, uniforms: __assign(__assign({}, commonConfig.uniforms), { scaleLength: regl.prop('scaleLength'), sentinelLength: regl.prop('sentinelLength'), scaleColormap: regl.prop('scaleColormap'), sentinelColormap: regl.prop('sentinelColormap'), tInput: regl.prop("tInput"), tNormal: regl.prop("tNormal"), floatScale: regl.prop("floatScale"), sunDirection: regl.prop("sunDirection") }), attributes: {
            position: [[-1, 1], [1, 1], [-1, -1], [1, -1]],
            texCoord: [[0, 1], [1, 1], [0, 0], [1, 0]],
        } }));
}
function createHsAdvSoftShadows(regl, commonConfig) {
    return regl(__assign(__assign({}, commonConfig), { vert: vertSingleNotTransformed, frag: fragHsAdvSoftShadows, uniforms: __assign(__assign({}, commonConfig.uniforms), { tInput: regl.prop("tInput"), tNormal: regl.prop("tNormal"), tSrc: regl.prop("tSrc"), softIterations: regl.prop("softIterations"), pixelScale: regl.prop("pixelScale"), resolution: regl.prop("resolution"), sunDirection: regl.prop("sunDirection") }), attributes: {
            position: [[-1, 1], [1, 1], [-1, -1], [1, -1]],
            texCoord: [[1 / 3, 2 / 3], [2 / 3, 2 / 3], [1 / 3, 1 / 3], [2 / 3, 1 / 3]],
        }, framebuffer: regl.prop("fbo") }));
}
function createHsAdvAmbientShadows(regl, commonConfig) {
    return regl(__assign(__assign({}, commonConfig), { vert: vertSingleNotTransformed, frag: fragHsAdvAmbientShadows, uniforms: __assign(__assign({}, commonConfig.uniforms), { tInput: regl.prop("tInput"), tNormal: regl.prop("tNormal"), tSrc: regl.prop("tSrc"), ambientIterations: regl.prop("ambientIterations"), pixelScale: regl.prop("pixelScale"), resolution: regl.prop("resolution"), direction: regl.prop("direction") }), attributes: {
            position: [[-1, 1], [1, 1], [-1, -1], [1, -1]],
            texCoord: [[1 / 3, 2 / 3], [2 / 3, 2 / 3], [1 / 3, 1 / 3], [2 / 3, 1 / 3]],
        }, framebuffer: regl.prop("fbo") }));
}
function createHsAdvFinalColorscale(regl, commonConfig) {
    return regl(__assign(__assign({}, commonConfig), { vert: vertDouble, frag: fragHsAdvFinalColorscale, uniforms: __assign(__assign({}, commonConfig.uniforms), { scaleLength: regl.prop('scaleLength'), sentinelLength: regl.prop('sentinelLength'), scaleColormap: regl.prop('scaleColormap'), sentinelColormap: regl.prop('sentinelColormap'), tInput: regl.prop("tInput"), tSoftShadow: regl.prop("tSoftShadow"), tAmbient: regl.prop("tAmbient"), floatScale: regl.prop("floatScale"), finalSoftMultiplier: regl.prop("finalSoftMultiplier"), finalAmbientMultiplier: regl.prop("finalAmbientMultiplier") }), attributes: __assign(__assign({}, commonConfig.attributes), { texCoordA: [[1 / 3, 2 / 3], [2 / 3, 2 / 3], [1 / 3, 1 / 3], [2 / 3, 1 / 3]], texCoordB: [[0, 1], [1, 1], [0, 0], [1, 0]] }) }));
}
function createHsAdvFinalBaselayer(regl, commonConfig) {
    return regl(__assign(__assign({}, commonConfig), { vert: vertDouble, frag: fragHsAdvFinalBaselayer, uniforms: __assign(__assign({}, commonConfig.uniforms), { tBase: regl.prop("tBase"), tSoftShadow: regl.prop("tSoftShadow"), tAmbient: regl.prop("tAmbient"), finalSoftMultiplier: regl.prop("finalSoftMultiplier"), finalAmbientMultiplier: regl.prop("finalAmbientMultiplier") }), attributes: __assign(__assign({}, commonConfig.attributes), { texCoordA: regl.prop("baseTexCoords"), texCoordB: [[0, 1], [1, 1], [0, 0], [1, 0]] }) }));
}

var TextureManager = (function () {
    function TextureManager(regl, tileSize, maxTextureDimension, flipY, textureFormat, textureType) {
        if (tileSize === void 0) { tileSize = 256; }
        if (flipY === void 0) { flipY = false; }
        if (textureFormat === void 0) { textureFormat = 'rgba'; }
        if (textureType === void 0) { textureType = 'uint8'; }
        var tilesAcross = Math.floor(maxTextureDimension / tileSize);
        var pixelsAcross = tilesAcross * tileSize;
        var tileCapacity = tilesAcross * tilesAcross;
        var texture = regl.texture({
            width: pixelsAcross,
            height: pixelsAcross,
            flipY: flipY,
            format: textureFormat,
            type: textureType,
        });
        var contents = new Map();
        var available = this.allTextureCoordinates(tilesAcross, tileSize);
        Object.assign(this, {
            tileSize: tileSize,
            tilesAcross: tilesAcross,
            pixelsAcross: pixelsAcross,
            tileCapacity: tileCapacity,
            texture: texture,
            contents: contents,
            available: available,
        });
    }
    TextureManager.prototype.addTile = function (tileCoordinates, data) {
        var _a = this, available = _a.available, contents = _a.contents, texture = _a.texture, tileSize = _a.tileSize;
        var hashKey = this.hashTileCoordinates(tileCoordinates);
        if (contents.has(hashKey)) {
            var textureCoordinates_1 = contents.get(hashKey);
            contents.delete(hashKey);
            contents.set(hashKey, textureCoordinates_1);
            return this.formatOutputTextureCoordinates(textureCoordinates_1);
        }
        if (lodashEs.isEmpty(available)) {
            var firstInsertedKey = contents.keys().next().value;
            this.removeByHashKey(firstInsertedKey);
        }
        var textureCoordinates = available.pop();
        contents.set(hashKey, textureCoordinates);
        var textureX = textureCoordinates.x, textureY = textureCoordinates.y;
        texture.subimage({
            data: data,
            width: tileSize,
            height: tileSize,
        }, textureX, textureY);
        return this.formatOutputTextureCoordinates(textureCoordinates);
    };
    TextureManager.prototype.removeTile = function (tileCoordinates) {
        this.removeByHashKey(this.hashTileCoordinates(tileCoordinates));
    };
    TextureManager.prototype.clearTiles = function () {
        for (var _i = 0, _a = Array.from(this.contents.keys()); _i < _a.length; _i++) {
            var hashKey = _a[_i];
            this.removeByHashKey(hashKey);
        }
    };
    TextureManager.prototype.destroy = function () {
        this.texture.destroy();
    };
    TextureManager.prototype.removeByHashKey = function (hashKey) {
        if (this.contents.has(hashKey)) {
            var textureCoordinates = this.contents.get(hashKey);
            this.contents.delete(hashKey);
            this.available.push(textureCoordinates);
        }
    };
    TextureManager.prototype.formatOutputTextureCoordinates = function (textureCoordinates) {
        var x = textureCoordinates.x, y = textureCoordinates.y;
        var _a = this, pixelsAcross = _a.pixelsAcross, tileSize = _a.tileSize;
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
    };
    TextureManager.prototype.hashTileCoordinates = function (_a) {
        var x = _a.x, y = _a.y, z = _a.z;
        return x + ":" + y + ":" + z;
    };
    TextureManager.prototype.getTextureCoordinates = function (tileCoordinates) {
        var hashKey = this.hashTileCoordinates(tileCoordinates);
        var textureCoordinates = this.contents.get(hashKey);
        return this.formatOutputTextureCoordinates(textureCoordinates);
    };
    TextureManager.prototype.allTextureCoordinates = function (tilesAcross, tileSize) {
        return lodashEs.flatMap(range(tilesAcross), function (x) {
            return range(tilesAcross).map(function (y) { return ({
                x: x * tileSize,
                y: y * tileSize,
            }); });
        });
    };
    return TextureManager;
}());

var Renderer = (function () {
    function Renderer(gloperations, tileSize, nodataValue, scaleInput, sentinelInput, colorscaleMaxLength, sentinelMaxLength) {
        var canvas = L.DomUtil.create("canvas");
        var maxTextureDimension = MAX_TEXTURE_DIMENSION;
        var regl = REGL__default['default']({
            canvas: canvas,
            optionalExtensions: ["OES_texture_float", "WEBGL_color_buffer_float"],
            onDone: function (err, regl) {
                if (err) {
                    console.log(err);
                    return;
                }
                else {
                    maxTextureDimension = regl.limits.maxTextureSize;
                }
                if (regl.limits.maxFragmentUniforms === 261) {
                    console.warn("Software rendering detected. Many features of this plugin will fail.\
          If you have a GPU, check if drivers are installed ok?");
                }
            }
        });
        var commonDrawConfig = getCommonDrawConfiguration(tileSize, nodataValue);
        var fragMacros = {
            SCALE_MAX_LENGTH: colorscaleMaxLength,
            SENTINEL_MAX_LENGTH: sentinelMaxLength,
        };
        Object.assign(this, {
            gloperations: gloperations,
            canvas: canvas,
            regl: regl,
            tileSize: tileSize,
            nodataValue: nodataValue,
            maxTextureDimension: maxTextureDimension,
            scaleInput: scaleInput,
            sentinelInput: sentinelInput,
            scaleColormap: createColormapTexture(scaleInput, regl),
            sentinelColormap: createColormapTexture(sentinelInput, regl),
            textureManager: new TextureManager(regl, tileSize, maxTextureDimension, false),
            textureManagerA: new TextureManager(regl, tileSize, maxTextureDimension, false),
            textureManagerB: new TextureManager(regl, tileSize, maxTextureDimension, false),
            textureManagerC: new TextureManager(regl, tileSize, maxTextureDimension, false),
            textureManagerD: new TextureManager(regl, tileSize, maxTextureDimension, false),
            textureManagerE: new TextureManager(regl, tileSize, maxTextureDimension, false),
            textureManagerF: new TextureManager(regl, tileSize, maxTextureDimension, false),
            textureManagerHillshade: new TextureManager(regl, tileSize, maxTextureDimension, false),
            drawTile: createDrawTileCommand(regl, commonDrawConfig, fragMacros),
            drawTileHsSimple: createDrawTileHsSimpleCommand(regl, commonDrawConfig, fragMacros),
            drawTileHsPregen: createDrawTileHsPregenCommand(regl, commonDrawConfig, fragMacros),
            drawTileInterpolateColor: createDrawTileInterpolateColorCommand(regl, commonDrawConfig, fragMacros),
            drawTileInterpolateColorOnly: createDrawTileInterpolateColorOnlyCommand(regl, commonDrawConfig, fragMacros),
            drawTileInterpolateValue: createDrawTileInterpolateValueCommand(regl, commonDrawConfig, fragMacros),
            calcTileMultiAnalyze1: createCalcTileMultiAnalyze1Command(regl, commonDrawConfig),
            calcTileMultiAnalyze2: createCalcTileMultiAnalyze2Command(regl, commonDrawConfig),
            calcTileMultiAnalyze3: createCalcTileMultiAnalyze3Command(regl, commonDrawConfig),
            calcTileMultiAnalyze4: createCalcTileMultiAnalyze4Command(regl, commonDrawConfig),
            calcTileMultiAnalyze5: createCalcTileMultiAnalyze5Command(regl, commonDrawConfig),
            calcTileMultiAnalyze6: createCalcTileMultiAnalyze6Command(regl, commonDrawConfig),
            drawTileResult: createDrawResultCommand(regl, commonDrawConfig, fragMacros),
            calcTileDiff: createCalcTileDiffCommand(regl, commonDrawConfig),
            convertDem: createConvertDemCommand(regl, commonDrawConfig),
            convolutionSmooth: createConvolutionSmoothCommand(regl, commonDrawConfig),
            HsAdvMergeAndScaleTiles: createHsAdvMergeAndScaleTiles(regl),
            HsAdvCalcNormals: createHsAdvCalcNormals(regl, commonDrawConfig),
            HsAdvDirectLightning: createHsAdvDirectLightning(regl, commonDrawConfig),
            HsAdvSoftShadows: createHsAdvSoftShadows(regl, commonDrawConfig),
            HsAdvAmbientShadows: createHsAdvAmbientShadows(regl, commonDrawConfig),
            HsAdvFinalColorscale: createHsAdvFinalColorscale(regl, commonDrawConfig),
            HsAdvFinalBaselayer: createHsAdvFinalBaselayer(regl, commonDrawConfig),
        });
    }
    Renderer.prototype.findMaxTextureDimension = function () {
        var regl = this.regl;
        var maxTextureDimension = regl.limits.maxTextureSize;
        return maxTextureDimension;
    };
    Renderer.prototype.setMaxTextureDimension = function (newMaxTextureDimension) {
        var _a = this, textureManager = _a.textureManager, tileSize = _a.tileSize, regl = _a.regl;
        textureManager.destroy();
        Object.assign(this, {
            maxTextureDimension: newMaxTextureDimension,
            textureManager: new TextureManager(regl, tileSize, newMaxTextureDimension, false),
        });
    };
    Renderer.prototype.updateColorscale = function (scaleInput) {
        this.scaleInputPrevious = this.scaleInput;
        this.scaleInput = scaleInput;
        this.scaleColormapPrevious = this.scaleColormap;
        this.scaleColormap = createColormapTexture(scaleInput, this.regl);
    };
    Renderer.prototype.updateSentinels = function (sentinelInput) {
        this.sentinelInputPrevious = this.sentinelInput;
        this.sentinelInput = sentinelInput;
        this.sentinelColormapPrevious = this.sentinelColormap;
        this.sentinelColormap = createColormapTexture(sentinelInput, this.regl);
    };
    Renderer.prototype.renderTile = function (_a, _hillshadeOptions, zoom) {
        var coords = _a.coords, pixelData = _a.pixelData;
        var _b = this, regl = _b.regl, textureManager = _b.textureManager, tileSize = _b.tileSize;
        this.setCanvasSize(tileSize, tileSize);
        var textureBounds = textureManager.addTile(coords, pixelData);
        regl.clear({ color: CLEAR_COLOR });
        var zoomdelta = _hillshadeOptions.hsSimpleZoomdelta || 0;
        var offset_pixels = Math.max(0.5, Math.pow(2, (zoom + zoomdelta)) / 2048);
        var offset_texcoords = offset_pixels / textureManager.texture.width;
        if (_hillshadeOptions.hillshadeType === "none") {
            this.drawTile({
                canvasSize: [tileSize, tileSize],
                canvasCoordinates: [0, 0],
                textureBounds: textureBounds,
                texture: textureManager.texture,
                scaleLength: this.scaleInput.length,
                sentinelLength: this.sentinelInput.length,
                scaleColormap: this.scaleColormap,
                sentinelColormap: this.sentinelColormap,
                enableSimpleHillshade: false,
            });
        }
        else if (_hillshadeOptions.hillshadeType === "simple") {
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
                azimuth: _hillshadeOptions.hsSimpleAzimuth,
                altitude: _hillshadeOptions.hsSimpleAltitude,
                slopescale: _hillshadeOptions.hsSimpleSlopescale,
            });
        }
        return [0, 0];
    };
    Renderer.prototype.renderTileHsPregen = function (tileDatum, tileDatumHs) {
        var _a = this, regl = _a.regl, textureManager = _a.textureManager, textureManagerHillshade = _a.textureManagerHillshade, tileSize = _a.tileSize;
        this.setCanvasSize(tileSize, tileSize);
        var textureBounds = textureManager.addTile(tileDatum.coords, tileDatum.pixelData);
        var textureBoundsHs = textureManagerHillshade.addTile(tileDatumHs.coords, tileDatumHs.pixelData);
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
        return [0, 0];
    };
    Renderer.prototype.flipReadPixelsUint = function (width, height, pixels) {
        var halfHeight = height / 2 | 0;
        var bytesPerRow = width * 4;
        var temp = new Uint8Array(width * 4);
        for (var y = 0; y < halfHeight; ++y) {
            var topOffset = y * bytesPerRow;
            var bottomOffset = (height - y - 1) * bytesPerRow;
            temp.set(pixels.subarray(topOffset, topOffset + bytesPerRow));
            pixels.copyWithin(topOffset, bottomOffset, bottomOffset + bytesPerRow);
            pixels.set(temp, bottomOffset);
        }
        return pixels;
    };
    Renderer.prototype.renderTileDiff = function (tileDatumA, tileDatumB) {
        var _a = this, regl = _a.regl, textureManagerA = _a.textureManagerA, textureManagerB = _a.textureManagerB, tileSize = _a.tileSize;
        this.setCanvasSize(tileSize, tileSize);
        var textureBoundsA = textureManagerA.addTile(tileDatumA.coords, tileDatumA.pixelData);
        var textureBoundsB = textureManagerB.addTile(tileDatumB.coords, tileDatumB.pixelData);
        var fboTile = regl.framebuffer({
            width: tileSize,
            height: tileSize,
            depth: false,
            colorFormat: "rgba",
            colorType: "uint8",
        });
        var resultEncodedPixels = new Uint8Array(tileSize * tileSize * 4);
        this.calcTileDiff({
            canvasSize: [tileSize, tileSize],
            canvasCoordinates: [0, 0],
            textureA: textureManagerA.texture,
            textureB: textureManagerB.texture,
            textureBoundsA: textureBoundsA,
            textureBoundsB: textureBoundsB,
            fbo: fboTile,
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
        fboTile.use(function () {
            regl.read({ data: resultEncodedPixels });
        });
        resultEncodedPixels = this.flipReadPixelsUint(tileSize, tileSize, resultEncodedPixels);
        fboTile.destroy();
        return [0, 0, resultEncodedPixels];
    };
    Renderer.prototype.renderConvertDem = function (pixelData) {
        var _a = this, regl = _a.regl, tileSize = _a.tileSize;
        var tDem = regl.texture({
            width: tileSize,
            height: tileSize,
            data: pixelData,
            format: "rgba",
            type: "uint8",
            flipY: false,
        });
        var fboTile = regl.framebuffer({
            width: tileSize,
            height: tileSize,
            depth: false,
            colorFormat: "rgba",
            colorType: "uint8",
        });
        var resultEncodedPixels = new Uint8Array(tileSize * tileSize * 4);
        this.convertDem({
            canvasSize: [tileSize, tileSize],
            canvasCoordinates: [0, 0],
            texture: tDem,
            fbo: fboTile,
        });
        fboTile.use(function () {
            regl.read({ data: resultEncodedPixels });
        });
        tDem.destroy();
        fboTile.destroy();
        return resultEncodedPixels;
    };
    Renderer.prototype.renderConvolutionSmooth = function (inputData, width, height, kernelSize) {
        var _this = this;
        var regl = this.regl;
        this.setCanvasSize(width, height);
        var texture = regl.texture({
            data: inputData,
            width: width,
            height: height,
            flipY: false,
        });
        var fboSmoothed = regl.framebuffer({
            width: width,
            height: height,
            depth: false,
            colorFormat: "rgba",
            colorType: "uint8"
        });
        var resultEncodedPixels = new Uint8Array(width * height * 4);
        fboSmoothed.use(function () {
            _this.convolutionSmooth({
                texture: texture,
                textureSize: width,
                kernelSize: kernelSize,
            });
            regl.read({ data: resultEncodedPixels });
        });
        resultEncodedPixels = new Float32Array(resultEncodedPixels.buffer);
        fboSmoothed.destroy();
        return resultEncodedPixels;
    };
    Renderer.prototype.renderTileHsAdvanced = function (_hillshadeOptions, zoom, textureCoords, pixelScale, baselayerTexCoords) {
        var _a = this, regl = _a.regl, textureManager = _a.textureManager, tileSize = _a.tileSize;
        this.setCanvasSize(tileSize, tileSize);
        var fboFloats = regl.framebuffer({
            width: tileSize * 3,
            height: tileSize * 3,
            depth: false,
            colorType: "float",
        });
        var fboNormals = regl.framebuffer({
            width: tileSize * 3,
            height: tileSize * 3,
            depth: false,
            colorType: "float",
        });
        var fboSoftShadowPP = PingPong(regl, {
            width: tileSize,
            height: tileSize,
            colorType: "float",
        });
        var fboAmbientShadowPP = PingPong(regl, {
            width: tileSize,
            height: tileSize,
            colorType: "float",
        });
        var hsValueScale = 1.0;
        if (typeof _hillshadeOptions.hsValueScale === "number") {
            hsValueScale = _hillshadeOptions.hsValueScale;
        }
        else if (_hillshadeOptions.hsValueScale.constructor === Object) {
            hsValueScale = _hillshadeOptions.hsValueScale[zoom];
        }
        this.HsAdvMergeAndScaleTiles({
            canvasSize: [tileSize * 3, tileSize * 3],
            texture: textureManager.texture,
            fbo: fboFloats,
            floatScale: hsValueScale,
            texCoord: textureCoords,
            nodataValue: this.nodataValue,
        });
        this.HsAdvCalcNormals({
            canvasSize: [tileSize * 3, tileSize * 3],
            canvasCoordinates: [0, 0],
            tInput: fboFloats,
            pixelScale: pixelScale,
            onePixel: 1 / (tileSize * 3),
            fbo: fboNormals,
        });
        for (var i = 0; i < _hillshadeOptions.hsAdvSoftIterations; i++) {
            this.HsAdvSoftShadows({
                canvasSize: [tileSize, tileSize],
                canvasCoordinates: [0, 0],
                tInput: fboFloats,
                tNormal: fboNormals,
                tSrc: fboSoftShadowPP.ping(),
                softIterations: _hillshadeOptions.hsAdvSoftIterations,
                resolution: [tileSize, tileSize],
                pixelScale: pixelScale,
                sunDirection: this.sunDirections[i],
                fbo: fboSoftShadowPP.pong(),
            });
            fboSoftShadowPP.swap();
        }
        for (var i = 0; i < _hillshadeOptions.hsAdvAmbientIterations; i++) {
            this.HsAdvAmbientShadows({
                canvasSize: [tileSize, tileSize],
                canvasCoordinates: [0, 0],
                tInput: fboFloats,
                tNormal: fboNormals,
                tSrc: fboAmbientShadowPP.ping(),
                ambientIterations: _hillshadeOptions.hsAdvAmbientIterations,
                direction: this.ambientDirections[i],
                resolution: [tileSize, tileSize],
                pixelScale: pixelScale,
                fbo: fboAmbientShadowPP.pong(),
            });
            fboAmbientShadowPP.swap();
        }
        if (_hillshadeOptions.hsAdvBaselayerUrl) {
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
        }
        else {
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
        return [0, 0];
    };
    Renderer.prototype.renderTileMulti1 = function (tileDatumA, filterLowA, filterHighA, multiplierA) {
        var _a = this, regl = _a.regl, textureManagerA = _a.textureManagerA, tileSize = _a.tileSize;
        this.setCanvasSize(tileSize, tileSize);
        var textureBoundsA = textureManagerA.addTile(tileDatumA.coords, tileDatumA.pixelData);
        var fboTile = regl.framebuffer({
            width: tileSize,
            height: tileSize,
            depth: false,
            colorFormat: "rgba",
            colorType: "uint8",
        });
        var resultEncodedPixels = new Uint8Array(tileSize * tileSize * 4);
        this.calcTileMultiAnalyze1({
            canvasSize: [tileSize, tileSize],
            canvasCoordinates: [0, 0],
            textureA: textureManagerA.texture,
            textureBoundsA: textureBoundsA,
            filterLowA: filterLowA,
            filterHighA: filterHighA,
            multiplierA: multiplierA,
            fbo: fboTile,
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
        fboTile.use(function () {
            regl.read({ data: resultEncodedPixels });
        });
        resultEncodedPixels = this.flipReadPixelsUint(tileSize, tileSize, resultEncodedPixels);
        fboTile.destroy();
        return [0, 0, resultEncodedPixels];
    };
    Renderer.prototype.renderTileMulti2 = function (tileDatumA, tileDatumB, filterLowA, filterHighA, filterLowB, filterHighB, multiplierA, multiplierB) {
        var _a = this, regl = _a.regl, textureManagerA = _a.textureManagerA, textureManagerB = _a.textureManagerB, tileSize = _a.tileSize;
        this.setCanvasSize(tileSize, tileSize);
        var textureBoundsA = textureManagerA.addTile(tileDatumA.coords, tileDatumA.pixelData);
        var textureBoundsB = textureManagerB.addTile(tileDatumB.coords, tileDatumB.pixelData);
        var fboTile = regl.framebuffer({
            width: tileSize,
            height: tileSize,
            depth: false,
            colorFormat: "rgba",
            colorType: "uint8",
        });
        var resultEncodedPixels = new Uint8Array(tileSize * tileSize * 4);
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
            fbo: fboTile,
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
        fboTile.use(function () {
            regl.read({ data: resultEncodedPixels });
        });
        resultEncodedPixels = this.flipReadPixelsUint(tileSize, tileSize, resultEncodedPixels);
        fboTile.destroy();
        return [0, 0, resultEncodedPixels];
    };
    Renderer.prototype.renderTileMulti3 = function (tileDatumA, tileDatumB, tileDatumC, filterLowA, filterHighA, filterLowB, filterHighB, filterLowC, filterHighC, multiplierA, multiplierB, multiplierC) {
        var _a = this, regl = _a.regl, textureManagerA = _a.textureManagerA, textureManagerB = _a.textureManagerB, textureManagerC = _a.textureManagerC, tileSize = _a.tileSize;
        this.setCanvasSize(tileSize, tileSize);
        var textureBoundsA = textureManagerA.addTile(tileDatumA.coords, tileDatumA.pixelData);
        var textureBoundsB = textureManagerB.addTile(tileDatumB.coords, tileDatumB.pixelData);
        var textureBoundsC = textureManagerC.addTile(tileDatumC.coords, tileDatumC.pixelData);
        var fboTile = regl.framebuffer({
            width: tileSize,
            height: tileSize,
            depth: false,
            colorFormat: "rgba",
            colorType: "uint8",
        });
        var resultEncodedPixels = new Uint8Array(tileSize * tileSize * 4);
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
            fbo: fboTile,
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
        fboTile.use(function () {
            regl.read({ data: resultEncodedPixels });
        });
        resultEncodedPixels = this.flipReadPixelsUint(tileSize, tileSize, resultEncodedPixels);
        fboTile.destroy();
        return [0, 0, resultEncodedPixels];
    };
    Renderer.prototype.renderTileMulti4 = function (tileDatumA, tileDatumB, tileDatumC, tileDatumD, filterLowA, filterHighA, filterLowB, filterHighB, filterLowC, filterHighC, filterLowD, filterHighD, multiplierA, multiplierB, multiplierC, multiplierD) {
        var _a = this, regl = _a.regl, textureManagerA = _a.textureManagerA, textureManagerB = _a.textureManagerB, textureManagerC = _a.textureManagerC, textureManagerD = _a.textureManagerD, tileSize = _a.tileSize;
        this.setCanvasSize(tileSize, tileSize);
        var textureBoundsA = textureManagerA.addTile(tileDatumA.coords, tileDatumA.pixelData);
        var textureBoundsB = textureManagerB.addTile(tileDatumB.coords, tileDatumB.pixelData);
        var textureBoundsC = textureManagerC.addTile(tileDatumC.coords, tileDatumC.pixelData);
        var textureBoundsD = textureManagerD.addTile(tileDatumD.coords, tileDatumD.pixelData);
        var fboTile = regl.framebuffer({
            width: tileSize,
            height: tileSize,
            depth: false,
            colorFormat: "rgba",
            colorType: "uint8",
        });
        var resultEncodedPixels = new Uint8Array(tileSize * tileSize * 4);
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
            fbo: fboTile,
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
        fboTile.use(function () {
            regl.read({ data: resultEncodedPixels });
        });
        resultEncodedPixels = this.flipReadPixelsUint(tileSize, tileSize, resultEncodedPixels);
        fboTile.destroy();
        return [0, 0, resultEncodedPixels];
    };
    Renderer.prototype.renderTileMulti5 = function (tileDatumA, tileDatumB, tileDatumC, tileDatumD, tileDatumE, filterLowA, filterHighA, filterLowB, filterHighB, filterLowC, filterHighC, filterLowD, filterHighD, filterLowE, filterHighE, multiplierA, multiplierB, multiplierC, multiplierD, multiplierE) {
        var _a = this, regl = _a.regl, textureManagerA = _a.textureManagerA, textureManagerB = _a.textureManagerB, textureManagerC = _a.textureManagerC, textureManagerD = _a.textureManagerD, textureManagerE = _a.textureManagerE, tileSize = _a.tileSize;
        this.setCanvasSize(tileSize, tileSize);
        var textureBoundsA = textureManagerA.addTile(tileDatumA.coords, tileDatumA.pixelData);
        var textureBoundsB = textureManagerB.addTile(tileDatumB.coords, tileDatumB.pixelData);
        var textureBoundsC = textureManagerC.addTile(tileDatumC.coords, tileDatumC.pixelData);
        var textureBoundsD = textureManagerD.addTile(tileDatumD.coords, tileDatumD.pixelData);
        var textureBoundsE = textureManagerE.addTile(tileDatumE.coords, tileDatumE.pixelData);
        var fboTile = regl.framebuffer({
            width: tileSize,
            height: tileSize,
            depth: false,
            colorFormat: "rgba",
            colorType: "uint8",
        });
        var resultEncodedPixels = new Uint8Array(tileSize * tileSize * 4);
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
            fbo: fboTile,
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
        fboTile.use(function () {
            regl.read({ data: resultEncodedPixels });
        });
        resultEncodedPixels = this.flipReadPixelsUint(tileSize, tileSize, resultEncodedPixels);
        fboTile.destroy();
        return [0, 0, resultEncodedPixels];
    };
    Renderer.prototype.renderTileMulti6 = function (tileDatumA, tileDatumB, tileDatumC, tileDatumD, tileDatumE, tileDatumF, filterLowA, filterHighA, filterLowB, filterHighB, filterLowC, filterHighC, filterLowD, filterHighD, filterLowE, filterHighE, filterLowF, filterHighF, multiplierA, multiplierB, multiplierC, multiplierD, multiplierE, multiplierF) {
        var _a = this, regl = _a.regl, textureManagerA = _a.textureManagerA, textureManagerB = _a.textureManagerB, textureManagerC = _a.textureManagerC, textureManagerD = _a.textureManagerD, textureManagerE = _a.textureManagerE, textureManagerF = _a.textureManagerF, tileSize = _a.tileSize;
        this.setCanvasSize(tileSize, tileSize);
        var textureBoundsA = textureManagerA.addTile(tileDatumA.coords, tileDatumA.pixelData);
        var textureBoundsB = textureManagerB.addTile(tileDatumB.coords, tileDatumB.pixelData);
        var textureBoundsC = textureManagerC.addTile(tileDatumC.coords, tileDatumC.pixelData);
        var textureBoundsD = textureManagerD.addTile(tileDatumD.coords, tileDatumD.pixelData);
        var textureBoundsE = textureManagerE.addTile(tileDatumE.coords, tileDatumE.pixelData);
        var textureBoundsF = textureManagerE.addTile(tileDatumF.coords, tileDatumF.pixelData);
        var fboTile = regl.framebuffer({
            width: tileSize,
            height: tileSize,
            depth: false,
            colorFormat: "rgba",
            colorType: "uint8",
        });
        var resultEncodedPixels = new Uint8Array(tileSize * tileSize * 4);
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
            fbo: fboTile,
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
        fboTile.use(function () {
            regl.read({ data: resultEncodedPixels });
        });
        resultEncodedPixels = this.flipReadPixelsUint(tileSize, tileSize, resultEncodedPixels);
        fboTile.destroy();
        return [0, 0, resultEncodedPixels];
    };
    Renderer.prototype.renderTiles = function (tiles, _hillshadeOptions, zoom) {
        var _this = this;
        var _a = this, regl = _a.regl, textureManager = _a.textureManager, tileSize = _a.tileSize;
        var _b = this.computeRequiredCanvasDimensions(tiles.length), canvasWidth = _b[0], canvasHeight = _b[1];
        this.setCanvasSize(canvasWidth, canvasHeight);
        var canvasCoordinates = this.getCanvasCoordinates(canvasWidth, canvasHeight, tiles.length);
        var tilesWithCanvasCoordinates = lodashEs.zipWith(tiles, canvasCoordinates, function (tile, canvasCoords) { return (__assign(__assign({}, tile), { canvasCoords: canvasCoords })); });
        var canvasSize = [canvasWidth, canvasHeight];
        textureManager.clearTiles();
        regl.clear({ color: CLEAR_COLOR });
        var chunks = lodashEs.chunk(tilesWithCanvasCoordinates, textureManager.tileCapacity);
        var zoomdelta = _hillshadeOptions.hsSimpleZoomdelta || 0;
        var _loop_1 = function (chunk_1) {
            var textureBounds = chunk_1.map(function (_a) {
                var coords = _a.coords, pixelData = _a.pixelData;
                return textureManager.addTile(coords, pixelData);
            });
            var offset_pixels = Math.max(0.5, Math.pow(2, (zoom + zoomdelta)) / 2048);
            var offset_texcoords = offset_pixels / textureManager.texture.width;
            if (_hillshadeOptions.hillshadeType === "none") {
                this_1.drawTile(chunk_1.map(function (_a, index) {
                    var canvasCoords = _a.canvasCoords;
                    return ({
                        canvasSize: canvasSize,
                        canvasCoordinates: canvasCoords,
                        textureBounds: textureBounds[index],
                        texture: textureManager.texture,
                        scaleLength: _this.scaleInput.length,
                        sentinelLength: _this.sentinelInput.length,
                        scaleColormap: _this.scaleColormap,
                        sentinelColormap: _this.sentinelColormap,
                        enableSimpleHillshade: false,
                    });
                }));
            }
            else if (_hillshadeOptions.hillshadeType === "simple") {
                this_1.drawTileHsSimple(chunk_1.map(function (_a, index) {
                    var canvasCoords = _a.canvasCoords;
                    return ({
                        scaleLength: _this.scaleInput.length,
                        sentinelLength: _this.sentinelInput.length,
                        scaleColormap: _this.scaleColormap,
                        sentinelColormap: _this.sentinelColormap,
                        canvasSize: canvasSize,
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
                    });
                }));
            }
        };
        var this_1 = this;
        for (var _i = 0, chunks_1 = chunks; _i < chunks_1.length; _i++) {
            var chunk_1 = chunks_1[_i];
            _loop_1(chunk_1);
        }
        return canvasCoordinates;
    };
    Renderer.prototype.renderTilesHsPregen = function (tiles, tilesHs) {
        var _this = this;
        var _a = this, regl = _a.regl, textureManager = _a.textureManager, textureManagerHillshade = _a.textureManagerHillshade;
        var _b = this.computeRequiredCanvasDimensions(tiles.length), canvasWidth = _b[0], canvasHeight = _b[1];
        this.setCanvasSize(canvasWidth, canvasHeight);
        var canvasCoordinates = this.getCanvasCoordinates(canvasWidth, canvasHeight, tiles.length);
        var tilesWithCanvasCoordinates = lodashEs.zipWith(tiles, tilesHs, canvasCoordinates, function (tiles, tilesHs, canvasCoords) { return ({
            coords: tiles.coords,
            tilesPixelData: tiles.pixelData,
            tilesHsPixelData: tilesHs.pixelData,
            canvasCoords: canvasCoords,
        }); });
        var canvasSize = [canvasWidth, canvasHeight];
        textureManager.clearTiles();
        textureManagerHillshade.clearTiles();
        regl.clear({ color: CLEAR_COLOR });
        var chunks = lodashEs.chunk(tilesWithCanvasCoordinates, textureManager.tileCapacity);
        var _loop_2 = function (chunk_2) {
            var textureBounds = chunk_2.map(function (_a) {
                var coords = _a.coords, tilesPixelData = _a.tilesPixelData;
                return textureManager.addTile(coords, tilesPixelData);
            });
            var textureBoundsHs = chunk_2.map(function (_a) {
                var coords = _a.coords, tilesHsPixelData = _a.tilesHsPixelData;
                return textureManagerHillshade.addTile(coords, tilesHsPixelData);
            });
            this_2.drawTileHsPregen(chunk_2.map(function (_a, index) {
                var canvasCoords = _a.canvasCoords;
                return ({
                    scaleLength: _this.scaleInput.length,
                    sentinelLength: _this.sentinelInput.length,
                    scaleColormap: _this.scaleColormap,
                    sentinelColormap: _this.sentinelColormap,
                    canvasSize: canvasSize,
                    canvasCoordinates: canvasCoords,
                    textureBounds: textureBounds[index],
                    textureBoundsHs: textureBoundsHs[index],
                    texture: textureManager.texture,
                    hillshadePregenTexture: textureManagerHillshade.texture,
                });
            }));
        };
        var this_2 = this;
        for (var _i = 0, chunks_2 = chunks; _i < chunks_2.length; _i++) {
            var chunk_2 = chunks_2[_i];
            _loop_2(chunk_2);
        }
        return canvasCoordinates;
    };
    Renderer.prototype.renderTilesHsAdvanced = function (tiles, _hillshadeOptions, url, zoom, pixelScale) {
        var _this = this;
        var _a = this, regl = _a.regl, textureManager = _a.textureManager, tileSize = _a.tileSize, nodataValue = _a.nodataValue;
        var _b = this.computeRequiredCanvasDimensions(tiles.length), canvasWidth = _b[0], canvasHeight = _b[1];
        this.setCanvasSize(canvasWidth, canvasHeight);
        var canvasCoordinates = this.getCanvasCoordinates(canvasWidth, canvasHeight, tiles.length);
        var tilesWithCanvasCoordinates = lodashEs.zipWith(tiles, canvasCoordinates, function (tile, canvasCoords) { return (__assign(__assign({}, tile), { canvasCoords: canvasCoords })); });
        var canvasSize = [canvasWidth, canvasHeight];
        textureManager.clearTiles();
        regl.clear({ color: CLEAR_COLOR });
        var chunks = lodashEs.chunk(tilesWithCanvasCoordinates, textureManager.tileCapacity);
        var nodataTile = createNoDataTile(nodataValue, tileSize);
        var hsValueScale = 1.0;
        if (typeof _hillshadeOptions.hsValueScale === "number") {
            hsValueScale = _hillshadeOptions.hsValueScale;
        }
        else if (_hillshadeOptions.hsValueScale.constructor === Object) {
            hsValueScale = _hillshadeOptions.hsValueScale[zoom];
        }
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var _i, chunks_3, chunk_4, _a, chunk_3, tile, coords, pixelData, canvasCoords, textureCoords, fboFloats, fboNormals, fboSoftShadowPP, fboAmbientShadowPP, i, i;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _i = 0, chunks_3 = chunks;
                        _b.label = 1;
                    case 1:
                        if (!(_i < chunks_3.length)) return [3, 7];
                        chunk_4 = chunks_3[_i];
                        _a = 0, chunk_3 = chunk_4;
                        _b.label = 2;
                    case 2:
                        if (!(_a < chunk_3.length)) return [3, 6];
                        tile = chunk_3[_a];
                        coords = tile.coords, pixelData = tile.pixelData, canvasCoords = tile.canvasCoords;
                        textureManager.addTile(coords, pixelData);
                        if (!typedArraysAreEqual(pixelData, nodataTile)) return [3, 3];
                        return [3, 5];
                    case 3:
                        textureCoords = [];
                        return [4, getAdjacentTilesTexCoords(this.gloperations, this.textureManager, coords, url)];
                    case 4:
                        textureCoords = _b.sent();
                        fboFloats = regl.framebuffer({
                            width: tileSize * 3,
                            height: tileSize * 3,
                            depth: false,
                            colorType: "float",
                        });
                        fboNormals = regl.framebuffer({
                            width: tileSize * 3,
                            height: tileSize * 3,
                            depth: false,
                            colorType: "float",
                        });
                        fboSoftShadowPP = PingPong(regl, {
                            width: tileSize,
                            height: tileSize,
                            colorType: "float",
                        });
                        fboAmbientShadowPP = PingPong(regl, {
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
                        this.HsAdvCalcNormals({
                            canvasSize: [tileSize * 3, tileSize * 3],
                            canvasCoordinates: [0, 0],
                            tInput: fboFloats,
                            pixelScale: pixelScale,
                            onePixel: 1 / (tileSize * 3),
                            fbo: fboNormals,
                        });
                        for (i = 0; i < _hillshadeOptions.hsAdvSoftIterations; i++) {
                            this.HsAdvSoftShadows({
                                canvasSize: [tileSize, tileSize],
                                canvasCoordinates: [0, 0],
                                tInput: fboFloats,
                                tNormal: fboNormals,
                                tSrc: fboSoftShadowPP.ping(),
                                softIterations: _hillshadeOptions.hsAdvSoftIterations,
                                resolution: [tileSize, tileSize],
                                pixelScale: pixelScale,
                                sunDirection: this.sunDirections[i],
                                fbo: fboSoftShadowPP.pong(),
                            });
                            fboSoftShadowPP.swap();
                        }
                        for (i = 0; i < _hillshadeOptions.hsAdvAmbientIterations; i++) {
                            this.HsAdvAmbientShadows({
                                canvasSize: [tileSize, tileSize],
                                canvasCoordinates: [0, 0],
                                tInput: fboFloats,
                                tNormal: fboNormals,
                                tSrc: fboAmbientShadowPP.ping(),
                                ambientIterations: _hillshadeOptions.hsAdvAmbientIterations,
                                direction: this.ambientDirections[i],
                                resolution: [tileSize, tileSize],
                                pixelScale: pixelScale,
                                fbo: fboAmbientShadowPP.pong(),
                            });
                            fboAmbientShadowPP.swap();
                        }
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
                        fboFloats.destroy();
                        fboNormals.destroy();
                        fboSoftShadowPP.destroy();
                        fboAmbientShadowPP.destroy();
                        _b.label = 5;
                    case 5:
                        _a++;
                        return [3, 2];
                    case 6:
                        _i++;
                        return [3, 1];
                    case 7: return [2];
                }
            });
        }); })();
        return canvasCoordinates;
    };
    Renderer.prototype.renderTilesWithDiff = function (tilesA, tilesB, onFrameRendered) {
        var _this = this;
        var _a = this, regl = _a.regl, textureManagerA = _a.textureManagerA, textureManagerB = _a.textureManagerB, tileSize = _a.tileSize;
        var canvasSize = this.computeRequiredCanvasDimensions(tilesA.length);
        var canvasWidth = canvasSize[0], canvasHeight = canvasSize[1];
        this.setCanvasSize(canvasWidth, canvasHeight);
        var canvasCoordinates = this.getCanvasCoordinates(canvasWidth, canvasHeight, tilesA.length);
        var tilesWithCanvasCoordinates = lodashEs.zipWith(tilesA, tilesB, canvasCoordinates, function (tilesA, tilesB, canvasCoords) { return ({
            coords: tilesA.coords,
            tilesAPixelData: tilesA.pixelData,
            tilesBPixelData: tilesB.pixelData,
            canvasCoords: canvasCoords,
        }); });
        var resultEncodedPixels = [];
        var renderFrame = function () {
            var chunks = lodashEs.chunk(tilesWithCanvasCoordinates, textureManagerA.tileCapacity);
            regl.clear({ color: CLEAR_COLOR });
            var tileIndex = 0;
            var _loop_3 = function (chunk_5) {
                var tilesABounds = chunk_5.map(function (_a) {
                    var coords = _a.coords, tilesAPixelData = _a.tilesAPixelData;
                    return textureManagerA.addTile(coords, tilesAPixelData);
                });
                var tilesBBounds = chunk_5.map(function (_a) {
                    var coords = _a.coords, tilesBPixelData = _a.tilesBPixelData;
                    return textureManagerB.addTile(coords, tilesBPixelData);
                });
                chunk_5.forEach(function (_a, index) {
                    var canvasCoords = _a.canvasCoords;
                    var fboTile = regl.framebuffer({
                        width: tileSize,
                        height: tileSize,
                        depth: false,
                        colorFormat: "rgba",
                        colorType: "uint8",
                    });
                    var resultEncodedPixelsTile = new Uint8Array(tileSize * tileSize * 4);
                    _this.calcTileDiff({
                        canvasSize: [tileSize, tileSize],
                        canvasCoordinates: [0, 0],
                        textureA: textureManagerA.texture,
                        textureB: textureManagerB.texture,
                        textureBoundsA: tilesABounds[index],
                        textureBoundsB: tilesBBounds[index],
                        fbo: fboTile,
                    });
                    _this.drawTileResult({
                        scaleLength: _this.scaleInput.length,
                        sentinelLength: _this.sentinelInput.length,
                        scaleColormap: _this.scaleColormap,
                        sentinelColormap: _this.sentinelColormap,
                        canvasSize: canvasSize,
                        canvasCoordinates: canvasCoords,
                        texture: fboTile,
                    });
                    fboTile.use(function () {
                        regl.read({ data: resultEncodedPixelsTile });
                    });
                    resultEncodedPixelsTile = _this.flipReadPixelsUint(tileSize, tileSize, resultEncodedPixelsTile);
                    resultEncodedPixels[tileIndex] = resultEncodedPixelsTile;
                    tileIndex += 1;
                    fboTile.destroy();
                });
            };
            for (var _i = 0, chunks_4 = chunks; _i < chunks_4.length; _i++) {
                var chunk_5 = chunks_4[_i];
                _loop_3(chunk_5);
            }
            onFrameRendered(canvasCoordinates);
        };
        renderFrame();
        this.textureManagerA.destroy();
        this.textureManagerB.destroy();
        this.textureManagerA = new TextureManager(regl, tileSize, MAX_TEXTURE_DIMENSION, false);
        this.textureManagerB = new TextureManager(regl, tileSize, MAX_TEXTURE_DIMENSION, false);
        return resultEncodedPixels;
    };
    Renderer.prototype.renderTilesWithMultiAnalyze1 = function (tilesA, filterLowA, filterHighA, multiplierA, onFrameRendered) {
        var _this = this;
        var _a = this, regl = _a.regl, textureManagerA = _a.textureManagerA, tileSize = _a.tileSize;
        var canvasSize = this.computeRequiredCanvasDimensions(tilesA.length);
        var canvasWidth = canvasSize[0], canvasHeight = canvasSize[1];
        this.setCanvasSize(canvasWidth, canvasHeight);
        var canvasCoordinates = this.getCanvasCoordinates(canvasWidth, canvasHeight, tilesA.length);
        var tilesWithCanvasCoordinates = lodashEs.zipWith(tilesA, canvasCoordinates, function (tilesA, canvasCoords) { return ({
            coords: tilesA.coords,
            tilesAPixelData: tilesA.pixelData,
            canvasCoords: canvasCoords,
        }); });
        var resultEncodedPixels = [];
        var renderFrame = function () {
            var chunks = lodashEs.chunk(tilesWithCanvasCoordinates, textureManagerA.tileCapacity);
            regl.clear({ color: CLEAR_COLOR });
            var tileIndex = 0;
            var _loop_4 = function (chunk_6) {
                var tilesABounds = chunk_6.map(function (_a) {
                    var coords = _a.coords, tilesAPixelData = _a.tilesAPixelData;
                    return textureManagerA.addTile(coords, tilesAPixelData);
                });
                chunk_6.forEach(function (_a, index) {
                    var canvasCoords = _a.canvasCoords;
                    var fboTile = regl.framebuffer({
                        width: tileSize,
                        height: tileSize,
                        depth: false,
                        colorFormat: "rgba",
                        colorType: "uint8",
                    });
                    var resultEncodedPixelsTile = new Uint8Array(tileSize * tileSize * 4);
                    _this.calcTileMultiAnalyze1({
                        canvasSize: [tileSize, tileSize],
                        canvasCoordinates: [0, 0],
                        textureA: textureManagerA.texture,
                        textureBoundsA: tilesABounds[index],
                        filterLowA: filterLowA,
                        filterHighA: filterHighA,
                        multiplierA: multiplierA,
                        fbo: fboTile,
                    });
                    _this.drawTileResult({
                        scaleLength: _this.scaleInput.length,
                        sentinelLength: _this.sentinelInput.length,
                        scaleColormap: _this.scaleColormap,
                        sentinelColormap: _this.sentinelColormap,
                        canvasSize: canvasSize,
                        canvasCoordinates: canvasCoords,
                        texture: fboTile,
                    });
                    fboTile.use(function () {
                        regl.read({ data: resultEncodedPixelsTile });
                    });
                    resultEncodedPixelsTile = _this.flipReadPixelsUint(tileSize, tileSize, resultEncodedPixelsTile);
                    resultEncodedPixels[tileIndex] = resultEncodedPixelsTile;
                    tileIndex += 1;
                    fboTile.destroy();
                });
            };
            for (var _i = 0, chunks_5 = chunks; _i < chunks_5.length; _i++) {
                var chunk_6 = chunks_5[_i];
                _loop_4(chunk_6);
            }
            onFrameRendered(canvasCoordinates);
        };
        renderFrame();
        this.textureManagerA.destroy();
        this.textureManagerA = new TextureManager(regl, tileSize, MAX_TEXTURE_DIMENSION, false);
        return resultEncodedPixels;
    };
    Renderer.prototype.renderTilesWithMultiAnalyze2 = function (tilesA, tilesB, filterLowA, filterHighA, filterLowB, filterHighB, multiplierA, multiplierB, onFrameRendered) {
        var _this = this;
        var _a = this, regl = _a.regl, textureManagerA = _a.textureManagerA, textureManagerB = _a.textureManagerB, tileSize = _a.tileSize;
        var canvasSize = this.computeRequiredCanvasDimensions(tilesA.length);
        var canvasWidth = canvasSize[0], canvasHeight = canvasSize[1];
        this.setCanvasSize(canvasWidth, canvasHeight);
        var canvasCoordinates = this.getCanvasCoordinates(canvasWidth, canvasHeight, tilesA.length);
        var tilesWithCanvasCoordinates = lodashEs.zipWith(tilesA, tilesB, canvasCoordinates, function (tilesA, tilesB, canvasCoords) { return ({
            coords: tilesA.coords,
            tilesAPixelData: tilesA.pixelData,
            tilesBPixelData: tilesB.pixelData,
            canvasCoords: canvasCoords,
        }); });
        var resultEncodedPixels = [];
        var renderFrame = function () {
            var chunks = lodashEs.chunk(tilesWithCanvasCoordinates, textureManagerA.tileCapacity);
            regl.clear({ color: CLEAR_COLOR });
            var tileIndex = 0;
            var _loop_5 = function (chunk_7) {
                var tilesABounds = chunk_7.map(function (_a) {
                    var coords = _a.coords, tilesAPixelData = _a.tilesAPixelData;
                    return textureManagerA.addTile(coords, tilesAPixelData);
                });
                var tilesBBounds = chunk_7.map(function (_a) {
                    var coords = _a.coords, tilesBPixelData = _a.tilesBPixelData;
                    return textureManagerB.addTile(coords, tilesBPixelData);
                });
                chunk_7.forEach(function (_a, index) {
                    var canvasCoords = _a.canvasCoords;
                    var fboTile = regl.framebuffer({
                        width: tileSize,
                        height: tileSize,
                        depth: false,
                        colorFormat: "rgba",
                        colorType: "uint8",
                    });
                    var resultEncodedPixelsTile = new Uint8Array(tileSize * tileSize * 4);
                    _this.calcTileMultiAnalyze2({
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
                        fbo: fboTile,
                    });
                    _this.drawTileResult({
                        scaleLength: _this.scaleInput.length,
                        sentinelLength: _this.sentinelInput.length,
                        scaleColormap: _this.scaleColormap,
                        sentinelColormap: _this.sentinelColormap,
                        canvasSize: canvasSize,
                        canvasCoordinates: canvasCoords,
                        texture: fboTile,
                    });
                    fboTile.use(function () {
                        regl.read({ data: resultEncodedPixelsTile });
                    });
                    resultEncodedPixelsTile = _this.flipReadPixelsUint(tileSize, tileSize, resultEncodedPixelsTile);
                    resultEncodedPixels[tileIndex] = resultEncodedPixelsTile;
                    tileIndex += 1;
                    fboTile.destroy();
                });
            };
            for (var _i = 0, chunks_6 = chunks; _i < chunks_6.length; _i++) {
                var chunk_7 = chunks_6[_i];
                _loop_5(chunk_7);
            }
            onFrameRendered(canvasCoordinates);
        };
        renderFrame();
        this.textureManagerA.destroy();
        this.textureManagerB.destroy();
        this.textureManagerA = new TextureManager(regl, tileSize, MAX_TEXTURE_DIMENSION, false);
        this.textureManagerB = new TextureManager(regl, tileSize, MAX_TEXTURE_DIMENSION, false);
        return resultEncodedPixels;
    };
    Renderer.prototype.renderTilesWithMultiAnalyze3 = function (tilesA, tilesB, tilesC, filterLowA, filterHighA, filterLowB, filterHighB, filterLowC, filterHighC, multiplierA, multiplierB, multiplierC, onFrameRendered) {
        var _this = this;
        var _a = this, regl = _a.regl, textureManagerA = _a.textureManagerA, textureManagerB = _a.textureManagerB, textureManagerC = _a.textureManagerC, tileSize = _a.tileSize;
        var canvasSize = this.computeRequiredCanvasDimensions(tilesA.length);
        var canvasWidth = canvasSize[0], canvasHeight = canvasSize[1];
        this.setCanvasSize(canvasWidth, canvasHeight);
        var canvasCoordinates = this.getCanvasCoordinates(canvasWidth, canvasHeight, tilesA.length);
        var tilesWithCanvasCoordinates = lodashEs.zipWith(tilesA, tilesB, tilesC, canvasCoordinates, function (tilesA, tilesB, tilesC, canvasCoords) { return ({
            coords: tilesA.coords,
            tilesAPixelData: tilesA.pixelData,
            tilesBPixelData: tilesB.pixelData,
            tilesCPixelData: tilesC.pixelData,
            canvasCoords: canvasCoords,
        }); });
        var resultEncodedPixels = [];
        var renderFrame = function () {
            var chunks = lodashEs.chunk(tilesWithCanvasCoordinates, textureManagerA.tileCapacity);
            regl.clear({ color: CLEAR_COLOR });
            var tileIndex = 0;
            var _loop_6 = function (chunk_8) {
                var tilesABounds = chunk_8.map(function (_a) {
                    var coords = _a.coords, tilesAPixelData = _a.tilesAPixelData;
                    return textureManagerA.addTile(coords, tilesAPixelData);
                });
                var tilesBBounds = chunk_8.map(function (_a) {
                    var coords = _a.coords, tilesBPixelData = _a.tilesBPixelData;
                    return textureManagerB.addTile(coords, tilesBPixelData);
                });
                var tilesCBounds = chunk_8.map(function (_a) {
                    var coords = _a.coords, tilesCPixelData = _a.tilesCPixelData;
                    return textureManagerC.addTile(coords, tilesCPixelData);
                });
                chunk_8.forEach(function (_a, index) {
                    var canvasCoords = _a.canvasCoords;
                    var fboTile = regl.framebuffer({
                        width: tileSize,
                        height: tileSize,
                        depth: false,
                        colorFormat: "rgba",
                        colorType: "uint8",
                    });
                    var resultEncodedPixelsTile = new Uint8Array(tileSize * tileSize * 4);
                    _this.calcTileMultiAnalyze3({
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
                        fbo: fboTile,
                    });
                    _this.drawTileResult({
                        scaleLength: _this.scaleInput.length,
                        sentinelLength: _this.sentinelInput.length,
                        scaleColormap: _this.scaleColormap,
                        sentinelColormap: _this.sentinelColormap,
                        canvasSize: canvasSize,
                        canvasCoordinates: canvasCoords,
                        texture: fboTile,
                    });
                    fboTile.use(function () {
                        regl.read({ data: resultEncodedPixelsTile });
                    });
                    resultEncodedPixelsTile = _this.flipReadPixelsUint(tileSize, tileSize, resultEncodedPixelsTile);
                    resultEncodedPixels[tileIndex] = resultEncodedPixelsTile;
                    tileIndex += 1;
                    fboTile.destroy();
                });
            };
            for (var _i = 0, chunks_7 = chunks; _i < chunks_7.length; _i++) {
                var chunk_8 = chunks_7[_i];
                _loop_6(chunk_8);
            }
            onFrameRendered(canvasCoordinates);
        };
        renderFrame();
        this.textureManagerA.destroy();
        this.textureManagerB.destroy();
        this.textureManagerC.destroy();
        this.textureManagerA = new TextureManager(regl, tileSize, MAX_TEXTURE_DIMENSION, false);
        this.textureManagerB = new TextureManager(regl, tileSize, MAX_TEXTURE_DIMENSION, false);
        this.textureManagerC = new TextureManager(regl, tileSize, MAX_TEXTURE_DIMENSION, false);
        return resultEncodedPixels;
    };
    Renderer.prototype.renderTilesWithMultiAnalyze4 = function (tilesA, tilesB, tilesC, tilesD, filterLowA, filterHighA, filterLowB, filterHighB, filterLowC, filterHighC, filterLowD, filterHighD, multiplierA, multiplierB, multiplierC, multiplierD, onFrameRendered) {
        var _this = this;
        var _a = this, regl = _a.regl, textureManagerA = _a.textureManagerA, textureManagerB = _a.textureManagerB, textureManagerC = _a.textureManagerC, textureManagerD = _a.textureManagerD, tileSize = _a.tileSize;
        var canvasSize = this.computeRequiredCanvasDimensions(tilesA.length);
        var canvasWidth = canvasSize[0], canvasHeight = canvasSize[1];
        this.setCanvasSize(canvasWidth, canvasHeight);
        var canvasCoordinates = this.getCanvasCoordinates(canvasWidth, canvasHeight, tilesA.length);
        var tilesWithCanvasCoordinates = lodashEs.zipWith(tilesA, tilesB, tilesC, tilesD, canvasCoordinates, function (tilesA, tilesB, tilesC, tilesD, canvasCoords) { return ({
            coords: tilesA.coords,
            tilesAPixelData: tilesA.pixelData,
            tilesBPixelData: tilesB.pixelData,
            tilesCPixelData: tilesC.pixelData,
            tilesDPixelData: tilesD.pixelData,
            canvasCoords: canvasCoords,
        }); });
        var resultEncodedPixels = [];
        var renderFrame = function () {
            var chunks = lodashEs.chunk(tilesWithCanvasCoordinates, textureManagerA.tileCapacity);
            regl.clear({ color: CLEAR_COLOR });
            var tileIndex = 0;
            var _loop_7 = function (chunk_9) {
                var tilesABounds = chunk_9.map(function (_a) {
                    var coords = _a.coords, tilesAPixelData = _a.tilesAPixelData;
                    return textureManagerA.addTile(coords, tilesAPixelData);
                });
                var tilesBBounds = chunk_9.map(function (_a) {
                    var coords = _a.coords, tilesBPixelData = _a.tilesBPixelData;
                    return textureManagerB.addTile(coords, tilesBPixelData);
                });
                var tilesCBounds = chunk_9.map(function (_a) {
                    var coords = _a.coords, tilesCPixelData = _a.tilesCPixelData;
                    return textureManagerC.addTile(coords, tilesCPixelData);
                });
                var tilesDBounds = chunk_9.map(function (_a) {
                    var coords = _a.coords, tilesDPixelData = _a.tilesDPixelData;
                    return textureManagerD.addTile(coords, tilesDPixelData);
                });
                chunk_9.forEach(function (_a, index) {
                    var canvasCoords = _a.canvasCoords;
                    var fboTile = regl.framebuffer({
                        width: tileSize,
                        height: tileSize,
                        depth: false,
                        colorFormat: "rgba",
                        colorType: "uint8",
                    });
                    var resultEncodedPixelsTile = new Uint8Array(tileSize * tileSize * 4);
                    _this.calcTileMultiAnalyze4({
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
                        fbo: fboTile,
                    });
                    _this.drawTileResult({
                        scaleLength: _this.scaleInput.length,
                        sentinelLength: _this.sentinelInput.length,
                        scaleColormap: _this.scaleColormap,
                        sentinelColormap: _this.sentinelColormap,
                        canvasSize: canvasSize,
                        canvasCoordinates: canvasCoords,
                        texture: fboTile,
                    });
                    fboTile.use(function () {
                        regl.read({ data: resultEncodedPixelsTile });
                    });
                    resultEncodedPixelsTile = _this.flipReadPixelsUint(tileSize, tileSize, resultEncodedPixelsTile);
                    resultEncodedPixels[tileIndex] = resultEncodedPixelsTile;
                    tileIndex += 1;
                    fboTile.destroy();
                });
            };
            for (var _i = 0, chunks_8 = chunks; _i < chunks_8.length; _i++) {
                var chunk_9 = chunks_8[_i];
                _loop_7(chunk_9);
            }
            onFrameRendered(canvasCoordinates);
        };
        renderFrame();
        this.textureManagerA.destroy();
        this.textureManagerB.destroy();
        this.textureManagerC.destroy();
        this.textureManagerD.destroy();
        this.textureManagerA = new TextureManager(regl, tileSize, MAX_TEXTURE_DIMENSION, false);
        this.textureManagerB = new TextureManager(regl, tileSize, MAX_TEXTURE_DIMENSION, false);
        this.textureManagerC = new TextureManager(regl, tileSize, MAX_TEXTURE_DIMENSION, false);
        this.textureManagerD = new TextureManager(regl, tileSize, MAX_TEXTURE_DIMENSION, false);
        return resultEncodedPixels;
    };
    Renderer.prototype.renderTilesWithMultiAnalyze5 = function (tilesA, tilesB, tilesC, tilesD, tilesE, filterLowA, filterHighA, filterLowB, filterHighB, filterLowC, filterHighC, filterLowD, filterHighD, filterLowE, filterHighE, multiplierA, multiplierB, multiplierC, multiplierD, multiplierE, onFrameRendered) {
        var _this = this;
        var _a = this, regl = _a.regl, textureManagerA = _a.textureManagerA, textureManagerB = _a.textureManagerB, textureManagerC = _a.textureManagerC, textureManagerD = _a.textureManagerD, textureManagerE = _a.textureManagerE, tileSize = _a.tileSize;
        var canvasSize = this.computeRequiredCanvasDimensions(tilesA.length);
        var canvasWidth = canvasSize[0], canvasHeight = canvasSize[1];
        this.setCanvasSize(canvasWidth, canvasHeight);
        var canvasCoordinates = this.getCanvasCoordinates(canvasWidth, canvasHeight, tilesA.length);
        var tilesWithCanvasCoordinates = lodashEs.zipWith(tilesA, tilesB, tilesC, tilesD, tilesE, canvasCoordinates, function (tilesA, tilesB, tilesC, tilesD, tilesE, canvasCoords) { return ({
            coords: tilesA.coords,
            tilesAPixelData: tilesA.pixelData,
            tilesBPixelData: tilesB.pixelData,
            tilesCPixelData: tilesC.pixelData,
            tilesDPixelData: tilesD.pixelData,
            tilesEPixelData: tilesE.pixelData,
            canvasCoords: canvasCoords,
        }); });
        var resultEncodedPixels = [];
        var renderFrame = function () {
            var chunks = lodashEs.chunk(tilesWithCanvasCoordinates, textureManagerA.tileCapacity);
            regl.clear({ color: CLEAR_COLOR });
            var tileIndex = 0;
            var _loop_8 = function (chunk_10) {
                var tilesABounds = chunk_10.map(function (_a) {
                    var coords = _a.coords, tilesAPixelData = _a.tilesAPixelData;
                    return textureManagerA.addTile(coords, tilesAPixelData);
                });
                var tilesBBounds = chunk_10.map(function (_a) {
                    var coords = _a.coords, tilesBPixelData = _a.tilesBPixelData;
                    return textureManagerB.addTile(coords, tilesBPixelData);
                });
                var tilesCBounds = chunk_10.map(function (_a) {
                    var coords = _a.coords, tilesCPixelData = _a.tilesCPixelData;
                    return textureManagerC.addTile(coords, tilesCPixelData);
                });
                var tilesDBounds = chunk_10.map(function (_a) {
                    var coords = _a.coords, tilesDPixelData = _a.tilesDPixelData;
                    return textureManagerD.addTile(coords, tilesDPixelData);
                });
                var tilesEBounds = chunk_10.map(function (_a) {
                    var coords = _a.coords, tilesEPixelData = _a.tilesEPixelData;
                    return textureManagerE.addTile(coords, tilesEPixelData);
                });
                chunk_10.forEach(function (_a, index) {
                    var canvasCoords = _a.canvasCoords;
                    var fboTile = regl.framebuffer({
                        width: tileSize,
                        height: tileSize,
                        depth: false,
                        colorFormat: "rgba",
                        colorType: "uint8",
                    });
                    var resultEncodedPixelsTile = new Uint8Array(tileSize * tileSize * 4);
                    _this.calcTileMultiAnalyze5({
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
                        fbo: fboTile,
                    });
                    _this.drawTileResult({
                        scaleLength: _this.scaleInput.length,
                        sentinelLength: _this.sentinelInput.length,
                        scaleColormap: _this.scaleColormap,
                        sentinelColormap: _this.sentinelColormap,
                        canvasSize: canvasSize,
                        canvasCoordinates: canvasCoords,
                        texture: fboTile,
                    });
                    fboTile.use(function () {
                        regl.read({ data: resultEncodedPixelsTile });
                    });
                    resultEncodedPixelsTile = _this.flipReadPixelsUint(tileSize, tileSize, resultEncodedPixelsTile);
                    resultEncodedPixels[tileIndex] = resultEncodedPixelsTile;
                    tileIndex += 1;
                    fboTile.destroy();
                });
            };
            for (var _i = 0, chunks_9 = chunks; _i < chunks_9.length; _i++) {
                var chunk_10 = chunks_9[_i];
                _loop_8(chunk_10);
            }
            onFrameRendered(canvasCoordinates);
        };
        renderFrame();
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
    };
    Renderer.prototype.renderTilesWithMultiAnalyze6 = function (tilesA, tilesB, tilesC, tilesD, tilesE, tilesF, filterLowA, filterHighA, filterLowB, filterHighB, filterLowC, filterHighC, filterLowD, filterHighD, filterLowE, filterHighE, filterLowF, filterHighF, multiplierA, multiplierB, multiplierC, multiplierD, multiplierE, multiplierF, onFrameRendered) {
        var _this = this;
        var _a = this, regl = _a.regl, textureManagerA = _a.textureManagerA, textureManagerB = _a.textureManagerB, textureManagerC = _a.textureManagerC, textureManagerD = _a.textureManagerD, textureManagerE = _a.textureManagerE, textureManagerF = _a.textureManagerF, tileSize = _a.tileSize;
        var canvasSize = this.computeRequiredCanvasDimensions(tilesA.length);
        var canvasWidth = canvasSize[0], canvasHeight = canvasSize[1];
        this.setCanvasSize(canvasWidth, canvasHeight);
        var canvasCoordinates = this.getCanvasCoordinates(canvasWidth, canvasHeight, tilesA.length);
        var tilesWithCanvasCoordinates = lodashEs.zipWith(tilesA, tilesB, tilesC, tilesD, tilesE, tilesF, canvasCoordinates, function (tilesA, tilesB, tilesC, tilesD, tilesE, tilesF, canvasCoords) { return ({
            coords: tilesA.coords,
            tilesAPixelData: tilesA.pixelData,
            tilesBPixelData: tilesB.pixelData,
            tilesCPixelData: tilesC.pixelData,
            tilesDPixelData: tilesD.pixelData,
            tilesEPixelData: tilesE.pixelData,
            tilesFPixelData: tilesF.pixelData,
            canvasCoords: canvasCoords,
        }); });
        var resultEncodedPixels = [];
        var renderFrame = function () {
            var chunks = lodashEs.chunk(tilesWithCanvasCoordinates, textureManagerA.tileCapacity);
            regl.clear({ color: CLEAR_COLOR });
            var tileIndex = 0;
            var _loop_9 = function (chunk_11) {
                var tilesABounds = chunk_11.map(function (_a) {
                    var coords = _a.coords, tilesAPixelData = _a.tilesAPixelData;
                    return textureManagerA.addTile(coords, tilesAPixelData);
                });
                var tilesBBounds = chunk_11.map(function (_a) {
                    var coords = _a.coords, tilesBPixelData = _a.tilesBPixelData;
                    return textureManagerB.addTile(coords, tilesBPixelData);
                });
                var tilesCBounds = chunk_11.map(function (_a) {
                    var coords = _a.coords, tilesCPixelData = _a.tilesCPixelData;
                    return textureManagerC.addTile(coords, tilesCPixelData);
                });
                var tilesDBounds = chunk_11.map(function (_a) {
                    var coords = _a.coords, tilesDPixelData = _a.tilesDPixelData;
                    return textureManagerD.addTile(coords, tilesDPixelData);
                });
                var tilesEBounds = chunk_11.map(function (_a) {
                    var coords = _a.coords, tilesEPixelData = _a.tilesEPixelData;
                    return textureManagerE.addTile(coords, tilesEPixelData);
                });
                var tilesFBounds = chunk_11.map(function (_a) {
                    var coords = _a.coords, tilesFPixelData = _a.tilesFPixelData;
                    return textureManagerF.addTile(coords, tilesFPixelData);
                });
                chunk_11.forEach(function (_a, index) {
                    var canvasCoords = _a.canvasCoords;
                    var fboTile = regl.framebuffer({
                        width: tileSize,
                        height: tileSize,
                        depth: false,
                        colorFormat: "rgba",
                        colorType: "uint8",
                    });
                    var resultEncodedPixelsTile = new Uint8Array(tileSize * tileSize * 4);
                    _this.calcTileMultiAnalyze6({
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
                        fbo: fboTile,
                    });
                    _this.drawTileResult({
                        scaleLength: _this.scaleInput.length,
                        sentinelLength: _this.sentinelInput.length,
                        scaleColormap: _this.scaleColormap,
                        sentinelColormap: _this.sentinelColormap,
                        canvasSize: canvasSize,
                        canvasCoordinates: canvasCoords,
                        texture: fboTile,
                    });
                    fboTile.use(function () {
                        regl.read({ data: resultEncodedPixelsTile });
                    });
                    resultEncodedPixelsTile = _this.flipReadPixelsUint(tileSize, tileSize, resultEncodedPixelsTile);
                    resultEncodedPixels[tileIndex] = resultEncodedPixelsTile;
                    tileIndex += 1;
                    fboTile.destroy();
                });
            };
            for (var _i = 0, chunks_10 = chunks; _i < chunks_10.length; _i++) {
                var chunk_11 = chunks_10[_i];
                _loop_9(chunk_11);
            }
            onFrameRendered(canvasCoordinates);
        };
        renderFrame();
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
    };
    Renderer.prototype.renderTilesWithTransition = function (oldTiles, newTiles, transitionDurationMs, onFrameRendered) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, regl, textureManager, tileSize, maxTextureDimension, canvasSize, canvasWidth, canvasHeight, canvasCoordinates, tilesWithCanvasCoordinates, newTextureManager, transitionStart, renderFrame, animationHandle;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this, regl = _a.regl, textureManager = _a.textureManager, tileSize = _a.tileSize, maxTextureDimension = _a.maxTextureDimension;
                        canvasSize = this.computeRequiredCanvasDimensions(oldTiles.length);
                        canvasWidth = canvasSize[0], canvasHeight = canvasSize[1];
                        this.setCanvasSize(canvasWidth, canvasHeight);
                        canvasCoordinates = this.getCanvasCoordinates(canvasWidth, canvasHeight, oldTiles.length);
                        tilesWithCanvasCoordinates = lodashEs.zipWith(oldTiles, newTiles, canvasCoordinates, function (oldTile, newTile, canvasCoords) { return ({
                            coords: oldTile.coords,
                            oldPixelData: oldTile.pixelData,
                            newPixelData: newTile.pixelData,
                            canvasCoords: canvasCoords,
                        }); });
                        newTextureManager = new TextureManager(regl, tileSize, maxTextureDimension, false);
                        transitionStart = regl.now();
                        renderFrame = function (interpolationFraction) {
                            var chunks = lodashEs.chunk(tilesWithCanvasCoordinates, textureManager.tileCapacity);
                            regl.clear({ color: CLEAR_COLOR });
                            var _loop_10 = function (chunk_12) {
                                var oldTextureBounds = chunk_12.map(function (_a) {
                                    var coords = _a.coords, oldPixelData = _a.oldPixelData;
                                    return textureManager.addTile(coords, oldPixelData);
                                });
                                var newTextureBounds = chunk_12.map(function (_a) {
                                    var coords = _a.coords, newPixelData = _a.newPixelData;
                                    return newTextureManager.addTile(coords, newPixelData);
                                });
                                _this.drawTileInterpolateValue(chunk_12.map(function (_a, index) {
                                    var canvasCoords = _a.canvasCoords;
                                    return ({
                                        scaleLength: _this.scaleInput.length,
                                        sentinelLength: _this.sentinelInput.length,
                                        scaleColormap: _this.scaleColormap,
                                        sentinelColormap: _this.sentinelColormap,
                                        canvasSize: canvasSize,
                                        canvasCoordinates: canvasCoords,
                                        textureA: textureManager.texture,
                                        textureB: newTextureManager.texture,
                                        textureBoundsA: oldTextureBounds[index],
                                        textureBoundsB: newTextureBounds[index],
                                        interpolationFraction: interpolationFraction,
                                    });
                                }));
                            };
                            for (var _i = 0, chunks_11 = chunks; _i < chunks_11.length; _i++) {
                                var chunk_12 = chunks_11[_i];
                                _loop_10(chunk_12);
                            }
                            onFrameRendered(canvasCoordinates);
                        };
                        animationHandle = regl.frame(function (_a) {
                            var time = _a.time;
                            var elapsedTimeMs = (time - transitionStart) * 1000;
                            var interpolationFraction = elapsedTimeMs / transitionDurationMs;
                            renderFrame(interpolationFraction);
                        });
                        return [4, Timer(transitionDurationMs)];
                    case 1:
                        _b.sent();
                        animationHandle.cancel();
                        renderFrame(1);
                        this.textureManager.destroy();
                        this.textureManager = newTextureManager;
                        return [2];
                }
            });
        });
    };
    Renderer.prototype.renderTilesWithTransitionAndNewColorScale = function (oldTiles, newTiles, transitionDurationMs, onFrameRendered) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, regl, textureManager, tileSize, maxTextureDimension, canvasSize, canvasWidth, canvasHeight, canvasCoordinates, tilesWithCanvasCoordinates, newTextureManager, transitionStart, renderFrame, animationHandle;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this, regl = _a.regl, textureManager = _a.textureManager, tileSize = _a.tileSize, maxTextureDimension = _a.maxTextureDimension;
                        canvasSize = this.computeRequiredCanvasDimensions(oldTiles.length);
                        canvasWidth = canvasSize[0], canvasHeight = canvasSize[1];
                        this.setCanvasSize(canvasWidth, canvasHeight);
                        canvasCoordinates = this.getCanvasCoordinates(canvasWidth, canvasHeight, oldTiles.length);
                        tilesWithCanvasCoordinates = lodashEs.zipWith(oldTiles, newTiles, canvasCoordinates, function (oldTile, newTile, canvasCoords) { return ({
                            coords: oldTile.coords,
                            oldPixelData: oldTile.pixelData,
                            newPixelData: newTile.pixelData,
                            canvasCoords: canvasCoords,
                        }); });
                        newTextureManager = new TextureManager(regl, tileSize, maxTextureDimension, false);
                        transitionStart = regl.now();
                        renderFrame = function (interpolationFraction) {
                            var chunks = lodashEs.chunk(tilesWithCanvasCoordinates, textureManager.tileCapacity);
                            regl.clear({ color: CLEAR_COLOR });
                            var _loop_11 = function (chunk_13) {
                                var oldTextureBounds = chunk_13.map(function (_a) {
                                    var coords = _a.coords, oldPixelData = _a.oldPixelData;
                                    return textureManager.addTile(coords, oldPixelData);
                                });
                                var newTextureBounds = chunk_13.map(function (_a) {
                                    var coords = _a.coords, newPixelData = _a.newPixelData;
                                    return newTextureManager.addTile(coords, newPixelData);
                                });
                                _this.drawTileInterpolateColor(chunk_13.map(function (_a, index) {
                                    var canvasCoords = _a.canvasCoords;
                                    return ({
                                        scaleLengthA: _this.scaleInputPrevious.length,
                                        sentinelLengthA: _this.sentinelInputPrevious.length,
                                        scaleColormapA: _this.scaleColormapPrevious,
                                        sentinelColormapA: _this.sentinelColormapPrevious,
                                        scaleLengthB: _this.scaleInput.length,
                                        sentinelLengthB: _this.sentinelInput.length,
                                        scaleColormapB: _this.scaleColormap,
                                        sentinelColormapB: _this.sentinelColormap,
                                        canvasSize: canvasSize,
                                        canvasCoordinates: canvasCoords,
                                        textureA: textureManager.texture,
                                        textureB: newTextureManager.texture,
                                        textureBoundsA: oldTextureBounds[index],
                                        textureBoundsB: newTextureBounds[index],
                                        interpolationFraction: interpolationFraction,
                                    });
                                }));
                            };
                            for (var _i = 0, chunks_12 = chunks; _i < chunks_12.length; _i++) {
                                var chunk_13 = chunks_12[_i];
                                _loop_11(chunk_13);
                            }
                            onFrameRendered(canvasCoordinates);
                        };
                        animationHandle = regl.frame(function (_a) {
                            var time = _a.time;
                            var elapsedTimeMs = (time - transitionStart) * 1000;
                            var interpolationFraction = elapsedTimeMs / transitionDurationMs;
                            renderFrame(interpolationFraction);
                        });
                        return [4, Timer(transitionDurationMs)];
                    case 1:
                        _b.sent();
                        animationHandle.cancel();
                        renderFrame(1);
                        this.textureManager.destroy();
                        this.textureManager = newTextureManager;
                        return [2];
                }
            });
        });
    };
    Renderer.prototype.renderTilesWithTransitionAndNewColorScaleOnly = function (tiles, transitionDurationMs, onFrameRendered) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, regl, textureManager, tileSize, maxTextureDimension, canvasSize, canvasWidth, canvasHeight, canvasCoordinates, tilesWithCanvasCoordinates, newTextureManager, transitionStart, renderFrame, animationHandle;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this, regl = _a.regl, textureManager = _a.textureManager, tileSize = _a.tileSize, maxTextureDimension = _a.maxTextureDimension;
                        canvasSize = this.computeRequiredCanvasDimensions(tiles.length);
                        canvasWidth = canvasSize[0], canvasHeight = canvasSize[1];
                        this.setCanvasSize(canvasWidth, canvasHeight);
                        canvasCoordinates = this.getCanvasCoordinates(canvasWidth, canvasHeight, tiles.length);
                        tilesWithCanvasCoordinates = lodashEs.zipWith(tiles, canvasCoordinates, function (tile, canvasCoords) { return (__assign(__assign({}, tile), { canvasCoords: canvasCoords })); });
                        newTextureManager = new TextureManager(regl, tileSize, maxTextureDimension, false);
                        transitionStart = regl.now();
                        renderFrame = function (interpolationFraction) {
                            var chunks = lodashEs.chunk(tilesWithCanvasCoordinates, textureManager.tileCapacity);
                            regl.clear({ color: CLEAR_COLOR });
                            var _loop_12 = function (chunk_14) {
                                var textureBounds = chunk_14.map(function (_a) {
                                    var coords = _a.coords, pixelData = _a.pixelData;
                                    return textureManager.addTile(coords, pixelData);
                                });
                                _this.drawTileInterpolateColorOnly(chunk_14.map(function (_a, index) {
                                    var canvasCoords = _a.canvasCoords;
                                    return ({
                                        scaleLengthA: _this.scaleInputPrevious.length,
                                        sentinelLengthA: _this.sentinelInputPrevious.length,
                                        scaleColormapA: _this.scaleColormapPrevious,
                                        sentinelColormapA: _this.sentinelColormapPrevious,
                                        scaleLengthB: _this.scaleInput.length,
                                        sentinelLengthB: _this.sentinelInput.length,
                                        scaleColormapB: _this.scaleColormap,
                                        sentinelColormapB: _this.sentinelColormap,
                                        canvasSize: canvasSize,
                                        canvasCoordinates: canvasCoords,
                                        texture: textureManager.texture,
                                        textureBounds: textureBounds[index],
                                        interpolationFraction: interpolationFraction,
                                    });
                                }));
                            };
                            for (var _i = 0, chunks_13 = chunks; _i < chunks_13.length; _i++) {
                                var chunk_14 = chunks_13[_i];
                                _loop_12(chunk_14);
                            }
                            onFrameRendered(canvasCoordinates);
                        };
                        animationHandle = regl.frame(function (_a) {
                            var time = _a.time;
                            var elapsedTimeMs = (time - transitionStart) * 1000;
                            var interpolationFraction = elapsedTimeMs / transitionDurationMs;
                            renderFrame(interpolationFraction);
                        });
                        return [4, Timer(transitionDurationMs)];
                    case 1:
                        _b.sent();
                        animationHandle.cancel();
                        renderFrame(1);
                        this.textureManager.destroy();
                        this.textureManager = newTextureManager;
                        return [2];
                }
            });
        });
    };
    Renderer.prototype.generateSunDirections = function (iterations, sunRadiusMultiplier) {
        var sunDirections = [];
        for (var i = 0; i < iterations; i++) {
            var direction = glMatrix.vec3.normalize(glMatrix.vec3.create(), glMatrix.vec3.add(glMatrix.vec3.create(), glMatrix.vec3.scale(glMatrix.vec3.create(), glMatrix.vec3.normalize(glMatrix.vec3.create(), [1, 1, 1]), EARTH_SUN_DISTANCE), glMatrix.vec3.random(glMatrix.vec3.create(), SUN_RADIUS * sunRadiusMultiplier)));
            sunDirections.push(direction);
        }
        this.sunDirections = sunDirections;
    };
    Renderer.prototype.generateAmbientDirections = function (iterations) {
        var ambientDirections = [];
        for (var i = 0; i < iterations; i++) {
            var direction = glMatrix.vec3.random(glMatrix.vec3.create(), Math.random());
            ambientDirections.push(direction);
        }
        this.ambientDirections = ambientDirections;
    };
    Renderer.prototype.removeTile = function (tileCoordinates) {
        this.textureManager.removeTile(tileCoordinates);
    };
    Renderer.prototype.setCanvasSize = function (width, height) {
        Object.assign(this.canvas, { width: width, height: height });
    };
    Renderer.prototype.computeRequiredCanvasDimensions = function (numTiles) {
        var tileSize = this.tileSize;
        var tilesAcross = Math.ceil(Math.sqrt(numTiles));
        var tilesDown = Math.ceil(numTiles / tilesAcross);
        return [tilesAcross * tileSize, tilesDown * tileSize];
    };
    Renderer.prototype.getCanvasCoordinates = function (canvasWidth, canvasHeight, numTiles) {
        var tileSize = this.tileSize;
        return lodashEs.flatMap(range(0, canvasHeight, tileSize), function (y) {
            return range(0, canvasWidth, tileSize).map(function (x) { return [x, y]; });
        }).slice(0, numTiles);
    };
    return Renderer;
}());

var d3 = {
    select: d3Selection.select,
    selectAll: d3Selection.selectAll,
    scaleLinear: d3Scale.scaleLinear,
    geoPath: d3Geo.geoPath,
    contours: d3Contour.contours,
    interpolateHcl: d3Interpolate.interpolateHcl,
    json: d3Request.json,
    min: d3Array.min,
    max: d3Array.max,
    scan: d3Array.scan,
    range: d3Array.range,
};
var BYTES_PER_WORD = 4;
var littleEndian$1 = machineIsLittleEndian();
var defaultOptions = {
    tileFormat: 'float32',
    colorScale: [],
    sentinelValues: [],
    transitions: false,
    transitionTimeMs: 800,
    debug: false,
    extraPixelLayers: 0,
    colorscaleMaxLength: 16,
    sentinelMaxLength: 16,
    minZoom: 0,
    maxZoom: 18,
    subdomains: 'abc',
    errorTileUrl: '',
    zoomOffset: 0,
    tms: false,
    zoomReverse: false,
    detectRetina: false,
    crossOrigin: false,
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
    hillshadeType: 'none',
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
    contourType: 'none',
    contourSmoothLines: false,
    contourSmoothInput: false,
    contourSmoothInputKernel: 7,
    contourScaleFactor: 1,
    contourInterval: 25,
    contourIndexInterval: 100,
    contourLineColor: '#000000',
    contourIlluminatedHighlightColor: 'rgba(177,174,164,.5)',
    contourIlluminatedShadowColor: '#5b5143',
    contourIlluminatedShadowSize: 2,
    contourLineWeight: 0.5,
    contourLineIndexWeight: 2.0,
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
var GLOperations = (function (_super) {
    __extends(GLOperations, _super);
    function GLOperations(options) {
        var _this = _super.call(this, Object.assign({}, defaultOptions, options)) || this;
        _this._contourData = {};
        _this._checkColorScaleAndSentinels();
        var _a = _this.options, nodataValue = _a.nodataValue, preloadUrl = _a.preloadUrl;
        var tileSize = _this._tileSizeAsNumber();
        var renderer = new Renderer(_this, tileSize, nodataValue, _this.options.colorScale, _this.options.sentinelValues, _this.options.colorscaleMaxLength, _this.options.sentinelMaxLength);
        Object.assign(_this, {
            _renderer: renderer,
            _preloadTileCache: undefined,
        });
        _this._maybePreload(preloadUrl);
        _this._renderer.generateAmbientDirections(_this.options.hsAdvAmbientIterations);
        _this._renderer.generateSunDirections(_this.options.hsAdvSoftIterations, _this.options.hsAdvSunRadiusMultiplier);
        _this.on("tileunload", _this._onTileRemove.bind(_this));
        _this.on("load", function (_) {
            return setTimeout(function () {
                if (_this.options.debug)
                    console.log("all tiles loaded. Updating contours if enabled.");
                _this._maybeUpdateMergedArrayAndDrawContours();
            }, 300);
        });
        setTimeout(function () {
            _this._map.on("zoomend", function (_) {
                var promise = delay(50);
                promise.then(function () { return __awaiter(_this, void 0, void 0, function () {
                    var activeTilesBounds;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(this.options.contourType !== "none")) return [3, 2];
                                if (this.options.debug)
                                    console.log("zoom changed. Moving contour canvas.");
                                return [4, this._getActivetilesBounds()];
                            case 1:
                                activeTilesBounds = _a.sent();
                                this._moveContourCanvas(activeTilesBounds);
                                _a.label = 2;
                            case 2: return [2];
                        }
                    });
                }); });
            });
        }, 300);
        return _this;
    }
    GLOperations.prototype.updateOptions = function (options) {
        var _this = this;
        var _a = this.options, prevUrl = _a.url, prevGlOperation = _a.glOperation, prevUrlA = _a.operationUrlA, prevUrlB = _a.operationUrlB, prevUrlC = _a.operationUrlC, prevUrlD = _a.operationUrlD, prevUrlE = _a.operationUrlE, prevUrlF = _a.operationUrlF, prevColorScale = _a.colorScale, prevSentinelValues = _a.sentinelValues, prevFilterLowA = _a.filterLowA, prevFilterHighA = _a.filterHighA, prevFilterLowB = _a.filterLowB, prevFilterHighB = _a.filterHighB, prevFilterLowC = _a.filterLowC, prevFilterHighC = _a.filterHighC, prevFilterLowD = _a.filterLowD, prevFilterHighD = _a.filterHighD, prevFilterLowE = _a.filterLowE, prevFilterHighE = _a.filterHighE, prevFilterLowF = _a.filterLowF, prevFilterHighF = _a.filterHighF, prevMultiplierA = _a.multiplierA, prevMultiplierB = _a.multiplierB, prevMultiplierC = _a.multiplierC, prevMultiplierD = _a.multiplierD, prevMultiplierE = _a.multiplierE, prevMultiplierF = _a.multiplierF, prevMultiLayers = _a.multiLayers, prevHsPregenUrl = _a.hsPregenUrl, prevHillshadeType = _a.hillshadeType, prevHsValueScale = _a.hsValueScale, prevHsPixelScale = _a.hsPixelScale, prevHsSimpleSlopescale = _a.hsSimpleSlopescale, prevHsSimpleAzimuth = _a.hsSimpleAzimuth, prevHsSimpleAltitude = _a.hsSimpleAltitude, prevHsAdvSoftIterations = _a.hsAdvSoftIterations, prevHsAdvAmbientIterations = _a.hsAdvAmbientIterations, prevHsAdvSunRadiusMultiplier = _a.hsAdvSunRadiusMultiplier, prevHsAdvFinalSoftMultiplier = _a.hsAdvFinalSoftMultiplier, prevHsAdvFinalAmbientMultiplier = _a.hsAdvFinalAmbientMultiplier, prevHsAdvBaselayerUrl = _a.hsAdvBaselayerUrl, prevContourInterval = _a.contourInterval, prevContourIndexInterval = _a.contourIndexInterval, prevContourLineColor = _a.contourLineColor, prevContourLineWeight = _a.contourLineWeight, prevContourLineIndexWeight = _a.contourLineIndexWeight, prevContourType = _a.contourType, prevContourSmoothLines = _a.contourSmoothLines, prevContourSmoothInput = _a.contourSmoothInput, prevContourSmoothInputKernel = _a.contourSmoothInputKernel, prevContourIlluminatedHighlightColor = _a.contourIlluminatedHighlightColor, prevContourIlluminatedShadowColor = _a.contourIlluminatedShadowColor, prevContourIlluminatedShadowSize = _a.contourIlluminatedShadowSize, prevContourHypso = _a.contourHypso, prevContourHypsoDomain = _a.contourHypsoDomain, prevContourHypsoColors = _a.contourHypsoColors, prevContourBathy = _a.contourBathy, prevContourBathyDomain = _a.contourBathyDomain, prevContourBathyColors = _a.contourBathyColors, prevContourBathyShadowColor = _a.contourBathyShadowColor, prevContourBathyHighlightColor = _a.contourBathyHighlightColor, prevContourIndexLabels = _a.contourIndexLabels, prevContourLabelFont = _a.contourLabelFont, prevContourLabelDistance = _a.contourLabelDistance, prevScaleMaxLength = _a.colorscaleMaxLength, prevSentinelMaxLength = _a.sentinelMaxLength;
        L.Util.setOptions(this, options);
        if (this.options.colorscaleMaxLength !== prevScaleMaxLength || this.options.sentinelMaxLength !== prevSentinelMaxLength) {
            if (this.options.debug)
                console.log("Creating new renderer");
            var tileSize = this._tileSizeAsNumber();
            var renderer = new Renderer(this, tileSize, this.options.nodataValue, this.options.colorScale, this.options.sentinelValues, this.options.colorscaleMaxLength, this.options.sentinelMaxLength);
            this._renderer.regl.destroy();
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
        if (this.options.hsAdvSoftIterations !== prevHsAdvSoftIterations ||
            this.options.hsAdvSunRadiusMultiplier !== prevHsAdvSunRadiusMultiplier) {
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
        if (this.options.hillshadeType !== prevHillshadeType) {
            if (this.options.hillshadeType === 'simple') {
                this._renderer.setMaxTextureDimension(this._tileSizeAsNumber());
            }
            else if (prevHillshadeType === 'simple') {
                this._renderer.setMaxTextureDimension(this._renderer.findMaxTextureDimension());
            }
        }
        if (this.options.url !== prevUrl) {
            this._renderer.textureManager.clearTiles();
        }
        if (this.options.hsAdvBaselayerUrl !== prevHsAdvBaselayerUrl) {
            this._renderer.textureManagerHillshade.clearTiles();
        }
        if (this.options.glOperation === 'none') {
            if (this.options.transitions) {
                if (this.options.url !== prevUrl) {
                    this._updateTilesWithTransitions(prevColorScale, prevSentinelValues);
                    if (this.options.debug)
                        console.log("Running GLOperations with transition on tiles");
                }
                else if (this.options.url === prevUrl) {
                    this._updateColorscaleWithTransitions(prevColorScale, prevSentinelValues);
                    if (this.options.debug)
                        console.log("Running GLOperations with transition on colorscale only");
                }
            }
            else {
                if (this.options.url !== prevUrl ||
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
                    this.options.hsAdvBaselayerUrl !== prevHsAdvBaselayerUrl) {
                    this._updateTiles();
                    if (this.options.debug)
                        console.log("Running GLOperations with new url, no transition and no operation");
                }
                else {
                    if (JSON.stringify(this.options.colorScale) !== JSON.stringify(prevColorScale)) {
                        this._updateTilesColorscaleOnly();
                        if (this.options.debug)
                            console.log("Running GLOperations with same url, no transition and no operation");
                    }
                }
            }
        }
        else if (this.options.glOperation === 'multi') {
            if (this.options.multiLayers === 1) {
                this._updateTilesWithMultiAnalyze1(prevGlOperation, prevMultiLayers, prevUrlA, prevFilterLowA, prevFilterHighA, prevMultiplierA);
            }
            else if (this.options.multiLayers === 2) {
                this._updateTilesWithMultiAnalyze2(prevGlOperation, prevMultiLayers, prevUrlA, prevUrlB, prevFilterLowA, prevFilterHighA, prevFilterLowB, prevFilterHighB, prevMultiplierA, prevMultiplierB);
            }
            else if (this.options.multiLayers === 3) {
                this._updateTilesWithMultiAnalyze3(prevGlOperation, prevMultiLayers, prevUrlA, prevUrlB, prevUrlC, prevFilterLowA, prevFilterHighA, prevFilterLowB, prevFilterHighB, prevFilterLowC, prevFilterHighC, prevMultiplierA, prevMultiplierB, prevMultiplierC);
            }
            else if (this.options.multiLayers === 4) {
                this._updateTilesWithMultiAnalyze4(prevGlOperation, prevMultiLayers, prevUrlA, prevUrlB, prevUrlC, prevUrlD, prevFilterLowA, prevFilterHighA, prevFilterLowB, prevFilterHighB, prevFilterLowC, prevFilterHighC, prevFilterLowD, prevFilterHighD, prevMultiplierA, prevMultiplierB, prevMultiplierC, prevMultiplierD);
            }
            else if (this.options.multiLayers === 5) {
                this._updateTilesWithMultiAnalyze5(prevGlOperation, prevMultiLayers, prevUrlA, prevUrlB, prevUrlC, prevUrlD, prevUrlE, prevFilterLowA, prevFilterHighA, prevFilterLowB, prevFilterHighB, prevFilterLowC, prevFilterHighC, prevFilterLowD, prevFilterHighD, prevFilterLowE, prevFilterHighE, prevMultiplierA, prevMultiplierB, prevMultiplierC, prevMultiplierD, prevMultiplierE);
            }
            else if (this.options.multiLayers === 6) {
                this._updateTilesWithMultiAnalyze6(prevGlOperation, prevMultiLayers, prevUrlA, prevUrlB, prevUrlC, prevUrlD, prevUrlE, prevUrlF, prevFilterLowA, prevFilterHighA, prevFilterLowB, prevFilterHighB, prevFilterLowC, prevFilterHighC, prevFilterLowD, prevFilterHighD, prevFilterLowE, prevFilterHighE, prevFilterLowF, prevFilterHighF, prevMultiplierA, prevMultiplierB, prevMultiplierC, prevMultiplierD, prevMultiplierE, prevMultiplierF);
            }
            if (this.options.debug)
                console.log("Running GLOperations with multiAnalyze");
        }
        else if (this.options.glOperation === 'diff') {
            this._updateTilesWithDiff(prevGlOperation, prevUrlA, prevUrlB);
            if (this.options.debug)
                console.log("Running GLOperations with diff");
        }
        if (this.options.contourType !== 'none') {
            if (this.options.contourType !== prevContourType && prevContourType === 'none') {
                if (this._contourData.mergedTileArray) {
                    setTimeout(function () {
                        _this._calculateAndDrawContours();
                    }, 50);
                }
                else {
                    setTimeout(function () {
                        _this._maybeUpdateMergedArrayAndDrawContours();
                    }, 50);
                }
            }
            else if (this.options.contourSmoothInput && (this.options.contourSmoothInput !== prevContourSmoothInput ||
                this.options.contourSmoothInputKernel !== prevContourSmoothInputKernel)) {
                var promise = delay(50);
                promise.then(function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        this._smoothContourInput();
                        this._calculateAndDrawContours();
                        return [2];
                    });
                }); });
            }
            else if (this.options.contourInterval !== prevContourInterval ||
                this.options.contourIndexInterval !== prevContourIndexInterval ||
                this.options.contourSmoothLines !== prevContourSmoothLines ||
                this.options.contourSmoothInput !== prevContourSmoothInput) {
                setTimeout(function () {
                    _this._calculateAndDrawContours();
                }, 50);
            }
            else if (this.options.contourType !== prevContourType ||
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
                this.options.contourLabelDistance !== prevContourLabelDistance) {
                this._drawContours();
            }
        }
        else if (this.options.contourType !== prevContourType && this.options.contourType === 'none') {
            this._clearContours();
            this._contourData.mergedTileArray = undefined;
        }
    };
    GLOperations.prototype.getEvents = function () {
        var _this = this;
        var _a = this.options, click = _a.onclick, dblclick = _a.ondblclick, mousedown = _a.onmousedown, mouseup = _a.onmouseup, mouseover = _a.onmouseover, mouseout = _a.onmouseout, mousemove = _a.onmousemove, contextmenu = _a.oncontextmenu;
        var definedHandlers = lodashEs.pickBy({
            click: click,
            dblclick: dblclick,
            mousedown: mousedown,
            mouseup: mouseup,
            mouseover: mouseover,
            mouseout: mouseout,
            mousemove: mousemove,
            contextmenu: contextmenu,
        }, function (handler) { return !lodashEs.isUndefined(handler); });
        return __assign(__assign({}, L.GridLayer.prototype.getEvents.call(this)), lodashEs.mapValues(definedHandlers, function (val) { return val && _this._wrapMouseEventHandler(val); }));
    };
    GLOperations.prototype.getTileUrl = function (coords, url) {
        var data = {
            r: L.Browser.retina ? '@2x' : '',
            s: this._getSubdomain(coords),
            x: coords.x,
            y: coords.y,
            z: this._getZoomForUrl(),
        };
        if (this._map && !this._map.options.crs.infinite) {
            var invertedY = this._globalTileRange.max.y - coords.y;
            if (this.options.tms) {
                data.y = invertedY;
            }
            data['-y'] = invertedY;
        }
        return L.Util.template(url, L.Util.extend(data, this.options));
    };
    GLOperations.prototype.redraw = function () {
        if (this._map) {
            this._removeAllTiles();
            this._update();
        }
        return this;
    };
    GLOperations.prototype.createTile = function (coords, done) {
        var _this = this;
        var _a = this.options, extraPixelLayers = _a.extraPixelLayers, tileSize = _a.tileSize, url = _a.url, hsPregenUrl = _a.hsPregenUrl, operationUrlA = _a.operationUrlA, operationUrlB = _a.operationUrlB, operationUrlC = _a.operationUrlC, operationUrlD = _a.operationUrlD, operationUrlE = _a.operationUrlE, operationUrlF = _a.operationUrlF, filterLowA = _a.filterLowA, filterHighA = _a.filterHighA, filterLowB = _a.filterLowB, filterHighB = _a.filterHighB, filterLowC = _a.filterLowC, filterHighC = _a.filterHighC, filterLowD = _a.filterLowD, filterHighD = _a.filterHighD, filterLowE = _a.filterLowE, filterHighE = _a.filterHighE, filterLowF = _a.filterLowF, filterHighF = _a.filterHighF, multiplierA = _a.multiplierA, multiplierB = _a.multiplierB, multiplierC = _a.multiplierC, multiplierD = _a.multiplierD, multiplierE = _a.multiplierE, multiplierF = _a.multiplierF;
        var tileCanvas = L.DomUtil.create('canvas');
        Object.assign(tileCanvas, {
            className: 'gl-tilelayer-tile',
            width: tileSize,
            height: tileSize,
        });
        if (this.options.glOperation === 'none') {
            if (extraPixelLayers === 1) {
                this._fetchTileData(coords, operationUrlA).then(function (pixelDataA) {
                    if (_this.options.debug)
                        console.log("createTile - extraPixelLayers === 1");
                    tileCanvas.pixelDataA = pixelDataA;
                });
            }
            if (this.options._hillshadeOptions.hillshadeType === 'pregen') {
                Promise.all([
                    this._fetchTileData(coords, url),
                    this._fetchTileData(coords, hsPregenUrl),
                ]).then(function (pixelDataArray) {
                    if (_this.options.debug)
                        console.log("_fetchTileData with pregen hs");
                    var pixelData = pixelDataArray[0];
                    var pixelDataHs = pixelDataArray[1];
                    var _a = _this._renderer.renderTileHsPregen({ coords: coords, pixelData: pixelData }, { coords: coords, pixelData: pixelDataHs }), sourceX = _a[0], sourceY = _a[1];
                    tileCanvas.pixelData = pixelData;
                    tileCanvas.pixelDataHsPregen = pixelDataHs;
                    _this._copyToTileCanvas(tileCanvas, sourceX, sourceY);
                    done(undefined, tileCanvas);
                });
            }
            else if (this.options._hillshadeOptions.hillshadeType === 'advanced') {
                (function () { return __awaiter(_this, void 0, void 0, function () {
                    var pixelData, hashKey, err_1, nodataTile, textureCoords, baselayerTexCoords, basePixelData, textureBounds, _a, sourceX, sourceY, err_2;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _b.trys.push([0, 12, , 13]);
                                pixelData = void 0;
                                hashKey = this._renderer.textureManager.hashTileCoordinates(coords);
                                if (!this._renderer.textureManager.contents.has(hashKey)) return [3, 5];
                                _b.label = 1;
                            case 1:
                                _b.trys.push([1, 2, , 4]);
                                pixelData = this._tiles[hashKey].el.pixelData;
                                return [3, 4];
                            case 2:
                                err_1 = _b.sent();
                                return [4, this._fetchTileData(coords, url)];
                            case 3:
                                pixelData = _b.sent();
                                this._renderer.textureManager.addTile(coords, pixelData);
                                return [3, 4];
                            case 4: return [3, 7];
                            case 5: return [4, this._fetchTileData(coords, url)];
                            case 6:
                                pixelData = _b.sent();
                                this._renderer.textureManager.addTile(coords, pixelData);
                                _b.label = 7;
                            case 7:
                                nodataTile = createNoDataTile(this.options.nodataValue, this._tileSizeAsNumber());
                                if (!!typedArraysAreEqual(pixelData, nodataTile)) return [3, 11];
                                return [4, getAdjacentTilesTexCoords(this, this._renderer.textureManager, coords, url)];
                            case 8:
                                textureCoords = _b.sent();
                                baselayerTexCoords = [];
                                if (!this.options.hsAdvBaselayerUrl) return [3, 10];
                                return [4, this._fetchTileData(coords, this.options.hsAdvBaselayerUrl, "image")];
                            case 9:
                                basePixelData = _b.sent();
                                textureBounds = this._renderer.textureManagerHillshade.addTile(coords, basePixelData);
                                baselayerTexCoords = getTexCoordVerticesTriangleStripQuad(textureBounds);
                                _b.label = 10;
                            case 10:
                                _a = this._renderer.renderTileHsAdvanced(this.options._hillshadeOptions, this._getZoomForUrl(), textureCoords, this._getPixelScale(), baselayerTexCoords), sourceX = _a[0], sourceY = _a[1];
                                tileCanvas.pixelData = pixelData;
                                this._copyToTileCanvas(tileCanvas, sourceX, sourceY);
                                _b.label = 11;
                            case 11:
                                done(undefined, tileCanvas);
                                return [3, 13];
                            case 12:
                                err_2 = _b.sent();
                                console.log(err_2);
                                return [3, 13];
                            case 13: return [2];
                        }
                    });
                }); })();
            }
            else {
                this._fetchTileData(coords, url).then(function (pixelData) {
                    if (_this.options.debug)
                        console.log("_fetchTileData with no operation");
                    var _a = _this._renderer.renderTile({ coords: coords, pixelData: pixelData }, _this.options._hillshadeOptions, _this._getZoomForUrl()), sourceX = _a[0], sourceY = _a[1];
                    tileCanvas.pixelData = pixelData;
                    _this._copyToTileCanvas(tileCanvas, sourceX, sourceY);
                    done(undefined, tileCanvas);
                });
            }
        }
        else if (this.options.glOperation === 'diff') {
            Promise.all([
                this._fetchTileData(coords, operationUrlA),
                this._fetchTileData(coords, operationUrlB),
            ]).then(function (pixelDataArray) {
                if (_this.options.debug)
                    console.log("_fetchTileData with diff");
                var pixelDataA = pixelDataArray[0];
                var pixelDataB = pixelDataArray[1];
                var _a = _this._renderer.renderTileDiff({ coords: coords, pixelData: pixelDataA }, { coords: coords, pixelData: pixelDataB }), sourceX = _a[0], sourceY = _a[1], resultEncodedPixels = _a[2];
                tileCanvas.pixelData = resultEncodedPixels;
                tileCanvas.pixelDataA = pixelDataA;
                tileCanvas.pixelDataB = pixelDataB;
                _this._copyToTileCanvas(tileCanvas, sourceX, sourceY);
                done(undefined, tileCanvas);
            });
        }
        else if (this.options.glOperation === 'multi' && this.options.multiLayers === 1) {
            Promise.all([
                this._fetchTileData(coords, operationUrlA)
            ]).then(function (pixelDataArray) {
                if (_this.options.debug)
                    console.log("_fetchTileData with multi");
                var pixelDataA = pixelDataArray[0];
                var _a = _this._renderer.renderTileMulti1({ coords: coords, pixelData: pixelDataA }, filterLowA, filterHighA, multiplierA), sourceX = _a[0], sourceY = _a[1], resultEncodedPixels = _a[2];
                tileCanvas.pixelData = resultEncodedPixels;
                tileCanvas.pixelDataA = pixelDataA;
                _this._copyToTileCanvas(tileCanvas, sourceX, sourceY);
                done(undefined, tileCanvas);
            });
        }
        else if (this.options.glOperation === 'multi' && this.options.multiLayers === 2) {
            Promise.all([
                this._fetchTileData(coords, operationUrlA),
                this._fetchTileData(coords, operationUrlB),
            ]).then(function (pixelDataArray) {
                if (_this.options.debug)
                    console.log("_fetchTileData with multi");
                var pixelDataA = pixelDataArray[0];
                var pixelDataB = pixelDataArray[1];
                var _a = _this._renderer.renderTileMulti2({ coords: coords, pixelData: pixelDataA }, { coords: coords, pixelData: pixelDataB }, filterLowA, filterHighA, filterLowB, filterHighB, multiplierA, multiplierB), sourceX = _a[0], sourceY = _a[1], resultEncodedPixels = _a[2];
                tileCanvas.pixelData = resultEncodedPixels;
                tileCanvas.pixelDataA = pixelDataA;
                tileCanvas.pixelDataB = pixelDataB;
                _this._copyToTileCanvas(tileCanvas, sourceX, sourceY);
                done(undefined, tileCanvas);
            });
        }
        else if (this.options.glOperation === 'multi' && this.options.multiLayers === 3) {
            Promise.all([
                this._fetchTileData(coords, operationUrlA),
                this._fetchTileData(coords, operationUrlB),
                this._fetchTileData(coords, operationUrlC),
            ]).then(function (pixelDataArray) {
                if (_this.options.debug)
                    console.log("_fetchTileData with multi");
                var pixelDataA = pixelDataArray[0];
                var pixelDataB = pixelDataArray[1];
                var pixelDataC = pixelDataArray[2];
                var _a = _this._renderer.renderTileMulti3({ coords: coords, pixelData: pixelDataA }, { coords: coords, pixelData: pixelDataB }, { coords: coords, pixelData: pixelDataC }, filterLowA, filterHighA, filterLowB, filterHighB, filterLowC, filterHighC, multiplierA, multiplierB, multiplierC), sourceX = _a[0], sourceY = _a[1], resultEncodedPixels = _a[2];
                tileCanvas.pixelData = resultEncodedPixels;
                tileCanvas.pixelDataA = pixelDataA;
                tileCanvas.pixelDataB = pixelDataB;
                tileCanvas.pixelDataC = pixelDataC;
                _this._copyToTileCanvas(tileCanvas, sourceX, sourceY);
                done(undefined, tileCanvas);
            });
        }
        else if (this.options.glOperation === 'multi' && this.options.multiLayers === 4) {
            Promise.all([
                this._fetchTileData(coords, operationUrlA),
                this._fetchTileData(coords, operationUrlB),
                this._fetchTileData(coords, operationUrlC),
                this._fetchTileData(coords, operationUrlD),
            ]).then(function (pixelDataArray) {
                if (_this.options.debug)
                    console.log("_fetchTileData with multi");
                var pixelDataA = pixelDataArray[0];
                var pixelDataB = pixelDataArray[1];
                var pixelDataC = pixelDataArray[2];
                var pixelDataD = pixelDataArray[3];
                var _a = _this._renderer.renderTileMulti4({ coords: coords, pixelData: pixelDataA }, { coords: coords, pixelData: pixelDataB }, { coords: coords, pixelData: pixelDataC }, { coords: coords, pixelData: pixelDataD }, filterLowA, filterHighA, filterLowB, filterHighB, filterLowC, filterHighC, filterLowD, filterHighD, multiplierA, multiplierB, multiplierC, multiplierD), sourceX = _a[0], sourceY = _a[1], resultEncodedPixels = _a[2];
                tileCanvas.pixelData = resultEncodedPixels;
                tileCanvas.pixelDataA = pixelDataA;
                tileCanvas.pixelDataB = pixelDataB;
                tileCanvas.pixelDataC = pixelDataC;
                tileCanvas.pixelDataD = pixelDataD;
                _this._copyToTileCanvas(tileCanvas, sourceX, sourceY);
                done(undefined, tileCanvas);
            });
        }
        else if (this.options.glOperation === 'multi' && this.options.multiLayers === 5) {
            Promise.all([
                this._fetchTileData(coords, operationUrlA),
                this._fetchTileData(coords, operationUrlB),
                this._fetchTileData(coords, operationUrlC),
                this._fetchTileData(coords, operationUrlD),
                this._fetchTileData(coords, operationUrlE),
            ]).then(function (pixelDataArray) {
                if (_this.options.debug)
                    console.log("_fetchTileData with multi");
                var pixelDataA = pixelDataArray[0];
                var pixelDataB = pixelDataArray[1];
                var pixelDataC = pixelDataArray[2];
                var pixelDataD = pixelDataArray[3];
                var pixelDataE = pixelDataArray[4];
                var _a = _this._renderer.renderTileMulti5({ coords: coords, pixelData: pixelDataA }, { coords: coords, pixelData: pixelDataB }, { coords: coords, pixelData: pixelDataC }, { coords: coords, pixelData: pixelDataD }, { coords: coords, pixelData: pixelDataE }, filterLowA, filterHighA, filterLowB, filterHighB, filterLowC, filterHighC, filterLowD, filterHighD, filterLowE, filterHighE, multiplierA, multiplierB, multiplierC, multiplierD, multiplierE), sourceX = _a[0], sourceY = _a[1], resultEncodedPixels = _a[2];
                tileCanvas.pixelData = resultEncodedPixels;
                tileCanvas.pixelDataA = pixelDataA;
                tileCanvas.pixelDataB = pixelDataB;
                tileCanvas.pixelDataC = pixelDataC;
                tileCanvas.pixelDataD = pixelDataD;
                tileCanvas.pixelDataE = pixelDataE;
                _this._copyToTileCanvas(tileCanvas, sourceX, sourceY);
                done(undefined, tileCanvas);
            });
        }
        else if (this.options.glOperation === 'multi' && this.options.multiLayers === 6) {
            Promise.all([
                this._fetchTileData(coords, operationUrlA),
                this._fetchTileData(coords, operationUrlB),
                this._fetchTileData(coords, operationUrlC),
                this._fetchTileData(coords, operationUrlD),
                this._fetchTileData(coords, operationUrlE),
                this._fetchTileData(coords, operationUrlF),
            ]).then(function (pixelDataArray) {
                if (_this.options.debug)
                    console.log("_fetchTileData with multi");
                var pixelDataA = pixelDataArray[0];
                var pixelDataB = pixelDataArray[1];
                var pixelDataC = pixelDataArray[2];
                var pixelDataD = pixelDataArray[3];
                var pixelDataE = pixelDataArray[4];
                var pixelDataF = pixelDataArray[5];
                var _a = _this._renderer.renderTileMulti6({ coords: coords, pixelData: pixelDataA }, { coords: coords, pixelData: pixelDataB }, { coords: coords, pixelData: pixelDataC }, { coords: coords, pixelData: pixelDataD }, { coords: coords, pixelData: pixelDataE }, { coords: coords, pixelData: pixelDataF }, filterLowA, filterHighA, filterLowB, filterHighB, filterLowC, filterHighC, filterLowD, filterHighD, filterLowE, filterHighE, filterLowF, filterHighF, multiplierA, multiplierB, multiplierC, multiplierD, multiplierE, multiplierF), sourceX = _a[0], sourceY = _a[1], resultEncodedPixels = _a[2];
                tileCanvas.pixelData = resultEncodedPixels;
                tileCanvas.pixelDataA = pixelDataA;
                tileCanvas.pixelDataB = pixelDataB;
                tileCanvas.pixelDataC = pixelDataC;
                tileCanvas.pixelDataD = pixelDataD;
                tileCanvas.pixelDataE = pixelDataE;
                tileCanvas.pixelDataF = pixelDataF;
                _this._copyToTileCanvas(tileCanvas, sourceX, sourceY);
                done(undefined, tileCanvas);
            });
        }
        return tileCanvas;
    };
    GLOperations.prototype._checkColorScaleAndSentinels = function () {
        var _a = this.options, colorScale = _a.colorScale, sentinelValues = _a.sentinelValues, colorscaleMaxLength = _a.colorscaleMaxLength, sentinelMaxLength = _a.sentinelMaxLength;
        if (colorScale.length === 0 && sentinelValues.length === 0) {
            throw new Error('Either `colorScale` or `sentinelValues` must be of non-zero length.');
        }
        if (colorScale.length > colorscaleMaxLength) {
            throw new Error("Color scale length " + colorScale.length + " exceeds the maximum, " + colorscaleMaxLength + ".");
        }
        if (sentinelValues.length > sentinelMaxLength) {
            throw new Error("Sentinel values length " + sentinelValues.length + " exceeds the maximum, " + sentinelMaxLength + ".");
        }
    };
    GLOperations.prototype._getSubdomain = function (tilePoint) {
        var index = Math.abs(tilePoint.x + tilePoint.y) % this.options.subdomains.length;
        return this.options.subdomains[index];
    };
    GLOperations.prototype._getZoomForUrl = function () {
        var _a = this.options, maxZoom = _a.maxZoom, zoomReverse = _a.zoomReverse, zoomOffset = _a.zoomOffset;
        var tileZoom = this._tileZoom;
        var zoom = zoomReverse ? maxZoom - tileZoom : tileZoom;
        return zoom + zoomOffset;
    };
    GLOperations.prototype._onTileRemove = function (_a) {
        var coords = _a.coords, tile = _a.tile;
        if (this.options.debug)
            console.log("_onTileRemove()");
        if (!L.Browser.android) {
            tile.onload = lodashEs.noop;
        }
        this._renderer.removeTile(coords);
    };
    GLOperations.prototype._updateTiles = function () {
        return __awaiter(this, void 0, void 0, function () {
            var activeTiles, tilesData, canvasCoordinates, tilesDataHs;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        activeTiles = this._getActiveTiles();
                        return [4, this._getTilesData(activeTiles)];
                    case 1:
                        tilesData = _a.sent();
                        if (this.options.debug)
                            console.log("_updateTiles() with url " + this.options.url);
                        if (!(this.options._hillshadeOptions.hillshadeType === 'pregen')) return [3, 3];
                        return [4, this._getTilesData(activeTiles, this.options.hsPregenUrl)];
                    case 2:
                        tilesDataHs = _a.sent();
                        canvasCoordinates = this._renderer.renderTilesHsPregen(tilesData, tilesDataHs);
                        return [3, 4];
                    case 3:
                        if (this.options._hillshadeOptions.hillshadeType === 'advanced') {
                            if (this.options.debug)
                                console.log("_updateTiles() with advanced hs");
                            this.redraw();
                            return [2];
                        }
                        else {
                            canvasCoordinates = this._renderer.renderTiles(tilesData, this.options._hillshadeOptions, this._getZoomForUrl());
                        }
                        _a.label = 4;
                    case 4:
                        canvasCoordinates.forEach(function (_a, index) {
                            var sourceX = _a[0], sourceY = _a[1];
                            var tile = activeTiles[index];
                            _this._copyToTileCanvas(tile.el, sourceX, sourceY);
                            tile.el.pixelData = tilesData[index].pixelData;
                            if (_this.options._hillshadeOptions.hillshadeType === 'pregen') {
                                tile.el.pixelDataHsPregen = tilesDataHs[index].pixelData;
                            }
                        });
                        return [2];
                }
            });
        });
    };
    GLOperations.prototype._updateTilesColorscaleOnly = function () {
        return __awaiter(this, void 0, void 0, function () {
            var activeTiles, tilesData, tilesDataHs, canvasCoordinates, tilesData, canvasCoordinates;
            var _this = this;
            return __generator(this, function (_a) {
                if (this.options.debug)
                    console.log("_updateTilesColorscaleOnly()");
                activeTiles = this._getActiveTiles();
                if (this.options._hillshadeOptions.hillshadeType === 'pregen') {
                    tilesData = activeTiles.map(function (_a) {
                        var coords = _a.coords, el = _a.el;
                        return ({
                            coords: coords,
                            pixelData: el.pixelData,
                        });
                    });
                    tilesDataHs = activeTiles.map(function (_a) {
                        var coords = _a.coords, el = _a.el;
                        return ({
                            coords: coords,
                            pixelData: el.pixelDataHsPregen,
                        });
                    });
                    canvasCoordinates = this._renderer.renderTilesHsPregen(tilesData, tilesDataHs);
                    canvasCoordinates.forEach(function (_a, index) {
                        var sourceX = _a[0], sourceY = _a[1];
                        var tile = activeTiles[index];
                        _this._copyToTileCanvas(tile.el, sourceX, sourceY);
                    });
                }
                else if (this.options._hillshadeOptions.hillshadeType === 'advanced') {
                    if (this.options.debug)
                        console.log("_updateTilesColorscaleOnly() with advanced hs");
                    this.redraw();
                    return [2];
                }
                else {
                    tilesData = activeTiles.map(function (_a) {
                        var coords = _a.coords, el = _a.el;
                        return ({
                            coords: coords,
                            pixelData: el.pixelData,
                        });
                    });
                    canvasCoordinates = this._renderer.renderTiles(tilesData, this.options._hillshadeOptions, this._getZoomForUrl());
                    canvasCoordinates.forEach(function (_a, index) {
                        var sourceX = _a[0], sourceY = _a[1];
                        var tile = activeTiles[index];
                        _this._copyToTileCanvas(tile.el, sourceX, sourceY);
                    });
                }
                return [2];
            });
        });
    };
    GLOperations.prototype._updateTilesWithTransitions = function (prevColorScale, prevSentinelValues) {
        return __awaiter(this, void 0, void 0, function () {
            var activeTiles, prevTilesData, newTilesData, _a, newColorScale, _b, newSentinelValues, transitionTimeMs, onFrameRendered;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (this.options.debug)
                            console.log("_updateTilesWithTransitions()");
                        activeTiles = this._getActiveTiles();
                        prevTilesData = activeTiles.map(function (_a) {
                            var coords = _a.coords, el = _a.el;
                            return ({
                                coords: coords,
                                pixelData: el.pixelData,
                            });
                        });
                        return [4, this._getTilesData(activeTiles)];
                    case 1:
                        newTilesData = _c.sent();
                        activeTiles.forEach(function (tile, index) {
                            tile.el.pixelData = newTilesData[index].pixelData;
                        });
                        _a = this.options, newColorScale = _a.colorScale, _b = _a.sentinelValues, newSentinelValues = _b === void 0 ? [] : _b, transitionTimeMs = _a.transitionTimeMs;
                        onFrameRendered = function (canvasCoordinates) {
                            canvasCoordinates.forEach(function (_a, index) {
                                var sourceX = _a[0], sourceY = _a[1];
                                var tile = activeTiles[index];
                                _this._copyToTileCanvas(tile.el, sourceX, sourceY);
                            });
                        };
                        if (JSON.stringify(newColorScale) === JSON.stringify(prevColorScale) && JSON.stringify(newSentinelValues) === JSON.stringify(prevSentinelValues)) {
                            this._renderer.renderTilesWithTransition(prevTilesData, newTilesData, transitionTimeMs, onFrameRendered);
                        }
                        else {
                            this._renderer.renderTilesWithTransitionAndNewColorScale(prevTilesData, newTilesData, transitionTimeMs, onFrameRendered);
                        }
                        return [2];
                }
            });
        });
    };
    GLOperations.prototype._updateColorscaleWithTransitions = function (prevColorScale, prevSentinelValues) {
        return __awaiter(this, void 0, void 0, function () {
            var activeTiles, tilesData, _a, newColorScale, _b, newSentinelValues, transitionTimeMs, onFrameRendered;
            var _this = this;
            return __generator(this, function (_c) {
                if (this.options.debug)
                    console.log("_updateColorscaleWithTransitions()");
                activeTiles = this._getActiveTiles();
                tilesData = activeTiles.map(function (_a) {
                    var coords = _a.coords, el = _a.el;
                    return ({
                        coords: coords,
                        pixelData: el.pixelData,
                    });
                });
                _a = this.options, newColorScale = _a.colorScale, _b = _a.sentinelValues, newSentinelValues = _b === void 0 ? [] : _b, transitionTimeMs = _a.transitionTimeMs;
                onFrameRendered = function (canvasCoordinates) {
                    canvasCoordinates.forEach(function (_a, index) {
                        var sourceX = _a[0], sourceY = _a[1];
                        var tile = activeTiles[index];
                        _this._copyToTileCanvas(tile.el, sourceX, sourceY);
                    });
                };
                if (JSON.stringify(newColorScale) !== JSON.stringify(prevColorScale) || JSON.stringify(newSentinelValues) !== JSON.stringify(prevSentinelValues)) {
                    this._renderer.renderTilesWithTransitionAndNewColorScaleOnly(tilesData, transitionTimeMs, onFrameRendered);
                }
                return [2];
            });
        });
    };
    GLOperations.prototype._updateTilesWithDiff = function (prevGlOperation, prevUrlA, prevUrlB) {
        return __awaiter(this, void 0, void 0, function () {
            var activeTiles, tilesA, tilesB, canvasCoordinates, onFrameRendered, resultEncodedPixels_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.options.debug)
                            console.log("_updateTilesWithDiff()");
                        activeTiles = this._getActiveTiles();
                        tilesA = [];
                        tilesB = [];
                        if (!(this.options.glOperation === prevGlOperation &&
                            this.options.operationUrlA === prevUrlA &&
                            this.options.operationUrlB === prevUrlB)) return [3, 1];
                        if (this.options.debug)
                            console.log("_updateTilesWithDiff: both same url. Getting data from existing result");
                        tilesA = activeTiles.map(function (_a) {
                            var coords = _a.coords, el = _a.el;
                            return ({
                                coords: coords,
                                pixelData: el.pixelData,
                            });
                        });
                        return [3, 7];
                    case 1:
                        if (!(this.options.operationUrlA !== prevUrlA)) return [3, 3];
                        if (this.options.debug)
                            console.log("_updateTilesWithDiff: new A url. Downloading new tiles");
                        return [4, this._getTilesData(activeTiles, this.options.operationUrlA)];
                    case 2:
                        tilesA = _a.sent();
                        activeTiles.forEach(function (tile, index) {
                            tile.el.pixelDataA = tilesA[index].pixelData;
                        });
                        return [3, 4];
                    case 3:
                        if (this.options.debug)
                            console.log("_updateTilesWithDiff: same A url. Getting data from existing tiles");
                        tilesA = activeTiles.map(function (_a) {
                            var coords = _a.coords, el = _a.el;
                            return ({
                                coords: coords,
                                pixelData: el.pixelDataA,
                            });
                        });
                        _a.label = 4;
                    case 4:
                        if (!(this.options.operationUrlB !== prevUrlB)) return [3, 6];
                        if (this.options.debug)
                            console.log("_updateTilesWithDiff: new B url. Downloading new tiles");
                        return [4, this._getTilesData(activeTiles, this.options.operationUrlB)];
                    case 5:
                        tilesB = _a.sent();
                        activeTiles.forEach(function (tile, index) {
                            tile.el.pixelDataB = tilesB[index].pixelData;
                        });
                        return [3, 7];
                    case 6:
                        if (this.options.debug)
                            console.log("_updateTilesWithDiff: same B url. Getting data from existing tiles");
                        tilesB = activeTiles.map(function (_a) {
                            var coords = _a.coords, el = _a.el;
                            return ({
                                coords: coords,
                                pixelData: el.pixelDataB,
                            });
                        });
                        _a.label = 7;
                    case 7:
                        if (this.options.glOperation === prevGlOperation &&
                            this.options.operationUrlA === prevUrlA &&
                            this.options.operationUrlB === prevUrlB) {
                            if (this.options.debug)
                                console.log("_updateTilesWithDiff: both same urls. Running renderTiles()");
                            canvasCoordinates = this._renderer.renderTiles(tilesA, this.options._hillshadeOptions, this._getZoomForUrl());
                            canvasCoordinates.forEach(function (_a, index) {
                                var sourceX = _a[0], sourceY = _a[1];
                                var tile = activeTiles[index];
                                _this._copyToTileCanvas(tile.el, sourceX, sourceY);
                            });
                        }
                        else {
                            if (this.options.debug)
                                console.log("_updateTilesWithDiff: not same urls. Running renderTilesWithDiff()");
                            onFrameRendered = function (canvasCoordinates) {
                                canvasCoordinates.forEach(function (_a, index) {
                                    var sourceX = _a[0], sourceY = _a[1];
                                    var tile = activeTiles[index];
                                    _this._copyToTileCanvas(tile.el, sourceX, sourceY);
                                });
                            };
                            resultEncodedPixels_1 = this._renderer.renderTilesWithDiff(tilesA, tilesB, onFrameRendered);
                            activeTiles.forEach(function (tile, index) {
                                tile.el.pixelData = resultEncodedPixels_1[index];
                            });
                        }
                        return [2];
                }
            });
        });
    };
    GLOperations.prototype._updateTilesWithMultiAnalyze1 = function (prevGlOperation, prevMultiLayers, prevUrlA, prevFilterLowA, prevFilterHighA, prevMultiplierA) {
        return __awaiter(this, void 0, void 0, function () {
            var activeTiles, tilesA, canvasCoordinates, tilesA_1, onFrameRendered, resultEncodedPixels_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.options.debug)
                            console.log("_updateTilesWithMultiAnalyze1()");
                        activeTiles = this._getActiveTiles();
                        if (!(this.options.glOperation === prevGlOperation &&
                            this.options.operationUrlA === prevUrlA &&
                            this.options.filterLowA === prevFilterLowA &&
                            this.options.filterHighA === prevFilterHighA &&
                            this.options.multiplierA === prevMultiplierA &&
                            this.options.multiLayers === prevMultiLayers)) return [3, 1];
                        if (this.options.debug)
                            console.log("_updateTilesWithMultiAnalyze1: all same urls. Fetching from existing tiles. Running renderTiles()");
                        tilesA = activeTiles.map(function (_a) {
                            var coords = _a.coords, el = _a.el;
                            return ({
                                coords: coords,
                                pixelData: el.pixelData,
                            });
                        });
                        canvasCoordinates = this._renderer.renderTiles(tilesA, this.options._hillshadeOptions, this._getZoomForUrl());
                        canvasCoordinates.forEach(function (_a, index) {
                            var sourceX = _a[0], sourceY = _a[1];
                            var tile = activeTiles[index];
                            _this._copyToTileCanvas(tile.el, sourceX, sourceY);
                        });
                        return [3, 5];
                    case 1:
                        tilesA_1 = [];
                        if (!(this.options.operationUrlA !== prevUrlA)) return [3, 3];
                        return [4, this._getTilesData(activeTiles, this.options.operationUrlA)];
                    case 2:
                        tilesA_1 = _a.sent();
                        activeTiles.forEach(function (tile, index) {
                            tile.el.pixelDataA = tilesA_1[index].pixelData;
                        });
                        return [3, 4];
                    case 3:
                        tilesA_1 = activeTiles.map(function (_a) {
                            var coords = _a.coords, el = _a.el;
                            return ({
                                coords: coords,
                                pixelData: el.pixelDataA,
                            });
                        });
                        _a.label = 4;
                    case 4:
                        onFrameRendered = function (canvasCoordinates) {
                            canvasCoordinates.forEach(function (_a, index) {
                                var sourceX = _a[0], sourceY = _a[1];
                                var tile = activeTiles[index];
                                _this._copyToTileCanvas(tile.el, sourceX, sourceY);
                            });
                        };
                        resultEncodedPixels_2 = this._renderer.renderTilesWithMultiAnalyze1(tilesA_1, this.options.filterLowA, this.options.filterHighA, this.options.multiplierA, onFrameRendered);
                        activeTiles.forEach(function (tile, index) {
                            tile.el.pixelData = resultEncodedPixels_2[index];
                        });
                        _a.label = 5;
                    case 5: return [2];
                }
            });
        });
    };
    GLOperations.prototype._updateTilesWithMultiAnalyze2 = function (prevGlOperation, prevMultiLayers, prevUrlA, prevUrlB, prevFilterLowA, prevFilterHighA, prevFilterLowB, prevFilterHighB, prevMultiplierA, prevMultiplierB) {
        return __awaiter(this, void 0, void 0, function () {
            var activeTiles, tilesA, canvasCoordinates, tilesA_2, tilesB_1, onFrameRendered, resultEncodedPixels_3;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.options.debug)
                            console.log("_updateTilesWithMultiAnalyze2()");
                        activeTiles = this._getActiveTiles();
                        if (!(this.options.glOperation === prevGlOperation &&
                            this.options.operationUrlA === prevUrlA &&
                            this.options.operationUrlB === prevUrlB &&
                            this.options.filterLowA === prevFilterLowA &&
                            this.options.filterHighA === prevFilterHighA &&
                            this.options.filterLowB === prevFilterLowB &&
                            this.options.filterHighB === prevFilterHighB &&
                            this.options.multiplierA === prevMultiplierA &&
                            this.options.multiplierB === prevMultiplierB &&
                            this.options.multiLayers === prevMultiLayers)) return [3, 1];
                        if (this.options.debug)
                            console.log("_updateTilesWithMultiAnalyze2: all same urls. Fetching from existing tiles. Running renderTiles()");
                        tilesA = activeTiles.map(function (_a) {
                            var coords = _a.coords, el = _a.el;
                            return ({
                                coords: coords,
                                pixelData: el.pixelData,
                            });
                        });
                        canvasCoordinates = this._renderer.renderTiles(tilesA, this.options._hillshadeOptions, this._getZoomForUrl());
                        canvasCoordinates.forEach(function (_a, index) {
                            var sourceX = _a[0], sourceY = _a[1];
                            var tile = activeTiles[index];
                            _this._copyToTileCanvas(tile.el, sourceX, sourceY);
                        });
                        return [3, 8];
                    case 1:
                        tilesA_2 = [];
                        tilesB_1 = [];
                        if (!(this.options.operationUrlA !== prevUrlA)) return [3, 3];
                        return [4, this._getTilesData(activeTiles, this.options.operationUrlA)];
                    case 2:
                        tilesA_2 = _a.sent();
                        activeTiles.forEach(function (tile, index) {
                            tile.el.pixelDataA = tilesA_2[index].pixelData;
                        });
                        return [3, 4];
                    case 3:
                        tilesA_2 = activeTiles.map(function (_a) {
                            var coords = _a.coords, el = _a.el;
                            return ({
                                coords: coords,
                                pixelData: el.pixelDataA,
                            });
                        });
                        _a.label = 4;
                    case 4:
                        if (!(this.options.operationUrlB !== prevUrlB)) return [3, 6];
                        return [4, this._getTilesData(activeTiles, this.options.operationUrlB)];
                    case 5:
                        tilesB_1 = _a.sent();
                        activeTiles.forEach(function (tile, index) {
                            tile.el.pixelDataB = tilesB_1[index].pixelData;
                        });
                        return [3, 7];
                    case 6:
                        tilesB_1 = activeTiles.map(function (_a) {
                            var coords = _a.coords, el = _a.el;
                            return ({
                                coords: coords,
                                pixelData: el.pixelDataB,
                            });
                        });
                        _a.label = 7;
                    case 7:
                        onFrameRendered = function (canvasCoordinates) {
                            canvasCoordinates.forEach(function (_a, index) {
                                var sourceX = _a[0], sourceY = _a[1];
                                var tile = activeTiles[index];
                                _this._copyToTileCanvas(tile.el, sourceX, sourceY);
                            });
                        };
                        resultEncodedPixels_3 = this._renderer.renderTilesWithMultiAnalyze2(tilesA_2, tilesB_1, this.options.filterLowA, this.options.filterHighA, this.options.filterLowB, this.options.filterHighB, this.options.multiplierA, this.options.multiplierB, onFrameRendered);
                        activeTiles.forEach(function (tile, index) {
                            tile.el.pixelData = resultEncodedPixels_3[index];
                        });
                        _a.label = 8;
                    case 8: return [2];
                }
            });
        });
    };
    GLOperations.prototype._updateTilesWithMultiAnalyze3 = function (prevGlOperation, prevMultiLayers, prevUrlA, prevUrlB, prevUrlC, prevFilterLowA, prevFilterHighA, prevFilterLowB, prevFilterHighB, prevFilterLowC, prevFilterHighC, prevMultiplierA, prevMultiplierB, prevMultiplierC) {
        return __awaiter(this, void 0, void 0, function () {
            var activeTiles, tilesA, canvasCoordinates, tilesA_3, tilesB_2, tilesC_1, onFrameRendered, resultEncodedPixels_4;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.options.debug)
                            console.log("_updateTilesWithMultiAnalyze3()");
                        activeTiles = this._getActiveTiles();
                        if (!(this.options.glOperation === prevGlOperation &&
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
                            this.options.multiLayers === prevMultiLayers)) return [3, 1];
                        if (this.options.debug)
                            console.log("_updateTilesWithMultiAnalyze3: all same urls. Fetching from existing tiles. Running renderTiles()");
                        tilesA = activeTiles.map(function (_a) {
                            var coords = _a.coords, el = _a.el;
                            return ({
                                coords: coords,
                                pixelData: el.pixelData,
                            });
                        });
                        canvasCoordinates = this._renderer.renderTiles(tilesA, this.options._hillshadeOptions, this._getZoomForUrl());
                        canvasCoordinates.forEach(function (_a, index) {
                            var sourceX = _a[0], sourceY = _a[1];
                            var tile = activeTiles[index];
                            _this._copyToTileCanvas(tile.el, sourceX, sourceY);
                        });
                        return [3, 11];
                    case 1:
                        tilesA_3 = [];
                        tilesB_2 = [];
                        tilesC_1 = [];
                        if (!(this.options.operationUrlA !== prevUrlA)) return [3, 3];
                        return [4, this._getTilesData(activeTiles, this.options.operationUrlA)];
                    case 2:
                        tilesA_3 = _a.sent();
                        activeTiles.forEach(function (tile, index) {
                            tile.el.pixelDataA = tilesA_3[index].pixelData;
                        });
                        return [3, 4];
                    case 3:
                        tilesA_3 = activeTiles.map(function (_a) {
                            var coords = _a.coords, el = _a.el;
                            return ({
                                coords: coords,
                                pixelData: el.pixelDataA,
                            });
                        });
                        _a.label = 4;
                    case 4:
                        if (!(this.options.operationUrlB !== prevUrlB)) return [3, 6];
                        return [4, this._getTilesData(activeTiles, this.options.operationUrlB)];
                    case 5:
                        tilesB_2 = _a.sent();
                        activeTiles.forEach(function (tile, index) {
                            tile.el.pixelDataB = tilesB_2[index].pixelData;
                        });
                        return [3, 7];
                    case 6:
                        tilesB_2 = activeTiles.map(function (_a) {
                            var coords = _a.coords, el = _a.el;
                            return ({
                                coords: coords,
                                pixelData: el.pixelDataB,
                            });
                        });
                        _a.label = 7;
                    case 7:
                        if (!(this.options.operationUrlC !== prevUrlC)) return [3, 9];
                        return [4, this._getTilesData(activeTiles, this.options.operationUrlC)];
                    case 8:
                        tilesC_1 = _a.sent();
                        activeTiles.forEach(function (tile, index) {
                            tile.el.pixelDataC = tilesC_1[index].pixelData;
                        });
                        return [3, 10];
                    case 9:
                        tilesC_1 = activeTiles.map(function (_a) {
                            var coords = _a.coords, el = _a.el;
                            return ({
                                coords: coords,
                                pixelData: el.pixelDataC,
                            });
                        });
                        _a.label = 10;
                    case 10:
                        onFrameRendered = function (canvasCoordinates) {
                            canvasCoordinates.forEach(function (_a, index) {
                                var sourceX = _a[0], sourceY = _a[1];
                                var tile = activeTiles[index];
                                _this._copyToTileCanvas(tile.el, sourceX, sourceY);
                            });
                        };
                        resultEncodedPixels_4 = this._renderer.renderTilesWithMultiAnalyze3(tilesA_3, tilesB_2, tilesC_1, this.options.filterLowA, this.options.filterHighA, this.options.filterLowB, this.options.filterHighB, this.options.filterLowC, this.options.filterHighC, this.options.multiplierA, this.options.multiplierB, this.options.multiplierC, onFrameRendered);
                        activeTiles.forEach(function (tile, index) {
                            tile.el.pixelData = resultEncodedPixels_4[index];
                        });
                        _a.label = 11;
                    case 11: return [2];
                }
            });
        });
    };
    GLOperations.prototype._updateTilesWithMultiAnalyze4 = function (prevGlOperation, prevMultiLayers, prevUrlA, prevUrlB, prevUrlC, prevUrlD, prevFilterLowA, prevFilterHighA, prevFilterLowB, prevFilterHighB, prevFilterLowC, prevFilterHighC, prevFilterLowD, prevFilterHighD, prevMultiplierA, prevMultiplierB, prevMultiplierC, prevMultiplierD) {
        return __awaiter(this, void 0, void 0, function () {
            var activeTiles, tilesA, canvasCoordinates, tilesA_4, tilesB_3, tilesC_2, tilesD_1, onFrameRendered, resultEncodedPixels_5;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.options.debug)
                            console.log("_updateTilesWithMultiAnalyze4()");
                        activeTiles = this._getActiveTiles();
                        if (!(this.options.glOperation === prevGlOperation &&
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
                            this.options.multiLayers === prevMultiLayers)) return [3, 1];
                        if (this.options.debug)
                            console.log("_updateTilesWithMultiAnalyze4: all same urls. Fetching from existing tiles. Running renderTiles()");
                        tilesA = activeTiles.map(function (_a) {
                            var coords = _a.coords, el = _a.el;
                            return ({
                                coords: coords,
                                pixelData: el.pixelData,
                            });
                        });
                        canvasCoordinates = this._renderer.renderTiles(tilesA, this.options._hillshadeOptions, this._getZoomForUrl());
                        canvasCoordinates.forEach(function (_a, index) {
                            var sourceX = _a[0], sourceY = _a[1];
                            var tile = activeTiles[index];
                            _this._copyToTileCanvas(tile.el, sourceX, sourceY);
                        });
                        return [3, 14];
                    case 1:
                        tilesA_4 = [];
                        tilesB_3 = [];
                        tilesC_2 = [];
                        tilesD_1 = [];
                        if (!(this.options.operationUrlA !== prevUrlA)) return [3, 3];
                        return [4, this._getTilesData(activeTiles, this.options.operationUrlA)];
                    case 2:
                        tilesA_4 = _a.sent();
                        activeTiles.forEach(function (tile, index) {
                            tile.el.pixelDataA = tilesA_4[index].pixelData;
                        });
                        return [3, 4];
                    case 3:
                        tilesA_4 = activeTiles.map(function (_a) {
                            var coords = _a.coords, el = _a.el;
                            return ({
                                coords: coords,
                                pixelData: el.pixelDataA,
                            });
                        });
                        _a.label = 4;
                    case 4:
                        if (!(this.options.operationUrlB !== prevUrlB)) return [3, 6];
                        return [4, this._getTilesData(activeTiles, this.options.operationUrlB)];
                    case 5:
                        tilesB_3 = _a.sent();
                        activeTiles.forEach(function (tile, index) {
                            tile.el.pixelDataB = tilesB_3[index].pixelData;
                        });
                        return [3, 7];
                    case 6:
                        tilesB_3 = activeTiles.map(function (_a) {
                            var coords = _a.coords, el = _a.el;
                            return ({
                                coords: coords,
                                pixelData: el.pixelDataB,
                            });
                        });
                        _a.label = 7;
                    case 7:
                        if (!(this.options.operationUrlC !== prevUrlC)) return [3, 9];
                        return [4, this._getTilesData(activeTiles, this.options.operationUrlC)];
                    case 8:
                        tilesC_2 = _a.sent();
                        activeTiles.forEach(function (tile, index) {
                            tile.el.pixelDataC = tilesC_2[index].pixelData;
                        });
                        return [3, 10];
                    case 9:
                        tilesC_2 = activeTiles.map(function (_a) {
                            var coords = _a.coords, el = _a.el;
                            return ({
                                coords: coords,
                                pixelData: el.pixelDataC,
                            });
                        });
                        _a.label = 10;
                    case 10:
                        if (!(this.options.operationUrlD !== prevUrlD)) return [3, 12];
                        return [4, this._getTilesData(activeTiles, this.options.operationUrlD)];
                    case 11:
                        tilesD_1 = _a.sent();
                        activeTiles.forEach(function (tile, index) {
                            tile.el.pixelDataD = tilesD_1[index].pixelData;
                        });
                        return [3, 13];
                    case 12:
                        tilesD_1 = activeTiles.map(function (_a) {
                            var coords = _a.coords, el = _a.el;
                            return ({
                                coords: coords,
                                pixelData: el.pixelDataD,
                            });
                        });
                        _a.label = 13;
                    case 13:
                        onFrameRendered = function (canvasCoordinates) {
                            canvasCoordinates.forEach(function (_a, index) {
                                var sourceX = _a[0], sourceY = _a[1];
                                var tile = activeTiles[index];
                                _this._copyToTileCanvas(tile.el, sourceX, sourceY);
                            });
                        };
                        resultEncodedPixels_5 = this._renderer.renderTilesWithMultiAnalyze4(tilesA_4, tilesB_3, tilesC_2, tilesD_1, this.options.filterLowA, this.options.filterHighA, this.options.filterLowB, this.options.filterHighB, this.options.filterLowC, this.options.filterHighC, this.options.filterLowD, this.options.filterHighD, this.options.multiplierA, this.options.multiplierB, this.options.multiplierC, this.options.multiplierD, onFrameRendered);
                        activeTiles.forEach(function (tile, index) {
                            tile.el.pixelData = resultEncodedPixels_5[index];
                        });
                        _a.label = 14;
                    case 14: return [2];
                }
            });
        });
    };
    GLOperations.prototype._updateTilesWithMultiAnalyze5 = function (prevGlOperation, prevMultiLayers, prevUrlA, prevUrlB, prevUrlC, prevUrlD, prevUrlE, prevFilterLowA, prevFilterHighA, prevFilterLowB, prevFilterHighB, prevFilterLowC, prevFilterHighC, prevFilterLowD, prevFilterHighD, prevFilterLowE, prevFilterHighE, prevMultiplierA, prevMultiplierB, prevMultiplierC, prevMultiplierD, prevMultiplierE) {
        return __awaiter(this, void 0, void 0, function () {
            var activeTiles, tilesA, canvasCoordinates, tilesA_5, tilesB_4, tilesC_3, tilesD_2, tilesE_1, onFrameRendered, resultEncodedPixels_6;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.options.debug)
                            console.log("_updateTilesWithMultiAnalyze5()");
                        activeTiles = this._getActiveTiles();
                        if (!(this.options.glOperation === prevGlOperation &&
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
                            this.options.multiLayers === prevMultiLayers)) return [3, 1];
                        if (this.options.debug)
                            console.log("_updateTilesWithMultiAnalyze5: all same urls. Fetching from existing tiles. Running renderTiles()");
                        tilesA = activeTiles.map(function (_a) {
                            var coords = _a.coords, el = _a.el;
                            return ({
                                coords: coords,
                                pixelData: el.pixelData,
                            });
                        });
                        canvasCoordinates = this._renderer.renderTiles(tilesA, this.options._hillshadeOptions, this._getZoomForUrl());
                        canvasCoordinates.forEach(function (_a, index) {
                            var sourceX = _a[0], sourceY = _a[1];
                            var tile = activeTiles[index];
                            _this._copyToTileCanvas(tile.el, sourceX, sourceY);
                        });
                        return [3, 17];
                    case 1:
                        tilesA_5 = [];
                        tilesB_4 = [];
                        tilesC_3 = [];
                        tilesD_2 = [];
                        tilesE_1 = [];
                        if (!(this.options.operationUrlA !== prevUrlA)) return [3, 3];
                        return [4, this._getTilesData(activeTiles, this.options.operationUrlA)];
                    case 2:
                        tilesA_5 = _a.sent();
                        activeTiles.forEach(function (tile, index) {
                            tile.el.pixelDataA = tilesA_5[index].pixelData;
                        });
                        return [3, 4];
                    case 3:
                        tilesA_5 = activeTiles.map(function (_a) {
                            var coords = _a.coords, el = _a.el;
                            return ({
                                coords: coords,
                                pixelData: el.pixelDataA,
                            });
                        });
                        _a.label = 4;
                    case 4:
                        if (!(this.options.operationUrlB !== prevUrlB)) return [3, 6];
                        return [4, this._getTilesData(activeTiles, this.options.operationUrlB)];
                    case 5:
                        tilesB_4 = _a.sent();
                        activeTiles.forEach(function (tile, index) {
                            tile.el.pixelDataB = tilesB_4[index].pixelData;
                        });
                        return [3, 7];
                    case 6:
                        tilesB_4 = activeTiles.map(function (_a) {
                            var coords = _a.coords, el = _a.el;
                            return ({
                                coords: coords,
                                pixelData: el.pixelDataB,
                            });
                        });
                        _a.label = 7;
                    case 7:
                        if (!(this.options.operationUrlC !== prevUrlC)) return [3, 9];
                        return [4, this._getTilesData(activeTiles, this.options.operationUrlC)];
                    case 8:
                        tilesC_3 = _a.sent();
                        activeTiles.forEach(function (tile, index) {
                            tile.el.pixelDataC = tilesC_3[index].pixelData;
                        });
                        return [3, 10];
                    case 9:
                        tilesC_3 = activeTiles.map(function (_a) {
                            var coords = _a.coords, el = _a.el;
                            return ({
                                coords: coords,
                                pixelData: el.pixelDataC,
                            });
                        });
                        _a.label = 10;
                    case 10:
                        if (!(this.options.operationUrlD !== prevUrlD)) return [3, 12];
                        return [4, this._getTilesData(activeTiles, this.options.operationUrlD)];
                    case 11:
                        tilesD_2 = _a.sent();
                        activeTiles.forEach(function (tile, index) {
                            tile.el.pixelDataD = tilesD_2[index].pixelData;
                        });
                        return [3, 13];
                    case 12:
                        tilesD_2 = activeTiles.map(function (_a) {
                            var coords = _a.coords, el = _a.el;
                            return ({
                                coords: coords,
                                pixelData: el.pixelDataD,
                            });
                        });
                        _a.label = 13;
                    case 13:
                        if (!(this.options.operationUrlE !== prevUrlE)) return [3, 15];
                        return [4, this._getTilesData(activeTiles, this.options.operationUrlE)];
                    case 14:
                        tilesE_1 = _a.sent();
                        activeTiles.forEach(function (tile, index) {
                            tile.el.pixelDataE = tilesE_1[index].pixelData;
                        });
                        return [3, 16];
                    case 15:
                        tilesE_1 = activeTiles.map(function (_a) {
                            var coords = _a.coords, el = _a.el;
                            return ({
                                coords: coords,
                                pixelData: el.pixelDataE,
                            });
                        });
                        _a.label = 16;
                    case 16:
                        onFrameRendered = function (canvasCoordinates) {
                            canvasCoordinates.forEach(function (_a, index) {
                                var sourceX = _a[0], sourceY = _a[1];
                                var tile = activeTiles[index];
                                _this._copyToTileCanvas(tile.el, sourceX, sourceY);
                            });
                        };
                        resultEncodedPixels_6 = this._renderer.renderTilesWithMultiAnalyze5(tilesA_5, tilesB_4, tilesC_3, tilesD_2, tilesE_1, this.options.filterLowA, this.options.filterHighA, this.options.filterLowB, this.options.filterHighB, this.options.filterLowC, this.options.filterHighC, this.options.filterLowD, this.options.filterHighD, this.options.filterLowE, this.options.filterHighE, this.options.multiplierA, this.options.multiplierB, this.options.multiplierC, this.options.multiplierD, this.options.multiplierE, onFrameRendered);
                        activeTiles.forEach(function (tile, index) {
                            tile.el.pixelData = resultEncodedPixels_6[index];
                        });
                        _a.label = 17;
                    case 17: return [2];
                }
            });
        });
    };
    GLOperations.prototype._updateTilesWithMultiAnalyze6 = function (prevGlOperation, prevMultiLayers, prevUrlA, prevUrlB, prevUrlC, prevUrlD, prevUrlE, prevUrlF, prevFilterLowA, prevFilterHighA, prevFilterLowB, prevFilterHighB, prevFilterLowC, prevFilterHighC, prevFilterLowD, prevFilterHighD, prevFilterLowE, prevFilterHighE, prevFilterLowF, prevFilterHighF, prevMultiplierA, prevMultiplierB, prevMultiplierC, prevMultiplierD, prevMultiplierE, prevMultiplierF) {
        return __awaiter(this, void 0, void 0, function () {
            var activeTiles, tilesA, canvasCoordinates, tilesA_6, tilesB_5, tilesC_4, tilesD_3, tilesE_2, tilesF_1, onFrameRendered, resultEncodedPixels_7;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.options.debug)
                            console.log("_updateTilesWithMultiAnalyze6()");
                        activeTiles = this._getActiveTiles();
                        if (!(this.options.glOperation === prevGlOperation &&
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
                            this.options.multiLayers === prevMultiLayers)) return [3, 1];
                        if (this.options.debug)
                            console.log("_updateTilesWithMultiAnalyze6: all same urls. Fetching from existing tiles. Running renderTiles()");
                        tilesA = activeTiles.map(function (_a) {
                            var coords = _a.coords, el = _a.el;
                            return ({
                                coords: coords,
                                pixelData: el.pixelData,
                            });
                        });
                        canvasCoordinates = this._renderer.renderTiles(tilesA, this.options._hillshadeOptions, this._getZoomForUrl());
                        canvasCoordinates.forEach(function (_a, index) {
                            var sourceX = _a[0], sourceY = _a[1];
                            var tile = activeTiles[index];
                            _this._copyToTileCanvas(tile.el, sourceX, sourceY);
                        });
                        return [3, 20];
                    case 1:
                        tilesA_6 = [];
                        tilesB_5 = [];
                        tilesC_4 = [];
                        tilesD_3 = [];
                        tilesE_2 = [];
                        tilesF_1 = [];
                        if (!(this.options.operationUrlA !== prevUrlA)) return [3, 3];
                        return [4, this._getTilesData(activeTiles, this.options.operationUrlA)];
                    case 2:
                        tilesA_6 = _a.sent();
                        activeTiles.forEach(function (tile, index) {
                            tile.el.pixelDataA = tilesA_6[index].pixelData;
                        });
                        return [3, 4];
                    case 3:
                        tilesA_6 = activeTiles.map(function (_a) {
                            var coords = _a.coords, el = _a.el;
                            return ({
                                coords: coords,
                                pixelData: el.pixelDataA,
                            });
                        });
                        _a.label = 4;
                    case 4:
                        if (!(this.options.operationUrlB !== prevUrlB)) return [3, 6];
                        return [4, this._getTilesData(activeTiles, this.options.operationUrlB)];
                    case 5:
                        tilesB_5 = _a.sent();
                        activeTiles.forEach(function (tile, index) {
                            tile.el.pixelDataB = tilesB_5[index].pixelData;
                        });
                        return [3, 7];
                    case 6:
                        tilesB_5 = activeTiles.map(function (_a) {
                            var coords = _a.coords, el = _a.el;
                            return ({
                                coords: coords,
                                pixelData: el.pixelDataB,
                            });
                        });
                        _a.label = 7;
                    case 7:
                        if (!(this.options.operationUrlC !== prevUrlC)) return [3, 9];
                        return [4, this._getTilesData(activeTiles, this.options.operationUrlC)];
                    case 8:
                        tilesC_4 = _a.sent();
                        activeTiles.forEach(function (tile, index) {
                            tile.el.pixelDataC = tilesC_4[index].pixelData;
                        });
                        return [3, 10];
                    case 9:
                        tilesC_4 = activeTiles.map(function (_a) {
                            var coords = _a.coords, el = _a.el;
                            return ({
                                coords: coords,
                                pixelData: el.pixelDataC,
                            });
                        });
                        _a.label = 10;
                    case 10:
                        if (!(this.options.operationUrlD !== prevUrlD)) return [3, 12];
                        return [4, this._getTilesData(activeTiles, this.options.operationUrlD)];
                    case 11:
                        tilesD_3 = _a.sent();
                        activeTiles.forEach(function (tile, index) {
                            tile.el.pixelDataD = tilesD_3[index].pixelData;
                        });
                        return [3, 13];
                    case 12:
                        tilesD_3 = activeTiles.map(function (_a) {
                            var coords = _a.coords, el = _a.el;
                            return ({
                                coords: coords,
                                pixelData: el.pixelDataD,
                            });
                        });
                        _a.label = 13;
                    case 13:
                        if (!(this.options.operationUrlE !== prevUrlE)) return [3, 15];
                        return [4, this._getTilesData(activeTiles, this.options.operationUrlE)];
                    case 14:
                        tilesE_2 = _a.sent();
                        activeTiles.forEach(function (tile, index) {
                            tile.el.pixelDataE = tilesE_2[index].pixelData;
                        });
                        return [3, 16];
                    case 15:
                        tilesE_2 = activeTiles.map(function (_a) {
                            var coords = _a.coords, el = _a.el;
                            return ({
                                coords: coords,
                                pixelData: el.pixelDataE,
                            });
                        });
                        _a.label = 16;
                    case 16:
                        if (!(this.options.operationUrlF !== prevUrlF)) return [3, 18];
                        return [4, this._getTilesData(activeTiles, this.options.operationUrlF)];
                    case 17:
                        tilesF_1 = _a.sent();
                        activeTiles.forEach(function (tile, index) {
                            tile.el.pixelDataF = tilesF_1[index].pixelData;
                        });
                        return [3, 19];
                    case 18:
                        tilesF_1 = activeTiles.map(function (_a) {
                            var coords = _a.coords, el = _a.el;
                            return ({
                                coords: coords,
                                pixelData: el.pixelDataF,
                            });
                        });
                        _a.label = 19;
                    case 19:
                        onFrameRendered = function (canvasCoordinates) {
                            canvasCoordinates.forEach(function (_a, index) {
                                var sourceX = _a[0], sourceY = _a[1];
                                var tile = activeTiles[index];
                                _this._copyToTileCanvas(tile.el, sourceX, sourceY);
                            });
                        };
                        resultEncodedPixels_7 = this._renderer.renderTilesWithMultiAnalyze6(tilesA_6, tilesB_5, tilesC_4, tilesD_3, tilesE_2, tilesF_1, this.options.filterLowA, this.options.filterHighA, this.options.filterLowB, this.options.filterHighB, this.options.filterLowC, this.options.filterHighC, this.options.filterLowD, this.options.filterHighD, this.options.filterLowE, this.options.filterHighE, this.options.filterLowF, this.options.filterHighF, this.options.multiplierA, this.options.multiplierB, this.options.multiplierC, this.options.multiplierD, this.options.multiplierE, this.options.multiplierF, onFrameRendered);
                        activeTiles.forEach(function (tile, index) {
                            tile.el.pixelData = resultEncodedPixels_7[index];
                        });
                        _a.label = 20;
                    case 20: return [2];
                }
            });
        });
    };
    GLOperations.prototype._maybePreload = function (preloadUrl) {
        if (preloadUrl && (!this._preloadTileCache
            || this._preloadTileCache.url !== preloadUrl)) {
            this._preloadTiles(preloadUrl);
        }
    };
    GLOperations.prototype._maybeLoadExtraLayers = function (prevUrlA, prevUrlB, prevUrlC, prevUrlD) {
        return __awaiter(this, void 0, void 0, function () {
            var activeTiles, tilesA_7, tilesB_6, tilesC_5, tilesD_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        activeTiles = [];
                        if (!(this.options.extraPixelLayers >= 1)) return [3, 2];
                        activeTiles = this._getActiveTiles();
                        if (!(prevUrlA !== this.options.operationUrlA)) return [3, 2];
                        return [4, this._getTilesData(activeTiles, this.options.operationUrlA)];
                    case 1:
                        tilesA_7 = _a.sent();
                        activeTiles.forEach(function (tile, index) {
                            tile.el.pixelDataA = tilesA_7[index].pixelData;
                        });
                        _a.label = 2;
                    case 2:
                        if (!(this.options.extraPixelLayers >= 2)) return [3, 4];
                        if (!(prevUrlB !== this.options.operationUrlB)) return [3, 4];
                        return [4, this._getTilesData(activeTiles, this.options.operationUrlB)];
                    case 3:
                        tilesB_6 = _a.sent();
                        activeTiles.forEach(function (tile, index) {
                            tile.el.pixelDataB = tilesB_6[index].pixelData;
                        });
                        _a.label = 4;
                    case 4:
                        if (!(this.options.extraPixelLayers >= 3)) return [3, 6];
                        if (!(prevUrlC !== this.options.operationUrlC)) return [3, 6];
                        return [4, this._getTilesData(activeTiles, this.options.operationUrlC)];
                    case 5:
                        tilesC_5 = _a.sent();
                        activeTiles.forEach(function (tile, index) {
                            tile.el.pixelDataC = tilesC_5[index].pixelData;
                        });
                        _a.label = 6;
                    case 6:
                        if (!(this.options.extraPixelLayers >= 4)) return [3, 8];
                        if (!(prevUrlD !== this.options.operationUrlD)) return [3, 8];
                        return [4, this._getTilesData(activeTiles, this.options.operationUrlD)];
                    case 7:
                        tilesD_4 = _a.sent();
                        activeTiles.forEach(function (tile, index) {
                            tile.el.pixelDataD = tilesD_4[index].pixelData;
                        });
                        _a.label = 8;
                    case 8: return [2];
                }
            });
        });
    };
    GLOperations.prototype._preloadTiles = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var activeTiles, tilesData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        activeTiles = this._getActiveTiles();
                        return [4, this._fetchTilesData(activeTiles, url)];
                    case 1:
                        tilesData = _a.sent();
                        this._preloadTileCache = {
                            url: url,
                            tiles: tilesData,
                        };
                        return [2];
                }
            });
        });
    };
    GLOperations.prototype._getActiveTiles = function () {
        if (this.options.debug)
            console.log("_getActiveTiles()");
        this._pruneTiles();
        var tiles = staticCast(this._tiles);
        return lodashEs.values(tiles).sort(function (a, b) { return compareTileCoordinates(a.coords, b.coords); });
    };
    GLOperations.prototype._getTilesData = function (tiles, url) {
        if (url === void 0) { url = this.options.url; }
        return __awaiter(this, void 0, void 0, function () {
            var preloadTileCache;
            return __generator(this, function (_a) {
                if (this.options.debug)
                    console.log("_getTilesData() with url: " + url);
                preloadTileCache = this._preloadTileCache;
                if (preloadTileCache
                    && url === preloadTileCache.url
                    && sameTiles(preloadTileCache.tiles.map(function (_a) {
                        var coords = _a.coords;
                        return coords;
                    }), tiles.map(function (_a) {
                        var coords = _a.coords;
                        return coords;
                    }))) {
                    this._preloadTileCache = undefined;
                    return [2, Promise.resolve(preloadTileCache.tiles)];
                }
                else {
                    return [2, this._fetchTilesData(tiles, url)];
                }
            });
        });
    };
    GLOperations.prototype._fetchTilesData = function (tiles, url) {
        return __awaiter(this, void 0, void 0, function () {
            var pixelData;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, Promise.all(tiles.map(function (_a) {
                            var coords = _a.coords;
                            return _this._fetchTileData(coords, url);
                        }))];
                    case 1:
                        pixelData = _a.sent();
                        if (this.options.debug)
                            console.log("_fetchTilesData() with url:" + url);
                        this.fire('load', { url: url });
                        return [2, lodashEs.zipWith(tiles, pixelData, function (_a, data) {
                                var coords = _a.coords;
                                return ({
                                    coords: coords,
                                    pixelData: data,
                                });
                            })];
                }
            });
        });
    };
    GLOperations.prototype._fetchTileData = function (coords, url, tileFormat) {
        if (tileFormat === void 0) { tileFormat = this.options.tileFormat; }
        return __awaiter(this, void 0, void 0, function () {
            var nodataTile, imageData, rgbaData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(tileFormat === 'float32' || tileFormat === 'image')) return [3, 1];
                        return [2, fetchPNGData(this.getTileUrl(coords, url), this.options.nodataValue, this._tileSizeAsNumber())];
                    case 1:
                        if (!(tileFormat === 'dem')) return [3, 3];
                        nodataTile = createNoDataTile(this.options.nodataValue, this._tileSizeAsNumber());
                        return [4, fetchPNGData(this.getTileUrl(coords, url), this.options.nodataValue, this._tileSizeAsNumber())];
                    case 2:
                        imageData = _a.sent();
                        if (typedArraysAreEqual(imageData, nodataTile)) {
                            return [2, imageData];
                        }
                        else {
                            rgbaData = this._renderer.renderConvertDem(imageData);
                            return [2, rgbaData];
                        }
                    case 3: return [2, createNoDataTile(this.options.nodataValue, this._tileSizeAsNumber())];
                }
            });
        });
    };
    GLOperations.prototype._tileSizeAsNumber = function () {
        var tileSize = this.options.tileSize;
        return (typeof tileSize === 'number'
            ? tileSize
            : tileSize.x);
    };
    GLOperations.prototype._copyToTileCanvas = function (tile, sourceX, sourceY) {
        var tileSize = this._tileSizeAsNumber();
        var tileCanvas2DContext = tile.getContext('2d');
        if (tileCanvas2DContext === null) {
            throw new Error('Tile canvas 2D context is null.');
        }
        tileCanvas2DContext.clearRect(0, 0, tileSize, tileSize);
        tileCanvas2DContext.drawImage(this._renderer.canvas, sourceX, sourceY, tileSize, tileSize, 0, 0, tileSize, tileSize);
    };
    GLOperations.prototype._getActivetilesBounds = function () {
        return __awaiter(this, void 0, void 0, function () {
            var activeTiles, xMin, xMax, yMin, yMax, xTiles, yTiles, activeTilesBounds;
            return __generator(this, function (_a) {
                activeTiles = this._getActiveTiles();
                xMin = activeTiles[0].coords.x;
                xMax = activeTiles[0].coords.x;
                yMin = activeTiles[0].coords.y;
                yMax = activeTiles[0].coords.y;
                activeTiles.forEach(function (tile) {
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
                xTiles = xMax - xMin + 1;
                yTiles = yMax - yMin + 1;
                activeTilesBounds = {
                    xMin: xMin,
                    xMax: xMax,
                    yMin: yMin,
                    yMax: yMax,
                    xTiles: xTiles,
                    yTiles: yTiles
                };
                return [2, activeTilesBounds];
            });
        });
    };
    GLOperations.prototype._mergePixelData = function (activeTilesBounds, tileSize) {
        return __awaiter(this, void 0, void 0, function () {
            var z, canvasMerged, ctx, nodataTile, i, x, j, y, uint8, element, uac, uac2, idata, imageData, mergedPixelData, mergedPixelArray, arrSum, contourCanvas;
            return __generator(this, function (_a) {
                if (this.options.debug)
                    console.log("_mergePixelData()");
                z = this._tileZoom;
                canvasMerged = document.createElement("canvas");
                this._contourData.width = activeTilesBounds.xTiles * tileSize;
                this._contourData.height = activeTilesBounds.yTiles * tileSize;
                canvasMerged.width = this._contourData.width;
                canvasMerged.height = this._contourData.height;
                ctx = canvasMerged.getContext("2d");
                nodataTile = createNoDataTile(this.options.nodataValue, tileSize);
                for (i = 0; i <= activeTilesBounds.xTiles; i++) {
                    x = activeTilesBounds.xMin + i;
                    for (j = 0; j <= activeTilesBounds.yTiles; j++) {
                        y = activeTilesBounds.yMin + j;
                        uint8 = void 0;
                        try {
                            element = this._tiles[x + ":" + y + ":" + z].el;
                            uint8 = element.pixelData;
                        }
                        catch (err) {
                            uint8 = nodataTile;
                        }
                        uac = new Uint8ClampedArray(uint8);
                        uac2 = new Uint8ClampedArray(uac.buffer, 0, 4 * tileSize * tileSize);
                        idata = new ImageData(uac2, tileSize, tileSize);
                        ctx.putImageData(idata, i * tileSize, j * tileSize);
                    }
                }
                imageData = ctx.getImageData(0, 0, activeTilesBounds.xTiles * tileSize, activeTilesBounds.yTiles * tileSize);
                mergedPixelData = new Float32Array(imageData.data.buffer);
                mergedPixelData = mergedPixelData.map(function (item) {
                    if (item < -900000) {
                        item = NaN;
                    }
                    return item;
                }, this);
                mergedPixelArray = Array.from(mergedPixelData);
                arrSum = function (arr) {
                    return arr.reduce(function (a, b) {
                        return (isNaN(a) ? 0 : a) + (isNaN(b) ? 0 : b);
                    }, 0);
                };
                if (this.options.debug) {
                    console.log("sum mergedPixelArray");
                    console.log(arrSum(mergedPixelArray));
                }
                if (this.options.contourCanvas) {
                    contourCanvas = this.options.contourCanvas;
                    contourCanvas.width = this._contourData.width;
                    contourCanvas.height = this._contourData.height;
                }
                else {
                    console.log("Error: contourCanvas not specified.");
                    return [2];
                }
                this._contourData.mergedTileArray = mergedPixelArray;
                this._contourData.smoothedTileArray = undefined;
                return [2];
            });
        });
    };
    GLOperations.prototype._maybeUpdateMergedArrayAndDrawContours = function () {
        return __awaiter(this, void 0, void 0, function () {
            var promise;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.options.contourType === 'none')
                            return [2];
                        this._map.fire('contourDrawing', { status: true });
                        if (this.options.debug)
                            console.log("_maybeUpdateMergedArrayAndDrawContours()");
                        return [4, this._clearContours()];
                    case 1:
                        _a.sent();
                        promise = delay(50);
                        promise.then(function () { return __awaiter(_this, void 0, void 0, function () {
                            var activeTilesBounds, tileSize;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4, this._getActivetilesBounds()];
                                    case 1:
                                        activeTilesBounds = _a.sent();
                                        tileSize = this._tileSizeAsNumber();
                                        return [4, this._mergePixelData(activeTilesBounds, tileSize)];
                                    case 2:
                                        _a.sent();
                                        if (this.options.contourSmoothInput) {
                                            this._smoothContourInput();
                                        }
                                        return [4, this._calculateAndDrawContours()];
                                    case 3:
                                        _a.sent();
                                        return [4, this._moveContourCanvas(activeTilesBounds)];
                                    case 4:
                                        _a.sent();
                                        return [2];
                                }
                            });
                        }); });
                        return [2];
                }
            });
        });
    };
    GLOperations.prototype._smoothContourInput = function () {
        if (this.options.debug)
            console.log("_smoothContourInput()");
        var valuesNan = this._contourData.mergedTileArray;
        var valuesNoNan = valuesNan.map(function (item) {
            if (isNaN(item)) {
                item = this.options.nodataValue;
            }
            return item;
        }, this);
        var valuesNoNanUint = new Uint8Array(Float32Array.from(valuesNoNan).buffer);
        var resultEncodedPixels = this._renderer.renderConvolutionSmooth(valuesNoNanUint, this._contourData.width, this._contourData.height, this.options.contourSmoothInputKernel);
        var newArr = [];
        for (var x = 0; x < resultEncodedPixels.length; x += 1) {
            var value = resultEncodedPixels[x];
            if (value === this.options.nodataValue) {
                value = NaN;
            }
            newArr.push(value);
        }
        this._contourData.smoothedTileArray = newArr;
    };
    GLOperations.prototype._calculateAndDrawContours = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.options.contourType === 'none')
                            return [2];
                        this._map.fire('contourDrawing', { status: true });
                        if (this.options.debug)
                            console.log("_calculateAndDrawContours()");
                        return [4, this._clearContours()];
                    case 1:
                        _a.sent();
                        this._calculateContours();
                        setTimeout(function () {
                            _this._drawContours();
                        }, 50);
                        return [2];
                }
            });
        });
    };
    GLOperations.prototype._addlabel = function (context, label, labelColor, labelFont) {
        context.save();
        context.translate(label.xy[0], label.xy[1]);
        context.rotate(label.angle + (Math.cos(label.angle) < 0 ? Math.PI : 0));
        context.textAlign = "center";
        context.fillStyle = labelColor;
        context.font = labelFont;
        context.fillText(label.text, -1, 4);
        context.restore();
    };
    GLOperations.prototype._calculateContours = function () {
        var _this = this;
        if (this.options.debug)
            console.log("_calculateContours()");
        var values;
        if (this.options.contourSmoothInput) {
            values = this._contourData.smoothedTileArray;
        }
        else {
            values = this._contourData.mergedTileArray;
        }
        if (this.options.contourScaleFactor !== 1) {
            values = values.map(function (x) { return x * _this.options.contourScaleFactor; });
        }
        if (this.options.debug) {
            console.log("valuesArray");
            console.log(values);
        }
        var max = d3.max(values, function (d) { return d !== _this.options.nodataValue ? d : NaN; });
        var min = d3.min(values, function (d) { return d !== _this.options.nodataValue ? d : NaN; });
        max = Math.ceil(max / this.options.contourInterval) * this.options.contourInterval;
        min = Math.floor(min / this.options.contourInterval) * this.options.contourInterval;
        if (this.options.debug) {
            console.log("Contours: max");
            console.log(max);
        }
        if (this.options.debug) {
            console.log("Contours: min");
            console.log(min);
        }
        var thresholds = [];
        for (var i = min; i <= max; i += this.options.contourInterval) {
            thresholds.push(i);
        }
        if (this.options.debug) {
            console.log("Contour thresholds");
            console.log(thresholds);
        }
        var contour = d3.contours()
            .size([this._contourData.width, this._contourData.height]);
        contour.thresholds(thresholds);
        contour.smooth(this.options.contourSmoothLines);
        var contoursGeoData = contour(values);
        this._contourData.contoursGeoData = contoursGeoData;
        if (this.options.debug) {
            console.log("contoursGeoData");
            console.log(contoursGeoData);
        }
        return;
    };
    GLOperations.prototype._clearContours = function () {
        return __awaiter(this, void 0, void 0, function () {
            var contourCanvas, contourCtx;
            return __generator(this, function (_a) {
                if (this.options.debug)
                    console.log("_clearContours()");
                if (this.options.contourCanvas) {
                    contourCanvas = this.options.contourCanvas;
                    contourCtx = contourCanvas.getContext('2d');
                }
                else {
                    console.log("Error: contourCanvas not specified.");
                    return [2];
                }
                contourCtx.setTransform(1, 0, 0, 1, 0, 0);
                contourCtx.clearRect(0, 0, this._contourData.width, this._contourData.height);
                contourCtx.beginPath();
                return [2];
            });
        });
    };
    GLOperations.prototype._moveContourCanvas = function (activeTilesBounds) {
        return __awaiter(this, void 0, void 0, function () {
            var contourCanvas, contourPane, scale, pixelOrigin, transformPane, activeTilesPos;
            return __generator(this, function (_a) {
                if (this.options.debug)
                    console.log("_moveContourCanvas()");
                if (this.options.contourCanvas) {
                    contourCanvas = this.options.contourCanvas;
                }
                else {
                    console.log("Error: contourCanvas not specified.");
                    return [2];
                }
                if (this.options.contourPane) {
                    contourPane = this.options.contourPane;
                }
                else {
                    console.log("Error: contourPane not specified.");
                    return [2];
                }
                scale = this._map.getZoomScale(this._map.getZoom(), this._level.zoom);
                pixelOrigin = this._map.getPixelOrigin();
                transformPane = this._level.origin.multiplyBy(scale)
                    .subtract(pixelOrigin);
                activeTilesPos = this._getTilePos(this._keyToTileCoords(activeTilesBounds.xMin + ":" + activeTilesBounds.yMin + ":" + this._level.zoom));
                L.DomUtil.setTransform(contourPane, transformPane, scale);
                L.DomUtil.setTransform(contourCanvas, activeTilesPos);
                return [2];
            });
        });
    };
    GLOperations.prototype._drawContours = function () {
        return __awaiter(this, void 0, void 0, function () {
            var width, height, contourCanvas, contourCtx, path, bathyColor, hypsoColor, contoursGeoData, contourIndexInterval, bathyHigh, labels_1, _loop_1, this_1, _i, contoursGeoData_1, c;
            var _this = this;
            return __generator(this, function (_a) {
                if (this.options.debug)
                    console.log("_drawContours()");
                width = this._contourData.width;
                height = this._contourData.height;
                if (this.options.contourCanvas) {
                    contourCanvas = this.options.contourCanvas;
                    contourCtx = contourCanvas.getContext('2d');
                }
                else {
                    console.log("Error: contourCanvas not specified.");
                    return [2];
                }
                path = d3.geoPath().context(contourCtx);
                bathyColor = d3.scaleLinear()
                    .domain(this.options.contourBathyDomain)
                    .range(this.options.contourBathyColors);
                hypsoColor = d3.scaleLinear()
                    .domain(this.options.contourHypsoDomain)
                    .range(this.options.contourHypsoColors)
                    .interpolate(d3.interpolateHcl);
                contoursGeoData = this._contourData.contoursGeoData;
                contourIndexInterval = this.options.contourIndexInterval;
                bathyHigh = this.options.contourBathyDomain[this.options.contourBathyDomain.length - 1];
                contourCtx.clearRect(0, 0, width, height);
                contourCtx.save();
                if (this.options.contourType === 'lines') {
                    contourCtx.lineWidth = this.options.contourLineWeight;
                    contourCtx.strokeStyle = this.options.contourLineColor;
                    if (!this.options.contourHypso && !this.options.contourBathy) {
                        contourCtx.beginPath();
                        contoursGeoData.forEach(function (c) {
                            if (contourIndexInterval === 0 || c.value % contourIndexInterval !== 0)
                                path(c);
                        });
                        contourCtx.stroke();
                    }
                    else {
                        contoursGeoData.forEach(function (c) {
                            contourCtx.beginPath();
                            var fill;
                            if (c.value >= bathyHigh || !this.options.contourBathy) {
                                if (this.options.contourHypso)
                                    fill = hypsoColor(c.value);
                            }
                            else {
                                if (this.options.contourBathy)
                                    fill = bathyColor(c.value);
                            }
                            path(c);
                            if (fill) {
                                contourCtx.fillStyle = fill;
                                contourCtx.fill();
                            }
                            contourCtx.stroke();
                        }, this);
                    }
                    if (this.options.contourIndexInterval !== 0) {
                        if (!this.options.contourIndexLabels) {
                            contourCtx.lineWidth = this.options.contourLineIndexWeight;
                            contourCtx.beginPath();
                            contoursGeoData.forEach(function (c) {
                                if (c.value % contourIndexInterval === 0)
                                    path(c);
                            });
                            contourCtx.stroke();
                        }
                        else {
                            labels_1 = [];
                            _loop_1 = function (c) {
                                var threshold = c.value;
                                if (c.value % this_1.options.contourIndexInterval === 0) {
                                    c.coordinates.forEach(function (polygon) {
                                        return polygon.forEach(function (ring, j) {
                                            var p = ring.slice(1, Infinity);
                                            var possibilities = d3.range(_this.options.contourLabelDistance, _this.options.contourLabelDistance * 1.4);
                                            var scores = possibilities.map(function (d) { return -((p.length - 1) % d); });
                                            var n = possibilities[d3.scan(scores)];
                                            var start = 1 + (d3.scan(p.map(function (xy) { return (j === 0 ? -1 : 1) * xy[1]; })) % n);
                                            var margin = 10;
                                            p.forEach(function (xy, i) {
                                                if (i % n === start &&
                                                    xy[0] > margin &&
                                                    xy[0] < width - margin &&
                                                    xy[1] > margin &&
                                                    xy[1] < height - margin) {
                                                    var a = (i - 2 + p.length) % p.length;
                                                    var b = (i + 2) % p.length;
                                                    var dx = p[b][0] - p[a][0];
                                                    var dy = p[b][1] - p[a][1];
                                                    if (dx === 0 && dy === 0)
                                                        return;
                                                    labels_1.push({
                                                        threshold: threshold,
                                                        xy: xy.map(function (d) { return 1.0 * d; }),
                                                        angle: Math.atan2(dy, dx),
                                                        text: "" + c.value
                                                    });
                                                }
                                            });
                                        }, _this);
                                    }, this_1);
                                }
                                contourCtx.save();
                                contourCtx.beginPath();
                                contourCtx.moveTo(0, 0);
                                contourCtx.lineTo(width, 0);
                                contourCtx.lineTo(width, height);
                                contourCtx.lineTo(0, height);
                                contourCtx.lineTo(0, 0);
                                for (var _i = 0, labels_2 = labels_1; _i < labels_2.length; _i++) {
                                    var label = labels_2[_i];
                                    for (var i = 0; i < 2 * Math.PI; i += 0.2) {
                                        var pos = [Math.cos(i) * 20, -Math.sin(i) * 10];
                                        var c_1 = Math.cos(label.angle);
                                        var s = Math.sin(label.angle);
                                        contourCtx[i === 0 ? "moveTo" : "lineTo"](label.xy[0] + pos[0] * c_1 - pos[1] * s, label.xy[1] + pos[1] * c_1 + pos[0] * s);
                                    }
                                }
                                contourCtx.clip();
                                if (c.value % this_1.options.contourIndexInterval === 0) {
                                    contourCtx.beginPath();
                                    contourCtx.strokeStyle = this_1.options.contourLineColor;
                                    contourCtx.lineWidth = this_1.options.contourLineIndexWeight;
                                    path(c);
                                    contourCtx.stroke();
                                }
                                contourCtx.restore();
                                for (var _a = 0, labels_3 = labels_1; _a < labels_3.length; _a++) {
                                    var label = labels_3[_a];
                                    this_1._addlabel(contourCtx, label, this_1.options.contourLineColor, this_1.options.contourLabelFont);
                                }
                            };
                            this_1 = this;
                            for (_i = 0, contoursGeoData_1 = contoursGeoData; _i < contoursGeoData_1.length; _i++) {
                                c = contoursGeoData_1[_i];
                                _loop_1(c);
                            }
                        }
                    }
                }
                else if (this.options.contourType === 'illuminated') {
                    contourCtx.lineWidth = this.options.contourIlluminatedShadowSize + 1;
                    contourCtx.shadowBlur = this.options.contourIlluminatedShadowSize;
                    contourCtx.shadowOffsetX = this.options.contourIlluminatedShadowSize;
                    contourCtx.shadowOffsetY = this.options.contourIlluminatedShadowSize;
                    contoursGeoData.forEach(function (c) {
                        contourCtx.beginPath();
                        if (c.value >= bathyHigh || !this.options.contourBathy) {
                            contourCtx.shadowColor = this.options.contourIlluminatedShadowColor;
                            contourCtx.strokeStyle = this.options.contourIlluminatedHighlightColor;
                            if (this.options.contourHypso)
                                contourCtx.fillStyle = hypsoColor(c.value);
                        }
                        else {
                            contourCtx.shadowColor = this.options.contourBathyShadowColor;
                            contourCtx.strokeStyle = this.options.contourBathyHighlightColor;
                            if (this.options.contourBathy)
                                contourCtx.fillStyle = bathyColor(c.value);
                        }
                        path(c);
                        contourCtx.stroke();
                        if (this.options.contourHypso || this.options.contourBathy) {
                            contourCtx.fill();
                        }
                    }, this);
                }
                contourCtx.restore();
                this._map.fire('contourDrawing', { status: false });
                return [2];
            });
        });
    };
    GLOperations.prototype._wrapMouseEventHandler = function (handler) {
        var _this = this;
        return function (event) {
            var latlng = event.latlng;
            var pixelCoords = _this._map.project(latlng, _this._tileZoom).floor();
            var containingTile = _this._getTileContainingPoint(pixelCoords);
            var coordsInTile = containingTile && _this._getCoordsInTile(containingTile, pixelCoords);
            var byteIndex;
            if (coordsInTile !== undefined) {
                byteIndex = (coordsInTile.y * _this._tileSizeAsNumber() + coordsInTile.x) * BYTES_PER_WORD;
            }
            var pixelValues = {};
            if (byteIndex === undefined) {
                pixelValues['pixelValue'] = undefined;
            }
            else {
                var pixelData = containingTile.el.pixelData;
                pixelValues['pixelValue'] = coordsInTile && _this._getPixelValue(pixelData, byteIndex);
            }
            if (byteIndex !== undefined && _this.options.extraPixelLayers >= 1) {
                var pixelDataA = containingTile.el.pixelDataA;
                pixelValues['pixelValueA'] = coordsInTile && _this._getPixelValue(pixelDataA, byteIndex);
            }
            if (byteIndex !== undefined && _this.options.extraPixelLayers >= 2) {
                var pixelDataB = containingTile.el.pixelDataB;
                pixelValues['pixelValueB'] = coordsInTile && _this._getPixelValue(pixelDataB, byteIndex);
            }
            if (byteIndex !== undefined && _this.options.extraPixelLayers >= 3) {
                var pixelDataC = containingTile.el.pixelDataC;
                pixelValues['pixelValueC'] = coordsInTile && _this._getPixelValue(pixelDataC, byteIndex);
            }
            if (byteIndex !== undefined && _this.options.extraPixelLayers >= 4) {
                var pixelDataD = containingTile.el.pixelDataD;
                pixelValues['pixelValueD'] = coordsInTile && _this._getPixelValue(pixelDataD, byteIndex);
            }
            if (byteIndex !== undefined && _this.options.extraPixelLayers >= 5) {
                var pixelDataE = containingTile.el.pixelDataE;
                pixelValues['pixelValueE'] = coordsInTile && _this._getPixelValue(pixelDataE, byteIndex);
            }
            if (byteIndex !== undefined && _this.options.extraPixelLayers >= 6) {
                var pixelDataF = containingTile.el.pixelDataF;
                pixelValues['pixelValueF'] = coordsInTile && _this._getPixelValue(pixelDataF, byteIndex);
            }
            handler(__assign(__assign({}, event), { pixelValues: pixelValues }));
        };
    };
    GLOperations.prototype._getTileContainingPoint = function (point) {
        var _this = this;
        var tiles = staticCast(this._tiles);
        return lodashEs.values(tiles).find(function (tile) {
            return tile.coords.z === _this._tileZoom && _this._tileBounds(tile).contains(point);
        });
    };
    GLOperations.prototype._tileBounds = function (tile) {
        var _a = tile.coords, x = _a.x, y = _a.y;
        var tileSize = this._tileSizeAsNumber();
        var topLeft = L.point(x * tileSize, y * tileSize);
        var bottomRight = L.point(topLeft.x + (tileSize - 1), topLeft.y + (tileSize - 1));
        return L.bounds(topLeft, bottomRight);
    };
    GLOperations.prototype._getCoordsInTile = function (tile, pixelCoords) {
        var _a = tile.coords, tileX = _a.x, tileY = _a.y;
        var tileSize = this._tileSizeAsNumber();
        return L.point(pixelCoords.x - (tileX * tileSize), pixelCoords.y - (tileY * tileSize));
    };
    GLOperations.prototype._getPixelValue = function (pixelData, byteIndex) {
        if (!pixelData) {
            return undefined;
        }
        var _a = this.options, nodataValue = _a.nodataValue, sentinelValues = _a.sentinelValues;
        var tileDataView = new DataView(pixelData.buffer);
        var pixelValue = tileDataView.getFloat32(byteIndex, littleEndian$1);
        if (pixelValue === nodataValue) {
            return undefined;
        }
        var sentinel = sentinelValues && sentinelValues.find(function (_a) {
            var offset = _a.offset;
            return offset === pixelValue;
        });
        return sentinel || pixelValue;
    };
    GLOperations.prototype._getPixelScale = function () {
        var pixelScale = 1;
        var zoom = this._getZoomForUrl();
        if (this.options.hsPixelScale === 'auto') {
            pixelScale = EARTH_CIRCUMFERENCE * Math.abs(Math.cos(this._map.getCenter().lat / 180 * Math.PI)) / Math.pow(2, zoom + 8);
        }
        else if (typeof this.options.hsPixelScale === 'number') {
            pixelScale = this.options.hsPixelScale
                / (this._tileSizeAsNumber() * (Math.pow(2, zoom)));
        }
        return pixelScale;
    };
    GLOperations.defaultOptions = defaultOptions;
    return GLOperations;
}(L.GridLayer));

module.exports = GLOperations;
//# sourceMappingURL=index.js.map
