/**
 * Scroll-Animationen der Startseite (GSAP ScrollTrigger).
 * Alles laeuft nur ohne "Bewegung reduzieren"; sonst bleibt die statische Seite stehen,
 * die ohne JavaScript bereits vollstaendig ist.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const REFILL_GRAMS = 110;

function heroParallax(): void {
  const media = document.querySelector('[data-hero-media]');
  const content = document.querySelector('[data-hero-content]');
  if (!media || !content) return;

  gsap.from(content.children, { y: 40, opacity: 0, duration: 1, stagger: 0.12, ease: 'power3.out', delay: 0.15 });
  gsap.fromTo(media, { scale: 1.08 }, { scale: 1, duration: 1.6, ease: 'power2.out' });

  gsap.to(media, {
    yPercent: 18,
    ease: 'none',
    scrollTrigger: { trigger: '[data-hero]', start: 'top top', end: 'bottom top', scrub: true },
  });
  gsap.to(content, {
    yPercent: -30,
    opacity: 0,
    ease: 'none',
    scrollTrigger: { trigger: '[data-hero]', start: 'center center', end: 'bottom top', scrub: true },
  });
}

/** Bild und Text eines Arguments fliegen von gegenueberliegenden Seiten herein. */
function revealFromSides(): void {
  document.querySelectorAll<HTMLElement>('[data-reveal-from]').forEach((el) => {
    if (el.closest('[data-pin]')) return; // gepinnte Abschnitte steuern sich selbst
    const from = el.dataset.revealFrom;
    const isMobile = window.matchMedia('(max-width: 860px)').matches;
    const distance = isMobile ? 40 : 120;
    const x = from === 'left' ? -distance : from === 'right' ? distance : 0;
    const y = from === 'bottom' || isMobile ? 60 : 0;
    gsap.from(el, {
      x: isMobile ? 0 : x,
      y,
      opacity: 0,
      rotate: isMobile ? 0 : x === 0 ? 0 : x < 0 ? -2 : 2,
      duration: 1.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 82%', once: true },
    });
  });
}

function ingredientsFlyIn(): void {
  const root = document.querySelector('[data-ingredients]');
  if (!root) return;
  const tl = gsap.timeline({
    scrollTrigger: { trigger: root, start: 'top 85%', end: 'center 50%', scrub: 0.8 },
  });
  root.querySelectorAll<HTMLElement>('[data-fly]').forEach((tile, i) => {
    const [x, y, r] = (tile.dataset.fly ?? '0,0,0').split(',').map(Number);
    tl.from(tile, { xPercent: x, yPercent: y, rotate: r * 2, opacity: 0, ease: 'power2.out' }, i * 0.12);
  });
  const center = root.querySelector('[data-fly-center]');
  if (center) tl.from(center, { yPercent: 40, scale: 0.7, opacity: 0, ease: 'back.out(1.6)' }, 0.25);
}

/** Storyboard Nachfuellen, gekoppelt an die Scrollposition. Abschnitt bleibt dafuer stehen. */
function refillSequence(): void {
  const section = document.querySelector<HTMLElement>('[data-pin]');
  const root = section?.querySelector('[data-refill]');
  if (!section || !root) return;

  const q = <T extends Element = SVGElement>(sel: string) => root.querySelector<T>(sel)!;
  const lid = q('[data-refill-lid]');
  const bag = q('[data-refill-bag]');
  const strip = q('[data-refill-strip]');
  const stream = q('[data-refill-stream]');
  const streamPaths = stream.querySelectorAll('path');
  const fill = q('[data-refill-fill]');
  const top = q('[data-refill-top]');
  const label = q('[data-refill-label]');
  const grams = q<HTMLElement>('[data-refill-grams]');
  const cta = section.querySelector('[data-refill-cta]');
  const intro = section.querySelector('[data-refill-intro]');
  const counter = { value: 0 };

  // Ausgangslage der Animation: Beutel oben ausserhalb, Dose leer
  gsap.set(bag, { x: 215, y: -260, rotation: 0, opacity: 0, transformOrigin: '50% 0%' });
  gsap.set(fill, { attr: { y: 520, height: 0 } });
  gsap.set(grams, { textContent: '0' });
  if (cta) gsap.set(cta, { autoAlpha: 0, y: 20 });
  section.classList.add('is-animated'); // Intro und Angebot teilen sich dann denselben Platz

  const tl = gsap.timeline({
    defaults: { ease: 'power2.inOut' },
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: '+=150%',
      pin: true,
      scrub: 0.6,
      anticipatePin: 1,
    },
  });

  // 0–15 %: Deckel ab
  tl.to(lid, { x: -150, y: -170, rotation: -24, opacity: 0.0, duration: 15 }, 0);
  // 15–35 %: Beutel kommt, Lasche wird abgerissen
  tl.to(bag, { y: 40, opacity: 1, duration: 14 }, 12);
  tl.to(strip, { x: 70, y: -60, rotation: 35, opacity: 0, duration: 7, ease: 'power3.out' }, 27);
  // 35–75 %: kippen und rieseln, Dose wird sichtbar voll
  tl.to(bag, { x: 222, y: 170, rotation: 145, duration: 9 }, 35);
  tl.to(label, { opacity: 0.18, duration: 5 }, 38);
  tl.to(stream, { opacity: 1, duration: 3 }, 42);
  tl.fromTo(streamPaths, { strokeDashoffset: 0 }, { strokeDashoffset: -260, duration: 31, ease: 'none' }, 42);
  tl.to(fill, { attr: { y: 312, height: 210 }, duration: 31, ease: 'none' }, 44);
  tl.to(counter, {
    value: REFILL_GRAMS,
    duration: 31,
    ease: 'none',
    onUpdate: () => (grams.textContent = String(Math.round(counter.value))),
  }, 44);
  tl.to(top, { opacity: 1, duration: 4 }, 70);
  tl.to(stream, { opacity: 0, duration: 3 }, 73);
  // 75–90 %: Beutel weg, Deckel drauf
  tl.to(bag, { x: 420, y: -200, rotation: 200, opacity: 0, duration: 9 }, 75);
  tl.to(label, { opacity: 1, duration: 5 }, 78);
  tl.to(lid, { x: 0, y: 0, rotation: 0, opacity: 1, duration: 10 }, 80);
  // 90–100 %: Angebot
  if (intro) tl.to(intro, { autoAlpha: 0, y: -20, duration: 6 }, 86);
  if (cta) tl.to(cta, { autoAlpha: 1, y: 0, duration: 8 }, 90);
  tl.to({}, { duration: 2 }, 98);
}

function muriFocus(): void {
  const img = document.querySelector('[data-muri-img]');
  if (!img) return;
  gsap.fromTo(
    img,
    { filter: 'blur(14px) saturate(0.4)', scale: 1.15 },
    {
      filter: 'blur(0px) saturate(1)',
      scale: 1,
      ease: 'none',
      scrollTrigger: { trigger: img, start: 'top 90%', end: 'center 55%', scrub: true },
    },
  );
}

function dishesFanOut(): void {
  const root = document.querySelector('[data-dishes]');
  if (!root) return;
  const cards = root.querySelectorAll<HTMLElement>('[data-dish]');
  gsap.from(cards, {
    xPercent: (i: number) => [-60, 0, 60][i] ?? 0,
    yPercent: 50,
    rotate: (i: number) => [-14, 4, 14][i] ?? 0,
    opacity: 0,
    stagger: 0.15,
    ease: 'power2.out',
    scrollTrigger: { trigger: root, start: 'top 85%', end: 'center 60%', scrub: 0.8 },
  });
}

function progressDots(): void {
  const nav = document.querySelector('[data-progress-dots]');
  if (!nav) return;
  const dots = nav.querySelectorAll<HTMLElement>('[data-progress-dot]');
  const sections = document.querySelectorAll<HTMLElement>('[data-argument]');
  if (sections.length === 0) return;

  ScrollTrigger.create({
    trigger: sections[0],
    endTrigger: sections[sections.length - 1],
    start: 'top 60%',
    end: 'bottom 40%',
    toggleClass: { targets: nav, className: 'is-visible' },
  });
  sections.forEach((section) => {
    const index = section.dataset.argument;
    ScrollTrigger.create({
      trigger: section,
      start: 'top center',
      end: 'bottom center',
      onToggle: ({ isActive }) => {
        if (!isActive) return;
        dots.forEach((dot) => dot.classList.toggle('is-active', dot.dataset.progressDot === index));
      },
    });
  });
}

const mm = gsap.matchMedia();
mm.add('(prefers-reduced-motion: no-preference)', () => {
  heroParallax();
  refillSequence(); // zuerst: Pinning verschiebt alle folgenden Trigger
  revealFromSides();
  ingredientsFlyIn();
  muriFocus();
  dishesFanOut();
  progressDots();
});

// Bilder mit lazy loading veraendern die Hoehe: Trigger danach neu berechnen.
window.addEventListener('load', () => ScrollTrigger.refresh());
