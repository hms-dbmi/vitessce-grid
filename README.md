# vitessce-grid
A simplified wrapper for react-grid-layout

- `layout`:
  - `columns`: Provides breakpoints and relative column widths
  - `layout`: An array of objects having these properties:
    - `component`: Name of component
    - `props`: React props
    - `x`, `y`: Required position
    - `w`, `h`: Optional width and height
- `getComponent`: Given a string, returns the actual React component.
- `draggableHandle`: A CSS path
- `padding`, `margin`: Optional


```javascript
const responsiveLayout = {
  columns: {
    1200: [0, 5, 10, 12],
    600: [0, 2, 4, 8],
  },
  layout: [
    { component: 'Demo',
      props: { text: 'header' },
      x: 0, y: 0, w: 2 },
    { component: 'Demo',
      props: { text: 'sidebar' },
      x: 2, y: 0, h: 3 },
    { component: 'Demo',
      props: { text: 'footer' },
      x: 0, y: 3, w: 3 },
  ],
};
ReactDOM.render(
  <VitessceGrid
    layout={responsiveLayout}
    getComponent={getComponent}
    draggableHandle={`.${handleClass}`}
    padding={50}
    margin={25}
  />,
  document.getElementById('demo'),
);
```
