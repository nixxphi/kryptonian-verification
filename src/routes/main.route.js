import express from 'express';
import registrationController from '../controllers/registration.controller.js';
import loginController from '../controllers/login.controller.js';
import fileController from '../controllers/file.controller.js';
import imageController from '../controllers/image.controller.js';
import apiKeyController from '../controllers/apikey.controller.js';
import { verifyToken, requireApiKey, isSupergirl } from '../middlewares/auth.middleware.js';
import welcomeMessage from '../middlewares/welcome.middleware.js';
import multer from 'multer';

const mainRouter = express.Router();
const upload = multer();

// Welcome route
mainRouter.get('/', welcomeMessage);

// Registration and Authentication
mainRouter.post('/register', registrationController.register); 
mainRouter.get('/confirm-email/:token', registrationController.confirmEmail);
mainRouter.post('/login', loginController.login);
mainRouter.post('/verify-otp', loginController.verifyOtp);

// API Key Management
mainRouter.post('/generate-api-key', verifyToken, apiKeyController.generateApiKey);
mainRouter.post('/invalidate-api-key', verifyToken, apiKeyController.invalidateApiKey);

// File Upload and Management
mainRouter.post('/upload', requireApiKey, upload.single('file'), fileController.upload);
mainRouter.get('/download/:userId/:fileId', requireApiKey, fileController.download);
mainRouter.put('/update/:userId/:fileId', requireApiKey, upload.single('file'), fileController.update);
mainRouter.delete('/delete/:userId/:fileId', requireApiKey, fileController.delete);


// Image Access (authenticated users)
mainRouter.get('/images/:userId', requireApiKey, imageController.getAllImages);
mainRouter.get('/images/:userId/:imageId', requireApiKey, imageController.getImageById);
mainRouter.get('/last-image/:userId', requireApiKey, imageController.getLastImage);
mainRouter.post('/images/:userId/share', requireApiKey, imageController.createSharedImage);
mainRouter.get('/shared-images/:userId/:targetUserId', requireApiKey, imageController.getSharedImages);

// Supergirl Image Access (without authentication)
mainRouter.get('/supergirl/images/:userId', isSupergirl, imageController.getAllImages);
mainRouter.get('/supergirl/images/:userId/:imageId', isSupergirl, imageController.getImageById);
mainRouter.get('/supergirl/last-image/:userId', isSupergirl, imageController.getLastImage);
mainRouter.post('/supergirl/images/:userId/share', isSupergirl, imageController.createSharedImage);
mainRouter.get('/supergirl/shared-images/:userId/:targetUserId', isSupergirl, imageController.getSharedImages);


export default mainRouter;
