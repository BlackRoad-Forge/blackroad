import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app, homeworks, resetId } from '../index.js';

// Helper: create a homework item and return the response body
async function createHomework(title = 'Math', description = 'Chapter 1') {
  const res = await request(app)
    .post('/api/homework')
    .send({ title, description });
  return res.body;
}

describe('API Server', () => {
  beforeEach(() => {
    homeworks.length = 0;
    resetId();
  });

  // ── Health ────────────────────────────────────────────────────────

  describe('GET /api/health', () => {
    it('returns 200 with { ok: true }', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ ok: true });
    });
  });

  // ── CORS ──────────────────────────────────────────────────────────

  describe('CORS middleware', () => {
    it('sets Access-Control-Allow-Origin to *', async () => {
      const res = await request(app).get('/api/health');
      expect(res.headers['access-control-allow-origin']).toBe('*');
    });

    it('includes PUT and DELETE in allowed methods', async () => {
      const res = await request(app).get('/api/health');
      expect(res.headers['access-control-allow-methods']).toBe(
        'GET,POST,PUT,DELETE,OPTIONS',
      );
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

  // ── List homework ─────────────────────────────────────────────────

  describe('GET /api/homework', () => {
    it('returns an empty array initially', async () => {
      const res = await request(app).get('/api/homework');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('returns all homework items after creation', async () => {
      await createHomework('Math', 'Chapter 1');
      await createHomework('Science', 'Lab report');

      const res = await request(app).get('/api/homework');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body[0].title).toBe('Math');
      expect(res.body[1].title).toBe('Science');
    });

    it('filters by search query matching title', async () => {
      await createHomework('Algebra', 'Solve equations');
      await createHomework('Biology', 'Cell division');

      const res = await request(app).get('/api/homework?search=algebra');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].title).toBe('Algebra');
    });

    it('filters by search query matching description', async () => {
      await createHomework('Math', 'Quadratic equations');
      await createHomework('English', 'Write an essay');

      const res = await request(app).get('/api/homework?search=essay');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].title).toBe('English');
    });

    it('search is case-insensitive', async () => {
      await createHomework('Physics', 'Newton laws');

      const res = await request(app).get('/api/homework?search=NEWTON');
      expect(res.body).toHaveLength(1);
    });

    it('returns empty array when search matches nothing', async () => {
      await createHomework('Art', 'Paint a landscape');

      const res = await request(app).get('/api/homework?search=chemistry');
      expect(res.body).toEqual([]);
    });
  });

  // ── Get single homework ───────────────────────────────────────────

  describe('GET /api/homework/:id', () => {
    it('returns the homework item by id', async () => {
      const hw = await createHomework('History', 'Read chapter 5');

      const res = await request(app).get(`/api/homework/${hw.id}`);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        id: hw.id,
        title: 'History',
        description: 'Read chapter 5',
      });
    });

    it('returns 404 for a non-existent id', async () => {
      const res = await request(app).get('/api/homework/9999');
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Homework not found');
    });

    it('includes completed and createdAt fields', async () => {
      const hw = await createHomework('Geo', 'Map work');

      const res = await request(app).get(`/api/homework/${hw.id}`);
      expect(res.body.completed).toBe(false);
      expect(res.body.createdAt).toBeDefined();
    });
  });

  // ── Create homework ───────────────────────────────────────────────

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

    it('assigns sequential numeric ids', async () => {
      const hw1 = await createHomework('A', 'B');
      const hw2 = await createHomework('C', 'D');

      expect(hw1.id).toBe(1);
      expect(hw2.id).toBe(2);
    });

    it('sets completed to false by default', async () => {
      const hw = await createHomework('Test', 'Desc');
      expect(hw.completed).toBe(false);
    });

    it('includes a createdAt timestamp', async () => {
      const hw = await createHomework('Test', 'Desc');
      expect(hw.createdAt).toBeDefined();
      // Should be a valid ISO date string
      expect(new Date(hw.createdAt).toISOString()).toBe(hw.createdAt);
    });
  });

  // ── Update homework ───────────────────────────────────────────────

  describe('PUT /api/homework/:id', () => {
    it('updates an existing homework item', async () => {
      const hw = await createHomework('Old Title', 'Old Desc');

      const res = await request(app)
        .put(`/api/homework/${hw.id}`)
        .send({ title: 'New Title', description: 'New Desc' });

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('New Title');
      expect(res.body.description).toBe('New Desc');
    });

    it('preserves the original id', async () => {
      const hw = await createHomework('X', 'Y');

      const res = await request(app)
        .put(`/api/homework/${hw.id}`)
        .send({ title: 'A', description: 'B' });

      expect(res.body.id).toBe(hw.id);
    });

    it('allows setting completed to true', async () => {
      const hw = await createHomework('Task', 'Do it');

      const res = await request(app)
        .put(`/api/homework/${hw.id}`)
        .send({ title: 'Task', description: 'Do it', completed: true });

      expect(res.status).toBe(200);
      expect(res.body.completed).toBe(true);
    });

    it('preserves completed if not sent in body', async () => {
      const hw = await createHomework('Task', 'Do it');

      // First mark as completed
      await request(app)
        .put(`/api/homework/${hw.id}`)
        .send({ title: 'Task', description: 'Do it', completed: true });

      // Update title only, omit completed
      const res = await request(app)
        .put(`/api/homework/${hw.id}`)
        .send({ title: 'Updated', description: 'Do it' });

      expect(res.body.completed).toBe(true);
    });

    it('returns 404 for a non-existent id', async () => {
      const res = await request(app)
        .put('/api/homework/9999')
        .send({ title: 'X', description: 'Y' });

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Homework not found');
    });

    it('returns 400 when title is missing', async () => {
      const hw = await createHomework('T', 'D');

      const res = await request(app)
        .put(`/api/homework/${hw.id}`)
        .send({ description: 'Only desc' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Title and description are required');
    });

    it('returns 400 when description is missing', async () => {
      const hw = await createHomework('T', 'D');

      const res = await request(app)
        .put(`/api/homework/${hw.id}`)
        .send({ title: 'Only title' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Title and description are required');
    });

    it('persists updates in the list', async () => {
      const hw = await createHomework('Original', 'Desc');

      await request(app)
        .put(`/api/homework/${hw.id}`)
        .send({ title: 'Changed', description: 'Desc' });

      const list = await request(app).get('/api/homework');
      expect(list.body[0].title).toBe('Changed');
    });
  });

  // ── Delete homework ───────────────────────────────────────────────

  describe('DELETE /api/homework/:id', () => {
    it('removes the item and returns the deleted object', async () => {
      const hw = await createHomework('Doomed', 'Gone soon');

      const res = await request(app).delete(`/api/homework/${hw.id}`);
      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Doomed');
    });

    it('removes the item from the list', async () => {
      const hw = await createHomework('Remove me', 'Desc');

      await request(app).delete(`/api/homework/${hw.id}`);

      const list = await request(app).get('/api/homework');
      expect(list.body).toHaveLength(0);
    });

    it('only removes the targeted item', async () => {
      const hw1 = await createHomework('Keep', 'A');
      const hw2 = await createHomework('Remove', 'B');
      const hw3 = await createHomework('Keep too', 'C');

      await request(app).delete(`/api/homework/${hw2.id}`);

      const list = await request(app).get('/api/homework');
      expect(list.body).toHaveLength(2);
      expect(list.body.map((h) => h.title)).toEqual(['Keep', 'Keep too']);
    });

    it('returns 404 for a non-existent id', async () => {
      const res = await request(app).delete('/api/homework/9999');
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Homework not found');
    });

    it('returns 404 if the same item is deleted twice', async () => {
      const hw = await createHomework('Once', 'Only');

      await request(app).delete(`/api/homework/${hw.id}`);
      const res = await request(app).delete(`/api/homework/${hw.id}`);

      expect(res.status).toBe(404);
    });
  });
});
