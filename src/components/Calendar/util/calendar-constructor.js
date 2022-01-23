import {
  DAYS_IN_MONTH,
  getShortMonthName,
  getStartOfMonth,
  getEndOfMonth,
  getWeekday,
  getPreviousDay,
  getTimestampDay,
  getNextDay,
  parseToString
} from '@/services/date-services'

function createDayObj (timestamp, isDiffMonth = false) {
  return {
    timestamp,
    date: (isDiffMonth ? getShortMonthName(timestamp) + ' ' : '') + timestamp.getDate(),
    dateKey: parseToString(timestamp)
  }
}

export function getDayListForMonth (timestamp) {
  const dayList = []
  const currentDay = (new Date()).toString().slice(0, 15)

  const startWeekday = getStartOfMonth(timestamp)
  const endWeekday = getEndOfMonth(timestamp)

  for (let i = 1; i <= getWeekday(startWeekday); i++) {
    const day = createDayObj(getPreviousDay(startWeekday, i), true)
    dayList.push(day)
  }
  dayList.reverse()

  for (let i = 1; i <= DAYS_IN_MONTH[timestamp.getMonth()]; i++) {
    const day = createDayObj(getTimestampDay(i, timestamp))
    if (day.timestamp.toString().slice(0, 15) === currentDay) {
      day.isCurrent = true
    }
    dayList.push(day)
  }

  for (let i = 1; i <= 6 - getWeekday(endWeekday); i++) {
    const day = createDayObj(getNextDay(endWeekday, i), true)
    dayList.push(day)
  }
  const rows = Math.ceil(dayList.length / 7)
  const dayListByRow = []

  for (let i = 1; i <= rows; i++) {
    dayListByRow.push(dayList.splice(0, 7))
  }
  return dayListByRow
}
