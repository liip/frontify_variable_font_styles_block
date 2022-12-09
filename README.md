# Frontify Variable Font Styles Block

Document and show how you use Variable Fonts in your Design System. This plugin allows you to add different styles of Variable Fonts to Frontify and configure allowed values across all the axes of your font so users can see at a glance what guidelines have been set.

## Usage

1. Add a Variable Font Styles block
2. Add a Variable Font to the block settings (upload a file or select an existing asset)
3. Add and configure any styles you need in block edit mode
4. If necessary, add a new block for a different font and repeat

## Features

-   Add a Variable Font by uploading a file or choosing one from your existing assets (.ttf and .otf supported)
-   Freely add and remove different styles of the same font
-   Font axes are automatically read from file data (including defaults, min values, and max values)
-   Allowed axis values can be set as a fixed value or a range
-   Features editable example text, font title, and font description for further documentation
-   The block uses one font per block for simplicity. Add additional blocks if you use multiple Variable Fonts.

## Development

Install dependencies and serve the plugin:

```
npm i
npm run serve
```

The plugin will show a health check on `http://localhost:5600`, you need a Frontify environment with the respective features enabled to further develop and test the plugin.

If you need support or have a feature request, please create an issue here or write us an E-Mail to frontify@liip.ch.
