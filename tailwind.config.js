/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      animation: {
        "spin-slow": "spin 15s linear infinite",
        shimmer: "shimmer 1.5s linear infinite",
        grow: "grow 3s linear",
        "fade-in": "fade-in 200ms ease-in-out",
        "dot-flashing": "dot-flashing 1s infinite linear alternate",
        "infinite-scroll": "infinite-scroll 20s linear infinite",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        btn: {
          background: "hsl(var(--btn-background))",
          "background-hover": "hsl(var(--btn-background-hover))",
        },
      },
      boxShadow: {
        modal: "0 4px 20px 4px rgba(0, 0, 0, 0.1)",
        "centered-sm": "rgba(99, 99, 99, 0.15) 0 0 4px",
        "centered-md": "rgba(99, 99, 99, 0.15) 0 0 8px",
        "centered-lg": "rgba(99, 99, 99, 0.15) 0 0 16px",
        "dark-sm": "rgba(0,0,0,.15) 0 2px 3px 0",
        "centered-white": "0 0 0 4px white",
      },
      width: {
        100: "400px",
      },
      keyframes: {
        shimmer: {
          "100%": { "-webkit-mask-position": "left" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "dot-flashing": {
          "0%": {
            opacity: "1",
          },
          "30%, 100%": {
            opacity: "0.2",
          },
        },
        grow: {
          "0%": {
            transform: "scale(0.2)",
          },
          "100%": {
            transform: "scale(1)",
          },
        },
        "infinite-scroll": {
          from: {
            transform: "translateX(0)",
          },
          to: {
            transform: "translateX(-50%)",
          },
        },
      },
    },
  },
  plugins: [],
};
