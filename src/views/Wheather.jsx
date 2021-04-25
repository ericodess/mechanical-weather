import { useSelector } from 'react-redux';

//Components
import {
    Page,
    WeatherChart,
    InfoDiplay
} from '../components';

const Weather = () => {
    const weatherInfo = useSelector(state => state.weatherInfo),
          weatherStatus = weatherInfo.weatherInfo ? weatherInfo.weatherInfo : {
            temperature: "?",
            humidity: "?"
          };
            
    return(
        <Page column>
            <div className="page__text --flex --column">
                <p>
                    <span className="--blue-color">{weatherStatus.humidity}</span>
                    <span>%</span>
                </p>
                <p>
                    <span className="--green-color">{weatherStatus.temperature}</span>
                    <span>°C</span>
                </p>
            </div>
            
            <InfoDiplay custom>
                <WeatherChart />
            </InfoDiplay>
        </Page>
    );
};

export default Weather;