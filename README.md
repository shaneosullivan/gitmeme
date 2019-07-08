# gitmeme

Gitmeme has a few different parts to it

- The browser extension, in the `/extension` folder
- The popup part of the browser extension, in the `/popup` folder
- The API, in the `/site/functions` folder
- The public facing website in the `/site/ui` folder.

These are all built with TypeScript, similar to Javascript but with variable types.
See each of the sections below for instructions on how to work with them.

## Browser Extension

The browser extension is written in TypeScript, but is otherwise vanilla code, no
React used. This is because it mostly involves modifying the existing
website contents of Github.com.

First install the extension into Chrome by going to `chrome://extensions` and
clicking the `Load unpacked extension button`, then choosing the `/extension` folder.

The main file that is loaded is `/extension/src/contentScript.ts`: this is the entry point for the
extension. To modify the CSS, change the `/extension/src/style.css` file.

Because the extension is built with Typescript, you need to run a build script to
see the effects in the browser. Do this by running `yarn build` in the `/extension`
folder. Then, go to `chrome://extensions` in your browser and click the refresh button
in the Gitmeme extension. Next, refresh the Github page you were testing on.

## Browser Extension Popup

The browser extension popup is a mostly standalone React app, written in Typescript.
The source code for it is in the `/popup` folder. You can edit it like any React
app, then build it with `yarn build`. This builds the Typescript and copies the
result into the `/extension/popup` folder. Next, go to `chrome://extensions` in
your browser and click the refresh button in the Gitmeme extension, the click
refresh the Github page you were testing on.

## API

Gitmeme has an API is used to record the most popular images, and to fetch
lists of them. It uses Google Firebase as a host. If you're not Shane you likely
won't need to touch it.

## Public Website

The public facing website, which you can see at https://gitme.me, is built using
Gatsby.js, a static site generator around React. The code is at `/site/ui`, with
most of the content being in `/site/ui/src`.

It's very simple right now, just two pages, `index.tsx` and `image.tsx`. To work on it,
type `yarn start`, and it should appear in your browser. Then as you modify it,
the browser should update.

The `index` page is obviously the landing page. We should likely have a link to
the extension for download on Chrome and Firefox, and a short video of the
extension being used.

The `image` page is linked to from every image that we insert, and shows the
image passed through in the url, as well as some upsell that we can design
to get more virality in the app.
