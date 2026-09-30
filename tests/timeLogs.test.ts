import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../src/index.js';

describe('Part 2: Time Logs Tests', () => {
  let userId: number;
  let ticketId: number;

  beforeAll(async () => {
    const userRes = await request(app)
      .post('/users')
      .send({
        name: 'TimeLog Tester',
        email: 'tester@example.com',
      });

    userId = userRes.body.id ?? userRes.body.userId;

    const ticketRes = await request(app)
      .post('/tickets')
      .set('X-User-Id', String(userId))
      .send({
        title: 'TestTicket',
        description: 'Something Describing It',
        assignee_id: null, 
      });

    ticketId = ticketRes.body.id ?? ticketRes.body.ticketId;
  });

  it('should log hours correctly (POST)', async () => {
    const log1 = await request(app)
      .post(`/tickets/${ticketId}/time`)
      .set('X-User-Id', String(userId))
      .send({ hours: 2.5 });

    expect(log1.statusCode).toBe(201);

    const log2 = await request(app)
      .post(`/tickets/${ticketId}/time`)
      .set('X-User-Id', String(userId))
      .send({ hours: 3.5 });
    
    expect(log2.statusCode).toBe(201);
  });

    // Fetch total hours for a ticket (GET /tickets/:id/time)
  it('should get total hours correctly', async () => {
    const sumRes = await request(app).get(`/tickets/${ticketId}/time`);
        
    // Verify aggregation math
    expect(sumRes.statusCode).toBe(200);
    expect(sumRes.body).toMatchObject({
      ticket_id: ticketId,
      total_hours: 6,
    })
  });
});
