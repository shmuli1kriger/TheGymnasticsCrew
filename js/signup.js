document.addEventListener("DOMContentLoaded", function() {
    const signupForm = document.querySelector("#signupForm");
    const phoneInput = document.querySelector("#phone");

    // 1. Live Phone Formatter
    if (phoneInput) {
        phoneInput.addEventListener("input", function() {
            let cleanInput = this.value.replace(/\D/g, ''); 
            if (cleanInput.length <= 3) { 
                this.value = cleanInput; 
            } else if (cleanInput.length <= 6) { 
                this.value = `${cleanInput.slice(0, 3)}-${cleanInput.slice(3)}`; 
            } else { 
                this.value = `${cleanInput.slice(0, 3)}-${cleanInput.slice(3, 6)}-${cleanInput.slice(6, 10)}`; 
            }
            // Live clear phone error if valid length reached
            if (cleanInput.length === 10) {
                phoneInput.setCustomValidity(""); // Valid
            } else {
                phoneInput.setCustomValidity("Incomplete phone number"); // Invalid
            }
        });
    }
    if (signupForm) {
        signupForm.addEventListener("submit", function(event) {
            if (phoneInput) {
                let cleanPhone = phoneInput.value.replace(/\D/g, '');
                if (cleanPhone.length !== 10) {
                    phoneInput.setCustomValidity("Incomplete phone number");
                }
            }

            // Check if any HTML constraint fields failed validation
            if (!signupForm.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }

            // Adding this class makes Bootstrap visually reveal all the errors instantly
            signupForm.classList.add("was-validated");
        });
    }
});


