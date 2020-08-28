import 'antd/dist/antd.css';
import "./Navigation.css";

import React, { useState } from "react";

import { Collapse } from 'antd';
import ColorscaleAndUrl from '../../menu/ColorscaleAndUrl'
import Contours from '../../menu/Contours'
import Hillshading from '../../menu/Hillshading'
import Multi from '../../menu/Multi'
import Transitions from '../../menu/Transitions'
import surfaceOptions from '../../menu/surfaceOptions'

const { Panel } = Collapse;

const Navigation = ({tilelayer}) => {
  const [surfaceUrl, setSurfaceUrl] = useState(`./tiles/top/topupperreek/{z}/{x}/{y}.png`);
  const [transitions, setTransitions] = useState(true);
  const [scaleMinMax, setScaleMinMax] = useState(surfaceOptions.minmax.top);
  const [transitionSurface, setTransitionSurface] = useState('pressure_20030101');
  const [showColorscalePicker, setShowColorscalePicker] = useState(false);

  function handleUrlChange(value) {
    setSurfaceUrl(surfaceOptions.urls[value]);
    setScaleMinMax(surfaceOptions.minmax[value]);
  }

  function handleSurfaceUrlChange(value) {
    setTransitionSurface(value);
    handleUrlChange(value);
  }

  function handleTransitionChange() {
    setTransitions(!transitions);
    tilelayer.updateOptions({transitions: !transitions})
  }

  function accordionCallback(key) {
    if (key !== 'colorscale') {
      setShowColorscalePicker(false);
    }
    if (key === 'transitions') {
      setTransitions(true);
      handleSurfaceUrlChange('pressure_20030101')
    }
    tilelayer.updateOptions(surfaceOptions.accordion[key])
  }

  return (
    <div id="nav">
      <Collapse accordion onChange={accordionCallback}>
        <Panel header="Colorscale" key="colorscale">
          <ColorscaleAndUrl tilelayer={tilelayer} handleUrlChange={handleUrlChange} scaleMinMax={scaleMinMax} surfaceUrl={surfaceUrl} showColorscalePicker={showColorscalePicker} setShowColorscalePicker={setShowColorscalePicker} />
        </Panel>

        <Panel header="Transitions" key="transitions">
          <Transitions tilelayer={tilelayer} transitions={transitions} handleTransitionChange={handleTransitionChange} transitionSurface={transitionSurface} handleSurfaceUrlChange={handleSurfaceUrlChange} />
        </Panel>

        <Panel header="Sentinel values" key="sentinels">
          <p>In addition to linear color scales, it's possible to specify "sentinel values," which map discrete values to colors. You can set a label for each value which will be returned in mouseEvents. The example here shows reservoir facies at a certain depth.</p>
        </Panel>

        <Panel header="Contours" key="contours">
          <Contours tilelayer={tilelayer} />
        </Panel>

        <Panel header="Diff" key="diff">
          <p>Give two tile layers as input and calculate the difference between them. Pixel values are returned for both the input layers as well as the result. Demo here is showing the pressure difference from 2000 to 2003.</p>
        </Panel>

        <Panel header="Multiple surfaces" key="multi">
          <Multi tilelayer={tilelayer} />
        </Panel>

        <Panel header="Hillshading" key="hillshading">
          <Hillshading tilelayer={tilelayer} />
        </Panel>
      </Collapse>
    </div>
  );
}

export default Navigation;
