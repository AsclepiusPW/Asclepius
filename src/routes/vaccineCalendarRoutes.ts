import express from 'express';
const eventRoutes = express.Router();

import { createCalendar } from '../controllers/vaccinationCalendarControllers';

eventRoutes.post("/", createCalendar);

export { eventRoutes };