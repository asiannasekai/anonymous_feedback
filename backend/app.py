from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os
from dotenv import load_dotenv
from cryptography.fernet import Fernet
import jwt
import bcrypt
import hashlib

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://localhost/anonymous_feedback')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-jwt-secret-key-here')

db = SQLAlchemy(app)

# Generate encryption key for email anonymization
EMAIL_ENCRYPTION_KEY = Fernet.generate_key()
fernet = Fernet(EMAIL_ENCRYPTION_KEY)

# Models
class Feedback(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    feedback_text = db.Column(db.Text, nullable=False)
    encrypted_email = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_anonymous = db.Column(db.Boolean, default=True)
    status = db.Column(db.String(20), default='pending')  # pending, reviewed, resolved
    category = db.Column(db.String(50))  # inclusivity, technical, environment, etc.
    severity = db.Column(db.String(20))  # low, medium, high
    meeting_date = db.Column(db.Date)  # Date of the meeting being referenced
    tags = db.Column(db.String(255))  # Comma-separated tags for categorization
    response = db.Column(db.Text)  # Admin response to the feedback
    response_date = db.Column(db.DateTime)  # When the response was added
    response_by = db.Column(db.Integer, db.ForeignKey('admin_user.id'))  # Admin who responded

class AdminUser(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    role = db.Column(db.String(20), default='admin')  # admin, moderator, etc.
    is_active = db.Column(db.Boolean, default=True)

# In-memory storage for demo purposes
# In production, use a proper database
feedback_store = []
email_mapping = {}

def generate_anonymous_id(email):
    """Generate a secure anonymous ID from email"""
    salt = os.environ.get('SALT', 'default-salt')
# Routes
@app.route('/api/feedback', methods=['POST'])
def submit_feedback():
    data = request.get_json()
    
    # Encrypt email if provided
    encrypted_email = None
    if data.get('email'):
        encrypted_email = fernet.encrypt(data['email'].encode()).decode()
    
    feedback = Feedback(
        feedback_text=data['feedback_text'],
        encrypted_email=encrypted_email,
        is_anonymous=data.get('is_anonymous', True),
        category=data.get('category'),
        severity=data.get('severity'),
        meeting_date=data.get('meeting_date'),
        tags=data.get('tags')
    )
    
    db.session.add(feedback)
    db.session.commit()
    
    return jsonify({
        'message': 'Feedback submitted successfully',
        'id': feedback.id
    }), 201

@app.route('/api/feedback', methods=['GET'])
def get_feedback():
    feedbacks = Feedback.query.order_by(Feedback.created_at.desc()).all()
    
    # Decrypt emails for admin view
    feedback_list = []
    for feedback in feedbacks:
        decrypted_email = None
        if feedback.encrypted_email:
            decrypted_email = fernet.decrypt(feedback.encrypted_email.encode()).decode()
        
        feedback_list.append({
            'id': feedback.id,
            'feedback_text': feedback.feedback_text,
            'email': decrypted_email,
            'created_at': feedback.created_at.isoformat(),
            'status': feedback.status,
            'category': feedback.category,
            'severity': feedback.severity,
            'meeting_date': feedback.meeting_date.isoformat() if feedback.meeting_date else None,
            'tags': feedback.tags,
            'response': feedback.response,
            'response_date': feedback.response_date.isoformat() if feedback.response_date else None
        })
    
    return jsonify(feedback_list)

@app.route('/api/feedback/<int:feedback_id>', methods=['PUT'])
def update_feedback_status(feedback_id):
    data = request.get_json()
    feedback = Feedback.query.get_or_404(feedback_id)
    
    feedback.status = data.get('status', feedback.status)
    feedback.response = data.get('response', feedback.response)
    feedback.response_date = datetime.utcnow() if data.get('response') else feedback.response_date
    feedback.response_by = data.get('response_by', feedback.response_by)
    
    db.session.commit()
    
    return jsonify({'message': 'Feedback updated successfully'})

# Admin authentication
@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    admin = AdminUser.query.filter_by(username=data['username']).first()
    
    if admin and bcrypt.checkpw(data['password'].encode(), admin.password_hash.encode()):
        admin.last_login = datetime.utcnow()
        db.session.commit()
        
        token = jwt.encode(
            {'admin_id': admin.id},
            app.config['JWT_SECRET_KEY'],
            algorithm='HS256'
        )
        return jsonify({'token': token})
    
    return jsonify({'error': 'Invalid credentials'}), 401

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True) 