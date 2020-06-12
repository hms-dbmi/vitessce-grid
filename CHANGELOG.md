# Changelog

## 0.0.9 - in progress
### Added
- Add a `height` prop to alert the `WidthProvider` of an updated height value.

## [0.0.8] - 2020-06-08
### Added
- Add a `theme` prop to pass a theme name to all grid components.

## [0.0.7] - 2020-05-11
### Changed
- Switched to using [Rollup](https://rollupjs.org) for bundling, to obtain more control over externalization of React and ReactDOM.
- Use `ChromeHeadless` on Travis

## [0.0.6] - 2020-02-04
### Added
- Add support for pane closing.

## [0.0.5] - 2019-11-18
### Changed
- `rowHeight` can be provided; If not present, falls back to using full window height.

## [0.0.4] - 2019-05-20
### Changed
- Comparison of the onAllReady function prop was causing an infinite loop.
For now, ignore that property when checking for updates. This is a hack.

## [0.0.3] - 2019-05-20
### Added
- onAllReady callback

## [0.0.2] - 2019-05-15
### Added
- Testing
- Pass properties through to react-grid-layout.
- Lots of comments in demo to explain features.

## [0.0.1] - 2019-05-13
### Added
- Port this reusable code from Vitessce.
