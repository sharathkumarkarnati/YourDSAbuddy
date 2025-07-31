// Your DSA Buddy - Popup JavaScript (Vanilla JS)
class DSABuddy {
    constructor() {
        console.log('=== DSABuddy constructor called ===');
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
        this.lastApiCall = 0; // To track last API call time
        
        console.log('DSABuddy initialized, calling init()...');
        this.init();
    }

    async init() {
        console.log('=== init() called ===');
        try {
            await this.loadApiKey();
            this.getQuestionFromLeetCode();
            this.render();
            console.log('init() completed');
        } catch (error) {
            console.error('Error in init():', error);
            this.error = 'Failed to initialize extension. Please reload.';
            this.render();
        }
    }

    loadApiKey() {
        console.log('=== loadApiKey() called ===');
        return new Promise((resolve) => {
            // Clear any stored API key to force using config
            chrome.storage.sync.remove(['geminiApiKey'], () => {
                console.log('Cleared stored API key, using config value');
                this.apiKey = CONFIG.GEMINI_API_KEY;
                console.log('API Key loaded from config, length:', this.apiKey.length);
                console.log('API Key starts with:', this.apiKey.substring(0, 20) + '...');
                resolve();
            });
        });
    }

    getQuestionFromLeetCode() {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'getQuestionInfo' }, (response) => {
                if (response && response.title) {
                    this.question = response.title;
                    this.render();
                } else {
                    // Fallback: try to extract from URL
                    const url = tabs[0].url;
                    if (url.includes('leetcode.com/problems/')) {
                        const problemName = url.split('/problems/')[1]?.split('/')[0];
                        if (problemName) {
                            this.question = problemName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                            this.render();
                        }
                    }
                }
            });
        });
    }

    saveApiKey() {
        chrome.storage.sync.set({ geminiApiKey: this.apiKey }, () => {
            this.showApiKeyInput = false;
            this.error = '';
            this.render();
        });
    }

    async getHints() {
        console.log('=== getHints() called ===');
        console.log('API Key exists:', !!this.apiKey);
        console.log('API Key length:', this.apiKey ? this.apiKey.length : 0);
        console.log('API Key from config:', CONFIG.GEMINI_API_KEY.substring(0, 20) + '...');
        console.log('API Key being used:', this.apiKey.substring(0, 20) + '...');
        console.log('Keys match:', this.apiKey === CONFIG.GEMINI_API_KEY);
        
        if (!this.apiKey) {
            console.log('No API key found, showing input');
            this.error = 'Please enter your Gemini API key first.';
            this.showApiKeyInput = true;
            this.render();
            return;
        }

        // Check for rate limiting cooldown
        const now = Date.now();
        const timeSinceLastCall = now - this.lastApiCall;
        const cooldownPeriod = 5000; // 5 seconds between calls (increased)
        
        if (timeSinceLastCall < cooldownPeriod) {
            const waitTime = Math.ceil((cooldownPeriod - timeSinceLastCall) / 1000);
            console.log(`Rate limited: waiting ${waitTime} seconds`);
            this.error = `Please wait ${waitTime} seconds before making another request.`;
            this.render();
            return;
        }

        console.log('Starting Gemini API call...');
        this.loading = true;
        this.error = '';
        this.render();

        try {
            const prompt = CONFIG.API_PROMPTS.HINTS_PROMPT
                .replace('{question}', this.question)
                .replace('{language}', this.selectedLanguage);

            console.log('=== GEMINI API CALL DEBUG ===');
            console.log('Making API call with key:', this.apiKey.substring(0, 20) + '...');
            console.log('API URL:', CONFIG.GEMINI_API_URL);
            console.log('Model:', CONFIG.GEMINI_MODEL);
            console.log('Prompt:', prompt.substring(0, 200) + '...');

            // Add retry logic for rate limiting
            let response;
            let retries = 0;
            const maxRetries = 3;

            while (retries < maxRetries) {
                response = await fetch(CONFIG.GEMINI_API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-goog-api-key': this.apiKey
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: prompt
                            }]
                        }],
                        generationConfig: {
                            temperature: CONFIG.GEMINI_TEMPERATURE,
                            maxOutputTokens: CONFIG.GEMINI_MAX_TOKENS
                        }
                    })
                });

                console.log('Response status:', response.status);
                console.log('Response ok:', response.ok);

                if (response.status === 429) {
                    retries++;
                    if (retries < maxRetries) {
                        console.log(`Rate limited (429). Retrying in ${retries * 2} seconds...`);
                        await new Promise(resolve => setTimeout(resolve, retries * 2000));
                        continue;
                    }
                }
                break;
            }

            if (!response.ok) {
                const errorData = await response.json();
                console.log('Error response:', errorData);
                if (response.status === 429) {
                    throw new Error(`Rate limited: Too many requests. Please wait a few minutes and try again.`);
                } else if (response.status === 400 && errorData.error?.message?.includes('expired')) {
                    // Force reload API key from config on expired error
                    this.apiKey = CONFIG.GEMINI_API_KEY;
                    console.log('API key expired, reloaded from config');
                    throw new Error(`API key issue detected. Please try again.`);
                } else {
                    throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
                }
            }

            const data = await response.json();
            console.log('API Response data:', data);

            const content = data.candidates[0].content.parts[0].text;

            // Parse hints from the response
            const hints = this.parseHintsFromResponse(content);

            this.hints = hints.map((hint, index) => ({
                number: index + 1,
                text: hint
            }));

            this.currentStep = 'hints';
            this.timerActive = true;
            this.startTimer();
            this.lastApiCall = Date.now(); // Update last API call time
        } catch (err) {
            console.log('Error in getHints:', err);
            this.error = `Failed to get hints: ${err.message}. Please check your API key and try again.`;
        } finally {
            this.loading = false;
            this.render();
        }
    }

    parseHintsFromResponse(content) {
        // Try to parse hints from the response
        const lines = content.split('\n');
        const hints = [];
        
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.match(/^Hint \d+:/i) || trimmed.match(/^\d+\./)) {
                const hint = trimmed.replace(/^Hint \d+:\s*/i, '').replace(/^\d+\.\s*/, '').trim();
                if (hint) {
                    hints.push(hint);
                }
            }
        }
        
        // If we couldn't parse specific hints, split by numbered items
        if (hints.length === 0) {
            const parts = content.split(/\d+\./).filter(part => part.trim());
            hints.push(...parts.slice(0, CONFIG.MAX_HINTS).map(part => part.trim()));
        }
        
        return hints.slice(0, CONFIG.MAX_HINTS);
    }

    async getSolution() {
        if (!this.apiKey) {
            this.error = 'Please enter your Gemini API key first.';
            this.showApiKeyInput = true;
            this.render();
            return;
        }

        this.loading = true;
        this.error = '';
        this.render();

        try {
            const prompt = CONFIG.API_PROMPTS.SOLUTION_PROMPT
                .replace('{question}', this.question)
                .replace('{language}', this.selectedLanguage);

            console.log('=== GEMINI SOLUTION API CALL ===');
            console.log('Making solution API call...');

            const response = await fetch(CONFIG.GEMINI_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-goog-api-key': this.apiKey
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: CONFIG.GEMINI_TEMPERATURE,
                        maxOutputTokens: CONFIG.GEMINI_MAX_TOKENS * 2
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();
            const content = data.candidates[0].content.parts[0].text;

            this.solution = content;
            this.currentStep = 'solution';
            this.timerActive = false;
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
        this.lastApiCall = 0; // Reset API call timer
        // Force reload API key from config
        this.apiKey = CONFIG.GEMINI_API_KEY;
        console.log('App reset, API key reloaded from config');
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
        console.log('=== render() called ===');
        console.log('Current step:', this.currentStep);
        console.log('Loading:', this.loading);
        console.log('Error:', this.error);
        console.log('API Key loaded:', !!this.apiKey);
        
        const root = document.getElementById('root');
        if (!root) {
            console.error('Root element not found!');
            return;
        }

        if (this.loading) {
            root.innerHTML = this.renderLoading();
            return;
        }

        // Check if we need to show API key input
        if (!this.apiKey || this.apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
            console.log('No valid API key found, showing input');
            this.showApiKeyInput = true;
            root.innerHTML = this.renderApiKeyInput();
            this.attachEventListeners();
            return;
        }

        if (this.showApiKeyInput) {
            root.innerHTML = this.renderApiKeyInput();
            this.attachEventListeners();
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
                    <label class="language-label">Gemini API Key:</label>
                    <input type="password" id="api-key-input" value="${this.apiKey}" 
                           placeholder="AIza..." style="width: 100%; padding: 12px; border: 2px solid #e1e5e9; 
                           border-radius: 8px; font-size: 14px; font-family: monospace;">
                </div>
                
                <button id="save-api-key-btn" class="button primary-button" ${!this.apiKey.trim() ? 'disabled' : ''}>
                    Save API Key
                </button>
                <button id="refresh-api-key-btn" class="button secondary-button" style="margin-left: 10px;">
                    Refresh from Config
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
        console.log('Get hints button found:', !!getHintsBtn);
        if (getHintsBtn) {
            getHintsBtn.addEventListener('click', () => {
                console.log('Get hints button clicked!');
                this.getHints();
            });
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

        // Refresh API key button (for debugging)
        const refreshApiKeyBtn = document.getElementById('refresh-api-key-btn');
        if (refreshApiKeyBtn) {
            refreshApiKeyBtn.addEventListener('click', () => {
                this.apiKey = CONFIG.GEMINI_API_KEY;
                console.log('API key refreshed from config');
                this.error = '';
                this.render();
            });
        }
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('=== DOM Content Loaded ===');
    console.log('Initializing DSABuddy...');
    try {
        new DSABuddy();
    } catch (error) {
        console.error('Error initializing DSABuddy:', error);
        const root = document.getElementById('root');
        if (root) {
            root.innerHTML = `
                <div class="container">
                    <div class="header">
                        <div class="logo">🤖</div>
                        <div class="title">Your DSA Buddy</div>
                        <div class="subtitle">AI-powered coding assistance</div>
                    </div>
                    <div class="content">
                        <div class="error">
                            Error initializing extension: ${error.message}
                        </div>
                        <button onclick="location.reload()" class="button primary-button">
                            Reload Extension
                        </button>
                    </div>
                    <div class="footer">
                        Powered by AI • Made with ❤️
                    </div>
                </div>
            `;
        }
    }
}); 