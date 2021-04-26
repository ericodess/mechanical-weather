import React from 'react';
import {
    useSelector,
    useDispatch
} from 'react-redux';
import { Link } from 'react-router-dom';

//Components
import {
    DropdownList,
    InfoDiplay,
    Page,
    TextInput
} from '../components';

//Icons
import {
    displayIcon,
    profileIcon,
    usbIcon
} from '../assets/images/icons';

//Actions
import {
    updatePortInfo,
    updateScreenResolution,
    updateUsername,
    updateUserLocation
} from '../actions';

const electron = window.require('electron');

const Settings = (props) => {
    const dispatch = useDispatch();

    const state = useSelector(state => state),
          portList = electron.ipcRenderer.sendSync('get-port-list'),
          currentPathname = props.location.pathname.split('/')[props.location.pathname.split('/').length - 1],
          resolutionList = ['1600x900', '1280x720'],
          selectedOption = currentPathname === 'port' ? state.portInfo.path : state.screenResolution.resolution;
          
    const generatePortList = () => {
        const newPortList = [];

        portList.forEach(port => {
            newPortList.push(port.path);
        });

        return newPortList;
    };

    const insertPortInfo = (option) => {
        const portInfo = portList.find(currentPort => currentPort.path === option);
        let port = {};

        if(typeof portInfo === 'object'){
            port = portInfo;
        };

        return updatePortInfo(port);
    };

    const fetchPortInfo = (portPath) => {
        let portInfo = {};

        if(portPath){
            portInfo = electron.ipcRenderer.sendSync('get-port-info', portPath);
        };

        return portInfo;
    };

    const insertScreenResolution = (option) => {
        const splittedOption = option.split('x'),
              configurationPayload = {
                    displayResolution: {
                        width: parseInt(splittedOption[0]),
                        height: parseInt(splittedOption[1])
                    }
        };
        
        electron.ipcRenderer.sendSync('generate-app-file', 'Config', 'ClientConfiguration', 'json', configurationPayload);

        return updateScreenResolution(option);
    };
    
    const dispatchUsername = () => {
        const nameInput = document.getElementById('nomeInput');

        if(nameInput && nameInput.value !== ''){
            dispatch(updateUsername(nameInput.value));
        };
    };
    
    const dispatchUserLocation = () => {
        const longitudeInput = document.getElementById('longitudeInput'),
              latitudeInput = document.getElementById('latitudeInput');

        if(longitudeInput && latitudeInput && longitudeInput.value !== '' && latitudeInput.value !== ''){
            if(longitudeInput.value && latitudeInput.value){
                dispatch(updateUserLocation({
                    latitude: latitudeInput.value,
                    longitude: longitudeInput.value
                }))
            }; 
        };
    };

    const setPageRender = () => {
        switch(currentPathname){
            case 'display':
                return(
                    <React.Fragment>
                        <DropdownList
                            options={resolutionList}
                            action={insertScreenResolution}
                            defaultValue="Selecione uma resolução"
                            selectedOption={selectedOption}
                        />
                        <InfoDiplay
                            info={{screenResolution: state.screenResolution.resolution}}
                            errorMessage="Escolha uma resolução"
                        />
                    </React.Fragment>
                );

            case 'port':
                return(
                    <React.Fragment>
                        <DropdownList
                            options={generatePortList()}
                            action={insertPortInfo}
                            defaultValue="Selecione uma porta"
                            selectedOption={selectedOption}
                        />
                        <InfoDiplay
                            info={fetchPortInfo(state.portInfo.path)}
                            errorMessage="Escolha uma porta"
                        />
                    </React.Fragment>
                );

            case 'profile':
                return(
                    <React.Fragment>
                        <TextInput
                            label="Nome"
                            onClick={dispatchUsername}
                        />
                        <div className="page__section --flex --row">
                            <TextInput
                                label="Latitude"
                                onClick={dispatchUserLocation}
                            />
                            <TextInput
                                label="Longitude"
                                onClick={dispatchUserLocation}
                            />
                        </div>
                        <InfoDiplay
                            info={{
                                userName: state.userInfo.username,
                                longitude: state.userLocation.longitude,
                                latitude: state.userLocation.latitude
                            }}
                            errorMessage="Insira os dados"
                        marginLess/>
                    </React.Fragment>
                );

            default:
                return(
                    <React.Fragment></React.Fragment>
                );
        };
    };

    return(
        <Page column>
            {setPageRender()}
            <ul className="settings-menu --flex --row --centralize-vert">
                <li>
                    <Link
                        className={currentPathname === 'profile' ? '--flex --centralize --active' : '--flex --centralize'}
                        to="/settings/profile"
                    >
                        {profileIcon}
                    </Link>
                </li>
                <li>
                    <Link
                        className={currentPathname === 'port' ? '--flex --centralize --active' : '--flex --centralize'}
                        to="/settings/port"
                    >
                        {usbIcon}
                    </Link>
                </li>
                <li>
                    <Link
                        className={currentPathname === 'display' ? '--flex --centralize --active' : '--flex --centralize'}
                        to="/settings/display"
                    >
                        {displayIcon}
                    </Link>
                </li>
            </ul>
        </Page>
    )};

export default Settings;