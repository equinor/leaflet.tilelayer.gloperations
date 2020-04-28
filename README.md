[![npm version](https://badge.fury.io/js/leaflet.tilelayer.gloperations.svg)](https://badge.fury.io/js/leaflet.tilelayer.gloperations)
[![Build Status](https://travis-ci.org/equinor/leaflet.tilelayer.gloperations.svg?branch=master)](https://travis-ci.org/github/equinor/leaflet.tilelayer.gloperations)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/equinor/leaflet.tilelayer.gloperations.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/equinor/leaflet.tilelayer.gloperations/alerts/)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/equinor/leaflet.tilelayer.gloperations.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/equinor/leaflet.tilelayer.gloperations/context:javascript)

# Leaflet.TileLayer.GLOperations

### Custom Leaflet TileLayer using WebGL to do operations on floating-point pixels

## Demo

Try it out [here](https://equinor.github.io/leaflet.tilelayer.gloperations/). You can find the demo code in the `gh-pages` branch.

## Features

- GPU rendering
- A small configuration language for describing how to colorize pixels
- (optional) animated per-pixel transitions when changing URL or color scales
- Raw (float) pixel value(s) provided to mouse event handlers
- A simple declarative API
- Load multiple tile layers, do operations on them and return result layer:
  - Difference between two tile layers
  - Analysis of multiple tile layers (supports 1-6 layers currently). Filter values and use a multiplier for each layer.
- Hillshading
  - On-the-fly
  - Pre-generated hillshading tiles
- Contours
  - Lines and index lines with optional labels
  - Illuminated lines
  - Hypsometric and bathymetric tint



## Accessing the plugin

### With module loader

Install:
```
npm install --save leaflet.tilelayer.gloperations
```

Reference as ECMAScript module:
```javascript
import * as L from 'leaflet';
import GLOperations from 'leaflet.tilelayer.gloperations';
```

Or as CommonJS module:
```javascript
const L = require('leaflet');
const GLOperations = require('leaflet.tilelayer.gloperations');
```

### With script tag, fetching from CDN

```html
<!-- Leaflet -->
<script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
<!-- Leaflet.TileLayer.GLOperations -->
<script src="https://unpkg.com/leaflet.tilelayer.gloperations/dist/bundle.min.js"></script>
```

```javascript
// Leaflet exposed as global variable `L`
// plugin exposed as `L.TileLayer.GLOperations`
const { GLOperations } = L.TileLayer;
```

### Usage

```javascript
const map = L.map('map').setView([0, 0], 5);

// Create the tile layer and add it to the map.
// Note that `url` is passed as a property on the `Options` object, not as a separate parameter as in the stock L.TileLayer.
const tileLayer = new GLOperations({
  url: 'https://{s}.my-tile-url.org/{z}/{x}/{y}.png',
  colorScale: [
    { offset: 0, color: 'rgb(255, 0, 0)', label: 'zero' },
    { offset: 1, color: 'rgb(0, 0, 255)', label: 'one' },
  ],
  nodataValue: -999999,
}).addTo(map);

// ... some time later

// Update the tile layer.
tileLayer.updateOptions({ url: 'https://{s}.my-other-tile-url.org/{z}/{x}/{y}.png' });
```

## Tile format

PNG files are used as an interchange format for getting floating-point raster data to the browser, primarily because it seems to be the most common format for raster data on map tile servers. The approach is similar to the way [DEM](https://en.wikipedia.org/wiki/Digital_elevation_model) tiles often encode non-color values into the RGBA channels (or more abstractly the 32 bits) of each pixel in a PNG file. DEM tiles typically encode 32-bit integers, though, while we encode 32-bit floats, which have a much wider range but uneven resolution throughout that range.

Given access to the binary pixel data, producing these tiles is trivial. We just take a buffer full of 32-bit floats and hand that over to a PNG encoder, which assumes it's getting RGBA pixels. Compression is of course not as good when you abuse the format like this.

Could add support for other tile formats, but for now this component assumes it's getting PNG files encoded with 32-bit floats.

## Color scales

Here's an example color scale:

```javascript
const colorScale = [
  { offset: 0, color: 'rgb(255, 0, 0)', label: 'zero' },
  { offset: 1, color: 'rgb(0, 0, 255)', label: 'one' },
];

const tileLayer = new GLOperations({ colorScale, /* ... */ });
```

This tells the renderer to color pixels with value 0 (or less) red and value 1 (or greater) blue. Pixels with values between 0 and 1 will get a blend of red and blue, because colors are linearly interpolated between each pair of adjacent stops. You can have as few as two or as many as `GLOperations.SCALE_MAX_LENGTH` color stops in a color scale.

## Sentinel values

In addition to linear color scales, it's possible to specify one or more "sentinel values," which map discrete values to colors. The format for specifying sentinel values is the same as that for color stops (except that the `label` property is required for sentinel values but optional for color stops). Let's change the above example just a little:

```javascript
const sentinelValues = [
  { offset: 0, color: 'rgb(255, 0, 0)', label: 'zero' },
  { offset: 1, color: 'rgb(0, 0, 255)', label: 'one' },
];

const tileLayer = new GLOperations({ sentinelValues, /* ... */ });
```

Now pixels whose values are _exactly_ 0 will be colored red and pixels whose values are _exactly_ 1 will be colored blue. We haven't specified what to do for values other than 0 or 1, so the behavior for such values would be undefined in this case. Sentinel values only match the precise value specified (within a tiny margin of error). The maximum number of sentinel values the component will accept can be accessed via `GLOperations.SENTINEL_MAX_LENGTH`.

## No-data value

Typically with raster tiles, one will want some pixels (e.g. pixels over oceans or other bodies of water) to be fully transparent. We support this behavior with a special kind of sentinel value, called the "no-data value." By encoding a no-data value into your raster tiles for pixels that should be transparent and then specifying this value via the `nodataValue` property of the `Options` object, you can tell the tile layer to render these pixels as fully transparent.

Any valid 32-bit float can be chosen for a sentinel value or the no-data value, but it's wise to choose a value that's well outside the range of expected data values. The default values is `-999999`

## Transitions

This tile layer supports animated transitions when changing either the URL or the color scale! You can specify the transition time (in milliseconds) with the `Options` property `transitionTimeMs`. If you don't want transitions, you can turn them off by setting `{ transitions: false }` in the `Options` object.

Caveat:
- Transitions are currently only implemented with `glOperations=none`.


## Difference operation

To get the difference between two tile layers set `glOperation=diff` and set `operationUrlA` and `operationUrlB`. The rendered tileLayer will then be values from `operationUrlB` - `operationUrlA`. If you register an event handler you will get the result returned. To also return the values from the input tileLayers set `extraPixelLayers=2`.

## Multiple layers operation

To do operations on multiple tile layers set `glOperation=multi` and `multiLayers=x` to number of layers you want to use as input (currently max 6 is supported). set `operationUrlA`, `operationUrlB` etc to the input layers. Set the high/low filter for each layer with `filterLowA`, `filterHighA` etc. Optionally multiply each input layer with a value after filtering by setting `multiplierA` etc. Default multiplier is `+1`. The rendered tile layer will then be calculated after filtering with `layer1*mult1 + layer2*mult2` etc. If you register an event handler you will get the result returned. To also return the values from the input tile layers set `extraPixelLayers=x`.

## Hillshading
On-the-fly hillshading is a work in progress. Currently two options:
- On-the-fly single-pass for each tile
- Pre-generated hillshading tiles

Caveats:
- Currently only implemented with glOperation="none"

Have started work on advanced hillshading. This cannot be done for each individual tile as the hillshading needs to take into account the surrounding tiles. Hillshading for each tile need to be rendered with the 8 surrounding tiles and then extract the center tile. For my projects I am pre-generating the advanced hillshading tiles. The shaders are included in this project, so if someone is interested in doing it on-the-fly just submit a PR which is using the shaders.

## Contours

Work in progress. Can set the contour interval and show as simple or illuminated lines. Index interval with different thickness can be set and optionally add labels.

Hypsometric tint can be applied for entire layer or above a certain depth (typically above sea level). Bathymetric tin can be applied below a certain depth (typically below sea level).

Caveats:
- Currently only working properly with noDataValue=default (-999999)
- Have to merge active tiles to a single canvas and is not using WebGL to draw the contours. Hence the contour option is quite slow to use.
- Contours are currently only implemented with glOperation="none"
- Index interval needs to be a multiple of countour interval.

As it takes a while to update the contours leaflet will fire an event you can listen to: `contourDrawing`. The event has a `status` property which is `true` when in progress and `false` if finished. E.g. to use:
```javascript
map.on("contourDrawing", function(data) {
    if (data.status) {
        console.log("Currently calculating contours")
    } else {
        console.log("Finished drawing contours")
    }
});
```


## Updating the component

Rather than providing multiple methods for changing state or behavior as many built-in Leaflet components do, this tile layer has a single method, `updateOptions`. The API is designed to be simple and declarative, like that of a React component. You create a component by passing an `Options` object to the constructor:

```javascript
const tileLayer = new GLOperations({ /* ... */ });
```

You update a component by passing an `Options` object to `updateOptions`:

```javascript
tileLayer.updateOptions({ /* ... */ });
```

## Options

This TileLayer accepts all the same options as `Leaflet.GridLayer` and `Leaflet.TileLayer`. It also accepts these additional options:

| Option              | Type            | Default   | Description |
| ----------------    | --------------- | --------- | ----------- |
| url                 | String          | undefined | tile URL
| nodataValue         | Number          | undefined | pixel value to interpret as no-data
| colorScale          | Color[]         | []        | array of color stops used for linear interpolation
| sentinelValues      | SentinelValue[] | []        | array of fixed values to be matched exactly
| preloadUrl          | String          | undefined | tile URL to preload in the background
| transitions         | Boolean         | true      | whether to show pixel transitions when changing URL or color scales
| transitionTimeMs    | Number          | 800       | duration of pixel transitions, in miliseconds
| extraPixelLayers    | Number          | 0         | Return pixel value from extra layers. E.g. set to 1 and set operationUrlA to the extra tileLayer. (Does not work for diff and multiAnalyze) | glOperation      | String          | 'none'    | Options: none, diff, multi
| multiLayers         | Number          | 0         | Set the number of tileLayers to use as input when using `glOperation=multi` (max 6)
| operationUrlA       | String          | undefined | tile URL
| operationUrlB       | String          | undefined | tile URL
| operationUrlC       | String          | undefined | tile URL
| operationUrlD       | String          | undefined | tile URL
| operationUrlE       | String          | undefined | tile URL
| operationUrlF       | String          | undefined | tile URL
| filterLowA          | Number          | 0         | Filter pixels below this value when using `glOperation=multi`
| filterHighA         | Number          | 100000    | Filter pixels above this value when using `glOperation=multi`
| filterLowB          | Number          | 0         | Filter pixels below this value when using `glOperation=multi`
| filterHighB         | Number          | 100000    | Filter pixels above this value when using `glOperation=multi`
| filterLowC          | Number          | 0         | Filter pixels below this value when using `glOperation=multi`
| filterHighC         | Number          | 100000    | Filter pixels above this value when using `glOperation=multi`
| filterLowD          | Number          | 0         | Filter pixels below this value when using `glOperation=multi`
| filterHighD         | Number          | 100000    | Filter pixels above this value when using `glOperation=multi`
| filterLowE          | Number          | 0         | Filter pixels below this value when using `glOperation=multi`
| filterHighE         | Number          | 100000    | Filter pixels above this value when using `glOperation=multi`
| filterLowF          | Number          | 0         | Filter pixels below this value when using `glOperation=multi`
| filterHighF         | Number          | 100000    | Filter pixels above this value when using `glOperation=multi`
| multiplierA         | Number          | 1         | Multiply the values of this tileLayer by this number when using `glOperation=multi`
| multiplierB         | Number          | 1         | Multiply the values of this tileLayer by this number when using `glOperation=multi`
| multiplierC         | Number          | 1         | Multiply the values of this tileLayer by this number when using `glOperation=multi`
| multiplierD         | Number          | 1         | Multiply the values of this tileLayer by this number when using `glOperation=multi`
| multiplierE         | Number          | 1         | Multiply the values of this tileLayer by this number when using `glOperation=multi`
| multiplierF         | Number          | 1         | Multiply the values of this tileLayer by this number when using `glOperation=multi`
| hillshadeType       | String          | 'none'    | none, simple or pregen
| hsSimpleZoomdelta       | Number          | 0         | Used to calculate map units from pixel distance
| hsSimpleSlopescale      | Number          | 3.0       | Scale elevation to increase/decrease hillshading
| hsSimpleAzimuth         | Number          | 315       | Sun direction in degrees
| hsSimpleAltitude        | Number          | 70        | Sun altitude in degrees
| hsPregenUrl             | String          | ''        | Url to pre-generated hillshading tiles
| contourType             | String          | 'none'    | none, lines or illuminated
| contourSmooth           | Boolean         | false     | Smooth contour lines (not input array, but generated contour lines)
| contourScaleFactor      | Number          | 1         | Scale values from layer before generating contours. E.g. if your are using illuminated lines and your values are depth, not height, use `-1`.
| contourInterval         | Number          | 25        | Interval to create contours
| contourIndexInterval    | Number          | 100       | Interval to create index contours with different line thickness. Have to be a multiple of `contourInterval`.
| contourLineColor        | String          | '#000000' | Contour line colour as hex value
| contourIlluminatedHighlightColor  | String      | 'rgba(177,174,164,.5)' | Highlight color for illuminated contour lines
| contourIlluminatedShadowColor     | String      | '#5b5143' | Shadow color for illuminated contour lines
| contourIlluminatedShadowSize      | Number      | 2         | Shadow thickness in px
| contourLineWeight                 | Number      | 0.5       | Contour line thickness
| contourLineIndexWeight            | Number      | 2.0       | Contour index line thickness
| contourIndexLabels                | Boolean     | false     | Add labels to contour lines
| contourLabelFont                  | String      | '12px Arial' | Contour label font
| contourLabelDistance              | Number      | 250       | Distance between contour labels
| contourHypso                      | Boolean     | false     | Enable hypsometric tint
| contourHypsoDomain                | Number[]    | [0, 1000, 2000] | Hypsometric tint domain to apply colours to
| contourHypsoColors                | String[]    | ["#486341", "#e5d9c9", "#dddddd"] | Hypsometric tint colors
| contourBathy                      | Boolean     | false     | Enable bathymetric tint
| contourBathyDomain                | Number[]    | [-2000, 0] | Bathymetric tint domain to apply colours to
| contourBathyColors                | String[]    | ["#315d9b", "#d5f2ff"] | Bathymetric tint colors
| contourBathyShadowColor           | String      | '#4e5c66' | Shadow color for bathymetric tint illuminated lines
| contourBathyHighlightColor        | String      | 'rgba(224, 242, 255, .5)'| Highlight color for bathymetric tint illuminated lines

See [Events and handlers](#events-and-handlers) (below) for a list of callbacks that can be passed as `Options` properties.

## Events and handlers

You can register handler functions for some events by passing them as properties on the `Options` object when the component is created. Note that this is a bit different from the way handlers are registered on typical Leaflet components. The following table shows the mapping of `Options` properties to corresponding events:

| Property      | Event       |
| ------------- | ----------- |
| onload        | load        |
| onclick       | click       |
| ondblclick    | dblclick    |
| onmousedown   | mousedown   |
| onmouseup     | mouseup     |
| onmouseover   | mouseover   |
| onmouseout    | mouseout    |
| onmousemove   | mousemove   |
| oncontextmenu | contextmenu |

This component extends the Event object provided to Leaflet mouse event handlers, adding an object `pixelValues` that represents the value(s) of the pixel under the cursor. The property `pixelValue` will always be present. For `glOperation=none` this value will be `undefined` if the pixel has the `nodata` value. If the pixel value matches a sentinel value, the `SentinelValue` object will be provided as `pixelValue`. Otherwise, `pixelValue` will match the numerical value of the pixel. For `glOperation=diff` or `glOperation=multi` the value will be the result of the operation.

It is possible to return values from extra layers. Set the property `extraPixelLayers` (max 6) and set `operationUrlA-F`. `pixelValues` will then return extra properties `pixelValueA` etc. E.g. if you are using `glOperation=multi` with 5 layers: set `extraPixelLayers=5` and `pixelValues` will contain both the result from the operation and values from all the input tileLayers.

Here's an example of registering a handler for the the `click` event:
```javascript
const tileLayer = new GLOperations({
  // ...
  onclick: ({ pixelValues }) => {
    if (pixelValues.pixelValue === undefined) {
      // Do nothing for `nodata`.
      return;
    } else if (typeof pixelValues.pixelValue === 'number') {
      // Numerical pixelValue: alert with value
      alert(pixelValues.pixelValue);
    } else {
      // Sentinel value: alert with label
      // If you're not using sentinel values, no need to worry about this case.
      alert(pixelValues.pixelValue.label);
    }
    alert(pixelValues.pixelValue);
  },
});
```

## Preloading tiles

You can optionally preload a tile set in the background by supplying its URL as the `Options` property `preloadUrl`. This behavior facilitates quickly switching to a new tile set when you know in advance what its URL will be, as for instance when scripting your Leaflet visualization. To be notified when the new tile set has finished loading, register a handler on the 'load' event and check that the `url` property on the event object matches your `preloadUrl`. Then you can switch to the new tile set by passing its URL as `Options.url`.

```javascript
const firstUrl = 'https://{s}.my-tile-url.org/{z}/{x}/{y}.png';
const nextUrl = 'https://{s}.my-other-tile-url.org/{z}/{x}/{y}.png';

const tileLayer = new GLOperations({
  url: firstUrl,
  preloadUrl: nextUrl,

  // ... other options

  // handler for 'load' event, passed Event object with property `url`
  onload: ({ url }) => {
    if (url === firstUrl) {
      alert(`tiles loaded from ${firstUrl}`);
    } else if (url === nextUrl) {
      alert(`tiles loaded from ${nextUrl}`);
    }
  },
}).addTo(map);

// ... some time later, after tiles from `nextUrl` have loaded, we switch to the preloaded tile set
tileLayer.updateOptions({
  url: nextUrl,
  // ... other options
});
```

## Attribution

Based on [Leaflet.TileLayer.GLColorScale](https://github.com/ihmeuw/leaflet.tilelayer.glcolorscale) from [IHME](http://www.healthdata.org/). Read their [article](https://github.com/ihmeuw/leaflet.tilelayer.glcolorscale/blob/master/article/article.md) for the background of their plugin.