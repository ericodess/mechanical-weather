const {
    app,
    BrowserWindow,
    ipcMain
} = require('electron');

const fs = require('fs');

const generaConfigFile = (appName, fileName, configPayload) => {
    const currentSystem = process.platform,
          configFilePath = currentSystem === "win32" ? `${process.env.APPDATA}\\${appName}\\Config\\` : `${process.env.HOME}/${appName}/Config/`;

    if(!fs.existsSync(configFilePath)){
        fs.mkdirSync(configFilePath, {recursive: true});
    };

    fs.writeFileSync(`${configFilePath}${fileName}.json`, JSON.stringify(configPayload, null, "\t"));

    return configFilePath;
};

const readConfigFile = (appName) => {
    return new Promise((resolve, reject) => {
        const currentSystem = process.platform,
          configFilePath = currentSystem === "win32" ? `${process.env.APPDATA}\\${appName}\\Config\\` : `${process.env.HOME}/${appName}/Config/`;

        let configPayload = {};

        if(fs.existsSync(configFilePath)){
            fs.readFile(`${configFilePath}ClientConfiguration.json`, (err, data) => {
                if(err){
                    reject(err);
                };

                resolve(JSON.parse(data));
            });
        };

        return configPayload;
    })
};

const createWindow = async () => {
    let configPayload = {};

    await readConfigFile('MechanicalWeather')
    .then(result => configPayload = result)
    
    const mainWindow = new BrowserWindow({
        width: configPayload.displayResolution ? configPayload.displayResolution.width : 1600,
        height: configPayload.displayResolution ? configPayload.displayResolution.height : 900,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false
        }
    });
    
    mainWindow.loadURL('http://localhost:3000');
};


app.whenReady().then(() => {
    createWindow();
    
    app.on('activate', () => {
        if(BrowserWindow.getAllWindows().length === 0){
            createWindow();
        };
    });
});

const SerialPort = require('serialport');

ipcMain.on('get-port-list', async (event, arg) => {
    await SerialPort.list()
    .then((ports, err) => {
        if(err){
            event.returnValue = [];
        }else{
            event.returnValue = ports;
        };
    })
    .catch(error => {
        event.returnValue = [];
    })
});

ipcMain.on('get-port-info', async (event, portPath) => {
    await SerialPort.list()
    .then((ports, err) => {
        if(err){
            event.returnValue = {};
        }else{   
            ports.forEach(port => {
                if(port.path === portPath){
                    event.returnValue = port;
                };
            });
        };
    })
    .catch(() => {
        event.returnValue = {};
    })
});

ipcMain.on('get-weather-info', async (event, portPath) => {
    if(portPath){
        const port = new SerialPort(portPath, {
            autoOpen: false,
            baudRate: 9600
        }),
            parser = port.pipe(new SerialPort.parsers.Readline({ delimiter: '\r\n' }));
        
        
        port.open((error) => {
            if(error){
                console.log(error.message)
                event.returnValue = "unknown";   
            }else{
                parser.on('data', (data) => {
                    const serialData = JSON.parse(data);
                    
                    console.log(serialData)
        
                    event.returnValue = "clearDay";
                });   
            };
        });
    }else{
        event.returnValue = "unknown";
    };
});

ipcMain.on('generate-config-file', (event, config) => {
    generaConfigFile('MechanicalWeather', 'ClientConfiguration', config);

    event.returnValue = true;
});

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin'){
        app.quit();
    };
});