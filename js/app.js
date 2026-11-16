/*! ------------------------------------------------
 * Project Name: FlyStudio - Creative Studio & Personal Portfolio HTML Template
 * Project Description: Stand out and express your creativity with FlyStudio - a bold and bright HTML template for creatives, agencies and freelancers. Impress your website visitors with stunning visuals and unique layout.
 * Tags: mix_design, resume, portfolio, personal page, cv, template, one page, responsive, html5, css3, creative, clean, agency, studio
 * Version: 1.0.0
 * Build Date: October 2026
 * Last Update: October 2026
 * Author: mix_design
 * Author URI: https://mixdesign.dev
 * File name: app.js
 * ------------------------------------------------

 * ------------------------------------------------
 * Table of Contents
 * ------------------------------------------------
 *
 *  01. Base - Inits
 *  02. Base - Loader & Pages Transition
 *  03. Base - Page Appearance Default Animations
 *  04. Base - Haptic Vibration Feedback
 *  05. Base - SplitText Animations
 *  06. Base - Get Users Device Type
 *  07. Base - ScrollSpy Menu
 *  08. Base - Menu & Hamburger
 *  09. Global Effect - Sections Pinning
 *  10. Global Effect - Smooth Anchor Scroll
 *  11. Global Effect - Scroll to Top
 *  12. Global Effect - Color Switch
 *  13. Animation - Text Flip Effect
 *  14. Animation - Scroll Animation for Stats
 *  15. Animation - Common Animations
 *  16. Showcase - Projects Stacking Cards Demo
 *  17. Showcase - Services Stacking Cards
 *  18. Showcase - Landing Stacking Cards
 *  19. Features - Marquee Two Lines
 *  20. Features - Marquee One Line To Right
 *  21. Features - Sticky Caption
 *  22. Features - CountUp Counters Options
 *  23. Features - Parallax Images & Videon
 *  24. Features - Accordion
 *  25. Features - Inertia Stickers
 *  26. Features - Inertia Universal
 *  27. Features - Inertia Desktop
 *  28. Features - Horizontal Cards
 *  29. Features - Pinned Split Block
 *  30. Swiper Slider - Testimonials
 *  31. Swiper Slider - Services Card Slider
 *  32. Swiper Slider - Inner Pages Demo
 *  33. Jquery - Jquery Dependent Components
 *  34. Hero - Scaling Video
 *  35. Hero - Scaling Media Version 2
 *  36. Hero - Scroll Out Animation
 *  37. Hero - Title Shift
 *
 * ------------------------------------------------
 * Table of Contents End
 * ------------------------------------------------ */

// --------------------------------------------- //
// Base - Inits Start
// --------------------------------------------- //
document.addEventListener("DOMContentLoaded", () => {

  window.lenis = new Lenis();
  window.lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    window.lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  gsap.registerPlugin(ScrollTrigger, CustomEase, SplitText, Flip, ScrollToPlugin, InertiaPlugin, TextPlugin);
  CustomEase.create("hop", ".87, 0, .13, 1");
  CustomEase.create("common", ".23, .65, .74, 1.09");

  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
  });

  mxdLoader();
  document.fonts.ready.then(() => {
    mxdTypeAnimations();
  });
  mxdNav();
  mxdNavScrollSpy();
  // global
  mxdPin();
  mxdSmoothScroll();
  mxdToTop();
  mxdColorSwitcher();
  // hero sections
  mxdHeroVideoScale();
  mxdHeroMediaScale();
  mxdHeroScrollOut();
  mxdTitleShift();
  // animations
  mxdBtnAnim();
  mxdStatsCards();
  // showcase
  mxdLandingStack();
  mxdProjectsStack();
  mxdServicesStack();
  // features
  mxdMarqueeDouble();
  mxdMarqueeRight();
  mxdDvStickyCaption();
  mxdCounters();
  mxdImageParallax();
  mxdAccordion();
  mxdStickers();
  mxdInertia();
  mxdServicesInertia();
  mxdHorizontalCards();
  mxdPinnedSplit();
  // desktop only
  // if (deviceType() === "desktop") {} else {}

  window.addEventListener("themechange", () => {
    ScrollTrigger.refresh();
  });

  window.addEventListener("pageshow", (event) => {
    const navEntry = window.performance?.getEntriesByType("navigation")[0];
    const isBackForward = navEntry && navEntry.type === "back_forward";

    if (event.persisted || isBackForward) {
      gsap.set(".mxd-loader__block", { scaleY: 0, visibility: "hidden" });
    }
  });

  document.addEventListener("click", (event) => {
    const hapticTarget = event.target.closest("[data-haptic]");
    if (!hapticTarget) return;

    const hapticType = hapticTarget.getAttribute("data-haptic");
    mxdHaptic(hapticType);
  }, { capture: true });

});
// --------------------------------------------- //
// Base - Inits End
// --------------------------------------------- //

// --------------------------------------------- //
// Base - Loader & Pages Transition Start
// --------------------------------------------- //
function mxdLoader() {
  const loader = document.querySelector("[data-loader]");
  const blocks = document.querySelectorAll("[data-loader-block]");
  if (!loader || !blocks.length) return;

  const ease = "hop";

  function shouldIgnoreLink(link, event) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) { return true; }
    const href = link.getAttribute("href");
    if (!href || href.trim() === "") return true;
    const normalizedHref = href.trim().toLowerCase();
    if (
      normalizedHref.startsWith("#") ||
      normalizedHref.startsWith("javascript:") ||
      normalizedHref.startsWith("mailto:") ||
      normalizedHref.startsWith("tel:") ||
      normalizedHref.startsWith("sms:") ||
      normalizedHref.startsWith("whatsapp:")
    ) { return true; }
    if (link.hasAttribute("download")) return true;
    const target = link.getAttribute("target");
    if (target && target !== "_self") return true;
    if (link.origin !== window.location.origin) return true;
    if (
      link.pathname === window.location.pathname &&
      link.search === window.location.search &&
      link.hash !== ""
    ) { return true; }
    return false;
  }

  function revealTransition() {
    return new Promise((resolve) => {
      gsap.set(blocks, {
        visibility: "visible",
        scaleY: 1,
      });
      gsap.to(blocks, {
        scaleY: 0,
        duration: 0.6,
        stagger: {
          each: 0.06,
          from: "start",
          grid: "auto",
          axis: "x",
        },
        ease: ease,
        onComplete: () => {
          gsap.set(blocks, { visibility: "hidden" });
          // resolve();
        },
      });
      gsap.delayedCall(0.3, resolve);
    });
  }

  function animateTransition(targetHref) {
    return new Promise((resolve) => {
      gsap.set(blocks, {
        visibility: "visible",
        scaleY: 0,
      });
      gsap.to(blocks, {
        scaleY: 1,
        duration: 0.6,
        stagger: {
          each: 0.06,
          from: "start",
          grid: [2, 5],
          axis: "x",
        },
        ease: ease,
        onComplete: resolve,
      });
    });
  }

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) return;
    if (shouldIgnoreLink(link, event)) return;

    event.preventDefault();
    const destination = link.href; 
    animateTransition().then(() => {
      window.location.href = destination;
    });
  });

  revealTransition().then(() => {
    mxdPageAppearance();
  });
}
// --------------------------------------------- //
// Base - Loader & Pages Transition End
// --------------------------------------------- //

// --------------------------------------------- //
// Base - Page Appearance Default Animations Start
// --------------------------------------------- //
function mxdPageAppearance() {
  const loadWrap = document.querySelector("[data-loading-wrap]");
  if (!loadWrap) return;

  const wordsElements = loadWrap.querySelectorAll("[data-loading-words]");
  const stickers = loadWrap.querySelectorAll("[data-loading-sticker]");
  const fadeIns = loadWrap.querySelectorAll("[data-loading-fadein]");

  if (!wordsElements.length && !stickers.length && !fadeIns.length) return;

  const tl = gsap.timeline();
  let hasPreviousPhase = false;

  if (wordsElements.length) {
    wordsElements.forEach((el) => {
      const split = SplitText.create(el, {
        type: "chars, words",
        wordsClass: "word",
        charsClass: "char",
        mask: "words",
        aria: "none",
      });

      gsap.set(split.words, { transformOrigin: "center bottom" });
      gsap.set(el, { visibility: "visible", opacity: 1 });

      tl.from(split.words, {
        yPercent: 100,
        opacity: 0,
        scaleY: 0,
        rotate: 10,
        duration: 1,
        ease: "elastic.out(0.75, 0.6)",
        stagger: { amount: 0.3 }
      }, 0); 
    });

    hasPreviousPhase = true;
  }

  if (stickers.length) {
    const positionParam = hasPreviousPhase ? "0.55" : 0;
    
    tl.fromTo(stickers, {
      scale: 0,
      opacity: 0,
    }, {
      scale: 1,
      opacity: 1,
      visibility: "visible",
      duration: 0.6,
      ease: "back.out(2.5)",
      stagger: {
        amount: 0.3,
        from: "random",
      }
    }, positionParam);

    hasPreviousPhase = true;
  }

  if (fadeIns.length) {
    const positionParam = hasPreviousPhase ? "-=0.6" : 0;

    tl.fromTo(fadeIns, {
      y: 10,
      opacity: 0,
    }, {
      y: 0,
      opacity: 1,
      visibility: "visible",
      duration: 0.6,
      ease: "power2.out",
      stagger: {
        amount: 0.3,
      }
    }, positionParam);
  }

  ScrollTrigger.refresh();
}
// --------------------------------------------- //
// Base - Page Appearance Default Animations End
// --------------------------------------------- //

// --------------------------------------------- //
// Base - Haptic Vibration Feedback Start
// --------------------------------------------- //
function mxdHaptic(type = "light") {
  if (!("vibrate" in navigator)) return;

  navigator.vibrate(0);
  const intensity = (type === "" || type === true || !type) ? "light" : type;
  switch (intensity) {
    case "light":
      navigator.vibrate(20);
      break;
    case "medium":
      navigator.vibrate(40);
      break;
    case "double":
      navigator.vibrate([30, 30, 30]);
      break;
  }
}
// --------------------------------------------- //
// Base - Haptic Vibration Feedback End
// --------------------------------------------- //

// --------------------------------------------- //
// Base - SplitText Animations Start
// --------------------------------------------- //
function mxdTypeAnimations() {
  // animated chars
  document.querySelectorAll("[data-anim-chars]").forEach((el) => {
    SplitText.create(el, {
      type: "chars, words",
      charsClass: "char",
      mask: "chars",
      smartWrap: true,
      aria: "none",
      onSplit: (self) => {
        gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "top 80%",
            toggleActions: "none play none reset",
            // markers: true
          },
        }).from(self.chars, {
          yPercent: 100,
          autoAlpha: 0,
          scaleY: 0,
          rotate: 10,
          duration: 1,
          ease: "elastic.out(0.75, 0.6)",
          stagger: {
            amount: 0.3,
          }
        });
      },
    });
  });

  // animated words
  document.querySelectorAll("[data-anim-words]").forEach((el) => {
    SplitText.create(el, {
      type: "chars, words",
      wordsClass: "word",
      charsClass: "char",
      mask: "words",
      aria: "none",
      onSplit: (self) => {
        gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "top 90%",
            toggleActions: "none play none reset",
            // markers: true
          },
        }).from(self.words, {
          yPercent: 100,
          autoAlpha: 0,
          scaleY: 0,
          rotate: 10,
          duration: 1,
          ease: "elastic.out(0.75, 0.6)",
          stagger: {
            amount: 0.3,
          }
        });
      },
    });
  });

  // split lines text
  document.querySelectorAll("[data-anim-lines]").forEach((el) => {
    SplitText.create(el, {
      type: "words, lines",
      linesClass: "line",
      autoSplit: true,
      mask: "lines",
      aria: "none",
      onSplit: (self) => {
        return gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "top 90%",
            toggleActions: "none play none reset",
            // markers: true
          },
        }).from(self.lines, {
          yPercent: 100,
          rotation: 3,
          duration: 0.3,
          ease: "none",
          stagger: { amount: 0.3 }
        });
      },
    });
  });

  // color trail reveal
  const getVar = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const splitTexts = document.querySelectorAll(".reveal-type");

  splitTexts.forEach((el) => {
    const split = new SplitText(el, { type: "words, chars", smartWrap: true });
    const chars = split.chars;

    gsap.fromTo(chars,
      { color: () => getVar("--t-base-mt-extra"), },
      {
        keyframes: [
          {
            color: () => getVar("--lime-var"),
            duration: 0.02,
          },
          {
            color: () => getVar("--t-base-br"),
            duration: 0.99,
          },
        ],
        stagger: 0.02,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom center",
          scrub: true,
          invalidateOnRefresh: true,
          // markers: true
        },
      }
    );
  });
}
// --------------------------------------------- //
// Base - SplitText Animations End
// --------------------------------------------- //

// --------------------------------------------- //
// Base - Get Users Device Type Start
// --------------------------------------------- //
function deviceType() {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "tablet";
  } else if (
    /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
      ua
    )
  ) {
    return "mobile";
  }
  return "desktop";
};
// --------------------------------------------- //
// Base - Get Users Device Type End
// --------------------------------------------- //

// --------------------------------------------- //
// Base - ScrollSpy Menu Start
// --------------------------------------------- //
function mxdNavScrollSpy() {
  const sections = document.querySelectorAll(`[data-section]`);

  if (!sections) { return; }

  sections.forEach((section) => {
    const sectionName = section.getAttribute("data-section");
    const link = document.querySelector(`[data-nav-link="${sectionName}"]`);
    const bg = link.querySelector("[data-nav-bg]");

    // if (!link || !bg) { return; }

    gsap.set(bg, { xPercent: -101 });

    ScrollTrigger.create({
      trigger: section,
      start: "top center",
      end: "bottom center",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const xTranslation = progress * 100 - 100;
        gsap.set(bg, { xPercent: xTranslation });
      },
    });
  });
}
// --------------------------------------------- //
// Base - ScrollSpy Menu End
// --------------------------------------------- //

// --------------------------------------------- //
// Base - Menu & Hamburger Start
// --------------------------------------------- //
function mxdNav() {
  const menuToggle = document.querySelector('[data-menu-toggle="toggle"]');
  const menuClose = document.querySelector('[data-menu-toggle="close"]');
  const menuState = document.querySelector("[data-menu-state]");

  if (menuToggle && menuState) {
    menuToggle.addEventListener("click", () => {
      const currentState = menuState.getAttribute("data-menu-state");
      const nextState = "opened" === currentState ? "closed" : "opened";
      menuState.setAttribute("data-menu-state", nextState);
      if (window.lenis) {
        if (nextState === "opened") { window.lenis.stop();
        } else { window.lenis.start(); }
      }
    });
  }

  if (menuClose) {
    menuClose.addEventListener("click", () => {
      closeNavigation();
    });
  }

  document.addEventListener("keydown", function(t) {
    if (t.key === "Escape" || t.key === "Esc") {
      closeNavigation();
    }
  });

  function closeNavigation() {
    menuState?.setAttribute("data-menu-state", "closed");
    window.lenis?.start();
  }

  function menuReset() {
    closeNavigation();
    const $mainMenu = $('#main-menu');
    if ($mainMenu.length) {
      $mainMenu.find('.submenu').stop(true, true).slideUp();
      $mainMenu.find('.open').removeClass('open');
    }
  }

  window.addEventListener("pageshow", (event) => {
    const navEntry = window.performance?.getEntriesByType("navigation")[0];
    const isBackForward = navEntry && navEntry.type === "back_forward";
    if (event.persisted || isBackForward) {
      menuReset();
    }
  });
}
// --------------------------------------------- //
// Base - Menu & Hamburger End
// --------------------------------------------- //

// --------------------------------------------- //
// Global Effect - Sections Pinning Start
// --------------------------------------------- //
function mxdPin() {
  const pinnedSections = document.querySelectorAll("[data-pinned]");
  if (!pinnedSections.length) return;

  const media = gsap.matchMedia();

  media.add("(min-width: 1200px)", () => {
    pinnedSections.forEach((pinnedSection) => {
      const pinContent = pinnedSection.querySelector("[data-pinned-inner]");
      if (!pinContent) return;

      ScrollTrigger.create({
        trigger: pinnedSection,
        pin: pinnedSection,
        start: "bottom bottom",
        end: "+=100%",
        scrub: true,
        pinSpacing: false,
        animation: gsap.to(pinContent, {
          autoAlpha: 0.3,
          ease: "none"
        })
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger && 'pinned' in st.trigger.dataset) {
          st.kill();
        }
      });
    };
  });

  media.add("(max-width: 1199px)", () => {
    pinnedSections.forEach(section => {
      const inner = section.querySelector("[data-pinned-inner]");
      if (inner) {
        gsap.set(inner, { clearProps: "all" });
      }
    });
  });
}
// --------------------------------------------- //
// Global Effect - Sections Pinning End
// --------------------------------------------- //

// --------------------------------------------- //
// Global Effect - Smooth Anchor Scroll Start
// --------------------------------------------- //
function mxdSmoothScroll() {
  const links = document.querySelectorAll('a[href*="#"]:not([href="#"]):not([href="#0"])');
  links.forEach(link => {
    link.addEventListener("click", function (e) {
      const url = new URL(this.href);
      const hash = url.hash;
      if (!hash) return;
      const target = document.querySelector(hash);
      if (!target) return;
      // only same-page links
      if (window.location.pathname !== url.pathname || window.location.hostname !== url.hostname) return;
      e.preventDefault();
      gsap.to(window, {
        scrollTo: { y: target, autoKill: true },
        duration: 1,
        ease: "hop"
      });
    });
  });
}
// --------------------------------------------- //
// Global Effect - Smooth Anchor Scroll End
// --------------------------------------------- //

// --------------------------------------------- //
// Global Effect - Scroll to Top Start
// --------------------------------------------- //
function mxdToTop() {
  const toTop = document.querySelector("[data-scroll-top]");
  if (!toTop) return;

  toTop.addEventListener("click", function(event){
    event.preventDefault()
  });

  toTop.addEventListener("click", () => gsap.to(window, { 
    scrollTo: 0, 
    ease: 'hop',
    duration: 1.3,
  }));

  gsap.set(toTop, { opacity: 0 });

  gsap.to(toTop, {
    opacity: 1,
    autoAlpha: 1,
    scrollTrigger: {
      trigger: "body",
      start: "top -20%",
      end: "top -20%",
      toggleActions: "play none reverse none",
    },
  });
}
// --------------------------------------------- //
// Global Effect - Scroll to Top End
// --------------------------------------------- //

// --------------------------------------------- //
// Global Effect - Color Switch Start
// --------------------------------------------- //
function mxdColorSwitcher() {
  const themeBtn = document.querySelector('#color-switcher');
  if (!themeBtn) return;

  function mxdSafeLocalGet(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  function mxdSafeLocalSet(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      // storage unavailable
    }
  }
  function getCurrentTheme(){
    let theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    localStorage.getItem('template.theme') ? theme = localStorage.getItem('template.theme') : null;
    const storedTheme = mxdSafeLocalGet('template.theme');
    if (storedTheme) theme = storedTheme;
    return theme;
  }
  function loadTheme(theme){
    const root = document.querySelector(':root');
    if(theme === "light") {
      themeBtn.innerHTML = `<i class="ph-bold ph-moon-stars"></i>`;
    } else {
      themeBtn.innerHTML = `<i class="ph-bold ph-sun-horizon"></i>`;
    }
    root.setAttribute('color-scheme', `${theme}`);

    window.dispatchEvent(new Event("themechange"));
  };
  themeBtn.addEventListener('click', () => {
    let theme = getCurrentTheme();
    if(theme === 'dark'){
      theme = 'light';
    } else {
      theme = 'dark';
    }
    localStorage.setItem('template.theme', `${theme}`);
    mxdSafeLocalSet('template.theme', theme);
    loadTheme(theme);
  });
  loadTheme(getCurrentTheme());
}
// --------------------------------------------- //
// Global Effect - Color Switch End
// --------------------------------------------- //

// --------------------------------------------- //
// Animation - Text Flip Effect Start
// --------------------------------------------- //
function mxdBtnAnim() {
  const elements = document.querySelectorAll("[data-btn-anim]");

  if (elements.length === 0) {
    console.log("no button text");
    return;
  }

  elements.forEach((element, index) => {
    const textContainer = element.querySelector(".btn-wrap");
    const originalText = element.querySelector(".btn-text");

    if (!originalText) {
      console.log(`Button has no btn-text inside ${index + 1}`);
      return;
    }

    const clonedText = originalText.cloneNode(true);
    clonedText.classList.add("clone");
    textContainer.appendChild(clonedText);
    // element.appendChild(clonedText);

    gsap.set(clonedText, {
      y: "100%",
      position: "absolute",
    });

    element.addEventListener('mouseenter', () => {
      animateText(originalText, "-100%");
      animateText(clonedText, "0%");
    });

    element.addEventListener('mouseleave', () => {
      animateText(originalText, "0%");
      animateText(clonedText, "100%");
    });
  });

  function animateText(textElement, yPosition) {
    gsap.to(textElement, {
      y: yPosition,
      duration: 0.3,
      ease: "power2.out",
    });
  }
}
// --------------------------------------------- //
// Animation - Text Flip Effect End
// --------------------------------------------- //

// --------------------------------------------- //
// Animation - Scroll Animation for Stats Start
// --------------------------------------------- //
function mxdStatsCards() {
  const animBlocks = document.querySelectorAll("[data-anim-cards]");
  if (animBlocks.length === 0) return;

  const mm = gsap.matchMedia();

  mm.add("(min-width: 1200px)", () => {
    animBlocks.forEach((block) => {
      const cards = block.querySelectorAll("[data-anim-cards-item]");
      if (cards.length === 0) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: block,
          start: "center center",
          end: "+=1200", 
          scrub: 2,
          pin: true,
          invalidateOnRefresh: true,
          refreshPriority: 2,
        }
      });

      const followers = Array.from(cards).slice(1);
      tl.fromTo(followers, 
        { y: () => window.innerHeight * 0.84 }, 
        { y: 0, ease: "power3.out", stagger: 0.1 }
      );
    });

    return () => {
      gsap.set("[data-anim-cards-item]", { clearProps: "all" });
      gsap.set("[data-anim-cards]", { clearProps: "all" });
      ScrollTrigger.refresh();
    };
  });

  mm.add("(max-width: 1199px)", () => {
    gsap.set("[data-anim-cards-item]", { clearProps: "all" });
    gsap.set("[data-anim-cards]", { clearProps: "all" });
    ScrollTrigger.refresh();

    return () => {
      gsap.set("[data-anim-cards-item]", { clearProps: "all" });
      gsap.set("[data-anim-cards]", { clearProps: "all" });
      ScrollTrigger.refresh();
    };
  });
}
// --------------------------------------------- //
// Animation - Scroll Animation for Stats End
// --------------------------------------------- //

// --------------------------------------------- //
// Animation - Common Animations Start
// --------------------------------------------- //
// Stickers scale-in on scroll
document.querySelectorAll("[data-stickers-scale-in]").forEach((container) => {
  const items = container.querySelectorAll(".sticker-scale-in");
  gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: "top-=30% bottom",
      end: "top-=30% 70%",
      toggleActions: "none play none reset",
      // markers: true,
    },
  }).from(items, {
    scale: 0,
    autoAlpha: 0,
    duration: 0.6,
    delay: 0.6,
    ease: "back.out(2.5)",
    stagger: {
      amount: 0.3,
      from: "random",
    },
  });
});
// Scroll Animation Rotate In Left
document.querySelectorAll("[data-anim-rotate-left]").forEach((el) => {
  gsap.fromTo(el, {
    opacity: 1,
    y: 50,
    x: 70,
    rotate: -10,
    // ease: 'hop',
    // duration: 5,
  }, {
    y: 0,
    x: 0,
    rotate: 0,
    opacity: 1,
    scrollTrigger: {
      trigger: el,
      start: "top bottom",
      end: "bottom 40%",
      toggleActions: 'play none none reverse',
      scrub: true,
      // markers: true,
    }
  });
});
// Scroll Animation Rotate In Right
document.querySelectorAll("[data-anim-rotate-right]").forEach((el) => {
  gsap.fromTo(el, {
    opacity: 1,
    y: 50,
    x: -70,
    rotate: 10,
    // ease: 'hop',
    // duration: 5,
  }, {
    y: 0,
    x: 0,
    rotate: 0,
    opacity: 1,
    scrollTrigger: {
      trigger: el,
      start: "top bottom",
      end: "bottom 40%",
      toggleActions: 'play none none reverse',
      scrub: true,
      // markers: true,
    }
  });
});
//Scroll Animation In Up
document.querySelectorAll("[data-anim-in-up]").forEach((el) => {
  gsap.fromTo(el, {
    opacity: 0,
    y: 50,
    ease: 'sine',
  }, {
    y: 0,
    opacity: 1,
    scrollTrigger: {
      trigger: el,
      toggleActions: 'play none none reverse',
    }
  });
});
// Sliding object common animation left
document.querySelectorAll("[data-slide-left]").forEach((el) => {
  gsap.fromTo(el, {
    xPercent: 20,
    // autoAlpha: 0,
    ease: 'custom',
  }, {
    xPercent: 0,
    // autoAlpha: 1,
    scrollTrigger: {
      trigger: el,
      start: "top bottom",
      end: "bottom center",
      scrub: true,
      toggleActions: 'play none none reverse',
      // markers: true,
    }
  });
});
// Sliding object common animation right
document.querySelectorAll("[data-slide-right]").forEach((el) => {
  gsap.fromTo(el, {
    xPercent: -20,
    // autoAlpha: 0,
    ease: 'custom',
  }, {
    xPercent: 0,
    // autoAlpha: 1,
    scrollTrigger: {
      trigger: el,
      start: "top bottom",
      end: "bottom center",
      scrub: true,
      toggleActions: 'play none none reverse',
      // markers: true,
    }
  });
});
// Image Dividers - ClipPath and Image Scale on Scroll
document.querySelectorAll("[data-img-divider]").forEach((el) => {
  const dividerImg = el.querySelector("img");

  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: el,
      start: "top bottom",
      end: "top 10%",
      toggleActions: 'play none none reverse',
      scrub: true,
      // markers: true,
    }
  });

  tl.fromTo(el, {
      clipPath: "inset(0% 0% 0% 0% round 400px 400px 16px 16px)",
      ease: 'none',
    }, {
      clipPath: "inset(0% 0% 0% 0% round 16px 16px 16px 16px)",
      immediateRender: false
    })
    .fromTo(dividerImg, { scale: 1.4 }, { scale: 1, ease: "none", immediateRender: false }, "<");
});
// Image Dividers - ClipPath and Video Scale on Scroll
document.querySelectorAll("[data-video-divider]").forEach((el) => {
  const dividerVideo = el.querySelector("video");

  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: el,
      start: "top bottom",
      end: "top 10%",
      toggleActions: 'play none none reverse',
      scrub: true,
      // markers: true,
    }
  });

  tl.fromTo(el, {
      clipPath: "inset(0% 0% 0% 0% round 400px 400px 16px 16px)",
      ease: 'none',
    }, {
      clipPath: "inset(0% 0% 0% 0% round 16px 16px 16px 16px)",
      immediateRender: false
    })
    .fromTo(dividerVideo, { scale: 1.4 }, { scale: 1, ease: "none", immediateRender: false }, "<");
});
// Image Dividers - Reverse ClipPath and Image Scale on Scroll
document.querySelectorAll("[data-img-divider-reverse]").forEach((el) => {
  const dividerImg = el.querySelector("img");

  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: el,
      start: "top bottom",
      end: "top 10%",
      toggleActions: 'play none none reverse',
      scrub: true,
      // markers: true,
    }
  });

  tl.fromTo(el, {
      clipPath: "inset(0% 0% 0% 0% round 16px 16px 400px 400px)",
      ease: 'none',
    }, {
      clipPath: "inset(0% 0% 0% 0% round 400px 400px 400px 400px)",
      immediateRender: false
    })
    .fromTo(dividerImg, { scale: 1.4 }, { scale: 1, ease: "none", immediateRender: false }, "<");
});
// Alternate Section Animate-in - ClipPath on Scroll
document.querySelectorAll("[data-alternate-section]").forEach((el) => {
  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: el,
      start: "top bottom",
      end: "top 10%",
      toggleActions: 'play none none reverse',
      scrub: true,
      // markers: true,
    }
  });
  tl.fromTo(el, {
      clipPath: "inset(0% 0% 0% 0% round 400px 400px 0 0)",
      ease: 'none',
    }, {
      clipPath: "inset(0% 0% 0% 0% round 16px 16px 0 0)",
      immediateRender: false
    });
});
// Grid Animation 4 cards
if(document.querySelector("[data-animate-card-4]")) {
  gsap.set("[data-animate-card-4]", {y: 50, opacity: 0});
  ScrollTrigger.batch("[data-animate-card-4]", {
    interval: 0.1,
    batchMax: 4,
    duration: 3,
    onEnter: batch => gsap.to(batch, {
      opacity: 1, 
      y: 0,
      ease: 'sine',
      stagger: {each: 0.15, grid: [1, 4]}, 
      overwrite: true
    }),
    onLeave: batch => gsap.set(batch, {opacity: 1, y: 0, overwrite: true}),
    onEnterBack: batch => gsap.to(batch, {opacity: 1, y: 0, stagger: 0.15, overwrite: true}),
    onLeaveBack: batch => gsap.set(batch, {opacity: 0, y: 50, overwrite: true})
  });
  ScrollTrigger.addEventListener("refreshInit", () => gsap.set("[data-animate-card-4]", {y: 0, opacity: 1}));
};
// Grid Animation 3 cards
if(document.querySelector("[data-animate-card-3]")) {
  gsap.set("[data-animate-card-3]", {y: 50, opacity: 0});
  ScrollTrigger.batch("[data-animate-card-3]", {
    interval: 0.1,
    batchMax: 3,
    duration: 3,
    onEnter: batch => gsap.to(batch, {
      opacity: 1, 
      y: 0,
      ease: 'sine',
      stagger: {each: 0.15, grid: [1, 3]}, 
      overwrite: true
    }),
    onLeave: batch => gsap.set(batch, {opacity: 1, y: 0, overwrite: true}),
    onEnterBack: batch => gsap.to(batch, {opacity: 1, y: 0, stagger: 0.15, overwrite: true}),
    onLeaveBack: batch => gsap.set(batch, {opacity: 0, y: 50, overwrite: true})
  });
  ScrollTrigger.addEventListener("refreshInit", () => gsap.set("[data-animate-card-3]", {y: 0, opacity: 1}));
};
// Grid Animation 2 cards
if(document.querySelector("[data-animate-card-2]")) {
  gsap.set("[data-animate-card-2]", {y: 50, opacity: 0});
  ScrollTrigger.batch("[data-animate-card-2]", {
    interval: 0.1,
    batchMax: 2,
    duration: 3,
    onEnter: batch => gsap.to(batch, {
      opacity: 1, 
      y: 0,
      ease: 'sine',
      stagger: {each: 0.15, grid: [1, 2]}, 
      overwrite: true
    }),
    onLeave: batch => gsap.set(batch, {opacity: 1, y: 0, overwrite: true}),
    onEnterBack: batch => gsap.to(batch, {opacity: 1, y: 0, stagger: 0.15, overwrite: true}),
    onLeaveBack: batch => gsap.set(batch, {opacity: 0, y: 50, overwrite: true})
  });
  ScrollTrigger.addEventListener("refreshInit", () => gsap.set("[data-animate-card-2]", {y: 0, opacity: 1}));
};
// --------------------------------------------- //
// Animation - Common Animations End
// --------------------------------------------- //

// --------------------------------------------- //
// Showcase - Projects Stacking Cards Demo Start
// --------------------------------------------- //
function mxdProjectsStack() {
  const containers = document.querySelectorAll(".mxd-stack-cards");
  if (!containers.length) return;

  containers.forEach((stackContainer) => {
    const cards = gsap.utils.toArray(stackContainer.querySelectorAll(".mxd-stack-cards__card"));
    if (!cards.length) return;

    const introCard = cards[0];

    // titles splitType
    const titles = gsap.utils.toArray(".card__title p");
    titles.forEach((title) => {
      const split = new SplitText(title, {
        type: "chars, words",
        wordsClass: "word",
        charsClass: "char",
        mask: "words",
        aria: "none",
      });
      gsap.set(split.words, { yPercent: 100, scaleY: 0, rotate: 10 });
    });
    // descriptions first state setup
    gsap.set(".card__descr", { y: "40px", opacity: 0 });

    // first card image setup
    const cardImgWrapper = introCard.querySelector(".card__image");
    const cardImg = introCard.querySelector(".card__image .card__media");
    const cardCover = introCard.querySelector(".card__cover");

    gsap.set(cardImgWrapper, { scale: 0.5, borderRadius: "400px" });
    gsap.set(cardImg, { scale: 1.5 });
    gsap.set(cardCover, { opacity: 0 });

    // animate in the texts
    function animateContentIn(titleWords, description) {
      gsap.to(titleWords, {
        yPercent: 0,
        autoAlpha: 1,
        scaleY: 1,
        rotate: 0,
        duration: 1,
        ease: "elastic.out(0.75, 0.6)",
        stagger: {
          amount: 0.3,
        }
      });
      gsap.to(description, {
        y: 0,
        opacity: 1,
        duration: 0.75,
        delay: 0.1,
        ease: "common",
      });
    }
    // animate out the texts
    function animateContentOut(titleWords, description) {
      gsap.to(titleWords, {
        yPercent: 100,
        autoAlpha: 0,
        scaleY: 0,
        rotate: 10,
        duration: 1,
        ease: "elastic.out(0.75, 0.6)",
        stagger: {
          amount: 0.3,
        }
      });
      gsap.to(description, {
        y: "40px",
        opacity: 0,
        duration: 0.1,
        ease: "common",
      });
    }

    const marquee = introCard.querySelector(".card__marquee");
    const titleWords = introCard.querySelectorAll(".word-mask .word");
    const description = introCard.querySelector(".card__descr");

    ScrollTrigger.create({
      trigger: introCard,
      start: "top top",
      end: "+=300vh",
      refreshPriority: 10, // Higher priority: Settles vertical measurements first
      onUpdate: (self) => {
        const progress = self.progress;
        const imgScale = 0.5 + progress * 0.5;
        const borderRadius = 400 - progress * 384;
        const innerImgScale = 1.5 - progress * 0.5;
        const innerCoverOpacity = 0 + progress * 1;

        gsap.set(cardImgWrapper, {
          scale: imgScale,
          borderRadius: borderRadius + "px",
        });
        gsap.set(cardImg, { scale: innerImgScale });
        gsap.set(cardCover, { opacity: innerCoverOpacity });

        if (imgScale >= 0.5 && imgScale <= 0.75) {
          const fadeProgress = (imgScale - 0.5) / (0.75 - 0.5);
          gsap.set(marquee, { opacity: 1 - fadeProgress });
        } else if (imgScale < 0.5) {
          gsap.set(marquee, { opacity: 1 });
        } else if (imgScale > 0.75) {
          gsap.set(marquee, { opacity: 0 });
        }

        if (progress >= 1 && !introCard.contentRevealed) {
          introCard.contentRevealed = true;
          animateContentIn(titleWords, description);
        }
        if (progress < 1 && introCard.contentRevealed) {
          introCard.contentRevealed = false;
          animateContentOut(titleWords, description);
        }
      },
    });

    cards.forEach((card, index) => {
      const isLastCard = index === cards.length - 1;
      ScrollTrigger.create({
        trigger: card,
        start: "top top",
        end: isLastCard ? "+=100vh" : "top top",
        endTrigger: isLastCard ? null : cards[cards.length - 1],
        pin: true,
        pinSpacing: isLastCard,
        refreshPriority: 10, // Settles pins early
      });
    });

    cards.forEach((card, index) => {
      if (index < cards.length - 1) {
        const cardWrapper = card.querySelector(".card__wrapper");
        ScrollTrigger.create({
          trigger: cards[index + 1],
          start: "top bottom",
          end: "top top",
          delay: 0.3,
          refreshPriority: 10,
          onUpdate: (self) => {
            const progress = self.progress;
            gsap.set(cardWrapper, {
              scale: 1 - progress * 0.15,
              opacity: 1 - progress,
            });
          }
        });
      }
    });

    cards.forEach((card, index) => {
      if (index > 0) {
        const cardImg = card.querySelector(".card__image img");
        const imgContainer = card.querySelector(".card__image");
        const cardCover = card.querySelector(".card__cover");
        ScrollTrigger.create({
          trigger: card,
          start: "top bottom",
          end: "top top",
          refreshPriority: 10,
          onUpdate: (self) => {
            const progress = self.progress;
            gsap.set(cardImg, { scale: 2 - progress });
            gsap.set(imgContainer, { borderRadius: 300 - progress * 284 + "px" });
            gsap.set(cardCover, { opacity: Math.max(0, (progress - 0.75) * 4) }); 
          }
        });
      }
    });

    cards.forEach((card, index) => {
      if (index === 0) return;

      const cardDescription = card.querySelector(".card__descr");
      const cardTitleWords = card.querySelectorAll(".word-mask .word");
      ScrollTrigger.create({
        trigger: card,
        start: "top top",
        refreshPriority: 10,
        onEnter: () => animateContentIn(cardTitleWords, cardDescription),
        onLeaveBack: () => animateContentOut(cardTitleWords, cardDescription),
      });
    });
  });
}
// --------------------------------------------- //
// Showcase - Projects Stacking Cards Demo End
// --------------------------------------------- //

// --------------------------------------------- //
// Showcase - Services Stacking Cards Start
// --------------------------------------------- //
function mxdServicesStack() {
  const containers = document.querySelectorAll("[data-services-stack]");
  if (!containers.length) return;

  containers.forEach((stackContainer) => {
    const cards = gsap.utils.toArray(
      stackContainer.querySelectorAll("[data-services-stack-card]")
    );
    if (!cards.length) return;

    // Pin cards (stack effect)
    cards.forEach((card, index) => {
      const isLast = index === cards.length - 1;

      ScrollTrigger.create({
        trigger: card,
        start: "top top",
        end: isLast ? "+=100vh" : "top top",
        endTrigger: isLast ? null : cards[cards.length - 1],
        pin: true,
        pinSpacing: isLast,
      });
    });

    // Image zoom + border radius
    cards.forEach((card) => {
      const img = card.querySelector("[data-services-stack-image] img");
      const wrapper = card.querySelector("[data-services-stack-image]");

      if (!img || !wrapper) return;

      gsap.set(img, { scale: 1.4 });
      gsap.set(wrapper, { borderRadius: "30rem" });

      ScrollTrigger.create({
        trigger: card,
        start: "top bottom",
        end: "top top",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;

          gsap.set(img, {
            scale: 1.4 - p * 0.4,
          });

          gsap.set(wrapper, {
            ease: "hop",
            borderRadius: `${30 - p * (30 - 1.6)}rem`,
          });
        },
      });
    });
  });
  window.addEventListener("resize", () => {
    ScrollTrigger.refresh();
  });
};
// --------------------------------------------- //
// Showcase - Services Stacking Cards End
// --------------------------------------------- //

// --------------------------------------------- //
// Showcase - Landing Stacking Cards Start
// --------------------------------------------- //
function mxdLandingStack() {
  const containers = document.querySelectorAll("[data-demo-stack]");
  if (!containers.length) return;

  containers.forEach((stackContainer) => {
    const cards = gsap.utils.toArray(
      stackContainer.querySelectorAll("[data-demo-stack-card]")
    );
    if (!cards.length) return;

    // Pin each card
    cards.forEach((card, index) => {
      const isLast = index === cards.length - 1;

      ScrollTrigger.create({
        trigger: card,
        start: "top top",
        end: isLast ? "+=100vh" : "top top",
        endTrigger: isLast ? null : cards[cards.length - 1],
        pin: true,
        pinSpacing: isLast,
      });
    });

    // Stack scale + fade
    cards.forEach((card, index) => {
      if (index >= cards.length - 1) return;

      const wrapper = card.querySelector("[data-demo-stack-wrapper]");

      ScrollTrigger.create({
        trigger: cards[index + 1],
        start: "top bottom",
        end: "top top",
        scrub: true,
        onUpdate: (self) => {
          gsap.set(wrapper, {
            scale: 1 - self.progress * 0.15,
            opacity: 1 - self.progress,
          });
        },
      });
    });

    // Image zoom on enter
    cards.forEach((card) => {
      const img = card.querySelector("[data-demo-stack-image] img");
      if (!img) return;

      gsap.set(img, { scale: 1.2 });

      ScrollTrigger.create({
        trigger: card,
        start: "top bottom",
        end: "top top",
        scrub: true,
        onUpdate: (self) => {
          gsap.set(img, {
            scale: 1.2 - self.progress * 0.2,
          });
        },
      });
    });
  });
}
// --------------------------------------------- //
// Showcase - Landing Stacking Cards End
// --------------------------------------------- //

// --------------------------------------------- //
// Features - Marquee Two Lines Start
// --------------------------------------------- //
const mxdMarqueeDouble = () => {
  const items = [...document.querySelectorAll(".marquee--gsap")];
  if (items) {
    const marqueeObject = {
      top: {
        el: null,
        width: 0
      },
      bottom: {
        el: null,
        width: 0
      }
    };
    items.forEach((itemBlock) => {
      marqueeObject.top.el = itemBlock.querySelectorAll(".marquee__top");
      marqueeObject.bottom.el = itemBlock.querySelectorAll(".marquee__bottom");
      marqueeObject.top.width = marqueeObject.top.el.offsetWidth;
      marqueeObject.bottom.width = marqueeObject.bottom.el.offsetWidth;
      marqueeObject.top.el.innerHTML += marqueeObject.top.el.innerHTML;
      marqueeObject.bottom.el.innerHTML += marqueeObject.bottom.el.innerHTML;
      let dirFromLeft = "-=50%";
      let dirFromRight = "+=50%";
      let master = gsap
        .timeline()
        .add(marquee(marqueeObject.top.el, 70, dirFromLeft), 0)
        .add(marquee(marqueeObject.bottom.el, 70, dirFromRight), 0);
      let tween = gsap.to(master, { 
        duration: 1.5, 
        timeScale: 1, 
        paused: true 
      });
      let timeScaleClamp = gsap.utils.clamp(1, 6);
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          master.timeScale(timeScaleClamp(Math.abs(self.getVelocity() / 200)));
          tween.invalidate().restart();
        }
      });
    });
  }
};
const marquee = (item, time, direction) => {
  let mod = gsap.utils.wrap(0, 50);
  return gsap.to(item, {
    duration: time,
    ease: "none",
    x: direction,
    modifiers: {
      x: (x) => (direction = mod(parseFloat(x)) + "%")
    },
    repeat: -1
  });
};
// --------------------------------------------- //
// Features - Marquee Two Lines End
// --------------------------------------------- //

// --------------------------------------------- //
// Features - Marquee One Line To Right Start
// --------------------------------------------- //
const mxdMarqueeRight = () => {
  const items = [...document.querySelectorAll(".marquee-right--gsap")];
  if (items) {
    const marqueeObject = {
      el: null,
      width: 0
    };
    items.forEach((itemBlock) => {
      marqueeObject.el = itemBlock.querySelector(".marquee__toright");
      marqueeObject.width = marqueeObject.el.offsetWidth;
      marqueeObject.el.innerHTML += marqueeObject.el.innerHTML;
      //let dirFromLeft = "-=50%";
      let dirFromRight = "+=50%";
      let master = gsap
        .timeline()
        //.add(marquee(marqueeObject.el, 20, dirFromLeft), 0);
        .add(marqueeRight(marqueeObject.el, 70, dirFromRight), 0);
      let tween = gsap.to(master, { 
        duration: 1.5, 
        timeScale: 1, 
        paused: true 
      });
      let timeScaleClamp = gsap.utils.clamp(1, 8);
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          master.timeScale(timeScaleClamp(Math.abs(self.getVelocity() / 100)));
          tween.invalidate().restart();
        }
      });
    });
  }
};
const marqueeRight = (item, time, direction) => {
  let mod = gsap.utils.wrap(0, 50);
  return gsap.to(item, {
    duration: time,
    ease: "none",
    x: direction,
    modifiers: {
      x: (x) => (direction = mod(parseFloat(x)) + "%")
    },
    repeat: -1
  });
};
// --------------------------------------------- //
// Features - Marquee One Line To Right End
// --------------------------------------------- //

// --------------------------------------------- //
// Features - Sticky Caption Start
// --------------------------------------------- //
function mxdDvStickyCaption() {
  document.querySelectorAll("[data-sticky]").forEach((caption) => {

    const content = caption.querySelector("[data-sticky-content]");
    const topArea = caption.querySelector("[data-sticky-top]");
    const centerArea = caption.querySelector("[data-sticky-center]");
    const bottomArea = caption.querySelector("[data-sticky-bottom]");
    const scrollArea = caption.querySelector("[data-sticky-scroll]");
    if (!content || !topArea || !centerArea || !bottomArea || !scrollArea) return;
    // 1. Flip from top → center when section hits top of viewport
    ScrollTrigger.create({
      trigger: caption,
      start: "top top",
      onEnter: () => flipTo(centerArea),
      onEnterBack: () => flipTo(centerArea),
      onLeaveBack: () => flipTo(topArea),
    });
    // 2. Flip from center → bottom when scroll area bottom touches bottom
    ScrollTrigger.create({
      trigger: scrollArea,
      start: "bottom bottom",
      onEnter: () => flipTo(bottomArea),
      onLeaveBack: () => flipTo(centerArea),
    });

    function flipTo(targetContainer) {
      // Avoid unnecessary re-append if already inside the target
      if (content.parentNode === targetContainer) return;
      const state = Flip.getState(content);
      targetContainer.appendChild(content);
      Flip.from(state, {
        duration: 0.6,
        ease: "none",
        absolute: true,
      });
    }

  });
}
// --------------------------------------------- //
// Features - Sticky Caption End
// --------------------------------------------- //

// --------------------------------------------- //
// Features - CountUp Counters Options Start
// --------------------------------------------- //
function mxdCounters() {
  const optionsNormal = { enableScrollSpy: true };
  const optionsDecimal = { decimalPlaces: 1, enableScrollSpy: true };
  const optionsDecimalTwo = { decimalPlaces: 2, enableScrollSpy: true };
  const optionsPercent = { suffix: '%', enableScrollSpy: true };
  const optionsK = { suffix: 'K', enableScrollSpy: true };
  const optionsPlus = { suffix: '+', enableScrollSpy: true };

  const initCounter = (id, endVal, options) => {
    const el = document.getElementById(id);
    if (el) {
      const counter = new countUp.CountUp(id, endVal, options);
      if (!counter.error) {
        counter.start();
      } else {
        console.error(counter.error);
      }
    }
  };

  initCounter("stats-counter-1", 50, optionsPlus);
  initCounter("stats-counter-2", 87, optionsPercent);
  initCounter("stats-counter-3", 5, optionsPlus);
  initCounter("stats-counter-4", 70, optionsPlus);
}
// --------------------------------------------- //
// Features - CountUp Counters Options End
// --------------------------------------------- //

// --------------------------------------------- //
// Features - Parallax Images & Video Start
// --------------------------------------------- //
function mxdImageParallax() {
  const parallaxItems = gsap.utils.toArray("[data-img-parallax], [data-img-parallax-small], [data-video-parallax]");
  
  parallaxItems.forEach((el) => {
    let scaleAmount = 1.4;
    if (el.hasAttribute("data-img-parallax-small")) {
      scaleAmount = 1.4; 
    }
    if (el.hasAttribute("data-video-parallax")) {
      scaleAmount = 1.4; 
    }

    gsap.set(el, {
      scale: scaleAmount,
      transformOrigin: "center center",
      force3D: true, 
    });

    gsap.fromTo(el, 
      {
        y: () => {
          const parentHeight = el.parentElement.clientHeight;
          const overflowPixels = (parentHeight * scaleAmount) - parentHeight;
          return -overflowPixels / 2;
        }
      },
      {
        y: () => {
          const parentHeight = el.parentElement.clientHeight;
          const overflowPixels = (parentHeight * scaleAmount) - parentHeight;
          return overflowPixels / 2;
        },
        ease: "none",
        scrollTrigger: {
          trigger: el.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
          refreshPriority: -1,
        }
      }
    );
  });
}
// --------------------------------------------- //
// Features - Parallax Images & Video End
// --------------------------------------------- //

// --------------------------------------------- //
// Features - Accordion Start
// --------------------------------------------- //
function mxdAccordion() {
  const titles = document.querySelectorAll(".mxd-accordion__title");
  if (titles.length === 0) return;

  titles.forEach((title) => {
    title.addEventListener("click", function (e) {
      e.preventDefault();

      const item = this.closest(".mxd-accordion__item");
      const content = this.nextElementSibling;
      const icon = this.querySelector(".mxd-accordion__icon");
      const isActive = this.classList.contains("accordion-active");

      if (!isActive) {
        titles.forEach((otherTitle) => {
          if (otherTitle !== this) {
            otherTitle.classList.remove("accordion-active", "accordion-opened");
            otherTitle.nextElementSibling.style.maxHeight = null;
            const otherIcon = otherTitle.querySelector(".mxd-accordion__icon");
            if (otherIcon) otherIcon.classList.remove("accordion-rotate");
          }
        });
      }

      this.classList.toggle("accordion-active");
      this.classList.toggle("accordion-opened");
      if (icon) icon.classList.toggle("accordion-rotate");

      if (content.style.maxHeight) {
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
      }
      setTimeout(() => {
        if (window.ScrollTrigger) {
          ScrollTrigger.refresh();
        }
      }, 400);
    });
  });
  window.addEventListener("load", () => {
    const defaultOpenItem = document.querySelector(".mxd-accordion__default");
    if (defaultOpenItem) {
      const defaultTitle = defaultOpenItem.querySelector(".mxd-accordion__title");
      if (defaultTitle) {
        defaultTitle.click();
      }
    }
  });
}
// --------------------------------------------- //
// Features - Accordion End
// --------------------------------------------- //

// --------------------------------------------- //
// Features - Inertia Stickers Start
// --------------------------------------------- //
function mxdStickers() {
  const mxdStickers = document.querySelectorAll("[data-sticker]").forEach(sticker => {

    let oldX = 0, oldY = 0, deltaX = 0, deltaY = 0;

    sticker.addEventListener("mousemove", (e) => {
      deltaX = e.clientX - oldX;
      deltaY = e.clientY - oldY;

      oldX = e.clientX;
      oldY = e.clientY;
    });

    sticker.addEventListener("mouseenter", () => {
      const tl = gsap.timeline({
        onComplete: () => {
          tl.kill()
        }
      })
      tl.timeScale(1.2)

      const image = sticker.querySelector("img");
      tl.to(image, {
        inertia: {
          x: {
            velocity: deltaX * 30,
            end: 0,
          },
          y: {
            velocity: deltaY * 30,
            end: 0,
          },
        },
      })
      tl.fromTo(image, {
        rotate: 0
      }, {
        duration: 0.4,
        rotate: (Math.random() - 0.5) * 30,
        yoyo: true,
        repeat: 1,
        ease: 'power1.inOut'
      }, '<')
    });

  });
}
// --------------------------------------------- //
// Features - Inertia Stickers End
// --------------------------------------------- //

// --------------------------------------------- //
// Features - Inertia Universal Start
// --------------------------------------------- //
function mxdInertia() {
  const containers = document.querySelectorAll("[data-inertia-cards]");
  if (!containers.length) return;

  containers.forEach((container) => {
    let oldX = 0;
    let oldY = 0;
    let deltaX = 0;
    let deltaY = 0;

    container.addEventListener("mousemove", (e) => {
      deltaX = e.clientX - oldX;
      deltaY = e.clientY - oldY;

      oldX = e.clientX;
      oldY = e.clientY;
    });

    container.querySelectorAll("[data-inertia-card]").forEach((card) => {
      const target = card.querySelector("[data-inertia-card-target]");
      if (!target) return;

      card.addEventListener("mouseenter", () => {
        const tl = gsap.timeline({
          onComplete: () => {
            tl.kill();
          },
        });

        tl.timeScale(1.2);

        tl.to(target, {
          inertia: {
            x: {
              velocity: deltaX * 30,
              end: 0,
            },
            y: {
              velocity: deltaY * 30,
              end: 0,
            },
          },
        });

        tl.fromTo(
          target,
          {
            rotate: 0,
          },
          {
            duration: 0.4,
            rotate: (Math.random() - 0.5) * 30,
            yoyo: true,
            repeat: 1,
            ease: "power1.inOut",
          },
          "<"
        );
      });
    });
  });
}
// --------------------------------------------- //
// Features - Inertia Universal End
// --------------------------------------------- //

// --------------------------------------------- //
// Features - Inertia Desktop Start
// --------------------------------------------- //
function mxdServicesInertia() {
  const root = document.querySelector('[data-inertia]');
  if (!root) { return; }

  const mm = gsap.matchMedia();

  mm.add("(min-width: 1200px)", () => {
    let oldX = 0, 
        oldY = 0, 
        deltaX = 0,
        deltaY = 0;

    const onMouseMove = (e) => {
        deltaX = e.clientX - oldX;
        deltaY = e.clientY - oldY;
        oldX = e.clientX;
        oldY = e.clientY;
    };
    root.addEventListener("mousemove", onMouseMove);

    const objects = root.querySelectorAll('[data-inertia-item]');
    objects.forEach(el => {
      const image = el.querySelector('[data-inertia-target]');
      if (!image) return;

      const onMouseEnter = () => {
        const tl = gsap.timeline({ 
            onComplete: () => {
                tl.kill();
            }
        });
        tl.timeScale(1.2);

        tl.to(image, {
          inertia: {
              x: { velocity: deltaX * 30, end: 0 },
              y: { velocity: deltaY * 30, end: 0 },
          },
        });

        tl.fromTo(image, {
          rotate: 0
        }, {
          duration: 0.4,
          rotate: (Math.random() - 0.5) * 30,
          yoyo: true, 
          repeat: 1,
          ease: 'power1.inOut'
        }, '<');

      };

      el.addEventListener('mouseenter', onMouseEnter);

      el._mxdMouseEnter = onMouseEnter;
    });

    return () => {
      root.removeEventListener("mousemove", onMouseMove);
      objects.forEach(el => {
        if (el._mxdMouseEnter) {
          el.removeEventListener('mouseenter', el._mxdMouseEnter);
        }
      });
    };
  });

  mm.add("(max-width: 1199px)", () => {
    const images = root.querySelectorAll('[data-inertia-target]');
    images.forEach(image => {
      gsap.killTweensOf(image);
      gsap.set(image, { clearProps: "all" });
    });
  });
}
// --------------------------------------------- //
// Features - Inertia Desktop End
// --------------------------------------------- //

// --------------------------------------------- //
// Features - Horizontal Cards Start
// --------------------------------------------- //
function mxdHorizontalCards() {
  document.querySelectorAll("[data-card-stack-wrap]").forEach(container => {
    let list = container.querySelector("[data-card-stack-list]");
    let cards = container.querySelectorAll("[data-card-stack-card]");
    let intro = container.querySelector("[data-card-stack-intro]");
    let outro = container.querySelector("[data-card-stack-outro]");
    if (!list || !cards.length) return;

    let mainTween = gsap.to(list, {
      // FIX: Calculate distance dynamically during page/resize calculations
      x: () => -(list.scrollWidth - window.innerWidth),
      ease: "none",
      scrollTrigger: {
        trigger: container,
        pin: true,
        scrub: true,
        start: "top top",
        // FIX: Calculate end value dynamically to map accurately with the previous section's heights
        end: () => `+=${list.scrollWidth - window.innerWidth}`, 
        invalidateOnRefresh: true,
        refreshPriority: 1, // Lower priority: Runs AFTER the stack section settles its spacers
      }
    });

    if (intro) {
      gsap.to(intro, {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          containerAnimation: mainTween,
          trigger: cards[0],
          start: "left left",
          end: "20% left",
          scrub: true,
          invalidateOnRefresh: true,
        }
      });
    }

    if (outro) {
      gsap.set(outro, { opacity: 0 });
      gsap.to(outro, {
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          containerAnimation: mainTween,
          trigger: cards[cards.length - 2],
          start: "right 80%", 
          end: "right 60%",
          scrub: true,
          invalidateOnRefresh: true,
        }
      });
    }

    cards.forEach((card, index) => {
      const isEven = index % 2 === 0;
      const startY = isEven ? "-30%" : "30%";
      const startAngle = isEven ? -10 : 10;
      gsap.fromTo(card, {
        y: startY,
        rotation: startAngle,
        }, {
          y: "0%",
          rotation: 0,
          ease: "none",
          scrollTrigger: {
              containerAnimation: mainTween,
              trigger: card,
              start: "left 95%",
              end: "left 45%",
              scrub: true,
              invalidateOnRefresh: true,
          }
      });
    });
  });
}
// --------------------------------------------- //
// Features - Horizontal Cards End
// --------------------------------------------- //

// --------------------------------------------- //
// Features - Pinned Split Block Start
// --------------------------------------------- //
function mxdPinnedSplit() {
  $("[data-pinned-split]").each(function (index) {
    let childTriggers = $(this).find("[data-pinned-split-text]");
    let childTargets = $(this).find("[data-pinned-split-img]");
    function makeItemActive(index) {
      childTriggers.removeClass('is-active');
      childTargets.removeClass('is-active');
      childTriggers.eq(index).addClass('is-active');
      childTargets.eq(index).addClass('is-active');
    }
    makeItemActive(0);
    childTriggers.each(function (index) {
      ScrollTrigger.create({
        trigger: $(this),
        start: "top center",
        end: "bottom center",
        onToggle: (isActive) => {
          if (isActive) {
            makeItemActive(index);
          }
        }
      })
    });
  });
}
// --------------------------------------------- //
// Features - Pinned Split Block End
// --------------------------------------------- //

// --------------------------------------------- //
// Swiper Slider - Testimonials Start
// --------------------------------------------- //
const testimonialsSlider = document.querySelector("testimonials-slider");
if (!testimonialsSlider) {
  const swiper = new Swiper('.swiper-testimonials', {
    effect: 'creative',
    slidesPerView: 'auto',
    grabCursor: true,
    centeredSlides: true,
    creativeEffect: {
      prev: {
        translate: ['-24%', 0, -100],
        rotate: [0, 0, -10],
        scale: 0.98,
      },
      next: {
        translate: ['24%', 0, -100],
        rotate: [0, 0, 10],
        scale: 0.98,
      },
    },
    loop: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
};
// --------------------------------------------- //
// Swiper Slider - Testimonials End
// --------------------------------------------- //

// --------------------------------------------- //
// Swiper Slider - Services Card Slider Start
// --------------------------------------------- //
const cardSlider = document.querySelector("services-card-slider");
if (!cardSlider) {
  const swiper = new Swiper('.swiper-services-card', {
    effect: 'fade',
    slidesPerView: 1,
    grabCursor: true,
    centeredSlides: true,
    autoplay: true,
    speed: 600,
    loop: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
};
// --------------------------------------------- //
// Swiper Slider - Services Card Slider End
// --------------------------------------------- //

// --------------------------------------------- //
// Swiper Slider - Inner Pages Demo Start
// --------------------------------------------- //
const innerDemoSlider = document.querySelector("mxd-demo-swiper");
if (!innerDemoSlider) {
  const swiper = new Swiper('.mxd-demo-swiper', {
    breakpoints: {
      640: {
        slidesPerView: 1,
        spaceBetween: 30,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
      1600: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
    },
    loop: true,
    parallax: true,
    autoplay: { disableOnInteraction: false, enabled: true },
    grabCursor: true,
    speed: 1200,
    centeredSlides: true,
    keyboard: { enabled: true },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
};
// --------------------------------------------- //
// Swiper Slider - Inner Pages Demo End
// --------------------------------------------- //

// --------------------------------------------- //
// Jquery - Jquery Dependent Components Start
// --------------------------------------------- //
$(function() {

  // --------------------------------------------- //
  // Menu Accordion Start
  // --------------------------------------------- //
  var Accordion = function(el, multiple) {
    this.el = el || {};
    this.multiple = multiple || false;
    var links = this.el.find('.main-menu__toggle');
    links.on('click', {el: this.el, multiple: this.multiple}, this.dropdown)
  }
  Accordion.prototype.dropdown = function(e) {
    var $el = e.data.el;
        $this = $(this),
        $next = $this.next();
    $next.slideToggle();
    $this.parent().toggleClass('open');
    if (!e.data.multiple) {
      $el.find('.submenu').not($next).slideUp().parent().removeClass('open');
    };
  }
  var accordion = new Accordion($('#main-menu'), false);
  // --------------------------------------------- //
  // Menu Accordion End
  // --------------------------------------------- //

  // --------------------------------------------- //
  // Magnific Popup Start
  // --------------------------------------------- //
  $("[data-popup-trigger]").magnificPopup({
    type: "inline",
    fixedContentPos: true,
    fixedBgPos: true,
    overflowY: "scroll",
    preloader: false,
    midClick: true,
    removalDelay: 600,
    mainClass: "mfp-fade",
  });
  // --------------------------------------------- //
  // Magnific Popup End
  // --------------------------------------------- //

  // --------------------------------------------- //
  // Mailchimp Subscribe Form Start
  // --------------------------------------------- //
  $('.subscribe-form').ajaxChimp({
    callback: mailchimpCallback,
    url: 'https://club.us10.list-manage.com/subscribe/post?u=e8d650c0df90e716c22ae4778&amp;id=54a7906900&amp;f_id=00b64ae4f0'
  });

  function mailchimpCallback(resp) {
    $('.subscribe').find('.form').addClass('is-hidden');
    $('.subscribe').find('.subscription-ok').addClass('is-visible');
    setTimeout(function() {
      $('.subscribe').find('.subscription-ok').removeClass('is-visible');
      $('.subscribe').find('.form').delay(300).removeClass('is-hidden');
      $('.subscribe-form').trigger("reset");
    }, 5000);
  };

  $('.subscribe-form').on('submit', function(e) {
    var form = $(this);
    setTimeout(function() {
      if (!form.hasClass('is-hidden')) {
        $('.subscribe').find('.form').addClass('is-hidden');
        $('.subscribe').find('.subscription-ok').addClass('is-visible');
        setTimeout(function() {
          $('.subscribe').find('.subscription-ok').removeClass('is-visible');
          $('.subscribe').find('.form').delay(300).removeClass('is-hidden');
          form.trigger("reset");
        }, 5000);
      }
    }, 1200);
  });
  // --------------------------------------------- //
  // Mailchimp Subscribe Form End
  // --------------------------------------------- //

  // --------------------------------------------- //
  // Contact Form Start
  // --------------------------------------------- //
  $("#contact-form").submit(function(e) {
    e.preventDefault();
    var th = $(this);
    $('.contact').find('.form').addClass('is-hidden');
    $('.contact').find('.form__reply').addClass('is-visible');
    setTimeout(function() {
      $('.contact').find('.form__reply').removeClass('is-visible');
      $('.contact').find('.form').delay(300).removeClass('is-hidden');
      th.trigger("reset");
    }, 5000);
    // Background POST if mail.php backend is active
    $.ajax({
      type: "POST",
      url: "mail.php",
      data: th.serialize()
    });
    return false;
  });
  // --------------------------------------------- //
  // Contact Form End
  // --------------------------------------------- //

});
// --------------------------------------------- //
// Jquery - Jquery Dependent Components End
// --------------------------------------------- //

// --------------------------------------------- //
// Hero - Scaling Video Start
// --------------------------------------------- //
function mxdHeroVideoScale() {
  const wrappers = document.querySelectorAll("[data-flip-element='wrapper']");
  const target = document.querySelector("[data-flip-element='target']");
  if (!wrappers.length || !target) { return; }

  let tl;
  function buildTimeline() {
    if (tl) {
      tl.kill();
      gsap.set(target, { clearProps: "all" });
    }
    tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrappers[0],
        start: "top center-=100",
        endTrigger: wrappers[wrappers.length - 1],
        end: "center bottom",
        scrub: 1,
        // markers: true,
      }
    });
    wrappers.forEach((el, i) => {
      const next = wrappers[i + 1];
      if (!next) return;
      const thisCenter = el.getBoundingClientRect().top + window.pageYOffset + el.offsetHeight / 2;
      const nextCenter = next.getBoundingClientRect().top + window.pageYOffset + next.offsetHeight / 2;
      const offset = nextCenter - thisCenter;

        tl.add(Flip.fit(target, next, {
          duration: offset,
          ease: "none"
        }));
    });
  }
  buildTimeline();

  // Debounced resize handler
  let resizeTimer;
  function handleResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(buildTimeline, 100);
  }
  window.addEventListener("resize", handleResize);

  // Return cleanup function for Slater
  return () => {
    if (tl) {
      tl.kill();
    }
    window.removeEventListener("resize", handleResize);
    clearTimeout(resizeTimer);
  };
}
// --------------------------------------------- //
// Hero - Scaling Video End
// --------------------------------------------- //

// --------------------------------------------- //
// Hero - Scaling Media Version 2 Start
// --------------------------------------------- //
function mxdHeroMediaScale() {
  const wrappers = document.querySelectorAll("[data-scale-element='wrapper']");
  const target = document.querySelector("[data-scale-element='target']");
  if (!wrappers.length || !target) { return; }

  let tl;
  function buildTimeline() {
    if (tl) {
      tl.kill();
      gsap.set(target, { clearProps: "all" });
    }
    tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrappers[0],
        start: "bottom center-=100",
        endTrigger: wrappers[wrappers.length - 1],
        end: "top center",
        scrub: 0.55
      }
    });
    wrappers.forEach((el, i) => {
      const next = wrappers[i + 1];
      if (!next) return;
      const thisCenter = el.getBoundingClientRect().top + window.pageYOffset + el.offsetHeight / 2;
      const nextCenter = next.getBoundingClientRect().top + window.pageYOffset + next.offsetHeight / 2;
      const offset = nextCenter - thisCenter;

        tl.add(Flip.fit(target, next, {
          duration: offset,
          ease: "none"
        }));
    });
  }
  buildTimeline();

  // Debounced resize handler
  let resizeTimer;
  function handleResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(buildTimeline, 100);
  }
  window.addEventListener("resize", handleResize);

  // Return cleanup function for Slater
  return () => {
    if (tl) {
      tl.kill();
    }
    window.removeEventListener("resize", handleResize);
    clearTimeout(resizeTimer);
  };
}
// --------------------------------------------- //
// Hero - Scaling Media Version 2 End
// --------------------------------------------- //

// --------------------------------------------- //
// Hero - Scroll Out Animation Start
// --------------------------------------------- //
function mxdHeroScrollOut() {
  fadeOutEl = document.querySelectorAll("[data-scroll-out-element]"); 
  fadeOutEl.forEach((element) => {
    let fadeOutTl = gsap.timeline({
      scrollTrigger: {
        trigger: "[data-scroll-out-trigger]",
        start: "top 80%",
        end: "top 20%",
        scrub: {
          scrub: true, 
          ease: "sine",
        }
      },
    });
    fadeOutTl.fromTo(element, 
      { 
        opacity: 1,
        transform: "translate3d(0, 0, 0)",
      }, { 
        opacity: 0,
        transform: "translate3d(0, -10rem, 0)",
      });
  });
}
// --------------------------------------------- //
// Hero - Scroll Out Animation End
// --------------------------------------------- //

// --------------------------------------------- //
// Hero - Title Shift Start
// --------------------------------------------- //
function mxdTitleShift() {
  const rotator = document.querySelector("[data-title-rotator]");
  if (!rotator) return;
  const tl = gsap.timeline({ repeat: -1 });

  tl.to(rotator, {
      duration: 0.7,
      text: "3D Designer (Rhino & Blender)",
      ease: "none",
      delay: 2
    })
    .to(rotator, {
      duration: 0.7,
      text: "Muralist & Live Painter",
      ease: "none",
      delay: 2
    })
    .to(rotator, {
      duration: 0.7,
      text: "Contemporary Visual Artist",
      ease: "none",
      delay: 2
    });
};
// --------------------------------------------- //
// Hero - Title Shift End
// --------------------------------------------- //