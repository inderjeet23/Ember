import { initializeApp, getApps } from 'firebase/app'
import { getAuth, onAuthStateChanged, signInAnonymously, type User, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore'

export function isFirebaseEnabled(){
  return Boolean(import.meta.env.VITE_FIREBASE_PROJECT_ID)
}

let app = undefined as any
if (isFirebaseEnabled() && !getApps().length) {
  app = initializeApp({
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  })
}

export const auth = app ? getAuth(app) : undefined
export const db = app ? getFirestore(app) : undefined

if (db) {
  enableIndexedDbPersistence(db).catch(()=>{})
}

export async function ensureUser(): Promise<User> {
  if (!auth) throw new Error('Firebase not configured')
  if (auth.currentUser) return auth.currentUser
  return new Promise((res, rej) => onAuthStateChanged(auth, (u) => u ? res(u) : rej('No user signed in')))
}

export async function signInWithGoogle() {
  if (!auth) throw new Error('Firebase not configured')
  const provider = new GoogleAuthProvider()
  await signInWithPopup(auth, provider)
}
