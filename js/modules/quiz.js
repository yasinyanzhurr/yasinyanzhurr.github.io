/**
 * quiz.js
 * Module untuk mengelola quiz interaktif
 * 
 * @author: yyanzhur
 * @created: 2025-01-26 14:51:25
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
        
        // Elemen UI
        this.questionContainer = document.getElementById('questions-container');
        this.progressBar = document.querySelector('.progress-bar');
        this.prevButton = document.getElementById('prevQuestion');
        this.nextButton = document.getElementById('nextQuestion');
        this.submitButton = document.getElementById('submitQuiz');
        this.resultsContainer = document.getElementById('quiz-results');
    }

    // Memulai quiz
    async init() {
        debug('Starting quiz initialization');
        try {
            const response = await fetch(`/articles/matematika/sd/content/perkaliandasar/exercises/quiz1.json`);
            debug('Quiz data response:', response);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            this.quizData = await response.json();
            debug('Quiz data loaded:', this.quizData);
            
            this.setupEventListeners();
            this.showQuestion(0);
            
            debug('Quiz initialization complete');
        } catch (error) {
            console.error('Error loading quiz:', error);
            this.showError(error.message);
        }
    }

    // Setup event listeners
    setupEventListeners() {
        this.prevButton.addEventListener('click', () => this.previousQuestion());
        this.nextButton.addEventListener('click', () => this.nextQuestion());
        this.submitButton.addEventListener('click', () => this.submitQuiz());
    }

    // Tampilkan pertanyaan
    showQuestion(index) {
        const question = this.quizData.questions[index];
        
        // Buat HTML untuk pertanyaan
        let html = `
            <div class="question-card" data-question="${index + 1}">
                <h4>Pertanyaan ${index + 1} dari ${this.quizData.questions.length}</h4>
                <p class="question-text">${question.question}</p>
                <div class="options-container">
        `;

        // Tambahkan opsi berdasarkan tipe pertanyaan
        if (question.type === 'multiple_choice') {
            html += this.createMultipleChoice(question, index);
        } else if (question.type === 'true_false') {
            html += this.createTrueFalse(question, index);
        } else if (question.type === 'fill_blank') {
            html += this.createFillBlank(question, index);
        }

        html += `
                </div>
            </div>
        `;

        this.questionContainer.innerHTML = html;
        
        // Setup event listeners untuk opsi
        this.setupOptionListeners();
        
        // Update tombol navigasi
        this.updateNavigation();
    }

    // Buat opsi pilihan ganda
    createMultipleChoice(question, index) {
        return question.options.map(option => `
            <div class="option-item ${this.answers[index] === option.id ? 'selected' : ''}"
                 data-option="${option.id}">
                <span class="option-label">${option.id.toUpperCase()}.</span>
                ${option.text}
            </div>
        `).join('');
    }

    // Buat opsi benar/salah
    createTrueFalse(question, index) {
        return `
            <div class="option-item ${this.answers[index] === true ? 'selected' : ''}"
                 data-option="true">Benar</div>
            <div class="option-item ${this.answers[index] === false ? 'selected' : ''}"
                 data-option="false">Salah</div>
        `;
    }

    // Buat input isian
    createFillBlank(question, index) {
        return `
            <div class="fill-blank-container">
                <input type="text" class="form-control" 
                       value="${this.answers[index] || ''}"
                       placeholder="Ketik jawaban Anda di sini">
            </div>
        `;
    }

    // Setup event listeners untuk opsi
    setupOptionListeners() {
        // Untuk pilihan ganda dan benar/salah
        const options = this.questionContainer.querySelectorAll('.option-item');
        options.forEach(option => {
            option.addEventListener('click', () => {
                options.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                this.answers[this.currentQuestion] = option.dataset.option;
                this.updateProgress();
            });
        });

        // Untuk isian
        const input = this.questionContainer.querySelector('input');
        if (input) {
            input.addEventListener('change', (e) => {
                this.answers[this.currentQuestion] = e.target.value;
                this.updateProgress();
            });
        }
    }

    // Update navigasi
    updateNavigation() {
        this.prevButton.disabled = this.currentQuestion === 0;
        this.nextButton.style.display = 
            this.currentQuestion === this.quizData.questions.length - 1 ? 'none' : 'block';
        this.submitButton.style.display = 
            this.currentQuestion === this.quizData.questions.length - 1 ? 'block' : 'none';
    }

    // Update progress bar
    updateProgress() {
        const progress = (this.answers.filter(a => a !== undefined).length / 
                         this.quizData.questions.length) * 100;
        this.progressBar.style.width = `${progress}%`;
    }

    // Pertanyaan sebelumnya
    previousQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.showQuestion(this.currentQuestion);
        }
    }

    // Pertanyaan selanjutnya
    nextQuestion() {
        if (this.currentQuestion < this.quizData.questions.length - 1) {
            this.currentQuestion++;
            this.showQuestion(this.currentQuestion);
        }
    }

    // Submit quiz
    async submitQuiz() {
        // Hitung score
        this.calculateScore();
        
        // Tampilkan hasil
        this.showResults();
        
        // Simpan hasil ke server (bisa ditambahkan nanti)
        await this.saveResults();
    }

    // Hitung score
    calculateScore() {
        this.score = 0;
        this.quizData.questions.forEach((question, index) => {
            if (this.answers[index] === question.correctAnswer) {
                this.score += question.points;
            }
        });
    }

    // Tampilkan hasil
    showResults() {
        const totalPoints = this.quizData.questions.reduce((sum, q) => sum + q.points, 0);
        const percentage = Math.round((this.score / totalPoints) * 100);

        // Tentukan badge dan pesan berdasarkan score
        const { badge, message } = this.getBadgeAndMessage(percentage);

        this.questionContainer.style.display = 'none';
        this.resultsContainer.style.display = 'block';
        this.resultsContainer.innerHTML = `
            <div class="results-content text-center">
                <div class="celebration-animation">
                    ${this.getCelebrationAnimation(percentage)}
                </div>
                
                <div class="score-badge mb-4">
                    <i class="bi ${badge.icon} display-1 text-${badge.color}"></i>
                </div>

                <div class="score-circle">
                    <span class="score-number">${percentage}%</span>
                </div>

                <h3 class="mt-4">Skor Anda: ${this.score} dari ${totalPoints}</h3>
                
                <div class="achievement-message mt-3">
                    <p class="lead">${message}</p>
                </div>

                <div class="action-buttons mt-4">
                    <button class="btn btn-primary me-2" onclick="location.reload()">
                        <i class="bi bi-arrow-repeat"></i> Coba Lagi
                    </button>
                    <button class="btn btn-success" onclick="this.reviewAnswers()">
                        <i class="bi bi-journal-text"></i> Pelajari Jawaban
                    </button>
                </div>
            </div>
        `;
    }

    getBadgeAndMessage(percentage) {
        if (percentage >= 90) {
            return {
                badge: {
                    icon: 'bi-trophy',
                    color: 'warning'
                },
                message: 'Luar biasa! Kamu adalah bintang matematika! 🌟'
            };
        } else if (percentage >= 70) {
            return {
                badge: {
                    icon: 'bi-award',
                    color: 'success'
                },
                message: 'Hebat! Kamu sudah hampir menguasai materi ini! 👏'
            };
        } else if (percentage >= 50) {
            return {
                badge: {
                    icon: 'bi-emoji-smile',
                    color: 'primary'
                },
                message: 'Bagus! Terus berlatih, kamu pasti bisa lebih baik! 💪'
            };
        } else {
            return {
                badge: {
                    icon: 'bi-book',
                    color: 'info'
                },
                message: 'Jangan menyerah! Mari kita pelajari lagi materinya! 📚'
            };
        }
    }

    getCelebrationAnimation(percentage) {
        if (percentage >= 70) {
            return `
                <div class="confetti">
                    <div class="confetti-piece"></div>
                    <div class="confetti-piece"></div>
                    <div class="confetti-piece"></div>
                    <div class="confetti-piece"></div>
                    <div class="confetti-piece"></div>
                </div>
            `;
        }
        return '';
    }

    reviewAnswers() {
        this.resultsContainer.innerHTML = `
            <div class="review-content">
                <h3 class="text-center mb-4">
                    <i class="bi bi-journal-text"></i> 
                    Mari Belajar dari Jawaban Kita!
                </h3>

                ${this.quizData.questions.map((question, index) => `
                    <div class="review-item card mb-4 ${
                        this.answers[index] === question.correctAnswer 
                        ? 'border-success' 
                        : 'border-warning'
                    }">
                        <div class="card-header ${
                            this.answers[index] === question.correctAnswer 
                            ? 'bg-success text-white' 
                            : 'bg-warning'
                        }">
                            <div class="d-flex align-items-center">
                                <span class="question-number">Soal ${index + 1}</span>
                                ${this.answers[index] === question.correctAnswer 
                                    ? '<span class="badge bg-white text-success ms-2">Benar!</span>' 
                                    : '<span class="badge bg-white text-warning ms-2">Perlu Dipelajari</span>'
                                }
                            </div>
                        </div>
                        <div class="card-body">
                            <!-- Soal -->
                            <div class="question-section">
                                <h5 class="card-title">${question.question}</h5>
                                ${this.renderQuestionVisual(question)}
                            </div>

                            <!-- Jawaban -->
                            <div class="answer-section mt-4">
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="your-answer p-3 rounded ${
                                            this.answers[index] === question.correctAnswer 
                                            ? 'bg-success-light' 
                                            : 'bg-warning-light'
                                        }">
                                            <h6>
                                                <i class="bi bi-person-circle"></i> 
                                                Jawaban Kamu
                                            </h6>
                                            <p class="mb-0">${this.formatAnswer(this.answers[index], question)}</p>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="correct-answer p-3 rounded bg-success-light">
                                            <h6>
                                                <i class="bi bi-check-circle"></i> 
                                                Jawaban Benar
                                            </h6>
                                            <p class="mb-0">${this.formatAnswer(question.correctAnswer, question)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Penjelasan -->
                            <div class="explanation-section mt-4">
                                <button class="btn btn-outline-primary w-100" 
                                        onclick="this.nextElementSibling.classList.toggle('d-none')">
                                    <i class="bi bi-lightbulb"></i> 
                                    Lihat Penjelasan
                                </button>
                                <div class="explanation-content d-none mt-3">
                                    <div class="card">
                                        <div class="card-body">
                                            <h6 class="card-title">
                                                <i class="bi bi-chat-quote"></i> 
                                                Penjelasan
                                            </h6>
                                            ${this.renderExplanation(question)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Tips -->
                            ${question.tips ? `
                                <div class="tips-section mt-3">
                                    <div class="alert alert-info">
                                        <h6>
                                            <i class="bi bi-stars"></i> 
                                            Tips Belajar
                                        </h6>
                                        <p class="mb-0">${question.tips}</p>
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `).join('')}

                <!-- Navigasi -->
                <div class="review-navigation text-center mt-4">
                    <button class="btn btn-primary me-2" onclick="location.reload()">
                        <i class="bi bi-arrow-repeat"></i> 
                        Coba Quiz Lagi
                    </button>
                    <button class="btn btn-success" onclick="window.location.href='#materi'">
                        <i class="bi bi-book"></i> 
                        Pelajari Materi
                    </button>
                </div>
            </div>
        `;
    }

    renderQuestionVisual(question) {
        if (question.type === 'perkalian') {
            return `
                <div class="visual-helper mb-3">
                    <div class="multiplication-grid">
                        ${this.createMultiplicationGrid(question.numbers[0], question.numbers[1])}
                    </div>
                </div>
            `;
        }
        // Tambahkan tipe visual lain sesuai kebutuhan
        return '';
    }

    createMultiplicationGrid(a, b) {
        let grid = '<div class="grid-container">';
        for (let i = 0; i < a; i++) {
            grid += '<div class="grid-row">';
            for (let j = 0; j < b; j++) {
                grid += '<div class="grid-cell"></div>';
            }
            grid += '</div>';
        }
        grid += '</div>';
        return grid;
    }

    renderExplanation(question) {
        let explanation = `<p>${question.explanation}</p>`;

        // Tambah langkah-langkah jika ada
        if (question.steps) {
            explanation += `
                <div class="steps-container">
                    <h6 class="mt-3">Langkah Penyelesaian:</h6>
                    <div class="steps">
                        ${question.steps.map((step, i) => `
                            <div class="step-item" onclick="this.classList.toggle('active')">
                                <div class="step-number">${i + 1}</div>
                                <div class="step-content">
                                    <h6>${step.title}</h6>
                                    <p class="mb-0">${step.description}</p>
                                    ${step.image ? `
                                        <img src="${step.image}" alt="${step.title}" 
                                             class="img-fluid mt-2">
                                    ` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        return explanation;
    }

    formatAnswer(answer, question) {
        // Format jawaban sesuai tipe soal
        if (question.type === 'multiple_choice') {
            const option = question.options.find(opt => opt.id === answer);
            return option ? option.text : answer;
        }
        return answer;
    }

    // Dapatkan pesan berdasarkan score
    getScoreMessage(percentage) {
        if (percentage >= 90) return 'Luar biasa! Anda menguasai materi dengan sangat baik!';
        if (percentage >= 70) return 'Bagus! Anda sudah memahami sebagian besar materi.';
        if (percentage >= 50) return 'Cukup baik. Mari tingkatkan lagi pemahamannya!';
        return 'Terus semangat belajar! Anda pasti bisa lebih baik lagi.';
    }

    // Simpan hasil
    async saveResults() {
        try {
            // Ini bisa diimplementasikan nanti untuk menyimpan hasil ke server
            console.log('Saving results...', {
                quizId: this.quizId,
                score: this.score,
                answers: this.answers,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error saving results:', error);
        }
    }

    // Tampilkan error
    showError(message) {
        this.questionContainer.innerHTML = `
            <div class="alert alert-danger">
                <h4>Error</h4>
                <p>${message}</p>
                <button onclick="location.reload()" class="btn btn-outline-danger btn-sm">
                    Coba Lagi
                </button>
            </div>
        `;
    }



}