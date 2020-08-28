import '../../map/common/leaflet-messagebox.js';

export default function initContourLayer(map) {
	let contourPane = map.createPane("contourPane");
  map.getPane('contourPane').style.zIndex = 210;

  let contourCanvas = document.createElement('canvas');
  // contourPaneRef.current = contourPane;
  // contourCanvasRef.current = contourCanvas;
  contourCanvas.id='contours';
  contourCanvas.width = contourCanvas.width;
  contourPane.appendChild(contourCanvas);

  // set up messagebox
  const contourLoadingMessage = L.control.messagebox({
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
  
	return [contourPane, contourCanvas];
}
