// Three.js scene setup
const scenes = {};
const cameras = {};
const renderers = {};
const models = {};
const mixers = {};
const decorations = {}; // Store decorative elements
const clock = new THREE.Clock();
const backgroundElements = []; // Store background elements

// Model paths - replace these with your actual model paths
const modelPaths = {
    character: './character.glb',
    environment: './environment.glb',
    texturing: './models/texturing.glb'
};

// Initialize scenes for each model container
document.querySelectorAll('.model-container').forEach(container => {
    const modelType = container.parentElement.dataset.model;
    const containerId = container.id;
    
    console.log(`Initializing container: ${containerId} with model type: ${modelType}`);
    
    // Create scene
    scenes[containerId] = new THREE.Scene();
    // Make background transparent
    scenes[containerId].background = null;
    
    // Create camera
    cameras[containerId] = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    // Adjust camera position to better frame the models
    cameras[containerId].position.z = 10; // Move camera back further
    cameras[containerId].position.y = 0; // Center camera vertically
    
    // Create renderer with transparent background
    renderers[containerId] = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true, // Enable transparency
        premultipliedAlpha: false // Ensure proper transparency
    });
    renderers[containerId].setClearColor(0x000000, 0); // Set clear color with 0 alpha
    renderers[containerId].setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderers[containerId].domElement);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scenes[containerId].add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 1, 1);
    scenes[containerId].add(directionalLight);
    
    // Create decorative elements
    createDecorations(containerId, modelType);
    
    // Create a simple 3D object as fallback
    createFallbackObject(containerId);
    
    // Try to load the model
    loadModel(containerId, modelType);
    
    // Add glowing effect to the work card
    createGlowingEffect(containerId, modelType);
    
    // Add background glow effect
    createBackgroundGlowEffect(containerId, modelType);
    
    // Force initial render with invisible models
    renderers[containerId].render(scenes[containerId], cameras[containerId]);
});

// Create floating background elements
function createBackgroundElements() {
    // Create a container for background elements
    const backgroundContainer = document.createElement('div');
    backgroundContainer.className = 'background-elements';
    backgroundContainer.style.position = 'fixed';
    backgroundContainer.style.top = '0';
    backgroundContainer.style.left = '0';
    backgroundContainer.style.width = '100%';
    backgroundContainer.style.height = '100%';
    backgroundContainer.style.zIndex = '-1';
    backgroundContainer.style.overflow = 'hidden';
    backgroundContainer.style.pointerEvents = 'none';
    document.body.appendChild(backgroundContainer);
    
    // Create various floating elements
    const elementTypes = ['circle', 'square', 'triangle', 'star', 'diamond'];
    const colors = ['#000000', '#ffffff']; // Black and white only
    
    // Create 50 floating elements
    for (let i = 0; i < 50; i++) {
        const element = document.createElement('div');
        const type = elementTypes[Math.floor(Math.random() * elementTypes.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 30 + 10; // Random size between 10px and 40px
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight;
        const duration = Math.random() * 20 + 10; // Random duration between 10s and 30s
        const delay = Math.random() * 5; // Random delay up to 5s
        
        // Set element properties
        element.className = `floating-element ${type}`;
        element.style.position = 'absolute';
        element.style.width = `${size}px`;
        element.style.height = `${size}px`;
        element.style.backgroundColor = color;
        element.style.opacity = '0.3';
        element.style.borderRadius = type === 'circle' ? '50%' : '0';
        element.style.transform = type === 'triangle' ? 'rotate(45deg)' : 
                                type === 'diamond' ? 'rotate(45deg)' : 'none';
        element.style.left = `${startX}px`;
        element.style.top = `${startY}px`;
        element.style.transition = `all ${duration}s ease-in-out ${delay}s`;
        element.style.zIndex = '-1';
        
        // Add star points if it's a star
        if (type === 'star') {
            element.style.clipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
        }
        
        // Add to container
        backgroundContainer.appendChild(element);
        
        // Store element data for animation
        backgroundElements.push({
            element,
            startX,
            startY,
            duration,
            delay,
            size,
            rotationSpeed: Math.random() * 2 + 1, // Random rotation speed
            floatSpeed: Math.random() * 0.5 + 0.2, // Random float speed
            floatAmplitude: Math.random() * 50 + 20 // Random float amplitude
        });
    }
    
    // Start animation
    animateBackgroundElements();
}

// Animate background elements
function animateBackgroundElements() {
    backgroundElements.forEach(item => {
        // Create random movement
        const moveX = (Math.random() - 0.5) * 300; // Increased movement range
        const moveY = (Math.random() - 0.5) * 300; // Increased movement range
        const rotate = Math.random() * 360;
        const scale = 0.5 + Math.random() * 0.5;
        
        // Apply animation
        setTimeout(() => {
            // Initial animation
            item.element.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${rotate}deg) scale(${scale})`;
            
            // Create continuous animation with more dynamic movement
            setInterval(() => {
                // Calculate new position with more varied movement
                const newMoveX = (Math.random() - 0.5) * 300;
                const newMoveY = (Math.random() - 0.5) * 300;
                const newRotate = Math.random() * 720 - 360; // Full rotation range
                const newScale = 0.5 + Math.random() * 0.5;
                
                // Apply the new transform
                item.element.style.transform = `translate(${newMoveX}px, ${newMoveY}px) rotate(${newRotate}deg) scale(${newScale})`;
            }, item.duration * 1000);
        }, item.delay * 1000);
    });
    
    // Add a separate animation loop for continuous movement
    function animateLoop() {
        backgroundElements.forEach(item => {
            // Get current position
            const currentTransform = item.element.style.transform;
            const currentX = parseFloat(currentTransform.match(/translateX\(([-\d.]+)px\)/) ? currentTransform.match(/translateX\(([-\d.]+)px\)/)[1] : 0);
            const currentY = parseFloat(currentTransform.match(/translateY\(([-\d.]+)px\)/) ? currentTransform.match(/translateY\(([-\d.]+)px\)/)[1] : 0);
            const currentRotate = parseFloat(currentTransform.match(/rotate\(([-\d.]+)deg\)/) ? currentTransform.match(/rotate\(([-\d.]+)deg\)/)[1] : 0);
            
            // Calculate new position with small increments for smooth movement
            const newX = currentX + (Math.random() - 0.5) * 2;
            const newY = currentY + (Math.random() - 0.5) * 2;
            const newRotate = currentRotate + item.rotationSpeed;
            
            // Apply the new transform
            item.element.style.transform = `translate(${newX}px, ${newY}px) rotate(${newRotate}deg)`;
        });
        
        requestAnimationFrame(animateLoop);
    }
    
    // Start the animation loop
    animateLoop();
}

// Initialize background elements
createBackgroundElements();

// Function to create glowing effect for the work card
function createGlowingEffect(containerId, modelType) {
    // Get the work card
    const workCard = document.getElementById(containerId).parentElement;
    
    // Create a container for the glow effect
    const glowContainer = document.createElement('div');
    glowContainer.className = 'glow-effect';
    glowContainer.style.position = 'absolute';
    glowContainer.style.top = '0';
    glowContainer.style.left = '0';
    glowContainer.style.width = '100%';
    glowContainer.style.height = '100%';
    glowContainer.style.pointerEvents = 'none';
    glowContainer.style.overflow = 'hidden';
    glowContainer.style.opacity = '0';
    glowContainer.style.transition = 'opacity 0.5s ease';
    glowContainer.style.zIndex = '1';
    
    // Get the color based on model type
    const glowColor = getColorForModelType(modelType);
    const glowColorHex = `#${glowColor.toString(16).padStart(6, '0')}`;
    
    // Create the glow effect using box-shadow
    glowContainer.style.boxShadow = `0 0 20px 5px ${glowColorHex}`;
    
    // Add the glow container to the work card
    workCard.appendChild(glowContainer);
    
    // Store the glow container for later use
    decorations[containerId].glowEffect = glowContainer;
    
    // Add hover event listeners
    workCard.addEventListener('mouseenter', () => {
        if (decorations[containerId].glowEffect) {
            // Show the glow effect with animation
            decorations[containerId].glowEffect.style.opacity = '1';
            
            // Add a pulsing animation
            decorations[containerId].glowEffect.style.animation = 'pulse-glow 2s infinite';
        }
    });
    
    workCard.addEventListener('mouseleave', () => {
        if (decorations[containerId].glowEffect) {
            // Hide the glow effect
            decorations[containerId].glowEffect.style.opacity = '0';
            decorations[containerId].glowEffect.style.animation = 'none';
        }
    });
    
    // Add the pulse animation to the document if it doesn't exist
    if (!document.getElementById('glow-animations')) {
        const style = document.createElement('style');
        style.id = 'glow-animations';
        style.textContent = `
            @keyframes pulse-glow {
                0% { box-shadow: 0 0 20px 5px ${glowColorHex}; }
                50% { box-shadow: 0 0 30px 10px ${glowColorHex}; }
                100% { box-shadow: 0 0 20px 5px ${glowColorHex}; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Function to create background glow effect
function createBackgroundGlowEffect(containerId, modelType) {
    // Get the work card
    const workCard = document.getElementById(containerId).parentElement;
    
    // Create a container for the background glow
    const bgGlowContainer = document.createElement('div');
    bgGlowContainer.className = 'background-glow-effect';
    bgGlowContainer.style.position = 'fixed';
    bgGlowContainer.style.top = '0';
    bgGlowContainer.style.left = '0';
    bgGlowContainer.style.width = '100%';
    bgGlowContainer.style.height = '100%';
    bgGlowContainer.style.pointerEvents = 'none';
    bgGlowContainer.style.opacity = '0';
    bgGlowContainer.style.transition = 'opacity 1s ease';
    bgGlowContainer.style.zIndex = '-2'; // Behind the floating elements
    
    // Get the color based on model type
    const glowColor = getColorForModelType(modelType);
    const glowColorHex = `#${glowColor.toString(16).padStart(6, '0')}`;
    
    // Create the background glow effect using radial gradient
    bgGlowContainer.style.background = `radial-gradient(circle at center, ${glowColorHex}33 0%, transparent 70%)`;
    
    // Add the background glow container to the body
    document.body.appendChild(bgGlowContainer);
    
    // Store the background glow container for later use
    decorations[containerId].backgroundGlowEffect = bgGlowContainer;
    
    // Add hover event listeners
    workCard.addEventListener('mouseenter', () => {
        if (decorations[containerId].backgroundGlowEffect) {
            // Position the glow at the center of the work card
            const rect = workCard.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            // Update the background position
            decorations[containerId].backgroundGlowEffect.style.background = 
                `radial-gradient(circle at ${centerX}px ${centerY}px, ${glowColorHex}33 0%, transparent 70%)`;
            
            // Show the background glow effect with animation
            decorations[containerId].backgroundGlowEffect.style.opacity = '1';
        }
    });
    
    workCard.addEventListener('mouseleave', () => {
        if (decorations[containerId].backgroundGlowEffect) {
            // Hide the background glow effect
            decorations[containerId].backgroundGlowEffect.style.opacity = '0';
        }
    });
}

// Function to create slithering border for text container
function createSlitheringBorder(containerId, modelType) {
    // Get the text container
    const workCard = document.getElementById(containerId).parentElement;
    const textContainer = workCard.querySelector('.work-text');
    
    if (!textContainer) return;
    
    // Create a container for the border
    const borderContainer = document.createElement('div');
    borderContainer.className = 'slithering-border';
    borderContainer.style.position = 'absolute';
    borderContainer.style.top = '0';
    borderContainer.style.left = '0';
    borderContainer.style.width = '100%';
    borderContainer.style.height = '100%';
    borderContainer.style.pointerEvents = 'none';
    borderContainer.style.overflow = 'hidden';
    borderContainer.style.opacity = '0';
    borderContainer.style.transition = 'opacity 0.3s ease';
    
    // Create the border segments
    const segmentCount = 20;
    const borderColor = getColorForModelType(modelType);
    
    // Create top border
    for (let i = 0; i < segmentCount; i++) {
        const segment = document.createElement('div');
        segment.className = 'border-segment';
        segment.style.position = 'absolute';
        segment.style.height = '2px';
        segment.style.width = `${100 / segmentCount}%`;
        segment.style.backgroundColor = `#${borderColor.toString(16).padStart(6, '0')}`;
        segment.style.left = `${(i * 100) / segmentCount}%`;
        segment.style.top = '0';
        segment.style.transform = 'scaleX(0)';
        segment.style.transformOrigin = 'left';
        segment.style.transition = 'transform 0.3s ease';
        borderContainer.appendChild(segment);
    }
    
    // Create right border
    for (let i = 0; i < segmentCount; i++) {
        const segment = document.createElement('div');
        segment.className = 'border-segment';
        segment.style.position = 'absolute';
        segment.style.width = '2px';
        segment.style.height = `${100 / segmentCount}%`;
        segment.style.backgroundColor = `#${borderColor.toString(16).padStart(6, '0')}`;
        segment.style.top = `${(i * 100) / segmentCount}%`;
        segment.style.right = '0';
        segment.style.transform = 'scaleY(0)';
        segment.style.transformOrigin = 'top';
        segment.style.transition = 'transform 0.3s ease';
        borderContainer.appendChild(segment);
    }
    
    // Create bottom border
    for (let i = 0; i < segmentCount; i++) {
        const segment = document.createElement('div');
        segment.className = 'border-segment';
        segment.style.position = 'absolute';
        segment.style.height = '2px';
        segment.style.width = `${100 / segmentCount}%`;
        segment.style.backgroundColor = `#${borderColor.toString(16).padStart(6, '0')}`;
        segment.style.left = `${(i * 100) / segmentCount}%`;
        segment.style.bottom = '0';
        segment.style.transform = 'scaleX(0)';
        segment.style.transformOrigin = 'right';
        segment.style.transition = 'transform 0.3s ease';
        borderContainer.appendChild(segment);
    }
    
    // Create left border
    for (let i = 0; i < segmentCount; i++) {
        const segment = document.createElement('div');
        segment.className = 'border-segment';
        segment.style.position = 'absolute';
        segment.style.width = '2px';
        segment.style.height = `${100 / segmentCount}%`;
        segment.style.backgroundColor = `#${borderColor.toString(16).padStart(6, '0')}`;
        segment.style.top = `${(i * 100) / segmentCount}%`;
        segment.style.left = '0';
        segment.style.transform = 'scaleY(0)';
        segment.style.transformOrigin = 'bottom';
        segment.style.transition = 'transform 0.3s ease';
        borderContainer.appendChild(segment);
    }
    
    // Add the border container to the text container
    textContainer.appendChild(borderContainer);
    
    // Store the border container for later use
    decorations[containerId].textBorder = borderContainer;
    
    // Add hover event listeners
    workCard.addEventListener('mouseenter', () => {
        if (decorations[containerId].textBorder) {
            // Show the border container
            decorations[containerId].textBorder.style.opacity = '1';
            
            // Animate each segment with a delay
            const segments = decorations[containerId].textBorder.querySelectorAll('.border-segment');
            segments.forEach((segment, index) => {
                setTimeout(() => {
                    segment.style.transform = 'scale(1)';
                }, index * 30); // 30ms delay between each segment
            });
        }
    });
    
    workCard.addEventListener('mouseleave', () => {
        if (decorations[containerId].textBorder) {
            // Hide the border container
            decorations[containerId].textBorder.style.opacity = '0';
            
            // Reset all segments
            const segments = decorations[containerId].textBorder.querySelectorAll('.border-segment');
            segments.forEach(segment => {
                segment.style.transform = segment.style.transform.includes('scaleX') ? 'scaleX(0)' : 'scaleY(0)';
            });
        }
    });
}

// Function to create decorative elements
function createDecorations(containerId, modelType) {
    decorations[containerId] = {
        particles: [],
        rings: [],
        lines: [],
        textBorder: null,
        glowEffect: null
    };
    
    // Create particles
    const particleCount = 30;
    const particleGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const particleMaterial = new THREE.MeshBasicMaterial({ 
        color: getColorForModelType(modelType),
        transparent: true,
        opacity: 0.7
    });
    
    for (let i = 0; i < particleCount; i++) {
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        
        // Position particles in a circle around the container
        const angle = (i / particleCount) * Math.PI * 2;
        const radius = 3 + Math.random() * 2; // Random distance from center
        particle.position.x = Math.cos(angle) * radius;
        particle.position.y = Math.sin(angle) * radius;
        particle.position.z = -1;
        
        // Add some random movement
        particle.userData = {
            speed: 0.01 + Math.random() * 0.02,
            angle: angle,
            radius: radius,
            direction: Math.random() > 0.5 ? 1 : -1
        };
        
        scenes[containerId].add(particle);
        decorations[containerId].particles.push(particle);
    }
    
    // Create rings
    const ringCount = 3;
    for (let i = 0; i < ringCount; i++) {
        const ringGeometry = new THREE.RingGeometry(2 + i * 0.5, 2.2 + i * 0.5, 32);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: getColorForModelType(modelType),
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });
        
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2; // Make rings horizontal
        ring.position.z = -1;
        
        scenes[containerId].add(ring);
        decorations[containerId].rings.push(ring);
    }
    
    // Create lines
    const lineCount = 8;
    for (let i = 0; i < lineCount; i++) {
        const lineGeometry = new THREE.BufferGeometry();
        const lineMaterial = new THREE.LineBasicMaterial({
            color: getColorForModelType(modelType),
            transparent: true,
            opacity: 0.5
        });
        
        const points = [];
        const angle = (i / lineCount) * Math.PI * 2;
        const startRadius = 2;
        const endRadius = 4;
        
        points.push(new THREE.Vector3(
            Math.cos(angle) * startRadius,
            Math.sin(angle) * startRadius,
            -1
        ));
        
        points.push(new THREE.Vector3(
            Math.cos(angle) * endRadius,
            Math.sin(angle) * endRadius,
            -1
        ));
        
        lineGeometry.setFromPoints(points);
        
        const line = new THREE.Line(lineGeometry, lineMaterial);
        scenes[containerId].add(line);
        decorations[containerId].lines.push(line);
    }
    
    // Create slithering border for text container
    createSlitheringBorder(containerId, modelType);
    
    // Initially hide all decorations
    hideDecorations(containerId);
}

// Function to get color based on model type
function getColorForModelType(modelType) {
    if (modelType === 'character') {
        return 0x3498db; // Blue
    } else if (modelType === 'environment') {
        return 0x2ecc71; // Green
    } else {
        return 0xe74c3c; // Red
    }
}

// Function to show decorations
function showDecorations(containerId) {
    if (decorations[containerId]) {
        // Show particles with animation
        decorations[containerId].particles.forEach((particle, index) => {
            particle.visible = true;
            particle.material.opacity = 0;
            
            gsap.to(particle.material, {
                opacity: 0.7,
                duration: 0.3,
                delay: index * 0.01
            });
        });
        
        // Show rings with animation
        decorations[containerId].rings.forEach((ring, index) => {
            ring.visible = true;
            ring.scale.set(0.1, 0.1, 0.1);
            ring.material.opacity = 0;
            
            gsap.to(ring.scale, {
                x: 1,
                y: 1,
                z: 1,
                duration: 0.5,
                delay: index * 0.1
            });
            
            gsap.to(ring.material, {
                opacity: 0.3,
                duration: 0.3,
                delay: index * 0.1
            });
        });
        
        // Show lines with animation
        decorations[containerId].lines.forEach((line, index) => {
            line.visible = true;
            line.material.opacity = 0;
            
            gsap.to(line.material, {
                opacity: 0.5,
                duration: 0.3,
                delay: index * 0.05
            });
        });
        
        // Show glow effect
        if (decorations[containerId].glowEffect) {
            decorations[containerId].glowEffect.style.opacity = '1';
            decorations[containerId].glowEffect.style.animation = 'pulse-glow 2s infinite';
        }
    }
}

// Function to hide decorations
function hideDecorations(containerId) {
    if (decorations[containerId]) {
        // Hide particles with animation
        decorations[containerId].particles.forEach(particle => {
            gsap.to(particle.material, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    particle.visible = false;
                }
            });
        });
        
        // Hide rings with animation
        decorations[containerId].rings.forEach(ring => {
            gsap.to(ring.scale, {
                x: 0.1,
                y: 0.1,
                z: 0.1,
                duration: 0.3
            });
            
            gsap.to(ring.material, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    ring.visible = false;
                }
            });
        });
        
        // Hide lines with animation
        decorations[containerId].lines.forEach(line => {
            gsap.to(line.material, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    line.visible = false;
                }
            });
        });
        
        // Hide glow effect
        if (decorations[containerId].glowEffect) {
            decorations[containerId].glowEffect.style.opacity = '0';
            decorations[containerId].glowEffect.style.animation = 'none';
        }
    }
}

// Function to create a fallback 3D object
function createFallbackObject(containerId) {
    // Create a simple geometry based on the container type
    let geometry;
    let material;
    
    if (containerId.includes('character')) {
        // Character-like object - larger cylinder
        geometry = new THREE.CylinderGeometry(0.9, 0.9, 3, 8);
        material = new THREE.MeshStandardMaterial({ color: 0x3498db });
    } else if (containerId.includes('environment')) {
        // Environment-like object - larger box
        geometry = new THREE.BoxGeometry(4, 4, 4);
        material = new THREE.MeshStandardMaterial({ color: 0x2ecc71 });
    } else {
        // Texturing-like object - keep the same size
        geometry = new THREE.SphereGeometry(1.5, 16, 16);
        material = new THREE.MeshStandardMaterial({ color: 0xe74c3c });
    }
    
    const fallbackObject = new THREE.Mesh(geometry, material);
    scenes[containerId].add(fallbackObject);
    models[containerId] = fallbackObject;
    
    // Position the fallback object based on model type
    if (containerId.includes('character') || containerId.includes('environment')) {
        // Keep character and environment models lower
        models[containerId].position.y = -1.5;
    } else {
        // Center the texturing model vertically
        models[containerId].position.y = 0;
    }
    
    // Make it invisible by default
    models[containerId].visible = false;
}

// Function to load a model
function loadModel(containerId, modelType) {
    const loader = new THREE.GLTFLoader();
    console.log(`Loading model: ${modelPaths[modelType]}`);
    
    try {
        loader.load(
            modelPaths[modelType],
            (gltf) => {
                console.log(`Model loaded successfully: ${modelType}`);
                
                // Remove the fallback object
                if (models[containerId]) {
                    scenes[containerId].remove(models[containerId]);
                }
                
                // Add the loaded model
                models[containerId] = gltf.scene;
                scenes[containerId].add(models[containerId]);
                
                // Center model
                const box = new THREE.Box3().setFromObject(models[containerId]);
                const center = box.getCenter(new THREE.Vector3());
                models[containerId].position.sub(center);
                
                // Adjust vertical position based on model type
                if (containerId.includes('character')) {
                    // Keep character model lower
                    models[containerId].position.y = -1.5;
                } else if (containerId.includes('environment')) {
                    // Keep environment model lower
                    models[containerId].position.y = -1.5;
                } else {
                    // Center the texturing model vertically
                    models[containerId].position.y = 0;
                }
                
                // Scale model if needed - adjust scale based on model type
                const size = box.getSize(new THREE.Vector3());
                const maxDim = Math.max(size.x, size.y, size.z);
                
                // Different scaling factors based on model type
                let scale;
                if (containerId.includes('character')) {
                    scale = 5 / maxDim; // Keep character the same
                } else if (containerId.includes('environment')) {
                    scale = 7 / maxDim; // Increased from 4 to 7 for environment (+3)
                } else {
                    scale = 3 / maxDim; // Keep texturing the same
                }
                
                models[containerId].scale.set(scale, scale, scale);
                
                // Setup animations if they exist
                if (gltf.animations && gltf.animations.length) {
                    mixers[containerId] = new THREE.AnimationMixer(models[containerId]);
                    const action = mixers[containerId].clipAction(gltf.animations[0]);
                    action.play();
                }
                
                // Make model invisible by default
                models[containerId].visible = false;
                
                // Force a render
                renderers[containerId].render(scenes[containerId], cameras[containerId]);
            },
            (xhr) => {
                console.log(`Loading progress: ${(xhr.loaded / xhr.total * 100)}%`);
            },
            (error) => {
                console.error('Error loading model:', error);
                // Keep using the fallback object
            }
        );
    } catch (error) {
        console.error('Error in loader setup:', error);
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    Object.keys(scenes).forEach(containerId => {
        if (models[containerId]) {
            // Rotate model
            models[containerId].rotation.y += 0.01;
            
            // Update animation mixer if it exists
            if (mixers[containerId]) {
                mixers[containerId].update(clock.getDelta());
            }
            
            // Animate decorations
            if (decorations[containerId]) {
                // Animate particles
                decorations[containerId].particles.forEach(particle => {
                    if (particle.visible) {
                        // Rotate particles around the center
                        particle.userData.angle += particle.userData.speed * particle.userData.direction;
                        particle.position.x = Math.cos(particle.userData.angle) * particle.userData.radius;
                        particle.position.y = Math.sin(particle.userData.angle) * particle.userData.radius;
                        
                        // Add some vertical movement
                        particle.position.y += Math.sin(clock.getElapsedTime() * 2 + particle.userData.angle) * 0.01;
                    }
                });
                
                // Animate rings
                decorations[containerId].rings.forEach(ring => {
                    if (ring.visible) {
                        ring.rotation.z += 0.005;
                    }
                });
            }
            
            renderers[containerId].render(scenes[containerId], cameras[containerId]);
        }
    });
}

// Handle hover events
document.querySelectorAll('.work-card').forEach(card => {
    const modelContainer = card.querySelector('.model-container');
    const containerId = modelContainer.id;
    
    // Track animation state
    let isAnimatingOut = false;
    let animationTimeout = null;
    let hoverBufferTimeout = null;
    let isHovering = false;
    
    card.addEventListener('mouseenter', () => {
        // Set hovering state
        isHovering = true;
        
        // Clear any existing buffer timeout
        if (hoverBufferTimeout) {
            clearTimeout(hoverBufferTimeout);
        }
        
        // Add a small buffer before showing the model
        hoverBufferTimeout = setTimeout(() => {
            if (isHovering && models[containerId]) {
                // Cancel any ongoing hide animation
                if (isAnimatingOut && animationTimeout) {
                    clearTimeout(animationTimeout);
                    isAnimatingOut = false;
                }
                
                // Show and animate model - start from bottom
                models[containerId].visible = true;
                
                // Set starting position based on model type
                if (containerId.includes('character') || containerId.includes('environment')) {
                    models[containerId].position.y = -4.5; // Start from further below for character and environment
                } else {
                    models[containerId].position.y = -3; // Start from below for texturing
                }
                
                // Animate to final position based on model type
                const targetY = containerId.includes('character') || containerId.includes('environment') ? -1.5 : 0;
                
                gsap.to(models[containerId].position, {
                    y: targetY, // Animate to appropriate position
                    duration: 0.5,
                    ease: "power2.out"
                });
                
                // Show decorations
                showDecorations(containerId);
            }
        }, 50); // 50ms buffer
    });
    
    card.addEventListener('mouseleave', () => {
        // Set hovering state
        isHovering = false;
        
        // Clear any existing buffer timeout
        if (hoverBufferTimeout) {
            clearTimeout(hoverBufferTimeout);
        }
        
        // Add a small buffer before hiding the model
        hoverBufferTimeout = setTimeout(() => {
            if (!isHovering && models[containerId]) {
                // Set animation state
                isAnimatingOut = true;
                
                // Hide model - move to bottom
                gsap.to(models[containerId].position, {
                    y: -15, // Keep the same distance
                    duration: 0.5, // Reduced from 0.7 to 0.5 seconds for an even shorter animation
                    ease: "power2.in",
                    onComplete: () => {
                        // Only hide the model after the animation is complete
                        animationTimeout = setTimeout(() => {
                            if (isAnimatingOut) { // Only hide if still animating out
                                models[containerId].visible = false;
                                isAnimatingOut = false;
                            }
                        }, 300); // Keep the delay to ensure animation is fully complete
                    }
                });
                
                // Hide decorations
                hideDecorations(containerId);
            }
        }, 100); // 100ms buffer for hiding (slightly longer than showing)
    });
});

// Handle window resize
window.addEventListener('resize', () => {
    Object.keys(scenes).forEach(containerId => {
        const container = document.getElementById(containerId);
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        cameras[containerId].aspect = width / height;
        cameras[containerId].updateProjectionMatrix();
        renderers[containerId].setSize(width, height);
    });
});

// Start animation loop
animate();