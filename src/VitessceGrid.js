import React, { useState } from 'react';

import { Responsive, WidthProvider } from 'react-grid-layout';

import { getMaxRows, resolveLayout } from './layoutUtils';

// function shallowEqual(objA, objB) {
//   // Taken from "shallowequal" on NPM, with modifications.
//   if (objA === objB) {
//     return true;
//   }
//   if (typeof objA !== 'object' || !objA || typeof objB !== 'object' || !objB) {
//     return false;
//   }
//
//   const keysA = Object.keys(objA);
//   const keysB = Object.keys(objB);
//   if (keysA.length !== keysB.length) {
//     return false;
//   }
//
//   keysA.forEach((key) => { // eslint-disable-line consistent-return
//     if (!Object.prototype.hasOwnProperty.call(objB, key)) {
//       return false;
//     }
//     if (key === 'onAllReady') {
//       return true;
//       // TODO: We were stuck in an infinite loop because the fuctions were not equal.
//       // This is a hack.
//     }
//
//     const valueA = objA[key];
//     const valueB = objB[key];
//
//     if (valueA !== valueB) {
//       return false;
//     }
//   });
//
//   return true;
// }

export default function VitessceGrid(props) {
  const {
    layout, getComponent, padding, margin, draggableHandle,
    reactGridLayoutProps, onAllReady, rowHeight,
  } = props;
  const ResponsiveGridLayout = WidthProvider(Responsive);
  const {
    cols, layouts, breakpoints, components,
  } = resolveLayout(layout);

  const readyComponentKeys = new Set(); // only created when props change due to React.Memo
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
    console.log('layoutChildren', k, v);
    const Component = getComponent(v.component);
    const onReady = () => {
      readyComponentKeys.add(k);
      if (readyComponentKeys === Object.keys(gridComponents).length) {
        // The sets are now equal
        onAllReady();
      }
    };

    const removeGridComponent = () => {
      // delete gridComponents[k];
      // setGridComponents(gridComponents);
      const newGridComponents = { ...gridComponents };
      delete newGridComponents[k];
      setGridComponents(newGridComponents);
    };

    return (
      <div key={k}>
        <Component
          {... v.props}
          removeGridComponent={removeGridComponent}
          onReady={onReady}
        />
      </div>
    );
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

// export default React.memo(
//   VitessceGrid,
//   (prevProps, nextProps) => !shallowEqual(prevProps, nextProps),
// );
