const header = document.querySelector(".site-header");
const headerName = document.querySelector(".header-name");
const landing = document.querySelector(".landing");
const landingLeft = document.querySelector(".landing-left");
const heroName = document.querySelector(".landing-left h1");
const revealItems = document.querySelectorAll(".landing-group, .work-card, .timeline-item, .education, .skills, .thinking, .cta");
const workSlider = document.querySelector(".work-grid");
const workPrev = document.querySelector(".work-prev");
const workNext = document.querySelector(".work-next");

let headerVisible = false;
let dockTimer;

function setNameOrigin() {
  if (!header || !headerName || !heroName) return;

  header.classList.add("is-measuring");
  const targetRect = headerName.getBoundingClientRect();
  header.classList.remove("is-measuring");

  const sourceRect = heroName.getBoundingClientRect();
  const sourceX = sourceRect.left + sourceRect.width / 2;
  const sourceY = sourceRect.top + sourceRect.height / 2;
  const targetX = targetRect.left + targetRect.width / 2;
  const targetY = targetRect.top + targetRect.height / 2;
  const scale = Math.max(1.25, Math.min(2.2, sourceRect.height / targetRect.height));

  header.style.setProperty("--name-x", `${sourceX - targetX}px`);
  header.style.setProperty("--name-y", `${sourceY - targetY}px`);
  header.style.setProperty("--name-scale", scale.toFixed(2));
}

function showHeader() {
  if (headerVisible || !header) return;
  headerVisible = true;
  setNameOrigin();
  document.body.classList.add("is-name-docked");
  header.classList.add("is-visible", "is-docking");
  window.clearTimeout(dockTimer);
  dockTimer = window.setTimeout(() => {
    header.classList.remove("is-docking");
  }, 560);
}

function hideHeader() {
  if (!headerVisible || !header) return;
  headerVisible = false;
  window.clearTimeout(dockTimer);
  document.body.classList.remove("is-name-docked");
  header.classList.remove("is-visible", "is-docking");
}

function shouldRevealHeader() {
  if (!landing || !landingLeft || !heroName) return window.scrollY > 0;

  if (window.matchMedia("(max-width: 720px)").matches) {
    return heroName.getBoundingClientRect().bottom <= 64;
  }

  const landingRect = landing.getBoundingClientRect();
  const leftHeight = landingLeft.offsetHeight;
  const stickyTop = 64;
  const handoffBuffer = 16;

  return landingRect.bottom <= leftHeight + stickyTop + handoffBuffer;
}

function updateHeader() {
  if (shouldRevealHeader()) {
    showHeader();
  } else {
    hideHeader();
  }
}

window.addEventListener("scroll", updateHeader, { passive: true });
window.addEventListener("resize", () => {
  if (headerVisible) setNameOrigin();
});
updateHeader();

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in-view");
      revealObserver.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -12% 0px", threshold: 0.12 });

  revealItems.forEach((item, index) => {
    item.classList.add("reveal");
    item.style.transitionDelay = `${Math.min(index * 45, 220)}ms`;
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add("is-in-view"));
}

if (workSlider && workPrev && workNext) {
  const workCards = Array.from(workSlider.querySelectorAll(".work-card"));

  function getSlideDistance() {
    const firstCard = workCards[0];
    if (!firstCard) return workSlider.clientWidth;
    const styles = getComputedStyle(workSlider);
    const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0;
    return firstCard.getBoundingClientRect().width + gap;
  }

  function getVisibleCount() {
    const distance = getSlideDistance();
    if (!distance) return 1;
    return Math.max(1, Math.round(workSlider.clientWidth / distance));
  }

  function getMaxIndex() {
    return Math.max(0, workCards.length - getVisibleCount());
  }

  function getCurrentIndex() {
    const distance = getSlideDistance();
    if (!distance) return 0;
    return Math.min(getMaxIndex(), Math.max(0, Math.round(workSlider.scrollLeft / distance)));
  }

  function updateSliderControls() {
    const currentIndex = getCurrentIndex();
    workPrev.disabled = currentIndex === 0;
    workNext.disabled = currentIndex >= getMaxIndex();
  }

  function moveSlider(direction) {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nextIndex = Math.min(getMaxIndex(), Math.max(0, getCurrentIndex() + direction));
    workSlider.scrollTo({
      left: nextIndex * getSlideDistance(),
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }

  workPrev.addEventListener("click", () => moveSlider(-1));
  workNext.addEventListener("click", () => moveSlider(1));
  workSlider.addEventListener("scroll", updateSliderControls, { passive: true });
  window.addEventListener("resize", updateSliderControls);
  updateSliderControls();
}
