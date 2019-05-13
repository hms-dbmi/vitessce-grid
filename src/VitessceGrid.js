import React, { Suspense } from 'react';

import { Responsive, WidthProvider } from 'react-grid-layout';

import { getComponent } from './componentRegistry';
import { makeGridLayout, range, getMaxRows } from './layoutUtils';


export function resolveLayout(layout) {
  const cols = {};
  const layouts = {};
  const breakpoints = {};
  const components = {};
  const positions = {};

  (('layout' in layout) ? layout.layout : layout).forEach(
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

  if ('layout' in layout) {
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
    layers, responsiveLayout, staticLayout,
  } = props;

  const ResponsiveGridLayout = WidthProvider(Responsive);

  const {
    cols, layouts, breakpoints, components,
  } = resolveLayout(responsiveLayout || staticLayout);

  const layoutChildren = Object.entries(components).map(([k, v]) => {
    const Component = getComponent(v.component);
    const styleLinks = (v.stylesheets || []).map(url => <link rel="stylesheet" href={url} />);
    return (
      <div key={k}>
        {styleLinks}
        <Suspense fallback={<div>Loading...</div>}>
          <Component {... v.props} />
        </Suspense>
      </div>
    );
  });

  const maxRows = getMaxRows(layouts);
  const padding = 10;
  return (
    <ResponsiveGridLayout
      className="layout"
      cols={cols}
      layouts={layouts}
      breakpoints={breakpoints}
      rowHeight={window.innerHeight / maxRows - padding}
      containerPadding={[padding, padding]}
      draggableHandle=".title"
    >
      {layoutChildren}
    </ResponsiveGridLayout>
  );
}
