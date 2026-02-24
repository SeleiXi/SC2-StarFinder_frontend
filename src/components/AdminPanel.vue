<template>
    <div class="admin-panel">
        <h1 class="admin-title">管理后台</h1>

        <!-- Tabs -->
        <div class="admin-tabs">
            <button v-for="tab in tabs" :key="tab.key" class="tab-btn" :class="{ active: activeTab === tab.key }"
                @click="activeTab = tab.key">{{ tab.label }}</button>
        </div>

        <!-- ===== Users Tab ===== -->
        <div v-if="activeTab === 'users'" class="tab-content">
            <!-- Edit User Form -->
            <div v-if="editingUser" class="add-form" style="max-width: 600px;">
                <h3>编辑用户: {{ editingUser.email }}</h3>
                <div class="inline-row" style="display:flex; gap:10px; flex-wrap:wrap;">
                    <input v-model="editForm.email" placeholder="邮箱" class="wInput" style="flex:1" disabled />
                </div>
                <div class="inline-row" style="display:flex; gap:10px; flex-wrap:wrap;">
                    <input v-model="editForm.battleTag" placeholder="BattleTag" class="wInput" style="flex:1" />
                    <input v-model="editForm.password" placeholder="新密码 (留空则不修改)" class="wInput" style="flex:1" />
                </div>
                <div class="inline-row" style="display:flex; gap:10px; flex-wrap:wrap;">
                    <input v-model.number="editForm.mmr" placeholder="MMR" type="number" class="wInput" style="flex:1" />
                    <select v-model="editForm.region" class="role-select" style="flex:1; height:48px; margin-top:16px;">
                        <option value="US">US</option>
                        <option value="EU">EU</option>
                        <option value="KR">KR</option>
                        <option value="CN">CN</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button class="btn-success" @click="updateUserData">保存修改</button>
                    <button class="btn-cancel" @click="editingUser = null">取消</button>
                </div>
            </div>

            <div class="admin-table-wrap">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>邮箱</th>
                            <th>BattleTag</th>
                            <th>MMR</th>
                            <th>角色</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="u in users" :key="u.id">
                            <td data-label="ID">{{ u.id }}</td>
                            <td data-label="邮箱">{{ u.email }}</td>
                            <td data-label="BattleTag">{{ u.battleTag }}</td>
                            <td data-label="MMR">{{ u.mmr }}</td>
                            <td data-label="角色">
                                <select :value="u.role || 'user'" @change="changeRole(u, $event.target.value)"
                                    class="role-select" :disabled="u.id === props.user.id">
                                    <option value="user">user</option>
                                    <option value="admin">admin</option>
                                    <option v-if="props.user.role === 'super_admin'" value="super_admin">super_admin</option>
                                </select>
                            </td>
                            <td data-label="操作">
                                <button class="btn-warn btn-sm" @click="startEditUser(u)" style="margin-right:5px">编辑</button>
                                <button class="btn-danger btn-sm" @click="deleteUser(u.id)">删除</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p v-if="users.length === 0" class="empty-msg">暂无用户</p>
            </div>
        </div>

        <!-- ===== Cheaters Tab ===== -->
        <div v-if="activeTab === 'cheaters'" class="tab-content">
            <div class="admin-table-wrap">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>BattleTag</th>
                            <th>外挂类型</th>
                            <th>状态</th>
                            <th>举报人</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="c in cheaters" :key="c.id">
                            <td data-label="ID">{{ c.id }}</td>
                            <td data-label="BattleTag">{{ c.battleTag }}</td>
                            <td data-label="外挂类型">{{ c.cheatType }}</td>
                            <td data-label="状态">
                                <span class="status-badge" :class="c.status">{{ c.status }}</span>
                            </td>
                            <td data-label="举报人">{{ c.reporterId }}</td>
                            <td data-label="操作" class="action-cell">
                                <button v-if="c.status !== 'approved'" class="btn-success btn-sm"
                                    @click="approveCheater(c.id)">通过</button>
                                <button v-if="c.status !== 'rejected'" class="btn-warn btn-sm"
                                    @click="rejectCheater(c.id)">拒绝</button>
                                <button class="btn-danger btn-sm" @click="deleteCheater(c.id)">删除</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p v-if="cheaters.length === 0" class="empty-msg">暂无外挂记录</p>
            </div>
        </div>

        <!-- ===== Events Tab ===== -->
        <div v-if="activeTab === 'events'" class="tab-content">
            <div class="admin-table-wrap">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>标题</th>
                            <th>描述</th>
                            <th>状态</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="e in events" :key="e.id">
                            <td data-label="ID">{{ e.id }}</td>
                            <td data-label="标题">{{ e.title }}</td>
                            <td data-label="描述" class="desc-cell">{{ e.description }}</td>
                            <td data-label="状态">
                                <span class="status-badge" :class="e.status">{{ e.status }}</span>
                            </td>
                            <td data-label="操作" class="action-cell">
                                <button v-if="e.status !== 'approved'" class="btn-success btn-sm"
                                    @click="approveEvent(e.id)">通过</button>
                                <button v-if="e.status !== 'rejected'" class="btn-warn btn-sm"
                                    @click="rejectEvent(e.id)">拒绝</button>
                                <button class="btn-danger btn-sm" @click="deleteEvent(e.id)">删除</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p v-if="events.length === 0" class="empty-msg">暂无赛事</p>
            </div>
        </div>

        <!-- ===== Tutorials Tab ===== -->
        <div v-if="activeTab === 'tutorials'" class="tab-content">
            <!-- Add tutorial form -->
            <div class="add-form" v-if="showTutorialForm">
                <h3>添加教程</h3>
                <input v-model="tForm.title" placeholder="标题" class="wInput" />
                <input v-model="tForm.url" placeholder="视频链接" class="wInput" />
                <input v-model="tForm.category" placeholder="分类 (入门/进阶/精通)" class="wInput" />
                <input v-model="tForm.description" placeholder="简介" class="wInput" />
                <input v-model="tForm.author" placeholder="作者" class="wInput" />
                <div class="form-actions">
                    <button class="btn-success" @click="addTutorial">提交</button>
                    <button class="btn-cancel" @click="showTutorialForm = false">取消</button>
                </div>
            </div>
            <button v-else class="btn-success" @click="showTutorialForm = true" style="margin-bottom:16px">+
                添加教程</button>

            <div class="admin-table-wrap">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>标题</th>
                            <th>分类</th>
                            <th>作者</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="t in tutorials" :key="t.id">
                            <td data-label="ID">{{ t.id }}</td>
                            <td data-label="标题">{{ t.title }}</td>
                            <td data-label="分类">{{ t.category }}</td>
                            <td data-label="作者">{{ t.author }}</td>
                            <td data-label="操作">
                                <button class="btn-danger btn-sm" @click="deleteTutorial(t.id)">删除</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p v-if="tutorials.length === 0" class="empty-msg">暂无教程</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import {
    adminListUsers, adminDeleteUser, adminSetRole, adminUpdateUser,
    adminListCheaters, adminApproveCheater, adminRejectCheater, adminDeleteCheater,
    adminListEvents, adminApproveEvent, adminRejectEvent, adminDeleteEvent,
    adminListTutorials, adminCreateTutorial, adminDeleteTutorial
} from '../api/api.js';

const props = defineProps({ user: Object });

const tabs = [
    { key: 'users', label: '用户管理' },
    { key: 'cheaters', label: '外挂审核' },
    { key: 'events', label: '赛事审核' },
    { key: 'tutorials', label: '教程管理' }
];

const activeTab = ref('users');
const users = ref([]);
const cheaters = ref([]);
const events = ref([]);
const tutorials = ref([]);
const showTutorialForm = ref(false);
const tForm = reactive({ title: '', url: '', category: '', description: '', author: '' });

const editingUser = ref(null);
const editForm = reactive({ email: '', battleTag: '', password: '', mmr: 0, region: 'US' });

function startEditUser(user) {
    editingUser.value = user;
    Object.assign(editForm, {
        email: user.email,
        battleTag: user.battleTag,
        password: '', // Reset password input
        mmr: user.mmr,
        region: user.region || 'US'
    });
}

async function updateUserData() {
    try {
        await adminUpdateUser(editingUser.value.id, { ...editForm }, adminId());
        editingUser.value = null;
        await loadUsers();
    } catch (e) {
        alert(e.response?.data?.msg || '保存失败');
    }
}

const adminId = () => props.user?.id;

async function loadUsers() {
    try { const res = await adminListUsers(adminId()); users.value = res.data?.data || []; } catch (e) { console.error(e); }
}
async function loadCheaters() {
    try { const res = await adminListCheaters(adminId()); cheaters.value = res.data?.data || []; } catch (e) { console.error(e); }
}
async function loadEvents() {
    try { const res = await adminListEvents(adminId()); events.value = res.data?.data || []; } catch (e) { console.error(e); }
}
async function loadTutorials() {
    try { const res = await adminListTutorials(adminId()); tutorials.value = res.data?.data || []; } catch (e) { console.error(e); }
}

async function changeRole(user, role) {
    try { 
        const res = await adminSetRole(user.id, role, adminId()); 
        if (res.data.code === 200) {
            user.role = role; 
        } else {
            alert(res.data.msg || '修改失败');
            await loadUsers(); // Reset view
        }
    } catch (e) { 
        alert(e.response?.data?.msg || '修改失败'); 
        await loadUsers();
    }
}
async function deleteUser(id) {
    if (!confirm('确认删除该用户？')) return;
    try { 
        const res = await adminDeleteUser(id, adminId()); 
        if (res.data.code === 200) {
            await loadUsers(); 
        } else {
            alert(res.data.msg || '删除失败');
        }
    } catch (e) { 
        alert(e.response?.data?.msg || '删除失败'); 
    }
}

async function approveCheater(id) {
    try { await adminApproveCheater(id, adminId()); await loadCheaters(); } catch (e) { alert('操作失败'); }
}
async function rejectCheater(id) {
    try { await adminRejectCheater(id, adminId()); await loadCheaters(); } catch (e) { alert('操作失败'); }
}
async function deleteCheater(id) {
    if (!confirm('确认删除？')) return;
    try { await adminDeleteCheater(id, adminId()); await loadCheaters(); } catch (e) { alert('删除失败'); }
}

async function approveEvent(id) {
    try { await adminApproveEvent(id, adminId()); await loadEvents(); } catch (e) { alert('操作失败'); }
}
async function rejectEvent(id) {
    try { await adminRejectEvent(id, adminId()); await loadEvents(); } catch (e) { alert('操作失败'); }
}
async function deleteEvent(id) {
    if (!confirm('确认删除？')) return;
    try { await adminDeleteEvent(id, adminId()); await loadEvents(); } catch (e) { alert('删除失败'); }
}

async function addTutorial() {
    try {
        await adminCreateTutorial({ ...tForm }, adminId());
        showTutorialForm.value = false;
        Object.assign(tForm, { title: '', url: '', category: '', description: '', author: '' });
        await loadTutorials();
    } catch (e) { alert('添加失败'); }
}
async function deleteTutorial(id) {
    if (!confirm('确认删除？')) return;
    try { await adminDeleteTutorial(id, adminId()); await loadTutorials(); } catch (e) { alert('删除失败'); }
}

function loadTab() {
    if (activeTab.value === 'users') loadUsers();
    else if (activeTab.value === 'cheaters') loadCheaters();
    else if (activeTab.value === 'events') loadEvents();
    else if (activeTab.value === 'tutorials') loadTutorials();
}

watch(activeTab, loadTab);
onMounted(loadTab);
</script>

<style scoped>
.admin-panel {
    color: var(--sc2-text);
}

.admin-title {
    font-family: 'Orbitron', sans-serif;
    font-size: 24px;
    color: var(--sc2-accent);
    margin-bottom: 24px;
    text-shadow: 0 0 20px rgba(0, 180, 216, .3);
}

.admin-tabs {
    display: flex;
    gap: 4px;
    margin-bottom: 24px;
    border-bottom: 1px solid var(--sc2-border);
    padding-bottom: 0;
}

.tab-btn {
    background: none;
    border: none;
    color: var(--sc2-text-dim);
    font-family: 'Rajdhani', sans-serif;
    font-size: 15px;
    font-weight: 600;
    padding: 10px 20px;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: all .2s;
}

.tab-btn:hover {
    color: var(--sc2-text);
}

.tab-btn.active {
    color: var(--sc2-accent);
    border-bottom-color: var(--sc2-accent);
}

.admin-table-wrap {
    overflow-x: auto;
}

.admin-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
}

.admin-table th {
    text-align: left;
    padding: 10px 12px;
    color: var(--sc2-accent);
    font-family: 'Rajdhani', sans-serif;
    font-weight: 600;
    border-bottom: 1px solid var(--sc2-border);
    white-space: nowrap;
}

.admin-table td {
    padding: 10px 12px;
    border-bottom: 1px solid rgba(255, 255, 255, .04);
    vertical-align: middle;
}

.admin-table tbody tr:hover {
    background: rgba(0, 180, 216, .04);
}

.desc-cell {
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.action-cell {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
}

.role-select {
    background: var(--sc2-bg-dark);
    color: var(--sc2-text);
    border: 1px solid var(--sc2-border);
    border-radius: 4px;
    padding: 4px 8px;
    font-size: 13px;
    cursor: pointer;
}

.status-badge {
    padding: 2px 10px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: .5px;
}

.status-badge.approved {
    background: rgba(0, 200, 80, .15);
    color: #00c850;
}

.status-badge.pending {
    background: rgba(255, 180, 0, .15);
    color: #ffb400;
}

.status-badge.rejected {
    background: rgba(255, 60, 60, .15);
    color: #ff3c3c;
}

.btn-sm {
    padding: 4px 12px;
    font-size: 12px;
    border-radius: 4px;
    cursor: pointer;
    border: none;
    font-weight: 600;
}

.btn-success {
    background: rgba(0, 200, 80, .15);
    color: #00c850;
    border: 1px solid rgba(0, 200, 80, .3);
    padding: 6px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
}

.btn-success:hover {
    background: rgba(0, 200, 80, .25);
}

.btn-warn {
    background: rgba(255, 180, 0, .15);
    color: #ffb400;
    border: 1px solid rgba(255, 180, 0, .3);
}

.btn-warn:hover {
    background: rgba(255, 180, 0, .25);
}

.btn-danger {
    background: rgba(255, 60, 60, .15);
    color: #ff3c3c;
    border: 1px solid rgba(255, 60, 60, .3);
}

.btn-danger:hover {
    background: rgba(255, 60, 60, .25);
}

.btn-cancel {
    background: var(--sc2-bg-panel);
    color: var(--sc2-text-dim);
    border: 1px solid var(--sc2-border);
    padding: 6px 16px;
    border-radius: 6px;
    cursor: pointer;
}

.add-form {
    background: var(--sc2-bg-panel);
    border: 1px solid var(--sc2-border);
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 500px;
}

.add-form h3 {
    font-family: 'Rajdhani', sans-serif;
    color: var(--sc2-accent);
    margin: 0 0 8px;
}

.form-actions {
    display: flex;
    gap: 10px;
    margin-top: 8px;
}

.empty-msg {
    text-align: center;
    color: var(--sc2-text-dim);
    padding: 40px 0;
    font-size: 15px;
}

@media (max-width: 768px) {
    .admin-tabs {
        flex-wrap: wrap;
    }

    .tab-btn {
        padding: 8px 14px;
        font-size: 13px;
    }

    .admin-table {
        font-size: 12px;
    }

    .admin-table th,
    .admin-table td {
        padding: 8px 6px;
    }
}

@media (max-width: 480px) {
    .admin-panel {
        padding: 12px;
    }

    .admin-table-wrap {
        -webkit-overflow-scrolling: touch;
    }

    .action-cell {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }

    .admin-table thead {
        display: none;
    }

    .admin-table, .admin-table tbody, .admin-table tr, .admin-table td {
        display: block;
        width: 100%;
    }

    .admin-table td {
        padding: 10px 8px;
        border-bottom: 1px solid rgba(255,255,255,0.03);
    }

    .admin-table td:before {
        content: attr(data-label);
        display: inline-block;
        width: 120px;
        font-weight: 700;
        color: var(--sc2-text-dim);
        margin-right: 8px;
    }
}
</style>
