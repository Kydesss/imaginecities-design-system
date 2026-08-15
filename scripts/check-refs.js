#!/usr/bin/env node
/**
 * Cross-checks the DSDS document against the DTCG token file.
 *
 * ajv only proves the DSDS document matches the schema. It cannot know whether a
 * token's `source.path` points at a token that actually exists, whether a
 * relationship target names a real entity, or whether a superseded 2021 brand value
 * has crept in. This checks those.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DSDS_DIR = path.join(ROOT, 'dsds');

/**
 * Values from the superseded 2021 "Design Guidelines.pdf". None may appear in the
 * token file. Only `tokens/tokens.json` is scanned: it is the file that carries real
 * values, whereas the DSDS document names these same words on purpose, to forbid them.
 */
const FORBIDDEN = [
  { pattern: /montserrat/i, why: '2021 brand font' },
  { pattern: /#F9AF42/i, why: '2021 gold' },
  { pattern: /\bviridian\b/i, why: '2021 palette colour' },
  { pattern: /\bturquoise\b/i, why: '2021 palette colour' },
  { pattern: /\baqua\b/i, why: '2021 palette colour' }
];

const problems = [];
const fail = (msg) => problems.push(msg);

function resolveDtcgPath(tokens, dotPath) {
  return dotPath
    .split('.')
    .reduce((node, key) => (node && typeof node === 'object' ? node[key] : undefined), tokens);
}

function collect(entity, acc) {
  if (entity.identifier) {
    if (acc.identifiers.has(entity.identifier)) {
      fail(`duplicate entity identifier: ${entity.identifier}`);
    }
    acc.identifiers.add(entity.identifier);
  }
  if (entity.source && entity.source.path) {
    acc.sources.push({ id: entity.identifier, ...entity.source });
  }
  for (const rel of entity.relationships || []) {
    acc.relations.push({ id: entity.identifier, target: rel.target });
  }
  for (const block of entity.documentBlocks || []) {
    if (block.kind === 'scale') {
      for (const step of block.steps || []) {
        if (step.token) acc.scaleSteps.push({ scale: block.identifier, token: step.token });
      }
    }
  }
  for (const child of entity.children || []) collect(child, acc);
}

function checkDocument(file) {
  const doc = JSON.parse(fs.readFileSync(file, 'utf8'));
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  const acc = { identifiers: new Set(), sources: [], relations: [], scaleSteps: [] };

  for (const group of doc.entityGroups || []) {
    for (const entity of group.entities || []) collect(entity, acc);
  }
  if (doc.entity) collect(doc.entity, acc);

  const tokenFiles = new Map();
  for (const source of acc.sources) {
    const tokenFile = path.resolve(path.dirname(file), source.file);
    if (!tokenFiles.has(tokenFile)) {
      if (!fs.existsSync(tokenFile)) {
        fail(`${rel}: ${source.id} points at a missing token file: ${source.file}`);
        tokenFiles.set(tokenFile, null);
      } else {
        tokenFiles.set(tokenFile, JSON.parse(fs.readFileSync(tokenFile, 'utf8')));
      }
    }
    const tokens = tokenFiles.get(tokenFile);
    if (tokens && resolveDtcgPath(tokens, source.path) === undefined) {
      fail(`${rel}: ${source.id} points at a path absent from ${source.file}: ${source.path}`);
    }
  }

  for (const { id, target } of acc.relations) {
    if (!acc.identifiers.has(target)) {
      fail(`${rel}: ${id} relates to an undocumented entity: ${target}`);
    }
  }
  for (const { scale, token } of acc.scaleSteps) {
    if (!acc.identifiers.has(token)) {
      fail(`${rel}: scale ${scale} references an undocumented token: ${token}`);
    }
  }

  return {
    file: rel,
    entities: acc.identifiers.size,
    sources: acc.sources.length,
    relations: acc.relations.length,
    scaleSteps: acc.scaleSteps.length
  };
}

function checkForbidden(files) {
  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    for (const { pattern, why } of FORBIDDEN) {
      const match = text.match(pattern);
      if (match) {
        fail(
          `${path.relative(ROOT, file).replace(/\\/g, '/')}: contains "${match[0]}" (${why}) — ` +
            'the 2021 Design Guidelines.pdf is superseded'
        );
      }
    }
  }
}

const docs = fs
  .readdirSync(DSDS_DIR)
  .filter((name) => name.endsWith('.json'))
  .map((name) => path.join(DSDS_DIR, name));

if (docs.length === 0) {
  console.error('no DSDS documents found in dsds/');
  process.exit(1);
}

for (const doc of docs) {
  const summary = checkDocument(doc);
  console.log(
    `${summary.file}: ${summary.entities} entities, ${summary.sources} token sources, ` +
      `${summary.relations} relationships, ${summary.scaleSteps} scale steps`
  );
}

checkForbidden([path.join(ROOT, 'tokens', 'tokens.json')]);

if (problems.length > 0) {
  console.error(`\n${problems.length} problem(s):`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}

console.log('refs resolve; no superseded 2021 values present');
