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

First, build the extension in a terminal/shell with

```
cd extension
npm run build
```

Next, install the extension into Chrome by going to `chrome://extensions` and
clicking the `Load unpacked extension button`, then choosing the `/extension` folder.

The main file that is loaded is `/extension/src/contentScript.ts`: this is the entry point for the
extension. To modify the CSS, change the `/extension/src/style.css` file.

Because the extension is built with Typescript, you need to run a build script to
see the effects in the browser. Do this by running `npm run build` in the `/extension`
folder. Then, go to `chrome://extensions` in your browser and click the refresh button
in the Gitmeme extension. Next, refresh the Github page you were testing on.

While developing the extension, you can run `npm run watch` so that the build is executed
every time you change a file. You will still need to click the refresh button in
`chrome://extensions` however.

## Browser Extension Popup

The browser extension popup is a mostly standalone React app, written in Typescript.
The source code for it is in the `/popup` folder. You can edit it like any React
app, then build it with `yarn build`. This builds the Typescript and copies the
result into the `/extension/popup` folder. Next, go to `chrome://extensions` in
your browser and click the refresh button in the Gitmeme extension, the click
refresh the Github page you were testing on.

## API

Gitmeme has an API is used to record the most popular images, and to fetch
lists of them. It uses Google Firebase as a host. If you're not Shane you likely won't need to touch it.

If you want to develop on your own Firebase project, you'll need to create
a Service Account file in your Firebase project, and put it in the
`site/functions/src/service_account.ts` file, see the
`site/functions/src/service_account_example.ts` file for an example of how
to format the file.

To run the API locally for testing, do

`cd site/functions`
`yarn serve`
`

To use the local development version of the API from the extension, uncomment the `getFakeUrl()` function in the `shared/consts.ts` file. Note that this code should
be commented out again before committing. You'll also need to temporarily add the line
`"http://localhost:5000/*"` to the `permissions` in `extension/manifest.json`. This
also should not be checked in

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

To run the site locally for development, do

`cd site/ui`
`yarn serve`
