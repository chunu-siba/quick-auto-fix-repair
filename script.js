document.addEventListener("DOMContentLoaded", () => {
  /*
   * AUTO FIX REPAIRS
   * Frontend-only lead generation.
   *
   * No backend is required:
   * - WhatsApp opens a pre-filled message.
   * - Email opens a pre-filled mailto link.
   * - Phone opens the device dialer where supported.
   */

  const CONTACT = {
    phoneDisplay: "0796 365596",
    phoneInternational: "254796365596",
    email: "adansiba254@gmail.com",
    location: "Huruma, Nairobi"
  };

  // ------------------------------------------------------------
  // Mobile navigation
  // ------------------------------------------------------------
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("active");
      hamburger.setAttribute("aria-expanded", String(isOpen));
      hamburger.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
      );
    });

    document.querySelectorAll(".nav-links a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        hamburger.setAttribute("aria-expanded", "false");
        hamburger.setAttribute("aria-label", "Open navigation menu");
      });
    });
  }

  // ------------------------------------------------------------
  // Accordion: warning signs + FAQ
  // ------------------------------------------------------------
  const accordionHeaders = document.querySelectorAll(".accordion-header");

  accordionHeaders.forEach((header) => {
    header.addEventListener("click", () => {
      const item = header.closest(".accordion-item");
      const container = item?.parentElement;

      if (!item || !container) return;

      const wasOpen = item.classList.contains("active");

      container.querySelectorAll(".accordion-item").forEach((otherItem) => {
        otherItem.classList.remove("active");

        const otherHeader = otherItem.querySelector(".accordion-header");
        if (otherHeader) {
          otherHeader.setAttribute("aria-expanded", "false");
        }
      });

      if (!wasOpen) {
        item.classList.add("active");
        header.setAttribute("aria-expanded", "true");
      }
    });
  });

  // ------------------------------------------------------------
  // Service request modal
  // ------------------------------------------------------------
  const modalOverlay = document.getElementById("appointmentModal");
  const modalClose = document.getElementById("modalClose");
  const openModalButtons = document.querySelectorAll(".open-modal");
  const appointmentForm = document.getElementById("appointmentForm");
  const sendOptions = document.getElementById("sendOptions");
  const whatsappLink = document.getElementById("whatsappLink");
  const emailLink = document.getElementById("emailLink");
  const editRequest = document.getElementById("editRequest");
  const serviceSelect = document.getElementById("serviceType");
  const toast = document.getElementById("toast");

  let lastFocusedElement = null;
  let toastTimer = null;

  const showToast = (message) => {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 3200);
  };

  const openModal = (serviceName = "") => {
    if (!modalOverlay) return;

    lastFocusedElement = document.activeElement;

    if (serviceName && serviceSelect) {
      const optionExists = Array.from(serviceSelect.options).some(
        (option) => option.value === serviceName
      );

      if (optionExists) {
        serviceSelect.value = serviceName;
      }
    }

    appointmentForm?.removeAttribute("hidden");
    sendOptions?.setAttribute("hidden", "");
    modalOverlay.classList.add("active");
    modalOverlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    setTimeout(() => {
      document.getElementById("clientName")?.focus();
    }, 100);
  };

  const closeModal = () => {
    if (!modalOverlay) return;

    modalOverlay.classList.remove("active");
    modalOverlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");

    appointmentForm?.removeAttribute("hidden");
    sendOptions?.setAttribute("hidden", "");

    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  };

  openModalButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      openModal(button.getAttribute("data-service") || "");
    });
  });

  modalClose?.addEventListener("click", closeModal);

  modalOverlay?.addEventListener("click", (event) => {
    if (event.target === modalOverlay) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modalOverlay?.classList.contains("active")) {
      closeModal();
    }
  });

  // ------------------------------------------------------------
  // Build customer request
  // ------------------------------------------------------------
  const clean = (value) => String(value || "").trim();

  const buildRequestMessage = () => {
    const name = clean(document.getElementById("clientName")?.value);
    const phone = clean(document.getElementById("clientPhone")?.value);
    const vehicle = clean(document.getElementById("vehicleDetails")?.value);
    const service = clean(document.getElementById("serviceType")?.value);
    const preferredTime = clean(document.getElementById("preferredTime")?.value);
    const problem = clean(document.getElementById("problemDescription")?.value);

    const lines = [
      "Hello Quick Fix Auto Repairs,",
      "",
      "I'd like to request a vehicle service.",
      "",
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Vehicle: ${vehicle}`,
      `Service: ${service}`,
      `Preferred date/time: ${preferredTime || "Not specified"}`,
      "",
      "Problem / request:",
      problem || "Not specified",
      "",
      `Location: ${CONTACT.location}`
    ];

    return lines.join("\n");
  };

  const buildEmailSubject = () => {
    const service = clean(serviceSelect?.value) || "Vehicle Service";
    return `Service Request - ${service}`;
  };

  const prepareSendOptions = () => {
    const message = buildRequestMessage();
    const encodedMessage = encodeURIComponent(message);
    const subject = encodeURIComponent(buildEmailSubject());

    const whatsappUrl =
      `https://wa.me/${CONTACT.phoneInternational}?text=${encodedMessage}`;

    const emailUrl =
      `mailto:${CONTACT.email}?subject=${subject}&body=${encodedMessage}`;

    if (whatsappLink) {
      whatsappLink.href = whatsappUrl;
    }

    if (emailLink) {
      emailLink.href = emailUrl;
    }

    appointmentForm?.setAttribute("hidden", "");
    sendOptions?.removeAttribute("hidden");

    sendOptions?.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  };

  // ------------------------------------------------------------
  // Form validation + handoff
  // ------------------------------------------------------------
  appointmentForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!appointmentForm.checkValidity()) {
      appointmentForm.reportValidity();
      return;
    }

    prepareSendOptions();
    showToast("Your request is ready. Choose WhatsApp or email.");
  });

  editRequest?.addEventListener("click", () => {
    sendOptions?.setAttribute("hidden", "");
    appointmentForm?.removeAttribute("hidden");

    document.getElementById("clientName")?.focus();
  });

  // ------------------------------------------------------------
  // Keep external contact actions consistent
  // ------------------------------------------------------------
  document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
    link.setAttribute("href", `mailto:${CONTACT.email}`);
  });

  document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
    link.setAttribute("href", `tel:+${CONTACT.phoneInternational}`);
  });

  // ------------------------------------------------------------
  // Small UX improvement: smooth internal navigation fallback
  // ------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  });
});
