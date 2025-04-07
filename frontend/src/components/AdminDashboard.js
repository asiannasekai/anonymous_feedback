import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Modal, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [error, setError] = useState(null);
  const [responseText, setResponseText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/feedback', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFeedbacks(response.data);
      } catch (err) {
        setError('Failed to fetch feedbacks');
      }
    };

    fetchFeedbacks();
  }, [navigate]);

  const handleStatusChange = async (feedbackId, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(
        `http://localhost:5000/api/feedback/${feedbackId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setFeedbacks(feedbacks.map(feedback => 
        feedback.id === feedbackId 
          ? { ...feedback, status: newStatus }
          : feedback
      ));
    } catch (err) {
      setError('Failed to update status');
    }
  };

  const handleResponseSubmit = async () => {
    if (!selectedFeedback) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(
        `http://localhost:5000/api/feedback/${selectedFeedback.id}`,
        { 
          response: responseText,
          status: 'reviewed'
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFeedbacks(feedbacks.map(feedback => 
        feedback.id === selectedFeedback.id 
          ? { 
              ...feedback, 
              response: responseText,
              status: 'reviewed',
              response_date: new Date().toISOString()
            }
          : feedback
      ));

      setShowModal(false);
      setResponseText('');
    } catch (err) {
      setError('Failed to submit response');
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      reviewed: 'info',
      resolved: 'success'
    };
    return <Badge bg={variants[status]} className="px-3 py-2">{status}</Badge>;
  };

  const getSeverityBadge = (severity) => {
    const variants = {
      low: 'success',
      medium: 'warning',
      high: 'danger'
    };
    return <Badge bg={variants[severity]} className="px-3 py-2">{severity}</Badge>;
  };

  const handleShowModal = (feedback) => {
    setSelectedFeedback(feedback);
    setResponseText(feedback.response || '');
    setShowModal(true);
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Feedback Dashboard</h2>
        <div className="text-muted">
          {feedbacks.length} {feedbacks.length === 1 ? 'submission' : 'submissions'}
        </div>
      </div>
      
      {error && <div className="alert alert-danger mb-4">{error}</div>}
      
      <Table hover className="mb-0">
        <thead>
          <tr>
            <th className="border-0">ID</th>
            <th className="border-0">Category</th>
            <th className="border-0">Severity</th>
            <th className="border-0">Date</th>
            <th className="border-0">Status</th>
            <th className="border-0">Actions</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map(feedback => (
            <tr key={feedback.id}>
              <td className="align-middle">#{feedback.id}</td>
              <td className="align-middle">{feedback.category || 'N/A'}</td>
              <td className="align-middle">{getSeverityBadge(feedback.severity)}</td>
              <td className="align-middle">
                {new Date(feedback.created_at).toLocaleDateString()}
              </td>
              <td className="align-middle">{getStatusBadge(feedback.status)}</td>
              <td className="align-middle">
                <Button
                  variant="link"
                  onClick={() => handleShowModal(feedback)}
                  className="text-decoration-none p-0"
                >
                  View Details
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header className="border-0 pb-0">
          <Modal.Title>Feedback Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-4">
          {selectedFeedback && (
            <>
              <Row className="mb-4">
                <Col md={6}>
                  <div className="mb-3">
                    <h6 className="text-muted mb-2">Category</h6>
                    <p className="mb-0">{selectedFeedback.category || 'N/A'}</p>
                  </div>
                  <div className="mb-3">
                    <h6 className="text-muted mb-2">Severity</h6>
                    <p className="mb-0">{getSeverityBadge(selectedFeedback.severity)}</p>
                  </div>
                  <div>
                    <h6 className="text-muted mb-2">Meeting Date</h6>
                    <p className="mb-0">{selectedFeedback.meeting_date || 'N/A'}</p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <h6 className="text-muted mb-2">Status</h6>
                    <p className="mb-0">{getStatusBadge(selectedFeedback.status)}</p>
                  </div>
                  <div className="mb-3">
                    <h6 className="text-muted mb-2">Submitted</h6>
                    <p className="mb-0">
                      {new Date(selectedFeedback.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <h6 className="text-muted mb-2">Tags</h6>
                    <p className="mb-0">{selectedFeedback.tags || 'N/A'}</p>
                  </div>
                </Col>
              </Row>

              <div className="mb-4">
                <h6 className="text-muted mb-2">Feedback</h6>
                <p className="mb-0">{selectedFeedback.feedback_text}</p>
              </div>

              {selectedFeedback.email && (
                <div className="mb-4">
                  <h6 className="text-muted mb-2">Contact Email</h6>
                  <p className="mb-0">{selectedFeedback.email}</p>
                </div>
              )}

              <div className="mb-4">
                <h6 className="text-muted mb-2">Admin Response</h6>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Enter your response here..."
                  className="border-2"
                />
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button 
            variant="outline-secondary" 
            onClick={() => setShowModal(false)}
            className="px-4"
          >
            Close
          </Button>
          <Button 
            variant="primary" 
            onClick={handleResponseSubmit}
            className="px-4"
          >
            Save Response
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminDashboard; 