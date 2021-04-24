//Components
import { Page } from '../components';

//Components
import {
    DropdownList,
    InfoDiplay
} from '../components';

const Weather = () => {
    return(
        <Page column>
            <DropdownList
                options={['°C', '°F']}
                action={() => alert('huh')}
                defaultValue="Selecione uma unidade"
                selectedOption={null}
            />
            <InfoDiplay custom>
                <span>Graph</span>
            </InfoDiplay>
        </Page>
    );
};

export default Weather;