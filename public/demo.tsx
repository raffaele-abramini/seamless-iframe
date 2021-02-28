import React from "react";
import reactDom from "react-dom";
import { HtmlInIframe } from "../src";
// @ts-ignore
import externalHtml from "./externalHtml.html";
// @ts-ignore
import longHtml from "./longHtml.html";
// @ts-ignore
import unsafeHtml from "./unsafeHtml.html";
// @ts-ignore
import unsafeHtml2 from "./unsafeHtml2.html";

const customCss = `
  body {
    font-family: sans-serif;
    margin: 0;
  }
`;
const visibleSections = {
  a: true,
  b: true,
  c: true,
  d: true,
};

const visibleContent = {
  original: true,
  seamless: true,
};

const [isStolen] = location?.pathname.match(/stolen/g) || [];

if (isStolen) {
  reactDom.render(
    <>
      <h1>Hi, your data COULD HAVE BEEN stolen.</h1>
      <a href="/">Go back to safety!</a>
    </>,
    document.getElementById("app")
  );
}

localStorage.setItem("secret", "mySecretCode");
document.cookie = "mySecretCookie";

if (!isStolen) {
  reactDom.render(
    <main>
      {visibleSections.a && (
        <section>
          <h2>Receive styles to match parent style</h2>
          <div className="two-cols">
            <div>
              <h3>Default iframe</h3>
              <iframe src={"data:text/html," + externalHtml} />
            </div>
            <div>
              <h3>Seamless iframe</h3>
              <HtmlInIframe unsafeHtml={externalHtml} customStyle={customCss} />

              <h4>Provided styles</h4>
              <pre>{customCss.trim()}</pre>
            </div>
          </div>
        </section>
      )}
      {visibleSections.b && (
        <section>
          <h2>Automatically resizes its height</h2>

          <div className="two-cols">
            <div>
              <h3>Default iframe</h3>
              <iframe src={"data:text/html," + longHtml} />
            </div>
            <div>
              <h3>Seamless iframe</h3>
              <HtmlInIframe
                unsafeHtml={longHtml}
                customStyle={customCss}
                debounceResize
                heightCorrection
                heightCorrectionOnResize
              />
            </div>
          </div>
        </section>
      )}
      {visibleSections.c && (
        <section>
          <h2>Prevents injected content from submitting forms</h2>
          <div className="two-cols">
            {visibleContent.original && (
              <div>
                <h3>HTML directly injected in page</h3>
                <div dangerouslySetInnerHTML={{ __html: unsafeHtml }} />
              </div>
            )}
            {visibleContent.seamless && (
              <div>
                <h3>Seamless iframe</h3>
                <HtmlInIframe unsafeHtml={unsafeHtml} customStyle={customCss} />
              </div>
            )}
          </div>
        </section>
      )}

      {visibleSections.d && (
        <section>
          <h2>
            Prevents rendered html from accessing location, cookies and storage
          </h2>
          <p>
            For this example we are storing a localStorage key of "mySecretCode"
            and a cookie of value "test"
          </p>
          <div className="two-cols">
            {visibleContent.original && (
              <div>
                <h3>HTML directly injected in page</h3>
                <div dangerouslySetInnerHTML={{ __html: unsafeHtml2 }} />
              </div>
            )}
            {visibleContent.seamless && (
              <div>
                <h3>Seamless iframe</h3>
                <HtmlInIframe
                  unsafeHtml={unsafeHtml2}
                  customStyle={customCss}
                />
              </div>
            )}
          </div>
        </section>
      )}
    </main>,
    document.getElementById("app")
  );
}
