import { getIframeBody } from "../helpers";

describe("Renders supported html", () => {
  beforeEach("visits the app", () => {
    cy.visit("/section/default");
  });

  it("should render provided h1", () => {
    getIframeBody().find("h1").should("contain.text", "A title");
  });
  it("should render provided p", () => {
    getIframeBody().find("p").should("contain.text", "Here's some text");
  });
  it("should render provided p", () => {
    getIframeBody()
      .find("p")
      .should(
        "contain.text",
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci architecto consectetur cumque dolorem esse excepturi explicabo ipsam itaque laudantium maiores molestias nam natus obcaecati pariatur quae quidem, quos rerum vitae."
      );
  });
  it("should render provided a", () => {
    getIframeBody().find("a").should("contain.text", "and a link");
  });
  it("should render provided ul and its children", () => {
    getIframeBody().find("ul").find("li").should("have.length", 5);
  });
});
