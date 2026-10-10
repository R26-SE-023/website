const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

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

milestoneSelect.addEventListener("change", (event) => {
  const item = milestones[event.target.value];
  milestoneDate.textContent = item.date;
  milestoneTitle.textContent = item.title;
  milestoneDescription.textContent = item.description;
  milestoneMarks.textContent = item.marks;
});

document.querySelector(".contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const name = form.get("name") || "Website visitor";
  const email = form.get("email") || "";
  const message = form.get("message") || "";
  const subject = encodeURIComponent("ResearchLens inquiry");
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);

  window.location.href = `mailto:researchlens.project@example.com?subject=${subject}&body=${body}`;
});
