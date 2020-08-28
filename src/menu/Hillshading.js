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
    if (e.target.value === 'simple') {
      setHillshadeSlopescaleDisabled(false);
    } else {
      setHillshadeSlopescaleDisabled(true);
    }
    tilelayer.updateOptions({hillshadeType: e.target.value})
  };

  function slopescaleChange(value) {
    tilelayer.updateOptions({hsSimpleSlopescale: value})
  }

  return (
    <div>
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
    </div>
  )
}

export default Hillshading
