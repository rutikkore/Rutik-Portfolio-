/* ==========================================================================
   PREMIUM PORTFOLIO INTERACTION ENGINE
   - Lenis Smooth Scroll
   - GSAP & ScrollTrigger Choreography
   - Custom Follower Cursor & Spotlight Parallax
   - Magnetic Web Elements
   - EmailJS Submission Form
   ========================================================================== */

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
  const tl = gsap.timeline({
    defaults: { ease: 'power4.out', duration: 1.4 }
  });

  // Force ScrollTrigger refresh
  ScrollTrigger.refresh();

  tl.fromTo('#header',
    { y: -30, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.2 }
  )
    .fromTo('.hero-content .label-mono',
      { y: 35, opacity: 0 },
      { y: 0, opacity: 1 },
      '-=1.0'
    )
    .fromTo('.hero-title',
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.6 },
      '-=1.2'
    )
    .fromTo('.hero-tagline',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1 },
      '-=1.2'
    )
    .fromTo('.hero-actions',
      { y: 25, opacity: 0 },
      { y: 0, opacity: 1 },
      '-=1.2'
    )
    .fromTo('#heroPortrait img',
      { scale: 1.2, rotateY: -15, opacity: 0 },
      { scale: 1, rotateY: 0, opacity: 1, duration: 1.8 },
      '-=1.6'
    )
    .fromTo('.ticker-container',
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 1.2 },
      '-=1.4'
    );
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
let cx = 0, cy = 0;
let cfx = 0, cfy = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function tickCursor() {
  cx += (mouseX - cx) * 0.25;
  cy += (mouseY - cy) * 0.25;
  if (cursor) {
    cursor.style.left = `${cx}px`;
    cursor.style.top = `${cy}px`;
  }

  cfx += (mouseX - cfx) * 0.14;
  cfy += (mouseY - cfy) * 0.14;
  if (cursorFollower) {
    cursorFollower.style.left = `${cfx}px`;
    cursorFollower.style.top = `${cfy}px`;
  }

  requestAnimationFrame(tickCursor);
}
tickCursor();

// Set Cursor Follower Hover States
const hoverables = document.querySelectorAll('a, button, input, textarea, .hover-trigger-view');
hoverables.forEach((el) => {
  el.addEventListener('mouseenter', () => {
    if (el.classList.contains('hover-trigger-view')) {
      cursorFollower.classList.add('view-mode');
      cursor.classList.add('hovered');
    } else {
      cursorFollower.classList.add('hovered');
      cursor.classList.add('hovered');
    }
  });

  el.addEventListener('mouseleave', () => {
    cursorFollower.classList.remove('hovered', 'view-mode');
    cursor.classList.remove('hovered');
  });
});

// 5. Magnetic Buttons Physics Engine
const magneticElements = document.querySelectorAll('.btn-magnetic');
if (window.matchMedia("(pointer: fine)").matches) {
  magneticElements.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(el, {
        x: x * 0.35,
        y: y * 0.35,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.3)'
      });
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

// Journey timeline line-drawing progress
const journeyLineProgress = document.getElementById('journeyLineProgress');
const journeyWrapper = document.querySelector('.journey-wrapper');
const journeyItems = document.querySelectorAll('.journey-item');

if (journeyWrapper && journeyLineProgress) {
  gsap.to(journeyLineProgress, {
    height: '100%',
    scrollTrigger: {
      trigger: journeyWrapper,
      start: 'top center',
      end: 'bottom center',
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const indexToHighlight = Math.floor(progress * journeyItems.length);
        journeyItems.forEach((item, index) => {
          if (index <= indexToHighlight) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    }
  });
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

// 12. EmailJS Form Integration
(function () {
  if (typeof emailjs !== 'undefined' && typeof EMAILJS_PUBLIC_KEY !== 'undefined' && EMAILJS_PUBLIC_KEY && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }
})();

const contactForm = document.getElementById('contactForm');
const sendBtn = document.getElementById('sendBtn');
const formErrorMsg = document.getElementById('formErrorMsg');
const contactSuccess = document.getElementById('contactSuccess');

if (contactForm && sendBtn) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Loading state: text changes to "Sending..." and pointer-events: none
    const originalText = sendBtn.innerHTML;
    sendBtn.innerHTML = 'Sending...';
    sendBtn.style.pointerEvents = 'none';
    if (formErrorMsg) {
      formErrorMsg.style.display = 'none';
      formErrorMsg.textContent = "";
    }

    const nameVal = document.getElementById('name').value;
    const emailVal = document.getElementById('email').value;
    const messageVal = document.getElementById('message').value;

    const params = {
      name: nameVal,
      email: emailVal,
      message: messageVal
    };

    const handleSuccess = () => {
      // Success: entire form fades out (opacity: 0, y: -20, GSAP), then success line fades in
      const formInputsStack = document.querySelector('.form-inputs-stack');
      if (formInputsStack && typeof gsap !== 'undefined') {
        gsap.to(formInputsStack, {
          opacity: 0,
          y: -20,
          duration: 0.5,
          ease: 'power3.inOut',
          onComplete: () => {
            formInputsStack.style.display = 'none';
            if (contactSuccess) {
              contactSuccess.style.display = 'block';
              gsap.fromTo(contactSuccess,
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
              );
            }
            contactForm.reset();
            sendBtn.innerHTML = originalText;
            sendBtn.style.pointerEvents = 'auto';
          }
        });
      } else {
        // Fallback if GSAP is not loaded
        if (formInputsStack) formInputsStack.style.display = 'none';
        if (contactSuccess) contactSuccess.style.display = 'block';
        contactForm.reset();
        sendBtn.innerHTML = originalText;
        sendBtn.style.pointerEvents = 'auto';
      }
    };

    const handleError = (error) => {
      console.error("EmailJS Submission Failure:", error);
      if (formErrorMsg) {
        formErrorMsg.textContent = "Something went wrong. Try emailing me directly.";
        formErrorMsg.style.display = 'block';
      }
      sendBtn.innerHTML = originalText;
      sendBtn.style.pointerEvents = 'auto';
    };

    // If EmailJS constants are still placeholders, simulate success for visual verification
    if (typeof EMAILJS_SERVICE_ID === 'undefined' || 
        EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID' || 
        EMAILJS_TEMPLATE_ID === 'YOUR_TEMPLATE_ID' || 
        EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
      
      console.warn("EmailJS configuration is using placeholders. Simulating successful form submission.");
      setTimeout(handleSuccess, 1000);
      
    } else if (typeof emailjs !== 'undefined') {
      
      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params)
        .then(handleSuccess)
        .catch(handleError);
        
    } else {
      handleError("EmailJS library not loaded");
    }
  });
}

// 13. Minimalist Contact Section Scroll Animations
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  // On scroll enter, animate Zone 1 statement lines and available label
  gsap.fromTo('.seamless-headline .headline-line, .seamless-status',
    { y: 60, opacity: 0 },
    {
      y: 0,
      opacity: (index, target) => {
        if (target.classList.contains('weight-300')) return 0.9;
        if (target.classList.contains('weight-600')) return 1;
        return 0.4;
      },
      stagger: 0.15,
      duration: 1.0,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.contact-zone-1',
        start: 'top bottom-=80px',
        toggleActions: 'play none none none'
      }
    }
  );
}
