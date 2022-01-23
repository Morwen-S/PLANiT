export const WEEKDAY_SHORT_NAME = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
export const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']

export function getStartOfMonth (timestamp) {
  return new Date(timestamp.getFullYear(), timestamp.getMonth(), 1)
}

export function getEndOfMonth (timestamp) {
  return new Date(timestamp.getFullYear(), timestamp.getMonth(), DAYS_IN_MONTH[timestamp.getMonth()])
}

export function getNextDay (timestamp, i = 1) {
  const currentDate = new Date(timestamp.getTime())
  currentDate.setDate(currentDate.getDate() + i)
  return currentDate
}

export function getEndOfDay (timestamp) {
  timestamp.setHours(23, 59, 59, 999)
  return timestamp
}

export function getStartOfDay (timestamp) {
  timestamp.setHours(0, 0, 0, 0)
  return timestamp
}

export function getPreviousDay (timestamp, i = 1) {
  const currentDate = new Date(timestamp.getTime())
  currentDate.setDate(currentDate.getDate() - i)
  return currentDate
}

export function getNextMonth (timestamp) {
  const currentDate = getStartOfMonth(new Date(timestamp.getTime()))
  currentDate.setMonth(currentDate.getMonth() + 1)
  return currentDate
}

export function getPreviousMonth (timestamp) {
  const currentDate = new Date(timestamp.getTime())
  currentDate.setMonth(currentDate.getMonth() - 1)
  return currentDate
}

export function getMonthName (timestamp) {
  return MONTH_NAMES[timestamp.getMonth()]
}

export function getShortMonthName (timestamp) {
  return MONTH_NAMES[timestamp.getMonth()].slice(0, 3).toUpperCase()
}

export function getTimestampDay (day, timestamp) {
  return new Date(timestamp.getFullYear(), timestamp.getMonth(), day)
}

export function getWeekday (timestamp) {
  return timestamp.getDay()
}

export function getShortNameWeekday (timestamp) {
  return WEEKDAY_SHORT_NAME[getWeekday(timestamp)]
}

export function getNameWeekday (timestamp) {
  return WEEKDAY_NAMES[getWeekday(timestamp)]
}

export function weekCount (timestamp) {
  const firstOfMonth = getStartOfMonth(timestamp)
  const lastOfMonth = getEndOfMonth(timestamp)

  const used = DAYS_IN_MONTH[timestamp.getMonth()] + firstOfMonth.getDay() + (6 - lastOfMonth.getDay())

  return Math.ceil(used / 7)
}

export function formatShort (timestamp) {
  const date = timestamp.getDate()
  const month = timestamp.getMonth() + 1
  const year = timestamp.getFullYear()
  return (date < 10 ? '0' : '') + date + '.' + (month < 10 ? '0' : '') + month + '.' + year
}

export function parseToString (timestamp) {
  return `${timestamp.getDate()}-${timestamp.getMonth()}-${timestamp.getFullYear()}`
}

export function getDiffDays (firstDate, secondDate) {
  const oneDay = 24 * 60 * 60 * 1000
  return Math.round(Math.abs((firstDate - secondDate) / oneDay)) + 1
}
