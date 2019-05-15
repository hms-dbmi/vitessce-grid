import React from 'react';

import { Responsive, WidthProvider } from 'react-grid-layout';

import { makeGridLayout, range, getMaxRows } from './layoutUtils';


export function resolveLayout(layout) {
  const cols = {};
  const layouts = {};
  const breakpoints = {};
  const components = {};
  const positions = {};

  (('components' in layout) ? layout.components : layout).forEach(
    (def) => {
      const id = `r${def.x}_c${def.y}`;
      components[id] = {
        component: def.component, props: def.props || {},
      };
      positions[id] = {
        id, x: def.x, y: def.y, w: def.w, h: def.h,
      };
    },
  );

  if ('components' in layout) {
    Object.entries(layout.columns).forEach(
      ([width, columnXs]) => {
        cols[width] = columnXs[columnXs.length - 1];
        layouts[width] = makeGridLayout(columnXs, positions);
        breakpoints[width] = width;
      },
    );
  } else {
    // static layout
    const id = 'ID';
    const columnCount = 12;
    cols[id] = columnCount;
    layouts[id] = makeGridLayout(range(columnCount + 1), positions);
    breakpoints[id] = 1000;
    // Default has different numbers of columns at different widths,
    // so we do need to override that to ensure the same number of columns,
    // regardless of window width.
  }
  return {
    cols, layouts, breakpoints, components,
  };
}

export function VitessceGrid(props) {
  const {
    layout, getComponent, padding, margin, draggableHandle, reactGridLayoutProps,
  } = props;

  const ResponsiveGridLayout = WidthProvider(Responsive);

  const {
    cols, layouts, breakpoints, components,
  } = resolveLayout(layout);

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

  const layoutChildren = Object.entries(components).map(([k, v]) => {
    const Component = getComponent(v.component);
    return (
      <div key={k}>
        <Component {... v.props} />
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
        rowHeight={(window.innerHeight - 2 * padding - (maxRows - 1) * margin) / maxRows}
        containerPadding={[padding, padding]}
        margin={[margin, margin]}
        draggableHandle={draggableHandle}
        {... reactGridLayoutProps}
      >
        {layoutChildren}
      </ResponsiveGridLayout>
    </React.Fragment>
  );
}

VitessceGrid.defaultProps = {
  padding: 10,
  margin: 10,
};
