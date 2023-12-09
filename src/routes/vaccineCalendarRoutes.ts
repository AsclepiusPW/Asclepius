import express from 'express';
const eventRoutes = express.Router();

import { findAllCalendars, createCalendar, findSpecificCalendar, updateEventCalendar, removeEvent } from '../controllers/vaccinationCalendarControllers';
import { verifyToken } from '../middleware/verifyToken';

eventRoutes.get("/", findAllCalendars);
eventRoutes.post("/", verifyToken, createCalendar);
eventRoutes.get("/:id", verifyToken, findSpecificCalendar);
eventRoutes.put("/update/:id", verifyToken, updateEventCalendar);
eventRoutes.delete("/remove/:id", verifyToken, removeEvent);

export {eventRoutes };