// Enhanced Canvas Background - Connecting Dots Network
const canvas = document.getElementById('canvas-bg');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const particleCount = 100;
const maxDistance = 150;
let mouse = { x: null, y: null };

canvas.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.radius = Math.random() * 2.5 + 1;
        this.color = Math.random() > 0.5 ? '#00f3ff' : '#bd00ff';
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Mouse interaction
        if (mouse.x && mouse.y) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                this.x -= (dx / distance) * force * 2;
                this.y -= (dy / distance) * force * 2;
            }
        }

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < maxDistance) {
                ctx.beginPath();
                const opacity = 1 - distance / maxDistance;
                ctx.strokeStyle = `rgba(0, 243, 255, ${opacity * 0.5})`;
                ctx.lineWidth = 1;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    connectParticles();
    requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Typing animation
const phrases = [
    'Crafting immersive digital experiences...',
    'Building the future of the web...',
    'Turning ideas into reality...',
    'Creating pixel-perfect designs...'
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingElement = document.getElementById('typing-text');

function typeText() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        typingElement.innerHTML = currentPhrase.substring(0, charIndex - 1) + '<span class="typing-cursor"></span>';
        charIndex--;
    } else {
        typingElement.innerHTML = currentPhrase.substring(0, charIndex + 1) + '<span class="typing-cursor"></span>';
        charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentPhrase.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500;
    }

    setTimeout(typeText, typeSpeed);
}

typeText();

// Counter animation
const counters = document.querySelectorAll('.stat-number');
const speed = 200;

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = +entry.target.getAttribute('data-target');
            const increment = target / speed;
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    entry.target.textContent = Math.ceil(current);
                    setTimeout(updateCounter, 10);
                } else {
                    entry.target.textContent = target + '+';
                }
            };

            updateCounter();
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

counters.forEach(counter => counterObserver.observe(counter));

// Skill bar animation
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillFills = entry.target.querySelectorAll('.skill-fill');
            skillFills.forEach((fill, index) => {
                setTimeout(() => {
                    const width = fill.getAttribute('data-width');
                    fill.style.width = width + '%';
                }, index * 150);
            });
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

const aboutSection = document.querySelector('#about');
if (aboutSection) skillObserver.observe(aboutSection);

// Project filter animation
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        projectCards.forEach((card, index) => {
            card.style.animation = 'none';
            
            setTimeout(() => {
                if (filter === 'all' || card.getAttribute('data-category').includes(filter)) {
                    card.style.display = 'block';
                    card.style.animation = `fadeInUp 0.6s ${index * 0.1}s both`;
                } else {
                    card.style.display = 'none';
                }
            }, 50);
        });
    });
});

// Smooth scrolling with active state
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // Remove active class from all nav links
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
            });
            
            // Add active class to clicked link
            if (this.classList.contains('nav-links') || this.parentElement.parentElement.classList.contains('nav-links')) {
                this.classList.add('active');
            }
            
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Scroll reveal animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

document.querySelectorAll('.section-title, .section-subtitle').forEach(el => {
    el.classList.add('animate-on-scroll');
    scrollObserver.observe(el);
});

// Form submission animation
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('.cyber-btn');
        const originalText = btn.textContent;
        
        btn.textContent = 'Sending...';
        btn.style.pointerEvents = 'none';
        
        setTimeout(() => {
            btn.textContent = 'Message Sent! ✓';
            btn.style.background = 'var(--neon-green)';
            btn.style.borderColor = 'var(--neon-green)';
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = 'transparent';
                btn.style.borderColor = 'var(--neon-cyan)';
                btn.style.pointerEvents = 'auto';
                contactForm.reset();
            }, 3000);
        }, 2000);
    });
}

// Active nav link on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 150;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
            });
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });

    // Remove active class when at the very top
    if (scrollY < 100) {
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
        });
    }
});

// Random particle spawn on click
canvas.addEventListener('click', (e) => {
    for (let i = 0; i < 10; i++) {
        const particle = new Particle();
        particle.x = e.clientX;
        particle.y = e.clientY;
        particle.vx = (Math.random() - 0.5) * 5;
        particle.vy = (Math.random() - 0.5) * 5;
        particles.push(particle);
        
        setTimeout(() => {
            particles.splice(particles.indexOf(particle), 1);
        }, 2000);
    }
});

// Scroll indicator click
document.querySelector('.scroll-indicator')?.addEventListener('click', () => {
    document.querySelector('#about').scrollIntoView({ behavior: 'smooth' });
});

// 3D tilt effect on cards
document.querySelectorAll('.project-card, .service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
});

console.log('%c🚀 CYBER_DEV Portfolio Loaded', 'color: #00f3ff; font-size: 20px; font-weight: bold;');
console.log('%cBuilt with passion and cyberpunk vibes 💜', 'color: #bd00ff; font-size: 14px;');