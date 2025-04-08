import React, { useEffect } from 'react';

const Fireworks = () => {
  useEffect(() => {
    const canvas = document.getElementById('fireworks');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];

    function random(min, max) {
      return Math.random() * (max - min) + min;
    }

    function createFirework(x, y) {
      const count = 100;
      const angleStep = (Math.PI * 2) / count;
      for (let i = 0; i < count; i++) {
        const angle = i * angleStep;
        const speed = random(2, 7);
        const color = `hsl(${Math.floor(random(0, 360))}, 100%, 70%)`;

        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          radius: random(1, 3),
          color
        });
      }
    }

    function updateParticles() {
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05; // gravity
        p.alpha -= 0.01;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
        }
      }
    }

    function drawParticles() {
      for (const p of particles) {
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    function loop() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      updateParticles();
      drawParticles();
      requestAnimationFrame(loop);
    }

    canvas.addEventListener('click', (e) => {
      createFirework(e.clientX, e.clientY);
    });

    // Launch fireworks periodically
    const intervalId = setInterval(() => {
      const x = random(100, canvas.width - 100);
      const y = random(100, canvas.height / 2);
      createFirework(x, y);
    }, 800);

    loop();

    // Cleanup function
    return () => {
      clearInterval(intervalId);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, []);

  return <canvas id="fireworks" style={{ display: 'block', position: 'absolute', top: 0, left: 0,  }} />;
};

export default Fireworks;