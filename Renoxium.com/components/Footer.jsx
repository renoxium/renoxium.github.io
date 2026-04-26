// Footer — minimal, brand-forward
const footerStyles = {
  outer: {
    padding: '80px 0 40px',
    borderTop: '1px solid var(--rule)',
  },
  top: {
    display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 48,
    paddingBottom: 56,
  },
  brand: { display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 360 },
  brandRow: { display: 'flex', alignItems: 'center', gap: 10 },
  brandWord: { fontFamily: 'var(--serif)', fontSize: 30, lineHeight: 1, paddingTop: 2, letterSpacing: '-0.03em', fontVariationSettings: '"opsz" 144, "SOFT" 30', fontWeight: 380 },
  tag: { color: 'var(--ink-3)', fontSize: 14, lineHeight: 1.6 },
  colTitle: {
    fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase',
    color: 'var(--ink-4)', marginBottom: 16,
  },
  link: {
    display: 'block', color: 'var(--ink-2)', textDecoration: 'none',
    padding: '6px 0', fontSize: 14,
    transition: 'color 200ms',
  },
  bottom: {
    paddingTop: 28, borderTop: '1px solid var(--rule)',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase',
    color: 'var(--ink-4)',
  },
  giant: {
    fontFamily: 'var(--serif)', fontStyle: 'italic',
    fontSize: 'clamp(120px, 30vw, 420px)',
    lineHeight: 0.85,
    letterSpacing: '-0.06em',
    color: 'var(--ink)',
    margin: '40px 0 16px',
    userSelect: 'none',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    fontVariationSettings: '"opsz" 144, "SOFT" 100, "wght" 280',
    transition: 'color 600ms ease, letter-spacing 600ms ease',
    cursor: 'none',
  },
};

function Footer() {
  return (
    <footer style={footerStyles.outer}>
      <div className="wrap">
        <div className="footer-top" style={footerStyles.top}>
          <div style={footerStyles.brand}>
            <div style={footerStyles.brandRow}>
              <RenoxiumMark size={26} />
              <span style={footerStyles.brandWord}>Renoxium</span>
            </div>
            <p style={footerStyles.tag}>
              A senior product studio in Dubai. Building SaaS, web, mobile, and
              AI applications for clients in 34 countries since 2005.
            </p>
            <a style={{ color: 'var(--amber)', textDecoration: 'none', fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '0.04em' }} href="mailto:hello@renoxium.com">hello@renoxium.com</a>
          </div>
          <div>
            <div style={footerStyles.colTitle}>Studio</div>
            <a style={footerStyles.link} href="#craft">Craft</a>
            <a style={footerStyles.link} href="#process">Process</a>
            <a style={footerStyles.link} href="#faq">FAQ</a>
            <a style={footerStyles.link} href="#contact">Contact</a>
          </div>
          <div>
            <div style={footerStyles.colTitle}>Services</div>
            <a style={footerStyles.link}>SaaS platforms</a>
            <a style={footerStyles.link}>AI applications</a>
            <a style={footerStyles.link}>Web apps</a>
            <a style={footerStyles.link}>Mobile apps</a>
            <a style={footerStyles.link}>Rapid prototyping</a>
          </div>
          <div>
            <div style={footerStyles.colTitle}>Connect</div>
            <a style={footerStyles.link} href="mailto:hello@renoxium.com">hello@renoxium.com</a>
            <a style={footerStyles.link}>LinkedIn</a>
            <a style={footerStyles.link}>X / Twitter</a>
            <a style={footerStyles.link}>Dribbble</a>
          </div>
        </div>

        <div style={footerStyles.giant} className="footer-giant">Renoxium<span style={{ color: 'var(--amber)' }}>.</span></div>

        <div style={footerStyles.bottom}>
          <span>© 2026 Renoxium FZ-LLC · Dubai, UAE</span>
          <span>Crafted in DIFC · v3.2</span>
        </div>
      </div>

      <style>{`
        footer a:hover { color: var(--amber) !important; }
        .footer-giant:hover { color: var(--amber); letter-spacing: -0.04em; }
        @media (max-width: 900px) {
          .footer-top { grid-template-columns: 1fr 1fr !important; gap: 32px !important; }
        }
        @media (max-width: 560px) {
          .footer-top { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}

window.Footer = Footer;
