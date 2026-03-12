// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');

    if (mobileMenuToggle && mobileNav) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileNav.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });

        // Close mobile menu when clicking a link
        const mobileLinks = mobileNav.querySelectorAll('.mobile-nav-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileNav.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenuToggle.contains(event.target) && !mobileNav.contains(event.target)) {
                mobileNav.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        });
    }

    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const offset = 100; // Account for sticky header
                const targetPosition = targetElement.offsetTop - offset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active sidebar link highlighting based on scroll position
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        const sidebarLinks = sidebar.querySelectorAll('.sidebar-link');
        const sections = [];

        sidebarLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                const sectionId = href.substring(1);
                const section = document.getElementById(sectionId);
                if (section) {
                    sections.push({
                        id: sectionId,
                        element: section,
                        link: link
                    });
                }
            }
        });

        function highlightActiveSection() {
            const scrollPosition = window.scrollY + 150;

            sections.forEach(section => {
                const sectionTop = section.element.offsetTop;
                const sectionBottom = sectionTop + section.element.offsetHeight;

                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    // Remove active class from all links
                    sidebarLinks.forEach(link => link.classList.remove('active'));
                    // Add active class to current section link
                    section.link.classList.add('active');
                }
            });
        }

        // Debounce scroll event
        let scrollTimer;
        window.addEventListener('scroll', function() {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(highlightActiveSection, 50);
        });

        // Initial highlight
        highlightActiveSection();
    }

    // Sidebar toggle for mobile
    const sidebarToggle = document.createElement('button');
    sidebarToggle.className = 'sidebar-toggle';
    sidebarToggle.innerHTML = '☰ Topics';
    sidebarToggle.style.cssText = `
        display: none;
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 10px 20px;
        background: var(--color-primary);
        color: white;
        border: none;
        border-radius: 25px;
        cursor: pointer;
        z-index: 999;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `;

    const sidebarElement = document.querySelector('.sidebar');
    if (sidebarElement && window.innerWidth <= 768) {
        document.body.appendChild(sidebarToggle);
        sidebarToggle.style.display = 'block';

        sidebarToggle.addEventListener('click', function() {
            sidebarElement.classList.toggle('mobile-visible');
        });
    }

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            sidebarToggle.style.display = 'none';
            if (sidebarElement) {
                sidebarElement.classList.remove('mobile-visible');
            }
        } else if (sidebarElement) {
            sidebarToggle.style.display = 'block';
        }
    });
});

// Add necessary CSS for mobile sidebar
const style = document.createElement('style');
style.textContent = `
    @media (max-width: 768px) {
        .sidebar.mobile-visible {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            width: 280px;
            background: white;
            z-index: 998;
            box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
            overflow-y: auto;
            transform: translateX(0);
            transition: transform 0.3s ease;
        }

        .sidebar:not(.mobile-visible) {
            transform: translateX(-100%);
        }
    }
`;
document.head.appendChild(style);
