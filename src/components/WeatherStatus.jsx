import {
    clearDayIcon,
    clearNightIcon,
    cloudIcon,
    cloudyDayIcon,
    cloudyNightIcon,
    rainingIcon
} from '../assets/images/icons';

const WeatherStatus = () => {
    const availableStatusList = [
        clearDayIcon,
        clearNightIcon,
        cloudIcon,
        cloudyDayIcon,
        cloudyNightIcon,
        rainingIcon
    ];

    return(
        <div className="weather-status --full-width  --flex --centralize">
            {availableStatusList[0]}
        </div>
    );
};

export default WeatherStatus;