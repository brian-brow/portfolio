import { useCallback, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { SAY_CHANCE, SAYINGS, type PageId } from './content'
import { THEMES, prefersReducedMotion, type ThemeName } from './theme'
import { cancelWipe, ditherWipe, hide } from './lib/ditherWipe'
import { themeSwap } from './lib/themeSwap'
import { preload } from './lib/preload'
import { Nav } from './components/Nav'
import { Skull, type SkullHandle } from './components/Skull'
import { SandZone } from './components/SandZone'
import { Home } from './pages/Home'
import { Experience, Post, Projects, Writing } from './pages/Lists'

const PAGE_MS = 350 // tab swap
const PAGES: PageId[] = ['home', 'projects', 'experience', 'writing', 'post', 'playground']

export default function App() {
  const [themeName, setThemeName] = useState<ThemeName>('dark')
  const [page, setPage] = useState<PageId>('home')
  const [swapFrom, setSwapFrom] = useState<PageId | null>(null)
  const [postIdx, setPostIdx] = useState(0)
  const theme = THEMES[themeName]

  const els = useRef<Partial<Record<PageId, HTMLDivElement | null>>>({})
  const skull = useRef<SkullHandle>(null)
  const pageRef = useRef(page)
  pageRef.current = page
  const settleT = useRef<number>(undefined)

  // Whatever happened mid-swap, make sure the current page ends up fully shown and the rest hidden.
  const settle = useCallback(() => {
    for (const id of PAGES) {
      const el = els.current[id]
      if (!el) continue
      cancelWipe(el)
      el.style.clipPath = ''
      el.style.visibility = id === pageRef.current ? 'visible' : 'hidden'
    }
    setSwapFrom(null)
  }, [])

  // Tab swap: only the text changes. Both pages share one spot; the old one dithers out from
  // the left while the new one dithers in from the left, at the same time.
  const swapPage = useCallback((id: PageId, done?: () => void) => {
    const from = pageRef.current
    if (id === from) return
    const inEl = els.current[id], outEl = els.current[from]
    if (prefersReducedMotion() || !inEl || !outEl) { setPage(id); setSwapFrom(null); done?.(); return }
    hide(inEl)
    inEl.style.visibility = 'visible'
    setPage(id)
    setSwapFrom(from)
    requestAnimationFrame(() => {
      ditherWipe(outEl, {
        out: true, ms: PAGE_MS,
        done: () => {
          outEl.style.visibility = 'hidden' // hide before un-clipping so it can't flash back
          outEl.style.clipPath = ''
          setSwapFrom((s) => (s === from ? null : s))
        },
      })
      ditherWipe(inEl, { ms: PAGE_MS, done })
    })
    clearTimeout(settleT.current)
    settleT.current = window.setTimeout(settle, PAGE_MS + 250)
  }, [settle])

  const pick = (id: PageId) => {
    if (id === page) return
    swapPage(id, () => {
      const lines = SAYINGS[id]
      if (lines && Math.random() < SAY_CHANCE) skull.current?.say(lines[Math.floor(Math.random() * lines.length)])
    })
  }

  const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    const next: ThemeName = themeName === 'dark' ? 'light' : 'dark'
    themeSwap(e.currentTarget.getBoundingClientRect(), async () => flushSync(() => setThemeName(next)))
  }

  const vis = (id: PageId) => (id === page || id === swapFrom ? 'visible' : 'hidden')
  const pageProps = (id: PageId) => ({
    ref: (el: HTMLDivElement | null) => { els.current[id] = el },
    'aria-hidden': id !== page,
    style: { visibility: vis(id) } as React.CSSProperties,
  })

  return (
    <div
      className="site"
      style={{ '--bg': theme.bg, '--text': theme.text, '--name': theme.name, '--muted': theme.muted } as React.CSSProperties}
    >
      <Nav page={page} light={themeName === 'light'} onPick={pick} onToggle={toggleTheme} />
      <main className="text-side">
        <div className="pages">
          <div className="page" {...pageProps('home')}><Home /></div>
          <div className="page" {...pageProps('projects')}><Projects /></div>
          <div className="page" {...pageProps('experience')}><Experience /></div>
          <div className="page" {...pageProps('writing')}>
            <Writing onOpen={(i) => { setPostIdx(i); swapPage('post') }} />
          </div>
          <div className="page" {...pageProps('post')}><Post index={postIdx} onBack={() => swapPage('writing')} /></div>
        </div>
        <div className="playground" {...pageProps('playground')}>
          <SandZone theme={theme} active={page === 'playground' || swapFrom === 'playground'} />
        </div>
      </main>
      <Skull ref={skull} theme={theme} />
    </div>
  )
}
