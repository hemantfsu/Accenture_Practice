// This script generates PNG icons from SVG
// Install: npm install sharp

const sharp = require('sharp');
const fs = require('fs');

const svgPath = './public/icon.svg';
const sizes = [192, 512];

async function generateIcons() {
  if (!fs.existsSync(svgPath)) {
    console.error('Error: icon.svg not found in public folder');
    return;
  }

  for (const size of sizes) {
    try {
      await sharp(svgPath)
        .resize(size, size)
        .png()
        .toFile(`./public/icon-${size}.png`);
      
      console.log(`✓ Generated icon-${size}.png`);
    } catch (error) {
      console.error(`Error generating icon-${size}.png:`, error);
    }
  }
  
  console.log('\n✅ All icons generated successfully!');
}

generateIcons();
