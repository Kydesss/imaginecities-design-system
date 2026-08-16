#!/usr/bin/env node
/**
 * Fails if the app hardcodes a colour instead of using a generated token variable.
 *
 * The whole point of the token pipeline is that a colour cannot be typed by hand into
 * a component. This catches the case where someone pastes a hex because it was faster,
 * including the subtle one: a hex that IS a brand value but is written literally, which
 * looks correct today and silently stops tracking the brand tomorrow.
 *
 * rgba() values are allowed, since the brand documents no rule or border colours and
 * those live in globals.css as declared proposals.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const APP = path.join(ROOT, 'apps', 'assessment');
const GENERATED = path.join(APP, 'app', 'tokens.css');

const brandHexes = new Set();
(function collect(node) {
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith('$')) continue;
    if (value && typeof value === 'object' && '$value' in value) {
      if (typeof value.$value === 'string' && value.$value.startsWith('#')) {
        brandHexes.add(value.$value.toUpperCase());
      }
    } else if (value && typeof value === 'object') {
      collect(value);
    }
  }
})(JSON.parse(fs.readFileSync(path.join(ROOT, 'tokens', 'tokens.json'), 'utf8')));

const files = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.next') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(css|tsx|ts)$/.test(entry.name) && full !== GENERATED) files.push(full);
  }
})(APP);

const problems = [];
for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');
  const lines = source.split('\n');
  lines.forEach((line, i) => {
    // ignore comment lines: they cite ratios and rejected values on purpose
    if (/^\s*(\/\*|\*|\/\/)/.test(line)) return;
    for (const match of line.matchAll(/#[0-9A-Fa-f]{6}\b|#[0-9A-Fa-f]{3}\b/g)) {
      const hex = match[0].toUpperCase();
      const rel = path.relative(ROOT, file).replace(/\\/g, '/');
      problems.push(
        `${rel}:${i + 1}  ${hex}  ${
          brandHexes.has(hex)
            ? 'is a brand value but is hardcoded; use the generated var()'
            : 'is not a brand value'
        }`,
      );
    }
  });
}

if (problems.length) {
  console.error(`${problems.length} hardcoded colour(s) in the app:`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}

console.log(`no hardcoded colours across ${files.length} app files`);
