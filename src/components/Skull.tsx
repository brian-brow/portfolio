import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import type { Theme } from '../theme'
import { prefersReducedMotion } from '../theme'
import { cancelWipe, ditherWipe, hide } from '../lib/ditherWipe'

// The dithered image is 260x324; the cigarette tip sits at about (208, 190).
const IMG_W = 260, IMG_H = 324
const TIP = { x: 208, y: 190 }

const TYPE_MS = 90 // per character, faster for long lines
const HOLD_MS = 1000
const OUT_MS = 300

export interface SkullHandle { say: (text: string) => void }

export const Skull = forwardRef<SkullHandle, { theme: Theme }>(function Skull({ theme }, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const speechRef = useRef<HTMLDivElement>(null)
  const themeRef = useRef(theme)
  themeRef.current = theme
  const [said, setSaid] = useState('')
  const timers = useRef<{ type?: number; hold?: number }>({})

  // Embers: every few seconds, 1–5 dither-sized pixels drift up and right off the tip and fade.
  useEffect(() => {
    if (prefersReducedMotion()) return
    type Ember = { x: number; y: number; vx: number; vy: number; age: number; life: number }
    let embers: Ember[] = []
    let spawnT = 0, raf = 0, last = 0
    const schedule = () => {
      spawnT = window.setTimeout(() => {
        const n = 1 + Math.floor(Math.random() * 5)
        for (let i = 0; i < n; i++) embers.push({
          x: TIP.x + Math.random() * 3, y: TIP.y + Math.random() * 3,
          vx: 0.04 + Math.random() * 0.08, vy: -(0.08 + Math.random() * 0.1), age: 0, life: 40 + Math.random() * 40,
        })
        schedule()
      }, 2500 + Math.random() * 6000)
    }
    const draw = (t: number) => {
      raf = requestAnimationFrame(draw)
      if (t - last < 50) return
      last = t
      const el = canvasRef.current
      if (!el) return
      const W = el.clientWidth, H = el.clientHeight
      if (!W || !H) return
      const dpr = devicePixelRatio || 1
      if (el.width !== Math.round(W * dpr) || el.height !== Math.round(H * dpr)) { el.width = Math.round(W * dpr); el.height = Math.round(H * dpr) }
      const ctx = el.getContext('2d')!
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, W, H)
      const sc = Math.max(W / IMG_W, H / IMG_H), ox = (W - IMG_W * sc) / 2, oy = (H - IMG_H * sc) / 2
      const C = themeRef.current.embers
      embers = embers.filter((e) => {
        e.age++
        e.x += e.vx + (Math.random() - 0.5) * 0.06
        e.y += e.vy
        if (e.age > e.life) return false
        const k = e.age / e.life
        if (k > 0.75 && Math.random() < 0.4) return true // flicker
        ctx.fillStyle = C[k < 0.3 ? 0 : k < 0.6 ? 1 : 2]
        ctx.fillRect(Math.round(ox + Math.floor(e.x) * sc), Math.round(oy + Math.floor(e.y) * sc), Math.ceil(sc), Math.ceil(sc))
        return true
      })
    }
    schedule()
    raf = requestAnimationFrame(draw)
    return () => { clearTimeout(spawnT); cancelAnimationFrame(raf) }
  }, [])

  // Speech: types out a character at a time (Jump King style), holds, then dithers away from the left.
  useImperativeHandle(ref, () => ({
    say(text: string) {
      const el = speechRef.current
      if (!el) return
      clearInterval(timers.current.type)
      clearTimeout(timers.current.hold)
      cancelWipe(el)
      hide(el) // stay clipped until the first character lands
      setSaid('')
      const out = () => ditherWipe(el, { out: true, ms: OUT_MS, done: () => setSaid('') })
      if (prefersReducedMotion()) {
        setSaid(text); el.style.clipPath = ''
        timers.current.hold = window.setTimeout(() => { hide(el); setSaid('') }, HOLD_MS + 40 * text.length)
        return
      }
      let n = 0
      timers.current.type = window.setInterval(() => {
        n++
        setSaid(text.slice(0, n))
        if (n === 1) requestAnimationFrame(() => { el.style.clipPath = '' })
        if (n >= text.length) {
          clearInterval(timers.current.type)
          timers.current.hold = window.setTimeout(out, HOLD_MS + 40 * text.length)
        }
      }, Math.max(35, Math.min(TYPE_MS, 1500 / text.length)))
    },
  }), [])

  useEffect(() => () => { clearInterval(timers.current.type); clearTimeout(timers.current.hold) }, [])

  return (
    <div className="skull">
      <img src={theme.skull} alt="Dithered Vincent van Gogh painting, Head of a Skeleton with a Burning Cigarette" />
      <canvas ref={canvasRef} aria-hidden="true" />
      <div className="speech" ref={speechRef} aria-hidden="true" style={{ clipPath: "path('M0 0')" }}>
        <div style={{ color: theme.name }}>{said}</div>
      </div>
    </div>
  )
})
