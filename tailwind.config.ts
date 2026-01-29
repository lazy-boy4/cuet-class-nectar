
import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Monochrome Luxe palette
        luxe: {
          black: "#0A0A0B",
          charcoal: "#141416",
          dark: "#1C1C1F",
          gray: "#2A2A2E",
          silver: "#A8A8A8",
          platinum: "#E5E5E5",
          white: "#FFFFFF",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },
        chart: {
          present: "hsl(var(--chart-present))",
          absent: "hsl(var(--chart-absent))",
          late: "hsl(var(--chart-late))",
        },
        icon: {
          blue: "hsl(var(--icon-blue))",
          purple: "hsl(var(--icon-purple))",
          orange: "hsl(var(--icon-orange))",
          green: "hsl(var(--icon-green))",
          teal: "hsl(var(--icon-teal))",
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
      },
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans],
      },
      boxShadow: {
        // Neumorphic shadows
        "neu-raised": "8px 8px 16px rgba(0,0,0,0.4), -4px -4px 12px rgba(50,50,50,0.05)",
        "neu-raised-sm": "4px 4px 8px rgba(0,0,0,0.35), -2px -2px 6px rgba(50,50,50,0.04)",
        "neu-inset": "inset 4px 4px 8px rgba(0,0,0,0.5), inset -2px -2px 6px rgba(50,50,50,0.03)",
        "neu-button": "6px 6px 12px rgba(0,0,0,0.35), -3px -3px 8px rgba(50,50,50,0.04)",
        "neu-button-hover": "8px 8px 16px rgba(0,0,0,0.4), -4px -4px 10px rgba(50,50,50,0.05)",
        "neu-button-active": "inset 3px 3px 6px rgba(0,0,0,0.4), inset -2px -2px 4px rgba(50,50,50,0.03)",
        // Glow shadows
        "glow-blue": "0 0 20px rgba(59, 130, 246, 0.3)",
        "glow-subtle": "0 0 30px rgba(255,255,255,0.05)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0", opacity: "0" },
          to: { height: "var(--radix-accordion-content-height)", opacity: "1" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)", opacity: "1" },
          to: { height: "0", opacity: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-out": {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(10px)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)" },
          "50%": { boxShadow: "0 0 30px rgba(59, 130, 246, 0.5)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "fade-out": "fade-out 0.3s ease-out",
        "slide-up": "slide-up 0.4s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "shimmer": "shimmer 2s linear infinite",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
