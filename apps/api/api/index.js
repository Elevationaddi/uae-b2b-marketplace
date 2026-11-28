// Vercel Function discovered under api/. The implementation is compiled by `pnpm build` into
// dist/vercel.js (Nest needs decorator metadata, so Vercel's own TypeScript step is not used).
// eslint-disable-next-line @typescript-eslint/no-require-imports -- CommonJS entry for Vercel
const { default: handler } = require('../dist/vercel.js');

module.exports = handler;
module.exports.config = { maxDuration: 60 };
