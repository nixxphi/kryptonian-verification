// welcome.middleware.js

const welcomeMessage = (req, res, next) => {
    const routes = {
        "Registration and Authentication": {
            "POST /api/v1/register": "Register a new user",
            "GET /api/v1/confirm-email/:token": "Confirm user's email",
            "POST /api/v1/login": "Login a user",
            "POST /api/v1/verify-otp": "Verify OTP for 2FA"
        },
        "File Upload and Management": {
            "POST /api/v1/generate-api-key": "Generate a new API key (requires authentication)",
            "POST /api/v1/invalidate-api-key": "Invalidate an existing API key (requires authentication)",
            "POST /api/v1/upload": "Upload a file (requires API key)"
        },
        "Image Access": {
            "GET /api/v1/images": "Get all images (requires API key)",
            "GET /api/v1/images/:id": "Get a specific image by ID (requires API key)"
        },
        "Supergirl Image Access": {
            "GET /api/v1/supergirl/images": "Get all images (no authentication required cuz Kara is apparently beyond awesome.)",
            "GET /api/v1/supergirl/images/:id": "Get a specific image by ID (no authentication required for Supergirl)"
        }
    };

    res.status(200).json({
        message: "Welcome to the Auth-Krypt API!",
        routes: routes
    });
};

export default welcomeMessage;
