// Машина едет по дороге внизу экрана вслед за прокруткой страницы.
// Скроллишь вниз — едет вправо, вверх — разворачивается и едет влево.
(() => {
  const car = document.getElementById('car');
  const speedEl = document.getElementById('speed');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let x = -car.offsetWidth - 40;  // старт за левым краем — машина «заезжает» на страницу
  let dir = 1;                    // 1 — смотрит вправо, -1 — влево
  let lines = 0;                  // яркость линий скорости (0..1)
  let t = 0;

  function frame() {
    const carW = car.offsetWidth;
    const pad = 16;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const progress = Math.min(1, Math.max(0, scrollY / maxScroll));
    const target = pad + progress * (innerWidth - carW - pad * 2);

    // плавный разгон и торможение
    const v = reduced ? 0 : (target - x) * 0.055;
    x = reduced ? target : x + v;
    const speed = Math.abs(v);

    if (speed > 0.5) dir = v > 0 ? 1 : -1;

    // линии скорости проявляются только когда машина едет
    lines += (Math.min(speed / 7, 1) - lines) * 0.12;
    car.style.setProperty('--lines', lines.toFixed(3));

    // подпрыгивание на ходу и лёгкая вибрация на холостых
    t += 0.35 + speed * 0.04;
    const bob = reduced ? 0 : Math.sin(t * 1.9) * (0.5 + Math.min(speed, 10) * 0.18);
    // наклон: при разгоне нос чуть приподнимается, при торможении — клюёт
    const tilt = reduced ? 0 : Math.max(-3, Math.min(3, -v * 0.16));

    car.style.transform =
      `translate3d(${x.toFixed(1)}px, ${bob.toFixed(2)}px, 0) rotate(${tilt.toFixed(2)}deg) scaleX(${dir})`;

    if (speedEl) speedEl.textContent = Math.round(speed * 11);

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
})();
