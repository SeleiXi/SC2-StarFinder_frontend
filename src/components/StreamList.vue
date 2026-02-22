<template>
    <div class="stream-page">
        <div class="header-row">
            <div>
                <h1 class="page-title">直播列表</h1>
                <p class="page-subtitle">SC2 LIVE STREAMS</p>
            </div>
            <button class="add-stream-btn" @click="showAddForm = true">+ 我要上榜</button>
        </div>

        <!-- Add Stream Form -->
        <div v-if="showAddForm" class="add-stream-modal">
            <div class="modal-content sc2-panel">
                <h3>上榜申请</h3>
                <p class="form-hint">填写后将直接展示在直播列表中。MMR会自动从填入的战网ID中取各服务器最高值。</p>
                <input v-model="form.name" class="wInput" placeholder="主播名称 (必填，显示在列表中)" />
                <input v-model="form.streamUrl" class="wInput" placeholder="直播间链接 (必填)" />
                <input v-model="form.platform" class="wInput" placeholder="直播平台 (如 Bilibili/Douyu/Twitch)" />
                <div class="tag-section">
                    <p class="tag-label">战网ID（至少填写一个服务器以自动获取最高MMR）</p>
                    <input v-model="form.battleTag" class="wInput" placeholder="战网ID (通用，如 XXX#1234)" />
                    <input v-model="form.battleTagCN" class="wInput" placeholder="国服战网ID (选填)" />
                    <input v-model="form.battleTagUS" class="wInput" placeholder="美服战网ID (选填)" />
                    <input v-model="form.battleTagEU" class="wInput" placeholder="欧服战网ID (选填)" />
                    <input v-model="form.battleTagKR" class="wInput" placeholder="韩服战网ID (选填)" />
                </div>
                <input type="number" v-model.number="form.mmr" class="wInput" placeholder="手动填写MMR (若自动获取失败)" />
                <select v-model="form.race" class="wInput">
                    <option value="">种族 (选填)</option>
                    <option value="T">人族</option>
                    <option value="Z">异虫</option>
                    <option value="P">星灵</option>
                    <option value="R">随机</option>
                </select>
                <div class="modal-actions">
                    <button class="btn-success" @click="submitStream" :disabled="submitting">{{ submitting ? '提交中...' : '提交上榜' }}</button>
                    <button class="btn-cancel" @click="showAddForm = false">取消</button>
                    <span v-if="formMsg" :class="['form-msg', formMsgType]">{{ formMsg }}</span>
                </div>
            </div>
        </div>

        <div v-if="loading" class="loading-msg">
            <div class="loader"></div>
            <span>加载中...</span>
        </div>

        <p v-else-if="streams.length === 0" class="empty-msg">暂无正在直播的主播</p>

        <div v-else class="stream-grid">
            <div class="stream-card sc2-panel" v-for="(s, i) in streams" :key="i">
                <div class="card-top">
                    <span class="streamer-name">{{ s.name || s.userName || s.proNickname || 'Unknown' }}</span>
                    <span v-if="s.live" class="live-dot">
                        <span class="dot"></span>
                        LIVE
                    </span>
                    <button v-if="isAdmin && s.id" class="delete-btn" @click="handleDelete(s.id)">×</button>
                </div>
                <div class="card-info">
                    <div v-if="s.proTeam || s.platform" class="info-row">
                        <span class="label">平台/战队</span>
                        <span>{{ s.platform || s.proTeam || s.service }}</span>
                    </div>
                    <div v-if="s.mmr || s.rating" class="info-row">
                        <span class="label">MMR</span>
                        <span class="mmr-val">{{ s.mmr || s.rating }}</span>
                    </div>
                    <div v-if="s.race" class="info-row">
                        <span class="label">种族</span>
                        <span>{{ raceMap[s.race] || s.race }}</span>
                    </div>
                </div>
                <a :href="s.streamUrl || s.url" target="_blank" class="watch-btn">
                    观看直播
                </a>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { getSC2Streams, addStream, listUserStreams, deleteStream, getStoredUser } from '../api/api.js';

const streams = ref([]);
const loading = ref(true);
const showAddForm = ref(false);
const raceMap = { TERRAN: '人族', ZERG: '异虫', PROTOSS: '星灵', RANDOM: '随机', T: '人族', Z: '异虫', P: '星灵' };

const form = reactive({
    name: '',
    battleTag: '',
    battleTagCN: '',
    battleTagUS: '',
    battleTagEU: '',
    battleTagKR: '',
    streamUrl: '',
    platform: '',
    mmr: null,
    race: ''
});
const submitting = ref(false);
const formMsg = ref('');
const formMsgType = ref('success');

const currentUser = getStoredUser();
const isAdmin = computed(() => currentUser?.role === 'admin' || currentUser?.role === 'super_admin');

const STREAMS_CACHE_KEY = 'sc2_streams_cache';
const STREAMS_CACHE_TTL = 60000; // 1 minute

function getCachedStreams() {
    try {
        const cached = localStorage.getItem(STREAMS_CACHE_KEY);
        if (!cached) return null;
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < STREAMS_CACHE_TTL) return data;
    } catch (e) {}
    return null;
}

function cacheStreams(data) {
    try {
        localStorage.setItem(STREAMS_CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
    } catch (e) {}
}

async function loadStreams() {
    // Show cached data immediately for fast initial render
    const cached = getCachedStreams();
    if (cached && cached.length > 0) {
        streams.value = cached;
        loading.value = false;
    } else {
        loading.value = true;
    }

    try {
        const [sc2Res, userRes] = await Promise.all([
            getSC2Streams(),
            listUserStreams()
        ]);
        
        const sc2Data = sc2Res.data;
        const sc2Streams = (Array.isArray(sc2Data) ? sc2Data : (sc2Data.data || [])).map(s => ({ ...s, live: true }));
        
        const userData = userRes.data?.data || [];
        const userStreams = userData.map(s => ({ ...s, live: true }));

        const combined = [...userStreams, ...sc2Streams];
        streams.value = combined;
        cacheStreams(combined);
    } catch (e) {
        console.error(e);
        if (!cached) streams.value = [];
    }
    loading.value = false;
}

async function submitStream() {
    formMsg.value = '';
    if (!form.name || !form.streamUrl) {
        formMsg.value = '请填写主播名称和直播链接';
        formMsgType.value = 'error';
        return;
    }
    submitting.value = true;
    try {
        const res = await addStream({ ...form, userId: currentUser?.id });
        if (res.data.code === 200) {
            formMsg.value = '发布成功！将直接展示在列表中。';
            formMsgType.value = 'success';
            Object.assign(form, { name: '', battleTag: '', battleTagCN: '', battleTagUS: '', battleTagEU: '', battleTagKR: '', streamUrl: '', platform: '', mmr: null, race: '' });
            await loadStreams();
            setTimeout(() => { showAddForm.value = false; formMsg.value = ''; }, 1500);
        } else {
            formMsg.value = res.data.msg || '发布失败';
            formMsgType.value = 'error';
        }
    } catch (e) {
        formMsg.value = '发布失败，请稍后再试';
        formMsgType.value = 'error';
    } finally {
        submitting.value = false;
    }
}

async function handleDelete(id) {
    if (!confirm('确认删除该直播？')) return;
    try {
        await deleteStream(id, currentUser.id);
        await loadStreams();
    } catch (e) {
        alert('删除失败');
    }
}

onMounted(loadStreams);
</script>

<style scoped>
.stream-page {
    max-width: 1100px;
    margin: 0 auto;
}

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

.header-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;
}

.add-stream-btn {
    background: var(--sc2-accent);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    font-family: 'Rajdhani', sans-serif;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 0 15px rgba(0, 180, 216, 0.3);
}

.add-stream-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 25px rgba(0, 180, 216, 0.5);
}

.add-stream-modal {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(8px);
}

.modal-content {
    width: 100%;
    max-width: 450px;
    padding: 30px;
}

.modal-content h3 {
    margin-top: 0;
    color: var(--sc2-accent);
    font-family: 'Orbitron', sans-serif;
}

.modal-actions {
    display: flex;
    gap: 12px;
    margin-top: 24px;
}

.delete-btn {
    background: none;
    border: none;
    color: var(--sc2-danger);
    font-size: 20px;
    cursor: pointer;
    padding: 0 5px;
    line-height: 1;
}

.loading-msg {
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--sc2-text-dim);
    padding: 40px;
}

.loader {
    width: 20px;
    height: 20px;
    border: 2px solid var(--sc2-border);
    border-top-color: var(--sc2-accent);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.empty-msg {
    color: var(--sc2-text-dim);
    padding: 60px;
    text-align: center;
    font-size: 16px;
}

.stream-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 20px;
}

.sc2-panel {
    background: linear-gradient(135deg, var(--sc2-bg-panel), var(--sc2-bg-dark));
    border: 1px solid var(--sc2-border);
    border-radius: 12px;
    padding: 24px;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
}

.sc2-panel::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--sc2-accent), transparent);
    opacity: 0.5;
}

.stream-card:hover {
    border-color: var(--sc2-border-glow);
    transform: translateY(-3px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
}

.card-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.streamer-name {
    font-size: 18px;
    font-weight: 700;
    color: var(--sc2-text-bright);
}

.live-dot {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: 'Orbitron', sans-serif;
    font-size: 10px;
    font-weight: 700;
    color: var(--sc2-danger);
    letter-spacing: 1px;
}

.dot {
    width: 8px;
    height: 8px;
    background: var(--sc2-danger);
    border-radius: 50%;
    animation: dot-pulse 1.5s infinite;
}

@keyframes dot-pulse {

    0%,
    100% {
        opacity: 1;
        box-shadow: 0 0 4px var(--sc2-danger);
    }

    50% {
        opacity: 0.5;
        box-shadow: 0 0 8px var(--sc2-danger);
    }
}

.card-info {
    margin-bottom: 16px;
}

.info-row {
    display: flex;
    justify-content: space-between;
    padding: 6px 0;
    font-size: 13px;
    border-bottom: 1px solid rgba(30, 45, 74, 0.3);
}

.label {
    color: var(--sc2-text-dim);
}

.mmr-val {
    font-family: 'Share Tech Mono', monospace;
    color: var(--sc2-gold);
}

.watch-btn {
    display: block;
    text-align: center;
    padding: 10px;
    border: 1px solid var(--sc2-accent);
    color: var(--sc2-accent);
    text-decoration: none;
    font-family: 'Rajdhani', sans-serif;
    font-size: 14px;
    font-weight: 600;
    border-radius: 6px;
    transition: all 0.2s;
}

.watch-btn:hover {
    background: var(--sc2-accent);
    color: white;
    box-shadow: 0 0 12px rgba(0, 180, 216, 0.3);
}

@media (max-width: 768px) {
    .stream-grid {
        grid-template-columns: 1fr;
        gap: 12px;
    }
    .stream-card { padding: 16px; }
}

.form-hint {
    font-size: 12px;
    color: var(--sc2-text-dim);
    margin-bottom: 12px;
    line-height: 1.5;
}

.tag-section {
    border: 1px solid var(--sc2-border);
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 10px;
}

.tag-label {
    font-size: 12px;
    color: var(--sc2-accent);
    margin-bottom: 8px;
}

.form-msg {
    font-size: 13px;
}
.form-msg.success { color: #00c864; }
.form-msg.error { color: #ff5050; }
</style>
