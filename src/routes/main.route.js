import express from 'express';
import registrationController from '../controllers/registration.controller.js';
import loginController from '../controllers/login.controller.js';
import fileController from '../controllers/file.controller.js';
import imageController from '../controllers/image.controller.js';
import apiKeyController from '../controllers/apiKey.controller.js';


const router = express.Router();

// Registration and Authentication
router.post('/register', registrationController.register);
router.get('/confirm-email/:token', registrationController.confirmEmail);
router.post('/login', loginController.login);
router.post('/verify-otp', loginController.verifyOtp);

// File Upload and Management
router.post('/generate-api-key', apiKeyController.generateApiKey);
router.post('/invalidate-api-key', apiKeyController.invalidateApiKey);
router.post('/upload', fileController.uploadFile);

// Image Access
router.get('/images', imageController.fetchAllImages);
router.get('/images/:id', imageController.fetchImage);


// Supergirl Image Access (without authentication)
router.get('/supergirl/images', imageController.getAllImagesForSupergirl);
router.get('/supergirl/images/:id', imageController.getImageByIdForSupergirl);

export default router;
