import React from "react";
import ReactDOM from 'react-dom';

import L from 'leaflet';
import GLOperations from '../dist/gloperations/index.js';

import 'leaflet/dist/leaflet.css';
import './index.css';
import './leaflet-messagebox.js';

import Navigation from './Navigation.js'

window.onload = function() {
  document.getElementById('burger').addEventListener('click', function (e) {
    document.getElementById("nav").classList.toggle('menuClosed');
  })
};


// Show this many places after the decimal when displaying pixel value.
var VALUE_DISPLAY_PRECISION = 2;

var map = L.map('map', {
  minZoom: 0,
  maxZoom: 4,
  noWrap: true,
  attributionControl: false,
  zoom: 2,
  crs: L.CRS.Simple,
});

var southWest = map.unproject([0, 15*256], map.getMaxZoom());
var northEast = map.unproject([15*256, 0], map.getMaxZoom());
let bounds = new L.LatLngBounds(southWest, northEast)
map.setMaxBounds(bounds);
map.setView([0, 0], 2);

let tileurl = './tiles/top/topupperreek/{z}/{x}/{y}.png';

// create pane to draw contours on
let contourPane = map.createPane("contourPane");
map.getPane('contourPane').style.zIndex = 210;
let contourCanvas = document.createElement('canvas');
contourCanvas.id='contours';
contourCanvas.width = contourCanvas.width;
contourPane.appendChild(contourCanvas);

// let tileLayer = new GLOperations({
window.tileLayer = new GLOperations({
  // debug: true,
  url: tileurl,
  colorScale: [
    {color: "rgb(250, 250, 110)", offset: 1600},
    {color: "rgb(189, 234, 117)", offset: 1625},
    {color: "rgb(134, 215, 128)", offset: 1650},
    {color: "rgb(84, 193, 138)", offset: 1675},
    {color: "rgb(35, 170, 143)", offset: 1700},
    {color: "rgb(0, 145, 141)", offset: 1725},
    {color: "rgb(0, 120, 130)", offset: 1750},
    {color: "rgb(31, 95, 112)", offset: 1775},
    {color: "rgb(42, 72, 88)", offset: 1800},
  ],
  nodataValue: -999999,
  noWrap: true,
  transitions: false,
  colorscaleMaxLength: 10,
  sentinelMaxLength: 3,
  hillshadeType: 'none',
  hsElevationScale: 1,
  hsSimpleSlopescale: 3,
  hsSimpleZoomdelta: 8,
  bounds: bounds,
  contourType: 'none',
  contourCanvas: contourCanvas,
  onmousemove: updateValueDisplay,
}).addTo(map);

// display information when contours are updating
let contourLoadingMessage = L.control.messagebox({
  position: 'topleft',
  timeout: 1200000,
}).addTo(map);
map.on("contourDrawing", function(data) {
  if (data.status) {
      contourLoadingMessage.options.timeout = 1200000;
      contourLoadingMessage.show('Calculating contours...');
  } else {
      contourLoadingMessage.options.timeout = 2000;
      contourLoadingMessage.show('Calculating contours...done');
  }
});

let valueDisplay = L.control({
  position : 'topright'
});
valueDisplay.onAdd = function () {
  this._div = L.DomUtil.create('div', 'value-display my-leaflet-control');
  this.update('');
  return this._div;
};
valueDisplay.update = function (text) {
  this._div.innerHTML = text;
};
valueDisplay.addTo(map);

// function to update the value display when the mouse hovers over pixels
function updateValueDisplay(mouseEvent) {
  var pixelValue = mouseEvent.pixelValues.pixelValue;
  let text = '';
  let valueLen = Object.keys(mouseEvent.pixelValues).length;
  if (valueLen === 1) {
    // if no-data pixel, pixelValue will be `undefined`
    if (pixelValue === undefined) {
      text = '';
    } else if (typeof pixelValue === 'number') {
      text = pixelValue.toFixed(VALUE_DISPLAY_PRECISION);
    } else {
        text = pixelValue.label;
    }
  } else if (valueLen === 3) {
    text = pixelValue === undefined ? '' : 'Difference: ' + pixelValue.toFixed(VALUE_DISPLAY_PRECISION)
                                        + '<br>Pressure year 2000: ' + mouseEvent.pixelValues.pixelValueA.toFixed(VALUE_DISPLAY_PRECISION)
                                        + '<br>Pressure year 2003: ' + mouseEvent.pixelValues.pixelValueB.toFixed(VALUE_DISPLAY_PRECISION);
  } else if (valueLen === 5) {
    text = pixelValue === undefined ? '' : 'Result: ' + pixelValue.toFixed(VALUE_DISPLAY_PRECISION)
                                        + '<br>Oil-thickness: ' + mouseEvent.pixelValues.pixelValueA.toFixed(VALUE_DISPLAY_PRECISION)
                                        + '<br>STOIIP: ' + mouseEvent.pixelValues.pixelValueB.toFixed(VALUE_DISPLAY_PRECISION)
                                        + '<br>Porosity: ' + mouseEvent.pixelValues.pixelValueC.toFixed(VALUE_DISPLAY_PRECISION)
                                        + '<br>Permeability: ' + mouseEvent.pixelValues.pixelValueD.toFixed(VALUE_DISPLAY_PRECISION);
  }
  valueDisplay.update(text);
}

const domContainer = document.querySelector('#nav');
ReactDOM.render(React.createElement( Navigation, {tileLayer}), domContainer);