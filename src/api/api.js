import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// ============ User APIs ============

export function register(data) {
    return api.post('/user/register', data);
}

export function login(data) {
    return api.post('/user/login', data);
}

export function loginByCode(email, code) {
    return api.post('/user/login/code', null, { params: { email, code } });
}

export function resetPassword(email, code, newPassword) {
    return api.post('/user/password/reset', null, { params: { email, code, newPassword } });
}

export function sendEmailCode(email) {
    return api.post('/email/send', null, { params: { email } });
}

export function getUserProfile(userId) {
    return api.get(`/user/${userId}`);
}

export function updateProfile(userId, data) {
    return api.put(`/user/${userId}/profile`, data);
}

export function findMatches(mmr, range, race, mode) {
    const params = { mmr, range };
    if (race) params.race = race;
    if (mode) params.mode = mode;
    return api.get('/user/match', { params });
}

export function updateCommander(userId, commander) {
    return api.put(`/user/${userId}/profile`, { commander });
}

// ============ Cheater APIs ============

export function reportCheater(data, userId) {
    return api.post('/cheater/report', data, { params: { userId } });
}

export function getCheaterList() {
    return api.get('/cheater/list');
}

export function searchCheaters(battleTag) {
    return api.get('/cheater/search', { params: { battleTag } });
}

// ============ Tutorial APIs ============

export function getTutorials(category) {
    const params = {};
    if (category) params.category = category;
    return api.get('/tutorial/list', { params });
}

export function createTutorial(data) {
    return api.post('/tutorial', data);
}

// ============ Event APIs ============

export function getEvents() {
    return api.get('/event/list');
}

export function createEvent(data, userId) {
    return api.post('/event', data, { params: { userId } });
}

// ============ SC2 Pulse APIs ============

export function searchSC2Players(name) {
    return api.get('/sc2/search', { params: { name } });
}

export function getSC2MMR(characterId, queue = 'LOTV_1V1') {
    return api.get(`/sc2/mmr/${characterId}`, { params: { queue } });
}

export function getSC2Streams() {
    return api.get('/sc2/streams');
}

// ============ Stream APIs (User-added) ============

export function addStream(data) {
    return api.post('/stream', data);
}

export function listUserStreams() {
    return api.get('/stream/list');
}

export function deleteStream(id, adminId) {
    return api.delete(`/stream/${id}`, { params: { adminId } });
}

// ============ Admin APIs ============

export function adminListUsers(adminId) {
    return api.get('/admin/users', { params: { adminId } });
}

export function adminUpdateUser(id, data, adminId) {
    return api.put(`/admin/users/${id}`, data, { params: { adminId } });
}
export function adminDeleteUser(id, adminId) {
    return api.delete(`/admin/users/${id}`, { params: { adminId } });
}

export function adminSetRole(id, role, adminId) {
    return api.put(`/admin/users/${id}/role`, null, { params: { role, adminId } });
}

export function adminListCheaters(adminId) {
    return api.get('/admin/cheaters', { params: { adminId } });
}

export function adminApproveCheater(id, adminId) {
    return api.put(`/admin/cheaters/${id}/approve`, null, { params: { adminId } });
}

export function adminRejectCheater(id, adminId) {
    return api.put(`/admin/cheaters/${id}/reject`, null, { params: { adminId } });
}

export function adminDeleteCheater(id, adminId) {
    return api.delete(`/admin/cheaters/${id}`, { params: { adminId } });
}

export function adminListEvents(adminId) {
    return api.get('/admin/events', { params: { adminId } });
}

export function adminApproveEvent(id, adminId) {
    return api.put(`/admin/events/${id}/approve`, null, { params: { adminId } });
}

export function adminRejectEvent(id, adminId) {
    return api.put(`/admin/events/${id}/reject`, null, { params: { adminId } });
}

export function adminDeleteEvent(id, adminId) {
    return api.delete(`/admin/events/${id}`, { params: { adminId } });
}

export function adminListTutorials(adminId) {
    return api.get('/admin/tutorials', { params: { adminId } });
}

export function adminCreateTutorial(data, adminId) {
    return api.post('/admin/tutorials', data, { params: { adminId } });
}

export function adminDeleteTutorial(id, adminId) {
    return api.delete(`/admin/tutorials/${id}`, { params: { adminId } });
}

// ============ Auth helpers ============

export function saveUser(user) {
    localStorage.setItem('sc2_user', JSON.stringify(user));
}

export function getStoredUser() {
    const data = localStorage.getItem('sc2_user');
    return data ? JSON.parse(data) : null;
}

export function clearUser() {
    localStorage.removeItem('sc2_user');
}

export default api;
