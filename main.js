require('./app/routes/route');
const electron = require("electron");
const app_config = require('./app/config/app.config');
const path = require("path");
const { setupTitlebar } =require("custom-electron-titlebar/main");
const Store = require('electron-store');
 const store= new Store()
 setupTitlebar()
const app = electron.app;


const desktopCapturer=electron.desktopCapturer
const Menu = electron.Menu;

 const ipcMain=electron.ipcMain

const MenuItem = electron.MenuItem;
const Tray = electron.Tray;


  
const { getHotspotInfo ,configureHostedNetwork,startHotspotWithPrivileges ,stopHotspot ,getAllWifiPasswords} = require('./src/app/hotspot');
const { handleUpload ,handleGetImages,handleRemoveImages} = require('./app/config/crudfile');
const { menu  ,createAnimationWindow,createMediaWindow,createPreviewWindow,createchatWindow,createshearWindow,createthemenWindow,createtimerWindow,creatlearnWindow } = require('./src/app/menu');
const { checkForUpdates } = require('./app/config/autoupdater');
const { db } = require('./app/config/conectdb');
const { createQuestion, updateQuestion, removeQuestion, getQuestions, removeallQuestion } = require('./app/controller/chatController');
const createhotspotwindow = require('./src/app/hotspotWendow');
const { autoUpdater } = require('electron-updater');
   Menu.setApplicationMenu(menu);



 const { default: Swal } = require('sweetalert2');
  

// initialize ejs parser

 const BrowserWindow = electron.BrowserWindow;
 
let mainWindow;
 const iconpath = path.join(__dirname, './icon/icon.ico')



 
app.on("ready", () => {
    createWindow();
   
});
 
 app.on("window-all-closed", function () {
    
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", function () {
   
    if (mainWindow === null) {
        createWindow();
    }
});


let createWindow = function () {
    // Create the browser window.
    const windowsize = app_config.window_size
        
    mainWindow = new BrowserWindow({
    width: 800, height: 500 ,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js') // Path to your preload script
  }

   }
        
        );
      console.log(store.get("user"))  
    mainWindow.loadURL("http://" + app_config.host + ":" + app_config.port);
    mainWindow.focus();
    mainWindow.setMenu(null);


    // Open the DevTools.
      //mainWindow.webContents.openDevTools();
 

    let appIcon = configTray();
    
    mainWindow.on('close', function (event) {
        mainWindow = null;
       
    
    })
    mainWindow.on('minimize', function (event) {
        event.preventDefault()
        mainWindow.hide();
    })
    mainWindow.on('show', function () {
        // appIcon.setHighlightMode('always')  it make error 
    })
};

let configTray = function(){
    let appIcon = new Tray(iconpath);
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show App', click: function () {
                mainWindow.show();
            }
        },
        {
            label: 'Quit', click: function () {
                app.isQuiting = true;
                app.quit();

            }
        }
    ]);
    appIcon.setContextMenu(contextMenu);
    return appIcon;    
}





/// config hotspot 


// Configure hosted network
ipcMain.on('configure-hostednetwork', (event, { ssid, password }) => {
    configureHostedNetwork(ssid, password, event);
  });
  
  // Start the hotspot with privileges
  ipcMain.on('start-hotspot', (event) => {
    startHotspotWithPrivileges(event);
  });
  
  // Stop the hotspot
  ipcMain.on('stop-hotspot', (event) => {
    stopHotspot(event);
  });
  
  // Get hotspot information
  ipcMain.on('get-hotspot-info', (event) => {
    getHotspotInfo(event);
  });

  // Get hotspot information
  ipcMain.on('get-all-wifi', (event) => {
    getAllWifiPasswords(event);
  });











  
// Upload route using IPC communication
ipcMain.on('upload', (event, {fileName,fileData}) => {
     handleUpload(event, {fileName,fileData});
});

// Remove all images route using IPC communication
ipcMain.on('removeimages', (event) => {
    handleRemoveImages(event);
});

// Get all images route using IPC communication
ipcMain.on('getimages', (event) => {
    handleGetImages(event);
});






  
//  for add question chat
ipcMain.on('createQuestion', async (event, text) => {
   const result= createQuestion(text)
   console.log(result)
 });


ipcMain.on('updateQuestion', async(event, {id,text}) => {
    const result= updateQuestion(id, text)
    console.log(result)

 });
 ipcMain.on('removeQuestion',async (event, id) => {
    const result= removeQuestion(id)
    console.log(result)

 });

 ipcMain.on('removeallQuestion',async (event, id) => {
    const result= removeallQuestion()
    console.log(result)

 });

 
 
 ipcMain.on('getquestion',async (event) => {
    const result= await getQuestions()
    console.log("here result question")
    console.log(result)
    event.reply("getquestion-response",result)

 });
    
 
    

 


ipcMain.on('getsource', async (event) => {
  const sources = await desktopCapturer.getSources({ types: ['screen'] });
      event.reply('getsource-response', sources);
      console.log(sources)

   
      
});

/// for menu

ipcMain.on('open-window', async (event, windowName) => {
  switch (windowName) {
      case 'animation':
          createAnimationWindow();
          break;
      case 'media':
          createMediaWindow();
          break;
          case 'screenview':
            createshearWindow();
            break;
      case 'preview':
          createPreviewWindow();
          break;
      case 'chat':
          createchatWindow();
          break;
      case 'shear':
          createshearWindow();
          break;
      case 'theme':
          createthemenWindow();
          break;
      case 'timeradmin':
          createtimerWindow();
          break;
      case 'learn':
          creatlearnWindow();
          break;
          case 'connect':
            createhotspotwindow();
            break;

          

          case 'update':
          electron.dialog.showMessageBox(null, {
            type: 'info',
            title: 'Check for Updates',
            message: 'Available updates found!',
            buttons: ['OK']
        }).then((response) => {
            // If the user clicks OK (response.response === 0), check for updates
            if (response.response === 0) {
 
                autoUpdater.checkForUpdates();
            }
        }).catch((err) => {
 
            console.error(err);
        });
         //   mainWindow.webContents.send('update_is_available');

            // checkForUpdates();
        //  autoUpdater.checkForUpdates();
            break;
        case 'about':
            electron.shell.openExternal('https://modihelp.com');
            break;


       default:
          console.error('Unknown window name:', windowName);
  }
});



















autoUpdater.on('checking-for-update', () => {
    console.log('Checking for update...');
    
  electron.dialog.showMessageBox(null, {
    type: 'info',
    title: 'Checking for update...',
    message: 'Checking for update...!',
    buttons: ['OK']
})
  });
  
  autoUpdater.on('update-available', (info) => {
    console.log('Update available.');
    electron.dialog.showMessageBox(null, {
        type: 'info',
        title: 'Update available',
        message: 'Update available!',
        buttons: ['OK']
    })
  });
  
  autoUpdater.on('update-not-available', (info) => {
    console.log('Update not available.');
    electron.dialog.showMessageBox(null, {
        type: 'info',
        title: 'Update not available.',
        message: 'Update not available.!',
        buttons: ['OK']
    })
  });
  
  autoUpdater.on('error', (err) => {
    console.error('Error in auto-updater. ', err);
    electron.dialog.showMessageBox(null, {
        type: 'info',
        title: 'Error in auto-updater.',
        message: 'Error in auto-updater.!',
        buttons: ['OK']
    })
  });
  
  autoUpdater.on('download-progress', (progressObj) => {
    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
    console.log(log_message);
    electron.dialog.showMessageBox(null, {
        type: 'info',
        title: log_message,
        message: 'Error in auto-updater.!',
        buttons: ['OK']
    })
  });
  
  autoUpdater.on('update-downloaded', (info) => {
    console.log('Update downloaded; will install now');
    autoUpdater.quitAndInstall();
  });
  

