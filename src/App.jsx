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
const ABOUT_TEXT =
  "Add your founder story here. Share why you started Property Gallery, what you believe about real estate, and how you help buyers find the right home. Keep it to a few short lines so it stays easy to read.";

const WA_URL = `https://wa.me/${WHATSAPP.replace(/[^0-9]/g, '')}`;

const CONTACTS = [
  { icon: 'ig', name: 'Instagram', label: INSTAGRAM, short: INSTAGRAM, href: `https://instagram.com/${INSTAGRAM}` },
  { icon: 'in', name: 'LinkedIn', label: LINKEDIN, short: 'LinkedIn', href: `https://${LINKEDIN}` },
  { icon: 'wa', name: 'WhatsApp', label: WHATSAPP, short: WHATSAPP, href: WA_URL },
  { icon: 'yt', name: 'YouTube', label: YOUTUBE, short: YOUTUBE, href: YOUTUBE_URL },
  { icon: 'em', name: 'Email', label: EMAIL, short: EMAIL, href: `mailto:${EMAIL}` },
];

const FOOTER_DISCLAIMER =
  'Images and project details are for illustration only and may change without notice. Please confirm availability and registration details with us before booking.';
const FOOTER_ADDRESS = 'M4/32, Mushedpur, DLF Phase 2, Sector 25, Gurugram, Shahpur, Haryana 122002';
const MAPS_URL = 'https://maps.app.goo.gl/LFTdNsrsJKLbcfP4A';

const inOut = [0.76, 0, 0.24, 1];
const outExpo = [0.16, 1, 0.3, 1];
const outSoft = [0.22, 1, 0.36, 1];
const SPRING = { stiffness: 220, damping: 34, mass: 0.25 };

const FADE_DELAY = 0.4;
const SPLIT_DUR = 0.8;
const VERT_DUR = 1.1;
const IMG_DELAY = 0.3;
const IMG_DUR = 2.0;
const IMG_ZOOM_DUR = 2.6;
const UNLOCK_AFTER = 3.6;

const FONT_VW = 7;
const FONT_VW_MOBILE = 9.4;
const START_LEFT = 18.1;
const START_RIGHT = 53.8;
const NAV_FONT = 17;
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

function StatusBar() {
  return (
    <div
      style={{
        position: 'absolute', top: '1.25em', left: 0, right: 0, padding: '0 9%',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        color: '#fff', fontFamily: sans, fontSize: '0.95em', fontWeight: 600,
        zIndex: 4, pointerEvents: 'none', textShadow: '0 0 6px rgba(0,0,0,.35)',
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
    </div>
  );
}

const PHONE_RADIUS = '17% / 7.9%';
const PHONE_TITANIUM = 'linear-gradient(145deg, #f6b378 0%, #d2692a 20%, #8f3f12 46%, #de7630 74%, #fbc08a 100%)';

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

function Phone({ small, progress }) {
  const [i, setI] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % 2), 3300);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const unsub = progress.on('change', (v) =>
      setShow((prev) => (v > PH_SHOW_ON ? true : v < PH_IN ? false : prev))
    );
    return unsub;
  }, [progress]);

  const deg = PHONE_TURN_DEG * (small ? 0.75 : 1);
  const rotY = useTransform(progress, [PH_IN, PH_OUT], [-deg, 0]);
  const rotX = useTransform(progress, [PH_IN, PH_OUT], [deg * 0.18, 0]);
  const turnScale = useTransform(progress, [PH_IN, PH_OUT], [0.93, 1]);

  const sideBtn = (side, top, height) => ({
    position: 'absolute', [side]: '-0.28em', top, height, width: '0.34em',
    borderRadius: '0.2em', background: PHONE_TITANIUM,
  });

  const height = small
    ? 'clamp(170px, calc(var(--vh) * 100 - 350px), 400px)'
    : `clamp(300px, ${V(70)}, 660px)`;

  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      style={{ position: 'relative', justifySelf: 'center' }}
    >
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

      <motion.div
        style={{
          position: 'relative', zIndex: 2, transformStyle: 'preserve-3d',
          transformPerspective: 1400, rotateY: rotY, rotateX: rotX, scale: turnScale,
        }}
      >
        <div
          style={{
            '--ph': height,
            position: 'relative',
            height: 'var(--ph)',
            aspectRatio: '9 / 19.3',
            fontSize: 'calc(var(--ph) * 0.0205)',
            transformStyle: 'preserve-3d',
          }}
        >
          <div
            style={{
              position: 'absolute', left: '10%', right: '-8%', bottom: '-3%', height: '7%',
              borderRadius: '50%', background: 'rgba(206, 212, 231, 0.45)', filter: 'blur(16px)', pointerEvents: 'none',
              transform: 'translateZ(-30px)',
            }}
          />

          {[1, 2, 3, 4, 5, 6].map((k) => (
            <div
              key={k}
              style={{
                position: 'absolute', inset: 0, borderRadius: PHONE_RADIUS,
                background: k % 2 ? '#7a3510' : '#9a4817',
                transform: `translateZ(${-k * 1.4}px)`,
              }}
            />
          ))}

          <div style={sideBtn('left', '13%', '3.2%')} />
          <div style={sideBtn('left', '19%', '6.5%')} />
          <div style={sideBtn('left', '27%', '6.5%')} />
          <div style={sideBtn('right', '22%', '10.5%')} />
          <div style={sideBtn('right', '60%', '7.5%')} />

          <div style={{ position: 'absolute', inset: 0, boxSizing: 'border-box', borderRadius: PHONE_RADIUS, background: PHONE_TITANIUM, padding: '0.5em' }}>
            <div style={{ width: '100%', height: '100%', boxSizing: 'border-box', borderRadius: '16.2% / 7.5%', background: '#000', padding: '0.3em', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.07)' }}>
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

                <StatusBar />

                <div style={{ position: 'absolute', top: '0.85em', left: '50%', transform: 'translateX(-50%)', width: '31%', height: '2.05em', background: '#000', borderRadius: 999, zIndex: 5 }} />
                <div style={{ position: 'absolute', bottom: '0.55em', left: '50%', transform: 'translateX(-50%)', width: '34%', height: '0.36em', borderRadius: 999, background: 'rgba(255,255,255,.85)', zIndex: 4, pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', inset: 0, zIndex: 6, pointerEvents: 'none', background: 'linear-gradient(118deg, rgba(255,255,255,.22) 0%, rgba(255,255,255,.08) 20%, rgba(255,255,255,0) 38%, rgba(255,255,255,0) 72%, rgba(255,255,255,.06) 100%)' }} />
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
            <div style={{ position: 'absolute', inset: 0, borderRadius: PHONE_RADIUS, pointerEvents: 'none', boxShadow: 'inset 0 0 0 0.07em rgba(255,255,255,.4), inset 0 0 0.5em rgba(255,255,255,.14), inset 0.2em 0.2em 0.5em rgba(255,255,255,.18)' }} />
          </div>
        </div>
      </motion.div>
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

/* ================= STACKED CARDS: SIZE CONTROLS =================
   Change these numbers to make things bigger / smaller. Nothing else needs editing. */
const STACK = {
  // overall layout (image card on the left, text on the right)
  maxWidth: 1200,         // px: total width of image + text area (desktop)
  imageWidthPct: 56,      // %: share of that width the image card takes (text gets the rest)
  textGap: 56,            // px: space between image card and text (desktop)
  textGapMobile: 22,      // px: space between image and text (mobile, text sits below)
  // image card
  heightVh: 72,           // % of screen height: image card height (desktop)
  heightVhMobile: 42,     // % of screen height: image card height (mobile)
  topVh: 13,              // % of screen height: gap above the card when it sticks (desktop)
  topVhMobile: 11,        // same, mobile
  radius: 28,             // px: corner roundness
  imageZoom: 1.2,         // image zoom inside the card (keep above 1.1 so tilted corners stay hidden)
  // text
  titlePx: 40,            // px: heading size (desktop)
  titlePxMobile: 24,
  bodyPx: 16,             // px: paragraph size (desktop)
  bodyPxMobile: 13.5,
  // stacking effect
  peekPx: 0,              // px: how much of each older card peeks above the next one (0 = none)
  shrink: 0.05,           // how much an older card shrinks per card stacked on top (0 = none)
  tiltDeg: 5,             // degrees an older card rotates per card stacked on top (0 = none)
};

/* ================= STACKED STICKY CARDS =================
   Images stack, shrink and tilt as you scroll.
   The text is NOT inside the cards: it lives in one fixed (sticky) block on the right
   that never moves. When the active image changes, the text just blurs out and the
   new text blurs in. */
function StackCard({ sec, i, n, progress, isMobile }) {
  const isLast = i === n - 1;
  const depth = n - 1 - i; // how many cards will cover this one
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
        zIndex: 5,
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
        {/* empty space where the image cards are */}
        <div
          style={{
            flex: isMobile ? '0 0 auto' : `0 0 ${STACK.imageWidthPct}%`,
            height: isMobile ? V(STACK.heightVhMobile) : undefined,
          }}
        />

        {/* fixed text: only blurs when the image changes */}
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
            <motion.a role="button" onClick={onAbout} whileHover={hover} style={linkStyle}>About the founder</motion.a>
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
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: isMobile ? 'center' : 'flex-start' }}>
              {CONTACTS.map((c) => (
                <motion.a
                  key={c.icon}
                  href={c.href}
                  {...(c.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  aria-label={c.name}
                  whileHover={{ y: -4, rotate: -6, scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    width: 46, height: 46, borderRadius: '50%', display: 'grid', placeItems: 'center',
                    border: `1.5px solid ${GOLD_DARK}`, background: 'rgba(244,211,94,.06)', boxShadow: '0 0 0 4px rgba(244,211,94,.05)',
                  }}
                >
                  <Icon name={c.icon} size={24} />
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
              background: 'rgba(244,211,94,.08)', color: GOLD, cursor: 'pointer', display: 'grid', placeItems: 'center', fontSize: 18,
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

/* ================= 3. MAIN APP & PROJECTS ================= */

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
        image: '/Experion 1.jpg',
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

  const fs = isMobile ? FONT_VW_MOBILE : FONT_VW;
  const startLeft = isMobile ? 50 - 4.572 * FONT_VW_MOBILE : START_LEFT;
  const startRight = isMobile ? startLeft + 5.104 * FONT_VW_MOBILE : START_RIGHT;
  const edge = isMobile ? 5 : 3.8;
  const topEnd = isMobile ? '10.5%' : '4%';
  const pill = isMobile ? PILL_M : PILL_D;
  const mid = isMobile ? MID_M : MID_D;

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
      window.scrollTo({ top: top + (el.offsetHeight - stageH) * 0.9, behavior: 'smooth' });
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
  const sp = useSpring(stmtRaw, SPRING);

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
    const fontP = document.fonts ? document.fonts.load('400 100px Marcellus') : Promise.resolve();
    const timeout = new Promise((r) => setTimeout(r, 4000));
    Promise.race([Promise.all([imgP, fontP]).catch(() => {}), timeout]).then(() => setReady(true));
    PROJECTS.forEach((p) => { const im = new Image(); im.src = p.image; });
  }, []);

  useEffect(() => {
    const v = heroVideoRef.current;
    if (v && stage >= 2) v.play().catch(() => {});
  }, [stage]);

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

  // The landing view stays mounted (just hidden) while a project is open, so the
  // scroll trackers keep their elements. When it comes back, ask them to re-measure.
  useEffect(() => {
    if (selectedProject) return undefined;
    const id = requestAnimationFrame(() => window.dispatchEvent(new Event('resize')));
    return () => cancelAnimationFrame(id);
  }, [selectedProject]);

  const wordBase = {
    position: 'absolute',
    margin: 0,
    fontFamily: serif,
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

  const link = {
    display: 'flex', alignItems: 'center', gap: 'clamp(10px, 1vw, 16px)',
    fontSize: 'clamp(14px, min(1.2vw, 2.4vh), 19px)', fontWeight: 600, color: INK,
    lineHeight: 1.25, minWidth: 0, wordBreak: 'break-word', textDecoration: 'none', cursor: 'pointer',
  };
  const iconSize = 'clamp(32px, min(2.6vw, 5vh), 44px)';

  return (
    <>
      {/* ============ HEADER ============ */}
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
          <span onClick={goProjects} style={{ cursor: 'pointer' }}>Projects</span>
          <span onClick={goAbout} style={{ cursor: 'pointer' }}>About</span>
          <span
            onClick={goFooter}
            style={{ background: CREAM, color: '#000', padding: isMobile ? '7px 12px' : '10px 20px', borderRadius: 6, fontWeight: 500, cursor: 'pointer' }}
          >
            Contact
          </span>
        </motion.nav>
      </header>

      {/* ============ PROJECT DETAIL VIEW (stacked sticky cards) ============ */}
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
                background: 'rgba(244,211,94,0.1)', border: `1px solid ${GOLD_DARK}`, color: GOLD,
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

      {/* ============ MAIN LANDING VIEW (kept mounted, hidden while a project is open) ============ */}
      <div style={{ display: selectedProject ? 'none' : 'block' }}>
        {/* ============ HERO INTRO ============ */}
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
                src={HERO_VIDEO}
                poster={HERO_IMG}
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

        {/* ============ STATEMENT + ABOUT ============ */}
        <section ref={stmtRef} style={{ position: 'relative', zIndex: 1, height: V(isMobile ? 230 : 240), background: BG }}>
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
                  <RevealWord progress={stmtRaw} range={range(0)} first>{STATEMENT_FIRST}</RevealWord>
                </div>
                <div style={{ textAlign: 'right', maxWidth: isMobile ? '100%' : '68vw', marginLeft: 'auto' }}>
                  {rest.map((w, i) => (
                    <RevealWord key={i} progress={stmtRaw} range={range(i + 1)}>{w}</RevealWord>
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
                    padding: `max(76px, ${V(11)}) 6vw ${V(3)}`,
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: 26, letterSpacing: '0.02em', lineHeight: 1 }}>ABOUT</div>
                  <div style={{ fontFamily: script, color: GOLD_DARK, fontSize: 40, lineHeight: 1.05, marginTop: '0.1em' }}>the founder</div>
                  <p
                    style={{
                      margin: '10px 0 0', fontSize: 12.5, fontWeight: 500, lineHeight: 1.7, color: 'rgba(20,22,28,.82)',
                      display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}
                  >
                    {ABOUT_TEXT}
                  </p>
                  <div style={{ display: 'flex', gap: 12, marginTop: 14 }}>
                    {CONTACTS.map((c) => (
                      <a
                        key={c.icon}
                        href={c.href}
                        {...(c.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        aria-label={c.name}
                        style={{
                          width: 42, height: 42, borderRadius: '50%', background: '#fff', display: 'grid', placeItems: 'center',
                          border: '1px solid rgba(20,22,28,.08)', boxShadow: '0 2px 10px rgba(20,22,28,.12)',
                        }}
                      >
                        <Icon name={c.icon} size={24} />
                      </a>
                    ))}
                  </div>
                  <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Phone small progress={sp} />
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '1.2fr 0.8fr',
                    alignItems: 'center', gap: '3vw', padding: `${V(11)} 6vw ${V(4)} 7vw`,
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: 'clamp(28px, min(4vw, 7.5vh), 62px)', letterSpacing: '0.02em', lineHeight: 1 }}>ABOUT</div>
                    <div style={{ fontFamily: script, color: GOLD_DARK, fontSize: 'clamp(44px, min(6.6vw, 12vh), 100px)', lineHeight: 1.05, marginTop: '0.1em' }}>the founder</div>
                    <p style={{ margin: '2.6vh 0 0', maxWidth: 640, fontSize: 'clamp(13px, min(1.25vw, 2.6vh), 20px)', fontWeight: 500, lineHeight: 1.75, color: 'rgba(20,22,28,.82)' }}>
                      {ABOUT_TEXT}
                    </p>
                    <div style={{ display: 'grid', gap: 'clamp(10px, 2vh, 20px)', marginTop: '3.4vh', maxWidth: 640 }}>
                      {CONTACTS.map((c) => (
                        <a
                          key={c.icon}
                          href={c.href}
                          {...(c.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                          className="social-link"
                          style={link}
                        >
                          <Icon name={c.icon} size={iconSize} />
                          <span style={{ wordBreak: 'break-all' }}>{c.label}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                  <div style={{ justifySelf: 'center' }}>
                    <Phone progress={sp} />
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* ============ FEATURED PROJECTS (card grid with View Details) ============ */}
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