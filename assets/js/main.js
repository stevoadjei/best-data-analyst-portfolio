/**
 * Template Name: Kelly
 * Template URL: https://bootstrapmade.com/kelly-free-bootstrap-cv-resume-html-template/
 * Updated: Mar 17 2024 with Bootstrap v5.3.3
 * Author: BootstrapMade.com
 * License: https://bootstrapmade.com/license/
 */

(function () {
  "use strict";

  /**
   * Helper function: Select element(s)
   */
  const select = (el, all = false) =>
    all ? [...document.querySelectorAll(el.trim())] : document.querySelector(el.trim());

  /**
   * Helper function: Add event listener
   */
  const on = (type, el, listener, all = false) => {
    const elements = select(el, all);
    if (elements) {
      (Array.isArray(elements) ? elements : [elements]).forEach((e) =>
        e.addEventListener(type, listener)
      );
    }
  };

  /**
   * Scroll to element with offset
   */
  const scrollto = (el) => {
    const header = select("#header");
    const offset = header ? header.offsetHeight : 0;
    const targetPos = select(el).offsetTop;
    window.scrollTo({ top: targetPos - offset, behavior: "smooth" });
  };

  /**
   * Back-to-top button toggle
   */
  const backToTop = () => {
    const button = select(".back-to-top");
    if (!button) return;
    const toggleVisibility = () =>
      button.classList[window.scrollY > 100 ? "add" : "remove"]("active");
    window.addEventListener("load", toggleVisibility);
    document.addEventListener("scroll", toggleVisibility);
  };

  /**
   * Mobile Navigation
   */
  const mobileNav = () => {
    on("click", ".mobile-nav-toggle", (e) => {
      const navbar = select("#navbar");
      navbar.classList.toggle("navbar-mobile");
      e.target.classList.toggle("bi-list");
      e.target.classList.toggle("bi-x");
    });

    on(
      "click",
      ".navbar .dropdown > a",
      (e) => {
        if (select("#navbar").classList.contains("navbar-mobile")) {
          e.preventDefault();
          e.target.nextElementSibling.classList.toggle("dropdown-active");
        }
      },
      true
    );
  };

  /**
   * Scroll with offset for links with .scrollto class
   */
  const handleScrollToLinks = () => {
    on(
      "click",
      ".scrollto",
      (e) => {
        const target = select(e.target.hash);
        if (target) {
          e.preventDefault();
          const navbar = select("#navbar");
          if (navbar.classList.contains("navbar-mobile")) {
            navbar.classList.remove("navbar-mobile");
            const toggle = select(".mobile-nav-toggle");
            toggle.classList.toggle("bi-list");
            toggle.classList.toggle("bi-x");
          }
          scrollto(e.target.hash);
        }
      },
      true
    );

    window.addEventListener("load", () => {
      if (window.location.hash && select(window.location.hash)) {
        scrollto(window.location.hash);
      }
    });
  };

  /**
   * Preloader
   */
  const preloader = () => {
    const loader = select("#preloader");
    if (loader) {
      window.addEventListener("load", () => loader.remove());
    }
  };

  /**
   * Portfolio functionality: Isotope filtering and lightbox
   */
  const portfolio = () => {
    const container = select(".portfolio-container");
    if (container) {
      const isotope = new Isotope(container, { itemSelector: ".portfolio-item" });
      const filters = select("#portfolio-flters li", true);

      on(
        "click",
        "#portfolio-flters li",
        (e) => {
          e.preventDefault();
          filters.forEach((el) => el.classList.remove("filter-active"));
          e.target.classList.add("filter-active");
          isotope.arrange({ filter: e.target.getAttribute("data-filter") });
        },
        true
      );

      // Refresh animations after filtering
      isotope.on("arrangeComplete", () => AOS.refresh());
    }

    // Initialize portfolio lightboxes
    GLightbox({ selector: ".portfolio-lightbox" });
    GLightbox({ selector: ".portfolio-details-lightbox", width: "90%", height: "90vh" });
  };

  /**
   * Portfolio details slider
   */
  const portfolioSlider = () =>
    new Swiper(".portfolio-details-slider", {
      speed: 400,
      loop: true,
      autoplay: { delay: 5000, disableOnInteraction: false },
      pagination: { el: ".swiper-pagination", type: "bullets", clickable: true },
    });

  /**
   * Skills animation
   */
  const skillsAnimation = () => {
    const skillsContent = select(".skills-content");
    if (skillsContent) {
      new Waypoint({
        element: skillsContent,
        offset: "80%",
        handler: () => {
          select(".progress .progress-bar", true).forEach((bar) => {
            bar.style.width = bar.getAttribute("aria-valuenow") + "%";
          });
        },
      });
    }
  };

  /**
   * Testimonials slider
   */
  const testimonialsSlider = () =>
    new Swiper(".testimonials-slider", {
      speed: 600,
      loop: true,
      autoplay: { delay: 5000, disableOnInteraction: false },
      slidesPerView: "auto",
      pagination: { el: ".swiper-pagination", type: "bullets", clickable: true },
    });

  /**
   * Animation on scroll
   */
  const initAOS = () =>
    window.addEventListener("load", () =>
      AOS.init({ duration: 1000, easing: "ease-in-out", once: true, mirror: false })
    );

  /**
   * Pure Counter initialization
   */
  const initPureCounter = () => new PureCounter();

  /**
   * Scroll spy and smooth scrolling
   */
  function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link.js-scroll-trigger');
    
    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            const headerHeight = document.querySelector('#header').offsetHeight;
            const elementPosition = target.offsetTop;
            window.scrollTo({
                top: elementPosition - headerHeight,
                behavior: 'smooth'
            });
        });
    });

    // Scroll spy
    window.addEventListener('scroll', () => {
        let current = '';
        const headerHeight = document.querySelector('#header').offsetHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 20;
            const sectionHeight = section.offsetHeight;
            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
  }

  /**
   * Initialize all functions
   */
  const init = () => {
    backToTop();
    mobileNav();
    handleScrollToLinks();
    preloader();
    portfolio();
    portfolioSlider();
    skillsAnimation();
    testimonialsSlider();
    initAOS();
    initPureCounter();
    initScrollSpy();
  };

  init();
})();

/**
 * Download file helper
 */
function downloadFile(fileName) {
  const link = document.createElement("a");
  link.href = fileName;
  link.download = fileName.split("/").pop();
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Hero slider functionality
 */
(function () {
  "use strict";

  /**
   * Helper function: Select element(s)
   */
  const select = (el, all = false) =>
    all ? [...document.querySelectorAll(el.trim())] : document.querySelector(el.trim());

  // All other functions and initialization code...

  /**
   * Hero slider functionality
   */
  document.addEventListener("DOMContentLoaded", () => {
    const slides = select(".hero-slide", true);
    if (!slides.length) return;

    let currentSlide = 0;
    const activateSlide = () => {
      slides.forEach((slide, idx) => slide.classList.toggle("active", idx === currentSlide));
    };

    activateSlide(); // Activate the first slide
    setInterval(() => {
      currentSlide = (currentSlide + 1) % slides.length;
      activateSlide();
    }, 900); // 900ms interval
  });

  // Call init function or other code if needed...
})();

// Scroll spy functionality
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link.js-scroll-trigger');

function highlightNavItem() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Add scroll event listener
window.addEventListener('scroll', highlightNavItem);

// ...existing code...

document.addEventListener('DOMContentLoaded', function() {
  const filters = document.querySelectorAll('.btn-filter');
  const items = document.querySelectorAll('.portfolio-item');

  filters.forEach(filter => {
    filter.addEventListener('click', function() {
      const category = this.getAttribute('data-filter');
      
      filters.forEach(f => f.classList.remove('active'));
      this.classList.add('active');

      items.forEach(item => {
        item.classList.remove('show');
        if (category === '*' || item.classList.contains(category.substring(1))) {
          item.classList.add('show');
        }
      });
    });
  });

  // Show all items initially
  items.forEach(item => item.classList.add('show'));
});
/**
 * Read more/less toggle
 */
function toggleReadMore() {
  const dots = select("#dots");
  const moreText = select("#more");
  const button = select("#myBtn");

  const isHidden = dots.style.display === "none";
  dots.style.display = isHidden ? "inline" : "none";
  moreText.style.display = isHidden ? "none" : "inline";
  button.innerHTML = isHidden ? "Read more" : "Read less";
}

document.addEventListener('DOMContentLoaded', function() {
  // Initialize Swiper
  const heroSwiper = new Swiper('.swiper-container', {
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });

  // Portfolio isotope and filter
  window.addEventListener('load', () => {
    let portfolioContainer = document.querySelector('.portfolio-container');
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
      });

      let portfolioFilters = document.querySelectorAll('.portfolio-filters .btn-filter');
      portfolioFilters.forEach(filter => {
        filter.addEventListener('click', (e) => {
          e.preventDefault();
          portfolioFilters.forEach(el => el.classList.remove('active'));
          filter.classList.add('active');

          portfolioIsotope.arrange({
            filter: filter.getAttribute('data-filter') === '*' ? 
                   '*' : 
                   '.' + filter.getAttribute('data-filter')
          });
        });
      });
    }
  });

  // Initialize GLightbox
  const glightbox = GLightbox({
    selector: '.portfolio-lightbox'
  });
});

// Portfolio initialization
document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.portfolio-container');
    const template = document.getElementById('portfolio-item-template').content;

    // Create portfolio items
    portfolioItems.forEach(item => {
        const clone = document.importNode(template, true);
        const element = clone.querySelector('.portfolio-item');
        
        element.classList.add(item.category);
        element.querySelector('img').src = item.imgSrc;
        element.querySelector('img').alt = item.title;
        element.querySelector('.portfolio-info h4').textContent = item.title;
        element.querySelector('.portfolio-info p').textContent = item.description;
        element.querySelector('.portfolio-description p').textContent = item.summary;
        element.querySelector('.details-link').href = item.detailsLink;
        
        container.appendChild(clone);
    });

    // Initialize Isotope for filtering
    let portfolioIsotope = new Isotope('.portfolio-container', {
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
    });

    // Portfolio filters
    document.querySelectorAll('.portfolio-filters .btn-filter').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector('.portfolio-filters .active').classList.remove('active');
            this.classList.add('active');
            
            portfolioIsotope.arrange({
                filter: this.getAttribute('data-filter') === '*' ? '*' : '.' + this.getAttribute('data-filter')
            });
        });
    });
});

/**
 * Initialize Blog Carousel
 */
document.addEventListener('DOMContentLoaded', function() {
    // Blog carousel initialization
    new Swiper('.blog-carousel', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.blog-carousel .swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.blog-carousel .swiper-button-next',
            prevEl: '.blog-carousel .swiper-button-prev',
        }
    });
});

// Update particles.js configuration
particlesJS('particles-js',
  {
    "particles": {
      "number": {
        "value": 80,
        "density": {
          "enable": true,
          "value_area": 800
        }
      },
      "color": {
        "value": "#0984e3" // Changed to blue
      },
      "shape": {
        "type": "circle"
      },
      "opacity": {
        "value": 0.3, // Reduced opacity
        "random": false
      },
      "size": {
        "value": 3,
        "random": true
      },
      "line_linked": {
        "enable": true,
        "distance": 150,
        "color": "#0984e3", // Changed to blue
        "opacity": 0.2, // Reduced opacity
        "width": 1
      },
      "move": {
        "enable": true,
        "speed": 3, // Slightly slower
        "direction": "none",
        "random": false,
        "straight": false,
        "out_mode": "out",
        "bounce": false
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": true,
          "mode": "repulse"
        },
        "onclick": {
          "enable": true,
          "mode": "push"
        },
        "resize": true
      }
    },
    "retina_detect": true
  }
);

