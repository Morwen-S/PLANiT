import { getDiffDays, getEndOfDay, parseToString } from '@/services/date-services'
import { tasks } from '@/api/tasks'

const tasksSubscription = {}
let markFilters = []

export function addMarkFilters (marks) {
  markFilters = marks
  implementSubscriptions()
}

export function subscribeOnTasks (period, componentKey, fn) {
  tasksSubscription[componentKey] = () => fn(getTaskByPeriod(period))
  fn(getTaskByPeriod(period))
}

export function unsubscribeOnTasks (componentKey) {
  delete tasksSubscription[componentKey]
}

export function implementSubscriptions () {
  Object.values(tasksSubscription).forEach(fn => fn())
}

function getTasksList (from, to) {
  if (markFilters.length > 0) {
    console.log(markFilters)
    console.log(tasks)
  }
  return tasks.filter(task => {
    if (markFilters.length > 0 && markFilters.includes(task.markId)) {
      return false
    }
    const startDate = getEndOfDay(new Date(task.startDate))
    const endDate = getEndOfDay(new Date(task.endDate))
    return startDate <= to && endDate >= from
  }).sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
}

function getTaskByPeriod ({ from, to }) {
  from = getEndOfDay(new Date(from))
  to = to ? getEndOfDay(new Date(to)) : from
  const tasksByPeriod = {}

  const tasksListByPeriod = getTasksList(from, to)

  // tasksListByPeriod : { 'ключ даты в формате d-m-YYYY': task }
  tasksListByPeriod.forEach(task => {
    const startDate = getEndOfDay(new Date(task.startDate))
    const endDate = getEndOfDay(new Date(task.endDate))

    let newTask = Object.assign({}, task)

    // eslint-disable-next-line no-unmodified-loop-condition
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const key = parseToString(d)
      const period = getDiffDays(d, endDate)

      newTask = Object.assign({}, newTask)
      newTask.isEmpty = false

      if (parseToString(startDate) === key) {
        const weekday = startDate.getDay()
        newTask.period = period > 7 - weekday ? 7 - weekday : period
      } else if (d >= startDate && d <= endDate) {
        if (d.getDay() === 0) {
          newTask.period = period > 7 ? 7 : period
        } else {
          newTask.period = 1
          newTask.isEmpty = true
        }
      }

      if (!Object.prototype.hasOwnProperty.call(tasksByPeriod, key)) {
        newTask.position = newTask.position ?? 0
        tasksByPeriod[key] = [newTask]
      } else {
        if (!newTask.position) {
          const tasks = tasksByPeriod[key].map(x => x.position)
          let i = 0
          while (tasks.includes(i)) { i++ }
          newTask.position = i
        }
        tasksByPeriod[key].push(newTask)
      }
      tasksByPeriod[key].sort((a, b) => a.position - b.position)
      // newTask : { period: период события на текущей неделе, isEmpty: true - если день входит в период события }
    }
  })
  return tasksByPeriod
}
