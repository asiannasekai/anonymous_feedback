from app import app, db, AdminUser, Feedback
import bcrypt
from datetime import datetime, timedelta

def init_db():
    with app.app_context():
        # Create all tables
        db.create_all()
        
        # Create admin user if not exists
        if not AdminUser.query.first():
            hashed_password = bcrypt.hashpw('admin123'.encode(), bcrypt.gensalt())
            admin = AdminUser(
                username='admin',
                password_hash=hashed_password.decode(),
                created_at=datetime.utcnow()
            )
            db.session.add(admin)
            db.session.commit()
            print("Created admin user: admin/admin123")

        # Create sample feedback if none exists
        if not Feedback.query.first():
            sample_feedbacks = [
                {
                    'feedback_text': 'The meeting environment could be more inclusive for introverted members.',
                    'encrypted_email': None,
                    'is_anonymous': True,
                    'status': 'pending',
                    'created_at': datetime.utcnow() - timedelta(days=2)
                },
                {
                    'feedback_text': 'Would appreciate more structured discussions to ensure everyone gets a chance to speak.',
                    'encrypted_email': None,
                    'is_anonymous': True,
                    'status': 'reviewed',
                    'created_at': datetime.utcnow() - timedelta(days=1)
                },
                {
                    'feedback_text': 'Some technical terms were not explained clearly for beginners.',
                    'encrypted_email': None,
                    'is_anonymous': True,
                    'status': 'resolved',
                    'created_at': datetime.utcnow() - timedelta(hours=12)
                }
            ]
            
            for feedback_data in sample_feedbacks:
                feedback = Feedback(**feedback_data)
                db.session.add(feedback)
            
            db.session.commit()
            print("Created sample feedback entries")

if __name__ == '__main__':
    init_db()
    print("Database initialization complete!") 