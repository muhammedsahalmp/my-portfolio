class ContactCard {
    constructor(element) {
        this.card = element;
        this.frame = element.querySelector('.card-frame');
        this.techGrid = element.querySelector('.tech-grid');
        this.button = element.querySelector('.action-btn');
        
        this.init();
    }
    
    init() {
        this.generateTechGrid();
        this.addEventListeners();
    }
    
    generateTechGrid() {
        const rows = 10;
        const cols = 20;
        
        for (let i = 0; i < rows * cols; i++) {
            const div = document.createElement('div');
            div.style.animationDelay = `${Math.random() * 0.5}s`;
            this.techGrid.appendChild(div);
        }
    }
    
    addEventListeners() {
        this.card.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.card.addEventListener('mouseleave', () => this.handleMouseLeave());
        this.button.addEventListener('click', (e) => this.handleButtonClick(e));
    }
    
    handleMouseMove(e) {
        const rect = this.card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Calculate rotation
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * 10;
        const rotateY = ((x - centerX) / centerX) * 10;
        
        // Apply transforms
        this.frame.style.transform = `
            perspective(1000px)
            rotateX(${-rotateX}deg)
            rotateY(${rotateY}deg)
            translateY(-10px)
        `;
        
        // Update lighting effects
        const sphere = this.card.querySelector('.sphere-glow');
        sphere.style.background = `
            radial-gradient(
                circle at ${x}px ${y}px,
                var(--primary),
                var(--secondary)
            )
        `;
    }
    
    handleMouseLeave() {
        this.frame.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    }
    
    handleButtonClick(e) {
        const type = this.card.dataset.type;
        
        switch(type) {
            case 'location':
                window.open('https://maps.google.com/?q=Malappuram,Kerala', '_blank');
                break;
            case 'phone':
                window.location.href = 'tel:+917559090682';
                break;
            case 'email':
                window.location.href = 'mailto:hi.sahalmp@gmail.com';
                break;
        }
        
        // Button click animation
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        
        const rect = this.button.getBoundingClientRect();
        ripple.style.left = `${e.clientX - rect.left}px`;
        ripple.style.top = `${e.clientY - rect.top}px`;
        
        this.button.appendChild(ripple);
        setTimeout(() => ripple.remove(), 1000);
    }
}

// Initialize cards
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.contact-card');
    cards.forEach(card => new ContactCard(card));
});

// Map Button Handler
document.querySelectorAll('.map-button').forEach(button => {
    button.addEventListener('click', async (e) => {
        e.preventDefault();
        const mapUrl = button.dataset.map;
        
        // Add loading state
        button.classList.add('loading');
        
        try {
            // Check if device has maps app
            if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
                // Mobile device
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const { latitude, longitude } = position.coords;
                            const destination = '11.061932,75.920066'; // Malappuram coordinates
                            
                            // Construct directions URL based on device
                            let directionsUrl;
                            if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                                // iOS
                                directionsUrl = `maps://maps.apple.com/?saddr=${latitude},${longitude}&daddr=${destination}`;
                            } else {
                                // Android
                                directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${destination}`;
                            }
                            
                            window.location.href = directionsUrl;
                        },
                        (error) => {
                            // If geolocation fails, open regular map
                            window.open(mapUrl, '_blank');
                        }
                    );
                } else {
                    window.open(mapUrl, '_blank');
                }
            } else {
                // Desktop - open in new tab
                window.open(mapUrl, '_blank');
            }
        } catch (error) {
            console.error('Error opening map:', error);
            // Fallback to regular map link
            window.open(mapUrl, '_blank');
        } finally {
            // Remove loading state after a minimum duration
            setTimeout(() => {
                button.classList.remove('loading');
            }, 800);
        }
    });

    // Add hover animation
    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Update gradient position
        button.style.setProperty('--x', `${x}px`);
        button.style.setProperty('--y', `${y}px`);
    });
});

// Add touch support for mobile devices
if ('ontouchstart' in window) {
    document.querySelectorAll('.map-button').forEach(button => {
        button.addEventListener('touchstart', () => {
            button.classList.add('touch-active');
        });
        
        button.addEventListener('touchend', () => {
            button.classList.remove('touch-active');
        });
    });
}

// Button Handlers
document.addEventListener('DOMContentLoaded', () => {
    // Call Button
    const callButton = document.querySelector('.call-button');
    if (callButton) {
        callButton.addEventListener('click', (e) => {
            e.preventDefault();
            const phoneNumber = callButton.dataset.phone;
            
            // Add click effect
            const ripple = document.createElement('div');
            ripple.className = 'ripple';
            const rect = callButton.getBoundingClientRect();
            ripple.style.left = `${e.clientX - rect.left}px`;
            ripple.style.top = `${e.clientY - rect.top}px`;
            callButton.appendChild(ripple);
            
            // Handle call action
            if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
                window.location.href = `tel:${phoneNumber}`;
            } else {
                // Create "Copy to clipboard" functionality for desktop
                navigator.clipboard.writeText(phoneNumber).then(() => {
                    showToast('Phone number copied to clipboard!');
                }).catch(err => {
                    console.error('Failed to copy:', err);
                });
            }
            
            // Remove ripple after animation
            setTimeout(() => ripple.remove(), 1000);
        });
    }

    // Connect Button
    const connectButton = document.querySelector('.connect-button');
    if (connectButton) {
        // Handle social links hover effects
        const socialLinks = connectButton.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                link.style.transform = 'translateY(-3px)';
            });
            
            link.addEventListener('mouseleave', () => {
                link.style.transform = 'translateY(0)';
            });
        });

        // Mobile touch handling
        if ('ontouchstart' in window) {
            connectButton.addEventListener('click', (e) => {
                e.preventDefault();
                const popup = connectButton.querySelector('.social-popup');
                popup.classList.toggle('active');
                
                // Close popup when clicking outside
                const closePopup = (event) => {
                    if (!connectButton.contains(event.target)) {
                        popup.classList.remove('active');
                        document.removeEventListener('click', closePopup);
                    }
                };
                
                document.addEventListener('click', closePopup);
            });
        }
    }
});

// Toast notification function
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Remove toast after delay
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    const title = document.querySelector('.glitch-title');
    
    // Random glitch effect
    setInterval(() => {
        if (Math.random() > 0.95) {
            title.style.animation = 'none';
            void title.offsetWidth; // Trigger reflow
            title.style.animation = null;
        }
    }, 500);

    // Parallax effect on scroll
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const titles = document.querySelectorAll('.title-content');
        
        titles.forEach(title => {
            const speed = 0.5;
            title.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // Interactive line effects
    const lines = document.querySelectorAll('.line-segment');
    lines.forEach(line => {
        line.addEventListener('mouseover', () => {
            line.style.transform = 'scaleX(1.2)';
        });
        
        line.addEventListener('mouseout', () => {
            line.style.transform = 'scaleX(1)';
        });
    });
});












//contact form section started


// ... existing code ...
document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('name');
    const nameError = document.createElement('div');
    nameError.className = 'error-message';
    nameInput.parentElement.appendChild(nameError);

    // Name validation function
    const validateName = (value) => {
        const nameRegex = /^[A-Za-z]+$/;
        return nameRegex.test(value);
    };

    nameInput.addEventListener('input', (e) => {
        // Immediately replace any non-alphabetic characters
        e.target.value = e.target.value.replace(/[^A-Za-z]/g, '');
        
        const value = e.target.value.trim();
        
        if (value.length === 0) {
            nameError.textContent = 'Name is required';
            nameError.style.display = 'block';
            nameInput.classList.add('invalid');
        } else if (!validateName(value)) {
            nameError.textContent = 'Please enter only letters in the Name field';
            nameError.style.display = 'block';
            nameInput.classList.add('invalid');
        } else {
            nameError.style.display = 'none';
            nameInput.classList.remove('invalid');
        }
    });

    // Also prevent pasting of invalid characters
    nameInput.addEventListener('paste', (e) => {
        e.preventDefault();
        const pastedText = (e.clipboardData || window.clipboardData).getData('text');
        const cleanText = pastedText.replace(/[^A-Za-z]/g, '');
        document.execCommand('insertText', false, cleanText);
    });

    // Form submission validation
    const form = document.getElementById('contactForm');
    form.addEventListener('submit', (e) => {
        const nameValue = nameInput.value.trim();
        
        if (!validateName(nameValue)) {
            e.preventDefault();
            nameError.textContent = 'Please enter only letters in the Name field';
            nameError.style.display = 'block';
            nameInput.classList.add('invalid');
            nameInput.focus();
            return false;
        }
    });
});

//contact form section ended