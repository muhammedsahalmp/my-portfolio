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