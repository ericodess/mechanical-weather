const electron = window.require('electron');


const settingsFile = electron.ipcRenderer.sendSync('read-app-file', 'Config', 'ClientConfiguration', 'json');

const screenResolutionReducer = (state = JSON.parse(window.localStorage.getItem("screenResolution")) === null ? {
    resolution: settingsFile ? `${settingsFile.displayResolution.width}x${settingsFile.displayResolution.height}` : "1280x720"
    } : JSON.parse(window.localStorage.getItem("screenResolution")), action) => {
        
    switch(action.type){
        case 'UPDATE_SCREEN_RESOLUTION':
            const newState = {
                resolution: action.screenResultion
            };

            window.localStorage.setItem("screenResolution", JSON.stringify(newState));

            if(state.resolution !== newState.resolution){
                const win = electron.remote.getCurrentWindow(),
                      splittedScreenResolution = newState.resolution.split('x');

                win.setSize(parseInt(splittedScreenResolution[0]), parseInt(splittedScreenResolution[1]));
                win.center();
            };

            return state = newState;

        default:
            return state;
    };
};

export default screenResolutionReducer;