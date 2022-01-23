import { get, child, ref, set, push, update, remove } from 'firebase/database'
import { database } from '@/firebase'

import { currentUser } from '@/api/authentication'
import { deleteSubtasksInTask } from '@/api/subtask'
import { implementSubscriptions } from '@/services/tasks-service'

export let tasks = []

export async function getTasks () {
  tasks = []
  const dbRef = await ref(database)
  try {
    const snapshot = await get(child(dbRef, `tasks/${currentUser.uid}`))
    if (snapshot.exists()) {
      tasks = Object.entries(snapshot.val())
        .map(val => {
          const [id, task] = val
          task.id = id
          return task
        })
    }
  } catch (e) {
    console.log(e)
  }
}

export function getTaskById (id) {
  const task = tasks.find(x => x.id === id)
  return task ? Object.assign({}, task) : null
}

export async function addTask (task) {
  let newTask = {
    createdDate: Date.now(),
    isChecked: false,
    userId: currentUser.uid,
    ...task
  }
  try {
    const taskListRef = await ref(database, `tasks/${currentUser.uid}`)
    const newTaskRef = await push(taskListRef)
    const key = newTaskRef.key
    await set(newTaskRef, newTask)

    newTask = { ...newTask, id: key }
    tasks.push(newTask)
    implementSubscriptions()
    return newTask
  } catch (err) {
    console.log(err)
  }
}

export async function deleteTask (taskId) {
  try {
    const taskRef = ref(database, `tasks/${currentUser.uid}/${taskId}`)
    await remove(taskRef)
    await deleteSubtasksInTask(taskId)
    tasks = tasks.filter(x => x.id !== taskId)
    implementSubscriptions()
  } catch (err) {
    console.log(err)
  }
}

export async function deleteTasksInMark (markId) {
  tasks = tasks.filter(task => {
    if (task.markId === markId) {
      deleteSubtasksInTask(task.id)
      const taskRef = ref(database, `tasks/${currentUser.uid}/${task.id}`)
      remove(taskRef)
      return false
    } else {
      return true
    }
  })
  implementSubscriptions()
}

export async function saveChanges (task) {
  const currentTask = tasks.find(x => x.id === task.id)
  for (const key in task) {
    if (!Object.prototype.hasOwnProperty.call(task, key)) {
      continue
    }
    if (key === 'startDate' || key === 'endDate' || key === 'createdDate') {
      currentTask[key] = new Date(task[key]).getTime()
    }
    currentTask[key] = task[key]
  }

  try {
    const key = `tasks/${currentUser.uid}/${currentTask.id}`
    await update(ref(database), { [key]: currentTask })
    implementSubscriptions()
  } catch (err) {
    console.log(err)
  }
}
