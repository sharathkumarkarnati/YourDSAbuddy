# 🔧 Troubleshooting Guide for Your DSA Buddy

## API Key & Billing Issues

### Error: "You exceeded your current quota"

This means your OpenAI account doesn't have enough credits or has hit usage limits.

#### Quick Solutions:

1. **Check Your OpenAI Account**

   - Go to [OpenAI Platform](https://platform.openai.com/account/usage)
   - Check your current usage and billing status
   - Add payment method if needed

2. **Get Free Credits**

   - New OpenAI accounts get $5-18 in free credits
   - Visit [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create a new account if needed

3. **Use a Different API Key**

   - Get a new API key from [OpenAI Platform](https://platform.openai.com/api-keys)
   - Update it in `config.js`:

   ```javascript
   DEFAULT_API_KEY: 'sk-your-new-api-key-here',
   ```

4. **Check API Key Permissions**
   - Ensure your API key has access to chat completions
   - Verify it's not restricted to specific models

### Alternative Solutions:

#### Option 1: Use a Different AI Service

You can modify the extension to use other AI services like:

- **Anthropic Claude** (free tier available)
- **Google Gemini** (free tier available)
- **Local AI models** (for advanced users)

#### Option 2: Use Mock Data for Testing

For testing purposes, you can temporarily use mock responses:

```javascript
// In config.js, add this for testing:
MOCK_MODE: true,
MOCK_HINTS: [
    "Think about using a hash map to store seen values",
    "Consider the two-pointer technique",
    "Try using a sliding window approach"
]
```

#### Option 3: Community API Keys

Some developers share API keys for testing (use responsibly):

- Check GitHub for open-source projects
- Join AI/ML communities
- Use educational resources

### How to Update Your API Key:

1. **Get a new API key** from [OpenAI Platform](https://platform.openai.com/api-keys)
2. **Open `config.js`** in your code editor
3. **Replace the API key**:
   ```javascript
   DEFAULT_API_KEY: 'sk-your-new-api-key-here',
   ```
4. **Save the file**
5. **Reload the extension** in Chrome

### Cost Estimation:

- **GPT-3.5-turbo**: ~$0.002 per 1K tokens
- **Typical hint request**: ~500 tokens = ~$0.001
- **Typical solution request**: ~800 tokens = ~$0.002
- **$5 credit** = ~2,500 hint requests

### Free Alternatives:

1. **Anthropic Claude** (free tier)
2. **Google Gemini** (free tier)
3. **Hugging Face** (free models)
4. **Local models** (advanced)

### Getting Help:

1. **OpenAI Support**: https://help.openai.com/
2. **Community Forums**: Reddit r/OpenAI
3. **GitHub Issues**: Report bugs there
4. **Stack Overflow**: Technical questions

---

**Remember**: Always use API keys responsibly and within your budget! 🤖
