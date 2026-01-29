/* ============================================ */
/* FILE: js/main.js */
/* ============================================ */

// Image modal functions
function openModal(element) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const img = element.querySelector('img');
    
    if (modal && modalImage && img) {
        modalImage.src = img.src;
        modalImage.alt = img.alt;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Progression Slider
let currentSlide = 0;

function initProgressionSlider() {
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    const dots = document.querySelectorAll('.progression-dot');
    const images = document.querySelectorAll('.progression-image');
    const contents = document.querySelectorAll('.progression-content');
    
    if (!images.length || !contents.length) return;
    
    const totalSlides = images.length;
    let isAnimating = false;
    
    // Arrow navigation
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentSlide > 0 && !isAnimating) {
                goToSlide(currentSlide - 1, 'prev');
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentSlide < totalSlides - 1 && !isAnimating) {
                goToSlide(currentSlide + 1, 'next');
            }
        });
    }
    
    // Dot navigation
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const targetSlide = parseInt(dot.getAttribute('data-slide'));
            if (targetSlide !== currentSlide && !isAnimating) {
                const direction = targetSlide > currentSlide ? 'next' : 'prev';
                goToSlide(targetSlide, direction);
            }
        });
    });
    
    function goToSlide(slideIndex, direction) {
        if (isAnimating) return;
        
        isAnimating = true;
        const previousSlide = currentSlide;
        currentSlide = slideIndex;
        
        // Slide out previous image, slide in new image
        const previousImage = images[previousSlide];
        const currentImage = images[currentSlide];
        
        if (direction === 'next') {
            previousImage.classList.add('exit-left');
        } else {
            previousImage.classList.add('exit-right');
        }
        previousImage.classList.remove('active');
        
        // Slide in new image
        setTimeout(() => {
            currentImage.classList.remove('exit-left', 'exit-right');
            currentImage.classList.add('active');
            
            // Clean up previous image classes
            setTimeout(() => {
                previousImage.classList.remove('exit-left', 'exit-right');
            }, 600);
        }, 50);
        
        // Animate text based on direction
        const previousContent = contents[previousSlide];
        const currentContent = contents[currentSlide];
        
        // Exit animation for previous content (slide left/right)
        if (direction === 'next') {
            previousContent.classList.add('exit-left');
        } else {
            previousContent.classList.add('exit-right');
        }
        previousContent.classList.remove('active');
        
        // Enter animation for new content
        setTimeout(() => {
            currentContent.classList.remove('exit-left', 'exit-right');
            currentContent.classList.add('active');
            
            // Clean up previous content classes
            setTimeout(() => {
                previousContent.classList.remove('exit-left', 'exit-right');
                isAnimating = false;
            }, 500);
        }, 100);
        
        // Update dots
        dots.forEach((dot, index) => {
            if (index === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        // Update arrow buttons
        if (prevBtn) {
            prevBtn.disabled = currentSlide === 0;
        }
        if (nextBtn) {
            nextBtn.disabled = currentSlide === totalSlides - 1;
        }
    }
    
    // Initialize - show first slide
    if (images.length > 0) {
        images[0].classList.add('active');
        contents[0].classList.add('active');
    }
    
    // Update initial button states
    if (prevBtn) prevBtn.disabled = true;
    if (nextBtn) nextBtn.disabled = totalSlides <= 1;
}

// Feature Section Before/After Toggle
function initFeatureToggles() {
    const featureArrows = document.querySelectorAll('.feature-arrow');
    
    featureArrows.forEach(arrow => {
        arrow.addEventListener('click', function() {
            const wrapper = this.closest('.feature-image-wrapper');
            const images = wrapper.querySelectorAll('.feature-image');
            const currentIndex = Array.from(images).findIndex(img => img.classList.contains('active'));
            const direction = this.dataset.direction;
            
            let nextIndex;
            if (direction === 'next') {
                nextIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
            } else {
                nextIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
            }
            
            // Toggle active class
            images[currentIndex].classList.remove('active');
            images[nextIndex].classList.add('active');
        });
    });
}

// Smooth scroll for anchor links
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize progression slider
    initProgressionSlider();
    
    // Initialize feature toggles
    initFeatureToggles();
    
    // Parallax effect for case study hero
    const parallaxSection = document.querySelector('.case-hero-parallax');
    const parallaxImage = document.querySelector('.parallax-image');
    
    if (parallaxSection && parallaxImage) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.1;
            parallaxImage.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        });
    }

    // Header background change on scroll for case study pages
    const header = document.querySelector('.header-transparent');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
    
    // Handle smooth scrolling for all anchor links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Add fade-in animation on scroll for case study sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe case study sections if they exist
    const caseSections = document.querySelectorAll('.case-section');
    if (caseSections.length > 0) {
        caseSections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(section);
        });
    }

    // Add active state to portfolio cards on focus
    const portfolioCards = document.querySelectorAll('.portfolio-card, .more-work-card');
    portfolioCards.forEach(card => {
        card.addEventListener('focus', function() {
            this.style.outline = '2px solid #4A90E2';
            this.style.outlineOffset = '4px';
        });
        
        card.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });

    // Log page view (can be replaced with analytics)
    console.log('Page loaded:', document.title);
});
