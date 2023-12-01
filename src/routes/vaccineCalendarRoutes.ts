import express from 'express';
const eventRoutes = express.Router();

import { findAllCalendars, createCalendar } from '../controllers/vaccinationCalendarControllers';

eventRoutes.get("/", findAllCalendars);
eventRoutes.post("/", createCalendar);

export {eventRoutes };