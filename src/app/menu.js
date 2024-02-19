const app_config = require('../../app/config/app.config');

const { app, Menu, BrowserWindow, dialog, shell } = require('electron');
const path = require("path");
const createhotspotwindow = require('./hotspotWendow');
const { checkForUpdates } = require('../../app/config/autoupdater');

// Load the CSS file for menu styling
const menuCssPath = path.join(__dirname, './../public/style/menucss.css');
const menuCss = require('fs').readFileSync(menuCssPath, 'utf-8');

let animationWindow = null;
let themeWindow=null;
let mediaWindow = null;
let timerWindow = null;
let previewWindow = null;
let chatWindow=null;
let learnWindow=null;
let shearWindow=null;


const topconfig = {  titleBarStyle: 'hidden',
titleBarOverlay: {
color: '#2f3241',
symbolColor: '#74b1be',
height: 30
}}

const createAnimationWindow = () => {
    animationWindow = new BrowserWindow({
        width: 350,
        height: 350,
       // ...topconfig,
        resizable: false,
        webPreferences: {
            nodeIntegration: true
        }
    });
     animationWindow.setMenu(null);
    animationWindow.loadURL(`http://${app_config.host}:${app_config.port}/animation`);
};



const createshearWindow = () => {
    shearWindow = new BrowserWindow({
        width: 650,
        height: 650,
        resizable: false,
       // ...topconfig,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, './../views/shearscreen/screenSharingPreload.js')

        }
    });
    shearWindow.setMenu(null);
    // shearWindow.webContents.openDevTools();
    shearWindow.loadURL(`http://${app_config.host}:${app_config.port}/screenview`);
};
// for theme 

const createthemenWindow = () => {
        themeWindow = new BrowserWindow({
        width: 350,
        height: 250,
       // ...topconfig,
        movable: true,
        resizable: false,
        webPreferences: {
            nodeIntegration: true
        }
    });
    themeWindow.setMenu(null);
   // themeWindow.webContents.openDevTools();
    themeWindow.loadURL(`http://${app_config.host}:${app_config.port}/theme`);
};

//
const createMediaWindow = () => {
    mediaWindow = new BrowserWindow({
        width: 820,
        height: 650,
       // ...topconfig,
                webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, './../public/media/preload.js')
        }
    });
    mediaWindow.setMenu(null);
   // mediaWindow.webContents.openDevTools();

    mediaWindow.loadURL(`http://${app_config.host}:${app_config.port}/media`);
    mediaWindow.webContents.on('did-finish-load', () => {
        //requestImages(); // Call this after the page has loaded
        console.log("did-finish-load")
    });
};


// for timer
const createtimerWindow = () => {
    timerWindow = new BrowserWindow({
        width: 800,
        height: 500,
        resizable:false
    });
    timerWindow.setMenu(null);
   //timerWindow.webContents.openDevTools();

  timerWindow.loadURL(`http://${app_config.host}:${app_config.port}/timeradmin`);
   
};
// for timer


// for chat
const createchatWindow = () => {
    chatWindow = new BrowserWindow({
        width: 800,
        height: 500,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, './../views/chat/preload.js')
        }    });
    chatWindow.setMenu(null);
   // chatWindow.webContents.openDevTools();

   chatWindow.loadURL(`http://${app_config.host}:${app_config.port}/serverchat`);
   
};
// for chat


// for learn
const creatlearnWindow = () => {
    learnWindow = new BrowserWindow({
        width: 800,
        height: 500,  });
    learnWindow.setMenu(null);
    learnWindow.webContents.openDevTools();

    learnWindow.loadFile(path.join(__dirname,"./../learn/index.html"))
   
};
// for learn
const createPreviewWindow = () => {
    previewWindow = new BrowserWindow({
        width: 800,
        height: 600,

        webPreferences: {
            nodeIntegration: true
        }
    });
    previewWindow.setMenu(null);

   // previewWindow.webContents.openDevTools();
    previewWindow.loadURL(`http://${app_config.host}:${app_config.port}/preview`);
};

const templateMenu = [
    {
        label: 'app',
        submenu: [
            {
                label: 'Exit',
                click: () => {
                    dialog.showMessageBox({
                        message: 'Are you sure you want to exit you will lost all connextion with ipads?',
                        type: 'question',
                        buttons: ['Cancel', 'OK']
                    }).then((response) => {
                        if (response.response === 1) {
                            app.quit();
                        }
                    }).catch((err) => {
                        console.log(err);
                    });
                }
            }
        ]
    },
    {
        label: 'Edit',
        submenu: [
            { role: 'undo', label: 'Undo', accelerator: "CmdOrCtrl+Z" },
            { role: 'redo', label: 'Redo', accelerator: "CmdOrCtrl+Y" },
            { type: 'separator' },
            { role: 'cut', label: 'Cut', accelerator: "CmdOrCtrl+X" },
            { role: 'copy', label: 'Copy', accelerator: "CmdOrCtrl+C" },
            { role: 'paste', label: 'Paste', accelerator: "CmdOrCtrl+V" }
        ]
    },
    {
        label: 'View',
        submenu: [
            { role: 'reload', label: 'Reload' },
            { role: 'forcereload', label: 'Force Reload' },
            { role: 'toggledevtools', label: 'Toggle Developer Tools' },
            { type: 'separator' },
            { role: 'resetzoom', label: 'Reset Zoom' },
            { role: 'zoomin', label: 'Zoom In' },
            { role: 'zoomout', label: 'Zoom Out' },
            { type: 'separator' },
            { role: 'togglefullscreen', label: 'Toggle Full Screen' }
        ]
    },
    {
        label: 'media',
        click: () => {
            if (!mediaWindow || mediaWindow.isDestroyed()) {
                createMediaWindow();
            }
        }
    },
    {
        label: 'chat',
        click: () => {
            if (!chatWindow || chatWindow.isDestroyed()) {
                createchatWindow();
            }
        }
    },
    ,
    {
        label: 'ScreenShear',
        click: () => {
            if (!shearWindow || shearWindow.isDestroyed()) {
                createshearWindow();
            }
        }
    },
   
    {
        label: 'animation',
        click: () => {
            if (!animationWindow || animationWindow.isDestroyed()) {
                createAnimationWindow();
            }
        }
    },
    {
        label: 'theme',
        click: () => {
            if (!themeWindow || themeWindow.isDestroyed()) {
                createthemenWindow();
            }
        }
    },
   
    {
        label: 'timer',
        click: () => {
            if (!timerWindow || timerWindow.isDestroyed()) {
                createtimerWindow();
            }
        }
    },



    
    {
        label: 'preview',
        click: () => {
            if (!previewWindow || previewWindow.isDestroyed()) {
                createPreviewWindow();
            }
        }
    },
    {
        label: 'connect',
        click: () => {
            createhotspotwindow();
        }
    } ,
    {
        label: 'update',
        click: () => {
            checkForUpdates();
        }
    },
    {
        label: 'Document',
        click: () => {
            if (!learnWindow || learnWindow.isDestroyed()) {
                creatlearnWindow();
            }
        }
    },
    {
        label: 'About',
        click: () => {
            shell.openExternal('https://modihelp.com');
        }
    },
];




const menu = Menu.buildFromTemplate(templateMenu);
Menu.setApplicationMenu(menu);

// Apply the custom CSS to the menu
Menu.getApplicationMenu().popupOptions = {
    callback: () => {
        const style = document.createElement('style');
        style.textContent = menuCss;
        document.head.append(style);
    }
};



const windowFunctions = {
    menu,
    createAnimationWindow,
    createshearWindow,
    createthemenWindow,
    createMediaWindow,
    createtimerWindow,
    createchatWindow,
    creatlearnWindow,
    createPreviewWindow
};

// Export the object
module.exports = windowFunctions;

