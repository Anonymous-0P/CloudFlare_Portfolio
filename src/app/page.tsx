import { ArrowDown, ArrowUpRight, ArrowRight } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { MotionShell } from "@/components/motion-shell";
import { HeroCore } from "@/components/hero-core";
import { ProjectVisual } from "@/components/project-visual";
import { Engineering } from "@/components/engineering";
import { SecuritySignal } from "@/components/security";
import {
  certifications,
  profile,
  projects,
  technologies,
} from "@/data/portfolio";
export default function Home() {
  return (
    <>
      <Navigation />
      <MotionShell>
      <main id="main">
        <section className="hero">
          <div className="hero-kicker hero-reveal">
            <span className="eyebrow">SOFTWARE DEVELOPER / BENGALURU, IN</span>
            <span className="eyebrow edition">
              INDEPENDENT MIND. SYSTEMS THINKING.
            </span>
          </div>
          <div className="hero-content">
            <h1>
              <span className="hero-line">
                <span>BUILDING</span>
              </span>
              <span className="hero-line">
                <span>WHAT HAPPENS</span>
              </span>
              <span className="hero-line">
                <span>BEHIND THE</span>
              </span>
              <span className="hero-line accent-line">
                <span>
                  SCREEN<span className="period">.</span>
                </span>
              </span>
            </h1>
          <div className="hero-bottom hero-reveal">
            <div className="hero-intro">
              <span className="tiny-square" />
              <p>
                I’m Prakash Karekar. I build dependable backends, connected
                applications, and production-ready digital experiences.
              </p>
            </div>
            <a className="text-link" href="#work">
              Explore selected work{" "}
              <span className="round-arrow">
                <ArrowDown size={19} />
              </span>
            </a>
            <a className="subtle-link" href="#contact">
              Get in touch <ArrowUpRight size={17} />
            </a>
          </div>
            <HeroCore />
          </div>
          <div className="hero-footer eyebrow">
            <span>ENGINEERED TO WORK.</span>
            <span>SCROLL TO EXPLORE ↓</span>
            <span>01 — 10</span>
          </div>
        </section>
        <section className="statement section-pad" id="about">
          <div className="section-heading">
            <span className="eyebrow">02 / THE APPROACH</span>
            <span className="eyebrow">COMPLEX SYSTEMS. CLEAR EXPERIENCES.</span>
          </div>
          <h2 data-reveal>
            I don’t just build interfaces.
            <br />I build the systems
            <br />
            that make them <em>work.</em>
          </h2>
          <div className="pillars">
            {[
              [
                "Backend systems",
                "Reliable services. Clear APIs. Logic that supports real operations.",
              ],
              [
                "Connected applications",
                "Web and mobile, connected by thoughtful interfaces and dependable data flows.",
              ],
              [
                "Production engineering",
                "Deployed, monitored, maintained. Because shipping is the beginning.",
              ],
            ].map(([title, body], i) => (
              <div className="pillar" data-reveal key={title}>
                <span className="eyebrow">0{i + 1} /</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="work section-pad" id="work">
          <div className="section-heading">
            <span className="eyebrow">03 / SELECTED WORK</span>
            <span className="eyebrow">BUILT FOR THE REAL WORLD</span>
          </div>
          <div className="work-heading">
            <h2 data-reveal>
              Less talk.
              <br />
              <em>More shipped.</em>
            </h2>
            <p>
              From the API to the final deployment.
              <br />A selection of systems I’ve helped bring to life.
            </p>
          </div>
          <div className="projects">
            {projects.map((p, i) => (
              <article className="project" key={p.slug}>
                <div className="project-title">
                  <span className="project-number">0{i + 1}</span>
                  <h3>
                    <a href={`/work/${p.slug}`}>{p.name}</a>
                  </h3>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-external"
                    aria-label={`Visit ${p.name} (opens in new tab)`}
                  >
                    <ArrowUpRight />
                  </a>
                </div>
                <div className="project-body">
                  <div className="project-copy" data-reveal>
                    <span className="eyebrow">{p.category}</span>
                    <h4>{p.summary}</h4>
                    <p>{p.description}</p>
                    <span className="contribution-label">MY CONTRIBUTION</span>
                    <p className="contribution">{p.contribution}</p>
                    <div className="stack">
                      {p.stack.map((s) => (
                        <span key={s}>{s}</span>
                      ))}
                    </div>
                    <a className="text-link case-link" href={`/work/${p.slug}`}>
                      Explore the project <ArrowUpRight size={18} />
                    </a>
                  </div>
                  <ProjectVisual index={i} flow={p.flow} />
                </div>
              </article>
            ))}
          </div>
        </section>
        <Engineering />
        <section className="experience section-pad" id="experience">
          <div className="section-heading">
            <span className="eyebrow">05 / EXPERIENCE</span>
            <span className="eyebrow">LEARNING BY BUILDING</span>
          </div>
          <div className="experience-layout">
            <h2 data-reveal>
              In practice.
              <br />
              <em>In production.</em>
            </h2>
            <div className="timeline">
              <div className="timeline-line" />
              <article data-reveal>
                <span className="eyebrow">APR 2025 — PRESENT</span>
                <h3>Theta Dynamics Pvt. Ltd.</h3>
                <span className="role">Software Developer</span>
                <p>
                  Developing and maintaining Django and Node.js backend services
                  for production client applications.
                </p>
                <ul>
                  <li>
                    Built Rotra Logistics APIs and integrated a Flutter mobile
                    application.
                  </li>
                  <li>
                    Designed and deployed the Merlin Hydraulics business
                    website.
                  </li>
                  <li>
                    Managed Linux VPS deployments, Nginx/Gunicorn, environments,
                    logs, and production troubleshooting.
                  </li>
                  <li>
                    Improved deployment workflows through process documentation
                    and structured debugging.
                  </li>
                </ul>
              </article>
              <article data-reveal>
                <span className="eyebrow">SEP 2024 — MAR 2025</span>
                <h3>Eyesec Cybersecurity Solutions</h3>
                <span className="role">Cybersecurity Intern</span>
                <p>
                  Built practical security tooling, from compromised-credential
                  lookups to network-level analysis.
                </p>
                <ul>
                  <li>
                    Developed breach detection tooling supporting 14M+
                    compromised password records.
                  </li>
                  <li>
                    Built a Python entropy-based password strength engine.
                  </li>
                  <li>
                    Integrated Nmap and Wireshark for vulnerability assessment.
                  </li>
                  <li>
                    Reported approximately 60% less audit effort and 30% better
                    compliance reporting accuracy.
                  </li>
                </ul>
              </article>
            </div>
          </div>
        </section>
        <section className="security section-pad">
          <div className="section-heading">
            <span className="eyebrow">06 / SECURITY ENGINEERING</span>
            <span className="eyebrow">CONSIDERED FROM THE START</span>
          </div>
          <div className="security-layout">
            <div>
              <h2 data-reveal>
                Security is part
                <br />
                of the <em>architecture.</em>
              </h2>
              <p className="measure muted">
                A working system should also be a considered one. My
                cybersecurity experience connects credential analysis, breach
                detection, and network assessment.
              </p>
              <div className="security-notes">
                <span>01 / Entropy-based analysis</span>
                <span>02 / Breach detection at 14M+ records</span>
                <span>03 / Nmap & Wireshark integration</span>
              </div>
            </div>
            <SecuritySignal />
          </div>
        </section>
        <section className="impact section-pad">
          <div className="section-heading">
            <span className="eyebrow">07 / IMPACT & LEADERSHIP</span>
            <span className="eyebrow">BEYOND THE CODEBASE</span>
          </div>
          <div className="metrics">
            {[
              ["10,000+", "Certificates generated", "CertifyPro platform"],
              ["500+", "Clients served", "CertifyPro platform"],
              [
                "14M+",
                "Password records supported",
                "Eyesec breach detection tooling",
              ],
              [
                "12+",
                "Technical workshops delivered",
                "Across multiple Indian states",
              ],
            ].map(([n, label, context]) => (
              <div key={n} data-reveal>
                <strong><span className="sr-only">{n}</span><span data-count={n} aria-hidden="true">{n}</span></strong>
                <p>{label}</p>
                <span>{context}</span>
              </div>
            ))}
          </div>
          <div className="leadership">
            <h3>
              Building with people.
              <br />
              <em>Sharing what I learn.</em>
            </h3>
            <div>
              {[
                [
                  "Tech Team Lead",
                  "BelPy 2024 International Python Conference",
                ],
                ["Technical Head", "AITM ACM Student Chapter"],
                ["Karnataka Regional Student Coordinator", "ACM India Council"],
                [
                  "Invited technical talks",
                  "Bagalkot Engineering College · HSIT Nidasoshi",
                ],
              ].map(([role, org]) => (
                <div className="leadership-row" key={role}>
                  <span>{role}</span>
                  <span>{org}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="tools section-pad">
          <div className="section-heading">
            <span className="eyebrow">08 / TECHNICAL INDEX</span>
            <span className="eyebrow">THE RIGHT TOOL. THE RIGHT REASON.</span>
          </div>
          <div className="tools-layout">
            <h2 data-reveal>
              A considered
              <br />
              <em>toolkit.</em>
            </h2>
            <div className="tech-index">
              {technologies.map(([category, ...items], i) => (
                <div className="tech-row" key={category}>
                  <span className="eyebrow">
                    0{i + 1} / {category}
                  </span>
                  <p>
                    {items.map((tool, j) => (
                      <span key={tool}>
                        {j > 0 && <b> / </b>}
                        {tool === "Django" ||
                        tool === "Django REST Framework" ? (
                          <a
                            href={
                              tool === "Django"
                                ? "/work/certifypro/"
                                : "/work/rotra-logistics/"
                            }
                            title="See related project"
                          >
                            {tool}
                          </a>
                        ) : (
                          tool
                        )}
                      </span>
                    ))}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="education section-pad">
          <div className="section-heading">
            <span className="eyebrow">09 / FOUNDATIONS</span>
            <span className="eyebrow">ALWAYS A STUDENT</span>
          </div>
          <div className="education-layout" data-reveal>
            <div>
              <span className="eyebrow">EDUCATION</span>
              <h3>
                B.E. Computer Science
                <br />& Engineering
              </h3>
              <p>Angadi Institute of Technology and Management</p>
              <span className="grade">
                8.7 <span>/ 10 CGPA</span>
              </span>
            </div>
            <div>
              <span className="eyebrow">
                CERTIFICATIONS / AS LISTED IN RESUME
              </span>
              <ul className="certifications">
                {certifications.map((c) => (
                  <li key={c}>
                    {c}
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
        <footer className="contact section-pad" id="contact">
          <div className="section-heading">
            <span className="eyebrow">10 / START A CONVERSATION</span>
            <span className="signature-mark" aria-hidden="true">
              ◇
            </span>
          </div>
          <h2 data-reveal>
            Good software
            <br />
            is built with <em>intention.</em>
          </h2>
          <div className="contact-bottom">
            <p>
              Have a system to build, improve,
              <br />
              or bring into production? Let’s connect.
            </p>
            <a className="contact-cta" href={`mailto:${profile.email}`}>
              Email Prakash <ArrowUpRight />
            </a>
            <a
              className="text-link"
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn <ArrowUpRight size={18} />
            </a>
          </div>
          <div className="footer-bar eyebrow">
            <span>© {new Date().getFullYear()} PRAKASH KAREKAR</span>
            <span>BENGALURU, INDIA</span>
            <a href="#main">
              BACK TO TOP <ArrowRight size={12} />
            </a>
          </div>
        </footer>
      </main>
      </MotionShell>
    </>
  );
}
