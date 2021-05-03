const generateWeatherLogs = (rawWeatherLogs, weatherLogs) => {
    const newWeatherLogs = weatherLogs,
          weatherLogIndexes = {
              "timeStamp": "timeStampsList",
              "temperature": "temperatureList",
              "humidity": "humidityList"
          };
    
    Object.values(rawWeatherLogs).forEach(weatherInfo => {
        for(const [key, newWeather] of Object.entries(weatherInfo)){
            if(weatherLogIndexes[key] !== undefined){
                let newWeatherInfo = newWeather;

                if(weatherLogIndexes[key] === "timeStampsList"){
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

export default generateWeatherLogs;