import 'antd/dist/antd.css';
import './App.css';

import React, {useState} from 'react';
import { Radio } from 'antd';

import { Map } from '../Map'
import { NavigationCustomLayer } from '../NavigationCustomLayer'
import { NavigationWorldLayer } from '../NavigationWorldLayer'
import useEventListener from '@use-it/event-listener';

const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
};

function App() {
  const [layerType, setLayerType] = useState('custom');
  const [tilelayer, setTilelayer] = useState(null);
  const [burgerEl, setBurgerEl] = useState(null);

  function layerChange(e) {
    setTilelayer(null);
    setLayerType(e.target.value);
  }

  useEventListener('click', e => document.getElementById("nav").classList.toggle('menuClosed'), burgerEl);

  return (
    <div id="container">
      <div id="topbar">
        <div style={{display: 'inline-block', marginLeft: 10}}>
          <div id="burger" style={{display: 'inline-block', height: 16, width: 16}} ref={el => setBurgerEl(el)}></div>
          <div style={{display: 'inline', margin: 5, marginLeft: 20}}>
            <span className='title'><a href="https://github.com/equinor/leaflet.tilelayer.gloperations">Leaflet.TileLayer.GLOperations demo</a></span>
          </div>
        </div>
      </div>

      <div id="nav">
        <div style={{marginLeft: 20}}>
          <Radio.Group onChange={layerChange} value={layerType}>
            <Radio style={radioStyle} value='custom'>
            Custom tiles
            </Radio>
            <Radio style={radioStyle} value='world'>
            World map
            </Radio>
          </Radio.Group>
        </div>
        <hr style={{marginBottom: 0}}></hr>
        {(layerType === 'custom' && tilelayer !== null) &&
          <NavigationCustomLayer tilelayer={tilelayer}/>
        }
        {(layerType === 'world' && tilelayer !== null) &&
          <NavigationWorldLayer tilelayer={tilelayer}/>
        }
      </div>

      {layerType === 'custom' &&
        <Map setTilelayer={setTilelayer} mapType={layerType} />
      }
      {layerType === 'world' &&
        <Map setTilelayer={setTilelayer} mapType={layerType} />
      }
    </div>
  );
}

export default App;
