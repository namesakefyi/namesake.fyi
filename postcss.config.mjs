export default {
  plugins: {
    autoprefixer: {},
    "postcss-utopia": {
      minWidth: 320,
      maxWidth: 1240,
    },
    "postcss-media-minmax": {},
    "@csstools/postcss-logical-viewport-units": {},
    "postcss-clamp": {},
    cssnano: {},
  },
};
