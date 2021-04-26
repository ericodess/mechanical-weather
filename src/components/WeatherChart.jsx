import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Chart, registerables } from "chart.js";
import classes  from "../assets/modules/LineGraph.module.css";

const electron = window.require('electron');

let chart, isFetched = false;

Chart.register(...registerables);

Chart.defaults.font.family = "'Roboto-Bold'";
Chart.defaults.backgroundColor = "transparent";

const WeatherChart = () => {
    const generateWeatherLogs = (rawWeatherLogs, weatherLogs) => {
        const newWeatherLogs = weatherLogs,
              weatherLogIndexes = {
                  "timeStamp": "timeStamps",
                  "temperature": "temperatureList",
                  "humidity": "humidityList"
              };
        
        Object.values(rawWeatherLogs).forEach(weatherInfo => {
            for(const [key, newWeather] of Object.entries(weatherInfo)){
                if(weatherLogIndexes[key] !== undefined){
                    let newWeatherInfo = newWeather;

                    if(weatherLogIndexes[key] === "timeStamps"){
                        const newTimeStamp = new Date(newWeatherInfo);
                        newWeatherInfo = `${newTimeStamp.getHours()}:${newTimeStamp.getMinutes() < 10 ? `0${newTimeStamp.getMinutes()}`: newTimeStamp.getMinutes()}`;
                    };

                    newWeatherLogs[weatherLogIndexes[key]].push(newWeatherInfo);
                }else{
                    if(typeof weatherInfo === "object"){
                        generateWeatherLogs(weatherInfo, newWeatherLogs);
                    };
                }
            };
        });

        return newWeatherLogs;
    };
    
    const getWeatherLogs = () => {
        const weatherLogs = electron.ipcRenderer.sendSync('read-app-file', 'Logs', 'WeatherLogs', 'json'),
              newWeatherLogs = generateWeatherLogs(weatherLogs, {
                timeStamps: [],
                temperatureList: [],
                humidityList: []
            });

        return newWeatherLogs;
    };

    const chartRef = React.createRef(),
          state = useSelector(state => state),
          userInfo = state.userInfo,
          userLocation = state.userLocation,
          weatherLogs = getWeatherLogs();

    if(typeof chart !== "undefined"){
        chart.destroy();
    };

    useEffect(() => {  
        const chartArea = chartRef.current.getContext("2d");

        chart = new Chart(chartArea, {
            type: "line",
            data: {
                labels: weatherLogs.timeStamps,
                datasets: [
                    {
                        label: 'Temperature',
                        data: weatherLogs.temperatureList,
                        borderColor: "#17B978",
                        backgroundColor: "rgba(23, 185, 120, .4)",
                        hoverBackgroundColor: "rgba(23, 185, 120, 1)",
                        fill: true
                    },
                    {
                        label: 'Humidity',
                        data: weatherLogs.humidityList,
                        borderColor: "#071A52",
                        backgroundColor: "rgba(7, 26, 82, .4)",
                        hoverBackgroundColor: "rgba(7, 26, 82, 1)",
                        fill: true
                    }
                ]
            },
            options: {
                plugins: {
                    filler: {
                        propagate: false,
                    },
                    tooltip: {
                        mode: 'x'
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        }
                    },
                    y: {
                        grid: {
                            display: false,
                            drawBorder: false
                        },
                        ticks: {
                            display: false
                        }  
                    }
                },
                elements: {
                    line: {
                        tension: 0.3
                    }
                },
                hover: {
                    mode: 'dataset'
                },
                responsive: true,
                maintainAspectRatio: false,
                radius: 5
            }
        });

        const weather = {
            temperature: weatherLogs.temperatureList[weatherLogs.temperatureList.length - 1],
            humidity: weatherLogs.humidityList[weatherLogs.humidityList.length - 1]
        };

        if(weather && weather.temperature && weather.humidity && weather.temperature !== '?' && weather.humidity !== '?' && userInfo.username && userLocation.longitude && userLocation.latitude && userInfo.username !== '' && userLocation.longitude !== '' && userLocation.latitude !== ''){
            if(!isFetched || (weather.temperature !== weatherLogs.temperatureList[weatherLogs.temperatureList.length - 2] && weather.humidity !== weatherLogs.humidityList[weatherLogs.humidityList.length - 2])){
                fetch(`${process.env.REACT_APP_CORS}/${process.env.REACT_APP_API_URL}?p=${encodeURI(userInfo.username)}&lat=${userLocation.latitude}&lon=${userLocation.longitude}&t=${weather.temperature}&u=${weather.humidity}`, {
                    method: 'GET'
                });

                if(isFetched !== true){
                    isFetched = true;
                };
            };
        }; 

        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[chartRef]);

    return(
        <div className={classes.graphContainer}>
            <canvas
                id="weatherChart"
                ref={chartRef}
            />
        </div>
    );
};

export default WeatherChart;