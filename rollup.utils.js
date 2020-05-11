import { makeHtmlAttributes } from '@rollup/plugin-html';

export function htmlFromTemplate({ attributes, files, publicPath, title }) {
  const scripts = (files.js || [])
    .map(({ fileName }) => {
      const attrs = makeHtmlAttributes(attributes.script);
      return `<script src="${publicPath}${fileName}"${attrs}></script>`;
    })
    .join('\n');

  const links = (files.css || [])
    .map(({ fileName }) => {
      const attrs = makeHtmlAttributes(attributes.link);
      return `<link href="${publicPath}${fileName}" rel="stylesheet"${attrs}>`;
    })
    .join('\n');

  return `<!DOCTYPE html>
<html ${attributes}>
  <head>
    <meta charset="utf-8">
    <title>${title}</title>
    ${links}
  </head>
  <body>
    <div id="demo"></div>
    <noscript>
    You need to enable JavaScript to run this app.
    </noscript>
    ${scripts}
  </body>
</html>`;
}