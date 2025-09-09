// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const downloadCV = document.getElementById('download-cv');
const navbar = document.getElementById('navbar');

// Theme Management
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.init();
    }

    init() {
        this.setTheme(this.currentTheme);
        this.bindEvents();
    }

    bindEvents() {
        themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // System theme change detection
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    setTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;
        
        // Update theme toggle button
        this.updateThemeToggle();
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        
        // Add animation to theme toggle
        themeToggle.style.transform = 'rotate(360deg) scale(1.1)';
        setTimeout(() => {
            themeToggle.style.transform = '';
        }, 300);
    }

    updateThemeToggle() {
        const sunIcon = themeToggle.querySelector('.sun-icon');
        const moonIcon = themeToggle.querySelector('.moon-icon');
        
        if (this.currentTheme === 'dark') {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        } else {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        }
    }
}

// Navigation Management
class NavigationManager {
    constructor() {
        this.isMenuOpen = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.handleScroll();
    }

    bindEvents() {
        // Hamburger menu toggle
        hamburger.addEventListener('click', () => this.toggleMenu());
        
        // Close menu when clicking nav links
        navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                this.closeMenu();
            }
        });

        // Smooth scrolling for navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Scroll event for navbar styling and active links
        window.addEventListener('scroll', () => this.handleScroll());
    }

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        navMenu.classList.toggle('active', this.isMenuOpen);
        hamburger.classList.toggle('active', this.isMenuOpen);
        
        // Prevent body scrolling when menu is open on mobile
        document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
    }

    closeMenu() {
        this.isMenuOpen = false;
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
    }

    handleScroll() {
        const scrollY = window.scrollY;
        
        // Update navbar styling
        if (scrollY > 100) {
            navbar.style.background = document.body.getAttribute('data-theme') === 'dark' 
                ? 'rgba(19, 19, 31, 0.98)' 
                : 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(130, 87, 230, 0.1)';
        } else {
            navbar.style.background = document.body.getAttribute('data-theme') === 'dark' 
                ? 'rgba(19, 19, 31, 0.95)' 
                : 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }

        // Update active navigation link
        this.updateActiveLink();
    }

    updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// Animations Manager
class AnimationManager {
    constructor() {
        this.observedElements = new Set();
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.addScrollAnimations();
        this.addHoverEffects();
    }

    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    this.observer.unobserve(entry.target);
                }
            });
        }, options);

        // Observe elements for animation
        const elementsToAnimate = document.querySelectorAll('.skill-card, .project-card, .project-item, .contact-item');
        elementsToAnimate.forEach((el, index) => {
            el.style.transitionDelay = `${index * 0.1}s`;
            this.observer.observe(el);
        });
    }

    addScrollAnimations() {
        // Scroll animations (parallax removed)
        // No scroll-based transformations
    }

    addHoverEffects() {
        // Enhanced skill card effects
        const skillCards = document.querySelectorAll('.skill-card');
        skillCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-15px) scale(1.02)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });

        // Project card tilt effect
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / centerY * -10;
                const rotateY = (x - centerX) / centerX * 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }
}

// Skills Section Effects
class SkillsManager {
    constructor() {
        this.init();
    }

    init() {
        this.addSkillEffects();
        this.addProgressAnimations();
    }

    addSkillEffects() {
        const skillCards = document.querySelectorAll('.skill-card');
        
        skillCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                // Add glow effect
                card.style.boxShadow = '0 20px 60px rgba(130, 87, 230, 0.4)';
                
                // Animate icon
                const icon = card.querySelector('.skill-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.2) rotate(10deg)';
                }
            });

            card.addEventListener('mouseleave', () => {
                card.style.boxShadow = '';
                
                const icon = card.querySelector('.skill-icon');
                if (icon) {
                    icon.style.transform = '';
                }
            });

            // Add click effect
            card.addEventListener('click', () => {
                card.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    card.style.transform = '';
                }, 150);
            });
        });
    }

    addProgressAnimations() {
        // Create skill level indicators (optional)
        const skills = [
            { name: 'React.js', level: 90 },
            { name: 'Next.js', level: 85 },
            { name: 'TypeScript', level: 80 },
            { name: 'Redux', level: 75 },
            { name: 'Styled Components', level: 85 },
            { name: 'Tailwind CSS', level: 90 }
        ];

        // This could be expanded to show skill levels visually
    }
}

// Download CV Functionality
class CVManager {
    constructor() {
        this.init();
    }

    init() {
        downloadCV.addEventListener('click', (e) => {
            e.preventDefault();
            this.downloadCV();
        });
    }

    downloadCV() {
        // Create CV content
        const cvContent = this.generateCVContent();
        
        // Create and download file
        const blob = new Blob([cvContent], { type: 'text/plain;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        
        a.href = url;
        a.download = 'Rhuan_Bello_CV.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        // Show success message
        this.showDownloadMessage();
    }

    generateCVContent() {
        return `
RHUAN BELLO
Desenvolvedor Front-end

CONTATO
Email: rhuanbello@gmail.com
Telefone: (21) 96889-2704
LinkedIn: linkedin.com/in/rhuanbello
GitHub: github.com/rhuanbello

SOBRE
Desenvolvedor Front-end com experiência em criar interfaces modernas e responsivas. 
Especializado em React.js, Next.js e TypeScript, sempre buscando entregar a melhor 
experiência do usuário com código limpo e otimizado.

HABILIDADES TÉCNICAS
• React.js - Desenvolvimento de interfaces dinâmicas e componentes reutilizáveis
• Next.js - Aplicações full-stack com SSR, SSG e otimizações de performance
• TypeScript - Desenvolvimento type-safe para maior confiabilidade do código
• Redux - Gerenciamento de estado para aplicações complexas
• Styled Components - CSS-in-JS para estilização dinâmica e componentizada
• Tailwind CSS - Framework CSS utility-first para desenvolvimento rápido

PROJETOS DESTACADOS
• E-commerce Platform - Plataforma completa desenvolvida com React, Next.js e TypeScript
• Dashboard Analytics - Dashboard interativo com gráficos e métricas em tempo real
• Task Manager App - Aplicativo de gerenciamento de tarefas com drag & drop

ESPECIALIDADES
• Desenvolvimento de interfaces responsivas
• Otimização de performance
• Componentes reutilizáveis
• Design Systems
• Animações fluidas
• Melhorias de acessibilidade

Data: ${new Date().toLocaleDateString('pt-BR')}
        `;
    }

    showDownloadMessage() {
        // Create and show a temporary message
        const message = document.createElement('div');
        message.textContent = 'CV baixado com sucesso! ✓';
        message.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--accent-primary);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(130, 87, 230, 0.3);
            z-index: 1000;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(message);

        setTimeout(() => {
            message.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (document.body.contains(message)) {
                    document.body.removeChild(message);
                }
            }, 300);
        }, 3000);
    }
}

// Performance Optimization
class PerformanceManager {
    constructor() {
        this.init();
    }

    init() {
        this.lazyLoadImages();
        this.prefetchImportantResources();
        this.optimizeScrollEvents();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.remove('loading');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }
    }

    prefetchImportantResources() {
        // Prefetch important resources
        const importantUrls = [
            'https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg',
            'https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original.svg'
        ];

        importantUrls.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = url;
            document.head.appendChild(link);
        });
    }

    optimizeScrollEvents() {
        let ticking = false;

        function updateOnScroll() {
            // Batched scroll updates
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateOnScroll);
                ticking = true;
            }
        });
    }
}

// Accessibility Enhancements
class AccessibilityManager {
    constructor() {
        this.init();
    }

    init() {
        this.addKeyboardNavigation();
        this.addAriaLabels();
        this.addFocusManagement();
    }

    addKeyboardNavigation() {
        // Escape key to close mobile menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const navManager = window.navigationManager;
                if (navManager && navManager.isMenuOpen) {
                    navManager.closeMenu();
                }
            }
        });

        // Tab navigation improvements
        const focusableElements = document.querySelectorAll(
            'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );

        focusableElements.forEach(element => {
            element.addEventListener('focus', () => {
                element.style.outline = '2px solid var(--accent-primary)';
                element.style.outlineOffset = '2px';
            });

            element.addEventListener('blur', () => {
                element.style.outline = '';
                element.style.outlineOffset = '';
            });
        });
    }

    addAriaLabels() {
        // Add missing aria labels
        const skillCards = document.querySelectorAll('.skill-card');
        skillCards.forEach((card, index) => {
            const title = card.querySelector('h3').textContent;
            card.setAttribute('aria-label', `Habilidade: ${title}`);
        });

        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            const title = card.querySelector('.project-title').textContent;
            card.setAttribute('aria-label', `Projeto: ${title}`);
        });
    }

    addFocusManagement() {
        // Trap focus in mobile menu when open
        const trapFocus = (element) => {
            const focusableElements = element.querySelectorAll(
                'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
            );
            
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            element.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        if (document.activeElement === firstElement) {
                            e.preventDefault();
                            lastElement.focus();
                        }
                    } else {
                        if (document.activeElement === lastElement) {
                            e.preventDefault();
                            firstElement.focus();
                        }
                    }
                }
            });
        };

        // Apply focus trap to mobile menu
        trapFocus(navMenu);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all managers
    window.themeManager = new ThemeManager();
    window.navigationManager = new NavigationManager();
    window.animationManager = new AnimationManager();
    window.skillsManager = new SkillsManager();
    window.cvManager = new CVManager();
    window.performanceManager = new PerformanceManager();
    window.accessibilityManager = new AccessibilityManager();

    // Add loading animations
    document.body.classList.add('loaded');

    // Log successful initialization
    console.log('🚀 Portfolio website loaded successfully!');
});

// Add CSS for additional animations
const additionalStyles = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }

    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }

    .loaded {
        opacity: 1;
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);