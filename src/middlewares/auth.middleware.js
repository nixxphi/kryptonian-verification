import UserModel from '../models/user.model.js';
import { verifyToken as verifyJwtToken } from '../utils/token.utils.js';
import jwt from 'jsonwebtoken';

// Middleware to verify API key
export const verifyApiKey = async (apiKey) => {
    const user = await UserModel.findOne({ apiKey });
    return !!user;
};

// Middleware to verify JWT token
export const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = verifyJwtToken(token);
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

// Middleware to check if the user is Supergirl
export const isSupergirl = (req, res, next) => {
    if (req.user.role !== 'supergirl') {
        return res.status(403).json({ message: 'Access denied. You are not Supergirl, go get a cape or something.' });
    }
    next();
};

// Middleware to check if the user has a valid API key
export const requireApiKey = async (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey || !await verifyApiKey(apiKey)) {
        return res.status(401).json({ message: 'Unauthorized. Invalid API key.' });
    }
    
    next();
};

// Utility function to decode JWT and get userId
export const getUserIdFromToken = (token) => {
    try {
        const decoded = jwt.decode(token);
        return decoded.userId;
    } catch (error) {
        throw new Error('Failed to decode token.');
    }
};

const auth = {
    requireApiKey,
    isSupergirl,
    verifyToken,
    getUserIdFromToken
};

export default auth;
