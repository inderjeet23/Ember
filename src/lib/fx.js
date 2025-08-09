import { addDoc, collection, doc, getDoc, onSnapshot, orderBy, query, setDoc, updateDoc, } from 'firebase/firestore';
import { db, ensureUser, isFirebaseEnabled } from './firebase';
import { applyGain, stateFromScore } from './momentum';
export function firebaseAvailable() { return isFirebaseEnabled() && db; }
export async function subscribeProjects(cb) {
    if (!firebaseAvailable())
        throw new Error('Firebase not configured');
    const u = await ensureUser();
    const q = query(collection(db, `users/${u.uid}/projects`), orderBy('updatedAt', 'desc'));
    return onSnapshot(q, (snap) => {
        const items = snap.docs.map(d => {
            const data = d.data();
            return {
                id: d.id, name: data.name, type: data.type,
                momentumScore: data.momentumScore ?? 60,
                state: data.state ?? 'warm',
                createdAt: data.createdAt ?? Date.now(),
                updatedAt: data.updatedAt ?? Date.now(),
                lastTouchedAt: data.lastTouchedAt ?? null,
                lastDailyRecompute: data.lastDailyRecompute ?? null,
                tasks: [], wins: [],
            };
        });
        cb(items);
    });
}
export async function subscribeProject(projectId, cb) {
    if (!firebaseAvailable())
        throw new Error('Firebase not configured');
    const u = await ensureUser();
    const ref = doc(db, `users/${u.uid}/projects/${projectId}`);
    return onSnapshot(ref, (snap) => {
        if (!snap.exists()) {
            cb(null);
            return;
        }
        const data = snap.data();
        cb({
            id: snap.id, name: data.name, type: data.type,
            momentumScore: data.momentumScore ?? 60, state: data.state ?? 'warm',
            createdAt: data.createdAt ?? Date.now(), updatedAt: data.updatedAt ?? Date.now(),
            lastTouchedAt: data.lastTouchedAt ?? null, lastDailyRecompute: data.lastDailyRecompute ?? null,
            tasks: [], wins: [],
        });
    });
}
export async function subscribeTasks(projectId, cb) {
    if (!firebaseAvailable())
        throw new Error('Firebase not configured');
    const u = await ensureUser();
    const q = query(collection(db, `users/${u.uid}/projects/${projectId}/tasks`), orderBy('createdAt', 'asc'));
    return onSnapshot(q, (snap) => {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        cb(items);
    });
}
export async function subscribeWins(projectId, cb) {
    if (!firebaseAvailable())
        throw new Error('Firebase not configured');
    const u = await ensureUser();
    const q = query(collection(db, `users/${u.uid}/projects/${projectId}/wins`), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snap) => {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        cb(items);
    });
}
export async function createProject(name, type) {
    const u = await ensureUser();
    const ref = doc(collection(db, `users/${u.uid}/projects`));
    const now = Date.now();
    await setDoc(ref, { name, type, momentumScore: 60, state: 'warm', createdAt: now, updatedAt: now, lastTouchedAt: null, lastDailyRecompute: null });
    return ref.id;
}
export async function addTask(projectId, name, activate) {
    const u = await ensureUser();
    const tasks = collection(db, `users/${u.uid}/projects/${projectId}/tasks`);
    await addDoc(tasks, { name, isActive: !!activate, isComplete: false, createdAt: Date.now(), completedAt: null });
    await touchProject(projectId);
}
export async function activateTask(projectId, taskId, on) {
    const u = await ensureUser();
    const ref = doc(db, `users/${u.uid}/projects/${projectId}/tasks/${taskId}`);
    await updateDoc(ref, { isActive: on });
    await touchProject(projectId);
}
export async function completeTask(projectId, taskId) {
    const u = await ensureUser();
    const ref = doc(db, `users/${u.uid}/projects/${projectId}/tasks/${taskId}`);
    await updateDoc(ref, { isComplete: true, isActive: false, completedAt: Date.now() });
    await applyGainAndPersist(projectId, 'taskComplete');
}
async function touchProject(projectId) {
    const u = await ensureUser();
    const pref = doc(db, `users/${u.uid}/projects/${projectId}`);
    await updateDoc(pref, { updatedAt: Date.now() });
}
export async function applyGainAndPersist(projectId, kind) {
    const u = await ensureUser();
    const pref = doc(db, `users/${u.uid}/projects/${projectId}`);
    const snap = await getDoc(pref);
    if (!snap.exists())
        return;
    const p = {
        id: snap.id,
        ...snap.data(),
        tasks: [], wins: []
    };
    const win = applyGain(p, kind);
    await updateDoc(pref, {
        momentumScore: p.momentumScore,
        state: p.state,
        lastTouchedAt: Date.now(),
        updatedAt: Date.now()
    });
    const wins = collection(db, `users/${u.uid}/projects/${projectId}/wins`);
    await addDoc(wins, { type: win.type, value: win.value, createdAt: Date.now() });
}
export async function setProjectMomentum(projectId, momentumScore) {
    const u = await ensureUser();
    const pref = doc(db, `users/${u.uid}/projects/${projectId}`);
    await updateDoc(pref, {
        momentumScore,
        state: stateFromScore(momentumScore),
        lastTouchedAt: Date.now(),
        updatedAt: Date.now()
    });
}
