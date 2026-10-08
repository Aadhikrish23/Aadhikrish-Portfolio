// Public-site colors are CSS-variable tokens (see index.css, scoped to .site).
// Admin keeps its slate classes.
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: token("canvas"),
        surface: token("surface"),
        line: token("line"),
        fg: token("fg"),
        muted: token("muted"),
        subtle: token("subtle"),
        brown: token("brown"),
        accent: token("accent"),
        "on-accent": token("on-accent"),
      },
      fontFamily: {
        display: ['"Bodoni Moda Variable"', "Georgia", "serif"],
        sans: ['"Geist Variable"', "system-ui", "sans-serif"],
      },
      animation: {
        blob: "blob 7s infinite",
        marquee: "marquee 40s linear infinite",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp'), require('@tailwindcss/typography')],
}
