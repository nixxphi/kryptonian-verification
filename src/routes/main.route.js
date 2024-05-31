// routes/main.route.js
import express from 'express';
import registrationController from '../controllers/registration.controller.js';
import loginController from '../controllers/login.controller.js';
import fileController from '../controllers/file.controller.js';
import imageController from '../controllers/image.controller.js';
import apiKeyController from '../controllers/apiKey.controller.js';
import { verifyToken, requireApiKey, isSupergirl } from '../middlewares/auth.middleware.js';
import welcomeMessage from '../middlewares/welcome.middleware.js';

const mainRouter = express.Router();

// Welcome route
mainRouter.get('/', welcomeMessage);

// Registration and Authentication
mainRouter.post('/register', registrationController.register);
mainRouter.get('/confirm-email/:token', registrationController.confirmEmail);
mainRouter.post('/login', loginController.login);
mainRouter.post('/verify-otp', loginController.verifyOtp);

// File Upload and Management
mainRouter.post('/generate-api-key', verifyToken, apiKeyController.generateApiKey);
mainRouter.post('/invalidate-api-key', verifyToken, apiKeyController.invalidateApiKey);
mainRouter.post('/upload', requireApiKey, fileController.uploadFile);

// Image Access (authenticated users)
mainRouter.get('/images', requireApiKey, imageController.getAllImages);
mainRouter.get('/images/:id', requireApiKey, imageController.getImage);

// Supergirl Image Access (without authentication)
mainRouter.get('/supergirl/images', isSupergirl, imageController.getAllImagesForSupergirl);
mainRouter.get('/supergirl/images/:id', isSupergirl, imageController.getImageByIdForSupergirl);

export default mainRouter;
