// Example usage of receive function

const loader= document.getElementById("loader");
api.receive('hotspot-status', ({ success, message, ipAddress }) => {
    if (success) {
        loader.style.display="none"

        alert("here  satatat us")
        console.log(ipAddress + "ipAddress");
        // Display the IP address and hostname in the div
        renderIPAddresses(ipAddress);
        // Update the number of IP addresses found
        document.getElementById('numIPAddresses').textContent = 'Number of IP Addresses Found: ' + ipAddress.length;
    } else {
        // Handle error case
        console.error(message);
        loader.style.display="none"

    }
});



//wifi-passwords
// Example usage of receive function
api.receive('wifi-passwords', ({  success, results }) => {
    if (success) {
        console.log(results + "results");
        // Display the IP address and hostname in the div
        renderwifi(results);
        loader.style.display="none"

      } else {
        // Handle error case
        console.error(message);
        loader.style.display="none"

    }
});
// Other DOM element selections and event listeners can go here
const startHotspotButton = document.getElementById('startHotspotButton');
const stopHotspotButton = document.getElementById('stopHotspotButton');
const getHotspotInfoButton = document.getElementById('getHotspotInfoButton');
const configureHostedNetworkButton = document.getElementById('configureHostedNetworkButton');
const wifiButon = document.getElementById('wifiButon');

const ipDisplay = document.getElementById('ip_display');
const wifi_diplay = document.getElementById('wifi_diplay');



startHotspotButton.addEventListener('click', () => {
    const ssid = document.getElementById('ssid').value;
    const password = document.getElementById('password').value;

    api.send('configure-hostednetwork', { ssid, password });
    loader.style.display="flex"

});

stopHotspotButton.addEventListener('click', () => {
    api.send('stop-hotspot');
    loader.style.display="flex"

});

getHotspotInfoButton.addEventListener('click', () => {
    api.send('get-hotspot-info');
    loader.style.display="flex"

});




wifiButon.addEventListener('click', () => {
     api.send('get-all-wifi');
     loader.style.display="flex"

});


configureHostedNetworkButton.addEventListener('click', () => {
    const ssid = document.getElementById('ssid').value;
    const password = document.getElementById('password').value;
    loader.style.display="flex"

    api.send('configure-hostednetwork', { ssid, password });
});

function renderIPAddresses(ipAddresses) {
    // Clear the existing content of ip_display div
    ipDisplay.innerHTML = '';

    // Create a ul element to hold the list of IP addresses
    const ipList = document.createElement('ul');

    // Loop through the addresses and create list items for each address
    ipAddresses.forEach(address => {
        const listItem = document.createElement('h3');
        listItem.textContent = address;
        ipList.appendChild(listItem);
    });

    // Append the ul element to the ip_display div
    ipDisplay.appendChild(ipList);
}
function renderwifi(results) {
    console.log(results);

    // Clear the existing content in wifi_diplay
    wifi_diplay.innerHTML = '';

    // Create a new table element to hold the Wi-Fi information
    const wifiTable = document.createElement('table');

    // Create a table header row
    const headerRow = wifiTable.insertRow();
    const ssidHeader = headerRow.insertCell();
    ssidHeader.textContent = 'SSID';
    const passwordHeader = headerRow.insertCell();
    passwordHeader.textContent = 'Password';

    // Iterate over each result object and create rows in the table to display SSID and password
    results.forEach(result => {
        // Create a new row in the table
        const row = wifiTable.insertRow();

        // Create cells to display SSID and password
        const ssidCell = row.insertCell();
        ssidCell.textContent = result.ssid;

        const passwordCell = row.insertCell();
        passwordCell.textContent = result.password;
    });

    // Append the table to wifi_diplay
    wifi_diplay.appendChild(wifiTable);
}



 





