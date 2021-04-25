const updateWeatherInfo = (weatherInfo) => {
    return {
        type: 'UPDATE_WEATHER_INFO',
        weatherInfo: weatherInfo
    };
};

export default updateWeatherInfo;