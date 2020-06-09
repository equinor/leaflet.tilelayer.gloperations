import React, {useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import './App.css';
import Navigation from './Navigation.js'
import '../map/leaflet-messagebox.js';
import addValueDisplay from '../map/valuedisplay.js';
import addGLOperations from '../map/tilelayer.js';

let VALUE_DISPLAY_PRECISION = 2;

function App() {
  const [map, setMap] = useState(null);
  const [tilelayer, setTilelayer] = useState(null);

  // const [mapBounds, setMapBounds] = useState(new L.LatLngBounds([0,0], [0,0]));

  //initial setup of map
  const mapRef = useRef(null);
  const contourPaneRef = useRef(null);
  const contourCanvasRef = useRef(null);
  const tilelayerRef = useRef(null);
  useEffect(() => {
    let map = L.map('map', {
      minZoom: 0,
      maxZoom: 4,
      noWrap: true,
      attributionControl: false,
      zoom: 2,
      zoomDelta: 0.25,
      zoomSnap: 0.25,
      wheelPxPerZoomLevel : 200,
      maxBoundsViscosity: 0.8,
      crs: L.CRS.Simple,
    });

    mapRef.current = map;

    var southWest = map.unproject([0, 15*256], map.getMaxZoom());
    var northEast = map.unproject([15*256, 0], map.getMaxZoom());
    let bounds = new L.LatLngBounds(southWest, northEast)
    // setMapBounds(bounds);
    map.setMaxBounds(bounds);
    map.setView([0, 0], 2);
    setMap(map);

    // add contour canvas
    let contourPane = map.createPane("contourPane");
    map.getPane('contourPane').style.zIndex = 210;
    let contourCanvas = document.createElement('canvas');
    contourPaneRef.current = contourPane;
    contourCanvasRef.current = contourCanvas;
    contourCanvas.id='contours';
    contourCanvas.width = contourCanvas.width;
    contourPane.appendChild(contourCanvas);

    tilelayerRef.current = addGLOperations(
      mapRef.current,
      bounds,
      contourPaneRef.current,
      contourCanvasRef.current,
      updateValueDisplay
    );


    // tilelayer.addTo(mapRef.current);
    // tilelayerRef.current = tilelayer;
    setTilelayer(tilelayerRef.current)
    window.tilelayer = tilelayerRef.current;
  }, []);

  // display information when contours are updating
  const contourLoadingMessageRef = useRef(null);
  useEffect(() => {
    contourLoadingMessageRef.current = L.control.messagebox({
      position: 'topleft',
      timeout: 1200000,
    }).addTo(mapRef.current);
    mapRef.current.on("contourDrawing", function(data) {
      if (data.status) {
          contourLoadingMessageRef.current.options.timeout = 1200000;
          contourLoadingMessageRef.current.show('Calculating contours...');
      } else {
          contourLoadingMessageRef.current.options.timeout = 2000;
          contourLoadingMessageRef.current.show('Calculating contours...done');
      }
    });
  }, []);

  const valueDisplayRef = useRef(null);
  useEffect(() => {
    // add control to display pixel values
    valueDisplayRef.current = addValueDisplay(mapRef.current, VALUE_DISPLAY_PRECISION);
  }, []);



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
    valueDisplayRef.current.update(text);
  }

    return (
      <div id="container">
      <div id="topbar">
        <div style={{display: 'inline-block', marginLeft: 10}}>
          <div id="burger" style={{display: 'inline-block', height: 16, width: 16}}></div>
          <div style={{display: 'inline', margin: 5, marginLeft: 20}}>
            <span className='title'><a href="https://github.com/equinor/leaflet.tilelayer.gloperations">Leaflet.TileLayer.GLOperations demo</a></span>
          </div>
        </div>
      </div>
      <div id="nav">
        {tilelayer !== null &&
          <Navigation tilelayer={tilelayerRef.current}/>
        }
      </div>
      <div id="map"></div>
    </div>
    );
}

export default App;
