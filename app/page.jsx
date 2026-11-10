"use client";

import { useEffect, useState } from "react";

const skills = ["C", "C++", "JavaScript", "HTML", "CSS", "Git", "Object-oriented programming", "Operating systems"];

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
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = document.querySelectorAll("[data-reveal]");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      targets.forEach((target) => target.classList.add("is-visible"));
      return;
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

    const sections = document.querySelectorAll("main section[id], header[id]");
    const sectionObserver = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      }),
      { rootMargin: "-30% 0px -60% 0px" },
    );
    sections.forEach((section) => sectionObserver.observe(section));
    return () => { observer.disconnect(); sectionObserver.disconnect(); };
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const subject = encodeURIComponent(`Portfolio message from ${values.get("name")}`);
    const body = encodeURIComponent(`${values.get("message")}\n\nFrom: ${values.get("name")} (${values.get("email")})`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    setSubmitted(true);
  }

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="site-shell">
        <nav className="topbar" aria-label="Main navigation">
          <a className="wordmark" href="#home" aria-label="Ujjwal Gupta, home"><Mark /> <span>UJJWAL GUPTA</span></a>
          <button className="nav-toggle" type="button" aria-expanded={menuOpen} aria-controls="nav-links" onClick={() => setMenuOpen(!menuOpen)}>
            <span>{menuOpen ? "Close" : "Menu"}</span><span className={`menu-icon ${menuOpen ? "menu-icon--open" : ""}`} aria-hidden="true"><i /><i /></span>
          </button>
          <div className={`nav-links ${menuOpen ? "nav-links--open" : ""}`} id="nav-links">
            {[ ["About", "about"], ["Skills", "skills"], ["Projects", "projects"], ["Contact", "contact"] ].map(([label, id], index) => (
              <a key={id} className={activeSection === id ? "nav-link nav-link--active" : "nav-link"} href={`#${id}`} onClick={() => setMenuOpen(false)}><span>0{index + 1}</span>{label}</a>
            ))}
            <a className="nav-resume" href="/Ujjwal-Gupta-Resume.pdf" target="_blank" rel="noreferrer">Resume <ArrowIcon diagonal /></a>
          </div>
        </nav>

        <main id="main">
          <header className="hero" id="home">
            <div className="hero-orbit hero-orbit--one" aria-hidden="true" /><div className="hero-orbit hero-orbit--two" aria-hidden="true" />
            <div className="hero-grid" aria-hidden="true" />
            <div className="hero-content">
              <p className="eyebrow hero-eyebrow" data-reveal><span className="status-dot" /> COMPUTER ENGINEERING STUDENT <span className="eyebrow-divider">/</span> OPEN TO INTERNSHIPS</p>
              <h1 data-reveal>Curious by nature.<br /><span className="headline-accent">Builder by choice.</span></h1>
              <div className="hero-bottom" data-reveal>
                <p>Learning the craft of turning thoughtful ideas into useful, well-made software.</p>
                <a className="round-link" href="#projects" aria-label="Explore selected work"><ArrowIcon /></a>
              </div>
              <div className="hero-index" aria-hidden="true"><span>PORTFOLIO</span><span>2026 — PRESENT</span></div>
            </div>
            <div className="hero-side-note" aria-hidden="true">DESIGN × DEVELOPMENT × CURIOSITY</div>
          </header>

          <div className="ticker" aria-label="Exploring ideas, building with intent, learning every day"><div className="ticker-track">
            {[0, 1].map((copy) => <span className="ticker-line" key={copy} aria-hidden={copy === 1}><span>EXPLORE THE POSSIBLE</span><b>✳</b><span>BUILD WITH INTENT</span><b>✳</b><span>LEARN SOMETHING NEW</span><b>✳</b></span>)}
          </div></div>

          <section className="section about-section" id="about">
            <div className="section-label" data-reveal><span>01 / ABOUT</span><span className="label-rule" /></div>
            <div className="about-layout">
              <h2 className="section-title" data-reveal>A little about<br />how I <span className="serif-accent">think.</span></h2>
              <div className="about-copy" data-reveal>
                <p className="about-lede">I’m Ujjwal, a second-year computer engineering student interested in making technology useful, intuitive, and a little more human.</p>
                <p>My foundation is in C and C++, with hands-on experience building for the web using HTML, CSS, and JavaScript. I enjoy learning how things work, from object-oriented programming to operating systems, then using that understanding to solve real problems.</p>
                <p>Now I’m exploring Python, AI, and backend development—one curious experiment at a time.</p>
                <a className="text-link" href="#contact">Let’s get to know each other <ArrowIcon /></a>
              </div>
            </div>
            <div className="about-foot" data-reveal><span>COMPUTER ENGINEERING</span><span>ALWAYS LEARNING <i>✳</i></span></div>
          </section>

          <section className="skills-section" id="skills">
            <div className="skills-inner">
              <div className="section-label section-label--light" data-reveal><span>02 / TOOLKIT</span><span className="label-rule" /></div>
              <div className="skills-layout">
                <div><h2 className="section-title section-title--light" data-reveal>Things I<br /><span className="serif-accent">work with.</span></h2><p className="skills-intro" data-reveal>Tools and ideas I’m learning, using, and getting better at.</p></div>
                <div className="skill-list" data-reveal>{skills.map((skill, index) => <div className="skill-row" key={skill}><span className="skill-number">0{index + 1}</span><span>{skill}</span><Mark /></div>)}</div>
              </div>
              <p className="skills-note" data-reveal><span>↗</span> CURRENTLY EXPLORING <b>PYTHON</b><i>AI</i><i>BACKEND DEVELOPMENT</i></p>
            </div>
          </section>

          <section className="section projects-section" id="projects">
            <div className="section-label" data-reveal><span>03 / SELECTED WORK</span><span className="label-rule" /></div>
            <div className="projects-heading" data-reveal><h2 className="section-title">Learning by<br /><span className="serif-accent">making.</span></h2><span className="projects-aside">A few things I’ve<br />built along the way.</span></div>
            <article className="project-card project-card--portfolio" data-reveal>
              <div className="project-visual project-visual--browser" aria-label="Abstract illustration of a personal website in a browser window">
                <div className="browser-frame"><div className="browser-top"><span /><span /><span /><i>ujjwalgupta.dev</i><b>↗</b></div><div className="browser-content"><span className="browser-kicker">PERSONAL PORTFOLIO</span><div className="browser-heading">A place to<br /><em>make things.</em></div><div className="browser-line" /><div className="browser-footer">LEARN · CREATE · REPEAT <span>✳</span></div></div></div>
                <div className="visual-stamp">01<br />WEB</div>
              </div>
              <div className="project-details"><div className="project-topline"><span>01 — WEB DEVELOPMENT</span><span>NEXT.JS · REACT · CSS</span></div><div className="project-description"><h3>A home on<br />the internet.</h3><div><p>A personal portfolio built from scratch to bring together my work, skills, and interests. Designed with responsive layouts, thoughtful interactions, and lightweight motion that respects reduced-motion preferences.</p><div className="project-actions"><a href="https://github.com/ujjwalgupta-0/My-Portfolio" target="_blank" rel="noreferrer" className="text-link">View source <ArrowIcon diagonal /></a><a href="#home" className="text-link">You’re here <ArrowIcon diagonal /></a></div></div></div></div>
            </article>
            <article className="project-card project-card--bank" data-reveal>
              <div className="project-visual project-visual--bank" aria-label="Abstract illustration of a C++ bank account console program">
                <div className="bank-screen"><div className="bank-header"><span>ACCOUNT MANAGER</span><span>C++ / CONSOLE</span></div><div className="bank-ascii">┌─────────────────────────┐<br />│&nbsp;&nbsp; YOUR MONEY, IN MOTION&nbsp;&nbsp; │<br />├─────────────────────────┤<br />│&nbsp; 1. Create account&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; │<br />│&nbsp; 2. Check balance&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; │<br />│&nbsp; 3. Make a deposit&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; │<br />│&nbsp; 4. Withdraw funds&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; │<br />└─────────────────────────┘<br /><span className="terminal-prompt">SELECT AN OPTION_</span></div></div><div className="visual-stamp visual-stamp--orange">02<br />C++</div>
              </div>
              <div className="project-details"><div className="project-topline"><span>02 — OBJECT-ORIENTED PROGRAMMING</span><span>C++ · OOP</span></div><div className="project-description"><h3>A little more<br />in control.</h3><div><p>A menu-driven account management system with account creation, balance inquiries, deposits, and withdrawals—built to practise encapsulation and core object-oriented programming in C++.</p><div className="project-actions"><a href="https://github.com/ujjwalgupta-0/DATA-STRUCTURES/blob/main/Bank_account_management_sys.cpp" target="_blank" rel="noreferrer" className="text-link">View source <ArrowIcon diagonal /></a></div></div></div></div>
            </article>
            <div className="projects-end" data-reveal><span>MORE TO COME</span><span>THE NEXT IDEA IS ALREADY TAKING SHAPE <i>✳</i></span></div>
          </section>

          <section className="contact-section" id="contact">
            <div className="contact-inner">
              <div className="section-label section-label--light" data-reveal><span>04 / SAY HELLO</span><span className="label-rule" /></div>
              <div className="contact-layout">
                <div data-reveal><span className="contact-overline">GOT AN IDEA, OPPORTUNITY, OR JUST WANT TO TALK?</span><h2 className="contact-title">Let’s make<br /><span className="serif-accent">something matter.</span></h2><a className="contact-email" href="https://www.linkedin.com/in/ujjwal-gupta-058234378/" target="_blank" rel="noreferrer">SAY HELLO ON LINKEDIN <ArrowIcon diagonal /></a></div>
                <form className="contact-form" onSubmit={handleSubmit} data-reveal>
                  <p className="form-note">Drop me a line and your email app will take it from here.</p>
                  <label htmlFor="name">YOUR NAME</label><input id="name" name="name" autoComplete="name" placeholder="How should I address you?" required />
                  <label htmlFor="email">YOUR EMAIL</label><input id="email" type="email" name="email" autoComplete="email" placeholder="Where can I write back?" required />
                  <label htmlFor="message">WHAT’S ON YOUR MIND?</label><textarea id="message" name="message" rows="3" placeholder="A little about what you're thinking…" required />
                  <button className="form-submit" type="submit">{submitted ? "OPENING YOUR EMAIL APP" : "LET’S START A CONVERSATION"}<ArrowIcon /></button>
                  <p className="form-status" aria-live="polite">{submitted ? "Your email app should be ready with your message." : ""}</p>
                </form>
              </div>
              <div className="contact-bottom" data-reveal><span>OPEN TO INTERNSHIP OPPORTUNITIES <i>✳</i> OPEN TO GREAT CONVERSATIONS</span><a href="/Ujjwal-Gupta-Resume.pdf" target="_blank" rel="noreferrer">TAKE A LOOK AT MY RESUME <ArrowIcon diagonal /></a></div>
            </div>
          </section>
        </main>

        <footer className="footer"><a className="wordmark" href="#home"><Mark /><span>UJJWAL GUPTA</span></a><span className="footer-credit">BUILT WITH CURIOSITY <i>✳</i> © 2026</span><div className="social-links"><a href="https://github.com/ujjwalgupta-0" target="_blank" rel="noreferrer">GITHUB <ArrowIcon diagonal /></a><a href="https://www.linkedin.com/in/ujjwal-gupta-058234378/" target="_blank" rel="noreferrer">LINKEDIN <ArrowIcon diagonal /></a></div></footer>
      </div>
    </>
  );
}
