import L from 'leaflet';

export function addValueDisplay(map) {
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

  return valueDisplay;
}
