import { getInterceptNavigationScript } from "../getInterceptNavigationScript";
import { typedEval } from "./helpers";
import {
  NAVIGATION_INTERCEPTED_MESSAGE,
  POST_MESSAGE_IDENTIFIER,
} from "../constants";

const id = 123;

beforeEach(() => {
  jest.spyOn(window, "postMessage");
});

it("posts event on window.beforeunload", () => {
  typedEval(getInterceptNavigationScript(id));
  window.dispatchEvent(new Event("beforeunload"));
  expect(window.postMessage).toHaveBeenCalledWith(
    JSON.stringify(
      `${POST_MESSAGE_IDENTIFIER}///${id}///${NAVIGATION_INTERCEPTED_MESSAGE}///nope`
    ),
    expect.stringContaining("localhost")
  );
});
