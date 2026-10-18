const navToggle = document.querySelector(".nav-toggle");

document.querySelectorAll(".resource-grid a").forEach((link) => {
  const isVideo = Boolean(link.closest("#videos"));
  const isPdf = new URL(link.href).pathname.toLowerCase().endsWith(".pdf");
  if (!isVideo && !isPdf) return;

  link.classList.add("resource-link");
  link.rel = "noopener noreferrer";
  const action = document.createElement("span");
  action.className = "resource-action";
  const icon = document.createElement("i");
  icon.setAttribute("data-lucide", isVideo ? "play" : "file-text");
  icon.setAttribute("aria-hidden", "true");
  action.append(icon, document.createTextNode(isVideo ? "Play Video" : "View PDF"));
  action.title = isVideo ? "Play video in a new tab" : "View PDF in a new tab";
  link.append(action);
});
window.lucide?.createIcons();
const siteNav = document.querySelector(".site-nav");

navToggle.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});
/* Dark mode toggle */
const themeToggle = document.querySelector(".theme-toggle");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    const isDark = document.body.classList.contains("dark-mode");
    themeToggle.textContent = isDark ? "Light Mode" : "Dark Mode";
  });
}

siteNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    siteNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

const milestones = {
  proposal: {
    date: "To be updated",
    title: "Project Proposal",
    description: "Initial research scope, problem definition, objectives, methodology, and project plan.",
    marks: "Marks allocation: To be updated",
  },
  pp1: {
    date: "To be updated",
    title: "Progress Presentation 1",
    description: "Early implementation, literature progress, first module demonstrations, and feedback alignment.",
    marks: "Marks allocation: To be updated",
  },
  pp2: {
    date: "To be updated",
    title: "Progress Presentation 2",
    description: "Integrated module progress, evaluation updates, deployment readiness, and remaining work.",
    marks: "Marks allocation: To be updated",
  },
  final: {
    date: "To be updated",
    title: "Final Assessment",
    description: "Complete platform demonstration, documentation review, final testing, and research contribution evaluation.",
    marks: "Marks allocation: To be updated",
  },
  viva: {
    date: "To be updated",
    title: "Viva",
    description: "Individual contribution defense, technical explanation, research justification, and implementation review.",
    marks: "Marks allocation: To be updated",
  },
};

const milestoneSelect = document.querySelector("#milestoneSelect");
const milestoneDate = document.querySelector("#milestoneDate");
const milestoneTitle = document.querySelector("#milestoneTitle");
const milestoneDescription = document.querySelector("#milestoneDescription");
const milestoneMarks = document.querySelector("#milestoneMarks");

if (milestoneSelect && milestoneDate && milestoneTitle && milestoneDescription && milestoneMarks) {
  milestoneSelect.addEventListener("change", (event) => {
    const item = milestones[event.target.value];
    milestoneDate.textContent = item.date;
    milestoneTitle.textContent = item.title;
    milestoneDescription.textContent = item.description;
    milestoneMarks.textContent = item.marks;
  });
}

document.querySelector(".contact-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const button = form.querySelector("button[type='submit']");
  const status = form.querySelector(".contact-status");
  if (button.disabled || !form.reportValidity()) return;

  const fields = new FormData(form);
  button.disabled = true;
  button.textContent = "Sending...";
  form.setAttribute("aria-busy", "true");
  status.textContent = "";
  status.removeAttribute("data-state");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 90000);

  try {
    const response = await fetch(form.dataset.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
      status.textContent = result.detail || "We could not send your message. Please try again later.";
      return;
    }
    form.reset();
    status.dataset.state = "success";
    status.textContent = result.message || "Your message has been sent. Thank you for contacting ResearchLens.";
  } catch (error) {
    status.dataset.state = "error";
    status.textContent = error.name === "AbortError"
      ? "Sending timed out. Delivery is unconfirmed; please wait before trying again."
      : "Could not reach the team. Check your connection and try again.";
  } finally {
    clearTimeout(timeout);
    button.disabled = false;
    button.textContent = "Send Message";
    form.removeAttribute("aria-busy");
  }
});
