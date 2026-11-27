import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { buildOpenApiDocument } from './openapi';

describe('OpenAPI document', () => {
  it('is up to date with the contracts (run `pnpm --filter @app/contracts openapi`)', () => {
    const committed = readFileSync(resolve(__dirname, '../../../docs/api/openapi.json'), 'utf8');
    expect(JSON.parse(committed)).toEqual(JSON.parse(JSON.stringify(buildOpenApiDocument())));
  });
});
