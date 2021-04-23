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

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin'){
        app.quit();
    };
});