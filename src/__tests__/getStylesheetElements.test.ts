import { getStylesheetElements } from "../getStylesheetElements";
import { mockDocumentStylesheets } from "./helpers";

it("correctly brings styles", () => {
  const cleanupStylesheets = mockDocumentStylesheets();

  // assert
  expect(getStylesheetElements()).toEqual(
    "<style>body { background: red; }</style><style>body { background: blue; }</style>"
  );

  cleanupStylesheets();
});
