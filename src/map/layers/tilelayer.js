import GLOperations from './gloperations/index.js';

export default function addGLOperations(mapType, map, bounds, contourPane, contourCanvas, onmousemove) {
  if (mapType === 'custom') {
    let tilelayer = new GLOperations({
      url: './tiles/top/topupperreek/{z}/{x}/{y}.png',
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
      colorscaleMaxLength: 25,
      sentinelMaxLength: 3,
      hillshadeType: 'none',
      hsAdvValueScale: -1.0,
      hsSimpleSlopescale: 5,
      hsSimpleZoomdelta: 8,
      hsAdvPixelScale: 5000,
      hsAdvSunRadiusMultiplier: 100,
      hsAdvSoftIterations: 10,
      hsAdvAmbientIterations: 10,
      hsAdvFinalSoftMultiplier: 1.1,
      hsAdvFinalAmbientMultiplier: 0.25,
      bounds: bounds,
      contourType: 'none',
      contourPane: contourPane,
      contourCanvas: contourCanvas,
      onmousemove: onmousemove,
    }).addTo(map);

    return tilelayer;

  } else if (mapType === 'world') {
    let mapboxToken = 'pk.eyJ1IjoiaGVyamFyIiwiYSI6ImNrZjl6MjUwYTBxeWYyeXFncHI0NjN2bngifQ.-e2mdgWyalWaosKYPzGXow';
    let privateToken = '';
    if (privateToken) {
      mapboxToken = privateToken;
    }
    let tilelayer = new GLOperations({
      url: `https://api.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}.pngraw?access_token=${mapboxToken}`,
      colorScale: [
        {color: "rgb(8, 48, 107)", offset: -1100},
		    {color: "rgb(8, 81, 156)", offset: 0.0},
        {color: "rgb(78, 156, 71)", offset: 0.001},
        {color: "rgb(109, 164, 79)", offset: 230},
        {color: "rgb(134, 170, 85)", offset: 460},
        {color: "rgb(157, 176, 89)", offset: 690},
        {color: "rgb(178, 182, 93)", offset: 920},
        {color: "rgb(187, 174, 97)", offset: 1150},
        {color: "rgb(194, 164, 106)", offset: 1380},
        {color: "rgb(208, 173, 138)", offset: 1610},
        {color: "rgb(224, 189, 173)", offset: 1840},
        {color: "rgb(238, 216, 212)", offset: 2070},
        {color: "rgb(255, 241, 239)", offset: 2300},
      ],
      // attribution: 'Mapbox',
      tileFormat: 'dem',
      nodataValue: -999999,
      noWrap: false,
      transitions: false,
      colorscaleMaxLength: 25,
      sentinelMaxLength: 3,
      hillshadeType: 'none',
      hsAdvValueScale: 1.0,
      hsSimpleSlopescale: 0.85,
      hsSimpleZoomdelta: 0,
      hsAdvPixelScale: 'auto',
      hsAdvSunRadiusMultiplier: 100,
      hsAdvSoftIterations: 5,
      hsAdvAmbientIterations: 5,
      hsAdvFinalSoftMultiplier: 1.2,
      hsAdvFinalAmbientMultiplier: 0.30,
      contourType: 'none',
      contourPane: contourPane,
      contourCanvas: contourCanvas,
      onmousemove: onmousemove,
    }).addTo(map);

    let credits = L.control.attribution({prefix:false}).addTo(map);
    credits.addAttribution('© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>');

    return tilelayer;
  }

}
