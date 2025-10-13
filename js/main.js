// ===== MAIN JAVASCRIPT FILE =====

// Global variables
let currentTestimonial = 0;
let isLoading = false;

// ===== DOCUMENT READY =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// ===== INITIALIZE APPLICATION =====
function initializeApp() {
    // Hide loading screen
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }, 1500);

    // Initialize all components
    initializeNavigation();
    initializeScrollEffects();
    initializeTypingEffect();
    initializeCounters();
    initializeSkillBars();
    initializeProjectFilters();
    initializeTestimonials();
    initializeContactForm();
    initializeAOS();
    initializeBackToTop();
    initializeParallax();
    
    // Add smooth scrolling for anchor links
    initializeSmoothScrolling();
}

// ===== NAVIGATION =====
function initializeNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.getElementById('header');

    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // Header scroll effect
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Active navigation link
    updateActiveNavLink();
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// ===== SMOOTH SCROLLING =====
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== SCROLL EFFECTS =====
function initializeScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Trigger specific animations based on element type
                if (entry.target.classList.contains('skill-progress')) {
                    animateSkillBar(entry.target);
                }
                
                if (entry.target.classList.contains('stat-number')) {
                    animateCounter(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll('.fade-in, .skill-progress, .stat-number');
    animatedElements.forEach(el => observer.observe(el));
}

// ===== TYPING EFFECT =====
function initializeTypingEffect() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;

    const texts = [
        '.NET Angular Developer',
        'AI Engineer',
        'Full Stack Developer',
        'Software Architect',
        'Problem Solver'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeText() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentText.length) {
            typingSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingSpeed = 500; // Pause before next text
        }

        setTimeout(typeText, typingSpeed);
    }

    typeText();
}

// ===== COUNTERS =====
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    
    counters.forEach(counter => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    animateCounter(entry.target);
                    entry.target.classList.add('counted');
                }
            });
        });
        
        observer.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// ===== SKILL BARS =====
function initializeSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                const width = entry.target.getAttribute('data-width');
                setTimeout(() => {
                    entry.target.style.width = width;
                    entry.target.classList.add('animated');
                }, 200);
            }
        });
    });

    skillBars.forEach(bar => observer.observe(bar));
}

// ===== PROJECT FILTERS =====
function initializeProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter projects
            projectCards.forEach(card => {
                if (filter === 'all' || card.classList.contains(filter)) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// ===== PROJECT MODAL =====
function openProjectModal(projectId) {
    const modal = document.getElementById('projectModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    if (!modal || !modalTitle || !modalBody) return;

    // Project data
    const projectData = {
        'recruitment-portal': {
            title: 'IIT Mandi Recruitment Portal',
            description: 'A comprehensive recruitment management system built for IIT Mandi to handle faculty and staff recruitment processes.',
            features: [
                'Multi-role user management (Admin, HR, Applicants)',
                'Application tracking and status management',
                'Document upload and verification system',
                'Email notification system',
                'Reporting and analytics dashboard',
                'Interview scheduling and management'
            ],
            technologies: ['ASP.NET Webforms', 'C#', 'MS SQL Server', '3-Layer Architecture', 'JavaScript', 'Bootstrap'],
            challenges: 'Handling high traffic during recruitment seasons, ensuring data security, and maintaining system performance.',
            outcome: 'Successfully processes 1000+ applications per recruitment cycle with 99.9% uptime.',
            duration: '6 months',
            team: '3 developers',
            url: 'https://oas.iitmandi.ac.in/instituteprocess/hr/Default.aspx'
        },
        'institute-process': {
            title: 'Institute Process Solution',
            description: 'A centralized platform for managing various administrative processes across IIT Mandi.',
            features: [
                'Workflow management system',
                'Document management and approval',
                'Multi-department integration',
                'Role-based access control',
                'Audit trail and logging',
                'Custom reporting tools'
            ],
            technologies: ['ASP.NET Webforms', 'C#', 'MS SQL Server', '3-Layer Architecture', 'Crystal Reports'],
            challenges: 'Integrating multiple legacy systems, ensuring data consistency, and managing complex workflows.',
            outcome: 'Streamlined administrative processes, reducing processing time by 60%.',
            duration: '8 months',
            team: '4 developers',
            url: 'https://oas.iitmandi.ac.in/instituteprocess/common/login.aspx'
        },
        'guest-house': {
            title: 'IIT Guest House Booking System',
            description: 'An online booking system for managing guest house reservations at IIT Mandi.',
            features: [
                'Real-time room availability',
                'Online booking and payment',
                'Guest management system',
                'Booking confirmation and receipts',
                'Admin dashboard for management',
                'Mobile-responsive design'
            ],
            technologies: ['ASP.NET Webforms', 'C#', 'MS SQL Server', 'Bootstrap', 'jQuery'],
            challenges: 'Managing concurrent bookings, payment gateway integration, and ensuring mobile compatibility.',
            outcome: 'Increased booking efficiency by 80% and improved guest satisfaction.',
            duration: '4 months',
            team: '2 developers',
            url: 'https://oas.iitmandi.ac.in/OASGuestHouse/Common/Login.aspx'
        },
        'shortstory': {
            title: 'Shortstory Web Application',
            description: 'A modern web application for sharing and discovering short stories with social features.',
            features: [
                'User authentication and profiles',
                'Story creation and editing tools',
                'Social features (likes, comments, shares)',
                'Search and categorization',
                'Reading progress tracking',
                'Responsive design'
            ],
            technologies: ['ASP.NET Core 6', 'Angular 8', 'Entity Framework', 'SQL Server', 'JWT Authentication'],
            challenges: 'Implementing real-time features, optimizing for mobile devices, and ensuring scalability.',
            outcome: 'Active user base of 500+ writers and readers with positive feedback.',
            duration: '5 months',
            team: '2 developers',
            url: 'http://shortstory.manzoorthetrainer.com/'
        },
        'ai-analytics': {
            title: 'AI-Powered Analytics Dashboard',
            description: 'An advanced analytics platform with machine learning capabilities for predictive analysis.',
            features: [
                'Machine learning model integration',
                'Real-time data visualization',
                'Predictive analytics',
                'Custom dashboard creation',
                'Data export and reporting',
                'API integration'
            ],
            technologies: ['Python', 'TensorFlow', 'ASP.NET Core', 'Angular', 'D3.js', 'PostgreSQL'],
            challenges: 'Integrating ML models with web application, handling large datasets, and ensuring real-time performance.',
            outcome: 'Currently in development with promising initial results.',
            duration: 'Ongoing',
            team: '3 developers',
            url: null
        }
    };

    const project = projectData[projectId];
    if (!project) return;

    modalTitle.textContent = project.title;
    modalBody.innerHTML = `
        <div class="project-modal-content">
            <div class="project-description">
                <h3>Project Overview</h3>
                <p>${project.description}</p>
            </div>
            
            <div class="project-details-grid">
                <div class="project-features">
                    <h3>Key Features</h3>
                    <ul>
                        ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="project-tech-stack">
                    <h3>Technologies Used</h3>
                    <div class="tech-tags">
                        ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                </div>
            </div>
            
            <div class="project-challenges">
                <h3>Challenges & Solutions</h3>
                <p>${project.challenges}</p>
            </div>
            
            <div class="project-outcome">
                <h3>Results & Impact</h3>
                <p>${project.outcome}</p>
            </div>
            
            <div class="project-meta">
                <div class="meta-item">
                    <strong>Duration:</strong> ${project.duration}
                </div>
                <div class="meta-item">
                    <strong>Team Size:</strong> ${project.team}
                </div>
                ${project.url ? `
                <div class="meta-item">
                    <a href="${project.url}" target="_blank" class="btn btn-primary">
                        <i class="fas fa-external-link-alt"></i> View Live Project
                    </a>
                </div>
                ` : ''}
            </div>
        </div>
    `;

    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('projectModal');
    if (modal && e.target === modal) {
        closeProjectModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeProjectModal();
    }
});

// ===== TESTIMONIALS =====
function initializeTestimonials() {
    const testimonials = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    
    if (testimonials.length === 0) return;

    // Auto-rotate testimonials
    setInterval(() => {
        nextTestimonial();
    }, 5000);

    // Initialize dots click handlers
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentTestimonial = index;
            showTestimonial(currentTestimonial);
        });
    });
}

function showTestimonial(index) {
    const testimonials = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    
    testimonials.forEach((testimonial, i) => {
        testimonial.classList.toggle('active', i === index);
    });
    
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

function nextTestimonial() {
    const testimonials = document.querySelectorAll('.testimonial-card');
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(currentTestimonial);
}

function previousTestimonial() {
    const testimonials = document.querySelectorAll('.testimonial-card');
    currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
    showTestimonial(currentTestimonial);
}

// ===== CONTACT FORM =====
function initializeContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (isLoading) return;
        
        const submitBtn = form.querySelector('.submit-btn');
        const formSuccess = document.getElementById('formSuccess');
        
        // Show loading state
        isLoading = true;
        submitBtn.classList.add('loading');
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        try {
            // Simulate form submission (replace with actual API call)
            await simulateFormSubmission(data);
            
            // Show success message
            form.style.display = 'none';
            formSuccess.classList.add('show');
            
            // Reset form after delay
            setTimeout(() => {
                form.reset();
                form.style.display = 'block';
                formSuccess.classList.remove('show');
                isLoading = false;
                submitBtn.classList.remove('loading');
            }, 5000);
            
        } catch (error) {
            console.error('Form submission error:', error);
            alert('There was an error sending your message. Please try again.');
            isLoading = false;
            submitBtn.classList.remove('loading');
        }
    });
}

async function simulateFormSubmission(data) {
    // Simulate API call delay
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Form submitted:', data);
            resolve();
        }, 2000);
    });
}

// ===== LOAD MORE PROJECTS =====
function loadMoreProjects() {
    // This would typically load more projects from an API
    // For now, we'll just show a message
    alert('More projects coming soon! Check back later for updates.');
}

// ===== AOS INITIALIZATION =====
function initializeAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }
}

// ===== BACK TO TOP BUTTON =====
function initializeBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== PARALLAX EFFECTS =====
function initializeParallax() {
    const parallaxElements = document.querySelectorAll('.hero-particles');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach(element => {
            element.style.transform = `translateY(${rate}px)`;
        });
    });
}

// ===== UTILITY FUNCTIONS =====

// Debounce function for performance optimization
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Format date for display
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
}

// Copy text to clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy text: ', err);
        return false;
    }
}

// ===== PERFORMANCE MONITORING =====
function initializePerformanceMonitoring() {
    // Monitor page load performance
    window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
    });

    // Monitor scroll performance
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                scrollTimeout = null;
                // Scroll performance logic here
            }, 100);
        }
    });
}

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
    // You could send this to an error tracking service
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled Promise Rejection:', e.reason);
    // You could send this to an error tracking service
});

// ===== EXPORT FUNCTIONS FOR GLOBAL ACCESS =====
window.openProjectModal = openProjectModal;
window.closeProjectModal = closeProjectModal;
window.nextTestimonial = nextTestimonial;
window.previousTestimonial = previousTestimonial;
window.currentTestimonial = (index) => {
    currentTestimonial = index - 1;
    showTestimonial(currentTestimonial);
};
window.loadMoreProjects = loadMoreProjects;