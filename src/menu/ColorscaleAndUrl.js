import React, { useState, useEffect } from "react";
import { Select } from 'antd';
import 'antd/dist/antd.css';
import { Colorscale } from './react-colorscales';
import ColorscalePicker from './react-colorscales';
import { DEFAULT_SCALE } from "./react-colorscales/components/constants";

const { Option, OptGroup } = Select;

const ColorscaleAndUrl = ({tilelayer, handleUrlChange, scaleMinMax, surfaceUrl, showColorscalePicker, setShowColorscalePicker}) => {
  const [colorscale, setColorscale] = useState(DEFAULT_SCALE);

  const [reverseScale, setReverseScale] = useState(false);

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

      tilelayer.updateOptions({
        url: surfaceUrl,
        colorScale: glColorScale,
        sentinelValues: [],
      });
  },[colorscale, reverseScale, scaleMinMax]);

  const onColorscaleChange = colorscale => {
    setColorscale(colorscale);
  }

  const toggleColorscalePicker = () => { setShowColorscalePicker(!showColorscalePicker)};
  const toggleReverseScale = () => { setReverseScale(!reverseScale)};

  let toggleButtonStyle = {};
  if (showColorscalePicker) {
    toggleButtonStyle = { borderColor: "#A2B1C6" };
  }

  return (
    <div>
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
          nSwatches={10}
          scaleLength={5}
        />
      )}
    </div>
  )
}

export default ColorscaleAndUrl
