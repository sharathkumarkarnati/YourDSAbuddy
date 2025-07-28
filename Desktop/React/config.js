// Configuration file for Your DSA Buddy Chrome Extension

const CONFIG = {
    // OpenAI API Configuration
    OPENAI_API_URL: 'https://api.openai.com/v1/chat/completions',
    OPENAI_MODEL: 'gpt-3.5-turbo',
    OPENAI_MAX_TOKENS: 800,
    OPENAI_TEMPERATURE: 0.7,
    // Default API Key - Replace with your actual API key
    
    // Mock mode for testing (set to true to use mock data instead of API calls)
    MOCK_MODE: true,
    
    // Extension Settings
    TIMER_DURATION: 1800, // 30 minutes in seconds
    MAX_HINTS: 3,
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
    
    // UI Settings
    POPUP_WIDTH: 400,
    POPUP_HEIGHT: 500,
    BUDDY_ICON_SIZE: 60,
    
    // LeetCode Selectors
    LEEETCODE_SELECTORS: {
        title: [
            '[data-cy="question-title"]',
            '.mr-2.text-label-1',
            'h1'
        ],
        difficulty: [
            '[data-difficulty]',
            '.difficulty-label'
        ],
        description: [
            '[data-cy="question-content"]',
            '.content__1YWB'
        ]
    },
    
    // Messages
    MESSAGES: {
        loading: 'Getting your hints...',
        error: 'Failed to get hints. Please check your API key and try again.',
        timerExpired: 'Time\'s up! Ready to see the solution?',
        noQuestion: 'No LeetCode question detected on this page.',
        welcome: 'Welcome to Your DSA Buddy! 🤖'
    },
    
    // API Prompts
    PROMPTS: {
        hints: {
            system: 'You are a helpful coding assistant that provides hints for LeetCode problems. Provide 3 progressive hints that guide the user toward the solution without giving away the complete answer. Be encouraging and educational.',
            user: 'I\'m working on this LeetCode problem: "{question}". I\'m using {language}. Please provide 3 progressive hints to help me solve it. Spend 30 minutes trying to solve it with these hints before asking for the full solution.'
        },
        solution: {
            system: 'You are a helpful coding assistant that provides complete solutions for LeetCode problems. Provide clear, well-commented code with explanations.',
            user: 'I need the complete solution for this LeetCode problem: "{question}". Please provide the solution in {language} with detailed explanations.'
        }
    },
    
    // Mock data generator for testing (when MOCK_MODE is true)
    MOCK_DATA_GENERATOR: {
        // Generate hints based on question keywords
        getHints: function(question, language) {
            console.log('Mock generator - Question:', question); // Debug log
            console.log('Mock generator - Language:', language); // Debug log
            const questionLower = question.toLowerCase();
            console.log('Mock generator - Question lower:', questionLower); // Debug log
            const hints = [];
            
            if (questionLower.includes('two sum') || questionLower.includes('sum') || questionLower.includes('target')) {
                hints.push(
                    "Think about using a hash map to store seen values and their indices",
                    "Consider the two-pointer technique - one pointer for current element, another to search for complement",
                    "Try using a sliding window approach or consider if you can use the array's properties to optimize"
                );
            } else if (questionLower.includes('palindrome') || questionLower.includes('reverse')) {
                hints.push(
                    "Consider using two pointers starting from both ends of the string",
                    "Think about how to handle even vs odd length strings",
                    "You might need to convert to lowercase and remove non-alphanumeric characters"
                );
            } else if (questionLower.includes('valid') || questionLower.includes('parentheses') || questionLower.includes('bracket')) {
                hints.push(
                    "Consider using a stack to keep track of opening brackets",
                    "Think about the order of brackets - last in, first out",
                    "Remember to handle cases where there are more closing than opening brackets"
                );
            } else if (questionLower.includes('max') || questionLower.includes('min') || questionLower.includes('largest') || questionLower.includes('smallest')) {
                hints.push(
                    "Consider using a sliding window or two-pointer approach",
                    "Think about using a heap or priority queue for finding max/min",
                    "Consider if you can solve it in one pass through the data"
                );
            } else if (questionLower.includes('duplicate') || questionLower.includes('unique') || questionLower.includes('distinct')) {
                hints.push(
                    "Consider using a hash set to track seen elements",
                    "Think about sorting the array first to find duplicates",
                    "Consider if you can solve it in-place to save space"
                );
            } else if (questionLower.includes('linked list') || questionLower.includes('list')) {
                hints.push(
                    "Consider using a dummy head node to simplify edge cases",
                    "Think about using two pointers - fast and slow pointer technique",
                    "Remember to handle the case where the list is empty or has only one node"
                );
            } else if (questionLower.includes('tree') || questionLower.includes('binary')) {
                hints.push(
                    "Consider using depth-first search (DFS) or breadth-first search (BFS)",
                    "Think about the different traversal orders: inorder, preorder, postorder",
                    "Remember to handle null nodes and base cases"
                );
            } else if (questionLower.includes('array') || questionLower.includes('sort')) {
                hints.push(
                    "Consider using built-in sorting functions or implement your own",
                    "Think about using additional data structures like hash maps or sets",
                    "Consider if you can solve it in-place to save space"
                );
            } else if (questionLower.includes('string') || questionLower.includes('char')) {
                hints.push(
                    "Consider using a hash map to count character frequencies",
                    "Think about using two pointers or sliding window technique",
                    "Remember that strings are immutable in most languages"
                );
            } else {
                // Generic hints for unknown problems
                hints.push(
                    "Start by understanding the problem constraints and edge cases",
                    "Consider what data structures would be most efficient for this problem",
                    "Think about the time and space complexity trade-offs"
                );
            }
            
            console.log('Mock generator - Final hints:', hints); // Debug log
            return hints;
        },
        
        // Generate solution based on question keywords
        getSolution: function(question, language) {
            const questionLower = question.toLowerCase();
            
            if (questionLower.includes('two sum') || questionLower.includes('sum') || questionLower.includes('target')) {
                return `Here's a solution using a hash map approach:

\`\`\`${language}
def twoSum(nums, target):
    # Create a hash map to store numbers and their indices
    seen = {}
    
    # Iterate through the array
    for i, num in enumerate(nums):
        # Calculate the complement needed
        complement = target - num
        
        # If complement exists in hash map, we found our pair
        if complement in seen:
            return [seen[complement], i]
        
        # Store current number and its index
        seen[num] = i
    
    # No solution found
    return []

# Time Complexity: O(n) - we only need to traverse the array once
# Space Complexity: O(n) - we store at most n elements in the hash map
\`\`\`

**Explanation:**
- We use a hash map to store each number and its index
- For each number, we calculate what complement we need to reach the target
- If the complement exists in our hash map, we've found our pair
- This approach gives us O(n) time complexity instead of O(n²)`;
            } else if (questionLower.includes('palindrome') || questionLower.includes('reverse')) {
                return `Here's a solution for checking if a string is a palindrome:

\`\`\`${language}
def isPalindrome(s):
    # Convert to lowercase and remove non-alphanumeric characters
    s = ''.join(c.lower() for c in s if c.isalnum())
    
    # Use two pointers
    left, right = 0, len(s) - 1
    
    while left < right:
        if s[left] != s[right]:
            return False
        left += 1
        right -= 1
    
    return True

# Time Complexity: O(n) - we process each character once
# Space Complexity: O(n) - we create a new string
\`\`\`

**Explanation:**
- We first clean the string by removing non-alphanumeric characters
- We use two pointers starting from both ends
- We compare characters and move pointers inward
- If all characters match, it's a palindrome`;
            } else if (questionLower.includes('linked list') || questionLower.includes('list')) {
                return `Here's a solution for linked list problems:

\`\`\`${language}
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverseList(head):
    prev = None
    current = head
    
    while current:
        next_temp = current.next
        current.next = prev
        prev = current
        current = next_temp
    
    return prev

# Time Complexity: O(n) - we visit each node once
# Space Complexity: O(1) - we only use a constant amount of extra space
\`\`\`

**Explanation:**
- We use three pointers: prev, current, and next_temp
- We reverse the links as we traverse the list
- We need to save the next node before changing the link
- The new head becomes the last node (prev)`;
            } else {
                return `Here's a general solution approach:

\`\`\`${language}
def solveProblem(input_data):
    # Step 1: Understand the problem
    # - What are the inputs and outputs?
    # - What are the constraints?
    # - What are the edge cases?
    
    # Step 2: Choose appropriate data structure
    # - Arrays for sequential data
    # - Hash maps for key-value lookups
    # - Trees for hierarchical data
    # - Graphs for connected data
    
    # Step 3: Implement the algorithm
    # - Consider time and space complexity
    # - Handle edge cases
    # - Test with examples
    
    # Step 4: Optimize if needed
    # - Can we reduce time complexity?
    # - Can we reduce space complexity?
    # - Are there better algorithms?
    
    return result

# Time Complexity: Analyze your specific algorithm
# Space Complexity: Analyze your specific algorithm
\`\`\`

**Explanation:**
- Always start by understanding the problem thoroughly
- Choose the right data structure for your needs
- Consider both time and space complexity
- Test with edge cases and examples`;
            }
        }
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else {
    window.CONFIG = CONFIG;
}
