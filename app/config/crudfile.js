const path = require('path');
const fs = require('fs');
const { app } = require('electron');

// Handle file paths correctly
const userDataPath = app.getPath('userData');
//const userDataPath = path.resolve(__dirname, './../../src/public');

const uploadDirectory = path.join(userDataPath, 'uploads');

// Ensure that the upload directory exists
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Upload function
function handleUpload(event, {fileName,fileData}) {
    const filePath = path.join(uploadDirectory, fileName);

    fs.writeFile(filePath, fileData, (err) => {
        if (err) {
            console.error('Error uploading file:', err);
            event.reply('upload-response', { error: 'File upload failed', details: err });
        } else {
            console.log('File uploaded successfully:', fileName);
            event.reply('upload-response', { message: 'Upload successful', img: fileName, path: filePath });
        }
    });
}

// Remove all images function
function handleRemoveImages(event) {
    try {
        const files = fs.readdirSync(uploadDirectory);
        files.forEach(file => {
            fs.unlinkSync(path.join(uploadDirectory, file));
            console.log(`Deleted file: ${file}`);
        });
        event.reply('removeimages-response', { status: 200 });
    } catch (err) {
        console.error('Error deleting files:', err);
        event.reply('removeimages-response', { error: 'Internal Server Error' });
    }
}

// Get all images function
function handleGetImages(event) {
    try {
        const files = fs.readdirSync(uploadDirectory);
        event.reply('getimages-response', { status: 200, files });
    } catch (err) {
        console.error('Error getting images:', err);
        event.reply('getimages-response', { error: 'Internal Server Error' });
    }
}

// Export functions
module.exports = {
    handleUpload,
    handleRemoveImages,
    handleGetImages
};