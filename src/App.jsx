import { useState } from 'react'
import './App.css'

function App() {
  const [loading, setLoading] = useState(false)
  const [url, setUrl] = useState('')
  const [message, setMessage] = useState({ text: '', type: '' })
  const [downloadProgress, setDownloadProgress] = useState(0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!url) {
      setMessage({ text: 'Please enter a YouTube URL', type: 'error' })
      return
    }

    try {
      setLoading(true)
      setMessage({ text: '', type: '' })
      setDownloadProgress(0)
      
      // First check if the server is available
      const statusCheck = await fetch('/status')
      if (!statusCheck.ok) {
        throw new Error('Backend server is not available. Make sure it\'s running on port 4000.')
      }
      
      // Create download URL
      const downloadUrl = `/download?url=${encodeURIComponent(url)}`
      
      // Fetch the file directly
      const response = await fetch(downloadUrl)
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Failed to download the file')
      }
      
      // Get filename from Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition')
      const filename = contentDisposition && contentDisposition.includes('filename=')
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : 'audio.mp3'
        
      console.log(`Downloading: ${filename}`)
      
      // Convert response to blob
      const blob = await response.blob()
      
      // Create download link
      const downloadObjectUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = downloadObjectUrl
      a.download = filename
      document.body.appendChild(a)
      
      // Trigger download
      a.click()
      
      // Clean up
      window.URL.revokeObjectURL(downloadObjectUrl)
      document.body.removeChild(a)
      
      setMessage({ text: 'Download completed successfully!', type: 'success' })
      setUrl('')
      
    } catch (error) {
      console.error('Error during conversion:', error)
      setMessage({ text: error.message || 'An error occurred', type: 'error' })
    } finally {
      setLoading(false)
      setDownloadProgress(0)
    }
  }

  return (
    <div className="container">
      <h1>YouTube to MP3 Converter</h1>
      <p className="description">Convert your favorite YouTube videos to MP3 format with just one click!</p>
      
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            placeholder="Paste YouTube URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Converting...' : 'Convert'}
          </button>
        </div>
      </form>
      
      {loading && (
        <div className="download-status">
          <div className="spinner"></div>
          <p>Converting and downloading your audio...</p>
        </div>
      )}
      
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
    </div>
  )
}

export default App 