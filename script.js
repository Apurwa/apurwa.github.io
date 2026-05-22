const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function formatStat(value, prefix, suffix) {
  return `${prefix}${value}${suffix}`;
}

function animateStat(el) {
  const target = Number(el.dataset.target);
  const prefix = el.dataset.prefix || "";
  const suffix = el.dataset.suffix || "";

  if (prefersReducedMotion) {
    el.textContent = formatStat(target, prefix, suffix);
    return;
  }

  const duration = 900;
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(target * eased);
    el.textContent = formatStat(current, prefix, suffix);
    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateStat(entry.target);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll(".stat-num").forEach((el) => observer.observe(el));
