// routes/main.route.js
import express from 'express';
import registrationController from '../controllers/registration.controller.js';
import loginController from '../controllers/login.controller.js';
import fileController from '../controllers/file.controller.js';
import imageController from '../controllers/image.controller.js';
import apiKeyController from '../controllers/apiKey.controller.js';
import { verifyToken, requireApiKey, isSupergirl } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Registration and Authentication
router.post('/register', registrationController.register);
router.get('/confirm-email/:token', registrationController.confirmEmail);
router.post('/login', loginController.login);
router.post('/verify-otp', loginController.verifyOtp);

// File Upload and Management
router.post('/generate-api-key', [verifyToken], apiKeyController.generateApiKey);
router.post('/invalidate-api-key', [verifyToken], apiKeyController.invalidateApiKey);
router.post('/upload', [requireApiKey], fileController.uploadFile);

// Image Access (authenticated users)
router.get('/images', [requireApiKey], imageController.getAllImages);
router.get('/images/:id', [requireApiKey], imageController.getImage);

// Supergirl Image Access (without authentication)
router.get('/supergirl/images',[isSupergirl], imageController.getAllImagesForSupergirl);
router.get('/supergirl/images/:id',[isSupergirl], imageController.getImageByIdForSupergirl);

export default router;
