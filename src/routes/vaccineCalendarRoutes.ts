import express from 'express';
const eventRoutes = express.Router();

import { findAllCalendars, createCalendar, findSpecificCalendar } from '../controllers/vaccinationCalendarControllers';

eventRoutes.get("/", findAllCalendars);
eventRoutes.post("/", createCalendar);
eventRoutes.get("/:id", findSpecificCalendar);

export {eventRoutes };