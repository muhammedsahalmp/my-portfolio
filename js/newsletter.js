class Newsletter {
    constructor() {
        this.form = document.getElementById('newsletterForm');
        this.emailInput = document.getElementById('emailInput');
        this.submitButton = this.form.querySelector('.tech-button');
        this.messageDiv = document.getElementById('formMessage');
        
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateEmail()) return;
        
        const email = this.emailInput.value;
        
        try {
            this.setLoading(true);
            const response = await this.submitSubscription(email);
            
            if (response.success) {
                this.showSuccess('Thank you! Please check your email to confirm subscription.');
                this.form.reset();
            } else {
                this.showError(response.message);
            }
        } catch (error) {
            this.showError('Subscription failed. Please try again.');
            console.error('Error:', error);
        } finally {
            this.setLoading(false);
        }
    }

    validateEmail() {
        const email = this.emailInput.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async submitSubscription(email) {
        const response = await fetch('/api/subscribe.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        });
        return response.json();
    }

    setLoading(isLoading) {
        this.submitButton.disabled = isLoading;
        this.submitButton.innerHTML = isLoading ? 
            'Subscribing...<span class="button-glow"></span>' : 
            'Subscribe<span class="button-glow"></span>';
    }

    showSuccess(message) {
        this.messageDiv.innerHTML = `<div class="success">${message}</div>`;
    }

    showError(message) {
        this.messageDiv.innerHTML = `<div class="error">${message}</div>`;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new Newsletter();
}); 