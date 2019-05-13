import React from 'react';
import ReactDOM from 'react-dom';

import './css/index.css';
import '../node_modules/react-grid-layout/css/styles.css';
import '../node_modules/react-resizable/css/styles.css';

import { VitessceGrid } from './VitessceGrid';

function renderComponent(react, id) {
  ReactDOM.render(react, document.getElementById(id));
}

export default function renderDemo(id) {
  const config = {
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
      { component: 'Demo',
        props: { title: 'header' },
        x: 0, y: 0, w: 2 },
      { component: 'Demo',
        props: { title: 'body, left' },
        x: 0, y: 1, h: 2 },
      { component: 'Demo',
        props: { title: 'body, right' },
        x: 1, y: 1, h: 2 },
      { component: 'Demo',
        props: { title: 'sidebar' },
        x: 2, y: 0, h: 3 },
      { component: 'Demo',
        props: { title: 'footer' },
        x: 0, y: 3, w: 4 },
    ]
  };
  ReactDOM.render(
    <VitessceGrid {...config} />,
    document.getElementById(id)
  );
}
