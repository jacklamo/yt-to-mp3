# YouTube to MP3 Converter

A modern web application that allows you to convert YouTube videos to MP3 audio files with a clean, responsive UI.

![YouTube to MP3 Converter](screenshot.png)

## Features

- Convert any YouTube video to high-quality MP3
- Clean, modern React-based user interface
- Direct download without redirects
- Real-time conversion status
- Responsive design for all devices

## Technology Stack

- **Frontend**: React, Vite, Modern CSS
- **Backend**: Express.js
- **YouTube Processing**: youtube-dl-exec

## Installation

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/yt-to-mp3.git
   cd yt-to-mp3
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development environment:
   ```
   npm run dev     # Starts the frontend development server
   npm run server  # Starts the backend server
   ```

Alternatively, you can use the convenience script:
```
.\start-dev.bat  # On Windows
```

## Usage

1. Open your browser and navigate to `http://localhost:5173`
2. Paste a YouTube URL into the input field
3. Click the "Convert" button
4. Wait for the conversion to complete
5. The MP3 file will download automatically

## Development

### Project Structure

- `/src` - React frontend code
- `server.js` - Express backend server
- `package.json` - Dependencies and scripts
- `vite.config.js` - Vite configuration

### Available Scripts

- `npm run dev` - Starts the frontend development server
- `npm run server` - Starts the backend server
- `npm run build` - Builds the frontend for production
- `npm run preview` - Previews the production build
- `npm run test-backend` - Tests the backend API

## Deployment

### Frontend

The frontend can be deployed to any static hosting service:

1. Build the production version:
   ```
   npm run build
   ```

2. The output will be in the `dist` directory, which can be deployed to services like Netlify, Vercel, or GitHub Pages.

### Backend

The backend requires a Node.js hosting environment like:

- Heroku
- Railway
- DigitalOcean
- Any VPS provider

Make sure to set the appropriate environment variables for production.

## Legal Disclaimer

This application is intended for personal use only, for content that you have the right to download. Please respect copyright laws and YouTube's terms of service.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. 