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

//Chart Basic Configuration
Chart.register(...registerables);

//Chart default styling
Chart.defaults.font.family = "'Roboto-Bold'";
Chart.defaults.backgroundColor = "transparent";


const remote = window.require('@electron/remote'),
      mainProcess = remote.require('./electron.js');

const WeatherChart = () => { 
    const chartRef = React.createRef(null),
          [weatherChart, setWeatherChart] = useState(null),
          [weatherLogs, setWeatherLogs] = useState({}),
          weatherInfo = useSelector(state => state.weatherInfo.weatherInfo);
          
    const getChartConfig = (newWeatherLogs) => {
        return setChartConfig(newWeatherLogs.timeStampsList, newWeatherLogs.temperatureList, newWeatherLogs.humidityList);
    };
    
    useEffect(() => {
        mainProcess.readAppFile('Mechanical Weather', 'Logs', 'WeatherLogs', 'json')
        .then(newWeatherLogs => setWeatherLogs(generateWeatherLogs(newWeatherLogs, {
                timeStampsList: [],
                temperatureList: [],
                humidityList: []
        })))
        .catch(error => console.log(error))
    }, [weatherInfo]);

    useEffect(() => {
        if(chartRef && chartRef.current){
            const initialChartConfig = getChartConfig(generateWeatherLogs(weatherLogs, {
                timeStampsList: [],
                temperatureList: [],
                humidityList: []
            }));

            if(weatherChart === null){
                const newWeatherChart = new Chart(chartRef.current, initialChartConfig);

                setWeatherChart(newWeatherChart);
            };
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);
    
    useEffect(() => {
        if(process.env.REACT_APP_ENVIRONMENT === 'production'){
            setInterval(async () => {
                const userInfo = JSON.parse(window.localStorage.getItem("userInfo")),
                      userLocation = JSON.parse(window.localStorage.getItem("userLocation"));
                
                const userData = {
                    userInfo: userInfo,
                    userLocation: userLocation
                };
                
                sendWeatherData(weatherLogs, userData)
                .catch(error => console.log(error))
            }, 300000);
        };
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => { 
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

        if(weatherChart !== null){
            updateWeatherDatasets(weatherLogs.timeStampsList, weatherLogs.temperatureList, weatherLogs.humidityList);

            weatherChart.update();
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [weatherLogs]);
    
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