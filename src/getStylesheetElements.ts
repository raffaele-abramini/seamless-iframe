export const getStylesheetElements = () => {
  return [...document.styleSheets]
    .map((styleSheet) => (styleSheet.ownerNode as Element)?.outerHTML)
    .filter(Boolean)
    .join("");
};
