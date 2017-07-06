// Get our Elements
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');  // Data skip attribute
const ranges = player.querySelectorAll('.player__slider');
const fsButton = player.querySelector('.fullscreen');
const viewer = document.querySelector('.player__video')
// Build out functions
function togglePlay() {
    if(video.paused){
        video.play()
    } else {
        video.pause();
    }
};

function updateButton() {
    const icon = this.paused ? '►' : '❚ ❚';
    toggle.textContent = icon;
}

function skip(){
    console.log(this.dataset.skip);
    video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeUpdate() {
    //console.log(this.value);
    //console.log(this.name)

    video[this.name] = this.value     // Gonna be volume or playbackRate
}

function handleProgress() {
    const percent = (video.currentTime / video.duration) * 100;
    progressBar.style.flexBasis = `${percent}%`
}

function scrub(e) {
    const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
    video.currentTime = scrubTime;
}

function handleFullScreen() {
    console.dir(player)
    
    if(!fullscreen) 
        {
            player.webkitRequestFullScreen();
            fullscreen=!fullscreen
        } else {
           
            fullscreen=!fullscreen
        }
}

function goFullScreen() {

console.log('received')
player.classList.toggle('fullscreen');
}

// Hook up the event listeners
video.addEventListener('click', togglePlay);
toggle.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);
fsButton.addEventListener('click', goFullScreen);

skipButtons.forEach(button => button.addEventListener('click', skip));
ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate));

// Here we use a flag variable just like in the canvas to know when the mouseclick is released
let mousedown = false;
let fullscreen = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
progress.addEventListener('mousedown', () => mousedown = true)
progress.addEventListener('mouseup', () => mousedown = false)