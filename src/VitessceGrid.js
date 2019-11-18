import React from 'react';

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

  for (let idx = 0; idx < keysA.length; idx++) { // eslint-disable-line no-plusplus
    const key = keysA[idx];
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


export default class VitessceGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = { readyComponentKeys: new Set() }; // eslint-disable-line react/no-unused-state
    // This is being used and I'm not sure why there's a linting problem.
  }

  shouldComponentUpdate(nextProps) {
    // We are ignoring state right now and only considering props.
    // State is updated as components trigger onReady...
    // but those events should not cause a re-render.
    // React docs warn:
    // > Do not rely on it to “prevent” a rendering, as this can lead to bugs.
    // so there is probably a better approach.
    return !shallowEqual(this.props, nextProps);
  }

  render() {
    const {
      layout, getComponent, padding, margin, draggableHandle,
      reactGridLayoutProps, onAllReady, rowHeight,
    } = this.props;

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
      const onReady = () => {
        this.setState((state) => {
          const { readyComponentKeys } = state;
          const newReadyComponentKeys = new Set(readyComponentKeys);
          newReadyComponentKeys.add(k);
          if (newReadyComponentKeys.size === Object.keys(components).length) {
            // The sets are now equal.
            onAllReady();
          }
          return { readyComponentKeys: newReadyComponentKeys };
        });
      };
      return (
        <div key={k}>
          <Component {... v.props} onReady={onReady} />
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
}

VitessceGrid.defaultProps = {
  padding: 10,
  margin: 10,
  onAllReady: () => {},
};
