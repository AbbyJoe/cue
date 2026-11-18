export function useCamera(video: Ref<HTMLVideoElement | null>) {
  const active = ref(false)
  const error = ref('')

  let stream: MediaStream | null = null

  function release() {
    stream?.getTracks().forEach((track) => track.stop())
    stream = null
    if (video.value) {
      video.value.srcObject = null
    }
    active.value = false
  }

  async function attach() {
    if (!video.value || !stream) {
      return
    }
    video.value.srcObject = stream
    await video.value.play()
  }

  async function start() {
    error.value = ''

    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      active.value = true
      await nextTick()
      await attach()
    } catch {
      release()
      error.value = 'Camera access was blocked. The interview still works without it.'
    }
  }

  async function toggle() {
    if (active.value) {
      release()
      return
    }
    await start()
  }

  watch(video, () => {
    void attach()
  })

  onBeforeUnmount(release)

  return { active, error, toggle, release }
}
