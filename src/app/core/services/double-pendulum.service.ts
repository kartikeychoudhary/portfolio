import { Injectable } from '@angular/core';

/**
 * Confetti Animation Service
 *
 * Creates a festive falling confetti animation with colorful particles
 * that flutter and spin as they fall down the screen.
 */
@Injectable({
  providedIn: 'root'
})
export class DoublePendulumService {
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private animationId: number = 0;
  private isRunning = false;

  // Confetti particles
  private confetti: Confetti[] = [];
  private confettiCount = 150;

  // Color schemes
  private colors = [
    ['#3b82f6', '#60a5fa', '#93c5fd'], // Blues
    ['#ef4444', '#f87171', '#fca5a5'], // Reds
    ['#10b981', '#34d399', '#6ee7b7'], // Greens
    ['#f59e0b', '#fbbf24', '#fcd34d'], // Yellows
    ['#8b5cf6', '#a78bfa', '#c4b5fd'], // Purples
  ];

  // Theme colors
  private isDarkTheme = false;

  constructor() {}

  /**
   * Initialize the canvas and start the animation
   */
  initCanvas(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    const context = canvas.getContext('2d');

    if (!context) {
      console.error('Could not get canvas context');
      return;
    }

    this.ctx = context;
    this.resizeCanvas();
    this.updateTheme();

    // Create initial confetti
    this.initConfetti();

    this.isRunning = true;
    this.animate();

    // Handle resize
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  /**
   * Update theme colors based on current theme
   */
  updateTheme(): void {
    this.isDarkTheme = document.documentElement.classList.contains('dark');
  }

  /**
   * Resize canvas to fill window
   */
  private resizeCanvas(): void {
    if (!this.canvas) return;

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    // Reinitialize confetti on resize
    if (this.confetti.length > 0) {
      this.initConfetti();
    }
  }

  /**
   * Initialize confetti particles
   */
  private initConfetti(): void {
    this.confetti = [];
    for (let i = 0; i < this.confettiCount; i++) {
      this.confetti.push(new Confetti(this.canvas.width, this.canvas.height, this.colors));
    }
  }

  /**
   * Draw the confetti animation
   */
  private draw(): void {
    if (!this.ctx) return;

    // Clear canvas with slight fade for motion blur effect
    this.ctx.fillStyle = this.isDarkTheme
      ? 'rgba(15, 23, 42, 0.1)'
      : 'rgba(248, 250, 252, 0.1)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Update and draw each confetti particle
    this.confetti.forEach(particle => {
      particle.update(this.canvas.height);
      particle.draw(this.ctx);
    });
  }

  /**
   * Animation loop
   */
  private animate = (): void => {
    if (!this.isRunning) return;

    this.draw();
    this.animationId = requestAnimationFrame(this.animate);
  };

  /**
   * Stop the animation and clean up
   */
  destroy(): void {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    window.removeEventListener('resize', () => this.resizeCanvas());
  }

  /**
   * Pause the animation
   */
  pause(): void {
    this.isRunning = false;
  }

  /**
   * Resume the animation
   */
  resume(): void {
    if (!this.isRunning) {
      this.isRunning = true;
      this.animate();
    }
  }
}

/**
 * Confetti Particle Class
 */
class Confetti {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  speedX: number;
  speedY: number;
  opacity: number;

  constructor(canvasWidth: number, canvasHeight: number, colors: string[][]) {
    // Random position
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight - canvasHeight; // Start above screen

    // Random size (rectangle confetti)
    this.w = Math.random() * 10 + 5; // Width: 5-15px
    this.h = Math.random() * 5 + 3;  // Height: 3-8px

    // Random color from color schemes
    const colorScheme = colors[Math.floor(Math.random() * colors.length)];
    this.color = colorScheme[Math.floor(Math.random() * colorScheme.length)];

    // Random rotation
    this.rotation = Math.random() * 360;
    this.rotationSpeed = Math.random() * 10 - 5; // -5 to 5 degrees per frame

    // Random velocity
    this.speedX = Math.random() * 2 - 1; // -1 to 1 (drift left/right)
    this.speedY = Math.random() * 2 + 2; // 2 to 4 (fall down)

    // Opacity
    this.opacity = Math.random() * 0.5 + 0.5; // 0.5 to 1.0
  }

  /**
   * Update particle position and rotation
   */
  update(canvasHeight: number): void {
    // Update position
    this.x += this.speedX;
    this.y += this.speedY;

    // Update rotation
    this.rotation += this.rotationSpeed;

    // Add some wave motion
    this.x += Math.sin(this.y * 0.01) * 0.5;

    // Reset to top if fallen off screen
    if (this.y > canvasHeight + 20) {
      this.y = -20;
      this.x = Math.random() * window.innerWidth;
    }

    // Wrap around horizontally
    if (this.x > window.innerWidth + 20) {
      this.x = -20;
    } else if (this.x < -20) {
      this.x = window.innerWidth + 20;
    }
  }

  /**
   * Draw the particle
   */
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    // Translate to particle position
    ctx.translate(this.x, this.y);

    // Rotate
    ctx.rotate((this.rotation * Math.PI) / 180);

    // Set color with opacity
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.opacity;

    // Draw rectangle confetti
    ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);

    ctx.restore();
  }
}
