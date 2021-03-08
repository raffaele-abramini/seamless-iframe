import React, { CSSProperties, useEffect, useState } from "react";
import { getStylesheetElements } from "./getStylesheetElements";
import { POST_MESSAGE_IDENTIFIER, renderResizeScript } from "./getResizeScript";

export interface SeamlessIframeProps {
  sanitizedHtml: string;
  customStyle?: string;
  customOuterStyleObject?: Record<string, CSSProperties>;
  heightCorrection?: boolean;
  heightCorrectionOnResize?: boolean;
  debounceResizeTime?: number;
  inheritParentStyle?: boolean;
}

const SeamlessIframe = (props: SeamlessIframeProps) => {
  const {
    inheritParentStyle,
    customStyle,
    customOuterStyleObject,
    sanitizedHtml,
  } = props;
  const [height, setHeight] = useState(100);
  const [id] = useState(Math.random());
  const parentStyleTags = inheritParentStyle ? getStylesheetElements() : "";
  const styleTag = `<style>${customStyle || ""}</style>`;
  const heightListener = `<script>${renderResizeScript(id, props)}</script>`;

  useEffect(() => {
    const onMessageCallback = (e: MessageEvent) => {
      let messageId = "";
      let height = "";
      let providedId = "";

      // If no data is provided, return
      if (!e.data) {
        return;
      }

      try {
        [messageId, providedId, height] = JSON.parse(e.data).split("///");
      } catch (e) {
        console.error("cannot parse iframe message", e);
      }

      // if this message has been triggered by anything else, ignore it
      if (messageId !== POST_MESSAGE_IDENTIFIER) {
        return;
      }

      // if the iframe id doesn't match the one from this instance, ignore it
      if (Number(providedId) !== id) {
        return;
      }

      // all good, set it.
      setHeight(Number(height));
    };

    // Add listener on mount
    window.addEventListener("message", onMessageCallback);

    // Remove listener on unmount
    return () => window.removeEventListener("message", onMessageCallback);
  }, []);

  return (
    <iframe
      style={{ border: "none", width: "100%", ...customOuterStyleObject }}
      sandbox="allow-scripts"
      src={"data:text/html"}
      srcDoc={`${parentStyleTags}${styleTag}${sanitizedHtml}${heightListener}`}
      height={height}
    />
  );
};

SeamlessIframe.defaultProps = {
  heightCorrection: true,
  heightCorrectionOnResize: true,
  debounceResizeTime: 250,
  inheritParentStyle: true,
  customStyle: "",
  customOuterStyleObject: {},
} as SeamlessIframeProps;

export { SeamlessIframe };
