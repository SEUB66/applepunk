// Custom Fluid Animation using Canvas 2D
const canvas = document.getElementById('fluidCanvas');
if (!canvas) {
  console.error('Fluid canvas not found');
} else {
  const ctx = canvas.getContext('2d');
  
  // Set canvas size
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  // Particle system
  class Particle {
    constructor(x, y, vx, vy, color) {
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      this.color = color;
      this.life = 1;
      this.decay = Math.random() * 0.01 + 0.005;
    }
    
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.1; // gravity
      this.life -= this.decay;
      
      // Wrap around edges
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
    }
    
    draw() {
      const colors = ['#00FFFF', '#FF00FF', '#FFFF00'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      ctx.globalAlpha = this.life * 0.6;
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 3 + Math.random() * 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }
  
  let particles = [];
  let time = 0;
  
  // Emit particles
  function emit() {
    const colors = ['#00FFFF', '#FF00FF', '#FFFF00'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // Random position
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height * 0.3; // Top area
    
    // Random velocity
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 2 + 1;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed - 2;
    
    particles.push(new Particle(x, y, vx, vy, color));
  }
  
  // Animation loop
  function animate() {
    // Clear canvas with semi-transparent background
    ctx.globalAlpha = 1;
    ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Emit new particles
    if (time % 3 === 0) {
      for (let i = 0; i < 5; i++) {
        emit();
      }
    }
    
    // Update and draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw();
      
      if (particles[i].life <= 0) {
        particles.splice(i, 1);
      }
    }
    
    // Draw flowing waves
    ctx.globalAlpha = 0.3;
    const waveHeight = 50;
    const waveFreq = 0.01;
    const waveSpeed = time * 0.02;
    
    const colors = ['#00FFFF', '#FF00FF', '#FFFF00'];
    colors.forEach((color, idx) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      
      const offset = (idx * canvas.width / 3) + waveSpeed;
      for (let x = 0; x < canvas.width; x += 5) {
        const y = canvas.height * 0.5 + Math.sin((x + offset) * waveFreq) * waveHeight;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    });
    
    ctx.shadowBlur = 0;
    time++;
    requestAnimationFrame(animate);
  }
  
  animate();
  
  // Mouse interaction
  canvas.addEventListener('mousemove', (e) => {
    const colors = ['#00FFFF', '#FF00FF', '#FFFF00'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    for (let i = 0; i < 3; i++) {
      const angle = (Math.PI * 2 * i) / 3;
      const vx = Math.cos(angle) * 3;
      const vy = Math.sin(angle) * 3;
      particles.push(new Particle(e.clientX, e.clientY, vx, vy, color));
    }
  });
}
