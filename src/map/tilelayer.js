import GLOperations from './gloperations/index.js';

export default function addGLOperations(map, bounds, contourPane, contourCanvas, onmousemove) {
  let tilelayer = new GLOperations({
    // debug: true,
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
    colorscaleMaxLength: 10,
    sentinelMaxLength: 3,
    hillshadeType: 'none',
    hsElevationScale: 1,
    hsSimpleSlopescale: 3,
    hsSimpleZoomdelta: 8,
    bounds: bounds,
    contourType: 'none',
    contourPane: contourPane,
    contourCanvas: contourCanvas,
    onmousemove: onmousemove,
  }).addTo(map);

  return tilelayer;
}