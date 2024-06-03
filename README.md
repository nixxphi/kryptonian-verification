Sure, here is the updated README with the latest changes integrated:

---

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
    MONGODB_URI=mongodb://localhost:27017/authkrypt
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

### User Registration

**Endpoint:** `POST /api/v1/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "message": "Registration successful. Please check your email to confirm."
}
```

### Email Confirmation

**Endpoint:** `GET /api/v1/confirm-email/:token`

**Request Parameters:**
- `token`: The email confirmation token sent to the user's email.

**Response:**
```json
{
  "message": "Email confirmed successfully."
}
```

### User Login

**Endpoint:** `POST /api/v1/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "message": "OTP sent to your email."
}
```

### OTP Verification

**Endpoint:** `POST /api/v1/verify-otp`

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "token": "jwt-token"
}
```

### API Key Management

#### Generate API Key

**Endpoint:** `POST /api/v1/generate-api-key`

**Headers:**
- `Authorization`: `Bearer jwt-token`

**Response:**
```json
{
  "apiKey": "generated-api-key"
}
```

#### Invalidate API Key

**Endpoint:** `POST /api/v1/invalidate-api-key`

**Headers:**
- `Authorization`: `Bearer jwt-token`

**Response:**
```json
{
  "message": "API key invalidated successfully."
}
```

### File Management

#### File Upload

**Endpoint:** `POST /api/v1/upload`

**Headers:**
- `x-api-key`: `api-key`

**Request Body:**
- Multipart form data with an image file.

**Response:**
```json
{
  "message": "File uploaded successfully"
}
```

#### Download File

**Endpoint:** `GET /api/v1/download/:userId/:fileId`

**Headers:**
- `x-api-key`: `api-key`

**Response:** File data

#### Update File

**Endpoint:** `PUT /api/v1/update/:userId/:fileId`

**Headers:**
- `x-api-key`: `api-key`

**Request Body:**
- Multipart form data with an image file.

**Response:**
```json
{
  "message": "File updated successfully"
}
```

#### Delete File

**Endpoint:** `DELETE /api/v1/delete/:userId/:fileId`

**Headers:**
- `x-api-key`: `api-key`

**Response:**
```json
{
  "message": "File deleted successfully"
}
```

### Image Access

#### Get All Images

**Endpoint:** `GET /api/v1/images/:userId`

**Headers:**
- `x-api-key`: `api-key`

**Response:**
```json
[
  {
    "imageId": "image-id",
    "url": "image-url",
    ...
  }
]
```

#### Get Image By ID

**Endpoint:** `GET /api/v1/images/:userId/:imageId`

**Headers:**
- `x-api-key`: `api-key`

**Response:**
```json
{
  "imageId": "image-id",
  "url": "image-url",
  ...
}
```

#### Get Last Image

**Endpoint:** `GET /api/v1/last-image/:userId`

**Headers:**
- `x-api-key`: `api-key`

**Response:**
```json
{
  "imageId": "image-id",
  "url": "image-url",
  ...
}
```

#### Create Shared Image

**Endpoint:** `POST /api/v1/images/:userId/share`

**Headers:**
- `x-api-key`: `api-key`

**Request Body:**
```json
{
  "imageData": "data",
  "sharedWith": "targetUserId"
}
```

**Response:**
```json
{
  "message": "Image shared successfully"
}
```

#### Get Shared Images

**Endpoint:** `GET /api/v1/shared-images/:userId/:targetUserId`

**Headers:**
- `x-api-key`: `api-key`

**Response:**
```json
[
  {
    "imageId": "image-id",
    "url": "image-url",
    ...
  }
]
```

### Supergirl Image Access

#### Get All Images for Supergirl

**Endpoint:** `GET /api/v1/supergirl/images/:userId`

**Middleware**: `isSupergirl`

**Response:**
```json
[
  {
    "imageId": "image-id",
    "url": "image-url",
    ...
  }
]
```

#### Get Image By ID for Supergirl

**Endpoint:** `GET /api/v1/supergirl/images/:userId/:imageId`

**Middleware**: `isSupergirl`

**Response:**
```json
{
  "imageId": "image-id",
  "url": "image-url",
  ...
}
```

#### Get Last Image for Supergirl

**Endpoint:** `GET /api/v1/supergirl/last-image/:userId`

**Middleware**: `isSupergirl`

**Response:**
```json
{
  "imageId": "image-id",
  "url": "image-url",
  ...
}
```

#### Create Shared Image for Supergirl

**Endpoint:** `POST /api/v1/supergirl/images/:userId/share`

**Middleware**: `isSupergirl`

**Request Body:**
```json
{
  "imageData": "data",
  "sharedWith": "targetUserId"
}
```

**Response:**
```json
{
  "message": "Image shared successfully"
}
```

#### Get Shared Images for Supergirl

**Endpoint:** `GET /api/v1/supergirl/shared-images/:userId/:targetUserId`

**Middleware**: `isSupergirl`

**Response:**
```json
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
