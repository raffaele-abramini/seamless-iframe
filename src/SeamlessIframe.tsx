import React, { useCallback, useEffect, useState } from "react";
import { getStylesheetElements } from "./getStylesheetElements";
import { renderResizeScript } from "./getResizeScript";
import {
  HEIGHT_MESSAGE,
  IFRAME_UNLOAD,
  LINK_CLICK_MESSAGE,
  POST_MESSAGE_IDENTIFIER,
} from "./constants";
import { getListenToLinksScript } from "./getListenToLinksScript";
import type { SeamlessIframeProps } from "./definitions";
import { getBeforeUnloadScript } from "./getBeforeUnloadScript";

const onLinkMessagePosted = (url: string) => {
  if (window.confirm(`Are you sure you want to open "${url}"?`)) {
    window.open(url, "_blank", "noopener noreferrer");
  }
};

const wrapInScript = (script: string) => `<script>${script}</script>`;
const wrapInStyle = (style: string) => `<style>${style}</style>`;

const SeamlessIframe = (props: SeamlessIframeProps) => {
  const {
    inheritParentStyle,
    customStyle,
    customOuterStyleObject,
    sanitizedHtml,
    customScript,
    listenToLinkClicks,
    customLinkClickCallback,
    title,
    heightCorrection,
    listenToUnloadEvent,
  } = props;

  const [height, setHeight] = useState(0);
  const [iframeUnloadPreventState, setIframeUnloadPreventState] = useState({
    preventing: false,
    times: 0,
  });
  const [id] = useState(Math.random());

  const parentStyleTags = inheritParentStyle ? getStylesheetElements() : "";
  const styleTag = customStyle ? wrapInStyle(customStyle) : "";
  const heightListener = heightCorrection
    ? wrapInScript(renderResizeScript(id, props))
    : "";
  const linkClickListener = listenToLinkClicks
    ? wrapInScript(getListenToLinksScript(id))
    : "";
  const unloadListener = listenToUnloadEvent
    ? wrapInScript(getBeforeUnloadScript(id))
    : "";
  const customScriptTag = customScript ? wrapInScript(customScript) : "";

  const onMessageCallback = useCallback(
    (event: MessageEvent) => {
      let messageId = "";
      let providedId = "";
      let messageType = "";
      let payload = "";

      // If no data is provided, return
      if (!event.data) {
        return;
      }

      try {
        [messageId, providedId, messageType, payload] = JSON.parse(
          event.data
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

      if (messageType === IFRAME_UNLOAD && listenToUnloadEvent) {
        return setIframeUnloadPreventState({
          times: iframeUnloadPreventState.times + 1,
          preventing: iframeUnloadPreventState.times >= 5,
        });
      }
    },
    [iframeUnloadPreventState]
  );

  useEffect(() => {
    // Add listener on mount
    window.addEventListener("message", onMessageCallback);

    // Remove listener on unmount
    return () => window.removeEventListener("message", onMessageCallback);
  }, [onMessageCallback]);

  if (iframeUnloadPreventState.preventing) {
    return (
      <div
        style={{
          height: 300,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          border: "5px solid #ccc",
          justifyContent: "center",
        }}
      >
        <p>This iframe is trying to navigate away.</p>
        <button
          type="button"
          onClick={() =>
            setIframeUnloadPreventState({
              times: 4,
              preventing: false,
            })
          }
        >
          Reload
        </button>
      </div>
    );
  }

  return (
    <iframe
      style={{ border: "none", width: "100%", ...customOuterStyleObject }}
      sandbox="allow-scripts"
      src="data:text/html"
      title={title}
      srcDoc={`${unloadListener}${parentStyleTags}${styleTag}${
        sanitizedHtml || ""
      }${heightListener}${linkClickListener}${customScriptTag}<!--${
        iframeUnloadPreventState.times
      }-->`}
      height={height || 100}
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
  listenToUnloadEvent: false,
  title: "",
} as Partial<SeamlessIframeProps>;

export { SeamlessIframe };
