import React from 'react';
import ReactDOM from 'react-dom';

import '../../node_modules/react-grid-layout/css/styles.css';
import '../../node_modules/react-resizable/css/styles.css';
import './index.css';

import VitessceGrid from '../../src';
/*
  After installing from NPM, you'll use "from 'vitessce-grid'" instead.
*/

import layout from './layout.json';
/*
  The layout could be represented in JSON, unless you need to provide function props.
*/

const handleClass = 'demo-handle';

function Block(props) {
  const { text } = props;
  return (
    /*
      You'll may want to use a stylesheet, but for a demo this is more clear.
    */
    <div style={{ height: '100%', width: '100%', border: '2px solid black' }}>
      <div className={handleClass}>drag-me</div>
      <div>{text}</div>
    </div>
  );
}

function getComponent(name) {
  /*
    One interesting possibility here is to defer loading:
    Tree shaking might be able to reduce the size of the main download.

    registry = {
      MyComponent: React.lazy(() => import('./BloatedOptionalComponent.js')),
    }
  */
  const registry = { Block };
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
