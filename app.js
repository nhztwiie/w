const PUBLIC_KEY = "rnOWqMh55RZYvY_WA";
const SERVICE_ID = "service_040502w";
const TEMPLATE_ID = "template_dc22zks";

let manualThemePeriod = null;

document.addEventListener("DOMContentLoaded", () => {
  if (typeof bioData !== 'undefined' && bioData.tabs) {
    renderLinks("social-links-list", bioData.tabs.social);
    renderLinks("work-links-list", bioData.tabs.work);
  }

  initAutoTheme();
  initDeviceSyncClock();
  initMagneticDock();
  initSpotlightAndDroplets();
  initAmbientCanvas();
  initTabNavigation();
  initThemeToggle();
  initQRCodeModal();
  initEmailModal();
  initSpotifyAudioPlayer();
  initEmailJSNotifier();
});

/* ==========================================================
   AUTO-THEME & ĐỒNG HỒ ĐỒNG BỘ CHÍNH XÁC VỚI THỜI GIAN THIẾT BỊ
   ========================================================== */
function getAutoThemeByTime(date = new Date()) {
  const hour = date.getHours();
  return (hour >= 6 && hour < 18) ? "light" : "dark";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const metaTheme = document.getElementById("meta-theme-color");
  if (metaTheme) {
    metaTheme.setAttribute("content", theme === "light" ? "#e9efe7" : "#111317");
  }
}

function initAutoTheme() {
  localStorage.removeItem("ios26-user-overridden");
  localStorage.removeItem("ios26-theme");
  manualThemePeriod = null;
  applyTheme(getAutoThemeByTime(new Date()));
}

function initDeviceSyncClock() {
  const clockEl = document.getElementById("realtime-clock");
  if (!clockEl) return;

  function syncClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    clockEl.textContent = `${hours}:${minutes}:${seconds}`;

    const currentAutoTheme = getAutoThemeByTime(now);
    if (manualThemePeriod && manualThemePeriod !== currentAutoTheme) {
      manualThemePeriod = null;
    }

    if (!manualThemePeriod && document.documentElement.getAttribute("data-theme") !== currentAutoTheme) {
      applyTheme(currentAutoTheme);
    }

    const msUntilNextSecond = 1000 - now.getMilliseconds();
    setTimeout(syncClock, msUntilNextSecond);
  }

  syncClock();
}

/* ==========================================================
   1. APPLE MACOS DOCK (MAGNETIC SPRING MAGNIFICATION)
   ========================================================== */
function initMagneticDock() {
  const dock = document.getElementById("nav-dock");
  const btns = Array.from(dock.querySelectorAll(".nav-tab-btn"));
  if (!dock || !btns.length) return;

  const items = btns.map(btn => ({
    btn,
    icon: btn.querySelector("i"),
    scale: 1,
    targetScale: 1,
    x: 0,
    targetX: 0,
    vScale: 0,
    vX: 0
  }));

  let isHovering = false;
  let animId = null;

  function updatePhysics() {
    let moving = false;
    const stiffness = 0.22;
    const damping = 0.68;

    items.forEach(item => {
      const fScale = (item.targetScale - item.scale) * stiffness;
      item.vScale = (item.vScale + fScale) * damping;
      item.scale += item.vScale;

      const fX = (item.targetX - item.x) * stiffness;
      item.vX = (item.vX + fX) * damping;
      item.x += item.vX;

      if (Math.abs(item.targetScale - item.scale) > 0.001 || Math.abs(item.vScale) > 0.001 ||
          Math.abs(item.targetX - item.x) > 0.01 || Math.abs(item.vX) > 0.01) {
        moving = true;
      } else {
        item.scale = item.targetScale;
        item.x = item.targetX;
      }

      const liftY = -(item.scale - 1) * 14;
      item.icon.style.transform = `translate3d(${item.x.toFixed(2)}px, ${liftY.toFixed(2)}px, 0) scale(${item.scale.toFixed(3)})`;
    });

    if (moving || isHovering) {
      animId = requestAnimationFrame(updatePhysics);
    } else {
      animId = null;
    }
  }

  function resetTargets() {
    isHovering = false;
    items.forEach(item => {
      item.targetScale = 1;
      item.targetX = 0;
    });
    if (!animId) animId = requestAnimationFrame(updatePhysics);
  }

  dock.addEventListener("mousemove", (e) => {
    isHovering = true;
    const maxRange = 135;
    const maxScale = 1.48;

    items.forEach(item => {
      const rect = item.btn.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const dist = e.clientX - center;
      const absDist = Math.abs(dist);

      if (absDist < maxRange) {
        const norm = 1 - absDist / maxRange;
        const ease = Math.cos((1 - norm) * (Math.PI / 2));
        item.targetScale = 1 + (maxScale - 1) * ease;
        item.targetX = -Math.sign(dist) * Math.sin(norm * Math.PI) * 9;
      } else {
        item.targetScale = 1;
        item.targetX = 0;
      }
    });

    if (!animId) animId = requestAnimationFrame(updatePhysics);
  });

  dock.addEventListener("mouseleave", resetTargets);
  btns.forEach(btn => btn.addEventListener("click", resetTargets));
}

/* ==========================================================
   2. CURSOR SPOTLIGHT, BORDER GLOW & LIQUID WATER DROPLETS
   ========================================================== */
function initSpotlightAndDroplets() {
  const mainCard = document.getElementById("main-card");
  if (!mainCard) return;

  mainCard.addEventListener("mousemove", (e) => {
    const rect = mainCard.getBoundingClientRect();
    mainCard.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    mainCard.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  });

  document.addEventListener("mousemove", (e) => {
    const target = e.target.closest(".glass-btn-ios26, .ios26-link-item, .btn-action-item, .btn-download-icon, .player-ctrl-btn");
    if (target) {
      const rect = target.getBoundingClientRect();
      target.style.setProperty("--btn-x", `${e.clientX - rect.left}px`);
      target.style.setProperty("--btn-y", `${e.clientY - rect.top}px`);
    }
  });

  mainCard.addEventListener("pointerdown", (e) => {
    if (e.target.closest("textarea")) return;
    const rect = mainCard.getBoundingClientRect();
    const ripple = document.createElement("span");
    ripple.className = "water-ripple";
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top = `${e.clientY - rect.top}px`;
    mainCard.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove());
  });
}

/* ==========================================================
   3. INTERACTIVE AMBIENT CANVAS (FIREFLIES & FALLING LEAVES)
   ========================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById("ambient-particles");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  const mouse = { x: -9999, y: -9999, active: false };

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });

  window.addEventListener("touchmove", (e) => {
    if (e.touches[0]) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
      mouse.active = true;
    }
  }, { passive: true });

  window.addEventListener("mouseleave", () => { mouse.active = false; });
  window.addEventListener("touchend", () => { mouse.active = false; });

  const LEAF_PALETTES = [
    { main: "#4ade80", edge: "#15803d", vein: "#dcfce7" },
    { main: "#22c55e", edge: "#166534", vein: "#bbf7d0" },
    { main: "#84cc16", edge: "#4d7c0f", vein: "#ecfccb" },
    { main: "#e09f3e", edge: "#b45309", vein: "#fef3c7" },
    { main: "#ea580c", edge: "#9a3412", vein: "#ffedd5" }
  ];

  const isTouchOrMobile = window.matchMedia("(pointer: coarse)").matches || window.innerWidth <= 768;
  const PARTICLE_COUNT = isTouchOrMobile ? 18 : 54;
  const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.45,
    vy: (Math.random() - 0.5) * 0.45,
    radius: Math.random() * 2.3 + 1.5,
    leafSize: Math.random() * 5 + 6.5,
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.025,
    flipPhase: Math.random() * Math.PI * 2,
    flipSpeed: 0.02 + Math.random() * 0.025,
    swayAmp: 0.45 + Math.random() * 0.55,
    phase: Math.random() * Math.PI * 2,
    speed: 0.015 + Math.random() * 0.02,
    swirlDir: Math.random() > 0.5 ? 1 : -1,
    orbitRadius: 28 + Math.random() * 54,
    palette: LEAF_PALETTES[Math.floor(Math.random() * LEAF_PALETTES.length)]
  }));

  function drawNaturalLeaf(p, alpha) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);

    const tiltScale = 0.55 + 0.45 * Math.abs(Math.cos(p.flipPhase));
    ctx.scale(1, tiltScale);

    const s = p.leafSize;
    ctx.globalAlpha = Math.min(0.95, alpha + 0.25);

    if (!isTouchOrMobile) {
      ctx.shadowColor = "rgba(20, 31, 22, 0.16)";
      ctx.shadowBlur = 6;
      ctx.shadowOffsetY = 3;
    }

    const grad = ctx.createLinearGradient(-s, -s * 0.5, s, s * 0.5);
    grad.addColorStop(0, p.palette.main);
    grad.addColorStop(1, p.palette.edge);
    ctx.fillStyle = grad;

    ctx.beginPath();
    ctx.moveTo(-s * 1.15, 0);
    ctx.bezierCurveTo(-s * 0.45, -s * 0.85, s * 0.45, -s * 0.75, s * 1.2, 0);
    ctx.bezierCurveTo(s * 0.45, s * 0.75, -s * 0.45, s * 0.85, -s * 1.15, 0);
    ctx.closePath();
    ctx.fill();

    ctx.shadowColor = "transparent";

    ctx.strokeStyle = p.palette.edge;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-s * 1.15, 0);
    ctx.quadraticCurveTo(-s * 1.45, s * 0.15, -s * 1.6, s * 0.25);
    ctx.stroke();

    ctx.strokeStyle = p.palette.vein;
    ctx.lineWidth = 0.65;
    ctx.globalAlpha = Math.min(0.75, alpha * 0.8);
    ctx.beginPath();
    ctx.moveTo(-s * 1.05, 0);
    ctx.lineTo(s * 1.0, 0);
    ctx.moveTo(-s * 0.3, 0);
    ctx.lineTo(s * 0.1, -s * 0.35);
    ctx.moveTo(-s * 0.3, 0);
    ctx.lineTo(s * 0.1, s * 0.35);
    ctx.moveTo(s * 0.2, 0);
    ctx.lineTo(s * 0.55, -s * 0.28);
    ctx.moveTo(s * 0.2, 0);
    ctx.lineTo(s * 0.55, s * 0.28);
    ctx.stroke();

    ctx.restore();
  }

  let lastFrameTime = 0;
  const frameInterval = isTouchOrMobile ? (1000 / 30) : 0;

  function animate(now = 0) {
    requestAnimationFrame(animate);

    if (document.hidden) return;
    if (frameInterval && (now - lastFrameTime) < frameInterval) return;
    lastFrameTime = now;

    ctx.clearRect(0, 0, width, height);
    const isLight = document.documentElement.getAttribute("data-theme") === "light";

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.phase += p.speed;
      p.flipPhase += p.flipSpeed;
      let proximityBoost = 0;

      if (mouse.active) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.hypot(dx, dy);
        const influenceRadius = 250;

        if (dist < influenceRadius && dist > 1) {
          const norm = 1 - dist / influenceRadius;
          proximityBoost = norm * 0.5;
          const nx = dx / dist;
          const ny = dy / dist;

          if (dist > p.orbitRadius) {
            const pull = norm * norm * 0.085;
            p.vx += nx * pull;
            p.vy += ny * pull;
          } else {
            const repel = (1 - dist / p.orbitRadius) * 0.038;
            p.vx -= nx * repel;
            p.vy -= ny * repel;
          }

          const swirl = norm * 0.045 * p.swirlDir;
          p.vx += -ny * swirl;
          p.vy += nx * swirl;
          p.rotation += p.rotSpeed * (1 + norm * 2.2);
        }
      }

      p.vx *= 0.965;
      p.vy *= 0.965;

      if (isLight) {
        const windSway = Math.sin(p.phase * 1.2) * p.swayAmp;
        p.x += p.vx + windSway;
        p.y += p.vy + 0.55 + Math.cos(p.phase) * 0.15;
        p.rotation += p.rotSpeed + windSway * 0.02;
      } else {
        p.x += p.vx + Math.sin(p.phase) * 0.28;
        p.y += p.vy - 0.16 + Math.cos(p.phase * 0.8) * 0.14;
      }

      if (p.x < -30) p.x = width + 30;
      if (p.x > width + 30) p.x = -30;
      if (p.y < -30) p.y = height + 30;
      if (p.y > height + 30) p.y = -30;

      const basePulse = 0.55 + Math.sin(p.phase * 1.4) * 0.3;
      const finalAlpha = Math.min(1, basePulse + proximityBoost);

      if (isLight) {
        drawNaturalLeaf(p, finalAlpha);
      } else {
        const dynamicRadius = p.radius * (1 + proximityBoost * 0.35);
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, dynamicRadius * 4.2);
        glow.addColorStop(0, `rgba(255, 252, 225, ${finalAlpha})`);
        glow.addColorStop(0.4, `rgba(253, 224, 71, ${finalAlpha * 0.45})`);
        glow.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, dynamicRadius * 4.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  animate();
}

/* ==========================================================
   4. CROSS-FADE & GLASS BLUR THEME TOGGLE
   ========================================================== */
function initThemeToggle() {
  const toggle = document.getElementById("theme-toggle");
  const mainCard = document.getElementById("main-card");

  toggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";

    manualThemePeriod = getAutoThemeByTime(new Date());
    mainCard.classList.add("theme-transitioning");

    setTimeout(() => {
      applyTheme(newTheme);

      setTimeout(() => {
        mainCard.classList.remove("theme-transitioning");
      }, 50);
    }, 250);
  });
}

/* ==========================================================
   5. SPRING TAB NAVIGATION & STATE SYNC
   ========================================================== */
function initTabNavigation() {
  const navBtns = document.querySelectorAll(".nav-tab-btn");
  const indicator = document.getElementById("nav-indicator");
  const viewport = document.getElementById("viewport");
  const mainCard = document.getElementById("main-card");
  const tabPages = document.querySelectorAll(".tab-page");

  const topBarEl = document.querySelector(".top-bar");
  const bottomNavEl = document.querySelector(".bottom-nav-container");
  const profileHeaderEl = document.querySelector(".profile-header");

  function adjustCardHeight(index) {
    requestAnimationFrame(() => {
      const topBarH = topBarEl ? topBarEl.offsetHeight : 0;
      const headerH = profileHeaderEl ? profileHeaderEl.offsetHeight : 0;
      const navH = bottomNavEl ? bottomNavEl.offsetHeight : 0;
      const currentTabPage = tabPages[index];
      const contentH = currentTabPage ? currentTabPage.scrollHeight : 0;

      mainCard.style.height = `${topBarH + headerH + contentH + navH}px`;
    });
  }

  function switchTab(index) {
    viewport.style.transform = `translate3d(-${index * 33.3333}%, 0, 0)`;

    const activeBtn = navBtns[index];
    if (activeBtn && indicator) {
      indicator.style.transform = `translate3d(${activeBtn.offsetLeft - 6}px, 0, 0)`;
    }

    navBtns.forEach((btn, i) => btn.classList.toggle("active", i === index));
    tabPages.forEach((page, i) => page.classList.toggle("active-tab", i === index));

    if (index === 1) {
      mainCard.classList.remove("compact-mode");
    } else {
      mainCard.classList.add("compact-mode");
    }

    adjustCardHeight(index);
  }

  navBtns.forEach((btn, i) => {
    btn.addEventListener("click", () => switchTab(i));
  });

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const activeBtn = document.querySelector(".nav-tab-btn.active");
      if (activeBtn) {
        switchTab(parseInt(activeBtn.getAttribute("data-index") || "1", 10));
      }
    }, 100);
  });

  requestAnimationFrame(() => switchTab(1));
}

function renderLinks(containerId, items) {
  const container = document.getElementById(containerId);
  if (!container || !Array.isArray(items)) return;

  const fragment = document.createDocumentFragment();
  items.forEach((item) => {
    const a = document.createElement('a');
    a.href = item.url || '#';
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.className = "ios26-link-item";
    a.innerHTML = `
      <img src="${item.icon}" alt="${item.title}" class="link-icon" loading="lazy">
      <span class="link-label">${item.title}</span>
      <i class="fa-solid fa-chevron-right link-arrow"></i>
    `;
    fragment.appendChild(a);
  });

  container.innerHTML = '';
  container.appendChild(fragment);
}

/* ==========================================================
   6. MODALS, EMAILJS & SPOTIFY / GAINNODE MUSIC PLAYER
   ========================================================== */
function initQRCodeModal() {
  const openBtn = document.getElementById("open-qr-btn");
  const closeBtn = document.getElementById("close-qr-btn");
  const modal = document.getElementById("qr-modal");
  const qrCanvas = document.getElementById("qrcode-canvas");
  const copyBtn = document.getElementById("copy-btn");
  const copyText = document.getElementById("copy-text");
  const downloadBtn = document.getElementById("download-qr-btn");

  const shareUrl = (typeof bioData !== 'undefined' && bioData.profile && bioData.profile.shareUrl)
    ? bioData.profile.shareUrl
    : window.location.href;
  let qrGenerated = false;

  function openModal() {
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    if (!qrGenerated) {
      new QRCode(qrCanvas, {
        text: shareUrl,
        width: 156,
        height: 156,
        colorDark: "#08090a",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });
      qrGenerated = true;
    }
  }

  function closeModal() {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
  }

  openBtn.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });

  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      copyText.textContent = "Copied!";
      copyBtn.style.background = "#22c55e";
      setTimeout(() => {
        copyText.textContent = "Copy link";
        copyBtn.style.background = "rgba(255, 255, 255, 0.15)";
      }, 2000);
    }).catch(() => {
      copyText.textContent = "Error!";
    });
  });

  downloadBtn.addEventListener("click", () => {
    const link = document.createElement('a');
    link.download = 'w.bio_qr';
    link.href = 'images/w.bio_qr.png';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}

function getDeviceAndLocationInfo() {
  const ua = navigator.userAgent;
  let vendor = "Chưa xác định hãng";
  let model = "Thiết bị không xác định";
  let os = "Hệ điều hành không xác định";
  let deviceType = "Desktop/Laptop";

  const isMobile = /mobile/i.test(ua);
  const isTablet = /tablet|ipad|playbook|silk/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (isTablet) deviceType = "Tablet";
  else if (isMobile) deviceType = "Mobile";

  if (/android/i.test(ua)) {
    const osMatch = ua.match(/Android\s+([\d.]+)/i);
    os = `Android ${osMatch ? osMatch[1] : ''}`;
  } else if (/iphone|ipad|ipod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
    const osMatch = ua.match(/OS\s+([\d_]+)/i);
    os = `iOS / iPadOS ${osMatch ? osMatch[1].replace(/_/g, '.') : ''}`;
  } else if (/windows nt/i.test(ua)) {
    os = /windows nt 10.0/i.test(ua) ? "Windows 10 / 11" : "Windows PC";
  } else if (/macintosh|mac os x/i.test(ua)) {
    const osMatch = ua.match(/Mac OS X\s+([\d_]+)/i);
    os = `macOS ${osMatch ? osMatch[1].replace(/_/g, '.') : ''}`;
  } else if (/cros/i.test(ua)) os = "ChromeOS";
  else if (/linux/i.test(ua)) os = "Linux";

  if (/android/i.test(ua)) {
    if (/samsung|SM-/i.test(ua)) {
      vendor = "Samsung";
      const match = ua.match(/SM-[A-Z0-9]+/i);
      model = match ? match[0] : "Samsung Galaxy";
    } else if (/xiaomi|redmi|poco/i.test(ua)) {
      vendor = "Xiaomi";
      model = "Xiaomi Device";
    } else if (/oppo|CPH\d+/i.test(ua)) {
      vendor = "OPPO";
      model = "OPPO Device";
    } else if (/vivo|V2\d+/i.test(ua)) {
      vendor = "Vivo";
      model = "Vivo Device";
    }
  } else if (/iphone|ipad|ipod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
    vendor = "Apple";
    model = (/ipad/i.test(ua) || navigator.maxTouchPoints > 1) ? "iPad" : "iPhone";
  } else if (/macintosh/i.test(ua)) {
    vendor = "Apple";
    model = "Mac / MacBook";
  }

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Ho_Chi_Minh";
  const language = navigator.language || "vi-VN";
  const location = (timeZone.includes("Ho_Chi_Minh") || timeZone.includes("Bangkok"))
    ? `Việt Nam (${timeZone})`
    : `Timezone: ${timeZone} | Ngôn ngữ: ${language}`;

  return {
    device: `Mã/Tên: ${model} | Hãng: ${vendor} | Hệ điều hành: ${os} (${deviceType})`,
    location
  };
}

function initEmailJSNotifier() {
  if (PUBLIC_KEY === "THAY_PUBLIC_KEY_CUA_BAN" || typeof emailjs === "undefined") return;
  emailjs.init(PUBLIC_KEY);

  if (!sessionStorage.getItem("email_notified")) {
    setTimeout(() => {
      if (sessionStorage.getItem("email_notified")) return;
      const { device, location } = getDeviceAndLocationInfo();
      emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        time: new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }),
        device,
        location,
        message: "[System] New visitor access on your personal web page w.bio (No message left).",
        referrer: document.referrer || "Direct Access"
      }).then(() => sessionStorage.setItem("email_notified", "true"))
        .catch(err => console.error("Error sending email:", err));
    }, 3000);
  }
}

function initEmailModal() {
  const openBtn = document.getElementById("open-email-modal-btn");
  const closeBtn = document.getElementById("close-email-modal-btn");
  const modal = document.getElementById("email-modal");
  const sendBtn = document.getElementById("send-instant-email-btn");
  const sendBtnText = document.getElementById("send-btn-text");
  const messageInput = document.getElementById("visitor-message");

  function openModal() {
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeModal() {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    messageInput.value = "";
  }

  openBtn.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });

  sendBtn.addEventListener("click", () => {
    const userMsg = messageInput.value.trim();
    if (!userMsg) {
      alert("Please enter your message!");
      return;
    }

    sendBtnText.textContent = "Sending...";
    sendBtn.style.opacity = "0.7";
    sessionStorage.setItem("email_notified", "true");

    const { device, location } = getDeviceAndLocationInfo();
    emailjs.send(SERVICE_ID, TEMPLATE_ID, {
      time: new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }),
      device,
      location,
      message: userMsg,
      referrer: "Instant Message Pop-up (Web Form)"
    }).then(() => {
      sendBtnText.textContent = "Sent Successfully!";
      sendBtn.style.background = "#22c55e";
      setTimeout(() => {
        closeModal();
        sendBtnText.textContent = "Send";
        sendBtn.style.background = "rgba(255, 255, 255, 0.15)";
        sendBtn.style.opacity = "1";
      }, 1500);
    }).catch(() => {
      sendBtnText.textContent = "Send Failed!";
      setTimeout(() => {
        sendBtnText.textContent = "Send";
        sendBtn.style.opacity = "1";
      }, 2000);
    });
  });
}

/* ==========================================================
   TRÌNH PHÁT NHẠC KIỂU SPOTIFY & GAINNODE TĂNG CƯỜNG ÂM LƯỢNG (neungayay.mp3)
   ========================================================== */
function initSpotifyAudioPlayer() {
  const openModalBtn = document.getElementById("open-music-modal-btn");
  const closeModalBtn = document.getElementById("close-music-modal-btn");
  const musicModal = document.getElementById("music-modal");
  const musicModalCard = document.getElementById("music-modal-card");
  const mainMusicBtn = document.getElementById("open-music-modal-btn");
  const musicMainIcon = document.getElementById("music-main-icon");

  const playBtn = document.getElementById("modal-play-btn");
  const playIcon = document.getElementById("modal-play-icon");
  const rewindBtn = document.getElementById("modal-rewind-btn");
  const forwardBtn = document.getElementById("modal-forward-btn");
  const vinylRecord = document.getElementById("vinyl-record");

  const seekSlider = document.getElementById("seek-slider");
  const seekFill = document.getElementById("seek-fill");
  const volumeSlider = document.getElementById("volume-slider");
  const volumeFill = document.getElementById("volume-fill");
  const volumeIcon = document.getElementById("volume-icon");
  const currentTimeLbl = document.getElementById("current-time-lbl");
  const durationLbl = document.getElementById("duration-lbl");

  let audioCtx = null;
  let audioBuffer = null;
  let sourceNode = null;
  let gainNode = null;

  let isPlaying = false;
  let isLoaded = false;
  let isLooping = true;

  let startTime = 0;
  let pauseOffset = 0;
  let duration = 0;
  let animFrameId = null;
  let noteIntervalId = null;

  let activeFloatingNotes = [];
  let notesAnimFrameId = null;
  let noteLaneIndex = 0;

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  function openModal() {
    musicModal.classList.add("active");
    musicModal.setAttribute("aria-hidden", "false");
  }

  function closeModal() {
    musicModal.classList.remove("active");
    musicModal.setAttribute("aria-hidden", "true");
  }

  openModalBtn.addEventListener("click", openModal);
  closeModalBtn.addEventListener("click", closeModal);
  musicModal.addEventListener("click", (e) => { if (e.target === musicModal) closeModal(); });

  /* ==========================================================
     HỆ THỐNG NỐT NHẠC, PIANO & VIOLIN BAY TỪ DƯỚI POP-UP VÀ BỊ HÚT VÀO ĐĨA THAN
     ========================================================== */
  const symbols = ["𝄞", "♩", "♪", "♫", "♬", "🎹", "🎻"];
  const spawnLanes = [
    [0.14, 0.32],
    [0.42, 0.58],
    [0.68, 0.86]
  ];

  function spawnFloatingNote() {
    if (!isPlaying) return;

    const cardW = musicModalCard.offsetWidth || 360;
    const cardH = musicModalCard.offsetHeight || 520;

    const targetX = vinylRecord.offsetParent
      ? (vinylRecord.offsetParent.offsetLeft + vinylRecord.offsetLeft + vinylRecord.offsetWidth / 2)
      : (cardW / 2);
    const targetY = vinylRecord.offsetParent
      ? (vinylRecord.offsetParent.offsetTop + vinylRecord.offsetTop + vinylRecord.offsetHeight / 2)
      : 120;

    const el = document.createElement("span");
    el.className = "floating-music-note";
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];

    const lane = spawnLanes[noteLaneIndex % spawnLanes.length];
    noteLaneIndex++;

    const startX = (lane[0] + Math.random() * (lane[1] - lane[0])) * cardW;
    const startY = cardH + 14;

    const sideDir = startX < targetX ? -1 : (startX > targetX ? 1 : (Math.random() > 0.5 ? 1 : -1));
    const initVx = sideDir * (0.35 + Math.random() * 0.55);
    const initVy = -(1.55 + Math.random() * 0.45);

    musicModalCard.appendChild(el);

    const noteObj = {
      element: el,
      x: startX,
      y: startY,
      vx: initVx,
      vy: initVy,
      targetX,
      targetY,
      swirlDir: sideDir,
      swayPhase: Math.random() * Math.PI * 2,
      swaySpeed: 0.045 + Math.random() * 0.025,
      rotation: (Math.random() - 0.5) * 28,
      rotSpeed: (Math.random() - 0.5) * 1.4,
      opacity: 0,
      maxOpacity: 0.48 + Math.random() * 0.22,
      scale: 0.45,
      baseScale: 0.85 + Math.random() * 0.3,
      life: 0,
      isFadingOut: false
    };

    activeFloatingNotes.push(noteObj);
  }

  function updateFloatingNotesLoop() {
    for (let i = activeFloatingNotes.length - 1; i >= 0; i--) {
      const n = activeFloatingNotes[i];
      n.life++;
      n.swayPhase += n.swaySpeed;

      const dx = n.targetX - n.x;
      const dy = n.targetY - n.y;
      const dist = Math.hypot(dx, dy);

      if (!n.isFadingOut) {
        const pullZone = 270;
        const pullStrength = dist < pullZone ? Math.pow(1 - dist / pullZone, 1.45) : 0;

        if (dist > 1) {
          const nx = dx / dist;
          const ny = dy / dist;

          const suctionForce = 0.045 + pullStrength * 0.34;
          n.vx += nx * suctionForce;
          n.vy += ny * suctionForce;

          const vortexForce = pullStrength * 0.14;
          n.vx += -ny * vortexForce;
          n.vy += nx * vortexForce;
        }

        const drag = 0.962 - pullStrength * 0.045;
        n.vx *= drag;
        n.vy *= drag;

        const waveX = Math.cos(n.swayPhase) * 0.35 * (1 - pullStrength);
        n.x += n.vx + waveX;
        n.y += n.vy;

        n.rotation += n.rotSpeed + pullStrength * 5.2;

        if (n.life < 28) {
          const fadeIn = n.life / 28;
          n.opacity = fadeIn * n.maxOpacity;
          n.scale = 0.45 + fadeIn * (n.baseScale - 0.45);
        } else if (dist < 95) {
          const absorbRatio = Math.max(0, (dist - 12) / 83);
          n.opacity = absorbRatio * n.maxOpacity;
          n.scale = Math.max(0.08, absorbRatio * n.baseScale);
        } else {
          n.opacity = n.maxOpacity;
          n.scale = n.baseScale;
        }

        if (dist <= 14 || n.life > 420) {
          n.element.remove();
          activeFloatingNotes.splice(i, 1);
          continue;
        }
      } else {
        n.x += n.vx;
        n.y += n.vy;
        n.opacity -= 0.025;
        n.scale *= 0.96;
        if (n.opacity <= 0) {
          n.element.remove();
          activeFloatingNotes.splice(i, 1);
          continue;
        }
      }

      n.element.style.opacity = Math.max(0, n.opacity).toFixed(3);
      n.element.style.transform = `translate3d(${n.x.toFixed(1)}px, ${n.y.toFixed(1)}px, 0) translate(-50%, -50%) scale(${n.scale.toFixed(3)}) rotate(${n.rotation.toFixed(1)}deg)`;
    }

    if (isPlaying || activeFloatingNotes.length > 0) {
      notesAnimFrameId = requestAnimationFrame(updateFloatingNotesLoop);
    } else {
      notesAnimFrameId = null;
    }
  }

  async function loadAudioFile() {
    if (isLoaded) return;
    try {
      const response = await fetch("audio/neungayay.mp3");
      const arrayBuffer = await response.arrayBuffer();
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
      duration = audioBuffer.duration;
      durationLbl.textContent = formatTime(duration);
      seekSlider.max = duration;
      isLoaded = true;
    } catch (e) {
      console.error("Lỗi tải tệp âm thanh neungayay.mp3:", e);
    }
  }

  function updateUIState(playing) {
    if (playing) {
      playIcon.className = "fa-solid fa-pause";
      vinylRecord.classList.add("spinning");
      mainMusicBtn.classList.add("playing");
      musicMainIcon.className = "fa-solid fa-compact-disc";

      if (!noteIntervalId) {
        spawnFloatingNote();
        noteIntervalId = setInterval(spawnFloatingNote, 780);
      }
      if (!notesAnimFrameId) {
        notesAnimFrameId = requestAnimationFrame(updateFloatingNotesLoop);
      }
    } else {
      playIcon.className = "fa-solid fa-play";
      vinylRecord.classList.remove("spinning");
      mainMusicBtn.classList.remove("playing");
      musicMainIcon.className = "fa-solid fa-music";

      if (noteIntervalId) {
        clearInterval(noteIntervalId);
        noteIntervalId = null;
      }

      activeFloatingNotes.forEach(n => {
        n.isFadingOut = true;
      });
    }
  }

  function updateVolumeIcon(vol) {
    if (vol === 0) {
      volumeIcon.className = "fa-solid fa-volume-off";
    } else if (vol <= 1.0) {
      volumeIcon.className = "fa-solid fa-volume-low";
    } else {
      volumeIcon.className = "fa-solid fa-volume-high";
    }
  }

  function playSound(offset = 0) {
    if (!isLoaded || !audioBuffer) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    if (sourceNode) { try { sourceNode.stop(); } catch(e) {} }

    sourceNode = audioCtx.createBufferSource();
    sourceNode.buffer = audioBuffer;
    sourceNode.loop = isLooping;

    gainNode = audioCtx.createGain();
    const currentVol = parseFloat(volumeSlider.value);
    gainNode.gain.value = currentVol;
    updateVolumeIcon(currentVol);

    sourceNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    sourceNode.onended = () => {
      if (!isLooping && isPlaying && (audioCtx.currentTime - startTime >= duration)) {
        stopSound();
        pauseOffset = 0;
        seekSlider.value = 0;
        seekFill.style.width = "0%";
        currentTimeLbl.textContent = "00:00";
      }
    };

    sourceNode.start(0, offset);
    startTime = audioCtx.currentTime - offset;
    isPlaying = true;
    updateUIState(true);
    trackProgress();
  }

  function stopSound() {
    if (sourceNode) {
      try {
        pauseOffset = (audioCtx.currentTime - startTime) % duration;
        sourceNode.stop();
      } catch(e) {}
      sourceNode = null;
    }
    isPlaying = false;
    updateUIState(false);
    if (animFrameId) cancelAnimationFrame(animFrameId);
  }

  function trackProgress() {
    if (!isPlaying) return;
    const currentPos = (audioCtx.currentTime - startTime) % duration;
    seekSlider.value = currentPos;
    seekFill.style.width = `${(currentPos / duration) * 100}%`;
    currentTimeLbl.textContent = formatTime(currentPos);
    animFrameId = requestAnimationFrame(trackProgress);
  }

  playBtn.addEventListener("click", async () => {
    if (!isLoaded) await loadAudioFile();
    if (!isLoaded) return;

    if (isPlaying) {
      stopSound();
    } else {
      playSound(pauseOffset);
    }
  });

  rewindBtn.addEventListener("click", () => {
    if (!isLoaded) return;
    let currentPos = isPlaying ? (audioCtx.currentTime - startTime) % duration : pauseOffset;
    currentPos = Math.max(0, currentPos - 5);
    pauseOffset = currentPos;
    seekSlider.value = currentPos;
    seekFill.style.width = `${(currentPos / duration) * 100}%`;
    currentTimeLbl.textContent = formatTime(currentPos);
    if (isPlaying) {
      playSound(pauseOffset);
    }
  });

  forwardBtn.addEventListener("click", () => {
    if (!isLoaded) return;
    let currentPos = isPlaying ? (audioCtx.currentTime - startTime) % duration : pauseOffset;
    currentPos = Math.min(duration, currentPos + 5);
    pauseOffset = currentPos;
    seekSlider.value = currentPos;
    seekFill.style.width = `${(currentPos / duration) * 100}%`;
    currentTimeLbl.textContent = formatTime(currentPos);
    if (isPlaying) {
      playSound(pauseOffset);
    }
  });

  seekSlider.addEventListener("input", (e) => {
    const val = parseFloat(e.target.value);
    seekFill.style.width = `${(val / duration) * 100}%`;
    currentTimeLbl.textContent = formatTime(val);
    pauseOffset = val;
    if (isPlaying) {
      playSound(pauseOffset);
    }
  });

  volumeSlider.addEventListener("input", (e) => {
    const vol = parseFloat(e.target.value);
    if (gainNode) {
      gainNode.gain.value = vol;
    }
    volumeFill.style.width = `${(vol / 2.5) * 100}%`;
    updateVolumeIcon(vol);
  });

  volumeFill.style.width = `${(1.0 / 2.5) * 100}%`;

  loadAudioFile();
}
