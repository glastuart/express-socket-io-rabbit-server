import React, { useEffect, useState } from 'react';

const WeatherDisplay = ({ socket }) => {
    const [weatherData, setWeatherData] = useState([]);

    useEffect(() => {
        const weatherListener = (message) => {
            console.log('message recieved: ', message);
            setWeatherData((previousCollection) => {
                return [
                    ...previousCollection,
                    message
                ];
            });
        }

        socket.on('weather', weatherListener);

        return () => {
            socket.off('weather', weatherListener);
        }
    }, [socket]);

    return (
        <div>
            <div>
                <h1>Weather Data Recieved!</h1>
            </div>
            <div className='container'>
                <div className='row'>
                    {weatherData && weatherData.length === 0 && (
                        <p className='text-info'>No weather data to show.</p>
                    )}
                    {weatherData && weatherData.length > 0 && weatherData.map((data, i) => (
                        <div key={i} className="col m-2 card" >
                            <div class="card-body">
                                <h5 class="card-title">Index: {i}</h5>
                                <ul>
                                    <li>Date: {data.Date}</li>
                                    <li>Summary: {data.Summary}</li>
                                    <li>TemperatureC: {data.TemperatureC}c</li>
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            
        </div>
    );
}

export default WeatherDisplay;