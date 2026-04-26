// app.jsx - Stage-driven single-page app
function App() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', t.dark ? 'dark' : 'light');
    document.documentElement.style.setProperty('--scale', t.scale);
  }, [t.dark, t.scale]);

  // Lock scroll - we render a fixed full-viewport stage
  React.useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.height = '';
    };
  }, []);

  // Build the page map
  const pages = {
    home:    <PageShell label="Home"><HomePage /></PageShell>,
    craft:   <PageShell label="Craft"><Craft /></PageShell>,
    process: <PageShell label="Process"><Process /></PageShell>,
    faq:     <PageShell label="FAQ"><FAQ /></PageShell>,
    contact: <PageShell label="Contact"><Contact /></PageShell>,
  };

  return (
    <React.Fragment>
      <Stage pages={pages} />
      <TweaksPanel>
        <TweakSection label="Theme" />
        <TweakToggle label="Dark mode" value={t.dark} onChange={(v) => setTweak('dark', v)} />
        <TweakSection label="Typography" />
        <TweakSlider label="Type scale" value={t.scale} min={0.85} max={1.2} step={0.05} unit="x" onChange={(v) => setTweak('scale', v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
