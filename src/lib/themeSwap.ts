import { BAYER8 } from './bayer'
import { prefersReducedMotion } from '../theme'

const DOT = 3 // css px per dither cell
const BOX = 16 // cells per box side (48px boxes)
const MS = 600
const BOX_DITHER = 0.3 // share of the swap each box spends dithering

type DocWithVT = Document & { startViewTransition?: (cb: () => Promise<void> | void) => ViewTransition }

/**
 * Whole-page theme swap. 48px boxes switch on at loosely random times (sooner near the
 * toggle); once a box starts it dithers from old to new in Bayer order.
 * `apply` must switch the theme and resolve once the new theme has rendered.
 */
export function themeSwap(origin: DOMRect, apply: () => Promise<void>) {
  const doc = document as DocWithVT
  if (!doc.startViewTransition || prefersReducedMotion()) { void apply(); return }
  if (document.getElementById('dither-swap')) return

  const W = innerWidth, H = innerHeight
  const cols = Math.ceil(W / DOT), rows = Math.ceil(H / DOT), n = cols * rows
  const cx = (origin.left + origin.width / 2) / DOT, cy = (origin.top + origin.height / 2) / DOT
  const far = Math.hypot(Math.max(cx, cols - cx), Math.max(cy, rows - cy))

  const bc = Math.ceil(cols / BOX), br = Math.ceil(rows / BOX), start = new Float32Array(bc * br)
  for (let j = 0; j < br; j++) for (let i = 0; i < bc; i++) {
    const d = Math.hypot(i + 0.5 - cx / BOX, j + 0.5 - cy / BOX) / (far / BOX)
    start[j * bc + i] = 0.6 * Math.min(1, d) + 0.4 * Math.random()
  }
  const T = new Float32Array(n)
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++)
    T[y * cols + x] = (1 - BOX_DITHER) * start[Math.floor(y / BOX) * bc + Math.floor(x / BOX)]
      + BOX_DITHER * (BAYER8[(y & 7) * 8 + (x & 7)] + 0.5) / 64

  const st = document.head.appendChild(document.createElement('style'))
  st.id = 'dither-swap'
  const show = (k: number) => {
    let p = 'M0 0'
    for (let y = 0; y < rows; y++) {
      const row = y * cols
      let x = 0
      while (x < cols) {
        if (T[row + x] > k) { x++; continue }
        const x0 = x
        while (x < cols && T[row + x] <= k) x++
        p += `M${x0 * DOT} ${y * DOT}h${(x - x0) * DOT}v${DOT}h-${(x - x0) * DOT}z`
      }
    }
    st.textContent = '::view-transition{pointer-events:none}'
      + '::view-transition-old(root),::view-transition-new(root){animation:none;mix-blend-mode:normal}'
      + `::view-transition-new(root){clip-path:path('${p}')}`
  }
  show(-1)
  const vt = doc.startViewTransition(apply)
  vt.ready.then(() => {
    document.documentElement.animate({ opacity: [1, 1] }, { duration: MS + 60, pseudoElement: '::view-transition-new(root)' })
    const t0 = performance.now()
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / MS)
      show(k)
      if (k < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }).catch(() => {})
  vt.finished.finally(() => st.remove())
}
