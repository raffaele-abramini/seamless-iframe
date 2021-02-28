import React, { useEffect, useState } from "react";

export interface HtmlInIframeProps {
  customStyle?: string;
  sanitizedHtml: string;
  heightCorrection?: boolean;
  heightCorrectionOnResize?: boolean;
  debounceResize?: boolean;
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

  if (props.debounceResize) {
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
        }, 250);
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

const HtmlInIframe = (props: HtmlInIframeProps) => {
  const [height, setHeight] = useState(100);
  const [id] = useState(Math.random());

  const styleTag = `<style>${props.customStyle || ""}</style>`;
  const heightListener = `<script>${renderResizeScript(id, props)}</script>`;

  const src = `data:text/html,${styleTag}${props.sanitizedHtml}${heightListener}`;

  useEffect(() => {
    window.addEventListener("message", (e) => {
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
    });
  });
  return (
    <iframe
      style={{ border: "none", width: "100%" }}
      sandbox="allow-scripts"
      src={src}
      height={height}
    />
  );
};

HtmlInIframe.defaultProps = {
  heightCorrection: true,
  heightCorrectionOnResize: true,
  debounceResize: true,
};

export { HtmlInIframe };
