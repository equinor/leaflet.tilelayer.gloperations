import React, { useState, useEffect } from "react";
import { Collapse, Select, Radio, Slider, Switch, Input } from 'antd';
import 'antd/dist/antd.css';
import { Colorscale } from './react-colorscales';
import ColorscalePicker from './react-colorscales';
import { DEFAULT_SCALE } from "./react-colorscales/components/constants";
import { GithubPicker } from 'react-color';

const { Panel } = Collapse;
const { Option, OptGroup } = Select;


let surfaceMinMax = {
  top: [1600, 1800],
  oil_20000101: [0, 3],
  oil_20030101: [0, 3],
  poro: [0, 0.25],
  permx: [0, 3000],
  iso: [0, 3],
  pressure_20000101: [265, 310],
  pressure_20030101: [265, 310],
  stoiip: [0, 3],
}

let surfaceUrls = {
  top: './tiles/top/topupperreek/{z}/{x}/{y}.png',
  oil_20000101: './tiles/oil-thickness/20000101/{z}/{x}/{y}.png',
  oil_20030101: './tiles/oil-thickness/20030101/{z}/{x}/{y}.png',
  pressure_20000101: './tiles/pressure/20000101/{z}/{x}/{y}.png',
  pressure_20030101: './tiles/pressure/20030101/{z}/{x}/{y}.png',
  poro: './tiles/poro/none/{z}/{x}/{y}.png',
  permx: './tiles/permx/none/{z}/{x}/{y}.png',
  iso: './tiles/iso/upperreek/{z}/{x}/{y}.png',
  stoiip: './tiles/stoiip/upperreek/{z}/{x}/{y}.png',
}

import "./Navigation.css";

let optionsColorscale = {
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
  sentinelValues: [],
  extraPixelLayers: 0,
  hillshadeType: 'none',
  glOperation: 'none',
  contourType: 'none',
  transitions: false,
}
let optionsSentinels = {
  url: './tiles/facies/none/{z}/{x}/{y}.png',
  colorScale: [],
  sentinelValues: [
    {color: "rgb(35, 170, 143)", offset: 1, label: 'Background' },
    {color: "rgb(250, 250, 110)", offset: 2, label: 'Channel' },
    {color: "rgb(42, 72, 88)", offset: 3, label: 'Crevasse' },
  ],
  extraPixelLayers: 0,
  hillshadeType: 'none',
  glOperation: 'none',
  contourType: 'none',
  transitions: false,
}
let optionsTransitions = {
  url: './tiles/pressure/20030101/{z}/{x}/{y}.png',
  colorScale: [
    {color: "rgb(250, 250, 110)", offset: 265},
    {color: "rgb(189, 234, 117)", offset: 270.625},
    {color: "rgb(134, 215, 128)", offset: 276.25},
    {color: "rgb(84, 193, 138)", offset: 281.875},
    {color: "rgb(35, 170, 143)", offset: 287.5},
    {color: "rgb(0, 145, 141)", offset: 293.125},
    {color: "rgb(0, 120, 130)", offset: 298.75},
    {color: "rgb(31, 95, 112)", offset: 304.375},
    {color: "rgb(42, 72, 88)", offset: 310},
  ],
  sentinelValues: [],
  extraPixelLayers: 0,
  hillshadeType: 'none',
  glOperation: 'none',
  contourType: 'none',
  transitions: true,
  transitionTimeMs: 1500,
}
let optionsHillshading = {
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
  sentinelValues: [],
  extraPixelLayers: 0,
  hillshadeType: 'pregen',
  hsElevationScale: 1,
  hsPregenUrl: './tiles/hillshade/top/topupperreek/{z}/{x}/{y}.png',
  hsSimpleSlopescale: 5,
  hsSimpleZoomdelta: 10,
  glOperation: 'none',
  contourType: 'none',
  transitions: false,
}
let optionsContours = {
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
  sentinelValues: [],
  extraPixelLayers: 0,
  hillshadeType: 'none',
  glOperation: 'none',
  contourType: 'lines',
  contourScaleFactor: -1,
  contourInterval: 10,
  // contourIndexInterval: 100,
  // contourLineColor: '#000000',
  // contourLineWeight: 0.5,
  contourLineIndexWeight: 2.5,
  contourSmoothInput: true,
  contourSmoothInputKernel: 15,
  // contourLabelDistance: 250,
  contourHypsoColors: ["#dddddd", "#e5d9c9" ,"#486341"],
  contourHypsoDomain: [-1450, -1550, -1700],
  contourBathyDomain: [-2000, -1700],
  // contourIndexLabels: false,
  // contourHypso: false,
  // contourBathy: false,
  transitions: false,
}
let optionsMulti = {
  url: '',
  operationUrlA: './tiles/oil-thickness/20030101/{z}/{x}/{y}.png',
  operationUrlB: './tiles/stoiip/upperreek/{z}/{x}/{y}.png',
  operationUrlC: './tiles/poro/none/{z}/{x}/{y}.png',
  operationUrlD: './tiles/permx/none/{z}/{x}/{y}.png',
  filterLowA: 0,
  filterHighA: 5.7,
  filterLowB: 0,
  filterHighB: 3.75,
  filterLowC: 0,
  filterHighC: 0.35,
  filterLowD: 0,
  filterHighD: 6700,
  multiplierA: 1,
  multiplierB: 1,
  multiplierC: 1,
  multiplierD: 1,
  colorScale: [
    {color: "rgb(194, 4, 36)", offset: 0},
    {color: "rgb(255, 255, 191)", offset: 5},
    {color: "rgb(222, 100, 175)", offset: 50},
    {color: "rgb(132, 54, 168)",  offset: 500},
    {color: "rgb(255, 0, 0)", offset: 5000},
  ],
  sentinelValues: [],
  hillshadeType: 'none',
  glOperation: 'multi',
  multiLayers: 4,
  extraPixelLayers: 4,
  contourType: 'none',
  transitions: false,
}
let optionsDiff = {
  url: '',
  operationUrlA: './tiles/pressure/20000101/{z}/{x}/{y}.png',
  operationUrlB: './tiles/pressure/20030101/{z}/{x}/{y}.png',
  colorScale: [
    {color: "rgb(194, 4, 36)", offset: -40},
    {color: "rgb(255, 255, 191)", offset: -30},
    {color: "rgb(222, 100, 175)", offset: -20},
    {color: "rgb(132, 54, 168)",  offset: -10},
    {color: "rgb(132, 54, 168)", offset: 0},
  ],
  sentinelValues: [],
  hillshadeType: 'none',
  glOperation: 'diff',
  extraPixelLayers: 2,
  contourType: 'none',
  transitions: false,
}

let defaultOptions = {
  colorscale: optionsColorscale,
  sentinels: optionsSentinels,
  diff: optionsDiff,
  hillshading: optionsHillshading,
  multi: optionsMulti,
  contours: optionsContours,
  transitions: optionsTransitions,
}

const Navigation = ({tileLayer}) => {
  const [colorscale, setColorscale] = useState(DEFAULT_SCALE);
  const [surfaceUrl, setSurfaceUrl] = useState(`./tiles/top/topupperreek/{z}/{x}/{y}.png`);
  const [transitions, setTransitions] = useState(true);
  const [hillshadeSlopescaleDisabled, setHillshadeSlopescaleDisabled] = useState(true);
  const [scaleMinMax, setScaleMinMax] = useState(surfaceMinMax.top);
  const [showColorscalePicker, setShowColorscalePicker] = useState(false);
  const [reverseScale, setReverseScale] = useState(false);
  const [hillshadeType, setHillshadeType] = useState('pregen');
  const [contourType, setContourType] = useState('lines');
  const [transitionSurface, setTransitionSurface] = useState('pressure_20030101');
  const [contourIlluminated, setContourIlluminated] = useState(false);
  const [contourHypsometric, setContourHypsometric] = useState(false);
  const [contourBathymetric, setContourBathymetric] = useState(false);
  const [contourLabels, setContourLabels] = useState(false);
  const [contourSmooth, setContourSmooth] = useState(true);
  const [contourLineColor, setContourLineColor] = useState('#000000');

  // Update tileLayer with new colorscale
  useEffect(() => {
    const hexToRgb = hex => {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    }

    let colorscaleUse = colorscale;
    if (reverseScale) {
      colorscaleUse = colorscaleUse.slice().reverse();
    } else {
      colorscaleUse = colorscale;
    }

    let glColorScale = [];
    let colorscaleStep = (scaleMinMax[1] - scaleMinMax[0]) / (colorscaleUse.length - 1);
    let colorscaleEntryOffset = scaleMinMax[0];

    colorscaleUse.forEach(function(hexEntry) {
      let rgb = hexToRgb(hexEntry)
      let rgbEntry = {
        color: 'rgb('+rgb.r+', '+rgb.g+', '+rgb.b+')',
        offset: colorscaleEntryOffset,
      };
      glColorScale.push(rgbEntry);

      colorscaleEntryOffset += colorscaleStep;
    });

    tileLayer.updateOptions({
      url: surfaceUrl,
      colorScale: glColorScale,
      sentinelValues: [],
    });
  },[colorscale, reverseScale, scaleMinMax]);

  function handleUrlChange(value) {
    // tileLayer.updateOptions({url: surfaceUrls[value]});
    setSurfaceUrl(surfaceUrls[value]);
    setScaleMinMax(surfaceMinMax[value]);
  }
  function handleSurfaceUrlChange(value) {
    setTransitionSurface(value);
    handleUrlChange(value);
  }
  function handleTransitionChange() {
    setTransitions(!transitions);
    tileLayer.updateOptions({transitions: !transitions})
  }
  function handleTransitionTimeChange(e) {
    tileLayer.updateOptions({transitionTimeMs: e.target.value})
  }
  function handleHypsometricChange() {
    updateHypsometricChange(!contourHypsometric);
  }
  function updateHypsometricChange(value) {
    setContourHypsometric(value);
    tileLayer.updateOptions({contourHypso: value})
  }
  function handleBathymetricChange() {
    updateBathymetricChange(!contourBathymetric);
  }
  function updateBathymetricChange(value) {
    setContourBathymetric(value);
    tileLayer.updateOptions({contourBathy: value})
  }
  function handleContourLabelChange() {
    setContourLabels(!contourLabels);
    tileLayer.updateOptions({contourIndexLabels: !contourLabels})
  }
  function handleContourSmoothChange() {
    setContourSmooth (!contourSmooth);
    tileLayer.updateOptions({contourSmoothInput: !contourSmooth})
  }
  function slopescaleChange(value) {
    tileLayer.updateOptions({hsSimpleSlopescale: value})
  }
  function contourIntervalChange(value) {
    tileLayer.updateOptions({contourInterval: parseFloat(value)})
  }
  function contourIndexIntervalChange(value) {
    tileLayer.updateOptions({contourIndexInterval: parseFloat(value)})
  }
  function contourLabelDistanceChange(value) {
    tileLayer.updateOptions({contourLabelDistance: parseFloat(value)})
  }
  function contourLineSizeChange(value) {
    tileLayer.updateOptions({contourLineWeight: parseFloat(value)})
  }
  function contourSmoothKernelChange(value) {
    tileLayer.updateOptions({contourSmoothInputKernel: parseFloat(value)})
  }
  function contourLineIndexSizeChange(value) {
    tileLayer.updateOptions({contourLineIndexWeight: parseFloat(value)})
  }
  function accordionCallback(key) {
    if (key !== 'colorscale') {
      setShowColorscalePicker(false);
    }
    if (key === 'transitions') {
      setTransitions(true);
      // document.getElementById('transitionSurface').value = 'pressure_20030101';
      handleSurfaceUrlChange('pressure_20030101')
    }
    tileLayer.updateOptions(defaultOptions[key])
  }
  const hillshadingRadioChange = e => {
    setHillshadeType(e.target.value);
    if (e.target.value === 'simple') {
      setHillshadeSlopescaleDisabled(false);
    } else {
      setHillshadeSlopescaleDisabled(true);
    }
    tileLayer.updateOptions({hillshadeType: e.target.value})
  };
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
    tileLayer.updateOptions({contourType: e.target.value})
  };
  function handleContourLineColor(color) {
    setContourLineColor(color.hex);
    tileLayer.updateOptions({contourLineColor: color.hex})
  }
  const onMultiOilChange = (value) => {
    tileLayer.updateOptions({
      filterLowA: value[0],
      filterHighA: value[1]
    })
  }
  const onMultiStoiipChange = (value) => {
    tileLayer.updateOptions({
      filterLowB: value[0],
      filterHighB: value[1]
    })
  }
  const onMultiPoroChange = (value) => {
    tileLayer.updateOptions({
      filterLowC: value[0],
      filterHighC: value[1]
    })
  }
  const onMultiPermChange = (value) => {
    tileLayer.updateOptions({
      filterLowD: value[0],
      filterHighD: value[1]
    })
  }
  const toggleColorscalePicker = () => { setShowColorscalePicker(!showColorscalePicker)};
  const toggleReverseScale = () => { setReverseScale(!reverseScale)};
  const onColorscaleChange = colorscale => {
    setColorscale(colorscale);
  }

  let toggleButtonStyle = {};
  if (showColorscalePicker) {
    toggleButtonStyle = { borderColor: "#A2B1C6" };
  }

  const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
  };

  return (
    <div>
      <div style={{margin: 5}}><span className='title'><a href="https://github.com/equinor/leaflet.tilelayer.gloperations">{`Leaflet.TileLayer.GLOperations demo`}</a></span></div>
      <Collapse accordion onChange={accordionCallback}>
        <Panel header="Colorscale" key="colorscale">
          <p>Basic usage. Change the tileUrl and the colorscale.</p>
          <span className="subHeader">Select surface:</span>
          <Select defaultValue="top" style={{ width: 200 }} onChange={handleUrlChange}>
            <Option value="top">Top reservoir</Option>
            <Option value="permx">Permeability</Option>
            <Option value="poro">Porosity</Option>
            <Option value="iso">Isochore</Option>
            <Option value="stoiip">STOIIP</Option>
            <OptGroup label="Oil-thickness">
              <Option value="oil_20000101">2000</Option>
              <Option value="oil_20030101">2003</Option>
            </OptGroup>
            <OptGroup label="Pressure">
              <Option value="pressure_20000101">2000</Option>
              <Option value="pressure_20030101">2003</Option>
            </OptGroup>
          </Select>
          <br></br><br></br>
          <span className="subHeader">Select colorscale:</span>
          <div id="colorscaleReverse" style={{marginTop: '7px'}}>
          <span className="textLabel select-text" style={{marginLeft: '10px'}}>
              Reverse colorscale:{' '}
          </span>
          <input
            className="scaleFilter spaceRightp alignMiddle"
            style={{
              verticalAlign: 'middle',
              textAlign: 'middle'
            }}
            type="checkbox"
            name="{inputReverseScale}"
            value={`${reverseScale}`}
            onChange={toggleReverseScale}
          />
        </div>
          <div
            onClick={toggleColorscalePicker}
            className="toggleButton"
            style={toggleButtonStyle}
          >
            <Colorscale
              colorscale={colorscale}
              onClick={() => {}}
              maxWidth={255}
            />
          </div>
          {showColorscalePicker && (
            <ColorscalePicker
              onChange={onColorscaleChange}
              colorscale={colorscale}
              width={282}
              fixSwatches={true}
              disableSwatchControls={false}
              nSwatches={16}
              scaleLength={5}
            />
          )}
        </Panel>
        <Panel header="Sentinel values" key="sentinels">
            <p>In addition to linear color scales, it's possible to specify "sentinel values," which map discrete values to colors. You can set a label for each value which will be returned in mouseEvents. The example here shows reservoir facies at a certain depth.</p>
        </Panel>
        <Panel header="Transitions" key="transitions">
          <p>{'This tile layer supports animated transitions when changing either the URL or the color scale. You can specify the transition time (in milliseconds) with the Options property transitionTimeMs. If you do not want transitions, you can turn them off by setting { transitions: false } in the Options object. Transitions are currently only implemented with glOperation="none".'}</p>
          Select surface:
          <Select id="transitionSurface" defaultValue="pressure_20030101" value={transitionSurface} style={{ width: 200 }} onChange={handleSurfaceUrlChange}>
            <OptGroup label="Pressure">
              <Option value="pressure_20000101">2000</Option>
              <Option value="pressure_20030101">2003</Option>
            </OptGroup>
          </Select>
          <br></br><br></br>
          Transitions: <Switch size="small" checked={transitions} onChange={handleTransitionChange} />
          <br></br>
          Transition time: <Input style={{ width: '85px' }} size="small" step={100} type={`number`} defaultValue="1500" disabled={!transitions} onChange={handleTransitionTimeChange} /> ms
        </Panel>
        <Panel header="Contours" key="contours">
          <p>{`Contours is a work in progress. It is not using WebGL and the tiles have to be merged to a single canvas before calculating contours. This means it is slower than the other operations of this plugin. Contours are currently only implemented with glOperation="none". Labels are only implemented for contourType='lines'. Index interval needs to be a multiple of countour interval.`}</p>
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
          Countour interval:
          <Slider defaultValue={10} min={5} max={250} step={5} onAfterChange={contourIntervalChange}/>
          Index interval:
          <Slider defaultValue={100} min={0} max={200} step={5} disabled={contourIlluminated} onAfterChange={contourIndexIntervalChange}/>
          {/* Smooth contours: <Switch size="small" checked={contourSmooth} onChange={handleContourSmoothChange} />*/}
          Countour line size:
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
        </Panel>
        <Panel header="Diff" key="diff">
          <p>Give two tile layers as input and calculate the difference between them. Pixel values are returned for both the input layers as well as the result. Demo here is showing the pressure difference from 2000 to 2003.</p>
        </Panel>
        <Panel header="Multiple surfaces" key="multi">
            <p>{`Do operations on multiple layers. High/low filter for each surface, and optionally multiply each layer with a value (after filtering). The result is then calculated after filtering with: Layer1*Mult1 + Layer2*Mult2... Using mult=1 for all layers here. MouseEvents can return the result as well as values from all the input layers.`}</p>
            Oil-thickness: <Slider range defaultValue={[0, 5.8]} step={0.1} min={0} max={5.8} onAfterChange={onMultiOilChange}/>
            <br></br>
            STOIIP: <Slider range defaultValue={[0, 3.75]} step={0.05} min={0} max={3.75} onAfterChange={onMultiStoiipChange}/>
            <br></br>
            Porosity: <Slider range defaultValue={[0, 0.35]} step={0.01} min={0} max={0.35} onAfterChange={onMultiPoroChange}/>
            <br></br>
            Permeability: <Slider range defaultValue={[0, 6700]} step={100} min={0} max={6700} onAfterChange={onMultiPermChange}/>
        </Panel>
        <Panel header="Hillshading" key="hillshading">
            <p>Hillshading on-the-fly or from pre-generated tiles. Hillshading is currently only implemented with glOperation="none". The surfaces are from a reservoir model, so resolution is much lower than normal map tiles, hence the "jagged" edges. On-the-fly hillshading is a work in progress.</p>
            <Radio.Group onChange={hillshadingRadioChange} value={hillshadeType}>
              <Radio style={radioStyle} value='none'>
                None
              </Radio>
              <Radio style={radioStyle} value='simple'>
                On-the-fly
              </Radio>
              <Radio style={radioStyle} value='pregen'>
                Pre-generated
              </Radio>
            </Radio.Group>
            <br></br><br></br>
            Slopescale: <Slider defaultValue={5} min={0} max={10} disabled={hillshadeSlopescaleDisabled} onChange={slopescaleChange}/>
        </Panel>
      </Collapse>
    </div>
  );
}

export default Navigation;