// frontend/src/App.jsx
import { useState, useEffect } from 'react';
import { socket } from './lib/socket';

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      console.log('Connected to server!');
      setIsConnected(true);
    }

    function onDisconnect() {
      console.log('Disconnected from server!');
      setIsConnected(false);
    }

    // Connecting to the server
    socket.connect();

    // Event listeners
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    // Cleaning up on Component Unmount
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Serpix Online</h1>
      <p className="text-lg">
        Server Connection: {isConnected ? 
          <span className="text-green-500 font-bold">Connected</span> : 
          <span className="text-red-500 font-bold">Disconnected</span>
        }
      </p>
    </div>
  )
}

export default App