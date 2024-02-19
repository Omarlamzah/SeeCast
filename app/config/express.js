const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const http = require('http');
const fs = require('fs');
const app_config = require("./app.config");
const { app } = require('electron');
const { getQuestions } = require('../controller/chatController');


// Create Express app
const expressApp = express();
const expressServer = http.createServer(expressApp);
const io = require('socket.io')(expressServer);

// Set up view engine and views directory
expressApp.set('view engine', 'ejs');
expressApp.set('views', path.join(__dirname, '../../src/views'));

// Middleware
expressApp.use(fileUpload());
expressApp.use(express.static(path.join(__dirname, './../../src/public')));
//expressApp.use('/uploads', express.static(path.join(__dirname, './../../src/public/uploads')));


// Define upload directory
//const uploadDirectory = path.join(__dirname, './../../src/public/uploads');
const userDataPath = app.getPath('userData');
const uploadDirectory = path.join(userDataPath, 'uploads');

if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
}

expressApp.use('/uploads', express.static(uploadDirectory));

// Upload route
expressApp.post('/upload', (req, res) => {
 

    if (!req.files || !req.files.img) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const { img } = req.files;
    const fileName = img.name;
    const filePath = path.join(uploadDirectory, fileName);

    img.mv(filePath, (err) => {
        if (err) {
            console.error('Error uploading file:', err);
            return res.status(500).json({ error: 'File upload failed',details: err });
        }

        console.log('File uploaded successfully:', fileName);
        res.json({ message: 'Upload successful', img: fileName, path: filePath });
    });
});
// Get images route
expressApp.get('/getImages', (req, res) => {
    fs.readdir(uploadDirectory, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.json(files);
    });
});

// Remove all images route
expressApp.delete('/removeimages', (req, res) => {
 
    try {
        const files = fs.readdirSync(uploadDirectory);
        files.forEach(file => {
            fs.unlinkSync(path.join(uploadDirectory, file));
            console.log(`Deleted file: ${file}`);
        });
        res.sendStatus(200);
    } catch (err) {
        console.error('Error deleting files:', err);
        res.status(500).send('Internal Server Error');
    }
});
  

expressApp.get('/', (req, res) => {
  
  res.render('main');
});

expressApp.get('/animation', (req, res) => {
  
    res.render('animation');
  });

  expressApp.get('/theme', (req, res) => {
  
    res.render('theme');
  });

  expressApp.get('/timeradmin', (req, res) => {
  
    res.render('timer');
  });
  
  expressApp.get('/media', (req, res) => {
  
    res.render('media');
  });

  expressApp.get('/preview', (req, res) => {
  
    res.render('preview');
  });

expressApp.get('/timer', (req, res) => {
  return res.sendFile(path.join(__dirname, './../../src/pages/timedown.html'));
});

expressApp.get('/adding', (req, res) => {
 
  res.render('main');
});

expressApp.get('/chat', async (req, res) => {
 const questions = await getQuestions()
 console.log(questions)
  res.render('./chat/clientchat',{questions});

});


expressApp.get('/serverchat', (req, res) => {

  res.render('./chat/serverchat');

});


expressApp.get('/screenview', (req, res) => {

  res.render('./shearscreen/screen',{url:app_config.host+":"+app_config.port+"/screen"});

});

expressApp.get('/screen', (req, res) => {

  res.render('./shearscreen/screenview');

});


expressApp.get('/learn', (req, res) => {

  return res.sendFile(path.join(__dirname, './../../src/learn/index.html'));

});

expressApp.get('/:p', (req, res) => {
  const ind = req.params.p;
  return res.sendFile(path.join(__dirname, './../../src/pages/page (' + ind + ').html'));
});

expressApp.post('/', (req, res) => {
  console.log(req.body);
  return res.sendFile(path.join(__dirname, '/views/main.html'));
});
// Initialize socket.io
var taindex = 0;

io.on('connection', function (socket) {
  // Increment tablet count when a new connection is established
  taindex += 1;
  console.log('tablet ' + taindex + ' connected');

  // Emit updated tablet count to all sockets
  io.sockets.emit('tabletCountplus', taindex);

  // Listen for events from the tablet
  socket.on('setanimation', function (anim) {
    io.sockets.emit('changeanim', anim);
    console.log(anim);
  });

  socket.on('bgcahne', function (respo) {
    var tai = respo.length;
    if (tai === 1) {
      io.sockets.emit('chtabtout', respo[0]);
      console.log(respo[0]);
    }
    if (tai === 2) {
      io.sockets.emit('ctabletnumb', [respo[0], respo[1]]);
      console.log(respo);
    }
  });

  socket.on('lesnom', (dataa) => {
    console.log(dataa);
    io.sockets.emit('datatopage', dataa);
  });

  socket.on('texttotablet', (dataretate) => {
    console.log(dataretate);
    io.sockets.emit('datartxt', dataretate);
  });

  socket.on('fullscrenn', (dataretate) => {
    console.log('fullscren');
    io.sockets.emit('fullscrenn');
  });

  socket.on('fontsize', (fontsize) => {
    console.log(fontsize);
    io.sockets.emit('fontsize', fontsize);
  });

  socket.on('lesmodirateur', (lesmodirateur) => {
    console.log(lesmodirateur);
    io.sockets.emit('lesmodirateur', lesmodirateur);
  });

  socket.on('positionmoneteur', (positionmoneteur) => {
    console.log(positionmoneteur);
    io.sockets.emit('positionmoneteur', positionmoneteur);
  });

  socket.on('setcolor', (setclr) => {
    io.sockets.emit('setcolor', setclr);
    console.log(setclr);
  });

  socket.on('setbgcolor', (setcolorbg) => {
    io.sockets.emit('setbgcolor', setcolorbg);
    console.log(setcolorbg);

  });


 // Handle incoming stream
 socket.on('stream', (streamUrl) => {
  console.log('Received stream:', streamUrl);
  // Broadcast the stream to all connected clients
  io.emit('stream', streamUrl);
});


// for chating

socket.on('sendmsg', ({txt ,from}) => {
  io.emit('recivemsg' , {txt,from} );

})


//









socket.on('stopstream',()=>{
   io.emit('stopstream');
});



// for stream
socket.on('getsource', () => {
  // Code to retrieve video sources and emit back to the client
  // Replace this with your implementation
  const sources = []; // Dummy sources for demonstration
  socket.emit('getsource-response', sources);
});

socket.on('offer', offer => {
  socket.broadcast.emit('offer', offer);
});

socket.on('answer', answer => {
  socket.broadcast.emit('answer', answer);
});

socket.on('ice-candidate', candidate => {
  socket.broadcast.emit('ice-candidate', candidate);
});
// end for stream










  // Decrease tablet count when a connection is lost
  socket.on('disconnect', function () {
    taindex -= 1;
    console.log('tablet disconnected');
    // Emit updated tablet count to all sockets
    io.sockets.emit('tabletCount', taindex);
  });
});
 
  expressServer.listen(app_config.port);

 
  exports.expressApp=expressApp
 

