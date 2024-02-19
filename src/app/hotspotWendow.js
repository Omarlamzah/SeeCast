const { BrowserWindow } = require('electron');
const path = require("path");

// Function to create and display the About window
function createhotspotwindow() {
    let hotspotwindow = new BrowserWindow({
        width: 500,
        height: 600,
        resizable: false,
        title: 'About',
        webPreferences: {
            nodeIntegration: true,
            // contextIsolation: false,
            preload: path.join(__dirname, './hotspot/preload.js')
        }
    });
   //  hotspotwindow.webContents.openDevTools();

   hotspotwindow.setMenu(null);
    // Load the about.html file
    hotspotwindow.loadFile(path.join(__dirname, './hotspot/index.html'));

    // Garbage collection
    hotspotwindow.on('closed', () => {
        hotspotwindow = null;
    });
}

module.exports = createhotspotwindow;
