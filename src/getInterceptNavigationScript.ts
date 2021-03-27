import {
  NAVIGATION_INTERCEPTED_MESSAGE,
  POST_MESSAGE_IDENTIFIER,
} from "./constants";

export const getInterceptNavigationScript = (id: number) => `
{
    const validatedMessage = () => JSON.stringify("${POST_MESSAGE_IDENTIFIER}///${id}///${NAVIGATION_INTERCEPTED_MESSAGE}///nope");
    window.addEventListener("beforeunload", (e) => {
      e.preventDefault();
      parent.postMessage(validatedMessage(), "${window.location.href}");
    });
}
`;
