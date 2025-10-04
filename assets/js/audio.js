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
        this.sounds.eat = new Audio('assets/sfx/eat.wav');
        this.sounds.collide = new Audio('assets/sfx/collide.wav');
        
        // Preload BG Music
        this.music = new Audio('assets/sfx/background_music.mp3');
        this.music.loop = true;
        this.music.volume = 1.0;
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