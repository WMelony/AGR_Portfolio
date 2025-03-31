// Initialize Locomotive Scroll only on desktop
let scroll;
if (window.innerWidth > 768) {
    scroll = new LocomotiveScroll({
        el: document.querySelector('[data-scroll-container]'),
        smooth: true,
        lerp: 0.08,
        multiplier: 0.8,
        smartphone: {
            smooth: false
        }
    });

    // Handle floating shapes visibility and parallax effect
    const heroSection = document.querySelector('.hero');
    const floatingShapes = document.querySelector('.floating-shapes');
    const shapes = document.querySelectorAll('.shape');
    
    if (scroll && heroSection && floatingShapes) {
        scroll.on('scroll', (args) => {
            const heroHeight = heroSection.offsetHeight;
            const scrollProgress = args.scroll.y / heroHeight;
            
            // Fade out shapes when scrolling past hero section
            if (scrollProgress > 0.5) {
                floatingShapes.style.opacity = 1 - (scrollProgress - 0.5) * 2;
            } else {
                floatingShapes.style.opacity = 1;
            }

            // Parallax effect for shapes
            shapes.forEach((shape, index) => {
                const speed = 0.1 + (index % 3) * 0.05; // Different speeds for different shapes
                const yOffset = args.scroll.y * speed;
                shape.style.transform = `translateY(${yOffset}px)`;
            });
        });
    }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            if (scroll) {
                scroll.scrollTo(target);
            } else {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Animate skill bars when they come into view
const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillLevels = entry.target.querySelectorAll('.skill-level');
            skillLevels.forEach(level => {
                const width = level.getAttribute('data-level');
                level.style.width = `${width}%`;
            });
        }
    });
}, observerOptions);

// Observe all skill categories
document.querySelectorAll('.skill-category').forEach(category => {
    observer.observe(category);
});

// Form submission handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Here you would typically send the data to a server
        console.log('Form submitted:', data);
        
        // Show success message
        alert('Thank you for your message! I will get back to you soon.');
        this.reset();
    });
}

// Add active class to navigation links based on current page
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
    }
});

// Add scroll-based navbar background
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(44, 62, 80, 0.95)';
    } else {
        navbar.style.backgroundColor = 'var(--primary-color)';
    }
});

// Update Locomotive Scroll on window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && !scroll) {
        scroll = new LocomotiveScroll({
            el: document.querySelector('[data-scroll-container]'),
            smooth: true,
            lerp: 0.08,
            multiplier: 0.8,
            smartphone: {
                smooth: false
            }
        });
    } else if (window.innerWidth <= 768 && scroll) {
        scroll.destroy();
        scroll = null;
    }
});

// Mouse parallax effect for work cards
const workCards = document.querySelectorAll('.work-card');
const parallaxStrength = 0.1; // Adjust this value to control the parallax intensity

workCards.forEach(card => {
    const image = card.querySelector('.work-image img');
    
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Calculate the center point of the card
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Calculate the distance from center
        const moveX = (x - centerX) / centerX;
        const moveY = (y - centerY) / centerY;
        
        // Apply the parallax effect
        image.style.transform = `translate(${moveX * parallaxStrength * 100}px, ${moveY * parallaxStrength * 100}px) scale(1.05)`;
    });
    
    card.addEventListener('mouseleave', () => {
        image.style.transform = 'translate(0, 0) scale(1)';
    });
});

// Hamburger menu functionality
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    }
});

// Close menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
}); 