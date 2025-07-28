# Installation Guide for Your DSA Buddy 🤖

## Quick Start (5 minutes)

### Step 1: Download the Extension
1. **Download or clone** this repository to your computer
2. **Navigate to the folder** containing the extension files

### Step 2: Load in Chrome
1. **Open Chrome** and go to `chrome://extensions/`
2. **Enable Developer mode** (toggle in the top right corner)
3. **Click "Load unpacked"**
4. **Select the folder** containing your extension files
5. **The extension should now appear** in your extensions list

### Step 3: Set Up API Key
1. **Get an OpenAI API key** from [OpenAI Platform](https://platform.openai.com/api-keys)
2. **Visit any LeetCode problem** (e.g., https://leetcode.com/problems/two-sum/)
3. **Click the buddy icon** (🤖) that appears on the right side
4. **Enter your API key** in the popup
5. **Start using the extension!**

## Detailed Installation

### Prerequisites
- **Google Chrome** browser (version 88 or higher)
- **OpenAI API key** with GPT-4 access
- **Basic knowledge** of Chrome extensions

### Step-by-Step Instructions

#### 1. Prepare the Extension Files

Make sure you have all the required files:
```
your-dsa-buddy/
├── manifest.json
├── popup.html
├── popup.js
├── popup.css
├── content.js
├── content.css
├── background.js
├── config.js
├── package.json
├── README.md
└── icons/ (optional - extension will work without icons)
```

#### 2. Load the Extension in Chrome

1. **Open Chrome** and navigate to `chrome://extensions/`
2. **Enable Developer mode** by toggling the switch in the top right
3. **Click "Load unpacked"** button
4. **Browse and select** the folder containing your extension files
5. **Verify the extension appears** in the list with a green "Enabled" status

#### 3. Configure API Access

1. **Get your OpenAI API key**:
   - Go to [OpenAI Platform](https://platform.openai.com/api-keys)
   - Sign in or create an account
   - Click "Create new secret key"
   - Copy the key (you won't see it again!)

2. **Test the extension**:
   - Go to any LeetCode problem page
   - Look for the floating robot icon (🤖) on the right side
   - Click it to open the DSA Buddy interface

#### 4. Create Icons (Optional)

If you want custom icons:
1. **Open `create-icons.html`** in your browser
2. **Download the generated icons** using the download buttons
3. **Place them in the `icons/` folder** with these names:
   - `icon16.png` (16x16 pixels)
   - `icon48.png` (48x48 pixels)
   - `icon128.png` (128x128 pixels)

## Troubleshooting

### Extension Not Appearing
- **Check if it's enabled** in `chrome://extensions/`
- **Try refreshing** the LeetCode page
- **Make sure you're on a LeetCode problem page**
- **Check the console** for any error messages (F12 → Console)

### API Key Issues
- **Verify your API key** is correct
- **Check your OpenAI account** has sufficient credits
- **Ensure you have access** to GPT-4 model
- **Try regenerating** your API key

### Icons Not Loading
- **The extension works without icons** - this is just cosmetic
- **Check the `icons/` folder** exists and contains the right files
- **Verify file names** match exactly: `icon16.png`, `icon48.png`, `icon128.png`

### Permission Issues
- **Check the manifest.json** has the correct permissions
- **Try reloading** the extension in `chrome://extensions/`
- **Restart Chrome** if issues persist

## Testing the Extension

### Basic Test
1. **Go to** https://leetcode.com/problems/two-sum/
2. **Look for** the floating robot icon (🤖)
3. **Click the icon** to open DSA Buddy
4. **Select a programming language**
5. **Click "Get Hints"** to test the AI integration

### Advanced Test
1. **Try different LeetCode problems**
2. **Test with different programming languages**
3. **Verify the 30-minute timer works**
4. **Check that solutions are generated correctly**

## Updating the Extension

### Manual Update
1. **Download the latest version** of the extension files
2. **Replace the old files** with the new ones
3. **Go to `chrome://extensions/`**
4. **Click the refresh icon** on your extension
5. **Test the updated functionality**

### Automatic Updates (Future)
When the extension is published to the Chrome Web Store, updates will be automatic.

## Security Notes

- **Your API key** is stored locally in Chrome's storage
- **No data is sent** to external servers except OpenAI
- **LeetCode data** is only read locally from the page
- **No personal information** is collected or transmitted

## Support

If you encounter issues:
1. **Check this troubleshooting guide**
2. **Look at the console** for error messages (F12)
3. **Verify your API key** and credits
4. **Try reloading** the extension
5. **Contact support** if problems persist

---

**Happy coding with Your DSA Buddy! 🚀** 