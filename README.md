# Seamless Iframe 🔮

![Build](https://img.shields.io/badge/Built%20with-React-blue) 
![Build](https://github.com/raffaele-abramini/seamless-iframe/actions/workflows/build.yml/badge.svg?branch=main)
![ESlint](https://github.com/raffaele-abramini/seamless-iframe/actions/workflows/eslint.yml/badge.svg?branch=main)
![Size](https://img.shields.io/bundlephobia/minzip/seamless-iframe)
![Dependencies](https://status.david-dm.org/gh/raffaele-abramini/seamless-iframe.svg)
![Coverage](https://img.shields.io/badge/coverage-100%25-success)

Seamless Iframe is a customisable React component that allows you to render HTML content in an iframe and makes it look as if it was part of the page itself. Seamless! 👻 


## Quick examples

### 🎨 Inherits styles from the parent document and vertically updates its height
![Demo for style and resize](https://github.com/raffaele-abramini/seamless-iframe/blob/main/public/assets/iframe-size.gif)

### 🔗 Handle user clicks on links
![Demo for handling link clicks](https://github.com/raffaele-abramini/seamless-iframe/blob/main/public/assets/iframe-link.gif)
## Usage

````jsx
import { SeamlessIframe } from "seamless-iframe";

const myHtml = sanitize("<div>hello</div>"); // HTML sanitisation is still recommended.

export const MyPage = (props) => {
    return ( 
        <SeamlessIframe
            sanitizedHtml={myHtml}
            customStyle={`
                body {
                    font-family: sans-serif;
                }
            `}
        />
    );
}
````

### Props

| Property | Type | Description  | Default |
| --- | --- | --- | --- |
| `sanitizedHtml` | String | *Required* - HTML string of text to be rendered in the iframe. **We suggest to sanitize the HTML before passing to the component.** | - |
| `inheritParentStyle`| Boolean | Whether to inherit styles on the parent page or not | true
| `title`| String | Title of the iframe, important for accessibility | ""
| `customStyle` | String | Extra set of css rules for the inner content | `body { margin: 0; padding: 0; }` |
| `customScript` | String | Extra script to be added to the iframe body | `` |
| `heightCorrection` | Boolean | Whether to apply the iframe content scroll height to the iframe element or not | true |  
| `heightCorrectionOnResize` | Boolean | Whether to re apply the height on resize. Off is `heightCorrection` is false | true | 
| `debounceResizeTime` | Number | Debounce time for reapplying height on the window resize event. If set to 0, no debounce function will be applied | 250 |
| `interceptLinkClicks` | Boolean | Whether to listen to link clicks. If enabled, the parent window will show a confirmation whenever a link in the iframe gets clicked | false |
| `customLinkClickCallback` | Function | Function to manipulate the behaviour of the top window on link click. Useless if `interceptLinkClicks` is falsy. | - |
| `preventIframeNavigation` | Boolean | Whether to prevent the iframe to navigate to a different URL. If a script inside the iframe tries to change the iframe window location, Seamless Iframe will repaint from the initial state. If this happens multiple times, a warning view gets displayed instead of the iframe.| true |
| `customIframeNavigationInterceptedView` | ReactElement | Replace the default warning view when iframe tries to navigate away. | - |


## Abstract

### What does this library do?

It provides a React component with a set of utilities to render custom HTML in an iframe that looks as if it was part of your page.

Normal iframes in fact:
1. don't inherit styles from the parent window
1. don't provide an easy way to set their full height
1. don't allow users to open links on the top level window
1. don't prevent scripts to change the iframe location

Here's where SeamlessIframe comes in handy.
The generated iframes will **automatically set their height** depending on the content,
and they will **inherit the parent window or custom styles**.
In addition, it allows you to quickly **customise what happens when a user clicks on a link**.
If a script (that somehow made it through the sanitization process) inside the iframe tries to manipulate the location (url) of the iframe, SeamlessIframe will intercept it and prevent it from happening.   

### Why would you use an iframe to render html?

In summary, **further security**.

There are a number of great sanitized libraries out there that prevents
malicious scripts from being injected in your page.

However, *if these libraries fail* is good to have another layer of security. Iframes
and their powerful `sandbox` attribute prevents a number of potentially dangerous behaviours.
