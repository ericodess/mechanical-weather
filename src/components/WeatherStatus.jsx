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

const electron = window.require('electron');

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
          weatherInfo = selectedPortInfo.path ?  electron.ipcRenderer.sendSync('get-weather-info', selectedPortInfo.path) : {},
          weatherStatus = weatherInfo.weatherType ? weatherInfo.weatherType : "unknown";
          
    dispatch(updateWeatherInfo(weatherInfo));

    return(
        <div className="weather-status --full-width  --flex --centralize">
            {availableStatusList[weatherStatus]}
        </div>
    );
};

export default WeatherStatus;