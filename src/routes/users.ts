import { Router, Request, Response } from 'express';
import {
    getAllUsers,
    getUserById,
    createUser,
} from '../dal/users.js';

const router = Router();

// TODO: Student implementation - Part 1: User Routes
// GET /users
router.get('/', async function(req, res) {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (error){
        res.status(404).json({error: 'Failed to get users'});
    }
});

// GET /users/:id
router.get('/:id', async function(req, res){
    try {
        const userId = Number(req.params.id);
        const user = await getUserById(userId);

        if (!user){
            res.status(404).json({error: 'ID not found'});
            return
        }

        res.json(user);

    } catch (error){
        res.status(404).json({error: 'ID not found'});
    }
});

// POST /users
router.post('/', async function(req, res){
    try {
        const {name, email} = req.body;
        const newUser = await createUser({name, email});
        res.status(201).json(newUser);
    } catch (error){
        res.status(404).json({error: 'Failed to create user'});
    }
});

export default router;
