import express from 'express';
const eventRoutes = express.Router();

import { findAllCalendars, createCalendar, findSpecificCalendar, updateEventCalendar, removeEvent } from '../controllers/vaccinationCalendarControllers';
import { verifyTokenAdmin } from '../middleware/verifyTokenAdmin';

eventRoutes.get("/", findAllCalendars);
eventRoutes.post("/", verifyTokenAdmin, createCalendar);
eventRoutes.get("/:id", findSpecificCalendar);
eventRoutes.put("/update/:id", verifyTokenAdmin, updateEventCalendar);
eventRoutes.delete("/remove/:id", verifyTokenAdmin, removeEvent);

export {eventRoutes };