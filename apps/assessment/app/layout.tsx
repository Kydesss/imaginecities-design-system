import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './tokens.css';
import './globals.css';

/**
 * Poppins is the brand font (v2.0.1 §3). Loaded through next/font so it is self-hosted
 * and preloaded rather than fetched from a third party at runtime: no render-blocking
 * request, no layout shift, and one less external origin for a government-facing
 * product to justify in a privacy review.
 *
 * Only the four weights the type scale uses. The published tool also loads 300, which
 * is not a brand weight.
 */
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--ic-font-poppins',
});

export const metadata: Metadata = {
  title: 'Neighbourhood Adaptability Assessment | Imagine Cities',
  description:
    "Five questions, about five minutes. Understand where your neighbourhood stands today, and what to do about it.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA" className={poppins.variable}>
      <head>
        {/*
          Material Symbols, outlined, per v2.0.1 §4.2. Loaded by link rather than
          next/font because it is an icon font with variable axes; FILL 0 keeps the
          outlined style the brand specifies. Every icon in the app is aria-hidden and
          sits beside text that carries the meaning.
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/*
          display=block, not swap. With swap, an icon font shows its fallback first,
          which for a ligature font means the literal words "lock" and "location_city"
          flashing on screen before the glyphs arrive. block renders nothing until the
          font loads, which is the right trade when the text is a glyph name.

          eslint's no-page-custom-font rule also fires here. It is a pages-router rule
          about fonts outside _document; this is the app router's root layout, which is
          the equivalent place, so the warning does not apply.
        */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=block"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
