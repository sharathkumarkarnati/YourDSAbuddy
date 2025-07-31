// Configuration for Your DSA Buddy Chrome Extension
const CONFIG = {
    // Gemini API Configuration
    GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
    GEMINI_API_KEY: 'AIzaSyA82RTcZ9FkPt1ZVievubUcyEih-a3ZWlk', // Replace with your actual Gemini API key
    GEMINI_MODEL: 'gemini-2.0-flash',
    GEMINI_MAX_TOKENS: 1000,
    GEMINI_TEMPERATURE: 0.7,

    // Timer Configuration
    TIMER_DURATION: 30 * 60, // 30 minutes in seconds
    MAX_HINTS: 3, // Maximum number of hints to provide

    // UI Configuration
    POPUP_WIDTH: 400,
    POPUP_HEIGHT: 600,

    // Supported Programming Languages
    SUPPORTED_LANGUAGES: [
        { value: 'python', label: 'Python' },
        { value: 'javascript', label: 'JavaScript' },
        { value: 'java', label: 'Java' },
        { value: 'cpp', label: 'C++' },
        { value: 'c', label: 'C' },
        { value: 'csharp', label: 'C#' },
        { value: 'go', label: 'Go' },
        { value: 'rust', label: 'Rust' }
    ],

    // API Prompts for Gemini
    API_PROMPTS: {
        HINTS_PROMPT: `You are an expert programming tutor helping with LeetCode problems. 

PROBLEM: {question}
PROGRAMMING LANGUAGE: {language}

Provide exactly 3 progressive hints to help solve this problem:

1. First hint: Focus on understanding the problem and identifying the core algorithm/approach needed
2. Second hint: Provide a specific data structure or technique that would be most effective
3. Third hint: Give a more detailed implementation strategy or optimization tip

Make each hint actionable and specific to this problem. Focus on problem-solving strategies, not just the answer.

Format your response as:
Hint 1: [first hint]
Hint 2: [second hint] 
Hint 3: [third hint]`,
        
        SOLUTION_PROMPT: `You are an expert programming tutor. Provide a complete, well-commented solution for this LeetCode problem.

PROBLEM: {question}
PROGRAMMING LANGUAGE: {language}

Provide a complete solution including:

1. **Approach Explanation**: Brief explanation of the algorithm/strategy
2. **Code**: Well-commented, clean code in the specified language
3. **Time & Space Complexity**: Analysis of both time and space complexity
4. **Key Insights**: Important observations and edge cases
5. **Alternative Approaches**: Mention if there are other valid approaches

Format your response with clear sections and proper code formatting.`
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else {
    window.CONFIG = CONFIG;
}
