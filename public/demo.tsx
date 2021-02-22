import React from "react";
import reactDom from "react-dom";
import { HtmlInIframe } from "../src";
// @ts-ignore
import myUnsafeHtml from "./unsafeHtml.html";
// @ts-ignore
import externalHtml from "./externalHtml.html";

const customcss = `
    body {
    font-family: sans-serif;
    }
`;

reactDom.render(
  <div>
    <h2>here's a normal iframe</h2>
    <iframe src={"data:text/html," + myUnsafeHtml} />
    <h2>here's our fancy iframe</h2>
    <HtmlInIframe unsafeHtml={externalHtml} customStyle={customcss as any} />
  </div>,
  document.getElementById("app")
);
