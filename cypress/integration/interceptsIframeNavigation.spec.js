import { getIframeBody } from "../helpers";

describe("Intercepts iframe navigation", () => {
  it("should render the default prevent navigation view after the inner html tries to navigate away", () => {
    cy.visit("/section/preventsNavigation")
      .wait(1000)
      .then(() => {
        cy.get("body")
          .should("not.contain.html", "<iframe")
          .should("contain.text", "This iframe is trying to navigate away.")
          .find("button")
          .should("contain.text", "Reload");
      });
  });

  it("should render a custom prevent navigation view if provided, after the inner html tries to navigate away", () => {
    cy.visit("/section/preventsNavigation?custom")
      .wait(1000)
      .then(() => {
        cy.get("body")
          .should("not.contain.html", "<iframe")
          .should("contain.text", "custom view bro");
      });
  });

  it("should instead allow the navigation if not specified in props", () => {
    cy.visit("/section/preventsNavigation?allow")
      .wait(1000)
      .then(() => {
        getIframeBody().find("h1").should("contain.text", "Raffaele Abramini");
      });
  });
});
