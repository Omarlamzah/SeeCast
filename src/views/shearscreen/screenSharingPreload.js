const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('apishear', {
    send: (channel,data) => {
        console.log("send to get sources")
        let validChannels = ['getsource',"startshearing"];
        if (validChannels.includes(channel,data)) {
            ipcRenderer.send(channel);
        }
    },
    recive: (channel, listener) => {
        // Whitelist channels
        let validChannels = ['getsource-response' , 'startshearing-response'];
        console.log("getsource to get response")

        if (validChannels.includes(channel)) {
            ipcRenderer.on(channel, (event, ...args) => listener(...args));
        }
    }
});
