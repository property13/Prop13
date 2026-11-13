import React, { useState, useEffect, useRef, useId } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionTemplate,
  useMotionValue,
  animate as runAnimation,
} from 'framer-motion';

/* ================= 1. CONSTANTS ================= */
const HERO_IMG = '/pic1.png';
const HERO_VIDEO = '/Website-Landscape.mp4';
const LOGO = '/logo.png';
const EXP_IMG = '/Signature.png';
const ALI_IMG = '/Alibaug.png';
const DEL_IMG = '/Delhi.png';
const MUM_IMG = '/Mumbai.png';

const USE_EXTRA_HERO_FILES = false;
const HERO_POSTER = USE_EXTRA_HERO_FILES ? '/hero-poster.jpg' : HERO_IMG;
const HERO_VIDEO_MOBILE = USE_EXTRA_HERO_FILES ? '/Website-Portrait.mp4' : HERO_VIDEO;

const BG = '#000000';
const CREAM = '#fbefca';
const GOLD = '#f4d35e';
const GOLD_DARK = '#c9971c';
const INK = '#14161c';

const serif = '"Marcellus", Georgia, serif';
const sans = 'Inter, "Helvetica Neue", Arial, sans-serif';
const mont = '"Montserrat", Inter, "Helvetica Neue", Arial, sans-serif';
const script = '"Kaushan Script", "Brush Script MT", cursive';

const V = (n) => `calc(var(--vh) * ${n})`;

const STATEMENT_FIRST = 'Real estate';
const STATEMENT_REST =
  'Across India and Dubai. Developments, destinations and opportunities worth exploring, across markets that continue to evolve';

const INSTAGRAM = 'propertygallery13';
const LINKEDIN = 'linkedin.com/in/harpreet-singh-ghulati-64535234';
const WHATSAPP = '+91 8851678180';
const EMAIL = 'info@propertygallery.com';
const YOUTUBE = 'Property Gallery Vlogs';
const YOUTUBE_URL = 'https://www.youtube.com/@PropertyGalleryVlogs';

const ABOUT = {
  heading: 'ABOUT',
  text:
    "Add your founder story here. Share why you started Property Gallery, what you believe about real estate, and how you help buyers find the right home. Keep it to a few short lines so it stays easy to read.",
  logos: ['ig', 'in', 'wa', 'yt', 'em'],
  headingSize: 'clamp(38px, min(5.6vw, 10.5vh), 88px)',
  textSize: 'clamp(15px, min(1.7vw, 3.1vh), 27px)',
  textMaxWidth: 800,
  textGapTop: '2.6vh',
  logoSize: 'clamp(48px, min(4.4vw, 8.5vh), 76px)',
  logoGap: 'clamp(50px, 2vw, 32px)',
  logoGapTop: '4.5vh',
  phoneHeight: 'clamp(320px, calc(var(--vh) * 72), 720px)',
  columns: '1.2fr 0.8fr',
  headingSizeMobile: 24,
  textSizeMobile: 12,
  textLinesMobile: 4,
  logoSizeMobile: 24,
};

const WA_URL = `https://wa.me/${WHATSAPP.replace(/[^0-9]/g, '')}`;

const CONTACTS = [
  { icon: 'ig', name: 'Instagram', label: INSTAGRAM, short: INSTAGRAM, href: `https://instagram.com/${INSTAGRAM}` },
  { icon: 'in', name: 'LinkedIn', label: LINKEDIN, short: 'LinkedIn', href: `https://${LINKEDIN}` },
  { icon: 'wa', name: 'WhatsApp', label: WHATSAPP, short: WHATSAPP, href: WA_URL },
  { icon: 'yt', name: 'YouTube', label: YOUTUBE, short: YOUTUBE, href: YOUTUBE_URL },
  { icon: 'em', name: 'Email', label: EMAIL, short: EMAIL, href: `mailto:${EMAIL}` },
];

const ICON_IMG = {
  ig: '/instagram.png',
  in: '/linkedin.png',
  wa: '/whatsapp.png',
  yt: '/youtube.png',
  em: '/gmail.png',
};

const FOOTER_DISCLAIMER =
  'Images and project details are for illustration only and may change without notice. Please confirm availability and registration details with us before booking.';
const FOOTER_ADDRESS = 'M4/32, Mushedpur, DLF Phase 2, Sector 25, Gurugram, Shahpur, Haryana 122002';
const MAPS_URL = 'https://maps.app.goo.gl/LFTdNsrsJKLbcfP4A';

const FOOTER_RING = true;
const FOOTER_LOGO = 26;

const inOut = [0.76, 0, 0.24, 1];
const outExpo = [0.16, 1, 0.3, 1];
const outSoft = [0.22, 1, 0.36, 1];
const SPRING = { stiffness: 120, damping: 25, mass: 0.4 };

const FADE_DELAY = 0.4;
const SPLIT_DUR = 0.8;
const VERT_DUR = 1.1;
const IMG_DELAY = 0.3;
const IMG_DUR = 2.0;
const IMG_ZOOM_DUR = 2.6;
const UNLOCK_AFTER = 3.6;

const STMT_VH = 340;
const STMT_BASE_VH = 140;
const STMT_A = STMT_BASE_VH / (STMT_VH - 100);
const STMT_ZOOM_END = 0.94;

const TURN_VH = 45;
const TURN_DEG = -90;
// Rotation zoom ke saath-saath hoti hai: zoom ke itne hisse me rotation poori ho jati hai.
// 0.5 = zoom ke aadhe raaste tak | 1 = rotation aur zoom bilkul ek saath khatam
const TURN_SHARE = 0.5;

const FONT_VW = 6.3;
const FONT_VW_MOBILE = 6.4;
const START_LEFT = 12.1;
const START_RIGHT = 55.5;
const START_LEFT_MOBILE = 12.0;
const START_RIGHT_MOBILE = 83.0;
const NAV_FONT = 12;
const NAV_GAP = 28;

const PILL_D = 'inset(39% 37.5% 39% 37.5% round 200px)';
const MID_D = 'inset(3% 1.5% 3% 1.5% round 28px)';
const PILL_M = 'inset(40% 22% 40% 22% round 120px)';
const MID_M = 'inset(2% 3% 2% 3% round 24px)';
const FULL = 'inset(0% 0% 0% 0% round 0px)';

function useIsMobile() {
  const query = '(max-width: 799px)';
  const [m, setM] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const f = () => setM(mq.matches);
    f();
    if (mq.addEventListener) mq.addEventListener('change', f);
    else mq.addListener(f);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', f);
      else mq.removeListener(f);
    };
  }, []);
  return m;
}

function Icon({ name, size = 34 }) {
  const uid = useId().replace(/:/g, '');
  const s = { width: size, height: size, flex: 'none', display: 'block' };
  if (name === 'ig')
    return (
      <svg viewBox="0 0 24 24" style={s}>
        <defs>
          <linearGradient id={`igg${uid}`} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#feda75" />
            <stop offset=".5" stopColor="#d62976" />
            <stop offset="1" stopColor="#4f5bd5" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="20" height="20" rx="6" fill={`url(#igg${uid})`} />
        <circle cx="12" cy="12" r="4.2" fill="none" stroke="#fff" strokeWidth="1.8" />
        <circle cx="17.2" cy="6.8" r="1.2" fill="#fff" />
      </svg>
    );
  if (name === 'in')
    return (
      <svg viewBox="0 0 24 24" style={s}>
        <rect x="2" y="2" width="20" height="20" rx="4" fill="#0a66c2" />
        <text x="12" y="17" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff" fontFamily="Arial">in</text>
      </svg>
    );
  if (name === 'wa')
    return (
      <svg viewBox="0 0 24 24" style={s}>
        <circle cx="12" cy="12" r="10" fill="#25d366" />
        <path d="M8.2 7.2c-.6 1 0 3 2 5s4 2.6 5.2 2.1l.7-1.6-1.8-1-.8.8c-.8-.3-1.7-1.2-2.1-2.1l.8-.8-1-1.8z" fill="#fff" />
      </svg>
    );
  if (name === 'em')
    return (
      <svg viewBox="0 0 24 24" style={s}>
        <rect x="2" y="4.5" width="20" height="15" rx="3.5" fill="#ea4335" />
        <path d="M3.5 7l8.5 6 8.5-6" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" style={s}>
      <rect x="2" y="5" width="20" height="14" rx="4" fill="#ff0000" />
      <path d="M10 9l5 3-5 3z" fill="#fff" />
    </svg>
  );
}

function SocialLogo({ c, size }) {
  return (
    <motion.a
      href={c.href}
      {...(c.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      aria-label={c.name}
      title={c.name}
      whileHover={{ y: -5, scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      style={{ display: 'block', width: size, height: size, flex: 'none', cursor: 'pointer' }}
    >
      <img
        src={ICON_IMG[c.icon]}
        alt={c.name}
        draggable={false}
        style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
      />
    </motion.a>
  );
}

const fill = { position: 'absolute', inset: 0 };

function ProfileScreen() {
  const tile = (pos) => ({
    aspectRatio: '1',
    backgroundImage: `url(${HERO_IMG})`,
    backgroundSize: '260%',
    backgroundPosition: pos,
  });
  return (
    <div style={{ ...fill, background: '#000', color: '#fff', fontFamily: mont, padding: '3.6em 0.9em 0.9em' }}>
      <div style={{ fontWeight: 700, fontSize: '1.05em', marginBottom: '0.9em' }}>{INSTAGRAM} ▾</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1em' }}>
        <div style={{ width: '4.6em', height: '4.6em', borderRadius: '50%', padding: 2, background: 'linear-gradient(45deg,#feda75,#d62976,#4f5bd5)' }}>
          <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: `#111 url(${LOGO}) center/60% no-repeat`, border: '2px solid #000' }} />
        </div>
        <div style={{ display: 'flex', flex: 1, justifyContent: 'space-around', textAlign: 'center', fontSize: '0.9em' }}>
          {[['609', 'posts'], ['169k', 'followers'], ['188', 'following']].map(([n, l]) => (
            <div key={l}><div style={{ fontWeight: 700 }}>{n}</div><div style={{ opacity: 0.7, fontSize: '0.85em' }}>{l}</div></div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: '0.8em', fontSize: '0.9em', lineHeight: 1.4 }}>
        <div style={{ fontWeight: 700 }}>Property Gallery</div>
        <div style={{ opacity: 0.8 }}>Luxury real estate · Delhi NCR</div>
      </div>
      <div style={{ display: 'flex', gap: '0.5em', marginTop: '0.8em' }}>
        {['Following', 'Message'].map((t) => (
          <div key={t} style={{ flex: 1, textAlign: 'center', background: '#262626', borderRadius: 6, padding: '0.5em 0', fontSize: '0.85em', fontWeight: 600 }}>{t}</div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '0.8em', margin: '1em 0 0.8em' }}>
        {['20% 30%', '70% 30%', '30% 80%', '80% 80%'].map((p) => (
          <div key={p} style={{ width: '3.4em', height: '3.4em', borderRadius: '50%', border: '1.5px solid #555', backgroundImage: `url(${HERO_IMG})`, backgroundSize: '300%', backgroundPosition: p }} />
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2 }}>
        {['0% 0%', '50% 0%', '100% 0%', '0% 100%', '50% 100%', '100% 100%'].map((p) => (
          <div key={p} style={tile(p)} />
        ))}
      </div>
    </div>
  );
}

function ReelScreen() {
  const circle = { width: '2.6em', height: '2.6em', borderRadius: '50%', background: 'rgba(0,0,0,.35)', display: 'grid', placeItems: 'center' };
  return (
    <div style={{ ...fill, background: '#000', overflow: 'hidden', fontFamily: mont, color: '#fff' }}>
      <motion.div
        initial={{ scale: 1.05 }}
        animate={{ scale: 1.22 }}
        transition={{ duration: 3.4, ease: 'linear' }}
        style={{ ...fill, backgroundImage: `url(${HERO_IMG})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      <div style={{ ...fill, background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.35), transparent 30%, transparent 55%, rgba(0,0,0,.75))' }} />
      <div style={{ position: 'absolute', top: '3.5em', left: '0.8em', right: '0.8em', height: 3, background: 'rgba(255,255,255,.3)', borderRadius: 2 }}>
        <motion.div initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 3.1, ease: 'linear' }} style={{ height: '100%', background: '#fff', borderRadius: 2 }} />
      </div>
      <div style={{ position: 'absolute', right: '0.8em', bottom: '5.5em', display: 'flex', flexDirection: 'column', gap: '0.9em' }}>
        <div style={circle}><svg viewBox="0 0 24 24" width="55%" height="55%"><path d="M12 21s-7-4.6-9.5-9C1 8.8 2.6 5 6 5c2 0 3.4 1.1 4 2.2C10.6 6.1 12 5 14 5c3.4 0 5 3.8 3.5 7C19 16.4 12 21 12 21z" fill="#ff3b5c" /></svg></div>
        <div style={circle}><svg viewBox="0 0 24 24" width="55%" height="55%"><circle cx="12" cy="12" r="8" fill="none" stroke="#fff" strokeWidth="2" /></svg></div>
        <div style={circle}><svg viewBox="0 0 24 24" width="55%" height="55%"><path d="M3 11l18-8-8 18-2-8z" fill="none" stroke="#fff" strokeWidth="2" strokeLinejoin="round" /></svg></div>
      </div>
      <div style={{ position: 'absolute', left: '0.9em', bottom: '2.6em', right: '4.5em', fontSize: '0.9em', lineHeight: 1.35 }}>
        <div style={{ fontWeight: 700 }}>@{INSTAGRAM}</div>
        <div style={{ opacity: 0.9 }}>Luxury homes tour · Delhi NCR</div>
      </div>
    </div>
  );
}

function StatusBar({ o }) {
  return (
    <motion.div
      style={{
        position: 'absolute', top: '1.25em', left: 0, right: 0, padding: '0 9%',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        color: '#fff', fontFamily: sans, fontSize: '0.95em', fontWeight: 600,
        zIndex: 4, pointerEvents: 'none', textShadow: '0 0 6px rgba(0,0,0,.35)',
        opacity: o,
      }}
    >
      <span>9:41</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35em' }}>
        <svg viewBox="0 0 18 12" style={{ width: '1.5em', height: '1em' }}>
          <rect x="0" y="8" width="3" height="4" rx="1" fill="#fff" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="1" fill="#fff" />
          <rect x="10" y="3" width="3" height="9" rx="1" fill="#fff" />
          <rect x="15" y="0" width="3" height="12" rx="1" fill="#fff" />
        </svg>
        <svg viewBox="0 0 27 12" style={{ width: '2.1em', height: '1em' }}>
          <rect x="0.5" y="0.5" width="22" height="11" rx="3.2" fill="none" stroke="#fff" opacity=".55" />
          <rect x="2" y="2" width="19" height="8" rx="2" fill="#fff" />
          <rect x="24" y="4" width="2" height="4" rx="1" fill="#fff" opacity=".6" />
        </svg>
      </span>
    </motion.div>
  );
}

const PHONE_RADIUS = '17% / 7.9%';
const PHONE_TITANIUM =
  'linear-gradient(135deg, #ffd9b5 0%, #f0a366 10%, #d2692a 24%, #8f3f12 42%, #5e2608 52%, #b4561b 66%, #ea9552 84%, #ffdcc0 100%)';
const PHONE_BRUSHED =
  'repeating-linear-gradient(90deg, rgba(255,255,255,.07) 0, rgba(255,255,255,.07) 1px, rgba(0,0,0,.07) 1px, rgba(0,0,0,.07) 2px)';

const PHONE_TURN_DEG = 30;
const IG_DELAY = 0.1;
const YT_DELAY = 0.7;
const BADGE_DUR = 1.8;

function CountUp({ to, run, suffix = '' }) {
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) => `${Math.round(v)}${suffix}`);
  useEffect(() => {
    if (!run) {
      mv.set(0);
      return undefined;
    }
    const controls = runAnimation(mv, to, { duration: 2.2, ease: outExpo, delay: 0.5 });
    return () => controls.stop();
  }, [run, to, mv]);
  return <motion.span>{text}</motion.span>;
}

function Badge({ icon, label, to, suffix, caption, show, small, from, delay = 0, style }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: from }}
      animate={show ? { opacity: 1, x: 0 } : { opacity: 0, x: from }}
      transition={{ duration: show ? BADGE_DUR : 0.5, delay: show ? delay : 0, ease: outExpo }}
      style={{ position: 'absolute', pointerEvents: 'none', ...style }}
    >
      <motion.div
        animate={show ? { y: [0, -4, 0] } : { y: 0 }}
        transition={
          show
            ? { duration: 5, repeat: Infinity, ease: 'easeInOut', delay: delay + 2 }
            : { duration: 0.3 }
        }
        style={{
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          gap: small ? 7 : 12,
          padding: small ? '7px 11px 7px 8px' : '11px 18px 11px 12px',
          borderRadius: small ? 13 : 18,
          color: '#fff',
          fontFamily: mont,
          whiteSpace: 'nowrap',
          background: 'linear-gradient(145deg, rgba(34,37,46,.97), rgba(14,16,21,.97))',
          border: '1px solid rgba(244,211,94,.38)',
          boxShadow:
            '0 18px 40px rgba(10,12,18,.38), 0 0 0 4px rgba(244,211,94,.06), inset 0 1px 0 rgba(255,255,255,.1)',
        }}
      >
        <div
          style={{
            width: small ? 30 : 42, height: small ? 30 : 42, borderRadius: '50%', flex: 'none',
            display: 'grid', placeItems: 'center',
            background: 'rgba(255,255,255,.06)', border: '1px solid rgba(244,211,94,.28)',
          }}
        >
          <Icon name={icon} size={small ? 18 : 24} />
        </div>
        <div style={{ lineHeight: 1.25, position: 'relative' }}>
          {!small && (
            <div style={{ fontSize: 10, opacity: 0.65, textTransform: 'uppercase', letterSpacing: '0.16em' }}>{label}</div>
          )}
          <div style={{ fontSize: small ? 12 : 16, fontWeight: 700, color: GOLD }}>
            <CountUp to={to} run={show} suffix={suffix} />
            {!small && <span style={{ fontSize: 11, fontWeight: 500, color: '#fff', opacity: 0.78, marginLeft: 6 }}>{caption}</span>}
          </div>
          {small && <div style={{ fontSize: 8, opacity: 0.75 }}>{caption}</div>}
        </div>
      </motion.div>
    </motion.div>
  );
}

const PH_IN = 0.42;
const PH_OUT = 0.62;
const PH_SHOW_ON = 0.55;

const PH_SLICES = 14;
const clamp01 = (v) => Math.min(1, Math.max(0, v));

const LAND_R = (19.3 - 0.633) / (9 - 0.633);

function Phone({ small, progress, zoom, turn }) {
  const [i, setI] = useState(0);
  const [show, setShow] = useState(false);
  const [zooming, setZooming] = useState(false);
  const [flat, setFlat] = useState(false);
  const wrapRef = useRef(null);

  const turned = !small && TURN_VH > 0;

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 40, damping: 24, mass: 1 });
  const smy = useSpring(my, { stiffness: 40, damping: 24, mass: 1 });

  const dxMV = useMotionValue(0);
  const dyMV = useMotionValue(0);
  const sMV = useMotionValue(1);

  useEffect(() => {
    if (zooming) {
      setI(1);
      return undefined;
    }
    const t = setInterval(() => setI((v) => (v + 1) % 2), 3300);
    return () => clearInterval(t);
  }, [zooming]);

  useEffect(() => {
    const unsub = progress.on('change', (v) =>
      setShow((prev) => (v > PH_SHOW_ON ? true : v < PH_IN ? false : prev))
    );
    return unsub;
  }, [progress]);

  useEffect(() => {
    const update = () => setZooming(zoom.get() > 0.01 || turn.get() > 0.01);
    update();
    const u1 = zoom.on('change', update);
    const u2 = turn.on('change', update);
    return () => { u1(); u2(); };
  }, [zoom, turn]);

  useEffect(() => {
    const update = (v) => setFlat(v > 0.3);
    update(zoom.get());
    return zoom.on('change', update);
  }, [zoom]);

  useEffect(() => {
    if (small) return undefined;
    const move = (e) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    const leave = () => { mx.set(0); my.set(0); };
    window.addEventListener('pointermove', move);
    document.addEventListener('pointerleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', leave);
    };
  }, [small, mx, my]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    const measure = () => {
      const op = el.offsetParent;
      if (!op) return;
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      if (!w || !h) return;
      const em = h * 0.0205;
      const sw = w - 1.6 * em;
      const sh = h - 1.6 * em;
      dxMV.set(op.offsetWidth / 2 - (el.offsetLeft + w / 2));
      dyMV.set(op.offsetHeight / 2 - (el.offsetTop + h / 2));
      const fillScale = turned
        ? Math.max(op.offsetWidth / sh, op.offsetHeight / sw)
        : Math.max(op.offsetWidth / sw, op.offsetHeight / sh);
      sMV.set(fillScale * 1.25);
    };
    measure();
    let ro;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(measure);
      ro.observe(el);
      if (el.offsetParent) ro.observe(el.offsetParent);
    }
    window.addEventListener('resize', measure);
    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [small, turned, dxMV, dyMV, sMV]);

  const deg = PHONE_TURN_DEG * (small ? 0.75 : 1);
  const scrollRotY = useTransform(progress, [PH_IN, PH_OUT], [-deg, 0]);
  const scrollRotX = useTransform(progress, [PH_IN, PH_OUT], [deg * 0.18, 0]);
  const turnScale = useTransform(progress, [PH_IN, PH_OUT], [0.93, 1]);

  const calm = useTransform([zoom, turn], ([z, t]) =>
    Math.max(0, 1 - Math.max(clamp01(z / 0.25), clamp01(t / 0.2)))
  );
  const rotY = useTransform([scrollRotY, smx, calm], ([a, b, c]) => (a + b * 9) * c);
  const rotX = useTransform([scrollRotX, smy, calm], ([a, b, c]) => (a - b * 6) * c);

  const turnRot = useTransform(turn, (t) => {
    const c = clamp01(t);
    return TURN_DEG * c * c * (3 - 2 * c);
  });
  const landO = useTransform(turn, [0.45, 0.8], [0, 1]);
  const statusO = useTransform(landO, (v) => 1 - v);

  const ease = useTransform(zoom, (z) => {
    const c = clamp01(z);
    return c * c * (3 - 2 * c);
  });
  const zx = useTransform([ease, dxMV], ([e, d]) => e * d);
  const zy = useTransform([ease, dyMV], ([e, d]) => e * d);
  const zs = useTransform([zoom, sMV], ([z, s]) => Math.pow(s, clamp01(z)));

  const fadeOut = useTransform([zoom, turn], ([z, t]) =>
    1 - Math.max(clamp01(z / 0.2), clamp01(t / 0.35))
  );
  // Rotate + zoom ek saath chalte hain, isliye screen thodi der se kaali hoti hai
  // (taaki ghoomi hui landscape image dikhe)
  const sceneO = useTransform(zoom, [0.5, 0.85], [0, 1]);

  const lightAngle = useTransform(rotY, (v) => 118 - v * 2.4);
  const glare = useMotionTemplate`linear-gradient(${lightAngle}deg, rgba(255,255,255,.34) 0%, rgba(255,255,255,.1) 16%, rgba(255,255,255,0) 38%, rgba(255,255,255,0) 72%, rgba(255,255,255,.07) 100%)`;
  const rimAngle = useTransform(rotY, (v) => 135 - v * 3);
  const frameBg = useMotionTemplate`linear-gradient(${rimAngle}deg, #ffd9b5 0%, #f0a366 10%, #d2692a 24%, #8f3f12 42%, #5e2608 52%, #b4561b 66%, #ea9552 84%, #ffdcc0 100%)`;
  const shadowX = useTransform(rotY, (v) => v * -0.9);

  const sideBtn = (side, top, height) => ({
    position: 'absolute',
    [side]: '-0.3em',
    top,
    height,
    width: '0.4em',
    borderRadius: '0.2em',
    background:
      side === 'left'
        ? 'linear-gradient(90deg, #7a3510, #e08a4a 45%, #fbc08a 60%, #8f3f12)'
        : 'linear-gradient(90deg, #8f3f12, #fbc08a 40%, #e08a4a 55%, #7a3510)',
    boxShadow: '0 0.1em 0.25em rgba(0,0,0,.35)',
    transform: 'translateZ(-0.6em)',
  });

  const height = small
    ? 'clamp(260px, calc(var(--vh) * 52), 380px)'
    : ABOUT.phoneHeight;

  return (
    <motion.div ref={wrapRef} style={{ position: 'relative', x: zx, y: zy, scale: zs }}>
      <motion.div
        animate={zooming ? { y: 0 } : { y: [0, -8, 0] }}
        transition={zooming ? { duration: 0.4 } : { duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'relative', justifySelf: 'center' }}
      >
        <motion.div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: fadeOut }}>
          <div
            style={{
              position: 'absolute', inset: '-22% -48%', pointerEvents: 'none',
              background: 'radial-gradient(closest-side, rgba(240,150,80,.22), rgba(240,150,80,0) 70%)',
            }}
          />
          <motion.div
            animate={{ scaleX: [1, 0.9, 1], opacity: [0.9, 0.65, 0.9] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute', left: '6%', right: '-6%', bottom: '-6%', height: '8%', x: shadowX,
              borderRadius: '50%', background: 'rgba(40, 24, 12, 0.32)', filter: 'blur(22px)', pointerEvents: 'none',
            }}
          />
          <motion.div
            animate={{ scaleX: [1, 0.94, 1] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute', left: '16%', right: '4%', bottom: '-3.5%', height: '3%', x: shadowX,
              borderRadius: '50%', background: 'rgba(20, 10, 4, 0.45)', filter: 'blur(8px)', pointerEvents: 'none',
            }}
          />
        </motion.div>

        <motion.div style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none', opacity: fadeOut }}>
          <Badge
            icon="ig" label="Instagram" to={169} suffix="k" caption="Followers"
            show={show} small={small} from={small ? -70 : -150} delay={IG_DELAY}
            style={{ top: small ? '6%' : '8%', left: 'calc(100% - 40px)', zIndex: 3 }}
          />
          <Badge
            icon="yt" label="YouTube" to={128} suffix="k+" caption="Subscribers"
            show={show} small={small} from={small ? -60 : 150} delay={YT_DELAY}
            style={{ bottom: small ? '14%' : '18%', right: 'calc(100% - 40px)', zIndex: 3 }}
          />
        </motion.div>

        <motion.div
          style={{
            position: 'relative', zIndex: 2, transformStyle: flat ? 'flat' : 'preserve-3d',
            transformPerspective: 1400, rotate: turnRot, rotateY: rotY, rotateX: rotX, scale: turnScale,
          }}
        >
          <div
            style={{
              '--ph': height,
              position: 'relative',
              height: 'var(--ph)',
              aspectRatio: '9 / 19.3',
              fontSize: 'calc(var(--ph) * 0.0205)',
              transformStyle: flat ? 'flat' : 'preserve-3d',
            }}
          >
            {!flat &&
              Array.from({ length: PH_SLICES }, (_, k) => (
                <div
                  key={k}
                  style={{
                    position: 'absolute', inset: 0, borderRadius: PHONE_RADIUS,
                    background: `hsl(22, 70%, ${54 - k * 2.2}%)`,
                    transform: `translateZ(${-(k + 1) * 0.19}em)`,
                    boxShadow: k % 2 ? 'none' : 'inset 0 0 0 0.05em rgba(255,214,176,.28)',
                  }}
                />
              ))}

            <div style={sideBtn('left', '13%', '3.2%')} />
            <div style={sideBtn('left', '19%', '6.5%')} />
            <div style={sideBtn('left', '27%', '6.5%')} />
            <div style={sideBtn('right', '22%', '10.5%')} />
            <div style={sideBtn('right', '60%', '7.5%')} />

            <motion.div
              style={{
                position: 'absolute', inset: 0, boxSizing: 'border-box', borderRadius: PHONE_RADIUS,
                background: frameBg, padding: '0.5em',
                boxShadow: '0 0.6em 1.4em rgba(60,24,6,.28)',
              }}
            >
              <div
                style={{
                  position: 'absolute', inset: 0, borderRadius: PHONE_RADIUS, pointerEvents: 'none',
                  background: PHONE_BRUSHED, mixBlendMode: 'overlay', opacity: 0.7,
                }}
              />

              <div
                style={{
                  position: 'relative', width: '100%', height: '100%', boxSizing: 'border-box',
                  borderRadius: '16.2% / 7.5%', background: '#000', padding: '0.3em',
                  boxShadow: '0 0 0 0.05em rgba(0,0,0,.65), inset 0 0 0 1px rgba(255,255,255,.07)',
                }}
              >
                <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '15% / 6.9%', overflow: 'hidden', background: '#000', isolation: 'isolate' }}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 28 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -28 }}
                      transition={{ duration: 0.55, ease: outSoft }}
                      style={fill}
                    >
                      {i === 0 ? <ProfileScreen /> : <ReelScreen />}
                    </motion.div>
                  </AnimatePresence>

                  {turned && (
                    <motion.div
                      style={{
                        position: 'absolute', top: '50%', left: '50%',
                        width: `${LAND_R * 100}%`, height: `${100 / LAND_R}%`,
                        x: '-50%', y: '-50%', rotate: 90,
                        opacity: landO, zIndex: 2, overflow: 'hidden', background: '#000', pointerEvents: 'none',
                      }}
                    >
                      <div style={{ ...fill, backgroundImage: `url(${HERO_IMG})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                      <div style={{ ...fill, background: 'linear-gradient(to bottom, rgba(0,0,0,.25), transparent 35%, transparent 60%, rgba(0,0,0,.65))' }} />
                      <div style={{ position: 'absolute', left: '4%', bottom: '8%', fontFamily: mont, color: '#fff', lineHeight: 1.35 }}>
                        <div style={{ fontWeight: 700, fontSize: '1.5em' }}>@{INSTAGRAM}</div>
                        <div style={{ opacity: 0.9, fontSize: '1.15em' }}>Luxury homes tour · Delhi NCR</div>
                      </div>
                    </motion.div>
                  )}

                  <motion.div
                    style={{ ...fill, zIndex: 3, opacity: sceneO, background: '#000', pointerEvents: 'none' }}
                  />

                  <StatusBar o={statusO} />

                  <div
                    style={{
                      position: 'absolute', top: '0.85em', left: '50%', transform: 'translateX(-50%)',
                      width: '31%', height: '2.05em', background: '#000', borderRadius: 999, zIndex: 5,
                      boxShadow: 'inset 0 0 0.35em rgba(255,255,255,.07)',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute', right: '11%', top: '50%', transform: 'translateY(-50%)',
                        width: '0.95em', height: '0.95em', borderRadius: '50%',
                        background: 'radial-gradient(circle at 35% 35%, #3d4f78 0%, #10131c 45%, #04050a 100%)',
                        boxShadow: '0 0 0 0.1em #0a0b10, inset 0 0 0.12em rgba(120,160,255,.35)',
                      }}
                    />
                  </div>

                  <div style={{ position: 'absolute', bottom: '0.55em', left: '50%', transform: 'translateX(-50%)', width: '34%', height: '0.36em', borderRadius: 999, background: 'rgba(255,255,255,.85)', zIndex: 4, pointerEvents: 'none' }} />

                  <motion.div style={{ position: 'absolute', inset: 0, zIndex: 6, pointerEvents: 'none', background: glare }} />
                  <div style={{ position: 'absolute', inset: 0, zIndex: 6, pointerEvents: 'none', background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 62%, rgba(0,0,0,.28) 100%)' }} />
                  <motion.div
                    animate={{ x: ['-140%', '340%'] }}
                    transition={{ duration: 2.4, ease: inOut, repeat: Infinity, repeatDelay: 3.6 }}
                    style={{
                      position: 'absolute', top: '-20%', bottom: '-20%', left: 0, width: '42%', rotate: 14,
                      zIndex: 7, pointerEvents: 'none',
                      background: 'linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.2) 50%, rgba(255,255,255,0) 100%)',
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  position: 'absolute', inset: 0, borderRadius: PHONE_RADIUS, pointerEvents: 'none',
                  boxShadow:
                    'inset 0 0 0 0.07em rgba(255,236,214,.6), inset 0.18em 0.22em 0.5em rgba(255,255,255,.3), inset -0.2em -0.25em 0.5em rgba(70,26,4,.45), inset 0 0 0.6em rgba(255,255,255,.12)',
                }}
              />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}


const PREMIUM_LAND = 'M1200.0 490.1 L1199.3 490.4 L1197.0 489.4 L1196.7 487.5 L1198.3 486.5 L1197.0 484.4 L1198.6 482.7 L1197.4 481.4 L1198.8 479.2 L1198.0 477.3 L1199.7 476.1 L1199.8 473.6 L1192.8 473.3 L1191.6 471.6 L1190.9 473.5 L1185.0 472.9 L1178.3 477.1 L1181.6 481.9 L1178.6 487.9 L1179.8 497.9 L1171.8 510.5 L1170.6 516.4 L1168.8 517.0 L1169.4 522.0 L1167.8 522.4 L1163.7 528.6 L1164.6 531.8 L1161.7 532.2 L1163.8 534.3 L1161.8 536.2 L1161.7 543.4 L1165.1 549.9 L1163.2 550.9 L1163.3 552.4 L1166.4 553.7 L1172.8 550.9 L1176.1 551.7 L1178.6 564.6 L1181.2 568.1 L1183.0 568.8 L1182.1 566.1 L1183.9 567.6 L1188.6 585.4 L1191.2 590.5 L1188.5 589.7 L1188.1 591.3 L1190.8 591.7 L1191.3 590.7 L1195.3 594.6 L1200.0 597.0 L1200.0 650.0 L1197.7 650.0 L1197.1 649.1 L1195.3 649.4 L1194.9 648.0 L1191.8 646.4 L1193.0 644.9 L1190.9 644.2 L1193.0 638.8 L1192.2 639.6 L1191.3 638.7 L1193.0 637.3 L1191.4 637.6 L1191.2 635.9 L1192.6 635.1 L1191.0 635.2 L1191.2 633.9 L1187.1 630.8 L1188.5 627.4 L1186.2 619.2 L1188.0 619.4 L1186.5 618.3 L1186.6 613.3 L1181.0 603.7 L1181.7 602.6 L1180.5 603.3 L1179.7 601.7 L1178.2 601.9 L1177.6 599.3 L1173.0 597.0 L1172.5 593.5 L1174.0 591.7 L1172.5 592.2 L1172.7 590.8 L1171.4 590.5 L1171.2 591.8 L1169.5 589.6 L1171.2 587.3 L1169.3 588.6 L1169.2 586.3 L1168.7 588.9 L1166.9 588.6 L1164.5 584.7 L1164.7 582.4 L1163.5 582.6 L1164.2 581.9 L1162.7 581.9 L1161.8 579.6 L1159.5 581.3 L1159.0 579.0 L1160.8 576.4 L1159.2 577.8 L1157.1 574.7 L1153.8 575.4 L1152.7 569.8 L1150.9 570.5 L1151.8 568.5 L1148.7 569.7 L1148.7 568.5 L1147.5 568.8 L1147.0 573.2 L1143.8 571.9 L1142.3 565.3 L1143.3 565.9 L1143.5 559.8 L1144.8 557.6 L1146.1 558.2 L1144.5 553.5 L1145.9 553.6 L1147.4 546.7 L1147.7 548.3 L1149.9 546.7 L1147.6 545.9 L1149.7 543.7 L1148.4 543.5 L1150.0 541.7 L1149.1 542.3 L1148.7 541.3 L1150.2 540.5 L1153.7 532.5 L1151.8 535.2 L1151.2 534.5 L1149.4 539.1 L1148.0 534.9 L1149.3 531.7 L1147.4 525.8 L1148.1 524.7 L1149.4 526.2 L1148.7 524.7 L1149.7 525.3 L1151.1 522.9 L1149.9 522.3 L1152.6 522.2 L1152.8 520.2 L1154.2 520.2 L1152.1 520.1 L1152.7 518.0 L1151.4 517.6 L1153.8 514.9 L1152.4 512.4 L1154.4 512.2 L1152.6 510.1 L1153.2 507.6 L1156.2 507.0 L1154.2 506.3 L1154.7 504.1 L1152.5 506.6 L1150.4 505.3 L1152.0 503.5 L1149.1 503.6 L1153.6 501.7 L1152.2 500.9 L1153.3 500.1 L1150.7 499.6 L1152.6 498.7 L1151.4 497.1 L1149.4 497.8 L1148.8 496.6 L1151.7 495.6 L1149.1 494.8 L1150.9 493.9 L1150.4 492.4 L1153.8 492.7 L1152.1 491.8 L1153.0 491.0 L1150.8 491.2 L1152.5 489.0 L1150.7 487.3 L1151.4 487.2 L1150.2 484.1 L1150.0 478.1 L1149.4 479.2 L1148.1 478.3 L1147.3 474.1 L1143.7 469.1 L1142.7 469.4 L1142.6 464.8 L1141.7 472.7 L1140.5 472.6 L1141.2 470.4 L1139.4 468.8 L1139.1 463.9 L1139.9 460.6 L1137.3 457.6 L1137.9 455.3 L1137.2 456.3 L1135.3 451.8 L1136.3 450.7 L1134.5 450.9 L1133.5 448.1 L1133.5 442.4 L1134.6 442.1 L1132.3 440.9 L1132.2 439.1 L1133.8 438.2 L1131.6 431.7 L1132.4 429.8 L1128.8 425.7 L1130.0 426.0 L1130.1 417.9 L1132.6 416.7 L1131.1 416.9 L1130.0 415.1 L1130.1 417.5 L1124.6 417.8 L1124.5 413.8 L1123.3 414.7 L1122.8 411.3 L1120.3 409.2 L1120.1 406.4 L1119.6 407.1 L1117.2 405.1 L1118.0 403.9 L1115.4 401.9 L1114.6 399.1 L1113.4 401.4 L1115.8 403.3 L1115.0 411.9 L1114.6 408.6 L1113.6 411.1 L1113.9 410.1 L1112.6 410.2 L1113.6 410.5 L1112.9 412.9 L1110.4 416.2 L1105.9 418.1 L1101.9 415.9 L1101.0 413.1 L1102.9 411.6 L1100.6 413.0 L1099.0 412.3 L1103.2 419.3 L1099.1 421.2 L1096.6 419.8 L1098.2 421.1 L1097.1 422.4 L1094.9 423.2 L1095.6 421.6 L1091.8 424.7 L1090.7 422.6 L1090.2 427.3 L1085.3 432.1 L1081.6 432.3 L1082.2 428.6 L1081.1 429.9 L1080.0 428.8 L1080.0 431.3 L1078.2 430.8 L1078.5 424.9 L1076.8 426.2 L1076.6 430.8 L1075.6 431.3 L1075.5 430.0 L1074.9 431.9 L1072.5 431.3 L1073.7 430.4 L1072.6 429.0 L1072.0 431.1 L1070.4 430.9 L1072.0 427.5 L1070.8 427.3 L1069.4 430.1 L1067.6 428.7 L1068.6 427.8 L1066.6 428.1 L1068.3 425.4 L1064.7 428.5 L1064.6 427.7 L1063.3 430.3 L1063.1 427.1 L1065.4 426.5 L1068.1 422.4 L1065.9 422.6 L1064.2 425.7 L1060.2 428.0 L1059.1 426.4 L1060.4 417.2 L1062.0 417.2 L1063.1 410.2 L1064.9 409.5 L1064.3 405.2 L1065.8 405.7 L1065.5 402.9 L1067.6 402.9 L1066.3 398.3 L1067.5 398.3 L1064.1 390.1 L1065.3 390.4 L1064.5 386.6 L1061.9 385.4 L1063.4 383.5 L1058.1 376.3 L1060.8 376.3 L1058.0 374.8 L1058.6 373.4 L1057.7 375.0 L1055.9 374.3 L1056.2 370.6 L1057.6 369.9 L1055.7 370.0 L1057.3 368.7 L1055.8 369.0 L1057.0 364.7 L1054.9 366.8 L1055.1 368.7 L1053.2 367.7 L1054.9 372.1 L1053.9 374.3 L1048.3 371.1 L1048.7 369.8 L1044.2 364.6 L1045.1 363.4 L1046.9 363.7 L1048.0 366.7 L1048.8 365.8 L1051.4 367.2 L1055.6 364.5 L1055.2 362.7 L1053.2 362.7 L1054.1 361.4 L1053.2 362.4 L1049.4 359.9 L1051.5 359.6 L1051.4 358.3 L1049.1 358.5 L1050.7 356.5 L1047.6 358.2 L1048.7 356.3 L1046.8 358.3 L1048.0 355.1 L1050.1 354.4 L1049.3 353.6 L1045.8 354.9 L1046.9 353.9 L1045.2 354.3 L1045.4 352.9 L1044.2 354.1 L1040.8 349.2 L1040.1 352.2 L1039.2 350.8 L1036.6 351.6 L1035.7 350.3 L1038.1 349.2 L1037.2 348.7 L1034.4 350.3 L1035.3 346.7 L1037.0 345.8 L1035.2 345.8 L1036.1 342.0 L1034.8 347.3 L1033.0 349.2 L1032.0 348.4 L1032.4 350.8 L1029.5 349.2 L1031.5 347.4 L1029.7 347.5 L1029.3 341.6 L1027.1 339.1 L1025.9 339.5 L1025.3 337.1 L1025.1 339.0 L1029.0 342.5 L1029.0 348.0 L1021.7 339.8 L1021.1 334.5 L1019.6 334.8 L1021.1 339.4 L1014.9 331.1 L1015.1 328.8 L1012.8 325.9 L1014.8 324.6 L1014.3 321.8 L1013.0 321.7 L1013.3 324.8 L1011.6 324.5 L1013.4 319.6 L1011.5 320.0 L1012.5 318.9 L1010.5 310.8 L1009.2 311.1 L1007.8 306.7 L1002.4 301.5 L998.5 302.4 L995.2 301.7 L992.6 305.1 L988.5 301.6 L986.6 301.5 L987.0 304.0 L990.3 306.7 L989.6 312.9 L985.3 315.7 L986.3 306.8 L983.4 304.5 L985.0 310.2 L981.5 314.3 L980.6 312.5 L976.4 319.4 L974.2 318.6 L975.4 316.3 L974.0 318.2 L972.8 317.7 L976.8 313.4 L972.9 315.9 L972.4 315.1 L974.2 312.7 L972.9 312.1 L973.7 312.7 L971.1 317.0 L970.4 308.5 L969.1 311.3 L970.0 313.6 L968.7 314.5 L969.9 317.6 L967.8 319.0 L965.5 318.5 L965.0 316.5 L963.5 316.8 L963.7 314.3 L962.7 315.9 L962.5 314.1 L962.2 317.5 L960.5 316.2 L961.2 320.2 L959.1 320.5 L959.3 316.7 L957.7 320.3 L956.3 320.4 L955.8 318.7 L953.8 319.2 L953.2 316.8 L952.1 316.2 L951.4 317.7 L953.8 322.4 L952.1 322.0 L952.3 323.2 L949.4 322.1 L948.8 319.9 L948.6 322.8 L948.0 321.6 L945.9 321.6 L947.1 315.4 L946.7 314.3 L945.2 314.5 L945.9 315.7 L944.3 314.3 L942.5 319.1 L941.8 316.7 L940.5 317.6 L940.4 322.9 L939.8 320.9 L939.2 323.3 L939.4 320.9 L936.7 320.7 L937.4 323.5 L936.1 323.9 L934.3 316.5 L935.4 312.9 L931.4 311.6 L935.0 313.8 L927.0 321.4 L918.1 324.1 L912.3 324.3 L908.5 328.0 L906.8 331.7 L909.8 337.6 L907.6 338.4 L910.3 338.6 L909.6 340.0 L911.8 339.5 L905.6 343.5 L904.8 342.9 L904.3 345.3 L906.0 345.9 L903.6 347.4 L906.2 346.4 L900.4 349.4 L898.4 352.8 L896.2 353.1 L897.3 353.7 L880.1 358.5 L881.2 358.4 L869.8 364.1 L870.7 364.5 L863.7 369.3 L864.7 369.3 L859.8 375.3 L854.6 380.1 L855.7 379.7 L850.3 383.5 L850.9 384.3 L839.1 389.5 L832.0 397.6 L819.1 403.4 L813.2 407.9 L812.1 410.9 L814.1 411.6 L813.8 408.8 L814.6 410.3 L813.2 416.8 L801.1 421.4 L801.0 420.4 L800.9 421.5 L797.7 420.2 L791.7 421.7 L789.4 427.7 L785.0 432.5 L784.1 431.7 L784.6 432.4 L782.7 432.7 L782.2 430.1 L779.5 429.2 L771.0 433.2 L766.5 444.3 L769.4 453.2 L768.4 453.8 L769.6 453.6 L767.7 459.6 L768.1 463.1 L770.8 468.3 L772.7 477.6 L768.8 492.8 L762.9 500.7 L760.5 507.5 L762.0 513.3 L760.6 513.0 L762.1 513.4 L762.6 516.4 L763.0 532.8 L761.2 533.5 L758.1 531.8 L750.9 533.7 L749.6 535.8 L750.4 537.8 L742.8 548.1 L744.0 550.8 L748.7 551.9 L741.9 552.5 L729.6 556.8 L726.7 561.6 L728.3 561.1 L725.6 568.8 L714.6 574.3 L710.0 573.4 L703.7 569.2 L694.1 559.0 L696.5 557.3 L693.9 558.4 L693.0 554.0 L691.6 552.5 L692.2 554.5 L689.9 549.8 L688.4 538.0 L687.7 539.1 L687.1 535.0 L686.0 535.1 L684.1 528.5 L681.1 524.1 L681.9 523.4 L680.9 524.0 L680.1 517.7 L674.9 511.2 L673.3 506.8 L668.6 502.0 L666.2 501.4 L658.5 485.9 L655.8 476.5 L655.2 471.1 L656.3 471.0 L654.8 470.5 L650.2 459.1 L652.1 459.8 L650.1 459.0 L647.2 451.1 L643.8 450.0 L644.8 448.4 L643.8 448.7 L639.6 444.2 L640.5 442.8 L639.3 439.6 L636.9 438.1 L639.0 437.8 L637.0 437.2 L637.8 436.4 L636.6 436.6 L635.9 434.8 L637.0 433.6 L635.9 434.3 L633.7 429.5 L630.1 426.2 L629.5 420.2 L628.3 420.1 L630.4 419.5 L628.3 419.8 L627.3 417.7 L627.7 416.7 L628.2 418.3 L629.9 417.9 L627.3 416.0 L629.0 416.2 L627.4 415.3 L627.9 411.7 L626.9 412.1 L626.4 410.6 L627.5 409.1 L626.6 408.6 L627.4 407.8 L624.6 403.1 L626.9 403.2 L624.2 401.2 L625.1 400.5 L623.6 398.2 L625.2 397.6 L623.5 397.2 L623.4 393.1 L621.3 390.9 L622.6 390.2 L621.1 390.2 L619.3 386.0 L620.0 384.8 L622.8 387.4 L622.5 384.1 L621.3 385.1 L619.1 383.5 L618.8 380.0 L620.8 381.3 L617.7 377.1 L618.0 375.1 L619.4 374.7 L621.0 376.7 L620.5 373.9 L618.8 373.3 L622.1 371.0 L620.7 371.4 L620.4 367.9 L619.8 370.7 L616.7 373.4 L617.2 368.1 L616.1 368.6 L617.4 366.7 L616.2 367.9 L616.3 365.8 L618.9 366.1 L616.1 365.0 L615.4 362.9 L618.4 361.7 L615.1 361.6 L613.6 356.0 L613.8 354.1 L615.4 353.9 L615.6 347.5 L618.6 343.0 L617.5 339.1 L619.2 338.7 L617.1 338.1 L616.2 335.8 L617.6 334.8 L615.7 335.6 L615.2 334.3 L615.1 333.3 L617.6 333.7 L617.1 332.6 L614.6 332.7 L616.3 330.9 L613.2 332.8 L613.2 330.4 L615.4 330.6 L612.4 328.7 L615.8 326.0 L613.4 326.0 L614.1 325.0 L617.3 321.9 L619.2 321.7 L611.2 322.0 L612.8 317.5 L615.5 316.2 L611.1 317.6 L610.5 316.2 L612.1 311.9 L615.7 312.5 L618.8 310.8 L615.5 311.4 L610.9 310.1 L608.9 311.9 L608.0 309.6 L606.8 310.0 L606.2 313.8 L603.8 315.3 L605.1 317.1 L603.4 316.5 L605.2 317.4 L605.2 319.2 L604.4 318.4 L603.4 319.2 L606.3 322.6 L601.8 328.4 L602.3 330.6 L589.9 335.1 L588.5 336.7 L575.6 340.0 L561.8 333.3 L536.6 310.0 L539.3 306.8 L538.7 308.5 L541.9 307.9 L541.2 310.0 L542.6 311.0 L547.9 309.5 L548.5 307.8 L549.8 309.7 L551.7 309.7 L553.0 306.9 L554.7 308.3 L558.3 305.6 L562.2 305.6 L567.9 297.7 L564.6 298.2 L563.2 296.1 L563.3 298.0 L561.3 297.2 L560.7 298.9 L556.2 298.8 L552.6 302.0 L547.3 301.3 L545.2 300.5 L545.4 299.3 L545.2 300.5 L542.0 300.2 L530.3 294.0 L532.1 294.8 L529.2 292.9 L531.3 291.5 L529.1 290.7 L527.8 288.0 L526.5 288.2 L526.9 286.9 L526.0 287.7 L528.6 283.8 L533.8 280.7 L527.9 283.3 L526.2 283.5 L526.1 281.9 L525.3 286.0 L522.7 286.8 L522.9 285.5 L522.3 286.6 L520.8 285.5 L524.5 283.6 L522.2 284.6 L521.5 281.7 L524.4 279.2 L520.8 281.5 L518.9 281.7 L518.0 280.3 L517.6 282.9 L514.5 280.9 L515.4 279.0 L513.6 282.1 L510.9 280.6 L511.6 282.4 L509.6 282.0 L509.9 280.2 L509.5 281.4 L507.3 280.6 L507.9 279.4 L506.5 280.2 L507.3 279.1 L505.4 279.5 L506.1 277.7 L505.6 278.5 L504.7 277.6 L506.5 277.5 L505.7 276.3 L504.2 277.1 L502.9 274.4 L504.7 274.2 L502.4 273.0 L505.2 272.6 L504.3 271.3 L502.5 272.1 L503.7 270.1 L502.0 270.8 L502.6 268.7 L501.8 269.4 L500.5 268.0 L503.0 267.9 L503.5 266.8 L499.8 266.9 L502.6 264.2 L498.1 263.6 L498.4 264.5 L494.8 262.7 L489.5 263.1 L491.4 256.7 L487.2 253.3 L488.5 252.6 L485.3 248.5 L480.8 248.7 L477.5 251.6 L482.9 249.8 L486.4 251.0 L485.5 251.6 L486.7 252.5 L481.8 251.3 L468.5 253.5 L461.7 252.7 L459.2 254.3 L450.4 253.5 L447.8 255.2 L448.9 256.5 L446.5 257.1 L446.0 255.0 L442.8 255.6 L436.4 253.8 L436.0 252.7 L439.0 251.8 L436.9 250.8 L433.0 252.3 L435.5 252.4 L435.7 254.0 L426.2 253.2 L423.1 254.2 L424.1 256.2 L417.7 255.0 L413.7 256.1 L404.3 255.0 L400.4 256.8 L401.1 258.2 L398.6 258.0 L399.8 257.6 L398.8 256.2 L395.9 256.0 L394.2 257.1 L395.1 258.2 L391.0 258.2 L388.1 259.9 L388.6 257.1 L384.3 256.6 L384.4 255.6 L382.0 256.6 L381.1 258.9 L364.4 254.7 L364.5 252.4 L362.8 251.7 L360.1 253.0 L361.4 254.7 L358.1 253.8 L358.2 252.5 L355.9 254.0 L349.6 253.4 L349.4 253.6 L338.4 250.4 L339.1 251.4 L336.5 251.9 L336.5 250.7 L334.1 250.8 L333.6 252.3 L336.1 251.8 L332.9 252.5 L322.0 248.1 L319.7 248.2 L319.8 249.1 L316.7 248.0 L313.0 249.8 L309.3 247.0 L305.4 248.2 L306.7 247.3 L305.0 246.2 L296.2 245.5 L293.5 240.5 L294.3 238.3 L291.2 234.3 L290.4 226.8 L287.9 223.6 L289.1 222.5 L288.1 223.2 L286.8 220.7 L282.9 220.2 L283.0 219.2 L277.4 218.9 L271.5 220.1 L267.9 222.5 L261.5 223.2 L258.6 227.2 L253.6 226.9 L244.1 232.2 L236.1 230.4 L233.6 227.8 L222.0 228.4 L217.1 225.7 L216.5 223.3 L200.6 217.5 L198.1 215.8 L200.1 214.5 L195.2 210.9 L190.3 209.8 L186.9 207.2 L180.1 207.5 L173.8 205.7 L167.5 195.2 L166.1 189.2 L164.7 188.2 L165.1 189.1 L163.2 189.0 L161.6 187.1 L162.0 185.8 L163.7 187.0 L163.9 184.4 L158.6 183.4 L158.4 177.2 L147.9 168.4 L146.8 163.8 L143.6 163.3 L135.6 167.1 L134.5 164.6 L129.2 164.6 L129.0 162.3 L128.0 163.3 L123.0 160.1 L128.6 160.8 L129.9 159.0 L127.5 157.8 L125.8 159.3 L125.6 157.6 L122.1 157.8 L125.3 159.2 L119.8 161.2 L123.0 163.7 L121.7 167.0 L117.1 166.1 L117.1 168.1 L112.9 167.2 L115.4 168.4 L113.2 168.7 L107.6 166.5 L103.0 167.1 L107.3 175.6 L102.8 175.0 L97.3 178.8 L100.3 178.5 L100.4 179.8 L103.3 178.4 L105.5 179.2 L106.9 186.0 L109.6 189.8 L111.7 190.5 L111.5 193.0 L114.7 196.7 L116.3 202.7 L119.9 204.4 L118.9 205.2 L121.7 207.4 L121.8 208.8 L120.9 209.5 L121.0 207.7 L120.0 208.9 L120.6 207.5 L119.6 209.7 L121.7 210.2 L121.0 211.7 L129.3 213.1 L130.5 215.1 L126.8 215.3 L129.8 215.7 L128.6 217.1 L130.8 216.9 L130.8 219.6 L132.7 219.3 L131.9 220.7 L135.1 220.9 L134.4 219.9 L136.2 219.6 L138.2 223.5 L144.7 226.1 L148.2 229.6 L144.6 227.4 L145.9 232.7 L148.2 233.5 L149.0 231.9 L149.5 234.9 L148.1 240.7 L145.5 237.7 L144.9 241.7 L147.1 241.7 L150.3 248.6 L147.7 246.2 L148.1 247.1 L153.1 252.3 L152.7 250.4 L155.0 252.4 L156.5 259.1 L160.8 265.3 L162.8 263.7 L160.5 250.7 L162.4 251.3 L161.3 248.9 L162.3 247.9 L163.1 251.1 L165.0 248.8 L163.3 246.8 L164.1 245.0 L165.2 245.6 L165.3 241.7 L170.8 238.4 L173.0 239.5 L173.9 242.0 L177.5 243.0 L177.9 245.4 L177.6 244.2 L176.4 245.9 L177.8 246.6 L176.0 247.1 L177.0 247.8 L175.4 250.5 L176.2 254.4 L178.1 254.8 L178.5 259.6 L173.2 267.5 L172.6 266.4 L170.1 266.6 L172.0 267.4 L171.8 269.2 L173.8 266.9 L176.0 267.9 L172.2 270.6 L171.7 273.1 L174.7 272.5 L177.8 273.9 L178.0 271.5 L178.7 274.8 L179.4 273.5 L180.1 274.7 L181.7 273.7 L182.1 278.4 L184.6 279.5 L186.7 278.8 L188.5 280.3 L188.3 279.1 L192.6 278.9 L198.5 274.9 L200.0 276.3 L209.9 275.5 L212.8 277.1 L216.1 276.3 L219.5 277.9 L229.5 276.3 L232.0 275.0 L229.6 274.2 L230.6 272.6 L232.2 274.0 L231.1 272.6 L233.3 273.0 L232.6 274.6 L237.0 273.3 L237.9 271.4 L234.1 270.2 L235.3 268.9 L238.9 270.7 L237.9 269.9 L239.9 269.8 L238.4 269.0 L240.2 268.9 L242.3 263.5 L243.1 264.3 L243.4 263.0 L249.7 259.8 L258.0 252.7 L259.8 249.2 L259.6 250.5 L261.3 250.2 L264.8 246.8 L268.2 245.7 L273.3 236.8 L273.6 237.8 L276.5 237.9 L275.3 237.7 L275.6 236.1 L276.7 236.7 L275.7 235.7 L276.7 234.3 L278.4 235.4 L277.2 236.2 L279.2 237.1 L278.0 237.9 L279.1 239.0 L276.9 237.8 L275.7 238.6 L275.9 239.7 L278.9 239.9 L277.0 240.8 L278.5 242.5 L274.5 248.3 L276.6 250.3 L277.5 262.6 L281.9 269.6 L293.4 279.8 L316.5 285.8 L322.0 285.4 L325.9 287.4 L341.6 305.7 L347.5 305.8 L347.7 311.6 L338.2 326.3 L332.3 329.4 L327.0 334.4 L324.1 338.5 L325.7 339.0 L322.5 341.2 L321.1 345.2 L319.6 346.5 L314.6 345.6 L315.9 342.1 L314.4 341.5 L307.1 348.4 L303.6 358.2 L307.1 371.4 L292.2 373.6 L285.5 376.1 L282.1 379.3 L280.4 387.7 L276.2 391.5 L268.7 391.3 L257.1 393.4 L252.9 398.8 L254.6 401.2 L253.7 404.2 L248.7 408.5 L244.1 409.8 L240.5 408.1 L228.6 408.8 L219.0 413.3 L212.4 413.9 L196.2 419.0 L191.8 422.5 L189.4 427.1 L190.3 434.4 L173.1 441.4 L154.8 445.3 L148.6 448.7 L143.4 448.6 L131.2 452.4 L125.7 455.0 L124.2 458.3 L117.9 463.5 L107.4 464.9 L103.0 463.4 L90.8 470.8 L76.4 474.9 L55.0 476.4 L49.3 481.8 L44.1 483.3 L42.2 487.5 L40.8 487.0 L41.4 485.6 L38.4 486.7 L39.8 487.3 L38.8 488.0 L32.9 486.3 L29.4 489.0 L19.9 490.4 L12.4 487.5 L9.6 488.9 L10.2 486.1 L5.0 478.1 L5.9 470.1 L0.0 456.5 L0.0 455.8 L0.4 456.1 L0.0 455.1 L0.0 0.0 L1200.0 0.0 L1200.0 490.1 Z M1194.2 650.0 L1194.2 649.8 L1196.9 649.2 L1197.6 650.0 L1194.2 650.0 Z M0.0 484.8 L0.1 484.7 L6.8 492.6 L8.6 498.4 L7.8 501.6 L3.7 502.3 L1.1 505.0 L0.0 505.2 L0.0 484.8 Z M0.0 508.8 L3.2 508.6 L4.9 511.3 L10.2 512.7 L10.5 515.9 L18.5 525.0 L26.9 530.7 L32.6 531.6 L40.4 531.0 L58.1 522.5 L71.2 525.9 L75.9 524.7 L91.3 516.7 L97.3 518.3 L106.6 517.6 L114.4 514.2 L123.3 515.5 L133.0 513.7 L136.0 511.5 L150.4 509.1 L154.9 506.7 L156.8 503.2 L161.3 501.7 L171.5 504.5 L167.3 514.1 L167.5 516.8 L169.3 517.3 L168.0 520.8 L169.1 527.9 L166.0 530.8 L170.4 530.5 L169.2 528.1 L174.1 530.3 L173.3 531.8 L169.5 530.7 L163.5 532.7 L162.0 549.4 L158.5 553.3 L157.9 556.0 L153.5 559.8 L147.5 572.1 L141.2 577.1 L141.2 580.5 L128.5 599.1 L123.2 613.0 L102.7 641.1 L93.3 650.0 L0.0 650.0 L0.0 508.8 Z M1102.4 650.0 L1099.6 647.2 L1097.0 646.4 L1087.0 637.7 L1080.2 626.2 L1080.6 620.6 L1084.7 619.2 L1086.2 620.2 L1088.6 619.6 L1094.2 621.9 L1098.2 625.8 L1104.7 627.4 L1116.8 626.4 L1121.3 628.7 L1127.7 626.7 L1135.9 633.3 L1138.3 638.5 L1137.5 640.1 L1139.3 639.6 L1143.9 642.0 L1143.2 646.1 L1141.1 646.8 L1141.2 648.4 L1143.1 647.5 L1144.1 649.2 L1145.9 648.4 L1148.9 649.7 L1149.4 650.0 L1102.4 650.0 Z M770.8 612.9 L770.8 612.9 L766.7 609.3 L762.7 597.9 L761.8 583.1 L759.2 572.0 L761.0 569.1 L760.1 575.5 L761.9 576.3 L761.1 571.4 L764.7 562.3 L763.7 558.4 L766.9 556.5 L768.2 551.7 L766.6 549.9 L769.4 548.2 L766.6 546.0 L771.5 548.8 L773.8 548.1 L763.6 543.1 L769.8 541.7 L782.3 551.7 L783.4 555.2 L790.9 563.6 L790.0 567.5 L793.5 566.6 L795.9 574.8 L797.7 575.9 L796.8 577.7 L798.3 577.2 L802.6 583.5 L804.4 593.9 L800.8 603.7 L792.9 609.3 L777.8 614.4 L770.8 612.9 Z M227.6 495.4 L227.5 495.4 L218.4 495.1 L213.2 491.4 L217.3 488.2 L220.3 488.4 L222.9 490.3 L229.8 488.4 L238.8 491.1 L227.6 495.4 Z M1028.1 490.2 L1028.1 490.1 L1030.2 489.6 L1034.0 492.4 L1032.9 494.0 L1030.5 492.9 L1032.2 495.6 L1028.4 495.4 L1028.1 490.2 Z M268.9 227.8 L268.8 227.8 L253.9 230.9 L253.8 229.2 L264.6 226.8 L263.8 223.7 L266.4 224.8 L272.1 222.9 L274.7 223.5 L268.9 227.8 Z M1031.0 482.9 L1031.0 482.9 L1031.4 475.4 L1035.3 472.2 L1034.8 474.9 L1036.5 476.8 L1033.7 476.6 L1036.0 478.0 L1035.3 481.8 L1033.9 482.7 L1032.3 481.2 L1033.4 483.5 L1032.5 483.0 L1031.9 485.1 L1030.4 484.5 L1031.0 482.9 Z M1029.8 501.5 L1029.7 501.5 L1028.7 502.8 L1030.3 503.0 L1029.6 507.0 L1027.7 508.0 L1029.6 507.8 L1028.6 511.2 L1024.6 504.3 L1025.6 502.5 L1026.5 504.3 L1028.3 497.0 L1029.8 501.5 Z';
const PREMIUM_COAST = 'M1200.0 490.1 L1199.3 490.4 L1197.0 489.4 L1196.7 487.5 L1198.3 486.5 L1197.0 484.4 L1198.6 482.7 L1197.4 481.4 L1198.8 479.2 L1198.0 477.3 L1199.7 476.1 L1199.8 473.6 L1192.8 473.3 L1191.6 471.6 L1190.9 473.5 L1185.0 472.9 L1178.3 477.1 L1181.6 481.9 L1178.6 487.9 L1179.8 497.9 L1171.8 510.5 L1170.6 516.4 L1168.8 517.0 L1169.4 522.0 L1167.8 522.4 L1163.7 528.6 L1164.6 531.8 L1161.7 532.2 L1163.8 534.3 L1161.8 536.2 L1161.7 543.4 L1165.1 549.9 L1163.2 550.9 L1163.3 552.4 L1166.4 553.7 L1172.8 550.9 L1176.1 551.7 L1178.6 564.6 L1181.2 568.1 L1183.0 568.8 L1182.1 566.1 L1183.9 567.6 L1188.6 585.4 L1191.2 590.5 L1188.5 589.7 L1188.1 591.3 L1190.8 591.7 L1191.3 590.7 L1195.3 594.6 L1200.0 597.0 M1194.2 650.0 L1194.2 649.8 L1196.9 649.2 L1197.6 650.0 M1197.7 650.0 L1197.1 649.1 L1195.3 649.4 L1194.9 648.0 L1191.8 646.4 L1193.0 644.9 L1190.9 644.2 L1193.0 638.8 L1192.2 639.6 L1191.3 638.7 L1193.0 637.3 L1191.4 637.6 L1191.2 635.9 L1192.6 635.1 L1191.0 635.2 L1191.2 633.9 L1187.1 630.8 L1188.5 627.4 L1186.2 619.2 L1188.0 619.4 L1186.5 618.3 L1186.6 613.3 L1181.0 603.7 L1181.7 602.6 L1180.5 603.3 L1179.7 601.7 L1178.2 601.9 L1177.6 599.3 L1173.0 597.0 L1172.5 593.5 L1174.0 591.7 L1172.5 592.2 L1172.7 590.8 L1171.4 590.5 L1171.2 591.8 L1169.5 589.6 L1171.2 587.3 L1169.3 588.6 L1169.2 586.3 L1168.7 588.9 L1166.9 588.6 L1164.5 584.7 L1164.7 582.4 L1163.5 582.6 L1164.2 581.9 L1162.7 581.9 L1161.8 579.6 L1159.5 581.3 L1159.0 579.0 L1160.8 576.4 L1159.2 577.8 L1157.1 574.7 L1153.8 575.4 L1152.7 569.8 L1150.9 570.5 L1151.8 568.5 L1148.7 569.7 L1148.7 568.5 L1147.5 568.8 L1147.0 573.2 L1143.8 571.9 L1142.3 565.3 L1143.3 565.9 L1143.5 559.8 L1144.8 557.6 L1146.1 558.2 L1144.5 553.5 L1145.9 553.6 L1147.4 546.7 L1147.7 548.3 L1149.9 546.7 L1147.6 545.9 L1149.7 543.7 L1148.4 543.5 L1150.0 541.7 L1149.1 542.3 L1148.7 541.3 L1150.2 540.5 L1153.7 532.5 L1151.8 535.2 L1151.2 534.5 L1149.4 539.1 L1148.0 534.9 L1149.3 531.7 L1147.4 525.8 L1148.1 524.7 L1149.4 526.2 L1148.7 524.7 L1149.7 525.3 L1151.1 522.9 L1149.9 522.3 L1152.6 522.2 L1152.8 520.2 L1154.2 520.2 L1152.1 520.1 L1152.7 518.0 L1151.4 517.6 L1153.8 514.9 L1152.4 512.4 L1154.4 512.2 L1152.6 510.1 L1153.2 507.6 L1156.2 507.0 L1154.2 506.3 L1154.7 504.1 L1152.5 506.6 L1150.4 505.3 L1152.0 503.5 L1149.1 503.6 L1153.6 501.7 L1152.2 500.9 L1153.3 500.1 L1150.7 499.6 L1152.6 498.7 L1151.4 497.1 L1149.4 497.8 L1148.8 496.6 L1151.7 495.6 L1149.1 494.8 L1150.9 493.9 L1150.4 492.4 L1153.8 492.7 L1152.1 491.8 L1153.0 491.0 L1150.8 491.2 L1152.5 489.0 L1150.7 487.3 L1151.4 487.2 L1150.2 484.1 L1150.0 478.1 L1149.4 479.2 L1148.1 478.3 L1147.3 474.1 L1143.7 469.1 L1142.7 469.4 L1142.6 464.8 L1141.7 472.7 L1140.5 472.6 L1141.2 470.4 L1139.4 468.8 L1139.1 463.9 L1139.9 460.6 L1137.3 457.6 L1137.9 455.3 L1137.2 456.3 L1135.3 451.8 L1136.3 450.7 L1134.5 450.9 L1133.5 448.1 L1133.5 442.4 L1134.6 442.1 L1132.3 440.9 L1132.2 439.1 L1133.8 438.2 L1131.6 431.7 L1132.4 429.8 L1128.8 425.7 L1130.0 426.0 L1130.1 417.9 L1132.6 416.7 L1131.1 416.9 L1130.0 415.1 L1130.1 417.5 L1124.6 417.8 L1124.5 413.8 L1123.3 414.7 L1122.8 411.3 L1120.3 409.2 L1120.1 406.4 L1119.6 407.1 L1117.2 405.1 L1118.0 403.9 L1115.4 401.9 L1114.6 399.1 L1113.4 401.4 L1115.8 403.3 L1115.0 411.9 L1114.6 408.6 L1113.6 411.1 L1113.9 410.1 L1112.6 410.2 L1113.6 410.5 L1112.9 412.9 L1110.4 416.2 L1105.9 418.1 L1101.9 415.9 L1101.0 413.1 L1102.9 411.6 L1100.6 413.0 L1099.0 412.3 L1103.2 419.3 L1099.1 421.2 L1096.6 419.8 L1098.2 421.1 L1097.1 422.4 L1094.9 423.2 L1095.6 421.6 L1091.8 424.7 L1090.7 422.6 L1090.2 427.3 L1085.3 432.1 L1081.6 432.3 L1082.2 428.6 L1081.1 429.9 L1080.0 428.8 L1080.0 431.3 L1078.2 430.8 L1078.5 424.9 L1076.8 426.2 L1076.6 430.8 L1075.6 431.3 L1075.5 430.0 L1074.9 431.9 L1072.5 431.3 L1073.7 430.4 L1072.6 429.0 L1072.0 431.1 L1070.4 430.9 L1072.0 427.5 L1070.8 427.3 L1069.4 430.1 L1067.6 428.7 L1068.6 427.8 L1066.6 428.1 L1068.3 425.4 L1064.7 428.5 L1064.6 427.7 L1063.3 430.3 L1063.1 427.1 L1065.4 426.5 L1068.1 422.4 L1065.9 422.6 L1064.2 425.7 L1060.2 428.0 L1059.1 426.4 L1060.4 417.2 L1062.0 417.2 L1063.1 410.2 L1064.9 409.5 L1064.3 405.2 L1065.8 405.7 L1065.5 402.9 L1067.6 402.9 L1066.3 398.3 L1067.5 398.3 L1064.1 390.1 L1065.3 390.4 L1064.5 386.6 L1061.9 385.4 L1063.4 383.5 L1058.1 376.3 L1060.8 376.3 L1058.0 374.8 L1058.6 373.4 L1057.7 375.0 L1055.9 374.3 L1056.2 370.6 L1057.6 369.9 L1055.7 370.0 L1057.3 368.7 L1055.8 369.0 L1057.0 364.7 L1054.9 366.8 L1055.1 368.7 L1053.2 367.7 L1054.9 372.1 L1053.9 374.3 L1048.3 371.1 L1048.7 369.8 L1044.2 364.6 L1045.1 363.4 L1046.9 363.7 L1048.0 366.7 L1048.8 365.8 L1051.4 367.2 L1055.6 364.5 L1055.2 362.7 L1053.2 362.7 L1054.1 361.4 L1053.2 362.4 L1049.4 359.9 L1051.5 359.6 L1051.4 358.3 L1049.1 358.5 L1050.7 356.5 L1047.6 358.2 L1048.7 356.3 L1046.8 358.3 L1048.0 355.1 L1050.1 354.4 L1049.3 353.6 L1045.8 354.9 L1046.9 353.9 L1045.2 354.3 L1045.4 352.9 L1044.2 354.1 L1040.8 349.2 L1040.1 352.2 L1039.2 350.8 L1036.6 351.6 L1035.7 350.3 L1038.1 349.2 L1037.2 348.7 L1034.4 350.3 L1035.3 346.7 L1037.0 345.8 L1035.2 345.8 L1036.1 342.0 L1034.8 347.3 L1033.0 349.2 L1032.0 348.4 L1032.4 350.8 L1029.5 349.2 L1031.5 347.4 L1029.7 347.5 L1029.3 341.6 L1027.1 339.1 L1025.9 339.5 L1025.3 337.1 L1025.1 339.0 L1029.0 342.5 L1029.0 348.0 L1021.7 339.8 L1021.1 334.5 L1019.6 334.8 L1021.1 339.4 L1014.9 331.1 L1015.1 328.8 L1012.8 325.9 L1014.8 324.6 L1014.3 321.8 L1013.0 321.7 L1013.3 324.8 L1011.6 324.5 L1013.4 319.6 L1011.5 320.0 L1012.5 318.9 L1010.5 310.8 L1009.2 311.1 L1007.8 306.7 L1002.4 301.5 L998.5 302.4 L995.2 301.7 L992.6 305.1 L988.5 301.6 L986.6 301.5 L987.0 304.0 L990.3 306.7 L989.6 312.9 L985.3 315.7 L986.3 306.8 L983.4 304.5 L985.0 310.2 L981.5 314.3 L980.6 312.5 L976.4 319.4 L974.2 318.6 L975.4 316.3 L974.0 318.2 L972.8 317.7 L976.8 313.4 L972.9 315.9 L972.4 315.1 L974.2 312.7 L972.9 312.1 L973.7 312.7 L971.1 317.0 L970.4 308.5 L969.1 311.3 L970.0 313.6 L968.7 314.5 L969.9 317.6 L967.8 319.0 L965.5 318.5 L965.0 316.5 L963.5 316.8 L963.7 314.3 L962.7 315.9 L962.5 314.1 L962.2 317.5 L960.5 316.2 L961.2 320.2 L959.1 320.5 L959.3 316.7 L957.7 320.3 L956.3 320.4 L955.8 318.7 L953.8 319.2 L953.2 316.8 L952.1 316.2 L951.4 317.7 L953.8 322.4 L952.1 322.0 L952.3 323.2 L949.4 322.1 L948.8 319.9 L948.6 322.8 L948.0 321.6 L945.9 321.6 L947.1 315.4 L946.7 314.3 L945.2 314.5 L945.9 315.7 L944.3 314.3 L942.5 319.1 L941.8 316.7 L940.5 317.6 L940.4 322.9 L939.8 320.9 L939.2 323.3 L939.4 320.9 L936.7 320.7 L937.4 323.5 L936.1 323.9 L934.3 316.5 L935.4 312.9 L931.4 311.6 L935.0 313.8 L927.0 321.4 L918.1 324.1 L912.3 324.3 L908.5 328.0 L906.8 331.7 L909.8 337.6 L907.6 338.4 L910.3 338.6 L909.6 340.0 L911.8 339.5 L905.6 343.5 L904.8 342.9 L904.3 345.3 L906.0 345.9 L903.6 347.4 L906.2 346.4 L900.4 349.4 L898.4 352.8 L896.2 353.1 L897.3 353.7 L880.1 358.5 L881.2 358.4 L869.8 364.1 L870.7 364.5 L863.7 369.3 L864.7 369.3 L859.8 375.3 L854.6 380.1 L855.7 379.7 L850.3 383.5 L850.9 384.3 L839.1 389.5 L832.0 397.6 L819.1 403.4 L813.2 407.9 L812.1 410.9 L814.1 411.6 L813.8 408.8 L814.6 410.3 L813.2 416.8 L801.1 421.4 L801.0 420.4 L800.9 421.5 L797.7 420.2 L791.7 421.7 L789.4 427.7 L785.0 432.5 L784.1 431.7 L784.6 432.4 L782.7 432.7 L782.2 430.1 L779.5 429.2 L771.0 433.2 L766.5 444.3 L769.4 453.2 L768.4 453.8 L769.6 453.6 L767.7 459.6 L768.1 463.1 L770.8 468.3 L772.7 477.6 L768.8 492.8 L762.9 500.7 L760.5 507.5 L762.0 513.3 L760.6 513.0 L762.1 513.4 L762.6 516.4 L763.0 532.8 L761.2 533.5 L758.1 531.8 L750.9 533.7 L749.6 535.8 L750.4 537.8 L742.8 548.1 L744.0 550.8 L748.7 551.9 L741.9 552.5 L729.6 556.8 L726.7 561.6 L728.3 561.1 L725.6 568.8 L714.6 574.3 L710.0 573.4 L703.7 569.2 L694.1 559.0 L696.5 557.3 L693.9 558.4 L693.0 554.0 L691.6 552.5 L692.2 554.5 L689.9 549.8 L688.4 538.0 L687.7 539.1 L687.1 535.0 L686.0 535.1 L684.1 528.5 L681.1 524.1 L681.9 523.4 L680.9 524.0 L680.1 517.7 L674.9 511.2 L673.3 506.8 L668.6 502.0 L666.2 501.4 L658.5 485.9 L655.8 476.5 L655.2 471.1 L656.3 471.0 L654.8 470.5 L650.2 459.1 L652.1 459.8 L650.1 459.0 L647.2 451.1 L643.8 450.0 L644.8 448.4 L643.8 448.7 L639.6 444.2 L640.5 442.8 L639.3 439.6 L636.9 438.1 L639.0 437.8 L637.0 437.2 L637.8 436.4 L636.6 436.6 L635.9 434.8 L637.0 433.6 L635.9 434.3 L633.7 429.5 L630.1 426.2 L629.5 420.2 L628.3 420.1 L630.4 419.5 L628.3 419.8 L627.3 417.7 L627.7 416.7 L628.2 418.3 L629.9 417.9 L627.3 416.0 L629.0 416.2 L627.4 415.3 L627.9 411.7 L626.9 412.1 L626.4 410.6 L627.5 409.1 L626.6 408.6 L627.4 407.8 L624.6 403.1 L626.9 403.2 L624.2 401.2 L625.1 400.5 L623.6 398.2 L625.2 397.6 L623.5 397.2 L623.4 393.1 L621.3 390.9 L622.6 390.2 L621.1 390.2 L619.3 386.0 L620.0 384.8 L622.8 387.4 L622.5 384.1 L621.3 385.1 L619.1 383.5 L618.8 380.0 L620.8 381.3 L617.7 377.1 L618.0 375.1 L619.4 374.7 L621.0 376.7 L620.5 373.9 L618.8 373.3 L622.1 371.0 L620.7 371.4 L620.4 367.9 L619.8 370.7 L616.7 373.4 L617.2 368.1 L616.1 368.6 L617.4 366.7 L616.2 367.9 L616.3 365.8 L618.9 366.1 L616.1 365.0 L615.4 362.9 L618.4 361.7 L615.1 361.6 L613.6 356.0 L613.8 354.1 L615.4 353.9 L615.6 347.5 L618.6 343.0 L617.5 339.1 L619.2 338.7 L617.1 338.1 L616.2 335.8 L617.6 334.8 L615.7 335.6 L615.2 334.3 L615.1 333.3 L617.6 333.7 L617.1 332.6 L614.6 332.7 L616.3 330.9 L613.2 332.8 L613.2 330.4 L615.4 330.6 L612.4 328.7 L615.8 326.0 L613.4 326.0 L614.1 325.0 L617.3 321.9 L619.2 321.7 L611.2 322.0 L612.8 317.5 L615.5 316.2 L611.1 317.6 L610.5 316.2 L612.1 311.9 L615.7 312.5 L618.8 310.8 L615.5 311.4 L610.9 310.1 L608.9 311.9 L608.0 309.6 L606.8 310.0 L606.2 313.8 L603.8 315.3 L605.1 317.1 L603.4 316.5 L605.2 317.4 L605.2 319.2 L604.4 318.4 L603.4 319.2 L606.3 322.6 L601.8 328.4 L602.3 330.6 L589.9 335.1 L588.5 336.7 L575.6 340.0 L561.8 333.3 L536.6 310.0 L539.3 306.8 L538.7 308.5 L541.9 307.9 L541.2 310.0 L542.6 311.0 L547.9 309.5 L548.5 307.8 L549.8 309.7 L551.7 309.7 L553.0 306.9 L554.7 308.3 L558.3 305.6 L562.2 305.6 L567.9 297.7 L564.6 298.2 L563.2 296.1 L563.3 298.0 L561.3 297.2 L560.7 298.9 L556.2 298.8 L552.6 302.0 L547.3 301.3 L545.2 300.5 L545.4 299.3 L545.2 300.5 L542.0 300.2 L530.3 294.0 L532.1 294.8 L529.2 292.9 L531.3 291.5 L529.1 290.7 L527.8 288.0 L526.5 288.2 L526.9 286.9 L526.0 287.7 L528.6 283.8 L533.8 280.7 L527.9 283.3 L526.2 283.5 L526.1 281.9 L525.3 286.0 L522.7 286.8 L522.9 285.5 L522.3 286.6 L520.8 285.5 L524.5 283.6 L522.2 284.6 L521.5 281.7 L524.4 279.2 L520.8 281.5 L518.9 281.7 L518.0 280.3 L517.6 282.9 L514.5 280.9 L515.4 279.0 L513.6 282.1 L510.9 280.6 L511.6 282.4 L509.6 282.0 L509.9 280.2 L509.5 281.4 L507.3 280.6 L507.9 279.4 L506.5 280.2 L507.3 279.1 L505.4 279.5 L506.1 277.7 L505.6 278.5 L504.7 277.6 L506.5 277.5 L505.7 276.3 L504.2 277.1 L502.9 274.4 L504.7 274.2 L502.4 273.0 L505.2 272.6 L504.3 271.3 L502.5 272.1 L503.7 270.1 L502.0 270.8 L502.6 268.7 L501.8 269.4 L500.5 268.0 L503.0 267.9 L503.5 266.8 L499.8 266.9 L502.6 264.2 L498.1 263.6 L498.4 264.5 L494.8 262.7 L489.5 263.1 L491.4 256.7 L487.2 253.3 L488.5 252.6 L485.3 248.5 L480.8 248.7 L477.5 251.6 L482.9 249.8 L486.4 251.0 L485.5 251.6 L486.7 252.5 L481.8 251.3 L468.5 253.5 L461.7 252.7 L459.2 254.3 L450.4 253.5 L447.8 255.2 L448.9 256.5 L446.5 257.1 L446.0 255.0 L442.8 255.6 L436.4 253.8 L436.0 252.7 L439.0 251.8 L436.9 250.8 L433.0 252.3 L435.5 252.4 L435.7 254.0 L426.2 253.2 L423.1 254.2 L424.1 256.2 L417.7 255.0 L413.7 256.1 L404.3 255.0 L400.4 256.8 L401.1 258.2 L398.6 258.0 L399.8 257.6 L398.8 256.2 L395.9 256.0 L394.2 257.1 L395.1 258.2 L391.0 258.2 L388.1 259.9 L388.6 257.1 L384.3 256.6 L384.4 255.6 L382.0 256.6 L381.1 258.9 L364.4 254.7 L364.5 252.4 L362.8 251.7 L360.1 253.0 L361.4 254.7 L358.1 253.8 L358.2 252.5 L355.9 254.0 L349.6 253.4 L349.4 253.6 L338.4 250.4 L339.1 251.4 L336.5 251.9 L336.5 250.7 L334.1 250.8 L333.6 252.3 L336.1 251.8 L332.9 252.5 L322.0 248.1 L319.7 248.2 L319.8 249.1 L316.7 248.0 L313.0 249.8 L309.3 247.0 L305.4 248.2 L306.7 247.3 L305.0 246.2 L296.2 245.5 L293.5 240.5 L294.3 238.3 L291.2 234.3 L290.4 226.8 L287.9 223.6 L289.1 222.5 L288.1 223.2 L286.8 220.7 L282.9 220.2 L283.0 219.2 L277.4 218.9 L271.5 220.1 L267.9 222.5 L261.5 223.2 L258.6 227.2 L253.6 226.9 L244.1 232.2 L236.1 230.4 L233.6 227.8 L222.0 228.4 L217.1 225.7 L216.5 223.3 L200.6 217.5 L198.1 215.8 L200.1 214.5 L195.2 210.9 L190.3 209.8 L186.9 207.2 L180.1 207.5 L173.8 205.7 L167.5 195.2 L166.1 189.2 L164.7 188.2 L165.1 189.1 L163.2 189.0 L161.6 187.1 L162.0 185.8 L163.7 187.0 L163.9 184.4 L158.6 183.4 L158.4 177.2 L147.9 168.4 L146.8 163.8 L143.6 163.3 L135.6 167.1 L134.5 164.6 L129.2 164.6 L129.0 162.3 L128.0 163.3 L123.0 160.1 L128.6 160.8 L129.9 159.0 L127.5 157.8 L125.8 159.3 L125.6 157.6 L122.1 157.8 L125.3 159.2 L119.8 161.2 L123.0 163.7 L121.7 167.0 L117.1 166.1 L117.1 168.1 L112.9 167.2 L115.4 168.4 L113.2 168.7 L107.6 166.5 L103.0 167.1 L107.3 175.6 L102.8 175.0 L97.3 178.8 L100.3 178.5 L100.4 179.8 L103.3 178.4 L105.5 179.2 L106.9 186.0 L109.6 189.8 L111.7 190.5 L111.5 193.0 L114.7 196.7 L116.3 202.7 L119.9 204.4 L118.9 205.2 L121.7 207.4 L121.8 208.8 L120.9 209.5 L121.0 207.7 L120.0 208.9 L120.6 207.5 L119.6 209.7 L121.7 210.2 L121.0 211.7 L129.3 213.1 L130.5 215.1 L126.8 215.3 L129.8 215.7 L128.6 217.1 L130.8 216.9 L130.8 219.6 L132.7 219.3 L131.9 220.7 L135.1 220.9 L134.4 219.9 L136.2 219.6 L138.2 223.5 L144.7 226.1 L148.2 229.6 L144.6 227.4 L145.9 232.7 L148.2 233.5 L149.0 231.9 L149.5 234.9 L148.1 240.7 L145.5 237.7 L144.9 241.7 L147.1 241.7 L150.3 248.6 L147.7 246.2 L148.1 247.1 L153.1 252.3 L152.7 250.4 L155.0 252.4 L156.5 259.1 L160.8 265.3 L162.8 263.7 L160.5 250.7 L162.4 251.3 L161.3 248.9 L162.3 247.9 L163.1 251.1 L165.0 248.8 L163.3 246.8 L164.1 245.0 L165.2 245.6 L165.3 241.7 L170.8 238.4 L173.0 239.5 L173.9 242.0 L177.5 243.0 L177.9 245.4 L177.6 244.2 L176.4 245.9 L177.8 246.6 L176.0 247.1 L177.0 247.8 L175.4 250.5 L176.2 254.4 L178.1 254.8 L178.5 259.6 L173.2 267.5 L172.6 266.4 L170.1 266.6 L172.0 267.4 L171.8 269.2 L173.8 266.9 L176.0 267.9 L172.2 270.6 L171.7 273.1 L174.7 272.5 L177.8 273.9 L178.0 271.5 L178.7 274.8 L179.4 273.5 L180.1 274.7 L181.7 273.7 L182.1 278.4 L184.6 279.5 L186.7 278.8 L188.5 280.3 L188.3 279.1 L192.6 278.9 L198.5 274.9 L200.0 276.3 L209.9 275.5 L212.8 277.1 L216.1 276.3 L219.5 277.9 L229.5 276.3 L232.0 275.0 L229.6 274.2 L230.6 272.6 L232.2 274.0 L231.1 272.6 L233.3 273.0 L232.6 274.6 L237.0 273.3 L237.9 271.4 L234.1 270.2 L235.3 268.9 L238.9 270.7 L237.9 269.9 L239.9 269.8 L238.4 269.0 L240.2 268.9 L242.3 263.5 L243.1 264.3 L243.4 263.0 L249.7 259.8 L258.0 252.7 L259.8 249.2 L259.6 250.5 L261.3 250.2 L264.8 246.8 L268.2 245.7 L273.3 236.8 L273.6 237.8 L276.5 237.9 L275.3 237.7 L275.6 236.1 L276.7 236.7 L275.7 235.7 L276.7 234.3 L278.4 235.4 L277.2 236.2 L279.2 237.1 L278.0 237.9 L279.1 239.0 L276.9 237.8 L275.7 238.6 L275.9 239.7 L278.9 239.9 L277.0 240.8 L278.5 242.5 L274.5 248.3 L276.6 250.3 L277.5 262.6 L281.9 269.6 L293.4 279.8 L316.5 285.8 L322.0 285.4 L325.9 287.4 L341.6 305.7 L347.5 305.8 L347.7 311.6 L338.2 326.3 L332.3 329.4 L327.0 334.4 L324.1 338.5 L325.7 339.0 L322.5 341.2 L321.1 345.2 L319.6 346.5 L314.6 345.6 L315.9 342.1 L314.4 341.5 L307.1 348.4 L303.6 358.2 L307.1 371.4 L292.2 373.6 L285.5 376.1 L282.1 379.3 L280.4 387.7 L276.2 391.5 L268.7 391.3 L257.1 393.4 L252.9 398.8 L254.6 401.2 L253.7 404.2 L248.7 408.5 L244.1 409.8 L240.5 408.1 L228.6 408.8 L219.0 413.3 L212.4 413.9 L196.2 419.0 L191.8 422.5 L189.4 427.1 L190.3 434.4 L173.1 441.4 L154.8 445.3 L148.6 448.7 L143.4 448.6 L131.2 452.4 L125.7 455.0 L124.2 458.3 L117.9 463.5 L107.4 464.9 L103.0 463.4 L90.8 470.8 L76.4 474.9 L55.0 476.4 L49.3 481.8 L44.1 483.3 L42.2 487.5 L40.8 487.0 L41.4 485.6 L38.4 486.7 L39.8 487.3 L38.8 488.0 L32.9 486.3 L29.4 489.0 L19.9 490.4 L12.4 487.5 L9.6 488.9 L10.2 486.1 L5.0 478.1 L5.9 470.1 L0.0 456.5 M0.0 455.8 L0.4 456.1 L0.0 455.1 M0.0 484.8 L0.1 484.7 L6.8 492.6 L8.6 498.4 L7.8 501.6 L3.7 502.3 L1.1 505.0 L0.0 505.2 M0.0 508.8 L3.2 508.6 L4.9 511.3 L10.2 512.7 L10.5 515.9 L18.5 525.0 L26.9 530.7 L32.6 531.6 L40.4 531.0 L58.1 522.5 L71.2 525.9 L75.9 524.7 L91.3 516.7 L97.3 518.3 L106.6 517.6 L114.4 514.2 L123.3 515.5 L133.0 513.7 L136.0 511.5 L150.4 509.1 L154.9 506.7 L156.8 503.2 L161.3 501.7 L171.5 504.5 L167.3 514.1 L167.5 516.8 L169.3 517.3 L168.0 520.8 L169.1 527.9 L166.0 530.8 L170.4 530.5 L169.2 528.1 L174.1 530.3 L173.3 531.8 L169.5 530.7 L163.5 532.7 L162.0 549.4 L158.5 553.3 L157.9 556.0 L153.5 559.8 L147.5 572.1 L141.2 577.1 L141.2 580.5 L128.5 599.1 L123.2 613.0 L102.7 641.1 L93.3 650.0 M1102.4 650.0 L1099.6 647.2 L1097.0 646.4 L1087.0 637.7 L1080.2 626.2 L1080.6 620.6 L1084.7 619.2 L1086.2 620.2 L1088.6 619.6 L1094.2 621.9 L1098.2 625.8 L1104.7 627.4 L1116.8 626.4 L1121.3 628.7 L1127.7 626.7 L1135.9 633.3 L1138.3 638.5 L1137.5 640.1 L1139.3 639.6 L1143.9 642.0 L1143.2 646.1 L1141.1 646.8 L1141.2 648.4 L1143.1 647.5 L1144.1 649.2 L1145.9 648.4 L1148.9 649.7 L1149.4 650.0 M770.8 612.9 L770.8 612.9 L766.7 609.3 L762.7 597.9 L761.8 583.1 L759.2 572.0 L761.0 569.1 L760.1 575.5 L761.9 576.3 L761.1 571.4 L764.7 562.3 L763.7 558.4 L766.9 556.5 L768.2 551.7 L766.6 549.9 L769.4 548.2 L766.6 546.0 L771.5 548.8 L773.8 548.1 L763.6 543.1 L769.8 541.7 L782.3 551.7 L783.4 555.2 L790.9 563.6 L790.0 567.5 L793.5 566.6 L795.9 574.8 L797.7 575.9 L796.8 577.7 L798.3 577.2 L802.6 583.5 L804.4 593.9 L800.8 603.7 L792.9 609.3 L777.8 614.4 L770.8 612.9 M227.6 495.4 L227.5 495.4 L218.4 495.1 L213.2 491.4 L217.3 488.2 L220.3 488.4 L222.9 490.3 L229.8 488.4 L238.8 491.1 L227.6 495.4 M1028.1 490.2 L1028.1 490.1 L1030.2 489.6 L1034.0 492.4 L1032.9 494.0 L1030.5 492.9 L1032.2 495.6 L1028.4 495.4 L1028.1 490.2 M268.9 227.8 L268.8 227.8 L253.9 230.9 L253.8 229.2 L264.6 226.8 L263.8 223.7 L266.4 224.8 L272.1 222.9 L274.7 223.5 L268.9 227.8 M1031.0 482.9 L1031.0 482.9 L1031.4 475.4 L1035.3 472.2 L1034.8 474.9 L1036.5 476.8 L1033.7 476.6 L1036.0 478.0 L1035.3 481.8 L1033.9 482.7 L1032.3 481.2 L1033.4 483.5 L1032.5 483.0 L1031.9 485.1 L1030.4 484.5 L1031.0 482.9 M1029.8 501.5 L1029.7 501.5 L1028.7 502.8 L1030.3 503.0 L1029.6 507.0 L1027.7 508.0 L1029.6 507.8 L1028.6 511.2 L1024.6 504.3 L1025.6 502.5 L1026.5 504.3 L1028.3 497.0 L1029.8 501.5 M224.1 0.0 L227.3 1.6 L224.0 8.5 L223.5 20.4 L228.2 40.4 L225.1 41.0 L219.5 39.6 L226.7 38.3 L183.6 44.9 L165.5 41.5 L151.7 34.6 L148.5 29.8 L128.6 26.5 L123.0 20.5 L120.6 2.6 L122.8 0.9 L122.9 0.0 M125.3 0.0 L127.0 0.4 L127.2 0.0 M1185.7 34.1 L1191.2 39.7 L1194.9 40.5 L1193.6 45.6 L1187.3 43.4 L1182.0 44.2 L1175.2 42.5 L1174.7 40.7 L1171.4 39.0 L1172.7 37.7 L1175.8 38.1 L1174.7 33.8 L1179.1 33.0 L1185.7 34.1 L1185.7 34.1 M49.6 14.1 L51.8 16.3 L49.9 22.2 L51.7 23.7 L57.0 23.7 L57.6 25.4 L55.0 25.4 L60.3 30.1 L56.7 32.0 L55.1 31.5 L53.6 34.6 L51.0 35.0 L47.9 32.3 L46.8 23.1 L42.6 21.2 L42.5 19.0 L45.6 16.4 L41.2 15.8 L43.5 13.5 L49.5 14.0 L49.6 14.1 M0.0 4.0 L1.2 4.0 L4.2 2.0 L1.9 2.7 L1.4 1.3 L8.2 0.0 L13.6 1.0 L6.5 3.0 L1.7 7.3 L6.5 8.5 L6.6 10.2 L2.9 12.8 L0.0 12.5 M979.3 157.4 L978.8 150.6 L983.9 152.2 L986.9 150.3 L993.7 150.7 L993.1 152.6 L990.0 152.6 L989.7 154.6 L979.2 157.5 L979.3 157.4 M944.6 135.3 L942.8 132.5 L946.3 132.2 L947.5 133.6 L947.9 132.3 L954.7 131.3 L958.9 133.4 L956.9 133.6 L954.3 138.2 L950.3 136.9 L950.6 135.0 L944.6 135.2 L944.6 135.3 M2.6 86.6 L3.7 89.4 L10.6 94.6 L9.3 98.7 L5.1 98.0 L1.6 93.9 L1.1 88.1 L2.5 86.5 L2.6 86.6 M11.1 109.4 L15.4 115.9 L18.5 117.1 L15.9 120.7 L10.5 118.8 L8.9 116.9 L8.4 113.9 L9.7 113.8 L11.0 109.3 L11.1 109.4 M876.7 150.7 L875.8 149.2 L877.5 147.1 L887.6 149.8 L885.6 149.8 L886.8 150.7 L885.6 153.4 L884.1 151.0 L880.8 152.0 L876.7 150.7 L876.7 150.7 M965.6 278.5 L967.2 275.0 L966.4 267.7 L963.4 260.4 L965.6 250.4 L967.2 249.9 L966.3 246.7 L973.3 239.8 L984.8 237.1 L989.0 239.2 L984.5 237.6 L979.4 238.5 L972.4 241.3 L971.3 244.5 L967.4 247.2 L968.1 250.3 L965.9 251.3 L966.8 255.8 L965.1 257.9 L966.9 260.4 L965.5 261.0 L966.0 262.7 L968.5 264.6 L969.5 274.4 L968.7 274.0 L968.3 271.8 L968.7 275.0 L966.0 278.5 L965.6 278.5 M550.7 199.3 L536.5 205.0 L537.3 206.6 L535.2 207.7 L536.7 209.7 L533.5 210.7 L531.2 208.5 L530.5 210.0 L526.7 210.2 L523.4 212.3 L524.6 215.9 L521.3 217.3 L521.7 218.6 L519.2 219.4 L519.8 221.3 L515.5 223.7 L515.5 228.7 L515.9 236.4 L525.5 244.4 L524.1 246.5 L526.4 247.9 L524.0 251.0 L523.4 256.1 L524.9 257.6 L523.3 257.6 L523.0 260.3 L521.2 260.7 L520.4 262.4 L518.4 262.5 L516.7 270.6 L514.1 270.8 L514.5 272.3 L512.7 272.2 L513.7 273.8 L512.6 274.3 L510.3 276.3 L511.9 277.6 L515.6 277.3 L517.8 279.6 L516.7 278.7 L511.8 278.3 L512.2 279.3 L510.1 280.1 L511.7 277.9 L507.6 277.4 L509.8 277.1 L509.9 275.4 L513.4 273.6 L512.5 272.2 L514.2 272.2 L513.9 270.7 L516.4 270.5 L518.2 262.3 L520.1 262.3 L519.8 261.0 L522.7 260.1 L523.0 257.6 L524.6 257.5 L523.2 256.2 L523.7 250.9 L526.0 247.9 L523.7 246.5 L525.2 244.6 L522.1 242.9 L519.2 239.4 L515.5 236.3 L515.3 223.5 L519.5 221.1 L518.9 219.2 L521.4 218.6 L520.8 216.2 L523.9 215.9 L523.4 212.2 L526.6 210.0 L530.2 209.9 L531.1 208.3 L534.0 210.2 L536.6 209.6 L534.9 207.7 L536.9 206.6 L536.3 204.7 L537.9 204.1 L538.4 203.1 L540.7 203.3 L543.9 201.1 L545.9 201.0 L546.6 199.8 L550.1 199.4 L550.7 199.3 M931.8 266.5 L934.0 266.8 L937.2 270.9 L944.9 272.1 L947.1 275.2 L951.7 275.7 L956.1 280.1 L952.2 278.8 L951.2 276.5 L946.3 277.2 L944.7 272.6 L940.7 273.5 L935.5 270.1 L935.9 269.5 L932.7 268.4 L929.7 264.9 L928.0 259.2 L931.8 266.5 M21.4 91.5 L26.2 91.8 L30.1 94.0 L27.1 102.6 L32.6 110.2 L36.1 110.8 L36.1 111.8 L38.1 111.7 L40.6 113.8 L42.3 113.1 L43.2 115.3 L46.8 115.8 L46.8 117.1 L50.2 119.4 L52.6 119.0 L52.6 119.8 L58.4 120.5 L64.6 117.8 L69.2 120.0 L75.8 120.9 L77.6 123.5 L76.9 127.5 L79.9 128.5 L80.2 129.9 L76.7 127.7 L77.3 123.5 L75.6 121.1 L67.1 119.9 L64.4 118.0 L58.9 120.3 L58.4 121.9 L57.5 120.5 L50.0 119.7 L46.4 117.2 L46.7 116.1 L42.8 115.4 L42.4 113.4 L40.5 114.0 L32.5 110.4 L26.8 102.6 L29.8 94.0 L21.6 91.5 L21.4 91.5 M98.3 155.6 L100.7 157.9 L105.7 158.7 L107.6 161.1 L109.4 161.0 L111.9 163.3 L112.8 167.4 L109.2 161.2 L107.5 161.3 L105.7 159.0 L101.1 158.4 L98.2 155.7 L98.3 155.6';
const PREMIUM_BORDERS = 'M744.9 97.1 L745.6 99.7 L743.0 100.1 L743.5 103.9 L740.9 101.7 L740.8 100.6 L740.6 99.5 L740.4 98.4 L740.2 97.3 L740.0 96.2 L739.8 95.1 L739.6 94.0 L739.4 92.9 L739.3 92.1 L740.3 91.5 L741.4 90.9 L742.4 90.3 L743.5 89.7 L744.5 89.1 L744.6 89.0 L744.6 86.4 L743.5 85.8 L742.5 85.2 L741.4 84.6 L740.3 84.1 L739.3 83.5 L738.4 83.0 L737.3 82.7 L736.1 82.4 L734.9 82.1 L733.7 81.7 L732.5 81.4 L731.3 81.1 L730.5 80.9 L730.0 79.9 L729.5 78.9 L729.0 77.9 L728.5 76.9 L728.0 75.8 L727.5 74.8 L727.0 73.8 L726.5 72.8 L725.9 71.8 L725.4 70.8 L724.9 69.7 L724.6 69.2 L724.3 64.7 L723.0 64.8 L721.8 64.9 L720.5 64.9 L719.3 65.0 L718.1 65.1 L716.8 65.2 L715.6 65.3 L714.4 65.4 L713.1 65.5 L712.4 65.5 L711.2 65.3 L710.0 65.0 L708.8 64.7 L707.5 64.5 L706.3 64.2 L705.1 64.0 L703.9 63.7 L702.7 63.4 L702.0 63.3 L700.9 62.8 L699.8 62.3 L698.7 61.8 L697.6 61.4 L696.4 60.9 L695.3 60.4 L695.0 60.2 L694.4 57.3 L693.2 57.6 L692.0 57.9 L690.8 58.1 L689.6 58.4 L688.4 58.7 L687.2 58.9 L686.3 59.1 L685.3 56.1 L681.2 54.3 L683.6 51.3 L682.9 47.2 L679.8 43.3 L675.3 41.5 L671.4 42.1 L669.9 38.5 L664.9 37.1 L659.9 38.8 L658.4 36.8 L652.7 36.5 L649.7 34.6 L650.8 34.1 L651.9 33.6 L653.0 33.1 L654.1 32.6 L655.3 32.2 L656.4 31.7 L656.8 31.5 L658.2 33.0 L660.7 32.7 L661.8 32.1 L662.8 31.5 L663.9 30.8 L664.9 30.2 L665.9 29.6 L665.9 29.6 L665.0 28.9 L664.1 28.2 L663.1 27.4 L662.2 26.7 L661.2 26.0 L660.3 25.3 L660.1 25.1 L661.9 22.6 L661.2 21.6 L660.6 20.7 L660.0 19.7 L659.3 18.8 L658.7 17.8 L658.2 17.1 L658.4 16.0 L658.5 14.9 L658.6 13.8 L658.8 12.7 L658.9 11.6 L659.0 10.5 L659.1 9.8 L658.0 9.4 L656.8 9.0 L655.7 8.6 L654.5 8.2 L653.4 7.7 L652.2 7.3 L651.1 6.9 L649.9 6.5 L648.8 6.1 L648.7 6.0 L644.2 6.1 L642.8 8.6 L637.6 7.3 L635.3 2.3 L638.3 0.6 L637.8 0.0 M385.0 256.4 L385.2 255.3 L385.3 254.2 L385.5 253.1 L385.7 252.0 L385.8 250.9 L386.0 249.8 L386.1 248.7 L386.3 247.6 L386.4 246.5 L386.6 245.4 L386.6 245.2 L388.5 244.8 L388.7 243.7 L388.9 242.6 L389.2 241.5 L389.4 240.4 L389.7 239.3 L389.9 238.2 L390.2 237.1 L390.2 237.1 L395.7 235.5 L396.0 234.3 L398.8 234.9 L399.5 232.1 L402.1 230.9 L403.3 230.6 L404.5 230.4 L405.7 230.1 L406.9 229.8 L408.1 229.6 L409.1 229.4 L410.3 229.4 L411.6 229.4 L412.8 229.5 L414.0 229.5 L415.3 229.6 L416.5 229.6 L417.5 229.7 L418.1 225.8 L419.8 224.9 L419.0 221.3 L420.9 220.6 L418.1 217.9 L412.4 218.9 L408.9 217.8 L410.5 214.0 L410.4 212.9 L410.3 211.8 L410.2 210.7 L410.1 209.6 L410.0 208.5 L409.9 207.4 L409.8 206.3 L409.7 205.2 L409.7 204.0 L409.6 202.9 L409.5 201.8 L409.4 200.7 L409.3 199.6 L409.3 199.3 L405.4 199.9 L401.5 196.5 L400.3 196.2 L399.1 196.0 L397.9 195.7 L396.7 195.4 L395.5 195.1 L394.3 194.8 L393.1 194.5 L391.9 194.2 L391.2 194.0 L390.3 193.2 L389.5 192.5 L388.6 191.7 L387.7 190.9 L386.8 190.1 L386.0 189.3 L385.1 188.5 L384.4 187.9 L383.9 186.9 L383.4 185.9 L382.9 184.9 L382.4 183.9 L381.9 182.8 L381.4 181.8 L380.9 180.8 L380.4 179.8 L379.9 178.8 L379.8 178.6 L378.9 177.8 L378.1 177.0 L377.2 176.2 L376.3 175.5 L375.4 174.7 L374.5 173.9 L373.6 173.1 L372.7 172.4 L371.8 171.6 L370.9 170.8 L370.0 170.0 L369.7 169.7 L370.5 168.9 L371.4 168.1 L372.2 167.3 L373.1 166.5 L374.0 165.7 L374.8 164.9 L375.7 164.1 L376.6 163.3 L377.4 162.5 L378.3 161.7 L379.1 160.9 L380.0 160.1 L380.9 159.3 L381.7 158.5 L382.6 157.7 L383.5 156.9 L384.3 156.1 L385.2 155.3 L386.0 154.5 L386.9 153.7 L387.8 152.9 L388.6 152.1 L389.2 151.6 L390.0 148.2 L389.6 147.1 L389.1 146.1 L388.7 145.1 L388.3 144.0 L387.8 143.0 L387.4 141.9 L387.2 141.5 L385.9 141.3 L384.7 141.2 L383.5 141.0 L382.3 140.9 L381.0 140.7 L379.8 140.6 L378.6 140.4 L377.3 140.3 L376.1 140.1 L374.9 140.0 L373.6 139.8 L372.4 139.7 L371.2 139.6 L369.9 139.4 L369.2 139.3 L369.1 138.2 L369.0 137.1 L368.9 136.0 L368.8 134.9 L368.6 133.8 L368.5 132.7 L368.4 131.5 L368.3 130.4 L368.2 129.3 L368.2 129.3 L369.5 125.6 L369.1 124.6 L368.7 123.5 L368.3 122.5 L367.9 121.4 L367.5 120.4 L367.1 119.3 L366.7 118.2 L366.3 117.2 L366.0 116.1 L365.6 115.1 L365.2 114.0 L364.8 112.9 L364.4 111.9 L364.0 110.8 L363.8 110.2 L364.0 108.4 L364.8 107.6 L365.7 106.8 L366.6 106.0 L367.4 105.2 L368.3 104.4 L369.2 103.6 L370.1 102.9 L370.9 102.1 L371.2 101.8 L370.0 101.5 L368.9 101.1 L367.7 100.8 L366.5 100.5 L365.3 100.2 L364.1 99.9 L362.9 99.5 L362.6 99.5 L362.6 98.4 L362.5 97.2 L362.5 96.1 L362.4 95.0 L362.4 93.9 L362.3 92.8 L362.3 91.7 L362.2 90.6 L362.2 90.4 L365.5 87.1 L370.7 86.9 L366.7 83.2 L371.8 80.9 L373.8 77.8 L373.9 76.7 L374.0 75.5 L374.1 74.4 L374.2 73.3 L374.3 72.2 L374.4 71.1 L374.5 70.0 L374.6 69.1 L376.3 68.7 L376.7 67.6 L377.1 66.6 L377.4 65.5 L377.8 64.4 L378.2 63.4 L378.4 62.7 L380.3 62.5 L384.7 66.0 L386.0 66.0 L387.2 66.0 L388.5 66.0 L389.7 66.0 L390.9 66.0 L392.2 66.0 L393.4 66.0 L393.7 66.0 L398.5 68.8 L399.5 71.7 L402.7 68.9 L408.0 69.6 L409.2 69.0 L410.3 68.5 L411.4 68.0 L412.5 67.5 L413.6 67.0 L414.7 66.5 L415.8 66.0 L416.0 65.9 L415.8 62.7 L418.7 61.3 L416.3 58.3 L420.9 58.4 L422.1 58.0 L423.2 57.7 L424.4 57.4 L425.6 57.0 L426.8 56.7 L428.0 56.4 L429.2 56.0 L430.4 55.7 L431.5 55.4 L432.7 55.0 L432.8 55.0 L435.8 55.7 L436.4 53.4 L437.6 53.1 L438.8 52.7 L440.0 52.3 L441.1 52.0 L442.3 51.6 L443.5 51.2 L444.3 51.0 L447.4 47.4 L447.7 46.3 L448.0 45.2 L448.3 44.2 L448.6 43.1 L448.9 42.0 L449.2 40.9 L449.5 39.8 L449.8 38.8 L450.1 37.7 L450.4 36.6 L450.7 35.5 L450.8 35.0 L451.9 34.5 L453.1 34.0 L454.2 33.6 L455.4 33.1 L456.5 32.7 L456.7 32.6 L457.9 32.6 L459.2 32.5 L460.4 32.5 L461.6 32.5 L462.9 32.5 L464.1 32.4 L465.4 32.4 L466.6 32.4 L466.6 32.4 L467.4 31.5 L468.1 30.6 L468.8 29.7 L469.5 28.8 L470.3 27.9 L471.0 27.0 L471.3 26.5 L472.4 27.0 L473.6 27.5 L474.7 28.0 L475.8 28.5 L476.9 29.0 L478.0 29.4 L479.1 29.9 L480.3 30.4 L481.4 30.9 L481.9 31.1 L483.1 31.0 L484.3 30.9 L485.6 30.8 L486.8 30.8 L488.0 30.7 L489.3 30.6 L490.5 30.5 L491.8 30.4 L493.0 30.3 L494.2 30.2 L495.5 30.1 L496.6 30.0 L497.6 30.8 L498.6 31.5 L499.5 32.2 L500.5 32.9 L501.4 33.6 L501.6 33.7 L506.7 31.9 L508.2 33.2 L511.9 33.0 L512.7 35.4 L517.7 38.6 L518.8 38.0 L519.9 37.5 L521.0 36.9 L522.0 36.4 L523.1 35.9 L524.2 35.3 L525.3 34.8 L526.4 34.3 L527.5 33.7 L528.6 33.2 L529.7 32.7 L530.8 32.1 L531.0 32.0 L534.2 32.6 L534.4 31.1 L536.3 32.0 L535.6 30.9 L536.7 31.4 L537.7 32.0 L538.8 32.5 L539.9 33.1 L541.0 33.7 L542.0 34.2 L543.1 34.8 L543.9 35.2 L547.3 33.0 L545.8 28.8 L548.6 26.4 L549.8 26.3 L551.1 26.2 L552.3 26.1 L553.5 26.0 L554.8 25.9 L556.0 25.8 L556.5 25.7 L562.0 27.1 L564.5 24.1 L562.0 19.8 L563.0 19.2 L564.1 18.7 L565.2 18.1 L566.2 17.5 L567.3 17.0 L568.2 16.5 L568.9 15.6 L569.6 14.7 L570.3 13.7 L571.0 12.8 L571.7 11.9 L572.4 11.0 L572.5 10.9 L578.3 9.8 L579.4 10.3 L580.5 10.9 L581.6 11.4 L582.7 11.9 L583.8 12.5 L584.9 13.0 L586.0 13.5 L586.8 13.9 L586.4 15.0 L586.0 16.1 L585.6 17.1 L585.2 18.2 L584.8 19.2 L584.5 20.0 L585.8 20.1 L587.0 20.1 L588.3 20.2 L589.5 20.3 L590.7 20.3 L591.6 20.4 L591.3 21.5 L591.1 22.6 L590.8 23.7 L590.6 24.7 L590.4 25.8 L590.1 26.9 L589.9 28.0 L589.6 29.1 L589.4 30.2 L589.2 31.3 L588.9 32.4 L588.7 33.5 L588.4 34.6 L588.2 35.7 L588.2 35.7 L588.7 36.8 L589.1 37.8 L589.6 38.8 L590.0 39.9 L590.5 40.9 L590.8 41.6 L593.3 43.2 L596.7 42.9 L597.8 42.3 L598.9 41.7 L599.9 41.1 L601.0 40.5 L602.0 39.9 L603.1 39.3 L604.1 38.8 L605.2 38.2 L606.3 37.6 L606.3 37.5 L607.6 37.4 L608.8 37.3 L610.0 37.1 L611.3 37.0 L612.5 36.9 L613.6 36.7 L616.4 32.9 L617.5 32.5 L618.7 32.0 L619.8 31.5 L620.9 31.1 L622.1 30.6 L623.2 30.1 L624.3 29.7 L625.4 29.2 L626.6 28.7 L627.0 28.5 L628.3 28.6 L629.5 28.7 L630.8 28.7 L632.0 28.8 L633.2 28.9 L634.5 28.9 L635.7 29.0 L636.8 29.1 L636.6 30.8 L633.5 32.3 L636.0 33.0 L637.1 32.7 L638.3 32.3 L639.5 32.0 L640.7 31.6 L641.9 31.3 L643.0 30.9 L644.2 30.6 L645.4 30.2 L646.6 29.9 L647.8 29.5 L648.9 29.2 L650.1 29.3 L651.4 29.4 L652.6 29.5 L653.8 29.6 L655.1 29.7 L655.6 29.8 L660.3 32.7 M954.5 322.6 L952.4 319.6 L952.6 318.5 L952.8 317.4 L953.1 316.3 L953.3 315.2 L953.5 314.2 L953.7 313.1 L953.7 313.1 L953.3 312.0 L952.8 311.0 L952.3 310.0 L951.8 308.9 L951.4 307.9 L950.9 306.9 L950.4 305.8 L950.3 305.5 L950.4 304.4 L950.6 303.3 L950.8 302.2 L950.9 301.1 L951.1 300.0 L951.1 300.0 L948.9 297.8 L949.0 295.5 L951.4 293.3 L946.0 292.5 L947.4 288.0 L946.5 288.5 L942.7 285.0 L943.5 281.1 L946.3 280.1 L946.3 279.0 L946.3 277.8 L946.3 276.7 L946.3 275.6 L946.3 274.5 L946.3 274.0 L945.3 272.7 L941.3 272.6 L940.2 272.1 L939.1 271.6 L938.0 271.1 L936.9 270.6 L935.8 270.1 L934.7 269.6 L933.6 269.1 L931.9 266.0 L934.6 262.8 L933.9 261.5 L935.7 261.0 L938.0 262.5 L939.2 261.2 L940.4 256.5 L941.6 256.6 L942.8 256.6 L944.1 256.7 L945.3 256.7 L946.6 256.8 L947.8 256.8 L949.0 256.9 L950.3 256.9 L950.5 256.9 L951.9 254.6 L948.5 253.3 L947.6 250.5 L942.4 250.6 L941.5 249.8 L940.7 249.0 L939.9 248.1 L939.0 247.3 L938.2 246.5 L937.4 245.7 L936.8 245.1 L934.2 245.5 L933.3 244.5 L933.6 243.4 L933.9 242.3 L934.2 241.2 L934.4 240.1 L934.7 239.1 L934.9 238.6 L935.9 238.0 L937.0 237.4 L938.0 236.9 L939.1 236.3 L940.2 235.7 L941.2 235.1 L941.9 234.7 L941.0 232.9 L938.0 232.6 L939.5 229.7 L940.4 230.4 L941.4 231.1 L942.3 231.9 L943.3 232.6 L944.2 233.3 L945.1 234.1 L946.1 234.8 L946.3 235.0 L944.9 236.5 L946.2 236.6 L947.4 236.7 L948.7 236.7 L949.9 236.8 L951.1 236.9 L952.4 237.0 L952.8 237.0 L950.0 234.6 L951.1 233.1 L954.3 235.2 L954.9 238.9 L959.4 241.4 L963.6 242.0 L964.9 240.1 L963.9 238.5 L965.8 237.2 L966.4 238.2 L967.1 239.1 L967.8 240.0 L968.5 241.0 L969.1 241.9 L969.6 242.6 L968.4 244.7 L968.5 245.8 L968.6 246.9 L968.7 248.0 L968.8 249.2 L968.9 250.3 L969.0 251.4 L969.0 252.5 L969.1 253.6 L969.2 254.6 L970.4 254.9 L971.6 255.2 L972.8 255.4 L974.0 255.7 L975.3 255.9 L976.5 256.2 L977.7 256.4 L978.9 256.7 L980.1 257.0 L981.3 257.2 L981.5 257.3 L982.7 257.2 L984.0 257.1 L985.2 257.0 L986.4 256.9 L987.7 256.9 L988.9 256.8 L990.1 256.7 L991.4 256.6 L992.6 256.5 L993.9 256.4 L995.1 256.4 L996.3 256.3 L997.6 256.2 L998.4 256.1 L999.7 256.4 L1000.9 256.6 L1002.1 256.8 L1003.3 257.0 L1004.5 257.3 L1005.7 257.5 L1006.5 257.6 L1007.8 257.5 L1009.0 257.3 L1010.2 257.1 L1011.4 257.0 L1012.7 256.8 L1013.9 256.6 L1014.6 256.5 L1015.8 256.9 L1017.0 257.3 L1018.1 257.7 L1019.3 258.1 L1020.5 258.5 L1020.7 258.5 L1023.8 261.2 L1022.8 262.5 L1018.9 261.9 L1018.6 263.0 L1018.4 264.1 L1018.1 265.2 L1017.8 266.3 L1017.5 267.3 L1017.2 268.4 L1016.9 269.5 L1016.7 270.6 L1016.6 270.9 L1012.2 272.4 L1011.7 275.7 L1008.8 274.1 L1008.3 275.8 L1006.7 274.4 L1005.8 276.7 L1000.8 276.7 L1000.2 277.6 L999.6 278.6 L998.9 279.6 L998.3 280.5 L997.7 281.5 L997.1 282.5 L996.4 283.4 L996.4 283.6 L996.7 284.6 L997.0 285.7 L997.4 286.8 L997.7 287.8 L998.1 288.9 L998.4 290.0 L998.8 291.0 L999.1 292.1 L999.5 293.2 L999.8 294.3 L1000.1 295.2 L1001.4 295.9 L1001.8 292.2 L1002.5 293.2 L1003.1 294.1 L1003.7 295.1 L1004.4 296.1 L1005.0 297.0 L1005.6 298.0 L1005.8 298.2 L1010.0 295.5 L1009.0 292.1 L1013.1 287.9 L1012.8 283.5 L1014.4 285.2 L1017.1 283.5 L1018.2 285.0 L1019.8 284.2 L1019.9 285.3 L1020.0 286.4 L1020.2 287.5 L1020.3 288.6 L1020.5 289.8 L1020.6 290.9 L1020.8 292.0 L1020.9 293.1 L1021.0 294.2 L1021.2 295.3 L1021.3 296.4 L1021.5 297.5 L1021.5 298.2 L1024.4 302.3 L1024.6 303.4 L1024.8 304.5 L1025.0 305.6 L1025.2 306.7 L1025.4 307.8 L1025.6 308.9 L1025.8 310.0 L1026.0 311.1 L1026.2 312.2 L1026.3 312.7 L1026.4 313.8 L1026.5 314.9 L1026.6 316.0 L1026.7 317.1 L1026.8 318.2 L1026.9 319.4 L1027.0 320.5 L1027.1 321.6 L1027.1 322.7 L1027.2 323.8 L1027.3 324.9 L1027.4 326.0 L1027.5 327.1 L1027.6 328.3 L1027.6 328.8 L1026.1 329.6 L1025.2 327.3 L1022.6 327.3 L1021.3 325.5 L1017.8 328.1 L1018.0 331.7 M0.0 641.2 L0.3 640.9 L1.1 640.0 L1.9 639.2 L2.7 638.3 L3.4 637.5 L4.5 637.1 L5.7 636.7 L6.8 636.2 L8.0 635.8 L9.1 635.4 L10.3 634.9 L11.4 634.5 L12.5 634.1 L13.7 633.6 L14.2 633.4 L15.4 633.2 L16.6 632.9 L17.8 632.7 L19.0 632.4 L20.2 632.1 L20.3 632.1 L21.6 632.2 L22.8 632.3 L24.0 632.3 L25.3 632.4 L26.5 632.5 L27.7 632.5 L29.0 632.6 L30.2 632.7 L31.5 632.7 L32.7 632.8 L33.9 632.9 L35.2 632.9 L36.4 633.0 L37.7 633.1 L38.9 633.2 L40.1 633.2 L40.4 633.2 L41.2 632.4 L42.1 631.6 L42.9 630.8 L43.8 630.0 L44.6 629.2 L45.5 628.4 L46.3 627.6 L47.2 626.7 L48.0 625.9 L48.9 625.1 L49.7 624.3 L50.6 623.5 L51.4 622.7 L52.3 621.9 L53.1 621.0 L54.0 620.2 L54.8 619.4 L55.6 618.6 L56.5 617.8 L57.3 617.0 L58.2 616.2 L59.0 615.4 L59.9 614.5 L60.7 613.7 L61.6 612.9 L62.4 612.1 L63.3 611.3 L64.1 610.5 L65.0 609.7 L65.8 608.9 L66.7 608.0 L67.5 607.2 L68.4 606.4 L69.2 605.6 L70.1 604.8 L70.9 604.0 L71.8 603.2 L72.6 602.4 L73.5 601.5 L73.7 601.4 L74.6 600.6 L75.5 599.8 L76.4 599.0 L77.3 598.3 L78.1 597.5 L79.0 596.7 L79.9 595.9 L80.8 595.2 L81.7 594.4 L82.6 593.6 L83.5 592.8 L84.4 592.0 L85.3 591.3 L86.2 590.5 L87.1 589.7 L87.9 588.9 L88.8 588.2 L89.7 587.4 L90.6 586.6 L91.5 585.8 L92.4 585.1 L93.3 584.3 L94.2 583.5 L95.1 582.7 L96.0 582.0 L96.9 581.2 L97.8 580.4 L98.6 579.6 L99.5 578.9 L100.4 578.1 L101.3 577.3 L102.2 576.5 L103.1 575.8 L103.2 575.7 L102.0 575.7 L100.7 575.7 L99.5 575.6 L98.3 575.6 L97.0 575.6 L95.8 575.6 L94.5 575.6 L93.3 575.6 L92.1 575.6 L90.8 575.6 L89.6 575.6 L88.3 575.6 L87.1 575.6 L85.9 575.6 L84.6 575.6 L83.4 575.6 L82.6 575.6 L81.5 575.2 L80.3 574.9 L79.1 574.5 L77.9 574.2 L76.8 573.8 L75.6 573.5 L74.4 573.1 L73.2 572.8 L72.1 572.4 L70.9 572.1 L69.7 571.7 L68.5 571.3 L67.3 571.0 L66.2 570.6 L65.0 570.3 L63.8 569.9 L62.6 569.6 L61.5 569.2 L60.3 568.9 L59.1 568.5 L57.9 568.2 L56.8 567.8 L55.6 567.4 L54.4 567.1 L53.2 566.7 L52.0 566.4 L50.9 566.0 L49.7 565.7 L48.5 565.3 L47.3 565.0 L46.2 564.6 L45.0 564.3 L43.8 563.9 L42.6 563.6 L41.5 563.2 L40.3 562.8 L39.1 562.5 L37.9 562.1 L36.7 561.8 L35.6 561.4 L34.4 561.1 L33.2 560.7 L32.0 560.4 L30.9 560.0 L29.7 559.7 L28.5 559.3 L27.3 558.9 L26.2 558.6 L25.0 558.2 L23.8 557.9 L22.6 557.5 L21.4 557.2 L20.9 557.0 L20.0 556.3 L19.1 555.5 L18.1 554.8 L17.2 554.0 L16.3 553.3 L15.4 552.5 L14.5 551.8 L13.5 551.0 L13.0 550.6 L9.1 549.4 L5.7 545.2 L4.5 540.8 L1.6 539.8 L0.8 539.0 L0.1 538.1 L0.0 538.0 M0.0 517.9 L0.1 517.7 L0.9 516.8 L1.6 515.9 L2.3 515.0 L3.0 514.0 L3.7 513.1 L4.4 512.2 L5.1 511.3 L5.3 511.1 M653.1 36.7 L652.8 37.8 L650.1 37.1 L649.0 37.6 L647.8 38.1 L646.7 38.6 L645.6 39.1 L644.5 39.6 L643.4 40.0 L642.3 40.5 L642.2 40.6 L641.0 40.3 L639.8 40.0 L638.6 39.7 L637.4 39.5 L636.2 39.2 L635.0 38.9 L634.5 38.8 L633.3 38.9 L632.0 39.0 L630.8 39.1 L629.6 39.2 L628.3 39.2 L627.1 39.3 L625.9 39.4 L624.6 39.5 L623.4 39.6 L622.1 39.7 L620.9 39.8 L619.7 39.9 L618.4 39.9 L617.2 40.0 L616.0 40.1 L614.7 40.2 L613.5 40.3 L612.2 40.4 L611.7 40.4 L610.5 40.7 L609.3 41.0 L608.1 41.3 L606.9 41.7 L605.7 42.0 L604.5 42.3 L603.6 42.5 L603.8 43.6 L602.6 44.1 L601.5 44.5 L600.3 44.9 L599.2 45.3 L598.0 45.8 L596.9 46.2 L595.8 46.6 L595.9 48.3 L592.3 47.1 L591.3 49.5 L590.3 50.2 L589.3 50.9 L588.3 51.5 L587.3 52.2 L586.3 52.8 L585.3 53.5 L584.3 54.1 L583.3 54.8 L583.2 54.8 L587.3 56.8 L590.6 61.1 L589.8 62.8 L592.7 66.4 L590.7 68.7 L593.0 70.7 L589.5 75.1 L588.5 75.8 L587.5 76.4 L586.5 77.0 L585.4 77.7 L584.4 78.3 L583.4 79.0 L582.4 79.6 L581.4 80.3 L581.2 80.4 L581.1 82.5 L579.1 82.6 L582.6 86.4 L581.1 91.7 L577.1 93.5 L575.8 93.5 L574.6 93.6 L573.3 93.7 L572.1 93.8 L570.9 93.8 L569.6 93.9 L569.1 93.9 L567.8 93.7 L566.6 93.6 L565.4 93.4 L564.2 93.2 L562.9 93.1 L561.7 92.9 L560.5 92.7 L559.2 92.6 L558.0 92.4 L556.8 92.2 L556.7 92.2 L555.9 94.2 L558.3 97.4 L561.5 97.8 L562.1 101.8 L565.4 105.3 L564.3 105.9 L563.3 106.5 L562.3 107.1 L561.2 107.7 L560.2 108.3 L559.2 108.9 L558.0 109.1 L556.8 109.3 L555.6 109.5 L554.3 109.8 L553.1 110.0 L551.9 110.2 L550.7 110.4 L549.5 110.6 L548.4 110.8 L548.6 113.8 L546.1 115.6 L547.4 117.5 L546.6 118.4 L545.7 119.2 L544.9 120.0 L544.0 120.8 L543.2 121.6 L543.1 121.8 L543.3 122.9 L543.5 124.0 L543.7 125.1 L543.9 126.2 L544.1 127.3 L544.3 128.4 L544.5 129.5 L544.7 130.6 L544.8 131.2 L543.9 132.0 L543.0 132.8 L542.1 133.5 L541.2 134.3 L540.3 135.1 L539.4 135.8 L538.5 136.6 L534.5 137.4 L531.9 134.1 L526.3 133.9 L529.1 134.4 L528.2 135.1 L527.0 134.8 L525.9 134.4 L524.7 134.1 L523.5 133.8 L522.3 133.5 L521.1 133.2 L520.7 133.1 L516.8 136.8 L515.6 137.0 L514.4 137.3 L513.2 137.6 L512.0 137.9 L510.8 138.1 L509.6 138.4 L508.5 138.7 L509.3 140.6 L512.9 141.2 L512.6 142.4 L511.4 142.7 L510.2 142.9 L509.0 143.2 L507.8 143.4 L506.6 143.7 L505.4 144.0 L504.2 144.2 L503.0 144.5 L502.4 144.6 L497.7 144.1 L496.0 142.6 L490.8 144.6 L487.7 148.9 L484.0 149.7 L483.7 150.7 L483.3 151.8 L482.9 152.9 L482.6 153.9 L482.2 155.0 L481.8 156.1 L481.7 156.5 L483.1 158.9 L482.6 162.7 L480.8 165.8 L483.4 168.0 L481.2 169.9 L480.0 170.2 L478.8 170.4 L477.6 170.7 L476.4 171.0 L475.2 171.3 L474.0 171.5 L472.8 171.8 L471.5 172.1 L470.3 172.4 L469.1 172.6 L467.9 172.9 L466.7 173.2 L465.5 173.5 L464.3 173.7 L463.1 174.0 L461.9 174.3 L460.7 174.6 L459.5 174.8 L458.3 175.1 L457.1 175.4 L455.9 175.7 L455.9 175.7 L454.6 175.6 L453.4 175.6 L452.2 175.6 L450.9 175.6 L449.7 175.6 L448.4 175.6 L447.2 175.5 L445.9 175.5 L444.7 175.5 L443.5 175.5 L442.2 175.5 L442.1 175.5 L441.0 176.1 L440.0 176.7 L439.0 177.3 L437.9 177.9 L436.9 178.5 L436.9 178.5 L435.7 178.3 L434.5 178.0 L433.2 177.8 L432.0 177.6 L430.8 177.3 L429.6 177.1 L428.4 176.8 L427.2 176.6 L426.0 176.4 L425.9 176.4 L424.7 176.5 L423.5 176.6 L422.2 176.7 L421.0 176.7 L419.8 176.8 L418.5 176.9 L417.3 177.0 L416.1 177.1 L414.8 177.2 L413.6 177.3 L412.3 177.4 L411.1 177.5 L409.9 177.6 L408.6 177.7 L407.4 177.8 L406.2 177.9 L404.9 178.0 L403.7 178.1 L403.1 178.2 L401.9 177.9 L400.7 177.6 L399.5 177.3 L398.3 177.0 L397.2 176.7 L396.0 176.4 L394.8 176.1 L393.6 175.8 L392.4 175.5 L391.2 175.2 L390.0 174.8 L388.8 174.5 L387.6 174.2 L386.4 173.9 L385.2 173.6 L384.0 173.3 L382.8 173.0 L381.6 172.7 L380.4 172.4 L379.2 172.1 L378.0 171.8 L376.8 171.5 L375.6 171.2 L374.4 170.9 L373.3 170.6 L372.1 170.3 L370.9 170.0 L369.7 169.7 M1153.3 532.2 L1155.0 528.9 L1154.2 525.9 L1155.1 525.1 L1156.0 524.4 L1156.9 523.6 L1157.8 522.8 L1158.7 522.1 L1159.6 521.3 L1160.5 520.5 L1161.4 519.8 L1162.3 519.0 L1163.2 518.2 L1163.5 518.0 L1164.0 517.0 L1164.5 516.0 L1165.0 515.0 L1165.6 514.0 L1166.1 513.0 L1166.6 512.0 L1167.1 511.0 L1167.6 509.9 L1168.2 508.9 L1168.3 508.7 L1170.4 508.2 L1172.3 504.6 L1170.7 503.5 L1170.4 498.8 L1168.4 498.9 L1168.3 497.8 L1168.2 496.7 L1168.1 495.6 L1168.0 494.5 L1167.9 493.4 L1167.8 492.3 L1167.7 491.2 L1167.7 490.8 L1163.7 488.0 L1163.2 487.0 L1162.8 485.9 L1162.3 484.9 L1161.8 483.9 L1161.4 482.8 L1160.9 481.8 L1161.1 479.6 L1163.0 478.8 L1163.1 475.3 L1162.9 474.2 L1162.6 473.1 L1162.4 472.0 L1162.1 471.0 L1161.9 469.9 L1161.6 468.8 L1161.4 467.7 L1161.1 466.6 L1161.1 466.5 L1158.0 462.7 L1157.0 462.1 L1156.0 461.5 L1154.9 460.9 L1153.9 460.2 L1152.9 459.6 L1151.9 459.0 L1150.8 458.4 L1150.6 458.2 L1149.8 457.3 L1149.1 456.4 L1148.4 455.5 L1147.7 454.6 L1146.9 453.7 L1146.2 452.8 L1145.5 451.9 L1144.8 451.0 L1144.0 450.1 L1143.4 449.3 L1143.1 448.2 L1142.7 447.1 L1142.4 446.1 L1142.1 445.0 L1141.8 443.9 L1141.7 443.9 L1142.1 441.5 L1144.4 440.1 L1146.5 440.9 L1146.7 439.0 L1149.9 439.2 L1149.9 438.0 L1149.9 436.9 L1149.9 435.8 L1149.9 434.7 L1149.9 433.6 L1149.9 432.5 L1149.8 431.4 L1149.8 430.2 L1149.8 429.1 L1149.8 428.0 L1149.8 426.9 L1149.8 426.2 L1155.6 424.7 L1157.1 420.0 L1155.7 418.3 L1152.2 421.8 L1151.6 418.5 L1150.9 417.6 L1150.2 416.7 L1149.5 415.7 L1148.8 414.8 L1148.1 413.9 L1147.8 413.5 L1149.3 411.3 L1148.0 408.9 L1145.0 407.7 L1144.3 406.8 L1143.6 405.9 L1142.8 405.0 L1142.1 404.0 L1141.4 403.1 L1140.7 402.2 L1140.0 401.3 L1139.2 400.4 L1138.5 399.5 L1138.2 399.2 L1137.3 398.5 L1136.3 397.7 L1135.4 397.0 L1134.4 396.3 L1133.5 395.6 L1133.3 395.5 L1131.4 392.5 L1132.8 390.5 L1132.4 389.5 L1132.0 388.4 L1131.6 387.4 L1131.2 386.3 L1130.8 385.2 L1130.5 384.6 L1128.9 383.9 L1127.6 384.9 L1127.0 383.9 L1126.4 382.9 L1125.8 382.0 L1125.2 381.0 L1124.6 380.0 L1124.4 379.7 L1128.1 380.9 L1133.3 379.4 L1132.7 373.9 L1131.3 372.7 L1134.5 369.6 L1134.4 368.4 L1134.2 367.3 L1134.0 366.2 L1133.8 365.1 L1133.6 364.0 L1133.6 364.0 L1135.2 360.8 L1138.7 359.5 L1139.0 356.4 L1143.3 358.9 L1144.6 358.9 L1145.8 358.9 L1147.0 358.9 L1148.3 358.9 L1149.5 358.9 L1149.6 358.9 L1150.7 358.4 L1151.8 357.9 L1152.9 357.4 L1154.0 356.9 L1155.1 356.3 L1155.2 356.3 L1156.8 357.6 L1159.3 356.0 L1160.3 351.0 L1165.4 351.6 L1169.8 350.1 L1168.0 345.6 L1172.6 347.1 L1173.7 346.6 L1174.8 346.1 L1175.9 345.6 L1177.0 345.1 L1178.1 344.6 L1178.5 344.4 L1181.2 346.4 M743.5 103.9 L747.0 107.3 L748.2 107.6 L749.4 107.8 L750.6 108.0 L751.8 108.2 L753.1 108.4 L753.2 108.4 L752.2 112.1 L755.8 116.5 L755.0 117.3 L754.1 118.1 L753.3 118.9 L752.4 119.7 L751.6 120.5 L751.3 120.8 L748.3 120.8 L746.9 123.0 L744.2 123.5 L740.3 121.1 L739.9 118.2 L738.7 118.5 L737.5 118.7 L736.3 119.0 L735.0 119.2 L733.8 119.5 L732.6 119.8 L732.4 119.8 L732.7 120.9 L733.0 122.0 L733.3 123.1 L733.6 124.1 L733.9 125.2 L734.0 125.6 L734.9 126.3 L735.8 127.1 L736.8 127.8 L737.7 128.5 L738.7 129.3 L739.6 130.0 L740.1 130.4 L738.5 134.1 L741.6 137.2 L738.9 139.1 L740.5 140.3 L740.0 142.8 L744.9 142.5 L746.7 140.4 L747.5 141.3 L748.3 142.2 L749.1 143.1 L749.9 143.9 L750.6 144.8 L751.4 145.7 L752.2 146.5 L753.0 147.4 L753.6 148.1 L757.2 149.8 L763.0 149.3 L764.1 149.9 L765.2 150.5 L766.2 151.0 L767.3 151.6 L768.4 152.2 L769.4 152.7 L770.5 153.3 L770.7 153.4 L769.7 156.6 L770.9 156.9 L772.2 157.1 L773.4 157.4 L774.6 157.6 L775.8 157.9 L777.0 158.1 L778.1 158.3 L779.1 158.9 L780.2 159.5 L781.2 160.1 L782.3 160.7 L783.4 161.2 L784.4 161.8 L785.5 162.4 L786.5 163.0 L786.9 163.2 L784.0 163.2 L783.1 164.0 L782.2 164.7 L781.2 165.5 L780.3 166.2 L779.4 166.9 L778.5 167.7 L777.5 168.4 L776.6 169.2 L775.7 169.9 L774.8 170.7 L773.8 171.4 L773.3 171.8 L773.9 174.6 L770.4 177.8 L771.5 181.9 L768.6 183.7 L766.8 188.9 L767.9 189.5 L769.0 190.0 L770.0 190.6 L771.1 191.2 L772.2 191.7 L773.3 192.3 L774.3 192.9 L775.4 193.4 L776.0 193.8 L777.5 191.6 L778.5 192.2 L779.5 192.8 L780.5 193.4 L781.6 194.1 L782.6 194.7 L783.6 195.3 L784.7 195.9 L784.9 196.1 L790.2 197.5 L792.8 201.9 L794.9 201.2 L796.0 201.8 L797.0 202.4 L798.0 203.1 L799.1 203.7 L800.1 204.3 L801.1 204.9 L802.1 205.6 L803.2 206.2 L804.2 206.8 L804.4 206.9 L807.9 205.8 L809.0 206.4 L810.0 207.0 L811.1 207.6 L812.1 208.2 L813.2 208.8 L814.2 209.4 L815.3 210.0 L815.9 210.3 L821.4 209.7 L822.8 213.5 L824.0 213.7 L825.3 213.8 L826.5 214.0 L827.7 214.1 L829.0 214.3 L830.2 214.4 L831.2 214.5 L834.1 216.6 L835.8 214.0 L840.2 214.1 L845.3 216.3 L844.9 214.7 L849.1 214.6 L851.2 213.1 L854.4 215.6 L855.7 215.8 L856.9 216.0 L858.1 216.2 L859.3 216.4 L860.6 216.6 L860.9 216.6 L862.4 219.0 L861.7 222.0 L865.7 222.6 L869.8 225.7 L872.8 225.3 L873.6 227.3 L875.9 227.8 L877.0 227.3 L878.2 226.9 L879.3 226.4 L880.4 226.0 L881.6 225.5 L882.0 225.3 L882.8 226.2 L883.5 227.1 L884.3 228.0 L885.0 228.9 L885.8 229.8 L886.5 230.6 L886.7 230.8 L890.3 229.1 L893.9 230.6 L896.4 230.0 L897.5 230.5 L898.6 231.0 L899.8 231.4 L900.9 231.9 L902.0 232.4 L903.1 232.9 L904.3 233.4 L904.9 233.6 L909.3 231.5 M1068.2 179.6 L1071.7 182.6 L1076.0 183.4 L1075.5 182.5 L1076.7 182.9 L1077.9 183.2 L1079.1 183.6 L1080.2 183.9 L1081.4 184.3 L1082.6 184.7 L1083.8 185.0 L1083.9 185.1 L1088.1 181.0 L1089.2 180.5 L1090.4 180.1 L1091.5 179.6 L1092.6 179.2 L1093.8 178.7 L1094.9 178.3 L1096.0 177.8 L1097.2 177.4 L1098.0 177.0 L1101.4 181.0 L1104.2 180.3 L1103.9 182.3 L1099.0 184.2 L1099.7 187.0 L1100.8 186.6 L1102.0 186.2 L1103.1 185.8 L1104.3 185.4 L1105.5 185.0 L1106.6 184.6 L1107.1 184.4 L1106.4 186.2 L1109.3 190.1 L1106.2 191.6 L1105.5 192.5 L1104.7 193.4 L1104.0 194.3 L1103.3 195.1 L1102.5 196.0 L1102.0 196.7 L1105.0 197.8 L1110.1 195.6 L1111.2 196.0 L1112.4 196.4 L1113.5 196.9 L1114.7 197.3 L1115.8 197.7 L1116.9 198.1 L1120.0 197.2 L1124.7 200.5 L1124.7 201.6 L1124.7 202.7 L1124.8 203.8 L1124.8 205.0 L1124.8 206.1 L1124.9 206.2 L1122.4 206.0 L1121.4 206.7 L1120.5 207.4 L1119.5 208.1 L1118.6 208.9 L1117.6 209.6 L1116.7 210.3 L1115.7 211.0 L1114.9 211.6 L1115.3 214.5 L1116.0 215.4 L1116.8 216.2 L1117.5 217.1 L1118.3 218.0 L1119.1 218.9 L1119.8 219.8 L1120.5 220.6 L1118.5 221.1 L1115.1 219.7 L1111.6 216.1 L1110.4 216.3 L1109.2 216.5 L1108.0 216.7 L1106.7 216.8 L1105.5 217.0 L1104.3 217.2 L1103.1 217.4 L1101.9 217.6 L1100.6 217.8 L1100.6 217.8 L1099.6 218.5 L1098.6 219.2 L1097.6 219.8 L1096.6 220.5 L1095.6 221.2 L1094.6 221.8 L1093.6 222.5 L1092.6 223.2 L1091.6 223.8 L1090.6 224.5 L1089.6 225.2 L1088.6 225.8 L1087.6 226.5 L1086.6 227.2 L1085.6 227.8 L1085.0 228.3 L1083.8 228.6 L1082.6 228.9 L1081.4 229.3 L1080.2 229.6 L1079.1 229.9 L1078.9 230.0 L1078.5 231.1 L1078.2 232.1 L1077.9 233.2 L1077.5 234.3 L1077.2 235.4 L1077.2 235.4 L1079.5 240.3 L1076.3 242.8 L1076.6 246.2 L1075.6 246.9 L1074.7 247.7 L1073.7 248.4 L1072.8 249.1 L1071.8 249.8 L1070.9 250.5 L1069.9 251.2 L1069.0 252.0 L1068.1 252.6 L1067.1 256.0 L1070.2 257.5 L1070.4 259.5 L1069.7 260.5 L1069.0 261.4 L1068.4 262.4 L1067.7 263.3 L1067.0 264.2 L1066.4 265.2 L1065.7 266.1 L1065.1 267.1 L1064.4 268.0 L1063.7 269.0 L1063.2 269.7 L1062.8 270.7 L1062.3 271.7 L1061.9 272.8 L1061.5 273.8 L1061.0 274.9 L1060.6 275.9 L1060.1 276.9 L1059.7 278.0 L1059.3 279.0 L1058.8 280.1 L1058.4 281.1 L1058.4 281.2 L1057.2 280.8 L1056.0 280.4 L1054.9 280.0 L1053.7 279.6 L1052.5 279.2 L1051.4 278.9 L1050.2 278.5 L1050.1 278.4 L1044.4 279.2 L1041.5 277.1 L1041.8 278.2 L1042.1 279.3 L1042.4 280.4 L1042.6 281.5 L1042.9 282.5 L1043.2 283.6 L1043.5 284.5 L1043.3 285.6 L1043.2 286.7 L1043.1 287.9 L1043.0 289.0 L1042.9 290.1 L1042.8 291.2 L1042.7 292.3 L1042.6 293.4 L1042.5 294.5 L1042.5 294.5 L1040.6 297.0 L1037.3 296.3 L1036.5 301.0 L1036.7 302.1 L1037.0 303.2 L1037.2 304.3 L1037.4 305.4 L1037.6 306.5 L1037.9 307.6 L1038.1 308.7 L1038.3 309.8 L1038.5 310.9 L1038.6 311.0 L1037.7 312.2 L1035.4 312.0 L1034.4 315.8 L1033.3 315.2 L1032.3 316.6 L1028.5 312.7 L1026.3 316.0 M25.1 0.0 L25.0 1.9 L27.0 3.1 L27.0 4.2 L27.0 5.3 L27.0 6.4 L27.0 7.5 L27.0 8.6 L27.0 9.8 L27.0 10.9 L27.0 11.4 L30.7 12.2 L30.1 13.1 L29.5 14.1 L28.8 15.0 L28.2 16.0 L27.6 17.0 L26.9 17.9 L26.3 18.9 L25.7 19.8 L25.3 20.4 L26.4 20.9 L27.6 21.3 L28.7 21.8 L29.9 22.2 L31.0 22.7 L32.1 23.1 L33.3 23.5 L33.5 23.6 L32.9 29.0 L37.6 31.5 L36.5 35.1 L39.5 36.7 L38.2 40.7 L42.7 43.0 L41.6 45.6 L43.2 47.8 L47.2 48.6 L47.4 49.7 L47.6 50.8 L47.8 51.9 L48.0 53.0 L48.3 54.1 L48.5 55.2 L48.6 55.9 L52.9 55.7 L57.2 59.2 L58.4 59.0 L59.7 58.8 L60.9 58.7 L62.1 58.5 L63.3 58.3 L64.1 58.2 L69.3 59.3 L68.2 59.7 L67.0 60.1 L65.8 60.5 L64.7 61.0 L63.5 61.4 L62.5 61.7 L61.7 65.0 L62.5 65.9 L63.2 66.8 L63.9 67.7 L64.7 68.6 L65.4 69.5 L66.0 70.2 L65.6 72.2 L62.9 73.2 L60.7 72.5 L59.3 76.1 L57.4 75.9 L55.6 77.7 L56.3 82.5 L52.1 81.9 L50.4 84.5 L53.5 87.1 L53.1 90.1 L49.7 93.3 L51.9 93.9 L52.6 94.8 L53.3 95.8 L54.0 96.7 L54.7 97.6 L55.4 98.5 L56.1 99.5 L56.8 100.4 L56.8 100.4 L60.1 99.7 L61.0 101.1 L59.5 102.3 L62.0 102.2 L65.8 106.6 L65.9 108.2 L63.0 109.6 L65.2 110.2 L64.3 112.0 L65.5 112.1 L66.8 112.2 L68.0 112.3 L69.2 112.5 L70.5 112.6 L70.8 112.6 L71.9 113.2 L72.9 113.8 L73.9 114.4 L75.0 115.1 L76.0 115.7 L77.0 116.3 L78.1 116.9 L79.1 117.5 L80.1 118.1 L81.2 118.8 L82.2 119.4 L83.2 120.0 L84.3 120.6 L85.3 121.2 L85.6 121.4 L90.1 121.2 L91.7 122.6 L93.3 127.1 L94.1 127.9 L95.0 128.7 L95.9 129.5 L96.8 130.3 L97.7 131.1 L98.5 131.9 L99.4 132.6 L100.3 133.4 L100.6 133.7 L100.2 134.8 L99.7 135.8 L99.2 136.8 L98.7 137.8 L98.2 138.9 L97.7 139.9 L97.2 140.9 L97.2 141.0 L97.2 142.1 L97.2 143.2 L97.2 144.3 L97.1 145.5 L97.1 146.6 L97.1 147.7 L97.1 148.6 L98.4 148.6 L99.6 148.6 L100.8 148.6 L102.1 148.6 L103.3 148.6 L104.2 148.6 L104.2 149.7 L104.2 150.8 L104.2 152.0 L104.2 153.1 L104.2 154.2 L104.1 155.3 L104.1 156.4 L104.1 157.5 L104.1 158.0 L105.1 158.7 L106.1 159.4 L107.1 160.1 L108.0 160.7 L109.0 161.4 L110.0 162.1 L111.0 162.8 L111.7 163.3 L112.9 167.4 L114.0 167.9 L115.1 168.3 L116.3 168.8 L117.4 169.3 L118.5 169.7 L118.9 169.9 M1124.4 200.1 L1126.9 198.8 L1128.9 194.1 L1130.3 195.3 L1132.0 194.7 L1133.8 197.9 L1135.8 197.2 L1138.3 199.1 L1141.1 201.7 L1140.6 204.9 L1141.1 205.9 L1141.6 206.9 L1142.1 207.9 L1142.6 208.9 L1143.1 210.0 L1143.6 211.0 L1144.1 212.0 L1144.5 212.8 L1146.4 212.5 L1146.9 210.1 L1152.5 212.0 L1152.6 213.1 L1152.7 214.3 L1152.8 215.4 L1153.0 216.5 L1153.1 217.6 L1153.2 218.7 L1153.3 219.8 L1153.4 220.9 L1153.5 222.0 L1153.6 223.1 L1153.8 224.2 L1153.9 225.4 L1154.0 226.5 L1154.0 226.8 L1153.8 227.9 L1153.5 229.0 L1153.3 230.1 L1153.0 231.2 L1152.7 232.3 L1152.5 233.4 L1152.2 234.5 L1152.0 235.6 L1151.7 236.7 L1151.7 236.7 L1153.0 238.1 L1151.7 239.6 L1151.4 238.6 L1149.7 239.1 L1150.3 240.1 L1150.9 241.1 L1151.4 242.1 L1152.0 243.1 L1152.6 244.1 L1152.6 244.1 L1151.0 245.1 L1148.9 244.3 L1148.2 245.2 L1147.5 246.1 L1146.8 247.0 L1146.1 248.0 L1145.4 248.9 L1144.7 249.8 L1141.4 248.4 L1140.8 252.8 L1136.7 256.0 L1134.6 255.1 L1132.2 258.5 L1133.8 262.8 L1128.7 264.8 L1128.6 265.9 L1128.5 267.0 L1128.4 268.1 L1128.3 269.2 L1128.2 270.3 L1128.2 270.4 L1131.2 270.5 L1132.7 275.5 L1131.9 276.3 L1131.0 277.1 L1130.2 277.9 L1129.3 278.8 L1128.5 279.6 L1128.3 279.7 L1130.7 281.3 L1131.8 280.8 L1132.8 280.2 L1133.9 279.7 L1135.0 279.1 L1136.1 278.6 L1137.2 278.0 L1138.2 277.4 L1139.3 276.9 L1140.5 276.8 L1141.7 276.6 L1143.0 276.5 L1144.2 276.4 L1145.4 276.2 L1146.7 276.1 L1147.1 276.0 L1150.3 277.1 L1151.5 276.8 L1152.6 276.5 L1153.8 276.2 L1155.0 275.9 L1156.2 275.6 L1156.4 275.6 L1156.4 276.7 L1151.9 279.2 L1152.2 282.3 L1154.8 282.9 L1156.3 285.8 L1154.6 287.1 L1157.4 291.3 L1156.2 293.7 L1160.9 295.2 L1162.2 295.3 L1163.4 295.3 L1164.6 295.4 L1165.9 295.4 L1167.1 295.4 L1168.4 295.5 L1169.0 295.5 L1170.3 298.3 L1167.8 298.1 L1165.4 301.9 L1166.6 306.4 L1165.9 307.3 L1165.2 308.2 L1164.6 309.2 L1163.9 310.1 L1163.2 311.0 L1162.5 312.0 L1162.0 312.8 L1163.2 312.9 L1164.4 313.1 L1165.7 313.2 L1166.9 313.4 L1168.1 313.5 L1169.4 313.7 L1170.6 313.8 L1171.8 314.0 L1173.1 314.1 L1174.3 314.3 L1175.5 314.4 L1176.7 314.6 L1178.0 314.7 L1178.6 314.8 M909.2 231.6 L911.7 230.5 L913.2 233.8 L917.1 235.0 L919.6 233.4 L922.8 234.4 L923.9 234.0 L925.1 233.7 L926.3 233.4 L927.5 233.0 L928.7 232.7 L928.8 232.6 L931.7 234.5 L932.2 233.5 L932.6 232.5 L933.1 231.4 L933.6 230.4 L934.1 229.4 L934.6 228.4 L935.1 227.4 L934.5 226.5 L933.9 225.5 L933.2 224.5 L932.6 223.5 L932.0 222.6 L931.4 221.6 L930.9 220.7 L931.1 219.6 L931.3 218.5 L931.4 217.4 L931.6 216.3 L931.8 215.2 L932.0 214.1 L932.2 213.0 L932.2 213.0 L934.9 208.2 L933.7 205.4 L934.9 205.2 L936.2 204.9 L937.4 204.7 L938.6 204.4 L939.8 204.2 L941.0 204.0 L942.1 203.7 L944.0 202.1 L948.4 204.2 L949.3 207.2 L948.8 208.2 L948.4 209.3 L947.9 210.3 L947.4 211.4 L947.0 212.4 L946.8 212.8 L950.0 216.9 M950.0 216.9 L950.0 216.9 L946.6 220.1 L948.9 221.1 L949.2 223.8 L950.3 223.1 L954.1 226.1 L959.3 225.5 L964.9 227.1 L964.8 228.1 L969.1 228.4 L970.4 228.2 L971.6 228.0 L972.8 227.8 L974.0 227.6 L975.3 227.4 L975.6 227.4 L980.4 224.7 L981.5 225.1 L982.7 225.5 L983.8 226.0 L984.9 226.4 L986.1 226.9 L986.6 227.1 L987.9 227.1 L989.1 227.1 L990.4 227.0 L991.6 227.0 L992.9 227.0 L994.1 227.0 L995.3 227.0 L996.6 227.0 L997.8 227.0 L999.1 227.0 L999.6 227.0 L1001.9 225.2 L1004.4 226.5 L1005.7 226.3 L1006.9 226.1 L1008.1 225.8 L1009.3 225.6 L1010.5 225.4 L1010.6 225.4 L1011.8 226.5 L1012.0 224.8 L1014.4 225.6 L1016.1 224.2 L1014.0 220.9 L1016.2 217.4 L1014.0 214.1 L1009.0 215.1 L1005.9 212.7 L1006.1 211.6 L1006.2 210.4 L1006.3 209.3 L1006.4 208.2 L1006.5 207.1 L1006.6 206.0 L1006.7 205.3 L1005.6 204.8 L1004.4 204.4 L1003.3 203.9 L1002.2 203.5 L1001.0 203.0 L999.9 202.6 L999.6 202.5 L994.9 204.8 L993.7 204.5 L992.5 204.2 L991.4 203.8 L990.2 203.5 L989.0 203.1 L987.8 202.8 L986.9 202.5 L985.6 202.6 L984.4 202.6 L983.2 202.7 L981.9 202.7 L980.7 202.8 L980.1 202.8 L980.4 199.7 L979.2 199.4 L978.0 199.2 L976.8 199.0 L975.5 198.8 L974.3 198.5 L973.1 198.3 L972.9 198.3 L971.8 198.8 L970.7 199.2 L969.6 199.7 L968.5 200.2 L967.4 200.7 L966.2 201.2 L965.1 201.7 L964.0 202.2 L962.9 202.7 L961.8 203.2 L960.9 204.0 L960.1 204.8 L959.2 205.6 L958.3 206.4 L957.4 207.2 L956.5 208.0 L956.4 208.1 L954.3 212.3 L951.1 214.1 L950.0 216.9 M653.6 137.5 L654.6 140.1 L654.2 141.1 L653.7 142.1 L653.3 143.2 L652.9 144.2 L652.4 145.3 L652.3 145.5 L655.7 147.4 L652.9 147.4 L652.0 148.2 L651.2 149.1 L650.4 149.9 L649.6 150.7 L648.7 151.6 L647.9 152.4 L647.1 153.2 L646.2 154.0 L645.4 154.9 L644.6 155.7 L643.7 156.5 L643.0 157.3 L640.0 158.2 L638.4 160.4 L640.8 163.5 L639.7 164.0 L638.5 164.4 L637.4 164.9 L636.3 165.3 L635.1 165.8 L634.0 166.2 L632.8 166.7 L631.7 167.1 L630.6 167.6 L629.4 168.0 L628.9 168.2 L628.5 169.3 L628.1 170.3 L627.7 171.4 L627.3 172.4 L626.9 173.5 L626.5 174.5 L626.3 175.3 L625.6 176.2 L625.0 177.2 L624.3 178.1 L623.7 179.1 L623.0 180.0 L622.4 181.0 L621.7 181.9 L621.1 182.9 L620.4 183.8 L619.8 184.8 L619.6 185.0 L618.5 185.5 L617.4 186.0 L616.2 186.4 L615.1 186.9 L614.0 187.3 L612.8 187.8 L611.7 188.2 L610.6 188.7 L609.4 189.2 L608.3 189.6 L608.1 189.7 L607.5 190.7 L607.0 191.7 L606.5 192.7 L605.9 193.7 L605.4 194.7 L604.8 195.7 L604.3 196.7 L604.3 196.8 L603.4 197.6 L602.5 198.4 L601.6 199.2 L600.7 199.9 L599.8 200.7 L599.0 201.5 L598.3 202.0 L597.9 205.0 L596.7 205.3 L595.5 205.5 L594.2 205.8 L593.0 206.0 L591.8 206.3 L590.6 206.6 L589.4 206.8 L588.2 207.1 L587.0 207.3 L585.8 207.6 L584.6 207.9 L583.4 208.1 L582.2 208.4 L581.0 208.6 L579.8 208.9 L578.6 209.2 L577.4 209.4 L576.1 209.7 L575.9 209.7 L573.9 209.3 L573.3 208.3 L572.7 207.3 L572.1 206.4 L571.5 205.4 L570.8 204.4 L570.7 204.2 L566.2 203.9 L565.3 204.6 L564.3 205.3 L563.3 206.0 L562.4 206.7 L561.4 207.4 L561.3 207.5 L560.6 208.4 L560.0 209.4 L559.3 210.3 L558.7 211.3 L558.0 212.2 L557.3 213.1 L556.7 214.1 L556.0 215.0 L555.9 215.3 L554.9 216.0 L554.0 216.7 L553.0 217.4 L552.0 218.1 L551.1 218.8 L550.1 219.5 L549.9 219.6 L549.7 220.7 L549.5 221.8 L549.3 222.9 L549.1 224.0 L548.9 225.1 L548.6 226.2 L548.4 227.3 L548.4 227.4 L549.5 227.9 L550.6 228.5 L551.7 229.0 L552.8 229.5 L553.9 230.1 L554.5 230.4 L555.7 230.6 L557.0 230.7 L558.2 230.9 L559.4 231.1 L560.6 231.2 L561.9 231.4 L562.4 231.5 L562.2 232.6 L562.0 233.7 L561.8 234.8 L561.6 235.9 L561.4 237.0 L561.2 238.1 L561.0 239.2 L560.8 240.3 L560.6 241.4 L560.5 241.8 L561.2 242.7 L561.9 243.7 L562.6 244.6 L563.3 245.5 L564.1 246.4 L564.4 246.9 L565.7 246.9 L566.9 247.0 L568.2 247.0 L569.4 247.1 L570.6 247.1 L571.9 247.2 L572.5 247.2 L572.6 252.5 L573.4 253.4 L574.2 254.3 L575.0 255.1 L575.8 256.0 L576.6 256.8 L576.8 257.1 L577.3 258.1 L577.8 259.1 L578.3 260.2 L578.8 261.2 L579.3 262.2 L579.8 263.2 L580.3 264.2 L580.8 265.3 L581.1 265.8 L578.8 267.5 L579.4 270.1 L581.5 270.8 L580.4 271.3 L579.2 271.8 L578.1 272.2 L577.0 272.7 L575.9 273.2 L574.7 273.6 L573.6 274.1 L573.4 274.2 L570.7 273.4 L570.6 270.6 L567.5 271.0 L566.3 271.3 L565.1 271.7 L563.9 272.0 L562.8 272.3 L561.6 272.7 L561.1 272.8 L559.2 275.4 L558.0 275.4 L556.7 275.4 L555.5 275.4 L554.2 275.4 L553.0 275.4 L552.9 275.4 L550.3 273.3 L549.1 273.4 L547.8 273.4 L546.6 273.5 L545.4 273.5 L544.1 273.5 L542.9 273.6 L542.7 273.6 M378.2 63.0 L377.5 57.6 L375.0 56.2 L377.2 53.4 L377.0 52.3 L376.8 51.2 L376.6 50.1 L376.5 48.9 L376.3 47.8 L376.1 46.7 L376.0 45.6 L375.8 44.5 L375.7 43.6 L374.4 43.6 L373.2 43.6 L371.9 43.6 L370.7 43.6 L369.5 43.6 L368.2 43.6 L367.0 43.6 L365.7 43.6 L364.5 43.6 L363.3 43.6 L362.0 43.6 L360.8 43.5 L359.5 43.5 L358.6 43.5 L357.8 42.7 L357.1 41.8 L356.3 40.9 L355.5 40.0 L354.7 39.2 L354.0 38.3 L353.2 37.4 L352.4 36.6 L352.3 36.5 L351.2 36.1 L350.0 35.8 L348.8 35.4 L347.6 35.1 L346.4 34.7 L345.3 34.4 L344.1 34.0 L342.9 33.7 L341.7 33.3 L340.9 33.1 L340.4 32.1 L339.9 31.0 L339.4 30.0 L338.9 29.0 L338.4 28.0 L338.0 27.1 L336.2 27.6 L335.1 27.2 L333.9 26.7 L332.8 26.2 L331.7 25.8 L330.5 25.3 L329.4 24.9 L328.3 24.4 L327.4 24.1 L326.1 24.2 L324.9 24.4 L323.7 24.6 L322.5 24.8 L321.2 24.9 L320.0 25.1 L318.8 25.3 L318.4 25.3 L315.1 24.5 L314.0 22.4 L312.7 22.1 L311.5 21.9 L310.3 21.7 L309.1 21.5 L307.9 21.3 L306.6 21.1 L305.4 20.8 L304.2 20.6 L303.0 20.4 L301.8 20.2 L300.6 20.0 L299.3 19.8 L299.0 19.7 L298.3 18.8 L297.6 17.9 L296.8 17.0 L296.1 16.0 L295.4 15.1 L294.7 14.2 L294.0 13.3 L290.9 15.0 L289.7 14.7 L288.5 14.3 L287.3 14.0 L286.1 13.7 L284.9 13.4 L284.6 13.3 L283.4 13.4 L282.1 13.5 L280.9 13.5 L279.7 13.6 L278.4 13.7 L278.1 13.7 L275.6 15.1 L275.9 17.0 L273.7 17.3 L272.5 17.1 L271.3 17.0 L270.0 16.9 L268.8 16.7 L267.6 16.6 L266.3 16.5 L265.1 16.4 L263.9 16.2 L262.7 16.4 L261.5 16.5 L260.2 16.7 L259.0 16.8 L257.8 16.9 L257.4 17.0 L256.4 17.5 L255.3 18.1 L254.2 18.6 L253.1 19.1 L252.0 19.7 L250.9 20.2 L249.8 20.8 L248.8 21.3 L247.7 21.9 L246.6 22.4 L245.5 22.9 L244.8 23.3 L243.9 27.5 L241.7 28.9 L240.5 29.2 L239.3 29.5 L238.1 29.7 L236.9 30.0 L235.7 30.3 L234.5 30.6 L233.3 30.9 L232.4 31.1 L231.1 31.0 L229.9 30.9 L228.7 30.8 L227.4 30.7 L226.2 30.7 L225.6 30.6 M1191.3 350.0 L1190.8 351.0 L1190.3 352.0 L1189.8 353.0 L1189.3 354.1 L1188.8 355.1 L1188.3 356.1 L1187.8 357.1 L1187.7 357.4 L1189.4 361.4 L1195.4 362.4 L1198.0 359.8 L1199.2 360.0 L1200.0 360.1 M1200.0 393.1 L1199.6 394.1 L1199.2 395.1 L1198.7 396.2 L1198.3 397.2 L1198.1 397.6 L1200.0 398.5 M720.4 65.0 L719.3 65.5 L718.2 66.0 L717.1 66.5 L716.0 67.0 L714.9 67.5 L713.8 68.1 L712.7 68.6 L711.6 69.1 L710.5 69.6 L709.4 70.1 L708.3 70.6 L707.2 71.1 L706.1 71.6 L705.0 72.1 L704.3 72.4 L703.9 73.5 L703.4 74.5 L703.0 75.6 L702.6 76.6 L702.1 77.7 L701.7 78.7 L701.2 79.7 L700.9 80.6 L699.7 80.3 L698.5 80.0 L697.3 79.8 L696.1 79.5 L694.9 79.2 L693.7 78.9 L692.5 78.6 L692.2 78.6 L691.2 79.2 L690.1 79.8 L689.1 80.4 L688.0 81.0 L687.0 81.6 L686.5 81.9 L682.6 81.2 L681.5 81.6 L680.3 82.0 L679.2 82.4 L678.0 82.8 L676.8 83.2 L675.8 83.5 L674.5 83.3 L673.3 83.1 L672.1 82.8 L670.9 82.6 L669.7 82.3 L668.5 82.1 L667.3 81.9 L666.1 81.6 L664.8 81.4 L663.6 81.2 L662.4 80.9 L661.2 80.7 L660.0 80.4 L658.8 80.2 L657.6 80.0 L656.4 79.7 L655.1 79.5 L653.9 79.2 L652.7 79.0 L651.5 78.8 L650.3 78.5 L649.2 78.3 L648.1 78.6 L646.9 79.0 L645.7 79.3 L644.5 79.6 L643.3 80.0 L642.1 80.3 L640.9 80.6 L640.2 80.8 L637.2 85.7 L641.8 89.0 L639.6 91.6 L640.8 91.8 L642.0 92.1 L643.2 92.4 L644.4 92.6 L645.6 92.9 L646.8 93.1 L647.5 93.3 L646.5 93.9 L645.5 94.6 L644.5 95.3 L643.6 96.0 L642.6 96.7 L641.6 97.3 L641.2 97.6 L641.4 99.3 L645.1 101.8 L644.6 102.8 L644.0 103.8 L643.5 104.8 L642.9 105.8 L642.4 106.8 L641.8 107.8 L641.7 107.9 L642.8 108.5 L643.9 109.1 L644.9 109.6 L646.0 110.2 L647.1 110.8 L648.1 111.3 L648.4 111.5 L648.8 115.6 L653.8 115.9 L656.1 114.4 L654.9 119.0 L656.2 121.2 L657.5 121.2 L658.7 121.1 L659.9 121.1 L661.2 121.1 L662.4 121.1 L663.1 121.1 L664.2 121.7 L665.2 122.2 L666.3 122.8 L667.4 123.3 L668.5 123.9 L669.4 124.4 M50.4 0.0 L50.5 0.0 L51.7 0.3 L52.9 0.5 L54.1 0.7 L55.3 1.0 L56.5 1.2 L57.7 1.5 L59.0 1.7 L60.2 1.9 L61.4 2.2 L62.6 2.4 L63.8 2.6 L65.0 2.9 L65.5 3.0 L69.4 1.7 L73.2 2.4 L74.1 1.6 L75.0 0.8 L75.9 0.1 L76.0 0.0 M109.2 0.0 L104.9 0.9 L103.9 3.1 L104.9 3.7 L105.9 4.4 L106.8 5.1 L107.8 5.7 L108.8 6.4 L109.8 7.1 L110.2 7.4 L112.6 7.0 L116.4 11.3 L121.7 10.3 M1200.0 326.6 L1199.3 327.0 L1198.3 327.6 L1197.3 328.3 L1196.8 328.6 L1194.3 328.6 L1193.6 329.5 L1193.0 330.5 L1192.4 331.5 L1191.8 332.5 L1191.2 333.4 L1190.6 334.4 L1190.1 335.2 L1190.2 336.7 L1192.7 336.7 L1191.5 337.0 L1190.3 337.4 L1189.2 337.7 L1188.0 338.0 L1186.8 338.4 L1185.6 338.7 L1184.6 339.0 L1184.1 340.0 L1183.6 341.1 L1183.2 342.1 L1182.7 343.1 L1182.2 344.2 L1181.7 345.2 L1181.3 346.2 L1181.2 346.4 L1182.6 348.5 L1184.6 345.7 L1186.2 345.6 L1188.7 349.3 L1191.3 349.9 M486.9 30.4 L487.0 29.2 L487.0 28.1 L487.0 27.0 L487.0 25.9 L487.0 24.8 L487.0 23.7 L487.0 22.8 L489.2 18.5 L488.0 18.1 L486.9 17.7 L485.7 17.4 L484.5 17.0 L483.4 16.6 L482.2 16.2 L481.0 15.8 L479.9 15.4 L478.7 15.0 L477.5 14.6 L476.4 14.3 L475.2 13.9 L474.1 13.5 L473.7 13.4 L470.4 14.4 L466.8 13.6 L465.8 13.1 L464.7 12.5 L463.6 12.0 L462.5 11.5 L461.4 11.0 L460.3 10.5 L459.2 9.9 L458.1 9.4 L457.0 8.9 L455.9 8.4 L454.8 7.9 L453.7 7.3 L452.6 6.8 L451.5 6.3 L450.4 5.8 L449.3 5.3 L448.2 4.7 L447.6 4.4 L446.6 3.7 L445.6 3.1 L444.6 2.4 L443.7 1.7 L442.7 1.0 L441.7 0.3 L441.5 0.2 L438.1 0.8 L437.0 0.3 L436.4 0.0 M486.9 30.4 L487.0 29.2 L487.0 28.1 L487.0 27.0 L487.0 25.9 L487.0 24.8 L487.0 23.7 L487.0 22.8 L489.2 18.5 L488.0 18.1 L486.9 17.7 L485.7 17.4 L484.5 17.0 L483.4 16.6 L482.2 16.2 L481.0 15.8 L479.9 15.4 L478.7 15.0 L477.5 14.6 L476.4 14.3 L475.2 13.9 L474.1 13.5 L473.7 13.4 L470.4 14.4 L466.8 13.6 L465.8 13.1 L464.7 12.5 L463.6 12.0 L462.5 11.5 L461.4 11.0 L460.3 10.5 L459.2 9.9 L458.1 9.4 L457.0 8.9 L455.9 8.4 L454.8 7.9 L453.7 7.3 L452.6 6.8 L451.5 6.3 L450.4 5.8 L449.3 5.3 L448.2 4.7 L447.6 4.4 L446.6 3.7 L445.6 3.1 L444.6 2.4 L443.7 1.7 L442.7 1.0 L441.7 0.3 L441.5 0.2 L438.1 0.8 L437.0 0.3 L436.4 0.0 M73.2 2.3 L72.8 1.2 L72.3 0.2 L72.3 0.0 M1168.2 605.0 L1169.4 604.8 L1170.6 604.6 L1171.8 604.4 L1173.1 604.2 L1174.3 604.0 L1175.5 603.7 L1176.7 603.5 L1177.2 603.4 L1181.9 605.1 L1182.2 604.0 L1182.6 602.9 L1183.0 601.9 L1183.4 600.8 L1183.7 599.7 L1183.8 599.7 L1185.6 599.9 L1188.4 603.3 L1193.0 604.5 L1194.9 603.5 L1197.1 608.5 L1200.0 608.4 M1200.0 616.5 L1199.8 616.8 L1200.0 617.0 M0.0 30.9 L3.1 30.1 L4.3 30.4 L5.5 30.7 L6.7 30.9 L7.9 31.2 L9.1 31.5 L10.3 31.8 L11.5 32.0 L12.7 32.3 L13.9 32.6 L15.1 32.9 L16.3 33.1 L17.3 33.3 L18.4 32.9 L19.6 32.5 L20.7 32.1 L21.9 31.7 L23.0 31.3 L23.1 31.3 L26.1 32.6 L24.7 35.3 L27.3 37.7 L28.3 37.1 L29.3 36.4 L30.3 35.8 L31.4 35.2 L32.4 34.6 L33.4 33.9 L33.9 33.7 L37.0 34.4 M252.4 302.7 L252.5 301.6 L252.6 300.5 L252.8 299.4 L252.9 298.3 L253.0 297.2 L253.2 296.1 L253.3 295.0 L253.8 294.0 L254.4 293.0 L254.9 292.0 L255.5 291.0 L256.0 290.0 L256.6 289.0 L257.1 288.0 L257.7 287.0 L258.2 286.0 L258.8 285.0 L259.3 284.0 L259.9 283.0 L260.0 282.8 L258.1 279.2 L259.3 279.0 L260.5 278.7 L261.7 278.5 L262.9 278.3 L264.2 278.1 L265.4 277.9 L266.6 277.7 L267.8 277.5 L269.0 277.2 L269.5 277.2 L267.9 274.2 L264.4 274.2 L265.5 272.3 L265.5 271.2 L265.4 270.1 L265.3 269.0 L265.3 267.8 L265.2 266.7 L265.2 265.6 L265.1 264.5 L265.0 263.4 L265.0 262.3 L265.0 262.3 L269.2 260.5 L270.0 262.5 L268.6 262.5 L271.9 264.8 L272.7 264.0 L273.6 263.2 L274.5 262.4 L275.3 261.6 L276.2 260.8 L276.7 260.4 M1006.8 208.7 L1008.0 208.8 L1009.2 208.9 L1010.5 209.0 L1011.7 209.2 L1012.9 209.3 L1013.3 209.3 L1019.0 207.7 L1019.2 206.6 L1020.5 208.1 L1025.3 206.8 L1028.6 204.8 L1028.2 201.8 L1029.2 201.3 L1030.3 200.7 L1031.4 200.1 L1032.5 199.6 L1033.5 199.0 L1034.6 198.5 L1035.7 197.9 L1036.8 197.3 L1037.3 197.0 L1039.2 192.5 L1040.4 192.4 L1041.7 192.2 L1042.9 192.1 L1044.1 192.0 L1045.4 191.8 L1046.6 191.7 L1047.8 191.5 L1049.1 191.4 L1049.9 191.3 L1051.0 190.8 L1052.0 190.2 L1053.1 189.7 L1054.2 189.2 L1055.3 188.7 L1056.2 188.2 L1055.9 186.2 L1057.9 186.3 L1061.2 183.0 L1066.4 181.6 L1068.2 179.6 M786.7 163.5 L788.5 166.7 L790.8 167.0 L794.0 164.0 L794.9 160.0 L797.4 161.0 L799.4 159.3 L800.6 159.5 L801.8 159.6 L803.1 159.8 L804.3 160.0 L805.5 160.2 L806.7 160.4 L807.9 160.6 L809.0 160.8 L810.6 166.0 L811.8 166.3 L812.9 166.6 L814.1 167.0 L815.3 167.3 L816.5 167.6 L817.7 168.0 L818.4 168.2 L819.4 169.0 L820.3 169.7 L821.2 170.5 L822.1 171.2 L823.0 172.0 L823.9 172.7 L824.6 173.3 L827.4 173.2 L829.5 174.9 L831.6 174.0 L832.4 174.9 L833.2 175.7 L834.0 176.6 L834.7 177.5 L835.5 178.3 L836.3 179.2 L837.1 180.1 L837.8 180.9 L838.6 181.8 L839.0 182.3 L841.5 182.7 L846.5 180.3 L850.6 180.8 L853.6 184.9 L853.2 187.2 L854.2 187.9 L855.2 188.6 L856.2 189.2 L857.2 189.9 L858.2 190.6 L858.2 190.6 L859.3 191.1 L860.4 191.6 L861.5 192.2 L862.6 192.7 L863.7 193.2 L864.8 193.7 L865.8 194.2 L870.2 192.4 L872.9 193.1 L872.6 194.2 L872.3 195.2 L872.0 196.3 L871.7 197.4 L871.4 198.5 L871.3 198.6 L872.6 198.8 L873.8 198.9 L875.0 199.0 L876.3 199.1 L877.5 199.2 L878.8 199.3 L880.0 199.5 L881.2 199.6 L881.8 199.6 L883.8 198.0 L884.5 198.9 L885.2 199.9 L885.8 200.8 L886.5 201.7 L887.2 202.7 L887.9 203.6 L888.5 204.5 L889.2 205.5 L889.9 206.4 L889.9 206.5 L892.5 205.5 L891.6 202.7 L893.5 201.2 L894.3 204.2 L898.9 206.0 L900.7 205.1 L901.5 202.3 L903.9 202.2 L904.9 202.8 L906.0 203.3 L907.1 203.9 L908.2 204.4 L909.2 205.0 L910.3 205.5 L911.4 206.1 L912.5 206.6 L913.6 207.2 L914.3 207.6 L915.6 207.6 L916.8 207.6 L918.1 207.7 L919.3 207.7 L920.5 207.8 L921.8 207.8 L923.0 207.8 L924.3 207.9 L925.3 207.9 L928.3 205.8 L934.1 206.8 M112.1 194.2 L110.9 194.2 L109.7 194.2 L108.4 194.2 L107.2 194.2 L105.9 194.2 L104.7 194.2 L103.5 194.2 L102.2 194.2 L101.0 194.2 L99.7 194.3 L98.5 194.3 L97.2 194.3 L97.0 194.3 L96.5 193.3 L95.9 192.3 L95.4 191.3 L94.8 190.3 L94.2 189.3 L93.7 188.3 L93.1 187.3 L92.6 186.3 L92.3 185.7 L91.0 185.6 L89.8 185.6 L88.6 185.5 L87.3 185.4 L86.1 185.3 L84.8 185.2 L83.6 185.2 L82.4 185.1 L81.1 185.0 L79.9 184.9 L78.7 184.8 L77.4 184.8 L76.2 184.7 L74.9 184.6 L73.7 184.5 L72.5 184.4 L71.2 184.4 L70.0 184.3 L68.8 184.2 L67.5 184.1 L66.3 184.0 L65.0 183.9 L63.8 183.9 L62.6 183.8 L61.3 183.7 L60.1 183.6 L58.8 183.5 L57.6 183.5 L56.4 183.4 L55.1 183.3 L53.9 183.2 L52.7 183.1 L51.4 183.1 L50.2 183.0 L48.9 182.9 L47.7 182.8 L46.5 182.7 L45.2 182.7 L44.0 182.6 L42.8 182.5 L41.5 182.4 L40.3 182.3 L39.0 182.3 L37.8 182.2 L36.6 182.1 L35.8 182.0 L34.6 181.7 L33.5 181.3 L32.3 180.9 L31.1 180.5 L29.9 180.2 L28.8 179.8 L27.6 179.4 L26.4 179.0 L25.3 178.6 L24.1 178.3 L22.9 177.9 L21.8 177.5 L20.7 177.2 M511.2 0.0 L511.2 0.1 L512.5 0.1 L513.7 0.1 L515.0 0.1 L516.2 0.1 L517.4 0.1 L518.7 0.0 L519.6 0.0 L521.3 2.7 L519.0 3.8 L518.7 8.5 L519.6 9.3 L520.4 10.2 L521.2 11.0 L522.1 11.8 L522.9 12.7 L523.7 13.5 L524.6 14.3 L525.2 14.9 L523.0 19.3 L520.4 19.9 L519.6 20.8 L518.9 21.7 L518.1 22.6 L517.4 23.5 L516.7 24.4 L515.9 25.3 L515.2 26.2 L514.5 27.1 L513.9 27.7 L513.7 28.8 L513.5 29.9 L513.2 31.0 L513.0 32.1 L512.8 33.2 L512.7 33.7 M0.0 155.2 L0.2 155.8 L0.5 156.9 L0.8 157.9 L1.2 159.0 L1.3 159.4 L2.5 159.5 L3.8 159.6 L5.0 159.6 L6.2 159.7 L7.5 159.8 L8.7 159.8 L10.0 159.9 L11.2 160.0 L12.4 160.0 L13.6 160.1 L13.5 161.2 L13.4 162.3 L13.3 163.4 L13.2 164.5 L13.1 165.6 L13.0 166.8 L12.9 167.9 L12.8 169.0 L12.7 170.1 L12.5 171.2 L12.4 172.3 L12.3 173.4 L12.2 174.5 L13.4 174.9 L14.6 175.2 L15.7 175.6 L16.9 176.0 L18.1 176.4 L19.3 176.7 L20.4 177.1 L20.7 177.2 M63.7 0.0 L64.1 0.7 L64.8 1.6 L65.5 2.5 L65.7 2.9 M542.7 273.6 L537.7 273.8 L536.3 272.5 L535.0 274.1 L534.3 272.4 L532.8 272.6 L532.8 273.7 L532.8 274.8 L532.8 276.0 L532.7 277.1 L532.7 278.2 L532.7 279.1 L531.5 279.2 L530.2 279.3 L529.0 279.3 L527.7 279.4 L526.5 279.4 L525.3 279.5 L524.0 279.6 L523.3 279.6 L522.7 280.6 L522.1 281.6 L521.5 282.6 L520.9 283.6 L520.4 284.5 L520.0 285.1 M102.4 166.9 L97.6 165.6 L96.3 165.7 L95.1 165.9 L93.9 166.0 L92.6 166.1 L91.4 166.3 L90.2 166.4 L88.9 166.6 L87.7 166.7 L86.5 166.8 L86.3 166.9 L85.7 167.8 L85.1 168.8 L84.5 169.8 L83.9 170.8 L83.4 171.8 L82.8 172.8 L82.2 173.7 L81.6 174.7 L81.5 174.9 L80.8 175.7 L80.0 176.6 L79.2 177.4 L78.4 178.3 L77.6 179.2 L76.8 180.0 L76.0 180.9 L75.2 181.7 L74.4 182.6 L73.7 183.5 L73.4 183.8 M1178.6 314.8 L1178.7 315.9 L1178.7 317.0 L1178.7 318.1 L1178.7 319.2 L1178.8 320.4 L1178.8 320.7 L1182.9 322.1 L1181.7 324.5 L1183.7 326.2 M1197.7 321.6 L1196.8 322.3 L1195.9 323.1 L1195.0 323.8 L1194.1 324.6 L1193.2 325.3 L1193.1 325.4 L1189.3 325.8 L1187.1 324.3 L1183.8 326.2 M1135.5 547.3 L1136.7 547.2 L1137.9 547.0 L1139.1 546.9 L1140.4 546.8 L1141.6 546.6 L1142.0 546.6 L1142.6 545.6 L1143.2 544.6 L1143.9 543.7 L1144.5 542.7 L1145.1 541.7 L1145.7 540.8 L1149.4 539.7 L1149.9 538.7 L1150.4 537.7 L1150.9 536.7 L1151.5 535.7 L1152.0 534.7 L1152.5 533.7 L1153.0 532.6 L1153.3 532.0 M669.4 124.4 L668.4 127.2 L667.2 127.5 L666.0 127.8 L664.8 128.1 L663.6 128.4 L662.4 128.7 L661.2 128.9 L660.0 129.2 L658.8 129.5 L658.2 129.6 L657.2 130.3 L656.2 131.0 L655.2 131.6 L654.2 132.3 L653.2 132.9 L652.5 133.4 L653.6 137.4 M186.2 371.4 L187.4 371.1 L188.5 370.7 L189.7 370.4 L190.9 370.0 L192.1 369.7 L193.3 369.3 L194.4 369.0 L195.6 368.6 L196.8 368.3 L198.0 367.9 L199.1 367.6 L200.3 367.2 L201.5 366.9 L202.7 366.5 L203.9 366.2 L205.0 365.8 L206.2 365.4 L207.4 365.1 L208.6 364.7 L209.7 364.4 L210.9 364.0 L212.1 363.7 L213.3 363.3 L214.5 363.0 L215.6 362.6 L216.8 362.3 L218.0 361.9 L219.2 361.6 L220.3 361.2 L221.5 360.9 L222.7 360.5 L223.9 360.2 L225.1 359.8 L226.2 359.5 L227.4 359.1 L228.6 358.8 L229.8 358.4 L230.9 358.0 L232.1 357.7 L233.3 357.3 L234.5 357.0 L235.7 356.6 L236.8 356.3 L238.0 355.9 L239.2 355.6 L240.4 355.2 L241.5 354.9 L242.7 354.5 L243.9 354.2 L245.1 353.8 L246.3 353.5 L247.4 353.1 L248.3 352.9 L248.7 351.8 L249.1 350.7 L249.5 349.7 L249.8 348.6 L250.2 347.6 L250.6 346.5 L251.0 345.5 L251.4 344.4 L251.8 343.3 L252.2 342.3 L252.6 341.2 L253.0 340.2 L253.4 339.1 L253.8 338.1 L254.2 337.0 L254.6 335.9 L254.9 334.9 L255.3 333.8 L255.7 332.8 L256.1 331.7 L256.5 330.7 L256.9 329.6 L257.3 328.5 L257.7 327.5 L258.1 326.4 L258.5 325.4 L258.9 324.3 L259.3 323.3 L259.7 322.2 L260.0 321.1 L260.4 320.1 L260.8 319.0 L261.2 318.0 L261.6 316.9 L262.0 315.9 L262.1 315.7 L261.4 314.8 L260.7 313.9 L260.0 312.9 L259.3 312.0 L258.6 311.1 L257.9 310.2 L257.2 309.2 L256.5 308.3 L255.9 307.4 L255.2 306.4 L254.5 305.5 L253.8 304.6 L253.1 303.7 L252.4 302.7 L252.4 302.7 L248.3 306.4 L247.0 306.3 L245.8 306.1 L244.6 305.9 L243.4 305.7 L242.1 305.5 L240.9 305.3 L239.7 305.2 L238.5 305.0 L237.2 304.8 L236.0 304.6 L234.8 304.4 L233.6 304.2 L232.3 304.1 L231.1 303.9 L229.9 303.7 L228.7 303.5 L227.4 303.3 L226.2 303.1 L225.0 303.0 L223.8 302.8 L222.6 302.6 L221.3 302.4 L220.1 302.2 L218.9 302.0 L217.7 301.9 L216.4 301.7 L215.2 301.5 L214.0 301.3 L212.8 301.1 L211.5 300.9 L210.3 300.8 L209.1 300.6 L207.9 300.4 L206.6 300.2 L205.4 300.0 L204.2 299.8 L203.0 299.7 L201.7 299.5 L200.5 299.3 L199.3 299.1 L198.1 298.9 L196.8 298.7 L195.6 298.6 L194.4 298.4 L193.2 298.2 L191.9 298.0 L190.7 297.8 L189.5 297.6 L188.3 297.5 L187.0 297.3 L186.2 297.1 L185.9 296.1 L185.5 295.0 L185.2 293.9 L184.8 292.9 L184.5 291.8 L184.1 290.7 L183.8 289.7 L183.4 288.6 L183.1 287.5 L182.8 286.4 L182.4 285.4 L182.1 284.3 L181.7 283.2 L181.4 282.2 L181.0 281.1 L181.0 281.1 L180.0 280.5 L178.9 279.9 L177.9 279.3 L176.8 278.7 L175.8 278.1 L174.7 277.5 L173.7 276.9 L172.6 276.3 L171.6 275.7 L170.5 275.1 L169.5 274.5 L168.4 273.9 L167.9 273.6 L167.8 268.2 L164.9 267.8 L162.0 264.7 M270.6 240.2 L272.3 239.9 L272.8 241.2 L272.7 242.3 L272.5 243.4 L272.4 244.5 L272.3 245.6 L272.1 246.7 L272.0 247.6 L274.6 248.2 M270.6 240.2 L272.3 239.9 L272.8 241.2 L272.7 242.3 L272.5 243.4 L272.4 244.5 L272.3 245.6 L272.1 246.7 L272.0 247.6 L274.6 248.2 M102.5 167.0 L105.7 166.5 L110.1 169.0 M208.7 415.4 L208.2 414.4 L207.7 413.4 L207.2 412.4 L206.7 411.4 L206.2 410.4 L205.6 409.4 L205.1 408.3 L204.6 407.3 L204.1 406.3 L203.6 405.3 L203.0 404.3 L202.5 403.3 L202.0 402.3 L201.5 401.3 L201.0 400.2 L200.4 399.2 L199.9 398.2 L199.4 397.2 L198.9 396.2 L198.4 395.2 L197.8 394.2 L197.3 393.2 L196.8 392.1 L196.3 391.1 L195.8 390.1 L195.3 389.1 L194.7 388.1 L194.2 387.1 L193.7 386.1 L193.2 385.1 L192.7 384.0 L192.1 383.0 L191.6 382.0 L191.1 381.0 L190.6 380.0 L190.1 379.0 L189.5 378.0 L189.0 377.0 L188.5 376.0 L188.0 374.9 L187.5 373.9 L186.9 372.9 L186.4 371.9 L186.2 371.4 L185.0 371.6 L183.7 371.8 L182.5 372.0 L181.3 372.2 L180.1 372.4 L178.9 372.6 L177.6 372.8 L176.4 373.0 L175.2 373.2 L174.0 373.3 L172.7 373.5 L171.5 373.7 L170.3 373.9 L169.1 374.1 L167.8 374.3 L166.6 374.5 L165.4 374.7 L164.2 374.9 L163.0 375.1 L161.7 375.2 L161.1 375.3 L159.8 375.5 L158.6 375.6 L157.4 375.7 L156.1 375.8 L154.9 375.9 L153.7 376.0 L152.4 376.1 L151.2 376.3 L150.0 376.4 L148.7 376.5 L147.5 376.6 L146.3 376.7 L145.0 376.8 L143.8 376.9 L142.6 377.1 L141.3 377.2 L140.1 377.3 L138.9 377.4 L137.6 377.5 L136.4 377.6 L135.1 377.7 L133.9 377.9 L132.7 378.0 L131.4 378.1 L130.2 378.2 L129.0 378.3 L127.7 378.4 L126.6 378.5 L125.5 379.0 L124.3 379.5 L123.2 380.0 L122.1 380.5 L121.0 381.0 L119.9 381.4 L118.8 381.9 L117.6 382.4 L116.5 382.9 L115.4 383.4 L114.3 383.9 L113.2 384.3 L112.0 384.8 L110.9 385.3 L109.8 385.8 L108.7 386.3 L107.6 386.8 L107.3 386.9 L106.5 387.8 L105.7 388.6 L104.9 389.5 L104.1 390.3 L103.3 391.2 L102.6 392.1 L101.8 392.9 L101.0 393.8 L100.2 394.7 L99.4 395.5 L98.6 396.4 L97.8 397.2 L97.1 398.1 L96.3 399.0 L95.5 399.8 L95.2 400.2 L94.7 401.2 L94.3 402.3 L93.8 403.3 L93.3 404.3 L92.9 405.4 L92.4 406.4 L92.4 406.4 L91.3 407.0 L90.3 407.6 L89.2 408.1 L88.1 408.7 L87.0 409.2 L86.6 409.5 L82.8 409.5 L82.0 408.6 L81.3 407.7 L80.5 406.8 L79.8 405.9 L79.0 405.0 L78.3 404.2 L77.6 403.3 L76.3 403.4 L75.1 403.4 L73.9 403.5 L72.6 403.5 L71.4 403.6 L70.1 403.6 L68.9 403.7 L67.7 403.8 L66.4 403.8 L65.2 403.9 L64.1 403.9 L62.9 403.8 L61.6 403.7 L60.4 403.5 L59.2 403.4 L57.9 403.3 L56.7 403.1 L55.5 403.0 L54.2 402.9 L53.0 402.7 L51.8 402.6 L50.5 402.5 L49.6 402.4 L45.9 400.5 L44.6 400.6 L43.4 400.6 L42.2 400.6 L40.9 400.6 L39.7 400.6 L38.4 400.7 L37.2 400.7 L36.0 400.7 L34.7 400.7 L33.5 400.8 L32.2 400.8 L31.0 400.8 L29.7 400.8 L28.5 400.8 L27.3 400.9 L26.0 400.9 L24.8 400.9 L24.3 400.9 L19.4 402.9 L18.3 402.4 L17.2 402.0 L16.0 401.6 L14.9 401.1 L13.7 400.7 L12.6 400.2 L11.5 399.8 L10.3 399.3 L9.2 398.9 L9.1 398.8 L8.1 399.5 L7.1 400.1 L6.1 400.8 L5.1 401.5 L4.1 402.2 L3.7 402.4 L5.7 403.5 L2.8 406.9 L2.6 410.0 L4.8 412.4 L4.3 414.7 L2.0 414.6 L1.3 417.0 L0.3 417.6 L0.0 417.8';

/* ============================================================
   PROPERTY GALLERY — CINEMATIC PORTAL + INDIA TO DUBAI SCROLL JOURNEY
   0–22%  India map reveal
   22–55% Indian city pins reveal
   55–77% Animated plane takes off, path draws toward Dubai
   77–100% Camera frames UAE/Dubai and destination appears
   Uses the existing accurate geographic path data above.
   ============================================================ */
const JOURNEY_LOCATIONS = [
  {name:'Delhi NCR',lon:77.209,lat:28.6139,dx:-136,dy:-84,w:124},
  {name:'Panipat',lon:76.9635,lat:29.3909,dx:42,dy:-103,w:96},
  {name:'Gurugram',lon:77.0266,lat:28.4595,dx:-139,dy:52,w:114},
  {name:'Noida',lon:77.3910,lat:28.5355,dx:48,dy:65,w:83},
  {name:'Ahmedabad',lon:72.5714,lat:23.0225,dx:-180,dy:-42,w:125},
  {name:'Mumbai',lon:72.8777,lat:19.0760,dx:-128,dy:-21,w:102},
  {name:'Alibaug',lon:72.8722,lat:18.6414,dx:28,dy:27,w:92},
  {name:'Nagpur',lon:79.0882,lat:21.1458,dx:28,dy:-34,w:96},
  {name:'Goa',lon:73.8278,lat:15.4909,dx:28,dy:25,w:72},
];
const geoXY = (lon,lat) => ({x:(lon-43)/58*1200,y:(39-lat)/35*650});
const JOURNEY_DUBAI = geoXY(55.2708,25.2048);
const JOURNEY_MUMBAI = geoXY(72.8777,19.076);
const journeyClamp = v => Math.min(1,Math.max(0,v));
const journeyEase = t => {const x=journeyClamp(t);return x*x*(3-2*x)};
function JourneyPin({city,index,progress,reducedMotion,isMobile}) {
  const {x,y}=geoXY(city.lon,city.lat);
  // Keep city pins at their real coordinates. Only the label/leader positions
  // shift on narrow screens, so labels never get clipped by the map viewport.
  const mobileLabelOffsets = {
    Ahmedabad: { dx: -32, dy: -7 }, // place label to the right of the Gujarat pin
    Mumbai: { dx: -98, dy: -36 },  // move label inside the left edge
    Goa: { dx: 26, dy: 9 },        // keep Goa above the lower caption fade
  };
  const label = isMobile ? (mobileLabelOffsets[city.name] || city) : city;
  const xx=x+label.dx, yy=y+label.dy;
  const start=0.22+index*.033;
  const opacity=useTransform(progress,p=>reducedMotion?1:journeyEase((p-start)/.055)*(1-journeyEase((p-.84)/.09)));
  const rise=useTransform(progress,p=>reducedMotion?0:12*(1-journeyEase((p-start)/.055)));
  const ax=city.dx>0?xx:xx+city.w;
  return <motion.g style={{opacity,y:rise}}>
    <path d={`M${x} ${y} Q${(x+ax)/2} ${yy-8} ${ax} ${yy+13}`} stroke="#cba453" strokeOpacity=".73" strokeWidth="1.15" fill="none"/>
    <circle cx={x} cy={y} r="14" fill="url(#journeyAura)"/>
    <circle cx={x} cy={y} r="4.5" fill="#f4d35e" stroke="#fff0c4" strokeWidth="1.25"/>
    <circle cx={x} cy={y} r="8" fill="none" stroke="#f4d35e" strokeOpacity=".52" strokeWidth="1"/>
    <rect x={xx} y={yy} width={city.w} height="27" rx="13.5" fill="#090d10" fillOpacity=".92" stroke="#c79b43" strokeOpacity=".75"/>
    <text x={xx+city.w/2} y={yy+18} fill="#fbefca" fontSize="13.5" fontFamily="Georgia,serif" textAnchor="middle">{city.name}</text>
    <title>{city.name}</title>
  </motion.g>;
}

function PropertyLocationMap({isMobile}) {
  const sectionRef=useRef(null);
  const [reduceMotion,setReduceMotion]=useState(false);
  useEffect(()=>{
    const media=window.matchMedia('(prefers-reduced-motion: reduce)');
    const update=()=>setReduceMotion(media.matches);
    update(); media.addEventListener?.('change',update);
    return ()=>media.removeEventListener?.('change',update);
  },[]);
  const {scrollYProgress:progress}=useScroll({target:sectionRef,offset:['start start','end end']});
  // Reference-video-inspired transition: a floating cinematic portal grows into the immersive atlas.
  const frameWidth=useTransform(progress,p=>reduceMotion?'100vw':`${(isMobile?84:64)+(isMobile?16:36)*journeyEase(p/.175)}vw`);
  const frameHeight=useTransform(progress,p=>reduceMotion?'100svh':`calc(${(isMobile?44:54)+(isMobile?56:46)*journeyEase(p/.175)}svh - ${Math.round((isMobile?188:194)*journeyEase(p/.175))}px)`);
  const frameRadius=useTransform(progress,p=>`${Math.round((isMobile?22:30)*(1-journeyEase(p/.175)))}px`);
  const frameTilt=useTransform(progress,p=>reduceMotion?0:(1-journeyEase(p/.175))*(isMobile?4:7));
  const frameYaw=useTransform(progress,p=>reduceMotion?0:(1-journeyEase(p/.175))*-5);
  const frameBorder=useTransform(progress,p=>Math.max(0,1-journeyEase(p/.17))*.7);
  const portalCaption=useTransform(progress,p=>reduceMotion?0:1-journeyEase((p-.05)/.11));
  // A point-cloud style wash at the transition between map scenes.
  const particleOpacity=useTransform(progress,p=>reduceMotion?0:
    .26*(journeyEase((p-.12)/.055)-journeyEase((p-.22)/.075))+
    .42*(journeyEase((p-.72)/.055)-journeyEase((p-.84)/.075)));
  const particleScale=useTransform(progress,p=>.94+.12*journeyEase((p-.12)/.13)+.10*journeyEase((p-.72)/.13));
  const headingOpacity=useTransform(progress,p=>reduceMotion?1:journeyEase((p-.11)/.1));
  const headingRise=useTransform(progress,p=>reduceMotion?0:22*(1-journeyEase((p-.11)/.1)));
  const mapOpacity=useTransform(progress,p=>reduceMotion?1:.70+.30*journeyEase(p/.18));
  const camera=useTransform(progress,p=>{
    const t=journeyEase((p-.72)/.255);
    // Camera moves from India to the Arabian Gulf after the flight takes off.
    const start=isMobile?[455,54,575,520]:[365,47,790,520];
    const end=isMobile?[115,68,740,550]:[85,44,835,550];
    const v=start.map((n,i)=>n+(end[i]-n)*t);
    return v.map(n=>n.toFixed(2)).join(' ');
  });
  const terrainScale=useTransform(progress,p=>1+.065*journeyEase(p/.24));
  const flightP=useTransform(progress,p=>reduceMotion?1:journeyEase((p-.54)/.34));
  const routeOpacity=useTransform(progress,p=>reduceMotion?.85:journeyEase((p-.52)/.055));
  const dubaiOpacity=useTransform(progress,p=>reduceMotion?1:journeyEase((p-.85)/.105));
  // Keep only one journey caption mounted at a time; no translucent text overlaps.
  const [activeCaption,setActiveCaption]=useState(0);
  useEffect(()=>{
    const sync=(p)=>setActiveCaption(reduceMotion?3:p<.25?0:p<.56?1:p<.88?2:3);
    sync(progress.get());
    return progress.on('change',sync);
  },[progress,reduceMotion]);
  const journeyCaptions=['Discover India','Every destination, a new opportunity','The journey to Dubai','Welcome to Dubai, UAE'];
  const indiaWordOpacity=useTransform(progress,p=>reduceMotion?1:1-journeyEase((p-.63)/.12));
  const a=JOURNEY_MUMBAI,b=JOURNEY_DUBAI;
  const cx=(a.x+b.x)/2,cy=Math.min(a.y,b.y)-205;
  const route=`M${a.x} ${a.y} Q${cx} ${cy} ${b.x} ${b.y}`;
  return <section ref={sectionRef} aria-label="India to Dubai scroll map journey" style={{position:'relative',height:reduceMotion?'100svh':isMobile?'470svh':'470svh',background:'#030605',color:CREAM}}>
    <div style={{position:'sticky',top:0,height:'100svh',minHeight:0,overflow:'hidden',isolation:'isolate',background:'radial-gradient(ellipse at 51% 43%,#1a180e 0%,#090c0b 52%,#030605 100%)'}}>
      <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 3% 25%,rgba(197,137,44,.1),transparent 42%),radial-gradient(ellipse at 95% 90%,rgba(194,129,42,.08),transparent 40%)',pointerEvents:'none'}}/>
      <motion.div style={{position:'absolute',zIndex:2,left:'50%',top:isMobile?'calc(50% + 14px)':'calc(50% + 8px)',x:'-50%',y:'-50%',width:frameWidth,height:frameHeight,borderRadius:frameRadius,rotateX:frameTilt,rotateY:frameYaw,transformPerspective:1400,overflow:'hidden',background:'linear-gradient(120deg,#141a1b,#040908)',boxShadow:'0 26px 100px rgba(0,0,0,.65), 0 0 75px rgba(203,155,61,.08)'}}>
      <motion.svg viewBox={camera} preserveAspectRatio="xMidYMid meet" role="img" aria-label="Map of India and the UAE with animated city pins and airplane route" style={{position:'absolute',width:isMobile?'130%':'100%',height:isMobile?'100%':'100%',left:isMobile?'-15%':'0%',top:0,overflow:'hidden',opacity:mapOpacity,scale:terrainScale}}>
        <defs>
          <linearGradient id="journeyLand" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#222118"/><stop offset=".55" stopColor="#15180f"/><stop offset="1" stopColor="#0b100d"/></linearGradient>
          <radialGradient id="journeyAura"><stop stopColor="#f4d35e" stopOpacity=".6"/><stop offset="1" stopColor="#eeb54a" stopOpacity="0"/></radialGradient>
          <linearGradient id="journeyFlight" x1="0" x2="1"><stop stopColor="#f2cb70" stopOpacity=".5"/><stop offset="1" stopColor="#ffe8a1"/></linearGradient>
          <filter id="journeyGlow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3"/></filter>
        </defs>
        <path d={PREMIUM_LAND} fill="url(#journeyLand)" fillRule="evenodd" />
        <path d={PREMIUM_COAST} fill="none" stroke="#ba914a" strokeOpacity=".57" strokeWidth="1.3" />
        <path d={PREMIUM_BORDERS} fill="none" stroke="#ad8343" strokeOpacity=".26" strokeWidth=".9" />
        <motion.g style={{opacity:indiaWordOpacity}}>
          <text x="733" y="380" textAnchor="middle" fontFamily="Georgia,serif" fontSize="30" letterSpacing="11" fill="#e7c983" fillOpacity=".6">INDIA</text>
        </motion.g>
        {JOURNEY_LOCATIONS.map((city,i)=><JourneyPin key={city.name} city={city} index={i} progress={progress} reducedMotion={reduceMotion} isMobile={isMobile}/>)}
        <motion.path d={route} fill="none" stroke="url(#journeyFlight)" strokeWidth="3.3" strokeLinecap="round" strokeDasharray="11 7" style={{opacity:routeOpacity,pathLength:flightP}}/>
        <motion.g style={{opacity:dubaiOpacity}}>
          <circle cx={b.x} cy={b.y} r="33" fill="url(#journeyAura)"/>
          <circle cx={b.x} cy={b.y} r="11" fill="none" stroke="#f4d35e" strokeWidth="1.5"/>
          <circle cx={b.x} cy={b.y} r="5" fill="#f4d35e" stroke="#fff2c2" strokeWidth="1.5"/>
          <path d={`M${b.x} ${b.y} L${b.x+23} ${b.y-31}`} stroke="#e7c27c" strokeWidth="1.25"/>
          <rect x={b.x+23} y={b.y-60} width="160" height="38" rx="19" fill="#0a1010" stroke="#d8ae58" strokeWidth="1.3"/>
          <text x={b.x+103} y={b.y-36} fill="#fbefca" fontFamily="Georgia,serif" fontSize="18" textAnchor="middle">Dubai, UAE</text>
        </motion.g>
      </motion.svg>
      <motion.div aria-hidden="true" style={{position:'absolute',inset:0,pointerEvents:'none',opacity:particleOpacity,scale:particleScale,backgroundImage:'radial-gradient(circle, rgba(244,211,94,.72) 0.7px, transparent 1.5px)',backgroundSize:isMobile?'12px 12px':'16px 16px',maskImage:'linear-gradient(130deg, transparent 2%, black 50%, transparent 98%)',WebkitMaskImage:'linear-gradient(130deg, transparent 2%, black 50%, transparent 98%)',mixBlendMode:'screen'}} />
      <motion.div aria-hidden="true" style={{position:'absolute',inset:0,border:'1px solid rgba(250,216,144,.72)',borderRadius:frameRadius,opacity:frameBorder,pointerEvents:'none',boxShadow:'inset 0 0 70px rgba(233,174,68,.06)'}} />
      <motion.div style={{position:'absolute',zIndex:3,left:16,bottom:15,opacity:portalCaption,color:'#e8d4a2',fontSize:10,letterSpacing:'.22em',fontFamily:sans,pointerEvents:'none'}}>01 — THE JOURNEY BEGINS</motion.div>
      </motion.div>
      <div style={{position:'absolute',zIndex:9,left:0,right:0,bottom:0,height:isMobile?'105px':'105px',boxSizing:'border-box',padding:'20px 16px 24px',display:'flex',flexDirection:'column',justifyContent:'flex-end',alignItems:'center',textAlign:'center',pointerEvents:'none',background:'linear-gradient(0deg,#030605 18%,rgba(3,6,5,.97) 62%,rgba(3,6,5,0) 100%)'}}>
        <div aria-live="off" style={{position:'relative',height:isMobile?28:35,width:'100%',fontFamily:serif,fontSize:isMobile?17:23,color:CREAM,textShadow:'0 2px 14px #000',whiteSpace:'nowrap'}}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={activeCaption} initial={{opacity:0,y:9}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-9}} transition={{duration:.2,ease:'easeOut'}} style={{position:'absolute',inset:0,display:'flex',justifyContent:'center',alignItems:'center'}}>
              {journeyCaptions[activeCaption]}
            </motion.div>
          </AnimatePresence>
        </div>
        <div style={{height:3,width:'min(70vw,310px)',borderRadius:10,background:'rgba(244,211,94,.18)',overflow:'hidden',marginTop:10}}>
          <motion.div style={{height:'100%',width:'100%',borderRadius:10,background:GOLD,scaleX:reduceMotion?1:progress,transformOrigin:'left',boxShadow:'0 0 10px rgba(244,211,94,.45)'}}/>
        </div>
      </div>
      {/* {!reduceMotion&&<div style={{position:'absolute',zIndex:10,left:isMobile?14:'5%',bottom:14,fontFamily:sans,color:GOLD,fontSize:9,letterSpacing:'.19em'}}>SCROLL TO TRAVEL ↓</div>} */}
    </div>
  </section>;
}

function PortalScene({ zoom, isMobile, onExplore }) {
  const [nat, setNat] = useState(0);
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

  const o = useTransform(zoom, [0.68, 0.92], [0, 1]);
  const logoS = useTransform(zoom, [0.7, 1], [0.94, 1]);
  const lineS = useTransform(zoom, [0.8, 1], [0, 1]);
  const textO = useTransform(zoom, [0.86, 1], [0, 1]);
  const ctaO = useTransform(zoom, [0.93, 1], [0, 1]);
  const events = useTransform(zoom, (z) => (z > 0.92 ? 'auto' : 'none'));

  const want = isMobile ? '46vw' : '20vw';
  const logoW = nat
    ? `min(${want}, ${V(32)}, ${Math.floor(nat / dpr)}px)`
    : `min(${want}, ${V(32)})`;

  return (
    <motion.div
      style={{
        position: 'absolute', inset: 0, zIndex: 50, opacity: o, pointerEvents: events,
        background: 'radial-gradient(ellipse at 50% 40%, #171b0b 0%, #060704 52%, #000 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '0 6vw',
      }}
    >
      <motion.img
        src={LOGO}
        alt="Property Gallery"
        draggable={false}
        onLoad={(e) => setNat(e.currentTarget.naturalWidth)}
        style={{
          scale: logoS, width: logoW, height: 'auto', display: 'block',
          filter: 'drop-shadow(0 0 1.4em rgba(244,211,94,.2))',
        }}
      />

      <motion.div
        style={{
          scaleX: lineS, width: 'min(320px, 56vw)', height: 1, margin: `${V(4)} 0 ${V(3)}`,
          background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
        }}
      />

      <motion.div
        style={{
          opacity: textO, fontFamily: serif, color: CREAM, letterSpacing: '0.42em', paddingLeft: '0.42em',
          fontSize: isMobile ? 14 : 'clamp(15px, 1.5vw, 22px)', textTransform: 'uppercase',
        }}
      >
        Property Gallery
      </motion.div>

      <motion.div
        style={{
          opacity: textO, fontFamily: sans, color: GOLD, letterSpacing: '0.3em', paddingLeft: '0.3em',
          fontSize: isMobile ? 10.5 : 12, textTransform: 'uppercase', marginTop: 14,
        }}
      >
        Delhi NCR · Mumbai · Goa · Noida · Alibaug · Nagpur · Ahmedabad · Dubai
      </motion.div>

      {/* <motion.buttona
        type="button"
        onClick={onExplore}
        style={{
          opacity: ctaO, marginTop: V(6), cursor: 'pointer', background: 'rgba(0,0,0,0)',
          border: `1px solid ${GOLD_DARK}`, color: CREAM, fontFamily: sans, fontWeight: 500,
          fontSize: 13, letterSpacing: '0.12em', padding: '13px 28px', borderRadius: 999,
        }}
      >
        Explore Featured Projects ↓
      </motion.button> */}
    </motion.div>
  );
}

function RevealWord({ children, progress, range, first }) {
  const o = useTransform(progress, range, [0.22, 1]);
  return (
    <motion.span
      style={{
        opacity: o,
        display: 'inline-block',
        marginLeft: first ? 0 : '0.28em',
        willChange: 'opacity',
      }}
    >
      {children}
    </motion.span>
  );
}

function GoldLine() {
  return (
    <motion.div
      animate={{ backgroundPosition: ['0% 0%', '100% 0%'] }}
      transition={{ duration: 5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
      style={{
        height: 1,
        opacity: 0.75,
        backgroundImage: `linear-gradient(90deg, transparent, ${GOLD_DARK}, ${GOLD}, ${GOLD_DARK}, transparent)`,
        backgroundSize: '200% 100%',
      }}
    />
  );
}

const STACK = {
  maxWidth: 1200,
  imageWidthPct: 56,
  textGap: 56,
  textGapMobile: 22,
  heightVh: 72,
  heightVhMobile: 42,
  topVh: 13,
  topVhMobile: 11,
  radius: 28,
  imageZoom: 1.2,
  titlePx: 40,
  titlePxMobile: 24,
  bodyPx: 16,
  bodyPxMobile: 13.5,
  peekPx: 0,
  shrink: 0.05,
  tiltDeg: 5,
};

function StackCard({ sec, i, n, progress, isMobile }) {
  const isLast = i === n - 1;
  const depth = n - 1 - i;
  const start = n > 1 ? i / (n - 1) : 0;

  const inRange = isLast ? [0, 1] : [start, 1];
  const scale = useTransform(progress, inRange, isLast ? [1, 1] : [1, 1 - depth * STACK.shrink]);
  const rotate = useTransform(progress, inRange, isLast ? [0, 0] : [0, depth * STACK.tiltDeg]);
  const counterRotate = useTransform(rotate, (v) => -v);

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        height: V(100),
        boxSizing: 'border-box',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        pointerEvents: 'none',
        paddingTop: `calc(${V(isMobile ? STACK.topVhMobile : STACK.topVh)} + ${i * STACK.peekPx}px)`,
      }}
    >
      <div style={{ width: '100%', maxWidth: STACK.maxWidth, display: 'flex' }}>
        <motion.div
          style={{
            scale,
            rotate,
            transformOrigin: '50% 50%',
            willChange: 'transform',
            flex: isMobile ? '0 0 100%' : `0 0 ${STACK.imageWidthPct}%`,
            width: isMobile ? '100%' : undefined,
            height: V(isMobile ? STACK.heightVhMobile : STACK.heightVh),
            overflow: 'hidden',
            borderRadius: STACK.radius,
            background: '#000',
            border: '1px solid rgba(244,211,94,.3)',
            boxShadow: '0 30px 60px rgba(0,0,0,.45)',
            boxSizing: 'border-box',
          }}
        >
          <motion.img
            src={sec.image}
            alt={sec.title}
            decoding="async"
            style={{ rotate: counterRotate, width: '100%', height: '100%', objectFit: 'cover', display: 'block', scale: STACK.imageZoom }}
          />
        </motion.div>
      </div>
    </div>
  );
}

function StackText({ sections, progress, isMobile }) {
  const n = sections.length;
  const [active, setActive] = useState(0);

  useEffect(() => {
    const update = (v) => setActive(Math.min(n - 1, Math.max(0, Math.round(v * (n - 1)))));
    update(progress.get());
    return progress.on('change', update);
  }, [progress, n]);

  const sec = sections[active];

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        height: V(100),
        boxSizing: 'border-box',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        pointerEvents: 'none',
        paddingTop: V(isMobile ? STACK.topVhMobile : STACK.topVh),
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: STACK.maxWidth,
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? STACK.textGapMobile : STACK.textGap,
          height: isMobile ? `calc(${V(100)} - ${V(STACK.topVhMobile)})` : V(STACK.heightVh),
        }}
      >
        <div
          style={{
            flex: isMobile ? '0 0 auto' : `0 0 ${STACK.imageWidthPct}%`,
            height: isMobile ? V(STACK.heightVhMobile) : undefined,
          }}
        />

        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: isMobile ? 'flex-start' : 'center' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, filter: 'blur(8px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(8px)' }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              style={{ color: CREAM, pointerEvents: 'auto' }}
            >
              <span style={{ fontFamily: sans, fontSize: 12, letterSpacing: '0.22em', color: GOLD_DARK }}>
                {String(active + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
              </span>
              <div style={{ fontFamily: sans, fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD, marginTop: 10 }}>
                {sec.sub}
              </div>
              <h3 style={{ fontFamily: serif, fontWeight: 400, fontSize: isMobile ? STACK.titlePxMobile : STACK.titlePx, margin: '10px 0 0', color: '#fff', lineHeight: 1.15 }}>
                {sec.title}
              </h3>
              <p style={{ fontFamily: sans, fontSize: isMobile ? STACK.bodyPxMobile : STACK.bodyPx, lineHeight: 1.75, opacity: 0.85, margin: '14px 0 0' }}>
                {sec.text}
              </p>
              <div style={{ marginTop: isMobile ? 16 : 26 }}>
                <a
                  href={WA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    background: CREAM,
                    color: '#000',
                    padding: '11px 24px',
                    borderRadius: 8,
                    fontFamily: sans,
                    fontWeight: 600,
                    fontSize: 12,
                    letterSpacing: '0.05em',
                    textDecoration: 'none',
                  }}
                >
                  Enquire Now ↗
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function StackedCards({ sections, isMobile }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <StackText sections={sections} progress={scrollYProgress} isMobile={isMobile} />
      <div style={{ marginTop: `calc(${V(100)} * -1)` }}>
        {sections.map((sec, i) => (
          <StackCard key={i} sec={sec} i={i} n={sections.length} progress={scrollYProgress} isMobile={isMobile} />
        ))}
      </div>
    </div>
  );
}

function Footer({ isMobile, footerRef, onProjects, onAbout }) {
  const year = new Date().getFullYear();

  const up = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.8, delay, ease: outSoft },
  });

  const head = { fontFamily: serif, color: GOLD, fontSize: 15, letterSpacing: '0.22em', textTransform: 'uppercase', margin: '0 0 16px', fontWeight: 400 };
  const linkStyle = { display: 'block', color: CREAM, opacity: 0.85, fontFamily: sans, fontSize: 15, lineHeight: 2.1, textDecoration: 'none', cursor: 'pointer', wordBreak: 'break-word' };
  const hover = { x: isMobile ? 0 : 6, color: GOLD };

  const logoBox = FOOTER_RING
    ? {
        width: 46, height: 46, borderRadius: '50%', display: 'grid', placeItems: 'center',
        border: `1.5px solid ${GOLD_DARK}`, background: 'rgba(244,211,94,.06)', boxShadow: '0 0 0 4px rgba(244,211,94,.05)',
      }
    : {
        width: FOOTER_LOGO + 8, height: FOOTER_LOGO + 8, display: 'grid', placeItems: 'center',
      };

  return (
    <footer
      ref={footerRef}
      style={{
        position: 'relative', zIndex: 10, color: CREAM, overflow: 'hidden', padding: '0 6vw 28px',
        background: `linear-gradient(180deg, ${BG} 0%, #050505 100%)`,
      }}
    >
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(244,211,94,.08) 1px, transparent 0)', backgroundSize: '26px 26px' }} />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${GOLD_DARK}, ${GOLD}, ${GOLD_DARK}, transparent)` }} />

      <div style={{ position: 'relative', maxWidth: 1280, margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1.5fr 1fr 1.3fr 1fr',
            gap: isMobile ? 36 : 48,
            padding: isMobile ? '56px 0 40px' : '80px 0 48px',
            textAlign: isMobile ? 'center' : 'left',
          }}
        >
          <motion.div {...up(0)}>
            <img
              src={LOGO}
              alt="Property Gallery"
              style={{ height: isMobile ? 56 : 68, width: 'auto', display: 'block', margin: isMobile ? '0 auto' : 0, mixBlendMode: 'screen' }}
            />
            <div style={{ fontFamily: serif, letterSpacing: '0.18em', fontSize: 17, marginTop: 14 }}>PROPERTY GALLERY</div>
            <p style={{ fontFamily: sans, fontSize: 14.5, lineHeight: 1.8, opacity: 0.75, margin: '10px auto 0', maxWidth: 340, marginLeft: isMobile ? 'auto' : 0 }}>
              Curated real estate across India and Dubai. Developments, destinations and opportunities worth exploring.
            </p>
          </motion.div>

          <motion.div {...up(0.08)}>
            <h4 style={head}>✦ Explore</h4>
            <motion.a role="button" onClick={onProjects} whileHover={hover} style={linkStyle}>Projects</motion.a>
            <motion.a role="button" onClick={onAbout} whileHover={hover} style={linkStyle}>About</motion.a>
            <motion.a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" whileHover={hover} style={linkStyle}>Vlogs</motion.a>
          </motion.div>

          <motion.div {...up(0.16)}>
            <h4 style={head}>✦ Get in touch</h4>
            <motion.a href={WA_URL} target="_blank" rel="noopener noreferrer" whileHover={hover} style={linkStyle}>{WHATSAPP}</motion.a>
            <motion.a href={`mailto:${EMAIL}`} whileHover={hover} style={linkStyle}>{EMAIL}</motion.a>
            {FOOTER_ADDRESS && (
              <motion.a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open office location in Google Maps"
                whileHover={hover}
                style={linkStyle}
              >
                {FOOTER_ADDRESS}
              </motion.a>
            )}
          </motion.div>

          <motion.div {...up(0.24)}>
            <h4 style={head}>✦ Follow us</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: FOOTER_RING ? 12 : 16, justifyContent: isMobile ? 'center' : 'flex-start' }}>
              {CONTACTS.map((c) => (
                <motion.a
                  key={c.icon}
                  href={c.href}
                  {...(c.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  aria-label={c.name}
                  title={c.name}
                  whileHover={{ y: -4, rotate: FOOTER_RING ? -6 : 0, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  style={logoBox}
                >
                  <img
                    src={ICON_IMG[c.icon]}
                    alt={c.name}
                    draggable={false}
                    style={{ width: FOOTER_LOGO, height: FOOTER_LOGO, objectFit: 'contain', display: 'block' }}
                  />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        <GoldLine />

        <div
          style={{
            display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center',
            justifyContent: 'space-between', gap: 16, padding: '24px 0 8px', fontFamily: sans, fontSize: 13.5,
          }}
        >
          <span style={{ opacity: 0.7 }}>© {year} Property Gallery. All rights reserved.</span>
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.94 }}
            style={{
              width: 44, height: 44, borderRadius: '50%', border: `1.5px solid ${GOLD_DARK}`,
              background: 'rgba(0,0,0,0)', color: GOLD, cursor: 'pointer', display: 'grid', placeItems: 'center', fontSize: 18,
            }}
          >
            <motion.span animate={{ y: [0, -3, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>↑</motion.span>
          </motion.button>
        </div>

        <p style={{ fontFamily: sans, fontSize: 12, lineHeight: 1.7, opacity: 0.45, textAlign: 'center', maxWidth: 760, margin: '10px auto 0' }}>
          {FOOTER_DISCLAIMER}
        </p>
      </div>
    </footer>
  );
}

const PROJECTS = [
  {
    id: 'experion',
    title: 'Experion Emerelle Reserve',
    subtitle: 'Experion Developers · Sector 88A, Gurgaon',
    price: '₹3.50 Cr Onwards',
    specs: '3, 3.5 & 4 BHK Luxury Apartments',
    desc: 'Premium high-rise living with world-class architecture, expansive green landscapes, and elite connectivity in Sector 88A Gurgaon.',
    image: EXP_IMG,
    tag: 'READY TO MOVE',
    sections: [
      {
        title: 'Experion Emerelle Reserve',
        sub: 'Sector 88A Gurgaon · Luxury Living',
        text: 'Experience unmatched sophistication with expansive green views, ultra-modern amenities, and bespoke architectural mastery designed for elite lifestyles.',
        image: '/Experion2.jpg',
      },
      {
        title: 'Grand Architecture',
        sub: 'Iconic Towers & Facade',
        text: 'Striking geometric design and high-rise structural brilliance that commands the Sector 88A skyline with effortless elegance.',
        image: '/Experion1.jpg',
      },
      {
        title: 'World-Class Amenities',
        sub: 'Clubhouse, Pools & Wellness',
        text: 'Equipped with Olympic-length swimming pools, state-of-the-art gymnasiums, sports arenas, and dedicated yoga sanctuaries.',
        image: EXP_IMG,
      },
    ],
  },
  {
    id: 'alibaug',
    title: 'Alibaug Estates',
    subtitle: 'Resort Living · Alibaug, Maharashtra',
    price: '₹5.20 Cr Onwards',
    specs: 'Luxury Villas & Convention Centre',
    desc: 'A sprawling convention centre spread across 1,50,000 sq. ft. equipped with exotic resort-style pools, sunken bars, and themed spas.',
    image: ALI_IMG,
    tag: 'READY TO MOVE',
    sections: [
      {
        title: 'Alibaug Estates',
        sub: 'Coastal Resort Living',
        text: 'Sprawling convention spaces and private resort villas surrounded by serene coastal greens and bespoke water features.',
        image: ALI_IMG,
      },
      {
        title: 'Private Lagoon & Pools',
        sub: 'Exotic Water Features',
        text: 'Sunken bars, infinity pools, and tropical landscaping crafted to offer a permanent vacation vibe.',
        image: HERO_IMG,
      },
    ],
  },
  {
    id: 'delhi',
    title: 'Delhi Skyline',
    subtitle: 'Metropolitan · Central Delhi NCR',
    price: '₹4.80 Cr Onwards',
    specs: 'Penthouses & High-Rise Apartments',
    desc: 'High-rise architectural masterpieces featuring striking geometric design, elite urban convenience, and panoramic views in the capital.',
    image: DEL_IMG,
    tag: 'RERA APPROVED',
    sections: [
      {
        title: 'Delhi Skyline',
        sub: 'Capital Metropolitan Living',
        text: 'Uncompromised luxury right in the heart of Delhi NCR with seamless connectivity and breathtaking panoramic views.',
        image: DEL_IMG,
      },
      {
        title: 'Elite Urban Interiors',
        sub: 'Bespoke Craftsmanship',
        text: 'Italian marble flooring, designer fittings, and expansive balconies engineered for modern connoisseurs.',
        image: HERO_IMG,
      },
    ],
  },
  {
    id: 'dlf',
    title: 'DLF Luxury Apartments',
    subtitle: 'DLF Limited · Andheri West, Mumbai',
    price: '₹2.90 Cr Onwards',
    specs: '3 & 4 BHK (1,126 - 2,534 Sq. Ft.)',
    desc: 'Sprawling luxury residences featuring exclusive clubhouses with swimming pools, gymnasiums, and 80% dedicated open green spaces.',
    image: MUM_IMG,
    tag: 'UNDER CONSTRUCTION',
    sections: [
      {
        title: 'DLF Luxury Apartments',
        sub: 'Andheri West, Mumbai',
        text: 'Sprawling luxury residences offering prime connectivity, elite clubhouses, and 80% dedicated open green spaces in Mumbai.',
        image: MUM_IMG,
      },
      {
        title: 'Exclusive Clubhouse',
        sub: 'Recreation & Social Spaces',
        text: 'A vibrant community hub featuring multi-cuisine dining, indoor sports arenas, and private screening rooms.',
        image: HERO_IMG,
      },
    ],
  },
];

export default function App() {
  const isMobile = useIsMobile();
  const [stage, setStage] = useState(0);
  const [ready, setReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const stmtRef = useRef(null);
  const projectsRef = useRef(null);
  const footerRef = useRef(null);
  const heroVideoRef = useRef(null);
  const propRef = useRef(null);
  const galRef = useRef(null);
  const [startPos, setStartPos] = useState(null);
  const aboutLogos = ABOUT.logos.map((id) => CONTACTS.find((c) => c.icon === id)).filter(Boolean);

  const fs = isMobile ? FONT_VW_MOBILE : FONT_VW;
  const startLeft = startPos
    ? startPos.left
    : isMobile ? 50 - 4.572 * FONT_VW_MOBILE : START_LEFT;
  const startRight = startPos
    ? startPos.right
    : isMobile ? startLeft + 5.104 * FONT_VW_MOBILE : START_RIGHT;
  const edge = isMobile ? 5 : 3.8;
  const topEnd = isMobile ? '10.5%' : '4%';
  const pill = isMobile ? PILL_M : PILL_D;
  const mid = isMobile ? MID_M : MID_D;

  const turnVh = isMobile ? 0 : TURN_VH;
  const stmtVh = STMT_VH + turnVh;
  const stmtA = STMT_BASE_VH / (stmtVh - 100);

  const goProjects = () => {
    setSelectedProject(null);
    setTimeout(() => projectsRef.current?.scrollIntoView({ behavior: 'smooth' }), 80);
  };
  const goFooter = () => footerRef.current?.scrollIntoView({ behavior: 'smooth' });
  const goAbout = () => {
    setSelectedProject(null);
    setTimeout(() => {
      const el = stmtRef.current;
      if (!el) return;
      const stageH = el.firstElementChild?.offsetHeight || window.innerHeight;
      const top = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top + (el.offsetHeight - stageH) * stmtA * 0.9, behavior: 'smooth' });
    }, 80);
  };

  const { scrollYProgress: enterRaw } = useScroll({ target: stmtRef, offset: ['start end', 'start start'] });
  const ep = useSpring(enterRaw, SPRING);
  const introScale = useTransform(ep, [0, 1], [1, 0.92]);
  const introY = useTransform(ep, [0, 1], ['0%', '-6%']);
  const introDim = useTransform(ep, [0, 1], [0, 0.65]);
  const logoOpacity = useTransform(ep, [0.55, 0.95], [0, 1]);
  const logoY = useTransform(ep, [0.55, 0.95], [-12, 0]);

  const { scrollYProgress: stmtRaw } = useScroll({ target: stmtRef, offset: ['start start', 'end end'] });
  const stmtOld = useTransform(stmtRaw, [0, stmtA], [0, 1]);
  const sp = useSpring(stmtOld, SPRING);

  // Rotate + zoom dono About panel ke poora aane (stmtA) ke baad ek saath shuru hote hain.
  // Rotation zoom ke TURN_SHARE hisse me poori hoti hai, zoom STMT_ZOOM_END tak chalta hai.
  const turnEnd = stmtA + (STMT_ZOOM_END - stmtA) * TURN_SHARE;
  const turnRaw = useTransform(stmtRaw, [stmtA, Math.max(turnEnd, stmtA + 0.0001)], [0, turnVh > 0 ? 1 : 0]);
  const turn = useSpring(turnRaw, { stiffness: 60, damping: 28, mass: 0.6 });
  const zoomRaw = useTransform(stmtRaw, [stmtA, STMT_ZOOM_END], [0, 1]);
  const zoom = useSpring(zoomRaw, { stiffness: 60, damping: 28, mass: 0.6 });

  const aboutFade = useTransform([turn, zoom], ([t, z]) => 1 - clamp01(Math.max(t / 0.5, z / 0.25)));
  const aboutShift = useTransform([turn, zoom], ([t, z]) => -50 * clamp01(Math.max(t / 0.7, z / 0.35)));

  const panelY = useTransform(sp, [0.36, 0.62], ['100%', '0%']);
  const radH = useTransform(sp, [0.36, 0.5, 0.62], [50, 6, 0]);
  const radV = useTransform(sp, [0.36, 0.5, 0.62], [70, 8, 0]);
  const panelRadius = useMotionTemplate`${radH}% ${radV}%`;
  const stmtOpacity = useTransform(sp, [0.36, 0.62], [1, 0.25]);
  const stmtScale = useTransform(sp, [0.36, 0.62], [1, 0.94]);
  const glass = useTransform(sp, [0.5, 0.6], [0, 1]);

  const rest = STATEMENT_REST.split(' ');
  const total = rest.length + 1;
  const range = (i) => [(i / total) * 0.2, (i / total) * 0.2 + 0.06];

  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    document.documentElement.style.overflowX = 'clip';
    document.body.style.overflowX = 'clip';
    return () => {
      document.documentElement.style.overflowX = '';
      document.body.style.overflowX = '';
    };
  }, []);

  useEffect(() => {
    const img = new Image();
    img.src = HERO_IMG;
    const imgP = img.decode ? img.decode() : Promise.resolve();
    const fontP = document.fonts
      ? Promise.all([
          document.fonts.load('400 100px MORSEO'),
          document.fonts.load('400 100px Marcellus'),
        ])
      : Promise.resolve();
    const timeout = new Promise((r) => setTimeout(r, 1500));
    Promise.race([Promise.all([imgP, fontP]).catch(() => {}), timeout]).then(() => setReady(true));
    PROJECTS.forEach((p) => { const im = new Image(); im.src = p.image; });
  }, []);

  useEffect(() => {
    if (stage > 0) return undefined;
    const measure = () => {
      const p = propRef.current;
      const g = galRef.current;
      if (!p || !g) return;
      const vw = window.innerWidth;
      const wP = (p.offsetWidth / vw) * 100;
      const wG = (g.offsetWidth / vw) * 100;
      if (!wP || !wG) return;
      const gap = fs * (isMobile ? 0.3 : 0.45);
      const left = (100 - (wP + gap + wG)) / 2;
      setStartPos({ left, right: left + wP + gap });
    };
    measure();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [stage, isMobile, fs]);

  useEffect(() => {
    const v = heroVideoRef.current;
    if (!v || !ready) return undefined;
    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute('playsinline', '');
    const tryPlay = () => v.play().catch(() => {});
    tryPlay();
    window.addEventListener('touchstart', tryPlay, { once: true, passive: true });
    return () => window.removeEventListener('touchstart', tryPlay);
  }, [ready, stage]);

  useEffect(() => {
    if (!ready) return;
    const t1 = setTimeout(() => setStage(1), 1800);
    const t2 = setTimeout(() => setStage(2), 3200);
    const t3 = setTimeout(() => setUnlocked(true), (3.2 + UNLOCK_AFTER) * 1000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [ready]);

  useEffect(() => {
    if (unlocked || selectedProject) return;
    const stop = (e) => e.preventDefault();
    const keys = (e) => {
      if ([' ', 'PageDown', 'PageUp', 'End', 'Home', 'ArrowDown', 'ArrowUp'].includes(e.key)) e.preventDefault();
    };
    const reset = () => window.scrollTo(0, 0);
    window.addEventListener('wheel', stop, { passive: false });
    window.addEventListener('touchmove', stop, { passive: false });
    window.addEventListener('keydown', keys);
    window.addEventListener('scroll', reset);
    return () => {
      window.removeEventListener('wheel', stop);
      window.removeEventListener('touchmove', stop);
      window.removeEventListener('keydown', keys);
      window.removeEventListener('scroll', reset);
    };
  }, [unlocked, selectedProject]);

  useEffect(() => {
    if (selectedProject) return undefined;
    const id = requestAnimationFrame(() => window.dispatchEvent(new Event('resize')));
    return () => cancelAnimationFrame(id);
  }, [selectedProject]);

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return undefined;
    document.body.style.overflowY = 'hidden';
    return () => { document.body.style.overflowY = ''; };
  }, [menuOpen]);

  useEffect(() => {
    if (!isMobile) setMenuOpen(false);
  }, [isMobile]);

  const menuGo = (fn) => {
    setMenuOpen(false);
    setTimeout(fn, 250);
  };

  const menuItems = [
    { label: 'Projects', fn: goProjects },
    { label: 'About', fn: goAbout },
    { label: 'Contact', fn: goFooter },
  ];

  const menuBtn = {
    background: 'rgba(40,42,48,.55)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    border: 'none',
    color: CREAM,
    fontFamily: sans,
    fontSize: 14,
    fontWeight: 500,
    padding: '9px 16px',
    borderRadius: 6,
    cursor: 'pointer',
  };

  const wordBase = {
    position: 'absolute',
    margin: 0,
    fontFamily: '"MORSEO", "Marcellus", Georgia, serif',
    fontWeight: 400,
    fontSize: `${fs}vw`,
    lineHeight: 1,
    color: CREAM,
    WebkitTextStroke: `0.022em ${CREAM}`,
    whiteSpace: 'nowrap',
    textTransform: 'uppercase',
    zIndex: 20,
  };

  const wordTransition =
    stage === 0
      ? {
          opacity: { duration: 0.9, delay: FADE_DELAY, ease: 'easeOut' },
          top: { duration: 1.0, delay: FADE_DELAY, ease: outSoft },
          rotate: { duration: 1.0, delay: FADE_DELAY, ease: outSoft },
        }
      : stage === 1
      ? { left: { duration: SPLIT_DUR, ease: inOut }, x: { duration: SPLIT_DUR, ease: inOut } }
      : { top: { duration: VERT_DUR, ease: inOut }, y: { duration: VERT_DUR, ease: inOut } };

  return (
    <>
      <header
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          height: isMobile ? 68 : 'clamp(76px, 10vh, 108px)',
          padding: '0 3.8vw',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          pointerEvents: 'none',
        }}
      >
        <motion.div
          style={{
            position: 'absolute', inset: 0, zIndex: -1, opacity: glass,
            background: 'rgba(40,42,48,.5)',
            backdropFilter: `blur(${isMobile ? 8 : 14}px)`,
            WebkitBackdropFilter: `blur(${isMobile ? 8 : 14}px)`,
          }}
        />
        <motion.div
          style={{ opacity: logoOpacity, y: logoY, display: 'flex', alignItems: 'center', pointerEvents: 'auto', cursor: 'pointer' }}
          onClick={() => {
            setSelectedProject(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <img
            src={LOGO}
            alt="Property Gallery"
            style={{
              height: isMobile ? 42 : 'clamp(52px, 4.8vw, 80px)', width: 'auto', display: 'block',
              objectFit: 'contain', filter: 'drop-shadow(0 1px 3px rgba(0,0,0,.45))',
            }}
          />
        </motion.div>

        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.3 }}
          style={{
            display: 'flex', alignItems: 'center', gap: isMobile ? 12 : NAV_GAP,
            fontFamily: sans, fontSize: isMobile ? 13 : NAV_FONT, fontWeight: 500,
            color: '#fff', pointerEvents: 'auto',
          }}
        >
          {isMobile ? (
            <button type="button" onClick={() => setMenuOpen(true)} aria-label="Open menu" style={menuBtn}>
              Menu
            </button>
          ) : (
            <>
              <span onClick={goProjects} style={{ cursor: 'pointer' }}>Projects</span>
              <span onClick={goAbout} style={{ cursor: 'pointer' }}>About</span>
              <span
                onClick={goFooter}
                style={{ background: CREAM, color: '#000', padding: '10px 20px', borderRadius: 6, fontWeight: 500, cursor: 'pointer' }}
              >
                Contact
              </span>
            </>
          )}
        </motion.nav>
      </header>

      <AnimatePresence>
        {isMobile && menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{
              position: 'fixed', inset: 0, zIndex: 300, background: BG,
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              padding: '0 7vw',
            }}
          >
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              style={{ ...menuBtn, position: 'absolute', top: 16, right: '3.8vw' }}
            >
              Close
            </button>

            {menuItems.map((item, idx) => (
              <motion.button
                key={item.label}
                type="button"
                onClick={() => menuGo(item.fn)}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.1 + idx * 0.07, ease: outSoft }}
                style={{
                  background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer',
                  color: CREAM, fontFamily: sans, fontWeight: 400,
                  fontSize: 'clamp(30px, 9vw, 44px)', padding: '10px 0', lineHeight: 1.2,
                }}
              >
                {item.label}
              </motion.button>
            ))}

            <motion.a
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 + menuItems.length * 0.07, ease: outSoft }}
              style={{
                color: CREAM, fontFamily: sans, textDecoration: 'none',
                fontSize: 'clamp(30px, 9vw, 44px)', padding: '10px 0', lineHeight: 1.2,
              }}
            >
              Enquire Now
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedProject && (
        <div
          style={{
            background: BG, color: CREAM, minHeight: V(100),
            paddingTop: isMobile ? 90 : 130, paddingBottom: 100, paddingLeft: '4vw', paddingRight: '4vw',
          }}
        >
          <div style={{ maxWidth: STACK.maxWidth, margin: '0 auto' }}>
            <button
              onClick={goProjects}
              style={{
                background: 'rgba(0,0,0,0)', border: `1px solid ${GOLD_DARK}`, color: GOLD,
                padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontFamily: sans, fontWeight: 600,
                marginBottom: '4vh', display: 'flex', alignItems: 'center', gap: 8,
              }}
            >
              ← Back to Projects
            </button>

            <div style={{ textAlign: 'center', marginBottom: '6vh' }}>
              <span style={{ fontFamily: sans, fontSize: 12, letterSpacing: '0.25em', textTransform: 'uppercase', color: GOLD }}>
                {selectedProject.subtitle}
              </span>
              <h1 style={{ fontFamily: serif, fontWeight: 400, fontSize: isMobile ? 32 : 52, margin: '10px 0 0', color: '#fff' }}>
                {selectedProject.title}
              </h1>
              <p style={{ fontFamily: sans, fontSize: 14, opacity: 0.8, maxWidth: 640, margin: '14px auto 0', lineHeight: 1.7 }}>
                {selectedProject.desc}
              </p>
            </div>

            <StackedCards sections={selectedProject.sections} isMobile={isMobile} />
          </div>
        </div>
      )}

      <div style={{ display: selectedProject ? 'none' : 'block' }}>
        <div style={{ position: 'sticky', top: 0, height: V(100), zIndex: 0, overflow: 'hidden', background: BG }}>
          <motion.div
            style={{
              position: 'absolute', inset: 0, background: BG,
              scale: introScale, y: introY, transformOrigin: '50% 100%', willChange: 'transform',
            }}
          >
            <motion.div
              initial={{ opacity: 0, clipPath: pill }}
              animate={stage >= 2 ? { opacity: 1, clipPath: [pill, mid, FULL] } : { opacity: 0, clipPath: pill }}
              transition={
                stage >= 2
                  ? {
                      opacity: { duration: 0.5, delay: IMG_DELAY },
                      clipPath: { duration: IMG_DUR, delay: IMG_DELAY, times: [0, 0.5, 1], ease: [outExpo, inOut] },
                    }
                  : { duration: 0 }
              }
              style={{ position: 'absolute', inset: 0, zIndex: 0 }}
            >
              <motion.video
                ref={heroVideoRef}
                src={isMobile ? HERO_VIDEO_MOBILE : HERO_VIDEO}
                poster={HERO_POSTER}
                muted
                loop
                playsInline
                preload="auto"
                initial={{ scale: 1.25 }}
                animate={{ scale: stage >= 2 ? 1 : 1.25 }}
                transition={{ duration: IMG_ZOOM_DUR, delay: stage >= 2 ? IMG_DELAY : 0, ease: outExpo }}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,.4), rgba(0,0,0,.05), rgba(0,0,0,.5))' }} />
            </motion.div>

            <motion.h1
              ref={propRef}
              aria-label="Property Gallery"
              initial={{ opacity: 0, top: '54%', left: `${startLeft}vw`, x: '0%', y: '-50%', rotate: -3 }}
              animate={{
                opacity: ready ? 1 : 0,
                rotate: ready ? 0 : -3,
                left: stage >= 1 ? `${edge}vw` : `${startLeft}vw`,
                top: !ready ? '54%' : stage >= 2 ? topEnd : '50%',
                y: stage >= 2 ? '0%' : '-50%',
              }}
              transition={wordTransition}
              style={wordBase}
            >
              PROPERTY
            </motion.h1>

            <motion.div
              ref={galRef}
              aria-hidden="true"
              initial={{ opacity: 0, top: '54%', left: `${startRight}vw`, x: '0%', y: '-50%', rotate: 3 }}
              animate={{
                opacity: ready ? 1 : 0,
                rotate: ready ? 0 : 3,
                left: stage >= 1 ? `${100 - edge}vw` : `${startRight}vw`,
                x: stage >= 1 ? '-100%' : '0%',
                top: !ready ? '54%' : stage >= 2 ? '96%' : '50%',
                y: stage >= 2 ? '-100%' : '-50%',
              }}
              transition={wordTransition}
              style={wordBase}
            >
              GALLERY
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={stage >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ duration: 0.8, delay: 2.2 }}
              style={{
                position: 'absolute', left: `${edge}vw`, bottom: isMobile ? '12%' : '5%', zIndex: 30,
                maxWidth: isMobile ? '62vw' : 220, fontFamily: sans, fontSize: 13, lineHeight: 1.35, color: '#fff',
              }}
            >
              Luxury Real Estate Experience, curated properties for modern living.
            </motion.div>
          </motion.div>

          <motion.div style={{ position: 'absolute', inset: 0, background: '#000', opacity: introDim, pointerEvents: 'none', zIndex: 5 }} />
        </div>

        <section ref={stmtRef} style={{ position: 'relative', zIndex: 1, height: V(stmtVh), background: BG }}>
          <div style={{ position: 'sticky', top: 0, height: V(100), overflow: 'hidden', background: BG }}>
            <motion.div
              style={{
                position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center',
                padding: isMobile ? `${V(12)} 6vw ${V(8)}` : `${V(8)} 6vw`,
                color: CREAM, fontFamily: sans, opacity: stmtOpacity, scale: stmtScale,
              }}
            >
              <div
                style={{
                  fontSize: isMobile ? 'clamp(26px, 8vw, 44px)' : 'clamp(26px, min(6.2vw, 11.5vh), 110px)',
                  lineHeight: 1.12, letterSpacing: '-0.025em', fontWeight: 400,
                }}
              >
                <div>
                  <RevealWord progress={stmtOld} range={range(0)} first>{STATEMENT_FIRST}</RevealWord>
                </div>
                <div style={{ textAlign: 'right', maxWidth: isMobile ? '100%' : '68vw', marginLeft: 'auto' }}>
                  {rest.map((w, i) => (
                    <RevealWord key={i} progress={stmtOld} range={range(i + 1)}>{w}</RevealWord>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              style={{
                position: 'absolute', inset: 0, zIndex: 40, y: panelY, willChange: 'transform',
                borderTopLeftRadius: panelRadius, borderTopRightRadius: panelRadius,
                background: 'linear-gradient(160deg, #ffffff 0%, #f6f7fa 100%)',
                borderTop: '1px solid rgba(0,0,0,.08)', overflow: 'hidden', color: INK, fontFamily: mont,
              }}
            >
              {isMobile ? (
                <div
                  style={{
                    position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                    padding: `max(50px, ${V(6)}) 5vw ${V(2)}`,
                    justifyContent: 'space-between',
                  }}
                >
                  <motion.div style={{ opacity: aboutFade, x: aboutShift }}>
                    <div style={{ fontWeight: 800, fontSize: ABOUT.headingSizeMobile, letterSpacing: '0.02em', lineHeight: 1 }}>{ABOUT.heading}</div>
                    <p
                      style={{
                        margin: '8px 0 0', fontSize: ABOUT.textSizeMobile, fontWeight: 500, lineHeight: 1.5, color: 'rgba(20,22,28,.82)',
                        display: '-webkit-box', WebkitLineClamp: ABOUT.textLinesMobile, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                      }}
                    >
                      {ABOUT.text}
                    </p>
                    <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                      {aboutLogos.map((c) => (
                        <SocialLogo key={c.icon} c={c} size={ABOUT.logoSizeMobile} />
                      ))}
                    </div>
                  </motion.div>
                  <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: '2vh' }}>
                    <Phone small progress={sp} zoom={zoom} turn={turn} />
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: ABOUT.columns,
                    alignItems: 'center', gap: '3vw', padding: `${V(11)} 6vw ${V(4)} 7vw`,
                  }}
                >
                  <motion.div style={{ minWidth: 0, opacity: aboutFade, x: aboutShift }}>
                    <div style={{ fontWeight: 800, fontSize: ABOUT.headingSize, letterSpacing: '0.02em', lineHeight: 1 }}>{ABOUT.heading}</div>
                    <p style={{ margin: `${ABOUT.textGapTop} 0 0`, maxWidth: ABOUT.textMaxWidth, fontSize: ABOUT.textSize, fontWeight: 500, lineHeight: 1.75, color: 'rgba(20,22,28,.82)' }}>
                      {ABOUT.text}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: ABOUT.logoGap, marginTop: ABOUT.logoGapTop }}>
                      {aboutLogos.map((c) => (
                        <SocialLogo key={c.icon} c={c} size={ABOUT.logoSize} />
                      ))}
                    </div>
                  </motion.div>
                  <div style={{ justifySelf: 'center' }}>
                    <Phone progress={sp} zoom={zoom} turn={turn} />
                  </div>
                </div>
              )}
            </motion.div>

            <PortalScene zoom={zoom} isMobile={isMobile} onExplore={goProjects} />
          </div>
        </section>

        <PropertyLocationMap isMobile={isMobile} />

        <section ref={projectsRef} style={{ position: 'relative', zIndex: 10, background: BG, color: CREAM, padding: isMobile ? '9vh 5vw' : '12vh 6vw' }}>
          <div style={{ textAlign: 'center', marginBottom: isMobile ? '6vh' : '9vh' }}>
            <span style={{ fontSize: isMobile ? 13 : 16, letterSpacing: '0.3em', textTransform: 'uppercase', color: GOLD }}>Curated Portfolio</span>
            <h2 style={{ fontFamily: serif, fontSize: isMobile ? 32 : 52, margin: '1.2vh 0 0', fontWeight: 400 }}>Featured Projects</h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
              gap: '32px',
              maxWidth: 1280,
              margin: '0 auto',
            }}
          >
            {PROJECTS.map((proj, idx) => (
              <motion.div
                key={proj.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, delay: idx * 0.15, ease: outSoft }}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                }}
                whileHover={{ y: -6, borderColor: 'rgba(244,211,94,0.4)' }}
              >
                <div style={{ position: 'relative', height: isMobile ? 220 : 280, overflow: 'hidden', background: '#000' }}>
                  <img
                    src={proj.image}
                    alt={proj.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(14,18,1,0.9), transparent 50%)' }} />

                  <div style={{ position: 'absolute', top: 16, left: 16, background: CREAM, color: INK, padding: '5px 12px', borderRadius: '20px', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    {proj.tag}
                  </div>

                  <div style={{ position: 'absolute', bottom: 16, left: 20, right: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <div style={{ fontSize: 11, color: GOLD, letterSpacing: '0.15em', textTransform: 'uppercase' }}>{proj.subtitle}</div>
                      <h3 style={{ fontFamily: serif, fontSize: isMobile ? 22 : 26, margin: '4px 0 0', color: '#fff', fontWeight: 400 }}>{proj.title}</h3>
                    </div>
                  </div>
                </div>

                <div style={{ padding: isMobile ? 20 : 28, display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: GOLD, marginBottom: 10 }}>{proj.price}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: CREAM, opacity: 0.9, marginBottom: 12 }}>{proj.specs}</div>
                    <p style={{ fontFamily: sans, fontSize: 14, lineHeight: 1.7, opacity: 0.75, margin: 0 }}>{proj.desc}</p>
                  </div>

                  <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button
                      onClick={() => {
                        setSelectedProject(proj);
                        window.scrollTo({ top: 0, behavior: 'auto' });
                      }}
                      style={{
                        background: 'transparent', color: CREAM, padding: '10px 0', border: 'none',
                        fontWeight: 600, fontSize: 13, letterSpacing: '0.05em', cursor: 'pointer',
                        borderBottom: `1px solid ${GOLD}`, display: 'inline-flex', alignItems: 'center', gap: 6,
                      }}
                    >
                      View Details →
                    </button>
                    <span style={{ fontSize: 12, opacity: 0.5 }}>RERA Verified</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      <Footer isMobile={isMobile} footerRef={footerRef} onProjects={goProjects} onAbout={goAbout} />
    </>
  );
}