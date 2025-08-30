# CSI Quiz Challenge - Flask/MongoDB Version

A cyberpunk-themed quiz application built with Flask, MongoDB, HTML, CSS, and JavaScript.

## Tech Stack

- **Backend**: Flask (Python)
- **Database**: MongoDB
- **Frontend**: HTML, CSS, JavaScript
- **Styling**: Custom CSS with cyberpunk theme

## Features

- Cyberpunk-themed UI with neon effects
- 10 computer science questions
- Real-time leaderboard
- Admin dashboard with data management
- Responsive design
- Instagram follow integration

## Setup Instructions

### Prerequisites

- Python 3.8+
- MongoDB (local or cloud instance)
- pip (Python package manager)

### Installation

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```
   SECRET_KEY=your-secret-key-here
   MONGO_URI=mongodb://localhost:27017/csi_quiz
   ```

3. **Start MongoDB:**
   - For local MongoDB: `mongod`
   - For MongoDB Atlas: Use your connection string in MONGO_URI

4. **Run the application:**
   ```bash
   python app.py
   ```

5. **Access the application:**
   Open your browser and go to `http://localhost:5000`

## Database Schema

### Collections

#### quiz_submissions
```javascript
{
  _id: ObjectId,
  first_name: String,
  last_name: String,
  email: String,
  branch: String,
  score: Number,
  total_questions: Number,
  answers: Object,
  time_taken: Number, // in seconds
  completed_at: Date
}
```

## API Endpoints

- `GET /` - Main application page
- `GET /api/questions` - Get quiz questions
- `POST /api/submit-quiz` - Submit quiz answers
- `GET /api/leaderboard` - Get leaderboard data
- `GET /api/admin/submissions` - Get all submissions (admin)
- `POST /api/admin/reset` - Reset all data (admin)

## Admin Access

- Password: `CSI2025`
- Features:
  - View all submissions
  - Nuclear reset (delete all data)
  - Real-time data refresh

## Development

The application uses:
- Flask for the web server and API
- PyMongo for MongoDB integration
- Vanilla JavaScript for frontend interactivity
- Custom CSS for cyberpunk styling

## File Structure

```
├── app.py                 # Flask application
├── requirements.txt       # Python dependencies
├── templates/
│   └── index.html        # Main HTML template
├── static/
│   ├── css/
│   │   └── styles.css    # Cyberpunk styling
│   └── js/
│       └── app.js        # Frontend JavaScript
└── .env                  # Environment variables
```

## Deployment

For production deployment:

1. Set `DEBUG=False` in app.py
2. Use a production WSGI server like Gunicorn
3. Set up proper MongoDB security
4. Configure environment variables securely
5. Use HTTPS in production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.