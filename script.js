document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('audio');
    const playButton = document.querySelector('.play');
    const currentTimeElement = document.querySelector('.current-time');
    const durationElement = document.querySelector('.duration');
    const progressBar = document.querySelector('.progress');
    const progressBarFilled = document.querySelector('.progress-filled');

    let isDragging = false;

    audio.addEventListener('loadedmetadata', () => {
        durationElement.textContent = formatTime(audio.duration);
    });

    playButton.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            playButton.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            audio.pause();
            playButton.innerHTML = '<i class="fas fa-play"></i>';
        }
    });

    audio.addEventListener('timeupdate', () => {
        const currentTime = audio.currentTime;
        const duration = audio.duration;
        currentTimeElement.textContent = formatTime(currentTime);
        durationElement.textContent = formatTime(duration);
        progressBarFilled.style.width = `${(currentTime / duration) * 100}%`;
    });

    function formatTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    }

    progressBar.addEventListener('mousedown', (event) => {
        isDragging = true;
        updateProgress(event);
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            updateProgress(event);
        }
    });

    document.addEventListener('mousemove', (event) => {
        if (isDragging) {
            updateProgress(event);
        }
    });

    function updateProgress(event) {
        const progressBarRect = progressBar.getBoundingClientRect();
        const progressBarWidth = progressBarRect.width;
        const clickX = event.clientX - progressBarRect.left;
        const duration = audio.duration;

        let newProgress = (clickX / progressBarWidth) * 100;
        newProgress = Math.min(100, Math.max(0, newProgress));

        progressBarFilled.style.transition = 'none';
        progressBarFilled.style.width = `${newProgress}%`;

        const newTime = (newProgress / 100) * duration;
        audio.currentTime = newTime;
    }

    currentTimeElement.addEventListener('click', () => {
        const currentTime = parseFloat(currentTimeElement.textContent);
        audio.currentTime = currentTime;
        progressBarFilled.style.width = `${(currentTime / audio.duration) * 100}%`;
    });

    durationElement.addEventListener('click', () => {
        audio.currentTime = audio.duration;
        progressBarFilled.style.width = '100%';
    });
});
