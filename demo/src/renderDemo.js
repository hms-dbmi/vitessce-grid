import React from 'react';
import ReactDOM from 'react-dom';

import '../../node_modules/react-grid-layout/css/styles.css';
import '../../node_modules/react-resizable/css/styles.css';
import './index.css';

import { VitessceGrid } from '../../src';
// If you've installed from NPM, use "from 'vitessce-grid'" instead.

const handleClass = 'demo-handle';

function Demo(props) {
  const { text } = props;
  return (
    <div style={{ height: '100%', width: '100%', border: '2px solid black' }}>
      <div className={handleClass}>drag-me</div>
      <div>{text}</div>
    </div>
  );
}

const registry = {
  Demo,
};

function getComponent(name) {
  return registry[name];
}

export default function renderDemo(id) {
  const responsiveLayout = {
    columns: {
      // First two columns are equal,
      // third column is constant;
      // Grid cell width stays roughly constant,
      // but more columns are available in a wider window.
      1400: [0, 6, 12, 14],
      1200: [0, 5, 10, 12],
      1000: [0, 4, 8, 10],
      800: [0, 3, 6, 8],
      600: [0, 2, 4, 8],
    },
    layout: [
      /* eslint-disable object-curly-newline */
      /* eslint-disable object-property-newline */
      { component: 'Demo',
        props: { text: 'header' },
        x: 0, y: 0, w: 2 },
      { component: 'Demo',
        props: { text: 'body, left' },
        x: 0, y: 1, h: 2 },
      { component: 'Demo',
        props: { text: 'body, right' },
        x: 1, y: 1, h: 2 },
      { component: 'Demo',
        props: { text: 'sidebar' },
        x: 2, y: 0, h: 3 },
      { component: 'Demo',
        props: { text: 'footer' },
        x: 0, y: 3, w: 3 },
      /* eslint-enable */
    ],
  };
  ReactDOM.render(
    <VitessceGrid
      layout={responsiveLayout}
      getComponent={getComponent}
      draggableHandle={`.${handleClass}`}
      padding={50}
      margin={25}
    />,
    document.getElementById(id),
  );
}
