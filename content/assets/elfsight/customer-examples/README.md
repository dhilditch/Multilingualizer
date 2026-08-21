# Elfsight customer examples

Article-ready screenshots of Elfsight widgets found on Multilingualizer customer websites.

## Folders

- `clean/`: tightly cropped, unaltered webpage pixels for publication or further design work.
- `annotated/`: the same crop with a descriptive header and orange outlines around the verified Elfsight widget.
- `manifest.json`: source URL, widget type, alt text and capture date for every asset.

The raw 1280×720 evidence captures remain in the ignored `data/customer-intelligence/elfsight-review/screenshots/` directory. Do not move those raw files into published content.

## Naming

Files use:

`elfsight-{widget-product}-{customer-domain-or-name}.png`

This makes searches for a product, customer or Elfsight example deterministic.

## Regeneration

From the project root:

```sh
npm run clients:prepare-elfsight-assets
```

The generator performs direct pixel crops, preserves clean originals, and builds annotated copies without generative image editing. Crop and highlight coordinates live in `customer-intelligence/prepare-elfsight-article-assets.mjs`.

## Publication notes

- These are captures of publicly visible customer webpages, not product mock-ups.
- Review widgets can contain public reviewer names and profile images. Recheck the current page and the article's editorial need immediately before publication.
- Prefer `clean/` when the article supplies its own caption. Prefer `annotated/` when the image must explain itself out of context.
