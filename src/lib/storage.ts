import { DB } from './types'

const KEY = 'ember-db-v1'

const empty: DB = { projects: [], ideas: [] }

export function load(): DB {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return empty
    return JSON.parse(raw) as DB
  } catch {
    return empty
  }
}

export function save(db: DB) {
  localStorage.setItem(KEY, JSON.stringify(db))
}

export function reset() {
  localStorage.removeItem(KEY)
}
