const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#%&*+=?/<>'

/**
 * Cycles through words with an AI-style "decode" transition:
 * characters scramble, then resolve left to right.
 */
export function useScramble(words: string[], hold = 2600) {
  const text = ref(words[0] ?? '')
  let index = 0
  let timer: ReturnType<typeof setTimeout> | undefined

  function decode(target: string, frame = 0) {
    const total = target.length * 2 + 6
    if (frame >= total) {
      text.value = target
      timer = setTimeout(next, hold)
      return
    }
    const resolved = Math.floor((frame / total) * target.length * 1.15)
    text.value = target
      .split('')
      .map((char, i) => {
        if (char === ' ' || i < resolved) {
          return char
        }
        return glyphs[Math.floor(Math.random() * glyphs.length)]
      })
      .join('')
    timer = setTimeout(() => decode(target, frame + 1), 32)
  }

  function next() {
    index = (index + 1) % words.length
    decode(words[index])
  }

  onMounted(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }
    timer = setTimeout(next, hold)
  })

  onBeforeUnmount(() => clearTimeout(timer))

  return text
}
