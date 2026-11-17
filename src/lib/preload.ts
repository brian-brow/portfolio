const cache = new Map<string, Promise<void>>()

/** Fetch and decode an image once. Resolves when it's ready to paint, or after 1.5s at most. */
export function preload(src: string): Promise<void> {
  if (!cache.has(src)) {
    const im = new Image()
    im.src = src
    cache.set(src, (im.decode ? im.decode() : Promise.resolve()).catch(() => {}))
  }
  return Promise.race([cache.get(src)!, new Promise<void>((r) => setTimeout(r, 1500))])
}
