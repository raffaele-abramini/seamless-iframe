import { getIframeDocument, getIframeBody } from "../helpers";
describe("Gets parent styles", () => {
  beforeEach("visits the app", () => {
    cy.visit("/section/a");
  });

  it("should set h1 to sans-serif", () => {
    getIframeDocument()
      .its("defaultView")
      .then((w) => {
        getIframeBody()
          .find("h1")
          .then((h1) => {
            expect(w.getComputedStyle(h1[0]).fontFamily).equal(
              '"helvetica neue", helvetica, sans-serif'
            );
          });
      });
  });
});
