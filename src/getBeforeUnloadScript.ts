import { IFRAME_UNLOAD, POST_MESSAGE_IDENTIFIER } from "./constants";

export const getBeforeUnloadScript = (id: number) => `
{
    const validatedMessage = () => JSON.stringify("${POST_MESSAGE_IDENTIFIER}///${id}///${IFRAME_UNLOAD}///nope");
    window.addEventListener("beforeunload", (e) => {
      e.preventDefault();
      parent.postMessage(validatedMessage(), "${window.location.href}");
    });
}
`;
