@echo off
echo Starting YouTube to MP3 Converter in development mode...
echo.
echo Starting backend server on port 4000...
start cmd /k "npm run server"
echo.
echo Starting frontend server on port 5173...
start cmd /k "npm run dev"
echo.
echo Servers started! Open http://localhost:5173 in your browser. 