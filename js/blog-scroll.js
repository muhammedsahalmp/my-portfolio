document.addEventListener('DOMContentLoaded', function() {
    const blogGrid = document.getElementById('blogGrid');
    const prevBtn = document.getElementById('prevBlog');
    const nextBtn = document.getElementById('nextBlog');
    
    // Scroll amount for each button click
    const scrollAmount = 400;
    
    // Update buttons state
    function updateScrollButtons() {
        prevBtn.classList.toggle('disabled', blogGrid.scrollLeft <= 0);
        nextBtn.classList.toggle('disabled', 
            blogGrid.scrollLeft >= blogGrid.scrollWidth - blogGrid.clientWidth);
    }
    
    // Scroll handlers
    prevBtn.addEventListener('click', () => {
        blogGrid.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    });
    
    nextBtn.addEventListener('click', () => {
        blogGrid.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });
    
    // Listen for scroll events to update button states
    blogGrid.addEventListener('scroll', updateScrollButtons);
    
    // Initial button state
    updateScrollButtons();
    
    // Handle modal functionality
    const modalButtons = document.querySelectorAll('[data-toggle="modal"]');
    
    modalButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetModal = document.querySelector(this.dataset.target);
            if (targetModal) {
                $(targetModal).modal('show');
            }
        });
    });
});

// Optional: Add touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

blogGrid.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
}, false);

blogGrid.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, false);

function handleSwipe() {
    const swipeThreshold = 50;
    const difference = touchStartX - touchEndX;
    
    if (Math.abs(difference) > swipeThreshold) {
        if (difference > 0) {
            // Swipe left
            nextBtn.click();
        } else {
            // Swipe right
            prevBtn.click();
        }
    }
}

class BlogScroller {
    constructor() {
        this.container = document.querySelector('.blog-cards-container');
        this.prevBtn = document.getElementById('prevBlog');
        this.nextBtn = document.getElementById('nextBlog');
        this.scrollAmount = 300; // Adjust based on your card width
        this.scrolling = false;
        
        this.init();
    }

    init() {
        // Add click events
        this.prevBtn.addEventListener('click', () => this.scroll('left'));
        this.nextBtn.addEventListener('click', () => this.scroll('right'));
        
        // Check scroll position on load
        this.checkScrollPosition();
        
        // Check scroll position when scrolling ends
        this.container.addEventListener('scroll', () => {
            if (!this.scrolling) {
                window.requestAnimationFrame(() => {
                    this.checkScrollPosition();
                    this.scrolling = false;
                });
            }
            this.scrolling = true;
        });
    }

    scroll(direction) {
        const currentScroll = this.container.scrollLeft;
        const newScroll = direction === 'left' 
            ? currentScroll - this.scrollAmount 
            : currentScroll + this.scrollAmount;
            
        this.container.scrollTo({
            left: newScroll,
            behavior: 'smooth'
        });
    }

    checkScrollPosition() {
        const isAtStart = this.container.scrollLeft === 0;
        const isAtEnd = this.container.scrollLeft + this.container.offsetWidth >= 
                       this.container.scrollWidth;

        // Update button states
        this.prevBtn.classList.toggle('disabled', isAtStart);
        this.nextBtn.classList.toggle('disabled', isAtEnd);
    }
} 