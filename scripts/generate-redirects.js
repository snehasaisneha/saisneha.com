#!/usr/bin/env node
/**
 * Generates Netlify _redirects from data/links.json.
 * Run before hugo build so /links/:slug redirects are included.
 *
 * Usage: node scripts/generate-redirects.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const LINKS_PATH = path.join(ROOT, 'data', 'links.json');
const REDIRECTS_PATH = path.join(ROOT, 'static', '_redirects');

const links = JSON.parse(fs.readFileSync(LINKS_PATH, 'utf8'));
const existing = fs.readFileSync(REDIRECTS_PATH, 'utf8');

// Only include own enumerable slug -> url entries (skip prototype etc.)
const linkEntries = Object.entries(links).filter(
  ([slug, url]) => typeof url === 'string' && !slug.startsWith('_')
);

const linkLines = linkEntries
  .map(([slug, url]) => `/links/${slug}  ${url}  302`)
  .join('\n');

// Keep only non-/links/ lines from existing (so we don't duplicate on each run)
const staticRules = existing
  .split('\n')
  .filter((line) => line.trim() && !line.trimStart().startsWith('/links/'))
  .join('\n');

const newRedirects = [linkLines, staticRules].filter(Boolean).join('\n');
fs.writeFileSync(REDIRECTS_PATH, newRedirects.trimEnd() + '\n', 'utf8');

console.log('Generated %d link redirect(s) in static/_redirects', linkEntries.length);
