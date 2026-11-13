"use client";

import { useEffect, useRef, useState } from "react";

const sectionNames = { home: "Intro", about: "Story", skills: "Skills", projects: "Work", contact: "Contact" };

const skills = [
  { title: "Languages", items: "C · C++ · Python · JavaScript · SQL" },
  { title: "Frontend", items: "React · Next.js · Tailwind CSS · HTML5 · CSS3" },
  { title: "Backend & Auth", items: "Node.js · Express · REST APIs · Auth.js · OAuth 2.0 · bcrypt" },
  { title: "Data & Databases", items: "PostgreSQL · MySQL · MongoDB · Mongoose · Prisma" },
  { title: "Machine Learning", items: "Scikit-learn · Pandas · NumPy · SHAP · Plotly · Streamlit · Gemini API" },
  { title: "Tools", items: "Git · GitHub · Postman · MongoDB Compass · Vercel · Jupyter" },
];

function ArrowIcon({ diagonal = false }) {
  return diagonal ? (
    <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 15 15 5M6 5h9v9" /></svg>
  ) : (
    <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 10h13m-5-5 5 5-5 5" /></svg>
  );
}

function Mark({ size = "small" }) {
  return <span className={`mark mark--${size}`} aria-hidden="true"><i /><i /><i /><i /></span>;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const islandRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const closeOnOutside = (event) => {
      if (!islandRef.current?.contains(event.target)) setMenuOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  useEffect(() => {
    let frame = 0;
    const updateProgress = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        setScrollProgress(scrollable > 0 ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)) : 0);
        frame = 0;
      });
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const section = document.getElementById("projects");
    const pin = section?.querySelector(".project-pin");
    const track = section?.querySelector(".project-track");
    const progress = section?.querySelector(".project-progress i");
    const current = section?.querySelector(".project-count-current");
    const panels = track?.querySelectorAll(".project-card");
    if (!section || !pin || !track) return undefined;
    const viewport = window.matchMedia("(min-width: 820px)");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let enabled = false;
    const getTravel = () => Math.max(0, track.scrollWidth - window.innerWidth);
    const update = () => {
      const travel = getTravel();
      const distance = Math.max(1, section.offsetHeight - pin.offsetHeight);
      const start = window.scrollY + section.getBoundingClientRect().top;
      const amount = Math.min(1, Math.max(0, (window.scrollY - start) / distance));
      track.style.transform = `translate3d(${-amount * travel}px, 0, 0)`;
      if (progress) progress.style.transform = `scaleX(${amount})`;
      if (current && panels) current.textContent = String(Math.min(panels.length, Math.floor(amount * panels.length) + 1)).padStart(2, "0");
    };
    const measure = () => {
      section.style.height = `${pin.offsetHeight + getTravel()}px`;
      update();
    };
    const start = () => {
      if (enabled) { measure(); return; }
      enabled = true;
      section.classList.add("project-reel--pinned");
      window.addEventListener("scroll", update, { passive: true });
      measure();
    };
    const stop = () => {
      if (!enabled) return;
      enabled = false;
      window.removeEventListener("scroll", update);
      section.classList.remove("project-reel--pinned");
      section.style.height = "";
      track.style.transform = "";
      if (progress) progress.style.transform = "scaleX(0)";
      if (current) current.textContent = "01";
    };
    const sync = () => {
      if (viewport.matches && !motion.matches) start();
      else stop();
    };
    sync();
    window.addEventListener("resize", sync);
    viewport.addEventListener("change", sync);
    motion.addEventListener("change", sync);
    return () => {
      window.removeEventListener("resize", sync);
      viewport.removeEventListener("change", sync);
      motion.removeEventListener("change", sync);
      stop();
    };
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = document.querySelectorAll("[data-reveal]");
    const sections = document.querySelectorAll("main section[id], header[id]");
    const sectionObserver = "IntersectionObserver" in window ? new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      }),
      { rootMargin: "-30% 0px -60% 0px" },
    ) : null;
    if (sectionObserver) sections.forEach((section) => sectionObserver.observe(section));

    if (reduceMotion || !("IntersectionObserver" in window)) {
      targets.forEach((target) => target.classList.add("is-visible"));
      return () => sectionObserver?.disconnect();
    }
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.12, rootMargin: "0px 0px -36px 0px" },
    );
    targets.forEach((target) => observer.observe(target));
    document.documentElement.classList.add("reveal-enabled");
    return () => { observer.disconnect(); sectionObserver?.disconnect(); };
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const subject = encodeURIComponent(`Portfolio message from ${values.get("name")}`);
    const body = encodeURIComponent(`${values.get("message")}\n\nFrom: ${values.get("name")} (${values.get("email")})`);
    window.location.href = `mailto:guptaujjwalunspcd@gmail.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  }

  function trackPointerGlow(event) {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--pointer-x", `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty("--pointer-y", `${event.clientY - bounds.top}px`);
  }

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="site-shell">
        <nav ref={islandRef} className={`island-nav ${menuOpen ? "island-nav--open" : ""}`} aria-label="Main navigation">
          <button className="island-trigger" type="button" aria-expanded={menuOpen} aria-controls="island-menu" onClick={() => setMenuOpen(!menuOpen)}>
            <span className="island-dot" aria-hidden="true" />
            <span className="island-name">Ujjwal Gupta</span>
            <span className="island-section">{sectionNames[activeSection] || "Intro"}</span>
            <span className="island-page-progress" aria-hidden="true"><i style={{ transform: `scaleX(${scrollProgress / 100})` }} /></span>
          </button>
          <div className="island-menu" id="island-menu" aria-hidden={!menuOpen} inert={!menuOpen}>
            <div className="island-menu-inner">
              {[ ["Work", "projects"], ["Story", "about"], ["Toolkit", "skills"], ["Contact", "contact"] ].map(([label, id], index) => (
                <a key={id} href={`#${id}`} aria-current={activeSection === id ? "location" : undefined} onClick={() => setMenuOpen(false)}><span>0{index + 1}</span>{label}</a>
              ))}
              <a className="island-resume" href="/Ujjwal-Gupta-Resume.pdf" target="_blank" rel="noreferrer">Resume <ArrowIcon diagonal /></a>
            </div>
          </div>
        </nav>

        <main id="main">
          <header className="hero" id="home" onPointerMove={trackPointerGlow}>
            <div className="hero-orbit hero-orbit--one" aria-hidden="true" /><div className="hero-orbit hero-orbit--two" aria-hidden="true" />
            <div className="hero-grid" aria-hidden="true" />
            <div className="hero-content">
              <p className="eyebrow hero-eyebrow" data-reveal><span className="status-dot" /> COMPUTER SCIENCE <span className="eyebrow-divider">/</span> FULL-STACK <span className="eyebrow-divider">/</span> AI + ML</p>
              <h1 data-reveal>Code in<br /><span className="headline-accent">session.</span></h1>
              <div className="hero-bottom" data-reveal>
                <p>Third-year CSE student at Thapar, building full-stack products and applied machine learning projects.</p>
                <a className="round-link" href="#projects" aria-label="Explore selected work"><ArrowIcon /></a>
              </div>
              <div className="hero-index" aria-hidden="true"><span>PORTFOLIO</span><span>2026 — PRESENT</span></div>
            </div>
            <div className="hero-side-note" aria-hidden="true">IDEAS × SOFTWARE × IMPACT</div>
          </header>

          <div className="ticker" aria-label="Exploring ideas, building with intent, learning every day"><div className="ticker-track">
            {[0, 1].map((copy) => <span className="ticker-line" key={copy} aria-hidden={copy === 1}><span>EXPLORE THE POSSIBLE</span><b>✳</b><span>BUILD WITH INTENT</span><b>✳</b><span>LEARN SOMETHING NEW</span><b>✳</b></span>)}
          </div></div>

          <section className="section about-section" id="about">
            <div className="section-label" data-reveal><span>01 / ABOUT</span><span className="label-rule" /></div>
            <div className="about-layout">
              <h2 className="section-title" data-reveal>A little about<br />how I <span className="serif-accent">think.</span></h2>
              <div className="about-copy" data-reveal>
                <p className="about-lede">I am Ujjwal, a third-year Computer Science Engineering student at Thapar Institute of Engineering and Technology (CGPA 8.04).</p>
                <p>I build full-stack web apps and machine learning projects, from an AI-powered learning platform to an explainable sepsis prediction pipeline. My toolkit spans React and Next.js, backend APIs and databases, and Python-based data science. I completed Class XII (Science, CBSE) at Pinewood School in Saharanpur.</p>
                <p>I have solved 115+ problems on LeetCode and am looking for a software development internship.</p>
                <a className="text-link" href="#contact">Get in touch <ArrowIcon /></a>
              </div>
            </div>
            <div className="story-pair" data-reveal>
              <article className="story-card" onPointerMove={trackPointerGlow}><span className="story-index">01 / BUILD</span><h3>Useful by design.</h3><p>Full-stack products that connect people, simplify complex tasks, and make room for better learning.</p><span className="story-mark">PRODUCT ENGINEERING</span></article>
              <article className="story-card" onPointerMove={trackPointerGlow}><span className="story-index">02 / INVESTIGATE</span><h3>Careful with the data.</h3><p>Machine learning work grounded in sound evaluation, transparent explanations, and real-world constraints.</p><span className="story-mark">APPLIED AI & ML</span></article>
            </div>
            <div className="about-foot" data-reveal><span>THAPAR INSTITUTE · B.E. COMPUTER SCIENCE ENGINEERING</span><span>CGPA 8.04 · 2024-2028</span></div>
          </section>

          <section className="skills-section" id="skills">
            <div className="skills-inner">
              <div className="section-label section-label--light" data-reveal><span>02 / TOOLKIT</span><span className="label-rule" /></div>
              <div className="skills-layout">
                <div><h2 className="section-title section-title--light" data-reveal>My technical<br /><span className="serif-accent">toolkit.</span></h2><p className="skills-intro" data-reveal>Languages, full-stack tools, databases, and machine learning libraries.</p></div>
                <div className="skill-list" data-reveal>{skills.map((skill, index) => <article className="skill-row" key={skill.title} onPointerMove={trackPointerGlow}><span className="skill-number">0{index + 1}</span><h3>{skill.title}</h3><p>{skill.items}</p><Mark /></article>)}</div>
              </div>
              <p className="skills-note" data-reveal><span>↗</span> CORE STRENGTHS <b>DATA STRUCTURES & ALGORITHMS</b><i>PROBLEM SOLVING</i><i>MACHINE LEARNING</i></p>
            </div>
          </section>

          <section className="project-reel" id="projects">
            <div className="project-pin">
              <div className="project-reel-head">
                <div><div className="section-label" data-reveal><span>03 / SELECTED WORK</span><span className="label-rule" /></div><h2 className="project-reel-title">Selected work</h2><p>Three projects. Product systems, healthcare data, and infrastructure risk.</p></div>
                <p className="project-count"><span className="project-count-current">01</span> / 03</p>
              </div>
              <div className="project-track">
            <article className="project-card" data-reveal onPointerMove={trackPointerGlow}>
              <div className="project-visual project-visual--browser" aria-label="EduNexa learning platform dashboard illustration"><div className="browser-frame"><div className="browser-top"><span /><span /><span /><i>edunexa</i><b>↗</b></div><div className="browser-content"><span className="browser-kicker">AI-POWERED LEARNING</span><div className="browser-heading">Learn<br /><em>together.</em></div><div className="browser-line" /><div className="browser-footer">STUDENTS · TEACHERS · PARENTS <span>✳</span></div></div></div><div className="visual-stamp">01<br />NEXT.JS</div></div>
              <div className="project-details"><div className="project-topline"><span>01 — FULL-STACK · AI</span><span>NEXT.JS · POSTGRESQL · GEMINI</span></div><div className="project-description"><h3>EduNexa:<br />learning, connected.</h3><div><p>An AI-powered learning platform with student, teacher, parent, and admin roles. Includes Google or email sign-in, verified role requests, teacher-reviewed AI quiz generation, assignments and feedback, student activity tracking, parent-linked progress, and an AI doubt solver.</p><div className="project-actions"><a href="https://edu-nexa-nine.vercel.app/" target="_blank" rel="noreferrer" className="text-link">Live demo <ArrowIcon diagonal /></a><a href="https://github.com/ujjwalgupta-0/EduNexa" target="_blank" rel="noreferrer" className="text-link">View source <ArrowIcon diagonal /></a></div></div></div></div>
            </article>
            <article className="project-card" data-reveal onPointerMove={trackPointerGlow}>
              <div className="project-visual project-visual--bank" aria-label="SepsiGuard AI clinical prediction dashboard illustration"><div className="bank-screen"><div className="bank-header"><span>SEPSIGUARD AI</span><span>PYTHON / ML</span></div><div className="bank-ascii">546K HOURLY ICU RECORDS<br />14K PATIENTS · MISSING DATA<br />TRAIN-ONLY PREPROCESSING<br />PATIENT-LEVEL DATA SPLIT<br />RECALL · AVERAGE PRECISION<br />AUROC · SHAP EXPLANATIONS<br /><span className="terminal-prompt">PREDICTION WITH CONTEXT_</span></div></div><div className="visual-stamp visual-stamp--orange">02<br />ML</div></div>
              <div className="project-details"><div className="project-topline"><span>02 — MACHINE LEARNING · HEALTHCARE</span><span>PYTHON · SCIKIT-LEARN · SHAP</span></div><div className="project-description"><h3>SepsiGuard AI:<br />predictions with context.</h3><div><p>A missingness-aware sepsis prediction pipeline using about 546K hourly ICU records from 14K patients. Preprocessing is fit on training data only with patient-level splits; current model comparisons use a 1,000-patient subset. Tests missingness, handles rare positives with recall, average precision, and AUROC, and explains features with SHAP. Includes a Streamlit dashboard and technical report.</p><div className="project-actions"><span>Streamlit dashboard · technical report</span></div></div></div></div>
            </article>
            <article className="project-card" data-reveal onPointerMove={trackPointerGlow}>
              <div className="project-visual project-visual--browser" aria-label="NIRMAN AI infrastructure risk dashboard illustration"><div className="browser-frame"><div className="browser-top"><span /><span /><span /><i>nirman.gov</i><b>↗</b></div><div className="browser-content"><span className="browser-kicker">INFRASTRUCTURE RISK FORECASTING</span><div className="browser-heading">See risk<br /><em>earlier.</em></div><div className="browser-line" /><div className="browser-footer">6 & 12 MONTH FORECASTS <span>✳</span></div></div></div><div className="visual-stamp">03<br />AI</div></div>
              <div className="project-details"><div className="project-topline"><span>03 — SMART INDIA HACKATHON · INTERNAL ROUND</span><span>PYTHON · SCIKIT-LEARN · NEXT.JS</span></div><div className="project-description"><h3>NIRMAN AI:<br />forecasting project risk.</h3><div><p>Built solo on a synthetic dataset of 125 infrastructure projects: compared and tuned 13 models to estimate 6- and 12-month delay and cost-overrun risks. A Next.js dashboard shows ranked risk bands, early warnings, sector views, project pages, and a what-if simulator; deployed on Vercel.</p><div className="project-actions"><a href="https://nirman-gov.vercel.app/dashboard" target="_blank" rel="noreferrer" className="text-link">Live demo <ArrowIcon diagonal /></a><a href="https://github.com/ujjwalgupta-0/NIRMAN.gov/" target="_blank" rel="noreferrer" className="text-link">View source <ArrowIcon diagonal /></a></div></div></div></div>
            </article>
              </div>
              <div className="project-progress" aria-hidden="true"><i /></div>
              <div className="projects-end" data-reveal><span>115+ LEETCODE PROBLEMS SOLVED</span><a href="https://leetcode.com/u/UJJWAL_GUPTA1/" target="_blank" rel="noreferrer">VIEW PROFILE <ArrowIcon diagonal /></a></div>
            </div>
          </section>

          <section className="contact-section" id="contact">
            <div className="contact-inner">
              <div className="section-label section-label--light" data-reveal><span>04 / SAY HELLO</span><span className="label-rule" /></div>
              <div className="contact-layout">
                <div data-reveal><span className="contact-overline">SOFTWARE DEVELOPMENT INTERNSHIPS · COLLABORATIONS · QUESTIONS</span><h2 className="contact-title">Let us build<br /><span className="serif-accent">something useful.</span></h2><a className="contact-email" href="mailto:guptaujjwalunspcd@gmail.com">GUPTAUJJWALUNSPCD@GMAIL.COM <ArrowIcon diagonal /></a><p className="form-note"><a href="tel:+919528376218">+91 95283 76218</a></p></div>
                <form className="contact-form" onSubmit={handleSubmit} data-reveal>
                  <p className="form-note">Send me a note and your email app will take it from here.</p>
                  <label htmlFor="name">YOUR NAME</label><input id="name" name="name" autoComplete="name" placeholder="How should I address you?" required />
                  <label htmlFor="email">YOUR EMAIL</label><input id="email" type="email" name="email" autoComplete="email" placeholder="Where can I write back?" required />
                  <label htmlFor="message">WHAT’S ON YOUR MIND?</label><textarea id="message" name="message" rows="3" placeholder="A little about what you're thinking…" required />
                  <button className="form-submit" type="submit">{submitted ? "OPENING YOUR EMAIL APP" : "LET’S START A CONVERSATION"}<ArrowIcon /></button>
                  <p className="form-status" aria-live="polite">{submitted ? "Your email app should be ready with your message." : ""}</p>
                </form>
              </div>
              <div className="contact-bottom" data-reveal><span>OPEN TO SOFTWARE DEVELOPMENT INTERNSHIPS</span><a href="/Ujjwal-Gupta-Resume.pdf" target="_blank" rel="noreferrer">VIEW MY RESUME <ArrowIcon diagonal /></a></div>
            </div>
          </section>
        </main>

        <footer className="footer"><a className="wordmark" href="#home"><Mark /><span>UJJWAL GUPTA</span></a><span className="footer-credit">BUILT WITH CURIOSITY <i>✳</i> © 2026</span><div className="social-links"><a href="https://github.com/ujjwalgupta-0" target="_blank" rel="noreferrer">GITHUB <ArrowIcon diagonal /></a><a href="https://www.linkedin.com/in/ujjwal-gupta-058234378/" target="_blank" rel="noreferrer">LINKEDIN <ArrowIcon diagonal /></a><a href="https://leetcode.com/u/UJJWAL_GUPTA1/" target="_blank" rel="noreferrer">LEETCODE <ArrowIcon diagonal /></a></div></footer>
      </div>
    </>
  );
}
