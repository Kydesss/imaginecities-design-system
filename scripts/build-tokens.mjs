#!/usr/bin/env node
/**
 * Generates CSS custom properties from tokens/tokens.json.
 *
 * This is the point of the repo. Until now every page hand-copied hex values out of
 * the token file, which is exactly the drift the system exists to prevent: the live
 * website carries #D4DDC2 where the brand says #D4DCC1, and nobody noticed because
 * nothing checked. A generated file cannot drift.
 *
 * The output is committed so the app builds without a prebuild step, and regenerating
 * is idempotent, so a stale file shows up as a diff in review.
 *
 * Naming: dots become dashes, so color.tint.gold.20 is --ic-color-tint-gold-20.
 * DTCG aliases like {color.gold} become var() references rather than resolved values,
 * so the alias relationship survives into CSS.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TOKENS = path.join(ROOT, 'tokens', 'tokens.json');
const OUT = path.join(ROOT, 'apps', 'assessment', 'app', 'tokens.css');

const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
const toVar = (dotPath) => `--ic-${dotPath.split('.').map(kebab).join('-')}`;

/** DTCG alias: "{color.gold}" -> "var(--ic-color-gold)" */
function resolveValue(value) {
  if (typeof value !== 'string') return value;
  const alias = value.match(/^\{([^}]+)\}$/);
  return alias ? `var(${toVar(alias[1])})` : value;
}

/**
 * DTCG expresses some typography values in units CSS does not accept in that property.
 * Translating here rather than in every consumer keeps the token file faithful to the
 * deck while the CSS stays valid.
 */
function cssValueFor(prop, value) {
  const resolved = resolveValue(value);
  if (typeof resolved !== 'string') return resolved;

  // letter-spacing rejects percentages outright: `letter-spacing: -2%` is invalid and
  // browsers drop the declaration, silently losing the brand's tracking. The deck's
  // percentages are of the font size, which is exactly what em means here.
  if (prop === 'letterSpacing' && resolved.endsWith('%')) {
    const pct = parseFloat(resolved);
    return pct === 0 ? '0' : `${(pct / 100).toFixed(4).replace(/0+$/, '').replace(/\.$/, '')}em`;
  }

  // "Auto" in the deck means the font's own default, which in CSS is `normal`.
  if (prop === 'lineHeight' && /^auto$/i.test(resolved)) return 'normal';

  return resolved;
}

const lines = [];
const skipped = [];

function walk(node, trail = []) {
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith('$')) continue;
    if (!value || typeof value !== 'object') continue;

    const dotPath = [...trail, key].join('.');

    if ('$value' in value) {
      const raw = value.$value;

      // Composite tokens (typography) become one variable per sub-property, since CSS
      // has no way to hold the whole object.
      if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
        for (const [prop, sub] of Object.entries(raw)) {
          lines.push(`  ${toVar(`${dotPath}.${prop}`)}: ${cssValueFor(prop, sub)};`);
        }
        continue;
      }

      // fontFamily arrays become a quoted CSS font stack.
      if (Array.isArray(raw)) {
        const stack = raw.map((f) => (/\s/.test(f) ? `"${f}"` : f)).join(', ');
        lines.push(`  ${toVar(dotPath)}: ${stack};`);
        continue;
      }

      lines.push(`  ${toVar(dotPath)}: ${resolveValue(raw)};`);
      continue;
    }

    walk(value, [...trail, key]);
  }
}

const tokens = JSON.parse(fs.readFileSync(TOKENS, 'utf8'));
walk(tokens);

const header = `/*
 * GENERATED FILE - DO NOT EDIT.
 *
 * Produced by scripts/build-tokens.mjs from tokens/tokens.json, which is the single
 * source of truth for every brand value. Editing this file by hand reintroduces the
 * drift the generator exists to prevent.
 *
 * Regenerate with: npm run build:tokens
 *
 * NOT INCLUDED, deliberately: spacing, radii, motion and the intermediate type sizes.
 * None of those are documented in Brand Guidelines v2.0.1. They are proposals awaiting
 * the brand owner and live in the app's own stylesheet, clearly marked, so nobody
 * mistakes them for brand.
 */

:root {
${lines.join('\n')}
}
`;

const rel = path.relative(ROOT, OUT).replace(/\\/g, '/');

// --check verifies the committed file matches what the tokens produce now, without
// writing. Run in validate, so a token edit that never regenerated fails the build
// rather than shipping an app whose colours no longer match the brand.
if (process.argv.includes('--check')) {
  if (!fs.existsSync(OUT)) {
    console.error(`${rel} is missing. Run: npm run build:tokens`);
    process.exit(1);
  }
  if (fs.readFileSync(OUT, 'utf8') !== header) {
    console.error(`${rel} is out of date with tokens/tokens.json. Run: npm run build:tokens`);
    process.exit(1);
  }
  console.log(`${rel} is up to date (${lines.length} custom properties)`);
  process.exit(0);
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, header);

console.log(`wrote ${rel}`);
console.log(`${lines.length} custom properties from ${path.relative(ROOT, TOKENS).replace(/\\/g, '/')}`);
if (skipped.length) console.log(`skipped: ${skipped.join(', ')}`);
