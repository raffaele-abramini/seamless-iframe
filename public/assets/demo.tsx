import React, { useState } from "react";
import reactDom from "react-dom";
import { Config, sanitize } from "dompurify";
import { SeamlessIframe } from "seamless-iframe";

const c: Config = {
  FORCE_BODY: true,
};

const App = () => {
  const [content, setContent] = useState(`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
    />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Seamless Iframe - Demo</title>
    <link rel="stylesheet" href="assets/style.css" />
  </head>
  <body>   
    <h1>Hello there!</h1>
    <p>Here's some html content.</p>
    <table>
        <tr><td>1</td><td>2</td></tr>
        <tr><td>4</td><td>4</td></tr>
    </table>
    <img src="https://dummyimage.com/600x400/000/fff" alt="">
  </body>
</html>`);
  return (
    <div>
      <h1>Hey! Play around here</h1>
      <div className="two-cols">
        <div>
          <textarea
            defaultValue={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div>
          <p>
            Here's some outer content to show how <strong>seamless</strong> this
            iframe here.
          </p>
          <SeamlessIframe
            sanitizedHtml={sanitize(content, c) as string}
            customStyle={`body {margin:0;padding:0;}`}
          />
          <p>
            Here's some <i>other</i> outer content to show how{" "}
            <strong>seamless</strong> this iframe here.
          </p>
        </div>
      </div>
    </div>
  );
};

reactDom.render(<App />, document.getElementById("app"));
