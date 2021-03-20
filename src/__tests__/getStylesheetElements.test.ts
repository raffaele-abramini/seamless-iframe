import { getStylesheetElements } from "../getStylesheetElements";

it("correctly brings styles", () => {
  // mock document.stylesheet
  const style = document.createElement("style");
  style.innerHTML = `body { background: red; }`;
  const style2 = document.createElement("style");
  style2.innerHTML = `body { background: blue; }`;
  const initialStylesheet = document.styleSheets;
  Object.defineProperty(document, "styleSheets", {
    writable: true,
    value: new Set([
      {
        ownerNode: style,
      },
      {
        ownerNode: style2,
      },
    ]),
  });

  // assert
  expect(getStylesheetElements()).toEqual(
    "<style>body { background: red; }</style><style>body { background: blue; }</style>"
  );

  // reset
  Object.defineProperty(document, "styleSheets", {
    writable: true,
    value: initialStylesheet,
  });
});
