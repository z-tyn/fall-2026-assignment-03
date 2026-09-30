import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js'; // Import your middleware
import { 
    getAllTickets, 
    getTicketById,
    createTicket,
    updateTicketStatus,
  } from '../dal/tickets.js';
import { getTotalHoursForTicket, insertTimeLog } from '../dal/timeLogs.js';

const router = Router();


// TODO: Student implementation - Part 1: Ticket Routes
// GET /tickets
router.get('/', async function(req, res){
   try {
        const limit = req.query.limit ? Number(req.query.limit) : undefined;
        const offset = req.query.offset ? Number(req.query.offset) : undefined;
        const status = req.query.status as string | undefined;

        const tickets = await getAllTickets({limit, offset, status});
        res.json(tickets);
    } catch (error){
        res.status(500).json({error: 'Failed to get tickets'});
    } 
});

// GET /tickets/:id
router.get('/:id', async function(req, res){
    try {
        const ticketId = Number(req.params.id);
        const ticket = await getTicketById(ticketId);
    
        if (!ticket){
            res.status(404).json({error: 'Ticket not found'});
            return
        }
    
    res.json(ticket);
    
    } catch (error){
        res.status(404).json({error: 'Ticket not found'});
    }
});
// POST /tickets
router.post('/', authMiddleware, async function(req, res){
    try {
        const {title, description, assignee_id} = req.body;
        const creator_id = res.locals.userId;
        const newTicket = await createTicket({
            title,
            description: description ?? null,
            creator_id,
            assignee_id: assignee_id ?? null,
        });
        res.status(201).json(newTicket);
    } catch (error){
        res.status(400).json({error: 'Failed to create ticket'});
    }    
});

// PATCH /tickets/:id/status
router.patch('/:id/status', authMiddleware, async function(req, res){
    try {
        const ticketId = Number(req.params.id);
        const {status} = req.body;

        if (!status){
            res.status(400).json({error: 'No status present'});
            return;
        }

        const updatedTicket = await updateTicketStatus(ticketId, status);

        if (!updatedTicket){
            res.status(404).json({error: 'Ticket not found'});
            return;
        }

        res.status(200).json(updatedTicket);
    } catch (error){
        res.status(400).json({error: 'Failed to update status'});
    }
});

// TODO: Student implementation - Part 2: Time Log Routes
// POST /tickets/:id/time
router.post('/:id/time', authMiddleware, async function(req, res){
    try {
        const ticketId = Number(req.params.id);
        const {hours} = req.body;
        const userId = res.locals.userId;

        if (hours === undefined || isNaN(parseInt(hours))){
            res.status(400).json({error:'Hours input required'});
            return;
        }

        const newLog = await insertTimeLog(ticketId, userId, Number(hours));
        res.status(201).json(newLog);

    } catch (error){
        res.status(400).json({error: 'Failed to log time'});
    }    
});

// GET /tickets/:id/time
router.get('/:id/time', async function(req, res){
    try {
        const ticketId = Number(req.params.id);
    
        if (isNaN(ticketId)){
            res.status(400).json({error: 'Ticket not valid'});
            return;
        }
    
    const totalHours = await getTotalHoursForTicket(ticketId);

    res.json({
        ticket_id: ticketId,
        total_hours: totalHours,
    })
    
    } catch (error){
        res.status(500).json({error: 'Failed to get total hours'});
    }
});

export default router;
