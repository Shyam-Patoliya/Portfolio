// Initialize AOS for animations
AOS.init({ duration: 1000, once: true });

// Typing effect for the home section
// const text = "Shyam Patoliya";
// let index = 0;

// function typeEffect() {
//     const textElement = document.getElementById("animated-text");
//     if (index < text.length) {
//         textElement.innerHTML += text.charAt(index);
//         index++;
//         setTimeout(typeEffect, 150);
//     }
// }

document.addEventListener("DOMContentLoaded", typeEffect);

// Toggle project details visibility
function toggleDetails(card) {
    const details = card.querySelector(".project-details");
    details.style.display = details.style.display === "block" ? "none" : "block";
}

// Form validation
function validateForm() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;
    const feedback = document.getElementById("form-feedback");

    if (!name || !email || !message) {
        feedback.textContent = "Please fill out all fields.";
        feedback.style.color = "red";
        return false;
    }

    feedback.textContent = "Message sent successfully!";
    feedback.style.color = "green";
    return true;
}
