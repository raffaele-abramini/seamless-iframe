import { getListenToLinksScript } from "../getListenToLinksScript";
import { LINK_CLICK_MESSAGE, POST_MESSAGE_IDENTIFIER } from "../constants";
import { typedEval } from "./helpers";

it("returns a script that, once added listens to link clicks and post the correct number", () => {
  jest.spyOn(window, "postMessage");
  const [id, href] = [1234, "https://github.com/"];

  // Add link
  const linkElem = document.createElement("a");
  linkElem.innerText = "click";
  linkElem.href = href;
  document.body.appendChild(linkElem);

  // Run script
  // eslint-disable-next-line no-eval
  typedEval(getListenToLinksScript(id));

  // Simulate script
  linkElem.click();

  expect(window.postMessage).toHaveBeenCalledWith(
    JSON.stringify(
      `${POST_MESSAGE_IDENTIFIER}///${id}///${LINK_CLICK_MESSAGE}///${href}`
    ),
    expect.stringContaining("localhost")
  );

  // Clean up
  document.body.removeChild(linkElem);
});
