const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('api', {
    send: (channel, data) => {
        // Whitelist channels
        let validChannels = ['configure-hostednetwork', 'stop-hotspot', 'get-hotspot-info','get-all-wifi'];
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
    receive: (channel, listener) => {
        // Whitelist channels
        let validChannels = ['hotspot-status','wifi-passwords'];
        if (validChannels.includes(channel)) {
            ipcRenderer.on(channel, (event, ...args) => listener(...args));
        }
    }
});


 