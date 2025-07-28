// Your DSA Buddy - Popup JavaScript (Vanilla JS)
class DSABuddy {
    constructor() {
        this.currentStep = 'question';
        this.question = '';
        this.selectedLanguage = 'python';
        this.hints = [];
        this.solution = '';
        this.loading = false;
        this.error = '';
        this.timeLeft = CONFIG.TIMER_DURATION;
        this.timerActive = false;
        this.showSolution = false;
        this.apiKey = '';
        this.showApiKeyInput = false;
        
        this.init();
    }

    init() {
        this.loadApiKey();
        this.getQuestionFromLeetCode();
        this.render();
    }

    loadApiKey() {
        chrome.storage.sync.get(['apiKey'], (result) => {
            if (result.apiKey) {
                this.apiKey = result.apiKey;
            } else if (CONFIG.DEFAULT_API_KEY && CONFIG.DEFAULT_API_KEY !== 'sk-your-actual-api-key-here') {
                this.apiKey = CONFIG.DEFAULT_API_KEY;
                chrome.storage.sync.set({ apiKey: CONFIG.DEFAULT_API_KEY });
            } else {
                this.showApiKeyInput = true;
            }
            this.render();
        });
    }

    getQuestionFromLeetCode() {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'getQuestionInfo' }, (response) => {
                if (response && response.title) {
                    this.question = response.title;
                    console.log('Question extracted:', this.question); // Debug log
                    this.render();
                } else {
                    // Fallback: try to extract from URL
                    const url = tabs[0].url;
                    if (url.includes('leetcode.com/problems/')) {
                        const problemName = url.split('/problems/')[1]?.split('/')[0];
                        if (problemName) {
                            this.question = problemName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                            console.log('Question from URL:', this.question); // Debug log
                            this.render();
                        }
                    }
                }
            });
        });
    }

    saveApiKey() {
        chrome.storage.sync.set({ apiKey: this.apiKey }, () => {
            this.showApiKeyInput = false;
            this.render();
        });
    }

    async getHints() {
        // Check if mock mode is enabled
        if (CONFIG.MOCK_MODE) {
            this.loading = true;
            this.render();
            
            // Simulate API delay
            setTimeout(() => {
                console.log('Generating hints for question:', this.question); // Debug log
                const mockHints = CONFIG.MOCK_DATA_GENERATOR.getHints(this.question, this.selectedLanguage);
                console.log('Generated hints:', mockHints); // Debug log
                this.hints = mockHints.map((hint, index) => ({
                    number: index + 1,
                    text: hint
                }));
                
                this.currentStep = 'hints';
                this.timerActive = true;
                this.startTimer();
                this.loading = false;
                this.render();
            }, 1000);
            return;
        }

        if (!this.apiKey) {
            this.error = 'Please enter your OpenAI API key first.';
            this.showApiKeyInput = true;
            this.render();
            return;
        }

        this.loading = true;
        this.error = '';
        this.render();
        
        try {
            const response = await fetch(CONFIG.OPENAI_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: CONFIG.OPENAI_MODEL,
                    messages: [
                        {
                            role: 'system',
                            content: CONFIG.PROMPTS.hints.system
                        },
                        {
                            role: 'user',
                            content: CONFIG.PROMPTS.hints.user
                                .replace('{question}', this.question)
                                .replace('{language}', this.selectedLanguage)
                        }
                    ],
                    max_tokens: CONFIG.OPENAI_MAX_TOKENS,
                    temperature: CONFIG.OPENAI_TEMPERATURE
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Failed to get hints');
            }

            const data = await response.json();
            const hintsText = data.choices[0].message.content;
            
            const hintsArray = hintsText.split(/\d+\./).filter(hint => hint.trim()).slice(0, CONFIG.MAX_HINTS);
            this.hints = hintsArray.map((hint, index) => ({
                number: index + 1,
                text: hint.trim()
            }));
            
            this.currentStep = 'hints';
            this.timerActive = true;
            this.startTimer();
        } catch (err) {
            this.error = `Failed to get hints: ${err.message}. Please check your API key and try again.`;
        } finally {
            this.loading = false;
            this.render();
        }
    }

    async getSolution() {
        // Check if mock mode is enabled
        if (CONFIG.MOCK_MODE) {
            this.loading = true;
            this.render();
            
            // Simulate API delay
            setTimeout(() => {
                console.log('Generating solution for question:', this.question); // Debug log
                this.solution = CONFIG.MOCK_DATA_GENERATOR.getSolution(this.question, this.selectedLanguage);
                console.log('Generated solution length:', this.solution.length); // Debug log
                this.currentStep = 'solution';
                this.loading = false;
                this.render();
            }, 1000);
            return;
        }

        if (!this.apiKey) {
            this.error = 'Please enter your OpenAI API key first.';
            this.showApiKeyInput = true;
            this.render();
            return;
        }

        this.loading = true;
        this.error = '';
        this.render();
        
        try {
            const response = await fetch(CONFIG.OPENAI_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: CONFIG.OPENAI_MODEL,
                    messages: [
                        {
                            role: 'system',
                            content: CONFIG.PROMPTS.solution.system
                        },
                        {
                            role: 'user',
                            content: CONFIG.PROMPTS.solution.user
                                .replace('{question}', this.question)
                                .replace('{language}', this.selectedLanguage)
                        }
                    ],
                    max_tokens: CONFIG.OPENAI_MAX_TOKENS,
                    temperature: 0.3
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Failed to get solution');
            }

            const data = await response.json();
            this.solution = data.choices[0].message.content;
            this.currentStep = 'solution';
        } catch (err) {
            this.error = `Failed to get solution: ${err.message}. Please check your API key and try again.`;
        } finally {
            this.loading = false;
            this.render();
        }
    }

    resetApp() {
        this.currentStep = 'question';
        this.hints = [];
        this.solution = '';
        this.error = '';
        this.timeLeft = CONFIG.TIMER_DURATION;
        this.timerActive = false;
        this.showSolution = false;
        this.render();
    }

    startTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        
        this.timerInterval = setInterval(() => {
            if (this.timeLeft > 0) {
                this.timeLeft--;
                this.render();
            } else {
                this.timerActive = false;
                this.showSolution = true;
                clearInterval(this.timerInterval);
                this.render();
            }
        }, 1000);
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    render() {
        const root = document.getElementById('root');
        
        if (this.loading) {
            root.innerHTML = this.renderLoading();
            return;
        }

        if (this.showApiKeyInput) {
            root.innerHTML = this.renderApiKeyInput();
            return;
        }

        let content = '';
        content += this.renderHeader();
        content += this.renderContent();
        content += this.renderFooter();
        
        root.innerHTML = content;
        this.attachEventListeners();
    }

    renderHeader() {
        return `
            <div class="header">
                <div class="logo">🤖</div>
                <div class="title">Your DSA Buddy</div>
                <div class="subtitle">AI-powered coding assistance</div>
            </div>
        `;
    }

    renderContent() {
        let content = '<div class="content">';
        
        if (this.error) {
            content += `<div class="error">${this.error}</div>`;
        }
        
        if (this.currentStep === 'question') {
            content += this.renderQuestionStep();
        } else if (this.currentStep === 'hints') {
            content += this.renderHintsStep();
        } else if (this.currentStep === 'solution') {
            content += this.renderSolutionStep();
        }
        
        content += '</div>';
        return content;
    }

    renderQuestionStep() {
        return `
            <div class="question-section">
                <div class="question-text">
                    ${this.question || 'Reading question from LeetCode...'}
                </div>
            </div>
            
            <div class="language-selector">
                <label class="language-label">Select Programming Language:</label>
                <select id="language-select" class="language-dropdown">
                    ${CONFIG.SUPPORTED_LANGUAGES.map(lang => 
                        `<option value="${lang.value}" ${lang.value === this.selectedLanguage ? 'selected' : ''}>
                            ${lang.label}
                        </option>`
                    ).join('')}
                </select>
            </div>
            
            <button id="get-hints-btn" class="button primary-button">
                Get Hints
            </button>
        `;
    }

    renderHintsStep() {
        let content = '';
        
        if (this.timerActive) {
            content += `
                <div class="timer">
                    ⏰ Time Remaining: ${this.formatTime(this.timeLeft)}
                </div>
            `;
        }
        
        content += `
            <div class="hints-section">
                <h3>Your 3 Hints:</h3>
                ${this.hints.map((hint, index) => `
                    <div class="hint-card">
                        <div class="hint-number">Hint ${hint.number}:</div>
                        <div class="hint-text">${hint.text}</div>
                    </div>
                `).join('')}
            </div>
            
            <div style="margin-top: 20px;">
                <p style="font-size: 14px; color: #666; margin-bottom: 15px;">
                    💡 Spend 30 minutes trying to solve the problem using these hints!
                </p>
                
                ${!this.timerActive && this.timeLeft === 0 ? `
                    <button id="get-solution-btn" class="button primary-button">
                        Show Solution
                    </button>
                ` : ''}
                
                <button id="reset-btn" class="button secondary-button">
                    Start Over
                </button>
            </div>
        `;
        
        return content;
    }

    renderSolutionStep() {
        return `
            <div class="solution-section">
                <div class="solution-title">Complete Solution:</div>
                <div class="solution-code">${this.solution}</div>
            </div>
            
            <button id="reset-btn" class="button secondary-button" style="margin-top: 15px;">
                Try Another Problem
            </button>
        `;
    }

    renderApiKeyInput() {
        return `
            <div class="header">
                <div class="logo">🤖</div>
                <div class="title">Your DSA Buddy</div>
                <div class="subtitle">AI-powered coding assistance</div>
            </div>
            
            <div class="content">
                <div style="margin-bottom: 20px; text-align: center;">
                    <h3 style="color: #667eea; margin-bottom: 10px;">🔑 Setup Required</h3>
                    <p style="font-size: 14px; color: #666; line-height: 1.4;">
                        To use Your DSA Buddy, you need an OpenAI API key. Get one from
                        <a href="https://platform.openai.com/api-keys" target="_blank" style="color: #667eea;">
                            OpenAI Platform
                        </a>
                    </p>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label class="language-label">OpenAI API Key:</label>
                    <input type="password" id="api-key-input" value="${this.apiKey}" 
                           placeholder="sk-..." style="width: 100%; padding: 12px; border: 2px solid #e1e5e9; 
                           border-radius: 8px; font-size: 14px; font-family: monospace;">
                </div>
                
                <button id="save-api-key-btn" class="button primary-button" ${!this.apiKey.trim() ? 'disabled' : ''}>
                    Save API Key
                </button>
            </div>
            
            <div class="footer">
                Powered by AI • Made with ❤️
            </div>
        `;
    }

    renderLoading() {
        return `
            <div class="container">
                <div class="header">
                    <div class="logo">🤖</div>
                    <div class="title">Your DSA Buddy</div>
                    <div class="subtitle">AI-powered coding assistance</div>
                </div>
                
                <div class="content">
                    <div class="loading">
                        <div class="spinner"></div>
                        <p>Getting your hints...</p>
                    </div>
                </div>
                
                <div class="footer">
                    Powered by AI • Made with ❤️
                </div>
            </div>
        `;
    }

    renderFooter() {
        return `
            <div class="footer">
                Powered by AI • Made with ❤️
            </div>
        `;
    }

    attachEventListeners() {
        // Language selector
        const languageSelect = document.getElementById('language-select');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                this.selectedLanguage = e.target.value;
            });
        }

        // Get hints button
        const getHintsBtn = document.getElementById('get-hints-btn');
        if (getHintsBtn) {
            getHintsBtn.addEventListener('click', () => this.getHints());
        }

        // Get solution button
        const getSolutionBtn = document.getElementById('get-solution-btn');
        if (getSolutionBtn) {
            getSolutionBtn.addEventListener('click', () => this.getSolution());
        }

        // Reset button
        const resetBtn = document.getElementById('reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetApp());
        }

        // API key input
        const apiKeyInput = document.getElementById('api-key-input');
        if (apiKeyInput) {
            apiKeyInput.addEventListener('input', (e) => {
                this.apiKey = e.target.value;
                const saveBtn = document.getElementById('save-api-key-btn');
                if (saveBtn) {
                    saveBtn.disabled = !this.apiKey.trim();
                }
            });
        }

        // Save API key button
        const saveApiKeyBtn = document.getElementById('save-api-key-btn');
        if (saveApiKeyBtn) {
            saveApiKeyBtn.addEventListener('click', () => this.saveApiKey());
        }
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new DSABuddy();
}); 