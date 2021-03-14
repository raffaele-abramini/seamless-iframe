import React, { ReactChild } from "react";
import reactDom from "react-dom";
import { SeamlessIframe } from "seamless-iframe";
import externalHtml from "../examples/externalHtml";
import longHtml from "../examples/longHtml";
import unsafeHtml from "../examples/unsafehtml";
import unsafeHtml2 from "../examples/unsafehtml2";
import htmlWithWeirdChars from "../examples/htmlWithWeirdChars";

const customCss = `
  body {
    margin: 0;
    padding: 0;
  }
`;
const customCss2 = `
  body {
    margin: 0;
    padding: 0;
    color: slategray;
  }
`;

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

interface BlockProps {
  title?: string;
  header?: ReactChild;
  firstCol: ReactChild;
  secondCol: ReactChild;
  isFirst?: boolean;
}

const SectionBlock = (props: BlockProps) => {
  return (
    <section>
      {props.isFirst && <span />}
      {props.header || <h2>{props.title}</h2>}
      <div className="two-cols">
        <div>{props.firstCol}</div>
        <div>{props.secondCol}</div>
      </div>
    </section>
  );
};

localStorage.setItem("secret", "mySecretCode");
document.cookie = "mySecretCookie";

function renderExamples() {
  reactDom.render(
    <main>
      <SectionBlock
        title="Automatically gets styles from parent window"
        isFirst
        firstCol={
          <>
            <h3>Default iframe</h3>
            <iframe src={"data:text/html," + externalHtml} />
          </>
        }
        secondCol={
          <>
            <h3>Seamless iframe</h3>
            <SeamlessIframe sanitizedHtml={externalHtml} />
          </>
        }
      />

      <SectionBlock
        title="Receives custom styles"
        isFirst
        firstCol={
          <>
            <h3>Default iframe</h3>
            <iframe src={"data:text/html," + externalHtml} />
          </>
        }
        secondCol={
          <>
            <h3>Seamless iframe</h3>
            <SeamlessIframe
              sanitizedHtml={externalHtml}
              customStyle={customCss2}
            />
            <h4>Provided styles</h4>
            <pre>{customCss2}</pre>
          </>
        }
      />
      <SectionBlock
        title="Ignores parent style, just get custom style"
        isFirst
        firstCol={
          <>
            <h3>Default iframe</h3>
            <iframe src={"data:text/html," + externalHtml} />
          </>
        }
        secondCol={
          <>
            <h3>Seamless iframe</h3>
            <SeamlessIframe
              sanitizedHtml={externalHtml}
              customStyle={customCss2}
              inheritParentStyle={false}
            />
            <h4>Provided styles</h4>
            <pre>{customCss2}</pre>
          </>
        }
      />

      <SectionBlock
        title="Automatically resizes its height"
        isFirst
        firstCol={
          <>
            <h3>Default iframe</h3>
            <iframe src={"data:text/html," + longHtml} />
          </>
        }
        secondCol={
          <>
            <h3>Seamless iframe</h3>
            <SeamlessIframe sanitizedHtml={longHtml} customStyle={customCss} />
          </>
        }
      />

      <SectionBlock
        title="Prevents injected content from submitting forms"
        isFirst
        firstCol={
          <>
            <h3>HTML directly injected in page</h3>
            <div dangerouslySetInnerHTML={{ __html: unsafeHtml }} />
          </>
        }
        secondCol={
          <>
            <h3>Seamless iframe</h3>
            <SeamlessIframe
              sanitizedHtml={unsafeHtml}
              customStyle={customCss}
            />
          </>
        }
      />
      <SectionBlock
        header={
          <>
            <h2>
              Prevents rendered html from accessing location, cookies and
              storage
            </h2>
            <p>
              For this example we are storing a localStorage key of
              "mySecretCode" and a cookie of value "test"
            </p>
          </>
        }
        isFirst
        firstCol={
          <>
            <h3>HTML directly injected in page</h3>
            <div dangerouslySetInnerHTML={{ __html: unsafeHtml2 }} />
          </>
        }
        secondCol={
          <>
            <h3>Seamless iframe</h3>
            <SeamlessIframe
              sanitizedHtml={unsafeHtml2}
              customStyle={customCss}
            />
          </>
        }
      />
    </main>,
    document.getElementById("app")
  );
}

renderExamples();
