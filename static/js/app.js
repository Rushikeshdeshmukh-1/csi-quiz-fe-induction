// CSI Quiz Application - JavaScript Frontend

class QuizApp {
    constructor() {
        this.currentPage = 'loading';
        this.userData = null;
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.userAnswers = {};
        this.quizStartTime = 0;
        this.timer = null;
        this.timeLeft = 30;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.startLoadingSequence();
    }
    
    setupEventListeners() {
        // Landing page
        document.getElementById('get-started-btn').addEventListener('click', () => {
            this.showPage('instagram-follow');
        });
        
        // Instagram follow
        document.getElementById('instagram-confirm-btn').addEventListener('click', () => {
            this.showPage('register');
        });
        
        // Registration form
        document.getElementById('registration-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegistration();
        });
        
        // Admin access
        document.getElementById('admin-access-btn').addEventListener('click', () => {
            this.showPage('admin-dashboard');
        });
        
        // Admin login
        document.getElementById('admin-login-btn').addEventListener('click', () => {
            this.handleAdminLogin();
        });
        
        document.getElementById('admin-back-btn').addEventListener('click', () => {
            this.showPage('leaderboard');
        });
        
        document.getElementById('dashboard-back-btn').addEventListener('click', () => {
            this.showPage('leaderboard');
        });
        
        // Admin actions
        document.getElementById('refresh-data-btn').addEventListener('click', () => {
            this.loadAllSubmissions();
        });
        
        document.getElementById('nuclear-reset-btn').addEventListener('click', () => {
            this.handleNuclearReset();
        });
        
        // Quiz submit button
        document.getElementById('submit-answer-btn').addEventListener('click', () => {
            this.handleSubmitAnswer();
        });
        
        // Admin password enter key
        document.getElementById('admin-password').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleAdminLogin();
            }
        });
    }
    
    startLoadingSequence() {
        const loadingTexts = ["INITIALIZING", "CONNECTING", "LOADING CSI SYSTEMS"];
        let currentIndex = 0;
        
        const textInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % loadingTexts.length;
            document.getElementById('loading-message').textContent = loadingTexts[currentIndex];
        }, 1000);
        
        setTimeout(() => {
            clearInterval(textInterval);
            this.showPage('landing');
        }, 3000);
    }
    
    showPage(pageName) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show target screen
        document.getElementById(`${pageName}-screen`).classList.add('active');
        this.currentPage = pageName;
        
        // Load data for specific pages
        if (pageName === 'leaderboard') {
            this.loadLeaderboard();
        } else if (pageName === 'admin-dashboard') {
            this.resetAdminDashboard();
        }
    }
    
    async handleRegistration() {
        const formData = new FormData(document.getElementById('registration-form'));
        
        this.userData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            branch: formData.get('branch')
        };
        
        // Validate form
        if (!this.userData.firstName || !this.userData.lastName || !this.userData.email || !this.userData.branch) {
            this.showToast('Please fill in all fields', 'error');
            return;
        }
        
        if (!this.userData.email.includes('@')) {
            this.showToast('Please enter a valid email address', 'error');
            return;
        }
        
        // Load questions and start quiz
        await this.loadQuestions();
        this.startQuiz();
    }
    
    async loadQuestions() {
        try {
            const response = await fetch('/api/questions');
            this.questions = await response.json();
        } catch (error) {
            console.error('Error loading questions:', error);
            this.showToast('Failed to load questions', 'error');
        }
    }
    
    startQuiz() {
        this.currentQuestionIndex = 0;
        this.userAnswers = {};
        this.quizStartTime = Date.now();
        this.showPage('quiz');
        this.displayQuestion();
    }
    
    displayQuestion() {
        const question = this.questions[this.currentQuestionIndex];
        if (!question) return;
        
        // Update question info
        document.getElementById('question-counter').textContent = 
            `Question ${this.currentQuestionIndex + 1} of ${this.questions.length}`;
        document.getElementById('question-text').textContent = question.question;
        
        // Update progress bar
        const progress = ((this.currentQuestionIndex) / this.questions.length) * 100;
        document.querySelector('.progress-fill').style.width = `${progress}%`;
        
        // Create options
        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option-button';
            button.innerHTML = `
                <div class="option-letter">${String.fromCharCode(65 + index)}</div>
                <span>${option}</span>
            `;
            button.addEventListener('click', () => this.selectOption(option, button));
            optionsContainer.appendChild(button);
        });
        
        // Reset submit button
        document.getElementById('submit-answer-btn').disabled = true;
        document.getElementById('feedback').classList.add('hidden');
        
        // Start timer
        this.startTimer();
    }
    
    selectOption(option, buttonElement) {
        // Remove previous selections
        document.querySelectorAll('.option-button').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Select current option
        buttonElement.classList.add('selected');
        this.selectedAnswer = option;
        
        // Enable submit button
        document.getElementById('submit-answer-btn').disabled = false;
    }
    
    startTimer() {
        this.timeLeft = 30;
        document.getElementById('timer').textContent = `${this.timeLeft}s`;
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            document.getElementById('timer').textContent = `${this.timeLeft}s`;
            
            if (this.timeLeft <= 0) {
                this.handleSubmitAnswer(true);
            }
        }, 1000);
    }
    
    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
    
    handleSubmitAnswer(isTimeout = false) {
        this.stopTimer();
        
        const question = this.questions[this.currentQuestionIndex];
        const answer = isTimeout ? '' : this.selectedAnswer;
        
        // Store answer
        this.userAnswers[question.id] = answer;
        
        // Show feedback
        this.showAnswerFeedback(question, answer);
        
        // Auto advance after 2 seconds
        setTimeout(() => {
            this.nextQuestion();
        }, 2000);
    }
    
    showAnswerFeedback(question, userAnswer) {
        const feedbackDiv = document.getElementById('feedback');
        const feedbackText = document.getElementById('feedback-text');
        const correctAnswerDiv = document.getElementById('correct-answer');
        
        const isCorrect = userAnswer === question.correctAnswer;
        
        feedbackText.textContent = isCorrect ? 'CORRECT!' : 'INCORRECT!';
        feedbackText.className = `feedback-text ${isCorrect ? 'correct' : 'incorrect'}`;
        
        if (!isCorrect) {
            correctAnswerDiv.textContent = `Correct answer: ${question.correctAnswer}`;
        } else {
            correctAnswerDiv.textContent = '';
        }
        
        // Update option buttons to show correct/incorrect
        document.querySelectorAll('.option-button').forEach(btn => {
            const optionText = btn.querySelector('span').textContent;
            btn.classList.add('disabled');
            
            if (optionText === question.correctAnswer) {
                btn.classList.add('correct');
            } else if (optionText === userAnswer && !isCorrect) {
                btn.classList.add('incorrect');
            }
        });
        
        feedbackDiv.classList.remove('hidden');
        document.getElementById('submit-answer-btn').style.display = 'none';
    }
    
    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            this.selectedAnswer = null;
            document.getElementById('submit-answer-btn').style.display = 'block';
            this.displayQuestion();
        } else {
            this.completeQuiz();
        }
    }
    
    async completeQuiz() {
        const timeTaken = Math.floor((Date.now() - this.quizStartTime) / 1000);
        
        try {
            const response = await fetch('/api/submit-quiz', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: this.userData.firstName,
                    lastName: this.userData.lastName,
                    email: this.userData.email,
                    branch: this.userData.branch,
                    answers: this.userAnswers,
                    timeTaken: timeTaken
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showToast(`Quiz completed! Score: ${result.score}/${result.total}`, 'success');
            } else {
                this.showToast('Failed to submit quiz', 'error');
            }
        } catch (error) {
            console.error('Error submitting quiz:', error);
            this.showToast('Failed to submit quiz', 'error');
        }
        
        this.showPage('leaderboard');
    }
    
    async loadLeaderboard() {
        try {
            const response = await fetch('/api/leaderboard');
            const submissions = await response.json();
            
            this.displayLeaderboard(submissions);
        } catch (error) {
            console.error('Error loading leaderboard:', error);
            document.getElementById('leaderboard-content').innerHTML = 
                '<div class="loading-message">Failed to load leaderboard</div>';
        }
    }
    
    displayLeaderboard(submissions) {
        const container = document.getElementById('leaderboard-content');
        
        if (submissions.length === 0) {
            container.innerHTML = '<div class="loading-message">No submissions yet. Be the first to complete the quiz!</div>';
            return;
        }
        
        container.innerHTML = submissions.map((entry, index) => {
            const rank = index + 1;
            const percentage = Math.round((entry.score / entry.total_questions) * 100);
            
            let rankIcon = '';
            let rankClass = '';
            
            switch (rank) {
                case 1:
                    rankIcon = '<i class="fas fa-trophy trophy"></i>';
                    rankClass = 'rank-1';
                    break;
                case 2:
                    rankIcon = '<i class="fas fa-medal medal"></i>';
                    rankClass = 'rank-2';
                    break;
                case 3:
                    rankIcon = '<i class="fas fa-award award"></i>';
                    rankClass = 'rank-3';
                    break;
                default:
                    rankIcon = `<div class="rank-icon number">${rank}</div>`;
                    break;
            }
            
            return `
                <div class="leaderboard-entry ${rankClass}">
                    <div class="entry-left">
                        <div class="rank-icon">${rankIcon}</div>
                        <div class="entry-info">
                            <div class="name">${entry.first_name} ${entry.last_name}</div>
                            <div class="branch">${entry.branch}</div>
                        </div>
                    </div>
                    <div class="entry-right">
                        <div class="score">${entry.score}/${entry.total_questions}</div>
                        <div class="percentage">${percentage}%</div>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    handleAdminLogin() {
        const password = document.getElementById('admin-password').value;
        const ADMIN_PASSWORD = 'CSI2025';
        
        if (password === ADMIN_PASSWORD) {
            document.getElementById('admin-login').classList.add('hidden');
            document.getElementById('admin-dashboard').classList.remove('hidden');
            this.loadAllSubmissions();
            this.showToast('Access Granted - Welcome to the admin control center', 'success');
        } else {
            this.showToast('Access Denied - Incorrect password', 'error');
        }
    }
    
    resetAdminDashboard() {
        document.getElementById('admin-login').classList.remove('hidden');
        document.getElementById('admin-dashboard').classList.add('hidden');
        document.getElementById('admin-password').value = '';
    }
    
    async loadAllSubmissions() {
        try {
            const response = await fetch('/api/admin/submissions');
            const submissions = await response.json();
            
            document.getElementById('submission-count').textContent = submissions.length;
            this.displayAllSubmissions(submissions);
        } catch (error) {
            console.error('Error loading submissions:', error);
            this.showToast('Failed to fetch submissions', 'error');
        }
    }
    
    displayAllSubmissions(submissions) {
        const container = document.getElementById('submissions-table');
        
        if (submissions.length === 0) {
            container.innerHTML = '<div class="loading-message">No submissions found</div>';
            return;
        }
        
        const tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Branch</th>
                        <th>Score</th>
                        <th>Time</th>
                        <th>Completed</th>
                    </tr>
                </thead>
                <tbody>
                    ${submissions.map(entry => {
                        const percentage = Math.round((entry.score / entry.total_questions) * 100);
                        const timeTaken = entry.time_taken || 0;
                        const minutes = Math.floor(timeTaken / 60);
                        const seconds = (timeTaken % 60).toString().padStart(2, '0');
                        const completedDate = new Date(entry.completed_at).toLocaleString();
                        
                        return `
                            <tr>
                                <td>${entry.first_name} ${entry.last_name}</td>
                                <td style="font-size: 0.8rem; color: var(--cyber-text-dim);">${entry.email}</td>
                                <td>${entry.branch}</td>
                                <td>
                                    <span style="color: var(--cyber-primary); font-weight: bold;">${entry.score}/${entry.total_questions}</span>
                                    <span style="color: var(--cyber-text-dim); margin-left: 0.5rem;">(${percentage}%)</span>
                                </td>
                                <td style="color: var(--cyber-text-dim);">${minutes}:${seconds}</td>
                                <td style="font-size: 0.8rem; color: var(--cyber-text-dim);">${completedDate}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;
        
        container.innerHTML = tableHTML;
    }
    
    async handleNuclearReset() {
        const confirmed = confirm(
            "⚠️ NUCLEAR RESET WARNING ⚠️\n\nThis will permanently delete ALL quiz submissions!\n\nAre you sure you want to continue?"
        );
        
        if (!confirmed) return;
        
        const confirmText = prompt("Type 'DELETE ALL' to confirm:");
        if (confirmText !== 'DELETE ALL') {
            this.showToast('Reset Cancelled', 'info');
            return;
        }
        
        try {
            const response = await fetch('/api/admin/reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showToast('Nuclear Reset Complete - All data has been permanently deleted', 'error');
                this.loadAllSubmissions();
            } else {
                this.showToast('Reset Failed', 'error');
            }
        } catch (error) {
            console.error('Error during nuclear reset:', error);
            this.showToast('Reset Failed', 'error');
        }
    }
    
    showToast(message, type = 'info') {
        // Simple toast implementation
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--cyber-surface);
            border: 2px solid var(--cyber-primary);
            color: var(--cyber-text);
            padding: 1rem;
            border-radius: var(--radius);
            z-index: 1000;
            max-width: 300px;
            box-shadow: 0 0 20px hsla(185, 100%, 50%, 0.5);
        `;
        
        if (type === 'error') {
            toast.style.borderColor = 'var(--cyber-error)';
            toast.style.boxShadow = '0 0 20px hsla(0, 85%, 60%, 0.5)';
        } else if (type === 'success') {
            toast.style.borderColor = 'var(--cyber-accent)';
            toast.style.boxShadow = '0 0 20px hsla(120, 100%, 50%, 0.5)';
        }
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 5000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new QuizApp();
});