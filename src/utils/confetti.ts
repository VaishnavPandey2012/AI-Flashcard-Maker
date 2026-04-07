import canvasConfetti from 'canvas-confetti';

export function launchConfetti(): void {
  const duration = 3000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) {
      clearInterval(interval);
      return;
    }
    const particleCount = 50 * (timeLeft / duration);
    canvasConfetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: ['#7C3AED', '#6366F1', '#EC4899', '#06B6D4', '#10B981'],
    });
    canvasConfetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: ['#7C3AED', '#6366F1', '#EC4899', '#06B6D4', '#F59E0B'],
    });
  }, 250);
}

export function launchSmallConfetti(): void {
  canvasConfetti({
    particleCount: 30,
    spread: 60,
    origin: { y: 0.6 },
    colors: ['#7C3AED', '#EC4899', '#06B6D4'],
    zIndex: 9999,
  });
}
