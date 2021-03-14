import { getIframeBody } from "../helpers";
describe("Handles clicks when specified", () => {
  beforeEach("visits the app", () => {
    cy.visit("/section/default", {
      onBeforeLoad(win) {
        cy.stub(win, "open");
        cy.spy(win, "confirm");
      },
    });
  });

  it("shouldn't open a new tab if user doesn't confirm", () => {
    cy.on("window:confirm", () => false);
    getIframeBody().find("a").click();
    cy.window().its("confirm").should("be.called");
    cy.window().its("open").should("not.be.called");
  });
  it("should open a new tab if user confirm", () => {
    cy.on("window:confirm", () => true);

    getIframeBody().find("a").click();
    cy.window().its("confirm").should("be.called");
    cy.window().its("open").should("be.called");
  });
});
