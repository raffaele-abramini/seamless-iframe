import React from "react";
import { act, render, RenderResult } from "@testing-library/react";
import { SeamlessIframe } from "../SeamlessIframe";
import { renderResizeScript } from "../getResizeScript";
import {
  HEIGHT_MESSAGE,
  LINK_CLICK_MESSAGE,
  POST_MESSAGE_IDENTIFIER,
} from "../constants";

const getIframe = (result: RenderResult): HTMLIFrameElement =>
  result.container.querySelector("iframe")!;

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
    jest.spyOn(Math, "random").mockImplementationOnce(() => 1337);

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
      renderResizeScript(1337, {
        heightCorrection: true,
        heightCorrectionOnResize: false,
      })
    );
  });

  it("renders an iframe with correct heighresizescript if heightCorrection and heightCorrectionOnResize are set ", async () => {
    jest.spyOn(Math, "random").mockImplementationOnce(() => 1337);

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
      renderResizeScript(1337, {
        heightCorrection: true,
        heightCorrectionOnResize: true,
        debounceResizeTime: 0,
      })
    );
  });

  it("renders an iframe with correct heighresizescript if heightCorrection, heightCorrectionOnResize and debounceResize are set ", async () => {
    jest.spyOn(Math, "random").mockImplementationOnce(() => 1337);

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
      renderResizeScript(1337, {
        heightCorrection: true,
        heightCorrectionOnResize: true,
        debounceResizeTime: 0,
      })
    );
  });

  it("listens to posted messages if heightCorrection is set", async () => {
    jest.spyOn(Math, "random").mockImplementationOnce(() => 1337);

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
            `${POST_MESSAGE_IDENTIFIER}///${1337}///${HEIGHT_MESSAGE}///${100}`
          ),
        })
      );
    });

    expect(iframe.height).toBe("100");
  });

  it("doesn't set iframe height if messageId is not compatible", async () => {
    jest.spyOn(Math, "random").mockImplementationOnce(() => 1337);

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
            `somethingElse///${1337}///${HEIGHT_MESSAGE}///${100}`
          ),
        })
      );
    });

    expect(iframe.height).toBe("0");
  });

  it("doesn't set iframe height if iframe id doesn't match", async () => {
    jest.spyOn(Math, "random").mockImplementationOnce(() => 1337);

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
    jest.spyOn(Math, "random").mockImplementationOnce(() => 1337);

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
            `${POST_MESSAGE_IDENTIFIER}///${1337}///${LINK_CLICK_MESSAGE}///${100}`
          ),
        })
      );
    });

    expect(iframe.height).toBe("0");
  });
});
