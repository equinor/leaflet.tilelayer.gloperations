import React from 'react'
import { Select, Switch, Input } from 'antd';

const { Option, OptGroup } = Select;

const Transitions = ({tilelayer, transitions, handleTransitionChange, transitionSurface, handleSurfaceUrlChange}) => {
  function handleTransitionTimeChange(e) {
    tilelayer.updateOptions({transitionTimeMs: e.target.value})
  }

  return (
    <div>
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
    </div>
  )
}

export default Transitions
