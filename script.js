// Initialize Locomotive Scroll only on desktop
let scroll;
function initScroll() {
    if (window.innerWidth > 768) {
        if (!scroll) {
            console.log('Initializing Locomotive Scroll for desktop');
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
                        if (shape && shape.style) {
                            const speed = 0.1 + (index % 3) * 0.05; // Different speeds for different shapes
                            const yOffset = args.scroll.y * speed;
                            shape.style.transform = `translateY(${yOffset}px)`;
                        }
                    });
                });
            }
        }
    } else {
        // Destroy scroll instance on mobile
        if (scroll) {
            console.log('Destroying Locomotive Scroll for mobile');
            scroll.destroy();
            scroll = null;
            
            // Reset any styles that might have been affected
            document.body.style.height = 'auto';
            document.body.style.overflow = 'auto';
        }
    }
}

// Initialize scroll on load
initScroll();

// Reinitialize scroll on window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        initScroll();
    }, 250);
});

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

// Initialize all animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing animations');
    
    // Initialize page transitions
    initPageTransitions();
    
    // Initialize 3D scene if on home page
    if (document.querySelector('.model-container')) {
        console.log('Initializing 3D scene');
        init();
        animate();
    }

    // Initialize floating shapes
    if (document.querySelector('.floating-shapes')) {
        console.log('Initializing floating shapes');
        initFloatingShapes();
    }

    // Initialize typing animation
    if (document.querySelector('.typing-animation')) {
        console.log('Initializing typing animation');
        initTypingAnimation();
    }

    // Initialize ability checklist
    if (document.querySelector('.ability-item') || document.querySelector('.ability-list') || document.querySelector('.abilities-checklist')) {
        console.log('Initializing ability checklist');
        initAbilityChecklist();
    }

    // Initialize timeline animations
    if (document.querySelector('.timeline-item')) {
        console.log('Initializing timeline animations');
        initTimelineAnimations();
    }

    // Initialize work card animations
    if (document.querySelector('.work-card')) {
        console.log('Initializing work card animations');
        initWorkCardAnimations();
    }

    // Initialize mouse follower
    console.log('Initializing mouse follower');
    initMouseFollower();

    // Initialize hamburger menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        console.log('Initializing hamburger menu');
        
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event from bubbling to document
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
    }
});

// Initialize Three.js scene
let scene, camera, renderer, model;
let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

// Initialize the scene
function init() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);

    // Get the model container
    const modelContainer = document.querySelector('.model-container');
    
    // Create camera
    camera = new THREE.PerspectiveCamera(75, modelContainer.clientWidth / modelContainer.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(modelContainer.clientWidth, modelContainer.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    modelContainer.appendChild(renderer.domElement);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Load 3D model
    const loader = new THREE.GLTFLoader();
    loader.load('character.glb', function(gltf) {
        model = gltf.scene;
        model.scale.set(1, 1, 1);
        scene.add(model);
    });

    // Add event listeners
    document.addEventListener('mousemove', onDocumentMouseMove);
    window.addEventListener('resize', onWindowResize);
}

// Handle mouse movement
function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.05;
    mouseY = (event.clientY - windowHalfY) * 0.05;
}

// Handle window resize
function onWindowResize() {
    const modelContainer = document.querySelector('.model-container');
    camera.aspect = modelContainer.clientWidth / modelContainer.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(modelContainer.clientWidth, modelContainer.clientHeight);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Smooth camera movement
    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;

    if (model) {
        model.rotation.y += 0.005;
        model.rotation.x += (targetY - model.rotation.x) * 0.05;
        model.rotation.y += (targetX - model.rotation.y) * 0.05;
    }

    renderer.render(scene, camera);
}

// Initialize floating shapes
function initFloatingShapes() {
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach(shape => {
        shape.style.animation = `float ${Math.random() * 10 + 5}s infinite ease-in-out`;
    });
}

// Initialize typing animation
function initTypingAnimation() {
    const nameElement = document.querySelector('.typing-animation');
    if (nameElement) {
        const text = nameElement.textContent;
        nameElement.textContent = '';
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                nameElement.textContent += text.charAt(i);
                nameElement.style.textShadow = `0 0 ${10 + Math.random() * 10}px rgba(52, 152, 219, ${0.3 + Math.random() * 0.2})`;
                i++;
                setTimeout(typeWriter, 100 + Math.random() * 50);
            }
        };
        typeWriter();
    }
}

// Initialize ability checklist
function initAbilityChecklist() {
    console.log('Initializing ability checklist');
    const abilities = document.querySelectorAll('.ability-item, .ability-list li, .abilities-checklist .ability-item');
    console.log('Found ability items:', abilities.length);
    
    // Force visibility on mobile
    if (window.innerWidth <= 768) {
        abilities.forEach(ability => {
            ability.style.opacity = '1';
            ability.style.transform = 'translateX(0)';
            ability.style.transition = 'none';
        });
        return;
    }
    
    abilities.forEach((ability, index) => {
        ability.style.opacity = '0';
        ability.style.transform = 'translateX(-50px)';
        setTimeout(() => {
            ability.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            ability.style.opacity = '1';
            ability.style.transform = 'translateX(0)';
            
            // Add hover effect
            ability.addEventListener('mouseenter', () => {
                ability.style.transform = 'translateX(10px)';
                ability.style.background = 'linear-gradient(135deg, rgba(52, 152, 219, 0.2), rgba(41, 128, 185, 0.2))';
                ability.style.borderColor = 'rgba(52, 152, 219, 0.4)';
                ability.style.boxShadow = '0 5px 15px rgba(52, 152, 219, 0.2)';
                
                const icon = ability.querySelector('i');
                if (icon) {
                    icon.style.transform = 'scale(1.2) rotate(360deg)';
                    icon.style.textShadow = '0 0 20px rgba(52, 152, 219, 0.5)';
                }
                
                const text = ability.querySelector('span');
                if (text) {
                    text.style.color = 'var(--accent-color)';
                    text.style.textShadow = '0 0 10px rgba(52, 152, 219, 0.3)';
                }
            });
            
            ability.addEventListener('mouseleave', () => {
                ability.style.transform = 'translateX(0)';
                ability.style.background = 'linear-gradient(135deg, rgba(52, 152, 219, 0.1), rgba(41, 128, 185, 0.1))';
                ability.style.borderColor = 'rgba(52, 152, 219, 0.2)';
                ability.style.boxShadow = 'none';
                
                const icon = ability.querySelector('i');
                if (icon) {
                    icon.style.transform = 'scale(1) rotate(0)';
                    icon.style.textShadow = '0 0 10px rgba(52, 152, 219, 0.3)';
                }
                
                const text = ability.querySelector('span');
                if (text) {
                    text.style.color = 'var(--text-color)';
                    text.style.textShadow = 'none';
                }
            });
        }, 500 + (index * 200));
    });
}

// Initialize timeline animations
function initTimelineAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.timeline-item').forEach(item => {
        observer.observe(item);
    });
}

// Initialize work card animations
function initWorkCardAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.work-card').forEach(card => {
        observer.observe(card);
    });
}

// Initialize mouse follower
function initMouseFollower() {
    const follower = document.querySelector('.mouse-follower');
    const dot = document.querySelector('.mouse-follower-dot');
    
    if (!follower || !dot) {
        console.log('Mouse follower elements not found');
        return;
    }
    
    console.log('Initializing mouse follower');
    
    let mouseX = 0;
    let mouseY = 0;
    let followerX = 0;
    let followerY = 0;
    let dotX = 0;
    let dotY = 0;
    
    // Set initial position
    follower.style.left = '0px';
    follower.style.top = '0px';
    dot.style.left = '0px';
    dot.style.top = '0px';
    
    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Animation loop
    function animate() {
        // Smooth follower movement
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        follower.style.left = `${followerX}px`;
        follower.style.top = `${followerY}px`;
        
        // Faster dot movement
        dotX += (mouseX - dotX) * 0.3;
        dotY += (mouseY - dotY) * 0.3;
        dot.style.left = `${dotX}px`;
        dot.style.top = `${dotY}px`;
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Add hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .btn, .work-card, .timeline-content, .ability-item, .skill-item, .skill-category, .about-card, .contact-form input, .contact-form textarea, .social-links a');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            follower.style.width = '60px';
            follower.style.height = '60px';
            follower.style.background = 'rgba(52, 152, 219, 0.2)';
            follower.style.border = '2px solid rgba(52, 152, 219, 0.5)';
            follower.style.boxShadow = '0 0 20px rgba(52, 152, 219, 0.3)';
            
            dot.style.transform = 'translate(-50%, -50%) scale(1.5)';
            dot.style.background = 'var(--accent-color)';
            dot.style.boxShadow = '0 0 10px var(--accent-color)';
        });
        
        element.addEventListener('mouseleave', () => {
            follower.style.width = '40px';
            follower.style.height = '40px';
            follower.style.background = 'rgba(52, 152, 219, 0.1)';
            follower.style.border = '2px solid rgba(52, 152, 219, 0.3)';
            follower.style.boxShadow = 'none';
            
            dot.style.transform = 'translate(-50%, -50%)';
            dot.style.background = 'var(--accent-color)';
            dot.style.boxShadow = 'none';
        });
    });
}

// Page transition handling
function initPageTransitions() {
    const transition = document.querySelector('.page-transition');
    const links = document.querySelectorAll('a[href]:not([href^="#"]):not([href^="javascript:"])');
    
    // Add loaded class to body after page load
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });
    
    // Handle link clicks for page transitions
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only handle internal links
            if (this.hostname === window.location.hostname) {
                e.preventDefault();
                
                // Activate transition
                transition.classList.add('active');
                
                // Navigate to the new page after transition
                setTimeout(() => {
                    window.location.href = this.href;
                }, 700);
            }
        });
    });
} 