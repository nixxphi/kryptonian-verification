const welcomeMessage = (req, res, next) => {
    const routes = {
        "Registration and Authentication": {
            "POST /register": "Register a new user",
            "GET /confirm-email/:token": "Confirm user's email",
            "POST /login": "Login a user",
            "POST /verify-otp": "Verify OTP for 2FA"
        },
        "API Key Management": {
            "POST /generate-api-key": "Generate a new API key (requires authentication)",
            "POST /invalidate-api-key": "Invalidate an existing API key (requires authentication)"
        },
        "File Upload and Management": {
            "POST /upload": "Upload a file (requires API key)",
            "GET /download/:userId/:fileId": "Download a file by userId and fileId (requires API key)",
            "PUT /update/:userId/:fileId": "Update a file by userId and fileId (requires API key)",
            "DELETE /delete/:userId/:fileId": "Delete a file by userId and fileId (requires API key)"
        },
        "Image Access": {
            "GET /images/:userId": "Get all images by userId (requires API key)",
            "GET /images/:userId/:imageId": "Get a specific image by userId and imageId (requires API key)",
            "GET /last-image/:userId": "Get the last image by userId (requires API key)",
            "POST /images/:userId/share": "Share an image (requires API key)",
            "GET /shared-images/:userId/:targetUserId": "Get shared images between users (requires API key)"
        },
        "Supergirl Image Access": {
            "GET /supergirl/images/:userId": "Get all images by userId (no authentication required)",
            "GET /supergirl/images/:userId/:imageId": "Get a specific image by userId and imageId (no authentication required)",
            "GET /supergirl/last-image/:userId": "Get the last image by userId (no authentication required)",
            "POST /supergirl/images/:userId/share": "Share an image (no authentication required)",
            "GET /supergirl/shared-images/:userId/:targetUserId": "Get shared images between users (no authentication required)"
        }
    };

    res.status(200).json({
        message: "Welcome to the Auth-Krypt API!",
        routes: routes
    });
};

export default welcomeMessage;
