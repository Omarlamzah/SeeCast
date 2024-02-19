const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('apichat', {
    send: (channel, data) => {
        // Whitelist channels
        let validChannels = ['createQuestion', 'updateQuestion','removeQuestion', 'removeallQuestion', 'getquestion'];
        if (validChannels.includes(channel)) {
             ipcRenderer.send(channel, data);
        }
    },
    recive: (channel, listener) => {
        // Whitelist channels
        let validChannels = ['createQuestion-response','updateQuestion-response','getquestion-response'];
        if (validChannels.includes(channel)) {
            ipcRenderer.on(channel, (event, ...args) => listener(...args));
        }
    }
});


 