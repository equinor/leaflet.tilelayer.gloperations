import 'antd/dist/antd.css';

import { Radio, Slider } from 'antd';
import React, { useState } from "react";

const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
};

const Hillshading = ({tilelayer}) => {
  const [hillshadeType, setHillshadeType] = useState('pregen');
  const [hillshadeSlopescaleDisabled, setHillshadeSlopescaleDisabled] = useState(true);

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
    tilelayer.updateOptions({hsValueScale: value})
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

  return (
    <div>
      <p>The custom tiles used here have low resolution and will show some limitation of the hillshading. For a demo with high resolution data check out the world map.</p>
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
        <Radio style={radioStyle} value='pregen'>
          Pre-generated
        </Radio>
      </Radio.Group>
      <br></br><br></br>
      {hillshadeType === 'simple' &&
        <div>
          Slopescale: <Slider defaultValue={5} min={0} max={10} onAfterChange={slopescaleChange}/>
          Sun azimuth: <Slider defaultValue={315} min={0} max={360} onAfterChange={sunAzimuthChange}/>
          Sun altitude: <Slider defaultValue={70} min={0} max={200} onAfterChange={sunAltitudeChange}/>
        </div>
      }
      {hillshadeType === 'advanced' &&
        <div>
          <p>
            Advanced hillshading requires heavy ray tracing computations. If you increase the iterations too much it <i>will</i> crash your browser. The limit will depend on your device.
            Check the <a href="https://github.com/equinor/leaflet.tilelayer.gloperations/wiki/Hillshading">wiki</a> to find out what all the options do.
           </p>
          Elevation scale: <Slider defaultValue={-1.0} min={-5.0} max={0.0} step={0.1} onAfterChange={elevationScaleChange}/>
          Soft shadow iterations: <Slider defaultValue={10} min={0} max={150} onAfterChange={softShadowIterationsChange}/>
          Ambient lighting iterations: <Slider defaultValue={10} min={0} max={150} onAfterChange={ambientLightingIterationsChange}/>
          Sun radius multiplier: <Slider defaultValue={100} min={0} max={1000} onAfterChange={sunRadiusChange}/>
          Soft shadow multiplier: <Slider defaultValue={1.1} min={0} max={10} step={0.05} onAfterChange={softMultiplierChange}/>
          Ambient lighting multiplier: <Slider defaultValue={0.25} min={0} max={2.0} step={0.05} onAfterChange={ambientMultiplierChange}/>
        </div>
      }
    </div>
  )
}

export default Hillshading
