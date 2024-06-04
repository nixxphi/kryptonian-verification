const welcomeMessage = (req, res, next) => {
    const routes = {
      "Registration and Authentication": {
        "POST /register": "Register a new user",
        "GET /confirm-email/:token": "Confirm user's email",
        "POST /login": "Login a user",
        "POST /verify-otp": "Verify OTP for 2FA"
      },
      "File Upload and Management": {
        "POST /upload": "Upload a file (requires API key)",
        "GET /download/:userId/:fileId": "Download a file (requires API key)",
        "PUT /update/:userId/:fileId": "Update a file (requires API key)",
        "DELETE /delete/:userId/:fileId": "Delete a file (requires API key)",
      },
      "Image Access (authenticated users)": {
        "GET /images/:userId": "Get all images for a user (requires API key)",
        "GET /images/:userId/:imageId": "Get a specific image by ID for a user (requires API key)",
        "GET /last-image/:userId": "Get the last uploaded image for a user (requires API key)",
        "POST /images/:userId/share": "Share an image with another user (requires API key)",
        "GET /shared-images/:userId/:targetUserId": "Get shared images from another user (requires API key)",
      },
      "Supergirl Image Access (without authentication)": {
        "GET /supergirl/images/:userId": "Get all images for a user (no authentication required)",
        "GET /supergirl/images/:userId/:imageId": "Get a specific image by ID for a user (no authentication required)",
        "GET /supergirl/last-image/:userId": "Get the last uploaded image for a user (no authentication required)",
        "POST /supergirl/images/:userId/share": "Share an image with another user (no authentication required)",
        "GET /supergirl/shared-images/:userId/:targetUserId": "Get shared images from another user (no authentication required)",
      }
    };
  
    res.status(200).json({
      message: "Welcome to the Auth-Krypt API!",
      routes: routes
    });
  };
  
export default welcomeMessage;
