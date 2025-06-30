document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form values
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const subject = document.getElementById("subject").value;
      const message = document.getElementById("message").value;

      // Simple validation
      if (!name || !email || !subject || !message) {
        alert("Please fill in all fields");
        return;
      }

      // In a real application, you would send this data to a server
      // For now, we'll just show a success message
      alert(
        `Thank you for your message, ${name}! We will get back to you soon.`
      );

      // Reset the form
      contactForm.reset();
    });
  }

  // Add animation to contact items
  const contactItems = document.querySelectorAll(".contact-item");
  contactItems.forEach((item, index) => {
    item.style.animationDelay = `${index * 0.2}s`;
    item.style.animation = "fadeInRight 0.6s ease forwards";
    item.style.opacity = "0";
  });
});

// Animation keyframes would normally be in CSS, but we're adding them here for the contact items
document.head.insertAdjacentHTML(
  "beforeend",
  `
    <style>
        @keyframes fadeInRight {
            from {
                opacity: 0;
                transform: translateX(-30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
    </style>
`
);
