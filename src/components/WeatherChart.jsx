import React, {
    useEffect,
    useState
} from 'react';
import { useSelector } from 'react-redux';
import {
    Chart,
    registerables
} from "chart.js";
import classes  from "../assets/modules/LineGraph.module.css";


//Services
import {
    generateWeatherLogs,
    setChartConfig,
    sendWeatherData
} from '../services';

const electron = window.require('electron');

//Chart Basic Configuration
Chart.register(...registerables);

//Chart default styling
Chart.defaults.font.family = "'Roboto-Bold'";
Chart.defaults.backgroundColor = "transparent";

const getWeatherLogs = () => {
    const weatherLogs = electron.ipcRenderer.sendSync('read-app-file', 'Logs', 'WeatherLogs', 'json'),
          newWeatherLogs = generateWeatherLogs(weatherLogs, {
            timeStampsList: [],
            temperatureList: [],
            humidityList: []
        });

    return newWeatherLogs;
};

const getChartConfig = () => {
    const weatherLogs = getWeatherLogs();
    
    return setChartConfig(weatherLogs.timeStampsList, weatherLogs.temperatureList, weatherLogs.humidityList);
};

const initialChartConfig = getChartConfig();

let hasWeatherBeenSent = false;

const WeatherChart = () => { 
    const chartRef = React.createRef(null),
          [weatherChart, setWeatherChart] = useState(null),
          userInfo = useSelector(state => state.userInfo),
          userLocation = useSelector(state => state.userLocation);

    const weatherLogs = getWeatherLogs();

    useEffect(() => {
        if(chartRef && chartRef.current){
            if(weatherChart === null){
                const newWeatherChart = new Chart(chartRef.current, initialChartConfig);

                setWeatherChart(newWeatherChart);
            };
        };
    },[chartRef, weatherChart]);

    const updateChartTimeStamp = (newTimeStamp) => {
        weatherChart.data.labels = newTimeStamp;
    };

    const updateChartDataset = (datasetIndex, newData) => {
        weatherChart.data.datasets[datasetIndex].data = newData; 
    };

    const updateWeatherDatasets = (timeStampData, temperatureData, humidityData) => {
        updateChartTimeStamp(timeStampData);

        updateChartDataset(0, temperatureData);
        updateChartDataset(1, humidityData);
    };
    
    useEffect(() => {
        if(weatherChart !== null){
            updateWeatherDatasets(weatherLogs.timeStampsList, weatherLogs.temperatureList, weatherLogs.humidityList);

            weatherChart.update();

            (async () => {
                if(!hasWeatherBeenSent){
                    const userData = {
                        userInfo: userInfo,
                        userLocation: userLocation
                    };
                    
                    sendWeatherData(hasWeatherBeenSent, weatherLogs, userData)
                    .then(() => {
                        if(hasWeatherBeenSent === false){
                            hasWeatherBeenSent = true;
                        };
                    })
                    .catch(error => console.log(error))
                };
            })();
        };
    });
    
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