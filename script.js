const navToggle = document.querySelector(".nav-toggle");

document.querySelectorAll(".resource-grid a, .resource-grid button[data-video-id]").forEach((link) => {
  const isVideo = link.hasAttribute("data-video-id");
  const isPdf = link.tagName === "A" && new URL(link.href).pathname.toLowerCase().endsWith(".pdf");
  if (!isVideo && !isPdf) return;

  link.classList.add("resource-link");
  if (link.tagName === "A") link.rel = "noopener noreferrer";
  const action = document.createElement("span");
  action.className = "resource-action";
  const icon = document.createElement("i");
  icon.setAttribute("data-lucide", isVideo ? "play" : "file-text");
  icon.setAttribute("aria-hidden", "true");
  action.append(icon, document.createTextNode(isVideo ? "Play Video" : "View PDF"));
  action.title = isVideo ? "Play video here" : "View PDF in a new tab";
  link.append(action);
});
window.lucide?.createIcons();

const videoDialog = document.querySelector(".video-dialog");
const videoPlayer = videoDialog.querySelector(".video-dialog-player");
const videoTitle = videoDialog.querySelector("#video-dialog-title");

document.querySelectorAll(".resource-grid button[data-video-id]").forEach((link) => {
  link.addEventListener("click", (event) => {
    videoTitle.textContent = link.dataset.videoTitle;
    if (!/^https?:$/.test(window.location.protocol)) {
      const notice = document.createElement("p");
      notice.className = "video-dialog-notice";
      notice.textContent = "Open this website through its published address or a local HTTP server to play videos.";
      videoPlayer.replaceChildren(notice);
      videoDialog.showModal();
      return;
    }
    const frame = document.createElement("iframe");
    const embed = new URL(`https://www.youtube.com/embed/${link.dataset.videoId}`);
    embed.searchParams.set("autoplay", "1");
    embed.searchParams.set("rel", "0");
    embed.searchParams.set("origin", window.location.origin);
    frame.src = embed.href;
    frame.title = link.dataset.videoTitle;
    frame.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share";
    frame.allowFullscreen = true;
    frame.referrerPolicy = "origin";
    videoPlayer.replaceChildren(frame);
    videoDialog.showModal();
  });
});

videoDialog.querySelector(".video-dialog-close").addEventListener("click", () => videoDialog.close());
videoDialog.addEventListener("click", (event) => {
  if (event.target === videoDialog) videoDialog.close();
});
videoDialog.addEventListener("close", () => {
  videoPlayer.replaceChildren();
  videoTitle.textContent = "";
});

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
