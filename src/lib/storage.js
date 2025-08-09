const KEY = 'ember-db-v1';
const empty = { projects: [], ideas: [] };
export function load() {
    try {
        const raw = localStorage.getItem(KEY);
        if (!raw)
            return empty;
        return JSON.parse(raw);
    }
    catch {
        return empty;
    }
}
export function save(db) {
    localStorage.setItem(KEY, JSON.stringify(db));
}
export function reset() {
    localStorage.removeItem(KEY);
}
