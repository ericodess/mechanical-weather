import { useSelector } from 'react-redux';

//Components
import {
    DropdownList,
    InfoDiplay,
    Page
} from '../components';

//Actions
import { updatePortInfo } from '../actions';

const electron = window.require('electron');

const Settings = () => {
    const selectedPortInfo = useSelector(state => state.portInfo),
          fetchedList = electron.ipcRenderer.sendSync('get-port-list');
          
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

    return(
        <Page>
            <DropdownList
                options={generatePortList()}
                action={insertPortInfo}
            />
            <InfoDiplay
                info={selectedPortInfo.path ? electron.ipcRenderer.sendSync('get-port-info', selectedPortInfo.path) : {}}
                errorMessage="Escolha uma porta"
            />
        </Page>
    );
};

export default Settings;