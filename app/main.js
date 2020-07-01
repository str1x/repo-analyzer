/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 */
import path from 'path';
import { app, BrowserWindow } from 'electron';
// import log from 'electron-log';
const isDev = process.env.NODE_ENV === 'development';

let mainWindow = null;

const createWindow = async () => {
    mainWindow = new BrowserWindow({
        show: false,
        width: 1024,
        height: 728,
        webPreferences: {
            enableRemoteModule: true,
            nodeIntegration: true,
            ...isDev ? {} : {
                preload: path.join(__dirname, 'dist/renderer.build.js'),
            },
        },
    });

    mainWindow.loadURL(`file://${__dirname}/app.html`);

    // @TODO: Use 'ready-to-show' event
    //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
    mainWindow.webContents.on('did-finish-load', () => {
        if (!mainWindow) {
            throw new Error('"mainWindow" is not defined');
        } else {
            mainWindow.show();
            mainWindow.focus();
        }
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
};

// enable native modules in renderer
app.allowRendererProcessReuse = false;

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
    // Respect the OSX convention of having the application in memory even
    // after all windows have been closed
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('ready', createWindow);

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) createWindow();
});
