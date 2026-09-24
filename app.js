const roleForm = document.querySelector("#role-form");
const jobSummary = document.querySelector("#job-summary");
const jobResults = document.querySelector("#job-results");
const similarRoles = document.querySelector("#similar-roles");
const resumeOutput = document.querySelector("#resume-output");
const copyResume = document.querySelector("#copy-resume");
const tabButtons = document.querySelectorAll(".tab-button");

const roleFamilies = [
  {
    match: ["data", "analyst", "business intelligence", "bi", "sql", "reporting"],
    roles: [
      ["Data Analyst", "Turns business questions into reports, dashboards, and decision-ready insights."],
      ["Business Intelligence Analyst", "Focuses on KPI reporting, dashboard ownership, and stakeholder analytics."],
      ["Product Analyst", "Studies user behavior, experiments, funnels, and product metrics."],
      ["Operations Analyst", "Improves process, service, and performance metrics across teams."],
      ["Analytics Engineer", "Builds clean datasets, semantic models, and analytics-ready pipelines."]
    ],
    keywords: ["SQL", "Excel", "Power BI", "Tableau", "Python", "data visualization", "KPI reporting", "dashboarding", "data cleaning", "stakeholder communication"]
  },
  {
    match: ["frontend", "front end", "react", "ui", "web developer"],
    roles: [
      ["Frontend Developer", "Builds user-facing web experiences with modern JavaScript frameworks."],
      ["React Developer", "Specializes in React components, state, routing, and front-end architecture."],
      ["UI Engineer", "Bridges product design, interaction details, accessibility, and implementation."],
      ["Web Application Developer", "Creates browser-based tools, dashboards, and customer-facing apps."],
      ["Design Systems Engineer", "Develops reusable components, tokens, and front-end patterns."]
    ],
    keywords: ["JavaScript", "TypeScript", "React", "HTML", "CSS", "accessibility", "responsive design", "REST APIs", "testing", "performance optimization"]
  },
  {
    match: ["backend", "back end", "api", "node", "server", "java", "python developer"],
    roles: [
      ["Backend Developer", "Builds APIs, services, data flows, and business logic."],
      ["Software Engineer", "Solves product and platform problems across application layers."],
      ["API Developer", "Designs, documents, and maintains reliable service interfaces."],
      ["Platform Engineer", "Improves developer workflows, deployment paths, and service infrastructure."],
      ["Cloud Engineer", "Works with cloud services, automation, monitoring, and resilient systems."]
    ],
    keywords: ["APIs", "Node.js", "Python", "Java", "databases", "system design", "cloud services", "Docker", "CI/CD", "observability"]
  },
  {
    match: ["product", "manager", "pm", "owner"],
    roles: [
      ["Product Manager", "Defines product strategy, prioritizes roadmaps, and drives outcomes."],
      ["Associate Product Manager", "Supports discovery, delivery, analytics, and stakeholder alignment."],
      ["Product Owner", "Manages backlog, acceptance criteria, and agile delivery flow."],
      ["Growth Product Manager", "Focuses on acquisition, activation, retention, and experimentation."],
      ["Business Analyst", "Translates business needs into clear requirements and process improvements."]
    ],
    keywords: ["roadmapping", "user research", "stakeholder management", "requirements", "analytics", "experimentation", "go-to-market", "prioritization", "agile", "Jira"]
  },
  {
    match: ["marketing", "digital", "seo", "content", "growth"],
    roles: [
      ["Digital Marketing Specialist", "Runs campaigns across paid, organic, email, and social channels."],
      ["SEO Specialist", "Improves search visibility through technical, content, and keyword strategy."],
      ["Growth Marketer", "Tests acquisition and retention experiments across the funnel."],
      ["Content Strategist", "Plans content systems that attract, educate, and convert audiences."],
      ["Marketing Analyst", "Measures campaign performance and turns data into optimization plans."]
    ],
    keywords: ["SEO", "Google Analytics", "campaign management", "content strategy", "paid media", "email marketing", "conversion rate optimization", "A/B testing", "CRM", "reporting"]
  }
];

const defaultKeywords = ["communication", "problem solving", "documentation", "collaboration", "process improvement", "project delivery", "quality assurance", "customer focus"];

const boards = [
  { name: "LinkedIn", build: ({ role, location }) => `https://www.linkedin.com/jobs/search/?keywords=${enc(role)}&location=${enc(location || "Worldwide")}` },
  { name: "Indeed", build: ({ role, location }) => `https://www.indeed.com/jobs?q=${enc(role)}&l=${enc(location || "Remote")}` },
  { name: "Google Jobs", build: ({ role, location }) => `https://www.google.com/search?q=${enc(`${role} jobs ${location || "worldwide"}`)}` },
  { name: "Wellfound", build: ({ role, location }) => `https://wellfound.com/jobs?query=${enc(role)}&location=${enc(location || "Remote")}` },
  { name: "Remote OK", build: ({ role }) => `https://remoteok.com/remote-${enc(role).replaceAll("%20", "-")}-jobs` },
  { name: "We Work Remotely", build: ({ role }) => `https://weworkremotely.com/remote-jobs/search?term=${enc(role)}` }
];

function enc(value) {
  return encodeURIComponent(value.trim());
}

function normalize(value) {
  return value.toLowerCase().trim();
}

function splitSkills(value) {
  return value
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
}

function getRoleFamily(role, skills) {
  const haystack = `${normalize(role)} ${skills.join(" ")}`.toLowerCase();
  return roleFamilies.find((family) => family.match.some((word) => haystack.includes(word))) || {
    roles: [
      [role, "Your exact target role, searched across global and remote job boards."],
      [`${role} Specialist`, "A specialized version of the target role for focused job descriptions."],
      [`${role} Associate`, "A slightly broader title often used by companies hiring developing talent."],
      [`${role} Consultant`, "A client-facing version of the role across agencies and professional services."],
      [`${role} Coordinator`, "A coordination-heavy version of the role that can fit adjacent skill sets."]
    ],
    keywords: defaultKeywords
  };
}

function renderJobs(role, location, family) {
  const roleTargets = [role, ...family.roles.map(([title]) => title)].filter((value, index, arr) => arr.indexOf(value) === index).slice(0, 5);
  const cards = roleTargets.map((title) => {
    const links = boards.map((board) => `<a href="${board.build({ role: title, location })}" target="_blank" rel="noreferrer">${board.name}</a>`).join("");
    return `
      <article class="job-card">
        <h3>${escapeHtml(title)}</h3>
        <div class="job-meta">${escapeHtml(location || "Global / Remote")} searches across high-signal job sources</div>
        <div class="job-actions">${links}</div>
      </article>
    `;
  });
  jobResults.innerHTML = cards.join("");
  jobSummary.textContent = `Built ${roleTargets.length} search paths for ${role}${location ? ` in ${location}` : " globally"}.`;
}

function renderSimilarRoles(family) {
  similarRoles.innerHTML = family.roles.map(([title, description]) => `
    <article class="role-card">
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(description)}</p>
    </article>
  `).join("");
}

function buildResume({ name, role, seniority, location, skills, experience }, family) {
  const keywords = [...new Set([...skills, ...family.keywords])].slice(0, 14);
  const displayName = name || "Your Name";
  const skillLine = keywords.join(" | ");
  const experienceText = experience || `${seniority} professional with hands-on experience aligned to ${role} responsibilities`;

  return `${displayName}
${role.toUpperCase()}
Location: ${location || "Open to global and remote opportunities"} | Email: your.email@example.com | LinkedIn: linkedin.com/in/your-profile | Portfolio: your-portfolio.com

PROFESSIONAL SUMMARY
${experienceText}. Skilled at applying ${keywords.slice(0, 6).join(", ")} to solve business problems, improve delivery quality, and communicate results clearly to stakeholders. Seeking ${role} opportunities where analytical thinking, execution discipline, and continuous learning are valued.

CORE SKILLS
${skillLine}

PROFESSIONAL EXPERIENCE
${role} / Relevant Experience
Company or Project Name | Month Year - Present
- Delivered role-relevant work using ${keywords.slice(0, 4).join(", ")} to improve measurable outcomes for users, teams, or business stakeholders.
- Built, maintained, or improved workflows, reports, systems, or deliverables aligned with ${role} requirements.
- Collaborated with cross-functional partners to gather requirements, clarify priorities, document decisions, and deliver high-quality outputs.
- Used data, feedback, and quality checks to identify issues, recommend improvements, and track progress against goals.

Selected Project
Project Name | Month Year
- Created a practical solution related to ${role}, applying ${keywords.slice(0, 5).join(", ")} from planning through delivery.
- Documented approach, assumptions, and results so hiring teams can quickly understand scope, tools, and impact.

EDUCATION
Degree or Certification
Institution Name | Year

CERTIFICATIONS
- Add certifications relevant to ${role}, such as tool, cloud, analytics, agile, or domain credentials.

ATS TUNING CHECKLIST
- Keep this resume as plain text or a simple DOCX/PDF with standard headings.
- Mirror important keywords from the job description when they accurately match your experience.
- Replace generic bullets with numbers: revenue, cost, time saved, accuracy, users, volume, or turnaround time.
- Use exact tool names from your real experience and remove skills you cannot discuss confidently.`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

roleForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(roleForm);
  const role = formData.get("role").toString().trim();
  const location = formData.get("location").toString().trim();
  const seniority = formData.get("seniority").toString();
  const skills = splitSkills(formData.get("skills").toString());
  const name = formData.get("name").toString().trim();
  const experience = formData.get("experience").toString().trim();
  const family = getRoleFamily(role, skills);

  renderJobs(role, location, family);
  renderSimilarRoles(family);
  resumeOutput.textContent = buildResume({ name, role, seniority, location, skills, experience }, family);
});

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.tab;
    tabButtons.forEach((item) => item.classList.toggle("active", item === button));
    document.querySelectorAll(".tab-view").forEach((view) => view.classList.toggle("active", view.id === `${target}-view`));
  });
});

copyResume.addEventListener("click", async () => {
  await navigator.clipboard.writeText(resumeOutput.textContent);
  copyResume.textContent = "Copied";
  setTimeout(() => {
    copyResume.textContent = "Copy resume";
  }, 1400);
});
