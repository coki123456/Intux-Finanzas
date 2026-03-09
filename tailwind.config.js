/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#18181b", // Zinc 900
          foreground: "#fafafa", // Zinc 50
        },
        secondary: {
          DEFAULT: "#f4f4f5", // Zinc 100
          foreground: "#18181b", // Zinc 900
        },
        destructive: {
          DEFAULT: "#ef4444", // Red 500
          foreground: "#fafafa",
        },
        muted: {
          DEFAULT: "#f4f4f5", // Zinc 100
          foreground: "#71717a", // Zinc 500
        },
        accent: {
          DEFAULT: "#f4f4f5", // Zinc 100
          foreground: "#18181b", // Zinc 900
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};
