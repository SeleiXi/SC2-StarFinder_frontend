<template>
    <div class="tutorial-page">
        <h1 class="page-title">教学</h1>
        <p class="page-subtitle">TUTORIALS & COACHING</p>

        <!-- Sub-section tabs -->
        <div class="section-tabs">
            <button :class="{ active: activeSection === 'video' }" @click="activeSection = 'video'">
                <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="currentColor"><path d="M320-200v-560l440 280-440 280Z"/></svg>
                教学视频
            </button>
            <button :class="{ active: activeSection === 'coaching' }" @click="activeSection = 'coaching'">
                <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="currentColor"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
                陪玩陪练
            </button>
            <button :class="{ active: activeSection === 'text' }" @click="activeSection = 'text'">
                <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="currentColor"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h360l280 280v360q0 33-23.5 56.5T760-120H200Zm0-80h560v-320H520v-240H200v560Zm80-80h400v-80H280v80Zm0-160h400v-80H280v80Zm0-160h240v-80H280v80Zm240-40v-160l160 160H520Z"/></svg>
                文字教学
            </button>
            <button :class="{ active: activeSection === 'replay' }" @click="activeSection = 'replay'">
                <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="currentColor"><path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/></svg>
                Replay下载
            </button>
        </div>

        <!-- ========== VIDEO SECTION ========== -->
        <div v-if="activeSection === 'video'">
            <div class="section-header-row">
                <div class="cat-tabs" style="margin-bottom:0">
                    <button :class="{ active: currentCat === '' }" @click="loadTutorials('')">全部</button>
                    <button v-for="cat in videoCategories" :key="cat"
                        :class="{ active: currentCat === cat }" @click="loadTutorials(cat)">
                        {{ cat }}
                    </button>
                </div>
                <button class="add-btn" @click="requireLogin(() => showPublishDialog = true)">+ 发布教程</button>
            </div>

            <!-- Publish Form (inline panel) -->
            <div v-if="showPublishDialog" class="form-panel sc2-panel">
                <h3>发布教程视频</h3>
                <input v-model="publishForm.title" class="wInput" placeholder="标题 (必填)" />
                <input v-model="publishForm.url" class="wInput" placeholder="视频链接 (必填)" />
                <select v-model="publishForm.category" class="wInput wSelect">
                    <option value="入门">入门</option>
                    <option value="进阶">进阶</option>
                    <option value="高级">高级</option>
                </select>
                <textarea v-model="publishForm.description" class="wInput textarea-input" placeholder="简介 (选填)" rows="3"></textarea>
                <input v-model="publishForm.author" class="wInput" placeholder="署名 (默认 BattleTag)" />
                <span v-if="publishError" class="error-msg">{{ publishError }}</span>
                <div class="form-actions">
                    <button class="btn-submit" @click="submitTutorial" :disabled="publishing">
                        {{ publishing ? '提交中...' : '确认发布' }}
                    </button>
                    <button class="btn-cancel" @click="showPublishDialog = false">取消</button>
                </div>
            </div>

            <div v-if="tutorials.length > 0" class="tutorial-list">
                <div v-for="t in tutorials" :key="t.id" class="tutorial-card sc2-panel">
                    <div class="card-header-row">
                        <div class="card-title">
                            {{ t.title }}
                            <small v-if="t.author" class="card-author">by {{ t.author }}</small>
                        </div>
                        <div class="card-meta">
                            <span class="cat-badge" v-if="t.category">{{ t.category }}</span>
                            <a :href="t.url" target="_blank" class="sc2-btn-secondary">
                                <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="currentColor"><path d="M320-200v-560l440 280-440 280Z"/></svg>
                                立即观看
                            </a>
                        </div>
                    </div>
                    <p v-if="t.description" class="card-desc">{{ t.description }}</p>
                </div>
            </div>
            <p v-else class="empty-msg">暂无视频</p>
        </div>

        <!-- ========== COACHING SECTION ========== -->
        <div v-if="activeSection === 'coaching'">
            <div class="section-header-row">
                <div class="sub-tabs">
                    <button :class="{ active: coachingTab === 'all' }" @click="loadCoaching('all')">全部</button>
                    <button :class="{ active: coachingTab === 'coach' }" @click="loadCoaching('coach')">提供陪练</button>
                    <button :class="{ active: coachingTab === 'find' }" @click="loadCoaching('find')">寻找陪练</button>
                </div>
                <button class="add-btn" @click="requireLogin(() => showCoachingForm = true)">+ 发布信息</button>
            </div>

            <!-- Coaching Form -->
            <div v-if="showCoachingForm" class="form-panel sc2-panel">
                <h3>发布陪玩陪练信息</h3>
                <input v-model="coachForm.title" class="wInput" placeholder="标题 (必填)">
                <div class="form-row">
                    <select v-model="coachForm.postType" class="wInput">
                        <option value="coach">提供陪练/教学</option>
                        <option value="find">寻找陪练/教学</option>
                    </select>
                    <select v-model="coachForm.race" class="wInput">
                        <option value="">种族不限</option>
                        <option value="T">人族</option>
                        <option value="Z">异虫</option>
                        <option value="P">星灵</option>
                        <option value="R">随机</option>
                    </select>
                    <input type="number" v-model.number="coachForm.mmr" class="wInput" placeholder="MMR (选填)">
                </div>
                <input v-model="coachForm.priceInfo" class="wInput" placeholder="价格/报酬信息 (选填，如：免费/每小时50元)">
                <input v-model="coachForm.contact" class="wInput" placeholder="联系方式 (QQ/微信等)">
                <textarea v-model="coachForm.description" class="wInput textarea-input" placeholder="详细描述 (必填)" rows="4"></textarea>
                <div class="form-actions">
                    <button class="btn-submit" @click="submitCoaching" :disabled="coachSubmitting">{{ coachSubmitting ? '发布中...' : '发布' }}</button>
                    <button class="btn-cancel" @click="showCoachingForm = false">取消</button>
                    <span class="msg" v-if="coachMsg">{{ coachMsg }}</span>
                </div>
            </div>

            <div class="post-list" v-if="coachingPosts.length > 0">
                <div v-for="post in coachingPosts" :key="post.id" class="post-card sc2-panel">
                    <div class="post-header">
                        <span class="post-title">{{ post.title }}</span>
                        <span :class="['type-badge', post.postType === 'coach' ? 'badge-coach' : 'badge-find']">
                            {{ post.postType === 'coach' ? '提供陪练' : '寻找陪练' }}
                        </span>
                    </div>
                    <div class="post-meta">
                        <span v-if="post.race">种族：{{ raceMap[post.race] || post.race }}</span>
                        <span v-if="post.mmr">MMR：{{ post.mmr }}</span>
                        <span v-if="post.priceInfo">{{ post.priceInfo }}</span>
                        <span class="post-author">by {{ post.authorTag || '匿名' }}</span>
                    </div>
                    <p class="post-desc">{{ post.description }}</p>
                    <div class="post-contact" v-if="post.contact">联系方式：{{ post.contact }}</div>
                    <div class="post-time">{{ formatDate(post.createdAt) }}</div>
                </div>
            </div>
            <p v-else class="empty-msg">暂无陪练信息</p>
        </div>

        <!-- ========== TEXT TUTORIAL SECTION ========== -->
        <div v-if="activeSection === 'text'">
            <div class="section-header-row">
                <div class="sub-tabs">
                    <button :class="{ active: textCat === '' }" @click="loadTextTutorials('')">全部</button>
                    <button v-for="cat in textCategories" :key="cat"
                        :class="{ active: textCat === cat }" @click="loadTextTutorials(cat)">{{ cat }}</button>
                </div>
                <button class="add-btn" @click="requireLogin(() => showTextForm = true)">+ 发布文章</button>
            </div>

            <!-- Text Tutorial Form -->
            <div v-if="showTextForm" class="form-panel sc2-panel">
                <h3>发布文字教学</h3>
                <input v-model="textForm.title" class="wInput" placeholder="标题 (必填)">
                <input v-model="textForm.category" class="wInput" placeholder="分类 (如：PvT、运营、快攻等)">
                <textarea v-model="textForm.content" class="wInput textarea-input" placeholder="教学内容 (必填，支持换行)" rows="10"></textarea>
                <div class="form-actions">
                    <button class="btn-submit" @click="submitTextTutorial" :disabled="textSubmitting">{{ textSubmitting ? '发布中...' : '发布' }}</button>
                    <button class="btn-cancel" @click="showTextForm = false">取消</button>
                    <span class="msg" v-if="textMsg">{{ textMsg }}</span>
                </div>
            </div>

            <div class="post-list" v-if="textTutorials.length > 0">
                <div v-for="t in textTutorials" :key="t.id" class="text-card sc2-panel">
                    <div class="text-header">
                        <span class="post-title">{{ t.title }}</span>
                        <span class="cat-badge" v-if="t.category">{{ t.category }}</span>
                    </div>
                    <div class="post-author-row">
                        <span class="post-author">by {{ t.authorTag || '匿名' }}</span>
                        <span class="post-time">{{ formatDate(t.createdAt) }}</span>
                    </div>
                    <div class="text-content" :class="{ expanded: expandedText === t.id }">{{ t.content }}</div>
                    <button class="expand-btn" @click="expandedText = (expandedText === t.id ? null : t.id)">
                        {{ expandedText === t.id ? '收起' : '展开阅读全文' }}
                    </button>
                </div>
            </div>
            <p v-else class="empty-msg">暂无文字教学</p>
        </div>

        <!-- ========== REPLAY SECTION ========== -->
        <div v-if="activeSection === 'replay'">
            <div class="section-header-row">
                <div class="sub-tabs">
                    <button :class="{ active: replayCat === '' }" @click="loadReplays('')">全部</button>
                    <button v-for="cat in replayCategories" :key="cat"
                        :class="{ active: replayCat === cat }" @click="loadReplays(cat)">{{ cat }}</button>
                </div>
                <button class="add-btn" @click="requireLogin(() => showReplayForm = true)">+ 上传Replay</button>
            </div>

            <div v-if="showReplayForm" class="form-panel sc2-panel">
                <h3>上传 Replay 文件</h3>
                <p class="upload-hint">仅支持 .SC2Replay 格式，单文件最大 20MB，每人最多上传 20 个文件（共 100MB）</p>
                <input v-model="replayForm.title" class="wInput" placeholder="标题 (必填)">
                <input v-model="replayForm.category" class="wInput" placeholder="分类 (如：PvT、快攻等，选填)">
                <textarea v-model="replayForm.description" class="wInput textarea-input" placeholder="Replay描述 (选填)" rows="3"></textarea>
                <div class="file-upload-area" @click="triggerFileInput" @dragover.prevent @drop.prevent="handleDrop">
                    <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="currentColor"><path d="M440-320v-326L336-542l-56-58 200-200 200 200-56 58-104-104v326h-80ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/></svg>
                    <p>点击或拖放上传 .SC2Replay 文件</p>
                    <span v-if="replayForm.file">已选择: {{ replayForm.file.name }}</span>
                </div>
                <input ref="fileInputRef" type="file" accept=".SC2Replay,.sc2replay" style="display:none" @change="handleFileSelect">
                <div class="form-actions">
                    <button class="btn-submit" @click="submitReplay" :disabled="replaySubmitting">{{ replaySubmitting ? '上传中...' : '上传' }}</button>
                    <button class="btn-cancel" @click="showReplayForm = false">取消</button>
                    <span class="msg" v-if="replayMsg">{{ replayMsg }}</span>
                </div>
            </div>

            <div class="replay-list" v-if="replays.length > 0">
                <div v-for="r in replays" :key="r.id" class="replay-card sc2-panel">
                    <div class="replay-header">
                        <span class="post-title">{{ r.title }}</span>
                        <span class="cat-badge" v-if="r.category">{{ r.category }}</span>
                    </div>
                    <div class="post-author-row">
                        <span class="post-author">by {{ r.authorTag || '匿名' }}</span>
                        <span class="file-size">{{ formatSize(r.fileSize) }}</span>
                        <span class="post-time">{{ formatDate(r.createdAt) }}</span>
                    </div>
                    <p class="post-desc" v-if="r.description">{{ r.description }}</p>
                    <a :href="r.filePath" class="download-btn" download>
                        <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="currentColor"><path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/></svg>
                        下载 {{ r.fileName }}
                    </a>
                </div>
            </div>
            <p v-else class="empty-msg">暂无 Replay 文件</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { getTutorials, createTutorial, getStoredUser, createCoachingPost, getCoachingPosts, getTextTutorials, getTextTutorialCategories, createTextTutorial, getReplays } from '../api/api.js';
import api from '../api/api.js';

const router = useRouter();
const activeSection = ref('video');
const currentUser = getStoredUser();
const isLoggedIn = computed(() => !!currentUser);

function requireLogin(callback) {
    if (!currentUser) {
        router.push({ name: 'loginPage' });
        return;
    }
    callback();
}
const raceMap = { T: '人族', Z: '异虫', P: '星灵', R: '随机' };

// ---- VIDEO ----
const tutorials = ref([]);
const videoCategories = ref([]);
const currentCat = ref('');
const showPublishDialog = ref(false);
const publishing = ref(false);
const publishError = ref('');
const publishForm = ref({
    title: '',
    url: '',
    category: '入门',
    description: '',
    author: currentUser?.battleTag || currentUser?.email || ''
});

async function loadVideoCategories() {
    try {
        const res = await api.get('/tutorial/categories');
        videoCategories.value = res.data?.data || [];
    } catch (e) { videoCategories.value = []; }
}

async function loadTutorials(cat) {
    currentCat.value = cat;
    try {
        const res = await getTutorials(cat || undefined);
        const data = res.data;
        tutorials.value = Array.isArray(data) ? data : (data?.data || []);
    } catch (e) { tutorials.value = []; }
}

async function submitTutorial() {
    publishError.value = '';
    if (!publishForm.value.title.trim()) { publishError.value = '标题不能为空'; return; }
    if (!publishForm.value.url.trim()) { publishError.value = '视频链接不能为空'; return; }
    publishing.value = true;
    try {
        const res = await createTutorial({ ...publishForm.value });
        if (res.data.code === 200) {
            showPublishDialog.value = false;
            publishForm.value = { title: '', url: '', category: '入门', description: '', author: currentUser?.battleTag || currentUser?.email || '' };
            await loadTutorials(currentCat.value);
        } else {
            publishError.value = res.data.msg || '发布失败';
        }
    } catch (e) {
        publishError.value = e.message || '发布失败';
    } finally {
        publishing.value = false;
    }
}

// ---- COACHING ----
const coachingPosts = ref([]);
const coachingTab = ref('all');
const showCoachingForm = ref(false);
const coachSubmitting = ref(false);
const coachMsg = ref('');
const coachForm = ref({ title: '', postType: 'coach', race: '', mmr: null, priceInfo: '', contact: '', description: '' });

async function loadCoaching(type) {
    coachingTab.value = type;
    try {
        const res = await getCoachingPosts(type);
        coachingPosts.value = res.data?.data || [];
    } catch (e) { coachingPosts.value = []; }
}

async function submitCoaching() {
    if (!coachForm.value.title || !coachForm.value.description) {
        coachMsg.value = '请填写标题和描述';
        return;
    }
    coachSubmitting.value = true;
    coachMsg.value = '';
    try {
        const res = await createCoachingPost({ ...coachForm.value, userId: currentUser?.id });
        if (res.data.code === 200) {
            coachMsg.value = '发布成功！';
            showCoachingForm.value = false;
            coachForm.value = { title: '', postType: 'coach', race: '', mmr: null, priceInfo: '', contact: '', description: '' };
            await loadCoaching(coachingTab.value);
        } else {
            coachMsg.value = res.data.msg || '发布失败';
        }
    } catch (e) { coachMsg.value = e.response?.data?.msg || e.message || '发布失败，请稍后再试'; }
    finally { coachSubmitting.value = false; }
}

// ---- TEXT TUTORIAL ----
const textTutorials = ref([]);
const textCategories = ref([]);
const textCat = ref('');
const showTextForm = ref(false);
const textSubmitting = ref(false);
const textMsg = ref('');
const textForm = ref({ title: '', category: '', content: '' });
const expandedText = ref(null);

async function loadTextCategories() {
    try {
        const res = await getTextTutorialCategories();
        textCategories.value = res.data?.data || [];
    } catch (e) { textCategories.value = []; }
}

async function loadTextTutorials(cat) {
    textCat.value = cat;
    try {
        const res = await getTextTutorials(cat);
        textTutorials.value = res.data?.data || [];
    } catch (e) { textTutorials.value = []; }
}

async function submitTextTutorial() {
    if (!textForm.value.title || !textForm.value.content) {
        textMsg.value = '请填写标题和内容';
        return;
    }
    textSubmitting.value = true;
    textMsg.value = '';
    try {
        const res = await createTextTutorial({ ...textForm.value, userId: currentUser?.id });
        if (res.data.code === 200) {
            textMsg.value = '发布成功！';
            showTextForm.value = false;
            textForm.value = { title: '', category: '', content: '' };
            await loadTextTutorials(textCat.value);
            await loadTextCategories();
        } else {
            textMsg.value = res.data.msg || '发布失败';
        }
    } catch (e) { textMsg.value = e.response?.data?.msg || e.message || '发布失败，请稍后再试'; }
    finally { textSubmitting.value = false; }
}

// ---- REPLAY ----
const replays = ref([]);
const replayCat = ref('');
const replayCategories = ref([]);
const showReplayForm = ref(false);
const replaySubmitting = ref(false);
const replayMsg = ref('');
const replayForm = ref({ title: '', category: '', description: '', file: null });
const fileInputRef = ref(null);

function triggerFileInput() { fileInputRef.value?.click(); }
function handleFileSelect(e) { replayForm.value.file = e.target.files[0] || null; }
function handleDrop(e) { replayForm.value.file = e.dataTransfer.files[0] || null; }

async function loadReplays(cat) {
    replayCat.value = cat;
    try {
        const res = await getReplays(cat);
        const data = res.data?.data || [];
        replays.value = data;
        const cats = [...new Set(data.map(r => r.category).filter(Boolean))];
        if (!cat) replayCategories.value = cats;
    } catch (e) { replays.value = []; }
}

async function submitReplay() {
    if (!replayForm.value.title || !replayForm.value.file) {
        replayMsg.value = '请填写标题并选择文件';
        return;
    }
    const file = replayForm.value.file;
    if (!file.name.toLowerCase().endsWith('.sc2replay')) {
        replayMsg.value = '只支持 .SC2Replay 格式';
        return;
    }
    if (file.size > 20 * 1024 * 1024) {
        replayMsg.value = '文件不能超过20MB';
        return;
    }
    replaySubmitting.value = true;
    replayMsg.value = '';
    try {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('userId', String(currentUser?.id || ''));
        fd.append('title', replayForm.value.title);
        fd.append('description', replayForm.value.description || '');
        fd.append('category', replayForm.value.category || '');
        const res = await api.post('/replay', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        if (res.data.code === 200) {
            replayMsg.value = '上传成功！';
            showReplayForm.value = false;
            replayForm.value = { title: '', category: '', description: '', file: null };
            await loadReplays(replayCat.value);
        } else {
            replayMsg.value = res.data.msg || '上传失败';
        }
    } catch (e) { replayMsg.value = e.response?.data?.msg || '上传失败，请稍后再试'; }
    finally { replaySubmitting.value = false; }
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('zh-CN');
}

function formatSize(bytes) {
    if (!bytes) return '';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

onMounted(() => {
    loadTutorials('');
    loadVideoCategories();
    loadCoaching('all');
    loadTextTutorials('');
    loadTextCategories();
    loadReplays('');
});
</script>

<style scoped>
.tutorial-page {
    max-width: 1000px;
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

.section-tabs {
    display: flex;
    gap: 4px;
    margin-bottom: 24px;
    border-bottom: 1px solid var(--sc2-border);
    padding-bottom: 0;
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
.section-tabs button.active {
    color: var(--sc2-accent);
    border-bottom-color: var(--sc2-accent);
}

.cat-tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 24px;
    flex-wrap: wrap;
}

.cat-tabs button, .sub-tabs button {
    padding: 6px 16px;
    font-family: 'Rajdhani', sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: var(--sc2-text);
    background: transparent;
    border: 1px solid var(--sc2-border);
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.2s;
}

.cat-tabs button:hover, .sub-tabs button:hover,
.cat-tabs button.active, .sub-tabs button.active {
    background: var(--sc2-accent);
    color: var(--sc2-bg-deep);
    border-color: var(--sc2-accent);
}

.section-header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 12px;
}

.sub-tabs {
    display: flex;
    gap: 8px;
}

.add-btn {
    padding: 8px 18px;
    background: var(--sc2-accent);
    color: var(--sc2-bg-deep);
    border: none;
    border-radius: 6px;
    font-family: 'Rajdhani', sans-serif;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: opacity 0.2s;
}
.add-btn:hover { opacity: 0.85; }

.sc2-panel {
    background: linear-gradient(135deg, var(--sc2-bg-panel), var(--sc2-bg-dark));
    border: 1px solid var(--sc2-border);
    border-radius: 12px;
    padding: 24px;
    position: relative;
    overflow: hidden;
}

.sc2-panel::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--sc2-accent), transparent);
    opacity: 0.5;
}

.tutorial-list, .post-list, .replay-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.tutorial-card, .post-card, .text-card, .replay-card, .form-panel {
    margin-bottom: 0;
}

.card-header-row, .post-header, .text-header, .replay-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    flex-wrap: wrap;
    gap: 8px;
}

.card-title, .post-title {
    font-size: 17px;
    font-weight: 600;
    color: var(--sc2-text-bright);
}

.card-meta {
    display: flex;
    align-items: center;
    gap: 10px;
}

.card-author, .post-author {
    font-size: 13px;
    color: var(--sc2-text-dim);
    margin-left: 8px;
}

.post-author-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
    flex-wrap: wrap;
}

.card-desc, .post-desc {
    color: var(--sc2-text);
    font-size: 14px;
    line-height: 1.6;
}

.post-meta {
    display: flex;
    gap: 16px;
    margin-bottom: 10px;
    flex-wrap: wrap;
    font-size: 13px;
    color: var(--sc2-text-dim);
}

.post-contact {
    margin-top: 8px;
    font-size: 13px;
    color: var(--sc2-accent);
}

.post-time {
    font-size: 12px;
    color: var(--sc2-text-dim);
}

.cat-badge {
    padding: 2px 10px;
    background: rgba(0, 180, 216, 0.1);
    border: 1px solid rgba(0, 180, 216, 0.3);
    border-radius: 10px;
    font-size: 12px;
    color: var(--sc2-accent);
}

.type-badge {
    padding: 3px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
}
.badge-coach { background: rgba(0, 200, 100, 0.15); color: #00c864; border: 1px solid rgba(0, 200, 100, 0.3); }
.badge-find { background: rgba(255, 160, 0, 0.15); color: #ffa000; border: 1px solid rgba(255, 160, 0, 0.3); }

.sc2-btn-secondary {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    background: transparent;
    border: 1px solid var(--sc2-accent);
    color: var(--sc2-accent);
    border-radius: 6px;
    text-decoration: none;
    font-size: 13px;
    transition: all 0.2s;
}
.sc2-btn-secondary:hover {
    background: var(--sc2-accent);
    color: var(--sc2-bg-deep);
}

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
    transition: border-color 0.2s;
}
.wInput:focus { border-color: var(--sc2-accent); outline: none; }
.wSelect { cursor: pointer; }
.textarea-input { resize: vertical; min-height: 80px; }

.form-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
}

.form-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 12px;
}

.btn-submit {
    padding: 8px 24px;
    background: var(--sc2-accent);
    color: var(--sc2-bg-deep);
    border: none;
    border-radius: 6px;
    font-family: 'Orbitron', sans-serif;
    font-size: 12px;
    cursor: pointer;
    transition: opacity 0.2s;
}
.btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

.btn-cancel {
    padding: 8px 16px;
    background: transparent;
    color: var(--sc2-text-dim);
    border: 1px solid var(--sc2-border);
    border-radius: 6px;
    font-size: 13px;
    cursor: pointer;
}
.btn-cancel:hover { border-color: var(--sc2-accent); color: var(--sc2-accent); }

.msg { font-size: 13px; color: var(--sc2-accent); }

.error-msg {
    display: block;
    color: var(--sc2-danger, #ff4444);
    font-size: 13px;
    margin-bottom: 8px;
}

.file-upload-area {
    border: 2px dashed var(--sc2-border);
    border-radius: 8px;
    padding: 30px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    color: var(--sc2-text-dim);
    margin-bottom: 10px;
}
.file-upload-area:hover { border-color: var(--sc2-accent); color: var(--sc2-accent); }
.file-upload-area p { margin: 8px 0 0; }
.file-upload-area span { font-size: 13px; color: var(--sc2-accent); margin-top: 8px; display: block; }

.upload-hint {
    font-size: 12px;
    color: var(--sc2-text-dim);
    margin-bottom: 12px;
}

.download-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 10px;
    padding: 8px 16px;
    background: transparent;
    border: 1px solid var(--sc2-accent);
    color: var(--sc2-accent);
    border-radius: 6px;
    text-decoration: none;
    font-size: 13px;
    transition: all 0.2s;
}
.download-btn:hover { background: var(--sc2-accent); color: var(--sc2-bg-deep); }

.file-size {
    font-size: 12px;
    color: var(--sc2-text-dim);
    font-family: 'Share Tech Mono', monospace;
}

.text-content {
    color: var(--sc2-text);
    font-size: 14px;
    line-height: 1.7;
    white-space: pre-wrap;
    max-height: 120px;
    overflow: hidden;
    transition: max-height 0.3s ease;
}
.text-content.expanded { max-height: 5000px; }

.expand-btn {
    background: none;
    border: none;
    color: var(--sc2-accent);
    font-size: 13px;
    cursor: pointer;
    margin-top: 8px;
    padding: 0;
}

.empty-msg {
    color: var(--sc2-text-dim);
    text-align: center;
    padding: 40px;
    font-size: 14px;
}



@media (max-width: 768px) {
    .section-tabs { overflow-x: auto; }
    .form-row { grid-template-columns: 1fr; }
}
</style>
