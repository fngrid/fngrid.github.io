# fngrid.github.io

Concept demo and interest form for fngrid, served by GitHub Pages at https://fngrid.github.io/.

- `index.html`: the whole page (static, no build). The form posts to Formspree (`xgaolbge`).
- `assets/`: `demo.mp4`, `poster.jpg`, `og.png`, `favicon.svg`.
- `video/`: the Remotion project that renders the demo.

Send the page to a group with `?ref=name` (for example `https://fngrid.github.io/?ref=friends`). The value arrives with each answer.

## Re-render the video

```sh
cd video
npm install
npm run studio   # preview and edit
npm run render   # writes ../assets/demo.mp4
npm run poster   # writes ../assets/poster.jpg
npm run og       # writes ../assets/og.png
```

The terminals in the video are scripted. Nothing in it is a live product.
