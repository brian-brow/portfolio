// 8x8 ordered-dither (Bayer) matrix, values 0..63.
export const BAYER8: number[] = (() => {
  let B = [0]
  for (let n = 1; n < 8; n *= 2) {
    const nb = new Array<number>(4 * n * n)
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      const v = 4 * B[y * n + x]
      nb[y * 2 * n + x] = v
      nb[y * 2 * n + x + n] = v + 2
      nb[(y + n) * 2 * n + x] = v + 3
      nb[(y + n) * 2 * n + x + n] = v + 1
    }
    B = nb
  }
  return B
})()
