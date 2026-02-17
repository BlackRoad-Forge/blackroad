import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app, homeworks } from '../index.js';

describe('API Server', () => {
  // Clear homework state between tests
  beforeEach(() => {
    homeworks.length = 0;
  });

  describe('GET /api/health', () => {
    it('returns 200 with { ok: true }', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ ok: true });
    });
  });

  describe('CORS middleware', () => {
    it('sets Access-Control-Allow-Origin to *', async () => {
      const res = await request(app).get('/api/health');
      expect(res.headers['access-control-allow-origin']).toBe('*');
    });

    it('sets Access-Control-Allow-Methods header', async () => {
      const res = await request(app).get('/api/health');
      expect(res.headers['access-control-allow-methods']).toBe('GET,POST,OPTIONS');
    });

    it('sets Access-Control-Allow-Headers header', async () => {
      const res = await request(app).get('/api/health');
      expect(res.headers['access-control-allow-headers']).toBe('Content-Type');
    });

    it('returns 200 for OPTIONS preflight requests', async () => {
      const res = await request(app).options('/api/homework');
      expect(res.status).toBe(200);
    });
  });

  describe('GET /api/homework', () => {
    it('returns an empty array initially', async () => {
      const res = await request(app).get('/api/homework');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('returns all homework items after creation', async () => {
      // Create two items
      await request(app)
        .post('/api/homework')
        .send({ title: 'Math', description: 'Chapter 1' });
      await request(app)
        .post('/api/homework')
        .send({ title: 'Science', description: 'Lab report' });

      const res = await request(app).get('/api/homework');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body[0].title).toBe('Math');
      expect(res.body[1].title).toBe('Science');
    });
  });

  describe('POST /api/homework', () => {
    it('creates a homework item and returns 201', async () => {
      const res = await request(app)
        .post('/api/homework')
        .send({ title: 'English', description: 'Essay on Shakespeare' });

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        title: 'English',
        description: 'Essay on Shakespeare',
      });
      expect(res.body.id).toBeDefined();
    });

    it('returns 400 when title is missing', async () => {
      const res = await request(app)
        .post('/api/homework')
        .send({ description: 'Some description' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Title and description are required');
    });

    it('returns 400 when description is missing', async () => {
      const res = await request(app)
        .post('/api/homework')
        .send({ title: 'Some title' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Title and description are required');
    });

    it('returns 400 when body is empty', async () => {
      const res = await request(app)
        .post('/api/homework')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Title and description are required');
    });

    it('assigns a unique numeric id to each item', async () => {
      const res1 = await request(app)
        .post('/api/homework')
        .send({ title: 'A', description: 'B' });
      const res2 = await request(app)
        .post('/api/homework')
        .send({ title: 'C', description: 'D' });

      expect(typeof res1.body.id).toBe('number');
      expect(typeof res2.body.id).toBe('number');
      expect(res1.body.id).not.toBe(res2.body.id);
    });
  });
});
