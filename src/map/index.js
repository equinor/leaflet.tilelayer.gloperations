import L from 'leaflet';

export function createMap(elm) {
	const map = L.map(elm, {
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
    
  var southWest = map.unproject([0, 15*256], map.getMaxZoom());
  var northEast = map.unproject([15*256, 0], map.getMaxZoom());
  let bounds = new L.LatLngBounds(southWest, northEast)
  map.setMaxBounds(bounds);
  map.setView([0, 0], 2);
  
	return map;
}
