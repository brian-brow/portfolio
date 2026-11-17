import { BAYER8 } from './bayer'

const HIDDEN = "path('M0 0')"

export interface WipeOptions {
  out?: boolean // false: reveal el; true: erase it
  ms?: number
  dot?: number // css px per cell
  edge?: number // width of the dithered band (0..1)
  done?: () => void
}

const running = new WeakMap<HTMLElement, number>()

/**
 * Sweeps a dithered band across `el` from the left by clipping it to the cells that are
 * currently shown. Each cell's turn = its x position blended with its Bayer threshold.
 */
export function ditherWipe(el: HTMLElement, { out = false, ms = 300, dot = 2, edge = 0.45, done }: WipeOptions = {}) {
  cancelWipe(el)
  const W = el.offsetWidth, H = el.offsetHeight
  if (!W || !H) { el.style.clipPath = out ? HIDDEN : ''; done?.(); return }
  const cols = Math.ceil(W / dot), rows = Math.ceil(H / dot)
  const T = new Float32Array(cols * rows)
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++)
    T[y * cols + x] = (1 - edge) * (x / cols) + edge * (BAYER8[(y & 7) * 8 + (x & 7)] + 0.5) / 64

  const show = (k: number) => {
    let p = 'M0 0'
    for (let y = 0; y < rows; y++) {
      const row = y * cols
      let x = 0
      while (x < cols) {
        if ((T[row + x] <= k) === out) { x++; continue }
        const x0 = x
        while (x < cols && (T[row + x] <= k) !== out) x++
        p += `M${x0 * dot} ${y * dot}h${(x - x0) * dot}v${dot}h-${(x - x0) * dot}z`
      }
    }
    el.style.clipPath = `path('${p}')`
  }
  show(-1)
  const t0 = performance.now()
  const step = (now: number) => {
    const k = Math.min(1, (now - t0) / ms)
    if (k >= 1) { running.delete(el); el.style.clipPath = out ? HIDDEN : ''; done?.(); return }
    show(k)
    running.set(el, requestAnimationFrame(step))
  }
  running.set(el, requestAnimationFrame(step))
}

export function cancelWipe(el: HTMLElement) {
  const id = running.get(el)
  if (id) cancelAnimationFrame(id)
  running.delete(el)
}

export const hide = (el: HTMLElement) => { el.style.clipPath = HIDDEN }
