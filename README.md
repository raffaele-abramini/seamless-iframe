# Seamless Iframe

Seamless Iframe is a little helper to render iframes as if they were part of your page.

## Usage

````typescript jsx
import {SeamlessIframe} from "seamless-iframe";

const myHtml = "<div>hello</div>";

export const MyPage = (props) => {
    return <div>
        <SeamlessIframe
            sanitizedHtml={myHtml}
            customStyle={`
                body {
                    margin: 0;
                    font-family: sans-serif;
                }
            `}
        />
    </div>
}
````

### Props

| Property | Type | Description | Required | Default |
| --- | --- | --- | --- | --- |
| `sanitizedHtml` | String | HTMl string of text to be rendered in the iframe | yes | n/a |
| `inheritParentStyle`| Boolean | Whether to inherit styles on the parent page or not | no | true 
| `customStyle` | String | Extra set of css rules for the inner content | no | "" |
| `heightCorrection` | Boolean | Whether to apply the iframe content scroll height to the iframe element or not | no | true |  
| `heightCorrectionOnResize` | Boolean | Whether to re apply the height on resize. Off is `heightCorrection` is false | no | true | 
| `debounceResizeTime` | Number | Debounce time for reapplying height on the window resize event. If set to 0, no debounce function will be applied | no | 250 |


## Use cases

### Why would I be using an iframe?

In one word, **security**.

There are a number of great sanitized libraries out there that prevents
malicious scripts from being injected in your page.

However, *if these libraries fail* is good to have another layer of security. IFrames
and their powerful `sandbox` attribute prevents a number of potentially dangerous behaviours.

### So what's the problem?

It may sound a bit dumb as an answer but: **style**.

Iframes:
1. don't inherit styles from the parent window
1. don't provide an easy way to set their full height

Here's where the librar