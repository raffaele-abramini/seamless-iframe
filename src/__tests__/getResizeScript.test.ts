import { renderResizeScript } from "../getResizeScript";
import { typedEval } from "./helpers";
import { HEIGHT_MESSAGE, POST_MESSAGE_IDENTIFIER } from "../constants";

const id = 123;
const height = 0; // note, we cover the correct height in e2e tests

beforeEach(() => {
  jest.spyOn(window, "postMessage");
});

afterEach(() => {
  // clean up listeners
  const w = window as any;
  if (w.__seamlessHeightLoad) {
    window.removeEventListener("load", w.__seamlessHeightLoad);
  }
  if (w.__seamlessHeightResize) {
    window.removeEventListener("resize", w.__seamlessHeightResize);
  }
});

it("doesn't post an event if 'heightCorrection' is falsy", () => {
  typedEval(renderResizeScript(id, { heightCorrection: false }));
  window.dispatchEvent(new Event("load"));
  expect(window.postMessage).not.toHaveBeenCalled();
});

it("post an event if 'heightCorrection' is true", () => {
  typedEval(renderResizeScript(id, { heightCorrection: true }));
  window.dispatchEvent(new Event("load"));
  expect(window.postMessage).toHaveBeenCalledWith(
    JSON.stringify(
      `${POST_MESSAGE_IDENTIFIER}///${id}///${HEIGHT_MESSAGE}///${height}`
    ),
    expect.stringContaining("localhost")
  );
});

it("post an event on resize if 'heightCorrectionOnResize'", () => {
  typedEval(
    renderResizeScript(id, {
      heightCorrection: true,
      heightCorrectionOnResize: true,
    })
  );
  window.dispatchEvent(new Event("resize"));
  expect(window.postMessage).toHaveBeenCalledWith(
    JSON.stringify(
      `${POST_MESSAGE_IDENTIFIER}///${id}///${HEIGHT_MESSAGE}///${height}`
    ),
    expect.stringContaining("localhost")
  );
});

it("post multiple events when 'debounceResizeTime' is falsy", () => {
  typedEval(
    renderResizeScript(id, {
      heightCorrection: true,
      heightCorrectionOnResize: true,
      debounceResizeTime: 0,
    })
  );
  window.dispatchEvent(new Event("resize"));
  window.dispatchEvent(new Event("resize"));
  expect(window.postMessage).toHaveBeenCalledTimes(2);
});

it("correctly debounces events when 'debounceResizeTime' is set", () => {
  jest.useFakeTimers();
  typedEval(
    renderResizeScript(id, {
      heightCorrection: true,
      heightCorrectionOnResize: true,
      debounceResizeTime: 500,
    })
  );
  window.dispatchEvent(new Event("resize"));
  window.dispatchEvent(new Event("resize"));
  window.dispatchEvent(new Event("resize"));
  expect(window.postMessage).toHaveBeenCalledTimes(0);
  jest.advanceTimersByTime(501);
  expect(window.postMessage).toHaveBeenCalledTimes(1);
});
