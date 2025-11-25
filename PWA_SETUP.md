# PWA Setup Instructions

## Icon Generation

You need to create two PNG icons from the SVG file:

### Option 1: Using Online Tools (Easiest)
1. Go to https://cloudconvert.com/svg-to-png
2. Upload `public/icon.svg`
3. Set dimensions to 192x192 and download as `icon-192.png`
4. Upload again and set dimensions to 512x512, download as `icon-512.png`
5. Place both files in the `public/` folder

### Option 2: Using ImageMagick (Command Line)
```bash
# Install ImageMagick first (if not installed)
# macOS: brew install imagemagick
# Ubuntu/Debian: sudo apt-get install imagemagick

# Generate icons
convert public/icon.svg -resize 192x192 public/icon-192.png
convert public/icon.svg -resize 512x512 public/icon-512.png
```

### Option 3: Using Node.js (sharp library)
```bash
npm install sharp
node scripts/generate-icons.js
```

## Testing the PWA

### Local Testing
1. Build the app: `npm run build`
2. Start production server: `npm start`
3. Open in browser: `http://localhost:3000`
4. Open DevTools > Application > Manifest
5. Click "Install" button in the browser's address bar

### Mobile Testing
1. Deploy to Vercel/production
2. Open on mobile device
3. Look for "Add to Home Screen" prompt
4. Or manually: Browser menu > "Add to Home Screen"

## Features Included

✅ **Progressive Web App**
- Installable on desktop and mobile
- Works offline with service worker
- App-like experience in standalone mode

✅ **Manifest Features**
- Custom app name and icons
- App shortcuts (Quick actions)
- Themed splash screen
- Portrait orientation lock

✅ **Service Worker**
- Offline support
- Cache-first strategy for fast loading
- Automatic cache updates

✅ **Install Prompt**
- Custom install UI
- Can be dismissed and won't show again
- Shows on supported browsers

## Browser Support

- ✅ Chrome/Edge (Desktop & Mobile)
- ✅ Safari (iOS 16.4+)
- ✅ Firefox (Android)
- ✅ Samsung Internet
- ⚠️ Safari (macOS) - Limited support

## App Shortcuts

When users long-press the app icon, they'll see:
1. **Start Round 1** - Direct to Elimination Round
2. **Start Round 2** - Direct to Technical MCQ
3. **View Results** - Direct to Results page

## Vercel Deployment

The PWA will work automatically on Vercel. Just push to GitHub and deploy.

## Notes

- Icons MUST be in PNG format (not SVG) for PWA to work properly
- Service worker only works on HTTPS (or localhost)
- Install prompt behavior varies by browser
