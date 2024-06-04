# Auth-Krypt

Auth-Krypt is a Node.js application designed for Kryptonians that enables secure registration, authentication, file uploads, and image access. This application leverages modern authentication mechanisms, such as Two-Factor Authentication (2FA) and API key-based file uploads.

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Dependencies](#dependencies)
- [Error Handling](#error-handling)
- [Security Considerations](#security-considerations)
- [Contributing](#contributing)
- [License](#license)

## Features

- User Registration and Email Confirmation
- Two-Factor Authentication (2FA) using OTP
- Secure File Uploads with API Key Authentication
- Image Access without Authentication for Specific Users
- API Key Management

## Requirements

- Node.js (v14 or higher)
- MongoDB
- Redis
- Nodemailer for sending emails

## Installation

1. Clone the repository:

    ```sh
    git clone <repository_url>
    cd auth-krypt
    ```

2. Install the dependencies:

    ```sh
    npm install
    ```

3. Set up your environment variables by creating a `.env` file

4. Add the following environment variables to the `.env` file:

    ```env
    PORT=3000
    MONGODB_URI=your__mongodb__uri
    JWT_SECRET=your_jwt_secret
    EMAIL_USER=your_email_user
    EMAIL_PASS=your_email_password
    BASE_URL=http://localhost:3000
    ```

5. Start the application:

    ```sh
    npm start
    ```

## Configuration

Ensure your `.env` file contains the correct configurations for your environment.

## Usage

Once the application is up and running, you can use tools like Postman or cURL to interact with the API endpoints.

## API Endpoints

### Register User
URL: /register
Method: POST
Description: Registers a new user.
Request Body:
```
{
  "email": "user@example.com",
  "password": "password123",
  "role": "(kryptonian or supergirl, kryptonian as default so this is optional)" 
}
```

Response:
```
{
  "message": "User registered successfully"
}
```

### Confirm Email
URL: /confirm-email/:token
Method: GET
Description: Confirms the user's email using a token.
Response:
```
{
  "message": "Email confirmed successfully"
}
```

### Login
URL: /login
Method: POST
Description: Authenticates the user and returns a JWT token.
Request Body:
```
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```
{
  "message": "OTP sent to your email"
}
```

### Verify OTP
URL: /verify-otp
Method: POST
Description: Verifies the OTP sent to the user.
Request Body:
```
{
  "otp": "123456"
}
```
Response:
```
{
  "message": "OTP verified successfully"
}
```

## API Key Management

### Generate API Key
URL: /generate-api-key
Method: POST
Description: Generates a new API key for the authenticated user.
Headers:
Authorization: Bearer jwt-token
Response:
```
{
  "status": 200,
  "success": true,
  "message": "API Key generated successfully!",
  "data": {
      "apiKey"
  }
}
```

### Invalidate API Key
URL: /invalidate-api-key
Method: POST
Description: Invalidates the user's API key.
Headers:
Authorization: Bearer jwt-token
Response:
```
{
  "status": 200,
  "success": true,
  "message": "",
  "data": {
      "message": "API key invalidated successfully"
  }
}
```

### File Management
Upload File
URL: /upload
Method: POST
Description: Uploads a file.
Headers:
x-api-key: api-key
Request Body:
file: File to upload
Response:
```

{
  "message": "File uploaded successfully",
  "fileUrl": "url-to-file"
}
```
### Download File
URL: /download/:userId/:fileId
Method: GET
Description: Downloads a file.
Headers:
x-api-key: api-key
Response: File data

### Update File
URL: /update/:userId/:fileId
Method: PUT
Description: Updates an existing file.
Headers:
x-api-key: api-key
Request Body:
file: New file to upload
Response:
```

{
  "message": "File updated successfully"
}
```


### Delete File
URL: /delete/:userId/:fileId
Method: DELETE
Description: Deletes a file.
Headers:
x-api-key: api-key
Response:
```
{
  "message": "File deleted successfully"
}
```
## Image Access

### Get All Images
URL: /images/:userId
Method: GET
Description: Retrieves all images for a user.
Headers:
x-api-key: api-key
Response:
```
[
  {
    "imageId": "image-id",
    "url": "image-url",
    ...
  }
]
```
### Get Image By ID
URL: /images/:userId/:imageId
Method: GET
Description: Retrieves a specific image by ID.
Headers:
x-api-key: api-key
Response:
```
{
  "imageId": "image-id",
  "url": "image-url",
  ...
}
```
### Get Last Image
URL: /last-image/:userId
Method: GET
Description: Retrieves the last uploaded image for a user.
Headers:
x-api-key: api-key
Response:
```
{
  "imageId": "image-id",
  "url": "image-url",
  ...
}
```


### Create Shared Image
URL: /images/:userId/share
Method: POST
Description: Shares an image with another user.
Headers:
x-api-key: api-key
Request Body:
```
{
  "imageData": "data",
  "sharedWith": "targetUserId"
}
```
Response:
```
{
  "message": "Image shared successfully"
}
```


### Get Shared Images
URL: /shared-images/:userId/:targetUserId
Method: GET
Description: Retrieves images shared with another user.
Headers:
x-api-key: api-key
Response:
```

[
  {
    "imageId": "image-id",
    "url": "image-url",
    ...
  }
]
```


## Supergirl Image Access


### Get All Images for Supergirl
URL: /supergirl/images/:userId
Method: GET
Description: Retrieves all images for a user without authentication.
Middleware: isSupergirl
Response:
```

[
  {
    "imageId": "image-id",
    "url": "image-url",
    ...
  }
]
```


### Get Image By ID for Supergirl
URL: /supergirl/images/:userId/:imageId
Method: GET
Description: Retrieves a specific image by ID without authentication.
Middleware: isSupergirl
Response:
```

{
  "imageId": "image-id",
  "url": "image-url",
  ...
}
```


### Get Last Image for Supergirl
URL: /supergirl/last-image/:userId
Method: GET
Description: Retrieves the last uploaded image for a user without authentication.
Middleware: isSupergirl
Response:
```

{
  "imageId": "image-id",
  "url": "image-url",
  ...
}
```

### Create Shared Image for Supergirl
URL: /supergirl/images/:userId/share
Method: POST
Description: Shares an image with another user without authentication.
Middleware: isSupergirl
Request Body:
```

{
  "imageData": "data",
  "sharedWith": "targetUserId"
}
```
Response:
```

{
  "message": "Image shared successfully"
}
```


### Get Shared Images for Supergirl
URL: /supergirl/shared-images/:userId/:targetUserId
Method: GET
Description: Retrieves images shared with another user without authentication.
Middleware: isSupergirl
Response:
```

[
  {
    "imageId": "image-id",
    "url": "image-url",
    ...
  }
]
```

## Dependencies

The application uses the following dependencies:

- **express**: Fast, unopinionated, minimalist web framework for Node.js.
- **mongoose**: Elegant MongoDB object modeling for Node.js.
- **jsonwebtoken**: For generating and verifying JWT tokens.
- **bcrypt**: For hashing passwords.
- **nodemailer**: For sending emails.
- **redis**: For caching OTPs.
- **multer**: For handling multipart/form-data, which is primarily used for uploading files.
- **dotenv**: For loading environment variables from a `.env` file.
- **base64-img**: For converting images to base64 strings.

Install these dependencies via npm:

```sh
npm install express mongoose jsonwebtoken bcrypt nodemailer redis multer dotenv base64-img
```

## Error Handling

All endpoints return appropriate HTTP status codes and error messages. Common error codes include:
- `400 Bad Request`: For validation errors.
- `401 Unauthorized`: For authentication failures.
- `403 Forbidden`: For authorization failures.
- `404 Not Found`: For missing resources.
- `500 Internal Server Error`: For server-side errors.

Example error response:
```json
{
  "error": "Invalid OTP"
}
```

## Security Considerations

- Passwords are hashed using a secure algorithm (e.g., bcrypt).
- Tokens

 and API keys are securely generated and stored.
- Sensitive data (e.g., tokens, API keys) are not exposed in logs.
- HTTPS is used for all API requests to ensure secure communication.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.

---
