export function useMicrophone() {
  const active = ref(false)
  const level = ref(0)
  const error = ref('')

  let stream: MediaStream | null = null
  let context: AudioContext | null = null
  let frame = 0

  function stopMeter() {
    if (frame) {
      cancelAnimationFrame(frame)
      frame = 0
    }
    level.value = 0
  }

  function release() {
    stopMeter()
    stream?.getTracks().forEach((track) => track.stop())
    stream = null
    void context?.close()
    context = null
    active.value = false
  }

  async function start() {
    error.value = ''

    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      context = new AudioContext()
      const source = context.createMediaStreamSource(stream)
      const analyser = context.createAnalyser()
      analyser.fftSize = 256
      source.connect(analyser)

      const samples = new Uint8Array(analyser.frequencyBinCount)
      const tick = () => {
        analyser.getByteFrequencyData(samples)
        const total = samples.reduce((sum, value) => sum + value, 0)
        level.value = total / samples.length / 255
        frame = requestAnimationFrame(tick)
      }

      active.value = true
      tick()
    } catch {
      release()
      error.value = 'Microphone access was blocked. Allow it in your browser to start practising.'
    }
  }

  async function toggle() {
    if (active.value) {
      release()
      return
    }
    await start()
  }

  onBeforeUnmount(release)

  return { active, level, error, toggle, release }
}
