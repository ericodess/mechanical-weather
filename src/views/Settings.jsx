import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

//Components
import {
    DropdownList,
    InfoDiplay,
    Page
} from '../components';

//Icons
import {
    displayIcon,
    usbIcon
} from '../assets/images/icons';

//Actions
import {
    updatePortInfo,
    updateScreenResolution
} from '../actions';

const electron = window.require('electron');

const Settings = (props) => {
    const state = useSelector(state => state),
          fetchedList = electron.ipcRenderer.sendSync('get-port-list'),
          currentPathname = props.location.pathname.split('/')[props.location.pathname.split('/').length - 1],
          resolutionList = ['1600x900', '1280x720'],
          selectedOption = currentPathname === 'port' ? state.portInfo.path : state.screenResolution.resolution;
          
    const generatePortList = () => {
        const newPortList = [];

        fetchedList.forEach(port => {
            newPortList.push(port.path);
        });

        return newPortList;
    };

    const insertPortInfo = (option) => {
        const portInfo = fetchedList.find(currentPort => currentPort.path === option);
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
        
        electron.ipcRenderer.sendSync('generate-config-file', configurationPayload);

        return updateScreenResolution(option);
    };
    
    return(
        <Page column>
            <div className="--flex --row --full-width --centralize">
                {currentPathname === 'port' ? 
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
                :
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
                }
            </div>
            <ul className="settings-menu --flex --row --centralize-vert">
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