# Your DSA Buddy - Chrome Extension

An AI-powered Chrome extension that provides intelligent hints and solutions for LeetCode problems using Google's Gemini API.

## 🚀 Features

- **Smart Question Detection**: Automatically reads LeetCode problems from the current page
- **Progressive Hints**: Get 3 carefully crafted hints to guide your problem-solving approach
- **30-Minute Timer**: Encourages focused problem-solving with a built-in timer
- **Complete Solutions**: Get detailed solutions with explanations when you need them
- **Multiple Languages**: Support for Python, Java, JavaScript, C++, and more
- **Floating Buddy Icon**: Easy access with a floating icon on LeetCode pages

## 🛠️ Installation

### Step 1: Download the Extension

1. Clone or download this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked" and select the extension folder

### Step 2: Get Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key


## 🎯 How to Use

1. **Navigate to a LeetCode problem**
2. **Click the floating buddy icon** 🤖 on the page
3. **Select your programming language**
4. **Click "Get Hints"** to receive 3 progressive hints
5. **Spend 30 minutes** trying to solve with the hints
6. **Click "Get Solution"** if you need the complete solution

## 📁 File Structure

```
Your-DSA-Buddy/
├── manifest.json          # Extension configuration
├── popup.html            # Main popup interface
├── popup.js              # Core extension logic
├── popup.css             # Popup styling
├── content.js            # Content script for LeetCode integration
├── content.css           # Floating icon styling
├── background.js         # Background service worker
├── config.js             # Configuration and API settings
├── icons/                # Extension icons
├── README.md             # This file
└── INSTALLATION.md       # Detailed installation guide
```

## 🔧 Configuration

### API Settings (`config.js`)

- `GEMINI_API_KEY`: Your Gemini API key
- `GEMINI_MODEL`: AI model (default: `gemini-pro`)
- `GEMINI_MAX_TOKENS`: Maximum response length
- `TIMER_DURATION`: Timer duration in seconds (default: 1800 = 30 minutes)

### Supported Programming Languages

- Python
- Java
- JavaScript
- C++
- C#
- Go
- Rust
- And more!

## 🐛 Troubleshooting

### Extension Not Loading

- Check that all files are in the correct directory
- Ensure `manifest.json` is valid
- Reload the extension in Chrome

### API Key Issues

- Verify your API key is correct in `config.js`
- Test your API key using `test-gemini-api.js`
- Check your Gemini API quota at [Google AI Studio](https://makersuite.google.com/app/apikey)

### No Hints/Solutions

- Check the browser console for error messages
- Verify your internet connection
- Ensure your API key has available quota

## 🔒 Privacy

- Your API key is stored locally in Chrome's sync storage
- No data is sent to external servers except for API calls to Gemini
- Question content is only sent to Gemini for generating hints/solutions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Look at the browser console for error messages
3. Verify your API key and quota
4. Create an issue on GitHub

---

**Made with ❤️ for the coding community**
