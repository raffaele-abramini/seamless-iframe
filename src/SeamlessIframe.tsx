import React, { useCallback, useEffect, useState } from "react";
import { getStylesheetElements } from "./getStylesheetElements";
import { renderResizeScript } from "./getResizeScript";
import {
  HEIGHT_MESSAGE,
  NAVIGATION_INTERCEPTED_MESSAGE,
  LINK_CLICK_MESSAGE,
  POST_MESSAGE_IDENTIFIER,
} from "./constants";
import { getListenToLinksScript } from "./getListenToLinksScript";
import type { SeamlessIframeProps } from "./definitions";
import { getInterceptNavigationScript } from "./getInterceptNavigationScript";

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
    interceptLinkClicks,
    preventIframeNavigation,
    customLinkClickCallback,
    customIframeNavigationInterceptedView,
    title,
    heightCorrection,
  } = props;

  const [height, setHeight] = useState(0);
  const [iframeUnloadPreventState, setIframeUnloadPreventState] = useState({
    preventing: false,
    buffering: false,
  });
  const [id] = useState(Math.random());

  const parentStyleTags = inheritParentStyle ? getStylesheetElements() : "";
  const styleTag = customStyle ? wrapInStyle(customStyle) : "";
  const heightListener = heightCorrection
    ? wrapInScript(renderResizeScript(id, props))
    : "";
  const linkClickListener = interceptLinkClicks
    ? wrapInScript(getListenToLinksScript(id))
    : "";
  const unloadListener = preventIframeNavigation
    ? wrapInScript(getInterceptNavigationScript(id))
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

      if (messageType === LINK_CLICK_MESSAGE && interceptLinkClicks) {
        if (customLinkClickCallback) {
          // payload as url string
          return customLinkClickCallback(payload);
        }

        return onLinkMessagePosted(payload);
      }

      if (
        messageType === NAVIGATION_INTERCEPTED_MESSAGE &&
        preventIframeNavigation
      ) {
        return setIframeUnloadPreventState({
          preventing: false,
          buffering: true,
        });
      }
    },
    [iframeUnloadPreventState]
  );

  useEffect(() => {
    // Add listener on mount
    window.addEventListener("message", onMessageCallback);

    if (iframeUnloadPreventState.buffering) {
      setTimeout(() => {
        setIframeUnloadPreventState({
          preventing: true,
          buffering: false,
        });
      }, 300);
    }

    // Remove listener on unmount
    return () => window.removeEventListener("message", onMessageCallback);
  }, [onMessageCallback]);

  // This logic is here to prevent the iframe to show the "iframe is navigating away" view
  // on page unload.
  // There's a block in the main useEffect that will re-set the 'buffering'
  // to false automatically after a number of milliseconds
  if (iframeUnloadPreventState.buffering) {
    return <div style={{ height }} data-buffering="" />;
  }

  if (iframeUnloadPreventState.preventing) {
    if (customIframeNavigationInterceptedView) {
      return customIframeNavigationInterceptedView;
    }
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
              preventing: false,
              buffering: false,
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
  preventIframeNavigation: false,
  title: "",
} as Partial<SeamlessIframeProps>;

export { SeamlessIframe };
