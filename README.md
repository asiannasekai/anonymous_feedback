# Anonymous Feedback System

A secure and anonymous feedback system for tech clubs to report inclusivity issues and discomfort during meetings.

## Features

- Anonymous feedback submission
- Optional email field with anonymization
- Secure data storage
- Admin dashboard for review
- Modern, responsive UI

## Tech Stack

- Frontend: React.js, Bootstrap
- Backend: Python Flask
- Database: PostgreSQL
- Security: TLS, data encryption
- Deployment: Docker, GitHub Actions

## Project Structure

```
anonymous_feedback/
├── frontend/           # React frontend application
├── backend/           # Flask backend application
├── docker/           # Docker configuration files
└── docs/             # Documentation
```

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   # Frontend
   cd frontend
   npm install

   # Backend
   cd backend
   pip install -r requirements.txt
   ```
3. Configure environment variables
4. Start the development servers:
   ```bash
   # Frontend
   cd frontend
   npm start

   # Backend
   cd backend
   flask run
   ```

## Security Features

- End-to-end encryption
- Anonymous email handling
- Secure data storage
- Input validation and sanitization
- Role-based access control

## Contributing

Please read our contributing guidelines before submitting pull requests.

## License

MIT License 