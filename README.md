# Club Feedback System

A secure and anonymous feedback system for clubs, built with HTML, CSS, and JavaScript.

## Features

- Anonymous feedback submission
- Secure email wrapping for follow-up communication
- Category-based feedback organization
- Severity and urgency tracking
- Tag-based categorization
- Real-time submission status

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

## Deployment

The frontend is automatically deployed to GitHub Pages when changes are pushed to the main branch.

## Backend

The backend is a Flask application that handles:
- Feedback submission
- Anonymous email wrapping
- Status tracking

## Security

- All feedback is submitted anonymously
- Email addresses are converted to secure hashes
- No personal information is stored
- HTTPS encryption for all communications

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request 