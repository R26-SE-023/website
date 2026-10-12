const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

/* Mobile navigation */
if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* Timeline reveal animation */
const timelineItems = document.querySelectorAll(".timeline-item, .timeline-card");

if (timelineItems.length > 0) {
  if ("IntersectionObserver" in window) {
    const timelineObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            timelineObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
      }
    );

    timelineItems.forEach((item) => {
      timelineObserver.observe(item);
    });
  } else {
    timelineItems.forEach((item) => {
      item.classList.add("is-visible");
    });
  }
}

/* Contact form */
const contactForm = document.querySelector(".contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const button = form.querySelector("button[type='submit']");
    const status = form.querySelector(".contact-status");

    if (!button || !status) return;
    if (button.disabled || !form.reportValidity()) return;

    const endpoint = form.dataset.endpoint;

    if (!endpoint) {
      status.dataset.state = "error";
      status.textContent = "Contact form endpoint is not configured.";
      return;
    }

    const fields = new FormData(form);

    button.disabled = true;
    button.textContent = "Sending...";
    form.setAttribute("aria-busy", "true");
    status.textContent = "";
    status.removeAttribute("data-state");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 90000);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "omit",
        signal: controller.signal,
        body: JSON.stringify({
          recipient: fields.get("recipient"),
          name: fields.get("name"),
          email: fields.get("email"),
          message: fields.get("message"),
          company: fields.get("company") || "",
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        status.dataset.state = "error";
        status.textContent =
          result.detail || "We could not send your message. Please try again later.";
        return;
      }

      form.reset();
      status.dataset.state = "success";
      status.textContent =
        result.message || "Your message has been sent. Thank you for contacting ResearchLens.";
    } catch (error) {
      status.dataset.state = "error";
      status.textContent =
        error.name === "AbortError"
          ? "Sending timed out. Delivery is unconfirmed; please wait before trying again."
          : "Could not reach the team. Check your connection and try again.";
    } finally {
      clearTimeout(timeout);
      button.disabled = false;
      button.textContent = "Send Message";
      form.removeAttribute("aria-busy");
    }
  });
}
