<template>
    <div class="clan-page">
        <h1 class="page-title">战队</h1>
        <p class="page-subtitle">CLAN INFO & RECRUITMENT</p>

        <div class="section-tabs">
            <button :class="{ active: activeTab === 'ranking' }" @click="activeTab = 'ranking'">
                <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="currentColor"><path d="M160-200v-80h80v-280h-80v-80h240v80h-80v280h80v80H160Zm360 0v-80h80v-80H480v-80h120v-80H480v-80h120v-80H480v-80h200v480H520Zm160 0v-80h80v-480h-80v-80h240v80h-80v480h80v80H680Z"/></svg>
                战队排行榜
            </button>
            <button :class="{ active: activeTab === 'search' }" @click="activeTab = 'search'">
                <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="currentColor"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg>
                搜索战队
            </button>
            <button :class="{ active: activeTab === 'recruit' }" @click="activeTab = 'recruit'">
                <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="currentColor"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
                战队招新
            </button>
        </div>

        <!-- ========== RANKING TAB ========== -->
        <div v-if="activeTab === 'ranking'">
            <div class="data-notice">
                <svg xmlns="http://www.w3.org/2000/svg" height="14px" viewBox="0 -960 960 960" width="14px" fill="currentColor"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-40-120h80v-280h-80v280Zm40-360q17 0 28.5-11.5T520-600q0-17-11.5-28.5T480-640q-17 0-28.5 11.5T440-600q0 17 11.5 28.5T480-560Z"/></svg>
                数据暂不支持国服
            </div>

            <div v-if="rankLoading" class="loading">加载中...</div>
            <div v-else class="ranking-table-wrap">
                <table class="sc2-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>战队标签</th>
                            <th>战队名称</th>
                            <th>服务器</th>
                            <th>活跃成员</th>
                            <th>平均MMR</th>
                            <th>平均联赛</th>
                            <th>总游戏局数</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(clan, i) in ranking" :key="clan.id">
                            <td class="rank-num">{{ i + 1 }}</td>
                            <td><span class="clan-tag">[{{ clan.tag }}]</span></td>
                            <td class="clan-name">{{ clan.name }}</td>
                            <td><span :class="['region-badge', 'region-' + clan.region?.toLowerCase()]">{{ clan.region }}</span></td>
                            <td>{{ clan.activeMembers || clan.members || '-' }}</td>
                            <td><span class="mmr-val">{{ clan.avgRating || '-' }}</span></td>
                            <td><span :class="['league-badge', 'league-' + (clan.avgLeagueType || 0)]">{{ clan.avgLeagueName || '-' }}</span></td>
                            <td>{{ clan.games?.toLocaleString() || '-' }}</td>
                        </tr>
                    </tbody>
                </table>
                <p v-if="ranking.length === 0" class="empty-msg">暂无数据</p>
            </div>
        </div>

        <!-- ========== SEARCH TAB ========== -->
        <div v-if="activeTab === 'search'">
            <div class="search-row">
                <input v-model="searchQuery" class="search-input" placeholder="输入战队名称或标签搜索..." @keyup.enter="searchClans">
                <button class="search-btn" @click="searchClans" :disabled="searching">{{ searching ? '搜索中...' : '搜索' }}</button>
            </div>

            <div v-if="searchResults.length > 0" class="clan-cards">
                <div v-for="clan in searchResults" :key="clan.id" class="clan-card sc2-panel">
                    <div class="clan-header">
                        <span class="clan-tag-big">[{{ clan.tag }}]</span>
                        <span class="clan-full-name">{{ clan.name }}</span>
                        <span :class="['region-badge', 'region-' + clan.region?.toLowerCase()]">{{ clan.region }}</span>
                    </div>
                    <div class="clan-stats">
                        <div class="stat">
                            <span class="label">活跃成员</span>
                            <span class="val">{{ clan.activeMembers || clan.members || 'N/A' }}</span>
                        </div>
                        <div class="stat">
                            <span class="label">平均MMR</span>
                            <span class="val mmr">{{ clan.avgRating || 'N/A' }}</span>
                        </div>
                        <div class="stat">
                            <span class="label">平均联赛</span>
                            <span class="val">{{ clan.avgLeagueName || 'N/A' }}</span>
                        </div>
                        <div class="stat">
                            <span class="label">总局数</span>
                            <span class="val">{{ clan.games?.toLocaleString() || 'N/A' }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <p v-else-if="hasSearched" class="empty-msg">未找到匹配的战队</p>
        </div>

        <!-- ========== RECRUIT TAB ========== -->
        <div v-if="activeTab === 'recruit'">
            <div class="section-header-row">
                <p class="section-desc">战队在此发布招新信息，玩家也可申请加入心仪战队。</p>
                <button class="add-btn" @click="showRecruitForm = true" v-if="currentUser">+ 发布招新</button>
            </div>

            <!-- Recruit Form -->
            <div v-if="showRecruitForm" class="form-panel sc2-panel">
                <h3>发布战队招新</h3>
                <div class="form-row">
                    <input v-model="recruitForm.clanName" class="wInput" placeholder="战队名称 (必填)">
                    <input v-model="recruitForm.clanTag" class="wInput" placeholder="战队标签 (如 [KSV])">
                </div>
                <div class="form-row">
                    <select v-model="recruitForm.region" class="wInput">
                        <option value="">服务器不限</option>
                        <option value="US">美服 (US)</option>
                        <option value="EU">欧服 (EU)</option>
                        <option value="KR">韩服 (KR)</option>
                        <option value="CN">国服 (CN)</option>
                    </select>
                    <input type="number" v-model.number="recruitForm.minMmr" class="wInput" placeholder="要求最低MMR (选填)">
                    <input type="number" v-model.number="recruitForm.maxMmr" class="wInput" placeholder="要求最高MMR (选填)">
                </div>
                <textarea v-model="recruitForm.description" class="wInput textarea-input" placeholder="招新描述（战队简介、要求等）" rows="4"></textarea>
                <input v-model="recruitForm.contact" class="wInput" placeholder="联系方式 (QQ/Discord/微信等)">
                <div class="form-actions">
                    <button class="btn-submit" @click="submitRecruitment" :disabled="recruitSubmitting">
                        {{ recruitSubmitting ? '发布中...' : '发布招新' }}
                    </button>
                    <button class="btn-cancel" @click="showRecruitForm = false">取消</button>
                    <span class="msg" v-if="recruitMsg">{{ recruitMsg }}</span>
                </div>
            </div>

            <div class="recruit-list" v-if="recruitments.length > 0">
                <div v-for="r in recruitments" :key="r.id" class="recruit-card sc2-panel">
                    <div class="recruit-header">
                        <span v-if="r.clanTag" class="clan-tag">[{{ r.clanTag }}]</span>
                        <span class="recruit-clan-name">{{ r.clanName }}</span>
                        <span v-if="r.region" :class="['region-badge', 'region-' + r.region?.toLowerCase()]">{{ r.region }}</span>
                    </div>
                    <div class="recruit-meta" v-if="r.minMmr || r.maxMmr">
                        <span class="mmr-req">MMR 要求：{{ r.minMmr || '不限' }} ~ {{ r.maxMmr || '不限' }}</span>
                    </div>
                    <p class="recruit-desc" v-if="r.description">{{ r.description }}</p>
                    <div class="recruit-footer">
                        <span class="recruit-author">by {{ r.authorTag || '匿名' }}</span>
                        <span class="recruit-time">{{ formatDate(r.createdAt) }}</span>
                        <span v-if="r.contact" class="recruit-contact">联系：{{ r.contact }}</span>
                        <button class="delete-btn" v-if="isAdmin || (currentUser && currentUser.id === r.userId)"
                            @click="deleteRecruitment(r.id)">删除</button>
                    </div>
                </div>
            </div>
            <p v-else class="empty-msg">暂无招新信息</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { getStoredUser } from '../api/api.js';

const currentUser = getStoredUser();
const isAdmin = computed(() => currentUser?.role === 'admin');
const activeTab = ref('ranking');

// ---- RANKING ----
const ranking = ref([]);
const rankLoading = ref(false);

async function loadRanking() {
    rankLoading.value = true;
    try {
        const res = await axios.get('/api/clan/ranking');
        ranking.value = res.data?.data || [];
    } catch (e) { ranking.value = []; }
    finally { rankLoading.value = false; }
}

// ---- SEARCH ----
const searchQuery = ref('');
const searchResults = ref([]);
const searching = ref(false);
const hasSearched = ref(false);

async function searchClans() {
    if (!searchQuery.value.trim()) return;
    searching.value = true;
    hasSearched.value = true;
    try {
        const res = await axios.get('/api/clan/ranking', { params: { query: searchQuery.value } });
        searchResults.value = res.data?.data || [];
    } catch (e) { searchResults.value = []; }
    finally { searching.value = false; }
}

// ---- RECRUITMENT ----
const recruitments = ref([]);
const showRecruitForm = ref(false);
const recruitSubmitting = ref(false);
const recruitMsg = ref('');
const recruitForm = ref({ clanName: '', clanTag: '', region: '', minMmr: null, maxMmr: null, description: '', contact: '' });

async function loadRecruitments() {
    try {
        const res = await axios.get('/api/clan/recruitment');
        recruitments.value = res.data?.data || [];
    } catch (e) { recruitments.value = []; }
}

async function submitRecruitment() {
    if (!recruitForm.value.clanName.trim()) {
        recruitMsg.value = '请填写战队名称';
        return;
    }
    recruitSubmitting.value = true;
    recruitMsg.value = '';
    try {
        const res = await axios.post('/api/clan/recruitment', {
            ...recruitForm.value,
            userId: currentUser?.id
        });
        if (res.data.code === 200) {
            recruitMsg.value = '发布成功！';
            showRecruitForm.value = false;
            recruitForm.value = { clanName: '', clanTag: '', region: '', minMmr: null, maxMmr: null, description: '', contact: '' };
            await loadRecruitments();
        } else {
            recruitMsg.value = res.data.msg || '发布失败';
        }
    } catch (e) { recruitMsg.value = '发布失败，请稍后再试'; }
    finally { recruitSubmitting.value = false; }
}

async function deleteRecruitment(id) {
    if (!confirm('确认删除？')) return;
    try {
        await axios.delete(`/api/clan/recruitment/${id}`, { params: { userId: currentUser?.id } });
        await loadRecruitments();
    } catch (e) { alert('删除失败'); }
}

function formatDate(d) {
    if (!d) return '';
    return new Date(d).toLocaleDateString('zh-CN');
}

onMounted(() => {
    loadRanking();
    loadRecruitments();
});
</script>

<style scoped>
.clan-page { max-width: 1100px; margin: 0 auto; }

.page-title {
    font-family: 'Orbitron', sans-serif;
    font-size: 28px;
    font-weight: 700;
    color: var(--sc2-text-bright);
    letter-spacing: 1px;
}

.page-subtitle {
    font-family: 'Orbitron', sans-serif;
    font-size: 10px;
    color: var(--sc2-text-dim);
    letter-spacing: 4px;
    margin-bottom: 24px;
}

.section-tabs {
    display: flex;
    gap: 4px;
    margin-bottom: 24px;
    border-bottom: 1px solid var(--sc2-border);
}

.section-tabs button {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 20px;
    font-family: 'Rajdhani', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--sc2-text);
    background: transparent;
    border: none;
    border-bottom: 3px solid transparent;
    cursor: pointer;
    transition: all 0.2s;
    margin-bottom: -1px;
}
.section-tabs button:hover { color: var(--sc2-accent); }
.section-tabs button.active { color: var(--sc2-accent); border-bottom-color: var(--sc2-accent); }

.data-notice {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--sc2-text-dim);
    margin-bottom: 16px;
}
.data-notice a { color: var(--sc2-accent); text-decoration: none; }
.data-notice svg { fill: var(--sc2-text-dim); }

.sc2-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
}
.sc2-table th {
    padding: 10px 12px;
    text-align: left;
    font-family: 'Orbitron', sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--sc2-accent);
    border-bottom: 1px solid var(--sc2-border);
    background: rgba(0, 180, 216, 0.05);
    white-space: nowrap;
}
.sc2-table td {
    padding: 10px 12px;
    color: var(--sc2-text);
    border-bottom: 1px solid rgba(30, 45, 74, 0.4);
}
.sc2-table tbody tr:hover { background: rgba(0, 180, 216, 0.04); }

.rank-num { color: var(--sc2-text-dim); font-family: 'Share Tech Mono', monospace; }
.clan-tag { font-family: 'Share Tech Mono', monospace; color: var(--sc2-gold); }
.clan-name { font-weight: 600; color: var(--sc2-text-bright); }
.mmr-val { font-family: 'Share Tech Mono', monospace; color: var(--sc2-gold); font-weight: 600; }

.region-badge {
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 11px;
    font-weight: 600;
}
.region-us { background: rgba(0, 100, 255, 0.15); color: #4080ff; }
.region-eu { background: rgba(0, 180, 100, 0.15); color: #00b464; }
.region-kr { background: rgba(255, 50, 50, 0.15); color: #ff5050; }
.region-cn { background: rgba(255, 160, 0, 0.15); color: #ffa000; }

.league-badge {
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 11px;
}
.league-0 { background: rgba(160, 100, 60, 0.2); color: #a0643c; }
.league-1 { background: rgba(180, 180, 180, 0.2); color: #b4b4b4; }
.league-2 { background: rgba(255, 200, 50, 0.2); color: #ffc832; }
.league-3 { background: rgba(150, 200, 220, 0.2); color: #96c8dc; }
.league-4 { background: rgba(100, 160, 255, 0.2); color: #64a0ff; }
.league-5 { background: rgba(50, 200, 255, 0.2); color: #32c8ff; }
.league-6 { background: rgba(255, 50, 50, 0.2); color: #ff5050; }

.search-row {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}
.search-input {
    flex: 1;
    padding: 10px 14px;
    background: var(--sc2-bg-dark);
    border: 1px solid var(--sc2-border);
    border-radius: 6px;
    color: var(--sc2-text-bright);
    font-size: 14px;
}
.search-input:focus { border-color: var(--sc2-accent); outline: none; }
.search-btn {
    padding: 10px 24px;
    background: var(--sc2-accent);
    color: var(--sc2-bg-deep);
    border: none;
    border-radius: 6px;
    font-family: 'Orbitron', sans-serif;
    font-size: 12px;
    cursor: pointer;
}
.search-btn:disabled { opacity: 0.5; }

.clan-cards { display: flex; flex-direction: column; gap: 16px; }
.sc2-panel {
    background: linear-gradient(135deg, var(--sc2-bg-panel), var(--sc2-bg-dark));
    border: 1px solid var(--sc2-border);
    border-radius: 12px;
    padding: 20px;
    position: relative;
}
.clan-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
.clan-tag-big { font-family: 'Share Tech Mono', monospace; font-size: 18px; color: var(--sc2-gold); font-weight: 700; }
.clan-full-name { font-size: 18px; font-weight: 600; color: var(--sc2-text-bright); }
.clan-stats { display: flex; gap: 20px; flex-wrap: wrap; }
.stat { display: flex; flex-direction: column; align-items: center; padding: 10px 16px; background: rgba(255,255,255,0.03); border-radius: 8px; border: 1px solid var(--sc2-border); }
.stat .label { font-size: 11px; color: var(--sc2-text-dim); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
.stat .val { font-size: 18px; font-weight: 600; color: var(--sc2-text-bright); }
.stat .val.mmr { color: var(--sc2-gold); font-family: 'Share Tech Mono', monospace; }

.section-header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 12px; }
.section-desc { font-size: 14px; color: var(--sc2-text-dim); }
.add-btn { padding: 8px 18px; background: var(--sc2-accent); color: var(--sc2-bg-deep); border: none; border-radius: 6px; font-family: 'Rajdhani', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; }

.form-panel { margin-bottom: 20px; }
.form-panel h3 { color: var(--sc2-text-bright); margin-bottom: 16px; font-size: 16px; }
.wInput {
    width: 100%;
    padding: 10px 14px;
    background: var(--sc2-bg-dark);
    border: 1px solid var(--sc2-border);
    border-radius: 6px;
    color: var(--sc2-text-bright);
    font-size: 14px;
    font-family: inherit;
    margin-bottom: 10px;
    box-sizing: border-box;
}
.wInput:focus { border-color: var(--sc2-accent); outline: none; }
.textarea-input { resize: vertical; min-height: 80px; }
.form-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; }
.form-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-top: 8px; }
.btn-submit { padding: 8px 24px; background: var(--sc2-accent); color: var(--sc2-bg-deep); border: none; border-radius: 6px; font-family: 'Orbitron', sans-serif; font-size: 12px; cursor: pointer; }
.btn-submit:disabled { opacity: 0.5; }
.btn-cancel { padding: 8px 16px; background: transparent; color: var(--sc2-text-dim); border: 1px solid var(--sc2-border); border-radius: 6px; font-size: 13px; cursor: pointer; }
.msg { font-size: 13px; color: var(--sc2-accent); }

.recruit-list { display: flex; flex-direction: column; gap: 14px; }
.recruit-header { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; flex-wrap: wrap; }
.recruit-clan-name { font-size: 17px; font-weight: 600; color: var(--sc2-text-bright); }
.mmr-req { font-size: 13px; color: #ffa000; margin-bottom: 8px; }
.recruit-desc { font-size: 14px; color: var(--sc2-text); line-height: 1.6; white-space: pre-wrap; }
.recruit-footer { display: flex; align-items: center; gap: 12px; margin-top: 10px; flex-wrap: wrap; font-size: 12px; color: var(--sc2-text-dim); }
.recruit-contact { color: var(--sc2-accent); }
.delete-btn { padding: 3px 10px; background: rgba(255,80,80,0.1); color: #ff5050; border: 1px solid rgba(255,80,80,0.3); border-radius: 4px; font-size: 11px; cursor: pointer; }

.loading, .empty-msg { text-align: center; padding: 40px; color: var(--sc2-text-dim); }

.ranking-table-wrap { overflow-x: auto; }

@media (max-width: 768px) {
    .sc2-table { font-size: 12px; }
    .sc2-table th, .sc2-table td { padding: 8px 6px; }
    .clan-stats { gap: 10px; }
}
</style>
