/**
 * Banner Slider — JT Studio
 * File: assets/jts-banner-slider.js
 *
 * Zero dependencies. Vanilla JS.
 * Features: fade/slide transitions, autoplay, keyboard nav,
 *           touch/swipe, pause-on-hover, accessible dots + arrows.
 */

(function () {
  'use strict';

  class BannerSlider {
    constructor(el) {
      this.el = el;
      this.slides = Array.from(el.querySelectorAll('.jts-bs__slide'));
      this.dots   = Array.from(el.querySelectorAll('.jts-bs__dot'));
      this.prevBtn = el.querySelector('.jts-bs__arrow--prev');
      this.nextBtn = el.querySelector('.jts-bs__arrow--next');

      if (this.slides.length < 1) return;

      this.current    = 0;
      this.total      = this.slides.length;
      this.autoplay   = el.dataset.autoplay !== 'false';
      this.speed      = parseInt(el.dataset.autoplaySpeed, 10) || 4500;
      this.transition = el.dataset.transition || 'fade';
      this.timer      = null;
      this.isAnimating = false;

      // Apply height setting
      const height = el.dataset.height || 'medium';
      el.dataset.height = height;

      this.init();
    }

    init() {
      // Bind controls
      if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prev());
      if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.next());

      this.dots.forEach((dot, i) => {
        dot.addEventListener('click', () => this.goTo(i));
      });

      // Keyboard
      this.el.setAttribute('tabindex', '0');
      this.el.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft')  this.prev();
        if (e.key === 'ArrowRight') this.next();
      });

      // Touch / swipe
      this.initTouch();

      // Pause on hover
      this.el.addEventListener('mouseenter', () => this.pauseAutoplay());
      this.el.addEventListener('mouseleave', () => this.startAutoplay());
      this.el.addEventListener('focusin',    () => this.pauseAutoplay());
      this.el.addEventListener('focusout',   () => this.startAutoplay());

      // Start
      this.goTo(0, true);
      if (this.autoplay && this.total > 1) this.startAutoplay();
    }

    goTo(index, instant = false) {
      if (this.isAnimating && !instant) return;
      if (index === this.current && !instant) return;

      this.isAnimating = true;

      const prev    = this.slides[this.current];
      const next    = this.slides[index];
      const prevDot = this.dots[this.current];
      const nextDot = this.dots[index];

      // Update classes
      if (this.transition === 'slide' && !instant) {
        prev.classList.add('is-leaving');
        next.classList.remove('is-active', 'is-leaving');
        // Force reflow
        void next.offsetWidth;
        next.classList.add('is-active');
        prev.addEventListener('transitionend', () => {
          prev.classList.remove('is-active', 'is-leaving');
          this.isAnimating = false;
        }, { once: true });
      } else {
        prev.classList.remove('is-active');
        next.classList.add('is-active');
        this.isAnimating = false;
      }

      // Dots
      if (prevDot) {
        prevDot.classList.remove('is-active');
        prevDot.setAttribute('aria-selected', 'false');
      }
      if (nextDot) {
        nextDot.classList.add('is-active');
        nextDot.setAttribute('aria-selected', 'true');
      }

      // Announce to screen readers
      this.el.setAttribute('aria-label', `Slide ${index + 1} de ${this.total}`);

      this.current = index;

      if (instant) this.isAnimating = false;
    }

    next() {
      this.goTo((this.current + 1) % this.total);
      this.resetAutoplay();
    }

    prev() {
      this.goTo((this.current - 1 + this.total) % this.total);
      this.resetAutoplay();
    }

    startAutoplay() {
      if (!this.autoplay || this.total < 2) return;
      this.pauseAutoplay();
      this.timer = setInterval(() => this.next(), this.speed);
    }

    pauseAutoplay() {
      clearInterval(this.timer);
      this.timer = null;
    }

    resetAutoplay() {
      if (this.autoplay) {
        this.pauseAutoplay();
        this.startAutoplay();
      }
    }

    initTouch() {
      let startX = 0;
      let startY = 0;
      let isDragging = false;

      this.el.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isDragging = true;
        this.pauseAutoplay();
      }, { passive: true });

      this.el.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;

        const deltaX = e.changedTouches[0].clientX - startX;
        const deltaY = e.changedTouches[0].clientY - startY;

        // Only swipe if horizontal movement dominates
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
          if (deltaX < 0) this.next();
          else this.prev();
        }
        this.startAutoplay();
      }, { passive: true });

      this.el.addEventListener('touchcancel', () => {
        isDragging = false;
        this.startAutoplay();
      }, { passive: true });
    }
  }

  // ── Init all sliders on the page ──
  function initAll() {
    document.querySelectorAll('.jts-banner-slider').forEach((el) => {
      if (!el._jtsSlider) {
        el._jtsSlider = new BannerSlider(el);
      }
    });
  }

  // Shopify section re-rendering (Theme Editor)
  document.addEventListener('shopify:section:load', initAll);
  document.addEventListener('shopify:block:select', (e) => {
    const slider = e.target.closest('.jts-banner-slider');
    if (slider && slider._jtsSlider) {
      const index = parseInt(e.target.dataset.index, 10);
      if (!isNaN(index)) slider._jtsSlider.goTo(index);
    }
  });

  // Standard DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

})();
