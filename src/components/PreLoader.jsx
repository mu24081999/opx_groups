import React, { useEffect, useRef } from "react";
import "./Preloader.css"; // We'll move your CSS here

const Preloader = ({ text = "OPX Groups", onFinish }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    // === Fast random ===
    let o = [],
      n = 0,
      e = 0,
      valuesCount = 1e4,
      randomInterval = 30;

    const random = (index) => {
      if (index) return o[index];
      if (n === valuesCount) n = 0;
      return o[n++];
    };
    random.randomChanger = () => {
      if (e === valuesCount) e = 0;
      o[e++] = Math.random();
    };
    for (let s = 0; s < valuesCount; s++) random.randomChanger();
    setInterval(random.randomChanger, randomInterval);

    // === Particle system ===
    ctx.font = 'bold 200px "Arial"';
    ctx.textBaseline = "center";
    ctx.fillStyle = "#000";

    const _particles = [];
    let particlesLength = 0;

    class Point {
      constructor(x, y) {
        this.set(x, y);
      }
      set(x, y) {
        x = x || 0;
        y = y || x || 0;
        this._sX = x;
        this._sY = y;
        this.reset();
      }
      add(point) {
        this.x += point.x;
        this.y += point.y;
      }
      multiply(point) {
        this.x *= point.x;
        this.y *= point.y;
      }
      reset() {
        this.x = this._sX;
        this.y = this._sY;
        return this;
      }
    }
    const FRICT = new Point(0.98);

    class Particle {
      constructor(x, y) {
        this.startPos = new Point(x, y);
        this.v = new Point();
        this.a = new Point();
        this.reset();
      }
      reset() {
        this.x = this.startPos.x;
        this.y = this.startPos.y;
        this.life = Math.round(random() * 300);
        this.isActive = true;
        this.v.reset();
        this.a.reset();
      }
      tick() {
        if (!this.isActive) return;
        this.physics();
        this.checkLife();
        this.draw();
        return this.isActive;
      }
      checkLife() {
        this.life -= 1;
        this.isActive = !(this.life < 1);
      }
      draw() {
        ctx.fillRect(this.x, this.y, 1, 1);
      }
      physics() {
        this.a.x = (random() - 0.5) * 0.8;
        this.a.y = (random() - 0.5) * 0.8;
        this.v.add(this.a);
        this.v.multiply(FRICT);
        this.x += this.v.x;
        this.y += this.v.y;
        this.x = Math.round(this.x * 10) / 10;
        this.y = Math.round(this.y * 10) / 10;
      }
    }

    const createParticle = (x, y) => {
      _particles.push(new Particle(x, y));
    };

    const checkAlpha = (pixels, i) => {
      return pixels[i * 4 + 3] > 0;
    };

    const createParticles = () => {
      const textSize = ctx.measureText(text);
      ctx.fillText(
        text,
        Math.round(canvas.width / 2 - textSize.width / 2),
        Math.round(canvas.height / 2)
      );
      const imageData = ctx.getImageData(1, 1, canvas.width, canvas.height);
      const pixels = imageData.data;
      const dataLength = imageData.width * imageData.height;

      for (let i = 0; i < dataLength; i++) {
        const currentRow = Math.floor(i / imageData.width);
        const currentColumn = i - Math.floor(i / imageData.height);
        if (currentRow % 2 || currentColumn % 2) continue;
        if (checkAlpha(pixels, i)) {
          const cy = ~~(i / imageData.width);
          const cx = ~~(i - cy * imageData.width);
          createParticle(cx, cy);
        }
      }
      particlesLength = _particles.length;
    };

    createParticles();

    const clearCanvas = () => {
      ctx.fillStyle = "rgba(0,0,0,0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const clearLoop = () => {
      clearCanvas();
      requestAnimationFrame(clearLoop);
    };
    clearLoop();

    const resetParticles = () => {
      for (let i = 0; i < particlesLength; i++) {
        _particles[i].reset();
      }
    };

    const animLoop = () => {
      ctx.fillStyle = "#888";
      let isAlive = false;
      for (let i = 0; i < particlesLength; i++) {
        if (_particles[i].tick()) isAlive = true;
      }
      if (!isAlive) {
        resetParticles();
        setTimeout(() => {
          if (onFinish) onFinish(); // notify parent preloader finished
          requestAnimationFrame(animLoop);
        }, 500);
        return;
      }
      requestAnimationFrame(animLoop);
    };
    animLoop();
  }, [text, onFinish]);

  return (
    <div className="preloader-container">
      <canvas ref={canvasRef} className="preloader-canvas"></canvas>
    </div>
  );
};

export default Preloader;
