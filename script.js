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

// 8. 3D Mouse Reactive Portrait Parallax
const portrait = document.getElementById('heroPortrait');
if (portrait) {
  const img = portrait.querySelector('img');

  portrait.addEventListener('mousemove', (e) => {
    const rect = portrait.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -12;
    const rotY = ((x - centerX) / centerX) * 12;

    gsap.to(img, {
      rotateX: rotX,
      rotateY: rotY,
      scale: 1.05,
      transformPerspective: 1000,
      duration: 0.5,
      ease: 'power2.out'
    });
  });

  portrait.addEventListener('mouseleave', () => {
    gsap.to(img, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.8,
      ease: 'power2.out'
    });
  });
}

// 8b. Project Card 3D Tilt (Linear-style) — .browser-mockup cards
// -----------------------------------------------------------------
// Guard the whole feature behind a "fine pointer" check. matchMedia
// (pointer: fine) is true for mice/trackpads and false for touchscreens,
// so on touch devices this block never runs and mousemove/mouseleave
// listeners are never attached — there's no tilt to disable later because
// it's never enabled. This is more reliable than checking screen width,
// since it also correctly skips tilt on touch laptops with a mouse absent.
if (window.matchMedia('(pointer: fine)').matches) {

  const TILT_MAX_DEG = 8;      // Max card rotation on either axis, in degrees
  const IMAGE_MAX_PX = 12;     // Max opposite-direction image drift, in pixels

  // One handler per card, since each card tracks its own bounding box and
  // owns its own image element.
  document.querySelectorAll('.browser-mockup').forEach((card) => {
    const img = card.querySelector('.browser-window img');
    if (!img) return; // Skip cards that don't have the expected inner image

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();

      // Cursor position relative to the card's own top-left corner, not the
      // viewport — this is what lets the same formula work for a card
      // anywhere on the page.
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Cursor position re-centered so the middle of the card is (0, 0)
      // and the edges are ±half the card's width/height. This is the
      // "distance from center" that drives the tilt amount.
      const px = x - rect.width / 2;
      const py = y - rect.height / 2;

      // Normalize to a -1...1 range by dividing by the half-width/height,
      // then scale by the max degrees. Note the axis swap: horizontal
      // cursor movement (px) drives rotation AROUND the Y axis, and
      // vertical movement (py) drives rotation around the X axis — that's
      // just how 3D rotation axes work (rotateX tips the top/bottom edge
      // toward/away from you, which is caused by up/down cursor motion).
      const rotY = (px / (rect.width / 2)) * TILT_MAX_DEG;
      // Inverted (negative) because moving the cursor toward the TOP of
      // the card (negative py) should tilt the top edge UP, toward the
      // viewer — without the flip it would tilt away, which reads as
      // "pushing down" instead of "lifting toward you".
      const rotX = -(py / (rect.height / 2)) * TILT_MAX_DEG;

      // Card itself: instant follow (duration: 0) so it feels physically
      // pinned to the cursor with zero lag, the way Linear's cards do.
      // transformPerspective is set here (rather than only in CSS) so GSAP
      // is aware of the 3D context when it computes the rotation matrix.
      gsap.to(card, {
        rotateX: rotX,
        rotateY: rotY,
        transformPerspective: 1000,
        duration: 0,
        ease: 'none',
        overwrite: 'auto' // Cancels any in-flight leave-tween immediately
      });

      // Inner image: same normalized -1...1 values, but inverted and at a
      // smaller max displacement (12px vs 8deg of rotation). Inverting the
      // sign makes the image drift OPPOSITE the tilt direction — e.g. when
      // the card's right edge tilts toward the viewer, the image nudges
      // left — which is what sells the illusion of the image sitting on a
      // separate depth layer inside the card (parallax) rather than being
      // painted flat onto it.
      gsap.to(img, {
        x: -(px / (rect.width / 2)) * IMAGE_MAX_PX,
        y: -(py / (rect.height / 2)) * IMAGE_MAX_PX,
        scale: 1.03, // Folds in the "lift" scale the old CSS :hover rule used to do
        duration: 0,
        ease: 'none',
        overwrite: 'auto'
      });
    });

    card.addEventListener('mouseleave', () => {
      // Spring back to flat. power3.out (fast start, gentle settle) reads
      // as "premium" and controlled; swap to 'elastic.out(1, 0.5)' instead
      // if you want a visible overshoot/bounce rather than a clean settle —
      // power3 was chosen here to match the "purposeful, not gimmicky" brief.
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.6,
        ease: 'power3.out',
        overwrite: 'auto'
      });

      gsap.to(img, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: 'power3.out',
        overwrite: 'auto'
      });
    });
  });
}

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
        trigger: '#featured-build',
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