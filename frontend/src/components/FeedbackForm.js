import React, { useState } from 'react';
import { Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    feedback_text: '',
    email: '',
    is_anonymous: true,
    category: '',
    severity: 'medium',
    meeting_date: '',
    tags: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await axios.post('http://localhost:5000/api/feedback', formData);
      setSubmitted(true);
      setFormData({
        feedback_text: '',
        email: '',
        is_anonymous: true,
        category: '',
        severity: 'medium',
        meeting_date: '',
        tags: ''
      });
    } catch (err) {
      setError('Failed to submit feedback. Please try again.');
    }
  };

  if (submitted) {
    return (
      <Card className="mt-4">
        <Card.Body className="text-center py-5">
          <div className="mb-4">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="#34c759"/>
            </svg>
          </div>
          <h4 className="mb-3">Thank you for your feedback!</h4>
          <p className="text-muted mb-4">Your submission has been received anonymously.</p>
          <Button 
            variant="outline-primary" 
            onClick={() => setSubmitted(false)}
            className="px-4"
          >
            Submit Another Feedback
          </Button>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="mt-4">
      <Card.Body className="p-4">
        <div className="text-center mb-4">
          <h4 className="mb-2">Anonymous Feedback</h4>
          <p className="text-muted">Your feedback helps us create a better environment for everyone.</p>
        </div>
        
        {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-medium">Your Feedback</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              name="feedback_text"
              value={formData.feedback_text}
              onChange={handleChange}
              required
              placeholder="Share your thoughts with us..."
              className="border-2"
            />
          </Form.Group>

          <Row className="g-3 mb-4">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-medium">Category</Form.Label>
                <Form.Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="border-2"
                >
                  <option value="">Select a category</option>
                  <option value="inclusivity">Inclusivity</option>
                  <option value="technical">Technical Issues</option>
                  <option value="environment">Meeting Environment</option>
                  <option value="communication">Communication</option>
                  <option value="other">Other</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-medium">Severity</Form.Label>
                <Form.Select
                  name="severity"
                  value={formData.severity}
                  onChange={handleChange}
                  className="border-2"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="g-3 mb-4">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-medium">Meeting Date</Form.Label>
                <Form.Control
                  type="date"
                  name="meeting_date"
                  value={formData.meeting_date}
                  onChange={handleChange}
                  className="border-2"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-medium">Tags</Form.Label>
                <Form.Control
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="e.g., accessibility, beginners"
                  className="border-2"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-4">
            <Form.Label className="fw-medium">Email (Optional)</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email for updates"
              className="border-2"
            />
            <Form.Text className="text-muted">
              Your email will be encrypted and only used for follow-up communication.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Check
              type="checkbox"
              name="is_anonymous"
              checked={formData.is_anonymous}
              onChange={handleChange}
              label="Keep my submission anonymous"
              className="fw-medium"
            />
          </Form.Group>

          <div className="text-center">
            <Button 
              variant="primary" 
              type="submit"
              className="px-5 py-2"
            >
              Submit Feedback
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default FeedbackForm; 