import { HEIGHT_MESSAGE, POST_MESSAGE_IDENTIFIER } from "./constants";
import { SeamlessIframeProps } from "./definitions";

export const renderResizeScript = (
  id: number,
  props: Pick<
    SeamlessIframeProps,
    "heightCorrection" | "heightCorrectionOnResize" | "debounceResizeTime"
  >
) => {
  if (!props.heightCorrection) {
    return "";
  }
  let output = `
    const validatedMessage = () => JSON.stringify("${POST_MESSAGE_IDENTIFIER}///${id}///${HEIGHT_MESSAGE}///"+document.documentElement.offsetHeight);
    window.__seamlessHeightLoad = () => parent.postMessage(validatedMessage(), "${window.location.href}");
    window.addEventListener("load", window.__seamlessHeightLoad);
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
        window.__seamlessHeightResize = debounce(() => {
            parent.postMessage(validatedMessage(), "${window.location.href}")
        }, ${props.debounceResizeTime});
`;
  } else {
    output += `
        window.__seamlessHeightResize = () => {
            parent.postMessage(validatedMessage(), "${window.location.href}")
        };
    `;
  }

  return (
    output + `window.addEventListener("resize", window.__seamlessHeightResize);`
  );
};
