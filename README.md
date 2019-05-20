# vitessce-grid
A simplified wrapper for [`react-grid-layout`](https://github.com/STRML/react-grid-layout#readme),
inspired by [HiGlass](http://higlass.io) viewconfigs. Features:
- Easier specification of column positions and widths.
- Grid heights and widths calculated to fill window.
- Specify the React component that should fill each pane.

## Example

For more details, see [the demo code](demo/src/renderDemo.js).
- `layout`: The layout, and the React components which should fill it.
- `getComponent`: Given a string, returns the actual React component.
- `draggableHandle`: A CSS path.
- `padding`, `margin`: Optional.
- `reactGridLayoutProps`: Pass other properties through to `react-grid-layout`.
- `onAllReady`: Called after all components have called `onReady`.

```javascript
function getComponent(name) { ... }
const responsiveLayout = {
  columns: {
    1200: [0, 5, 10, 12], ...
  },
  layout: [
    { component: 'Demo',
      props: { text: 'header' },
      x: 0, y: 0, w: 2 },
    { component: 'Demo',
      props: { text: 'sidebar' },
      x: 2, y: 0, h: 3 },
    ...
  ],
};
ReactDOM.render(
  <VitessceGrid
    layout={responsiveLayout}
    getComponent={getComponent}
    draggableHandle={`.${handleClass}`}
    padding={50}
    margin={25}
    onAllReady={onAllReady}
    reactGridLayoutProps={{ ... }}
  />,
  document.getElementById('demo'),
);
```
