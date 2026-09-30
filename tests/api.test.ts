import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/index.js';

describe('Part 1: API Integration Tests', () => {
    // TODO: Student implementation - Part 1: Integration Testing
    // Test user creation (POST /users)
    describe('/user Routes', () => {
      it('should create a user', async () => {
        const createRes = await request(app)
          .post('/users')
          .send({
            name: 'Joe',
            email: 'something@somewhere.com',
          });

        expect(createRes.statusCode).toEqual(201);
        expect(createRes.body).toMatchObject({
          name: 'Joe',
          email: 'something@somewhere.com',
        });

        const userId = createRes.body.id ?? createRes.body.userId;
        const getRes = await request(app).get(`/users/${userId}`);
        expect(getRes.statusCode).toEqual(200);
        expect(getRes.body).toMatchObject({
          name: 'Joe',
          email: 'something@somewhere.com',
        });
      });
    });

    // Test ticket creation (POST /tickets)
    describe('/ticket Routes', () => {
      it('should create a ticket', async () => {
        const createRes = await request(app)
          .post('/tickets')
          .set('X-User-Id', '1')
          .send({
            title: "Ticket1",
            description: "Ticket for something",
            assignee_id: 200,
          });

        expect(createRes.statusCode).toEqual(201);
        expect(createRes.body).toMatchObject({
            title: "Ticket1",
            description: "Ticket for something",
            creator_id: 1,
            assignee_id: 200,
        });

        const ticketId = createRes.body.id ?? createRes.body.ticketId;
        const getRes = await request(app).get(`/tickets/${ticketId}`);
        expect(getRes.statusCode).toEqual(200);
        expect(getRes.body).toMatchObject({
          title: "Ticket1",
          description: "Ticket for something",
          creator_id: 1,
          assignee_id: 200,
        });
      });
    });

    // Test auth middleware rejection (401 when X-User-Id is missing or invalid)
    describe('Auth middleware failure', () => {
      it('should return 401 when X-User-Id header is missing or invalid', async () => {
      const res = await request(app)
        .post('/tickets')
        .send({
          title: 'Unauthenticated Ticket',
          description: 'Should fail',
        });

        expect(res.statusCode).toBe(401);
      });

      it('should return 401 when X-User-Id is NaN', async()=>{
        const res = await request(app)
          .post('/tickets')
          .set('X-User-Id', 'not a valid auth code')
          .send({
            title: 'Invalid Authentication ticket',
          });

          expect(res.statusCode).toBe(401);
      });
    });

    // Test 404 responses for non-existent users and tickets
    describe('404 responses for non-existant tickets/users', () => {
      it('should test 404 responses for users/tickets', async () => {
        const TicketRes = await request(app).get('/tickets/9999');
        expect(TicketRes.statusCode).toBe(404);

        const UserRes = await request(app).get('/users/9999');
        expect(UserRes.statusCode).toBe(404);
      });
    });

    // Test pagination and filtering on GET /tickets
    describe('Pagination on GET /tickets', () => {
      it('should correctly handle pagination for GET tickets', async () => {
        const res = await request(app)
          .get('/tickets')
          .query({limit: 5, offset: 0, status: 'TODO'});
        
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
      });
    });
});
