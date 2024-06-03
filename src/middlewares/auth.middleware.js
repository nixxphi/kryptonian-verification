import UserModel from '../models/user.model.js';
import { sendResponse } from '../utils/response.util.js';
import { verifyToken as verifyJwtToken } from '../utils/token.utils.js';
import jwt from 'jsonwebtoken'
// Middleware to verify API key
export const verifyApiKey = async (apiKey) => {
    const user = await UserModel.findOne({ apiKey });
    return !!user;
};

// Middleware to verify JWT token
export default async (req, res, next) => {
    try {
        const authHeaders = req.headers['authorization'] || req.header('Authorization');
        const token = authHeaders && authHeaders.substring(0, 7) === 'Bearer ' ? authHeaders.replace('Bearer ', '') : req.cookies?.token;

        if (!token) return sendResponse(res, 401, false, "Please login to continue.")

        const decoded = verifyJwtToken(token)
console.log('user:', decoded);
        const user = await UserModel.findOne({ _id: decoded._id });
        if (!user) return sendResponse(res, 404, false, 'User not found')

        req.user = user;
        next();
    } catch (e) {
        console.error("Token verification error: ", e.message);
        return sendResponse(res, 500, false, e.message)
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
