import { Router } from 'express';
import EventController, { createEventValidation, updateEventValidation } from '../controllers/event.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/active', EventController.getActiveEvents.bind(EventController));
router.get('/:id', EventController.getEventById.bind(EventController));
router.get('/:id/statistics', EventController.getEventStatistics.bind(EventController));

// Protected routes (require authentication)
// For now, we'll make all routes accessible, but you can add authentication later
router.get('/', EventController.getAllEvents.bind(EventController));
router.post('/', createEventValidation, EventController.createEvent.bind(EventController));
router.put('/:id', updateEventValidation, EventController.updateEvent.bind(EventController));
router.delete('/:id', EventController.deleteEvent.bind(EventController));
router.post('/:id/duplicate', EventController.duplicateEvent.bind(EventController));

// TODO: Uncomment when authentication is ready
// router.get('/', authenticate, EventController.getAllEvents.bind(EventController));
// router.post('/', authenticate, createEventValidation, EventController.createEvent.bind(EventController));
// router.put('/:id', authenticate, updateEventValidation, EventController.updateEvent.bind(EventController));
// router.delete('/:id', authenticate, EventController.deleteEvent.bind(EventController));

export default router;

