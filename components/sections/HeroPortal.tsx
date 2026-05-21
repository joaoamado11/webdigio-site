'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import InnerHero from './InnerHero';
import GridScan from './GridScan';

function ease(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function LaptopFrame() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 20 }}>
      {/* Top lid bezel */}
      <div style={{ position:'absolute', inset:'0 0 auto 0', height:22, background:'linear-gradient(180deg, var(--device-lid) 0%, var(--device-lid-dark) 100%)', borderRadius:'18px 18px 0 0', boxShadow:'inset 0 -1px 0 rgba(0,0,0,0.5)' }}>
        {/* Lid top edge shine */}
        <div style={{ position:'absolute', top:0, left:0, right:0, height:1, borderRadius:'18px 18px 0 0', background:'linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.10) 30%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.10) 70%, transparent 95%)' }} />
        {/* Webcam */}
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:8, height:8, borderRadius:'50%', background:'radial-gradient(circle at 38% 32%,#252838,#0e1018)', boxShadow:'0 0 0 1.5px rgba(255,255,255,0.07),0 0 0 3px rgba(0,0,0,0.4)' }}>
          <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:3, height:3, borderRadius:'50%', background:'#07090e' }} />
          <div style={{ position:'absolute', right:-9, top:'50%', transform:'translateY(-50%)', width:3, height:3, borderRadius:'50%', background:'rgba(34,197,94,0.55)', boxShadow:'0 0 5px rgba(34,197,94,0.5)' }} />
        </div>
      </div>
      {/* Left bezel */}
      <div style={{ position:'absolute', top:22, bottom:78, left:0, width:14, background:'linear-gradient(90deg, var(--device-side) 0%, var(--device-side-inner) 100%)', boxShadow:'inset -1px 0 0 rgba(255,255,255,0.02)' }} />
      {/* Right bezel */}
      <div style={{ position:'absolute', top:22, bottom:78, right:0, width:14, background:'linear-gradient(270deg, var(--device-side) 0%, var(--device-side-inner) 100%)', boxShadow:'inset 1px 0 0 rgba(255,255,255,0.02)' }} />
      {/* Screen-to-body hinge */}
      <div style={{ position:'absolute', bottom:78, left:0, right:0, height:10, background:'linear-gradient(180deg, var(--device-side) 0%, var(--device-chassis) 100%)', boxShadow:'inset 0 1px 0 rgba(255,255,255,0.04)' }}>
        <div style={{ position:'absolute', top:4, left:'12%', right:'12%', height:1, background:'linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 40%, rgba(255,255,255,0.06) 60%, transparent)', borderRadius:1 }} />
      </div>
      {/* Keyboard chassis */}
      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:78, background:'linear-gradient(180deg, var(--device-chassis) 0%, var(--device-chassis-mid) 55%, var(--device-chassis-light) 100%)', borderRadius:'0 0 18px 18px', boxShadow:'inset 0 1px 0 rgba(255,255,255,0.05)' }}>
        <div style={{ position:'absolute', top:0, left:'4%', right:'4%', height:1, background:'linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 30%, rgba(255,255,255,0.10) 50%, rgba(255,255,255,0.08) 70%, transparent)' }} />
        {[8,18,28].map(top => (
          <div key={top} style={{ position:'absolute', top, left:'5%', right:'5%', height:6, borderRadius:2 }}>
            {Array.from({length:14}).map((_,i) => (
              <div key={i} style={{ position:'absolute', top:0, bottom:0, left:`${(i/14)*100}%`, width:`${(1/14)*100-0.5}%`, background:'rgba(255,255,255,0.02)', borderRadius:'1.5px', boxShadow:'inset 0 1px 0 rgba(255,255,255,0.015),0 1px 0 rgba(0,0,0,0.3)' }} />
            ))}
          </div>
        ))}
        {/* Trackpad */}
        <div style={{ position:'absolute', bottom:9, left:'50%', transform:'translateX(-50%)', width:'27%', height:24, background:'rgba(255,255,255,0.015)', borderRadius:5, border:'1px solid rgba(255,255,255,0.05)', boxShadow:'inset 0 1px 0 rgba(255,255,255,0.02),0 2px 4px rgba(0,0,0,0.4)' }} />
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:1, borderRadius:'0 0 18px 18px', background:'linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.07) 30%, rgba(255,255,255,0.09) 50%, rgba(255,255,255,0.07) 70%, transparent 95%)' }} />
      </div>
      {/* Screen glass reflection */}
      <div style={{ position:'absolute', top:22, bottom:88, left:14, right:14, background:'linear-gradient(148deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 22%, transparent 48%)', pointerEvents:'none', zIndex:30 }} />
    </div>
  );
}

function IPhoneFrame() {
  const bezel = 'var(--device-phone, #0b0d12)';
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 20 }}>
      {/* Top chassis */}
      <div style={{ position:'absolute', inset:'0 0 auto 0', height:14, background:bezel, borderRadius:'44px 44px 0 0' }} />
      {/* Bottom chassis */}
      <div style={{ position:'absolute', inset:'auto 0 0 0', height:14, background:bezel, borderRadius:'0 0 44px 44px' }} />
      {/* Left rail */}
      <div style={{ position:'absolute', inset:'14px auto 14px 0', width:12, background:bezel }} />
      {/* Right rail */}
      <div style={{ position:'absolute', inset:'14px 0 14px auto', width:12, background:bezel }} />
      {/* Pill notch */}
      <div style={{ position:'absolute', top:16, left:'50%', transform:'translateX(-50%)', width:'30%', height:28, background:'#060810', borderRadius:22, boxShadow:'0 0 0 1px rgba(255,255,255,0.06)' }}>
        <div style={{ position:'absolute', right:'18%', top:'50%', transform:'translateY(-50%)', width:8, height:8, borderRadius:'50%', background:'#111520', border:'1px solid rgba(255,255,255,0.05)' }} />
      </div>
      {/* Power button (right) */}
      <div style={{ position:'absolute', right:-3, top:'32%', width:3, height:'9%', background:bezel, borderRadius:'2px 0 0 2px' }} />
      {/* Action button (left top) */}
      <div style={{ position:'absolute', left:-3, top:'18%', width:3, height:'3%', background:bezel, borderRadius:'0 2px 2px 0' }} />
      {/* Volume up */}
      <div style={{ position:'absolute', left:-3, top:'24%', width:3, height:'6%', background:bezel, borderRadius:'0 2px 2px 0' }} />
      {/* Volume down */}
      <div style={{ position:'absolute', left:-3, top:'32%', width:3, height:'6%', background:bezel, borderRadius:'0 2px 2px 0' }} />
      {/* Home indicator */}
      <div style={{ position:'absolute', bottom:18, left:'50%', transform:'translateX(-50%)', width:'34%', height:5, background:'rgba(255,255,255,0.18)', borderRadius:3 }} />
      {/* Screen edge highlight */}
      <div style={{ position:'absolute', top:14, bottom:14, left:12, right:12, border:'1px solid rgba(59,130,246,0.07)', borderRadius:32, pointerEvents:'none' }} />
    </div>
  );
}

function SafariBarDesktop() {
  return (
    <div style={{ position:'absolute', top:22, left:14, right:14, height:38, background:'rgba(18,19,26,0.98)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', padding:'0 12px', gap:8, zIndex:25 }}>
      {/* Traffic lights */}
      <div style={{ display:'flex', gap:5, flexShrink:0 }}>
        <div style={{ width:10, height:10, borderRadius:'50%', background:'radial-gradient(circle at 38% 32%,#ff7b72,#e0443e)', boxShadow:'0 0 0 0.5px rgba(0,0,0,0.3)' }} />
        <div style={{ width:10, height:10, borderRadius:'50%', background:'radial-gradient(circle at 38% 32%,#ffd55e,#dda018)', boxShadow:'0 0 0 0.5px rgba(0,0,0,0.3)' }} />
        <div style={{ width:10, height:10, borderRadius:'50%', background:'radial-gradient(circle at 38% 32%,#5fdb6c,#1da830)', boxShadow:'0 0 0 0.5px rgba(0,0,0,0.3)' }} />
      </div>
      {/* Back / Forward */}
      <div style={{ display:'flex', gap:2, flexShrink:0, opacity:0.38 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" style={{opacity:0.38}}><path d="M9 18l6-6-6-6"/></svg>
      </div>
      {/* URL bar */}
      <div style={{ flex:1, height:24, background:'rgba(255,255,255,0.07)', borderRadius:6, border:'1px solid rgba(255,255,255,0.05)', display:'flex', alignItems:'center', justifyContent:'center', gap:5, overflow:'hidden' }}>
        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        <span style={{ fontSize:11, color:'rgba(255,255,255,0.78)', fontFamily:'-apple-system,BlinkMacSystemFont,system-ui,sans-serif', fontWeight:500, letterSpacing:0.1 }}>webdigio.com</span>
      </div>
      {/* Share */}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.32)" strokeWidth="2" strokeLinecap="round" style={{flexShrink:0}}><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
      {/* Reload */}
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.32)" strokeWidth="2" strokeLinecap="round" style={{flexShrink:0}}><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/></svg>
    </div>
  );
}

function SafariBarMobile() {
  return (
    <div style={{ position:'absolute', top:44, left:12, right:12, height:44, background:'rgba(18,19,26,0.98)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(255,255,255,0.05)', display:'flex', alignItems:'center', padding:'0 10px', gap:8, zIndex:25 }}>
      <svg width="10" height="16" viewBox="0 0 10 16" fill="none" style={{flexShrink:0}}>
        <path d="M8 2L2 8L8 14" stroke="rgba(255,255,255,0.42)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <div style={{ flex:1, height:30, background:'rgba(255,255,255,0.08)', borderRadius:8, border:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'center', gap:4 }}>
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        <span style={{ fontSize:11, color:'rgba(255,255,255,0.82)', fontFamily:'-apple-system,BlinkMacSystemFont,system-ui,sans-serif', fontWeight:500 }}>webdigio.com</span>
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.38)" strokeWidth="2" strokeLinecap="round" style={{flexShrink:0}}><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
    </div>
  );
}

// ============================================================
// HeroPortal — Cinematic scroll-expand effect
// ── Main component ────────────────────────────────────────────────────────────
export default function HeroPortal() {
  const heroRef  = useRef<HTMLElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const headRef  = useRef<HTMLDivElement>(null);
  const hintRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const shell = shellRef.current;
    const frame = frameRef.current;
    const inner = innerRef.current;
    const head  = headRef.current;
    const hint  = hintRef.current;

    const mobile = () => window.innerWidth < 768;

    function startDims() {
      return mobile()
        ? { w: Math.min(300, window.innerWidth * 0.88), h: Math.min(580, window.innerHeight * 0.68), r: 44 }
        : { w: Math.min(680, window.innerWidth * 0.52), h: Math.min(440, window.innerHeight * 0.56), r: 18 };
    }

    let navShown = false;

    function applyProgress(progress: number) {
      if (!shell) return;
      const p  = ease(progress);
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const { w: sw, h: sh, r: sr } = startDims();

      shell.style.width        = (sw + (vw - sw) * p) + 'px';
      shell.style.height       = (sh + (vh - sh) * p) + 'px';
      shell.style.borderRadius = (sr * (1 - p)) + 'px';
      shell.style.transform    = `perspective(2000px) rotateX(${6 * (1 - p)}deg)`;

      // Show/hide navbar based on portal progress
      if (progress >= 0.88 && !navShown) {
        navShown = true;
        window.dispatchEvent(new CustomEvent('portal-complete'));
      } else if (progress < 0.88 && navShown) {
        navShown = false;
        window.dispatchEvent(new CustomEvent('portal-reset'));
      }

      if (inner) {
        const screenW = mobile() ? sw - 24 : sw - 28;
        const screenH = mobile() ? sh - 50 : sh - 90;
        const startS  = Math.min(screenW / vw, screenH / vh);
        const s       = startS + (1 - startS) * p;
        inner.style.transform = `translate(-50%, -50%) scale(${s})`;
      }

      if (frame) frame.style.opacity = String(Math.max(0, 1 - progress * 2.8));

      if (head) {
        head.style.opacity   = String(Math.max(0, 1 - progress * 3.5));
        head.style.transform = `translateY(${-progress * 50}px)`;
      }

      if (hint) hint.style.opacity = String(Math.max(0, 1 - progress * 5));
    }

    // Apply initial state before GSAP loads
    if (shell) {
      const { w, h, r } = startDims();
      shell.style.width        = w + 'px';
      shell.style.height       = h + 'px';
      shell.style.borderRadius = r + 'px';
      shell.style.transform    = 'perspective(2000px) rotateX(6deg)';
    }
    if (inner) {
      const { w: sw, h: sh } = startDims();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const screenW = mobile() ? sw - 24 : sw - 28;
      const screenH = mobile() ? sh - 50 : sh - 90;
      const s = Math.min(screenW / vw, screenH / vh);
      inner.style.transform = `translate(-50%, -50%) scale(${s})`;
    }

    async function initGSAP() {
      const { default: gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      if (!heroRef.current || !shell) return;

      const st = ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: '+=280%',
        pin: true,
        scrub: 1,
        onUpdate: (self: { progress: number }) => applyProgress(self.progress),
      });

      const onResize = () => { applyProgress(0); st.refresh(); };
      window.addEventListener('resize', onResize);

      cleanup = () => {
        st.kill();
        window.removeEventListener('resize', onResize);
        ScrollTrigger.getAll().forEach((t: { kill: () => void }) => t.kill());
      };
    }

    initGSAP().catch(console.error);
    return () => cleanup?.();
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative h-screen flex flex-col items-center justify-center"
      style={{ background: '#050508', overflow: 'hidden' }}
    >
      {/* GridScan animated background */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true" style={{ zIndex: 0 }}>
        <GridScan
          sensitivity={0.55}
          lineThickness={1}
          linesColor="#1a2340"
          gridScale={0.1}
          scanColor="#5494c7"
          scanOpacity={0.45}
          enablePost
          bloomIntensity={0.6}
          chromaticAberration={0.002}
          noiseIntensity={0.008}
          scanDuration={2.5}
          scanDelay={1.5}
          scanGlow={0.6}
          scanSoftness={2.5}
        />
        {/* Radial vignette to blend edges */}
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 90% 90% at 50% 50%, transparent 30%, rgba(5,5,8,0.7) 100%)' }} />
      </div>

      {/* Headline */}
      <div
        ref={headRef}
        className="absolute top-[4%] left-0 right-0 flex flex-col items-center gap-2 z-20 px-4 text-center"
        style={{ transition:'none', pointerEvents:'none' }}
      >
        {/* Big Webdigio logo */}
        <div style={{ marginBottom: '0.25rem' }}>
          <Image
            src="/assets/bigWBlogowhite.png"
            alt="Webdigio"
            width={400}
            height={100}
            className="h-14 md:h-20 w-auto object-contain"
            priority
          />
        </div>
        <span className="section-tag">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-pulse" />
          Agência Digital — Portugal
        </span>
        <h1
          className="font-bold tracking-tight leading-tight"
          style={{ fontFamily:'var(--font-heading)', color:'var(--color-text)', fontSize:'clamp(1.6rem, 4.5vw, 3.8rem)' }}
        >
          O teu negócio merece{' '}
          <span style={{ background:'linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #a78bfa 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
            um site melhor.
          </span>
        </h1>
      </div>

      {/* Device shell — 3D perspective wrapper */}
      <div style={{ perspective:'2000px', perspectiveOrigin:'50% 55%', marginTop:'3.5rem' }}>
      <div
        ref={shellRef}
        className="relative flex-shrink-0"
        style={{
          width:'680px', height:'440px', borderRadius:'18px',
          background:'#070912',
          boxShadow:'0 0 0 1px rgba(255,255,255,0.09), 0 40px 100px rgba(0,0,0,0.9), 0 0 80px rgba(59,130,246,0.11), inset 0 0 0 1px rgba(255,255,255,0.03)',
          overflow:'hidden',
          transform:'perspective(2000px) rotateX(6deg)',
        }}
      >
        {/* CSS device frame + Safari bar */}
        <div ref={frameRef} className="absolute inset-0" style={{ transition:'none', zIndex:20, pointerEvents:'none' }}>
          <div className="hidden md:block absolute inset-0">
            <LaptopFrame />
            <SafariBarDesktop />
          </div>
          <div className="block md:hidden absolute inset-0">
            <IPhoneFrame />
            <SafariBarMobile />
          </div>
        </div>

        {/* Inner site content */}
        <div className="absolute inset-0" style={{ overflow:'hidden', zIndex:10 }}>
          <div
            ref={innerRef}
            style={{
              position:'absolute', top:'50%', left:'50%',
              width:'100vw', height:'100vh',
              transform:'translate(-50%, -50%) scale(0.36)',
              transformOrigin:'center center',
            }}
          >
            <InnerHero />
          </div>
        </div>
      </div>
      </div> {/* end 3D perspective wrapper */}

      {/* Scroll hint */}
      <div
        ref={hintRef}
        className="absolute bottom-6 flex flex-col items-center gap-2"
        style={{ transition:'none' }}
      >
        <span className="text-[11px] tracking-[0.2em] uppercase font-semibold" style={{ color:'var(--color-text-dim)' }}>
          Scroll para entrar
        </span>
        <svg className="animate-bounce" width="14" height="14" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ color:'var(--color-primary-light)' }}
        >
          <line x1="12" y1="5" x2="12" y2="19"/>
          <polyline points="5 14 12 21 19 14"/>
        </svg>
      </div>
    </section>
  );
}
