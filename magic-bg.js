// Magical Background Animation
(function() {
  const canvas = document.getElementById('fluidCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  
  // Set canvas size
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Particle class
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.size = Math.random() * 2 + 1;
      this.opacity = Math.random() * 0.5 + 0.3;
      this.color = ['#00FFFF', '#FF00FF', '#FFFF00'][Math.floor(Math.random() * 3)];
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      
      // Bounce off edges
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      
      // Keep in bounds
      this.x = Math.max(0, Math.min(canvas.width, this.x));
      this.y = Math.max(0, Math.min(canvas.height, this.y));
    }

    draw() {
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Create particles
  const particles = [];
  for (let i = 0; i < 50; i++) {
    particles.push(new Particle());
  }

  let time = 0;

  function animate() {
    // Draw animated gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    
    // Animated colors
    const hue1 = (time * 0.1) % 360;
    const hue2 = (time * 0.15 + 120) % 360;
    const hue3 = (time * 0.12 + 240) % 360;
    
    gradient.addColorStop(0, `hsl(${hue1}, 100%, 5%)`);
    gradient.addColorStop(0.5, `hsl(${hue2}, 100%, 10%)`);
    gradient.addColorStop(1, `hsl(${hue3}, 100%, 5%)`);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw particles
    ctx.globalAlpha = 1;
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });

    // Draw connecting lines between nearby particles
    ctx.globalAlpha = 0.2;
    ctx.strokeStyle = '#00FFFF';
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    time++;
    requestAnimationFrame(animate);
  }

  animate();
})();
