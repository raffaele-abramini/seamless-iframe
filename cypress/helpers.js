export const IFRAME_SELECTOR = "[data-seamless-iframe-container] iframe";

export const getIframeDocument = () => {
  return cy
    .get(IFRAME_SELECTOR)
    .wait(300)
    .its("0.contentDocument")
    .should("exist");
};

export const getLoadedIframe = () => {
  return cy.get(IFRAME_SELECTOR).wait(500).should("exist");
};

export const getIframeWindow = () => {
  return cy.get(IFRAME_SELECTOR).its("0.contentWindow").should("exist");
};

export const getIframeBody = () => {
  return getIframeDocument()
    .its("body")
    .should("not.be.undefined")
    .then(cy.wrap);
};
