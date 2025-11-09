---
title: How to sync favicon with user preferred color scheme
publication: 04-28-2024
---

The idea is pretty simple, combine [SVG style tags](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/style) with [CSS @media prefers-color-scheme query](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme).

Set the `path.stroke` to black by default, and when the media query for `prefers-color-scheme` is `dark` then set stroke to white. For example:

```xml
<?xml version="1.0" encoding="utf-8"?>
<svg viewBox="187.6428 195.1624 81.1551 89.5796" width="81.1551" height="89.5796" xmlns="http://www.w3.org/2000/svg">
  <path style="fill: none; stroke-width: 3px;" d="M 190.998 242.95 C 190.536 234.325 204.164 198.029 217.773 197.734 C 232.292 197.42 259.132 218.437 266.783 233.736 C 268.817 237.802 251.545 257.027 245.956 262.563 C 239.098 269.354 226.731 281.353 218.962 281.353 C 214.096 281.353 202.589 279.723 199.269 275.017 C 190.359 262.387 204.744 222.128 213.142 213.252 C 220.926 205.025 252.829 199.902 255.93 207.367 C 264.706 228.492 260.827 270.336 252.945 274.77 C 243.18 280.263 224.624 284.036 211.953 271.942 C 201.611 262.07 191.718 256.405 190.998 242.95 Z" transform="matrix(0.9999859929084778, -0.005217000376433134, 0.005217000376433134, 0.9999859929084778, -1.2487570047378824, 1.1939220428466797)"/>
  <style>
    path { stroke: #000; }
    @media (prefers-color-scheme: dark) {
        path { stroke: #FFF; }
    }
    </style>
</svg>
```

The important bit is between the `<style>` tags, you might also want to change the `fill` property, depending on your icon.

Finally, drop it into your headers with

```html
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
```

And don't forget to add a old time ico to support older browsers.

```html
<link rel="icon" href="/favicon.ico" sizes="any">
```

Using `sizes="any"` makes the browser download only the SVG icon.

Have a look at an [example](https://github.com/scristobal/unicorn-website/blob/master/public/favicon.svg?short_path=0680eca
).

[How to Favicon in 2024: Six files that fit most needs](https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs)
