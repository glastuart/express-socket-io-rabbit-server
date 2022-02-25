import React, { useState, useEffect } from "react";
import io from 'socket.io-client';
import WeatherDisplay from "./components/weatherDisplay";

const App = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    return () => newSocket.close();
  }, [setSocket]);

  return (
    <div className="container-fluid">
      {!socket && (
        <p className="text-danger">Socket connection has not been established.</p>
      )}
      {socket && (
        <WeatherDisplay socket={socket} />
      )}
    </div>
  );
}

export default App;