import { getIframeWindow, getIframeBody } from "../helpers";
describe("Gets custom styles", () => {
  beforeEach("visits the app", () => {
    cy.visit("/section/ignoreParentStyles");
  });

  it("should ignore parents styles", () => {
    getIframeWindow().then((w) => {
      getIframeBody()
        .find("h1")
        .then((h1) => {
          expect(w.getComputedStyle(h1[0]).fontFamily).not.equal(
            '"helvetica neue", helvetica, sans-serif'
          );
        });
    });
  });

  it("should set the title to gray, as per custom style", () => {
    getIframeWindow().then((w) => {
      getIframeBody()
        .find("h1")
        .then((h1) => {
          expect(w.getComputedStyle(h1[0]).color).equal("rgb(112, 128, 144)");
        });
    });
  });
});
