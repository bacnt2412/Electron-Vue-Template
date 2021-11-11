'use strict';
import {
    app,
    protocol,
    BrowserWindow,
    ipcMain,
    dialog,
    screen,
    clipboard
} from 'electron';
import {
    createProtocol
} from 'vue-cli-plugin-electron-builder/lib';
import installExtension, {
    VUEJS_DEVTOOLS
} from 'electron-devtools-installer';
import DB from './controllers/DB';
import Fs from 'fs';
import path from 'path';
import axios from 'axios';
import Utils from './controllers/Utils';
const os = require('os');
const isDevelopment = process.env.NODE_ENV !== 'production';
const {
    exec,
    spawn
} = require('child_process');

process.setMaxListeners(Infinity); // <== Important line
const Store = require('electron-store');
const store = new Store();
var ffmpeg = require('fluent-ffmpeg');

let win = null;
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{
    scheme: 'app',
    privileges: {
        secure: true,
        standard: true
    }
}]);
let logPath = path.join(isDevelopment ? __dirname + '/data/logs.txt' : __static + '/data/logs.txt');

//=================================
function logApp(name, value) {
    console.log(name, value ? value : '');
    if (win) {
        win.webContents.send('writeLog', name + (value ? value : ''));
    }
}

async function initDataBase() {
    try {
        logApp(' =================== initDataBase ================== ');
        //=================== DATABASE ===============================
        let dbPath = '';
        dbPath = store.get('databaseFile');
        if (!dbPath || !Fs.existsSync(dbPath)) {
            dbPath = path.join(isDevelopment ? __dirname + '/data/default.db' : __static.replace('\\app.asar', '') + '/data/default.db');
            store.set('databaseFile', dbPath);
        }
        await DB.loadDatabase(dbPath);

        ipcMain.on('DB-loadDatabase', async function (event, arg) {
            try {
                await DB.loadDatabase(arg);
                win.webContents.send('reload');
            } catch (error) {
                event.returnValue = null;
            }
            event.returnValue = arg;
        });

        //=================== FOLDER ===============================
        ipcMain.on('DB-getFolder', async function (event, arg) {
            let data = null;
            try {
                data = await DB.getFolder();
            } catch (error) {}
            event.returnValue = data;
        });
        ipcMain.on('DB-createFolder', async function (event, arg) {
            try {
                await DB.createFolder(arg);
            } catch (error) {}
            event.returnValue = arg;
        });
        ipcMain.on('DB-updateFolder', async function (event, arg) {
            try {
                await DB.updateFolder(arg.filter, arg.dataUpdate);
            } catch (error) {}
            event.returnValue = arg;
        });
        ipcMain.on('DB-deleteFolder', async function (event, arg) {
            try {
                await DB.removeFolder(arg);
            } catch (error) {}
            event.returnValue = arg;
        });
        //=================== ACCOUNT ===============================
        ipcMain.on('DB-getAccount', async function (event, arg) {
            let data = null;
            try {
                data = await DB.getAccount(arg);
            } catch (error) {}
            event.returnValue = data;
        });
        ipcMain.on('DB-getAccountDeleted', async function (event, arg) {
            let data = null;
            try {
                data = await DB.getAccountDeleted()
            } catch (error) {}
            event.returnValue = data;
        });
        ipcMain.on('DB-addListAccount', async function (event, arg) {
            let newList = null;
            try {
                newList = await DB.addListAccount(arg)
            } catch (error) {}
            event.returnValue = newList;
        });
        ipcMain.on('DB-checkExistAccount', async function (event, arg) {
            let result = null;
            try {
                result = await DB.checkExistAccount(arg)
            } catch (error) {}
            event.returnValue = result;
        });
        ipcMain.on('DB-deleteAccount', async function (event, arg) {
            try {
                await DB.deleteAccount(arg);
            } catch (error) {}
            event.returnValue = arg;
        });
        ipcMain.on('DB-updateAccount', async function (event, arg) {
            try {
                await DB.updateAccount(arg);
            } catch (error) {

            }
            event.returnValue = arg;
            win.webContents.send('reload');
        });
    } catch (error) {
        logApp(error);
        console.log(error);
        writeError(" 9999 error: ", error.toString())
    }
}

async function initControlFile(mainWindow) {
    ipcMain.on('File-OpenFile', async function (event, arg) {
        let result = await dialog.showOpenDialog(mainWindow, {
            properties: ['openFile'],
            filters: [{
                name: 'Database',
                extensions: ['db']
            }],
        });
        if (result.canceled === false) {
            return (event.returnValue = result.filePaths[0]);
        }
        return (event.returnValue = '');
    });
    ipcMain.on('File-OpenFolder', async function (event, arg) {
        let result = await dialog.showOpenDialog(mainWindow, {
            properties: ['openDirectory'],
            // filters: [{ name: 'Database bacnt2412', extensions: ['bacnt2412'] }],
        });
        if (result.canceled === false) {
            return (event.returnValue = result.filePaths[0]);
        }
        return (event.returnValue = '');
    });
}

async function createWindow() {
    // Create the browser window.
    await initDataBase();
    win = new BrowserWindow({
        width: 1600,
        height: 1200,
        webPreferences: {
            // Use pluginOptions.nodeIntegration, leave this alone
            // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
            // nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
            // contextIsolation: process.env.ELECTRON_NODE_INTEGRATION,
            nodeIntegration: true, // This value is fetched from vue.config.js
            contextIsolation: false,
            nodeIntegrationInWorker: true,
        },
    });
    // win.setMenu(null);
    // win.setAutoHideMenuBar(true);
    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
        if (!process.env.IS_TEST) win.webContents.openDevTools();
    } else {
        createProtocol('app');
        // Load the index.html when not in development
        win.loadURL('app://./index.html');
    }
    // init
    initControlFile(win);
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        try {
            await installExtension(VUEJS_DEVTOOLS, {
                allowFileAccess: true
            });
        } catch (e) {
            console.error('Vue Devtools failed to install:', e.toString());
        }
    }
    createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', (data) => {
            if (data === 'graceful-exit') {
                app.quit();
            }
        });
    } else {
        process.on('SIGTERM', () => {
            app.quit();
        });
    }
}