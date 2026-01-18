/* ==========================================================
   ✅ FINAL WORKING PORTFOLIO JS
   - Mobile sidebar fully fixed
   - Smooth scroll correct
   - Overlay works
   - Typing effect
   - Reveal + stagger animations
   - Active navbar highlight
   - Scroll progress bar
   - 3D tilt on projects
   ========================================================== */

/* ✅ Typing Effect */
const roles = ["Frontend Developer", "UI/UX Designer", "JavaScript Learner", "Problem Solver"];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

const typingSpeed = 90;
const deletingSpeed = 50;
const pauseTime = 900;

const typingText = document.getElementById("typingText");

function typeEffect() {
  const currentRole = roles[roleIndex];

  if (!isDeleting) {
    typingText.textContent = currentRole.substring(0, charIndex + 1);
    charIndex++;

    if (charIndex === currentRole.length) {
      isDeleting = true;
      setTimeout(typeEffect, pauseTime);
      return;
    }
  } else {
    typingText.textContent = currentRole.substring(0, charIndex - 1);
    charIndex--;

    if (charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }

  setTimeout(typeEffect, isDeleting ? deletingSpeed : typingSpeed);
}
typeEffect();


/* ✅ Reveal Animation */
const revealElements = document.querySelectorAll(".reveal");

function revealOnScroll() {
  revealElements.forEach((el) => {
    const top = el.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (top < windowHeight - 80) el.classList.add("show");
  });
}
window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);


/* ✅ Stagger Animation */
const staggerContainers = document.querySelectorAll("[data-stagger='true']");

function handleStaggerReveal() {
  staggerContainers.forEach((container) => {
    const children = Array.from(container.children);
    const containerTop = container.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (containerTop < windowHeight - 80) {
      children.forEach((child, index) => {
        child.classList.add("stagger-item");
        setTimeout(() => child.classList.add("show"), index * 120);
      });
    }
  });
}
window.addEventListener("scroll", handleStaggerReveal);
window.addEventListener("load", handleStaggerReveal);


/* ✅ Skills Bar Fill */
const skillFills = document.querySelectorAll(".skill-fill");

function fillSkills() {
  skillFills.forEach((bar) => {
    const barTop = bar.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (barTop < windowHeight - 80) {
      const percent = bar.getAttribute("data-fill");
      bar.style.width = percent + "%";
    }
  });
}
window.addEventListener("scroll", fillSkills);
window.addEventListener("load", fillSkills);


/* ✅ Scroll Progress */
const scrollProgress = document.getElementById("scrollProgress");

function updateProgressBar() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollTop / docHeight) * 100;
  scrollProgress.style.width = progress + "%";
}
window.addEventListener("scroll", updateProgressBar);
window.addEventListener("load", updateProgressBar);


/* ✅ Mobile Sidebar (Final Fix) */
const hamburgerBtn = document.getElementById("hamburgerBtn");
const navLinks = document.getElementById("navLinks");

/* ✅ Overlay create */
const overlay = document.createElement("div");
overlay.className = "mobile-overlay";
document.body.appendChild(overlay);

function openMenu() {
  navLinks.classList.add("active");
  overlay.classList.add("active");
  document.body.classList.add("menu-open");
}

function closeMenu() {
  navLinks.classList.remove("active");
  overlay.classList.remove("active");
  document.body.classList.remove("menu-open");
}

hamburgerBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  if (navLinks.classList.contains("active")) closeMenu();
  else openMenu();
});

/* ✅ close on overlay click */
overlay.addEventListener("click", closeMenu);

/* ✅ close on escape key */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});

/* ✅ Smooth scroll with header offset */
document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", (e) => {
    const targetID = link.getAttribute("href");

    if (targetID.startsWith("#")) {
      e.preventDefault();

      const target = document.querySelector(targetID);
      const headerHeight = document.querySelector(".navbar").offsetHeight;

      closeMenu();

      const pos = target.offsetTop - headerHeight + 8;

      window.scrollTo({
        top: pos,
        behavior: "smooth"
      });
    }
  });
});


/* ✅ Active nav highlight on scroll */
const sections = document.querySelectorAll("main, section, footer");
const navItems = document.querySelectorAll(".nav-links a");

function setActiveNav() {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const scrollY = window.scrollY;

    if (scrollY >= sectionTop - 140) {
      current = section.getAttribute("id");
    }
  });

  navItems.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
}
window.addEventListener("scroll", setActiveNav);
window.addEventListener("load", setActiveNav);


/* ✅ Project Card 3D Tilt Effect (Desktop only) */
const projectCards = document.querySelectorAll(".project-card");

projectCards.forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    if (window.innerWidth < 800) return; // disable on mobile

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / 18) * -1;
    const rotateY = ((x - centerX) / 18);

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "rotateX(0deg) rotateY(0deg)";
  });
});


/* ✅ Dynamic Year */
document.getElementById("year").textContent = new Date().getFullYear();
