import express from "express";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import os from 'os';
import { randomUUID } from 'crypto';
import youtubeDl from 'youtube-dl-exec';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 4000;

// Configure CORS to allow requests from frontend
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET'],
    credentials: true
}));

// Create a temp folder for processing files
const tempFolder = path.join(os.tmpdir(), 'yt-to-mp3-temp');
if (!fs.existsSync(tempFolder)) {
    fs.mkdirSync(tempFolder, { recursive: true });
}

// Add a simple status endpoint to check if server is running
app.get('/status', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

app.get("/download", async (req, res) => {
    const requestId = randomUUID();
    const outputFile = path.join(tempFolder, `${requestId}.mp3`);
    
    try {
        const videoURL = req.query.url;

        if (!videoURL) {
            return res.status(400).send("URL parameter is required");
        }

        // Simple URL validation
        if (!videoURL.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/)) {
            return res.status(400).send("Invalid YouTube URL");
        }

        console.log(`[${requestId}] Processing video: ${videoURL}`);

        try {
            // Get video info
            const info = await youtubeDl(videoURL, {
                dumpSingleJson: true,
                noWarnings: true,
                noCallHome: true,
                preferFreeFormats: true,
                youtubeSkipDashManifest: true
            });
            
            // Clean the title for filename
            const videoTitle = (info.title || '').replace(/[^\w\s]/gi, '') || 'audio';
            console.log(`[${requestId}] Video title: ${videoTitle}`);
            console.log(`[${requestId}] Video duration: ${info.duration} seconds`);
            
            // Set headers for file download
            res.header('Content-Disposition', `attachment; filename="${videoTitle}.mp3"`);
            res.header('Content-Type', 'audio/mpeg');
            
            // Download audio directly as MP3
            console.log(`[${requestId}] Downloading and converting to MP3...`);
            
            // Use youtube-dl to extract audio as MP3
            await youtubeDl(videoURL, {
                extractAudio: true,
                audioFormat: 'mp3',
                audioQuality: 0, // 0 = best
                output: outputFile,
                noCheckCertificate: true,
                preferFreeFormats: true,
                youtubeSkipDashManifest: true
            });
            
            console.log(`[${requestId}] Conversion completed, sending file...`);
            
            // Stream the file to the client
            const fileStream = fs.createReadStream(outputFile);
            fileStream.pipe(res);
            
            // Clean up the temp file when done
            fileStream.on('end', () => {
                console.log(`[${requestId}] Download complete, cleaning up...`);
                try {
                    if (fs.existsSync(outputFile)) {
                        fs.unlinkSync(outputFile);
                    }
                } catch (err) {
                    console.error(`[${requestId}] Error cleaning up:`, err);
                }
            });
            
            // Handle file read errors
            fileStream.on('error', (err) => {
                console.error(`[${requestId}] Error streaming file:`, err);
                if (!res.headersSent) {
                    res.status(500).send(`Error streaming file: ${err.message}`);
                }
                try {
                    if (fs.existsSync(outputFile)) {
                        fs.unlinkSync(outputFile);
                    }
                } catch (cleanupErr) {
                    console.error(`[${requestId}] Error cleaning up:`, cleanupErr);
                }
            });
            
        } catch (error) {
            console.error(`[${requestId}] Error processing video:`, error);
            
            // Check if file exists and clean up
            try {
                if (fs.existsSync(outputFile)) {
                    fs.unlinkSync(outputFile);
                }
            } catch (cleanupErr) {
                console.error(`[${requestId}] Error cleaning up:`, cleanupErr);
            }
            
            // Handle different types of errors
            if (error.message && error.message.includes("unavailable")) {
                return res.status(400).send(`Video unavailable: ${error.message}`);
            } else if (error.message && error.message.includes("private")) {
                return res.status(400).send(`This is a private video`);
            } else {
                return res.status(500).send(`Error processing video: ${error.message}`);
            }
        }
        
    } catch (error) {
        console.error(`[${requestId}] Server error:`, error);
        
        // Clean up any temp files
        try {
            if (fs.existsSync(outputFile)) {
                fs.unlinkSync(outputFile);
            }
        } catch (cleanupErr) {
            console.error(`[${requestId}] Error cleaning up:`, cleanupErr);
        }
        
        if (!res.headersSent) {
            res.status(500).send(`Server error: ${error.message}`);
        }
    }
    
    // Handle client disconnect
    req.on('close', () => {
        console.log(`[${requestId}] Client disconnected, cleaning up...`);
        try {
            if (fs.existsSync(outputFile)) {
                fs.unlinkSync(outputFile);
            }
        } catch (err) {
            console.error(`[${requestId}] Error cleaning up after disconnect:`, err);
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Temp folder: ${tempFolder}`);
    
    // Check if youtube-dl is available
    youtubeDl('--version')
        .then(version => {
            console.log(`youtube-dl version: ${version}`);
        })
        .catch(err => {
            console.error('Warning: youtube-dl version check failed:', err.message);
            console.log('The application may still work as youtube-dl-exec will download the binary if needed.');
        });
});

