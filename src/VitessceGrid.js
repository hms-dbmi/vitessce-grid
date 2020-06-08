import React, { useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { getMaxRows, resolveLayout } from './layoutUtils';

const ResponsiveGridLayout = WidthProvider(Responsive);

export default function VitessceGrid(props) {
  const {
    layout, getComponent, padding, margin, draggableHandle,
    reactGridLayoutProps, onAllReady, rowHeight, theme,
  } = props;
  const {
    cols, layouts, breakpoints, components,
  } = resolveLayout(layout);

  // eslint-disable-next-line no-unused-vars
  const [_readyComponentKeys, setReadyComponentKeys] = useState(new Set());
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
          // The sets are now equal.
          onAllReady();
        }
        return prevReadyComponentKeys;
      });
    };

    const removeGridComponent = () => {
      const newGridComponents = { ...gridComponents };
      delete newGridComponents[k];
      setGridComponents(newGridComponents);
    };

    return (
      <div key={k}>
        <Component
          {... v.props}
          theme={theme}
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
}

VitessceGrid.defaultProps = {
  padding: 10,
  margin: 10,
  onAllReady: () => {},
};
