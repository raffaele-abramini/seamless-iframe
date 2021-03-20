export const typedEval = (script: string) => {
  // eslint-disable-next-line no-eval
  eval(script);
};

export const mockDocumentStylesheets = () => {
  const style = document.createElement("style");
  style.innerHTML = `body { background: red; }`;
  const style2 = document.createElement("style");
  style2.innerHTML = `body { background: blue; }`;
  const initialStylesheet = document.styleSheets;
  Object.defineProperty(document, "styleSheets", {
    writable: true,
    value: new Set([
      {
        ownerNode: style,
      },
      {
        ownerNode: style2,
      },
      {
        // invalid node to see how it behaves
      },
    ]),
  });

  return () => {
    Object.defineProperty(document, "styleSheets", {
      writable: true,
      value: initialStylesheet,
    });
  };
};
