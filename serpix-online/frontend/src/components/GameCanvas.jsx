import React, { useRef, useEffect, useMemo } from "react";
import { ParticleSystem } from "./ParticleSystem";

export default function GameCanvas({ latestGameState, particleEvents }) {
  const canvasRef = useRef(null);
  const particleSystem = useMemo(() => new ParticleSystem(), []);

  // This ref will hold the latest state to be used in the animation loop
  const stateRef = useRef(latestGameState);

  useEffect(() => {
    stateRef.current = latestGameState;
  }, [latestGameState]);

  // Handling particle events
  useEffect(() => {
    if (particleEvents) {
      const { type, payload } = particleEvents;
      if (type === "ballEat") {
        particleSystem.emit(payload.x, payload.y, "#FFD700", 30, 4, 6);
      } else if (type === "playerHit") {
        particleSystem.emit(payload.x, payload.y, "red", 50, 5, 5);
      }
    }
  }, [particleEvents, particleSystem]); // particleEvents is a trigger!!

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const drawPlayer = (player) => {
      // Snake flashes if it's invincible
      if (player.invincible) {
        ctx.globalAlpha = Math.floor(Date.now() / 100) % 2 === 0 ? 0.5 : 1;
      }

      // Draws Body segments
      ctx.fillStyle = player.color;
      const segmentInterval = 5;
      for (let i = 0; i < player.body.length; i += segmentInterval) {
        const pos = player.body[i];
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, player.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draws Head
      ctx.fillStyle = `hsl(${player.color === "blue" ? 240 : 0}, 100%, 70%)`;
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.radius + 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = 1.0;
    };

    const drawBall = (ball) => {
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = "#FFD700";
      ctx.fill();
      ctx.closePath();
    };

    const render = () => {
      // Clearing canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Getting the latest state from the ref
      const state = stateRef.current;

      // Drawing all players
      if (state.players) {
        state.players.forEach(drawPlayer);
      }

      // Drawing the ball
      if (state.ball) {
        drawBall(state.ball);
      }

      // Updating and drawing particles
      particleSystem.update();
      particleSystem.draw(ctx);

      // Loop
      animationFrameId = window.requestAnimationFrame(render);
    };

    render(); // Starting the loop

    return () => {
      window.cancelAnimationFrame(animationFrameId); // Cleaning up
    };
  }, [particleSystem]); // Re-running effect if particle system changes

  return (
    <canvas
      ref={canvasRef}
      width={900}
      height={450}
      className="bg-black border-2 border-green-500"
    />
  );
}
