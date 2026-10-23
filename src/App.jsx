import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const metrics = [
  { value: "58%", label: "Increase in pick-up point use", tone: "lime" },
  { value: "23%", label: "Fewer customer phone calls", tone: "blue" },
  { value: "27%", label: "Increase in pick-up point use", tone: "white" },
  { value: "40%", label: "Fewer customer phone calls", tone: "orange" },
];

function Car() {
  return (
    <svg className="car-art" viewBox="0 0 360 170" role="img" aria-label="Illustrated sports car viewed from above">
      <defs>
        <linearGradient id="body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f8f8f1" />
          <stop offset=".48" stopColor="#c8ccc5" />
          <stop offset="1" stopColor="#7f877f" />
        </linearGradient>
        <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#26302d" />
          <stop offset="1" stopColor="#080b0a" />
        </linearGradient>
      </defs>
      <ellipse cx="180" cy="85" rx="163" ry="65" fill="#000" opacity=".22" />
      <g fill="#090b0a" stroke="#555b55" strokeWidth="2">
        <rect x="37" y="26" width="58" height="31" rx="10" />
        <rect x="265" y="26" width="58" height="31" rx="10" />
        <rect x="37" y="113" width="58" height="31" rx="10" />
        <rect x="265" y="113" width="58" height="31" rx="10" />
      </g>
      <path d="M65 84 C67 59 87 37 118 29 L146 17 Q180 8 214 17 L242 29 C273 37 293 59 295 84 L290 111 C284 134 258 146 231 150 L129 150 C102 146 76 134 70 111Z" fill="url(#body)" stroke="#f3f4ee" strokeWidth="2" />
      <path d="M105 40 Q180 19 255 40 L269 67 Q180 56 91 67Z" fill="url(#glass)" stroke="#707a72" strokeWidth="2" />
      <path d="M91 74 Q180 65 269 74 L258 111 Q180 124 102 111Z" fill="url(#glass)" stroke="#707a72" strokeWidth="2" />
      <path d="M180 22 L180 145" stroke="#8d958d" strokeWidth="1.5" opacity=".7" />
      <path d="M90 73 Q180 62 270 73" stroke="#f5f7ee" strokeWidth="2" opacity=".7" />
      <path d="M103 119 Q180 133 257 119 L244 137 Q180 153 116 137Z" fill="#1a201d" />
      <path d="M78 72 L103 67 M282 72 L257 67" stroke="#d8f5b2" strokeWidth="4" strokeLinecap="round" />
      <path d="M80 106 L103 112 M280 106 L257 112" stroke="#ff4b35" strokeWidth="4" strokeLinecap="round" />
      <path d="M135 29 L127 41 M225 29 L233 41" stroke="#fff" strokeWidth="2" opacity=".6" />
      <path d="M150 139 L210 139" stroke="#aab1a9" strokeWidth="2" />
    </svg>
  );
}

function MetricCard({ metric, index }) {
  return (
    <article className={`metric-card metric-${index + 1} tone-${metric.tone}`} data-metric>
      <span className="metric-index">0{index + 1} / IMPACT</span>
      <strong>{metric.value}</strong>
      <span className="metric-label">{metric.label}</span>
      <span className="metric-line" />
    </article>
  );
}

export default function App() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const carRef = useRef(null);
  const trailRef = useRef(null);
  const lettersRef = useRef([]);
  const metricsRef = useRef([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const car = carRef.current;
    const trail = trailRef.current;
    const letters = lettersRef.current.filter(Boolean);
    const cards = metricsRef.current.filter(Boolean);

    const ctx = gsap.context(() => {
      // The intro is intentionally subtle; the main reveal remains scroll-controlled.
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .fromTo(".brand-mark", { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65 })
        .fromTo(".eyebrow", { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55 }, "-=.32")
        .fromTo(".scroll-cue", { opacity: 0 }, { opacity: 1, duration: 0.7 }, "-=.15")
        .fromTo(car, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.7 }, "-=.5");

      gsap.set(letters, { opacity: 0.16, y: 8 });
      gsap.set(cards, { opacity: 0, y: 18 });
      gsap.set(trail, { scaleX: 0, transformOrigin: "left center" });

      const travel = () => Math.max(0, stage.clientWidth - car.clientWidth + 20);

      const drive = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.65,
          invalidateOnRefresh: true,
        },
      });

      drive.to(car, { x: travel, ease: "none" }, 0);
      drive.to(trail, { scaleX: 1, ease: "none" }, 0);

      // Headline letters brighten progressively as the car passes their positions.
      letters.forEach((letter, index) => {
        const start = 0.06 + (index / Math.max(1, letters.length - 1)) * 0.78;
        drive.to(letter, { opacity: 1, y: 0, duration: 0.08, ease: "none" }, start);
      });

      cards.forEach((card, index) => {
        const start = 0.18 + index * 0.19;
        drive.to(card, { opacity: 1, y: 0, duration: 0.12, ease: "power2.out" }, start);
      });

      ScrollTrigger.refresh();
    }, section);

    return () => ctx.revert();
  }, []);

  const title = "WELCOME ITZFIZZ";
  const titleLetters = title.split("");

  return (
    <main>
      <section className="scroll-section" ref={sectionRef} aria-label="Scroll-driven hero">
        <div className="stage" ref={stageRef}>
          <header className="topbar">
            <a className="brand-mark" href="#top" aria-label="ITZFIZZ home">
              <span className="brand-symbol">IF</span>
              <span className="brand-name">ITZFIZZ<span>®</span></span>
            </a>
            <div className="topbar-right">
              <span className="status-dot" />
              <span>SCROLL EXPERIENCE / 001</span>
            </div>
          </header>

          <div className="hero-copy">
            <p className="eyebrow"><span>01</span> / MOVE PEOPLE FORWARD</p>
            <p className="hero-note">Small shifts.<br />Meaningful impact.</p>
          </div>

          <div className="road" aria-label="Animated road">
            <div className="road-grid" />
            <div className="road-centerline" />
            <div className="trail" ref={trailRef} />
            <div className="headline" aria-label="Welcome ITZFIZZ">
              {titleLetters.map((letter, index) => (
                <span
                  key={`${letter}-${index}`}
                  ref={(node) => { lettersRef.current[index] = node; }}
                  className={letter === " " ? "headline-space" : ""}
                  aria-hidden="true"
                >
                  {letter === " " ? "\u00a0" : letter}
                </span>
              ))}
            </div>
            <div className="car-wrap" ref={carRef}>
              <Car />
              <span className="car-label">IF—720 / ELECTRIC</span>
            </div>
          </div>

          {metrics.map((metric, index) => (
            <MetricCard
              key={metric.value + index}
              metric={metric}
              index={index}
            />
          ))}

          <div className="bottom-bar">
            <div className="scroll-cue">
              <span className="cue-ring"><span /></span>
              <span>SCROLL TO EXPLORE</span>
            </div>
            <span className="bottom-caption">DESIGNED FOR THE JOURNEY</span>
            <span className="progress-count">01 <i /> 04</span>
          </div>
        </div>
      </section>

      <section className="outro" id="next">
        <p className="eyebrow">THE JOURNEY CONTINUES</p>
        <h2>MAKE EVERY<br /><span>MOVE MATTER.</span></h2>
        <p className="outro-copy">A small scroll-driven experiment in motion, rhythm, and the details that make an interface feel alive.</p>
        <a className="back-link" href="#top" onClick={(event) => {
          event.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}>BACK TO THE START <span>↗</span></a>
      </section>
      <div id="top" className="top-anchor" />
    </main>
  );
}