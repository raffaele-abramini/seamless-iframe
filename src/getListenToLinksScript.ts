import { LINK_CLICK_MESSAGE, POST_MESSAGE_IDENTIFIER } from "./constants";

export const getListenToLinksScript = (id: number) => `
  {
    const validatedMessage = (url) => JSON.stringify("${POST_MESSAGE_IDENTIFIER}///${id}///${LINK_CLICK_MESSAGE}///"+url);
    const postMessage = (url) => parent.postMessage(validatedMessage(url), "${window.location.href}");
    const listenToLinks = Array.from(document.querySelectorAll("a")).forEach(a => {
        a.addEventListener("click", (e) => {
          postMessage(a.getAttribute("href"));
          return e.preventDefault();
        });
      });
    window.addEventListener("load", listenToLinks);
  }
`;
