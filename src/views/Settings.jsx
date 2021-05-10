import React, {
    useEffect,
    useState
} from 'react';
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
    usbIcon,
    enterIcon
} from '../assets/images/icons';

//Actions
import {
    updatePortInfo,
    updateScreenResolution,
    updateUsername,
    updateUserLocation
} from '../actions';

const remote = window.require('@electron/remote'),
      SerialPort = remote.require('serialport');

const Settings = (props) => {
    const dispatch = useDispatch();

    const state = useSelector(state => state),
          [portList, setPortList] = useState([]),
          [portInfo, setPortInfo] = useState({}),
          currentPathname = props.location.pathname.split('/')[props.location.pathname.split('/').length - 1],
          resolutionList = ['1600x900', '1280x720'],
          selectedOption = currentPathname === 'port' ? state.portInfo.path : state.screenResolution.resolution;

    const generatePortList = (currentPortList) => {
        const newPortList = [];

        currentPortList.forEach(port => {
            newPortList.push(port.path);
        });

        return newPortList;
    };

    useEffect(() => {
        (async () => {
            await SerialPort.list()
            .then((ports, err) => {
                if(!err){
                    setPortList(generatePortList(ports));
                };
            })
        })();
    }, []);

    useEffect(() => {
        (async () => {
            if(portList.find(port => port === selectedOption)){
                if(selectedOption){
                    await SerialPort.list()
                    .then((ports, err) => {
                        if(!err){
                            ports.forEach(port => {
                                if(port.path === selectedOption){
                                    setPortInfo(port);
                                };
                            });
                        };
                    })
                };
            };
        })();
    }, [portList, selectedOption]);

    const insertPortInfo = (option) => {
        const portInfo = portList.find(currentPort => currentPort.path === option);
        let port = {};

        if(typeof portInfo === 'object'){
            port = portInfo;
        };

        return updatePortInfo(port);
    };

    const insertScreenResolution = (option) => {
        const mainProcess = remote.require('./electron.js');

        const splittedOption = option.split('x'),
              configurationPayload = {
                    displayResolution: {
                        width: parseInt(splittedOption[0]),
                        height: parseInt(splittedOption[1])
                    }
        };
        
        mainProcess.readAppFile('Mechanical Weather', 'Config', 'ClientConfiguration', 'json')
        .then(payload => {
            if(payload.displayResolution !== option){
                const win = remote.getCurrentWindow(),
                      splittedScreenResolution = splittedOption;
    
                win.setMinimumSize(parseInt(splittedScreenResolution[0]), parseInt(splittedScreenResolution[1]));
                win.setMaximumSize(parseInt(splittedScreenResolution[0]), parseInt(splittedScreenResolution[1]));
                
                win.setSize(parseInt(splittedScreenResolution[0]), parseInt(splittedScreenResolution[1]));
                
                win.center();
    
                window.localStorage.setItem("screenResolution", JSON.stringify({resolution: option}));

                mainProcess.generateAppFile('Mechanical Weather', 'Config', 'ClientConfiguration', 'json', configurationPayload);
            };
        })

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
                            options={portList}
                            action={insertPortInfo}
                            defaultValue="Selecione uma porta"
                            selectedOption={selectedOption}
                        />
                        <InfoDiplay
                            info={portInfo}
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
                            title="Atualizar nome"
                            defaultValue={state.userInfo.username ? state.userInfo.username : ""}
                        />
                        <div className="page__section --flex --column --centralize-horiz">
                            <div className="page__section --flex --row">
                                <TextInput
                                    label="Latitude"
                                    defaultValue={state.userLocation.latitude ? state.userLocation.latitude : ""}
                                buttonless/>
                                <TextInput
                                    label="Longitude"
                                    defaultValue={state.userLocation.longitude ? state.userLocation.longitude : ""}
                                buttonless/>
                            </div>
                            <button
                                className="text-input__button --double-button --neumorphism --smooth-transition --squircle-borders"
                                title="Atulizar localização"
                                onClick={dispatchUserLocation}
                            >
                                {enterIcon}
                            </button>
                        </div>
                        <InfoDiplay
                            info={{
                                userName: state.userInfo.username,
                                latitude: state.userLocation.latitude,
                                longitude: state.userLocation.longitude
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
                        title="Configurações do Usuário"
                    >
                        {profileIcon}
                    </Link>
                </li>
                <li>
                    <Link
                        className={currentPathname === 'port' ? '--flex --centralize --active' : '--flex --centralize'}
                        to="/settings/port"
                        title="Configurações de Porta"
                    >
                        {usbIcon}
                    </Link>
                </li>
                <li>
                    <Link
                        className={currentPathname === 'display' ? '--flex --centralize --active' : '--flex --centralize'}
                        to="/settings/display"
                        title="Configurações de Vídeo"
                    >
                        {displayIcon}
                    </Link>
                </li>
            </ul>
        </Page>
    )};

export default Settings;