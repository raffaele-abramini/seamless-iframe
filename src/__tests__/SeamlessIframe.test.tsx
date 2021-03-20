import React from "react";
import { act, render, RenderResult } from "@testing-library/react";
import { SeamlessIframe } from "../SeamlessIframe";
import { renderResizeScript } from "../getResizeScript";
import {
  HEIGHT_MESSAGE,
  LINK_CLICK_MESSAGE,
  POST_MESSAGE_IDENTIFIER,
} from "../constants";
import { getListenToLinksScript } from "../getListenToLinksScript";

const getIframe = (result: RenderResult): HTMLIFrameElement =>
  result.container.querySelector("iframe")!;

const iframeID = 1337;

beforeEach(() => {
  jest.spyOn(Math, "random").mockImplementationOnce(() => iframeID);
});

it("renders an iframe with its content", async () => {
  const container = render(
    <SeamlessIframe
      sanitizedHtml="yo"
      customScript={undefined}
      inheritParentStyle={false}
      heightCorrection={false}
      customStyle=""
    />
  );
  const iframe = getIframe(container);
  expect(iframe.srcdoc).toContain("yo");
});

it("renders an iframe with custom styles", async () => {
  const container = render(
    <SeamlessIframe
      sanitizedHtml="yo"
      customScript={undefined}
      inheritParentStyle={false}
      heightCorrection={false}
      customStyle="body { background: red; }"
    />
  );
  const iframe = getIframe(container);
  expect(iframe.srcdoc).toContain("<style>body { background: red; }</style>");
});

it("renders an iframe with custom scripts", async () => {
  const container = render(
    <SeamlessIframe
      sanitizedHtml="yo"
      customScript="alert(1)"
      inheritParentStyle={false}
      heightCorrection={false}
    />
  );
  const iframe = getIframe(container);
  expect(iframe.srcdoc).toContain("<script>alert(1)</script>");
});

describe("height correction", () => {
  it("renders an iframe with correct heighresizescript if heightCorrection is set", async () => {
    const container = render(
      <SeamlessIframe
        sanitizedHtml="yo"
        inheritParentStyle={false}
        heightCorrection
        heightCorrectionOnResize={false}
      />
    );
    const iframe = getIframe(container);
    expect(iframe.srcdoc).toContain(
      renderResizeScript(iframeID, {
        heightCorrection: true,
        heightCorrectionOnResize: false,
      })
    );
  });

  it("renders an iframe with correct heighresizescript if heightCorrection and heightCorrectionOnResize are set ", async () => {
    const container = render(
      <SeamlessIframe
        sanitizedHtml="yo"
        inheritParentStyle={false}
        heightCorrection
        heightCorrectionOnResize
        debounceResizeTime={0}
      />
    );
    const iframe = getIframe(container);
    expect(iframe.srcdoc).toContain(
      renderResizeScript(iframeID, {
        heightCorrection: true,
        heightCorrectionOnResize: true,
        debounceResizeTime: 0,
      })
    );
  });

  it("renders an iframe with correct heighresizescript if heightCorrection, heightCorrectionOnResize and debounceResize are set ", async () => {
    const container = render(
      <SeamlessIframe
        sanitizedHtml="yo"
        inheritParentStyle={false}
        heightCorrection
        heightCorrectionOnResize
        debounceResizeTime={0}
      />
    );
    const iframe = getIframe(container);
    expect(iframe.srcdoc).toContain(
      renderResizeScript(iframeID, {
        heightCorrection: true,
        heightCorrectionOnResize: true,
        debounceResizeTime: 0,
      })
    );
  });

  it("listens to posted messages if heightCorrection is set", async () => {
    const container = render(
      <SeamlessIframe
        sanitizedHtml="yo"
        inheritParentStyle={false}
        heightCorrection
        heightCorrectionOnResize={false}
      />
    );
    const iframe = getIframe(container);

    act(() => {
      window.dispatchEvent(
        new MessageEvent("message", {
          data: JSON.stringify(
            `${POST_MESSAGE_IDENTIFIER}///${iframeID}///${HEIGHT_MESSAGE}///${100}`
          ),
        })
      );
    });

    expect(iframe.height).toBe("100");
  });

  it("doesn't set iframe height if messageId is not compatible", async () => {
    const container = render(
      <SeamlessIframe
        sanitizedHtml="yo"
        inheritParentStyle={false}
        heightCorrection
        heightCorrectionOnResize={false}
      />
    );
    const iframe = getIframe(container);

    act(() => {
      window.dispatchEvent(
        new MessageEvent("message", {
          data: JSON.stringify(
            `somethingElse///${iframeID}///${HEIGHT_MESSAGE}///${100}`
          ),
        })
      );
    });

    expect(iframe.height).toBe("0");
  });

  it("doesn't set iframe height if iframe id doesn't match", async () => {
    const container = render(
      <SeamlessIframe
        sanitizedHtml="yo"
        inheritParentStyle={false}
        heightCorrection
        heightCorrectionOnResize={false}
      />
    );
    const iframe = getIframe(container);

    act(() => {
      window.dispatchEvent(
        new MessageEvent("message", {
          data: JSON.stringify(
            `${POST_MESSAGE_IDENTIFIER}///${9999}///${HEIGHT_MESSAGE}///${100}`
          ),
        })
      );
    });

    expect(iframe.height).toBe("0");
  });

  it("doesn't set iframe height if message type is not correct", async () => {
    const container = render(
      <SeamlessIframe
        sanitizedHtml="yo"
        inheritParentStyle={false}
        heightCorrection
        heightCorrectionOnResize={false}
      />
    );
    const iframe = getIframe(container);

    act(() => {
      window.dispatchEvent(
        new MessageEvent("message", {
          data: JSON.stringify(
            `${POST_MESSAGE_IDENTIFIER}///${iframeID}///${LINK_CLICK_MESSAGE}///${100}`
          ),
        })
      );
    });

    expect(iframe.height).toBe("0");
  });
});

describe("link click support", () => {
  const url = "github.com";

  beforeEach(() => {
    jest.spyOn(window, "confirm").mockImplementation();
  });

  it("renders an iframe with correct clickListenScript if listenToLinkClicks is set", async () => {
    const container = render(
      <SeamlessIframe
        sanitizedHtml="yo"
        inheritParentStyle={false}
        heightCorrection={false}
        listenToLinkClicks
      />
    );
    const iframe = getIframe(container);
    expect(iframe.srcdoc).toContain(getListenToLinksScript(iframeID));
  });

  it("renders an iframe without correct clickListenScript if listenToLinkClicks is not set", async () => {
    const container = render(
      <SeamlessIframe
        sanitizedHtml="yo"
        inheritParentStyle={false}
        heightCorrection={false}
        listenToLinkClicks={false}
      />
    );
    const iframe = getIframe(container);
    expect(iframe.srcdoc).not.toContain(getListenToLinksScript(iframeID));
  });

  it("reacts to link-related posted messages if listenToLinkClicks is set", async () => {
    render(
      <SeamlessIframe
        sanitizedHtml="yo"
        inheritParentStyle={false}
        heightCorrection={false}
        listenToLinkClicks
      />
    );

    act(() => {
      window.dispatchEvent(
        new MessageEvent("message", {
          data: JSON.stringify(
            `${POST_MESSAGE_IDENTIFIER}///${iframeID}///${LINK_CLICK_MESSAGE}///${url}`
          ),
        })
      );
    });

    expect(window.confirm).toHaveBeenCalledWith(expect.stringContaining(url));
  });

  it("doesn't react to link-related posted messages if listenToLinkClicks is set but messageId is incorrect", async () => {
    render(
      <SeamlessIframe
        sanitizedHtml="yo"
        inheritParentStyle={false}
        listenToLinkClicks
      />
    );

    act(() => {
      window.dispatchEvent(
        new MessageEvent("message", {
          data: JSON.stringify(
            `somethingElse///${iframeID}///${LINK_CLICK_MESSAGE}///${url}`
          ),
        })
      );
    });

    expect(window.confirm).not.toHaveBeenCalledWith(
      expect.stringContaining(url)
    );
  });

  it("doesn't react to link-related posted messages if listenToLinkClicks is set but iframeId is incorrect", async () => {
    render(
      <SeamlessIframe
        sanitizedHtml="yo"
        inheritParentStyle={false}
        listenToLinkClicks
      />
    );

    act(() => {
      window.dispatchEvent(
        new MessageEvent("message", {
          data: JSON.stringify(
            `${POST_MESSAGE_IDENTIFIER}///${9999}///${LINK_CLICK_MESSAGE}///${url}`
          ),
        })
      );
    });

    expect(window.confirm).not.toHaveBeenCalledWith(
      expect.stringContaining(url)
    );
  });

  it("doesn't react to link-related posted messages if message type is not correct", async () => {
    render(
      <SeamlessIframe
        sanitizedHtml="yo"
        inheritParentStyle={false}
        listenToLinkClicks
      />
    );

    act(() => {
      window.dispatchEvent(
        new MessageEvent("message", {
          data: JSON.stringify(
            `${POST_MESSAGE_IDENTIFIER}///${iframeID}///somethingelse///${url}`
          ),
        })
      );
    });

    expect(window.confirm).not.toHaveBeenCalledWith(
      expect.stringContaining(url)
    );
  });
});
