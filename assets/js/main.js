

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
     * REVERTED TO STABLE LOGIC, ENSURES CORRECT FILTER TARGETING.
     */
    const portfolio = () => {
        const container = select(".portfolio-container");
        if (container) {
            // Initialize Isotope with a stable configuration
            const isotope = new Isotope(container, {
                itemSelector: ".portfolio-item",
                // Use fitRows for predictable grid layout, fixes many alignment bugs
                layoutMode: 'fitRows'
            });
            
            // Select all filter buttons
            const filters = select(".btn-filter", true);

            // Attach click listener to buttons
            on(
                "click",
                ".btn-filter", // Correctly targets your button class
                (e) => {
                    e.preventDefault();
                    
                    // Update active state on buttons
                    filters.forEach((el) => el.classList.remove("active"));
                    e.target.classList.add("active");
                    
                    // Use Isotope to filter and arrange the items
                    isotope.arrange({ filter: e.target.getAttribute("data-filter") });
                    
                    // Force a re-layout after filtering to ensure the top-left alignment is reset
                    // This must be delayed slightly to account for CSS/AOS transitions
                    setTimeout(() => {
                        isotope.layout(); 
                    }, 500); 

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
     * Initialize all functions
     */
    const init = () => {
        backToTop();
        mobileNav();
        handleScrollToLinks();
        preloader();
        portfolio(); // Uses the stable logic
        portfolioSlider();
        skillsAnimation();
        testimonialsSlider();
        initAOS();
        initPureCounter();
    };

    init();
})();

// --- START: CUSTOM FUNCTIONS FROM YOUR ORIGINAL FILE ---

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
 * Hero slider functionality (Adjusted interval)
 */
(function () {
    "use strict";
    
    const select = (el, all = false) =>
        all ? [...document.querySelectorAll(el.trim())] : document.querySelector(el.trim());
    
    document.addEventListener("DOMContentLoaded", () => {
        const slides = select(".hero-slide", true);
        if (!slides.length) return;

        let currentSlide = 0;
        const activateSlide = () => {
            slides.forEach((slide, idx) => slide.classList.toggle("active", idx === currentSlide));
        };

        activateSlide(); 
        setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            activateSlide();
        }, 900); // 900ms interval
    });
})();

/**
 * Read more/less toggle
 */
function toggleReadMore() {
    const dots = document.querySelector("#dots");
    const moreText = document.querySelector("#more");
    const button = document.querySelector("#myBtn");
    
    if (!dots || !moreText || !button) return;

    const isHidden = dots.style.display === "none";
    dots.style.display = isHidden ? "inline" : "none";
    moreText.style.display = isHidden ? "none" : "inline";
    button.innerHTML = isHidden ? "Read more" : "Read less";
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Swiper for the hero section (Assumes .swiper-container exists)
    var swiper = new Swiper('.swiper-container', {
        loop: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
    });

    // Initialize Swiper for the testimonials section
    var testimonialSwiper = new Swiper('.testimonials-slider', {
        loop: true,
        slidesPerView: 1,
        slidesPerGroup: 1,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
    });

    // Initialize GLightbox for portfolio images
    const lightbox = GLightbox({
        selector: '.portfolio-lightbox'
    });

    // Mobile nav toggle and back-to-top logic (Consolidated from template functions)
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navbar = document.querySelector('#navbar');
    
    if(mobileNavToggle && navbar) {
        mobileNavToggle.addEventListener('click', () => {
            navbar.classList.toggle('navbar-mobile');
            mobileNavToggle.classList.toggle('bi-list');
            mobileNavToggle.classList.toggle('bi-x');
        });
    
        // Mobile nav dropdowns
        document.querySelectorAll('.navbar .dropdown > a').forEach(dropdown => {
            dropdown.addEventListener('click', (e) => {
                if (navbar.classList.contains('navbar-mobile')) {
                    e.preventDefault();
                    dropdown.nextElementSibling.classList.toggle('dropdown-active');
                }
            });
        });
    }

    // Back to top button
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                backToTopBtn.classList.add('active');
            } else {
                backToTopBtn.classList.remove('active');
            }
        });
    }

    // Preloader
    const preloader = document.querySelector('#preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.remove();
        });
    }

    // Scroll to section with offset
    document.querySelectorAll('.scrollto').forEach(link => {
        link.addEventListener('click', (e) => {
            if (document.querySelector(link.hash)) {
                e.preventDefault();
    
                let elementPos = document.querySelector(link.hash).offsetTop;
                window.scrollTo({
                    top: elementPos - 70, // Offset for fixed header
                    behavior: 'smooth'
                });
    
                if (navbar && navbar.classList.contains('navbar-mobile')) {
                    navbar.classList.remove('navbar-mobile');
                    mobileNavToggle.classList.toggle('bi-list');
                    mobileNavToggle.classList.toggle('bi-x');
                }
            }
        });
    });

    // Highlight navigation links as you scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('#navbar ul li a');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 80;
            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
});
