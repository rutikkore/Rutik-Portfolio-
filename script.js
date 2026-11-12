/* ==========================================================================
   PREMIUM PORTFOLIO INTERACTION ENGINE
   - Lenis Smooth Scroll
   - GSAP & ScrollTrigger Choreography
   - Custom Follower Cursor & Spotlight Parallax
   - Magnetic Web Elements
   - EmailJS Submission Form
   ========================================================================== */

window.addEventListener('load', () => {
  document.body.classList.add('loaded');
  if (typeof window.heroEntrance === 'function') {
    window.heroEntrance();
  }
});

// 0. EmailJS Configuration placeholders
const EMAILJS_SERVICE_ID = 'service_6v72yzo';
const EMAILJS_TEMPLATE_ID = 'template_vjuwsnk';
const EMAILJS_PUBLIC_KEY = 'bjgzGjzTp3k2DkbWI';

// 1. Scroll Restoration
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.addEventListener('load', () => {
  window.scrollTo(0, 0);
});

// Expose heroEntrance globally for the loader sequence
window.heroEntrance = function () {
  // 1. Prepare the title by wrapping each character in a span for split effect
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    const text = heroTitle.textContent.trim();
    const words = text.split(' ');
    heroTitle.innerHTML = words.map(word => {
      const chars = word.split('').map(char => {
        return `<span class="char-wrapper" style="display: inline-block; overflow: hidden; vertical-align: bottom;"><span class="char" style="display: inline-block; transform: translateY(80px); opacity: 0;">${char}</span></span>`;
      }).join('');
      return `<span class="word-wrapper" style="display: inline-block; white-space: nowrap;">${chars}</span>`;
    }).join('<span class="char-space" style="display: inline-block;">&nbsp;</span>');
  }

  // 2. Set initial states via GSAP (guarantees properties are registered in GSAP)
  gsap.set('.hero-content .label-mono', { y: 20, opacity: 0 });
  gsap.set('.hero-title', { opacity: 1 }); // Reveal heading container (chars are translateY(80) / opacity 0)
  gsap.set('.hero-tagline', { y: 20, opacity: 0 });
  gsap.set('.hero-actions', { y: 15, opacity: 0 });
  
  // Also set initial states for other hero elements to align with overall entrance
  gsap.set('#header', { y: -30, opacity: 0 });
  gsap.set('#heroPortrait img', { scale: 1.2, rotateY: -15, opacity: 0 });
  gsap.set('.ticker-container', { y: 15, opacity: 0 });

  const tl = gsap.timeline({
    defaults: { ease: 'power4.out' }
  });

  // Force ScrollTrigger refresh
  ScrollTrigger.refresh();

  // 3. Cinematic Entrance Sequence (completed in under 2 seconds total)
  tl.to('#header', {
    y: 0,
    opacity: 1,
    duration: 0.8
  })
  .to('.hero-content .label-mono', {
    y: 0,
    opacity: 1,
    duration: 0.5
  }, '-=0.6')
  .to('.hero-title .char', {
    y: 0,
    opacity: 1,
    duration: 0.6,
    stagger: 0.03
  }, '-=0.4')
  .to('.hero-tagline', {
    y: 0,
    opacity: 1,
    duration: 0.5
  }, '-=0.3')
  .to('.hero-actions', {
    y: 0,
    opacity: 1,
    duration: 0.5
  }, '-=0.3')
  .to('#heroPortrait img', {
    scale: 1,
    rotateY: 0,
    opacity: 1,
    duration: 1.0
  }, '-=0.9')
  .to('.ticker-container', {
    y: 0,
    opacity: 1,
    duration: 0.8
  }, '-=0.8');
};

// 2. Lenis Smooth Scroll Initialization
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth easeOutExpo
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
});


// Connect ScrollTrigger to Lenis update cycle
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// 3. Mouse-Responsive Spotlight tracking
const spotlight = document.getElementById('spotlight');
document.addEventListener('mousemove', (e) => {
  if (spotlight) {
    gsap.to(spotlight, {
      left: e.clientX,
      top: e.clientY,
      duration: 0.8,
      ease: 'power2.out'
    });
  }
});

// 4. Custom Follower Cursor Logic
const cursor = document.getElementById('customCursor');
const cursorFollower = document.getElementById('customCursorFollower');
let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;
let isTouchDevice = false;

// Check if touch device
if (window.matchMedia("(pointer: coarse)").matches || 'ontouchstart' in window) {
  isTouchDevice = true;
  document.body.classList.add('touch-device');
}

if (!isTouchDevice && cursor && cursorFollower) {
  // Set initial GSAP centering transforms for both dot and ring
  gsap.set(cursor, { xPercent: -50, yPercent: -50 });
  gsap.set(cursorFollower, { xPercent: -50, yPercent: -50 });

  // Update mouse positions instantly
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Dot position updates instantly with 0 lag using gsap.set
    gsap.set(cursor, { x: mouseX, y: mouseY });
  });

  // Lerp for the ring position (lerp factor 0.12)
  function tickCursor() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    
    gsap.set(cursorFollower, { x: ringX, y: ringY });
    requestAnimationFrame(tickCursor);
  }
  requestAnimationFrame(tickCursor);

  // Set Hover State helper
  function setCursorState(state) {
    cursor.classList.remove('hover-links', 'hover-projects', 'hover-inputs');
    cursorFollower.classList.remove('hover-links', 'hover-projects', 'hover-inputs');
    if (state) {
      cursor.classList.add(state);
      cursorFollower.classList.add(state);
    }
  }

  // Event delegation on mouseover for robust hover states
  document.addEventListener('mouseover', (e) => {
    const target = e.target;
    if (!target) return;

    if (target.closest('input, textarea')) {
      setCursorState('hover-inputs');
    } else if (target.closest('a, button, .btn-magnetic')) {
      setCursorState('hover-links');
    } else if (target.closest('.hover-trigger-view, .case-study-visual, .browser-mockup')) {
      setCursorState('hover-projects');
    } else {
      setCursorState(null);
    }
  });

  // Fade out cursor when mouse leaves window and fade in when it enters
  document.addEventListener('mouseleave', () => {
    gsap.to([cursor, cursorFollower], { opacity: 0, duration: 0.3 });
  });

  document.addEventListener('mouseenter', () => {
    gsap.to([cursor, cursorFollower], { opacity: 1, duration: 0.3 });
  });
}

// 5. Magnetic Buttons Physics Engine
if (window.matchMedia("(pointer: fine)").matches) {
  const magneticElements = document.querySelectorAll('.btn-magnetic');
  
  magneticElements.forEach((el) => {
    const btnText = el.querySelector('.btn-text') || el;
    
    // Create GSAP quickSetters for high performance on mousemove
    const setBtnX = gsap.quickSetter(el, "x", "px");
    const setBtnY = gsap.quickSetter(el, "y", "px");
    const setTextX = gsap.quickSetter(btnText, "x", "px");
    const setTextY = gsap.quickSetter(btnText, "y", "px");
    
    let isHovering = false;
    
    document.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      
      // Calculate button center
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Distance from cursor to button center
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distance = Math.hypot(deltaX, deltaY);
      
      // Define hover boundary: 80px from button outer edge
      const hoverRadius = rect.width / 2 + 80;
      
      if (distance < hoverRadius) {
        isHovering = true;
        
        // Kill any active spring-back tweens to prevent clashing
        gsap.killTweensOf([el, btnText]);
        
        // Strength scales from 1 (center) to 0 (boundary edge)
        const strength = (hoverRadius - distance) / hoverRadius;
        
        // Maximum displacement: 20px for button, 10px (half) for text inside
        const targetX = deltaX * 0.25 * strength;
        const targetY = deltaY * 0.25 * strength;
        
        // Bound displacements to max 20px
        const boundedX = Math.min(20, Math.max(-20, targetX));
        const boundedY = Math.min(20, Math.max(-20, targetY));
        
        // Set positions instantly with 0 lag using quickSetter
        setBtnX(boundedX);
        setBtnY(boundedY);
        setTextX(boundedX * 0.5);
        setTextY(boundedY * 0.5);
      } else {
        if (isHovering) {
          isHovering = false;
          
          // Spring back to center using elastic.out(1, 0.4) ease
          gsap.to(el, {
            x: 0,
            y: 0,
            duration: 0.8,
            ease: 'elastic.out(1, 0.4)'
          });
          
          gsap.to(btnText, {
            x: 0,
            y: 0,
            duration: 0.8,
            ease: 'elastic.out(1, 0.4)'
          });
        }
      }
    });
  });
}
// 6. Mobile Side Navigation Overlay controls
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileNav = document.getElementById('mobileNav');
const mobileLinks = document.querySelectorAll('.mobile-link-item');

hamburgerBtn.addEventListener('click', () => {
  mobileNav.classList.toggle('active');
  hamburgerBtn.classList.toggle('active');
  const spans = hamburgerBtn.querySelectorAll('span');
  if (hamburgerBtn.classList.contains('active')) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';

    // Stop background scroll on mobile overlay
    if (typeof lenis !== 'undefined') lenis.stop();
    document.body.style.overflow = 'hidden';
  } else {
    spans[0].style.transform = 'none';
    spans[1].style.opacity = '1';
    spans[2].style.transform = 'none';

    // Resume background scroll
    if (typeof lenis !== 'undefined') lenis.start();
    document.body.style.overflow = '';
  }
});

mobileLinks.forEach((link) => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('active');
    hamburgerBtn.classList.remove('active');
    const spans = hamburgerBtn.querySelectorAll('span');
    spans[0].style.transform = 'none';
    spans[1].style.opacity = '1';
    spans[2].style.transform = 'none';

    // Resume background scroll on link click
    if (typeof lenis !== 'undefined') lenis.start();
    document.body.style.overflow = '';
  });
});

// 7. Navigation bar hide/reveal on scroll direction
let prevScroll = 0;
const header = document.getElementById('header');
lenis.on('scroll', (e) => {
  const currentScroll = e.scroll;
  if (currentScroll > 150) {
    if (currentScroll > prevScroll) {
      header.classList.add('hide');
    } else {
      header.classList.remove('hide');
    }
  } else {
    header.classList.remove('hide');
  }
  prevScroll = currentScroll;
});

// Active Navigation Item Highlighter
const sections = document.querySelectorAll('main, section');
const navLinks = document.querySelectorAll('.nav-link-item');

lenis.on('scroll', () => {
  let activeId = "";
  sections.forEach((section) => {
    const top = section.offsetTop;
    if (window.scrollY >= top - 150) {
      activeId = section.getAttribute('id');
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${activeId}`) {
      link.classList.add('active');
    }
  });
});

// ==========================================================================
// PHASE 1: Hero & Project Cards 3D Motion, Tilt, Glare, & Parallax Controller
// To disable: comment out the call to initPhase1HeroAndBuilds() below
// ==========================================================================
function initPhase1HeroAndBuilds() {
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const isSmallScreen = window.innerWidth < 768;

  // Single accessibility & touch guard: skip all 3D tilt, glare, and parallax if reduced motion or mobile/touch
  if (isReducedMotion || isCoarsePointer || isSmallScreen) {
    return;
  }

  const TILT_MAX_DEG = 8;

  // Helper: Card mouse-tracking 3D tilt with dynamic glare and RAF throttling
  function bind3DTilt(card, maxTilt = TILT_MAX_DEG) {
    if (!card) return;

    let isHovering = false;
    let rafId = null;
    let targetRotX = 0;
    let targetRotY = 0;
    let glareX = 50;
    let glareY = 50;

    const onMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Distance from center (-1 to 1)
      const px = (x - rect.width / 2) / (rect.width / 2);
      const py = (y - rect.height / 2) / (rect.height / 2);

      // Clamped rotation degrees
      targetRotY = Math.max(-maxTilt, Math.min(maxTilt, px * maxTilt));
      targetRotX = Math.max(-maxTilt, Math.min(maxTilt, -py * maxTilt));

      // Glare center coordinates in percentages
      glareX = Math.max(0, Math.min(100, (x / rect.width) * 100));
      glareY = Math.max(0, Math.min(100, (y / rect.height) * 100));

      if (!rafId) {
        rafId = requestAnimationFrame(updateFrame);
      }
    };

    const updateFrame = () => {
      rafId = null;
      if (!isHovering) return;

      // Update glare position custom properties for dynamic light
      card.style.setProperty('--mx', `${glareX.toFixed(1)}%`);
      card.style.setProperty('--my', `${glareY.toFixed(1)}%`);

      gsap.to(card, {
        rotateX: targetRotX,
        rotateY: targetRotY,
        transformPerspective: 1200,
        duration: 0.15,
        ease: 'power1.out',
        overwrite: 'auto'
      });
    };

    const onMouseEnter = () => {
      isHovering = true;
      card.style.willChange = 'transform';
    };

    const onMouseLeave = () => {
      isHovering = false;
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }

      // Smooth ease back to flat over ~0.6s
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.6,
        ease: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
        overwrite: 'auto',
        onComplete: () => {
          card.style.willChange = 'auto';
        }
      });
    };

    card.addEventListener('mouseenter', onMouseEnter);
    card.addEventListener('mousemove', onMouseMove);
    card.addEventListener('mouseleave', onMouseLeave);
  }

  // 1. Setup Hero 3D Card Tilt
  const heroCard = document.getElementById('heroCard');
  if (heroCard) {
    bind3DTilt(heroCard, TILT_MAX_DEG);
  }

  // 2. Setup Project Cards 3D Tilt (#builds)
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach((card) => {
    bind3DTilt(card, TILT_MAX_DEG);
  });

  // 3. Multi-plane Background & Depth Parallax via gsap.quickTo
  const gridOverlay = document.querySelector('.grid-overlay');
  const ambientOrbs = document.querySelectorAll('#ambientBlue, #ambientDark, #spotlight');
  const heroTitle = document.querySelector('.hero-title');
  const heroRings = document.querySelector('.hero-rings');

  if (gridOverlay || ambientOrbs.length || heroTitle || heroRings) {
    const quickGridX = gridOverlay ? gsap.quickTo(gridOverlay, 'x', { duration: 0.8, ease: 'power2.out' }) : null;
    const quickGridY = gridOverlay ? gsap.quickTo(gridOverlay, 'y', { duration: 0.8, ease: 'power2.out' }) : null;

    const quickOrbsX = ambientOrbs.length ? gsap.quickTo(ambientOrbs, 'x', { duration: 1.0, ease: 'power2.out' }) : null;
    const quickOrbsY = ambientOrbs.length ? gsap.quickTo(ambientOrbs, 'y', { duration: 1.0, ease: 'power2.out' }) : null;

    const quickTitleX = heroTitle ? gsap.quickTo(heroTitle, 'x', { duration: 0.6, ease: 'power2.out' }) : null;
    const quickTitleY = heroTitle ? gsap.quickTo(heroTitle, 'y', { duration: 0.6, ease: 'power2.out' }) : null;

    const quickRingsX = heroRings ? gsap.quickTo(heroRings, 'x', { duration: 0.8, ease: 'power2.out' }) : null;
    const quickRingsY = heroRings ? gsap.quickTo(heroRings, 'y', { duration: 0.8, ease: 'power2.out' }) : null;

    let parallaxRaf = null;
    const onWindowMouseMove = (e) => {
      if (parallaxRaf) return;
      parallaxRaf = requestAnimationFrame(() => {
        parallaxRaf = null;
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;

        // Depth ratios: 0.02 (grid), 0.05 (ambient orbs), 0.1 (hero title), 0.03 (wireframe rings)
        if (quickGridX && quickGridY) {
          quickGridX(dx * 0.02);
          quickGridY(dy * 0.02);
        }
        if (quickOrbsX && quickOrbsY) {
          quickOrbsX(dx * 0.05);
          quickOrbsY(dy * 0.05);
        }
        if (quickTitleX && quickTitleY) {
          quickTitleX(dx * 0.1);
          quickTitleY(dy * 0.1);
        }
        if (quickRingsX && quickRingsY) {
          quickRingsX(dx * 0.03);
          quickRingsY(dy * 0.03);
        }
      });
    };

    window.addEventListener('mousemove', onWindowMouseMove, { passive: true });
  }

  // 4. Smooth Anchor Link Navigation via Lenis
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement && typeof lenis !== 'undefined') {
          e.preventDefault();
          lenis.scrollTo(targetElement, { offset: -40, duration: 1.2 });
        }
      }
    });
  });
}

// Initialize Phase 1 3D & Parallax Interactions
initPhase1HeroAndBuilds();

// 9. Marquee speed variation on scroll
const tickerTrack = document.querySelector('.ticker-track');
if (tickerTrack) {
  lenis.on('scroll', (e) => {
    const speed = Math.abs(e.velocity);
    const calculatedDuration = Math.max(8, 30 - speed * 1.8);
    tickerTrack.style.animationDuration = `${calculatedDuration}s`;
  });
}

// 10. GSAP ScrollTriggers
// Browser Mockup image scale-up on enter
const mockups = document.querySelectorAll('.browser-mockup');
mockups.forEach((mock) => {
  gsap.fromTo(mock,
    { scale: 0.95 },
    {
      scale: 1.00,
      scrollTrigger: {
        trigger: mock,
        start: 'top bottom-=80px',
        end: 'bottom top+=150px',
        scrub: true,
      }
    }
  );
});

// Journey timeline ScrollTrigger Animation
const journeyWrapper = document.querySelector('.journey-wrapper');
if (journeyWrapper && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  const items = gsap.utils.toArray('.journey-item');
  const journeyLineProgress = document.getElementById('journeyLineProgress');

  if (window.matchMedia("(max-width: 768px)").matches) {
    // Mobile fallback: simple fade-in on scroll for each item
    items.forEach(item => {
      const dot = item.querySelector('.journey-dot');
      
      // Set initial states
      gsap.set(dot, { scale: 0 });
      gsap.set(item, { opacity: 0, x: 20 });

      gsap.to(dot, {
        scale: 1,
        duration: 0.4,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });

      gsap.to(item, {
        opacity: 1,
        x: 0,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    });
  } else {
    // Desktop: Scroll-driven progress line drawing and item reveal
    const wrapperHeight = journeyWrapper.clientHeight;
    
    // Set initial states
    items.forEach(item => {
      gsap.set(item.querySelector('.journey-dot'), { scale: 0 });
      gsap.set(item, { opacity: 0, x: 30 });
    });
    if (journeyLineProgress) {
      gsap.set(journeyLineProgress, { height: '0%' });
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: journeyWrapper,
        start: 'top 75%',
        end: 'bottom 60%',
        scrub: 1.5
      }
    });

    items.forEach((item, index) => {
      const dot = item.querySelector('.journey-dot');
      const dotCenter = item.offsetTop + dot.offsetTop + (dot.offsetHeight / 2);
      const targetHeightPercent = Math.min(100, Math.max(0, (dotCenter / wrapperHeight) * 100));

      if (index === 0) {
        // First item animates immediately
        tl.to(dot, { scale: 1, duration: 0.3 })
          .to(item, { opacity: 1, x: 0, duration: 0.5 }, '-=0.2');
      } else {
        // Draw line to this item's dot marker
        tl.to(journeyLineProgress, {
          height: `${targetHeightPercent}%`,
          duration: 1,
          ease: 'none'
        })
        .to(dot, { scale: 1, duration: 0.3 })
        .to(item, { opacity: 1, x: 0, duration: 0.5 }, '-=0.2');
      }
    });

    // Finally, draw the line to the very end of the wrapper
    if (journeyLineProgress) {
      tl.to(journeyLineProgress, {
        height: '100%',
        duration: 0.4,
        ease: 'none'
      });
    }
  }
}

// Content fades & line reveal animations
const reveals = document.querySelectorAll('.editorial-text, .case-study-details, .mission-block, .reveal-achievement');
reveals.forEach((element) => {
  gsap.fromTo(element,
    { opacity: 0, y: 35 },
    {
      opacity: 1,
      y: 0,
      duration: 1.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom-=60px',
        toggleActions: 'play none none none'
      }
    }
  );
});

// 11. Custom Video Demo playback trigger
const videoContainer = document.getElementById('videoContainer');
const videoElement = document.getElementById('beachCleanerVideo');
const playBtn = document.getElementById('playBtn');

if (videoContainer && videoElement && playBtn) {
  videoContainer.addEventListener('click', () => {
    if (videoElement.paused) {
      videoElement.play();
      playBtn.style.opacity = '0';
    } else {
      videoElement.pause();
      playBtn.style.opacity = '1';
    }
  });
}

// 12. EmailJS Form Integration & Focus Events
if (typeof emailjs !== 'undefined') {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formErrorMsg = document.getElementById('formErrorMsg');
const contactSuccess = document.getElementById('contactSuccess');

if (contactForm) {
  // Focus and Blur state toggles for field underlines
  const inputs = contactForm.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.closest('.field-group').classList.add('focused');
    });
    input.addEventListener('blur', () => {
      input.closest('.field-group').classList.remove('focused');
    });
  });

  if (submitBtn) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Loading state
      const submitText = submitBtn.querySelector('.submit-text');
      const submitArrow = submitBtn.querySelector('.submit-arrow');
      
      const originalText = submitText.textContent;
      submitText.textContent = 'Sending...';
      submitBtn.style.pointerEvents = 'none';
      if (submitArrow) submitArrow.style.opacity = '0';
      if (formErrorMsg) formErrorMsg.style.display = 'none';

      const params = {
        from_name: contactForm.from_name.value,
        reply_to: contactForm.reply_to.value,
        message: contactForm.message.value
      };

      const handleSuccess = () => {
        // Success state: Fade out form, fade in success message
        if (typeof gsap !== 'undefined') {
          gsap.to(contactForm, {
            opacity: 0,
            y: -16,
            duration: 0.5,
            ease: 'power3.inOut',
            onComplete: () => {
              contactForm.style.display = 'none';
              if (contactSuccess) {
                contactSuccess.style.display = 'block';
                gsap.fromTo(contactSuccess,
                  { opacity: 0, y: 20 },
                  { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }
                );
              }
            }
          });
        } else {
          contactForm.style.display = 'none';
          if (contactSuccess) contactSuccess.style.display = 'block';
        }
      };

      const handleError = (error) => {
        console.error("Form Submission Failure:", error);
        submitText.textContent = originalText;
        submitBtn.style.pointerEvents = 'auto';
        if (submitArrow) submitArrow.style.opacity = '1';
        if (formErrorMsg) formErrorMsg.style.display = 'block';
      };

      // If configuration contains placeholder keys, simulate successful submission
      if (EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID' || 
          EMAILJS_TEMPLATE_ID === 'YOUR_TEMPLATE_ID' || 
          EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
        console.warn("Using placeholder credentials. Simulating form submission...");
        console.log("EmailJS Params:", params);
        setTimeout(handleSuccess, 1000);
      } else if (typeof emailjs !== 'undefined') {
        console.log("EmailJS Params:", params);
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params)
          .then(handleSuccess)
          .catch(handleError);
      } else {
        handleError("EmailJS library not loaded");
      }
    });
  }
}

// 13. Editorial Contact Section GSAP ScrollTrigger Animations
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  // Left Column Timeline
  const leftTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: '#connect',
      start: 'top 75%',
      toggleActions: 'play none none none'
    }
  });

  leftTimeline
    .fromTo('#connect .connect-overline', 
      { opacity: 0, y: 16 }, 
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    )
    .fromTo('#connect .reveal-line', 
      { opacity: 0, y: 48 }, 
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.12 },
      '>0.1'
    )
    .fromTo('#connect .connect-description', 
      { opacity: 0, y: 24 }, 
      { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' },
      '>0.15'
    )
    .fromTo('#connect .connect-availability', 
      { opacity: 0 }, 
      { opacity: 1, duration: 0.6 },
      '>0.1'
    );

  // Right Column (Form fields) Timeline
  const rightTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: '#connect',
      start: 'top 75%',
      toggleActions: 'play none none none'
    }
  });

  rightTimeline
    .fromTo('#connect .field-group', 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.08 }
    )
    .fromTo('#connect .submit-line', 
      { opacity: 0, y: 12 }, 
      { opacity: 1, y: 0, duration: 0.6 },
      '>0.1'
    );

  // Links Row
  gsap.fromTo('#connect .connect-links-row',
    { opacity: 0, y: 16 },
    {
      opacity: 1,
      y: 0,
      duration: 0.7,
      scrollTrigger: {
        trigger: '#connect .connect-links-row',
        start: 'top 90%',
        toggleActions: 'play none none none'
      }
    }
  );

  // Footer Close
  gsap.fromTo('#connect .connect-footer-close',
    { opacity: 0 },
    {
      opacity: 1,
      duration: 0.8,
      scrollTrigger: {
        trigger: '#connect .connect-footer-close',
        start: 'top 95%',
        toggleActions: 'play none none none'
      }
    }
  );

  // Ambient background ScrollTrigger animations (disabled on mobile for performance)
  if (window.matchMedia("(min-width: 769px)").matches) {
    // 1. Fade in the blue tint ambient gradient when entering projects section
    gsap.to('#ambientBlue', {
      opacity: 1,
      scrollTrigger: {
        trigger: '#builds',
        start: 'top bottom',
        end: 'top center',
        scrub: true
      }
    });

    // 2. Fade out blue tint and fade in dark overlay (pure black) when entering contact section
    gsap.to('#ambientBlue', {
      opacity: 0,
      scrollTrigger: {
        trigger: '#connect',
        start: 'top bottom',
        end: 'top center',
        scrub: true
      }
    });

    gsap.to('#ambientDark', {
      opacity: 1,
      scrollTrigger: {
        trigger: '#connect',
        start: 'top bottom',
        end: 'top center',
        scrub: true
      }
    });
  }
}