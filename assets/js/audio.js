/*
  audio.js
  Handles audio playback for the game.
  Manages sound effects and background music.
*/

class AudioManager {
    constructor() {
        this.sounds = {};
        this.music = null;
    }

    loadSounds() {
        // Preload SFX
        this.sounds.collide = new Audio('assets/audio/collide.wav');
        this.sounds.eat = new Audio('assets/audio/eat.wav');
        this.sounds.win = new Audio('assets/audio/yay.wav');

        // Preload BG Music
        this.music = new Audio('assets/audio/background_music.mp3');
        this.music.loop = true;
        this.music.volume = 0.5;
    }

    playSound(name) {
        if (this.sounds[name]) {
            this.sounds[name].currentTime = 0; // Rewind to start
            this.sounds[name].play();
        }
    }

    startMusic() {
        if (this.music) {
            this.music.play().catch(e => console.error("Audio autoplay was blocked.", e));
        }
    }

    stopMusic() {
        if (this.music) {
            this.music.pause();
            this.music.currentTime = 0;
        }
    }
}