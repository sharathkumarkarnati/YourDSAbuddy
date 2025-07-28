# Your DSA Buddy 🤖

An AI-powered Chrome extension that provides intelligent hints and solutions for LeetCode problems. Your personal coding buddy that helps you learn and improve your problem-solving skills!

## Features ✨

- **Smart Question Detection**: Automatically reads LeetCode problems from the current page
- **Progressive Hints**: Get 3 carefully crafted hints that guide you toward the solution
- **30-Minute Timer**: Encourages focused problem-solving with a built-in timer
- **Multiple Languages**: Support for Python, JavaScript, Java, C++, C, C#, Go, and Rust
- **AI-Powered**: Uses OpenAI's GPT-3.5-turbo for intelligent hint generation and solutions
- **Beautiful UI**: Modern, responsive design with smooth animations
- **Floating Buddy Icon**: Easy access with a floating robot icon on LeetCode pages

## How It Works 🚀

1. **Navigate to a LeetCode problem**
2. **Click the buddy icon** (🤖) that appears on the right side of the page
3. **Select your programming language**
4. **Get 3 progressive hints** to guide your problem-solving
5. **Spend 30 minutes** trying to solve with the hints
6. **Get the complete solution** if you need it after the timer

## Installation 📦

### Method 1: Load as Unpacked Extension

1. **Clone or download this repository**

   ```bash
   git clone <repository-url>
   cd your-dsa-buddy
   ```

2. **Open Chrome and go to Extensions**

   - Open Chrome
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)

3. **Load the extension**

   - Click "Load unpacked"
   - Select the folder containing this extension
   - The extension should now appear in your extensions list

4. **Set up your OpenAI API key**
   - Get an API key from [OpenAI](https://platform.openai.com/api-keys)
   - Open the extension popup
   - Enter your API key in the settings

### Method 2: Install from Chrome Web Store (Coming Soon)

The extension will be available on the Chrome Web Store soon!

## Configuration ⚙️

### OpenAI API Key Setup

#### Option 1: Default API Key (Recommended for Distribution)

1. **Get an API key** from [OpenAI Platform](https://platform.openai.com/api-keys)
2. **Open `config.js`** in your code editor
3. **Replace the placeholder** with your actual API key:
   ```javascript
   DEFAULT_API_KEY: 'sk-your-actual-api-key-here',
   ```
   Change to:
   ```javascript
   DEFAULT_API_KEY: 'sk-your-actual-key-here',
   ```
4. **Save the file** and reload the extension
5. **Users won't need to enter the API key** - it will work automatically

#### Option 2: Manual API Key Entry

1. **Get an API key** from [OpenAI Platform](https://platform.openai.com/api-keys)
2. **Open the extension popup** on any LeetCode page
3. **Enter your API key** in the settings section
4. **Save and start using** the extension

### Supported Programming Languages

- Python
- JavaScript
- Java
- C++
- C
- C#
- Go
- Rust

## Usage Guide 📖

### Getting Started

1. **Visit LeetCode.com** and navigate to any problem
2. **Look for the floating buddy icon** (🤖) on the right side of the page
3. **Click the icon** to open the DSA Buddy interface
4. **Select your preferred programming language**
5. **Click "Get Hints"** to receive 3 progressive hints

### Understanding the Hints

- **Hint 1**: Usually focuses on understanding the problem and basic approach
- **Hint 2**: Provides more specific guidance on the algorithm or data structure
- **Hint 3**: Gives you the final push toward the solution

### Timer Feature

- **30-minute countdown** starts when you receive hints
- **Focus on problem-solving** during this time
- **Solution becomes available** after the timer expires
- **You can still access the solution** before the timer ends if needed

## File Structure 📁

```
your-dsa-buddy/
├── manifest.json          # Extension configuration
├── popup.html            # Main popup interface
├── popup.js              # React application logic
├── popup.css             # Styling for popup
├── content.js            # Content script for LeetCode integration
├── content.css           # Styles for content script elements
├── background.js         # Background service worker
├── config.js             # Configuration file
├── setup-api-key.js      # API key setup helper
├── icons/                # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── package.json          # Project dependencies
└── README.md            # This file
```

## Development 🛠️

### Prerequisites

- Node.js (v14 or higher)
- Chrome browser
- OpenAI API key

### Local Development

1. **Install dependencies** (if using npm)

   ```bash
   npm install
   ```

2. **Load the extension** in Chrome as described in the installation section

3. **Make changes** to the code and reload the extension in Chrome

4. **Test on LeetCode** by navigating to any problem page

### Building for Production

The extension is ready to use as-is. For production deployment:

1. **Create icon files** in the `icons/` directory (16x16, 48x48, 128x128 pixels)
2. **Update the manifest.json** with your extension details
3. **Test thoroughly** on various LeetCode problems
4. **Package for Chrome Web Store** (if publishing)

## Troubleshooting 🔧

### Common Issues

**Extension not appearing on LeetCode:**

- Make sure you're on a LeetCode problem page
- Check that the extension is enabled in Chrome
- Try refreshing the page

**API key errors:**

- Verify your OpenAI API key is correct
- Check your API key has sufficient credits
- Ensure you have access to GPT-3.5-turbo (most accounts have this)

**Hints not loading:**

- Check your internet connection
- Verify your API key is set correctly
- Try refreshing the extension popup

### Debug Mode

1. **Open Chrome DevTools** (F12)
2. **Go to the Console tab**
3. **Look for any error messages** related to the extension
4. **Check the Network tab** for API call failures

## Privacy & Security 🔒

- **No data is stored** on external servers
- **API calls are made directly** to OpenAI from your browser
- **Your LeetCode data** is only read locally
- **No personal information** is collected or transmitted

## Contributing 🤝

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Areas for Improvement

- [ ] Add support for more programming languages
- [ ] Implement hint difficulty levels
- [ ] Add problem history tracking
- [ ] Create hint customization options
- [ ] Add offline mode with cached hints
- [ ] Implement user progress tracking

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support 💬

If you encounter any issues or have questions:

1. **Check the troubleshooting section** above
2. **Open an issue** on GitHub
3. **Contact the development team**

## Acknowledgments 🙏

- **OpenAI** for providing the GPT-4 API
- **LeetCode** for the excellent platform
- **React team** for the amazing framework
- **Chrome Extensions team** for the platform

---

**Happy coding! 🚀**

_Your DSA Buddy - Making LeetCode problems easier, one hint at a time!_
