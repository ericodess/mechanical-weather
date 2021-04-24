const {
    app,
    BrowserWindow,
    ipcMain
} = require('electron');

const fs = require('fs');

const generateAppFile = (appName, subDirectoryPath, fileName, fileExtension, payload) => {
    const currentSystem = process.platform,
          sanatizedSubSirectoryPath = filePathSanitizer(subDirectoryPath, ['\\','/']),
          appFilePath = currentSystem === "win32" ? `${process.env.APPDATA}\\${appName}\\${sanatizedSubSirectoryPath}\\` : `${process.env.HOME}/${appName}/${sanatizedSubSirectoryPath}/`,
          filePath = `${appFilePath}${fileName}.${filePathSanitizer(fileExtension.toLowerCase(),['.'])}`;

    if(!fs.existsSync(appFilePath)){
        fs.mkdirSync(appFilePath, {recursive: true});
    };

    fs.writeFileSync(filePath, JSON.stringify(payload, null, "\t"));
};

const readAppFile = (appName, subDirectoryPath, fileName, fileExtension) => {
    return new Promise((resolve, reject) => {
        const currentSystem = process.platform,
              sanatizedSubSirectoryPath = filePathSanitizer(subDirectoryPath, ['\\','/']),
              appFilePath = currentSystem === "win32" ? `${process.env.APPDATA}\\${appName}\\${sanatizedSubSirectoryPath}\\` : `${process.env.HOME}/${appName}/${sanatizedSubSirectoryPath}/`,
              filePath = `${appFilePath}${fileName}.${filePathSanitizer(fileExtension.toLowerCase(),['.'])}`;

        if(fs.existsSync(filePath)){
            fs.readFile(filePath, (err, data) => {
                if(err){
                    reject(err);
                };

                resolve(JSON.parse(data));
            });
        }else{
            resolve(-1);
        };
    })
};

const filePathSanitizer = (filePath, targetList) => {
    let sanitizedFilePath = filePath;

    if(sanitizedFilePath !== null && sanitizedFilePath !== undefined && sanitizedFilePath !== ''){
        targetList.forEach((target, index) => {
            if(sanitizedFilePath[0] === target){
                sanitizedFilePath = sanitizedFilePath.substring(1);
            };
    
            if(sanitizedFilePath[sanitizedFilePath.length - 1] === target){
                sanitizedFilePath = sanitizedFilePath.slice(0, -1);
            };
        });
    };

    return sanitizedFilePath;
};

const createWindow = async () => {
    let configPayload = {};

    await readAppFile('MechanicalWeather', 'Config', 'ClientConfiguration', 'json')
    .then(result => configPayload = result)
    
    const mainWindow = new BrowserWindow({
        width: configPayload.displayResolution ? configPayload.displayResolution.width : 1280,
        height: configPayload.displayResolution ? configPayload.displayResolution.height : 720,
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
                event.returnValue = "unknown";   
            }else{
                parser.on('data', async (data) => {
                    const serialData = JSON.parse(data);

                    let payload = {
                        timeStamp: Date.now(),
                        weatherInfo: serialData
                    },
                        weatherLog;

                    await readAppFile('MechanicalWeather', 'Logs', 'WeatherLogs', 'json')
                    .then(result => weatherLog = result)
                    
                    if(weatherLog === -1){
                        payload = [payload];
                    }else{
                        const newWeatherLog = weatherLog;
                        
                        while(newWeatherLog.length >= 14){
                            newWeatherLog.shift();
                        };

                        newWeatherLog.push(payload);

                        payload = weatherLog;
                    };

                    generateAppFile('MechanicalWeather', 'Logs', 'WeatherLogs', 'json', payload);

                    event.returnValue = "clearDay";
                });   
            };
        });
    }else{
        event.returnValue = "unknown";
    };
});

ipcMain.on('generate-app-file', (event, subDirectoryPath, fileName, fileExtension, payload) => {
    generateAppFile('MechanicalWeather', subDirectoryPath, fileName, fileExtension, payload);

    event.returnValue = true;
});

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin'){
        app.quit();
    };
});