export type ToastKind = 'success' | 'error' | 'info'

export interface ToastOptions {
  description?: string
  /** A single button, e.g. "Send the link again". The toast closes after it runs. */
  action?: { label: string, onClick: () => void }
  /** Milliseconds before it closes. 0 keeps it open until dismissed. */
  duration?: number
}

export interface Toast extends ToastOptions {
  id: number
  kind: ToastKind
  title: string
  duration: number
}

const MAX_VISIBLE = 3
const DEFAULT_DURATION: Record<ToastKind, number> = { success: 4000, info: 5000, error: 7000 }
let nextId = 1

/**
 * Show short messages in the corner of the screen.
 *   const toast = useToast()
 *   toast.success('Changes saved')
 *   toast.error('Couldn’t save', { description: 'Please try again.' })
 * Toasts live in shared state, so they survive a page change (e.g. after logging in).
 */
export function useToast() {
  const toasts = useState<Toast[]>('toasts', () => [])

  function show(kind: ToastKind, title: string, options: ToastOptions = {}) {
    const toast: Toast = {
      ...options,
      id: nextId++,
      kind,
      title,
      // Toasts with a button stay longer so there is time to use it.
      duration: options.duration ?? (options.action ? 9000 : DEFAULT_DURATION[kind]),
    }
    toasts.value = [...toasts.value, toast].slice(-MAX_VISIBLE)
    return toast.id
  }

  function dismiss(id: number) {
    toasts.value = toasts.value.filter((toast) => toast.id !== id)
  }

  return {
    toasts,
    dismiss,
    success: (title: string, options?: ToastOptions) => show('success', title, options),
    error: (title: string, options?: ToastOptions) => show('error', title, options),
    info: (title: string, options?: ToastOptions) => show('info', title, options),
  }
}
