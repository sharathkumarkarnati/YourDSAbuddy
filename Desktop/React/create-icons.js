#!/usr/bin/env node

// Create icons for Your DSA Buddy Chrome Extension
const fs = require('fs');
const path = require('path');

console.log('🎨 Creating icons for Your DSA Buddy...\n');

// Simple SVG icons that we'll convert to PNG
const createSVGIcon = (size) => {
    return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <circle cx="${size/2}" cy="${size/2}" r="${size/2-2}" fill="url(#grad)" stroke="none"/>
  <text x="${size/2}" y="${size/2}" font-family="Arial, sans-serif" font-size="${size*0.6}" 
        text-anchor="middle" dominant-baseline="middle" fill="white">🤖</text>
</svg>`;
};

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir);
}

// Generate icons
const sizes = [16, 48, 128];
let created = 0;

sizes.forEach(size => {
    const filename = `icon${size}.png`;
    const filepath = path.join(iconsDir, filename);
    
    // For now, create a simple text file as placeholder
    // In a real scenario, you'd convert SVG to PNG
    const placeholder = `# Placeholder for ${filename}
# This is a placeholder file for the Chrome extension icon
# Replace this with an actual PNG file of size ${size}x${size} pixels
# You can use the generate-icons.html file to create proper icons
`;
    
    fs.writeFileSync(filepath, placeholder);
    console.log(`✅ Created ${filename}`);
    created++;
});

console.log(`\n🎉 Created ${created} icon files!`);
console.log('\n📝 Next steps:');
console.log('1. Open generate-icons.html in your browser');
console.log('2. Download the icons as PNG files');
console.log('3. Replace the placeholder files in icons/ folder');
console.log('4. Reload the extension in Chrome');
console.log('\n🚀 Your extension should now load without icon errors!'); 