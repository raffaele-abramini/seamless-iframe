import React, { CSSProperties, useEffect, useState } from "react";
import { getStylesheetElements } from "./getStylesheetElements";
import { renderResizeScript } from "./getResizeScript";
import {
  HEIGHT_MESSAGE,
  LINK_CLICK_MESSAGE,
  POST_MESSAGE_IDENTIFIER,
} from "./constants";
import { getListenToLinksScript } from "./getListenToLinksScript";

const onLinkMessagePosted = (url: string) => {
  if (window.confirm(`Are you sure you want to open "${url}"?`)) {
    window.open(url, "_blank", "noopener noreferrer");
  }
};

export interface SeamlessIframeProps {
  sanitizedHtml: string;
  customStyle?: string;
  customScript?: string;
  customOuterStyleObject?: Record<string, CSSProperties>;
  heightCorrection?: boolean;
  heightCorrectionOnResize?: boolean;
  debounceResizeTime?: number;
  inheritParentStyle?: boolean;
  listenToLinkClicks?: boolean;
  customLinkClickCallback?: (url: string) => void;
}

const SeamlessIframe = (props: SeamlessIframeProps) => {
  const {
    inheritParentStyle,
    customStyle,
    customOuterStyleObject,
    sanitizedHtml,
    customScript,
    listenToLinkClicks,
    customLinkClickCallback,
  } = props;
  const [height, setHeight] = useState(0);
  const [id] = useState(Math.random());
  const parentStyleTags = inheritParentStyle ? getStylesheetElements() : "";
  const styleTag = `<style>${customStyle || ""}</style>`;
  const heightListener = `<script>${renderResizeScript(id, props)}</script>`;
  const linkClickListener = listenToLinkClicks
    ? `<script>${getListenToLinksScript(id)}</script>`
    : "";
  const customScriptTag = customScript
    ? `<script>${customScript}</script>`
    : "";

  useEffect(() => {
    const onMessageCallback = (e: MessageEvent) => {
      let messageId = "";
      let providedId = "";
      let messageType = "";
      let payload = "";

      // If no data is provided, return
      if (!e.data) {
        return;
      }

      try {
        [messageId, providedId, messageType, payload] = JSON.parse(
          e.data
        ).split("///");
      } catch (e) {}

      // if this message has been triggered by anything else, ignore it
      if (messageId !== POST_MESSAGE_IDENTIFIER) {
        return;
      }

      // if the iframe id doesn't match the one from this instance, ignore it
      if (Number(providedId) !== id) {
        return;
      }

      // all good, set it.
      if (messageType === HEIGHT_MESSAGE) {
        // payload as height
        return setHeight(Number(payload));
      }

      if (messageType === LINK_CLICK_MESSAGE && listenToLinkClicks) {
        if (customLinkClickCallback) {
          // payload as url string
          return customLinkClickCallback(payload);
        }

        return onLinkMessagePosted(payload);
      }
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
      srcDoc={`${parentStyleTags}${styleTag}${
        sanitizedHtml || ""
      }${heightListener}${linkClickListener}${customScriptTag}`}
      height={height}
    />
  );
};

SeamlessIframe.defaultProps = {
  heightCorrection: true,
  heightCorrectionOnResize: true,
  debounceResizeTime: 250,
  inheritParentStyle: true,
  customStyle: `
    body {
      margin: 0;
      padding: 0;
    }
  `,
  customOuterStyleObject: {},
  listenToLinkClick: false,
} as Partial<SeamlessIframeProps>;

export { SeamlessIframe };
