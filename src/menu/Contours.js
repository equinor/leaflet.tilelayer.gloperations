import 'antd/dist/antd.css';

import { Radio, Slider, Switch } from 'antd';
import React, { useState } from "react";

import { GithubPicker } from 'react-color';

const Contours = ({tilelayer}) => {
  const [contourIlluminated, setContourIlluminated] = useState(false);
  const [contourHypsometric, setContourHypsometric] = useState(false);
  const [contourBathymetric, setContourBathymetric] = useState(false);
  const [contourLabels, setContourLabels] = useState(false);
  const [contourSmooth, setContourSmooth] = useState(true);
  const [contourLineColor, setContourLineColor] = useState('#000000');
  const [contourType, setContourType] = useState('lines');

  const contourRadioChange = e => {
    setContourType(e.target.value);
    if (e.target.value === 'illuminated') {
      setContourIlluminated(true);
      updateBathymetricChange(true);
      updateHypsometricChange(true);
    } else {
      setContourIlluminated(false);
      updateBathymetricChange(false);
      updateHypsometricChange(false);
    }
    tilelayer.updateOptions({contourType: e.target.value})
  };

  function handleContourLineColor(color) {
    setContourLineColor(color.hex);
    tilelayer.updateOptions({contourLineColor: color.hex})
  }

  function handleHypsometricChange() {
    updateHypsometricChange(!contourHypsometric);
  }

  function updateHypsometricChange(value) {
    setContourHypsometric(value);
    tilelayer.updateOptions({contourHypso: value})
  }

  function handleBathymetricChange() {
    updateBathymetricChange(!contourBathymetric);
  }

  function updateBathymetricChange(value) {
    setContourBathymetric(value);
    tilelayer.updateOptions({contourBathy: value})
  }

  function handleContourLabelChange() {
    setContourLabels(!contourLabels);
    tilelayer.updateOptions({contourIndexLabels: !contourLabels})
  }

  function handleContourSmoothChange() {
    setContourSmooth (!contourSmooth);
    tilelayer.updateOptions({contourSmoothInput: !contourSmooth})
  }

  function contourIntervalChange(value) {
    tilelayer.updateOptions({contourInterval: parseFloat(value)})
  }

  function contourIndexIntervalChange(value) {
    tilelayer.updateOptions({contourIndexInterval: parseFloat(value)})
  }

  function contourLabelDistanceChange(value) {
    tilelayer.updateOptions({contourLabelDistance: parseFloat(value)})
  }

  function contourLineSizeChange(value) {
    tilelayer.updateOptions({contourLineWeight: parseFloat(value)})
  }

  function contourSmoothKernelChange(value) {
    tilelayer.updateOptions({contourSmoothInputKernel: parseFloat(value)})
  }

  function contourLineIndexSizeChange(value) {
    tilelayer.updateOptions({contourLineIndexWeight: parseFloat(value)})
  }

  const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
  };

  return (
    <div>
      <p>Contours is an experimental feature. It is not using WebGL and the tiles have to be merged to a single canvas before calculating contours. This means it is slower than the other operations of this plugin. See <a href="https://github.com/equinor/leaflet.tilelayer.gloperations/wiki/Contours" target="_blank">wiki</a> for more information.</p>
      <Radio.Group onChange={contourRadioChange} value={contourType}>
        <Radio style={radioStyle} value='none'>
          None
        </Radio>
        <Radio style={radioStyle} value='lines'>
          Lines
        </Radio>
        <Radio style={radioStyle} value='illuminated'>
          Illuminated
        </Radio>
      </Radio.Group>
      <br></br>
      Hypsometric tint: <Switch size="small" checked={contourHypsometric} onChange={handleHypsometricChange} />
      <br></br>
      Bathymetric tint: <Switch size="small" checked={contourBathymetric} onChange={handleBathymetricChange} />
      <br></br><br></br>
      Contour interval:
      <Slider defaultValue={10} min={5} max={250} step={5} onAfterChange={contourIntervalChange}/>
      Index interval:
      <Slider defaultValue={100} min={0} max={200} step={5} disabled={contourIlluminated} onAfterChange={contourIndexIntervalChange}/>
      Contour line size:
      <Slider defaultValue={0.5} min={0.1} max={3} step={0.1} disabled={contourIlluminated} onAfterChange={contourLineSizeChange}/>
      Index line size:
      <Slider defaultValue={2.5} min={0.1} max={5} step={0.1} disabled={contourIlluminated} onAfterChange={contourLineIndexSizeChange}/>
      <br></br>
      Smooth contour input data: <Switch size="small" checked={contourSmooth} onChange={handleContourSmoothChange} />
      <br></br>
      Smoothing convolution kernel size:
      <Slider defaultValue={15} min={1} max={41} step={2} disabled={!contourSmooth} onAfterChange={contourSmoothKernelChange}/>
      Contour line color:
      <GithubPicker color={contourLineColor} triangle={'hide'} colors={['#000000', '#ABB8C3', '#EB144C', '#FCCB00', '#FF8A65', '#795548', '#5300EB']} onChangeComplete={ handleContourLineColor } />
      <br></br>
      Labels (index contours): <Switch size="small" disabled={contourIlluminated} checked={contourLabels} onChange={handleContourLabelChange} />
      <br></br>
      Label distance: <Slider defaultValue={250} min={10} max={400} step={10} disabled={!contourLabels} onChange={contourLabelDistanceChange}/>
    </div>
  )
}

export default Contours
