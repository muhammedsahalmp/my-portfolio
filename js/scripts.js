// Add this JavaScript for scroll animations
document.addEventListener('DOMContentLoaded', function() {
    const scrollContainer = document.querySelector('.skills-scroll-container');
    const skillItems = document.querySelectorAll('.skill-item');

    // Intersection Observer for skill items
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.2,
        root: scrollContainer
    });

    // Observe each skill item
    skillItems.forEach(item => {
        observer.observe(item);
    });

    // Parallax effect for image
    const imageWrapper = document.querySelector('.image-wrapper');
    scrollContainer.addEventListener('scroll', () => {
        const scrolled = scrollContainer.scrollTop;
        imageWrapper.style.transform = `translateY(${scrolled * 0.1}px)`;
    });

    // Hide scroll indicator when reached bottom
    scrollContainer.addEventListener('scroll', () => {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollContainer.scrollHeight - scrollContainer.scrollTop === scrollContainer.clientHeight) {
            scrollIndicator.style.opacity = '0';
        } else {
            scrollIndicator.style.opacity = '0.7';
        }
    });
});








document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // Smooth scroll for service features
    const serviceCard = document.querySelector('.service-card');
    if (serviceCard) {
        serviceCard.addEventListener('mouseenter', () => {
            serviceCard.style.transform = 'translateY(-10px)';
        });

        serviceCard.addEventListener('mouseleave', () => {
            serviceCard.style.transform = 'translateY(0)';
        });
    }

    // Add parallax effect to floating shape
    window.addEventListener('scroll', () => {
        const shape = document.querySelector('.floating-shape');
        if (shape) {
            const scrolled = window.pageYOffset;
            shape.style.transform = `translateY(${scrolled * 0.1}px)`;
        }
    });
});




function scrollToContact() {
    const contactSection = document.getElementById('contact');
    
    if (contactSection) {
        // Smooth scroll to contact section
        contactSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });

        // Optional: Add highlight effect to contact section
        contactSection.classList.add('highlight');
        setTimeout(() => {
            contactSection.classList.remove('highlight');
        }, 2000);
    }
}

// Alternative using anchor tag
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});















