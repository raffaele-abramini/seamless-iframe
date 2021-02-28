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