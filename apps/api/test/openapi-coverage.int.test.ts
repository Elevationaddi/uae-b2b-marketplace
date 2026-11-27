/** Every route the API serves is documented in the generated OpenAPI document, and vice versa. */
import type { INestApplication } from '@nestjs/common';
import { API_ROUTES } from '@app/contracts/dist/openapi';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { makeApp } from './helpers';

type Layer = { route?: { path: string; methods: Record<string, boolean> } };

describe('OpenAPI coverage', () => {
  let app: INestApplication;
  let close: () => Promise<void>;
  beforeAll(async () => {
    const made = await makeApp();
    app = made.app;
    close = async () => {
      await made.app.close();
      await made.prisma.$disconnect();
    };
  });
  afterAll(async () => {
    await close?.();
  });

  it('documents exactly the routes the API serves', () => {
    const express = app.getHttpAdapter().getInstance() as {
      router?: { stack: Layer[] };
      _router?: { stack: Layer[] };
    };
    const stack = (express.router ?? express._router)!.stack;
    const served = stack
      // Ignore catch-all layers (e.g. the not-found handler registered for every method).
      .filter(
        (l) =>
          l.route &&
          Object.keys(l.route.methods).length <= 3 &&
          l.route.path.startsWith('/api/v1/'),
      )
      .flatMap((l) =>
        Object.keys(l.route!.methods)
          .filter((m) => m !== '_all' && m !== 'head')
          .map((m) => `${m.toUpperCase()} ${l.route!.path.replace(/:(\w+)/g, '{$1}')}`),
      )
      .sort();
    const documented = API_ROUTES.map((r) => `${r.method.toUpperCase()} /api/v1${r.path}`).sort();
    expect(served).toEqual(documented);
  });
});
