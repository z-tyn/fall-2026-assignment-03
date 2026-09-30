import { Router } from 'express';
import express from 'express';

const router = Router();
export const app = express();
app.use(express.json());

import {
    getAllUsers,
    getUserById,
    createUser,
} from './dal/users.ts';

import {User} from './db/database.ts';
import { create } from 'domain';

// TODO: Student implementation - Part 1: User Routes
// GET /users
app.get('/users', async function(req, res){
    return getAllUsers();
});

// GET /users/:id
app.get('/users/:id', async function(req, res){
    try {
        return getUserById(req);
    } catch {
        res.status(404).json({error: 'ID not found'});
        return;
    }
});

// POST /users
app.post('/users', async function(req, res){
    const newUser = createUser(req);
    res.status(201).json(newUser);
});

export default router;
