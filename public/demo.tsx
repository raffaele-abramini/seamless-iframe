import React from "react";
import reactDom from "react-dom";
import { SeamlessIframe } from "../src/SeamlessIframe";
import externalHtml from "./examples/externalHtml.html";
import longHtml from "./examples/longHtml.html";
import unsafeHtml from "./examples/unsafehtml.html";
import unsafeHtml2 from "./examples/unsafehtml2.html";
import htmlWithWeirdChars from "./examples/htmlWithWeirdChars.html";
import extremelyLongHtml from "./examples/extremelyLongHtml.html";
import { getStylesheetElements } from "../src/getStylesheetElements";

const customCss = `
  body {
    font-family: sans-serif;
    margin: 0;
    padding: 0;
  }
`;

const visibleSections = {
  a: true,
  a1: true,
  b: true,
  c: true,
  d: true,
  e: true,
  f: false,
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
          <h2>Automatically gets styles from parent window</h2>
          <div className="two-cols">
            <div>
              <h3>Default iframe</h3>
              <iframe src={"data:text/html," + externalHtml} />
            </div>
            <div>
              <h3>Seamless iframe</h3>
              <SeamlessIframe
                sanitizedHtml={externalHtml}
                customStyle={customCss}
              />
              <h4>Provided styles</h4>
              <pre>{getStylesheetElements()}</pre>
            </div>
          </div>
        </section>
      )}
      {visibleSections.a1 && (
        <section>
          <h2>Receives custom styles</h2>
          <div className="two-cols">
            <div>
              <h3>Default iframe</h3>
              <iframe src={"data:text/html," + externalHtml} />
            </div>
            <div>
              <h3>Seamless iframe</h3>
              <SeamlessIframe
                sanitizedHtml={externalHtml}
                customStyle={customCss}
              />
              <h4>Provided styles</h4>
              <pre>{customCss}</pre>
              <pre>{getStylesheetElements()}</pre>
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
              <SeamlessIframe
                sanitizedHtml={longHtml}
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
                <SeamlessIframe
                  sanitizedHtml={unsafeHtml}
                  customStyle={customCss}
                />
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
                <SeamlessIframe
                  sanitizedHtml={unsafeHtml2}
                  customStyle={customCss}
                />
              </div>
            )}
          </div>
        </section>
      )}

      {visibleSections.e && (
        <section>
          <h2>Works with weird quotes and chars</h2>
          <div className="two-cols">
            {visibleContent.original && (
              <div>
                <h3>Default iframe</h3>
                <iframe src={"data:text/html," + htmlWithWeirdChars} />
              </div>
            )}
            {visibleContent.seamless && (
              <div>
                <h3>Seamless iframe</h3>
                <SeamlessIframe
                  sanitizedHtml={htmlWithWeirdChars}
                  customStyle={customCss}
                />
              </div>
            )}
          </div>
        </section>
      )}
      {visibleSections.f && (
        <section>
          <h2>Extremely long html (1.6Mb)</h2>
          <div className="two-cols">
            {visibleContent.original && (
              <div>
                <h3>Default iframe</h3>
                <iframe src={"data:text/html," + extremelyLongHtml} />
              </div>
            )}
            {visibleContent.seamless && (
              <div>
                <h3>Seamless iframe</h3>
                <SeamlessIframe
                  sanitizedHtml={extremelyLongHtml}
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
