/* ==========================================================================
   Main Client-Side Interactions for Lung Nuad Portfolio
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Header Scroll Effect
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 1.1 Force Play Background Video & handle autoplay restrictions
  const heroVideo = document.querySelector('.hero-video');
  if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.playsInline = true;
    
    const playVideo = () => {
      const playPromise = heroVideo.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log("Hero video autoplay started successfully.");
        }).catch(err => {
          console.log("Autoplay blocked, waiting for interaction:", err);
          // Play on first user touch/click
          const forcePlay = () => {
            heroVideo.play().catch(e => console.log("Force play failed:", e));
            document.removeEventListener('click', forcePlay);
            document.removeEventListener('touchstart', forcePlay);
          };
          document.addEventListener('click', forcePlay);
          document.addEventListener('touchstart', forcePlay);
        });
      }
    };
    
    playVideo();
    window.addEventListener('load', playVideo);
  }

  // 2. Mobile Navigation Toggle
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const toggleIcon = mobileToggle.querySelector('i');

  mobileToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    if (navMenu.classList.contains('open')) {
      toggleIcon.className = 'fa-solid fa-xmark';
    } else {
      toggleIcon.className = 'fa-solid fa-bars';
    }
  });

  // Close mobile menu when nav-links are clicked
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      toggleIcon.className = 'fa-solid fa-bars';
      
      // Update active state
      navLinks.forEach(item => item.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // 3. Portfolio Category Filtering
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active class on buttons
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          item.style.display = 'block';
          // Smooth fade-in animation
          item.style.opacity = '0';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transition = 'opacity 0.4s ease-out';
          }, 50);
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // 4. Video Lightbox Modal
  const lightbox = document.getElementById('video-lightbox');
  const lightboxClose = document.querySelector('.lightbox-close');
  const mediaContainer = document.getElementById('lightbox-media-container');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');

  portfolioItems.forEach(item => {
    item.addEventListener('click', () => {
      const videoType = item.getAttribute('data-video-type');
      const title = item.querySelector('.item-title').textContent;
      const desc = item.querySelector('.item-desc').textContent;

      // Set titles
      lightboxTitle.textContent = title;
      lightboxDesc.textContent = desc;

      // Inject media based on source type
      if (videoType === 'youtube') {
        const videoId = item.getAttribute('data-video-id');
        mediaContainer.innerHTML = `
          <iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1" 
                  allow="autoplay; encrypted-media; picture-in-picture" 
                  allowfullscreen 
                  class="lightbox-media">
          </iframe>
        `;
      } else if (videoType === 'wix') {
        const videoUrl = item.getAttribute('data-video-url');
        mediaContainer.innerHTML = `
          <div class="video-loading-indicator" style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); color:#fff; font-size:16px; font-family:sans-serif; display:flex; flex-direction:column; align-items:center; gap:10px; z-index: 10;">
            <i class="fa-solid fa-circle-notch fa-spin" style="font-size:32px; color:var(--primary-color);"></i>
            <span>กำลังโหลดวิดีโอ...</span>
          </div>
          <video id="lightbox-video" 
                 src="${videoUrl}" 
                 controls 
                 playsinline 
                 crossorigin="anonymous"
                 class="lightbox-media"
                 style="width:100%; height:100%; opacity:0; transition:opacity 0.3s ease; z-index: 11;">
          </video>
        `;
        
        const videoEl = document.getElementById('lightbox-video');
        const loaderEl = mediaContainer.querySelector('.video-loading-indicator');
        
        if (videoEl) {
          videoEl.addEventListener('canplay', () => {
            if (loaderEl) loaderEl.style.display = 'none';
            videoEl.style.opacity = '1';
          });
          
          videoEl.play().catch(err => {
            console.log("Playback prevented, user can click play manually:", err);
            if (loaderEl) loaderEl.style.display = 'none';
            videoEl.style.opacity = '1';
          });
        }
      }

      // Open modal & prevent background scroll
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  // 4.1 Play Commercial Cards inline in their slot
  const commercialCards = document.querySelectorAll('.commercial-card');
  commercialCards.forEach(card => {
    card.addEventListener('click', () => {
      const videoType = card.getAttribute('data-video-type');
      const thumb = card.querySelector('.commercial-thumb');
      
      // If already playing (iframe is present), do nothing
      if (thumb.querySelector('iframe')) return;
      
      if (videoType === 'youtube') {
        const videoId = card.getAttribute('data-video-id');
        thumb.innerHTML = `
          <iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1" 
                  allow="autoplay; encrypted-media; picture-in-picture" 
                  allowfullscreen 
                  class="lightbox-media"
                  style="width:100%; height:100%; border:none;">
          </iframe>
        `;
      }
    });
  });

  // Close Lightbox
  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = 'auto';
    // Clear inner HTML to stop audio/video playback
    mediaContainer.innerHTML = '';
  }

  lightboxClose.addEventListener('click', closeLightbox);
  
  // Close lightbox on clicking outside content
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Close on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) {
      closeLightbox();
    }
  });

  // 5. Contact Form Submission Simulation
  const contactForm = document.getElementById('portfolio-contact-form');
  const successModal = document.getElementById('success-modal');
  const closeSuccessBtn = document.querySelector('.btn-close-success');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Simulate API submission delay
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'กำลังส่งข้อมูล...';
      submitBtn.disabled = true;

      setTimeout(() => {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;

        // Reset form inputs
        contactForm.reset();

        // Show success modal
        successModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }, 1200);
    });
  }

  // Close Success Modal
  if (closeSuccessBtn) {
    closeSuccessBtn.addEventListener('click', () => {
      successModal.classList.remove('open');
      document.body.style.overflow = 'auto';
    });
  }

  // 6. Scroll Reveal Animation Trigger
  const scrollElements = document.querySelectorAll('.animate-on-scroll');

  const elementInView = (el, dividend = 1) => {
    const elementTop = el.getBoundingClientRect().top;
    return (
      elementTop <=
      (window.innerHeight || document.documentElement.clientHeight) / dividend
    );
  };

  const displayScrollElement = (element) => {
    element.classList.add('appear');
  };

  const handleScrollAnimation = () => {
    scrollElements.forEach((el) => {
      if (elementInView(el, 1.15)) {
        displayScrollElement(el);
      }
    });
  };

  // Run on scroll
  window.addEventListener('scroll', () => {
    handleScrollAnimation();
  });
  
  // Run once on load to reveal elements currently in view
  handleScrollAnimation();

  // 7. 3D Netflix Carousel Slider
  const slides = document.querySelectorAll('.netflix-slide');
  const prevBtn = document.querySelector('.prev-arrow');
  const nextBtn = document.querySelector('.next-arrow');
  const dotsContainer = document.querySelector('.netflix-carousel-dots');
  
  if (slides.length > 0) {
    let currentIndex = 0;
    const numSlides = slides.length;
    let autoPlayTimer = null;

    // Create pagination dots
    slides.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.className = `dot \${idx === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => {
        goToSlide(idx);
        resetAutoPlay();
      });
      dotsContainer.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.netflix-carousel-dots .dot');

    function updateCarousel() {
      slides.forEach((slide, idx) => {
        // Remove old classes
        slide.className = 'netflix-slide';
        
        // Calculate relative offset with wrap-around
        let offset = idx - currentIndex;
        
        // Adjust offset for loop
        if (offset < -2) offset += numSlides;
        if (offset > 2) offset -= numSlides;

        // Apply classes based on relative position
        if (offset === 0) {
          slide.classList.add('active');
        } else if (offset === -1) {
          slide.classList.add('prev');
        } else if (offset === 1) {
          slide.classList.add('next');
        } else if (offset === -2) {
          slide.classList.add('far-prev');
        } else if (offset === 2) {
          slide.classList.add('far-next');
        } else {
          // Offscreen
          slide.style.opacity = '0';
          slide.style.pointerEvents = 'none';
        }
      });

      // Update dots
      dots.forEach((dot, idx) => {
        if (idx === currentIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });

      // Update active slide details dynamically
      const activeSlide = slides[currentIndex];
      const detailsContainer = document.querySelector('.active-slide-details');
      if (activeSlide && detailsContainer) {
        const badge = activeSlide.getAttribute('data-badge') || '';
        const title = activeSlide.getAttribute('data-title') || '';
        const desc = activeSlide.getAttribute('data-desc') || '';
        const videoId = activeSlide.getAttribute('data-video-id') || '';

        // Quick fade-out animation for smooth transitions
        detailsContainer.style.opacity = '0';
        detailsContainer.style.transform = 'translateY(5px)';

        setTimeout(() => {
          const badgeEl = detailsContainer.querySelector('.slide-badge');
          const titleEl = detailsContainer.querySelector('.slide-title');
          const descEl = detailsContainer.querySelector('.slide-desc');
          const watchBtn = detailsContainer.querySelector('.btn-watch');

          if (badgeEl) badgeEl.textContent = badge;
          if (titleEl) titleEl.textContent = title;
          if (descEl) descEl.textContent = desc;
          if (watchBtn) watchBtn.setAttribute('data-video-id', videoId);

          // Fade back in
          detailsContainer.style.opacity = '1';
          detailsContainer.style.transform = 'translateY(0)';
        }, 150);
      }
    }

    function nextSlide() {
      currentIndex = (currentIndex + 1) % numSlides;
      updateCarousel();
    }

    function prevSlide() {
      currentIndex = (currentIndex - 1 + numSlides) % numSlides;
      updateCarousel();
    }

    function goToSlide(idx) {
      currentIndex = idx;
      updateCarousel();
    }

    // Direct slide clicks
    slides.forEach((slide, idx) => {
      slide.addEventListener('click', (e) => {
        if (idx !== currentIndex) {
          e.preventDefault();
          goToSlide(idx);
          resetAutoPlay();
        }
      });
    });

    // Arrow button listeners
    if (prevBtn && nextBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        prevSlide();
        resetAutoPlay();
      });
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        nextSlide();
        resetAutoPlay();
      });
    }

    // Swipe / Drag gesture detection
    let startX = 0;
    let endX = 0;
    const carouselContainer = document.querySelector('.netflix-carousel');

    if (carouselContainer) {
      carouselContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
      }, { passive: true });

      carouselContainer.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
      }, { passive: true });

      carouselContainer.addEventListener('mousedown', (e) => {
        startX = e.clientX;
      });

      carouselContainer.addEventListener('mouseup', (e) => {
        endX = e.clientX;
        handleSwipe();
      });

      function handleSwipe() {
        const threshold = 50; // minimum distance to count as swipe
        const diff = startX - endX;
        
        if (Math.abs(diff) > threshold) {
          if (diff > 0) {
            nextSlide();
          } else {
            prevSlide();
          }
          resetAutoPlay();
        }
      }
    }

    // Auto Play
    function startAutoPlay() {
      autoPlayTimer = setInterval(nextSlide, 5000);
    }

    function resetAutoPlay() {
      clearInterval(autoPlayTimer);
      startAutoPlay();
    }

    // Pause autoplay on hover
    if (carouselContainer) {
      carouselContainer.addEventListener('mouseenter', () => {
        clearInterval(autoPlayTimer);
      });
      carouselContainer.addEventListener('mouseleave', startAutoPlay);
    }

    // Initialize
    updateCarousel();
    startAutoPlay();
  }

  // Handle click on WATCH button in the active slide details
  const activeWatchBtn = document.querySelector('.active-slide-details .btn-watch');
  if (activeWatchBtn) {
    activeWatchBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const videoId = activeWatchBtn.getAttribute('data-video-id');
      const titleEl = document.querySelector('.active-slide-details .slide-title');
      const descEl = document.querySelector('.active-slide-details .slide-desc');
      const title = titleEl ? titleEl.textContent : '';
      const desc = descEl ? descEl.textContent : '';

      // Set titles
      lightboxTitle.textContent = title;
      lightboxDesc.textContent = desc;

      // Inject YouTube iframe
      mediaContainer.innerHTML = `
        <iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1" 
                allow="autoplay; encrypted-media; picture-in-picture" 
                allowfullscreen 
                class="lightbox-media">
        </iframe>
      `;

      // Open lightbox
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  // 8. Continue Watching Slider Horizontal Scroll & click lightbox handlers
  const track = document.querySelector('.watching-track');
  const prevWatching = document.querySelector('.prev-watching');
  const nextWatching = document.querySelector('.next-watching');
  
  if (track && prevWatching && nextWatching) {
    const scrollAmount = 300;
    
    prevWatching.addEventListener('click', () => {
      track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
    
    nextWatching.addEventListener('click', () => {
      track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
  }

  const watchingCards = document.querySelectorAll('.watching-card');
  watchingCards.forEach(card => {
    card.addEventListener('click', () => {
      const videoId = card.getAttribute('data-video-id');
      const title = card.querySelector('.watching-card-title').textContent;
      const subtitle = card.querySelector('.watching-card-subtitle').textContent;

      // Set titles in lightbox
      lightboxTitle.textContent = title;
      lightboxDesc.textContent = subtitle;

      // Inject YouTube iframe
      mediaContainer.innerHTML = `
        <iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1" 
                allow="autoplay; encrypted-media; picture-in-picture" 
                allowfullscreen 
                class="lightbox-media">
        </iframe>
      `;

      // Open lightbox
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });
});
