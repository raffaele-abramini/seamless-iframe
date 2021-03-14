import { getIframeBody } from "../helpers";

describe("Sets heights", () => {
  beforeEach("visits the app", () => {
    cy.visit("/section/customScript");
  });

  it("should resize the iframe to match its content even on window resize", () => {
    getIframeBody()
      .parent("html")
      .find("h2")
      .should("contain.text", "programmatically injected content");
  });
});
