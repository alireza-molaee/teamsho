import express from 'express';
import { checkSchema, check } from 'express-validator/check';
import { handleValidationError } from '../../middlewares/error-handling';
import authMW from '../../middlewares/auth';

import {
    getProfile,
    login,
    register,
    updateProfile,
    uploadPicture,
    verifyUser
} from './handlers';

import {
    loginSchema,
    registerSchema,
    updateProfileSchema,
    verifyUserSchema
} from './schemas'

const router = express.Router()

router.post('/login', [
    checkSchema(loginSchema),
    handleValidationError,
], login);

router.post('/register', [
    checkSchema(registerSchema),
    handleValidationError,
], register);

router.post('/confirm', [
    checkSchema(verifyUserSchema),
    handleValidationError,
], verifyUser);

router.get('/profile', authMW, getProfile);

router.put('/profile', [
    authMW,
    checkSchema(updateProfileSchema),
    handleValidationError,
],updateProfile);

router.post('/upload-picture', [
    authMW,
], uploadPicture)

export default router;