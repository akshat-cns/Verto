# Quiz App Backend API

A backend API for a quiz application built with Express.js and MongoDB. This API provides functionality for creating quizzes, managing questions, taking quizzes, and automatically scoring results.

## Getting Started

These instructions will help you get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have the following installed on your machine:

- Node.js (LTS version recommended)
- npm (usually comes with Node.js)
- A MongoDB database. You can use:
  - MongoDB Atlas (Cloud - Recommended)
  - Local MongoDB installation

### Installation & Setup

1.  **Clone the repository**

    ```bash
    git clone <your-repository-url>
    cd verito
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Environment Configuration**

    - Create a `.env` file in the root directory.
    - Add your environment variables:

    ```bash
    MONGODB_URI=your_mongodb_connection_string_here
    PORT=3000
    ```

4.  **Start the server**

    - For development (with auto-restart):

    ```bash
    npm run dev
    ```

    - For production:

    ```bash
    npm start
    ```

    If everything is set up correctly, you should see messages indicating the server is running on port 3000 and connected to MongoDB.

## API Usage

Once the server is running (default: `http://localhost:3000`), you can use the following API endpoints:

### Quiz Management

#### Create a Quiz
**Endpoint:** `POST /api/quizzes`

**Request Body:**
```json
{
  "title": "JavaScript Basics",
  "description": "Test your JavaScript knowledge"
}
```
**Response Body:**
```json
{
  "message": "Quiz created successfully",
  "quiz": {
    "id": "507f1f77bcf86cd799439011",
    "title": "JavaScript Basics",
    "description": "Test your JavaScript knowledge"
  }
}
```
#### Get all quizzes
**Endpoint:** `GET /api/quizzes`

**Response Body:**
```json
{
  "quizzes": [
    {
      "id": "507f1f77bcf86cd799439011",
      "title": "JavaScript Basics",
      "description": "Test your JavaScript knowledge",
      "createdAt": "2023-04-01T10:00:00.000Z"
    },
    {
      "id": "507f1f77bcf86cd799439022",
      "title": "Node.js Fundamentals",
      "description": "Test your Node.js knowledge",
      "createdAt": "2023-04-02T10:00:00.000Z"
    }
  ]
}
```
#### Get Quiz Details
**Endpoint:** `PGET /api/quizzes/:quizId`

**Response Body:**
```json
{
  "quiz": {
    "id": "507f1f77bcf86cd799439011",
    "title": "JavaScript Basics",
    "description": "Test your JavaScript knowledge",
    "createdAt": "2023-04-01T10:00:00.000Z",
    "questionCount": 5
  }
}
```
#### Add a Question to a Quiz

**Endpoint:** `POST /api/quizzes/:quizId/questions`

**Request Body:**
```json
{
  "text": "What is 2+2?",
  "type": "multiple_choice",
  "options": [
    { "id": "1", "text": "3" },
    { "id": "2", "text": "4" },
    { "id": "3", "text": "5" }
  ],
  "correctAnswer": "2"
}
```
**Response Body:**
```json
{
  "message": "Question added successfully",
  "question": {
    "id": "507f1f77bcf86cd799439012",
    "text": "What is 2+2?",
    "type": "multiple_choice",
    "options": [
      { "id": "1", "text": "3" },
      { "id": "2", "text": "4" },
      { "id": "3", "text": "5" }
    ]
  }
}
```
#### Get Quiz Questions

**Endpoint:** `GET /api/quizzes/:quizId/questions`

**Response Body:**
```json
{
  "quiz": {
    "id": "507f1f77bcf86cd799439011",
    "title": "JavaScript Basics",
    "description": "Test your JavaScript knowledge"
  },
  "questions": [
    {
      "id": "507f1f77bcf86cd799439012",
      "text": "What is 2+2?",
      "type": "multiple_choice",
      "options": [
        { "id": "1", "text": "3" },
        { "id": "2", "text": "4" },
        { "id": "3", "text": "5" }
      ],
      "maxLength": 300
    },
    {
      "id": "507f1f77bcf86cd799439013",
      "text": "What is the capital of France?",
      "type": "text",
      "maxLength": 300
    }
  ]
}
```
#### Submit Answers and Get Score

**Endpoint:** `POST /api/quizzes/:quizId/submit`

**Request Body:**
```json
{
  "answers": [
    {
      "questionId": "507f1f77bcf86cd799439012",
      "selectedOptionId": "2"
    },
    {
      "questionId": "507f1f77bcf86cd799439013",
      "selectedOptionId": "Paris"
    }
  ]
}
```
**Response Body:**
```json
{
  "score": 2,
  "total": 2,
  "results": [
    {
      "questionId": "507f1f77bcf86cd799439012",
      "correct": true
    },
    {
      "questionId": "507f1f77bcf86cd799439013",
      "correct": true
    }
  ]
}
```
#### Health Check

**Endpoint:** `GET /health`

**Response Body:**
```json
{
  "status": "OK",
  "timestamp": "2023-04-01T10:00:00.000Z"
}
```
## Running the Tests

This project uses Jest as the testing framework. The test suite covers the core service logic for quiz creation, question management, and answer scoring.

To run the test suite, execute:

```bash
npm test
```

<img width="951" height="404" alt="Screenshot 2025-10-06 at 8 24 06 PM" src="https://github.com/user-attachments/assets/538b03fe-8234-4c2c-acac-f0a624a752e4" />

