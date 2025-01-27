/**
 * quiz.js
 * Module untuk mengelola quiz interaktif
 * 
 * @file: quiz.js
 * @author: yyanzhur
 * @created: 2025-01-27 03:37:00
 * @last-modified: 2025-01-27 03:37:00
 */

const DEBUG = true;

function debug(...args) {
    if (DEBUG) {
        console.log('[Quiz Debug]:', ...args);
    }
}

export class QuizManager {
    constructor(quizId) {
        this.quizId = quizId;
        this.currentQuestion = 0;
        this.score = 0;
        this.answers = [];
        this.quizData = null;
        this.initializeElements();
    }

    initializeElements() {
        this.elements = {
            questionContainer: document.getElementById('questions-container'),
            progressBar: document.querySelector('.progress-bar'),
            prevButton: document.getElementById('prevQuestion'),
            nextButton: document.getElementById('nextQuestion'),
            submitButton: document.getElementById('submitQuiz'),
            resultsContainer: document.getElementById('quiz-results')
        };
        
        // Validate required elements
        Object.entries(this.elements).forEach(([key, element]) => {
            if (!element) {
                debug(`Warning: Element '${key}' not found`);
            }
        });
    }

    async init() {
        debug('Starting quiz initialization');
        try {
            const response = await fetch(`/articles/matematika/sd/content/perkaliandasar/exercises/quiz1.json`);
            debug('Quiz data response:', response);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            this.quizData = await response.json();
            this.validateQuizData(this.quizData);
            debug('Quiz data loaded:', this.quizData);
            
            this.setupEventListeners();
            this.showQuestion(0);
            
            debug('Quiz initialization complete');
        } catch (error) {
            console.error('Error loading quiz:', error);
            this.showError(error.message);
        }
    }

    validateQuizData(data) {
        if (!data || !Array.isArray(data.questions) || data.questions.length === 0) {
            throw new Error('Invalid quiz data format');
        }
        return true;
    }

    // ... (semua method lainnya tetap sama seperti sebelumnya)

    showError(message) {
        debug('Showing error:', message);
        const errorHtml = `
            <div class="alert alert-danger">
                <h4>Error</h4>
                <p>${message}</p>
                <button onclick="location.reload()" class="btn btn-outline-danger btn-sm">
                    Coba Lagi
                </button>
            </div>
        `;
        
        if (this.elements.questionContainer) {
            this.elements.questionContainer.innerHTML = errorHtml;
        } else {
            document.getElementById('quiz-container').innerHTML = errorHtml;
        }
    }
}