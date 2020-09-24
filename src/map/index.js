// import L from 'leaflet';

export function createMap(elm, mapType) {
  if (mapType === 'custom') {
    const map = L.map(elm, {
      minZoom: 0,
      maxZoom: 4,
      noWrap: true,
      attributionControl: false,
      zoom: 1,
      zoomDelta: 0.5,
      zoomSnap: 0.5,
      wheelPxPerZoomLevel : 200,
      maxBoundsViscosity: 0.8,
      crs: L.CRS.Simple,
    });

    var southWest = map.unproject([0*256, 15*256], map.getMaxZoom());
    var northEast = map.unproject([15*256, 0*256], map.getMaxZoom());
    let bounds = new L.LatLngBounds(southWest, northEast)
    map.setMaxBounds(bounds);
    map.setView([0, 0], 0);
    return map;

  } else if (mapType === 'world') {
    const map = L.map(elm, {
      minZoom: 3,
      maxZoom: 12,
      noWrap: false,
      attributionControl: false,
      zoom: 9,
      zoomDelta: 0.5,
      zoomSnap: 0.5,
      wheelPxPerZoomLevel : 200,
      maxBoundsViscosity: 0.8,
      crs: L.CRS.EPSG3857,
    });
    L.control.attribution({prefix:false})
    map.setView([41.0, -122.7], 9);
    return map;
  }
}
