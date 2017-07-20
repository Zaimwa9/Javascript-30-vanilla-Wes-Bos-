const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
    // This return a promise
    navigator.mediaDevices.getUserMedia({video: true, audio: false})    // this is how you get someone's video
    .then(localMediaStream => {
        video.src = window.URL.createObjectURL(localMediaStream) // Transforms it into a readable video URL
        video.play()
    })
    .catch(err => {
        console.error('Oh no !!', err)
    })
}  

function paintToCanvas(){
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
     canvas.height = height;

    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);
        let pixels = ctx.getImageData(0,0, width, height); // HUUUUUGE Array of data about each pixel. Looping the pattern RGB alpha, RGB alpha etc...
        // mess with the pixels
        pixels = redEffect(pixels);
        //pixels = rgbSplit(pixels);

        // put them back
        ctx.putImageData(pixels, 0, 0)
    }, 16);
}

function takePhoto() {
    // plays the sound
    snap.currentTime = 0;
    snap.play();

    // take the data out of the canvas
    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'handsome');
    link.textContent = "Download Image";
    link.innerHTML = `<img src="${data}" alt="Handsome Man" />`;
    strip.insertBefore(link, strip.firsChild);
}


function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      // take it out!
      pixels.data[i + 3] = 0; // This is the alpha, putting it to 0 removes it from the computer
    }
  }
}

function redEffect(pixels) {
    for(let i = 0; i < pixels.data.length; i+=4){
        pixels.data[i + 0] = pixels.data[i + 0] + 100  // R
        pixels.data[i + 1] = pixels.data[i + 1] - 50 // G
        pixels.data[i + 2] = pixels.data[i + 2] * 0.5 // B
       //  pixels[i + 3] alpha
    }
    return pixels;
}

function rgbSplit(pixels) {  // This messes with the pixels by replacing the RGB values of one by his +xxx neighbor
    for(let i = 0; i < pixels.data.length; i+=4){
        pixels.data[i - 150] = pixels.data[i + 0] + 100  // R
        pixels.data[i + 100] = pixels.data[i + 1] - 50 // G
        pixels.data[i - 150] = pixels.data[i + 2] * 0.5 // B
       //  pixels[i + 3] alpha
    }
    return pixels;    
}


getVideo();

video.addEventListener('canplay', paintToCanvas);