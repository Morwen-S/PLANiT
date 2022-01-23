import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from 'firebase/auth'

import { firebase } from '@/firebase'

const auth = getAuth(firebase)
const provider = new GoogleAuthProvider()

export function checkIsLogged (fn) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUser = user
    }
    fn(!!currentUser)
  })()
}

export let currentUser = null

export async function signUp ({ email, password }) {
  try {
    const resp = await createUserWithEmailAndPassword(auth, email, password)
    currentUser = resp.user
  } catch (err) {
    throw parseFirebaseError(err.code)
  }
}

export async function signIn ({ email, password }) {
  try {
    const resp = await signInWithEmailAndPassword(auth, email, password)
    currentUser = resp.user
  } catch (err) {
    throw parseFirebaseError(err.code)
  }
}

export async function signInGoogle () {
  try {
    const resp = await signInWithPopup(auth, provider)
    currentUser = resp.user
  } catch (err) {
    throw parseFirebaseError(err.code)
  }
}

export function logOut () {
  signOut(auth)
}

function parseFirebaseError (str) {
  const message = str.replace(/-/g, ' ').slice(5)
  return message.charAt(0).toUpperCase() + message.slice(1).toLowerCase()
}
