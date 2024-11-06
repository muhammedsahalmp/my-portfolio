document.getElementById('newsletterForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = form.querySelector('#newsletterEmail').value;
    const responseDiv = form.querySelector('.newsletter-response');
    const submitButton = form.querySelector('.newsletter-submit');
    
    // Disable submit button and show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fal fa-spinner fa-spin"></i>';
    
    try {
        const response = await fetch(form.action, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                subject: 'New Newsletter Subscription',
                from_name: email,
                message: `New subscription request from ${email}`
            })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            // Success message
            responseDiv.innerHTML = '<p class="text-success">Thank you for subscribing!</p>';
            form.reset();
        } else {
            // Error message
            throw new Error(result.message || 'Something went wrong');
        }
    } catch (error) {
        // Show error message
        responseDiv.innerHTML = `<p class="text-danger">${error.message}</p>`;
    } finally {
        // Reset submit button
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fal fa-envelope"></i>';
        
        // Clear message after 5 seconds
        setTimeout(() => {
            responseDiv.innerHTML = '';
        }, 5000);
    }
}); 