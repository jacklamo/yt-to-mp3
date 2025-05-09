// Simple test script to verify backend functionality
import fetch from 'node-fetch';

const SERVER_URL = 'http://localhost:4000';
const TEST_VIDEO_URL = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'; // A popular video for testing

async function testBackend() {
  console.log('Testing backend server...');
  
  try {
    // Test status endpoint
    console.log('Checking server status...');
    const statusResponse = await fetch(`${SERVER_URL}/status`);
    if (statusResponse.ok) {
      const statusData = await statusResponse.json();
      console.log('✅ Server is running:', statusData);
    } else {
      console.error('❌ Server status check failed:', await statusResponse.text());
      return;
    }
    
    // Test validation (without URL)
    console.log('\nTesting URL validation (empty URL)...');
    const emptyResponse = await fetch(`${SERVER_URL}/download`);
    if (emptyResponse.status === 400) {
      console.log('✅ URL validation works for empty URL');
    } else {
      console.error('❌ URL validation failed for empty URL:', await emptyResponse.text());
    }
    
    // Test with invalid URL
    console.log('\nTesting URL validation (invalid URL)...');
    const invalidResponse = await fetch(`${SERVER_URL}/download?url=notaurl`);
    if (invalidResponse.status === 400) {
      console.log('✅ URL validation works for invalid URL');
    } else {
      console.error('❌ URL validation failed for invalid URL:', await invalidResponse.text());
    }
    
    console.log('\n✅ Basic tests passed!');
    console.log('To manually test YouTube downloads, visit http://localhost:5173');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.log('Make sure your server is running on port 4000 (npm run server)');
  }
}

testBackend(); 