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
          <video src="${videoUrl}" 
                 autoplay 
                 controls 
                 playsinline 
                 class="lightbox-media"
                 style="width:100%; height:100%;">
          </video>
        `;
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
});
