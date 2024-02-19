const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('api', {
    send: (channel, data) => {
        // Whitelist channels
        let validChannels = ['upload', 'removeimages',  'getimages'];
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
    receive: (channel, listener) => {
        // Whitelist channels
        let validChannels = ['upload-response','removeimages-response','getimages-response'];
        if (validChannels.includes(channel)) {
            ipcRenderer.on(channel, (event, ...args) => listener(...args));
        }
    }
});


console.log("preload here")
