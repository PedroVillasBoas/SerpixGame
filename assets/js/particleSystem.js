/* 
  particleSystem.js
  Represents the particle manager in the game.
  Manages the particles' positions, velocities, and rendering.
*/

class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  // Creating a burst of particles
  emit(x, y, color, count = 20, speed = 3, size = 5) {
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(x, y, color, speed, size));
    }
  }

  update() {
    // Looping backwards to safely remove items while iterating
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update();
      if (this.particles[i].isFinished()) {
        this.particles.splice(i, 1);
      }
    }
  }

  draw(ctx) {
    this.particles.forEach((p) => p.draw(ctx));
  }
}
