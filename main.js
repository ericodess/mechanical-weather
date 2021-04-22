const {
    app,
    BrowserWindow,
    ipcMain
} = require('electron');

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 1600,
        height: 900,
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
    
    app.on('activate', function () {
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
})

ipcMain.on('get-weather-info', (event, portPath) => {
    const port = new SerialPort(portPath, {
        baudRate: 9600
    }),
        parser = port.pipe(new SerialPort.parsers.Readline({ delimiter: '\r\n' }));
    
    parser.on('data', (data) => {
        const serialData = JSON.parse(data);

        event.returnValue = "clearDay";
    });
});

app.on('window-all-closed', function () {
    if(process.platform !== 'darwin'){
        app.quit();
    };
});