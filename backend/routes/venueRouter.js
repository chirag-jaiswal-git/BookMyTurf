import express from 'express';
import {addVenue , listVenues , removeVenue, singleVenueInfo } from '../controllers/venueController.js';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';

const venueRouter = express.Router();

venueRouter.post("/add", upload.array("images", 4), addVenue);
venueRouter.get('/list', listVenues);
venueRouter.post('/remove',adminAuth, removeVenue);
venueRouter.post('/single', singleVenueInfo);

export default venueRouter;