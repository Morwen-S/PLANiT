import { database } from '@/firebase'
import { get, child, ref, set, push, update, remove } from 'firebase/database'

import { currentUser } from '@/api/authentication'
import { implementSubscriptions } from '@/services/tasks-service'

let subtasks = []

export async function getUserSubtasks () {
  subtasks = []
  const dbRef = await ref(database)
  try {
    const snapshot = await get(child(dbRef, `subtasks/${currentUser.uid}`))
    if (snapshot.exists()) {
      subtasks = Object.entries(snapshot.val())
        .map(val => {
          const [id, task] = val
          task.id = id
          return task
        })
    }
    return subtasks
  } catch (e) {
    console.log(e)
  }
}

export function getSubTasksByTaskId (taskId) {
  return subtasks
    .filter(subtask => subtask.taskId === taskId)
    .map(subtask => Object.assign({}, subtask))
    .sort((a, b) => a.position - b.position)
}

export async function addSubtask (subtask) {
  let newSubtask = {
    isChecked: false,
    ...subtask
  }
  try {
    const subtaskListRef = await ref(database, `subtasks/${currentUser.uid}`)
    const newSubtaskRef = await push(subtaskListRef)
    const key = newSubtaskRef.key
    await set(newSubtaskRef, newSubtask)

    newSubtask = { ...newSubtask, id: key }
    subtasks.push(newSubtask)
    implementSubscriptions()
    return newSubtask
  } catch (err) {
    console.log(err)
  }
}

export async function deleteSubtask (subtaskId) {
  try {
    const taskRef = ref(database, `subtasks/${currentUser.uid}/${subtaskId}`)
    await remove(taskRef)
    subtasks = subtasks.filter(x => x.id !== subtaskId)
    implementSubscriptions()
  } catch (err) {
    console.log(err)
  }
}

export async function deleteSubtasksInTask (taskId) {
  subtasks = subtasks.filter(task => {
    if (task.taskId === taskId) {
      const taskRef = ref(database, `subtasks/${currentUser.uid}/${task.id}`)
      remove(taskRef)
      return false
    } else {
      return true
    }
  })
}

export async function editSubtask (subtask) {
  const index = subtasks.findIndex(x => x.id === subtask.id)
  if (index >= 0) {
    for (const key in subtask) {
      if (!Object.prototype.hasOwnProperty.call(subtask, key)) {
        continue
      }
      subtasks[index][key] = subtask[key]
    }
  }
  try {
    const key = `subtasks/${currentUser.uid}/${subtasks[index].id}`
    await update(ref(database), { [key]: subtasks[index] })
    implementSubscriptions()
  } catch (err) {
    console.log(err)
  }
  return subtasks[index]
}
