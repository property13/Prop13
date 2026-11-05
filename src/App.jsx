import React, { useState, useEffect, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionTemplate,
} from 'framer-motion';

const HERO_IMG = '/pic1.png';
const LOGO = '/logo.png';

const SIG_IMG = '/Signature.png';
const ALI_IMG = '/Alibaug.png';
const DEL_IMG = '/Delhi.png';
const MUM_IMG = '/Mumbai.png';

const BG = '#0e1201';
const CREAM = '#fbefca';
const GOLD = '#f4d35e';
const GOLD_DARK = '#c9971c';
const INK = '#14161c';

const serif = '"Marcellus", Georgia, serif';
const sans = 'Inter, "Helvetica Neue", Arial, sans-serif';
const mont = '"Montserrat", Inter, "Helvetica Neue", Arial, sans-serif';
const script = '"Kaushan Script", "Brush Script MT", cursive';

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
  "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua";

const inOut = [0.76, 0, 0.24, 1];
const outExpo = [0.16, 1, 0.3, 1];
const outSoft = [0.22, 1, 0.36, 1];

const FADE_DELAY = 0.4;
const SPLIT_DUR = 0.8;
const VERT_DUR = 1.1;
const IMG_DELAY = 0.30;
const IMG_DUR = 2.0;
const IMG_ZOOM_DUR = 2.6;
const UNLOCK_AFTER = 3.6;

const FONT_VW = 7;
const START_LEFT = 18.1;
const START_RIGHT = 53.8;
const NAV_FONT = 17;
const NAV_GAP = 28;

const PILL = 'inset(39% 37.5% 39% 37.5% round 200px)';
const MID = 'inset(3% 1.5% 3% 1.5% round 28px)';
const FULL = 'inset(0% 0% 0% 0% round 0px)';


function useIsMobile() {
  const [m, setM] = useState(typeof window !== 'undefined' && window.innerWidth < 800);
  useEffect(() => {
    const f = () => setM(window.innerWidth < 800);
    window.addEventListener('resize', f);
    return () => window.removeEventListener('resize', f);
  }, []);
  return m;
}

function Icon({ name, size = 34 }) {
  const s = { width: size, height: size, flex: 'none', display: 'block' };
  if (name === 'ig')
    return (
      <svg viewBox="0 0 24 24" style={s}>
        <defs>
          <linearGradient id="igg" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#feda75" />
            <stop offset=".5" stopColor="#d62976" />
            <stop offset="1" stopColor="#4f5bd5" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="20" height="20" rx="6" fill="url(#igg)" />
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
    <div style={{ ...fill, background: '#000', color: '#fff', fontFamily: mont, padding: '3.6em 0.9em 0.9em', fontSize: '1em' }}>
      <div style={{ fontWeight: 700, fontSize: '1.05em', marginBottom: '0.9em' }}>{INSTAGRAM} ▾</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1em' }}>
        <div style={{ width: '4.6em', height: '4.6em', borderRadius: '50%', padding: 2, background: 'linear-gradient(45deg,#feda75,#d62976,#4f5bd5)' }}>
          <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#111 url(' + LOGO + ') center/60% no-repeat', border: '2px solid #000' }} />
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
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ width: '3.4em', height: '3.4em', borderRadius: '50%', border: '1.5px solid #555', backgroundImage: `url(${HERO_IMG})`, backgroundSize: '300%', backgroundPosition: ['20% 30%', '70% 30%', '30% 80%', '80% 80%'][i] }} />
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
      <div style={{ ...fill, background: 'linear-gradient(to bottom, rgba(0,0,0,.35), transparent 30%, transparent 55%, rgba(0,0,0,.75))' }} />
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
        <svg viewBox="0 0 16 12" style={{ width: '1.3em', height: '1em' }}>
          <path d="M8 11.2l1.9-2.1a2.7 2.7 0 00-3.8 0L8 11.2z" fill="#fff" />
          <path d="M3.6 6.9a6.2 6.2 0 018.8 0l1.1-1.2a7.8 7.8 0 00-11 0l1.1 1.2z" fill="#fff" />
          <path d="M.6 3.9a10.4 10.4 0 0114.8 0L16 3.3a11.9 11.9 0 00-16 0l.6.6z" fill="#fff" opacity=".9" />
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

function Phone({ small }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % 2), 3300);
    return () => clearInterval(t);
  }, []);

  const tilt = small
    ? 'perspective(1200px) rotateY(-10deg) rotateX(3deg)'
    : 'perspective(1600px) rotateY(-16deg) rotateX(5deg) rotateZ(1deg)';

  const titanium =
    'linear-gradient(145deg, #9a968f 0%, #45433f 18%, #1d1d1f 46%, #4d4b47 74%, #a6a29a 100%)';

  const sideBtn = (side, top, height) => ({
    position: 'absolute',
    [side]: '-0.28em',
    top,
    height,
    width: '0.34em',
    borderRadius: '0.2em',
    background: titanium,
    transform: 'translateZ(-3px)',
  });

  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      style={{ justifySelf: 'center', transformStyle: 'preserve-3d' }}
    >
      <div
        style={{
          position: 'relative',
          height: small ? 'clamp(250px, 36vh, 340px)' : 'clamp(300px, 70vh, 660px)',
          aspectRatio: '9 / 19.3',
          fontSize: small ? 8 : 'clamp(8px, 1.5vh, 13px)',
          transform: tilt,
          transformStyle: 'preserve-3d',
        }}
      >
        <div
          style={{
            position: 'absolute', left: '10%', right: '-8%', bottom: '-3%', height: '7%',
            borderRadius: '50%', background: 'rgba(20,22,28,.5)', filter: 'blur(18px)',
            transform: 'translateZ(-40px)', pointerEvents: 'none',
          }}
        />

        {Array.from({ length: 8 }).map((_, k) => (
          <div
            key={k}
            style={{
              position: 'absolute', inset: 0, borderRadius: R,
              background: k % 2 ? '#2b2a28' : '#3d3b37',
              transform: `translateZ(${-(k + 1) * 1.2}px)`,
            }}
          />
        ))}

        <div style={sideBtn('left', '13%', '3.2%')} />
        <div style={sideBtn('left', '19%', '6.5%')} />
        <div style={sideBtn('left', '27%', '6.5%')} />
        <div style={sideBtn('right', '22%', '10.5%')} />
        <div style={sideBtn('right', '60%', '7.5%')} />

        <div
          style={{
            position: 'absolute', inset: 0, boxSizing: 'border-box', borderRadius: R,
            background: titanium, padding: '0.5em',
          }}
        >
          <div
            style={{
              width: '100%', height: '100%', boxSizing: 'border-box', borderRadius: '16.2% / 7.5%',
              background: '#000', padding: '0.3em', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.07)',
            }}
          >
            {/* screen */}
            <div
              style={{
                position: 'relative', width: '100%', height: '100%', borderRadius: '15% / 6.9%',
                overflow: 'hidden', background: '#000', isolation: 'isolate',
              }}
            >
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

              <div
                style={{
                  position: 'absolute', top: '0.85em', left: '50%', transform: 'translateX(-50%)',
                  width: '31%', height: '2.05em', background: '#000', borderRadius: 999, zIndex: 5,
                }}
              />

              <div
                style={{
                  position: 'absolute', bottom: '0.55em', left: '50%', transform: 'translateX(-50%)',
                  width: '34%', height: '0.36em', borderRadius: 999, background: 'rgba(255,255,255,.85)',
                  zIndex: 4, pointerEvents: 'none',
                }}
              />
              <div
                style={{
                  position: 'absolute', inset: 0, zIndex: 6, pointerEvents: 'none',
                  background:
                    'linear-gradient(118deg, rgba(255,255,255,.22) 0%, rgba(255,255,255,.08) 20%, rgba(255,255,255,0) 38%, rgba(255,255,255,0) 72%, rgba(255,255,255,.06) 100%)',
                }}
              />
            </div>
          </div>
          <div
            style={{
              position: 'absolute', inset: 0, borderRadius: R, pointerEvents: 'none',
              boxShadow:
                'inset 0 0 0 0.07em rgba(255,255,255,.4), inset 0 0 0.5em rgba(255,255,255,.14), inset 0.2em 0.2em 0.5em rgba(255,255,255,.18)',
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}

function RevealWord({ children, progress, range, first }) {
  const o = useTransform(progress, range, [0.22, 1]);
  return (
    <motion.span style={{ opacity: o, display: 'inline-block', marginLeft: first ? 0 : '0.28em' }}>
      {children}
    </motion.span>
  );
}

function Rise({ style, children }) {
  return <div style={{ minWidth: 0, ...style }}>{children}</div>;
}

const FOOTER_DISCLAIMER =
  'Images and project details are for illustration only and may change without notice. Please confirm availability and registration details with us before booking.';
const RERA_LINE = 'ABCD1234';      
const FOOTER_ADDRESS = 'Dlf Phase 2';  

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

function Footer({ isMobile, footerRef, onProjects, onAbout }) {
  const year = new Date().getFullYear();
  const wa = `https://wa.me/${WHATSAPP.replace(/[^0-9]/g, '')}`;

  const up = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.25 },
    transition: { duration: 0.8, delay, ease: outSoft },
  });

  const head = {
    fontFamily: serif,
    color: GOLD,
    fontSize: 15,
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    margin: '0 0 16px',
    fontWeight: 400,
  };
  const linkStyle = {
    display: 'block',
    color: CREAM,
    opacity: 0.85,
    fontFamily: sans,
    fontSize: 15,
    lineHeight: 2.1,
    textDecoration: 'none',
    cursor: 'pointer',
    wordBreak: 'break-word',
  };

  const socials = [
    ['ig', 'https://instagram.com/propertygallery13', 'Instagram'],
    ['in', `https://${LINKEDIN}`, 'LinkedIn'],
    ['wa', wa, 'WhatsApp'],
    ['yt', YOUTUBE_URL, 'YouTube'],
    ['em', `mailto:${EMAIL}`, 'Email'],
  ];

  return (
    <footer
      ref={footerRef}
      style={{
        position: 'relative',
        zIndex: 10,
        background: `linear-gradient(180deg, ${BG} 0%, #070a00 100%)`,
        color: CREAM,
        overflow: 'hidden',
        padding: '0 6vw 28px',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(244,211,94,.08) 1px, transparent 0)',
          backgroundSize: '26px 26px',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${GOLD_DARK}, ${GOLD}, ${GOLD_DARK}, transparent)`,
        }}
      />

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
              style={{
                height: isMobile ? 56 : 68,
                width: 'auto',
                display: 'block',
                margin: isMobile ? '0 auto' : 0,
                mixBlendMode: 'screen',
              }}
            />
            <div style={{ fontFamily: serif, letterSpacing: '0.18em', fontSize: 17, marginTop: 14, color: CREAM }}>
              PROPERTY GALLERY
            </div>
            <p
              style={{
                fontFamily: sans,
                fontSize: 14.5,
                lineHeight: 1.8,
                opacity: 0.75,
                margin: '10px 0 0',
                maxWidth: 340,
                marginLeft: isMobile ? 'auto' : 0,
                marginRight: isMobile ? 'auto' : 0,
              }}
            >
              Curated real estate across India and Dubai. Developments, destinations and opportunities worth exploring.
            </p>
          </motion.div>

          <motion.div {...up(0.08)}>
            <h4 style={head}>✦ Explore</h4>
            <motion.a role="button" onClick={onProjects} whileHover={{ x: isMobile ? 0 : 6, color: GOLD }} style={linkStyle}>Projects</motion.a>
            <motion.a role="button" onClick={onAbout} whileHover={{ x: isMobile ? 0 : 6, color: GOLD }} style={linkStyle}>About the founder</motion.a>
            <motion.a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" whileHover={{ x: isMobile ? 0 : 6, color: GOLD }} style={linkStyle}>Vlogs</motion.a>
          </motion.div>

          <motion.div {...up(0.16)}>
            <h4 style={head}>✦ Get in touch</h4>
            <motion.a href={wa} target="_blank" rel="noopener noreferrer" whileHover={{ x: isMobile ? 0 : 6, color: GOLD }} style={linkStyle}>{WHATSAPP}</motion.a>
            <motion.a href={`mailto:${EMAIL}`} whileHover={{ x: isMobile ? 0 : 6, color: GOLD }} style={linkStyle}>{EMAIL}</motion.a>
            {FOOTER_ADDRESS && <div style={{ ...linkStyle, cursor: 'default' }}>{FOOTER_ADDRESS}</div>}
          </motion.div>

          <motion.div {...up(0.24)}>
            <h4 style={head}>✦ Follow us</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: isMobile ? 'center' : 'flex-start' }}>
              {socials.map(([n, href, label]) => (
                <motion.a
                  key={n}
                  href={href}
                  {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  aria-label={label}
                  whileHover={{ y: -4, rotate: -6, scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: '50%',
                    display: 'grid',
                    placeItems: 'center',
                    border: `1.5px solid ${GOLD_DARK}`,
                    background: 'rgba(244,211,94,.06)',
                    boxShadow: '0 0 0 4px rgba(244,211,94,.05)',
                  }}
                >
                  <Icon name={n} size={24} />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        <GoldLine />

        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            padding: '24px 0 8px',
            fontFamily: sans,
            fontSize: 13.5,
          }}
        >
          <span style={{ opacity: 0.7 }}>© {year} Property Gallery. All rights reserved.</span>

         

          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.94 }}
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              border: `1.5px solid ${GOLD_DARK}`,
              background: 'rgba(244,211,94,.08)',
              color: GOLD,
              cursor: 'pointer',
              display: 'grid',
              placeItems: 'center',
              fontSize: 18,
            }}
          >
            <motion.span animate={{ y: [0, -3, 0] }} transition={{ duration: 2.0 , repeat: Infinity, ease: 'easeInOut' }}>
              ↑
            </motion.span>
          </motion.button>
        </div>

        <p
          style={{
            fontFamily: sans,
            fontSize: 12,
            lineHeight: 1.7,
            opacity: 0.45,
            textAlign: 'center',
            maxWidth: 760,
            margin: '10px auto 0',
          }}
        >
          {FOOTER_DISCLAIMER}
          {RERA_LINE ? ` ${RERA_LINE}` : ''}
        </p>
      </div>
    </footer>
  );
}

export default function App() {
  const isMobile = useIsMobile();
  const [stage, setStage] = useState(0);
  const [ready, setReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  const [activeProjectsIndex, setActiveProjectsIndex] = useState(0);

  const stmtRef = useRef(null);
  const projectsRef = useRef(null);
  const footerRef = useRef(null);

  const goProjects = () => projectsRef.current?.scrollIntoView({ behavior: 'smooth' });
  const goFooter = () => footerRef.current?.scrollIntoView({ behavior: 'smooth' });
  const goAbout = () => {
    const el = stmtRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + (el.offsetHeight - window.innerHeight) * 0.9, behavior: 'smooth' });
  };

  const { scrollYProgress: enterRaw } = useScroll({ target: stmtRef, offset: ['start end', 'start start'] });
  const ep = useSpring(enterRaw, { stiffness: 110, damping: 26, mass: 0.4 });
  const introScale = useTransform(ep, [0, 1], [1, 0.92]);
  const introY = useTransform(ep, [0, 1], ['0vh', '-6vh']);
  const introDim = useTransform(ep, [0, 1], [1, 0.35]);
  const introFilter = useMotionTemplate`brightness(${introDim})`;
  const hintOpacity = useTransform(ep, [0, 0.15], [1, 0]);
  const logoOpacity = useTransform(ep, [0.55, 0.95], [0, 1]);
  const logoY = useTransform(ep, [0.55, 0.95], [-12, 0]);

  const { scrollYProgress: stmtRaw } = useScroll({ target: stmtRef, offset: ['start start', 'end end'] });
  const sp = useSpring(stmtRaw, { stiffness: 120, damping: 28, mass: 0.3 });
  const panelY = useTransform(sp, [0.58, 0.85], ['100vh', '0vh']);
  const radH = useTransform(sp, [0.58, 0.74, 0.85], [50, 6, 0]);
  const radV = useTransform(sp, [0.58, 0.74, 0.85], [70, 8, 0]);
  const panelRadius = useMotionTemplate`${radH}% ${radV}vh`;
  const stmtOpacity = useTransform(sp, [0.58, 0.85], [1, 0.25]);
  const stmtScale = useTransform(sp, [0.58, 0.85], [1, 0.94]);
  const glass = useTransform(sp, [0.72, 0.84], [0, 1]);

  const rest = STATEMENT_REST.split(' ');
  const total = rest.length + 1;
  const range = (i) => [(i / total) * 0.46, (i / total) * 0.46 + 0.12];

  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    document.documentElement.style.overflowX = 'clip';
    document.body.style.overflowX = 'clip';
    document.body.style.margin = '0';
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
    Promise.all([imgP, fontP]).catch(() => {}).then(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!ready) return;
    const t1 = setTimeout(() => setStage(1), 1800);
    const t2 = setTimeout(() => setStage(2), 3200);
    const t3 = setTimeout(() => setUnlocked(true), (3.2 + UNLOCK_AFTER) * 1000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [ready]);

  useEffect(() => {
    if (unlocked) return;
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
  }, [unlocked]);

  const wordBase = {
    position: 'absolute',
    margin: 0,
    fontFamily: serif,
    fontWeight: 400,
    fontSize: `${FONT_VW}vw`,
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
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(10px, 1vw, 16px)',
    fontSize: isMobile ? 13 : 'clamp(14px, min(1.2vw, 2.4vh), 19px)',
    fontWeight: 600,
    color: INK,
    lineHeight: 1.25,
    minWidth: 0,
    wordBreak: 'break-word',
    textDecoration: 'none',
    cursor: 'pointer',
  };
  const iconSize = isMobile ? 28 : 'clamp(32px, min(2.6vw, 5vh), 44px)';

  const projectsLocations = [
    {
      title: 'Signature Global',
      subtitle: 'Jhajjar & NCR Residential Floors',
      desc: 'State-of-the-art residential floor developments, open green landscapes, and modern lifestyle amenities tailored for contemporary families in prime NCR sectors.',
      image: SIG_IMG,
    },
    {
      title: 'Alibaug Estates',
      subtitle: 'Luxury Convention & Resort Living',
      desc: 'A sprawling convention centre spread across 1,50,000 sq. ft. equipped with exotic resort-style pools, sunken bars, outdoor/indoor sports arenas, yoga studios, and themed spas.',
      image: ALI_IMG,
    },
    {
      title: 'Delhi Skyline',
      subtitle: 'Metropolitan Architectural Masterpieces',
      desc: 'High-rise architectural masterpieces featuring striking geometric design, elite urban convenience, panoramic views, and premium connectivity in the heart of the capital.',
      image: DEL_IMG,
    },
    {
      title: 'DLF Luxury Apartments',
      subtitle: 'Andheri West, Mumbai · Under Construction',
      desc: 'Sprawling luxury residences featuring 3 & 4 BHK layouts (1,126 - 2,534 Sq. Ft.), exclusive clubhouses with swimming pools, gymnasiums, and 80% dedicated open green spaces.',
      image: MUM_IMG,
    }
  ];

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        html {
          scrollbar-width: none;
          -ms-overflow-style: none;
          -webkit-text-size-adjust: 100%;
          text-size-adjust: 100%;
          scroll-behavior: smooth;
        }
        html::-webkit-scrollbar, body::-webkit-scrollbar { display: none; width: 0; height: 0; }
        html, body, #root { width: 100%; min-height: 100%; }
        body { margin: 0; min-width: 320px; overflow-x: hidden; }
        img, svg, video { max-width: 100%; }
        button, a { -webkit-tap-highlight-color: transparent; }
        .social-link:hover { opacity: 0.75; transform: translateX(4px); transition: all 0.2s ease; }

        /* Use the dynamic viewport on modern mobile browsers (Safari/Chrome). */
        .pg-hero { height: 100vh !important; height: 100svh !important; }
        @supports (height: 100dvh) {
          .pg-hero { height: 100dvh !important; }
        }

        @media (max-width: 767px) {
          .pg-header { padding-left: 4vw !important; padding-right: 4vw !important; }
          .pg-header nav {
            gap: clamp(8px, 2.2vw, 14px) !important;
            font-size: clamp(11px, 3.1vw, 13px) !important;
            white-space: nowrap;
          }
          .pg-header nav span { flex-shrink: 0; }
          .pg-hero { min-height: 540px; }
          .pg-statement { height: 280svh !important; }
          .pg-about-grid {
            display: flex !important;
            flex-direction: column !important;
            align-items: stretch !important;
            justify-content: flex-start !important;
            gap: 22px !important;
            overflow-x: hidden !important;
            overflow-y: auto !important;
            overscroll-behavior: contain;
            -webkit-overflow-scrolling: touch;
            padding: max(86px, calc(env(safe-area-inset-top) + 76px)) 6vw
                     max(30px, env(safe-area-inset-bottom)) !important;
          }
          .pg-about-grid > div:first-child { width: 100%; min-width: 0; }
          .pg-about-grid p { overflow-wrap: anywhere; }
          .pg-about-grid a { font-size: clamp(11px, 3.2vw, 13px) !important; }
          .pg-about-grid > div:last-child { align-self: center; }
          .pg-projects { padding: 72px 5vw 64px !important; }
          .pg-projects > div:first-child { margin-bottom: 42px !important; }
          .pg-projects > div:first-child span { font-size: 12px !important; }
          .pg-project-cards {
            gap: 5vh !important;
            padding-bottom: 5vh !important;
          }
          .pg-project-cards > div { padding: 22px !important; }
          .pg-project-preview {
            position: relative !important;
            top: auto !important;
            height: clamp(250px, 65vw, 360px) !important;
            min-height: 250px;
          }
        }

        @media (min-width: 768px) and (max-width: 1024px) {
          .pg-header { padding-left: 3vw !important; padding-right: 3vw !important; }
          .pg-header nav { gap: clamp(14px, 2vw, 22px) !important; }
          .pg-projects { padding-left: 5vw !important; padding-right: 5vw !important; }
          .pg-project-cards { gap: 22vh !important; }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            scroll-behavior: auto !important;
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <header className="pg-header"
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
            background: 'rgba(40,42,48,.45)',
            backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
          }}
        />
        <motion.div style={{ opacity: logoOpacity, y: logoY, display: 'flex', alignItems: 'center' }}>
          <motion.img
            src={LOGO}
            alt="Property Gallery"
            style={{
              height: isMobile ? 42 : 'clamp(52px, 4.8vw, 80px)',
              width: 'auto',
              display: 'block',
              objectFit: 'contain',
              filter: 'drop-shadow(0 1px 3px rgba(0,0,0,.45))',
            }}
          />
        </motion.div>

        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={stage >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
          transition={{ duration: 0.7, delay: 1.3 }}
          style={{
            display: 'flex', alignItems: 'center', gap: isMobile ? 14 : NAV_GAP,
            fontFamily: sans, fontSize: isMobile ? 13 : NAV_FONT, fontWeight: 500,
            color: '#fff', pointerEvents: 'auto',
          }}
        >
          <span onClick={goProjects} style={{ cursor: 'pointer' }}>
            Projects
          </span>

          <span onClick={goAbout} style={{ cursor: 'pointer' }}>About</span>

          <motion.span
            onClick={goFooter}
            style={{ background: CREAM, color: '#000', padding: isMobile ? '7px 12px' : '10px 20px', borderRadius: 6, fontWeight: 500, cursor: 'pointer' }}
          >
            Contact↗
          </motion.span>
        </motion.nav>
      </header>

      <div className="pg-hero" style={{ position: 'sticky', top: 0, height: '100vh', zIndex: 0, overflow: 'hidden', background: BG }}>
        <motion.div
          style={{
            position: 'absolute', inset: 0, background: BG,
            scale: introScale, y: introY, filter: introFilter,
            transformOrigin: '50% 100%',
          }}
        >
          <motion.div
            initial={{ opacity: 0, clipPath: PILL }}
            animate={stage >= 2 ? { opacity: 1, clipPath: [PILL, MID, FULL] } : { opacity: 0, clipPath: PILL }}
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
            <motion.img
              src={HERO_IMG}
              alt="Luxury property"
              initial={{ scale: 1.25 }}
              animate={{ scale: stage >= 2 ? 1 : 1.25 }}
              transition={{ duration: IMG_ZOOM_DUR, delay: stage >= 2 ? IMG_DELAY : 0, ease: outExpo }}
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,.4), rgba(0,0,0,.05), rgba(0,0,0,.5))' }} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, top: '54vh', left: `${START_LEFT}vw`, x: '0%', y: '-50%', rotate: -3 }}
            animate={{
              opacity: ready ? 1 : 0,
              rotate: ready ? 0 : -3,
              left: stage >= 1 ? '3.8vw' : `${START_LEFT}vw`,
              top: !ready ? '54vh' : stage >= 2 ? '4vh' : '50vh',
              y: stage >= 2 ? '0%' : '-50%',
            }}
            transition={wordTransition}
            style={wordBase}
          >
            PROPERTY
          </motion.h1>

          <motion.h1
            initial={{ opacity: 0, top: '54vh', left: `${START_RIGHT}vw`, x: '0%', y: '-50%', rotate: 3 }}
            animate={{
              opacity: ready ? 1 : 0,
              rotate: ready ? 0 : 3,
              left: stage >= 1 ? '96.2vw' : `${START_RIGHT}vw`,
              x: stage >= 1 ? '-100%' : '0%',
              top: !ready ? '54vh' : stage >= 2 ? '96vh' : '50vh',
              y: stage >= 2 ? '-100%' : '-50%',
            }}
            transition={wordTransition}
            style={wordBase}
          >
            GALLERY
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={stage >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.8, delay: 2.2 }}
            style={{
              position: 'absolute', left: '3.8vw', bottom: '5vh', zIndex: 30,
              maxWidth: 220, fontFamily: sans, fontSize: 13, lineHeight: 1.35, color: '#fff',
            }}
          >
            Luxury Real Estate Experience, curated properties for modern living.
          </motion.div>
        </motion.div>
      </div>

      <section className="pg-statement" ref={stmtRef} style={{ position: 'relative', zIndex: 1, height: isMobile ? '280vh' : '300vh', background: BG }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', background: BG }}>
          <motion.div
            style={{
              position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
              justifyContent: 'center', padding: isMobile ? '12vh 6vw 8vh' : '8vh 6vw',
              color: CREAM, fontFamily: sans, opacity: stmtOpacity, scale: stmtScale,
            }}
          >
            <div style={{ fontSize: isMobile ? 'clamp(26px, 8vw, 44px)' : 'clamp(26px, min(6.2vw, 11.5vh), 110px)', lineHeight: 1.12, letterSpacing: '-0.025em', fontWeight: 400 }}>
              <div>
                <RevealWord progress={sp} range={range(0)} first>{STATEMENT_FIRST}</RevealWord>
              </div>
              <div style={{ textAlign: 'right', maxWidth: isMobile ? '100%' : '68vw', marginLeft: 'auto' }}>
                {rest.map((w, i) => (
                  <RevealWord key={i} progress={sp} range={range(i + 1)}>{w}</RevealWord>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            style={{
              position: 'absolute', inset: 0, zIndex: 40, y: panelY,
              borderTopLeftRadius: panelRadius, borderTopRightRadius: panelRadius,
              background: 'linear-gradient(160deg, #ffffff 0%, #f6f7fa 100%)',
              borderTop: '1px solid rgba(0,0,0,.08)', overflow: 'hidden', color: INK, fontFamily: mont,
            }}
          >
            <motion.div
              className="pg-about-grid"
              style={{
                position: 'absolute', inset: 0, display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1.2fr 0.8fr',
                alignItems: isMobile ? 'start' : 'center', gap: isMobile ? '2vh' : '3vw',
                padding: isMobile ? '11vh 6vw 3vh' : '11vh 6vw 4vh 7vw',
                overflowY: isMobile ? 'auto' : 'visible',
                WebkitOverflowScrolling: isMobile ? 'touch' : 'auto',
              }}
            >
              <div style={{ minWidth: 0 }}>
                <Rise progress={sp} from={0.66}>
                  <div style={{ fontWeight: 800, color: INK, fontSize: isMobile ? 26 : 'clamp(28px, min(4vw, 7.5vh), 62px)', letterSpacing: '0.02em', lineHeight: 1 }}>ABOUT</div>
                  <div style={{ fontFamily: script, color: GOLD_DARK, fontSize: isMobile ? 40 : 'clamp(44px, min(6.6vw, 12vh), 100px)', lineHeight: 1.05, marginTop: '0.1em' }}>the founder</div>
                </Rise>
                <Rise progress={sp} from={0.70}>
                  <p style={{ margin: isMobile ? '1.6vh 0 0' : '2.6vh 0 0', maxWidth: 640, fontSize: isMobile ? 12.5 : 'clamp(13px, min(1.25vw, 2.6vh), 20px)', fontWeight: 500, lineHeight: 1.75, color: 'rgba(20,22,28,.82)', textAlign: 'left' }}>
                    {ABOUT_TEXT}
                  </p>
                </Rise>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr', gap: isMobile ? '1.4vh 12px' : 'clamp(10px, 2vh, 20px)', marginTop: isMobile ? '2.4vh' : '3.4vh', maxWidth: 640 }}>

                  {/* Instagram Link */}
                  <Rise progress={sp} from={0.740} y={30}>
                    <a href="https://instagram.com/propertygallery13" target="_blank" rel="noopener noreferrer" className="social-link" style={link}>
                      <Icon name="ig" size={iconSize} /><span>{INSTAGRAM}</span>
                    </a>
                  </Rise>

                  {/* LinkedIn Link */}
                  <Rise progress={sp} from={0.765} y={30}>
                    <a href={`https://${LINKEDIN}`} target="_blank" rel="noopener noreferrer" className="social-link" style={link}>
                      <Icon name="in" size={iconSize} /><span style={{ wordBreak: 'break-all' }}>{LINKEDIN}</span>
                    </a>
                  </Rise>

                  {/* WhatsApp Link */}
                  <Rise progress={sp} from={0.790} y={30}>
                    <a href={`https://wa.me/${WHATSAPP.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="social-link" style={link}>
                      <Icon name="wa" size={iconSize} /><span>{WHATSAPP}</span>
                    </a>
                  </Rise>

                  {/* YouTube Link */}
                  <Rise progress={sp} from={0.815} y={30}>
                    <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" className="social-link" style={link}>
                      <Icon name="yt" size={iconSize} /><span>{YOUTUBE}</span>
                    </a>
                  </Rise>

                  {/* Gmail Link */}
                  <Rise progress={sp} from={0.840} y={30}>
                    <a href={`mailto:${EMAIL}`} className="social-link" style={link}>
                      <Icon name="em" size={iconSize} /><span>{EMAIL}</span>
                    </a>
                  </Rise>

                </div>
              </div>
              <Rise progress={sp} from={0.72} y={140} style={{ justifySelf: 'center' }}><Phone small={isMobile} /></Rise>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="pg-projects" ref={projectsRef} style={{ position: 'relative', zIndex: 10, background: BG, color: CREAM, padding: '10vh 4vw' }}>
        <div style={{ textAlign: 'center', marginBottom: '8vh' }}>
          <span style={{ fontSize: '17px', letterSpacing: '0.3em', textTransform: 'uppercase', color: GOLD }}>Curated Portfolio</span>
          <h2 style={{ fontFamily: serif, fontSize: isMobile ? '32px' : '52px', marginTop: '1vh' }}>Our Projects</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '4vw', alignItems: 'start', maxWidth: '1400px', margin: '0 auto' }}>

          <div className="pg-project-cards" style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '5vh' : '40vh', paddingBottom: isMobile ? '5vh' : '20vh' }}>
            {projectsLocations.map((loc, idx) => (
              <motion.div
                key={idx}
                onViewportEnter={() => setActiveProjectsIndex(idx)}
                viewport={{ margin: '-40% 0px -40% 0px' }}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  padding: isMobile ? '24px' : '40px',
                  borderRadius: '16px',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <span style={{ color: GOLD, fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>0{idx + 1} — Destination</span>
                <h3 style={{ fontFamily: serif, fontSize: isMobile ? '26px' : '38px', margin: '10px 0 6px', color: '#fff' }}>{loc.title}</h3>
                <h4 style={{ fontSize: '14px', opacity: 0.7, fontWeight: 400, marginBottom: '20px' }}>{loc.subtitle}</h4>
                <p style={{ fontFamily: sans, fontSize: isMobile ? '14px' : '16px', lineHeight: 1.8, opacity: 0.85, margin: 0 }}>
                  {loc.desc}
                </p>
                <div style={{ marginTop: '24px' }}>
                  <button
                    onClick={() => alert(`Inquiring for ${loc.title}`)}
                    style={{
                      background: CREAM, color: '#000', padding: '10px 24px',
                      borderRadius: '6px', fontWeight: 600, border: 'none', cursor: 'pointer',
                      fontSize: '13px', letterSpacing: '0.05em'
                    }}
                  >
                    Explore Location ↗
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="pg-project-preview" style={{ position: isMobile ? 'relative' : 'sticky', top: '15vh', height: isMobile ? '300px' : '75vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)', position: 'relative', background: '#000' }}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeProjectsIndex}
                  src={projectsLocations[activeProjectsIndex].image}
                  alt={projectsLocations[activeProjectsIndex].title}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: outSoft }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </AnimatePresence>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
                <span style={{ fontSize: '12px', color: GOLD, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Active Destination</span>
                <h4 style={{ fontFamily: serif, fontSize: '20px', margin: '4px 0 0', color: '#fff' }}>{projectsLocations[activeProjectsIndex].title}</h4>
              </div>
            </div>
          </div>

        </div>
      </section>

      <Footer isMobile={isMobile} footerRef={footerRef} onProjects={goProjects} onAbout={goAbout} />
    </>
  );
}