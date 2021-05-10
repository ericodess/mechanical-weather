const {
    app,
    BrowserWindow
} = require('electron');

require('@electron/remote/main').initialize();

const fs = require('fs'),
      path = require('path'),
      isDev = require('electron-is-dev');

const generateAppFile = (appName, subDirectoryPath, fileName, fileExtension, payload) => {
    const currentSystem = process.platform,
          sanatizedSubSirectoryPath = filePathSanitizer(subDirectoryPath, ['\\','/']),
          appFilePath = currentSystem === "win32" ? `${process.env.APPDATA}\\${appName}\\${sanatizedSubSirectoryPath}\\` : 
                                                    `${process.env.HOME}/${appName}/${sanatizedSubSirectoryPath}/`,
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

    await readAppFile('Mechanical Weather', 'Config', 'ClientConfiguration', 'json')
    .then(result => configPayload = result)
    
    const mainWindow = new BrowserWindow({
        minWidth: configPayload.displayResolution ? configPayload.displayResolution.width : 1280,
        maxWidth: configPayload.displayResolution ? configPayload.displayResolution.width : 1280,
        width: configPayload.displayResolution ? configPayload.displayResolution.width : 1280,
        minHeight: configPayload.displayResolution ? configPayload.displayResolution.height : 720,
        maxHeight: configPayload.displayResolution ? configPayload.displayResolution.height : 720,
        height: configPayload.displayResolution ? configPayload.displayResolution.height : 720,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false
        },
        icon: __dirname + '/favicon.ico'
    });
    
    mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
    
    if(isDev){
        mainWindow.webContents.openDevTools();
    };
};

const generateWeatherStatus = (timestamp, temperature, humidity) => {
    const MIN_DAY_TRESHOLD = 4,
          MAX_DAY_TRESHOLD = 18;
    
    const MIN_MILD_TEMPERATURE_TRESHOLD = 21,
          MAX_MILD_TEMPERATURE_TRESHOLD = 27;

    const MIN_DAY_HUMIDITY_TRESHOLD = 20,
          MAX_DAY_HUMIDITY_TRESHOLD = 39,
          MIN_NIGTH_HUMIDITY_TRESHOLD = 40,
          MAX_NIGTH_HUMIDITY_TRESHOLD = 55;
    
    const availablePrefixes = {
        weather:{
            clear: "clear",
            cloudy: "cloudy",
            raining: "raining"
        },
        time: {
            day: "Day",
            night:"Night"
        }
    },
          convertedTime = new Date(timestamp).getHours();
    
    let weather, time;

    if(convertedTime >= MIN_DAY_TRESHOLD && convertedTime <= MAX_DAY_TRESHOLD){
        time = availablePrefixes.time.day;
    }else{
        time = availablePrefixes.time.night;
    };

    if(temperature >= MIN_MILD_TEMPERATURE_TRESHOLD && temperature <= MAX_MILD_TEMPERATURE_TRESHOLD){
        if(time === "Day"){
            if(humidity >= MIN_DAY_HUMIDITY_TRESHOLD && humidity <= MAX_DAY_HUMIDITY_TRESHOLD){
                weather = availablePrefixes.weather.cloudy + time;
            }else{
                weather = availablePrefixes.weather.clear + time;
            };
        }else{
            if(humidity >= MIN_NIGTH_HUMIDITY_TRESHOLD && humidity <= MAX_NIGTH_HUMIDITY_TRESHOLD){
                weather = availablePrefixes.weather.cloudy + time;
            }else{
                weather = availablePrefixes.weather.clear + time;
            };
        };
    }else{
        if(time === "Day"){
            if(humidity >= MIN_DAY_HUMIDITY_TRESHOLD && humidity <= MAX_DAY_HUMIDITY_TRESHOLD){
                weather = availablePrefixes.weather.cloudy + time;
            }else{
                weather = availablePrefixes.weather.clear + time;
            };
        }else{
            if(humidity >= MIN_NIGTH_HUMIDITY_TRESHOLD && humidity <= MAX_NIGTH_HUMIDITY_TRESHOLD){
                weather = availablePrefixes.weather.cloudy + time;
            }else{
                weather = availablePrefixes.weather.clear + time;
            };
        };
    };

    return weather;
};

app.whenReady().then(() => {
    createWindow();
    
    app.on('activate', () => {
        if(BrowserWindow.getAllWindows().length === 0){
            createWindow();
        };
    });
});

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin'){
        app.quit();
    };
});

exports.readAppFile = async (appName, subDirectoryPath, fileName, fileExtension) => {
    let appFilePayload = [];

    await readAppFile(appName, subDirectoryPath, fileName, fileExtension)
    .then(result => appFilePayload = result)
    .catch(() => appFilePayload = [])

    return appFilePayload;
};

exports.generateAppFile = (appName, subDirectoryPath, fileName, fileExtension, payload) => {
    return new Promise((resolve, reject) => {
        try{
            resolve(generateAppFile(appName, subDirectoryPath, fileName, fileExtension, payload));
        }catch(error){
            reject(error);
        };
    })
};

exports.generateWeatherStatus = (currentTimeStamp, currentTemperature, currentHumidity) => {
    return generateWeatherStatus(currentTimeStamp, currentTemperature, currentHumidity);
};