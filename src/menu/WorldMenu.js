
import { Radio, Slider, Select } from 'antd';
import React, { useState } from "react";
import Geosuggest from 'react-geosuggest';

const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
};

let mapboxToken = 'pk.eyJ1IjoiaGVyamFyIiwiYSI6ImNrZjl6MjUwYTBxeWYyeXFncHI0NjN2bngifQ.-e2mdgWyalWaosKYPzGXow';
let privateToken = '';
if (privateToken) {
  mapboxToken = privateToken;
}

const baselayerUrls = {
  colorscale: '',
  satellite: `https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.pngraw?access_token=${mapboxToken}`,
  streets: `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}?access_token=${mapboxToken}`,
  darkstreets: `https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/256/{z}/{x}/{y}?access_token=${mapboxToken}`,
  lightstreets: `https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}?access_token=${mapboxToken}`,
  outdoors: `https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token=${mapboxToken}`,
}

const WorldMenu = ({tilelayer}) => {
  const [hillshadeType, setHillshadeType] = useState('none');

  const hillshadingRadioChange = e => {
    setHillshadeType(e.target.value);
    tilelayer.updateOptions({hillshadeType: e.target.value})
  };

  function slopescaleChange(value) {
    tilelayer.updateOptions({hsSimpleSlopescale: value})
  }
  function sunAzimuthChange(value) {
    tilelayer.updateOptions({hsSimpleAzimuth: value})
  }
  function sunAltitudeChange(value) {
    tilelayer.updateOptions({hsSimpleAltitude: value})
  }
  function softShadowIterationsChange(value) {
    tilelayer.updateOptions({hsAdvSoftIterations: value})
  }
  function ambientLightingIterationsChange(value) {
    tilelayer.updateOptions({hsAdvAmbientIterations: value})
  }
  function elevationScaleChange(value) {
    tilelayer.updateOptions({hsAdvValueScale: value})
  }
  function sunRadiusChange(value) {
    tilelayer.updateOptions({hsAdvSunRadiusMultiplier: value})
  }
  function softMultiplierChange(value) {
    tilelayer.updateOptions({hsAdvFinalSoftMultiplier: value})
  }
  function ambientMultiplierChange(value) {
    tilelayer.updateOptions({hsAdvFinalAmbientMultiplier: value})
  }
  function baselayerChange(value) {
    tilelayer.updateOptions({hsAdvBaselayerUrl: baselayerUrls[value]})
  }

  function geoLocationChange(e) {
    tilelayer._map.setView({
      lat: e.location.lat,
      lng: e.location.lng},
      8
    );
  }

  return (
    <div>
      <p>
        These tiles have much better resolution than the custom layer, and makes a better demo for hillshading.
      </p>
      <b>Location:</b>
      <Geosuggest
        placeholder="Search"
        onSuggestSelect={geoLocationChange}
      />
      <b>Hillshading</b><br></br>
      <Radio.Group onChange={hillshadingRadioChange} value={hillshadeType}>
        <Radio style={radioStyle} value='none'>
          None
        </Radio>
        <Radio style={radioStyle} value='simple'>
          Simple
        </Radio>
        <Radio style={radioStyle} value='advanced'>
          Advanced
        </Radio>
      </Radio.Group>
      <br></br><br></br>
      {hillshadeType === 'simple' &&
        <div>
          <p>Simple hillshading compares the neighbour pixels in one iteration per tile. The slopescale can be used to adjust the visual height. It is much faster than advanced hillshading and gives quite good results if you have high resolution data like here.</p>
          Slopescale: <Slider defaultValue={1.0} min={0} max={10} step={0.1} onAfterChange={slopescaleChange}/>
          Sun azimuth: <Slider defaultValue={315} min={0} max={360} onAfterChange={sunAzimuthChange}/>
          Sun altitude: <Slider defaultValue={70} min={0} max={200} onAfterChange={sunAltitudeChange}/>
        </div>
      }
      {hillshadeType === 'advanced' &&
        <div>
          <p>
            Advanced hillshading requires heavy ray tracing computations. If you increase the iterations too much it <i>will</i> crash your browser. The limit will depend on your device.
            Check the <a href="https://github.com/equinor/leaflet.tilelayer.gloperations/wiki/Hillshading">wiki</a> to find out what all the options do. (Currently does not work on iOS).
           </p>
           {"Base layer: "}
           <Select defaultValue="colorscale" style={{ width: 190 }} onChange={baselayerChange}>
            <Option value="colorscale">None (colorscale)</Option>
            <Option value="streets">Streets</Option>
            <Option value="outdoors">Outdoors</Option>
            <Option value="satellite">Satellite</Option>
            <Option value="darkstreets">Dark streets</Option>
            <Option value="lightstreets">Light streets</Option>

          </Select>
          <br></br>
          Elevation scale: <Slider defaultValue={1.0} min={0} max={5.0} step={0.1} onAfterChange={elevationScaleChange}/>
          Soft shadow iterations: <Slider defaultValue={5} min={0} max={150} onAfterChange={softShadowIterationsChange}/>
          Ambient lighting iterations: <Slider defaultValue={5} min={0} max={150} onAfterChange={ambientLightingIterationsChange}/>
          Sun radius multiplier: <Slider defaultValue={100} min={0} max={1000} onAfterChange={sunRadiusChange}/>
          Soft shadow multiplier: <Slider defaultValue={1.2} min={0} max={10} step={0.05} onAfterChange={softMultiplierChange}/>
          Ambient lighting multiplier: <Slider defaultValue={0.30} min={0} max={2.0} step={0.05} onAfterChange={ambientMultiplierChange}/>
        </div>
      }
    </div>
  )
}

export default WorldMenu
