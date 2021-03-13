import { getIframeWindow, getIframeBody } from "../helpers";
describe("Gets custom styles", () => {
  beforeEach("visits the app", () => {
    cy.visit("/section/a2");
  });

  it("should ignore parents styles", () => {
    getIframeWindow().then((w) => {
      getIframeBody()
        .find("h1")
        .then((h1) => {
          expect(w.getComputedStyle(h1[0]).fontFamily).equal("Times");
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
