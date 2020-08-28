import "leaflet/dist/leaflet.css";
import "./Map.css";

import React, {useEffect, useRef, useState} from 'react';
import { addValueDisplay } from '../../map/common/valuedisplay.js';

import addGLOperations from '../../map/layers/tilelayer.js';
import { createMap } from '../../map'
import initContourLayer from '../../map/layers/contours.js';

function Map(props) {
  const [map, setMap] = useState();

  //initial setup of map
  const mapRef = useRef(null);
    useEffect(() => {
    setMap(createMap(mapRef.current));
  }, []);

  const valueDisplayRef = useRef(null);
  useEffect(() => {
    if (map) {
      const [contourPane, contourCanvas] = initContourLayer(map)

      valueDisplayRef.current = addValueDisplay(map);

      const tilelayer = addGLOperations(
        map,
        map.options.maxBounds,
        contourPane,
        contourCanvas,
        updateValueDisplay
      );
      props.setTilelayer(tilelayer)
      window.tilelayer = tilelayer;
    }
  }, [map]);

  // function to update the value display when the mouse hovers over pixels
  function updateValueDisplay(mouseEvent, VALUE_DISPLAY_PRECISION=2) {
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
      <div id="map" ref={mapRef}></div>
    );
}

export default Map;
