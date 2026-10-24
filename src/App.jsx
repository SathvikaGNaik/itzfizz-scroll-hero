import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles.css";

gsap.registerPlugin(ScrollTrigger);

const metrics = [
  { value: 58, label: "Increase in pick-up point use", category: "PICK-UP EXPERIENCE", theme: "lime" },
  { value: 27, label: "Increase in pick-up point use", category: "CUSTOMER EXPERIENCE", theme: "dark" },
  { value: 23, label: "Decrease in customer phone calls", category: "SUPPORT EFFICIENCY", theme: "blue" },
  { value: 40, label: "Decrease in customer phone calls", category: "CUSTOMER CARE", theme: "orange" },
];

function DeliveryCar() {
  return (
    <svg className="car-svg" viewBox="0 0 440 170" role="img" aria-label="Orange delivery vehicle">
      <defs>
        <linearGradient id="carPaint" x1="0" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#ffad43" />
          <stop offset=".52" stopColor="#f47b20" />
          <stop offset="1" stopColor="#c94c0b" />
        </linearGradient>
        <linearGradient id="windowPaint" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#53616a" />
          <stop offset="1" stopColor="#151b20" />
        </linearGradient>
      </defs>
      <ellipse cx="220" cy="145" rx="184" ry="11" fill="#000" opacity=".18" />
      {[112, 330].map((x) => (
        <g className="wheel" key={x}>
          <circle cx={x} cy="124" r="31" fill="#15191b" stroke="#363c3f" strokeWidth="3" />
          <circle cx={x} cy="124" r="18" fill="#aeb5b8" />
          <circle cx={x} cy="124" r="8" fill="#454b4e" />
          <path d={`M${x} 108V140 M${x-16} 124H${x+16} M${x-11} 113L${x+11} 135 M${x+11} 113L${x-11} 135`} stroke="#646c70" strokeWidth="2.5" />
        </g>
      ))}
      <path d="M23 112L31 82Q36 67 62 62L117 54Q145 20 199 18H260Q302 20 331 54L391 64Q414 68 419 88L420 112L395 119H362Q357 91 330 91Q302 91 296 119H147Q141 91 112 91Q84 91 78 119H43Z" fill="url(#carPaint)" stroke="#f8a65b" strokeWidth="2" />
      <path d="M136 54Q159 29 201 28H253Q291 30 315 54L239 54Z" fill="url(#windowPaint)" stroke="#a9b2b5" strokeWidth="1.5" />
      <path d="M245 28V54" stroke="#a9b2b5" strokeWidth="2" />
      <path d="M31 83L78 76L73 87L29 93Z" fill="#f4f0d9" />
      <path d="M383 78L413 85L415 94L383 90Z" fill="#ffedbf" />
      <path d="M52 103L82 105M359 105L390 103" stroke="#a84811" strokeWidth="3" strokeLinecap="round" />
      <path d="M26 112H418" stroke="#9d400c" strokeWidth="2" opacity=".55" />
      <path d="M165 70H233" stroke="#ffbd72" strokeWidth="2" opacity=".7" />
      <text x="201" y="88" fill="#54260d" fontSize="10" fontWeight="800" letterSpacing="2" textAnchor="middle">IF / MOVE</text>
    </svg>
  );
}

function MetricCard({ metric, index, cardRef }) {
  return (
    <article className={`metric-card ${metric.theme}`} ref={cardRef}>
      <div className="card-meta">
        <span>0{index + 1}</span>
        <span>{metric.category}</span>
      </div>
      <div className="metric-number"><span data-count-to={metric.value}>0</span><sup>%</sup></div>
      <p>{metric.label}</p>
      <div className="card-bottom"><span>MEASURED IMPACT</span><i /></div>
    </article>
  );
}

export default function App() {
  const heroRef = useRef(null);
  const carRef = useRef(null);
  const roadDashesRef = useRef(null);
  const cardsRef = useRef([]);

  useLayoutEffect(() => {
    const hero = heroRef.current;
    const car = carRef.current;
    if (!hero || !car) return undefined;

    const context = gsap.context(() => {
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .fromTo(".topbar > *", { y: -12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65, stagger: 0.1 })
        .fromTo(".eyebrow", { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55 }, "-=.25")
        .fromTo(".headline-letter", { yPercent: 115, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.035 }, "-=.2")
        .fromTo(".hero-copy", { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55 }, "-=.35")
        .fromTo(".metric-card", { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65, stagger: 0.1 }, "-=.2")
        .fromTo(".car-inner", { x: -45, opacity: 0 }, { x: 0, opacity: 1, duration: 0.85 }, "-=.45")
        .fromTo(".scroll-cue", { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, "-=.25");

      hero.querySelectorAll("[data-count-to]").forEach((element, index) => {
        const counter = { value: 0 };
        gsap.to(counter, {
          value: Number(element.dataset.countTo),
          duration: 1.1,
          delay: 0.8 + index * 0.12,
          ease: "power2.out",
          onUpdate: () => { element.textContent = Math.round(counter.value); },
        });
      });

      const getTravelDistance = () => Math.max(0, hero.clientWidth - car.getBoundingClientRect().width - 18);
      const getWipeStart = () => {
        const carWidth = car.getBoundingClientRect().width;
        return Math.max(0.04, Math.min(0.78, (carWidth * 0.45) / hero.clientWidth));
      };

      const drive = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "+=250%",
          scrub: 0.85,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      drive
        .to(car, { x: getTravelDistance, duration: 1 }, 0)
        .fromTo(".green-wipe", { scaleX: getWipeStart }, { scaleX: 1, duration: 1 }, 0)
        .fromTo(".headline-overlay", { clipPath: () => `inset(0 ${100 - getWipeStart() * 100}% 0 0)` }, { clipPath: "inset(0 0% 0 0)", duration: 1 }, 0)
        .to(roadDashesRef.current, { xPercent: -34, duration: 1 }, 0)
        .to(".scroll-cue", { opacity: 0, duration: 0.04 }, 0)
        .to(".headline-wrap", { y: -14, duration: 1 }, 0)
        .to(".metrics-grid", { y: -13, duration: 1 }, 0);

      [[0, 0.13], [2, 0.31], [1, 0.48], [3, 0.66]].forEach(([index, at]) => {
        drive.fromTo(
          cardsRef.current[index],
          { y: 10, scale: 0.965, filter: "brightness(.72)" },
          { y: 0, scale: 1, filter: "brightness(1)", duration: 0.12, ease: "power2.out" },
          at
        );
      });

      drive.to(".progress-fill", { scaleX: 1, duration: 1 }, 0);
      ScrollTrigger.refresh();
    }, hero);

    return () => context.revert();
  }, []);

  const title = "WELCOME ITZFIZZ";
  const headlineLetters = [...title].map((character, index) => (
    <span className="headline-letter" key={`${character}-${index}`}>{character === " " ? "\u00a0" : character}</span>
  ));

  return (
    <main>
      <section className="hero" ref={heroRef} aria-label="ITZFIZZ scroll-driven hero">
        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />
        <header className="topbar">
          <a className="brand" href="#home" aria-label="ITZFIZZ home">
            <span className="brand-symbol">IF</span>
            <span className="brand-word">ITZFIZZ<sup>®</sup></span>
          </a>
          <div className="nav-note"><i /> SCROLL EXPERIENCE <span>/</span> 001</div>
          <a className="top-link" href="#story">THE STORY <b>↗</b></a>
        </header>

        <div className="eyebrow"><span>01</span><i /> MOVE PEOPLE FORWARD</div>

        <div className="headline-wrap" id="home">
          <h1 className="headline headline-base" aria-label={title}>{headlineLetters}</h1>
          <h1 className="headline headline-overlay" aria-hidden="true">{headlineLetters}</h1>
        </div>

        <div className="hero-copy">
          <i />
          <p>Small shifts.<br /><strong>Meaningful impact.</strong></p>
          <span>IF—001 / 2026</span>
        </div>

        <div className="metrics-grid">
          {metrics.map((metric, index) => (
            <MetricCard
              key={`${metric.value}-${metric.category}`}
              metric={metric}
              index={index}
              cardRef={(node) => { cardsRef.current[index] = node; }}
            />
          ))}
        </div>

        <div className="road" aria-hidden="true">
          <div className="road-grid" />
          <div className="road-dashes" ref={roadDashesRef} />
          <div className="road-glow" />
        </div>
        <div className="car" ref={carRef} aria-hidden="true">
          <div className="car-inner"><DeliveryCar /></div>
          <span>IF—720 / ELECTRIC</span>
        </div>

        <footer className="bottom-bar">
          <div className="scroll-cue"><i className="mouse"><b /></i><span>SCROLL TO EXPLORE</span></div>
          <span className="bottom-center">DESIGNED FOR THE JOURNEY</span>
          <span className="page-count">01 <i /> 04</span>
        </footer>
        <div className="progress"><i className="progress-fill" /></div>
      </section>

      <section className="outro" id="story">
        <div className="outro-inner">
          <p className="outro-label"><i /> THE JOURNEY CONTINUES</p>
          <h2>Built for<br /><span>what moves you.</span></h2>
          <div className="outro-bottom">
            <p>Good experiences don't ask for attention. They earn it — one thoughtful detail at a time.</p>
            <a href="#home" onClick={(event) => { event.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>BACK TO THE START <b>↗</b></a>
          </div>
          <span className="watermark" aria-hidden="true">IF.</span>
        </div>
      </section>
    </main>
  );
}
