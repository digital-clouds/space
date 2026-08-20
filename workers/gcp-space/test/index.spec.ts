import { describe, it, expect, vi, beforeEach } from 'vitest';
import worker from '../src/index';

describe('gcp-space worker', () => {
  const mockCtx = {
    waitUntil: vi.fn(),
    passThroughOnException: vi.fn(),
  } as unknown as ExecutionContext;

  const mockEnv = {};

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should return 405 for non-GET requests', async () => {
    const request = new Request('https://storage.w-ss.io/test.png', {
      method: 'POST',
    });
    const response = await worker.fetch(request, mockEnv, mockCtx);
    expect(response.status).toBe(405);
    expect(await response.text()).toBe('Method not allowed');
  });

  it('should fetch from gcp-space storage bucket on cache miss', async () => {
    const mockMatch = vi.fn().mockResolvedValue(null);
    const mockPut = vi.fn().mockResolvedValue(undefined);
    (globalThis as unknown as { caches: { default: unknown } }).caches = {
      default: {
        match: mockMatch,
        put: mockPut,
      },
    };

    const mockResponseBody = 'fake-gcp-data';
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(mockResponseBody, {
        status: 200,
        statusText: 'OK',
        headers: { 'Content-Type': 'application/octet-stream' },
      })
    );
    (globalThis as unknown as { fetch: unknown }).fetch = mockFetch;

    const request = new Request('https://storage.w-ss.io/file.bin', {
      method: 'GET',
    });

    const response = await worker.fetch(request, mockEnv, mockCtx);

    expect(mockFetch).toHaveBeenCalledWith('https://storage.googleapis.com/gcp-space/file.bin');
    expect(response.status).toBe(200);
    expect(response.headers.get('Cache-Control')).toBe('public, max-age=14400');
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
    expect(mockCtx.waitUntil).toHaveBeenCalled();
  });

  it('should return cached response on cache hit', async () => {
    const cachedResponse = new Response('cached-gcp-data', {
      status: 200,
      headers: { 'Cache-Control': 'public, max-age=14400' },
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

    const request = new Request('https://storage.w-ss.io/cached.bin', {
      method: 'GET',
    });

    const response = await worker.fetch(request, mockEnv, mockCtx);

    expect(mockFetch).not.toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(await response.text()).toBe('cached-gcp-data');
  });
});
