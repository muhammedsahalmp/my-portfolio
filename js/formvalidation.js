$(function() {
    var form = $('#contact-form');
    var formMessages = $('.form-message');

    // Single form submission handler
    form.on('submit', function(event) {
        event.preventDefault();

        // Get all form values and trim whitespace
        var name = document.getElementById("inputName").value.trim();
        var email = document.getElementById("inputEmail").value.trim();
        var phone = document.getElementById("inputPhone").value.trim();
        var subject = document.getElementById("inputSubject").value.trim();
        var message = document.getElementById("inputMessage").value.trim();

        // Reset form messages
        $(formMessages).removeClass('success error').text('');

        // Validation checks
        if (!name || name.length < 2 || /\s{2,}/.test(name) || !/^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/.test(name)) {
            alert("Please enter a valid name (only letters and single spaces between words)");
            $(formMessages).addClass('error').text('Please fix the name field.');
            return false;
        }
        
        if (!email || !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)) {
            alert("Please enter a valid email address");
            $(formMessages).addClass('error').text('Please fix the email field.');
            return false;
        }

        if (!phone || !/^\d{10}$/.test(phone)) {
            alert("Phone number must be exactly 10 digits");
            $(formMessages).addClass('error').text('Please fix the phone field.');
            return false;
        }

        if (!subject || subject.length < 2) {
            alert("Please enter a valid subject (minimum 2 characters)");
            $(formMessages).addClass('error').text('Please fix the subject field.');
            return false;
        }

        if (!message || message.length < 10) {
            alert("Please enter a valid message (minimum 10 characters)");
            $(formMessages).addClass('error').text('Please fix the message field.');
            return false;
        }

        // If we reach here, all validations have passed
        // Prepare form data
        var formData = new FormData();
        formData.append('inputName', name);
        formData.append('inputEmail', email);
        formData.append('inputPhone', phone);
        formData.append('inputSubject', subject);
        formData.append('inputMessage', message);
        formData.append('access_key', document.querySelector('input[name="access_key"]').value);

        // Submit form
        $.ajax({
            type: 'POST',
            url: form.attr('action'),
            data: formData,
            processData: false,
            contentType: false
        }).done(function(response) {
            $(formMessages).removeClass('error').addClass('success');
            
            $(formMessages).text('Message sent successfully!');
            form[0].reset();
        }).fail(function(error) {
            $(formMessages).removeClass('success').addClass('error');
            $(formMessages).text('An error occurred. Please try again later.');
        });

        return false; // Prevent form from submitting normally
    });
});