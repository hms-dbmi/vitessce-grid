import React, { useState } from 'react';

import { Responsive, WidthProvider } from 'react-grid-layout';

import { getMaxRows, resolveLayout } from './layoutUtils';

function shallowEqual(objA, objB) {
  // Taken from "shallowequal" on NPM, with modifications.
  if (objA === objB) {
    return true;
  }
  if (typeof objA !== 'object' || !objA || typeof objB !== 'object' || !objB) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) {
    return false;
  }

  for (const key of keysA) { // eslint-disable-line no-restricted-syntax
    if (!Object.prototype.hasOwnProperty.call(objB, key)) {
      return false;
    }
    if (key === 'onAllReady') {
      return true;
      // TODO: We were stuck in an infinite loop because the fuctions were not equal.
      // This is a hack.
    }

    const valueA = objA[key];
    const valueB = objB[key];

    if (valueA !== valueB) {
      return false;
    }
  }

  return true;
}

const VitessceGridComponent = ({
  k, v, Component, onReady, removeGridComponent,
}) => (
  <div key={k}>
    <Component
      {... v.props}
      clearComponent={removeGridComponent}
      onReady={onReady}
    />
  </div>
);

const VitessceGrid = (props) => {
  const {
    layout, getComponent, padding, margin, draggableHandle,
    reactGridLayoutProps, onAllReady, rowHeight,
  } = props;
  const ResponsiveGridLayout = WidthProvider(Responsive);
  const {
    cols, layouts, breakpoints, components,
  } = resolveLayout(layout);

  // eslint-disable-next-line no-unused-vars
  const [readyComponentKeys, setReadyComponentKeys] = useState(new Set());
  const [gridComponents, setGridComponents] = useState(components);

  // Inline CSS is generally avoided, but this saves the end-user a little work,
  // and prevents class names from getting out of sync.
  const style = (
    <style>
      {`
          ${draggableHandle} {
            cursor: grab;
          }
          ${draggableHandle}:active {
            cursor: grabbing;
          }
          `}
    </style>
  );

  const layoutChildren = Object.entries(gridComponents).map(([k, v]) => {
    const Component = getComponent(v.component);
    const onReady = () => {
      setReadyComponentKeys((prevReadyComponentKeys) => {
        prevReadyComponentKeys.add(k);
        if (prevReadyComponentKeys.size === Object.keys(gridComponents).length) {
          // The sets are now equal
          onAllReady();
        }
        return prevReadyComponentKeys;
      });
    };

    const removeGridComponent = () => {
      const { [k]: _, ...newGridComponents } = gridComponents;
      setGridComponents(newGridComponents);
    };

    return VitessceGridComponent({
      k, v, Component, onReady, removeGridComponent,
    });
  });

  const maxRows = getMaxRows(layouts);
  return (
    <React.Fragment>
      {style}
      <ResponsiveGridLayout
        className="layout"
        cols={cols}
        layouts={layouts}
        breakpoints={breakpoints}
        rowHeight={
          rowHeight
          || (
            (window.innerHeight - 2 * padding - (maxRows - 1) * margin)
            / maxRows
          )}
        containerPadding={[padding, padding]}
        margin={[margin, margin]}
        draggableHandle={draggableHandle}
        {... reactGridLayoutProps}
      >
        {layoutChildren}
      </ResponsiveGridLayout>
    </React.Fragment>
  );
};

VitessceGrid.defaultProps = {
  padding: 10,
  margin: 10,
  onAllReady: () => {},
};

export default React.memo(VitessceGrid, !shallowEqual);
