
function validateForm() {
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    
    if (name.trim() === "") {
        alert("Please enter your name.");
        return false;
    }

    
    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(phone)) {
        alert("Please enter a valid phone number (10 digits).");
        return false;
    }

   
    if (email && !/\S+@\S+\.\S+/.test(email)) {
        alert("Please enter a valid email address.");
        return false;
    }

    
    if (message.trim() === "") {
        alert("Please enter a message.");
        return false;
    }

    return true;
}


function sendViaWhatsapp(event) {
    event.preventDefault(); 
    if (!validateForm()) return;

    const name = encodeURIComponent(document.getElementById("name").value);
    const phone = encodeURIComponent(document.getElementById("phone").value);
    const email = encodeURIComponent(document.getElementById("email").value);
    const message = encodeURIComponent(document.getElementById("message").value);

    const whatsappMessage = `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nMessage: ${message}`;
    const whatsappURL = `https://wa.me/254115704063?text=${whatsappMessage}`;

    window.open(whatsappURL, '_blank');
}


function sendViaEmail(event) {
    event.preventDefault(); 
    if (!validateForm()) return;

    const name = encodeURIComponent(document.getElementById("name").value);
    const phone = encodeURIComponent(document.getElementById("phone").value);
    const email = encodeURIComponent(document.getElementById("email").value);
    const message = encodeURIComponent(document.getElementById("message").value);

    const emailSubject = "Contact Form Submission";
    const emailBody = `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nMessage: ${message}`;
    const mailtoURL = `mailto:nia.team.developers@gmail.com?subject=${emailSubject}&body=${emailBody}`;

    window.location.href = mailtoURL;
}


document.getElementById("whatsapp-btn").addEventListener("click", sendViaWhatsapp);
document.getElementById("email-btn").addEventListener("click", sendViaEmail);
