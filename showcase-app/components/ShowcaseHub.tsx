'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const projects = [
  {
    index: '01',
    name: 'RoyalLegacyz',
    href: '/showcase/royallegacyz/',
    sector: 'Streetwear / Commerce',
    statement: 'A sales-first digital flagship built around drops, loyalty and live shopping.',
    systems: ['Storefront', 'Gallery', 'Loyalty', 'Live schedule'],
    tone: 'signal-violet',
  },
  {
    index: '02',
    name: 'KKI',
    href: '/showcase/kki/',
    sector: 'Fabric retail / Operations',
    statement: 'Customer ordering and staff operations connected from consultation to inventory.',
    systems: ['Order tracking', 'Consultation', 'Inventory', 'Staff tools'],
    tone: 'signal-copper',
  },
  {
    index: '03',
    name: 'H&N Takaful',
    href: '/showcase/H&N/',
    sector: 'Financial services / Agency',
    statement: 'A customer and agent operating layer for clearer protection decisions.',
    systems: ['Calculator', 'Policy review', 'Agent toolkit', 'Reporting'],
    tone: 'signal-blue',
  },
  {
    index: '04',
    name: 'Lindo Clinic',
    href: '/showcase/lindo-clinic/',
    sector: 'Aesthetic clinic / Experience',
    statement: 'Three sharply different digital directions for a premium clinical brand.',
    systems: ['Pearl Atelier', 'Clinical Prestige', 'Nocturne Elite'],
    tone: 'signal-rose',
  },
  {
    index: '05',
    name: 'Inaz Mobile Spa',
    href: '/showcase/inaz-mobile-spa/',
    sector: 'Wellness / Mobile operations',
    statement: 'A booking-to-therapist workflow designed for services that travel.',
    systems: ['Customer booking', 'E-KYC', 'Therapist board', 'Nearby slots'],
    tone: 'signal-amber',
  },
];

function SpatialCore({ enabled }: { enabled: boolean }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    if (!enabled || !window.WebGLRenderingContext) {
      mount.dataset.fallback = 'true';
      return;
    }

    delete mount.dataset.fallback;

    let frame = 0;
    let active = true;
    let width = Math.max(1, mount.clientWidth);
    let height = Math.max(1, mount.clientHeight);
    const pointer = new THREE.Vector2();
    const targetPointer = new THREE.Vector2();
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050806, 0.11);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.4);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    } catch {
      mount.dataset.fallback = 'true';
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.setAttribute('aria-hidden', 'true');
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const coreGeometry = new THREE.IcosahedronGeometry(1.32, 2);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x10231a,
      emissive: 0x063d25,
      emissiveIntensity: 0.65,
      metalness: 0.76,
      roughness: 0.24,
      flatShading: true,
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    group.add(core);

    const edgeGeometry = new THREE.EdgesGeometry(coreGeometry, 20);
    const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x51e49b, transparent: true, opacity: 0.52 });
    const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
    edges.scale.setScalar(1.012);
    group.add(edges);

    const ringMaterial = new THREE.MeshBasicMaterial({ color: 0x22c77a, wireframe: true, transparent: true, opacity: 0.24 });
    const ringA = new THREE.Mesh(new THREE.TorusGeometry(1.82, 0.012, 6, 120), ringMaterial);
    ringA.rotation.x = Math.PI * 0.42;
    group.add(ringA);
    const ringB = ringA.clone();
    ringB.rotation.set(Math.PI * 0.65, Math.PI * 0.2, Math.PI * 0.3);
    ringB.scale.setScalar(1.15);
    group.add(ringB);

    const count = 260;
    const positions = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      const radius = 2.25 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[index * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[index * 3 + 2] = radius * Math.cos(phi);
    }
    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMaterial = new THREE.PointsMaterial({ color: 0x7ff2b5, size: 0.018, transparent: true, opacity: 0.58, sizeAttenuation: true });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    scene.add(new THREE.AmbientLight(0xcde8dc, 0.72));
    const key = new THREE.PointLight(0x51e49b, 18, 12, 2);
    key.position.set(2.4, 2, 3.5);
    scene.add(key);
    const rim = new THREE.PointLight(0x6d78ff, 13, 10, 2);
    rim.position.set(-3, -1.5, 2);
    scene.add(rim);

    const onPointer = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      targetPointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      targetPointer.y = -((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    mount.addEventListener('pointermove', onPointer, { passive: true });

    const clock = new THREE.Clock();
    const render = () => {
      const elapsed = clock.getElapsedTime();
      pointer.lerp(targetPointer, 0.055);
      group.rotation.y = elapsed * 0.11 + pointer.x * 0.28;
      group.rotation.x = elapsed * 0.055 - pointer.y * 0.2;
      ringA.rotation.z = elapsed * 0.12;
      ringB.rotation.z = -elapsed * 0.085;
      particles.rotation.y = -elapsed * 0.015;
      camera.position.x += (pointer.x * 0.22 - camera.position.x) * 0.04;
      camera.position.y += (pointer.y * 0.15 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      if (active) frame = window.requestAnimationFrame(render);
    };

    const resizeObserver = new ResizeObserver(() => {
      width = Math.max(1, mount.clientWidth);
      height = Math.max(1, mount.clientHeight);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
    resizeObserver.observe(mount);

    const onVisibility = () => {
      active = !document.hidden;
      window.cancelAnimationFrame(frame);
      if (active) frame = window.requestAnimationFrame(render);
    };
    document.addEventListener('visibilitychange', onVisibility);
    frame = window.requestAnimationFrame(render);

    return () => {
      active = false;
      window.cancelAnimationFrame(frame);
      document.removeEventListener('visibilitychange', onVisibility);
      mount.removeEventListener('pointermove', onPointer);
      resizeObserver.disconnect();
      coreGeometry.dispose();
      coreMaterial.dispose();
      edgeGeometry.dispose();
      edgeMaterial.dispose();
      ringA.geometry.dispose();
      ringMaterial.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [enabled]);

  return <div className="showcase-spatial-core" ref={mountRef} aria-hidden="true"><div className="showcase-spatial-fallback"><i /><i /><i /></div></div>;
}

export function ShowcaseHub() {
  const rootRef = useRef<HTMLElement>(null);
  const [motionEnabled, setMotionEnabled] = useState(true);

  useGSAP(() => {
    const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
    intro
      .fromTo('.showcase-nav', { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: 0.45 })
      .fromTo('.showcase-hero .showcase-kicker', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.45 }, '-=.2')
      .fromTo('.showcase-hero h1 span', { opacity: 0, yPercent: 110, rotate: 2 }, { opacity: 1, yPercent: 0, rotate: 0, duration: 0.8, stagger: 0.09 }, '-=.2')
      .fromTo('.showcase-spatial-core', { opacity: 0, scale: .78, rotate: -8 }, { opacity: 1, scale: 1, rotate: 0, duration: 1.1 }, '-=.8')
      .fromTo('.showcase-hero__foot', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.5 }, '-=.35');

    gsap.fromTo('.showcase-project', {
      opacity: 0, y: 42, scale: .965,
    }, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: .72,
      stagger: .09,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.showcase-projects', start: 'top 84%', once: true },
    });

    gsap.to('.showcase-spatial-core', {
      yPercent: 12,
      rotate: 5,
      ease: 'none',
      scrollTrigger: { trigger: '.showcase-hero', start: 'top top', end: 'bottom top', scrub: true },
    });
  }, { scope: rootRef });

  return (
    <main className={`showcase-hub ${motionEnabled ? 'is-motion-enabled' : 'is-motion-reduced'}`} ref={rootRef}>
      <a className="showcase-skip" href="#showcase-projects">Skip to projects</a>
      <nav className="showcase-nav" aria-label="Showcase navigation">
        <a className="showcase-brand" href="/"><span>D</span> DOA SOLUTIONS</a>
        <p>Interactive systems archive <i /> 2026</p>
        <div><a href="/about-us/">About DOA</a><a className="showcase-nav__cta" href="mailto:doasolutions@outlook.com">Start a build ↗</a></div>
      </nav>

      <section className="showcase-hero">
        <div className="showcase-hero__type">
          <p className="showcase-kicker">Selected digital systems / 01—05</p>
          <h1><span>Systems</span><span>you can</span><span><em>enter.</em></span></h1>
        </div>
        <SpatialCore enabled={motionEnabled} />
        <div className="showcase-hero__foot">
          <p>Five working concepts. Each one explores a different industry, customer journey and operating model.</p>
          <div className="showcase-hero__controls">
            <button
              className="showcase-motion-toggle"
              type="button"
              aria-pressed={motionEnabled}
              onClick={() => setMotionEnabled((current) => !current)}
              title="Toggle motion"
            >
              <i aria-hidden="true" /> {motionEnabled ? 'Motion on' : 'Enable motion'}
            </button>
            <span>Explore <i aria-hidden="true">↓</i></span>
          </div>
        </div>
      </section>

      <section className="showcase-index" id="showcase-projects">
        <header><p className="showcase-kicker">The archive</p><p>Websites are the visible layer.<br />The workflow behind them is the real product.</p></header>
        <div className="showcase-projects">
          {projects.map((project) => (
            <a className={`showcase-project ${project.tone}`} href={project.href} key={project.name}>
              <div className="showcase-project__meta"><span>{project.index}</span><span>{project.sector}</span><span>Live concept <i /></span></div>
              <div className="showcase-project__body">
                <div><h2>{project.name}</h2><p>{project.statement}</p></div>
                <div className="showcase-project__systems">{project.systems.map((system) => <span key={system}>{system}</span>)}</div>
              </div>
              <div className="showcase-project__action"><span>Open system</span><i aria-hidden="true">↗</i></div>
              <div className="showcase-project__orb" aria-hidden="true"><i /><i /><i /></div>
            </a>
          ))}
        </div>
      </section>

      <section className="showcase-close">
        <p className="showcase-kicker">Beyond the demo</p>
        <h2>A concept becomes valuable when it fits the real operation.</h2>
        <div><p>DOA Solutions maps the workflow, designs the control layer, builds the modules and supports the team after launch.</p><a href="mailto:doasolutions@outlook.com">Build your system <span>↗</span></a></div>
      </section>
    </main>
  );
}
