import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import { app } from '../server_full.js';

describe('server_full.js', () => {
  describe('GET /api/hello', () => {
    it('returns 200 with greeting message', async () => {
      const res = await request(app).get('/api/hello');
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Hello World from BlackRoad.io + Lucidia 🚀');
    });
  });

  describe('GET /health', () => {
    it('returns 200 with service status', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: 'ok', service: 'blackroad-api' });
    });
  });

  describe('POST /api/llm/chat', () => {
    let originalFetch;

    beforeEach(() => {
      originalFetch = globalThis.fetch;
    });

    afterEach(() => {
      globalThis.fetch = originalFetch;
    });

    it('returns 400 when message is missing', async () => {
      const res = await request(app)
        .post('/api/llm/chat')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('message (string) required');
    });

    it('returns 400 when message is not a string', async () => {
      const res = await request(app)
        .post('/api/llm/chat')
        .send({ message: 123 });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('message (string) required');
    });

    it('returns 400 when message is empty/whitespace', async () => {
      const res = await request(app)
        .post('/api/llm/chat')
        .send({ message: '   ' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('message (string) required');
    });

    it('returns 400 when body is null', async () => {
      const res = await request(app)
        .post('/api/llm/chat')
        .send(null);

      expect(res.status).toBe(400);
    });

    it('forwards message to Lucidia and returns reply', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        json: () => Promise.resolve({ reply: 'Hello from Lucidia!' }),
      });

      const res = await request(app)
        .post('/api/llm/chat')
        .send({ message: 'Hi there' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ reply: 'Hello from Lucidia!' });

      // Verify the upstream call was made correctly
      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://127.0.0.1:8000/chat',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: 'Hi there' }),
        },
      );
    });

    it('uses full response as reply when reply field is absent', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        json: () => Promise.resolve({ text: 'raw response' }),
      });

      const res = await request(app)
        .post('/api/llm/chat')
        .send({ message: 'test' });

      expect(res.status).toBe(200);
      expect(res.body.reply).toEqual({ text: 'raw response' });
    });

    it('returns 502 when upstream is unreachable', async () => {
      globalThis.fetch = vi.fn().mockRejectedValue(new Error('ECONNREFUSED'));

      const res = await request(app)
        .post('/api/llm/chat')
        .send({ message: 'Hello' });

      expect(res.status).toBe(502);
      expect(res.body.error).toBe('Lucidia LLM not reachable');
    });

    it('returns 502 when upstream returns invalid JSON', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        json: () => Promise.reject(new SyntaxError('Unexpected token')),
      });

      const res = await request(app)
        .post('/api/llm/chat')
        .send({ message: 'Hello' });

      expect(res.status).toBe(502);
      expect(res.body.error).toBe('Lucidia LLM not reachable');
    });
  });
});
