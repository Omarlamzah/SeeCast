
//import 'toastr/build/toastr.min.css';  
//import toastr from  "toastr"; // Example usage of receive function
api.receive('upload-response', ({ message, img, path }) => {
    if (message) {
    alert("success uploaded")
    } else {
        // Handle error case
        console.log(message);
    }
});



// Example usage of receive function
api.receive('removeimages-response', ({status}) => {
    if (status) {
      alert("success reomvoed")
    } else {
        // Handle error case
        console.error(status);
    }
}); 


// Example usage of receive function
api.receive('getimages-response', ( { status, files }) => {
    if (status) {
       console.log( { status, files })
       renderfileinsection(files)
      } else {
        // Handle error case
        console.error( { status , files });
    }
}); 




document.getElementById('displayBtn').addEventListener('click', async () => {
    api.send('getimages');  

  });

  function handelUploaddfile() {
    const fileInput = document.getElementById("url");
    const fileName = fileInput.files[0].name; // Get the file name
    const fileData = fileInput.files[0]; // Get the file data
    const progressBar = document.getElementById("progressBar");
    const progressDiv = document.querySelector('.progress');

    // Display progress bar
    progressDiv.style.display = 'flex';
    progressBar.style.width = '0%';

    // Read the file data as a Uint8Array
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const fileBytes = new Uint8Array(event.target.result);

        // Create an object containing fileName and fileData (as Uint8Array)
        const data = { fileName, fileData: fileBytes };
        console.log(data);

        // Send data to the main process
        api.send('upload', data);  
    };

    fileReader.onprogress = function(event) {
        if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            progressBar.style.width = percentComplete + '%';
        }
    };

    fileReader.onloadend = function() {
        // Hide progress bar after file upload is complete
        progressDiv.style.display = 'none';
    };

    fileReader.readAsArrayBuffer(fileData);
}







  // functions 
   // diplay images in sections 


   function renderfileinsection(files){
    
    try {
      const imageSection = document.getElementById('imageSection');
      const videoSection = document.getElementById('videoSection');
  
      // Clear previous content
      imageSection.innerHTML = '';
      videoSection.innerHTML = '';
  
      files.forEach(file => {
        const divElement = document.createElement('div');
        const spanElement = document.createElement('span');
        spanElement.innerHTML = file;
  
        if (file.endsWith('.mp4') || file.endsWith('.avi') || file.endsWith('.mov')) {
          const videoElement = document.createElement('video');
          videoElement.src = `/uploads/${file}`;
          videoElement.controls = true;
          videoElement.loop=true;
           videoElement.muted=false
  
          videoElement.addEventListener('click', () => {
            document.getElementById('imgname').value = file;
          });
  
          divElement.appendChild(videoElement);
          videoSection.appendChild(divElement);
        } else if (file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.jpeg')) {
          const imgElement = document.createElement('img');
          imgElement.src = `/uploads/${file}`;
  
          imgElement.addEventListener('click', () => {
            document.getElementById('imgname').value = file;
          });
  
          divElement.appendChild(imgElement);
          imageSection.appendChild(divElement);
        }
  
        divElement.appendChild(spanElement);
      });
    } catch (error) {
      console.error('Error fetching images:', error);
    }
   }





















   

 
  