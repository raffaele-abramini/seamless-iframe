import { getIframeBody, getIframeDocument, IFRAME_SELECTOR } from "../helpers";

describe("Sets heights", () => {
  beforeEach("visits the app", () => {
    cy.visit("/section/b");
  });

  it("should resize the iframe to match its content", () => {
    cy.get(IFRAME_SELECTOR)
      .wait(250)
      .then((i) => {
        getIframeBody()
          .parent("html")
          .its("0.scrollHeight")
          .should("equal", i["0"].scrollHeight);
      });
  });

  it("should resize the iframe to match its content even on window resize", () => {
    cy.get(IFRAME_SELECTOR)
      .wait(250)
      .then((i) => {
        cy.viewport(400, 100)
          .wait(1000)
          .then(() => {
            getIframeBody()
              .parent("html")
              .its("0.scrollHeight")
              .should("equal", i["0"].scrollHeight);
          });
      });
  });
});
