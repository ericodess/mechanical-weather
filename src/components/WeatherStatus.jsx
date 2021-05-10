import {
    useEffect,
    useState
} from 'react';

import {
    useSelector,
    useDispatch
} from 'react-redux';

//Icons
import {
    clearDayIcon,
    clearNightIcon,
    cloudyDayIcon,
    cloudyNightIcon,
    rainingIcon,
    unknownIcon
} from '../assets/images/icons';

//Actions
import { updateWeatherInfo } from '../actions';

const remote = window.require('@electron/remote'),
      SerialPort = remote.require('serialport');

const availableStatusList = {
    "clearDay": clearDayIcon,
    "clearNight": clearNightIcon,
    "cloudyDay": cloudyDayIcon,
    "cloudyNight": cloudyNightIcon,
    "raining": rainingIcon,
    "unknown": unknownIcon
};

const WeatherStatus = () => {
    const dispatch = useDispatch();

    const selectedPortInfo = useSelector(state => state.portInfo),
          [weatherInfo, setWeatherInfo] = useState({}),
          [weatherStatus, setWeatherStatus] = useState("unknown");
          
    useEffect(() => {
        const port = new SerialPort(selectedPortInfo.path, {
            autoOpen: false,
            baudRate: 9600
        }),
              parser = port.pipe(new SerialPort.parsers.Readline({ delimiter: '\r\n' }));
        
        let hasError = false;

        port.open(error => {
            if(error){
                hasError = true;
            }else{
                parser.on('data', async (data) => {
                    const mainProcess = remote.require('./electron.js'),
                          serialData = JSON.parse(data),
                          weatherLog = await mainProcess.readAppFile('Mechanical Weather', 'Logs', 'WeatherLogs', 'json');
                          
                    let payload = {
                        timeStamp: Date.now(),
                        weatherInfo: serialData
                    };

                    if(weatherLog === -1){
                        payload = [payload];
                    }else{
                        const newWeatherLog = weatherLog;
                        
                        while(newWeatherLog.length >= 14){
                            newWeatherLog.shift();
                        };
                    
                        newWeatherLog.push(payload);
                    
                        payload = newWeatherLog;
                    };

                    await mainProcess.generateAppFile('Mechanical Weather', 'Logs', 'WeatherLogs', 'json', payload)
                    .then(() => {
                        const latestPayloadEntry = payload[payload.length - 1],
                              currentTimeStamp = latestPayloadEntry.timeStamp,
                              currentTemperature = latestPayloadEntry.weatherInfo.temperature,
                              currentHumidity = latestPayloadEntry.weatherInfo.humidity,
                              currentWeatherType = mainProcess.generateWeatherStatus(currentTimeStamp, currentTemperature, currentHumidity);

                        setWeatherInfo({
                            weatherType: currentWeatherType,
                            weatherInfo: latestPayloadEntry.weatherInfo
                        });

                        setWeatherStatus(currentWeatherType);
                    })
                    .catch(error => console.log(error))
                });
            };
        });

        return () => {
            if(hasError === false){
                port.close();
            };
        };
    }, [selectedPortInfo.path]);

    useEffect(() => dispatch(updateWeatherInfo(weatherInfo)));
    

    return(
        <div className="weather-status --full-width  --flex --centralize">
            {availableStatusList[weatherStatus]}
        </div>
    );
};

export default WeatherStatus;