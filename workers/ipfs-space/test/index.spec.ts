import { describe, it, expect, vi, beforeEach } from 'vitest';
import worker from '../src/index';

describe('ipfs-space worker', () => {
  const mockCtx = {
    waitUntil: vi.fn(),
    passThroughOnException: vi.fn(),
  } as unknown as ExecutionContext;

  const mockEnv = {};

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should return 405 for non-GET requests', async () => {
    const request = new Request('https://ipfs.example.com/test.png', {
      method: 'DELETE',
    });
    const response = await worker.fetch(request, mockEnv, mockCtx);
    expect(response.status).toBe(405);
    expect(await response.text()).toBe('Method not allowed');
  });

  it('should fetch from Fleek IPFS storage bucket on cache miss', async () => {
    const mockMatch = vi.fn().mockResolvedValue(null);
    const mockPut = vi.fn().mockResolvedValue(undefined);
    (globalThis as unknown as { caches: { default: unknown } }).caches = {
      default: {
        match: mockMatch,
        put: mockPut,
      },
    };

    const mockResponseBody = 'fake-ipfs-content';
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(mockResponseBody, {
        status: 200,
        statusText: 'OK',
      })
    );
    (globalThis as unknown as { fetch: unknown }).fetch = mockFetch;

    const request = new Request('https://ipfs.example.com/bafybeic...', {
      method: 'GET',
    });

    const response = await worker.fetch(request, mockEnv, mockCtx);

    expect(mockFetch).toHaveBeenCalledWith(
      'https://storageapi.fleek.co/ss-o-team-bucket/bafybeic...'
    );
    expect(response.status).toBe(200);
    expect(response.headers.get('Cache-Control')).toBe('public, max-age=14400');
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
    expect(mockCtx.waitUntil).toHaveBeenCalled();
  });

  it('should return cached response on cache hit', async () => {
    const cachedResponse = new Response('cached-ipfs-content', {
      status: 200,
    });
    const mockMatch = vi.fn().mockResolvedValue(cachedResponse);
    const mockPut = vi.fn();
    (globalThis as unknown as { caches: { default: unknown } }).caches = {
      default: {
        match: mockMatch,
        put: mockPut,
      },
    };

    const mockFetch = vi.fn();
    (globalThis as unknown as { fetch: unknown }).fetch = mockFetch;

    const request = new Request('https://ipfs.example.com/cached-file', {
      method: 'GET',
    });

    const response = await worker.fetch(request, mockEnv, mockCtx);

    expect(mockFetch).not.toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(await response.text()).toBe('cached-ipfs-content');
  });
});
