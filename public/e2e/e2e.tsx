import React from "react";
import reactDom from "react-dom";
import { SeamlessIframe } from "../../src/SeamlessIframe";

const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
    />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <style>
      .custom {
        color: red;
      }
    </style>
    <title>Document</title>
  </head>
  <body>
    <h1>A title</h1>
    <p>Here's some text</p>
    <p class="custom">
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci architecto consectetur cumque dolorem esse excepturi explicabo ipsam itaque laudantium maiores molestias nam natus obcaecati pariatur quae quidem, quos rerum vitae.
      <a href="https://github.com/raffaele-abramini/seamless-iframe"
        >and a link</a
      >.
    </p>
    <ul>
      <li>1</li>
      <li>2</li>
      <li>3</li>
      <li>4</li>
      <li>5</li>
    </ul>
  </body>
</html>
`;

const customCss = `
  body {
    margin: 0;
    padding: 0;
    color: slategray;
`;

const isSectionVisible = (section: string) =>
  window.location.pathname.match(new RegExp(`section/${section}[?/]?$|^/$`));

const visibleSections = {
  default: isSectionVisible("default"),
  ignoreParentStyles: isSectionVisible("ignoreParentStyles"),
  customScript: isSectionVisible("customScript"),
};

const customScript = `
  window.addEventListener("load", () => {
    const t = "<h2>programmatically injected content</h2>";
    document.body.innerHTML += t;
  });
`;

reactDom.render(
  <main>
    {visibleSections.default && (
      <section data-seamless-iframe-container="">
        <SeamlessIframe sanitizedHtml={html} listenToLinkClicks />
      </section>
    )}
    {visibleSections.ignoreParentStyles && (
      <section data-seamless-iframe-container="">
        <SeamlessIframe
          sanitizedHtml={html}
          customStyle={customCss}
          inheritParentStyle={false}
        />
      </section>
    )}
    {visibleSections.customScript && (
      <section data-seamless-iframe-container="">
        <SeamlessIframe sanitizedHtml={html} customScript={customScript} />
      </section>
    )}
  </main>,
  document.getElementById("app")
);
