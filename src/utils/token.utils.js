import jwt from 'jsonwebtoken';

export const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

export const getUserIdFromToken = (token) => {
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length).trimLeft();
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    return decoded.userId;
};

export default { generateToken, verifyToken, getUserIdFromToken };
