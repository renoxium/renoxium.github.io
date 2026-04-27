'use client';

import { createContext, useContext } from 'react';

export const PAGES = ['home', 'craft', 'process', 'edge', 'faq', 'contact'] as const;
export type PageKey = typeof PAGES[number];

// Direction vector for the ball's mid-arc waypoint per destination.
// Drives the character of each page-to-page sweep.
export const PAGE_DIR: Record<PageKey, [number, number]> = {
  home:    [ 0, -1.2],
  craft:   [-1.2,  0.9],
  process: [ 1.2,  0.9],
  edge:    [ 0,  1.2],
  faq:     [-1.2, -0.9],
  contact: [ 1.2, -0.9],
};

export const PAGE_LABEL: Record<PageKey, string> = {
  home:    'Home',
  craft:   'Craft',
  process: 'Process',
  edge:    'Edge',
  faq:     'FAQ',
  contact: 'Contact',
};

export const PAGE_PATH: Record<PageKey, string> = {
  home:    '/',
  craft:   '/craft',
  process: '/process',
  edge:    '/edge',
  faq:     '/faq',
  contact: '/contact',
};

export function pathToPage(pathname: string): PageKey {
  const trimmed = pathname.replace(/\/+$/, '') || '/';
  if (trimmed === '/') return 'home';
  const seg = trimmed.replace(/^\//, '').split('/')[0];
  return (PAGES as readonly string[]).includes(seg) ? (seg as PageKey) : 'home';
}

export type Phase = 'idle' | 'implode' | 'chase' | 'explode-init' | 'explode';

export type GoToOptions = {
  originRect?: DOMRect | { left: number; top: number; width: number; height: number };
};

export type StageContextValue = {
  currentPage: PageKey;
  phase: Phase;
  isMobile: boolean;
  goTo: (next: PageKey, opts?: GoToOptions) => void;
};

const StageContext = createContext<StageContextValue | null>(null);

export const StageContextProvider = StageContext.Provider;

export function useStage(): StageContextValue {
  const ctx = useContext(StageContext);
  if (!ctx) throw new Error('useStage must be used inside <StageRoot>');
  return ctx;
}
