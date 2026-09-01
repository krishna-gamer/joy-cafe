import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import * as THREE from "three";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  ChevronDown,
  Clock3,
  Coffee,
  ExternalLink,
  Instagram,
  Leaf,
  MapPin,
  Menu as MenuIcon,
  Minus,
  Plus,
  Sparkles,
  Star,
  Utensils,
  X,
} from "lucide-react";

const galleryImages = [
  {
    src: "/manus-storage/cafe-wall_f1666072.jpg",
    alt: "Black and white art wall with cafe seating",
    label: "the sketch wall",
    size: "wide",
  },
  {
    src: "/manus-storage/cafe-art_d2a7f041.jpg",
    alt: "Hand-drawn space illustration inside Joey 2D Art Cafe",
    label: "little worlds",
    size: "tall",
  },
  {
    src: "/manus-storage/cafe-front_dbbe01db.jpg",
    alt: "Joey 2D Art Cafe exterior sign in Gwalior",
    label: "from the street",
    size: "square",
  },
  {
    src: "/manus-storage/cafe-seating_9445d80e.jpg",
    alt: "Bright illustrated dining room with white tables",
    label: "sunlit tables",
    size: "tall",
  },
  {
    src: "/manus-storage/cafe-doodle_c29de7e1.jpg",
    alt: "Playful hand-drawn cafe mural",
    label: "made for daydreams",
    size: "wide",
  },
];

const menuItems = [
  {
    name: "Coffee",
    copy: "Slow pours, silky cappuccinos, and the kind of cup you take your time with.",
    price: "₹200—280",
    icon: Coffee,
    tone: "saffron",
  },
  {
    name: "Mojitos",
    copy: "Fresh mint, bright citrus, and a little fizz to reset your afternoon.",
    price: "₹240—320",
    icon: Leaf,
    tone: "mint",
  },
  {
    name: "Sandwiches",
    copy: "Toasty, generous, and easy to share when the table gets lively.",
    price: "₹260—360",
    icon: Utensils,
    tone: "coral",
  },
  {
    name: "Hakka Noodles",
    copy: "Wok-tossed comfort with a little more kick than your usual cafe order.",
    price: "₹280—400",
    icon: Sparkles,
    tone: "plum",
  },
  {
    name: "Snacks",
    copy: "Crisp bites, small plates, and the perfect excuse to order one more.",
    price: "₹200—300",
    icon: Star,
    tone: "cream",
  },
];

const reviews = [
  {
    quote: "The food is genuinely good, but the atmosphere is what makes you stay.",
    name: "Aarushi M.",
    tag: "a regular table",
    tone: "cream",
  },
  {
    quote: "So cozy and full of tiny details. Every corner feels made for a photo.",
    name: "Rohan S.",
    tag: "first visit",
    tone: "orange",
  },
  {
    quote: "Friendly staff, relaxed energy, and a menu that has something for everyone.",
    name: "Kavya P.",
    tag: "weekend hang",
    tone: "pink",
  },
];

function useReveal() {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.14 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    card.style.setProperty("--rx", `${(0.5 - y) * 9}deg`);
    card.style.setProperty("--ry", `${(x - 0.5) * 10}deg`);
    card.style.setProperty("--mx", `${x * 100}%`);
    card.style.setProperty("--my", `${y * 100}%`);
  };

  const reset = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
    card.style.setProperty("--mx", "50%");
    card.style.setProperty("--my", "50%");
  };

  return (
    <div ref={cardRef} className={`tilt-card ${className}`} onPointerMove={handleMove} onPointerLeave={reset}>
      {children}
    </div>
  );
}

function HeroScene() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x321317);
    scene.fog = new THREE.Fog(0x321317, 8, 19);
    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
    camera.position.set(0.25, 0.18, 6.8);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    const ambient = new THREE.HemisphereLight(0xffe8bd, 0x38151a, 2.5);
    scene.add(ambient);
    const key = new THREE.DirectionalLight(0xffc27a, 4.5);
    key.position.set(-3, 5, 5);
    scene.add(key);
    const rimLight = new THREE.PointLight(0xf25f3d, 16, 12, 2);
    rimLight.position.set(3, -1, 3);
    scene.add(rimLight);

    const cup = new THREE.Group();
    cup.position.set(0.3, -0.05, 0);
    cup.rotation.z = -0.05;
    scene.add(cup);

    const porcelain = new THREE.MeshStandardMaterial({ color: 0xf4e6d2, roughness: 0.3, metalness: 0.02 });
    const coffeeMaterial = new THREE.MeshStandardMaterial({ color: 0x5e251c, roughness: 0.18, metalness: 0.06 });
    const darkMaterial = new THREE.MeshStandardMaterial({ color: 0x271015, roughness: 0.35, metalness: 0.12 });
    const orangeMaterial = new THREE.MeshStandardMaterial({ color: 0xf36b3d, roughness: 0.28, metalness: 0.08 });

    const saucer = new THREE.Mesh(new THREE.CylinderGeometry(1.38, 1.18, 0.13, 64), porcelain);
    saucer.position.y = -0.47;
    cup.add(saucer);

    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.87, 0.75, 1.25, 64), porcelain);
    body.position.y = 0.3;
    cup.add(body);

    const coffee = new THREE.Mesh(new THREE.CylinderGeometry(0.74, 0.74, 0.055, 64), coffeeMaterial);
    coffee.position.y = 0.93;
    cup.add(coffee);

    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.765, 0.045, 16, 64), orangeMaterial);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.94;
    cup.add(rim);

    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.105, 20, 48), porcelain);
    handle.rotation.y = Math.PI / 2;
    handle.position.set(0.86, 0.32, 0);
    cup.add(handle);

    const saucerRing = new THREE.Mesh(new THREE.TorusGeometry(1.07, 0.055, 14, 64), orangeMaterial);
    saucerRing.rotation.x = Math.PI / 2;
    saucerRing.position.y = -0.39;
    cup.add(saucerRing);

    const latteDot = new THREE.Mesh(new THREE.SphereGeometry(0.12, 24, 24), orangeMaterial);
    latteDot.scale.set(1.7, 0.3, 1.7);
    latteDot.position.set(-0.18, 0.98, 0.12);
    cup.add(latteDot);

    const orbit = new THREE.Group();
    orbit.rotation.set(0.3, 0.1, -0.28);
    scene.add(orbit);
    const orbitRing = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.018, 8, 96), orangeMaterial);
    orbitRing.rotation.x = Math.PI / 2;
    orbit.add(orbitRing);
    const orbitDot = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 16), orangeMaterial);
    orbitDot.position.set(0, 0, 1.8);
    orbit.add(orbitDot);

    const particles = new THREE.Group();
    scene.add(particles);
    for (let i = 0; i < 14; i += 1) {
      const geometry = i % 3 === 0 ? new THREE.OctahedronGeometry(0.08) : new THREE.BoxGeometry(0.09, 0.09, 0.09);
      const particle = new THREE.Mesh(geometry, i % 2 === 0 ? orangeMaterial : darkMaterial);
      const angle = (i / 14) * Math.PI * 2;
      const radius = 2.25 + (i % 4) * 0.18;
      particle.position.set(Math.cos(angle) * radius, Math.sin(angle * 1.8) * 1.25, Math.sin(angle) * 0.8 - 0.2);
      particle.rotation.set(i * 0.4, i * 0.2, i * 0.3);
      particles.add(particle);
    }

    const pointer = { x: 0, y: 0 };
    let scrollProgress = 0;
    let frame = 0;
    let animationId = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    const onScroll = () => {
      scrollProgress = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1.2);
    };
    const resize = () => {
      const width = canvas.clientWidth || canvas.parentElement?.clientWidth || window.innerWidth;
      const height = canvas.clientHeight || canvas.parentElement?.clientHeight || window.innerHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", resize);
    resize();
    onScroll();

    const animate = (now: number) => {
      const time = reducedMotion ? 0 : now;
      cup.rotation.y += reducedMotion ? 0 : 0.0022;
      cup.rotation.x += ((pointer.y * 0.045 + scrollProgress * 0.06) - cup.rotation.x) * 0.03;
      cup.position.x += ((0.3 + pointer.x * 0.18) - cup.position.x) * 0.025;
      cup.position.y = -0.05 + Math.sin(time * 0.0011) * 0.11 - scrollProgress * 0.22;
      orbit.rotation.y = time * 0.00016 + pointer.x * 0.1;
      orbit.rotation.x = 0.32 + pointer.y * 0.06;
      particles.rotation.y = time * 0.00008;
      particles.position.y = -scrollProgress * 0.4;
      camera.position.x += (0.25 + pointer.x * 0.42 - camera.position.x) * 0.035;
      camera.position.y += (0.18 - pointer.y * 0.18 + scrollProgress * 0.18 - camera.position.y) * 0.035;
      camera.lookAt(0.1, 0.28 - scrollProgress * 0.1, 0);
      renderer.render(scene, camera);
      animationId = window.requestAnimationFrame(animate);
      frame += 1;
      if (reducedMotion && frame > 2) window.cancelAnimationFrame(animationId);
    };
    animationId = window.requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(animationId);
      renderer.dispose();
      [saucer, body, coffee, rim, handle, saucerRing, latteDot, orbitRing, orbitDot, ...particles.children].forEach((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose());
          else object.material.dispose();
        }
      });
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-webgl" aria-label="A floating 3D coffee cup" />;
}

function SectionIntro({ kicker, title, copy, light = false }: { kicker: string; title: React.ReactNode; copy: string; light?: boolean }) {
  return (
    <div className={`section-intro ${light ? "section-intro-light" : ""}`}>
      <span className="kicker">{kicker}</span>
      <h2>{title}</h2>
      <p>{copy}</p>
    </div>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const aboutReveal = useReveal();
  const menuReveal = useReveal();
  const galleryReveal = useReveal();
  const reviewReveal = useReveal();

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand-lockup" href="#top" onClick={closeMenu}>
          <span className="brand-mark">J</span>
          <span>
            <strong>Joey</strong>
            <small>2D Art Cafe</small>
          </span>
        </a>
        <nav className={`main-nav ${menuOpen ? "nav-open" : ""}`}>
          <a href="#about" onClick={closeMenu}>The space</a>
          <a href="#menu" onClick={closeMenu}>Menu</a>
          <a href="#gallery" onClick={closeMenu}>Gallery</a>
          <a href="#visit" onClick={closeMenu}>Visit</a>
        </nav>
        <a className="header-cta" href="https://www.google.com/maps/search/?api=1&query=Joey+2D+Art+Cafe+Gwalior" target="_blank" rel="noreferrer">
          <span>Find us</span><ArrowUpRight size={16} />
        </a>
        <button className="menu-toggle" aria-label={menuOpen ? "Close navigation" : "Open navigation"} onClick={() => setMenuOpen((value) => !value)}>
          {menuOpen ? <X size={22} /> : <MenuIcon size={22} />}
        </button>
      </header>

      <main id="top">
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-grid" />
          <div className="hero-glow hero-glow-one" />
          <div className="hero-glow hero-glow-two" />
          <HeroScene />
          <div className="hero-copy">
            <span className="eyebrow"><span className="eyebrow-dot" /> Balwant Nagar · Gwalior</span>
            <h1 id="hero-title" className="hero-title">
              <span className="title-line title-line-top">Joey</span>
              <span className="title-line title-line-bottom">2D Art Cafe</span>
            </h1>
            <p className="hero-tagline">Gwalior&apos;s Most Unique <em>Art Café</em></p>
            <div className="hero-actions">
              <a className="button button-primary" href="#menu">View menu <ArrowDown size={17} /></a>
              <a className="button button-ghost" href="https://www.google.com/maps/search/?api=1&query=Joey+2D+Art+Cafe+Gwalior" target="_blank" rel="noreferrer">Get directions <ArrowUpRight size={17} /></a>
            </div>
          </div>
          <div className="hero-orbit-label hero-orbit-label-left">sip<br /><span>slowly</span></div>
          <div className="hero-orbit-label hero-orbit-label-right">since<br /><span>2020</span></div>
          <div className="hero-bottomline">
            <span>espresso / imagination / good company</span>
            <a href="#about">scroll to steep <ArrowDown size={14} /></a>
          </div>
        </section>

        <section ref={aboutReveal.ref} className={`about-section section-reveal ${aboutReveal.visible ? "is-visible" : ""}`} id="about">
          <div className="about-rail"><span>01</span><span className="rail-line" /><span>THE SPACE</span></div>
          <div className="about-content">
            <SectionIntro
              kicker="more than a cafe"
              title={<>A little bit <em>off the page.</em></>}
              copy="Walk in for coffee. Stay for the feeling of stepping into a hand-drawn world — walls, tables, and tiny details all waiting to be noticed."
            />
            <div className="about-note">
              <span className="note-stamp"><Sparkles size={15} /> 2D / 3D</span>
              <p>“The art is not decoration here. It is the mood.”</p>
              <span className="note-signature">— Joey, Gwalior</span>
            </div>
          </div>
          <div className="about-scene" aria-hidden="true">
            <div className="scene-shadow" />
            <div className="scene-panel scene-panel-back"><span>draw</span></div>
            <div className="scene-panel scene-panel-mid"><span>sip</span></div>
            <div className="scene-panel scene-panel-front"><span>repeat</span></div>
            <div className="scene-sun" />
            <div className="scene-doodle doodle-one">✦</div>
            <div className="scene-doodle doodle-two">○</div>
          </div>
        </section>

        <section ref={menuReveal.ref} className={`menu-section section-reveal ${menuReveal.visible ? "is-visible" : ""}`} id="menu">
          <div className="menu-header">
            <SectionIntro
              kicker="on the table"
              title={<>Come hungry.<br /><em>Leave inspired.</em></>}
              copy="Our menu moves between familiar comforts and little plot twists. Made for sharing, or not."
            />
            <div className="price-note"><span className="price-note-icon">₹</span><span><strong>₹200—400</strong><small>per person, on average</small></span></div>
          </div>
          <div className="menu-grid">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <TiltCard key={item.name} className={`menu-card menu-card-${item.tone} ${index === 0 ? "menu-card-featured" : ""}`}>
                  <div className="card-topline"><span>0{index + 1}</span><Icon size={22} strokeWidth={1.5} /></div>
                  <div className="menu-card-art" aria-hidden="true"><span>{index === 0 ? "☕" : index === 1 ? "✺" : index === 2 ? "↗" : index === 3 ? "〰" : "•"}</span></div>
                  <div className="menu-card-copy"><h3>{item.name}</h3><p>{item.copy}</p></div>
                  <div className="menu-card-bottom"><span>{item.price}</span><span className="card-arrow"><ArrowUpRight size={16} /></span></div>
                </TiltCard>
              );
            })}
          </div>
          <p className="tilt-hint"><span className="hint-cursor">✣</span> move your cursor over the cards</p>
        </section>

        <section ref={galleryReveal.ref} className={`gallery-section section-reveal ${galleryReveal.visible ? "is-visible" : ""}`} id="gallery">
          <div className="gallery-heading">
            <div className="about-rail"><span>02</span><span className="rail-line" /><span>INSIDE JOEY</span></div>
            <SectionIntro kicker="as seen in the room" title={<>Real walls. <em>Real stories.</em></>} copy="Every frame is a little invitation to look closer."
            />
            <span className="gallery-count">05 / 05</span>
          </div>
          <div className="gallery-grid">
            {galleryImages.map((image, index) => (
              <TiltCard key={image.src} className={`gallery-card gallery-${image.size} gallery-card-${index}`}>
                <div className="gallery-image-wrap"><img src={image.src} alt={image.alt} loading={index > 1 ? "lazy" : "eager"} /></div>
                <div className="gallery-caption"><span>{image.label}</span><span>0{index + 1}</span></div>
              </TiltCard>
            ))}
          </div>
          <p className="gallery-source">The real Joey 2D Art Cafe, Gwalior · captured in the wild</p>
        </section>

        <section ref={reviewReveal.ref} className={`reviews-section section-reveal ${reviewReveal.visible ? "is-visible" : ""}`}>
          <div className="reviews-backdrop" aria-hidden="true"><span>good<br />things<br /><em>happen</em></span></div>
          <div className="reviews-header">
            <SectionIntro light kicker="the word on the street" title={<>Feels like a <em>five-star</em> kind of day.</>} copy="The little things are what people remember: good food, cozy corners, and people who make you feel at home."
            />
            <div className="rating-lockup"><strong>4.4</strong><div><div className="stars">★★★★★</div><span>224 reviews on Google</span></div></div>
          </div>
          <div className="review-cards">
            {reviews.map((review) => (
              <TiltCard key={review.name} className={`review-card review-${review.tone}`}>
                <div className="quote-mark">“</div>
                <p>{review.quote}</p>
                <div className="review-person"><span className="review-avatar">{review.name.slice(0, 1)}</span><span><strong>{review.name}</strong><small>{review.tag}</small></span><Check size={16} /></div>
              </TiltCard>
            ))}
          </div>
        </section>

        <section className="visit-section" id="visit">
          <div className="visit-copy">
            <span className="kicker">come say hello</span>
            <h2>There&apos;s always<br /><em>room for one more.</em></h2>
            <p>Bring your people, your sketchbook, or just yourself. We&apos;ll keep the lights warm.</p>
            <a className="button button-dark" href="https://www.google.com/maps/search/?api=1&query=Joey+2D+Art+Cafe+Gwalior" target="_blank" rel="noreferrer">Open in Google Maps <ExternalLink size={16} /></a>
          </div>
          <div className="visit-details">
            <div className="detail-block"><MapPin size={19} /><div><span>Find us</span><address>Balwant Nagar, Gwalior,<br />Madhya Pradesh 474011</address></div></div>
            <div className="detail-block"><Clock3 size={19} /><div><span>Hours</span><p>Mon—Sun · 11:00 am—11:00 pm</p></div></div>
            <div className="detail-block"><Instagram size={19} /><div><span>Say hi online</span><a href="https://instagram.com/joey2dartcafe" target="_blank" rel="noreferrer">@joey2dartcafe</a></div></div>
          </div>
          <div className="map-frame"><iframe title="Joey 2D Art Cafe on Google Maps" src="https://www.google.com/maps?q=Joey+2D+Art+Cafe+Gwalior&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-brand"><span className="brand-mark">J</span><div><strong>Joey 2D Art Cafe</strong><span>Gwalior&apos;s most unique art café</span></div></div>
        <div className="footer-note">Made for slow afternoons<br /><span>© {new Date().getFullYear()} Joey 2D Art Cafe</span></div>
        <a href="#top" className="back-top">Back to top <ArrowUpRight size={15} /></a>
      </footer>
    </div>
  );
}
