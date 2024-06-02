const welcomeMessage = (req, res, next) => {
    const routes = {
        "Registration and Authentication": {
            "POST /register": "Register a new user",
            "GET /confirm-email/:token": "Confirm user's email",
            "POST /login": "Login a user",
            "POST /verify-otp": "Verify OTP for 2FA"
        },
        "File Upload and Management": {
            "POST /generate-api-key": "Generate a new API key (requires authentication)",
            "POST /invalidate-api-key": "Invalidate an existing API key (requires authentication)",
            "POST /upload": "Upload a file (requires API key)"
        },
        "Image Access": {
            "GET /images": "Get all images (requires API key)",
            "GET /images/:id": "Get a specific image by ID (requires API key)"
        },
        "Supergirl Image Access": {
            "GET /supergirl/images": "Get all images (no authentication required cuz Kara is apparently beyond awesome.)",
            "GET /supergirl/images/:id": "Get a specific image by ID (no authentication required for Supergirl)"
        }
    };

    res.status(200).json({
        message: "Welcome to the Auth-Krypt API!",
        routes: routes
    });
};

export default welcomeMessage;
