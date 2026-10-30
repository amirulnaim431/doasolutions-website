# WordPress delivery assets

Run `npm run build:wordpress` from `showcase-app` after editing the child theme's
`assets/doa-home.css`, `assets/doa-fonts.css`, `assets/doa-home.js` or
`assets/venom-button/doa-venom.js`. This uses the installed Next.js minifiers and
writes content-fingerprinted files plus `assets/dist/manifest.json`.

Run `npm run build:wordpress:images` with Python and Pillow installed to rebuild
the responsive WebP images from the original PNG/JPEG files. Font files retain
their original Google Fonts binaries; licenses are included alongside them.

The inline critical fonts contain the same Roboto Condensed 800 title outlines (4.4 KB)
and Inter 400 lead paragraph outlines (3.2 KB), limited to the hero text's glyphs. To regenerate it after a hero text
change, install `fonttools` and `brotli`, run
`python scripts/build-wordpress-critical-font.py`, then rebuild WordPress assets.
The complete local fonts remain available for other characters and weights.

Deploy generated assets and manifests before the templates and `functions.php`.
Keep previous fingerprinted assets available for cached HTML. Immutable caching
is scoped to fingerprinted files; original editable assets are retained.
