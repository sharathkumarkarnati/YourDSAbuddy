// Setup script for Your DSA Buddy API Key
// Run this script to set up your default API key

const fs = require('fs');
const path = require('path');

console.log('🤖 Your DSA Buddy - API Key Setup');
console.log('=====================================\n');

// Read the current config file
const configPath = path.join(__dirname, 'config.js');
let configContent = fs.readFileSync(configPath, 'utf8');

// Check if API key is already set
if (configContent.includes('sk-your-actual-api-key-here')) {
    console.log('⚠️  Default API key not set yet.');
    console.log('📝 Please follow these steps:\n');
    
    console.log('1. Get your OpenAI API key from: https://platform.openai.com/api-keys');
    console.log('2. Open config.js in your code editor');
    console.log('3. Replace "sk-your-actual-api-key-here" with your actual API key');
    console.log('4. Save the file');
    console.log('5. Reload the extension in Chrome\n');
    
    console.log('🔧 Quick setup:');
    console.log('- Open config.js');
    console.log('- Find the line: DEFAULT_API_KEY: \'sk-your-actual-api-key-here\'');
    console.log('- Replace with: DEFAULT_API_KEY: \'sk-your-actual-key-here\'');
    console.log('- Save and reload extension\n');
    
} else {
    console.log('✅ API key appears to be configured!');
    console.log('🎉 Your DSA Buddy should work without manual setup.');
}

console.log('📖 Next steps:');
console.log('1. Load the extension in Chrome (chrome://extensions/)');
console.log('2. Visit any LeetCode problem');
console.log('3. Click the buddy icon (🤖)');
console.log('4. Start coding with AI assistance!\n');

console.log('🚀 Happy coding with Your DSA Buddy!'); 