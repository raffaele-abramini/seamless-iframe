import React, { useEffect, useState } from "react";
import { getStylesheetElements } from "./getStylesheetElements";

export interface HtmlInIframeProps {
  sanitizedHtml: string;
  customStyle?: string;
  heightCorrection?: boolean;
  heightCorrectionOnResize?: boolean;
  debounceResizeTime?: number;
  inheritParentStyle?: boolean;
}

const renderResizeScript = (id: number, props: HtmlInIframeProps) => {
  if (!props.heightCorrection) {
    return "";
  }
  let output = `
  const validatedMessage = () => JSON.stringify("${id}///"+document.documentElement.scrollHeight);
  parent.postMessage(validatedMessage(), "${location.href}");
  `;
  if (!props.heightCorrectionOnResize) {
    return output;
  }

  if (props.debounceResizeTime) {
    output += `
        function debounce(func, wait, immediate) {
            var timeout;
            return function() {
                var context = this, args = arguments;
                var later = function() {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(context, args);
            };
        };
        const handleResize = debounce(() => {
            parent.postMessage(validatedMessage(), "${location.href}")
        }, ${props.debounceResizeTime});
`;
  } else {
    output += `
        const handleResize = () => {
            parent.postMessage(validatedMessage(), "${location.href}")
        };
    `;
  }

  return output + 'window.addEventListener("resize", handleResize);';
};

const SeamlessIframe = (props: HtmlInIframeProps) => {
  const [height, setHeight] = useState(100);
  const [id] = useState(Math.random());
  const parentStyleTags = props.inheritParentStyle
    ? getStylesheetElements()
    : "";
  const styleTag = `<style>${props.customStyle || ""}</style>`;
  const heightListener = `<script>${renderResizeScript(id, props)}</script>`;

  const src = `data:text/html`;

  useEffect(() => {
    const onMessageCallback = (e) => {
      let height: number;
      let providedId: number;
      try {
        [providedId, height] = JSON.parse(e.data).split("///").map(Number);
      } catch (e) {
        console.error("cannot parse iframe message", e);
      }

      if (providedId === id) {
        setHeight(height);
      }
    };

    window.addEventListener("message", onMessageCallback);

    return () => window.removeEventListener("message", onMessageCallback);
  }, []);

  return (
    <iframe
      style={{ border: "none", width: "100%" }}
      sandbox="allow-scripts"
      src={src}
      srcDoc={`${parentStyleTags}${styleTag}${props.sanitizedHtml}${heightListener}`}
      height={height}
    />
  );
};

SeamlessIframe.defaultProps = {
  heightCorrection: true,
  heightCorrectionOnResize: true,
  debounceResizeTime: 250,
  inheritParentStyle: true,
};

export { SeamlessIframe };
