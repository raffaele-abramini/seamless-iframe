export default `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
    />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
    <style>
      code {
        font-family: monospace;
        background: rgba(0, 0, 0, 0.1);
        padding: 9px;
        display: inline-block;
      }
      img {
        display: none;
      }
    </style>
  </head>
  <body>
    <p>Here's your local storage value:</p>
    <code id="local">N/A</code>
    <img
      src="https://cane.com/nonexistent.png"
      onerror="var c = document.getElementById('local');c.innerText =localStorage.getItem('secret');"
    />

    <p>Here's your cookie value:</p>
    <code id="cookie">N/A</code>
    <img
      src="https://cane.com/nonexistent.png"
      onerror="var c = document.getElementById('cookie');c.innerText =document.cookie;"
    />
  </body>
</html>
`;
