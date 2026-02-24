import axios from 'axios';

const TOKEN_KEY = 'sc2_token';
const USER_KEY = 'sc2_user';

const api = axios.create({
    baseURL: '/api',
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
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

export function sendEmailCode(email, requireRegistered = false) {
    return api.post('/email/send', null, { params: { email, requireRegistered } });
}

export function getUserProfile(userId) {
    return api.get(`/user/${userId}`);
}

export function updateProfile(userId, data) {
    return api.put(`/user/${userId}/profile`, data);
}

export function findMatches(mmr, range, race, mode, minLevel) {
    const params = { mmr, range };
    if (race) params.race = race;
    if (mode) params.mode = mode;
    if (minLevel !== undefined && minLevel !== null) params.minLevel = minLevel;
    return api.get('/user/match', { params });
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

// ============ Public Reports (挂人区) APIs ============

export function getPublicReports(search) {
    const params = {};
    if (search) params.search = search;
    return api.get('/public-report/list', { params });
}

export function createPublicReport(data) {
    return api.post('/public-report', data);
}

// ============ Coaching APIs ============

export function getCoachingPosts(type) {
    const params = {};
    if (type && type !== 'all') params.type = type;
    return api.get('/coaching/list', { params });
}

export function createCoachingPost(data) {
    return api.post('/coaching', data);
}

// ============ Text Tutorial APIs ============

export function getTextTutorials(category) {
    const params = {};
    if (category) params.category = category;
    return api.get('/text-tutorial/list', { params });
}

export function getTextTutorialCategories() {
    return api.get('/text-tutorial/categories');
}

export function createTextTutorial(data) {
    return api.post('/text-tutorial', data);
}

// ============ Replay APIs ============

export function getReplays(category) {
    const params = {};
    if (category) params.category = category;
    return api.get('/replay/list', { params });
}

export function getTutorialCategories() {
    return api.get('/tutorial/categories');
}

// ============ Clan APIs ============

export function getClanRanking(query = '') {
    return api.get('/clan/ranking', { params: query ? { query } : {} });
}

export function getClanRecruitments() {
    return api.get('/clan/recruitment');
}

export function createClanRecruitment(data) {
    return api.post('/clan/recruitment', data);
}

export function deleteClanRecruitment(id, userId) {
    return api.delete(`/clan/recruitment/${id}`, { params: { userId } });
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
    // Backward compatibility:
    // - Old: saveUser(User)
    // - New: saveUser({ user: User, token: string })
    if (user && user.user && user.token) {
        localStorage.setItem(USER_KEY, JSON.stringify(user.user));
        localStorage.setItem(TOKEN_KEY, user.token);
        return;
    }
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getStoredUser() {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
}

export function getStoredToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function clearUser() {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
}

export default api;
