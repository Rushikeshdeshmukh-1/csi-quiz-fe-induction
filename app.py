from flask import Flask, render_template, request, jsonify, session
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'your-secret-key-here')

# MongoDB configuration
app.config["MONGO_URI"] = os.getenv('MONGO_URI', 'mongodb://localhost:27017/csi_quiz')
mongo = PyMongo(app)

# Quiz questions data
QUIZ_QUESTIONS = [
    {
        "id": 1,
        "question": "What does CPU stand for?",
        "options": ["Central Processing Unit", "Computer Personal Unit", "Control Process Utility", "Central Performance Unit"],
        "correctAnswer": "Central Processing Unit"
    },
    {
        "id": 2,
        "question": "Which of the following is not an operating system?",
        "options": ["Windows", "Linux", "Oracle", "MacOS"],
        "correctAnswer": "Oracle"
    },
    {
        "id": 3,
        "question": "HTML is used for?",
        "options": ["Structuring web pages", "Designing circuits", "Data storage", "Operating systems"],
        "correctAnswer": "Structuring web pages"
    },
    {
        "id": 4,
        "question": "What is the full form of SQL?",
        "options": ["Structured Query Language", "Simple Query Logic", "Systematic Query List", "Sequential Query Language"],
        "correctAnswer": "Structured Query Language"
    },
    {
        "id": 5,
        "question": "Which data structure uses FIFO?",
        "options": ["Stack", "Queue", "Tree", "Graph"],
        "correctAnswer": "Queue"
    },
    {
        "id": 6,
        "question": "Which company developed Java?",
        "options": ["Sun Microsystems", "Oracle", "Microsoft", "IBM"],
        "correctAnswer": "Sun Microsystems"
    },
    {
        "id": 7,
        "question": "Which of the following is a NoSQL database?",
        "options": ["MySQL", "MongoDB", "PostgreSQL", "OracleDB"],
        "correctAnswer": "MongoDB"
    },
    {
        "id": 8,
        "question": "Which algorithm is used for shortest path in a graph?",
        "options": ["Dijkstra's", "Kruskal's", "Prim's", "Merge Sort"],
        "correctAnswer": "Dijkstra's"
    },
    {
        "id": 9,
        "question": "Which protocol is used to send email?",
        "options": ["SMTP", "HTTP", "FTP", "IMAP"],
        "correctAnswer": "SMTP"
    },
    {
        "id": 10,
        "question": "What does OOP stand for?",
        "options": ["Object-Oriented Programming", "Overloaded Operating Process", "Open Operation Protocol", "Optional Object Processing"],
        "correctAnswer": "Object-Oriented Programming"
    }
]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/questions')
def get_questions():
    return jsonify(QUIZ_QUESTIONS)

@app.route('/api/submit-quiz', methods=['POST'])
def submit_quiz():
    try:
        data = request.json
        
        # Calculate score
        score = 0
        for question in QUIZ_QUESTIONS:
            if str(question['id']) in data['answers']:
                if data['answers'][str(question['id'])] == question['correctAnswer']:
                    score += 1
        
        # Create submission document
        submission = {
            'first_name': data['firstName'],
            'last_name': data['lastName'],
            'email': data['email'],
            'branch': data['branch'],
            'score': score,
            'total_questions': len(QUIZ_QUESTIONS),
            'answers': data['answers'],
            'time_taken': data.get('timeTaken', 0),
            'completed_at': datetime.utcnow()
        }
        
        # Insert into MongoDB
        result = mongo.db.quiz_submissions.insert_one(submission)
        
        return jsonify({
            'success': True,
            'score': score,
            'total': len(QUIZ_QUESTIONS),
            'id': str(result.inserted_id)
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/leaderboard')
def get_leaderboard():
    try:
        # Get all submissions sorted by score (desc) and completion time (asc)
        submissions = list(mongo.db.quiz_submissions.find(
            {},
            {'_id': 1, 'first_name': 1, 'last_name': 1, 'branch': 1, 'score': 1, 'total_questions': 1, 'completed_at': 1}
        ).sort([('score', -1), ('completed_at', 1)]))
        
        # Convert ObjectId to string and format data
        for submission in submissions:
            submission['_id'] = str(submission['_id'])
            submission['completed_at'] = submission['completed_at'].isoformat()
        
        return jsonify(submissions)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/submissions')
def get_all_submissions():
    try:
        # Get all submissions with full details
        submissions = list(mongo.db.quiz_submissions.find().sort([('completed_at', -1)]))
        
        # Convert ObjectId to string and format data
        for submission in submissions:
            submission['_id'] = str(submission['_id'])
            submission['completed_at'] = submission['completed_at'].isoformat()
        
        return jsonify(submissions)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/reset', methods=['POST'])
def nuclear_reset():
    try:
        # Delete all submissions
        result = mongo.db.quiz_submissions.delete_many({})
        
        return jsonify({
            'success': True,
            'deleted_count': result.deleted_count
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)