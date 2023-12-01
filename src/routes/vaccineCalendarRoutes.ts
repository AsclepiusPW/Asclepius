import express from 'express';
const eventRoutes = express.Router();

import { findAllCalendars, createCalendar, findSpecificCalendar, updateEventCalendar } from '../controllers/vaccinationCalendarControllers';

eventRoutes.get("/", findAllCalendars);
eventRoutes.post("/", createCalendar);
eventRoutes.get("/:id", findSpecificCalendar);
eventRoutes.put("/update/:id", updateEventCalendar);

export {eventRoutes };