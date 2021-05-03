const sendWeatherData = (hasWeatherBeenSent, weatherLogs, userData) => {
    const {
        userInfo,
        userLocation
    } = userData;
    const latestWeather = {
        temperature: weatherLogs.temperatureList[weatherLogs.temperatureList.length - 1],
        humidity: weatherLogs.humidityList[weatherLogs.humidityList.length - 1]
    };

    return new Promise((resolve, reject) => {
        const headers = new Headers();

        headers.set('X-Requested-With', 'XMLHttpRequest');

        try{
            if(latestWeather && latestWeather.temperature && latestWeather.humidity && latestWeather.temperature !== '?' && latestWeather.humidity !== '?' && userInfo.username && userLocation.longitude && userLocation.latitude && userInfo.username !== '' && userLocation.longitude !== '' && userLocation.latitude !== ''){
                if(process.env.REACT_APP_CORS && process.env.REACT_APP_API_URL){
                    if(hasWeatherBeenSent === true){
                        if(latestWeather.temperature !== weatherLogs.temperatureList[weatherLogs.temperatureList.length - 2] && latestWeather.humidity !== weatherLogs.humidityList[weatherLogs.humidityList.length - 2]){
                            resolve(fetch(`${process.env.REACT_APP_CORS}/${process.env.REACT_APP_API_URL}?p=${encodeURI(userInfo.username)}&lat=${userLocation.latitude}&lon=${userLocation.longitude}&t=${latestWeather.temperature}&u=${latestWeather.humidity}`, {
                                headers: headers,
                                method: 'GET'
                            }));
                        };
                    }else{
                        resolve(fetch(`${process.env.REACT_APP_CORS}/${process.env.REACT_APP_API_URL}?p=${encodeURI(userInfo.username)}&lat=${userLocation.latitude}&lon=${userLocation.longitude}&t=${latestWeather.temperature}&u=${latestWeather.humidity}`, {
                            headers: headers,
                            method: 'GET'
                        }));
                    };
                }else{
                    throw(new Error('Missing environment variable(s)'));
                };
            }else{
                throw(new Error('Missing user data'));
            };
        }catch(error){
            reject(error);
        };   
    });
};

export default sendWeatherData;