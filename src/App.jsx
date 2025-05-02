import { useState, useEffect } from 'react'
import './App.css'

// Define the expected structure for incoming data (optional but good practice)
const initialDataState = {
  id: null,
  type: null,
  timestamp: null,
  data: null,
  server_time: null,
  image: null,
};

function App() {
  const [serverData, setServerData] = useState(initialDataState);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');

  useEffect(() => {
    // Replace with your actual WebSocket server URL
    const wsUrl = 'ws://localhost:8080'; // Example URL
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setConnectionStatus('Connected');
      console.log('WebSocket connection established');
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        // Basic validation (you might want more robust validation)
        if (message && message.type === 'server_update') {
          setServerData(message);
        }
      } catch (error) {
        console.error('Failed to parse incoming message:', error);
      }
    };

    ws.onerror = (error) => {
      setConnectionStatus('Error');
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      setConnectionStatus('Closed');
      console.log('WebSocket connection closed');
      // Optional: Implement reconnection logic here
    };

    // Cleanup function to close the WebSocket connection when the component unmounts
    return () => {
      ws.close();
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount

  return (
    <>
      <h1>WebSocket Server Data</h1>
      <p>Status: {connectionStatus}</p>
      <div className="card">
        {serverData.id ? (
          <>
            <h2>Latest Update:</h2>
            <p><strong>ID:</strong> {serverData.id}</p>
            <p><strong>Type:</strong> {serverData.type}</p>
            <p><strong>Timestamp:</strong> {new Date(serverData.timestamp).toLocaleString()}</p>
            <p><strong>Data Value:</strong> {serverData.data}</p>
            <p><strong>Server Time:</strong> {serverData.server_time}</p>
            {serverData.image && (
              <div>
                <strong>Image:</strong>
                {/* Assuming the image field contains a URL or path */}
                <img src={serverData.image} alt="Server Data Image" style={{ maxWidth: '200px', display: 'block', marginTop: '10px' }} />
              </div>
            )}
          </>
        ) : (
          <p>Waiting for data from the server...</p>
        )}
      </div>
    </>
  )
}

export default App
