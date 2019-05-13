import express from 'express';
import { checkSchema, check } from 'express-validator/check';
import { handleValidationError } from '../../middlewares/error-handling';
import authMW from '../../middlewares/auth';

import {
    createEvent,
    deleteEvent,
    find,
    getEvent,
    getMembers,
    getMyEvents,
    subscribe,
    updateEvent,
    uploadImage
} from './handlers';

import { 
    findSchema,
    createEventSchema,
    updateEventSchema,
} from './schemas';

const router = express.Router()

router.get('/my-events', [
    authMW,
], getMyEvents);

router.post('/find', [
    authMW,
    checkSchema(findSchema),
    handleValidationError,
], find);

router.post('/upload-image', [
    authMW,
], uploadImage);

router.post('/', [
    authMW,
    checkSchema(createEventSchema),
    handleValidationError
], createEvent);

router.get('/:id', [
    authMW,
], getEvent);

router.put('/:id', [
    authMW,
    checkSchema(updateEventSchema),
    handleValidationError
], updateEvent),

router.delete('/:id', [
    authMW,
], deleteEvent);

router.get('/members', [
    authMW,
], getMembers);

router.post('/subscribe', [
    authMW,
], subscribe);