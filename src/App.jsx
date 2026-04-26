import React, { useEffect } from 'react';
import Stage from './components/Stage.jsx';
import PageShell from './components/PageShell.jsx';
import HomePage from './components/HomePage.jsx';
import Craft from './components/Craft.jsx';
import Process from './components/Process.jsx';
import Edge from './components/Edge.jsx';
import FAQ from './components/FAQ.jsx';
import Contact from './components/Contact.jsx';

export default function App() {
  useEffect(() => {
    document.documentElement.style.setProperty('--scale', '0.95');
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.height = '';
    };
  }, []);

  const pages = {
    home:    <PageShell label="Home"><HomePage /></PageShell>,
    craft:   <PageShell label="Craft"><Craft /></PageShell>,
    process: <PageShell label="Process"><Process /></PageShell>,
    edge:    <PageShell label="Edge"><Edge /></PageShell>,
    faq:     <PageShell label="FAQ"><FAQ /></PageShell>,
    contact: <PageShell label="Contact"><Contact /></PageShell>,
  };

  return <Stage pages={pages} />;
}
