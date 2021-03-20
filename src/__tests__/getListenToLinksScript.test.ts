import { getListenToLinksScript } from "../getListenToLinksScript";
import { LINK_CLICK_MESSAGE, POST_MESSAGE_IDENTIFIER } from "../constants";

it("returns a script that, once added listens to link clicks and post the correct number", () => {
  jest.spyOn(window, "postMessage");
  const [id, href] = [1234, "https://github.com/"];
  const linkElem = document.createElement("a");
  linkElem.innerText = "click";
  linkElem.href = href;
  document.body.appendChild(linkElem);

  // eslint-disable-next-line no-eval
  eval(getListenToLinksScript(id));

  linkElem.click();

  expect(window.postMessage).toHaveBeenCalledWith(
    // eslint-disable-next-line no-useless-escape
    `\"${POST_MESSAGE_IDENTIFIER}///${id}///${LINK_CLICK_MESSAGE}///${href}\"`,
    expect.stringContaining("localhost")
  );
});
