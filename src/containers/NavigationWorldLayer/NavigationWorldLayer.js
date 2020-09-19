import 'antd/dist/antd.css';
import "./NavigationWorldLayer.css";

import React from "react";

import WorldMenu from '../../menu/WorldMenu'

const NavigationWorldLayer = ({tilelayer}) => {
  return (
    <div id="navWorld">
      <WorldMenu tilelayer={tilelayer} />
    </div>
  );
}

export default NavigationWorldLayer;
