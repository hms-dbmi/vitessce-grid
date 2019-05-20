import React from 'react';

import { Responsive, WidthProvider } from 'react-grid-layout';

import { getMaxRows, resolveLayout } from './layoutUtils';


export default function VitessceGrid(props) {
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
