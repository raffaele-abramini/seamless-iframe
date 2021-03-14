import { getIframeBody, getLoadedIframe } from "../helpers";

describe("Sets heights", () => {
  beforeEach("visits the app", () => {
    cy.visit("/section/default");
  });

  it("should resize the iframe to match its content", () => {
    getLoadedIframe()
      .wait(250)
      .then((i) => {
        getIframeBody()
          .parent("html")
          .its("0.scrollHeight")
          .should("equal", i["0"].scrollHeight);
      });
  });

  it("should resize the iframe to match its content even on window resize", () => {
    getLoadedIframe().then((iframe) => {
      cy.viewport(400, 600)
        .wait(300)
        .then(() => {
          getIframeBody()
            .parent("html")
            .its("0.scrollHeight")
            .should("equal", iframe["0"].scrollHeight);
        });
    });
  });
});
