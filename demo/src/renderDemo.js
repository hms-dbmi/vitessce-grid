import React from 'react';
import ReactDOM from 'react-dom';

import '../../node_modules/react-grid-layout/css/styles.css';
import '../../node_modules/react-resizable/css/styles.css';
import './index.css';

import VitessceGrid from '../../src';
// If you've installed from NPM, use "from 'vitessce-grid'" instead.

import layout from './layout.json';

const handleClass = 'demo-handle';

function Block(props) {
  const { text } = props;
  return (
    <div style={{ height: '100%', width: '100%', border: '2px solid black' }}>
      <div className={handleClass}>drag-me</div>
      <div>{text}</div>
    </div>
  );
}

const registry = {
  Block,
};

function getComponent(name) {
  return registry[name];
}

export default function renderDemo(id) {
  ReactDOM.render(
    <VitessceGrid
      layout={layout}
      getComponent={getComponent}
      draggableHandle={`.${handleClass}`}
      padding={50}
      margin={25}
    />,
    document.getElementById(id),
  );
}
