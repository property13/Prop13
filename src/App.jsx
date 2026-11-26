import { lazy, Suspense, useState, useEffect, useRef, useId, useCallback } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useReducedMotion,
  useInView,
  useTransform,
  useSpring,
  useMotionTemplate,
  useMotionValue,
  animate as runAnimation,
} from 'framer-motion';

const MinimalEarthCanvas = lazy(() => import('./MinimalEarthCanvas.jsx'));
const loadIPhoneModel = () => import('./IPhoneModel.jsx');
const IPhoneModel = lazy(loadIPhoneModel);
const SHOWCASE_HOLD_VH = 75;
const SOCIAL_SCROLL_VH = 110;

/* ================= 1. CONSTANTS ================= */
const HERO_IMG = '/pic1.png';
const DEFAULT_PHONE_SCREEN_IMAGE = HERO_IMG;
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

const sans = 'Arial, sans-serif';

const V = (n) => `calc(var(--vh) * ${n})`;

const statementFontSize = (isMobile) => isMobile ? 'clamp(26px, 8vw, 44px)' : 'clamp(26px, min(6.2vw, 11.5vh), 110px)';
const STATEMENT_FIRST = 'Real estate';
const STATEMENT_REST =
  'Across India and Dubai. Developments, destinations and opportunities worth exploring, across markets that continue to evolve';

const INSTAGRAM = 'propertygallery13';
const LINKEDIN = 'linkedin.com/in/harpreet-singh-ghulati-64535234';
const WHATSAPP = '+91 8851678180';
const EMAIL = 'info@propertygallery.com';
const YOUTUBE = 'Property Gallery Vlogs';
const YOUTUBE_URL = 'https://www.youtube.com/@PropertyGalleryVlogs';

const aboutFont = '"Lay Grotesk", Arial, sans-serif';
const aboutFontPath = `${import.meta.env.BASE_URL}laygrotesk-trial-regular`;

const ABOUT = {
  heading: 'About',
  propertyText: 'Property Gallery brings together a curated selection of homes, investment opportunities, and new developments. Explore property walkthroughs, neighbourhood guides, and insights to help you find the right space.',
  founderText: 'Harpreet Singh Ghulati is the founder of Property Gallery. Through property walkthroughs and market insights, he helps buyers explore residential and commercial properties and understand what each project offers.',
  textSize: 24,
  textMaxWidth: 800,
  textGapTop: '2.6vh',
  phoneHeight: 'clamp(320px, calc(var(--vh) * 72), 720px)',
  columns: '1.2fr 0.8fr',
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
const MOBILE_HEADER_HEIGHT = 68;
const MOBILE_ZOOM_END = 0.79;
const MOBILE_ZOOM_SPRING = { stiffness: 60, damping: 28, mass: 0.6 };
const TURN_VH = 45;
const TURN_DEG = -90;
const DESKTOP_PHONE_END = 0.8;
const smoothStep = (t) => t * t * (3 - 2 * t);

const FONT_VW = 6.3;
const FONT_VW_MOBILE = 6.4;
const START_LEFT = 12.1;
const START_RIGHT = 55.5;
const START_LEFT_MOBILE = 12.0;
const START_RIGHT_MOBILE = 83.0;
const NAV_FONT = 16;
const NAV_GAP = 'clamp(32px, 3vw, 48px)';

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

function usePageVisible() {
  const [visible, setVisible] = useState(() => document.visibilityState === 'visible');
  useEffect(() => {
    const update = () => setVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);
  return visible;
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

const fill = { position: 'absolute', inset: 0 };

function ProfileScreen({ image }) {
  const tile = (pos) => ({
    aspectRatio: '1',
    backgroundImage: `url(${image})`,
    backgroundSize: '260%',
    backgroundPosition: pos,
  });
  return (
    <div style={{ ...fill, background: '#000', color: '#fff', fontFamily: sans, padding: '3.6em 0.9em 0.9em' }}>
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
          <div key={p} style={{ width: '3.4em', height: '3.4em', borderRadius: '50%', border: '1.5px solid #555', backgroundImage: `url(${image})`, backgroundSize: '300%', backgroundPosition: p }} />
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

function ReelScreen({ image }) {
  const circle = { width: '2.6em', height: '2.6em', borderRadius: '50%', background: 'rgba(0,0,0,.35)', display: 'grid', placeItems: 'center' };
  return (
    <div style={{ ...fill, background: '#000', overflow: 'hidden', fontFamily: sans, color: '#fff' }}>
      <motion.div
        initial={{ scale: 1.05 }}
        animate={{ scale: 1.22 }}
        transition={{ duration: 3.4, ease: 'linear' }}
        style={{ ...fill, backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
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

function Badge({ icon, label, to, suffix, caption, show, active, small, from, delay = 0, style }) {
  const float = show && active;
  return (
    <motion.div
      initial={{ opacity: 0, x: from }}
      animate={show ? { opacity: 1, x: 0 } : { opacity: 0, x: from }}
      transition={{ duration: show ? BADGE_DUR : 0.5, delay: show ? delay : 0, ease: outExpo }}
      style={{ position: 'absolute', pointerEvents: 'none', ...style }}
    >
      <motion.div
        animate={float ? { y: [0, -4, 0] } : { y: 0 }}
        transition={
          float
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
          fontFamily: sans,
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
            <div style={{ fontSize: 10, opacity: 0.65, textTransform: 'capitalize', letterSpacing: '0.16em' }}>{label}</div>
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

const LAND_R = (19.3 - 0.633) / (9 - 0.633);

function DesktopPhoneDisplay({ image }) {
  return (
    <>
      <div style={{ ...fill, backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div style={{ ...fill, background: 'linear-gradient(to bottom, rgba(0,0,0,.25), transparent 35%, transparent 60%, rgba(0,0,0,.65))' }} />
      <div style={{ position: 'absolute', left: '4%', bottom: '8%', fontFamily: sans, color: '#fff', lineHeight: 1.35 }}>
        <div style={{ fontWeight: 700, fontSize: '1.5em' }}>@{INSTAGRAM}</div>
        <div style={{ opacity: 0.9, fontSize: '1.15em' }}>Luxury homes tour · Delhi NCR</div>
      </div>
    </>
  );
}

function desktopPhonePose(t, { w, h, width, height, dx, dy, header }) {
  const angle = Math.PI * t / 2;
  const sin = Math.sin(angle);
  const cos = Math.cos(angle);
  // Include the buttons that protrude from the sides of the portrait body.
  const bodyWidth = w + h * 0.0205 * 0.8;
  const halfWidth = (bodyWidth * cos + h * sin) / 2;
  const halfHeight = (bodyWidth * sin + h * cos) / 2;
  const originX = width / 2 - dx;
  const originY = height / 2 - dy;
  const gutter = 12;
  const top = Math.max(gutter, Math.min(header + gutter, originY - h / 2));
  // Lift the phone during the turn and bring it back to center for fullscreen.
  const lift = Math.min(48, height * 0.07) * Math.sin(Math.PI * t);
  const centerY = Math.max(top + 1, Math.min(height - gutter - 1, originY + dy * t - lift));
  const maxScale = Math.min(
    (width / 2 - gutter) / halfWidth,
    (centerY - top) / halfHeight,
    (height - gutter - centerY) / halfHeight,
  );
  const target = 1 + 0.48 * t;
  // Soften the scale limit to avoid a change in velocity as the bounds meet.
  const band = Math.min(0.08, t * 0.2);
  const overlap = Math.max(0, band - Math.abs(target - maxScale));
  const scale = Math.min(target, maxScale) - (band ? overlap ** 2 / (4 * band) : 0);
  const insetX = halfWidth * scale;
  return {
    x: Math.max(gutter + insetX, Math.min(width - gutter - insetX, originX + dx * t)) - originX,
    y: centerY - originY,
    scale,
  };
}

function usePhoneDrag(enabled) {
  const pointer = useRef(null);
  const suppressClick = useRef(false);
  const [dragging, setDragging] = useState(false);
  const yawTarget = useMotionValue(0);
  const pitchTarget = useMotionValue(0);
  const yaw = useSpring(yawTarget, { stiffness: 300, damping: 34 });
  const pitch = useSpring(pitchTarget, { stiffness: 300, damping: 34 });

  useEffect(() => {
    if (!enabled) return undefined;
    const finish = (event) => {
      if (pointer.current?.id !== event.pointerId) return;
      suppressClick.current = pointer.current.dragging;
      pointer.current = null;
      setDragging(false);
    };
    const move = (event) => {
      const start = pointer.current;
      if (!start || start.id !== event.pointerId) return;
      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      if (!start.dragging) {
        if (Math.hypot(dx, dy) < 6) return;
        if (event.pointerType === 'touch' && Math.abs(dy) >= Math.abs(dx)) {
          pointer.current = null;
          return;
        }
        start.dragging = true;
        setDragging(true);
      }
      yawTarget.set(start.yaw + dx * 0.9);
      pitchTarget.set(Math.max(-65, Math.min(65, start.pitch - dy * 0.55)));
    };
    const cancel = () => {
      pointer.current = null;
      setDragging(false);
    };
    const reset = () => {
      if (pointer.current?.dragging) return;
      // Reset to the nearest front-facing turn after a full revolution.
      const front = Math.round(yawTarget.get() / 360) * 360;
      yawTarget.set(front);
      pitchTarget.set(0);
    };
    window.addEventListener('scroll', reset, { passive: true });
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerup', finish, { passive: true });
    window.addEventListener('pointercancel', finish, { passive: true });
    window.addEventListener('blur', cancel);
    return () => {
      window.removeEventListener('scroll', reset);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', finish);
      window.removeEventListener('pointercancel', finish);
      window.removeEventListener('blur', cancel);
      cancel();
      yawTarget.set(0);
      pitchTarget.set(0);
    };
  }, [enabled, yawTarget, pitchTarget]);

  const handlers = enabled ? {
    onPointerDown(event) {
      if (!event.isPrimary || event.button !== 0) return;
      suppressClick.current = false;
      pointer.current = { id: event.pointerId, x: event.clientX, y: event.clientY, yaw: yaw.get(), pitch: pitch.get(), dragging: false };
      if (event.pointerType === 'mouse') event.currentTarget.setPointerCapture(event.pointerId);
    },
    onClickCapture(event) {
      if (event.detail && suppressClick.current) {
        suppressClick.current = false;
        event.preventDefault();
        event.stopPropagation();
      }
    },
  } : {};
  return { yaw, pitch, dragging, handlers };
}

function Phone({ small, progress, center, expansion, landscapeGrowth, fullscreen, settle, enabled, image }) {
  const [i, setI] = useState(0);
  const [show, setShow] = useState(false);
  const [expanding, setExpanding] = useState(false);
  const showRef = useRef(false);
  const layoutRef = useRef(null);
  const displayRef = useRef(null);
  const inView = useInView(layoutRef);
  const nearViewport = useInView(layoutRef, { once: true, margin: '600px 0px' });
  const [modelReady, setModelReady] = useState(false);
  const interactive = enabled && inView && modelReady;
  const { yaw, pitch, dragging, handlers } = usePhoneDrag(interactive);
  const faceOpacity = useTransform([yaw, pitch], ([y, x]) => {
    const facing = Math.cos(y * Math.PI / 180) * Math.cos(x * Math.PI / 180);
    return Math.min(1, Math.max(0, facing * 12));
  });
  const active = enabled && inView;

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 40, damping: 24, mass: 1 });
  const smy = useSpring(my, { stiffness: 40, damping: 24, mass: 1 });

  const dxMV = useMotionValue(0);
  const dyMV = useMotionValue(0);
  const sMV = useMotionValue(1);
  const floatY = useMotionValue(0);
  const geometry = useMotionValue(null);
  const [displaySize, setDisplaySize] = useState(null);

  useEffect(() => {
    if (!active || expanding) return undefined;
    const t = setInterval(() => setI((v) => (v + 1) % 2), 3300);
    return () => clearInterval(t);
  }, [active, expanding]);

  useEffect(() => {
    if (small || !active || expanding) return undefined;
    const controls = runAnimation(floatY, [0, -8, 0], { duration: 4.5, repeat: Infinity, ease: 'easeInOut' });
    return () => controls.stop();
  }, [small, active, expanding, floatY]);

  useEffect(() => {
    if (!enabled) return undefined;
    let previousZooming;
    const update = () => {
      const p = progress.get();
      const nextShow = p > PH_SHOW_ON ? true : p < PH_IN ? false : showRef.current;
      const nextZooming = expansion.get() > 0.01;
      if (nextShow !== showRef.current) {
        showRef.current = nextShow;
        setShow(nextShow);
      }
      if (nextZooming !== previousZooming) {
        previousZooming = nextZooming;
        setExpanding(nextZooming);
        if (nextZooming) setI(1);
      }
    };
    update();
    const unsubscribe = [progress, expansion].map((value) => value.on('change', update));
    return () => unsubscribe.forEach((stop) => stop());
  }, [enabled, progress, expansion, small]);

  useEffect(() => {
    if (small || !active) return undefined;
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
      leave();
    };
  }, [small, active, mx, my]);

  useEffect(() => {
    const el = layoutRef.current;
    if (!el) return undefined;
    const measure = () => {
      const op = el.offsetParent;
      if (!op) return;
      // Measure the stationary layout box so scroll transforms never feed back into geometry.
      const box = el.getBoundingClientRect();
      const panel = op.getBoundingClientRect();
      const w = small ? el.offsetWidth : box.width;
      const h = small ? el.offsetHeight : box.height;
      if (!w || !h || !panel.width || !panel.height) return;
      const em = h * 0.0205;
      const sw = w - 1.6 * em;
      const sh = h - 1.6 * em;
      dxMV.set(small ? op.offsetWidth / 2 - (el.offsetLeft + w / 2) : panel.left + panel.width / 2 - (box.left + w / 2));
      dyMV.set(small ? op.offsetHeight / 2 - (el.offsetTop + h / 2) : panel.top + panel.height / 2 - (box.top + h / 2));
      if (small) {
        sMV.set(Math.max(op.offsetWidth / sw, op.offsetHeight / sh) * 1.25);
        return;
      }
      const header = Math.min(108, Math.max(76, window.innerHeight * 0.1));
      geometry.set({ w, h, width: panel.width, height: panel.height, dx: dxMV.get(), dy: dyMV.get(), header });
      if (displayRef.current) {
        const display = getComputedStyle(displayRef.current);
        const width = parseFloat(display.height);
        const height = parseFloat(display.width);
        setDisplaySize((old) => old?.width === width && old?.height === height ? old : { width, height });
      }
    };
    measure();
    let ro;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(measure);
      ro.observe(el);
      if (el.offsetParent) ro.observe(el.offsetParent);
    } else {
      window.addEventListener('resize', measure);
    }
    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [small, dxMV, dyMV, sMV, geometry]);

  const deg = PHONE_TURN_DEG * (small ? 0.75 : 1);
  const scrollRotY = useTransform(progress, [PH_IN, PH_OUT], [-deg, 0]);
  const scrollRotX = useTransform(progress, [PH_IN, PH_OUT], [deg * 0.18, 0]);
  const entranceScale = useTransform(progress, [PH_IN, PH_OUT], [0.93, 1]);
  const turnScale = useTransform([entranceScale, settle], ([scale, rest]) => small ? scale : scale + (1 - scale) * rest);

  const rotY = useTransform([scrollRotY, smx, settle], ([a, b, rest]) => (a + b * 9) * (1 - rest));
  const rotX = useTransform([scrollRotX, smy, settle], ([a, b, rest]) => (a - b * 6) * (1 - rest));
  const turnRot = useTransform(expansion, (t) => small ? 0 : TURN_DEG * t);
  const landO = useTransform(expansion, [0.3, 0.7], [0, 1]);
  const statusO = useTransform(landO, (v) => small ? 1 : 1 - v);

  const zx = useTransform([center, dxMV], ([t, dx]) => t * dx);
  const zy = useTransform([center, dyMV, floatY, settle], ([t, dy, bob, rest]) => t * dy + (small ? 0 : bob * (1 - rest)));
  const zs = useTransform([expansion, sMV], ([t, scale]) => Math.pow(scale, Math.max(0, Math.min(1, t))));
  const pose = useTransform([expansion, geometry], ([t, dimensions]) => dimensions ? desktopPhonePose(t, dimensions) : { x: 0, y: 0, scale: 1 });
  const desktopX = useTransform(pose, ({ x }) => x);
  const desktopY = useTransform([pose, floatY, settle], ([{ y }, bob, rest]) => y + bob * (1 - rest));
  const desktopScale = useTransform(() => {
    const { scale } = pose.get();
    const growth = landscapeGrowth?.get() ?? 0;
    const dimensions = geometry.get();
    if (!growth || !dimensions || !displaySize?.width || !displaySize.height) return scale;

    // The dimensions are already swapped for landscape. Overscan keeps the
    // rounded display corners outside the viewport at the end of the zoom.
    const cover = Math.max(dimensions.width / displaySize.width, dimensions.height / displaySize.height);
    const target = Math.max(scale, cover * 1.1);
    return scale * Math.pow(target / scale, growth);
  });
  const screenScale = useTransform(() => {
    const dimensions = geometry.get();
    if (!fullscreen || !dimensions || !displaySize?.width || !displaySize.height) return 1;
    const start = desktopPhonePose(1, dimensions).scale;
    const end = Math.max(dimensions.width / displaySize.width, dimensions.height / displaySize.height);
    return Math.pow(end / start, fullscreen.get());
  });
  const desktopFade = useTransform(center, [0, 0.75], [1, 0]);
  const mobileFade = useTransform(expansion, [0, 0.2], [1, 0]);
  const fadeOut = small ? mobileFade : desktopFade;
  const mobileScreenFade = useTransform(expansion, [0.79, 0.96], [0, 1]);

  const shadowX = useTransform(rotY, (v) => v * -0.9);

  const height = small
    ? 'min(350px, 75vw, 42svh)'
    : ABOUT.phoneHeight;

  const phone = (
    <>
        <motion.div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: fadeOut }}>
          <motion.div
            initial={false}
            animate={{ opacity: modelReady ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            style={{ position: 'absolute', inset: 0 }}
          >
            <div
              style={{
                position: 'absolute', inset: '-22% -48%', pointerEvents: 'none',
                background: 'radial-gradient(closest-side, rgba(255,255,255,.10), rgba(255,255,255,0) 70%)',
              }}
            />
            <motion.div
              animate={active ? { scaleX: [1, 0.9, 1], opacity: [0.9, 0.65, 0.9] } : { scaleX: 1, opacity: 0.9 }}
              transition={active ? { duration: 4.5, repeat: Infinity, ease: 'easeInOut' } : { duration: 0 }}
              style={{
                position: 'absolute', left: '6%', right: '-6%', bottom: '-6%', height: '8%', x: shadowX,
                borderRadius: '50%', background: 'rgba(40, 24, 12, 0.32)', filter: 'blur(22px)', pointerEvents: 'none',
              }}
            />
            <motion.div
              animate={active ? { scaleX: [1, 0.94, 1] } : { scaleX: 1 }}
              transition={active ? { duration: 4.5, repeat: Infinity, ease: 'easeInOut' } : { duration: 0 }}
              style={{
                position: 'absolute', left: '16%', right: '4%', bottom: '-3.5%', height: '3%', x: shadowX,
                borderRadius: '50%', background: 'rgba(20, 10, 4, 0.45)', filter: 'blur(8px)', pointerEvents: 'none',
              }}
            />
          </motion.div>
        </motion.div>

        <motion.div style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none', opacity: fadeOut }}>
          <Badge
            icon="ig" label="Instagram" to={169} suffix="k" caption="Followers"
            show={show && modelReady} active={active} small={small} from={small ? -70 : -150} delay={IG_DELAY}
            style={{ top: small ? '6%' : '8%', left: 'calc(100% - 40px)', zIndex: 3 }}
          />
          <Badge
            icon="yt" label="YouTube" to={128} suffix="k+" caption="Subscribers"
            show={show && modelReady} active={active} small={small} from={small ? -60 : 150} delay={YT_DELAY}
            style={{ bottom: small ? '14%' : '18%', right: 'calc(100% - 40px)', zIndex: 3 }}
          />
        </motion.div>

        {/* Phone stays invisible until the 3D model is ready, then fades in. */}
        <motion.div
          style={{
            position: 'relative', zIndex: 2, transformStyle: 'flat',
            transformPerspective: 1400, rotate: turnRot, rotateY: rotY, rotateX: rotX, scale: turnScale,
          }}
        >
          <div
            {...handlers}
            style={{
              '--ph': height,
              position: 'relative',
              height: 'var(--ph)',
              aspectRatio: '9 / 19.3',
              fontSize: 'calc(var(--ph) * 0.0205)',
              transformStyle: 'flat',
              touchAction: interactive ? 'pan-y' : undefined,
              cursor: interactive ? (dragging ? 'grabbing' : 'grab') : undefined,
              userSelect: interactive ? 'none' : undefined,
            }}
          >
            {!modelReady && (
              <div aria-hidden="true" style={{
                position: 'absolute', inset: 0, borderRadius: PHONE_RADIUS,
                background: '#101113', border: '1px solid #666', pointerEvents: 'none',
              }} />
            )}
            {nearViewport && (
              <Suspense fallback={null}>
                <IPhoneModel displayRef={displayRef} image={image} onReady={setModelReady} ready={modelReady} zoom={small ? zs : desktopScale} yaw={yaw} pitch={pitch} />
              </Suspense>
            )}

            <motion.div
              style={{
                position: 'absolute', inset: 0, boxSizing: 'border-box', borderRadius: PHONE_RADIUS,
                padding: '0.5em', zIndex: 1,
                rotateX: pitch, rotateY: yaw, opacity: faceOpacity, backfaceVisibility: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'relative', width: '100%', height: '100%', boxSizing: 'border-box',
                  borderRadius: '16.2% / 7.5%', padding: '0.3em',
                }}
              >
                <div ref={displayRef} style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '15% / 6.9%', overflow: 'hidden', isolation: 'isolate' }}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 28 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -28 }}
                      transition={{ duration: 0.55, ease: outSoft }}
                      style={fill}
                    >
                      {i === 0 ? <ProfileScreen image={image} /> : <ReelScreen image={image} />}
                    </motion.div>
                  </AnimatePresence>

                  {!small && <motion.div
                      style={{
                        position: 'absolute', top: '50%', left: '50%',
                        width: `${LAND_R * 100}%`, height: `${100 / LAND_R}%`,
                        x: '-50%', y: '-50%', rotate: 90,
                        opacity: landO, zIndex: 2, overflow: 'hidden', background: '#000', pointerEvents: 'none',
                      }}
                    >
                      <motion.div style={{ ...fill, scale: screenScale }}>
                        <DesktopPhoneDisplay image={image} />
                      </motion.div>
                  </motion.div>}

                  {small && <motion.div style={{ ...fill, zIndex: 3, opacity: mobileScreenFade, background: '#000', pointerEvents: 'none' }} />}

                  <StatusBar o={statusO} />

                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute', top: '0.85em', left: '50%', transform: 'translateX(-50%)',
                      width: '31%', height: '2.05em', borderRadius: 999, zIndex: 7, pointerEvents: 'none',
                      background: '#080809', boxShadow: 'inset 0 0 0.14em rgba(255,255,255,.14)',
                    }}
                  >
                    <span style={{
                      position: 'absolute', right: '11%', top: '50%', transform: 'translateY(-50%)',
                      width: '0.85em', height: '0.85em', borderRadius: '50%',
                      background: 'radial-gradient(circle at 35% 35%, #40516e, #151a29 38%, #05060a 70%)',
                      boxShadow: '0 0 0 0.09em #111216',
                    }} />
                  </div>

                  <div style={{ position: 'absolute', bottom: '0.55em', left: '50%', transform: 'translateX(-50%)', width: '34%', height: '0.36em', borderRadius: 999, background: 'rgba(255,255,255,.85)', zIndex: 4, pointerEvents: 'none' }} />

                  <div style={{ position: 'absolute', inset: 0, zIndex: 6, pointerEvents: 'none', background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 62%, rgba(0,0,0,.28) 100%)' }} />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
    </>
  );

  return (
    <div ref={layoutRef}>
      <motion.div style={{ position: 'relative', x: small ? zx : desktopX, y: small ? zy : desktopY, scale: small ? zs : desktopScale }}>
        {small ? (
          <motion.div
            style={{ position: 'relative', justifySelf: 'center' }}
            animate={active && !expanding ? { y: [0, -8, 0] } : { y: 0 }}
            transition={active && !expanding ? { duration: 4.5, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.4 }}
          >
            {phone}
          </motion.div>
        ) : phone}
      </motion.div>
    </div>
  );
}


/* === PROPERTY GALLERY / MINIMAL EARTH SCROLL JOURNEY ===
   A minimal Three.js globe with dark charcoal land, near-black sea and restrained coastline.
   Map texture: generated from Basemap/GSHHS geographic coastline dataset; no satellite imagery.
   All geographic pin positions use real latitude/longitude.
   Geographic projection is aligned to the equirectangular Earth texture.
   WebGL is only active while this scene is mounted; renders on scroll/resize. */
const EARTH_STOPS = [
  {name:'Delhi NCR',lat:28.6139,lon:77.2090,country:'India'},
  // {name:'Panipat',lat:29.3909,lon:76.9635,country:'India'},
  {name:'Gurugram',lat:28.4595,lon:77.0266,country:'India'},
  {name:'Noida',lat:28.5355,lon:77.3910,country:'India'},
  {name:'Ahmedabad',lat:23.0225,lon:72.5714,country:'India'},
  {name:'Nagpur',lat:21.1458,lon:79.0882,country:'India'},
  {name:'Mumbai',lat:19.0760,lon:72.8777,country:'India'},
  // {name:'Alibaug',lat:18.6414,lon:72.8722,country:'India'},
  {name:'Goa',lat:15.4909,lon:73.8278,country:'India'},
  {name:'Dubai',lat:25.2048,lon:55.2708,country:'United Arab Emirates'},
];
const EARTH_MILESTONES=[.115,.195,.275,.355,.445,.535,.625,.705,.775,.97];
const DEVELOPER_LOGOS = [
  { name: 'Godrej Properties', file: 'Godrej-properties(1).png', zoom: true, wide: true },
  { region: 'Dubai', name: 'DAMAC', file: 'damac(2).png', zoom: true },
  { name: 'M3M', file: 'm3m(2).png', zoom: true },
  { region: 'Dubai', name: 'Binghatti', file: 'binghatti(1).png', zoom: true },
  { region: 'Dubai', name: 'Emaar', file: 'Emaar(2).png', zoom: true, wide: true },
  { region: 'Dubai', name: 'Imtiaz Developments', file: 'Imtiaz.png' },
  { region: 'Dubai', name: 'Sobha Realty', file: 'Sobha_Realty(1).png', zoom: true },
  { name: 'DLF', file: 'DLF_Logo(1).png', zoom: true },
  { name: 'Hero Realty', file: 'Hero-Reality.png' },
  { name: 'Experion', file: 'Experion.png', zoom: true, wide: true },
  { name: 'Ganga Realty', file: 'g_Logo(1).png', zoom: true, wide: true },
  { name: 'Birla Estates', file: 'birla-estates(1).png', zoom: true, wide: true },
  { name: 'Krisumi', file: 'krisumi(1).png', zoom: true, wide: true },
  { name: 'Reach', file: 'Reach.png', wide: true, zoom: true, },
];

function developerLogoSources(file) {
  const filenameWithoutCopyNumber = file.replace(/\s*\(\d+\)(?=\.png$)/i, '');
  return [...new Set([file, filenameWithoutCopyNumber])].flatMap((filename) =>
    ['Logos/', 'logos/', ''].map((folder) =>
      `${import.meta.env.BASE_URL}${folder}${encodeURIComponent(filename)}`
    )
  );
}

function tryNextDeveloperLogo(event, sources) {
  const image = event.currentTarget;
  const next = sources[sources.indexOf(image.getAttribute('src')) + 1];
  if (next) image.setAttribute('src', next);
}

function DeveloperLogoSlider() {
  return (
    <section className="pg-logo-strip" aria-label="Property developer logos">
      <style>{`
        .pg-logo-strip {
          position: relative; z-index: 1; isolation: isolate; overflow: hidden;
          padding-block: clamp(32px, 4vw, 56px);
          background: radial-gradient(ellipse at 50% 0%, #1d1914 0%, #11100e 55%, #0c0c0c 100%);
          border-block: 1px solid rgba(220,190,137,.16);
        }
        .pg-logo-row + .pg-logo-row {
          border-top: 1px solid rgba(220,190,137,.16);
          margin-top: 26px; padding-top: 24px;
        }
        .pg-logo-heading {
          margin: 0 0 14px; padding-inline: 6vw; color: #e3c594;
          font: 600 13px/1.3 Arial, sans-serif; letter-spacing: .14em; text-transform: uppercase;
        }
        .pg-logo-window {
          mask-image: linear-gradient(90deg, transparent, black 7%, black 93%, transparent);
        }
        .pg-logo-track { display: flex; width: max-content; animation: pg-logo-slide 22s linear infinite; }
        .pg-logo-group {
          --logo-gap: clamp(12px, 1.5vw, 22px);
          display: flex; align-items: center; flex: none;
          box-sizing: border-box;
          gap: var(--logo-gap); padding-inline: calc(var(--logo-gap) / 2);
        }
        .pg-logo-item {
          display: inline-flex; flex: none; align-items: center; justify-content: center;
          min-height: 96px; padding: 10px; border-radius: 10px;
          border: 1px solid rgba(235,210,169,.13);
          background: linear-gradient(145deg, rgba(255,242,216,.055), rgba(255,242,216,.015));
          box-shadow: inset 0 1px 0 rgba(255,255,255,.045);
          box-sizing: border-box;
        }
        .pg-logo-mark {
          display: grid; place-items: center; width: 124px; height: 72px;
          padding: 5px;
          box-sizing: border-box;
        }
        .pg-logo-mark[data-wide="true"] { width: 156px; }
        .pg-logo-item[data-light="true"] { background: #eee8dd; }
        .pg-logo-mark img { display: block; width: 100%; height: 100%; min-height: 0; object-fit: contain; scale: 1.12; }
        .pg-logo-mark img[data-zoom="true"] { scale: 1.70; }
        .pg-logo-mark img[data-invert="true"] { filter: invert(1); }
        @media (max-width: 600px) {
          .pg-logo-item { min-height: 76px; padding: 8px; }
          .pg-logo-mark { width: 94px; height: 58px; padding: 5px; }
          .pg-logo-mark[data-wide="true"] { width: 114px; }
        }
        @keyframes pg-logo-slide { to { transform: translateX(-25%); } }
        @media (prefers-reduced-motion: reduce) {
          .pg-logo-track { animation: none; width: auto; }
          .pg-logo-window { mask-image: none; }
          .pg-logo-group { min-width: 0; width: 100%; flex-wrap: wrap; justify-content: center; box-sizing: border-box; }
          .pg-logo-group[aria-hidden="true"] { display: none; }
        }
      `}</style>
      {['India', 'Dubai'].map((region) => {
        const logos = DEVELOPER_LOGOS.filter((logo) => (logo.region ?? 'India') === region);
        return (
          <div key={region} className="pg-logo-row">
            <h2 className="pg-logo-heading">{region} Developers</h2>
            <div className="pg-logo-window">
              <div className="pg-logo-track">
                {[0, 1, 2, 3].map((copy) => (
                  <div key={copy} className="pg-logo-group" aria-hidden={copy > 0 || undefined}>
                    {logos.map(({ name, file, wide, invert, zoom, light }) => (
                      <div key={file} className="pg-logo-item" data-light={light}>
                        <span className="pg-logo-mark" data-wide={wide}>
                          <img src={developerLogoSources(file)[0]}
                            onError={(event) => tryNextDeveloperLogo(event, developerLogoSources(file))}
                            alt={copy === 0 ? name : ''} data-invert={invert} data-zoom={zoom} decoding="async" />
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}

function PropertyLocationMap({isMobile,enabled}) {
  const section=useRef(null);
  const sticky=useRef(null);
  const nearby=useInView(section,{margin:'600px 0px',once:true});
  const inView=useInView(sticky);
  const activeRendering=enabled&&inView;
  const [active,setActive]=useState(-1);
  const [fallback,setFallback]=useState(false);
  const [reduced,setReduced]=useState(false);
  const {scrollYProgress:progress}=useScroll({target:section,offset:['start start','end end']});
  useEffect(()=>{
    const mq=window.matchMedia('(prefers-reduced-motion: reduce)');
    const update=()=>setReduced(mq.matches);update();mq.addEventListener?.('change',update);
    return()=>mq.removeEventListener?.('change',update);
  },[]);
  useEffect(()=>{
    if(!activeRendering)return;
    let previous;
    const update=p=>{
      let step=-1;
      for(let i=0;i<EARTH_STOPS.length;i++)if(p>=EARTH_MILESTONES[i]-.025)step=i;
      if(step!==previous){
        previous=step;
        setActive(step);
      }
    };update(progress.get());return progress.on('change',update);
  },[progress,activeRendering]);
  const current=active<0?null:EARTH_STOPS[active];
  return <section ref={section} aria-label="Scroll through Property Gallery locations in India and Dubai" style={{position:'relative',height:reduced?'100svh':isMobile?'600svh':'680svh',background:'#05090c',color:CREAM}}>
    <div ref={sticky} style={{position:'sticky',top:0,height:'100svh',overflow:'hidden',isolation:'isolate',background:'#05090c'}}>
      {fallback?<div style={{position:'absolute',inset:0,display:'grid',placeItems:'center',color:CREAM}}>Explore India & Dubai</div>:nearby&&(
        <Suspense fallback={null}>
          <MinimalEarthCanvas progress={progress} isMobile={isMobile} reducedMotion={reduced} onWebGLError={setFallback} stops={EARTH_STOPS} milestones={EARTH_MILESTONES} active={activeRendering}/>
        </Suspense>
      )}
      <div aria-hidden="true" style={{position:'absolute',inset:0,pointerEvents:'none',background:'linear-gradient(90deg,rgba(3,7,9,.62),transparent 46%,rgba(3,7,9,.13)),linear-gradient(180deg,rgba(3,7,9,.1),transparent 25%,transparent 72%,#05090c 100%)'}}/>
      <div style={{position:'absolute',left:isMobile?22:'6%',right:isMobile?22:'auto',top:isMobile?82:'33%',zIndex:5,pointerEvents:'none',textAlign:isMobile?'center':'left',maxWidth:isMobile?'none':330}}>
        <div style={{fontFamily:sans,fontSize:14,letterSpacing:'.24em',color:GOLD,marginBottom:isMobile?10:22}}>Property Gallery / Explore</div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={current?.name||'intro'} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}} transition={{duration:.28}}>
            <h2 style={{fontFamily:sans,fontSize:isMobile?'clamp(28px,7vw,39px)':'clamp(42px,4vw,68px)',fontWeight:400,lineHeight:1.1,margin:0,textShadow:'0 3px 22px rgba(0,0,0,.65)'}}>{current?.name||'India to Dubai'}</h2>
            {/* <div style={{color:'#d7cba9',fontFamily:sans,fontSize:isMobile?11:13,letterSpacing:'.1em',marginTop:13}}>{current?.country||'A journey across destinations'}</div> */}
          </motion.div>
        </AnimatePresence>
      </div>
      <div style={{position:'absolute',right:isMobile?18:'4.5%',top:isMobile?'auto':'47%',bottom:isMobile?68:'auto',color:'#dfd4bc',fontFamily:sans,fontSize:10,letterSpacing:'.19em',textAlign:'right',zIndex:5,pointerEvents:'none'}}>{active<0?'00 / 08':String(active+1).padStart(1,'0')+' / 08'}</div>
      <div style={{position:'absolute',left:isMobile?22:'6%',right:isMobile?22:'6%',bottom:isMobile?37:42,zIndex:5,pointerEvents:'none'}}>
        {/* <div style={{height:1,background:'rgba(244,211,94,.22)',overflow:'hidden'}}><motion.div style={{height:'100%',background:GOLD,scaleX:progress,transformOrigin:'left'}}/></div> */}
        {/* <div style={{display:'flex',justifyContent:'space-between',fontFamily:sans,fontSize:9,letterSpacing:'.15em',color:'#bdb18f',marginTop:12}}><span>INDIA</span><span>SCROLL TO TRAVEL ↓</span><span>DUBAI</span></div> */}
      </div>
    </div>
  </section>;
}

function RevealWord({ children, progress, range, first }) {
  const o = useTransform(progress, range, [0.22, 1]);
  return (
    <motion.span
      style={{
        opacity: o,
        display: 'inline-block',
        marginLeft: first ? 0 : '0.28em',
      }}
    >
      {children}
    </motion.span>
  );
}

function GoldLine({active}) {
  return (
    <motion.div
      animate={active ? { backgroundPosition: ['0% 0%', '100% 0%'] } : { backgroundPosition: '0% 0%' }}
      transition={active ? { duration: 5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' } : { duration: 0 }}
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
            onError={sec.onImageError}
            alt={sec.title}
            loading={i === 0 ? 'eager' : 'lazy'}
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
    let previous;
    const update = (v) => {
      const index = Math.min(n - 1, Math.max(0, Math.round(v * (n - 1))));
      if (index === previous) return;
      previous = index;
      setActive(index);
    };
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
              <div style={{ fontFamily: sans, fontSize: 12, letterSpacing: '0.22em', textTransform: 'capitalize', color: GOLD, marginTop: 10 }}>
                {sec.sub}
              </div>
              <h3 style={{ fontFamily: sans, fontWeight: 400, fontSize: isMobile ? STACK.titlePxMobile : STACK.titlePx, margin: '10px 0 0', color: '#fff', lineHeight: 1.15 }}>
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

function Footer({ isMobile, footerRef, onProjects, onAbout, pageVisible }) {
  const inView = useInView(footerRef);
  const active = pageVisible && inView;
  const year = new Date().getFullYear();

  const up = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.8, delay, ease: outSoft },
  });

  const head = { fontFamily: sans, color: GOLD, fontSize: 15, letterSpacing: '0.22em', textTransform: 'capitalize', margin: '0 0 16px', fontWeight: 400 };
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
            <div style={{ fontFamily: sans, letterSpacing: '0.18em', fontSize: 17, marginTop: 14 }}>Property Gallery</div>
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

        <GoldLine active={active} />

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
            <motion.span animate={active ? { y: [0, -3, 0] } : { y: 0 }} transition={active ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : { duration: 0 }}>↑</motion.span>
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
    category: 'high-rise',
    title: 'Experion Emerelle Reserve',
    subtitle: 'Experion Developers · Sector 88A, Gurgaon',
    price: '₹3.50 Cr Onwards',
    specs: '3, 3.5 & 4 BHK Luxury Apartments',
    desc: 'Premium high-rise living with world-class architecture, expansive green landscapes, and elite connectivity in Sector 88A Gurgaon.',
    image: EXP_IMG,
    tag: 'Ready To Move',
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
    category: 'villas',
    title: 'Alibaug Estates',
    subtitle: 'Resort Living · Alibaug, Maharashtra',
    price: '₹5.20 Cr Onwards',
    specs: 'Luxury Villas & Convention Centre',
    desc: 'A sprawling convention centre spread across 1,50,000 sq. ft. equipped with exotic resort-style pools, sunken bars, and themed spas.',
    image: ALI_IMG,
    tag: 'Ready To Move',
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
    category: 'high-rise',
    title: 'Delhi Skyline',
    subtitle: 'Metropolitan · Central Delhi NCR',
    price: '₹4.80 Cr Onwards',
    specs: 'Penthouses & High-Rise Apartments',
    desc: 'High-rise architectural masterpieces featuring striking geometric design, elite urban convenience, and panoramic views in the capital.',
    image: DEL_IMG,
    tag: 'Rera Approved',
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
    category: 'high-rise',
    title: 'DLF Luxury Apartments',
    subtitle: 'DLF Limited · Andheri West, Mumbai',
    price: '₹2.90 Cr Onwards',
    specs: '3 & 4 BHK (1,126 - 2,534 Sq. Ft.)',
    desc: 'Sprawling luxury residences featuring exclusive clubhouses with swimming pools, gymnasiums, and 80% dedicated open green spaces.',
    image: MUM_IMG,
    tag: 'Under Construction',
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
  {
    id: 'smart-world-sky-arc',
    category: 'high-rise',
    title: 'Smart World Sky Arc',
    subtitle: 'Smart World · Sector 69, Gurugram',
    price: 'Price on request',
    specs: '3, 3.5 & 4.5 BHK · 2,355–3,270 sq. ft.',
    desc: 'Luxury apartments in Sector 69, Gurugram, with a clubhouse, rooftop jogging track, and infinity pool.',
    image: '/Smart_world_sky.png',
    tag: 'Under Construction',
    sections: [
      {
        title: 'Smart World Sky Arc',
        sub: 'Sector 69, Gurugram · Luxury Apartments',
        text: 'Explore 3, 3.5 and 4.5 BHK residences near Golf Course Extension Road.',
        image: '/Smart_world_sky.png',
      },
    ],
  },
];

const PROJECT_SLIDE_DURATION = 4000;

function ProjectCoverFlow({ onSelectCategory }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStart = useRef(null);
  const stageRef = useRef(null);
  const stageVisible = useInView(stageRef);
  const [entranceComplete, setEntranceComplete] = useState(false);
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ['start 1', 'start 0.55'],
  });
  const staggerRaw = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const stagger = useSpring(staggerRaw, { stiffness: 120, damping: 25, mass: 0.4 });
  const count = PROJECT_CATEGORIES.length;

  useEffect(() => {
    const updateEntrance = (progress) => setEntranceComplete(progress >= 1);
    updateEntrance(scrollYProgress.get());
    return scrollYProgress.on('change', updateEntrance);
  }, [scrollYProgress]);

  useEffect(() => {
    if (!stageVisible || !entranceComplete) return;
    const timer = window.setTimeout(() => {
      setActiveIndex((index) => (index + 1) % count);
    }, PROJECT_SLIDE_DURATION);

    return () => window.clearTimeout(timer);
  }, [activeIndex, count, entranceComplete, stageVisible]);

  const step = (direction) => {
    setActiveIndex((index) => (index + direction + count) % count);
  };

  return (
    <div className="pg-cover" aria-label="Property categories carousel" onKeyDown={(event) => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        step(event.key === 'ArrowLeft' ? -1 : 1);
      }
    }}>
      <style>{`
        .pg-cover { width: 100%; margin: auto; }
        .pg-cover-stage {
          --pg-card-gap: clamp(5px, 1.3vw, 20px);
          --pg-arrow-rail: clamp(44px, 5vw, 72px);
          --pg-card-space: calc(100% - 2 * var(--pg-arrow-rail) - 2 * var(--pg-card-gap));
          --pg-card-width: calc(var(--pg-card-space) / 3);
          --pg-stagger-step: clamp(12px, 2.4vw, 36px);
          --pg-card-height: clamp(215px, 42vw, 720px);
          height: calc(var(--pg-card-height) * var(--pg-center-scale));
          --pg-center-scale: 1.03;
          position: relative;
          overflow: hidden;
          touch-action: pan-y;
        }
        .pg-cover-card {
          position: absolute;
          top: calc(var(--pg-card-top, 0px) + var(--pg-row) * var(--pg-stagger) * var(--pg-stagger-step));
          left: 50%;
          width: var(--pg-card-width);
          height: var(--pg-card-height);
          border-radius: 12px;
          color: #fff0cc;
          text-align: left;
          opacity: 0;
          transform: translateX(-50%);
          transition: left 520ms cubic-bezier(.22,.75,.24,1), opacity 260ms ease;
          pointer-events: none;
          --pg-row: 0;
        }
        .pg-cover-card-surface {
          position: relative;
          height: 100%;
          overflow: hidden;
          border-radius: inherit;
          background: #191714;
        }
        .pg-cover-card[data-position="0"] { --pg-row: 1; }
        .pg-cover-card[data-position="-1"] { left: calc(var(--pg-arrow-rail) + var(--pg-card-width) / 2); }
        .pg-cover-card[data-position="1"] { left: calc(100% - var(--pg-arrow-rail) - var(--pg-card-width) / 2); --pg-row: 2; }
        .pg-cover-card[data-position="2"] { left: 130%; --pg-row: 2; }
        .pg-cover-card[data-position="3"] { left: -30%; }
        .pg-cover-card[data-position="-1"], .pg-cover-card[data-position="0"], .pg-cover-card[data-position="1"] {
          opacity: 1;
          pointer-events: auto;
        }
        .pg-cover-card img { display: block; width: 100%; height: 100%; object-fit: cover; }

        .pg-cover-caption {
          position: absolute;
          inset: auto 0 0;
          padding: 100px 18px 16px;
          isolation: isolate;
          background: linear-gradient(transparent, rgba(0,0,0,.55) 85%);
        }
        .pg-cover-caption::before,
        .pg-cover-caption::after {
          content: '';
          position: absolute;
          inset: 0;
          z-index: -1;
          pointer-events: none;
        }
        /* halka blur: upar se shuru */
        .pg-cover-caption::before {
          -webkit-backdrop-filter: blur(5px);
          backdrop-filter: blur(5px);
          -webkit-mask-image: linear-gradient(to bottom, transparent 0%, #000 55%);
          mask-image: linear-gradient(to bottom, transparent 0%, #000 55%);
        }
        /* gehra blur: sirf niche ke hisse me */
        .pg-cover-caption::after {
          -webkit-backdrop-filter: blur(16px);
          backdrop-filter: blur(16px);
          -webkit-mask-image: linear-gradient(to bottom, transparent 40%, #000 90%);
          mask-image: linear-gradient(to bottom, transparent 40%, #000 90%);
        }

        .pg-cover-caption h3 { font: 700 clamp(16px, 2.7vw, 34px)/1.1 Arial, sans-serif; margin: 0 0 6px; }
        .pg-cover-caption span { font: 500 clamp(11px, 1.1vw, 14px)/1.3 Arial, sans-serif; }
        .pg-cover-tag { position: absolute; top: 12px; left: 12px; padding: 5px 9px; background: #fff0cc; color: #111; border-radius: 20px; font: 700 10px/1.2 Arial, sans-serif; text-transform: capitalize; }
        .pg-cover-side { position: absolute; inset: 0; border: 0; background: transparent; cursor: pointer; }
        .pg-cover-side:focus-visible { outline: 2px solid #fff0cc; outline-offset: -4px; }
        .pg-cover-arrow {
          position: absolute;
          z-index: 5;
          top: calc(var(--pg-card-height) / 2);
          transform: translateY(-50%);
          display: grid;
          place-items: center;
          width: 44px;
          height: 44px;
          padding: 0;
          border: 1px solid #fff0cc80;
          border-radius: 50%;
          background: #0b0a08dd;
          color: #fff0cc;
          cursor: pointer;
          transition: background-color 180ms ease, color 180ms ease;
        }
        .pg-cover-arrow::before {
          content: '';
          width: 10px;
          height: 10px;
          border-top: 2px solid currentColor;
          border-right: 2px solid currentColor;
        }
        .pg-cover-arrow--prev::before { transform: translateX(2px) rotate(-135deg); }
        .pg-cover-arrow--next::before { transform: translateX(-2px) rotate(45deg); }
        .pg-cover-arrow--prev { left: calc((var(--pg-arrow-rail) - 44px) / 2); }
        .pg-cover-arrow--next { right: calc((var(--pg-arrow-rail) - 44px) / 2); }
        .pg-cover-arrow:hover, .pg-cover-arrow:focus-visible { background: #fff0cc; color: #111; }
        @media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
          .pg-cover-stage { --pg-side-shrink: .90; }

          .pg-cover-card-surface { transition: scale 350ms ease, filter 350ms ease; transform-origin: top center; }
          .pg-cover-card img { transition: scale 350ms ease; transform-origin: top center; }

          .pg-cover-card[data-position="0"]:hover .pg-cover-card-surface { scale: 1.03; }

          /* container peeche jaye */
          .pg-cover-stage:has(.pg-cover-card[data-position="0"]:hover)
            .pg-cover-card:is([data-position="-1"], [data-position="1"]) .pg-cover-card-surface {
            scale: var(--pg-side-shrink);
            filter: brightness(.90);
          }

          /* image apni jagah fixed rahe (counter-scale) */
          .pg-cover-stage:has(.pg-cover-card[data-position="0"]:hover)
            .pg-cover-card:is([data-position="-1"], [data-position="1"]) img {
            scale: calc(1 / var(--pg-side-shrink));
          }
        }
        /* MOBILE / TOUCH: side cards hamesha peeche, image fixed */
        @media (hover: none), (pointer: coarse) {
          .pg-cover-stage { --pg-side-shrink: .86; }

          .pg-cover-card-surface { transition: scale 350ms ease, filter 350ms ease; transform-origin: top center; }
          .pg-cover-card img { transition: scale 350ms ease; transform-origin: top center; }

          .pg-cover-card:is([data-position="-1"], [data-position="1"]) .pg-cover-card-surface {
            scale: var(--pg-side-shrink);
            filter: brightness(.85);
          }
          .pg-cover-card:is([data-position="-1"], [data-position="1"]) img {
            scale: calc(1 / var(--pg-side-shrink));
          }

          /* center card thoda aage */
          .pg-cover-card[data-position="0"] .pg-cover-card-surface { scale: 1.03; }
        }
        @media (max-width: 700px) {
          .pg-cover-card { border-radius: 8px; }
          .pg-cover-caption { padding: 60px 7px 8px; }
          .pg-cover-caption h3 { font-size: clamp(12px, 2.7vw, 18px); overflow-wrap: anywhere; }
          .pg-cover-card .pg-cover-caption span, .pg-cover-card .pg-cover-tag,
          .pg-cover-card:not([data-position="0"]) .pg-cover-caption { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .pg-cover-card { top: var(--pg-card-top, 0px); transition: none; }
        }
        /* Side cards: andar wala kinara fixed rahe, gap same rahe */
        .pg-cover-card[data-position="-1"] .pg-cover-card-surface,
        .pg-cover-card[data-position="-1"] img { transform-origin: right top; }

        .pg-cover-card[data-position="1"] .pg-cover-card-surface,
        .pg-cover-card[data-position="1"] img { transform-origin: left top; }

        /* Center card 1.03 se badhta hai, uski jagah side cards ko thoda bahar shift karo */
        @media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
          .pg-cover-stage:has(.pg-cover-card[data-position="0"]:hover)
            .pg-cover-card[data-position="-1"] .pg-cover-card-surface {
            translate: calc(var(--pg-card-width) * -0.015) 0;
          }
          .pg-cover-stage:has(.pg-cover-card[data-position="0"]:hover)
            .pg-cover-card[data-position="1"] .pg-cover-card-surface {
            translate: calc(var(--pg-card-width) * 0.015) 0;
          }
        }
        @media (hover: none), (pointer: coarse) {
          .pg-cover-card[data-position="-1"] .pg-cover-card-surface { translate: calc(var(--pg-card-width) * -0.015) 0; }
          .pg-cover-card[data-position="1"] .pg-cover-card-surface { translate: calc(var(--pg-card-width) * 0.015) 0; }
        }
        @media (max-width: 700px) {
          .pg-cover-stage {
            --pg-card-width: calc(46vw - 6px);
            --pg-side-shrink: .52;
            --pg-center-scale: 1;
            --pg-card-height: clamp(225px, 59vw, 320px);
          }
          .pg-cover-arrow { display: none; }
          .pg-cover-card:is([data-position="-1"], [data-position="1"]) { --pg-card-top: 12%; }
          .pg-cover-card:is([data-position="-1"], [data-position="1"]) .pg-cover-card-surface {
            scale: var(--pg-side-shrink);
            filter: brightness(.85);
          }
          .pg-cover-card:is([data-position="-1"], [data-position="1"]) img,
          .pg-cover-stage:has(.pg-cover-card[data-position="0"]:hover)
            .pg-cover-card:is([data-position="-1"], [data-position="1"]) img { scale: 1; }
          .pg-cover-card[data-position="-1"] {
            left: calc(50% - var(--pg-card-width) - var(--pg-card-gap));
          }
          .pg-cover-card[data-position="1"] {
            left: calc(50% + var(--pg-card-width) + var(--pg-card-gap));
          }
          .pg-cover-card[data-position="0"] .pg-cover-card-surface,
          .pg-cover-card[data-position="0"]:hover .pg-cover-card-surface { scale: 1; }
        }
      `}</style>

      <motion.div ref={stageRef} className="pg-cover-stage" style={{ '--pg-stagger': stagger }}
        onTouchStart={(event) => {
          const { clientX, clientY } = event.changedTouches[0];
          touchStart.current = { clientX, clientY };
        }}
        onTouchCancel={() => { touchStart.current = null; }}
        onTouchEnd={(event) => {
          const start = touchStart.current;
          touchStart.current = null;
          if (!start) return;
          const { clientX, clientY } = event.changedTouches[0];
          const horizontal = clientX - start.clientX;
          const vertical = clientY - start.clientY;
          if (Math.abs(horizontal) > 45 && Math.abs(horizontal) > Math.abs(vertical)) {
            if (event.cancelable) event.preventDefault();
            step(horizontal < 0 ? 1 : -1);
          }
        }}
      >
        {PROJECT_CATEGORIES.map((category, index) => {
          const offset = (index - activeIndex + count) % count;
          const position = offset === count - 1 ? -1 : offset;
          const isSide = Math.abs(position) === 1;
          return (
            <article className="pg-cover-card" key={category.id} data-position={position} aria-hidden={position > 1}>
              <div className="pg-cover-card-surface">
                {category.image && (
                  <img src={category.image} data-original-src={category.fallback ?? category.image}
                    onError={tryNextShowcasePhoto} alt="" loading="lazy" decoding="async" draggable={false} />
                )}
                <div className="pg-cover-caption">
                  <h3>{category.title}</h3>
                  <span>Browse properties →</span>
                </div>
                {(isSide || position === 0) && (
                  <button
                    className="pg-cover-side"
                    type="button"
                    aria-label={`Browse ${category.title} properties`}
                    onClick={() => onSelectCategory(category.id)}
                  />
                )}
              </div>
            </article>
          );
        })}
        <button type="button" className="pg-cover-arrow pg-cover-arrow--prev"
          aria-label="Previous category" onClick={() => step(-1)} />
        <button type="button" className="pg-cover-arrow pg-cover-arrow--next"
          aria-label="Next category" onClick={() => step(1)} />
      </motion.div>

    </div>
  );
}

const PROJECT_PHOTO_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'JPG', 'JPEG', 'PNG', 'WEBP'];

function tryNextProjectPhoto(event) {
  const image = event.currentTarget;
  const path = image.getAttribute('src');
  const dot = path.lastIndexOf('.');
  const currentExtension = path.slice(dot + 1);
  const nextExtension = PROJECT_PHOTO_EXTENSIONS[PROJECT_PHOTO_EXTENSIONS.indexOf(currentExtension) + 1];
  if (nextExtension) image.src = `${path.slice(0, dot)}.${nextExtension}`;
}

const ADDITIONAL_PROPERTIES = [
  {
    id: 'central-park-delphine',
    category: 'high-rise',
    photos: ['centralpark', 'centralpark1', 'centralpark2'],
    title: 'Central Park Delphine',
    subtitle: 'Central Park · Sector 104, Dwarka Expressway',
    tag: 'Ready To Move',
    specs: '4,242–4,281 sq. ft.',
    desc: 'Luxury apartments by Central Park in Sector 104, Gurugram, along Dwarka Expressway.',
  },
  {
    id: 'dlf-the-camellias',
    category: 'high-rise',
    photos: ['Dlfcamellias', 'Dlfcamellias1', 'Dlfcamellias2'],
    title: 'DLF The Camellias',
    subtitle: 'DLF · Golf Course Road, Gurugram',
    tag: 'Ready To Move',
    specs: '7,000–16,000 sq. ft.',
    desc: 'Luxury apartments by DLF on Golf Course Road in Gurugram.',
  },
  {
    id: 'unity-the-amaryllis-versace',
    category: 'high-rise',
    photos: ['Amaryllis_versace', 'Amaryllis_versace1', 'Amaryllis_versace2'],
    title: 'Unity The Amaryllis Versace',
    subtitle: 'Unity Group · Karol Bagh, New Delhi',
    tag: 'Ready To Move',
    specs: '5,800–7,171 sq. ft.',
    desc: 'Luxury apartments by Unity Group in Karol Bagh, New Delhi, with interiors designed in collaboration with Versace Home.',
  },
  {
    id: 'elan-the-emperor',
    category: 'high-rise',
    photos: ['Elan_emperor', 'elan_emperor1', 'elan_emperor2'],
    title: 'Elan The Emperor',
    subtitle: 'Elan · Sector 106, Dwarka Expressway',
    tag: 'Under Construction',
    specs: '4,223–10,347 sq. ft.',
    desc: 'Luxury apartments by Elan in Sector 106, Gurugram, along Dwarka Expressway.',
  },
].map(({ photos, ...property }) => {
  const images = photos.map((name) => `${import.meta.env.BASE_URL}Project/${name}.${PROJECT_PHOTO_EXTENSIONS[0]}`);
  const sections = [
    { title: 'Property Overview', sub: property.tag, text: `Luxury apartments · ${property.specs}` },
    { title: 'Property Gallery', sub: property.title, text: property.subtitle },
    { title: 'Gallery', sub: property.title, text: property.desc },
  ];

  return {
    ...property,
    image: images[0],
    sections: sections.map((section, index) => ({
      ...section,
      image: images[index],
      onImageError: tryNextProjectPhoto,
    })),
  };
});

function FeaturedProjects({ isMobile, onSelectCategory, style }) {
  const headingId = useId();
  return (
    <section id="featured-projects" aria-labelledby={headingId} style={{ ...style, scrollMarginTop: 68 }}>
      <h2 id={headingId} style={{
        fontFamily: sans, fontSize: isMobile ? 32 : 52, textAlign: 'center',
        fontWeight: 400, margin: '0 0 clamp(16px, 3vh, 28px)',
      }}>
        Our Segments
      </h2>
      <ProjectCoverFlow onSelectCategory={onSelectCategory} />
    </section>
  );
}

const SHOWCASE_IMAGE_NAMES = {
  experion: 'Experionn',
  alibaug: 'Aalibuagg',
  delhi: 'Delhi',
  dlf: 'DLff',
};

const SHOWCASE_PROJECTS = PROJECTS.slice(0, 4).map((project) => ({
  ...project,
  showcaseImage: `${import.meta.env.BASE_URL}showcase/${SHOWCASE_IMAGE_NAMES[project.id]}.${PROJECT_PHOTO_EXTENSIONS[0]}`,
}));

function tryNextShowcasePhoto(event) {
  const image = event.currentTarget;
  const original = image.dataset.originalSrc;
  const current = image.getAttribute('src');
  if (current === original) return;
  tryNextProjectPhoto(event);
  if (image.getAttribute('src') === current) image.src = original;
}
const SHOWCASE_ROTATION_MS = 2500;

function RollingNavLabel({ children }) {
  return (
    <span className="pg-nav-roll-label">
      <span className="pg-nav-roll-name">{children}</span>
      <span className="pg-nav-roll-visual" aria-hidden="true">
        {Array.from(children, (letter, index) => (
          <span className="pg-nav-roll-slot" key={index}>
            <span className="pg-nav-roll-track" style={{ '--pg-letter-delay': `${index * 16}ms` }}>
              <span>{letter}</span>
              <span>{letter}</span>
            </span>
          </span>
        ))}
      </span>
    </span>
  );
}

const TITLE_LETTER_ROLL = {
  enter: { y: '105%' },
  active: (index) => ({
    y: '0%',
    transition: { duration: .90 , delay: Math.min(index * .017, .24), ease: [.22, .85, .28, 1] },
  }),
  leave: (index) => ({
    y: '-105%',
    transition: { duration: .87 , delay: Math.min(index * .012, .18), ease: [.22, .85, .28, 1] },
  }),
};

function RollingShowcaseTitle({ title }) {
  let letterIndex = 0;
  return (
    <span aria-hidden="true">
      {title.split(/(\s+)/).map((part, partIndex) => (
        /^\s+$/.test(part) ? part : (
          <span key={partIndex} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
            {Array.from(part, (letter, index) => (
              <span key={index} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}>
                <motion.span variants={TITLE_LETTER_ROLL} custom={letterIndex++} style={{ display: 'inline-block' }}>
                  {letter}
                </motion.span>
              </span>
            ))}
          </span>
        )
      ))}
    </span>
  );
}

function AboutTitle({ isMobile, enabled, showFounder, setShowFounder }) {
  
  const titleRef = useRef(null);
  const inView = useInView(titleRef, { amount: 0.65 });
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!enabled || !inView) {
      setShowFounder(false);
      return;
    }

    const timer = window.setInterval(() => {
      setShowFounder((current) => !current);
    }, 4000);

    return () => window.clearInterval(timer);
  }, [enabled, inView, setShowFounder]);

  const titles = ['PROPERTY\nGALLERY', 'HARPREET SINGH\nGHULATI'];
  const paragraphs = [ABOUT.propertyText, ABOUT.founderText];
  const index = Number(showFounder);
  const rollProps = {
    initial: reducedMotion ? false : 'enter',
    animate: reducedMotion ? undefined : 'active',
    exit: reducedMotion ? undefined : 'leave',
  };

  return (
    <div ref={titleRef} style={{ containerType: 'inline-size' }}>
      <div style={{
        fontFamily: sans,
        fontSize: NAV_FONT,
        fontWeight: 500,
        margin: '0 0 10px 8px',
      }}>
        About
      </div>

      <h2 aria-label={titles[index].replace('\n', ' ')} style={{
        display: 'grid',
        overflow: 'hidden',
        margin: 0,
        fontFamily: 'Arial, sans-serif',
        fontWeight: 700,
        fontSize: isMobile
          ? 'clamp(16px, 8cqw, 34px)'
          : 'clamp(16px, 9cqw, 56px)',
        lineHeight: 1.05,
        letterSpacing: '-.025em',
        minHeight: '2.1em',
      }}>
        {titles.map((text) => (
          <span key={text} aria-hidden="true" style={{ gridArea: '1 / 1', visibility: 'hidden', whiteSpace: 'pre-line' }}>
            {reducedMotion ? text : <RollingShowcaseTitle title={text} />}
          </span>
        ))}
        <AnimatePresence initial={false}>
          <motion.span key={titles[index]} {...rollProps} aria-hidden="true"
            style={{ gridArea: '1 / 1', whiteSpace: 'pre-line' }}>
            {reducedMotion ? titles[index] : <RollingShowcaseTitle title={titles[index]} />}
          </motion.span>
        </AnimatePresence>
      </h2>
      <p style={{
        display: 'grid', margin: isMobile ? '8px 0 0' : `${ABOUT.textGapTop} 0 0`,
        maxWidth: ABOUT.textMaxWidth, fontSize: isMobile ? 'clamp(14px, 4vw, 17px)' : ABOUT.textSize,
        fontWeight: 400, lineHeight: isMobile ? 1.4 : 1.75, color: 'rgba(20,22,28,.82)',
      }}>
        <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clipPath: 'inset(50%)' }}>
          {paragraphs[index]}
        </span>
        {paragraphs.map((text) => (
          <span key={text} aria-hidden="true" style={{ gridArea: '1 / 1', visibility: 'hidden', whiteSpace: 'pre-line' }}>
            {text}
          </span>
        ))}
        <AnimatePresence initial={false}>
          <motion.span key={paragraphs[index]} aria-hidden="true"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.3 }}
            style={{ gridArea: '1 / 1', whiteSpace: 'pre-line' }}>
            {paragraphs[index]}
          </motion.span>
        </AnimatePresence>
      </p>
    </div>
  );
}

function SocialScrollScreen({ progress, enabled, slideY }) {
  const [interactive, setInteractive] = useState(false);
  const opacity = useTransform(progress, [0, .16], [0, 1]);
  useEffect(() => {
    const update = (value) => setInteractive(enabled && value >= .16 && value <= .72);
    update(progress.get());
    return progress.on('change', update);
  }, [enabled, progress]);

  return (
    <motion.section aria-label="Connect with Property Gallery" aria-hidden={!interactive}
      style={{
        position: 'absolute', inset: 0, zIndex: 45, opacity, y: slideY, background: BG, color: CREAM,
        display: 'grid', placeContent: 'center', justifyItems: 'center', gap: 22,
        padding: '68px 6vw 24px', pointerEvents: interactive ? 'auto' : 'none',
      }}>
      <h2 style={{ fontFamily: sans, fontWeight: 500, fontSize: 'clamp(25px, 5vw, 46px)', margin: 0 }}>
        Connect with us
      </h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'clamp(10px, 2vw, 20px)' }}>
        {CONTACTS.map(({ icon, name, href }) => (
          <a key={icon} href={href} aria-label={name} title={name} tabIndex={interactive ? 0 : -1}
            {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            style={{
              display: 'grid', placeItems: 'center', width: 'clamp(42px, 9vw, 68px)', aspectRatio: '1',
              borderRadius: 14, background: 'rgba(251,239,202,.08)', border: '1px solid rgba(251,239,202,.24)',
            }}>
            <img src={ICON_IMG[icon]} alt="" style={{ display: 'block', width: '55%', height: '55%', objectFit: 'contain' }} />
          </a>
        ))}
      </div>
    </motion.section>
  );
}

function ProjectShowcaseReveal({ reveal, onExplore, isMobile, enabled, slideY }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [interactive, setInteractive] = useState(false);
  const [cardInset, setCardInset] = useState('inset(24% 31% 24% 53% round 12px)');
  const showcaseRef = useRef(null);
  const visible = useInView(showcaseRef, { amount: .4 });
  const reducedMotion = useReducedMotion();
  const projects = SHOWCASE_PROJECTS;
  const currentIndex = activeIndex % projects.length;
  const project = projects[currentIndex];
  const cards = projects.slice(currentIndex + 1).concat(projects.slice(0, currentIndex));
  const animated = !reducedMotion;
  const projectCount = projects.length;
  const ease = [.22, .85, .28, 1];

  const selectProject = useCallback((index) => {
    if (!isMobile && animated) {
      const stage = showcaseRef.current;
      const card = stage?.querySelector(`[data-showcase-index="${index}"]`);
      if (card) {
        const frame = stage.getBoundingClientRect();
        const bounds = card.getBoundingClientRect();
        if (frame.width && frame.height) {
          const top = 100 * (bounds.top - frame.top) / frame.height;
          const right = 100 * (frame.right - bounds.right) / frame.width;
          const bottom = 100 * (frame.bottom - bounds.bottom) / frame.height;
          const left = 100 * (bounds.left - frame.left) / frame.width;
          setCardInset(`inset(${top}% ${right}% ${bottom}% ${left}% round 8px)`);
        }
      }
    }
    setActiveIndex(index);
  }, [animated, isMobile]);

  useEffect(() => {
    if (!animated || !enabled || !visible || !interactive) return undefined;
    const timer = window.setTimeout(() => {
      selectProject((currentIndex + 1) % projectCount);
    }, SHOWCASE_ROTATION_MS);
    return () => window.clearTimeout(timer);
  }, [currentIndex, animated, enabled, visible, interactive, projectCount, selectProject]);
  const opacity = useTransform(reveal, [0, 1], [0, 1]);


  useEffect(() => {
    const update = (value) => setInteractive(value >= .95);
    update(reveal.get());
    return reveal.on('change', update);
  }, [reveal]);

  const projectTitle = (item, rolling = false) => {
    const words = item.title.trim().toLowerCase().split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1));
    const title = words.join(['delhi', 'alibaug', 'dlf'].includes(item.id) ? '\n' : ' ');
    return (
      <h2 aria-label={rolling ? item.title : undefined} style={{
        fontFamily: sans,
        fontSize: statementFontSize(isMobile),
        fontWeight: 400,
        lineHeight: 1.12,
        letterSpacing: '-0.025em',
        textTransform: 'none', margin: '0 0 14px', textWrap: 'balance', whiteSpace: 'pre-line',
      }}>
        {rolling ? <RollingShowcaseTitle title={title} /> : title}
      </h2>
    );
  };
  const projectSubtitle = (item) => (
    <p style={{ fontFamily: sans, fontSize: isMobile ? 13 : 16, color: GOLD, margin: isMobile ? '0 0 8px' : '0 0 20px' }}>{item.subtitle}</p>
  );

  return (
    <motion.section ref={showcaseRef}
      aria-label="Project showcase" aria-hidden={!interactive}
      style={{
        position: 'absolute', inset: 0, zIndex: 50, overflow: 'hidden',
        opacity: slideY ? 1 : opacity, y: slideY,
        background: BG, color: CREAM, pointerEvents: interactive ? 'auto' : 'none',
        display: 'flex', flexDirection: 'column', justifyContent: isMobile ? 'flex-end' : 'center',
        padding: isMobile ? `${MOBILE_HEADER_HEIGHT + 16}px 6vw 5svh` : '108px 6vw 6vh',
      }}
    >
      <AnimatePresence initial={false}>
        <motion.img key={project.id} src={project.showcaseImage} data-original-src={project.image}
          onError={tryNextShowcasePhoto} alt="" decoding="async"
          initial={animated
            ? {
              opacity: isMobile ? .55 : 1, scale: isMobile ? 1.12 : 1,
              clipPath: isMobile ? 'inset(24% 31% 24% 53% round 12px)' : cardInset,
            }
            : { opacity: 0 }}
          animate={{ opacity: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0% round 0px)' }}
          exit={{ opacity: animated ? .99 : 0 }}
          transition={{ duration: reducedMotion ? 0 : .8, ease }}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
            transformOrigin: '62% 50%' }}
        />
      </AnimatePresence>
      <div style={{
        position: 'absolute', inset: 0,
        background: isMobile
          ? 'linear-gradient(180deg, rgba(0,0,0,.12) 15%, rgba(0,0,0,.83) 72%, #080808 100%)'
          : 'linear-gradient(90deg, rgba(0,0,0,.79), rgba(0,0,0,.35) 50%, rgba(0,0,0,.12)), linear-gradient(0deg, rgba(0,0,0,.44), transparent 58%)',
      }} />
      <div style={{
        position: 'relative', display: 'grid', alignItems: 'center',
        gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1fr) minmax(0, 1.05fr)',
        gap: isMobile ? 18 : '5vw',
      }}>
        <div>
          {isMobile ? (
            <AnimatePresence initial={false} mode={animated ? 'wait' : 'sync'}>
              <motion.div key={project.id}
                initial={animated ? { opacity: 0, y: 22 } : false}
                animate={{ opacity: 1, y: 0 }}
                exit={animated ? { opacity: 0, y: -14, transition: { duration: .16 } } : undefined}
                transition={{ duration: animated ? .36 : 0, ease }}>
                {projectTitle(project)}
                {projectSubtitle(project)}
                <p style={{ fontFamily: sans, fontSize: 13, lineHeight: 1.45, color: CREAM, margin: '0 0 12px' }}>
                  {project.desc}
                </p>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div>
              <div style={{ position: 'relative', display: 'grid', overflow: 'hidden' }}>
                {projects.map((item) => (
                  <div key={item.id} aria-hidden="true"
                    style={{ gridArea: '1 / 1', minWidth: 0, visibility: 'hidden' }}>
                    {projectTitle(item)}
                  </div>
                ))}
                <AnimatePresence initial={false}>
                  <motion.div key={project.id}
                    initial={animated ? 'enter' : false}
                    animate={animated ? 'active' : undefined}
                    exit={animated ? 'leave' : undefined}
                    style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                    {projectTitle(project, animated)}
                  </motion.div>
                </AnimatePresence>
              </div>
              <div style={{ display: 'grid' }}>
                {projects.map((item) => (
                  <motion.div key={item.id} aria-hidden={item.id !== project.id}
                    initial={false} animate={{ opacity: item.id === project.id ? 1 : 0 }}
                    transition={{ duration: animated ? .28 : 0, ease }}
                    style={{ gridArea: '1 / 1', minWidth: 0 }}>
                    {projectSubtitle(item)}
                    <p style={{
                      fontFamily: sans, fontWeight: 400, fontSize: 'clamp(14px, 1.25vw, 18px)',
                      lineHeight: 1.5, maxWidth: '44ch', color: CREAM, margin: '0 0 20px',
                    }}>
                      {item.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
          <button type="button" tabIndex={interactive ? 0 : -1} onClick={onExplore}
            style={{ border: 0, borderRadius: 6, padding: '10px 14px', background: CREAM, color: BG, fontWeight: 700 }}>
            Explore Projects
          </button>
        </div>
        <div style={isMobile ? undefined : { marginRight: '-6vw', overflow: 'hidden' }}>
          <div style={{
            position: 'relative', display: 'grid', alignItems: 'center',
            gridTemplateColumns: isMobile ? 'repeat(3, minmax(0, 1fr))' : 'repeat(3, minmax(0, 41%))',
            gap: isMobile ? 8 : 14,
          }}>
            <AnimatePresence initial={false} mode={animated ? 'popLayout' : 'sync'}>
              {cards.map((item, slot) => (
                <motion.button key={item.id} type="button" tabIndex={interactive ? 0 : -1}
                  layout={animated ? 'position' : false}
                  initial={animated ? { opacity: 0, x: isMobile ? 44 : '100%', scale: isMobile ? .94 : 1 } : false}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={animated ? (isMobile
                    ? { opacity: 0, x: -26, scale: 1.06 }
                    : { opacity: 0, pointerEvents: 'none', transition: { duration: .24 } }) : undefined}
                  transition={{ duration: animated ? (isMobile ? .55 : .65) : 0, ease }}
                  aria-label={`Show ${item.title}`}
                  data-showcase-index={projects.indexOf(item)}
                  onClick={() => selectProject(projects.indexOf(item))}
                  style={{
                    position: 'relative', padding: 0, overflow: 'hidden', borderRadius: 8, background: BG, cursor: 'pointer',
                    border: '2px solid rgba(255,255,255,.3)',
                  }}>
                  <img src={item.showcaseImage} data-original-src={item.image}
                    onError={tryNextShowcasePhoto} alt="" loading="lazy" decoding="async"
                    style={{ display: 'block', width: '100%',
                      height: isMobile ? 'clamp(64px, 23vw, 120px)' : slot === 0
                        ? 'clamp(230px, 49svh, 480px)' : 'clamp(195px, 41svh, 405px)',
                      objectFit: 'cover', transition: animated && !isMobile ? 'height 650ms cubic-bezier(.22,.85,.28,1)' : undefined,
                    }} />
                  <span style={{
                    position: 'absolute', inset: 'auto 0 0', display: 'block', textAlign: 'left',
                    padding: isMobile ? '16px 5px 5px' : '38px 12px 14px', color: CREAM, pointerEvents: 'none',
                    background: 'linear-gradient(transparent, rgba(0,0,0,.87) 70%)',
                  }}>
                    <span style={{
                      display: 'block', color: GOLD, font: isMobile ? '700 8px/1.15 Arial, sans-serif' : '700 10px/1.3 Arial, sans-serif',
                      letterSpacing: isMobile ? '0' : '.08em', textTransform: 'capitalize', marginBottom: isMobile ? 2 : 5,
                      whiteSpace: isMobile ? 'nowrap' : undefined, overflow: isMobile ? 'hidden' : undefined,
                      textOverflow: isMobile ? 'ellipsis' : undefined,
                    }}>
                      {item.subtitle.split(' · ')[0]}
                    </span>
                    <span style={{ display: 'block', font: isMobile ? '700 10px/1.12 Arial, sans-serif' : '700 clamp(13px, 1.25vw, 20px)/1.14 Arial, sans-serif' }}>
                      {item.title}
                    </span>
                  </span>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

const PROJECT_CATEGORIES = [
  { id: 'builder-floor', title: 'Builder Floor', image: SHOWCASE_PROJECTS[0].showcaseImage, fallback: EXP_IMG },
  { id: 'high-rise', title: 'High Rise', image: MUM_IMG },
  { id: 'plots', title: 'Plots', image: `${import.meta.env.BASE_URL}featured/Plots.jpg` },
  { id: 'villas', title: 'Villas', image: SHOWCASE_PROJECTS[1].showcaseImage, fallback: ALI_IMG },
  { id: 'farm-house', title: 'Farm House', image: `${import.meta.env.BASE_URL}featured/farm-house.jpg` },
  { id: 'commercial', title: 'Commercial', image: `${import.meta.env.BASE_URL}featured/commercial.jpg` },
];

const DUBAI_PROPERTIES = [
  {
    id: 'dubai-mercedes-vision-iconic',
    category: 'high-rise',
    title: 'Vision Iconic at Mercedes-Benz Places',
    subtitle: 'Binghatti · Meydan, Dubai',
    tag: 'Under Construction',
    image: `${import.meta.env.BASE_URL}Project/Dubai-Mercedes.png`,
    specs: '1–5 bedroom residences',
    referencePrice: 'Reference 1-bedroom price: AED 2,092,500–2,307,000',
    budgetPriceInLakh: 528,
    desc: 'Branded residences at Mercedes-Benz Places | Binghatti City in Meydan.',
  },
  {
    id: 'dubai-bugatti-residences',
    category: 'high-rise',
    title: 'Bugatti Residences by Binghatti',
    subtitle: 'Business Bay, Dubai',
    tag: 'Under Construction',
    image: `${import.meta.env.BASE_URL}Project/dubai-buggati.png`,
    specs: '2 bedrooms · 4 bathrooms · 3,674 sq. ft.',
    referencePrice: 'Reference 2-bedroom listing: AED 14,250,888',
    budgetPriceInLakh: 3595.5,
    desc: 'A two-bedroom residence at Bugatti Residences in Business Bay.',
  },
].map((property) => ({
  ...property,
  sections: [{
    title: property.title,
    sub: property.specs,
    text: property.referencePrice,
    image: property.image,
  }],
}));

const PROJECT_CATALOG = [...PROJECTS, ...ADDITIONAL_PROPERTIES, ...DUBAI_PROPERTIES];

// Budget bands use lakh as the unit, with the upper bound excluded.
const PROPERTY_BUDGETS = [
  { label: 'Under ₹50L', min: 0, max: 50 },
  { label: '₹50L–₹1Cr', min: 50, max: 100 },
  { label: '₹1Cr–₹3Cr', min: 100, max: 300 },
  { label: '₹3Cr–₹5Cr', min: 300, max: 500 },
  { label: '₹5Cr+', min: 500, max: Infinity },
];

function propertyPriceInLakh(price) {
  const match = price?.match(/^₹?\s*([\d,]+(?:\.\d+)?)\s*(cr|lakh|l)\b/i);
  if (!match) return NaN;
  const amount = Number(match[1].replaceAll(',', ''));
  return match[2].toLowerCase() === 'cr' ? amount * 100 : amount;
}

function AllProjectsView({ isMobile, onOpen }) {
  const reveal = useMotionValue(1);
  const listingsRef = useRef(null);
  const filterId = useId();
  const reducedMotion = useReducedMotion();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [propertyType, setPropertyType] = useState('');
  const [status, setStatus] = useState('');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');
  const selectedBudget = PROPERTY_BUDGETS.find(({ label }) => label === budget);
  const activeFilterCount = [propertyType, status, location, budget].filter(Boolean).length;
  const statuses = [...new Set(PROJECT_CATALOG.map(({ tag }) => tag))];
  const properties = PROJECT_CATALOG.filter((property) => {
    const price = property.budgetPriceInLakh ?? propertyPriceInLakh(property.price);
    const propertyLocation = DUBAI_PROPERTIES.includes(property) ? 'Dubai' : 'India';
    return (!location || propertyLocation === location)
      && (!propertyType || property.category === propertyType)
      && (!status || property.tag === status)
      && (!selectedBudget || (price >= selectedBudget.min && price < selectedBudget.max));
  });
  return (
    <main style={{
      position: 'relative', zIndex: 10, background: BG, color: CREAM,
      minHeight: V(100), paddingBottom: isMobile ? 64 : 96,
    }}>
      <style>{`
        .pg-filters-glass {
          display: flex; align-items: center; flex-wrap: wrap; gap: 6px;
          padding: 5px; border-radius: 16px;
          border: 1px solid rgba(251,239,202,.20);
          background: linear-gradient(125deg, rgba(251,239,202,.12), rgba(183,155,116,.045));
          backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.08), 0 8px 22px rgba(0,0,0,.28);
        }
        .pg-filters-glass select, .pg-filters-toggle, .pg-filters-reset {
          color: inherit; color-scheme: dark; font: inherit; font-size: 13px;
          min-height: 36px; cursor: pointer;
        }
        .pg-filters-glass select {
          border: 1px solid transparent; border-radius: 10px;
          background: rgba(255,255,255,.06); padding: 5px 9px;
        }
        .pg-budget-filter {
          display: inline-flex; align-items: center; gap: 6px; padding-left: 10px;
          border: 1px solid rgba(251,239,202,.28); border-radius: 10px;
          background: rgba(251,239,202,.08); white-space: nowrap;
          color: #fbefca; font-size: 13px;
        }
        .pg-budget-filter select { background: transparent; }
        .pg-filters-glass option { background: #211f1b; color: #fbefca; }
        .pg-filters-toggle {
          display: inline-flex; align-items: center; gap: 8px; align-self: flex-start;
          padding: 0 14px; min-height: 48px; border-radius: 16px;
          border: 1px solid rgba(251,239,202,.28); background: rgba(251,239,202,.08);
          backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
        }
        .pg-filters-toggle[aria-expanded="true"], .pg-filters-toggle:hover,
        .pg-filters-glass select:hover { background: rgba(251,239,202,.16); }
        .pg-filters-reset { border: 0; background: transparent; padding: 0 8px; text-decoration: underline; }
        .pg-filters-glass :focus-visible, .pg-filters-toggle:focus-visible { outline: 2px solid #fbefca; outline-offset: 2px; }
        @media (max-width: 480px) {
          .pg-filters-toggle { min-height: 44px; }
          .pg-filters-glass { border-radius: 12px; }
        }
      `}</style>
      <div style={{ position: 'relative', height: '100svh' }}>
        <ProjectShowcaseReveal
          reveal={reveal}
          isMobile={isMobile}
          enabled
          onExplore={() => listingsRef.current?.scrollIntoView({ behavior: 'smooth' })}
        />
      </div>

      <section ref={listingsRef} aria-labelledby="properties-heading" style={{
        scrollMarginTop: 96, maxWidth: 1760, margin: '64px auto 0', padding: isMobile ? '0 4vw' : '0 2vw',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
          <h2 id="properties-heading" style={{
            fontFamily: sans, fontSize: isMobile ? 'clamp(23px, 6.4vw, 30px)' : 42, fontWeight: 400, margin: 0,
          }}>
            More Properties
          </h2>
          <div style={{ marginLeft: 'auto', display: 'flex', justifyContent: 'flex-end', flexWrap: 'wrap', gap: 8, maxWidth: '100%' }}>
            <div id={filterId} hidden={!filtersOpen}>
              {filtersOpen && (
                <motion.div
                  initial={reducedMotion ? false : { clipPath: 'inset(0 0 0 100%)' }}
                  animate={{ clipPath: 'inset(0 0 0 0%)' }}
                  transition={{ duration: reducedMotion ? 0 : .24, ease: 'easeOut' }}
                  className="pg-filters-glass"
                >
                  <select aria-label="Property type" value={propertyType} onChange={(event) => setPropertyType(event.target.value)}>
                    <option value="">All property types</option>
                    {PROJECT_CATEGORIES.map(({ id, title }) => <option key={id} value={id}>{title}</option>)}
                  </select>
                  <select aria-label="Property status" value={status} onChange={(event) => setStatus(event.target.value)}>
                    <option value="">All statuses</option>
                    {statuses.map((tag) => <option key={tag} value={tag}>{tag}</option>)}
                  </select>
                  <select aria-label="Location" value={location} onChange={(event) => setLocation(event.target.value)}>
                    <option value="">All locations</option>
                    <option value="India">India</option>
                    <option value="Dubai">Dubai</option>
                  </select>
                  <label className="pg-budget-filter">
                    <span>Budget</span>
                    <select value={budget} onChange={(event) => setBudget(event.target.value)}>
                      <option value="">Any budget</option>
                      {PROPERTY_BUDGETS.map(({ label }) => <option key={label} value={label}>{label}</option>)}
                    </select>
                  </label>
                  {activeFilterCount > 0 && (
                    <button type="button" onClick={() => { setPropertyType(''); setStatus(''); setLocation(''); setBudget(''); }}
                      className="pg-filters-reset">
                      Reset
                    </button>
                  )}
                </motion.div>
              )}
            </div>
            <button type="button" aria-expanded={filtersOpen} aria-controls={filterId} onClick={() => setFiltersOpen(!filtersOpen)}
              className="pg-filters-toggle">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                <path d="M4 7h5m4 0h7M4 17h9m4 0h3" />
                <circle cx="11" cy="7" r="2" />
                <circle cx="15" cy="17" r="2" />
              </svg>
              {filtersOpen ? 'Close filters' : `Filters${activeFilterCount ? ' (' + activeFilterCount + ')' : ''}`}
            </button>
          </div>
        </div>
        {properties.length === 0 && <p role="status">No properties match these filters.</p>}
        {properties.length > 0 && (
          <div style={{
            display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, minmax(0, 1fr))' : 'repeat(4, minmax(0, 1fr))',
            gap: isMobile ? 12 : 20,
          }}>
            {properties.map((property) => (
              <button key={property.id} type="button" onClick={(event) => {
                const cover = event.currentTarget.querySelector('img');
                onOpen(property, cover?.naturalWidth ? cover.getAttribute('src') : null);
              }}
                aria-label={`View details for ${property.title}`}
                style={{
                  position: 'relative', display: 'block', textAlign: 'left', color: CREAM,
                  background: '#151410', border: '1px solid rgba(244,211,94,.23)', borderRadius: 12,
                  height: isMobile ? 'clamp(225px, 59vw, 320px)' : 'clamp(300px, 32vw, 480px)',
                  padding: 0, overflow: 'hidden', cursor: 'pointer',
                }}>
                <img src={property.image} onError={tryNextProjectPhoto} alt="" loading="lazy" decoding="async"
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                <span style={{
                  position: 'absolute', inset: 'auto 0 0', background: 'linear-gradient(transparent, rgba(0,0,0,.94))',
                  display: 'block', padding: isMobile ? '56px 10px 12px' : '96px 16px 18px',
                }}>
                  <span style={{
                    display: 'block', fontWeight: 700, fontSize: isMobile ? 17 : 'clamp(20px, 2.25vw, 32px)',
                    lineHeight: 1.1, overflowWrap: 'anywhere',
                  }}>
                    {property.title}
                  </span>
                </span>
              </button>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function ProjectsView({ isMobile, onOpen, categoryId, onBackToCategories }) {
  const category = PROJECT_CATEGORIES.find(({ id }) => id === categoryId);
  if (!category) return <AllProjectsView isMobile={isMobile} onOpen={onOpen} />;
  const properties = PROJECT_CATALOG.filter((property) => property.category === category.id);

  return (
    <main style={{
      position: 'relative', zIndex: 10, background: BG, color: CREAM,
      minHeight: V(100), padding: isMobile ? '100px 0 64px' : '140px 0 96px',
    }}>
      <section aria-labelledby="properties-heading" style={{ maxWidth: 1520, margin: 'auto', padding: '0 6vw' }}>
        {category && <button type="button" onClick={onBackToCategories}
          style={{ background: 'transparent', color: CREAM, border: '1px solid currentColor', borderRadius: 6, padding: '8px 12px', cursor: 'pointer' }}>
          ← Back to Categories
        </button>}
        <h1 id="properties-heading"
          style={{ fontFamily: sans, fontSize: isMobile ? 32 : 52, fontWeight: 400, margin: '0 0 24px' }}>
          {category?.title ?? 'All Projects'}
        </h1>
        {category && properties.length === 0 && <p>No properties listed in this category yet.</p>}
        <div style={{
          display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, minmax(0, 1fr))' : 'repeat(4, minmax(0, 1fr))',
          gap: isMobile ? 12 : 20,
        }}>
          {properties.map((property) => (
            <button key={property.id} type="button" onClick={(event) => {
              const cover = event.currentTarget.querySelector('img');
              onOpen(property, cover?.naturalWidth ? cover.getAttribute('src') : null);
            }}
              aria-label={`View details for ${property.title}`}
              style={{
                position: 'relative', display: 'block', textAlign: 'left', color: CREAM,
                background: '#151410', border: '1px solid rgba(244,211,94,.23)', borderRadius: 12,
                height: isMobile ? 'clamp(225px, 59vw, 320px)' : 'clamp(300px, 32vw, 480px)',
                padding: 0, overflow: 'hidden', cursor: 'pointer',
              }}>
              <img src={property.image} onError={tryNextProjectPhoto} alt="" loading="lazy" decoding="async"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              <span style={{ position: 'absolute', background: '#fff0cc', color: '#111', borderRadius: 20, padding: '5px 9px', fontWeight: 700, top: isMobile ? 8 : 12, left: isMobile ? 8 : 12, fontSize: isMobile ? 8 : 10 }}>
                {property.tag}
              </span>
              <span style={{
                position: 'absolute', inset: 'auto 0 0', background: 'linear-gradient(transparent, rgba(0,0,0,.92))',
                display: 'block', padding: isMobile ? '56px 10px 12px' : '96px 16px 18px',
              }}>
                <span style={{
                  display: 'block', fontWeight: 700, fontSize: isMobile ? 17 : 'clamp(20px, 2.25vw, 32px)',
                  lineHeight: 1.1, overflowWrap: 'anywhere', marginBottom: 6,
                }}>
                  {property.title}
                </span>
                <span style={{ display: 'block', fontSize: isMobile ? 11 : 13 }}>{property.subtitle}</span>
              </span>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

export default function App() {
  const [showFounder, setShowFounder] = useState(false);
  const isMobile = useIsMobile();
  const pageVisible = usePageVisible();
  const [stage, setStage] = useState(0);
  const [ready, setReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [projectCategory, setProjectCategory] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [phoneScreenImage, setPhoneScreenImage] = useState(DEFAULT_PHONE_SCREEN_IMAGE);
  const landingActive = pageVisible && !projectsOpen;

  const stmtRef = useRef(null);
  const phoneScrollRef = useRef(null);
  const footerRef = useRef(null);
  const heroVideoRef = useRef(null);
  const propRef = useRef(null);
  const galRef = useRef(null);
  const [startPos, setStartPos] = useState(null);

  const fs = isMobile ? FONT_VW_MOBILE : FONT_VW;
  const startLeft = startPos
    ? startPos.left
    : isMobile ? 50 - 4.572 * FONT_VW_MOBILE : START_LEFT;
  const startRight = startPos
    ? startPos.right
    : isMobile ? startLeft + 5.104 * FONT_VW_MOBILE : START_RIGHT;
  const edge = isMobile ? 5 : 3.8;
  const topEnd = isMobile ? '5%' : '4%';
  const pill = isMobile ? PILL_M : PILL_D;
  const mid = isMobile ? MID_M : MID_D;

  const turnVh = isMobile ? 0 : TURN_VH;
  const stmtVh = STMT_VH + turnVh;
  const stmtA = STMT_BASE_VH / (stmtVh - 100);

  useEffect(() => {
    const restoreView = (state) => {
      const view = state?.propertyGallery;
      const project = PROJECT_CATALOG.find(({ id }) => id === view?.projectId)
        ?? null;
      setProjectsOpen(Boolean(view?.projectsOpen));
      setSelectedProject(project);
      setProjectCategory(view?.categoryId ?? null);
      if (view?.phoneImage) setPhoneScreenImage(view.phoneImage);
    };
    const onPopState = (event) => restoreView(event.state);
    restoreView(window.history.state);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigateProjectView = (showProjects, project = null, phoneImage, categoryId = showProjects && project ? projectCategory : null) => {
    const { history } = window;
    const current = history.state?.propertyGallery;
    const projectId = project?.id ?? null;
    if (Boolean(current?.projectsOpen) !== showProjects || (current?.projectId ?? null) !== projectId || (current?.categoryId ?? null) !== categoryId) {
      history.pushState({
        ...history.state,
        propertyGallery: {
          projectsOpen: showProjects,
          projectId,
          categoryId,
          fromProjects: showProjects && Boolean(project) && projectsOpen && !selectedProject,
          phoneImage: phoneImage || current?.phoneImage,
        },
      }, '');
    }
    setProjectsOpen(showProjects);
    setProjectCategory(categoryId);
    setSelectedProject(project);
    if (phoneImage) setPhoneScreenImage(phoneImage);
  };

  const openProjectCategory = (categoryId) => {
    navigateProjectView(true, null, undefined, categoryId);
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'auto' }));
  };
  const goFeaturedProjects = () => {
    navigateProjectView(false);
    requestAnimationFrame(() => document.getElementById('featured-projects')?.scrollIntoView());
  };
  const goProjects = () => {
    navigateProjectView(true);
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'auto' }));
  };
  const backToProjects = () => {
    if (window.history.state?.propertyGallery?.fromProjects) {
      window.history.back();
      return;
    }
    goProjects();
  };
  const openProject = (project, phoneImage = project.image) => {
    navigateProjectView(true, project, phoneImage);
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'auto' }));
  };
  const goFooter = () => footerRef.current?.scrollIntoView({ behavior: 'smooth' });
  const goAbout = () => {
    navigateProjectView(false);
    setTimeout(() => {
      const el = stmtRef.current;
      if (!el) return;
      const stageH = el.children[1]?.offsetHeight || window.innerHeight;
      const animationHeight = phoneScrollRef.current?.offsetHeight ?? el.offsetHeight;
      const top = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top + (animationHeight - stageH) * stmtA * 0.9, behavior: 'smooth' });
    }, 80);
  };

  const { scrollYProgress: enterRaw } = useScroll({ target: stmtRef, offset: ['start end', 'start start'] });
  const ep = useSpring(enterRaw, SPRING);
  const introScale = useTransform(ep, [0, 1], [1, 0.92]);
  const introY = useTransform(ep, [0, 1], ['0%', '-6%']);
  const introDim = useTransform(ep, [0, 1], [0, 0.65]);
  const logoOpacity = useTransform(ep, [0.55, 0.95], [0, 1]);
  const logoY = useTransform(ep, [0.55, 0.95], [-12, 0]);

  const { scrollYProgress: stmtRaw } = useScroll({ target: phoneScrollRef, offset: ['start start', 'end end'] });
  const stmtOld = useTransform(stmtRaw, [0, stmtA], [0, 1]);
  const sp = useSpring(stmtOld, SPRING);

  // Preserve the About entrance and divide the remaining scroll into the phone phases.
  const phoneProgress = useTransform(stmtRaw, [stmtA, 1], [0, 1]);
  const settle = useTransform(stmtRaw, [stmtA * 0.7, stmtA], [0, 1], { ease: smoothStep });
  // One eased value keeps desktop translation, rotation, and scale in lockstep in both directions.
  const desktopMotion = useTransform(phoneProgress, [0, DESKTOP_PHONE_END], [0, 1], { ease: smoothStep });
  const desktopLandscapeGrowth = useTransform(phoneProgress, [0.88, 1], [0, 1], { ease: smoothStep });
  const desktopFullscreen = useTransform(phoneProgress, [0.88, 0.96], [0, 1], { ease: smoothStep });
  const socialScrollRef = useRef(null);
  const { scrollYProgress: socialProgress } = useScroll({ target: socialScrollRef, offset: ['start start', 'end start'] });
  const homeShowcase = useTransform(socialProgress, [.72, .94], [0, 1]);
  const socialSlideY = useTransform(homeShowcase, [0, 1], ['0%', '-100%']);
  const projectsSlideY = useTransform(homeShowcase, [0, 1], ['100%', '0%']);
  const mobileZoomRaw = useTransform(stmtRaw, [stmtA, MOBILE_ZOOM_END], [0, isMobile ? 1 : 0]);
  const mobileZoom = useSpring(mobileZoomRaw, MOBILE_ZOOM_SPRING);
  const mobileCenter = useTransform(mobileZoom, (z) => smoothStep(Math.max(0, Math.min(1, z))));
  const mobileSettle = useTransform(mobileZoom, [0, 0.25], [0, 1]);
  const mobileAboutFade = useTransform(mobileZoom, [0, 0.25], [1, 0]);
  const mobileAboutShift = useTransform(mobileZoom, [0, 0.35], [0, -50]);
  const aboutFade = useTransform(desktopMotion, [0, 0.65], [1, 0]);
  const aboutCtaOpacity = isMobile ? mobileAboutFade : aboutFade;
  const aboutCtaVisibility = useTransform(aboutCtaOpacity, (opacity) => opacity > .4 ? 'visible' : 'hidden');
  const aboutShift = useTransform(desktopMotion, [0, 0.8], [0, -50]);


  const panelY = useTransform(sp, [0.36, 0.62], ['100%', '0%']);
  const headerExit = useTransform(phoneProgress, [0, .16], [0, 1], { ease: smoothStep });
  const headerReturn = useTransform(socialProgress, [.12, .28], [0, 1], { ease: smoothStep });
  const headerLogoY = useTransform([logoY, headerExit, headerReturn],
    ([introY, exit, enter]) => introY - 26 * exit * (1 - enter));
  const headerLogoOpacity = useTransform([logoOpacity, headerExit, headerReturn],
    ([introOpacity, exit, enter]) => introOpacity * (1 - exit * (1 - enter)));
  const phoneNavVisibility = useTransform(headerLogoOpacity,
    (opacity) => opacity > .01 ? 'visible' : 'hidden');
  const lightHeader = useTransform(
    [panelY, socialProgress],
    ([offset, social]) => parseFloat(offset) <= 2 && social < .12,
  );
  const headerText = useTransform(lightHeader, (light) => light ? '#000' : '#fff');
  const headerLogo = useTransform(lightHeader, (light) => light ? 'brightness(0)' : 'drop-shadow(0 1px 3px rgba(0,0,0,.45))');
  const headerMenuTint = useTransform(lightHeader, (light) => light ? 'rgba(0,0,0,.06)' : 'rgba(40,42,48,.55)');
  const radH = useTransform(sp, [0.36, 0.5, 0.62], [50, 6, 0]);
  const radV = useTransform(sp, [0.36, 0.5, 0.62], [70, 8, 0]);
  const panelRadius = useMotionTemplate`${radH}% ${radV}%`;
  const mobileRadH = useTransform(sp, [0.36, 0.5, 0.62], [50, 24, 0]);
  const mobileRadV = useTransform(sp, [0.36, 0.5, 0.62], [30, 11, 0]);
  // Tie the cap depth to the viewport width so tall screens keep a broad arc.
  const mobilePanelRadius = useMotionTemplate`${mobileRadH}% ${mobileRadV}vw`;
  const stmtOpacity = useTransform(sp, [0.36, 0.62], [1, 0.25]);
  const stmtScale = useTransform(sp, [0.36, 0.62], [1, 0.94]);

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
    loadIPhoneModel().then((module) => module.preloadIPhoneModel?.()).catch(() => {});
  }, []);

  useEffect(() => {
    const img = new Image();
    img.src = HERO_IMG;
    const imgP = img.decode ? img.decode() : Promise.resolve();
    let cancelled = false;
    let timer;
    const timeout = new Promise((resolve) => { timer = setTimeout(resolve, 1500); });
    Promise.race([imgP.catch(() => {}), timeout]).then(() => {
      clearTimeout(timer);
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
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
    if (!v || !ready || !landingActive) return undefined;
    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute('playsinline', '');
    const tryPlay = () => {
      if (enterRaw.get() < 1) v.play().catch(() => {});
    };
    let wasVisible;
    const update = (progress) => {
      const visible = progress < 1;
      if (visible === wasVisible) return;
      wasVisible = visible;
      if (visible) tryPlay();
      else v.pause();
    };
    update(enterRaw.get());
    const unsubscribe = enterRaw.on('change', update);
    window.addEventListener('touchstart', tryPlay, { once: true, passive: true });
    return () => {
      unsubscribe();
      v.pause();
      window.removeEventListener('touchstart', tryPlay);
    };
  }, [ready, landingActive, enterRaw]);

  useEffect(() => {
    if (!ready) return;
    const t1 = setTimeout(() => setStage(1), 1800);
    const t2 = setTimeout(() => setStage(2), 3200);
    const t3 = setTimeout(() => setUnlocked(true), (3.2 + UNLOCK_AFTER) * 1000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [ready]);

  useEffect(() => {
    if (unlocked || projectsOpen) return;
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
  }, [unlocked, projectsOpen]);

  useEffect(() => {
    if (projectsOpen) return undefined;
    const id = requestAnimationFrame(() => window.dispatchEvent(new Event('resize')));
    return () => cancelAnimationFrame(id);
  }, [projectsOpen]);

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
    fontSize: 18,
    fontWeight: 500,
    padding: '9px 16px',
    borderRadius: 4,
    cursor: 'pointer',
    position: 'relative',
    top: '12px',
  };

  const wordBase = {
    position: 'absolute',
    margin: 0,
    fontFamily: sans,
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
      <style>{`
        @font-face {
          font-family: "Lay Grotesk";
          src: url("${aboutFontPath}.otf") format("opentype"),
               url("${aboutFontPath}.ttf") format("truetype"),
               url("${aboutFontPath}.woff2") format("woff2"),
               url("${aboutFontPath}.woff") format("woff");
          font-weight: 400;
          font-style: normal;
          font-display: swap;
        }
        :root, body, #root { font-family: ${sans}; }
        button, input, select, textarea { font-family: inherit; }
        .pg-nav-roll-label { position: relative; display: inline-block; line-height: inherit; }
        .pg-nav-roll-name { display: block; opacity: 0; }
        .pg-nav-roll-visual { position: absolute; inset: 0; display: flex; overflow: hidden; }
        .pg-nav-roll-slot { display: block; height: 100%; }
        .pg-nav-roll-track { display: block; height: 100%; transform: translateY(0); transition: transform .54s cubic-bezier(.22,.85,.28,1) var(--pg-letter-delay); }
        .pg-nav-roll-track > span { display: block; height: 100%; }
        .pg-nav-roll:is(:hover, :focus-visible) .pg-nav-roll-track { transform: translateY(-100%); }
        @media (prefers-reduced-motion: reduce) {
          .pg-nav-roll-track { transition: none; }
          .pg-nav-roll:is(:hover, :focus-visible) .pg-nav-roll-track { transform: none; }
        }
      `}</style>
      <header
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          height: isMobile ? MOBILE_HEADER_HEIGHT : 'clamp(76px, 10vh, 108px)',
          padding: '0 3.8vw',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          pointerEvents: 'none',
        }}
      >
        <motion.div
          style={{
            opacity: projectsOpen ? 1 : headerLogoOpacity, y: projectsOpen ? 0 : headerLogoY,
            display: 'flex', alignItems: 'center', pointerEvents: 'auto', cursor: 'pointer',
            position: 'relative', top: isMobile ? menuBtn.top : undefined,
          }}
          onClick={() => {
            navigateProjectView(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <motion.img
            src={LOGO}
            alt="Property Gallery"
            style={{
              height: isMobile ? 42 : 'clamp(52px, 4.8vw, 80px)', width: 'auto', display: 'block',
              objectFit: 'contain', filter: projectsOpen ? 'drop-shadow(0 1px 3px rgba(0,0,0,.45))' : headerLogo,
            }}
          />
        </motion.div>

        <motion.nav
          style={{
            opacity: projectsOpen ? 1 : headerLogoOpacity,
            y: projectsOpen ? 0 : headerLogoY,
            display: 'flex', alignItems: 'center', gap: isMobile ? 12 : NAV_GAP,
            fontFamily: sans, fontSize: isMobile ? 13 : NAV_FONT, fontWeight: 500,
            color: projectsOpen ? '#fff' : headerText, pointerEvents: 'auto',
            visibility: projectsOpen ? 'visible' : phoneNavVisibility,
            background: isMobile ? 'transparent' : 'rgba(118, 108, 77, .22)',
            backdropFilter: isMobile ? undefined : 'blur(8px)',
            WebkitBackdropFilter: isMobile ? undefined : 'blur(8px)',
            padding: isMobile ? 0 : '4px 5px 4px 14px',
            borderRadius: 10,
          }}
        >
          {isMobile ? (
            <motion.button className="pg-nav-roll" type="button" onClick={() => setMenuOpen(true)} aria-label="Open menu" style={{ ...menuBtn, background: projectsOpen ? menuBtn.background : headerMenuTint, color: projectsOpen ? menuBtn.color : headerText }}>
              <RollingNavLabel>Menu</RollingNavLabel>
            </motion.button>
          ) : (
            <>
              <button className="pg-nav-roll" type="button" onClick={goProjects} aria-current={projectsOpen ? 'page' : undefined}
                style={{ background: 'none', border: 0, color: 'inherit', font: 'inherit', cursor: 'pointer', padding: '12px 0' }}>
                <RollingNavLabel>Projects</RollingNavLabel>
              </button>
              <button className="pg-nav-roll" type="button" onClick={goAbout}
                style={{ background: 'none', border: 0, color: 'inherit', font: 'inherit', cursor: 'pointer', padding: '12px 0' }}>
                <RollingNavLabel>About</RollingNavLabel>
              </button>
              <button className="pg-nav-roll" type="button"
                onClick={goFooter}
                style={{ background: CREAM, border: 0, font: 'inherit', color: '#000', padding: '12px 25px', lineHeight: '20px', borderRadius: 6, fontWeight: 500, cursor: 'pointer' }}
              >
                <RollingNavLabel>Contact</RollingNavLabel>
              </button>
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
              onClick={backToProjects}
              style={{
                background: 'rgba(0,0,0,0)', border: `1px solid ${GOLD_DARK}`, color: GOLD,
                padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontFamily: sans, fontWeight: 600,
                marginBottom: '4vh', display: 'flex', alignItems: 'center', gap: 8,
              }}
            >
              ← Back to Projects
            </button>

            <div style={{ textAlign: 'center', marginBottom: '6vh' }}>
              <span style={{ fontFamily: sans, fontSize: 12, letterSpacing: '0.25em', textTransform: 'capitalize', color: GOLD }}>
                {selectedProject.subtitle}
              </span>
              <h1 style={{ fontFamily: sans, fontWeight: 400, fontSize: isMobile ? 32 : 52, margin: '10px 0 0', color: '#fff' }}>
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

      {projectsOpen && !selectedProject && <ProjectsView isMobile={isMobile} onOpen={openProject} categoryId={projectCategory} onBackToCategories={goFeaturedProjects} />}

      <div style={{ display: projectsOpen ? 'none' : 'block' }}>
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

        <section ref={stmtRef} style={{ position: 'relative', zIndex: 1, height: V(stmtVh + SOCIAL_SCROLL_VH + SHOWCASE_HOLD_VH), background: BG }}>
          <div ref={phoneScrollRef} aria-hidden="true" style={{
            position: 'absolute', top: 0, left: 0, width: 0, height: V(stmtVh), pointerEvents: 'none',
          }} />
          <div ref={socialScrollRef} aria-hidden="true" style={{
            position: 'absolute', top: V(stmtVh - 100), left: 0, width: 0,
            height: V(SOCIAL_SCROLL_VH), pointerEvents: 'none',
          }} />
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
                  fontSize: statementFontSize(isMobile),
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
                position: 'absolute', inset: 0, zIndex: 40, y: panelY,
                borderTopLeftRadius: isMobile ? mobilePanelRadius : panelRadius,
                borderTopRightRadius: isMobile ? mobilePanelRadius : panelRadius,
                background: 'rgb(255, 255, 255)',
                borderTop: '1px solid rgba(0,0,0,.08)', overflow: 'hidden', color: INK, fontFamily: aboutFont,
              }}
            >
              <style>{`
                .pg-about-cta {
                  display: inline-flex; align-items: center; gap: 8px;
                  min-height: 44px; box-sizing: border-box; padding: 8px 14px;
                  background: #000000; color: #f8f8f8; border: 1px solid #b1a0a0; border-radius: 3px;
                  font: inherit; font-size: 18px; text-decoration: none; cursor: pointer;
                }
                .pg-about-cta:hover { border-color: #777; }
                .pg-about-cta:focus-visible { outline: 2px solid #15180c; outline-offset: 3px; }
              `}</style>
              {isMobile ? (
                <div
                  style={{
                    position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                    padding: `${MOBILE_HEADER_HEIGHT + 8}px 5vw ${V(2)}`,
                    justifyContent: 'space-between', gap: 12,
                  }}
                >
                  <motion.div style={{ position: 'relative', zIndex: 2, opacity: mobileAboutFade, x: mobileAboutShift }}>
                    <AboutTitle key={isMobile ? "mobile-about" : "desktop-about"} isMobile={isMobile} enabled={landingActive} showFounder={showFounder} setShowFounder={setShowFounder} />
                  </motion.div>
                  <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', gap: 8, paddingBottom: '2vh' }}>
                    <Phone small progress={sp} center={mobileCenter} expansion={mobileZoom} settle={mobileSettle} enabled={landingActive} image={phoneScreenImage} />
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
                    alignItems: 'center', gap: '2vw', padding: `${V(11)} 6vw ${V(4)} 7vw`,
                  }}
                >
                  <motion.div style={{ position: 'relative', zIndex: 2, minWidth: 0, minHeight: ABOUT.phoneHeight, opacity: aboutFade, x: aboutShift }}>
                    <AboutTitle key={isMobile ? "mobile-about" : "desktop-about"} isMobile={isMobile} enabled={landingActive} showFounder={showFounder} setShowFounder={setShowFounder} />
                  </motion.div>
                  <div style={{ justifySelf: 'center' }}>
                    <Phone progress={sp} center={desktopMotion} expansion={desktopMotion} landscapeGrowth={desktopLandscapeGrowth} fullscreen={desktopFullscreen} settle={settle} enabled={landingActive} image={phoneScreenImage} />
                  </div>
                </div>
              )}
              {landingActive && (
                <motion.div style={{
                  position: 'absolute', left: isMobile ? '5vw' : '7vw',
                  bottom: isMobile ? 'max(20px, env(safe-area-inset-bottom))' : '14vh',
                  zIndex: 5, opacity: aboutCtaOpacity, visibility: aboutCtaVisibility,
                }}>
                  {showFounder ? (
                    <a className="pg-about-cta pg-nav-roll" href={WA_URL} target="_blank" rel="noopener noreferrer">
                      <RollingNavLabel>Connect</RollingNavLabel> <span aria-hidden="true">↗</span>
                    </a>
                  ) : (
                    <button className="pg-about-cta pg-nav-roll" type="button" onClick={goProjects}>
                      <RollingNavLabel>Explore</RollingNavLabel> <span aria-hidden="true">↗</span>
                    </button>
                  )}
                </motion.div>
              )}
            </motion.div>

            <SocialScrollScreen progress={socialProgress} enabled={landingActive} slideY={socialSlideY} />
            <ProjectShowcaseReveal
              reveal={homeShowcase}
              slideY={projectsSlideY}
              isMobile={isMobile}
              enabled={landingActive}
              onExplore={goProjects}
            />

          </div>
        </section>

        {!projectsOpen && (
          <FeaturedProjects isMobile={isMobile} onSelectCategory={openProjectCategory} style={{
            position: 'relative', zIndex: 10, background: BG, color: CREAM,
            padding: isMobile ? '9vh 1vw 20px' : '12vh 1.5vw 28px',
          }} />
        )}

        <PropertyLocationMap isMobile={isMobile} enabled={landingActive} />
        {!projectsOpen && <DeveloperLogoSlider />}
      </div>

      <Footer isMobile={isMobile} footerRef={footerRef} onProjects={goProjects} onAbout={goAbout} pageVisible={pageVisible} />
    </>
  );
}
