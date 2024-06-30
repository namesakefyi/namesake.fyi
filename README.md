# namesake.fyi

This repository contains the source code for the [namesake.fyi](https://namesake.fyi) website and blog, built with [Astro](https://astro.build).

If you need help with your legal name change or gender marker change, come join us in [Discord](https://namesake.fyi/chat)!

## Directory Structure

| Location         | Description                                                             |
| :--------------- | :---------------------------------------------------------------------- |
| `public`         | Images, fonts, favicons, and app icons.                                 |
| `src/components` | All of the .astro components that are used and reused across the site.  |
| `src/content`    | Content collections for blog posts, partners, press, and other content. |
| `src/data`       | Shared data for site info and colors.                                   |
| `src/helpers`    | Helper functions and other utilities.                                   |
| `src/layouts`    | Shared layout files for wrapping pages.                                 |
| `src/pages`      | Page-based routing for everything on the site.                          |
| `src/styles`     | Global site styles.                                                     |
| `tests`          | End-to-end tests written using Playwright.                              |

## Accessibility

[![Accessibility](https://github.com/namesakefyi/namesake.fyi/actions/workflows/accessibility.yml/badge.svg)](https://github.com/namesakefyi/namesake.fyi/actions/workflows/accessibility.yml)

Namesake aims to conform to the Level AA accessibility standards outlined in the [WCAG 2.2 specification](https://www.w3.org/TR/WCAG22/). If you experience an issue with accessing any part of this site, please [file an issue](https://github.com/namesakefyi/namesake.fyi/issues) and we will correct it.

## Link Checking

[![Valid Links](https://github.com/namesakefyi/namesake.fyi/actions/workflows/links.yml/badge.svg)](https://github.com/namesakefyi/namesake.fyi/actions/workflows/links.yml)

A weekly [GitHub workflow](https://github.com/namesakefyi/namesake.fyi/actions/workflows/links.yml) scans the site for broken links and will open an [issue](https://github.com/namesakefyi/namesake.fyi/issues) if one is found.
