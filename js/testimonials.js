/* 
 * Professional Testimonial Slider Script
 * Counselor: Mrs. Preeti Pareek
 * Technology: Vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.testimonials-track');
  const slides = Array.from(document.querySelectorAll('.testimonial-slide'));
  const nextBtn = document.querySelector('.slider-btn-next');
  const prevBtn = document.querySelector('.slider-btn-prev');
  const dotsContainer = document.querySelector('.slider-dots');

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  let autoPlayTimer = null;
  const autoPlayDelay = 6000;

  // Clear existing dots first (safety fallback)
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
  }

  // Create Pagination Dots dynamically
  slides.forEach((_, idx) => {
    const dot = document.createElement('button');
    dot.classList.add('slider-dot');
    dot.setAttribute('aria-label', `Go to testimonial slide ${idx + 1}`);
    if (idx === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      goToSlide(idx);
      resetAutoPlay();
    });
    if (dotsContainer) {
      dotsContainer.appendChild(dot);
    }
  });

  const dots = dotsContainer ? Array.from(dotsContainer.querySelectorAll('.slider-dot')) : [];

  function updateSlider() {
    // Slide transition
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    // Update active slide class for fade effects and screen readers
    slides.forEach((slide, idx) => {
      if (idx === currentIndex) {
        slide.classList.add('active');
        slide.setAttribute('aria-hidden', 'false');
        // Let screen readers read if active
        slide.style.pointerEvents = 'auto';
      } else {
        slide.classList.remove('active');
        slide.setAttribute('aria-hidden', 'true');
        slide.style.pointerEvents = 'none';
      }
    });

    // Update active pagination dot
    if (dots.length > 0) {
      dots.forEach((dot, idx) => {
        if (idx === currentIndex) {
          dot.classList.add('active');
          dot.setAttribute('aria-current', 'true');
        } else {
          dot.classList.remove('active');
          dot.removeAttribute('aria-current');
        }
      });
    }
  }

  function goToSlide(index) {
    if (index < 0) {
      currentIndex = slides.length - 1;
    } else if (index >= slides.length) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }
    updateSlider();
  }

  function handleNext() {
    goToSlide(currentIndex + 1);
  }

  function handlePrev() {
    goToSlide(currentIndex - 1);
  }

  // Button Listeners with protection against clicks before init
  if (nextBtn) {
    nextBtn.addEventListener('click', () => { 
      handleNext(); 
      resetAutoPlay(); 
    });
  }
  if (prevBtn) {
    prevBtn.addEventListener('click', () => { 
      handlePrev(); 
      resetAutoPlay(); 
    });
  }

  // Keyboard navigation support
  document.addEventListener('keydown', (e) => {
    // Only scroll slide if slider element is currently in screen viewport to prevent accidental scrolls
    const rect = track.getBoundingClientRect();
    const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
    if (inViewport) {
      if (e.key === 'ArrowRight') {
        handleNext();
        resetAutoPlay();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
        resetAutoPlay();
      }
    }
  });

  // Mobile Touch/Swipe Support
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const swipeThreshold = 50; // min distance in pixels
    if (touchStartX - touchEndX > swipeThreshold) {
      // Swiped Left -> Next Slide
      handleNext();
      resetAutoPlay();
    } else if (touchEndX - touchStartX > swipeThreshold) {
      // Swiped Right -> Previous Slide
      handlePrev();
      resetAutoPlay();
    }
  }

  // Autoplay control functions
  function startAutoPlay() {
    if (autoPlayTimer) return;
    autoPlayTimer = setInterval(handleNext, autoPlayDelay);
  }

  function stopAutoPlay() {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
  }

  function resetAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
  }

  // Pause slides when mouse hovers over testimonials
  const sliderContainer = document.querySelector('.testimonials-slider-container');
  if (sliderContainer) {
    sliderContainer.addEventListener('mouseenter', stopAutoPlay);
    sliderContainer.addEventListener('mouseleave', startAutoPlay);
    sliderContainer.addEventListener('focusin', stopAutoPlay); // accessibility focus
    sliderContainer.addEventListener('focusout', startAutoPlay);
  }

  // Trigger first draw
  updateSlider();
  startAutoPlay();
});
