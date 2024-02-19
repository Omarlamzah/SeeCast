const Swal = require('sweetalert2');
const { app, autoUpdater } = require('electron-updater');
const { ipcMain } = require('electron');

autoUpdater.on('error', () => {
    Swal.fire({
        icon: 'error',
        title: 'Update Error',
        text: 'An error occurred while checking for updates.'
    });
});

autoUpdater.on('update-not-available', () => {
    Swal.fire({
        icon: 'info',
        title: 'No Updates Available',
        text: 'You are already using the latest version.'
    });
});

autoUpdater.on('update-available', (info) => {


    Swal.fire({
        icon: 'info',
        title: 'Update Available',
        html: `A new update (v${info.version}) is available. Do you want to update?`,
        showCancelButton: true,
        confirmButtonText: 'Yes, update now',
        cancelButtonText: 'No, remind me later'
    }).then((result) => {
        if (result.isConfirmed) {
            autoUpdater.downloadUpdate();
        }
    });
});

autoUpdater.on('update-downloaded', () => {
    Swal.fire({
        icon: 'success',
        title: 'Update Downloaded',
        text: 'The update has been downloaded and will be installed on next launch.'
    });
});

function checkForUpdates() {
    autoUpdater.checkForUpdates();
}

module.exports.checkForUpdates = checkForUpdates;
