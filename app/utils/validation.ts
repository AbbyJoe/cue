export function isEmail(value: string) {
  return /\S+@\S+\.\S+/.test(value.trim())
}

/** Letters (any script), spaces, hyphens and apostrophes. 1–50 characters. */
export function isName(value: string) {
  const trimmed = value.trim()
  return trimmed.length > 0 && trimmed.length <= 50 && /^[\p{L}\p{M}' -]+$/u.test(trimmed)
}

/** A specific message for a name field, or '' when it is valid. */
export function nameError(value: string, which: 'first' | 'last') {
  const trimmed = value.trim()
  if (!trimmed) {
    return `Enter your ${which} name.`
  }
  if (trimmed.length > 50) {
    return 'Keep it under 50 characters.'
  }
  return isName(trimmed) ? '' : 'Use letters, spaces, hyphens or apostrophes.'
}
