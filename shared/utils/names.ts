// Name rules shared by the browser and the server.

export const NAME_MAX_LENGTH = 50

/** Letters (any script), spaces, hyphens and apostrophes. 1–50 characters. */
export function isName(value: string) {
  const trimmed = value.trim()
  return trimmed.length > 0 && trimmed.length <= NAME_MAX_LENGTH && /^[\p{L}\p{M}' -]+$/u.test(trimmed)
}

/** A specific message for a name field, or '' when it is valid. */
export function nameError(value: string, which: 'first' | 'last') {
  const trimmed = value.trim()
  if (!trimmed) {
    return `Enter your ${which} name.`
  }
  if (trimmed.length > NAME_MAX_LENGTH) {
    return `Keep it under ${NAME_MAX_LENGTH} characters.`
  }
  return isName(trimmed) ? '' : 'Use letters, spaces, hyphens or apostrophes.'
}
