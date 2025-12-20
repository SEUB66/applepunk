// MAGICAL BACKGROUND ANIMATION
document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.createElement('canvas');
  canvas.id = 'magicCanvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.zIndex = '0';
  canvas.style.pointerEvents = 'none';
  document.body.insertBefore(canvas, document.body.firstChild);

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;

  // Resize canvas
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
      this.radius = Math.random() * 2 + 1;
      
      // Theme-aware colors
      const isDark = document.documentElement.classList.contains('dark') || !document.documentElement.classList.contains('light');
      
      if (isDark) {
        const colors = ['#00FFFF', '#FF1493', '#FFD700', '#00FF00'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      } else {
        const colors = ['#FF69B4', '#00BFFF', '#00FF7F', '#FFB6C1'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Bounce off walls
      if (this.x - this.radius < 0 || this.x + this.radius > canvas.width) {
        this.vx *= -1;
        this.x = Math.max(this.radius, Math.min(canvas.width - this.radius, this.x));
      }
      if (this.y - this.radius < 0 || this.y + this.radius > canvas.height) {
        this.vy *= -1;
        this.y = Math.max(this.radius, Math.min(canvas.height - this.radius, this.y));
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 20;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  // Initialize particles
  function initParticles() {
    particles = [];
    for (let i = 0; i < 50; i++) {
      particles.push(new Particle());
    }
  }
  initParticles();

  // Draw connection lines
  function drawConnections() {
    const isDark = document.documentElement.classList.contains('dark') || !document.documentElement.classList.contains('light');
    
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 250) {
          const opacity = (1 - distance / 250) * 0.7;
          
          // Draw line
          ctx.strokeStyle = isDark ? `rgba(127, 216, 216, ${opacity})` : `rgba(255, 105, 180, ${opacity})`;
          ctx.lineWidth = 2;
          ctx.shadowBlur = isDark ? 15 : 10;
          ctx.shadowColor = isDark ? '#00FFFF' : '#FF69B4';
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      }
    }
  }

  // Animate
  function animate() {
    const isDark = document.documentElement.classList.contains('dark') || !document.documentElement.classList.contains('light');
    
    // Clear canvas with gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    
    if (isDark) {
      gradient.addColorStop(0, '#1a1a1a');
      gradient.addColorStop(0.5, '#0d3d4d');
      gradient.addColorStop(1, '#1a1a1a');
    } else {
      gradient.addColorStop(0, '#FFFFFF');
      gradient.addColorStop(0.5, '#F5F5F5');
      gradient.addColorStop(1, '#FFFFFF');
    }
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });

    // Draw connections
    drawConnections();

    animationId = requestAnimationFrame(animate);
  }

  animate();

  // Watch for theme changes
  const observer = new MutationObserver(() => {
    initParticles();
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  });
});
