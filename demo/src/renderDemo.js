import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
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
  const { text, onReady, removeGridComponent } = props;
  const onReadyCallback = useCallback(onReady, []);
  useEffect(() => {
    onReadyCallback();
  }, [onReadyCallback]);
  /*
    onReady is useful when we want the VitessceGrid parent to be able to send
    onAllReady when the children are ready; What "ready" actually means
    will depend on your code: It could just be didComponentMount, or we might
    need to wait for outside resources.
  */
  return (
    /*
      You may want to use a stylesheet, but for a demo this is more clear.
    */
    <div style={{ height: '100%', width: '100%', border: '2px solid black' }}>
      <div className={handleClass}>drag-me</div>
      <div>{text}</div>
      <button type="button" onClick={() => { console.warn('removeGridComponent!'); removeGridComponent(); }}>Close</button>
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

function Demo() {
  const fixedHeight = 600;
  const [isExpanded, toggleIsExpanded] = useReducer(v => !v, true);
  return (
    <div style={(isExpanded ? { height: `${fixedHeight}px`, width: `${fixedHeight}px` } : {})}>
      <button onClick={toggleIsExpanded}>Toggle Expanded Grid</button>
      <VitessceGrid
        layout={layout}
        getComponent={getComponent}
        draggableHandle={`.${handleClass}`}
        padding={50}
        height={isExpanded}
        rowHeight={(isExpanded ? fixedHeight/4 : undefined)} /* If undefined, will fill window height. */
        margin={25}
        onAllReady={() => {
          console.warn('onAllReady!');
        }}
        reactGridLayoutProps={{
          /*
            Use this to pass through to react-grid-layout.
            See https://github.com/STRML/react-grid-layout#grid-layout-props
          */
          onDragStop: () => { console.warn('Wrapped onDragStop works!'); },
        }}
      />
    </div>
  );
}

export default function renderDemo(id) {
  ReactDOM.render(
    <Demo />,
    document.getElementById(id),
  );
}
