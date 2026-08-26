document.addEventListener("DOMContentLoaded", () => {
  // Mobile Navigation Menu Toggle
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }

  // Close Mobile Menu on Link Click
  document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
    });
  });

  // Accordion Component Logic (Warning Signs & FAQ)
  const accordionHeaders = document.querySelectorAll(".accordion-header");

  accordionHeaders.forEach(header => {
    header.addEventListener("click", () => {
      const accordionItem = header.parentElement;
      const isOpen = accordionItem.classList.contains("active");

      const siblingItems = accordionItem.parentElement.querySelectorAll(".accordion-item");
      siblingItems.forEach(item => item.classList.remove("active"));

      if (!isOpen) {
        accordionItem.classList.add("active");
      }
    });
  });

  // Appointment Modal Interactivity
  const modalOverlay = document.getElementById("appointmentModal");
  const modalClose = document.getElementById("modalClose");
  const openModalButtons = document.querySelectorAll(".open-modal");
  const serviceSelect = document.getElementById("serviceType");
  const appointmentForm = document.getElementById("appointmentForm");

  openModalButtons.forEach(button => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const serviceName = button.getAttribute("data-service");
      if (serviceName && serviceSelect) {
        serviceSelect.value = serviceName;
      }
      modalOverlay.classList.add("active");
    });
  });

  const closeModal = () => {
    modalOverlay.classList.remove("active");
  };

  if (modalClose) {
    modalClose.addEventListener("click", closeModal);
  }

  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  if (appointmentForm) {
    appointmentForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Thank you! Your booking request has been submitted. We will call you at 0796 365596 shortly.");
      closeModal();
    });
  }
});