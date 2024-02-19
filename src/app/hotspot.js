const { exec } = require('child_process');
const sudo = require('sudo-prompt');
const { dialog } = require('electron');
const os = require('os');


// Function to configure the hosted network
function configureHostedNetwork(ssid, password, event) {
    const configureCommand = 'netsh';
    const configureArgs = ['wlan', 'set', 'hostednetwork', 'mode=allow', `ssid=${ssid}`, `key=${password}`];

    sudo.exec(`${configureCommand} ${configureArgs.join(' ')}`, { name: 'Your Application Name' }, (error) => {
        if (error) {
            console.error(`Error configuring hotspot: ${error}`);
            dialog.showErrorBox('Hotspot Configuration Error', `Error configuring hotspot: ${error}`);
            event.reply('hotspot-status', { success: false, message: error });
        } else {
            console.log('Hotspot configured successfully');
            startHotspotWithPrivileges(event);
        }
    });
}

// Function to start the hotspot after configuration
function startHotspotWithPrivileges(event) {
    const startCommand = 'netsh';
    const startArgs = ['wlan', 'start', 'hostednetwork'];

    sudo.exec(`${startCommand} ${startArgs.join(' ')}`, { name: 'Your Application Name' }, (error) => {
        if (error) {
            console.error(`Error starting hotspot: ${error}`);
            dialog.showErrorBox('Hotspot Start Error', `Error starting hotspot: ${error}`);
            event.reply('hotspot-status', { success: false, message: error });
        } else {
            console.log('Hotspot started successfully');
            getHotspotInfo(event);
        }
    });
}

// Function to stop the hotspot
function stopHotspot(event) {
    const stopCommand = 'netsh';
    const stopArgs = ['wlan', 'stop', 'hostednetwork'];

    sudo.exec(`${stopCommand} ${stopArgs.join(' ')}`, { name: 'Your Application Name' }, (error) => {
        if (error) {
            console.error(`Error stopping hotspot: ${error}`);
            dialog.showErrorBox('Hotspot Stop Error', `Error stopping hotspot: ${error}`);
            event.reply('hotspot-status', { success: false, message: error });
        } else {
            console.log('Hotspot stopped successfully');
            dialog.showMessageBox({ type: 'info', title: 'Hotspot Stopped', message: 'Hotspot stopped successfully.' });
            event.reply('hotspot-status', { success: true, message: 'Hotspot stopped successfully.' });
        }
    });
}

// Function to retrieve hotspot information
function getHotspotInfo(event) {
    exec('netsh wlan show hostednetwork', (error) => {
        if (error) {
            console.error(`Error retrieving hotspot info: ${error}`);
            dialog.showErrorBox('Hotspot Info Error', `Error retrieving hotspot info: ${error}`);

            event.reply('hotspot-status', { success: false, message: error });
        } else {
            const ipAddress =getHostname();
             event.reply('hotspot-status', { success: true, message: 'Hotspot started successfully.',  ipAddress });
        }
    });
}




// Function to get hostname
function getHostname() {
    const interfaces = os.networkInterfaces();
     
    const addresses = [];
    Object.keys(interfaces).forEach((iface) => {
      interfaces[iface].forEach((ifc) => {
        console.log(JSON.stringify(iface)+"ss")
        if (ifc.family === 'IPv4' && !ifc.internal) {
          addresses.push(ifc.address + ':8080');
        }
      });
    });
    return addresses;
  }
 
















  
// Function to retrieve all Wi-Fi profiles along with their passwords
function getAllWifiPasswords(event) {
    exec('netsh wlan show profiles', (error, stdout) => {
        if (error) {
            console.error(`Error retrieving Wi-Fi profiles: ${error}`);
            dialog.showErrorBox('Wi-Fi Profiles Error', `Error retrieving Wi-Fi profiles: ${error}`);
            event.reply('wifi-passwords', { success: false, message: error });
        } else {
            const profiles = parseWifiProfiles(stdout);
            const passwordsPromises = profiles.map(profile => {
                return new Promise((resolve) => {
                    getWifiProfilePassword(profile.ssid, (password) => {
                        resolve({ ssid: profile.ssid, password });
                    });
                });
            });
            Promise.all(passwordsPromises)
                .then(results => {
                    console.log(results)
                    event.reply('wifi-passwords', { success: true, results });
                })
                .catch(err => {
                    console.error(`Error retrieving Wi-Fi passwords: ${err}`);
                    dialog.showErrorBox('Wi-Fi Passwords Error', `Error retrieving Wi-Fi passwords: ${err}`);
                    event.reply('wifi-passwords', { success: false, message: err });
                });
        }
    });
}

// Function to parse Wi-Fi profiles from the output of 'netsh wlan show profiles'
function parseWifiProfiles(output) {
    const profiles = output.split('\n').map(line => line.trim()).filter(line => line.startsWith('All User Profile'));
    return profiles.map(profile => {
        const ssid = profile.split(':')[1].trim();
        return { ssid };
    });
}

// Function to retrieve password for a specific Wi-Fi profile
function getWifiProfilePassword(ssid, callback) {
    exec(`netsh wlan show profile "${ssid}" key=clear`, (error, stdout) => {
        if (!error) {
            const password = parseWifiProfilePassword(stdout);
            callback(password);
        } else {
            console.error(`Error retrieving password for Wi-Fi profile ${ssid}: ${error}`);
            callback('Error retrieving password');
        }
    });
}

// Function to parse Wi-Fi profile password from the output of 'netsh wlan show profile <SSID> key=clear'
function parseWifiProfilePassword(output) {
    const lines = output.split('\n').map(line => line.trim());
    const keyIndex = lines.findIndex(line => line.includes('Key Content'));
    if (keyIndex !== -1) {
        return lines[keyIndex].split(':')[1].trim();
    }
    return 'Password not found';
}


// Export individual functions
module.exports = {  configureHostedNetwork,
    startHotspotWithPrivileges,
    stopHotspot,
    getHotspotInfo, 


    getAllWifiPasswords };

 