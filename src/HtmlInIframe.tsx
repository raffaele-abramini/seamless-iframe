import React, { useEffect, useState } from "react";

export interface HtmlInIframeProps {
  customStyle?: string;
  unsafeHtml: string;
  heightCorrection: boolean;
  heightCorrectionOnResize: boolean;
  debounceResize: boolean;
}

const renderResizeScript = (props: HtmlInIframeProps) => {
  if (!props.heightCorrection) {
    return "";
  }
  let output = `parent.postMessage(document.documentElement.scrollHeight, "${location.href}");`;
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
            parent.postMessage(document.documentElement.scrollHeight, "${location.href}")
        }, 250);
`;
  } else {
    output += `
        const handleResize = () => {
            parent.postMessage(document.documentElement.scrollHeight, "${location.href}")
        };
    `;
  }

  return output + 'window.addEventListener("resize", handleResize);';
};

const HtmlInIframe = (props: HtmlInIframeProps) => {
  const styleTag = `<style>${props.customStyle || ""}</style>`;
  const heightListener = `<script>${renderResizeScript(props)}</script>`;

  const src = `data:text/html,${styleTag}${props.unsafeHtml}${heightListener}`;
  const [height, setHeight] = useState(100);

  useEffect(() => {
    window.addEventListener(
      "message",
      (e) => {
        let height: number;
        try {
          height = Number(JSON.parse(e.data));
        } catch (e) {
          console.error("cannot parse iframe message");
        }

        setHeight(height);
      },
      false
    );
  });
  return (
    <iframe
      style={{ border: "none", width: "100%" }}
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
