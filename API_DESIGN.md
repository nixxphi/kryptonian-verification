Auth-Krypt API Design Document

### Table of Contents
1. [Introduction](#1-introduction)
2. [Authentication and Authorization](#2-authentication-and-authorization)
3. [File Upload Service](#3-file-upload-service)
4. [Image Access](#4-image-access)
5. [API Key Management](#5-api-key-management)
6. [Endpoints](#6-endpoints)
    - [User Registration](#user-registration)
    - [Email Confirmation](#email-confirmation)
    - [User Login](#user-login)
    - [OTP Verification](#otp-verification)
    - [API Key Generation](#api-key-generation)
    - [Invalidate API Key](#invalidate-api-key)
    - [File Upload](#file-upload)
    - [Get All Images](#get-all-images)
    - [Get Single Image](#get-single-image)
7. [Error Handling](#7-error-handling)
8. [Security Considerations](#8-security-considerations)

---

### 1. Introduction

Auth-Krypt is an application built for Kryptonians that allows secure registration, authentication, file uploads, and image access. The API is designed to support the following functionalities:
- User registration and email confirmation.
- Two-Factor Authentication (2FA) using OTP.
- Secure file uploads with API key authentication.
- Access to images without authentication for specific users (e.g., Supergirl).
- Management of API keys for users.

### 2. Authentication and Authorization

**Authentication:** 
- Users register with an email address.
- Upon registration, users receive a confirmation email with a link to confirm their email address.
- Users log in using their email address. An OTP is sent to their email for 2FA.
- Users verify the OTP to receive a JWT token for subsequent requests.

**Authorization:**
- File uploads and certain actions require an API key.
- API keys are unique to each user and can be invalidated.

### 3. File Upload Service

- Files can be uploaded using an API key.
- Only image files are allowed.
- Images are stored as Base64 strings in the database for easy sharing.
- Files are deleted from the system after being stored.

### 4. Image Access

- Specific users (e.g., Supergirl) can access images without authentication.
- Images can be accessed either individually or in bulk.

### 5. API Key Management

- Users can generate and invalidate API keys.
- API keys are issued once and never shown again to the user after generation.

### 6. Endpoints

#### User Registration

**Endpoint:** `POST /api/v1/register`

**Description:** Registers a new user and sends a confirmation email.

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

#### Email Confirmation

**Endpoint:** `GET /api/v1/confirm-email/:token`

**Description:** Confirms the user's email address.

**Request Parameters:**
- `token`: The email confirmation token sent to the user's email.

**Response:**
```json
{
  "message": "Email confirmed successfully."
}
```

#### User Login

**Endpoint:** `POST /api/v1/login`

**Description:** Logs in the user and sends an OTP to their email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "OTP sent to your email."
}
```

#### OTP Verification

**Endpoint:** `POST /api/v1/verify-otp`

**Description:** Verifies the OTP and provides a JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "800855"
}
```

**Response:**
```json
{
  "token": "jwt-token"
}
```

#### API Key Generation

**Endpoint:** `POST /api/v1/generate-api-key`

**Description:** Generates a new API key for the user.

**Request Body:**
```json
{
  "userId": "user-id"
}
```

**Response:**
```json
{
  "apiKey": "generated-api-key"
}
```

#### Invalidate API Key

**Endpoint:** `POST /api/v1/invalidate-api-key`

**Description:** Invalidates an existing API key.

**Request Body:**
```json
{
  "apiKey": "api-key-to-invalidate"
}
```

**Response:**
```json
{
  "message": "API key invalidated successfully."
}
```

#### File Upload

**Endpoint:** `POST /api/v1/upload`

**Description:** Uploads an image file using an API key.

**Request Headers:**
- `apiKey`: The user's API key.

**Request Body:**
- Multipart form data with an image file.

**Response:**
```json
{
  "message": "File uploaded successfully"
}
```

#### Get All Images

**Endpoint:** `GET /api/v1/images`

**Description:** Retrieves all images. No authentication required for Supergirl.

**Response:**
```json
[
  {
    "id": "image-id",
    "data": "base64-string",
    "contentType": "image/png"
  },
  ...
]
```

#### Get Single Image

**Endpoint:** `GET /api/v1/images/:id`

**Description:** Retrieves a single image by ID. No authentication required for Supergirl.

**Request Parameters:**
- `id`: The ID of the image.

**Response:**
```json
{
  "id": "image-id",
  "data": "base64-string",
  "contentType": "image/png"
}
```

### 7. Error Handling

- All endpoints should return appropriate HTTP status codes and error messages.
- Common error codes include:
  - `400 Bad Request`: For validation errors.
  - `401 Unauthorized`: For authentication failures.
  - `403 Forbidden`: For authorization failures.
  - `404 Not Found`: For missing resources.
  - `500 Internal Server Error`: For server-side errors.

**Example Error Response:**
```json
{
  "error": "Invalid OTP"
}
```

### 8. Security Considerations

- Passwords should be hashed using a secure algorithm (e.g., bcrypt).
- Tokens and API keys should be securely generated and stored.
- Sensitive data (e.g., tokens, API keys) should not be exposed in logs.
- Use HTTPS for all API requests to ensure secure communication.

### Conclusion

This is a comprehensive overview of the endpoints, functionalities, and design considerations for Auth-Krypt. It ensures secure user authentication, efficient file uploads, and easy access to image resources while adhering to best practices in RESTful API design and security.
