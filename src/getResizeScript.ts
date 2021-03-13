import type { SeamlessIframeProps } from "./SeamlessIframe";
import { HEIGHT_MESSAGE, POST_MESSAGE_IDENTIFIER } from "./constants";

export const renderResizeScript = (id: number, props: SeamlessIframeProps) => {
  if (!props.heightCorrection) {
    return "";
  }
  let output = `
  const validatedMessage = () => JSON.stringify("${POST_MESSAGE_IDENTIFIER}///${id}///${HEIGHT_MESSAGE}///"+document.documentElement.offsetHeight);
  window.addEventListener("load", () => parent.postMessage(validatedMessage(), "${location.href}"));
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
