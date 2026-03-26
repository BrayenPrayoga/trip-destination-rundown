export const parseActivityDateTime = (value) => {
  if (!value) return null

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value
  }

  if (typeof value === 'number') {
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? null : date
  }

  if (typeof value !== 'string') return null

  const raw = value.trim()
  if (!raw) return null

  const fullDateTimeMatch = raw.match(
    /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?$/
  )

  if (fullDateTimeMatch) {
    const [, year, month, day, hour, minute, second = '00'] = fullDateTimeMatch
    const date = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      Number(second),
    )
    return Number.isNaN(date.getTime()) ? null : date
  }

  const dateOnlyMatch = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch
    const date = new Date(Number(year), Number(month) - 1, Number(day))
    return Number.isNaN(date.getTime()) ? null : date
  }

  const parsed = new Date(raw)
  if (!Number.isNaN(parsed.getTime())) return parsed

  const normalized = raw.replace(' ', 'T')
  const fallback = new Date(normalized)
  return Number.isNaN(fallback.getTime()) ? null : fallback
}
