console.log("here preload main")

const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('apiwindow', {
    send: (channel, data) => {
        // Whitelist channels
        let validChannels = ['open-window','make_update'];
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
    receive: (channel, listener) => {
        // Whitelist channels
        let validChannels = ['window-opened' ,"update_is_available"];
        if (validChannels.includes(channel)) {
            ipcRenderer.on(channel, (event, ...args) => listener(...args));
        }
    }
});
