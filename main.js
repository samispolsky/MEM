/**
 * BEMIT.PL - Main JavaScript
 * Handles mobile menu, form interactions, and other UI enhancements
 */

// Mobile Menu Toggle
class MobileMenu {
  constructor() {
    this.menuButton = document.getElementById('mobile-menu-button');
    this.navigation = document.getElementById('navigation');
    this.init();
  }

  init() {
    if (this.menuButton && this.navigation) {
      this.menuButton.addEventListener('click', () => this.toggle());

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!this.menuButton.contains(e.target) && !this.navigation.contains(e.target)) {
          this.close();
        }
      });

      // Close menu on window resize to desktop size
      window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
          this.close();
        }
      });
    }
  }

  toggle() {
    this.navigation.classList.toggle('open');
    const isOpen = this.navigation.classList.contains('open');
    this.menuButton.setAttribute('aria-expanded', isOpen);

    // Animate hamburger icon
    if (isOpen) {
      this.animateOpen();
    } else {
      this.animateClose();
    }
  }

  close() {
    this.navigation.classList.remove('open');
    this.menuButton.setAttribute('aria-expanded', 'false');
    this.animateClose();
  }

  animateOpen() {
    const spans = this.menuButton.querySelectorAll('span');
    if (spans.length === 3) {
      spans[0].style.transform = 'rotate(45deg) translateY(8px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
    }
  }

  animateClose() {
    const spans = this.menuButton.querySelectorAll('span');
    if (spans.length === 3) {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  }
}

// Newsletter Form Handler
class NewsletterForm {
  constructor() {
    this.form = document.querySelector('.newsletter-form');
    this.init();
  }

  init() {
    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    const emailInput = this.form.querySelector('.newsletter-input');
    const email = emailInput.value.trim();

    if (this.validateEmail(email)) {
      // Here you would normally send the email to your backend
      this.showSuccess();
      emailInput.value = '';
    } else {
      this.showError();
    }
  }

  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  showSuccess() {
    const button = this.form.querySelector('.newsletter-button');
    const originalText = button.textContent;
    button.textContent = '✓ Zapisano!';
    button.style.backgroundColor = '#10B981';

    setTimeout(() => {
      button.textContent = originalText;
      button.style.backgroundColor = '';
    }, 3000);
  }

  showError() {
    const input = this.form.querySelector('.newsletter-input');
    input.style.borderColor = '#EF4444';
    input.placeholder = 'Podaj poprawny adres email';

    setTimeout(() => {
      input.style.borderColor = '';
      input.placeholder = 'Twój adres email';
    }, 3000);
  }
}

// Add to Cart Button Handler
class AddToCart {
  constructor() {
    this.buttons = document.querySelectorAll('.add-to-cart');
    this.init();
  }

  init() {
    this.buttons.forEach(button => {
      button.addEventListener('click', (e) => this.handleClick(e));
    });
  }

  handleClick(e) {
    e.preventDefault();
    const button = e.currentTarget;

    // Visual feedback
    const originalText = button.textContent;
    button.textContent = '✓ Dodano!';
    button.style.backgroundColor = '#10B981';

    // Update cart badge (mock)
    this.updateCartBadge();

    // Reset button after 2 seconds
    setTimeout(() => {
      button.textContent = originalText;
      button.style.backgroundColor = '';
    }, 2000);
  }

  updateCartBadge() {
    const badge = document.querySelector('.icon-badge');
    if (badge) {
      const currentCount = parseInt(badge.textContent) || 0;
      badge.textContent = currentCount + 1;

      // Animate badge
      badge.style.transform = 'scale(1.3)';
      setTimeout(() => {
        badge.style.transform = '';
      }, 300);
    }
  }
}

// Smooth Scroll for Anchor Links
class SmoothScroll {
  constructor() {
    this.links = document.querySelectorAll('a[href^="#"]');
    this.init();
  }

  init() {
    this.links.forEach(link => {
      link.addEventListener('click', (e) => this.handleClick(e));
    });
  }

  handleClick(e) {
    const href = e.currentTarget.getAttribute('href');

    // Only handle if it's a real anchor (not just #)
    if (href && href !== '#') {
      const target = document.querySelector(href);

      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  }
}

// Lazy Loading Images Enhancement (for older browsers)
class LazyLoadImages {
  constructor() {
    this.images = document.querySelectorAll('img[loading="lazy"]');
    this.init();
  }

  init() {
    // Check if browser supports native lazy loading
    if ('loading' in HTMLImageElement.prototype) {
      // Native lazy loading is supported
      return;
    }

    // Fallback for older browsers
    if ('IntersectionObserver' in window) {
      this.observeImages();
    } else {
      // Load all images immediately on very old browsers
      this.loadAllImages();
    }
  }

  observeImages() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });

    this.images.forEach(img => imageObserver.observe(img));
  }

  loadAllImages() {
    this.images.forEach(img => {
      img.src = img.dataset.src || img.src;
    });
  }
}

// Search Form Handler
class SearchForm {
  constructor() {
    this.form = document.querySelector('.search-wrapper');
    this.input = document.querySelector('.search-input');
    this.init();
  }

  init() {
    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    if (this.input) {
      // Show search suggestions on focus (placeholder for future enhancement)
      this.input.addEventListener('focus', () => {
        // Could implement autocomplete/suggestions here
      });
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    const searchQuery = this.input.value.trim();

    if (searchQuery) {
      // Here you would normally redirect to search results page
      // For now, just log it
      console.log('Searching for:', searchQuery);

      // Example: redirect to search page
      // window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  }
}

// Header Scroll Effect (optional - adds shadow on scroll)
class HeaderScrollEffect {
  constructor() {
    this.header = document.querySelector('.header');
    this.init();
  }

  init() {
    if (this.header) {
      window.addEventListener('scroll', () => this.handleScroll());
    }
  }

  handleScroll() {
    if (window.scrollY > 10) {
      this.header.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
    } else {
      this.header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    }
  }
}

// Initialize all components when DOM is ready
function initApp() {
  // Core functionality
  new MobileMenu();
  new NewsletterForm();
  new AddToCart();
  new SearchForm();

  // Enhancements
  new SmoothScroll();
  new LazyLoadImages();
  new HeaderScrollEffect();

  console.log('✅ Bemit.pl initialized successfully!');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  // DOM is already ready
  initApp();
}

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    MobileMenu,
    NewsletterForm,
    AddToCart,
    SearchForm
  };
}
