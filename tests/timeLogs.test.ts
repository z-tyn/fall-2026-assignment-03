import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/index.js';

describe('Part 2: Time Logs Tests', () => {
  let ticketId: number;
  it('should log hours correctly', async () => {
    // TODO: Student implementation - Part 2: Time Logging Tests
    // Log hours for a ticket (POST /tickets/:id/time)
    const ticketRes = await request(app)
      .post('/tickets')
      .set('X-User-Id', '1')
      .send({
        title: "TestTicket",
        description: "Something Describing It",
        assignee_id: 2,
      });
    
    expect(ticketRes.statusCode).toEqual(201);
    ticketId = ticketRes.body.id ?? ticketRes.body.ticketId;

    const log1 = await request(app)
      .post(`/tickets/${ticketId}/time`)
      .set('X-User-Id', '1')
      .send({ hours: 2.5 });

    const log2 = await request(app)
      .post(`/tickets/${ticketId}/time`)
      .set('X-User-Id', '1')
      .send({ hours: 3.5 });
  });

    // Fetch total hours for a ticket (GET /tickets/:id/time)
  it('should get total hours correctly', async () => {
    const sumRes = await request(app).get(`/tickets/${ticketId}/time`);
        
    // Verify aggregation math
    expect(sumRes.statusCode).toBe(200);
    expect(sumRes.body).toEqual({
      ticket_id: ticketId,
      total_hours: 6,
    })
  });
});
