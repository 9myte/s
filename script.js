/**
 * ============================================
 *  CINEMATIC LOVE STORY — Garv ❤️ Satakshi
 * ============================================
 */

/* ——— CONFIG: EDIT YOUR CONTENT ——— */

/* Password gate — EDIT these */
const PASSWORD = "01012010";
const FAV_PERSON_BIRTHDAY = "01/01/2010"; /* birthday hint shown on gate (dd/mm/yyyy) */
const GATE_SESSION_KEY = "love-site-unlocked";

/** Resolve image paths on GitHub Pages (e.g. /repo-name/images/...) */
function getAssetPath(relativePath) {
  const rel = String(relativePath || "").replace(/^\//, "");
  if (!rel) return "";
  if (window.location.protocol === "file:") return rel;

  let path = window.location.pathname;
  const last = path.split("/").pop() || "";
  if (/\.[a-z0-9]+$/i.test(last)) path = path.replace(/\/[^/]+$/, "/");
  else if (!path.endsWith("/")) path += "/";

  const segments = path.split("/").filter(Boolean);
  const base = segments.length ? `/${segments.join("/")}/` : "/";
  return `${base}${rel}`;
}

/** Raw GitHub URL when Pages path fails (images must be in the repo) */
function getGitHubRawUrl(relativePath, branch = "main") {
  const host = window.location.hostname;
  if (!host.endsWith("github.io")) return null;

  const rel = String(relativePath || "").replace(/^\//, "");
  const user = host.replace(".github.io", "");
  const parts = window.location.pathname.split("/").filter(Boolean);
  const repo =
    parts[0] && !/\.[a-z0-9]+$/i.test(parts[0]) ? parts[0] : `${user}.github.io`;

  return `https://raw.githubusercontent.com/${user}/${repo}/${branch}/${rel}`;
}

function bindLetterImage(img, relativePath) {
  if (!img || !relativePath) return;

  const tryRaw = (branch) => {
    const raw = getGitHubRawUrl(relativePath, branch);
    if (raw && img.src !== raw) img.src = raw;
  };

  img.addEventListener("error", () => {
    const step = img.dataset.fallbackStep || "0";
    if (step === "0") {
      img.dataset.fallbackStep = "1";
      tryRaw("main");
    } else if (step === "1") {
      img.dataset.fallbackStep = "2";
      tryRaw("master");
    } else {
      img.classList.add("letter-img-missing");
    }
  });
}

const RELATIONSHIP_START = new Date("2025-08-06T21:49:00");

/* Letters section removed per user request */
/* Poems — typewriter reveal on scroll (2 poems only) */
const POEMS = [
  {
    title: "",
    text: `what a curse it is to be yours,
you being the bittersweet madness my heart endures,
and still, in every breath, i find you lingering uninvited,
guess i rank below your moonlit allure,
still i’ll love you till my lifeless heart is yours,
i turn to your light, though the world’s unsure—
like a sunflower rising through skies obscure.

you being my muse, eternal beneath the violet skies,
how do you hold the world within your gaze?
this may be a dream of mine — with the laws of creation, this defies,
even my favorite songs whisper only you
and every road i wander bends back to your eyes.
most of all, the way you look my way, a wildfire sets me ablaze

her eyes, the same ones i get lost in, telling me to stay — evermore.
i had no other option, as if the answer had been written long before.
i’ve never left your eyes’ clime, your crescent smile telling me something divine.
what it told me was to be yours till eternity passes away,
or till the point that death would lead me astray.
and through her, i finally feel the colours i’d long forgotten,
a world she gives me, like none i could’ve ever gotten.

since you’re pretty and i’m stupid, maybe we were meant to be,
fate laughs softly every time you look back at me,
because somehow your chaos keeps choosing me,
your laughter drags my heart through storms it never knew,
even my thoughts borrow your voice,
feeling your echo lead my world to despoise.

every moment it goes through, my heart chooses you
and there’s nothing in the world you could do`,
  },
  {
    title: "",
    text: `To the one whose picture is in my wallet,
but my very being holds your love.

What can I do?
I was bound to fall from the very first stolen gaze,
that upside-down crescent of a smile of yours,
enough to set my heart ablaze.

This warm feeling that lingers evermore,
since the very first moment my eyes met yours.

How does it feel to be my worst addiction?
With that treacherous smile,
the beauty you hold might just be part of my fiction.

This is me, stuck in the deep trenches of your eyes,
trapped, though not complaining,
here my whole existence could suffice.

You could stay forever in the abode of my mind,
free of conviction,
though this just may cause my heart's demise.

Like the sunflower leans toward the sun,
my heart leans toward you at daybreak,
speaking with unbound love,
from the shenanigans in which my heart partakes.

Each time I lay my eyes on you, I want you more,
falling harder with every heartbeat than ever before.

What I thought was a curse at first
has bloomed into a benediction unrehearsed,
my love multiplying exponentially, of course,
making me forever yours
- From your favourite Gadhaaa`,
  },
];

/* Why I love you — floating notes */
const WHY_I_LOVE = [
  "Your upside down crescent of a smile",
  "Your voice",
  "The way you call me \"gadhe\"",
  "How you make everything better",
  "You are there for me when no one else is",
  "My Malkin 💖",
  "Your laugh",
  "Every little moment with you",
];

/* ——— STATE ——— */
let lastSeconds = -1;
let isAudible = false;
let scrollObserver = null;
const typedPoems = new Set();

/* ============================================
   PASSWORD GATE
   ============================================ */
function initPasswordGateHearts() {
  const container = document.getElementById("password-gate-hearts");
  if (!container) return;

  const symbols = ["♥", "♡", "·"];
  for (let i = 0; i < 8; i++) {
    const el = document.createElement("span");
    el.className = "gate-heart";
    el.textContent = symbols[i % symbols.length];
    el.style.left = `${8 + Math.random() * 84}%`;
    el.style.fontSize = `${0.55 + Math.random() * 0.65}rem`;
    el.style.animationDuration = `${16 + Math.random() * 12}s`;
    el.style.animationDelay = `${Math.random() * 10}s`;
    container.appendChild(el);
  }
}

function initPasswordGate(onUnlock) {
  const gate = document.getElementById("password-gate");
  const form = document.getElementById("password-form");
  const input = document.getElementById("password-input");
  const error = document.getElementById("password-error");
  const card = gate?.querySelector(".password-gate-card");
  const hintDate = document.getElementById("password-hint-date");

  if (hintDate) hintDate.textContent = FAV_PERSON_BIRTHDAY;

  const unlock = (instant) => {
    document.body.classList.remove("site-locked");
    document.body.classList.add("site-unlocked");
    if (instant) {
      gate?.classList.add("is-hidden");
    } else {
      gate?.classList.add("is-unlocking");
      setTimeout(() => gate?.classList.add("is-hidden"), 1400);
    }
    onUnlock();
    setTimeout(() => showSoundUnlock(), instant ? 400 : isMobile() ? 1200 : 1600);
  };

  if (sessionStorage.getItem(GATE_SESSION_KEY) === "true") {
    unlock(true);
    return;
  }

  initPasswordGateHearts();

  function tryUnlock() {
    if (!input) return;
    if (input.value.trim() === PASSWORD) {
      sessionStorage.setItem(GATE_SESSION_KEY, "true");
      if (error) error.hidden = true;
      unlock(false);
    } else {
      if (error) error.hidden = false;
      card?.classList.add("shake");
      setTimeout(() => card?.classList.remove("shake"), 520);
      input.value = "";
      input.focus();
    }
  }

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    tryUnlock();
  });

  document.querySelector(".password-submit")?.addEventListener("click", (e) => {
    e.preventDefault();
    tryUnlock();
  });

  if (!isMobile()) {
    setTimeout(() => input?.focus(), 600);
  }
}

/* ============================================
   OPENING CURTAIN
   ============================================ */
function initCurtain() {
  const curtain = document.getElementById("cinematic-curtain");
  if (!curtain) return;
  requestAnimationFrame(() => {
    setTimeout(() => curtain.classList.add("is-lifted"), 400);
  });
}

/* ============================================
   FLOATING HEART PARTICLES
   ============================================ */
function isMobile() {
  return window.matchMedia("(max-width: 768px)").matches ||
    window.matchMedia("(pointer: coarse)").matches;
}

function initParticles() {
  const bg = document.getElementById("hearts-bg");
  if (!bg) return;

  const symbols = ["♥", "♡", "💖", "·"];
  const count = isMobile() ? 14 : 22;

  for (let i = 0; i < count; i++) {
    const el = document.createElement("span");
    el.className = "heart-particle";
    el.textContent = symbols[i % symbols.length];
    el.style.left = `${5 + Math.random() * 90}%`;
    el.style.fontSize = `${0.65 + Math.random() * 1.05}rem`;
    el.style.animationDuration = `${18 + Math.random() * 16}s`;
    el.style.animationDelay = `${Math.random() * 14}s`;
    el.style.setProperty("--drift", `${-40 + Math.random() * 80}px`);
    bg.appendChild(el);
  }
}

/** Hearts that drift upward with scroll parallax */
function initScrollParallaxHearts() {
  const layer = document.getElementById("hearts-scroll");
  if (!layer) return;

  const symbols = ["♥", "♡", "💖", "💕", "·"];
  const count = isMobile() ? 18 : 28;
  const items = [];

  for (let i = 0; i < count; i++) {
    const el = document.createElement("span");
    el.className = "heart-scroll";
    el.textContent = symbols[i % symbols.length];
    el.style.left = `${4 + Math.random() * 92}%`;
    el.style.top = `${Math.random() * 100}%`;
    el.dataset.speed = (0.12 + Math.random() * 0.55).toFixed(2);
    el.dataset.sway = (8 + Math.random() * 28).toFixed(0);
    el.style.fontSize = `${0.7 + Math.random() * 1.25}rem`;
    el.style.opacity = String(0.22 + Math.random() * 0.28);
    layer.appendChild(el);
    items.push(el);
  }

  let ticking = false;
  const update = () => {
    const y = window.scrollY;
    const docH = Math.max(
      1,
      document.documentElement.scrollHeight - window.innerHeight
    );
    const progress = y / docH;

    layer.style.transform = `translate3d(0, ${y * 0.06}px, 0)`;

    items.forEach((el, i) => {
      const speed = parseFloat(el.dataset.speed || "0.3");
      const sway = parseFloat(el.dataset.sway || "16");
      const drift = y * speed * 0.35;
      const wobble = Math.sin(progress * Math.PI * 3 + i * 0.7) * sway;
      el.style.transform = `translate3d(${wobble}px, ${-drift}px, 0) rotate(${wobble * 0.15}deg)`;
    });

    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    },
    { passive: true }
  );
  update();
}

/* ============================================
   PARALLAX BACKGROUND
   ============================================ */
function initParallax() {
  if (isMobile()) return;

  const bg = document.getElementById("bg-parallax");
  let ticking = false;

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        bg.style.transform = `translateY(${y * 0.04}px)`;
        ticking = false;
      });
    },
    { passive: true }
  );
}

/* ============================================
   TIMER LOGIC
   ============================================ */
function pad(n) {
  return String(n).padStart(2, "0");
}

function updateTimer() {
  const now = new Date();
  let diff = Math.max(0, now - RELATIONSHIP_START);

  const seconds = Math.floor(diff / 1000) % 60;
  diff -= seconds * 1000;
  const minutes = Math.floor(diff / (1000 * 60)) % 60;
  diff -= minutes * 60 * 1000;
  const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
  diff -= hours * 60 * 60 * 1000;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  document.getElementById("timer-days").textContent = days.toLocaleString();
  document.getElementById("timer-hours").textContent = pad(hours);
  document.getElementById("timer-minutes").textContent = pad(minutes);

  const secEl = document.getElementById("timer-seconds");
  secEl.textContent = pad(seconds);

  if (seconds !== lastSeconds) {
    lastSeconds = seconds;
    secEl.classList.remove("tick");
    void secEl.offsetWidth;
    secEl.classList.add("tick");
    setTimeout(() => secEl.classList.remove("tick"), 500);
  }
}

/* ============================================
   SCROLL REVEAL ANIMATIONS
   ============================================ */
function initScrollReveal() {
  if (scrollObserver) scrollObserver.disconnect();

  const revealRootMargin = isMobile()
    ? "0px 0px -5% 0px"
    : "0px 0px -8% 0px";

  scrollObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        scrollObserver.unobserve(entry.target);

        if (entry.target.classList.contains("poem-card")) {
          const id = entry.target.dataset.poemId;
          if (id && !typedPoems.has(id)) startTypewriter(entry.target, id);
        }

        if (entry.target.closest("#finale")) {
          entry.target.closest("#finale")?.classList.add("in-view");
        }
      });
    },
    { threshold: isMobile() ? 0.08 : 0.15, rootMargin: revealRootMargin }
  );

  document.querySelectorAll(".reveal:not(.visible)").forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.88) {
      el.classList.add("visible");
    } else {
      scrollObserver.observe(el);
    }
  });
}

function observeNewReveals() {
  document.querySelectorAll(".reveal:not(.visible)").forEach((el) => {
    scrollObserver?.observe(el);
  });
}

/* ============================================
   LETTER GALLERY + MODAL
   ============================================ */
function openLetterModal(letter) {
  const modal = document.getElementById("letter-modal");
  const img = document.getElementById("letter-modal-img");

  img.classList.remove("letter-img-missing");
  if (letter.image) {
    img.src = getAssetPath(letter.image);
    img.dataset.fallbackStep = "0";
    bindLetterImage(img, letter.image);
  } else {
    img.src = "";
  }
  img.alt = letter.title;
  img.style.display = letter.image ? "block" : "none";

  document.getElementById("letter-modal-date").textContent = letter.date;
  document.getElementById("letter-modal-title").textContent = letter.title;
  document.getElementById("letter-modal-caption").textContent = letter.caption;

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLetterModal() {
  const modal = document.getElementById("letter-modal");
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function renderLetters() {
  const grid = document.getElementById("letters-grid");
  grid.innerHTML = "";

  if (LETTERS.length === 0) {
    const empty = document.createElement("p");
    empty.className = "glass-card letters-empty reveal";
    empty.textContent =
      "Add your handwritten letters in script.js — put photos in images/letters/ 💌";
    grid.appendChild(empty);
    return;
  }

  LETTERS.forEach((letter, i) => {
    const card = document.createElement("article");
    card.className = "letter-card glass-card reveal";
    card.style.transitionDelay = `${i * 0.15}s`;

    const thumbSrc = letter.image ? getAssetPath(letter.image) : "";
    const thumbInner = letter.image
      ? `<img class="letter-thumb" src="${thumbSrc}" alt="${letter.title}" loading="lazy" />`
      : `<div class="letter-thumb-placeholder">💌</div>`;

    card.innerHTML = `
      <div class="letter-thumb-wrap">${thumbInner}</div>
      <div class="letter-card-body">
        <span class="letter-card-date">${letter.date}</span>
        <h3 class="letter-card-title">${letter.title}</h3>
        <p class="letter-card-caption">${letter.caption}</p>
      </div>
    `;

    const thumbImg = card.querySelector(".letter-thumb");
    if (thumbImg && letter.image) bindLetterImage(thumbImg, letter.image);

    card.addEventListener("click", () => openLetterModal(letter));
    grid.appendChild(card);
  });
}

/* ============================================
   POEMS — TYPEWRITER REVEAL
   ============================================ */
function renderPoems() {
  const list = document.getElementById("poems-list");
  list.innerHTML = "";

  POEMS.forEach((poem, i) => {
    const card = document.createElement("article");
    card.className = "poem-card reveal";
    card.dataset.poemId = String(i);
    card.style.transitionDelay = `${i * 0.12}s`;
    card.innerHTML = `
      ${poem.title ? `<h3 class="poem-title">${poem.title}</h3>` : ""}
      <p class="poem-body" data-text="${encodeURIComponent(poem.text)}"></p>
    `;
    list.appendChild(card);
  });
}

function startTypewriter(card, id) {
  typedPoems.add(id);
  const body = card.querySelector(".poem-body");
  const text = decodeURIComponent(body.dataset.text || "");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduced) {
    body.textContent = text;
    return;
  }

  body.innerHTML = "";
  const cursor = document.createElement("span");
  cursor.className = "cursor";
  body.appendChild(cursor);

  let i = 0;
  const speed = isMobile() ? 28 : 38;

  function type() {
    if (i < text.length) {
      const ch = text[i];
      body.insertBefore(document.createTextNode(ch), cursor);
      i++;
      setTimeout(type, ch === "\n" ? speed * 4 : speed);
    } else {
      cursor.remove();
    }
  }

  type();
}

/* ============================================
   WHY I LOVE YOU — FLOATING NOTES
   ============================================ */
function renderWhyNotes() {
  const field = document.getElementById("notes-field");
  if (!field) return;
  field.innerHTML = "";

  WHY_I_LOVE.forEach((text, i) => {
    const wrap = document.createElement("div");
    wrap.className = "love-note-wrap reveal";
    wrap.style.transitionDelay = `${(i % 4) * 0.08}s`;

    const note = document.createElement("span");
    note.className = "love-note";
    note.textContent = text;
    note.style.setProperty("--rot", `${-6 + (i % 5) * 3}deg`);
    note.style.animationDelay = `${i * 0.15}s`;

    wrap.appendChild(note);
    field.appendChild(wrap);
  });
}

/* ============================================
   MUSIC CONTROL (YouTube)
   ============================================ */
const YT_VIDEO_ID = "sElE_BfQ67s";
const SOUND_ENABLED_KEY = "love-sound-enabled";

function getMusicURL(unmuted) {
  return `https://www.youtube.com/embed/${YT_VIDEO_ID}?autoplay=1&mute=${unmuted ? 0 : 1}&loop=1&playlist=${YT_VIDEO_ID}&enablejsapi=1&playsinline=1`;
}

function ytPostCommand(func, args = "") {
  const iframe = document.getElementById("yt-player");
  if (!iframe?.contentWindow) return;
  iframe.contentWindow.postMessage(
    JSON.stringify({ event: "command", func, args }),
    "*"
  );
}

/** Unmute + play — must run inside a user tap/click */
function enableMusic() {
  const iframe = document.getElementById("yt-player");
  if (!iframe) return;

  iframe.src = getMusicURL(true);

  setTimeout(() => {
    ytPostCommand("unMute");
    ytPostCommand("playVideo");
  }, 400);

  setTimeout(() => {
    ytPostCommand("unMute");
    ytPostCommand("setVolume", 100);
  }, 900);

  setMusicUI(true);
  sessionStorage.setItem(SOUND_ENABLED_KEY, "true");
  hideSoundUnlock();
}

function setMusicUI(playing) {
  isAudible = playing;
  const btn = document.getElementById("music-btn");
  const btnText = btn?.querySelector(".music-btn-text");
  const bar = document.getElementById("music-bar");
  const status = document.getElementById("music-bar-status");

  if (playing) {
    btn?.classList.add("is-playing");
    btn?.setAttribute("aria-pressed", "true");
    if (btnText) btnText.textContent = "Sound is on 💖";

    if (bar) {
      bar.hidden = false;
      bar.classList.add("is-visible", "is-playing");
    }
    if (status) status.textContent = "is playing";
  } else {
    btn?.classList.remove("is-playing");
    btn?.setAttribute("aria-pressed", "false");
    if (btnText) btnText.textContent = "Turn sound on 💖";

    if (bar) {
      bar.classList.remove("is-playing");
      bar.classList.remove("is-visible");
      setTimeout(() => bar.hidden = true, 500);
    }
    if (status) status.textContent = "paused";
  }
}

function setMusicPlaying(playing) {
  if (playing) {
    enableMusic();
    return;
  }

  const iframe = document.getElementById("yt-player");
  if (iframe) iframe.src = getMusicURL(false);
  ytPostCommand("mute");
  setMusicUI(false);
}

function hideSoundUnlock() {
  const el = document.getElementById("sound-unlock");
  if (!el) return;
  el.classList.remove("is-visible");
  el.hidden = true;
}

function showSoundUnlock() {
  if (sessionStorage.getItem(SOUND_ENABLED_KEY) === "true") return;

  const el = document.getElementById("sound-unlock");
  const btn = document.getElementById("sound-unlock-btn");
  if (!el || !btn) return;

  el.hidden = false;
  requestAnimationFrame(() => el.classList.add("is-visible"));

  const onTap = (e) => {
    e.preventDefault();
    e.stopPropagation();
    enableMusic();
  };

  btn.addEventListener("click", onTap, { once: true });
  el.addEventListener("click", (e) => {
    if (e.target === el) onTap(e);
  }, { once: true });
}

function initMusic() {
  const btn = document.getElementById("music-btn");
  const bar = document.getElementById("music-bar");

  if (sessionStorage.getItem(SOUND_ENABLED_KEY) === "true") {
    setMusicUI(true);
    hideSoundUnlock();
  }

  const toggle = (e) => {
    e?.stopPropagation();
    if (!isAudible) {
      enableMusic();
    } else {
      setMusicPlaying(false);
    }
  };

  btn?.addEventListener("click", toggle);
  bar?.addEventListener("click", toggle);
}

/* ============================================
   HEART CURSOR (desktop only)
   ============================================ */
function initHeartCursor() {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  document.body.classList.add("has-heart-cursor");

  const cursor = document.createElement("span");
  cursor.className = "heart-cursor";
  cursor.textContent = "♥";
  cursor.setAttribute("aria-hidden", "true");

  const trails = [];
  for (let i = 0; i < 4; i++) {
    const t = document.createElement("span");
    t.className = "heart-cursor-trail";
    t.textContent = i % 2 === 0 ? "♡" : "♥";
    t.setAttribute("aria-hidden", "true");
    document.body.appendChild(t);
    trails.push({ el: t, x: 0, y: 0 });
  }
  document.body.appendChild(cursor);

  let mx = 0;
  let my = 0;
  let cx = 0;
  let cy = 0;

  document.addEventListener(
    "mousemove",
    (e) => {
      mx = e.clientX;
      my = e.clientY;
    },
    { passive: true }
  );

  function frame() {
    cx += (mx - cx) * 0.16;
    cy += (my - cy) * 0.16;
    cursor.style.left = `${cx}px`;
    cursor.style.top = `${cy}px`;

    let px = cx;
    let py = cy;
    trails.forEach((t) => {
      t.x += (px - t.x) * 0.22;
      t.y += (py - t.y) * 0.22;
      t.el.style.left = `${t.x}px`;
      t.el.style.top = `${t.y}px`;
      px = t.x;
      py = t.y;
    });

    requestAnimationFrame(frame);
  }
  frame();
}

/* ============================================
   NAV + MODAL + UTILITIES
   ============================================ */
function initNav() {
  document.querySelectorAll('.nav a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelector(link.getAttribute("href"))?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  });
}

function initLetterModal() {
  document.getElementById("letter-modal-close")?.addEventListener("click", closeLetterModal);
  document.getElementById("letter-modal-backdrop")?.addEventListener("click", closeLetterModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLetterModal();
  });
}

function initFinaleObserver() {
  const finale = document.getElementById("finale");
  const obs = new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting) finale.classList.add("in-view");
    },
    { threshold: 0.35 }
  );
  obs.observe(finale);
}

/* ============================================
   INIT
   ============================================ */
function init() {
  initPasswordGate(() => {
    initCurtain();
  });
  initParticles();
  initScrollParallaxHearts();
  initParallax();
  renderPoems();
  renderWhyNotes();
  initMusic();
  initNav();
  initFinaleObserver();
  updateTimer();
  setInterval(updateTimer, 1000);
  initScrollReveal();
  observeNewReveals();
  initHeartCursor();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
