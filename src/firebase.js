import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

import firebaseConfig from '../firebase.config.example'

const firebase = initializeApp(firebaseConfig)
const database = getDatabase(firebase)

export { firebase, database }
