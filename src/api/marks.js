import { child, get, push, ref, remove, set, update } from 'firebase/database'
import { database } from '@/firebase'
import { currentUser } from '@/api/authentication'
import { deleteTasksInMark } from '@/api/tasks'

export let marks = []

export function getMarks () {
  return marks
}

export function getMarkById (id) {
  id = id || getFirstMarkId()
  return marks.find(x => x.id === id)
}

export function getFirstMarkId () {
  if (marks.length > 0) {
    return marks[0].id
  }
  return null
}

export async function getUserMarks () {
  marks = []
  const dbRef = await ref(database)
  try {
    const snapshot = await get(child(dbRef, `marks/${currentUser.uid}`))
    if (snapshot.exists()) {
      marks = Object.entries(snapshot.val())
        .map(val => {
          const [id, event] = val
          event.id = id
          return event
        })
    } else {
      await addMark({
        color: '#91c9f6',
        text: 'Default'
      })
    }
    return marks
  } catch (e) {
    console.log(e)
  }
}

export async function addMark (mark) {
  try {
    const marksListRef = await ref(database, `marks/${currentUser.uid}`)
    const newMarkRef = await push(marksListRef)
    const key = newMarkRef.key
    await set(newMarkRef, mark)

    const newMark = { ...mark, id: key }
    marks.push(newMark)
    return newMark
  } catch (err) {
    console.log(err)
  }
}

export async function deleteMark (markId) {
  try {
    const marksListRef = ref(database, `marks/${currentUser.uid}/${markId}`)
    await remove(marksListRef)
    await deleteTasksInMark(markId)
    marks = marks.filter(x => x.id !== markId)
  } catch (err) {
    console.log(err)
  }
}

export async function editMark (mark) {
  const index = marks.findIndex(x => x.id === mark.id)
  if (index >= 0) {
    for (const key in mark) {
      if (!Object.prototype.hasOwnProperty.call(mark, key)) {
        continue
      }
      marks[index][key] = mark[key]
    }
  }
  try {
    const key = `marks/${currentUser.uid}/${marks[index].id}`
    await update(ref(database), { [key]: marks[index] })
  } catch (err) {
    console.log(err)
  }
  return marks[index]
}
