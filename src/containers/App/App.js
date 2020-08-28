import './App.css';

import React, {useState} from 'react';

import { Map } from '../Map'
import { Navigation } from '../Navigation'

function App() {
  const [tilelayer, setTilelayer] = useState(null);

  return (
    <div id="container">
      <div id="topbar">
        <div style={{display: 'inline-block', marginLeft: 10}}>
          <div id="burger" style={{display: 'inline-block', height: 16, width: 16}}></div>
          <div style={{display: 'inline', margin: 5, marginLeft: 20}}>
            <span className='title'><a href="https://github.com/equinor/leaflet.tilelayer.gloperations">Leaflet.TileLayer.GLOperations demo</a></span>
          </div>
        </div>
      </div>
  
      {tilelayer !== null &&
        <Navigation tilelayer={tilelayer}/>
      }

      <Map setTilelayer={setTilelayer} />
    </div>
  );
}

export default App;
