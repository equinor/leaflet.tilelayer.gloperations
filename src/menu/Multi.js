import 'antd/dist/antd.css';

import React from 'react'
import { Slider } from 'antd';

const Multi = ({tilelayer}) => {

  const onMultiOilChange = (value) => {
    tilelayer.updateOptions({
      filterLowA: value[0],
      filterHighA: value[1]
    })
  }
  const onMultiStoiipChange = (value) => {
    tilelayer.updateOptions({
      filterLowB: value[0],
      filterHighB: value[1]
    })
  }
  const onMultiPoroChange = (value) => {
    tilelayer.updateOptions({
      filterLowC: value[0],
      filterHighC: value[1]
    })
  }
  const onMultiPermChange = (value) => {
    tilelayer.updateOptions({
      filterLowD: value[0],
      filterHighD: value[1]
    })
  }

  return (
    <div>
      <p>{`Do operations on multiple layers. High/low filter for each surface, and optionally multiply each layer with a value (after filtering). The result is then calculated after filtering with: Layer1*Mult1 + Layer2*Mult2... Using mult=1 for all layers here. MouseEvents can return the result as well as values from all the input layers.`}</p>
      Oil-thickness: <Slider range defaultValue={[0, 5.8]} step={0.1} min={0} max={5.8} onAfterChange={onMultiOilChange}/>
      <br></br>
      STOIIP: <Slider range defaultValue={[0, 3.75]} step={0.05} min={0} max={3.75} onAfterChange={onMultiStoiipChange}/>
      <br></br>
      Porosity: <Slider range defaultValue={[0, 0.35]} step={0.01} min={0} max={0.35} onAfterChange={onMultiPoroChange}/>
      <br></br>
      Permeability: <Slider range defaultValue={[0, 6700]} step={100} min={0} max={6700} onAfterChange={onMultiPermChange}/>
    </div>
  )
}

export default Multi
