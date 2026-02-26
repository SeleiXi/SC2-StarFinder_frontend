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
                            <td data-label="举报人">{{ c.reportedBy }}</td>
                            <td data-label="操作" class="action-cell">
                                <button v-if="c.status !== 'approved'" class="btn-success btn-sm"
                                    @click="approveCheater(c.id)">通过</button>
                                <button v-if="c.status !== 'rejected'" class="btn-warn btn-sm"
                                    @click="rejectCheater(c.id)">拒绝</button>
                                <button class="btn-info btn-sm" @click="openEdit('cheaters', c)">编辑</button>
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
                                <button class="btn-info btn-sm" @click="openEdit('events', e)">编辑</button>
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
                                <button class="btn-info btn-sm" @click="openEdit('tutorials', t)" style="margin-right:4px">编辑</button>
                                <button class="btn-danger btn-sm" @click="deleteTutorial(t.id)">删除</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p v-if="tutorials.length === 0" class="empty-msg">暂无教程</p>
            </div>
        </div>

        <!-- ===== Streams Tab ===== -->
        <div v-if="activeTab === 'streams'" class="tab-content">
            <div class="admin-table-wrap">
                <table class="admin-table">
                    <thead><tr><th>ID</th><th>名称</th><th>BattleTag</th><th>平台</th><th>链接</th><th>操作</th></tr></thead>
                    <tbody>
                        <tr v-for="s in streams" :key="s.id">
                            <td>{{ s.id }}</td>
                            <td>{{ s.name }}</td>
                            <td>{{ s.battleTag }}</td>
                            <td>{{ s.platform }}</td>
                            <td><a :href="s.streamUrl" target="_blank" class="link-cell">查看</a></td>
                            <td class="action-cell">
                                <button class="btn-info btn-sm" @click="openEdit('streams', s)" style="margin-right:4px">编辑</button>
                                <button class="btn-danger btn-sm" @click="deleteStream(s.id)">删除</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p v-if="streams.length === 0" class="empty-msg">暂无直播</p>
            </div>
        </div>

        <!-- ===== Clan Recruitments Tab ===== -->
        <div v-if="activeTab === 'clans'" class="tab-content">
            <div class="admin-table-wrap">
                <table class="admin-table">
                    <thead><tr><th>ID</th><th>战队名</th><th>标签</th><th>MMR要求</th><th>作者</th><th>操作</th></tr></thead>
                    <tbody>
                        <tr v-for="c in clanRecruitments" :key="c.id">
                            <td>{{ c.id }}</td>
                            <td>{{ c.clanName }}</td>
                            <td>{{ c.clanTag }}</td>
                            <td>{{ c.minMmr }}~{{ c.maxMmr }}</td>
                            <td>{{ c.authorTag || c.userId }}</td>
                            <td class="action-cell">
                                <button class="btn-info btn-sm" @click="openEdit('clans', c)" style="margin-right:4px">编辑</button>
                                <button class="btn-danger btn-sm" @click="deleteClan(c.id)">删除</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p v-if="clanRecruitments.length === 0" class="empty-msg">暂无招募</p>
            </div>
        </div>

        <!-- ===== Coaching Posts Tab ===== -->
        <div v-if="activeTab === 'coaching'" class="tab-content">
            <div class="admin-table-wrap">
                <table class="admin-table">
                    <thead><tr><th>ID</th><th>标题</th><th>类型</th><th>种族</th><th>价格</th><th>作者</th><th>操作</th></tr></thead>
                    <tbody>
                        <tr v-for="cp in coachingPosts" :key="cp.id">
                            <td>{{ cp.id }}</td>
                            <td>{{ cp.title }}</td>
                            <td>{{ cp.postType }}</td>
                            <td>{{ cp.race }}</td>
                            <td>{{ cp.priceInfo }}</td>
                            <td>{{ cp.authorTag || cp.userId }}</td>
                            <td class="action-cell">
                                <button class="btn-info btn-sm" @click="openEdit('coaching', cp)" style="margin-right:4px">编辑</button>
                                <button class="btn-danger btn-sm" @click="deleteCoaching(cp.id)">删除</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p v-if="coachingPosts.length === 0" class="empty-msg">暂无教练帖</p>
            </div>
        </div>

        <!-- ===== Public Reports Tab ===== -->
        <div v-if="activeTab === 'public-reports'" class="tab-content">
            <div class="admin-table-wrap">
                <table class="admin-table">
                    <thead><tr><th>ID</th><th>游戏ID</th><th>MMR范围</th><th>描述</th><th>举报人</th><th>操作</th></tr></thead>
                    <tbody>
                        <tr v-for="r in publicReports" :key="r.id">
                            <td>{{ r.id }}</td>
                            <td>{{ r.gameId }}</td>
                            <td>{{ r.mmrMin }}~{{ r.mmrMax }}</td>
                            <td class="desc-cell">{{ r.description }}</td>
                            <td>{{ r.reportedById }}</td>
                            <td class="action-cell">
                                <button class="btn-info btn-sm" @click="openEdit('public-reports', r)" style="margin-right:4px">编辑</button>
                                <button class="btn-danger btn-sm" @click="deletePublicReport(r.id)">删除</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p v-if="publicReports.length === 0" class="empty-msg">暂无公开报告</p>
            </div>
        </div>

        <!-- ===== Text Tutorials Tab ===== -->
        <div v-if="activeTab === 'text-tutorials'" class="tab-content">
            <div class="admin-table-wrap">
                <table class="admin-table">
                    <thead><tr><th>ID</th><th>标题</th><th>作者</th><th>分类</th><th>操作</th></tr></thead>
                    <tbody>
                        <tr v-for="tt in textTutorials" :key="tt.id">
                            <td>{{ tt.id }}</td>
                            <td>{{ tt.title }}</td>
                            <td>{{ tt.authorTag }}</td>
                            <td>{{ tt.category }}</td>
                            <td class="action-cell">
                                <button class="btn-info btn-sm" @click="openEdit('text-tutorials', tt)" style="margin-right:4px">编辑</button>
                                <button class="btn-danger btn-sm" @click="deleteTextTutorial(tt.id)">删除</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p v-if="textTutorials.length === 0" class="empty-msg">暂无文字教程</p>
            </div>
        </div>

        <!-- ===== Replays Tab ===== -->
        <div v-if="activeTab === 'replays'" class="tab-content">
            <div class="admin-table-wrap">
                <table class="admin-table">
                    <thead><tr><th>ID</th><th>标题</th><th>文件名</th><th>分类</th><th>大小</th><th>操作</th></tr></thead>
                    <tbody>
                        <tr v-for="rp in replays" :key="rp.id">
                            <td>{{ rp.id }}</td>
                            <td>{{ rp.title }}</td>
                            <td>{{ rp.fileName }}</td>
                            <td>{{ rp.category }}</td>
                            <td>{{ rp.fileSize ? (rp.fileSize / 1024).toFixed(1) + 'KB' : '-' }}</td>
                            <td class="action-cell">
                                <button class="btn-info btn-sm" @click="openEdit('replays', rp)" style="margin-right:4px">编辑</button>
                                <button class="btn-danger btn-sm" @click="deleteReplay(rp.id)">删除</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p v-if="replays.length === 0" class="empty-msg">暂无录像</p>
            </div>
        </div>

        <!-- ===== Universal Edit Modal ===== -->
        <div class="edit-overlay" v-if="editModalVisible" @click.self="closeEditModal">
            <div class="edit-modal">
                <h3 class="modal-title">编辑记录 #{{ editModalForm.id }}</h3>

                <!-- Cheater fields -->
                <template v-if="editModalTab === 'cheaters'">
                    <label class="modal-label">BattleTag</label>
                    <input v-model="editModalForm.battleTag" class="wInput" />
                    <label class="modal-label">外挂类型</label>
                    <input v-model="editModalForm.cheatType" class="wInput" />
                    <label class="modal-label">描述</label>
                    <textarea v-model="editModalForm.description" class="wInput" rows="3"></textarea>
                    <label class="modal-label">状态</label>
                    <select v-model="editModalForm.status" class="wInput">
                        <option value="pending">待审核</option>
                        <option value="approved">已通过</option>
                        <option value="rejected">已拒绝</option>
                    </select>
                    <label class="modal-label">MMR</label>
                    <input v-model.number="editModalForm.mmr" type="number" class="wInput" />
                    <label class="modal-label">种族</label>
                    <input v-model="editModalForm.race" class="wInput" />
                </template>

                <!-- Event fields -->
                <template v-if="editModalTab === 'events'">
                    <label class="modal-label">标题</label>
                    <input v-model="editModalForm.title" class="wInput" />
                    <label class="modal-label">描述</label>
                    <textarea v-model="editModalForm.description" class="wInput" rows="2"></textarea>
                    <label class="modal-label">规则</label>
                    <textarea v-model="editModalForm.rules" class="wInput" rows="2"></textarea>
                    <label class="modal-label">奖励</label>
                    <input v-model="editModalForm.rewards" class="wInput" />
                    <label class="modal-label">联系链接</label>
                    <input v-model="editModalForm.contactLink" class="wInput" />
                    <label class="modal-label">群组链接</label>
                    <input v-model="editModalForm.groupLink" class="wInput" />
                    <label class="modal-label">状态</label>
                    <select v-model="editModalForm.status" class="wInput">
                        <option value="pending">待审核</option>
                        <option value="approved">已通过</option>
                        <option value="rejected">已拒绝</option>
                    </select>
                    <label class="modal-label">地区</label>
                    <input v-model="editModalForm.region" class="wInput" />
                    <label class="modal-label">开始时间</label>
                    <input v-model="editModalForm.startTime" class="wInput" />
                </template>

                <!-- Tutorial fields -->
                <template v-if="editModalTab === 'tutorials'">
                    <label class="modal-label">标题</label>
                    <input v-model="editModalForm.title" class="wInput" />
                    <label class="modal-label">视频链接</label>
                    <input v-model="editModalForm.url" class="wInput" />
                    <label class="modal-label">分类</label>
                    <input v-model="editModalForm.category" class="wInput" />
                    <label class="modal-label">简介</label>
                    <textarea v-model="editModalForm.description" class="wInput" rows="2"></textarea>
                    <label class="modal-label">作者</label>
                    <input v-model="editModalForm.author" class="wInput" />
                </template>

                <!-- Stream fields -->
                <template v-if="editModalTab === 'streams'">
                    <label class="modal-label">名称</label>
                    <input v-model="editModalForm.name" class="wInput" />
                    <label class="modal-label">直播链接</label>
                    <input v-model="editModalForm.streamUrl" class="wInput" />
                    <label class="modal-label">平台</label>
                    <input v-model="editModalForm.platform" class="wInput" />
                    <label class="modal-label">描述</label>
                    <textarea v-model="editModalForm.description" class="wInput" rows="2"></textarea>
                    <label class="modal-label">MMR</label>
                    <input v-model.number="editModalForm.mmr" type="number" class="wInput" />
                    <label class="modal-label">种族</label>
                    <input v-model="editModalForm.race" class="wInput" />
                </template>

                <!-- Clan Recruitment fields -->
                <template v-if="editModalTab === 'clans'">
                    <label class="modal-label">战队名</label>
                    <input v-model="editModalForm.clanName" class="wInput" />
                    <label class="modal-label">战队标签</label>
                    <input v-model="editModalForm.clanTag" class="wInput" />
                    <label class="modal-label">地区</label>
                    <input v-model="editModalForm.region" class="wInput" />
                    <label class="modal-label">最低 MMR</label>
                    <input v-model.number="editModalForm.minMmr" type="number" class="wInput" />
                    <label class="modal-label">最高 MMR</label>
                    <input v-model.number="editModalForm.maxMmr" type="number" class="wInput" />
                    <label class="modal-label">描述</label>
                    <textarea v-model="editModalForm.description" class="wInput" rows="2"></textarea>
                    <label class="modal-label">联系方式</label>
                    <input v-model="editModalForm.contact" class="wInput" />
                </template>

                <!-- Coaching Post fields -->
                <template v-if="editModalTab === 'coaching'">
                    <label class="modal-label">标题</label>
                    <input v-model="editModalForm.title" class="wInput" />
                    <label class="modal-label">类型</label>
                    <select v-model="editModalForm.postType" class="wInput">
                        <option value="coach">寻求教练</option>
                        <option value="student">寻求学员</option>
                    </select>
                    <label class="modal-label">种族</label>
                    <input v-model="editModalForm.race" class="wInput" />
                    <label class="modal-label">MMR</label>
                    <input v-model.number="editModalForm.mmr" type="number" class="wInput" />
                    <label class="modal-label">价格/报酬说明</label>
                    <input v-model="editModalForm.priceInfo" class="wInput" />
                    <label class="modal-label">联系方式</label>
                    <input v-model="editModalForm.contact" class="wInput" />
                    <label class="modal-label">描述</label>
                    <textarea v-model="editModalForm.description" class="wInput" rows="2"></textarea>
                </template>

                <!-- Public Report fields -->
                <template v-if="editModalTab === 'public-reports'">
                    <label class="modal-label">游戏 ID</label>
                    <input v-model="editModalForm.gameId" class="wInput" />
                    <label class="modal-label">最低 MMR</label>
                    <input v-model.number="editModalForm.mmrMin" type="number" class="wInput" />
                    <label class="modal-label">最高 MMR</label>
                    <input v-model.number="editModalForm.mmrMax" type="number" class="wInput" />
                    <label class="modal-label">描述</label>
                    <textarea v-model="editModalForm.description" class="wInput" rows="3"></textarea>
                </template>

                <!-- Text Tutorial fields -->
                <template v-if="editModalTab === 'text-tutorials'">
                    <label class="modal-label">标题</label>
                    <input v-model="editModalForm.title" class="wInput" />
                    <label class="modal-label">分类</label>
                    <input v-model="editModalForm.category" class="wInput" />
                    <label class="modal-label">作者 Tag</label>
                    <input v-model="editModalForm.authorTag" class="wInput" />
                    <label class="modal-label">内容</label>
                    <textarea v-model="editModalForm.content" class="wInput" rows="6"></textarea>
                </template>

                <!-- Replay fields -->
                <template v-if="editModalTab === 'replays'">
                    <label class="modal-label">标题</label>
                    <input v-model="editModalForm.title" class="wInput" />
                    <label class="modal-label">分类</label>
                    <input v-model="editModalForm.category" class="wInput" />
                    <label class="modal-label">描述</label>
                    <textarea v-model="editModalForm.description" class="wInput" rows="3"></textarea>
                </template>

                <p v-if="editError" class="err-text">{{ editError }}</p>
                <div class="form-actions">
                    <button class="btn-success" @click="saveEditModal" :disabled="editSaving">{{ editSaving ? '保存中...' : '保存修改' }}</button>
                    <button class="btn-cancel" @click="closeEditModal">取消</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import {
    adminListUsers, adminDeleteUser, adminSetRole, adminUpdateUser,
    adminListCheaters, adminApproveCheater, adminRejectCheater, adminDeleteCheater, adminUpdateCheater,
    adminListEvents, adminApproveEvent, adminRejectEvent, adminDeleteEvent, adminUpdateEvent,
    adminListTutorials, adminCreateTutorial, adminDeleteTutorial, adminUpdateTutorial,
    adminListStreams, adminDeleteStream, adminUpdateStream,
    adminListClanRecruitments, adminDeleteClanRecruitment, adminUpdateClanRecruitment,
    adminListCoachingPosts, adminDeleteCoachingPost, adminUpdateCoachingPost,
    adminListPublicReports, adminDeletePublicReport, adminUpdatePublicReport,
    adminListTextTutorials, adminDeleteTextTutorial, adminUpdateTextTutorial,
    adminListReplays, adminDeleteReplay, adminUpdateReplay
} from '../api/api.js';

const props = defineProps({ user: Object });

const tabs = [
    { key: 'users', label: '用户管理' },
    { key: 'cheaters', label: '外挂审核' },
    { key: 'events', label: '赛事审核' },
    { key: 'tutorials', label: '教程管理' },
    { key: 'streams', label: '直播管理' },
    { key: 'clans', label: '战队招募' },
    { key: 'coaching', label: '教练帖' },
    { key: 'public-reports', label: '公开报告' },
    { key: 'text-tutorials', label: '文字教程' },
    { key: 'replays', label: '录像管理' }
];

const activeTab = ref('users');
const users = ref([]);
const cheaters = ref([]);
const events = ref([]);
const tutorials = ref([]);
const streams = ref([]);
const clanRecruitments = ref([]);
const coachingPosts = ref([]);
const publicReports = ref([]);
const textTutorials = ref([]);
const replays = ref([]);
const showTutorialForm = ref(false);
const tForm = reactive({ title: '', url: '', category: '', description: '', author: '' });

const editingUser = ref(null);
const editForm = reactive({ email: '', battleTag: '', password: '', mmr: 0, region: 'US' });

// ===== Universal Edit Modal =====
const editModalVisible = ref(false);
const editModalTab = ref('');
const editModalForm = reactive({});
const editSaving = ref(false);
const editError = ref('');

function openEdit(tab, item) {
    editModalTab.value = tab;
    Object.keys(editModalForm).forEach(k => delete editModalForm[k]);
    Object.assign(editModalForm, JSON.parse(JSON.stringify(item)));
    editError.value = '';
    editModalVisible.value = true;
}

function closeEditModal() {
    editModalVisible.value = false;
}

async function saveEditModal() {
    editSaving.value = true;
    editError.value = '';
    const id = editModalForm.id;
    const aId = adminId();
    try {
        const MAP = {
            cheaters: adminUpdateCheater,
            events: adminUpdateEvent,
            tutorials: adminUpdateTutorial,
            streams: adminUpdateStream,
            clans: adminUpdateClanRecruitment,
            coaching: adminUpdateCoachingPost,
            'public-reports': adminUpdatePublicReport,
            'text-tutorials': adminUpdateTextTutorial,
            replays: adminUpdateReplay
        };
        const fn = MAP[editModalTab.value];
        if (!fn) { editError.value = '未知类型'; return; }
        const res = await fn(id, editModalForm, aId);
        if (res.data?.code === 200) {
            closeEditModal();
            loadTab();
        } else {
            editError.value = res.data?.msg || '保存失败';
        }
    } catch (e) {
        editError.value = e.response?.data?.msg || '保存失败';
    } finally {
        editSaving.value = false;
    }
}

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

async function loadStreams() {
    try { const res = await adminListStreams(adminId()); streams.value = res.data?.data || []; } catch (e) { console.error(e); }
}
async function deleteStream(id) {
    if (!confirm('确认删除？')) return;
    try { await adminDeleteStream(id, adminId()); await loadStreams(); } catch (e) { alert('删除失败'); }
}

async function loadClans() {
    try { const res = await adminListClanRecruitments(adminId()); clanRecruitments.value = res.data?.data || []; } catch (e) { console.error(e); }
}
async function deleteClan(id) {
    if (!confirm('确认删除？')) return;
    try { await adminDeleteClanRecruitment(id, adminId()); await loadClans(); } catch (e) { alert('删除失败'); }
}

async function loadCoaching() {
    try { const res = await adminListCoachingPosts(adminId()); coachingPosts.value = res.data?.data || []; } catch (e) { console.error(e); }
}
async function deleteCoaching(id) {
    if (!confirm('确认删除？')) return;
    try { await adminDeleteCoachingPost(id, adminId()); await loadCoaching(); } catch (e) { alert('删除失败'); }
}

async function loadPublicReports() {
    try { const res = await adminListPublicReports(adminId()); publicReports.value = res.data?.data || []; } catch (e) { console.error(e); }
}
async function deletePublicReport(id) {
    if (!confirm('确认删除？')) return;
    try { await adminDeletePublicReport(id, adminId()); await loadPublicReports(); } catch (e) { alert('删除失败'); }
}

async function loadTextTutorials() {
    try { const res = await adminListTextTutorials(adminId()); textTutorials.value = res.data?.data || []; } catch (e) { console.error(e); }
}
async function deleteTextTutorial(id) {
    if (!confirm('确认删除？')) return;
    try { await adminDeleteTextTutorial(id, adminId()); await loadTextTutorials(); } catch (e) { alert('删除失败'); }
}

async function loadReplays() {
    try { const res = await adminListReplays(adminId()); replays.value = res.data?.data || []; } catch (e) { console.error(e); }
}
async function deleteReplay(id) {
    if (!confirm('确认删除？')) return;
    try { await adminDeleteReplay(id, adminId()); await loadReplays(); } catch (e) { alert('删除失败'); }
}

function loadTab() {
    if (activeTab.value === 'users') loadUsers();
    else if (activeTab.value === 'cheaters') loadCheaters();
    else if (activeTab.value === 'events') loadEvents();
    else if (activeTab.value === 'tutorials') loadTutorials();
    else if (activeTab.value === 'streams') loadStreams();
    else if (activeTab.value === 'clans') loadClans();
    else if (activeTab.value === 'coaching') loadCoaching();
    else if (activeTab.value === 'public-reports') loadPublicReports();
    else if (activeTab.value === 'text-tutorials') loadTextTutorials();
    else if (activeTab.value === 'replays') loadReplays();
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
    flex-wrap: nowrap;
    overflow-x: auto;
    gap: 4px;
    margin-bottom: 24px;
    border-bottom: 1px solid var(--sc2-border);
    padding-bottom: 0;
    scrollbar-width: thin;
}

.tab-btn {
    background: none;
    border: none;
    color: var(--sc2-text-dim);
    font-family: 'Rajdhani', sans-serif;
    font-size: 15px;
    font-weight: 600;
    padding: 10px 16px;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: all .2s;
    white-space: nowrap;
    flex-shrink: 0;
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

.btn-info {
    background: rgba(0, 120, 200, .2);
    color: #60b8ff;
    border: 1px solid rgba(0, 120, 200, .4);
    padding: 4px 10px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
}
.btn-info:hover { background: rgba(0, 120, 200, .35); }

/* ===== Edit Modal ===== */
.edit-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, .65);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
}

.edit-modal {
    background: var(--sc2-bg-panel, #1a2035);
    border: 1px solid var(--sc2-border, #2a3a5a);
    border-radius: 12px;
    padding: 28px;
    width: 520px;
    max-width: 95vw;
    max-height: 85vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.modal-title {
    font-family: 'Orbitron', sans-serif;
    font-size: 16px;
    color: var(--sc2-text-bright);
    margin: 0 0 12px;
    text-align: center;
}

.modal-label {
    font-size: 12px;
    color: var(--sc2-accent);
    margin-top: 6px;
    font-weight: bold;
    text-transform: uppercase;
}

.err-text {
    color: var(--sc2-danger, #ff4d4d);
    font-size: 13px;
    margin-top: 6px;
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

.link-cell {
    color: var(--sc2-accent);
    text-decoration: none;
}
.link-cell:hover { text-decoration: underline; }

@media (max-width: 768px) {
    .admin-tabs {
        flex-wrap: nowrap;
    }

    .tab-btn {
        padding: 8px 10px;
        font-size: 12px;
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
